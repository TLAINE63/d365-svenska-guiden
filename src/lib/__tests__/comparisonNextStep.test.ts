import { describe, it, expect } from "vitest";
import { COMPARISON_NEXT, contextualJourney } from "@/lib/ctaJourney";
import { PRODUCT_COMPARISONS } from "@/data/erpComparisons";

describe("konkurrentjämförelser leder till nästa beslut", () => {
  it("varje jämförelse har matchningstest och kalkylator för sin produkt", () => {
    for (const c of PRODUCT_COMPARISONS) {
      expect(COMPARISON_NEXT[c.productKey]?.test, c.slug).toMatch(/matchningstest\/$/);
      expect(COMPARISON_NEXT[c.productKey]?.calc, c.slug).toMatch(/roi-kalkylator\/$/);
    }
  });
  it("leder inte till partnerkontakt", () => {
    for (const n of Object.values(COMPARISON_NEXT)) {
      expect(n.test).not.toMatch(/partner/);
      expect(n.calc).not.toMatch(/partner/);
    }
  });
  it("CRM-jämförelser räknas som CRM, inte ERP", () => {
    expect(contextualJourney("comparison:sales:sales-vs-hubspot-sales-hub")).toMatchObject({ to: "/d365sales/matchningstest/", area: "crm" });
    expect(contextualJourney("comparison:bc:business-central-vs-odoo")).toMatchObject({ to: "/businesscentral/matchningstest/", area: "erp" });
  });
});
