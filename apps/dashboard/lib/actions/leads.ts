"use server";
import { getDb, leads, eq } from "@delead/db";
import { getSession, canAccess } from "@/lib/authz";
import { writeAudit } from "@/lib/audit";

export async function deleteLead(id: string) {
  const session = await getSession();
  const db = getDb();
  const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!row) throw new Error("not found");
  // a lead's own `source` column is its vertical — no separate lookup needed
  if (!canAccess(session, row.source, "edit")) throw new Error("forbidden");

  await db.delete(leads).where(eq(leads.id, id));
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "delete",
    entity: "leads",
    entityId: id,
    vertical: row.source,
    diff: { name: row.name, email: row.email, phone: row.phone },
  });
  return { ok: true };
}
