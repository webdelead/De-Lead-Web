import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import { buildSafe } from "@delead/shared/build-safe";
import {
  getReadDb,
  testimonials,
  pressClippings,
  galleryImages,
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

export function getPress() {
  return buildSafe(async () => {
    const db = getReadDb();
    const rows = await db
      .select()
      .from(pressClippings)
      .where(and(eq(pressClippings.vertical, "deleadint"), eq(pressClippings.isActive, true)))
      .orderBy(asc(pressClippings.sortOrder));
    return resolveAssets(rows, "assetId");
  }, []);
}

export const GALLERY_BATCH = 8;

/** One page of the Gallery grid — used for the initial SSR render and by
 *  /api/gallery for the "Load more" button, so only `limit` rows (plus URLs)
 *  are ever fetched per request instead of pulling every photo up front. */
export function getGalleryPage(offset: number, limit: number) {
  return buildSafe(
    async () => {
      const db = getReadDb();
      const rows = await db
        .select()
        .from(galleryImages)
        .where(and(eq(galleryImages.vertical, "deleadint"), eq(galleryImages.isActive, true)))
        .orderBy(asc(galleryImages.sortOrder))
        .limit(limit + 1)
        .offset(offset);
      const hasMore = rows.length > limit;
      const items = await resolveAssets(hasMore ? rows.slice(0, limit) : rows, "assetId");
      return { items, hasMore };
    },
    { items: [], hasMore: false },
  );
}

export function getVoices() {
  return buildSafe(async () => {
    const db = getReadDb();
    return db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.vertical, "deleadint"), eq(testimonials.isActive, true)))
      .orderBy(asc(testimonials.sortOrder));
  }, []);
}

export function getPosts() {
  return buildSafe(async () => {
    const db = getReadDb();
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(5);
    return resolveAssets(rows, "coverAssetId");
  }, []);
}

export function getAllPosts() {
  return buildSafe(async () => {
    const db = getReadDb();
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
    return resolveAssets(rows, "coverAssetId");
  }, []);
}

export function getPost(slug: string) {
  return buildSafe(async () => {
    const db = getReadDb();
    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    if (!row) return null;
    const [withUrl] = await resolveAssets([row], "coverAssetId");
    return withUrl ?? null;
  }, null);
}
