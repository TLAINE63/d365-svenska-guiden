import { describe, it, expect } from "vitest";
import { EXISTING_OPTIONS, partnerReviewLines, optionByKey } from "@/lib/existingDynamicsPaths";

describe("befintlig Dynamics 365 (Sprint 1.3)", () => {
  it("visar exakt de sex valen i rätt ordning", () => {
    expect(EXISTING_OPTIONS.map((o) => o.label)).toEqual([
      "Utveckla lösningen vidare",
      "Utforska AI och nya möjligheter",
      "Förbättra support och förvaltning",
      "Hitta Dynamics 365-kompetens",
      "Utvärdera partnersamarbetet",
      "Annat behov",
    ]);
  });

  it("partnersamarbetet ger initial_intent PartnerChange och inget val heter Byt partner", () => {
    expect(optionByKey("partnersamarbete")?.intent).toBe("PartnerChange");
    expect(EXISTING_OPTIONS.some((o) => /byt partner/i.test(o.label))).toBe(false);
  });

  it("utvärderingen skickar bara ifyllda fält", () => {
    expect(partnerReviewLines({ product: "Business Central", works: " ", improve: "Svarstider", horizon: "Inom 3 månader" })).toEqual([
      "Dynamics-produkt: Business Central",
      "Det här behöver förbättras: Svarstider",
      "Tidshorisont: Inom 3 månader",
    ]);
  });
});
