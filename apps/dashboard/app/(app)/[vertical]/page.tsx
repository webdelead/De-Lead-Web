import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { requireAccess } from "@/lib/authz";
import { verticalSections } from "@/lib/nav";
import { formatDate } from "@delead/shared/dates";
import {
  getDb,
  leads,
  tcBookings,
  publishState,
  sql,
  and,
  gte,
  eq,
  desc,
} from "@delead/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Inbox, Activity, UploadCloud } from "lucide-react";

const SINCE7 = () => new Date(Date.now() - 7 * 864e5);
const SINCE30 = () => new Date(Date.now() - 30 * 864e5);

export default async function VerticalOverview({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const v = VERTICALS[vertical as VerticalSlug];
  if (!v) notFound();
  await requireAccess(v.key, "view");

  const db = getDb();
  const takesBookings = v.content.includes("tc_bookings");

  // intake snapshot (bookings for TinkerChamps, leads for everyone else)
  let intakeLabel: string;
  let n7 = 0;
  let n30 = 0;
  let recent: { id: string; title: string; sub: string; date: Date }[] = [];
  let moreHref: string;

  if (takesBookings) {
    intakeLabel = "bookings";
    moreHref = `/${v.slug}/bookings`;
    const [a, b, rows] = await Promise.all([
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(tcBookings)
        .where(gte(tcBookings.createdAt, SINCE7())),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(tcBookings)
        .where(gte(tcBookings.createdAt, SINCE30())),
      db
        .select()
        .from(tcBookings)
        .orderBy(desc(tcBookings.createdAt))
        .limit(6),
    ]);
    n7 = a[0]?.n ?? 0;
    n30 = b[0]?.n ?? 0;
    recent = rows.map((r) => ({
      id: r.id,
      title: r.studentName || r.parentName || "Booking",
      sub: [r.classGrade && `Class ${r.classGrade}`, r.place].filter(Boolean).join(" · "),
      date: r.createdAt,
    }));
  } else {
    intakeLabel = "leads";
    moreHref = `/${v.slug}/leads`;
    const scope = eq(leads.source, v.key as never);
    const [a, b, rows] = await Promise.all([
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(leads)
        .where(and(scope, gte(leads.createdAt, SINCE7()))),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(leads)
        .where(and(scope, gte(leads.createdAt, SINCE30()))),
      db.select().from(leads).where(scope).orderBy(desc(leads.createdAt)).limit(6),
    ]);
    n7 = a[0]?.n ?? 0;
    n30 = b[0]?.n ?? 0;
    recent = rows.map((r) => ({
      id: r.id,
      title: r.name,
      sub: r.interest || "general enquiry",
      date: r.createdAt,
    }));
  }

  const [pub] = await db
    .select()
    .from(publishState)
    .where(eq(publishState.vertical, v.key as never))
    .limit(1);
  const dirty = pub?.dirtyCount ?? 0;

  const manage = verticalSections(v.key).filter((s) => s.href !== `/${v.slug}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{v.name}</h1>
          <a
            href={v.host}
            target="_blank"
            rel="noopener"
            className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            {v.host.replace(/^https?:\/\//, "")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          title={`New ${intakeLabel}`}
          sub="last 7 days"
          value={n7}
          icon={<Inbox className="h-4 w-4" />}
          accent="var(--brand)"
        />
        <Stat
          title={`New ${intakeLabel}`}
          sub="last 30 days"
          value={n30}
          icon={<Activity className="h-4 w-4" />}
          accent="var(--accent-blue)"
        />
        <Stat
          title="Unpublished"
          sub={dirty ? "changes waiting" : "all in sync"}
          value={dirty}
          icon={<UploadCloud className="h-4 w-4" />}
          accent="var(--accent-amber)"
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Manage
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {manage.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="card-hover rounded-lg border bg-background px-4 py-3.5 text-sm font-medium transition-colors hover:bg-muted/40"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold tracking-tight">Latest {intakeLabel}</h2>
          <Link href={moreHref} className="text-sm font-medium text-primary hover:underline">
            View all &rarr;
          </Link>
        </div>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No {intakeLabel} yet.
            </p>
          ) : (
            <ul className="divide-y">
              {recent.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between px-6 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <span className="font-medium">{r.title}</span>
                    {r.sub && <span className="text-muted-foreground"> · {r.sub}</span>}
                  </div>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  title,
  sub,
  value,
  icon,
  accent,
}: {
  title: string;
  sub?: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Card
      className="stat-card card-hover border"
      style={{ "--stat-accent": accent } as CSSProperties}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{
              background: `color-mix(in oklch, ${accent} 14%, transparent)`,
              color: accent,
            }}
          >
            {icon}
          </span>
        </div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}
