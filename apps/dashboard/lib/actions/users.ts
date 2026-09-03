"use server";
import { revalidatePath } from "next/cache";
import { hash } from "@node-rs/argon2";
import { getDb, users, userVerticalAccess, eq, sql } from "@delead/db";
import { requireSuperAdmin } from "@/lib/authz";
import { writeAudit } from "@/lib/audit";
import { DB_VERTICAL_KEYS } from "@delead/brand/verticals";

const ARGON = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

function randomPassword() {
  return "DL-" + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
}

export async function createUser(input: { name: string; email: string; role: "staff" | "super_admin" }) {
  const session = await requireSuperAdmin();
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const [existing] = await db.select().from(users).where(sql`lower(${users.email}) = ${email}`).limit(1);
  if (existing) return { ok: false, error: "A user with that email already exists." };

  const tempPassword = randomPassword();
  const [u] = await db
    .insert(users)
    .values({
      name: input.name.trim(),
      email,
      passwordHash: await hash(tempPassword, ARGON),
      role: input.role,
      mustChangePassword: true,
    })
    .returning();
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "invite",
    entity: "users",
    entityId: u!.id,
  });
  revalidatePath("/users");
  return { ok: true, tempPassword };
}

export async function setUserAccess(input: {
  userId: string;
  grants: { vertical: string; level: "view" | "edit" }[];
}) {
  const session = await requireSuperAdmin();
  const db = getDb();
  const valid = input.grants.filter((g) => DB_VERTICAL_KEYS.includes(g.vertical));
  await db.delete(userVerticalAccess).where(eq(userVerticalAccess.userId, input.userId));
  if (valid.length) {
    await db.insert(userVerticalAccess).values(
      valid.map((g) => ({ userId: input.userId, vertical: g.vertical as never, level: g.level })),
    );
  }
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "access_change",
    entity: "users",
    entityId: input.userId,
    diff: { grants: valid },
  });
  revalidatePath("/users");
  return { ok: true };
}

export async function setUserActive(userId: string, isActive: boolean) {
  const session = await requireSuperAdmin();
  if (userId === session.user.id) return { ok: false, error: "You can't deactivate yourself." };
  const db = getDb();
  await db.update(users).set({ isActive }).where(eq(users.id, userId));
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: isActive ? "reactivate" : "deactivate",
    entity: "users",
    entityId: userId,
  });
  revalidatePath("/users");
  return { ok: true };
}

export async function resetUserPassword(userId: string) {
  const session = await requireSuperAdmin();
  const db = getDb();
  const tempPassword = randomPassword();
  await db
    .update(users)
    .set({ passwordHash: await hash(tempPassword, ARGON), mustChangePassword: true })
    .where(eq(users.id, userId));
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "reset_password",
    entity: "users",
    entityId: userId,
  });
  return { ok: true, tempPassword };
}

export async function changeOwnPassword(current: string, next: string) {
  const { auth } = await import("@/auth");
  const { verify } = await import("@node-rs/argon2");
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "not signed in" };
  if (next.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  const db = getDb();
  const [u] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!u || !(await verify(u.passwordHash, current).catch(() => false))) {
    return { ok: false, error: "Current password is wrong." };
  }
  await db
    .update(users)
    .set({ passwordHash: await hash(next, ARGON), mustChangePassword: false })
    .where(eq(users.id, session.user.id));
  return { ok: true };
}
