/** Date formatting shared by the dashboard + every marketing site. Client-safe
 * (pure) — no next/server import here so client components can use it too.
 *
 * The whole product is India/UAE-facing, where dd/mm/yyyy is the norm and
 * the browser-default `toLocaleDateString()` (which renders mm/dd/yyyy on an
 * en-US machine) reads as ambiguous or plain wrong. Use these instead of a
 * bare `toLocaleDateString()`/`toLocaleString()` anywhere a date is shown as
 * digits. */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "04/09/2026" */
export function formatDate(d: Date | string | number): string {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
}

/** "04/09/2026, 14:05" */
export function formatDateTime(d: Date | string | number): string {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return `${formatDate(dt)}, ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}
