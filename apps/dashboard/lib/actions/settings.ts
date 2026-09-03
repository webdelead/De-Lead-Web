"use server";
import { revalidatePath } from "next/cache";
import { getDb, siteSettings, eq, and } from "@delead/db";
import { getSession, canAccess, dbKey } from "@/lib/authz";
import { writeAudit, markDirty } from "@/lib/audit";
import type { VerticalSlug } from "@delead/brand/verticals";

// settings blobs the sites actually read; anything else is inert clutter
const ALLOWED_SETTING_KEYS = new Set(["hero", "next_season"]);

export async function saveSetting(input: {
  vertical: VerticalSlug;
  key: string;
  value: Record<string, unknown>;
}) {
  const session = await getSession();
  const vKey = dbKey(input.vertical);
  if (!canAccess(session, vKey, "edit")) throw new Error("forbidden");
  if (!ALLOWED_SETTING_KEYS.has(input.key)) throw new Error("unknown setting key");
  if (input.value == null || typeof input.value !== "object" || Array.isArray(input.value)) {
    throw new Error("invalid setting value");
  }
  const db = getDb();
  await db
    .insert(siteSettings)
    .values({ vertical: vKey as never, key: input.key, value: input.value })
    .onConflictDoUpdate({
      target: [siteSettings.vertical, siteSettings.key],
      set: { value: input.value, updatedAt: new Date() },
    });
  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email!,
    action: "update",
    entity: "site_settings",
    entityId: `${vKey}:${input.key}`,
    vertical: vKey,
    diff: input.value,
  });
  await markDirty(vKey);
  revalidatePath(`/${input.vertical}/settings`);
  return { ok: true };
}
