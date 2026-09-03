"use server";
import { revalidatePath } from "next/cache";
import { getDb, siteSettings, eq, and } from "@delead/db";
import { getSession, canAccess, dbKey } from "@/lib/authz";
import { writeAudit, markDirty } from "@/lib/audit";
import type { VerticalSlug } from "@delead/brand/verticals";

export async function saveSetting(input: {
  vertical: VerticalSlug;
  key: string;
  value: Record<string, unknown>;
}) {
  const session = await getSession();
  const vKey = dbKey(input.vertical);
  if (!canAccess(session, vKey, "edit")) throw new Error("forbidden");
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
