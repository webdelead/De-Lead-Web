import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export { snakeToCamel } from "./strings";
export { assetPublicUrl } from "./storage";
export { verifyTurnstile } from "./turnstile";

/**
 * The `/api/revalidate` POST handler shared by every marketing site + TC.
 * Guarded by REVALIDATE_SECRET (header `x-revalidate-secret`, or `?secret=`).
 * Server-only (pulls in next/cache).
 */
export function makeRevalidateRoute() {
  async function POST(req: Request) {
    const secret =
      req.headers.get("x-revalidate-secret") || new URL(req.url).searchParams.get("secret");
    if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, revalidated: true, at: Date.now() });
  }
  return { POST };
}
