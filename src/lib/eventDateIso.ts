/**
 * Build ISO 8601 date strings for Schema.org Event JSON-LD using
 * Europe/Stockholm wall-clock time and the correct timezone offset.
 *
 * - Inputs: date "YYYY-MM-DD", optional time "HH:mm" or "HH:mm:ss"
 * - Output: "YYYY-MM-DDTHH:mm:ss+01:00" (or "+02:00" during CEST)
 * - If time missing → "YYYY-MM-DD" (date-only is valid for Schema.org Event)
 *
 * Validation issues are returned alongside the value so callers can log them.
 */

export interface IsoBuildResult {
  value: string;
  issues: string[];
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

/**
 * Returns true if the given UTC date is in Stockholm DST (CEST, +02:00).
 * Stockholm DST: last Sunday of March 01:00 UTC → last Sunday of October 01:00 UTC.
 */
function isStockholmDst(year: number, month1: number, day: number, hour: number, minute: number): boolean {
  const lastSunday = (y: number, m0: number) => {
    const last = new Date(Date.UTC(y, m0 + 1, 0));
    return last.getUTCDate() - last.getUTCDay();
  };
  const dstStartDay = lastSunday(year, 2); // March
  const dstEndDay = lastSunday(year, 9); // October
  // Compare as UTC instants (DST switches at 01:00 UTC)
  const localUtc = Date.UTC(year, month1 - 1, day, hour, minute);
  const startUtc = Date.UTC(year, 2, dstStartDay, 1, 0);
  const endUtc = Date.UTC(year, 9, dstEndDay, 1, 0);
  return localUtc >= startUtc && localUtc < endUtc;
}

export function buildStockholmIso(date: string | null | undefined, time: string | null | undefined): IsoBuildResult {
  const issues: string[] = [];

  if (!date || !DATE_RE.test(date)) {
    issues.push(`Invalid date "${date ?? ""}", expected YYYY-MM-DD`);
    // Fallback to today to avoid breaking JSON-LD entirely
    return { value: new Date().toISOString().split("T")[0], issues };
  }

  if (!time) {
    return { value: date, issues };
  }

  if (!TIME_RE.test(time)) {
    issues.push(`Invalid time "${time}", expected HH:mm or HH:mm:ss`);
    return { value: date, issues };
  }

  const [y, m, d] = date.split("-").map(Number);
  const [hStr, minStr, secStr] = time.split(":");
  const h = Number(hStr);
  const min = Number(minStr);
  const sec = secStr ? Number(secStr) : 0;

  const dst = isStockholmDst(y, m, d, h, min);
  const offset = dst ? "+02:00" : "+01:00";
  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    value: `${date}T${pad(h)}:${pad(min)}:${pad(sec)}${offset}`,
    issues,
  };
}
