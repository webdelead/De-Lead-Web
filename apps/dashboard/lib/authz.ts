import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getDb, users, userVerticalAccess, eq } from "@delead/db";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";

export type Level = "view" | "edit";
export type Grant = { vertical: string; level: Level };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "staff";
  grants: Grant[];
}
export interface Session {
  user: SessionUser;
}

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

export function isSuperAdmin(session: Session): boolean {
  return session.user.role === "super_admin";
}

export function visibleVerticals(session: Session, level: Level = "view"): string[] {
  if (isSuperAdmin(session)) return Object.values(VERTICALS).map((v) => v.key);
  return session.user.grants
    .filter((g) => (level === "view" ? true : g.level === "edit"))
    .map((g) => g.vertical);
}

export function canAccess(session: Session, verticalDbKey: string, level: Level = "view"): boolean {
  if (isSuperAdmin(session)) return true;
  const g = session.user.grants.find((x) => x.vertical === verticalDbKey);
  if (!g) return false;
  return level === "view" ? true : g.level === "edit";
}

export async function requireAccess(verticalDbKey: string, level: Level = "view"): Promise<Session> {
  const session = await getSession();
  if (!canAccess(session, verticalDbKey, level)) redirect("/403");
  return session;
}

export async function requireSuperAdmin(): Promise<Session> {
  const session = await getSession();
  if (!isSuperAdmin(session)) redirect("/403");
  return session;
}
