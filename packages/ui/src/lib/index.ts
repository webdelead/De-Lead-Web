/* Framework-agnostic helpers shared by the sites and the dashboard. */

export interface AssetRef {
  provider: "supabase" | "r2";
  bucket: string;
  path: string;
  alt?: string | null;
}

/** Derive a public URL for an asset row. No SDK — just string building, so it
 *  works at Astro build time and in the browser. R2 swap only changes env. */
export function assetUrl(a: AssetRef | null | undefined): string {
  if (!a) return "";
  if (a.provider === "r2") {
    const base = (process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
    return `${base}/${a.path}`;
  }
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${a.bucket}/${a.path}`;
}

/** Indian-grouped integer, e.g. 1300 → "1,300". */
export function inrNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** tiny classlist joiner (dashboard uses tailwind-merge on top of this) */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const WHATSAPP_NUMBER = "918075566081";
export const CONTACT_EMAIL = "info@deleadint.com";
export const PHONE_IN = "+918075566081";
export const PHONE_AE = "+971506814538";
