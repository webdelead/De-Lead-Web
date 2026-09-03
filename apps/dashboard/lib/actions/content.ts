"use server";
import { revalidatePath } from "next/cache";
import { getDb, assets, publishState, sql, eq, and } from "@delead/db";
import { getSession, canAccess, dbKey } from "@/lib/authz";
import { writeAudit, markDirty, clearDirty } from "@/lib/audit";
import { resourceFor, type ResourceDef } from "@/lib/resources";
import { resourceAllowedInVertical } from "@/lib/resource-access";
import { put, ensureBucket } from "@/lib/storage";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";
import { snakeToCamel as toCamel, assetPublicUrl } from "@delead/shared";

function coerce(def: ResourceDef, name: string, raw: FormDataEntryValue | null) {
  const field = def.fields.find((f) => f.name === name);
  const v = raw == null ? "" : String(raw);
  switch (field?.type) {
    case "boolean":
      return v === "true" || v === "on" || v === "1";
    case "number":
      return v === "" ? 0 : Number(v);
    case "stats":
      try {
        return JSON.parse(v || "[]");
      } catch {
        return [];
      }
    case "richtext":
      try {
        return v ? JSON.parse(v) : null;
      } catch {
        return null;
      }
    case "image":
      return v || null;
    default:
      return v;
  }
}

/**
 * A resource may only be mutated in a vertical it actually belongs to. The page
 * component enforces this too, but server actions can be called directly, so it
 * has to be re-checked here — otherwise a user with `edit` on their own vertical
 * could pass any other vertical's slug (or `blog_posts` from any vertical).
 */
function assertResourceVertical(def: ResourceDef, verticalDbKey: string) {
  if (!resourceAllowedInVertical(def, verticalDbKey)) throw new Error("forbidden");
}

/**
 * WHERE clause that pins a mutation to a single row *and* the caller's vertical.
 * For `verticalScoped` tables this adds `vertical = <key>`; for `fixedVertical`
 * tables there is no column to filter, and `assertResourceVertical` +
 * `canAccess(edit)` are the boundary.
 */
function scopeById(def: ResourceDef, verticalDbKey: string, id: string) {
  const idCol = (def.table as never)["id"];
  if (def.verticalScoped) {
    return and(eq(idCol, id), eq((def.table as never)["vertical"], verticalDbKey));
  }
  return eq(idCol, id);
}

async function guard(resource: string, verticalSlug: VerticalSlug) {
  const def = resourceFor(resource);
  const session = await getSession();
  const key = dbKey(verticalSlug);
  if (!canAccess(session, key, "edit")) throw new Error("forbidden");
  assertResourceVertical(def, key);
  return { session, def, verticalDbKey: key };
}

export async function saveRow(input: {
  resource: string;
  vertical: VerticalSlug;
  id?: string;
  values: Record<string, string>;
}) {
  const { session, def, verticalDbKey } = await guard(input.resource, input.vertical);
  const db = getDb();

  const row: Record<string, unknown> = {};
  for (const f of def.fields) {
    row[toCamel(f.name)] = coerce(def, f.name, input.values[f.name] ?? null);
  }
  if (def.verticalScoped) row.vertical = verticalDbKey;
  if (input.resource === "blog_posts") row.vertical = null;

  // publishedAt when a post flips to published
  if (input.resource === "blog_posts" && row.status === "published") {
    row.publishedAt = new Date();
  }
  row.updatedAt = new Date();

  const table = def.table as never;
  let entityId = input.id;

  if (input.id) {
    const updated = await db
      .update(table)
      .set(row)
      .where(scopeById(def, verticalDbKey, input.id))
      .returning({ id: (def.table as never)["id"] });
    if ((updated as unknown[]).length === 0) throw new Error("not found");
    await writeAudit({
      userId: session.user.id,
      userEmail: session.user.email!,
      action: "update",
      entity: input.resource,
      entityId: input.id,
      vertical: verticalDbKey,
      diff: row as Record<string, unknown>,
    });
  } else {
    if (def.orderable) {
      const [{ max }] = await db.execute<{ max: number }>(
        sql`select coalesce(max(sort_order), -1) + 1 as max from ${sql.identifier(tableName(def))}`,
      ) as unknown as { max: number }[];
      row.sortOrder = max ?? 0;
    }
    const inserted = await db.insert(table).values(row).returning({ id: (def.table as never)["id"] });
    entityId = (inserted as { id: string }[])[0]?.id;
    await writeAudit({
      userId: session.user.id,
      userEmail: session.user.email!,
      action: "create",
      entity: input.resource,
      entityId,
      vertical: verticalDbKey,
    });
  }

  await markDirty(verticalDbKey);
  revalidatePath(`/c/${input.vertical}/${input.resource}`);
  return { ok: true, id: entityId };
}

