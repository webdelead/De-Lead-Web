import { NextResponse } from "next/server";
import { getDb, sql } from "@delead/db";

export async function GET() {
  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
