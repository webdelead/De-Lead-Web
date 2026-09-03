import "server-only";

/* Storage adapter. `supabase` today; `r2` later (flip STORAGE_PROVIDER, run
 * packages/db migrate:storage). Content tables store an asset row, never a URL. */

const PROVIDER = (process.env.STORAGE_PROVIDER ?? "supabase") as "supabase" | "r2";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const R2_PUBLIC = (process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");

export interface StoredObject {
  provider: "supabase" | "r2";
  bucket: string;
  path: string;
  mime: string;
  bytes: number;
}

export function publicUrl(o: { provider: string; bucket: string; path: string }): string {
  if (o.provider === "r2") return `${R2_PUBLIC}/${o.path}`;
  return `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${o.bucket}/${o.path}`;
}

export async function put(
  bucket: string,
  path: string,
  body: ArrayBuffer | Buffer,
  mime: string,
): Promise<StoredObject> {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);
  if (PROVIDER === "supabase") {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": mime,
        "x-upsert": "true",
      },
      body: buf,
    });
    if (!res.ok) throw new Error(`storage put ${res.status}: ${await res.text()}`);
    return { provider: "supabase", bucket, path, mime, bytes: buf.byteLength };
  }
  // r2 path — implemented when STORAGE_PROVIDER=r2 (see packages/db/scripts/migrate-storage.ts)
  throw new Error("R2 storage not configured");
}

export async function remove(bucket: string, path: string): Promise<void> {
  if (PROVIDER === "supabase") {
    await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${SERVICE_KEY}` },
    });
    return;
  }
  throw new Error("R2 storage not configured");
}

export async function ensureBucket(bucket: string): Promise<void> {
  if (PROVIDER !== "supabase") return;
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}
