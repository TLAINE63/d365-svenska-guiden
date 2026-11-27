export const NEWSLETTER_VERSION = "nl-2026-11";
export const NEWSLETTER_COLUMNS = ["email", "first_name", "last_name", "company", "title", "list", "status", "subscribed_at", "confirmed_at", "unsubscribed_at", "source_page", "partner_slug", "isv_slug", "site", "consent_text_version", "contact_optout"];
export type NewsletterList = "kopare" | "partner" | "isv";
export type NewsletterStatus = "vantar" | "aktiv" | "avregistrerad";
export type Subscriber = {
  id: string; email: string; first_name?: string | null; last_name?: string | null;
  company?: string | null; title?: string | null; list: NewsletterList; status: NewsletterStatus;
  subscribed_at: string; confirmed_at: string | null; unsubscribed_at: string | null;
  source_page?: string | null; partner_slug?: string | null; isv_slug?: string | null;
  consent_text_version: string; contact_optout?: boolean | null;
};
export function newsletterStats(rows: Subscriber[], now = Date.now()) {
  const cutoff = now - 30 * 86400000;
  return (["kopare", "partner", "isv"] as const).map(list => {
    const items = rows.filter(r => r.list === list);
    return { list, active: items.filter(r => r.status === "aktiv").length,
      new: items.filter(r => Date.parse(r.subscribed_at) >= cutoff).length,
      unsubscribed: items.filter(r => r.unsubscribed_at && Date.parse(r.unsubscribed_at) >= cutoff).length };
  });
}
export function newsletterExportRow(row: Subscriber): Record<string, string> {
  return Object.fromEntries(NEWSLETTER_COLUMNS.map(key => {
    if (key === "contact_optout") return [key, row.contact_optout ? "true" : "false"];
    const value = key === "site" ? "d365.se" : row[key as keyof Subscriber];
    return [key, typeof value === "string" ? value : ""];
  }));
}
// A resubscribe request must not erase the recipient's previous opt-out.
export function shouldIssueConfirmation(row: { status: NewsletterStatus; confirmation_sent_at?: string | null } | null, now = Date.now()) {
  return !row || (row.status !== "aktiv" && (!row.confirmation_sent_at || now - Date.parse(row.confirmation_sent_at) >= 86400000));
}