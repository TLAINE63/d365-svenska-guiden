import { describe, it, expect } from "vitest";
import { isvSolutionsForIndustry, prioritizeResellers } from "@/lib/industryIsvSolutions";
import type { IsvSolution } from "@/data/bcIsvSolutions";

const s = (id: string, extra: Partial<IsvSolution>) => ({ id, name: id, vendor: id, ...extra }) as IsvSolution;
const all = [
  s("b", { industryFocus: ["manufacturing"], products: ["Business Central"] }),
  s("a", { industryFocus: ["Tillverkning"], products: ["Finance & Supply Chain Management"] }),
  s("c", { industryFocus: ["retail"] }),
];

describe("industryIsvSolutions", () => {
  it("matchar bransch via översatta taggar och produkt", () => {
    expect(isvSolutionsForIndustry(all, "tillverkning").map((x) => x.id)).toEqual(["a", "b"]);
    expect(isvSolutionsForIndustry(all, "Tillverkning", "Business Central").map((x) => x.id)).toEqual(["b"]);
  });
  it("lyfter återförsäljare först utan att ta bort andra", () => {
    const ps = [{ slug: "x" }, { slug: "y" }, { slug: "z" }];
    expect(prioritizeResellers(ps, s("q", { partnerSlugs: ["z"] })).map((p) => p.slug)).toEqual(["z", "x", "y"]);
    expect(prioritizeResellers(ps, null)).toEqual(ps);
  });
});
