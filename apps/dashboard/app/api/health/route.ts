import { NextResponse } from "next/server";
import { getDb, sql } from "@delead/db";

export async function GET() {
  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    console.error("health check failed:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
