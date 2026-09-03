import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/authz";
import { visibleVerticals } from "@/lib/authz";
import { getDb, leads, and, or, ilike, inArray, eq, desc } from "@delead/db";
import { verticalByKey } from "@delead/brand/verticals";
import { toCsv } from "@/lib/csv";

export async function GET(req: Request) {
  const session = await getOptionalSession();
  if (!session?.user?.id) return new NextResponse("unauthorized", { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const v = url.searchParams.get("v");
  const allowed = visibleVerticals(session, "view");

  const filters = [inArray(leads.source, allowed as never)];
  if (v && allowed.includes(v)) filters.push(eq(leads.source, v as never));
  if (q) {
    const like = `%${q}%`;
    filters.push(
      or(ilike(leads.name, like), ilike(leads.email, like), ilike(leads.phone, like))!,
    );
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(leads)
    .where(and(...filters))
    .orderBy(desc(leads.createdAt))
    .limit(5000);

  const csv = toCsv(
    rows.map((r) => ({
      date: r.createdAt.toISOString(),
      site: verticalByKey(r.source)?.name ?? r.source,
      name: r.name,
      email: r.email ?? "",
      phone: r.phone ?? "",
      interest: r.interest ?? "",
      message: r.message ?? "",
      page: r.pagePath ?? "",
    })),
    ["date", "site", "name", "email", "phone", "interest", "message", "page"],
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
