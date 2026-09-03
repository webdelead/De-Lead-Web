import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import {
  getReadDb,
  testimonials,
  pressClippings,
  galleryImages,
  w2lProjects,
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

export async function getProjects() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(w2lProjects)
    .where(eq(w2lProjects.isActive, true))
    .orderBy(asc(w2lProjects.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getGallery() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(galleryImages)
    .where(and(eq(galleryImages.vertical, "walk2lead"), eq(galleryImages.isActive, true)))
    .orderBy(asc(galleryImages.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getPress() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(pressClippings)
    .where(and(eq(pressClippings.vertical, "walk2lead"), eq(pressClippings.isActive, true)))
    .orderBy(asc(pressClippings.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getVoices() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.vertical, "walk2lead"), eq(testimonials.isActive, true)))
    .orderBy(asc(testimonials.sortOrder));
  return withUrl(rows, "avatarAssetId");
}
