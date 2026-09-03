import { NextResponse } from "next/server";
import { getOptionalSession, canAccess } from "@/lib/authz";
import { getDb, tcBookings, desc } from "@delead/db";
import { streamCsv } from "@/lib/csv-stream";

const COLUMNS = ["date", "parent", "student", "class", "phone", "location"];

export async function GET() {
  const session = await getOptionalSession();
  if (!session?.user?.id || !canAccess(session, "tinkerchamps", "view")) {
    return new NextResponse("forbidden", { status: 403 });
  }
  const db = getDb();

  return streamCsv({
    filename: `tc-bookings-${new Date().toISOString().slice(0, 10)}.csv`,
    columns: COLUMNS,
    async fetchPage(offset, limit) {
      const rows = await db
        .select()
        .from(tcBookings)
        .orderBy(desc(tcBookings.createdAt))
        .limit(limit)
        .offset(offset);
      return rows.map((b) => ({
        date: b.createdAt.toISOString(),
        parent: b.parentName,
        student: b.studentName,
        class: b.classGrade,
        phone: b.phone,
        location: b.place,
      }));
    },
  });
}
