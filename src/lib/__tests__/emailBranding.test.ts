import { describe, it, expect } from "vitest";
import { brandEmail, premiumEmail, EMAIL_OWNER } from "../../../supabase/functions/_shared/email-branding";

describe("Site email branding and routing", () => {
  it("uses the verified site sender, owner replies and legal footer for buyer emails", () => {
    const email = brandEmail({ from: "old", to: ["buyer@company.test"], subject: "Er plan", html: "<p>Dynamics 365</p>" });
    expect(email.from).toBe("Thomas Laine | D365.SE <info@d365.se>");
    expect(email.reply_to).toBe(EMAIL_OWNER);
    expect(email.html).toContain("Moveahead AB (Dynamic Factory)");
    expect(email.html).toContain("tel:+46722324060");
    expect(email.html).toContain("Dynamics&nbsp;365");
    expect(email.html).toContain('data-d365-email="premium"');
  });
  it("keeps partner direct replies and PDF attachments unchanged", () => {
    const attachments = [{ filename: "underlag.pdf", content: "unchanged" }];
    const email = brandEmail({ from: "old", to: ["partner@company.test"], subject: "Förfrågan", reply_to: "buyer@company.test", attachments });
    expect(email.reply_to).toBe("buyer@company.test");
    expect(email.to).toEqual(["partner@company.test"]);
    expect(email.attachments).toBe(attachments);
  });
  it("sends internal notifications only to Thomas and normalizes owner copies", () => {
    const email = brandEmail({ from: "old", to: ["info@d365.se", EMAIL_OWNER], subject: "Notis", reply_to: "buyer@company.test", bcc: ["info@d365.se", EMAIL_OWNER] });
    expect(email.to).toEqual([EMAIL_OWNER]);
    expect(email.reply_to).toBe(EMAIL_OWNER);
    expect(email.bcc).toEqual([EMAIL_OWNER]);
  });
  it("turns raw preformatted summaries into readable paragraphs and does not wrap twice", () => {
    const html = premiumEmail("<pre>Behov\nFörsäljning\n\nAI\nUndersök vidare</pre>", "Er plan");
    expect(html).not.toContain("<pre");
    expect(html).toContain("Försäljning");
    expect(premiumEmail(html, "Er plan")).toBe(html);
  });
});