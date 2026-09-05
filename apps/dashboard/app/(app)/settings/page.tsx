import { requireSuperAdmin } from "@/lib/authz";
import { getDb, publishState, pingLog, desc, sql } from "@delead/db";
import { verticalByKey, VERTICAL_LIST } from "@delead/brand/verticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { formatDateTime } from "@delead/shared/dates";

const SITE_URL_ENV: Record<string, string> = {
  deleadint: "SITE_URL_DELEADINT",
  walk2lead: "SITE_URL_WALK2LEAD",
  makerchamps: "SITE_URL_MAKERCHAMPS",
  corporate: "SITE_URL_CORPORATE",
  dli_education: "SITE_URL_DLI_EDUCATION",
};

const PROVIDER_LABEL: Record<string, string> = { supabase: "Supabase", r2: "Cloudflare R2" };

export default async function SystemSettings() {
  await requireSuperAdmin();
  const db = getDb();
  const [ps, ping] = await Promise.all([
    db.select().from(publishState),
    db.select().from(pingLog).orderBy(desc(pingLog.checkedAt)).limit(1),
  ]);
  // kept out of the Promise.all above and behind its own try/catch — this is
  // the one raw `sql` query on the page (vs. the builder queries elsewhere),
  // and mixing query styles concurrently on the same pooled connection was
  // the prime suspect for a hang that ended up wedging the whole dashboard
  // (see the connection-pool comment in packages/db/src/client.ts). If it
  // fails for any reason the page still renders, just without this one stat.
  let dbSize = "—";
  try {
    const [row] = await db.execute<{ size: string }>(
      sql`select pg_size_pretty(pg_database_size(current_database())) as size`,
    );
    if (row?.size) dbSize = row.size;
  } catch {
    /* non-critical */
  }
  // Postgres itself vs. Supabase Storage (uploaded images/files) are two
  // separate things — this sums the `bytes` every asset row already records
  // (set at upload time, see uploadAsset in lib/actions/content.ts), rather
  // than calling out to the Storage API, since every object we've ever put
  // there is already tracked here.
  let storageSize = "—";
  try {
    const [row] = await db.execute<{ size: string }>(
      sql`select pg_size_pretty(coalesce(sum(bytes), 0)::bigint) as size from assets`,
    );
    if (row?.size) storageSize = row.size;
  } catch {
    /* non-critical */
  }
  const lastPing = ping[0]?.checkedAt;
  const pingStale = !lastPing || Date.now() - new Date(lastPing).getTime() > 3.5 * 864e5;
  const revalidateSet = !!process.env.REVALIDATE_SECRET;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">System</h1>

      {pingStale && (
        <Alert variant="warning" title="Database check-in is overdue">
          Last checked in {lastPing ? formatDateTime(lastPing) : "never"}. The database can go
          to sleep after about a week without activity — if this keeps happening, let your
          developer know so they can check the automated check-in is still running.
        </Alert>
      )}
      {!revalidateSet && (
        <Alert variant="destructive" title="Publishing isn't fully set up">
          The dashboard can&apos;t reach the sites to publish changes instantly right now.
          Let your developer know — a setup step is missing on their end.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Database size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{dbSize}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Content &amp; records (Postgres) — not images/files
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{storageSize}</div>
            <p className="mt-1 text-xs text-muted-foreground">Uploaded images &amp; files</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last database check-in</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {ping[0] ? formatDateTime(ping[0].checkedAt) : "never"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Storage provider</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <Badge variant="secondary">
              {PROVIDER_LABEL[process.env.STORAGE_PROVIDER ?? "supabase"] ?? "Supabase"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="info">
            Sites also refresh their content on their own about once an hour. Clicking{" "}
            <span className="font-medium text-foreground">Publish to site</span> just skips the
            wait — your changes go live within a few seconds instead.
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
                        <Badge variant="success">Connected</Badge>
                      ) : (
                        <Badge variant="destructive">Not connected</Badge>
                      )}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {st?.dirtyCount ? `${st.dirtyCount} unpublished` : "up to date"}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {st?.lastPublishedAt ? formatDateTime(st.lastPublishedAt) : "—"}
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
