import { sql } from "drizzle-orm";
import type { DB } from "./client";
import { outbox } from "./schema";

export type OutboxKind = "lead" | "booking";

/**
 * Enqueue an outbound webhook. Call inside the same transaction as the
 * lead/booking insert so it is never lost if the request dies before the
 * fire-and-forget fetch runs.
 */
export async function enqueueOutbox(
  db: DB,
  input: { kind: OutboxKind; targetUrl: string; payload: Record<string, unknown> },
) {
  await db.insert(outbox).values({
    kind: input.kind,
    targetUrl: input.targetUrl,
    payload: input.payload,
  });
}

const MAX_ATTEMPTS = 8;
const TIMEOUT_MS = 8000;

/**
 * Drain pending outbox rows: POST each target, mark sent / reschedule with
 * exponential backoff / give up after MAX_ATTEMPTS. Safe to run concurrently
 * (FOR UPDATE SKIP LOCKED). Returns a small summary.
 */
export async function flushOutbox(db: DB, opts: { limit?: number } = {}) {
  const limit = opts.limit ?? 20;
  let picked = 0;
  let sent = 0;
  let retried = 0;
  let failed = 0;

  // One transaction holds the row locks for the whole batch, so a concurrent
  // flusher (opportunistic drain vs. the cron) can't double-send. Volume here is
  // tiny, so a short-lived long-ish tx is fine.
  await db.transaction(async (tx) => {
    const rows = (await tx.execute(sql`
      select id, target_url, payload, attempts
      from outbox
      where status = 'pending' and next_attempt_at <= now()
      order by next_attempt_at
      limit ${limit}
      for update skip locked
    `)) as unknown as {
      id: string;
      target_url: string;
      payload: Record<string, unknown>;
      attempts: number;
    }[];
    picked = rows.length;

    for (const row of rows) {
      let ok = false;
      let errText: string | null = null;
      try {
        const res = await fetch(row.target_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row.payload),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        ok = res.ok;
        if (!res.ok) errText = `HTTP ${res.status}`;
      } catch (e) {
        errText = e instanceof Error ? e.message : String(e);
      }

      if (ok) {
        await tx.execute(sql`
          update outbox set status = 'sent', sent_at = now(), last_error = null
          where id = ${row.id}
        `);
        sent++;
      } else {
        const nextAttempts = row.attempts + 1;
        if (nextAttempts >= MAX_ATTEMPTS) {
          await tx.execute(sql`
            update outbox set status = 'failed', attempts = ${nextAttempts}, last_error = ${errText}
            where id = ${row.id}
          `);
          failed++;
        } else {
          const backoffMin = Math.min(60, 2 ** row.attempts); // 1,2,4,8 … min, cap 60
          await tx.execute(sql`
            update outbox
            set attempts = ${nextAttempts},
                last_error = ${errText},
                next_attempt_at = now() + (${backoffMin} || ' minutes')::interval
            where id = ${row.id}
          `);
          retried++;
        }
      }
    }
  });

  return { picked, sent, retried, failed };
}
