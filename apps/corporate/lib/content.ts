import "server-only";
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

function publicUrl(a: { provider: string; bucket: string; path: string }) {
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  if (a.provider === "r2")
    return `${(process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/${a.path}`;
  return `${base}/storage/v1/object/public/${a.bucket}/${a.path}`;
}

async function withUrl<T extends Record<string, unknown>>(rows: T[], key: keyof T) {
  const ids = [...new Set(rows.map((r) => r[key]).filter(Boolean) as string[])];
  const map = new Map<string, { url: string; alt: string }>();
  if (ids.length) {
    const db = getReadDb();
    for (const a of await db.select().from(assets).where(inArray(assets.id, ids)))
      map.set(a.id, { url: publicUrl(a), alt: a.alt ?? "" });
  }
  return rows.map((r) => {
    const hit = r[key] ? map.get(r[key] as string) : undefined;
    return { ...r, _url: hit?.url ?? "", _alt: hit?.alt ?? "" };
  });
}

export async function getTrackRecord() {
  const db = getReadDb();
  return db
    .select()
    .from(trackRecord)
    .where(eq(trackRecord.isActive, true))
    .orderBy(asc(trackRecord.sortOrder));
}

export async function getTestimonials() {
  const db = getReadDb();
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.vertical, "corporate"), eq(testimonials.isActive, true)))
    .orderBy(asc(testimonials.sortOrder));
}

export async function getGallery() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(galleryImages)
    .where(and(eq(galleryImages.vertical, "corporate"), eq(galleryImages.isActive, true)))
    .orderBy(asc(galleryImages.sortOrder));
  return withUrl(rows, "assetId");
}
