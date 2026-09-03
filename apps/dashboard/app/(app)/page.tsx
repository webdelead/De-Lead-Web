import Link from "next/link";
import type { CSSProperties } from "react";
import { getSession, visibleVerticals, isSuperAdmin } from "@/lib/authz";
import { getDb, leads, publishState, pingLog, sql, and, gte, inArray, desc } from "@delead/db";
import { verticalByKey } from "@delead/brand/verticals";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Activity, Database, Inbox, UploadCloud } from "lucide-react";

export default async function DashboardHome() {
  const session = await getSession();
  const db = getDb();
  const keys = visibleVerticals(session, "view");

  const since7 = new Date(Date.now() - 7 * 864e5);
  const since30 = new Date(Date.now() - 30 * 864e5);
  const inScope = inArray(leads.source, keys as never);

  const [last7, last30, recent, dirty, ping] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(leads).where(and(inScope, gte(leads.createdAt, since7))),
    db.select({ n: sql<number>`count(*)::int` }).from(leads).where(and(inScope, gte(leads.createdAt, since30))),
    db.select().from(leads).where(inScope).orderBy(desc(leads.createdAt)).limit(6),
    db.select().from(publishState).where(inArray(publishState.vertical, keys as never)),
    db.select().from(pingLog).orderBy(desc(pingLog.checkedAt)).limit(1),
  ]);

  const lastPing = ping[0]?.checkedAt;
  const pingStale = !lastPing || Date.now() - new Date(lastPing).getTime() > 3.5 * 864e5;
  const dirtyRows = dirty.filter((d) => d.dirtyCount > 0);
  const dirtyTotal = dirtyRows.reduce((n, d) => n + d.dirtyCount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {session.user.name?.split(" ")[0] ?? "Welcome"} — here&apos;s what&apos;s happening across
          your sites.
        </p>
      </div>

      {pingStale && (
        <Alert variant="warning" title="The database hasn't been pinged recently">
          It&apos;s been more than 3 days since the last keep-alive ping{" "}
          {lastPing ? `(${new Date(lastPing).toLocaleString()})` : "(never)"}. A free Supabase
          project pauses after ~7 days idle — check the GitHub Actions / Vercel cron so it keeps
          running.
        </Alert>
      )}

      {dirtyRows.length > 0 && (
        <Alert variant="info" title={`${dirtyTotal} unpublished change${dirtyTotal > 1 ? "s" : ""}`}>
          {dirtyRows.map((d) => verticalByKey(d.vertical)?.name).join(", ")}{" "}
          {dirtyRows.length > 1 ? "have" : "has"} edits that aren&apos;t live yet. Open the site&apos;s
          content pages and hit <span className="font-medium text-foreground">Publish to site</span>.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          title="New leads"
          sub="last 7 days"
          value={last7[0]?.n ?? 0}
          icon={<Inbox className="h-4 w-4" />}
          accent="var(--brand)"
        />
        <Stat
          title="New leads"
          sub="last 30 days"
          value={last30[0]?.n ?? 0}
          icon={<Activity className="h-4 w-4" />}
          accent="var(--accent-blue)"
        />
        <Stat
          title="Unpublished"
          sub={dirtyRows.length ? `${dirtyRows.length} site${dirtyRows.length > 1 ? "s" : ""}` : "all in sync"}
          value={dirtyTotal}
          icon={<UploadCloud className="h-4 w-4" />}
          accent="var(--accent-amber)"
        >
          {dirtyRows.length > 0 && (
            <div className="mt-3 space-y-1 text-xs">
              {dirtyRows.map((d) => (
                <div key={d.vertical} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{verticalByKey(d.vertical)?.name}</span>
                  <span className="font-medium">{d.dirtyCount}</span>
                </div>
              ))}
            </div>
          )}
        </Stat>
        <Stat
          title="Database"
          sub={lastPing ? new Date(lastPing).toLocaleDateString() : "never pinged"}
          value={pingStale ? "Stale" : "Healthy"}
          icon={<Database className="h-4 w-4" />}
          accent={pingStale ? "var(--destructive)" : "var(--accent-emerald)"}
        />
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold tracking-tight">Latest leads</h2>
          <Link href="/leads" className="text-sm font-medium text-primary hover:underline">
            View all &rarr;
          </Link>
        </div>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No leads yet. They&apos;ll show up here the moment a form is submitted.
            </p>
          ) : (
            <ul className="divide-y">
              {recent.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between px-6 py-3 text-sm transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-muted-foreground"> · {l.interest || "general enquiry"}</span>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="muted">{verticalByKey(l.source)?.shortName}</Badge>
                    {new Date(l.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {isSuperAdmin(session) && (
        <p className="text-xs text-muted-foreground">
          You&apos;re a super admin — every vertical is visible, and you can manage users under
          Admin.
        </p>
      )}
    </div>
  );
}

function Stat({
  title,
  sub,
  value,
  icon,
  accent,
  children,
}: {
  title: string;
  sub?: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  children?: React.ReactNode;
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
            style={{ background: `color-mix(in oklch, ${accent} 14%, transparent)`, color: accent }}
          >
            {icon}
          </span>
        </div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
        {children}
      </CardContent>
    </Card>
  );
}
