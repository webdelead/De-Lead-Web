"use server";
import { revalidatePath } from "next/cache";
import { getDb, assets, publishState, sql, eq } from "@delead/db";
import { getSession, canAccess, dbKey } from "@/lib/authz";
import { writeAudit, markDirty, clearDirty } from "@/lib/audit";
import { resourceFor, type ResourceDef } from "@/lib/resources";
import { put, ensureBucket } from "@/lib/storage";
import { VERTICALS, type VerticalSlug } from "@delead/brand/verticals";

function toCamel(sn: string) {
  return sn.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

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
    case "image":
      return v || null;
    default:
      return v;
  }
}

async function guard(resourceKey: string, verticalSlug: VerticalSlug) {
  const session = await getSession();
  const key = dbKey(verticalSlug);
  if (!canAccess(session, key, "edit")) throw new Error("forbidden");
  return { session, verticalDbKey: key };
}

export async function saveRow(input: {
  resource: string;
  vertical: VerticalSlug;
  id?: string;
  values: Record<string, string>;
}) {
  const def = resourceFor(input.resource);
  const { session, verticalDbKey } = await guard(input.resource, input.vertical);
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
    await db.update(table).set(row).where(eq((def.table as never)["id"], input.id));
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
  const def = resourceFor(input.resource);
  const { session, verticalDbKey } = await guard(input.resource, input.vertical);
  const db = getDb();
  await db.delete(def.table as never).where(eq((def.table as never)["id"], input.id));
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
  const def = resourceFor(input.resource);
  const { verticalDbKey } = await guard(input.resource, input.vertical);
  const db = getDb();
  await Promise.all(
    input.ids.map((id, i) =>
      db.update(def.table as never).set({ sortOrder: i }).where(eq((def.table as never)["id"], id)),
    ),
  );
  await markDirty(verticalDbKey);
  revalidatePath(`/c/${input.vertical}/${input.resource}`);
  return { ok: true };
}

export async function publishVertical(slug: VerticalSlug) {
  const session = await getSession();
  const key = dbKey(slug);
  if (!canAccess(session, key, "edit")) throw new Error("forbidden");

  const hook = process.env[`DEPLOY_HOOK_${key.toUpperCase()}` as keyof NodeJS.ProcessEnv];
  if (hook) {
    await fetch(hook, { method: "POST" }).catch(() => {});
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
  return { ok: true, triggered: !!hook };
}

export async function uploadAsset(form: FormData) {
  const session = await getSession();
  const file = form.get("file") as File | null;
  const verticalSlug = String(form.get("vertical") || "") as VerticalSlug;
  if (!file) throw new Error("no file");
  const key = VERTICALS[verticalSlug]?.key ?? "deleadint";
  if (!canAccess(session, key, "edit")) throw new Error("forbidden");

  const bucket = ["tinkerchamps", "walk2lead"].includes(key) ? key : "shared";
  await ensureBucket(bucket);
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${key}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const stored = await put(bucket, path, buf, file.type || "application/octet-stream");

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
  return { id: row!.id, url: publicUrlOf(row!) };
}

function publicUrlOf(a: { provider: string; bucket: string; path: string }) {
  if (a.provider === "r2")
    return `${(process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/$/, "")}/${a.path}`;
  return `${(process.env.SUPABASE_URL ?? "").replace(/\/$/, "")}/storage/v1/object/public/${a.bucket}/${a.path}`;
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
