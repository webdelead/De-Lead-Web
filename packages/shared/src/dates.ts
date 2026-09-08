/** Date + time formatting shared by the dashboard + every marketing site.
 * Client-safe (pure) — no next/server import here so client components can use
 * it too.
 *
 * The whole product is India/UAE-facing, where dd/mm/yyyy is the norm and the
 * browser-default `toLocaleDateString()` (which renders mm/dd/yyyy on an en-US
 * machine) reads as ambiguous or plain wrong. Clock times are always rendered
 * in Asia/Kolkata (IST, UTC+5:30) with an explicit "IST" label — the dashboard
 * is read from both India and the UAE and the server runs in UTC, so a bare
 * local time would be ambiguous or wrong. Use these instead of a bare
 * `toLocaleDateString()`/`toLocaleString()` anywhere a date is shown as digits. */

const IST = "Asia/Kolkata";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function toDate(d: Date | string | number): Date | null {
  const dt = d instanceof Date ? d : new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

/** "04/09/2026" (calendar date in IST) */
export function formatDate(d: Date | string | number): string {
  const dt = toDate(d);
  return dt ? dateFmt.format(dt) : "—";
}

/** "04/09/2026, 14:05 IST" */
export function formatDateTime(d: Date | string | number): string {
  const dt = toDate(d);
  if (!dt) return "—";
  // en-GB can emit "24:00" for midnight on some runtimes — normalise to 00:00.
  return `${dateFmt.format(dt)}, ${timeFmt.format(dt).replace(/^24:/, "00:")} IST`;
}
