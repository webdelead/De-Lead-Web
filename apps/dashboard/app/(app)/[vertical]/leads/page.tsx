import { notFound } from "next/navigation";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { requireAccess, canAccess } from "@/lib/authz";
import { getDb, leads, and, or, ilike, eq, desc, sql } from "@delead/db";
import { interestLabel } from "@/lib/lead-fields";
import { LeadsView } from "@/components/leads-view";

const PAGE = 50;

/** Leads scoped to one vertical — linked from that vertical's sidebar group.
 *  Same screen as /leads, minus the Site column, with the free-text column
 *  labelled per site (e.g. "Class" for MakerChamps). */
export default async function VerticalLeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ vertical: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { vertical } = await params;
  const v = VERTICALS[vertical as VerticalSlug];
  // no such vertical, or its site collects bookings not leads (TinkerChamps)
  if (!v || v.content.includes("tc_bookings")) notFound();
  const session = await requireAccess(v.key, "view");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const db = getDb();

  const filters = [eq(leads.source, v.key as never)];
  if (sp.q) {
    const q = `%${sp.q}%`;
    filters.push(
      or(
        ilike(leads.name, q),
        ilike(leads.email, q),
        ilike(leads.phone, q),
        ilike(leads.message, q),
      )!,
    );
  }
  const where = and(...filters);

  const [rows, [{ n }]] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(PAGE)
      .offset((page - 1) * PAGE),
    db.select({ n: sql<number>`count(*)::int` }).from(leads).where(where),
  ]);

  return (
    <LeadsView
      rows={rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        sourceName: v.name,
      }))}
      total={n}
      page={page}
      pageSize={PAGE}
      q={sp.q ?? ""}
      v={v.key}
      verticalOptions={[]}
      showVerticalFilter={false}
      basePath={`/${v.slug}/leads`}
      title={`${v.name} — Leads`}
      interestLabel={interestLabel(v.key)}
      hideSite
      editableVerticals={canAccess(session, v.key, "edit") ? [v.key] : []}
    />
  );
}
