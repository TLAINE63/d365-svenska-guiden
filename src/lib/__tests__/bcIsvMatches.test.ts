import { describe, it, expect } from "vitest";
import { categoriesForBcArea, matchBcIsvAreas } from "@/lib/bcIsvMatches";
import type { IsvSolution } from "@/data/bcIsvSolutions";

const sol = (id: string, vendor: string, category: string, extra: Partial<IsvSolution> = {}) =>
  ({ id, name: id, vendor, category, products: ["Business Central"], ...extra }) as IsvSolution;

describe("bcIsvMatches", () => {
  it("AP-automation mappas till AP automation", () => {
    expect(categoriesForBcArea("AP-automation saknas")).toContain("AP automation");
  });
  it("okänt behov ger inga förslag", () => {
    expect(matchBcIsvAreas(["Helt okänt område"], [sol("a", "V", "AP automation")])).toEqual([]);
  });
  it("max tre per behov och högst en per leverantör", () => {
    const all = [sol("a", "V1", "AP automation"), sol("b", "V1", "AP automation"), sol("c", "V2", "AP automation"), sol("d", "V3", "AP automation"), sol("e", "V4", "AP automation")];
    const [m] = matchBcIsvAreas(["AP-automation saknas"], all);
    expect(m.solutions).toHaveLength(3);
    expect(new Set(m.solutions.map((s) => s.vendor)).size).toBe(3);
  });
  it("lösningar för andra produkter tas inte med", () => {
    expect(matchBcIsvAreas(["AP-automation saknas"], [sol("a", "V", "AP automation", { products: ["Sales"] })])).toEqual([]);
  });
});
