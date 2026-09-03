import "server-only";
import { AwsClient } from "aws4fetch";
import { assetPublicUrl } from "@delead/shared/storage";

/* Storage adapter. Flip STORAGE_PROVIDER between `supabase` and `r2`; run
 * `pnpm --filter @delead/db migrate:storage` to bulk-copy existing objects.
 * Content tables store an asset row (provider/bucket/path), never a URL. */

const PROVIDER = (process.env.STORAGE_PROVIDER ?? "supabase") as "supabase" | "r2";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const R2_ENDPOINT = process.env.R2_ACCOUNT_ID
  ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : "";
let _r2: AwsClient | null = null;
function r2() {
  if (!_r2) {
    _r2 = new AwsClient({
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
      region: "auto",
      service: "s3",
    });
  }
  return _r2;
}

export interface StoredObject {
  provider: "supabase" | "r2";
  bucket: string;
  path: string;
  mime: string;
  bytes: number;
}

/** @deprecated import `assetPublicUrl` from `@delead/shared/storage` */
export const publicUrl = assetPublicUrl;

export async function put(
  bucket: string,
  path: string,
  body: ArrayBuffer | Buffer,
  mime: string,
): Promise<StoredObject> {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(body);

  if (PROVIDER === "r2") {
    const res = await r2().fetch(`${R2_ENDPOINT}/${bucket}/${path}`, {
      method: "PUT",
      headers: { "Content-Type": mime },
      body: new Uint8Array(buf),
    });
    if (!res.ok) throw new Error(`r2 put ${res.status}: ${await res.text()}`);
    return { provider: "r2", bucket, path, mime, bytes: buf.byteLength };
  }

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": mime, "x-upsert": "true" },
    body: new Uint8Array(buf),
  });
  if (!res.ok) throw new Error(`storage put ${res.status}: ${await res.text()}`);
  return { provider: "supabase", bucket, path, mime, bytes: buf.byteLength };
}

export async function remove(bucket: string, path: string): Promise<void> {
  if (PROVIDER === "r2") {
    await r2()
      .fetch(`${R2_ENDPOINT}/${bucket}/${path}`, { method: "DELETE" })
      .catch(() => {});
    return;
  }
  await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${SERVICE_KEY}` },
  }).catch(() => {});
}

export async function ensureBucket(bucket: string): Promise<void> {
  // R2 buckets are created once in the Cloudflare dashboard — nothing to do here.
  if (PROVIDER !== "supabase") return;
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}
