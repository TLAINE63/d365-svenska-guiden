const stockholm = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(d);

/** Standard från-datum för adminexporter: 7 dagar bakåt, ÅÅÅÅ-MM-DD i Stockholmstid. */
export function defaultFromDate(now: Date = new Date()): string {
  return stockholm(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
}

/** Föregående månad (ÅÅÅÅ-MM) i Stockholmstid. */
export function previousMonth(now: Date = new Date()): string {
  const [y, m] = stockholm(now).split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}
