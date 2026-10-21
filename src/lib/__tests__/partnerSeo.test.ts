import { describe, expect, it } from "vitest";
import { basicPartnerSeoDescription, basicPartnerSeoTitle } from "@/lib/partnerSeo";
import { buildSeoTitle } from "@/lib/seoTitle";

describe("grundprofilernas sökmotortexter", () => {
  it("titeln ryms inom 60 tecken med varumärke utan att kapas", () => {
    const t = buildSeoTitle(basicPartnerSeoTitle("Azets"));
    expect(t).toBe("Azets – Dynamics 365-partner i Sverige | d365.se");
    expect(t.length).toBeLessThanOrEqual(60);
  });

  it("långa namn tappar 'i Sverige' i stället för att kapas", () => {
    expect(basicPartnerSeoTitle("Active Business Solutions")).toBe("Active Business Solutions – Dynamics 365-partner");
  });

  it("beskrivningen nämner observerade produkter och håller max 155 tecken", () => {
    const d = basicPartnerSeoDescription("Azets", ["Business Central"]);
    expect(d).toContain("(Business Central)");
    expect(d.length).toBeLessThanOrEqual(155);
  });
});
