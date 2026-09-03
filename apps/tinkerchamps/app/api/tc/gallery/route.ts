import { NextResponse } from "next/server";
import { getGallery } from "../../../lib/tc-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getGallery());
  } catch (e) {
    console.error("tc/gallery", e);
    return NextResponse.json([], { status: 200 });
  }
}
