import { requireSuperAdmin } from "@/lib/authz";
import { getDb, publishState, pingLog, desc, sql } from "@delead/db";
import { verticalByKey, VERTICAL_LIST } from "@delead/brand/verticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

const SITE_URL_ENV: Record<string, string> = {
  deleadint: "SITE_URL_DELEADINT",
  walk2lead: "SITE_URL_WALK2LEAD",
  makerchamps: "SITE_URL_MAKERCHAMPS",
  corporate: "SITE_URL_CORPORATE",
  dli_education: "SITE_URL_DLI_EDUCATION",
};

export default async function SystemSettings() {
  await requireSuperAdmin();
  const db = getDb();
  const [ps, ping, [{ size }]] = await Promise.all([
    db.select().from(publishState),
    db.select().from(pingLog).orderBy(desc(pingLog.checkedAt)).limit(1),
    db.execute<{ size: string }>(sql`select pg_size_pretty(pg_database_size(current_database())) as size`),
  ]);
  const lastPing = ping[0]?.checkedAt;
  const pingStale = !lastPing || Date.now() - new Date(lastPing).getTime() > 3.5 * 864e5;
  const revalidateSet = !!process.env.REVALIDATE_SECRET;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">System</h1>

      {pingStale && (
        <Alert variant="warning" title="Keep-alive ping is overdue">
          Last ping {lastPing ? new Date(lastPing).toLocaleString() : "never"}. Free Supabase
          projects pause after ~7 idle days — verify the ping cron is running.
        </Alert>
      )}
      {!revalidateSet && (
        <Alert variant="destructive" title="REVALIDATE_SECRET is not set">
          The dashboard can&apos;t reach the sites to publish. Set the same{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">REVALIDATE_SECRET</code> on this
          app and every marketing site.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Database size</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{size}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last keep-alive ping</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {ping[0] ? new Date(ping[0].checkedAt).toLocaleString() : "never"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage provider</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <Badge variant="secondary">{process.env.STORAGE_PROVIDER ?? "supabase"}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="info">
            Publishing uses on-demand revalidation — the dashboard calls each site&apos;s{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/revalidate</code> and the
            change is live in seconds, no rebuild. (The old Cloudflare build hooks are retired.)
          </Alert>
          <table className="w-full text-sm">
            <tbody>
              {VERTICAL_LIST.filter((v) => SITE_URL_ENV[v.key]).map((v) => {
                const url = process.env[SITE_URL_ENV[v.key]!];
                const st = ps.find((p) => p.vertical === v.key);
                return (
                  <tr key={v.key} className="border-b last:border-0">
                    <td className="py-2">{v.name}</td>
                    <td className="py-2">
                      {url ? (
                        <Badge variant="success">reachable</Badge>
                      ) : (
                        <Badge variant="destructive">no SITE_URL</Badge>
                      )}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {st?.dirtyCount ? `${st.dirtyCount} unpublished` : "up to date"}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {st?.lastPublishedAt ? new Date(st.lastPublishedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
