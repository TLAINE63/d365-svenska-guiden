import { describe, expect, it } from "vitest";
import { filterBasicPartners, hasAnyObservedProduct } from "@/lib/basicPartnerMatch";
import type { BasicPartner } from "@/hooks/useBasicPartners";

const bp = (name: string, extra: Partial<BasicPartner> = {}) => ({ id: name, name, slug: name, ...extra }) as unknown as BasicPartner;

describe("Grundprofiler i partnerlistor", () => {
  it("partner utan produkt eller bransch räknas inte som listbar", () => {
    expect(hasAnyObservedProduct(bp("Tom"))).toBe(false);
    expect(hasAnyObservedProduct(bp("BC", { observed_products: { bc: true } } as any))).toBe(true);
  });

  it("utan filter visas bara partners med dokumenterad produkt", () => {
    const list = filterBasicPartners([bp("Tom"), bp("BC", { observed_products: { bc: true } } as any)], { applications: [] });
    expect(list.map((p) => p.name)).toEqual(["BC"]);
  });

  it("produktfilter släpper bara igenom partners med den produkten", () => {
    const list = filterBasicPartners(
      [bp("BC", { observed_products: { bc: true } } as any), bp("Sales", { observed_products: { sales: true } } as any)],
      { applications: ["Business Central"] },
    );
    expect(list.map((p) => p.name)).toEqual(["BC"]);
  });
});
