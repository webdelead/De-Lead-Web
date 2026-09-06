/**
 * Run a data fetch that may fail when there is no DB.
 *
 * The marketing sites are ISR: whatever a page renders at build time is what
 * every visitor sees until the next revalidate (1h) or an on-demand purge. So a
 * production build that silently swallowed a DB outage would cache *empty*
 * pages for up to an hour — a green deploy with no content.
 *
 * Policy (all reads are treated as must-have):
 *   - `NODE_ENV === "production"` (i.e. `next build`): a failed fetch RETHROWS
 *     and fails the build. Opt out only by setting `BUILD_ALLOW_DB_FALLBACK=1`
 *     — CI does this so it can build without a database; real deploys never do.
 *   - Otherwise (`next dev`, tests): fall back to `fallback` and log, so local
 *     work doesn't need a live DB.
 *
 * `T` is inferred from `fn` only; `fallback` just has to be assignable to it
 * (so `[]` / `null` are fine).
 */
export async function buildSafe<T>(fn: () => Promise<T>, fallback: NoInfer<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const msg = (e as Error)?.message ?? String(e);
    const allowFallback =
      process.env.NODE_ENV !== "production" || process.env.BUILD_ALLOW_DB_FALLBACK === "1";
    if (!allowFallback) {
      throw new Error(
        `[buildSafe] DB read failed during a production build (${msg}). ` +
          `Refusing to bake empty content into ISR. Set BUILD_ALLOW_DB_FALLBACK=1 ` +
          `only for database-less CI builds.`,
        { cause: e },
      );
    }
    console.warn("[buildSafe] DB unavailable, using fallback:", msg);
    return fallback;
  }
}
