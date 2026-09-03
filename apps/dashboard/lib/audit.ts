import "server-only";
import { getDb, auditLog, publishState, eq, sql } from "@delead/db";

export async function writeAudit(input: {
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  vertical?: string | null;
  diff?: Record<string, unknown>;
}) {
  const db = getDb();
  await db.insert(auditLog).values({
    userId: input.userId,
    userEmail: input.userEmail,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    vertical: (input.vertical ?? null) as never,
    diff: input.diff,
  });
}

/** bump the "unpublished changes" counter for a vertical */
export async function markDirty(verticalDbKey: string) {
  const db = getDb();
  await db
    .insert(publishState)
    .values({ vertical: verticalDbKey as never, dirtyCount: 1 })
    .onConflictDoUpdate({
      target: publishState.vertical,
      set: { dirtyCount: sql`${publishState.dirtyCount} + 1` },
    });
}

export async function clearDirty(verticalDbKey: string, userId: string) {
  const db = getDb();
  await db
    .update(publishState)
    .set({ dirtyCount: 0, lastPublishedAt: new Date(), lastPublishedBy: userId })
    .where(eq(publishState.vertical, verticalDbKey as never));
}
