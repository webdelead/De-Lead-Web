import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getDb, users, userVerticalAccess, eq } from "@delead/db";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { canAccess, isSuperAdmin } from "@/lib/rbac";

export type { Level, Grant, SessionUser, Session } from "@/lib/rbac";
export { canAccess, isSuperAdmin, visibleVerticals } from "@/lib/rbac";
import type { Grant, Session } from "@/lib/rbac";

const LOGIN_STAMP_EVERY_MS = 60 * 60 * 1000; // don't write more than hourly per user

export function dbKey(slug: VerticalSlug): string {
  return VERTICALS[slug].key;
}
export function slugFromDbKey(key: string): VerticalSlug | undefined {
  return Object.values(VERTICALS).find((v) => v.key === key)?.slug as VerticalSlug | undefined;
}

/** Current signed-in user + profile + grants. Redirects to /login if not authed
 *  or the profile is missing / deactivated. */
export async function getSession(): Promise<Session> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const [profile] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!profile || !profile.isActive) {
    await supabase.auth.signOut();
    redirect("/login?error=no-access");
  }

  // throttled last-seen stamp (so "Last login" in Users is meaningful)
  const last = profile.lastLoginAt?.getTime() ?? 0;
  if (Date.now() - last > LOGIN_STAMP_EVERY_MS) {
    try {
      await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
    } catch {
      /* non-critical */
    }
  }

  const grants =
    profile.role === "super_admin"
      ? []
      : ((await db
          .select({ vertical: userVerticalAccess.vertical, level: userVerticalAccess.level })
          .from(userVerticalAccess)
          .where(eq(userVerticalAccess.userId, user.id))) as Grant[]);

  return {
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      grants,
    },
  };
}

/** Non-redirecting variant for API routes. */
export async function getOptionalSession(): Promise<Session | null> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const db = getDb();
  const [profile] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (!profile || !profile.isActive) return null;
  const grants =
    profile.role === "super_admin"
      ? []
      : ((await db
          .select({ vertical: userVerticalAccess.vertical, level: userVerticalAccess.level })
          .from(userVerticalAccess)
          .where(eq(userVerticalAccess.userId, user.id))) as Grant[]);
  return {
    user: { id: profile.id, email: profile.email, name: profile.name, role: profile.role, grants },
  };
}

export async function requireAccess(
  verticalDbKey: string,
  level: "view" | "edit" = "view",
): Promise<Session> {
  const session = await getSession();
  if (!canAccess(session, verticalDbKey, level)) redirect("/403");
  return session;
}

export async function requireSuperAdmin(): Promise<Session> {
  const session = await getSession();
  if (!isSuperAdmin(session)) redirect("/403");
  return session;
}
