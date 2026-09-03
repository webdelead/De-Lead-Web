import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import {
  getReadDb,
  testimonials,
  pressClippings,
  blogPosts,
  assets,
  eq,
  and,
  asc,
  desc,
  inArray,
} from "@delead/db";


async function resolveAssets<T extends Record<string, unknown>>(rows: T[], key: keyof T) {
  const ids = [...new Set(rows.map((r) => r[key]).filter(Boolean) as string[])];
  const map = new Map<string, string>();
  if (ids.length) {
    const db = getReadDb();
    for (const a of await db.select().from(assets).where(inArray(assets.id, ids)))
      map.set(a.id, assetPublicUrl(a));
  }
  return rows.map((r) => ({ ...r, _url: r[key] ? (map.get(r[key] as string) ?? "") : "" }));
}

export async function getPress() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(pressClippings)
    .where(and(eq(pressClippings.vertical, "deleadint"), eq(pressClippings.isActive, true)))
    .orderBy(asc(pressClippings.sortOrder));
  return resolveAssets(rows, "assetId");
}

export async function getVoices() {
  const db = getReadDb();
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.vertical, "deleadint"), eq(testimonials.isActive, true)))
    .orderBy(asc(testimonials.sortOrder));
}

export async function getPosts() {
  const db = getReadDb();
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(5);
  return resolveAssets(rows, "coverAssetId");
}

export async function getPost(slug: string) {
  const db = getReadDb();
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (!row) return null;
  const [withUrl] = await resolveAssets([row], "coverAssetId");
  return withUrl;
}
