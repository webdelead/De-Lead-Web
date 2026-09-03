import { requireSuperAdmin } from "@/lib/authz";
import { getDb, users, userVerticalAccess, desc } from "@delead/db";
import { VERTICAL_LIST } from "@delead/brand/verticals";
import { UsersView } from "@/components/users-view";

export default async function UsersPage() {
  await requireSuperAdmin();
  const db = getDb();
  const [list, grants] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    db.select().from(userVerticalAccess),
  ]);

  const byUser: Record<string, { vertical: string; level: "view" | "edit" }[]> = {};
  for (const g of grants) {
    (byUser[g.userId] ??= []).push({ vertical: g.vertical, level: g.level });
  }

  return (
    <UsersView
      users={list.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
        grants: byUser[u.id] ?? [],
      }))}
      verticals={VERTICAL_LIST.map((v) => ({ key: v.key, name: v.name }))}
    />
  );
}
