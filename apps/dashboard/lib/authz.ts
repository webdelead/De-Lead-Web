import "server-only";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import type { VerticalSlug } from "@delead/brand/verticals";
import { VERTICALS } from "@delead/brand/verticals";

export type Level = "view" | "edit";

/** db enum key ("dli_education") for a slug ("dli-education") */
export function dbKey(slug: VerticalSlug): string {
  return VERTICALS[slug].key;
}
export function slugFromDbKey(key: string): VerticalSlug | undefined {
  return (Object.values(VERTICALS).find((v) => v.key === key)?.slug) as VerticalSlug | undefined;
}

export async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export function isSuperAdmin(session: Session): boolean {
  return session.user.role === "super_admin";
}

/** verticals (db keys) the user can see at >= level */
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

/** Guard a page/action. Throws (via notFound-style redirect) when denied. */
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
