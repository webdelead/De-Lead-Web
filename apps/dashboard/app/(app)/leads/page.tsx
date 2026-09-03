import { getSession, visibleVerticals, isSuperAdmin } from "@/lib/authz";
import { getDb, leads, and, or, ilike, inArray, desc, eq, sql } from "@delead/db";
import { verticalByKey, VERTICAL_LIST } from "@delead/brand/verticals";
import { LeadsView } from "@/components/leads-view";

const PAGE = 50;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; v?: string; page?: string }>;
}) {
  const session = await getSession();
  const sp = await searchParams;
  const db = getDb();
  const allowed = visibleVerticals(session, "view");
  const page = Math.max(1, Number(sp.page ?? "1"));

  const filters = [inArray(leads.source, allowed as never)];
  if (sp.v && allowed.includes(sp.v)) filters.push(eq(leads.source, sp.v as never));
  if (sp.q) {
    const q = `%${sp.q}%`;
    filters.push(
      or(ilike(leads.name, q), ilike(leads.email, q), ilike(leads.phone, q), ilike(leads.message, q))!,
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

  const verticalOptions = isSuperAdmin(session)
    ? VERTICAL_LIST.map((v) => ({ key: v.key, name: v.name }))
    : VERTICAL_LIST.filter((v) => allowed.includes(v.key)).map((v) => ({ key: v.key, name: v.name }));

  return (
    <LeadsView
      rows={rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        sourceName: verticalByKey(r.source)?.name ?? r.source,
      }))}
      total={n}
      page={page}
      pageSize={PAGE}
      q={sp.q ?? ""}
      v={sp.v ?? ""}
      verticalOptions={verticalOptions}
      showVerticalFilter={verticalOptions.length > 1}
    />
  );
}
