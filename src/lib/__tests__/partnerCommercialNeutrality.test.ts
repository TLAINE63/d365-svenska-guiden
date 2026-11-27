import { describe, expect, it } from "vitest";
import { filterAndSortPartners, getSizeMatchBonus } from "@/hooks/usePartnerFilters";
import type { DatabasePartner } from "@/hooks/usePartners";

const partners = ["Alpha", "Beta", "Gamma"].map((name, i) => ({
  id: String(i), name, agreement_signed: false, is_featured: false,
  product_filters: { bc: { industries: ["Tillverkningsindustri"], companySize: ["50–249"], geography: ["Sverige"], ranking: 1 } },
})) as unknown as DatabasePartner[];
describe("Premium och Grundprofil har samma relevansvillkor", () => {
  it.each([true, false])("avtal eller rikare Premium-presentation påverkar inte ordning, randomize=%s", random => {
    const premium = partners.map(p => ({ ...p, agreement_signed: p.name === "Gamma", is_featured: true,
      description: "En mycket längre Premiumbeskrivning med marknadsföring", logo_url: "logo.webp" }));
    const order = (list: DatabasePartner[]) => filterAndSortPartners(list, "bc", "Tillverkningsindustri", "Sverige", null, null, random).map(p => p.id);
    expect(order(premium)).toEqual(order(partners));
  });
  it("storleksrelevans är identisk för samma kompetens oavsett kommersiell status", () => {
    expect(getSizeMatchBonus(partners[0], "bc", "50–249")).toBe(5);
    expect(getSizeMatchBonus({ ...partners[0], agreement_signed: true, is_featured: true }, "bc", "50–249")).toBe(5);
  });
  it("kommersiell status ändrar inte heller ordning med storleksurval", () => {
    const order = (list: DatabasePartner[]) => filterAndSortPartners(list, "bc", "Tillverkningsindustri", "Sverige", "50–249").map(p => p.id);
    expect(order(partners.map(p => ({ ...p, agreement_signed: p.name === "Gamma" })))).toEqual(order(partners));
  });
});