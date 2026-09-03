import { NextResponse, after } from "next/server";
import { getDb, tcBookings } from "@delead/db";

const FIELD_MAX = 200;
const REQUIRED = ["parentName", "studentName", "classGrade", "phone", "place"] as const;

/** Trim + hard length-cap a value from the request body. */
function field(v: unknown, max = FIELD_MAX): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    let payload: Record<string, unknown>;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
    }

    const clean = {
      parentName: field(payload.parentName),
      studentName: field(payload.studentName),
      classGrade: field(payload.classGrade, 40),
      phone: field(payload.phone, 40),
      place: field(payload.place),
    };

    if (REQUIRED.some((k) => !clean[k])) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields." },
        { status: 400 },
      );
    }

    // 1. store in Postgres (source of truth)
    const db = getDb();
    const [row] = await db.insert(tcBookings).values(clean).returning({ id: tcBookings.id });

    // 2. mirror to the Google Sheet (backup + notify) — never blocks the response
    const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL_TINKERCHAMPS;
    if (appsScriptUrl) {
      after(async () => {
        try {
          await fetch(appsScriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...clean, receivedAt: new Date().toISOString() }),
            signal: AbortSignal.timeout(8000),
          });
        } catch (err) {
          console.error("Apps Script mirror failed:", err);
        }
      });
    }

    return NextResponse.json({ success: true, bookingId: row?.id }, { status: 200 });
  } catch (error) {
    console.error("Booking submission API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
