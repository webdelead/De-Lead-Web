/**
 * Minimal CSV encoder.
 *
 * Guards against spreadsheet formula injection: a cell whose text begins with
 * = + - @ (or a tab / CR) is treated as a formula by Excel / Google Sheets, so
 * we prefix it with a single quote and wrap it in quotes. Lead / booking fields
 * are unauthenticated public input, so this matters.
 */
const FORMULA_LEAD = /^[=+\-@\t\r]/;
const NEEDS_QUOTING = /[",\n\r]/;

function esc(v: unknown): string {
  if (v == null) return "";
  let s = v instanceof Date ? v.toISOString() : String(v);
  const isFormula = FORMULA_LEAD.test(s);
  if (isFormula) s = `'${s}`; // neutralise: leading quote stops formula evaluation
  return isFormula || NEEDS_QUOTING.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** One CSV line (no trailing newline), `record` projected onto `columns`. */
export function csvLine(record: Record<string, unknown>, columns: string[]): string {
  return columns.map((c) => esc(record[c])).join(",");
}

/** Whole CSV as a string. Empty `rows` still yields the header line. */
export function toCsv(rows: Record<string, unknown>[], columns?: string[]): string {
  const cols = columns ?? (rows.length ? Object.keys(rows[0]!) : []);
  const header = cols.join(",");
  if (rows.length === 0) return header;
  return [header, ...rows.map((r) => csvLine(r, cols))].join("\n");
}
