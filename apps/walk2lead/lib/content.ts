import "server-only";
import {
  getDb,
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
    const db = getDb();
    for (const a of await db.select().from(assets).where(inArray(assets.id, ids)))
      map.set(a.id, { url: publicUrl(a), alt: a.alt ?? "" });
  }
  return rows.map((r) => {
    const hit = r[key] ? map.get(r[key] as string) : undefined;
    return { ...r, _url: hit?.url ?? "", _alt: hit?.alt ?? "" };
  });
}

export async function getProjects() {
  const db = getDb();
  const rows = await db
    .select()
    .from(w2lProjects)
    .where(eq(w2lProjects.isActive, true))
    .orderBy(asc(w2lProjects.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getGallery() {
  const db = getDb();
  const rows = await db
    .select()
    .from(galleryImages)
    .where(and(eq(galleryImages.vertical, "walk2lead"), eq(galleryImages.isActive, true)))
    .orderBy(asc(galleryImages.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getPress() {
  const db = getDb();
  const rows = await db
    .select()
    .from(pressClippings)
    .where(and(eq(pressClippings.vertical, "walk2lead"), eq(pressClippings.isActive, true)))
    .orderBy(asc(pressClippings.sortOrder));
  return withUrl(rows, "assetId");
}

export async function getVoices() {
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.vertical, "walk2lead"), eq(testimonials.isActive, true)))
    .orderBy(asc(testimonials.sortOrder));
  return withUrl(rows, "avatarAssetId");
}
