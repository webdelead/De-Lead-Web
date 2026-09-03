import { NextResponse } from "next/server";
import { getReviews } from "../../../lib/tc-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getReviews());
  } catch (e) {
    console.error("tc/reviews", e);
    return NextResponse.json([], { status: 200 });
  }
}
