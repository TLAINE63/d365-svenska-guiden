import { describe, it, expect } from "vitest";
import { fitMetaDescription } from "./metaDescription";

const SUFFIXES = ["Jämför partners och lösningar på d365.se, den svenska guiden till Dynamics 365.", "Guide inför system- och partnerval på d365.se."];

describe("fitMetaDescription", () => {
  it("never returns more than 160 characters", () => {
    const long = "Köparsidiga jämförelser för Dynamics 365 Business Central, Finance & Supply Chain, Sales, Customer Service, Customer Insights, Contact Center och Field Service mot många alternativ på marknaden.";
    expect(fitMetaDescription(long, SUFFIXES).length).toBeLessThanOrEqual(160);
  });

  it("cuts long text at the last full sentence", () => {
    const text = "Copilot i Microsoft Dynamics 365 ingår i licensen. AI för Finance, Sales och Customer Service. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner.";
    expect(fitMetaDescription(text)).toBe("Copilot i Microsoft Dynamics 365 ingår i licensen. AI för Finance, Sales och Customer Service.");
  });

  it("does not treat d365.se as a sentence end", () => {
    const text = "Svar på vanliga frågor om Microsoft Dynamics 365, affärssystem och CRM: kostnad, licenser, tidplan, partnerval och förvaltning. Köparsidig vägledning från d365.se.";
    expect(fitMetaDescription(text)).not.toMatch(/d365\.$/);
  });

  it("adds only a suffix that fits completely", () => {
    const out = fitMetaDescription("Din personliga matchningsprofil, motivering och nästa steg för Dynamics 365 Sales.", SUFFIXES);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith(".")).toBe(true);
  });
});
