/* Move every asset from Supabase Storage to Cloudflare R2, then flip
 * STORAGE_PROVIDER=r2. Only run after the client confirms R2.
 *
 * Steps it performs:
 *   1. for each `assets` row where provider = 'supabase':
 *        download from Supabase Storage → upload to R2 (same path)
 *        update the row: provider = 'r2', bucket = R2_BUCKET
 *   2. prints a summary; does NOT delete the Supabase originals (do that
 *      manually once the R2 site build is verified).
 *
 * Usage:  R2_* env set, then  pnpm --filter @delead/db migrate:storage
 */
import { requireEnv } from "./_env";
import { createDb } from "../src/client";
import { assets } from "../src/schema";
import { eq } from "drizzle-orm";

const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");

const R2_BUCKET = process.env.R2_BUCKET;
const R2_ACCOUNT = process.env.R2_ACCOUNT_ID;
if (!R2_BUCKET || !R2_ACCOUNT) {
  console.error("R2_* env not set — nothing to do. Configure R2 first.");
  process.exit(1);
}

const { db, sql } = createDb(DB_URL);

// Lazy import so the S3 client isn't a hard dep until R2 is actually used.
const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
});

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
  const body = Buffer.from(await res.arrayBuffer());
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: a.path,
      Body: body,
      ContentType: a.mime,
    }),
  );
  await db
    .update(assets)
    .set({ provider: "r2", bucket: R2_BUCKET, updatedAt: new Date() })
    .where(eq(assets.id, a.id));
  ok++;
}

console.log(`✔ migrated ${ok}/${rows.length}. Now set STORAGE_PROVIDER=r2 and redeploy.`);
await sql.end();
