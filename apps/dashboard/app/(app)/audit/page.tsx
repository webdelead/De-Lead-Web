import { requireSuperAdmin } from "@/lib/authz";
import { getDb, auditLog, desc } from "@delead/db";
import { verticalByKey } from "@delead/brand/verticals";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireSuperAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? "1"));
  const db = getDb();
  const rows = await db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(100)
    .offset((page - 1) * 100);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Who</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Vertical</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{r.userEmail ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{r.action}</Badge>
                </TableCell>
                <TableCell>
                  {r.entity}
                  {r.entityId ? <span className="text-muted-foreground"> · {r.entityId.slice(0, 8)}</span> : null}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.vertical ? verticalByKey(r.vertical)?.shortName : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between text-sm">
        <a href={`/audit?page=${Math.max(1, page - 1)}`} className="text-primary hover:underline">
          ← Newer
        </a>
        <span className="text-muted-foreground">Page {page}</span>
        <a href={`/audit?page=${page + 1}`} className="text-primary hover:underline">
          Older →
        </a>
      </div>
    </div>
  );
}
