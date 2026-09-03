/* Move every asset from Supabase Storage to Cloudflare R2, then flip
 * STORAGE_PROVIDER=r2. Only run after R2 is set up.
 *
 *   1. for each `assets` row where provider = 'supabase':
 *        download from Supabase Storage → PUT to R2 (same path)
 *        update the row: provider = 'r2', bucket = R2_BUCKET
 *   2. prints a summary; does NOT delete the Supabase originals — do that by
 *      hand once an R2-served build is verified.
 *
 * Usage:  R2_* env set, then  pnpm --filter @delead/db migrate:storage
 */
import { requireEnv } from "./_env";
import { AwsClient } from "aws4fetch";
import { createDb } from "../src/client";
import { assets } from "../src/schema";
import { eq } from "drizzle-orm";

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const R2_BUCKET = requireEnv("R2_BUCKET");
const R2_ENDPOINT = `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`;

const r2 = new AwsClient({
  accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
  secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  region: "auto",
  service: "s3",
});

const { db, sql } = createDb(DB_URL);

const rows = await db.select().from(assets).where(eq(assets.provider, "supabase"));
console.log(`${rows.length} assets to migrate`);

let ok = 0;
for (const a of rows) {
  const src = `${SUPABASE_URL}/storage/v1/object/${a.bucket}/${a.path}`;
  const res = await fetch(src, { headers: { Authorization: `Bearer ${SERVICE_KEY}` } });
  if (!res.ok) {
    console.warn(`skip ${a.path} — download ${res.status}`);
    continue;
  }
  const body = new Uint8Array(await res.arrayBuffer());
  const put = await r2.fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${a.path}`, {
    method: "PUT",
    headers: { "Content-Type": a.mime },
    body,
  });
  if (!put.ok) {
    console.warn(`skip ${a.path} — r2 put ${put.status}`);
    continue;
  }
  await db
    .update(assets)
    .set({ provider: "r2", bucket: R2_BUCKET, updatedAt: new Date() })
    .where(eq(assets.id, a.id));
  ok++;
}

console.log(`✔ migrated ${ok}/${rows.length}. Now set STORAGE_PROVIDER=r2 and redeploy.`);
await sql.end();
