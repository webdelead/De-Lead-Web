/* One-off: convert existing blog_posts.body_md → body_json (TipTap doc) so old
 * posts open in the block editor instead of blank. Idempotent — skips rows that
 * already have body_json. The journal renderer falls back to markdown anyway, so
 * this is optional / cosmetic.
 *
 *   pnpm --filter @delead/db blog:json
 */
import { requireEnv } from "./_env";
import { marked } from "marked";
import { generateJSON } from "@tiptap/html";
import { tiptapExtensions } from "@delead/shared/tiptap";
import { createDb } from "../src/client";
import { blogPosts } from "../src/schema";
import { eq, isNull } from "drizzle-orm";

const url = process.env.DIRECT_URL || requireEnv("DATABASE_URL");
const { db, sql } = createDb(url);

const rows = await db.select().from(blogPosts).where(isNull(blogPosts.bodyJson));
console.log(`${rows.length} posts without body_json`);

let ok = 0;
for (const p of rows) {
  const html = marked.parse(p.bodyMd ?? "", { async: false }) as string;
  const json = generateJSON(html, tiptapExtensions);
  await db.update(blogPosts).set({ bodyJson: json }).where(eq(blogPosts.id, p.id));
  ok++;
}

console.log(`✔ converted ${ok}/${rows.length}`);
await sql.end();
