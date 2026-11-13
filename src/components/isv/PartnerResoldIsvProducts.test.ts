import { describe, it, expect } from "vitest";
import { isvMatchesTab, resoldProductsFor } from "./PartnerResoldIsvProducts";

describe("ISV-återförsäljare på partnerprofil", () => {
  it("placerar produkten under rätt produktflik", () => {
    expect(isvMatchesTab(["Business Central"], "bc")).toBe(true);
    expect(isvMatchesTab(["Business Central"], "crm")).toBe(false);
    expect(isvMatchesTab(["Finance & Supply Chain Management"], "fsc")).toBe(true);
    expect(isvMatchesTab(["Sales"], "crm")).toBe(true);
  });
  it("visar bara produkter där ISV:n angett partnern", () => {
    const list = [
      { id: "a", partnerSlugs: ["x"], products: ["Business Central"] },
      { id: "b", partnerSlugs: ["y"], products: ["Business Central"] },
    ] as any;
    expect(resoldProductsFor(list, "x", "bc").map((s: any) => s.id)).toEqual(["a"]);
  });
});
