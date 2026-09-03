import { NextResponse } from "next/server";
import { getEvents } from "../../../lib/tc-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const activeOnly = new URL(req.url).searchParams.get("active") === "1";
  try {
    return NextResponse.json(await getEvents(activeOnly));
  } catch (e) {
    console.error("tc/events", e);
    return NextResponse.json([], { status: 200 });
  }
}
