/**
 * Run a data fetch that may fail when there is no DB (CI builds, previews).
 * On failure returns `fallback` — the page then renders empty and ISR fills it
 * in on the first real request.
 *
 * `T` is inferred from `fn` only; `fallback` just has to be assignable to it
 * (so `[]` / `null` are fine).
 */
export async function buildSafe<T>(fn: () => Promise<T>, fallback: NoInfer<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.warn("[buildSafe] DB unavailable, using fallback:", (e as Error)?.message ?? e);
    return fallback;
  }
}
