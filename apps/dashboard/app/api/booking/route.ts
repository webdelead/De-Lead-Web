import { NextResponse, after } from "next/server";
import { getDb, tcBookings, outbox, flushOutbox } from "@delead/db";
import { verifyTurnstile } from "@delead/shared/turnstile";

// Public write endpoint for the TinkerChamps booking form. Same model as
// /api/lead: the site POSTs here (cross-origin), the dashboard owns the DB write
// + the Google-Sheet mirror (via the outbox). TC no longer talks to the DB or
// Apps Script directly for bookings.

const TC_ORIGIN = process.env.SITE_URL_TINKERCHAMPS ?? "";
const FIELD_MAX = 200;
const REQUIRED = ["parentName", "studentName", "classGrade", "phone", "place"] as const;

function field(v: unknown, max = FIELD_MAX): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function cors(origin: string | null) {
  const allow = origin && origin === TC_ORIGIN ? origin : TC_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function POST(req: Request) {
  const headers = cors(req.headers.get("origin"));
  try {
    let payload: Record<string, unknown>;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400, headers });
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
        { status: 400, headers },
      );
    }

    if (!(await verifyTurnstile(field(payload.turnstileToken, 4000)))) {
      return NextResponse.json({ success: false, error: "Challenge failed." }, { status: 403, headers });
    }

    const db = getDb();
    const appsScriptUrl = process.env.APPS_SCRIPT_URL_TINKERCHAMPS;
    const mirrorPayload = { ...clean, receivedAt: new Date().toISOString() };

    let bookingId: string | undefined;
    try {
      bookingId = await db.transaction(async (tx) => {
        const [r] = await tx.insert(tcBookings).values(clean).returning({ id: tcBookings.id });
        if (appsScriptUrl) {
          await tx
            .insert(outbox)
            .values({ kind: "booking", targetUrl: appsScriptUrl, payload: mirrorPayload });
        }
        return r?.id;
      });
    } catch (e) {
      console.error("booking transaction failed, falling back to plain insert:", e);
      const [r] = await db.insert(tcBookings).values(clean).returning({ id: tcBookings.id });
      bookingId = r?.id;
      if (appsScriptUrl) {
        after(() =>
          fetch(appsScriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mirrorPayload),
            signal: AbortSignal.timeout(8000),
          }).catch(() => {}),
        );
      }
      return NextResponse.json({ success: true, bookingId }, { status: 200, headers });
    }

    if (appsScriptUrl) after(() => flushOutbox(db, { limit: 5 }).catch(() => {}));
    return NextResponse.json({ success: true, bookingId }, { status: 200, headers });
  } catch (error) {
    console.error("Booking submission API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500, headers });
  }
}
