import "server-only";
import { assetPublicUrl } from "@delead/shared/storage";
import { buildSafe } from "@delead/shared/build-safe";
import {
  getReadDb,
  testimonials,
  galleryImages,
  whatsappReviews,
  assets,
  siteSettings,
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

export function getGallery() {
  return buildSafe(async () => {
    const db = getReadDb();
    const rows = await db
      .select()
      .from(galleryImages)
      .where(and(eq(galleryImages.vertical, "makerchamps"), eq(galleryImages.isActive, true)))
      .orderBy(asc(galleryImages.sortOrder));
    return withUrl(rows, "assetId");
  }, []);
}

/** The hero "You're Invited" card — dashboard-editable via Settings →
 *  Next season (site_settings, key "next_season"). Returns null when there's
 *  no season scheduled (the "active" toggle is off) so the card/ribbon can
 *  be omitted entirely between seasons, same as before this was wired up. */
export function getNextSeason() {
  return buildSafe(async () => {
    const db = getReadDb();
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(and(eq(siteSettings.vertical, "makerchamps"), eq(siteSettings.key, "next_season")));
    const v = (row?.value ?? {}) as {
      active?: boolean;
      label?: string;
      dates?: string;
      campus?: string;
      logoAssetId?: string;
    };
    if (!v.active) return null;

    let logoUrl = "";
    if (v.logoAssetId) {
      const [asset] = await db.select().from(assets).where(eq(assets.id, v.logoAssetId));
      if (asset) logoUrl = assetPublicUrl(asset);
    }
    return {
      label: v.label || "",
      dates: v.dates || "",
      campus: v.campus || "",
      logoUrl,
    };
  }, null);
}

/** "What Parents Share on WhatsApp" — screenshot marquee, dashboard-editable
 *  under WhatsApp reviews (same resource TinkerChamps already used; just
 *  extended to makerchamps in lib/resources.ts). */
export function getWhatsappReviews() {
  return buildSafe(async () => {
    const db = getReadDb();
    const rows = await db
      .select()
      .from(whatsappReviews)
      .where(and(eq(whatsappReviews.vertical, "makerchamps"), eq(whatsappReviews.isActive, true)))
      .orderBy(asc(whatsappReviews.sortOrder));
    return withUrl(rows, "assetId");
  }, []);
}

export function getTestimonials() {
  return buildSafe(async () => {
    const db = getReadDb();
    return db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.vertical, "makerchamps"), eq(testimonials.isActive, true)))
      .orderBy(asc(testimonials.sortOrder));
  }, []);
}
