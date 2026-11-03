/** Standard från-datum för adminexporter: 7 dagar bakåt, ÅÅÅÅ-MM-DD i Stockholmstid. */
export function defaultFromDate(now: Date = new Date()): string {
  const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(d);
}
