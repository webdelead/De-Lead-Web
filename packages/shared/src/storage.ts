/**
 * Public URL for a stored asset. One implementation for every site + the
 * dashboard (was copy-pasted in ~6 places). Reads SUPABASE_URL / R2_PUBLIC_BASE_URL
 * from the environment. Client-safe only if those are NEXT_PUBLIC_*; today it's
 * used server-side.
 */
export function assetPublicUrl(a: { provider: string; bucket: string; path: string }): string {
  if (a.provider === "r2") {
    return `${(process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/${a.path}`;
  }
  return `${(process.env.SUPABASE_URL ?? "").replace(/\/$/, "")}/storage/v1/object/public/${a.bucket}/${a.path}`;
}
