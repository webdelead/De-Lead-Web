import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import { buildSafe } from "@delead/shared/build-safe";
import {
  getReadDb,
  testimonials,
  galleryImages,
  trackRecord,
  assets,
  eq,
  and,
  asc,
  inArray,
} from "@delead/db";

async function withUrl<T extends Record<string, unknown>>(rows: T[], key: keyof T) {
  const ids = [...new Set(rows.map((r) => r[key]).filter(Boolean) as string[])];
  const map = new Map<string, { url: string; alt: string }>();
  if (ids.length) {
    const db = getReadDb();
    for (const a of await db.select().from(assets).where(inArray(assets.id, ids)))
      map.set(a.id, { url: assetPublicUrl(a), alt: a.alt ?? "" });
  }
  return rows.map((r) => {
    const hit = r[key] ? map.get(r[key] as string) : undefined;
    return { ...r, _url: hit?.url ?? "", _alt: hit?.alt ?? "" };
  });
}

export function getTrackRecord() {
  return buildSafe(async () => {
    const db = getReadDb();
    return db
      .select()
      .from(trackRecord)
      .where(eq(trackRecord.isActive, true))
      .orderBy(asc(trackRecord.sortOrder));
  }, []);
}

export function getTestimonials() {
  return buildSafe(async () => {
    const db = getReadDb();
    return db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.vertical, "corporate"), eq(testimonials.isActive, true)))
      .orderBy(asc(testimonials.sortOrder));
  }, []);
}

// the mosaic layout (g-a..g-e in S12_gallery.tsx) is a fixed 5-slot pattern
// that repeats independently of the batch size below (it used to hard-cap
// at 5 and silently drop anything past that).
export const GALLERY_BATCH = 8;

/** One page of the Gallery mosaic — used for the initial SSR render and by
 *  /api/gallery for the "Load more" button. */
export function getGalleryPage(offset: number, limit: number) {
  return buildSafe(
    async () => {
      const db = getReadDb();
      const rows = await db
        .select()
        .from(galleryImages)
        .where(and(eq(galleryImages.vertical, "corporate"), eq(galleryImages.isActive, true)))
        .orderBy(asc(galleryImages.sortOrder))
        .limit(limit + 1)
        .offset(offset);
      const hasMore = rows.length > limit;
      const items = await withUrl(hasMore ? rows.slice(0, limit) : rows, "assetId");
      return { items, hasMore };
    },
    { items: [], hasMore: false },
  );
}
