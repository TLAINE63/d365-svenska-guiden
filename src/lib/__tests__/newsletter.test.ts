import { describe, expect, it } from "vitest";
import { NEWSLETTER_COLUMNS, newsletterExportRow, newsletterStats, shouldIssueConfirmation, type Subscriber } from "../../../supabase/functions/_shared/newsletterModel";
const row: Subscriber = { id: "a", email: "test@example.se", list: "kopare", status: "aktiv", subscribed_at: "2026-11-23T14:05:00Z", confirmed_at: "2026-11-23T14:06:00Z", unsubscribed_at: null, consent_text_version: "nl-2026-11" };
describe("Nyhetsbrev: tre separata listor och CRM-export", () => {
  it("counts active recipients separately for kopare, partner and isv", () => {
    const stats = newsletterStats([row, { ...row, list: "partner" }, { ...row, list: "isv", status: "avregistrerad", unsubscribed_at: "2026-11-23T14:07:00Z" }], Date.parse("2026-11-23T15:00:00Z"));
    expect(stats.map(s => [s.list, s.active])).toEqual([["kopare", 1], ["partner", 1], ["isv", 0]]);
    expect(stats[2].unsubscribed).toBe(1);
  });
  it("counts only new and unsubscribed within the last 30 days", () => {
    const stats = newsletterStats([row, { ...row, subscribed_at: "2026-10-01T00:00:00Z", status: "avregistrerad", unsubscribed_at: "2026-10-01T00:00:00Z" }], Date.parse("2026-11-23T15:00:00Z"));
    expect(stats[0]).toEqual({ list: "kopare", active: 1, new: 1, unsubscribed: 0 });
  });
  it("exports opted-out recipients without tokens in the exact CRM order", () => {
    const exported = newsletterExportRow({ ...row, status: "avregistrerad", unsubscribed_at: "2026-11-23T14:07:00Z", token: "secret", unsubscribe_token: "secret" } as Subscriber);
    expect(Object.keys(exported).join(",")).toBe("email,first_name,last_name,company,title,list,status,subscribed_at,confirmed_at,unsubscribed_at,source_page,partner_slug,isv_slug,site,consent_text_version,contact_optout");
    expect(exported.contact_optout).toBe("false");
    expect(newsletterExportRow({ ...row, contact_optout: true } as Subscriber).contact_optout).toBe("true");
    expect(exported.status).toBe("avregistrerad"); expect(exported.site).toBe("d365.se"); expect(exported.unsubscribed_at).toBe("2026-11-23T14:07:00Z");
    expect(NEWSLETTER_COLUMNS).not.toContain("token"); expect(Object.values(exported)).not.toContain("secret");
  });
  it("never sends confirmation to active recipients or repeatedly within 24 hours", () => {
    const now = Date.parse("2026-11-23T15:00:00Z");
    expect(shouldIssueConfirmation({ status: "aktiv" }, now)).toBe(false);
    expect(shouldIssueConfirmation({ status: "vantar", confirmation_sent_at: "2026-11-23T14:00:00Z" }, now)).toBe(false);
    expect(shouldIssueConfirmation({ status: "avregistrerad", confirmation_sent_at: "2026-11-21T14:00:00Z" }, now)).toBe(true);
    expect(shouldIssueConfirmation(null, now)).toBe(true);
  });
});
