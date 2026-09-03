import { NextResponse, after } from "next/server";
import { createDb, tcBookings } from "@delead/db";

const { db } = createDb(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.studentName || !payload.email || !payload.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields (studentName, email, phone)" },
        { status: 400 },
      );
    }

    // 1. store in Postgres (source of truth)
    const [row] = await db
      .insert(tcBookings)
      .values({
        studentName: payload.studentName,
        studentAge: String(payload.studentAge ?? ""),
        classGrade: payload.classGrade ?? "",
        gender: payload.gender ?? "",
        school: payload.school ?? "",
        district: payload.district ?? "",
        place: payload.place ?? "",
        parentName: payload.parentName ?? "",
        email: payload.email,
        phone: payload.phone,
        selectedProgram: payload.selectedProgram ?? "",
      })
      .returning({ id: tcBookings.id });

    // 2. mirror to the Google Sheet (backup + notify) — never blocks the response
    const appsScriptUrl =
      process.env.APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL_TINKERCHAMPS;
    if (appsScriptUrl) {
      after(async () => {
        try {
          await fetch(appsScriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000),
          });
        } catch (err) {
          console.error("Apps Script mirror failed:", err);
        }
      });
    }

    return NextResponse.json({ success: true, bookingId: row?.id }, { status: 200 });
  } catch (error: any) {
    console.error("Booking submission API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message ?? "Internal Server Error" },
      { status: 500 },
    );
  }
}
