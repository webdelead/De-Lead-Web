import { NextResponse } from "next/server";
import { getDb, pingLog, sql } from "@delead/db";

// Vercel Cron hits this daily (apps/dashboard/vercel.json). Second, independent
// keep-alive alongside the GitHub Actions one.
// Auth is mandatory: CRON_SECRET must be set (Vercel injects it and sends it as
// `Authorization: Bearer <secret>` on cron invocations). No secret configured =>
// the endpoint refuses everything rather than being world-writable.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("cron ping: CRON_SECRET is not set — rejecting");
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const db = getDb();
    await db.insert(pingLog).values({ source: "vercel" });
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(pingLog);
    return NextResponse.json({ ok: true, total: n });
  } catch (e) {
    console.error("cron ping failed:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
