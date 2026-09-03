import { NextResponse, after } from "next/server";
import { getDb, tcBookings, outbox, flushOutbox } from "@delead/db";

const FIELD_MAX = 200;
const REQUIRED = ["parentName", "studentName", "classGrade", "phone", "place"] as const;

/** Trim + hard length-cap a value from the request body. */
function field(v: unknown, max = FIELD_MAX): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Cloudflare Turnstile. No-op until TURNSTILE_SECRET_KEY is set; blocks only
 *  when TURNSTILE_ENFORCE=true (monitor-first rollout). */
async function turnstileOk(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    if (data.success) return true;
  } catch (e) {
    console.warn("turnstile verify error:", e);
    return true;
  }
  if (process.env.TURNSTILE_ENFORCE === "true") return false;
  console.warn("turnstile check failed (monitor mode, allowing)");
  return true;
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

    if (!(await turnstileOk(field(payload.turnstileToken, 4000)))) {
      return NextResponse.json({ success: false, error: "Challenge failed." }, { status: 403 });
    }

    const db = getDb();
    const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL_TINKERCHAMPS;
    const mirrorPayload = { ...clean, receivedAt: new Date().toISOString() };

    // store the booking + queue the Google Sheet mirror in one transaction, so
    // the mirror survives a dropped request. Plain-insert fallback if the
    // outbox table isn't there yet.
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
      return NextResponse.json({ success: true, bookingId }, { status: 200 });
    }

    if (appsScriptUrl) after(() => flushOutbox(db, { limit: 5 }).catch(() => {}));

    return NextResponse.json({ success: true, bookingId }, { status: 200 });
  } catch (error) {
    console.error("Booking submission API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
