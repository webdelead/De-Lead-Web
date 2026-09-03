"use server";
import { revalidatePath } from "next/cache";
import { getDb, users, userVerticalAccess, eq, sql } from "@delead/db";
import { requireSuperAdmin } from "@/lib/authz";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit";
import { DB_VERTICAL_KEYS } from "@delead/brand/verticals";

const SITE = process.env.SITE_URL_DASHBOARD || "http://localhost:3100";

/** Invite: creates the Supabase Auth user + profile row and emails them a
 *  set-password link. */
export async function inviteUser(input: {
  name: string;
  email: string;
  role: "staff" | "super_admin";
}) {
  const session = await requireSuperAdmin();
  const email = input.email.trim().toLowerCase();
  const db = getDb();

  const [existing] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1);
  if (existing) return { ok: false, error: "A user with that email already exists." };

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${SITE}/auth/callback?next=/reset-password`,
    data: { name: input.name.trim() },
  });
  if (error || !data.user) return { ok: false, error: error?.message ?? "Invite failed." };

  await db
    .insert(users)
    .values({
      id: data.user.id,
      email,
      name: input.name.trim(),
      role: input.role,
      isActive: true,
    })
    .onConflictDoUpdate({ target: users.id, set: { name: input.name.trim(), role: input.role } });

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "invite",
    entity: "users",
    entityId: data.user.id,
  });
  revalidatePath("/users");
  return { ok: true };
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
    userEmail: session.user.email,
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
  // also block/unblock the auth user so tokens stop working immediately
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: isActive ? "none" : "876000h",
  });
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: isActive ? "reactivate" : "deactivate",
    entity: "users",
    entityId: userId,
  });
  revalidatePath("/users");
  return { ok: true };
}

/** Send the user a password-reset email. */
export async function sendUserReset(userId: string) {
  await requireSuperAdmin();
  const db = getDb();
  const [u] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!u) return { ok: false, error: "User not found." };
  const { error } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email: u.email,
    options: { redirectTo: `${SITE}/reset-password` },
  });
  // generateLink both creates the link and (for recovery) triggers the email
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
