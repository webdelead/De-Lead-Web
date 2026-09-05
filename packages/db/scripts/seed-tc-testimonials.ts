/* One-off (already run, 2026-09): seeded the 4 TinkerChamps testimonials that
 * used to be hardcoded straight into
 * apps/tinkerchamps/app/components/TestimonialSection.tsx, so that section is
 * now dashboard-editable like every other vertical's. Their local avatar
 * files (apps/tinkerchamps/public/assets/images/test{1..4}.png) were deleted
 * after this ran — the avatars now live in Supabase Storage.
 *
 * Scoped on purpose — unlike populate.ts this touches ONLY
 * `testimonials where vertical = 'tinkerchamps'` (delete + reinsert those 4
 * rows) plus the 4 avatar uploads. It does not touch any other table or
 * vertical. Idempotent (same delete-then-insert pattern as populate.ts) —
 * safe to run again, but there's no reason to unless the seed rows get
 * deleted and need restoring.
 */
import { requireEnv } from "./_env";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createDb } from "../src/client";
import { assets, testimonials } from "../src/schema";
import { eq } from "drizzle-orm";

const ROOT = resolve(import.meta.dirname, "../../..");
const APPS = resolve(ROOT, "apps");
const SUPABASE_URL = requireEnv("SUPABASE_URL");
const SERVICE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const DB_URL = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql } = createDb(DB_URL);

async function ensureBucket(bucket: string) {
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {});
}

// mirrors populate.ts's up() exactly (no cross-run cache needed — 4 uploads, once)
async function up(localRel: string, bucket: string, key: string, vertical: string, alt: string) {
  const path = resolve(APPS, localRel);
  const buf = readFileSync(path);
  const mime = "image/png";

  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": mime, "x-upsert": "true" },
    body: new Uint8Array(buf),
  });
  if (!put.ok) throw new Error(`upload ${key}: ${put.status} ${await put.text()}`);

  const [row] = await db
    .insert(assets)
    .values({
      provider: "supabase",
      bucket,
      path: key,
      mime,
      bytes: statSync(path).size,
      vertical: vertical as never,
      alt,
    })
    .onConflictDoUpdate({
      target: [assets.provider, assets.bucket, assets.path],
      set: { bytes: statSync(path).size, alt },
    })
    .returning({ id: assets.id });
  return row!.id;
}

const TC_TESTIMONIALS: [string, string, string, string][] = [
  ["From shy observers to engaged participants, TinkerChamps has had a profound impact. Students are now confident, well-rounded individuals with a thirst for knowledge.",
   "Dr. Bindhu Ann Thomas", "Director, Kochi Business School", "test1.png"],
  ["Building a better tomorrow starts today! TinkerChamps cultivates critical thinking and social awareness, empowering students to tackle real-world challenges.",
   "Mr. Arjun Govind", "Asst. Professor, Amity Global Business School", "test2.png"],
  ["Gone are the days of shy students hiding in the back. TinkerChamps@School fostered collaboration and communication, making my classroom a vibrant hub of social learning and growth.",
   "Roshna John", "Project Coordinator, PRISM Project", "test3.png"],
  ["Fear weakens self-confidence, making children and parents doubt their abilities. At TinkerChamps, I've seen hesitant learners become confident, curious explorers. The program shapes them into problem-solvers and thinkers, preparing them not just for school, but for life.",
   "Ramkamal Manoj", "Mentor, Catalyst for Student Start-ups", "test4.png"],
];

async function main() {
  await ensureBucket("tinkerchamps");
  await db.delete(testimonials).where(eq(testimonials.vertical, "tinkerchamps"));
  for (let i = 0; i < TC_TESTIMONIALS.length; i++) {
    const [quote, authorName, authorRole, avatarFile] = TC_TESTIMONIALS[i]!;
    const avatarAssetId = await up(
      `tinkerchamps/public/assets/images/${avatarFile}`,
      "tinkerchamps",
      `people/${avatarFile}`,
      "tinkerchamps",
      authorName,
    );
    await db.insert(testimonials).values({
      vertical: "tinkerchamps", quote, authorName, authorRole, avatarAssetId, sortOrder: i,
    });
  }
  console.log(`✔ testimonials (tinkerchamps): ${TC_TESTIMONIALS.length}`);
}

await main();
await sql.end();
console.log("seed-tc-testimonials done.");