export async function deleteRow(input: { resource: string; vertical: VerticalSlug; id: string }) {
  const { session, def, verticalDbKey } = await guard(input.resource, input.vertical);
  const db = getDb();
  const deleted = await db
    .delete(def.table as never)
    .where(scopeById(def, verticalDbKey, input.id))
    .returning({ id: (def.table as never)["id"] });
  if ((deleted as unknown[]).length === 0) throw new Error("not found");
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "delete",
    entity: input.resource,
    entityId: input.id,
    vertical: verticalDbKey,
  });
  await markDirty(verticalDbKey);
  revalidatePath(`/c/${input.vertical}/${input.resource}`);
  return { ok: true };
}

export async function reorderRows(input: {
  resource: string;
  vertical: VerticalSlug;
  ids: string[];
}) {
  const { def, verticalDbKey } = await guard(input.resource, input.vertical);
  if (input.ids.length > 1000) throw new Error("too many rows");
  const db = getDb();
  // one transaction so a partial failure doesn't leave a scrambled order
  await db.transaction(async (tx) => {
    for (let i = 0; i < input.ids.length; i++) {
      await tx
        .update(def.table as never)
        .set({ sortOrder: i })
        .where(scopeById(def, verticalDbKey, input.ids[i]!));
    }
  });
  await markDirty(verticalDbKey);
  revalidatePath(`/c/${input.vertical}/${input.resource}`);
  return { ok: true };
}

/**
 * "Publish to site" — the sites are Next apps with ISR, so publishing just
 * asks each one to revalidate its cache (no rebuild, no Cloudflare build quota).
 * POST <site>/api/revalidate with the shared REVALIDATE_SECRET.
 */
export async function publishVertical(slug: VerticalSlug) {
  const session = await getSession();
  const key = dbKey(slug);
  if (!canAccess(session, key, "edit")) throw new Error("forbidden");

  const base = process.env[
    `SITE_URL_${key.toUpperCase()}` as keyof NodeJS.ProcessEnv
  ] as string | undefined;
  const secret = process.env.REVALIDATE_SECRET;
  let triggered = false;
  if (base && secret) {
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/api/revalidate`, {
        method: "POST",
        headers: { "x-revalidate-secret": secret },
        cache: "no-store",
      });
      triggered = res.ok;
    } catch {
      triggered = false;
    }
  }

  await clearDirty(key, session.user.id);
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "publish",
    entity: "site",
    entityId: slug,
    vertical: key,
  });
  return { ok: true, triggered };
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
// raster images only — SVG is intentionally excluded (script-carrying vector)
const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
// magic-byte sniff, so a renamed / mislabelled file is caught server-side
function sniffMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return "image/webp";
  const ascii6 = buf.subarray(0, 6).toString("ascii");
  if (ascii6 === "GIF87a" || ascii6 === "GIF89a") return "image/gif";
  if (buf.subarray(4, 12).toString("ascii") === "ftypavif") return "image/avif";
  return null;
}

export async function uploadAsset(form: FormData) {
  const session = await getSession();
  const file = form.get("file") as File | null;
  const verticalSlug = String(form.get("vertical") || "") as VerticalSlug;
  if (!file) throw new Error("no file");
  const key = VERTICALS[verticalSlug]?.key ?? "deleadint";
  if (!canAccess(session, key, "edit")) throw new Error("forbidden");

  if (file.size > MAX_UPLOAD_BYTES) throw new Error("file too large (max 8 MB)");
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.byteLength > MAX_UPLOAD_BYTES) throw new Error("file too large (max 8 MB)");

  const sniffed = sniffMime(buf);
  const mime = sniffed && sniffed in ALLOWED_IMAGE_MIME ? sniffed : null;
  if (!mime) throw new Error("unsupported file type — upload a JPG, PNG, WebP, AVIF or GIF");

  const bucket = ["tinkerchamps", "walk2lead"].includes(key) ? key : "shared";
  await ensureBucket(bucket);
  const ext = ALLOWED_IMAGE_MIME[mime];
  const path = `${key}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const stored = await put(bucket, path, buf, mime);

  const db = getDb();
  const [row] = await db
    .insert(assets)
    .values({
      provider: stored.provider,
      bucket: stored.bucket,
      path: stored.path,
      mime: stored.mime,
      bytes: stored.bytes,
      vertical: key as never,
      uploadedBy: session.user.id,
    })
    .returning();
  return { id: row!.id, url: assetPublicUrl(row!) };
}

function tableName(def: ResourceDef): string {
  // drizzle stores the SQL name on a symbol; fall back to a known map
  const map: Record<string, string> = {
    testimonials: "testimonials",
    gallery_images: "gallery_images",
    whatsapp_reviews: "whatsapp_reviews",
    press_clippings: "press_clippings",
    blog_posts: "blog_posts",
    courses: "courses",
    student_outcomes: "student_outcomes",
    w2l_projects: "w2l_projects",
    w2l_phases: "w2l_phases",
    track_record: "track_record",
    site_stats: "site_stats",
    tc_events: "tc_events",
  };
  return map[def.key] ?? def.key;
}
