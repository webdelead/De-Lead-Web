import { NextResponse } from "next/server";
import { getGalleryPage, GALLERY_BATCH } from "@/lib/content";

/** Backs the Gallery section's "Load more" button. */
export async function GET(req: Request) {
  const offset = Math.max(0, Number(new URL(req.url).searchParams.get("offset") ?? "0") || 0);
  const { items, hasMore } = await getGalleryPage(offset, GALLERY_BATCH);
  return NextResponse.json({
    items: items.map((g) => ({ id: g.id, url: g._url, alt: g._alt || String(g.title || "") })),
    hasMore,
  });
}
