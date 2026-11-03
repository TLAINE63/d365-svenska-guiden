// Gemensamt för export-demand-leads och export-demand-events: nyckelskydd, datum och CSV.
// Loggar aldrig innehåll; felmeddelanden innehåller aldrig data ur databasen.

export function exportKeyOk(req: Request): boolean {
  const expected = Deno.env.get("DEMAND_EXPORT_KEY") || "";
  const got = req.headers.get("x-export-key") || "";
  if (expected.length < 32 || got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function validDate(s: string): boolean {
  const m = DATE.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

/** Förskjutning (minuter) för Europe/Stockholm vid ett givet UTC-ögonblick. */
function stockholmOffsetMin(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Stockholm", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(at);
  const g = (t: string) => +(parts.find((p) => p.type === t)?.value || 0);
  const local = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute"));
  return Math.round((local - at.getTime()) / 60000);
}

/** Midnatt i Stockholm för datumet, som UTC-ISO. */
function stockholmMidnight(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  const off = stockholmOffsetMin(guess);
  return new Date(guess.getTime() - off * 60000).toISOString();
}

export function todayStockholm(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date());
}

/** from (inklusive) till to (inklusive) i Stockholmstid, som [start, slut) i UTC. */
export function parseRange(url: URL): { start: string; end: string } | null {
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || todayStockholm();
  if (!validDate(from) || !validDate(to) || from > to) return null;
  const [y, m, d] = to.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  return { start: stockholmMidnight(from), end: stockholmMidnight(next) };
}

/** ISO 8601 med Stockholms tidszon, t.ex. 2026-11-03T12:40:00+01:00. */
export function isoStockholm(ts: string | null | undefined): string {
  if (!ts) return "";
  const at = new Date(ts);
  if (isNaN(at.getTime())) return "";
  const off = stockholmOffsetMin(at);
  const local = new Date(at.getTime() + off * 60000).toISOString().slice(0, 19);
  const sign = off >= 0 ? "+" : "-";
  const a = Math.abs(off);
  return `${local}${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
}

export function toCsv(columns: string[], rows: Record<string, string>[]): string {
  const cell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c] ?? "")).join(","))].join("\r\n") + "\r\n";
}

/** Inga null/undefined: allt blir strängar. */
export function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export const exportHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
