import { notFound } from "next/navigation";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { requireAccess } from "@/lib/authz";
import { getDb, tcBookings, desc, ilike, or } from "@delead/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ vertical: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { vertical } = await params;
  const sp = await searchParams;
  const v = VERTICALS[vertical as VerticalSlug];
  if (!v || v.key !== "tinkerchamps") notFound();
  await requireAccess("tinkerchamps", "view");

  const db = getDb();
  const where = sp.q
    ? or(
        ilike(tcBookings.studentName, `%${sp.q}%`),
        ilike(tcBookings.parentName, `%${sp.q}%`),
        ilike(tcBookings.phone, `%${sp.q}%`),
        ilike(tcBookings.place, `%${sp.q}%`),
      )
    : undefined;

  const rows = await db
    .select()
    .from(tcBookings)
    .where(where)
    .orderBy(desc(tcBookings.createdAt))
    .limit(1000);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">TinkerChamps — read-only</p>
        </div>
        <a href="/api/export/bookings">
          <button className="rounded-md border px-3 py-1.5 text-sm">Export CSV</button>
        </a>
      </div>
      <form>
        <input
          name="q"
          defaultValue={sp.q}
          placeholder="Search parent, student, phone, location…"
          className="h-9 w-full max-w-sm rounded-md border px-3 text-sm"
        />
      </form>
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No bookings.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{b.parentName}</TableCell>
                  <TableCell>{b.studentName}</TableCell>
                  <TableCell>{b.classGrade}</TableCell>
                  <TableCell className="text-muted-foreground">{b.phone}</TableCell>
                  <TableCell>{b.place}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
