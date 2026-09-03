import Link from "next/link";
import { getSession, visibleVerticals, isSuperAdmin } from "@/lib/authz";
import { getDb, leads, publishState, pingLog, sql, and, gte, inArray, desc } from "@delead/db";
import { verticalByKey } from "@delead/brand/verticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="New leads · 7 days" value={last7[0]?.n ?? 0} />
        <Stat title="New leads · 30 days" value={last30[0]?.n ?? 0} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Unpublished changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {dirtyRows.length === 0 ? (
              <span className="text-muted-foreground">All sites up to date</span>
            ) : (
              dirtyRows.map((d) => (
                <div key={d.vertical} className="flex justify-between">
                  <span>{verticalByKey(d.vertical)?.name}</span>
                  <Badge variant="secondary">{d.dirtyCount}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Database keep-alive</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {pingStale ? <Badge variant="destructive">stale</Badge> : <Badge variant="success">ok</Badge>}
            <div className="mt-1 text-xs text-muted-foreground">
              {lastPing ? new Date(lastPing).toLocaleString() : "never"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest leads</CardTitle>
          <Link href="/leads" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <ul className="divide-y text-sm">
              {recent.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2">
                  <div>
                    <span className="font-medium">{l.name}</span>{" "}
                    <span className="text-muted-foreground">· {l.interest || "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
          You are a super admin — you can see every vertical and manage users under Admin.
        </p>
      )}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
