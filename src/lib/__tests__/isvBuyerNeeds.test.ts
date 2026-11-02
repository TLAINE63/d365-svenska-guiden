import { describe, it, expect } from "vitest";
import { CATEGORIES } from "@/data/bcIsvSolutions";
import { ISV_BUYER_NEEDS, needForCategory, categoriesForQuery } from "@/lib/isvBuyerNeeds";

describe("isvBuyerNeeds", () => {
  it("maps every catalogue category to exactly one need", () => {
    for (const c of CATEGORIES) {
      const hits = ISV_BUYER_NEEDS.filter((n) => n.categories.includes(c));
      expect(hits.length, c).toBe(1);
    }
  });
  it("WMS belongs to Lager och logistik", () => {
    expect(needForCategory("WMS").id).toBe("lager");
  });
  it("search 'e-faktura' finds EDI category", () => {
    expect(categoriesForQuery("e-faktura").has("EDI / e-faktura")).toBe(true);
  });
});
