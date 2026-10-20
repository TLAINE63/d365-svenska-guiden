import { describe, it, expect } from "vitest";
import { diagnose, partnerHref } from "../existingDiagnosis";

describe("existing customer diagnosis", () => {
  it("unsure cause leads to second opinion first", () => {
    expect(diagnose({ symptom: "unsure_cause" })?.need).toBe("second_opinion");
  });
  it("partner issue without dialog does not recommend switching", () => {
    expect(diagnose({ symptom: "partner_issue", partnerTalked: "no" })?.need).toBe("second_opinion");
    expect(diagnose({ symptom: "partner_issue", partnerTalked: "yes" })?.need).toBe("switch_partner");
  });
  it("asks follow-up before result when needed", () => {
    expect(diagnose({ symptom: "partner_issue" })).toBeNull();
    expect(diagnose({ symptom: "new_need" })).toBeNull();
  });
  it("support result is not a contact form", () => {
    expect(diagnose({ symptom: "support_issues" })?.steps.some((s) => s.href.startsWith("/kontakt"))).toBe(false);
  });
  it("known product follows to partner search, unknown is never guessed", () => {
    expect(partnerHref("Business Central")).toContain("apps=Business%20Central");
    expect(partnerHref("Finance & SCM")).toContain("apps=Finance");
    expect(partnerHref("Okänd")).not.toContain("apps=");
  });
});
