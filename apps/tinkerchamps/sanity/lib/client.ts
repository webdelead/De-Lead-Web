/* Compatibility shim — TinkerChamps was migrated off Sanity to the shared
 * Postgres backend. The section components still call `client.fetch(<groq>)`
 * and `urlFor(x).url()`; this shim maps those to the /api/tc/* endpoints and
 * treats image values as plain URL strings. No component code had to change.
 */

async function get(path: string) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

export const client = {
  async fetch(query: string): Promise<any> {
    const q = String(query);
    if (q.includes('"event"')) {
      const activeOnly = q.includes("isActive == true");
      return get(`/api/tc/events${activeOnly ? "?active=1" : ""}`);
    }
    if (q.includes('"gallery"')) return get("/api/tc/gallery");
    if (q.includes('"whatsappReview"')) return get("/api/tc/reviews");
    return [];
  },
};

/** value is already a public URL string from the API responses */
export function urlFor(src: any) {
  const url = typeof src === "string" ? src : (src?.url ?? "");
  return { url: () => url };
}
