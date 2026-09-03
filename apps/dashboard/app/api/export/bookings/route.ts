import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccess } from "@/lib/authz";
import { getDb, tcBookings, desc } from "@delead/db";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !canAccess(session, "tinkerchamps", "view")) {
    return new NextResponse("forbidden", { status: 403 });
  }
  const db = getDb();
  const rows = await db.select().from(tcBookings).orderBy(desc(tcBookings.createdAt)).limit(10000);
  const csv = toCsv(
    rows.map((b) => ({
      date: b.createdAt.toISOString(),
      student: b.studentName,
      age: b.studentAge,
      class: b.classGrade,
      gender: b.gender,
      school: b.school,
      district: b.district,
      place: b.place,
      parent: b.parentName,
      email: b.email,
      phone: b.phone,
      program: b.selectedProgram,
    })),
  );
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tc-bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
