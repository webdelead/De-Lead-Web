import { requireSuperAdmin } from "@/lib/authz";
import { getDb, publishState, pingLog, desc, sql } from "@delead/db";
import { verticalByKey, VERTICAL_LIST } from "@delead/brand/verticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HOOK_ENV: Record<string, string> = {
  deleadint: "DEPLOY_HOOK_DELEADINT",
  walk2lead: "DEPLOY_HOOK_WALK2LEAD",
  makerchamps: "DEPLOY_HOOK_MAKERCHAMPS",
  corporate: "DEPLOY_HOOK_CORPORATE",
  dli_education: "DEPLOY_HOOK_DLI_EDUCATION",
};

export default async function SystemSettings() {
  await requireSuperAdmin();
  const db = getDb();
  const [ps, ping, [{ size }]] = await Promise.all([
    db.select().from(publishState),
    db.select().from(pingLog).orderBy(desc(pingLog.checkedAt)).limit(1),
    db.execute<{ size: string }>(sql`select pg_size_pretty(pg_database_size(current_database())) as size`),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">System</h1>

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
          <CardTitle>Deploy hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              {VERTICAL_LIST.filter((v) => HOOK_ENV[v.key]).map((v) => {
                const set = !!process.env[HOOK_ENV[v.key]!];
                const st = ps.find((p) => p.vertical === v.key);
                return (
                  <tr key={v.key} className="border-b last:border-0">
                    <td className="py-2">{v.name}</td>
                    <td className="py-2">
                      {set ? <Badge variant="success">hook set</Badge> : <Badge variant="muted">no hook</Badge>}
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
