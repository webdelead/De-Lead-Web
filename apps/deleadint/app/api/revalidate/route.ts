import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/** Called by the dashboard's "Publish to site" button. */
export async function POST(req: Request) {
  const secret =
    req.headers.get("x-revalidate-secret") ||
    new URL(req.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath("/", "layout"); // home + any /journal/* pages
  return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
}
