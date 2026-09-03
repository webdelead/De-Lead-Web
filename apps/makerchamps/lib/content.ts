import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import { getReadDb, testimonials, galleryImages, assets, eq, and, asc, inArray } from "@delead/db";


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

export async function getGallery() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(galleryImages)
    .where(and(eq(galleryImages.vertical, "makerchamps"), eq(galleryImages.isActive, true)))
    .orderBy(asc(galleryImages.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getTestimonials() {
  const db = getReadDb();
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.vertical, "makerchamps"), eq(testimonials.isActive, true)))
    .orderBy(asc(testimonials.sortOrder));
}
