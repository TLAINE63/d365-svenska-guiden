import { describe, expect, it } from "vitest";
import { getPartnerSelectionFacts } from "./partnerSelectionFacts";
import type { DatabasePartner } from "@/hooks/usePartners";
const partner = (data: object) => ({ name: "Test", applications: [], industries: [], ...data } as DatabasePartner);
describe("documented partner selection facts", () => {
  it("does not invent absent fields", () => {
    expect(getPartnerSelectionFacts(partner({}), "bc")).toEqual([]);
  });
  it("keeps product profiles separate", () => {
    const facts = getPartnerSelectionFacts(partner({ product_filters: {
      bc: { industries: ["Handel"], companySize: ["51-200"], geography: ["Sverige"], deliveryProfile: { typicalProjects: "ERP-implementation", managedServices: "Supportavtal" } },
      fsc: { industries: ["Tillverkning"], companySize: ["1000+"], deliveryProfile: { typicalProjects: "Internationella projekt" } },
    } }), "bc");
    expect(facts).toContainEqual({ label: "Typisk kundstorlek", value: "51-200 anställda" });
    expect(facts).toContainEqual({ label: "Förvaltning/support", value: "Supportavtal" });
    expect(JSON.stringify(facts)).not.toMatch(/Tillverkning|1000|Internationella/);
  });
  it("does not interpret customer prose or supplier team size as customer size", () => {
    const facts = getPartnerSelectionFacts(partner({ team_size_bc: 50, product_filters: { bc: { deliveryProfile: { typicalCustomers: "Internationella företag" } } } }), "bc");
    expect(facts.some(f => f.label === "Typisk kundstorlek")).toBe(false);
  });
  it("uses the full Finance product label", () => {
    expect(getPartnerSelectionFacts(partner({ product_filters: { fsc: {} } }), "fsc")).toContainEqual({ label: "Produktområde", value: "Finance & Supply Chain Management (F&O)" });
  });
});
