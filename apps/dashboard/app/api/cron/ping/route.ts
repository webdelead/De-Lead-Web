import { NextResponse } from "next/server";
import { getDb, pingLog, sql } from "@delead/db";

// Vercel Cron hits this daily (apps/dashboard/vercel.json). Second, independent
// keep-alive alongside the GitHub Actions one.
// TODO (Phase 5, "cron last"): make CRON_SECRET mandatory / fail closed once the
// secret is set in Vercel. Left soft for now so the keep-alive keeps working.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
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
