import { VERTICALS } from "@delead/brand/verticals";

// Pure RBAC predicates — no `server-only`, no DB — so they're unit-testable.
// `authz.ts` re-exports these alongside the session/redirect machinery.

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
