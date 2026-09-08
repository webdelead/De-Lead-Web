import { NextResponse, after } from "next/server";
import { getDb, tcBookings, outbox, flushOutbox, sql } from "@delead/db";
import { verifyTurnstile } from "@delead/shared/turnstile";
import { clientIp, ipHashOf } from "@delead/shared/request-ip";
import { formatDateTime } from "@delead/shared/dates";

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

    const ip = clientIp(req);
    const ipHash = ipHashOf(ip);

    if (!(await verifyTurnstile(field(payload.turnstileToken, 4000), ip))) {
      return NextResponse.json({ success: false, error: "Challenge failed." }, { status: 403, headers });
    }

    const db = getDb();

    // Rate-limit by trusted IP: max 5 bookings / 10 min. Over the limit → drop
    // silently (return success; the TC modal never reads the response anyway).
    // ip_hash is persisted in `meta` so this needs no schema column.
    if (ipHash) {
      const [{ recent }] = await db
        .select({
          recent: sql<number>`count(*) filter (where ${tcBookings.createdAt} > now() - interval '10 minutes')::int`,
        })
        .from(tcBookings)
        .where(
          sql`${tcBookings.meta}->>'ip_hash' = ${ipHash} and ${tcBookings.createdAt} > now() - interval '10 minutes'`,
        );
      if (recent >= 5) {
        return NextResponse.json({ success: true }, { status: 200, headers });
      }
    }

    const values = { ...clean, meta: ipHash ? { ip_hash: ipHash } : {} };
    const appsScriptUrl = process.env.APPS_SCRIPT_URL_TINKERCHAMPS;
    const receivedAt = new Date();
    // receivedAt: machine-readable UTC (ISO 8601, ...Z). receivedAtIst: the same
    // instant as a human string in India Standard Time, for the Google Sheet.
    const mirrorPayload = {
      ...clean,
      receivedAt: receivedAt.toISOString(),
      receivedAtIst: formatDateTime(receivedAt),
    };

    let bookingId: string | undefined;
    try {
      bookingId = await db.transaction(async (tx) => {
        const [r] = await tx.insert(tcBookings).values(values).returning({ id: tcBookings.id });
        if (appsScriptUrl) {
          await tx
            .insert(outbox)
            .values({ kind: "booking", targetUrl: appsScriptUrl, payload: mirrorPayload });
        }
        return r?.id;
      });
    } catch (e) {
      console.error("booking transaction failed, falling back to plain insert:", e);
      const [r] = await db.insert(tcBookings).values(values).returning({ id: tcBookings.id });
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
