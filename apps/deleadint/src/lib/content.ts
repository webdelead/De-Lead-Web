import {
  createDb,
  testimonials,
  pressClippings,
  blogPosts,
  siteStats,
  galleryImages,
  assets,
  eq,
  and,
  asc,
  desc,
  inArray,
} from "@delead/db";
import { assetUrl } from "@delead/ui/lib";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing at build time");
const { db } = createDb(url);

async function withAssets<T extends Record<string, any>>(rows: T[], keys: string[]) {
  const ids = new Set<string>();
  for (const r of rows) for (const k of keys) if (r[k]) ids.add(r[k]);
  if (!ids.size) return rows.map((r) => ({ ...r, _assets: {} as Record<string, string> }));
  const list = await db.select().from(assets).where(inArray(assets.id, [...ids]));
  const map = new Map(list.map((a) => [a.id, assetUrl(a)]));
  return rows.map((r) => {
    const _assets: Record<string, string> = {};
    for (const k of keys) if (r[k]) _assets[k] = map.get(r[k]) ?? "";
    return { ...r, _assets };
  });
}

export async function getHubContent() {
  const [tRows, pRows, bRows, sRows, gRows] = await Promise.all([
    db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.vertical, "deleadint"), eq(testimonials.isActive, true)))
      .orderBy(asc(testimonials.sortOrder)),
    db
      .select()
      .from(pressClippings)
      .where(and(eq(pressClippings.vertical, "deleadint"), eq(pressClippings.isActive, true)))
      .orderBy(asc(pressClippings.sortOrder)),
    db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(6),
    db.select().from(siteStats).where(eq(siteStats.vertical, "deleadint")).orderBy(asc(siteStats.sortOrder)),
    db
      .select()
      .from(galleryImages)
      .where(and(eq(galleryImages.vertical, "deleadint"), eq(galleryImages.isActive, true)))
      .orderBy(asc(galleryImages.sortOrder)),
  ]);

  return {
    testimonials: tRows,
    press: await withAssets(pRows, ["assetId"]),
    posts: await withAssets(bRows, ["coverAssetId"]),
    stats: sRows,
    gallery: await withAssets(gRows, ["assetId"]),
  };
}
