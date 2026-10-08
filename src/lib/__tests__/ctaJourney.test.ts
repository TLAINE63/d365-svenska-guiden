import { describe, expect, it } from "vitest";
import { contextualJourney } from "../ctaJourney";
import { parsePlan, planNextStep } from "../d365Plan";
import { emptyProfile } from "../buyerProfile";

describe("Human-first journey", () => {
  it.each(["next-step:erp", "next-step:crm", "comparison:bc-sap"])("keeps %s neutral even before product selection", (source) => {
    const route = contextualJourney(source);
    expect(route?.to).toContain("/underlag/?area=");
    expect(route?.to).not.toContain("product=");
  });
  it("uses a distinct migration path", () => {
    expect(contextualJourney("article:migrering-fran-nav")?.area).toBe("migration");
  });
  it("keeps product partner selection explicit", () => {
    expect(contextualJourney("product-partners:business-central")?.label).toBe("Jämför partners för vårt behov");
  });
  it.each([null, "broken", "null", "[]", '{"needs":7,"dimensions":{"erp:Lager":"made-up"}}'])("tolerates incomplete storage %s", (raw) => {
    expect(parsePlan(raw).needs).toEqual([]);
    expect(parsePlan(raw).dimensions).toEqual({});
  });
  it("never defaults an unanswered ERP plan to F&O", () => {
    expect(planNextStep(emptyProfile(), {}, { area: "erp", needs: [], dimensions: {} }, 0).to).toBe("/jamfor/");
  });
  it("does not turn a neutral CRM or ERP journey into partners because of an old product", () => {
    expect(planNextStep(emptyProfile(), { product: "Business Central" }, { area: "crm", needs: [], dimensions: {} }, 0).to).toBe("/crm/");
    expect(planNextStep(emptyProfile(), { product: "Business Central" }, { area: "erp", needs: [], dimensions: {} }, 0).to).toBe("/jamfor/");
  });
  it("does not reuse an old assessment to bypass a neutral evaluation", () => {
    const profile = emptyProfile();
    profile.assessment.fscm_level = "below";
    expect(planNextStep(profile, { product: "Business Central" }, { area: "crm", needs: [], dimensions: {} }, 0).to).toBe("/crm/");
  });
  it("keeps a migration plan in investigation until assessed", () => {
    expect(planNextStep(emptyProfile(), {}, { area: "migration", needs: [], dimensions: {} }, 0).to).toBe("#komplettera");
  });
  it("uses existing shortlist once partners are saved", () => {
    expect(planNextStep(emptyProfile(), {}, parsePlan(null), 2).to).toBe("/kortlista/");
  });
});
import { contextualJourney as cj2 } from "@/lib/ctaJourney";
import { describe as d2, it as i2, expect as e2 } from "vitest";
d2("bransch-journey", () => {
  i2("branschsidor leder till verksamhetsanpassad bedömning", () => {
    e2(cj2("industry:tillverkning")?.label).toBe("Se vilka lösningar som passar er verksamhet");
    e2(cj2("next-step:branscher")?.to).toBe("/underlag/?area=erp");
  });
});
