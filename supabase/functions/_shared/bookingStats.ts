export interface BookingClickRow { occurred_at: string; metadata?: { placement?: unknown } | null }
export function bookingMonths(now = new Date()): string[] {
  const month = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit" }).format(now);
  const [year, m] = month.split("-").map(Number);
  return Array.from({ length: 6 }, (_, i) => new Date(Date.UTC(year, m - 1 - i, 1)).toISOString().slice(0, 7));
}
export function aggregateBookingClicks(rows: BookingClickRow[], months: string[]) {
  const counts = new Map<string, Record<string, number>>();
  for (const row of rows) {
    const month = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit" }).format(new Date(row.occurred_at));
    const placement = row.metadata?.placement;
    if (!months.includes(month) || typeof placement !== "string" || !/^[a-z0-9_-]{1,60}$/.test(placement)) continue;
    const count = counts.get(placement) ?? Object.fromEntries(months.map((m) => [m, 0]));
    count[month] += 1;
    counts.set(placement, count);
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([placement, counts]) => ({ placement, counts }));
}