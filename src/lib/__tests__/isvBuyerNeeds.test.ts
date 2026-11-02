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
  it("finance categories used in the live catalogue belong to Ekonomi", () => {
    for (const c of ["Banking & payments", "Finance extensions", "Expense management", "Multi-company", "Lokalisering", "AP automation", "EDI / e-faktura"]) {
      expect(needForCategory(c).id, c).toBe("ekonomi");
    }
  });
  it("production, quality and field categories are never filed under AI/HR", () => {
    expect(needForCategory("MES / Shop floor").id).toBe("projekt");
    expect(needForCategory("Quality management").id).toBe("projekt");
    expect(needForCategory("Inventory planning").id).toBe("lager");
    expect(needForCategory("Field service").id).toBe("falt");
    expect(needForCategory("Sustainability").id).toBe("rapportering");
  });
  it("WMS belongs to Lager och logistik", () => {
    expect(needForCategory("WMS").id).toBe("lager");
  });
  it("search 'e-faktura' finds EDI category", () => {
    expect(categoriesForQuery("e-faktura").has("EDI / e-faktura")).toBe(true);
  });
});
