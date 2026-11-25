import { describe, expect, it } from "vitest";
import { termsPriceRows } from "../programTerms";

describe("områdesspecifika prisbilagor", () => {
  it("partner innehåller tre prenumerationsnivåer utan förmedlingsavgifter", () => {
    expect(termsPriceRows("partner").map((row) => row[1].replace(/\s/g, " "))).toEqual([
      "8 000 kr/år (motsvarar 667 kr/mån) eller 1 000 kr/mån", "10 500 kr/år (motsvarar 875 kr/mån) eller 1 300 kr/mån", "12 000 kr/år (motsvarar 1 000 kr/mån) eller 1 500 kr/mån",
    ]);
  });
  it("ISV inkluderar grundavgift och extra produkt", () => {
    expect(termsPriceRows("isv").map((row) => row[1].replace(/\s/g, " "))).toEqual(["3 500 kr första året (ordinarie 5 000 kr/år)", "500 kr/år", "De första 20 ISV-leverantörerna, första avtalsåret"]);
  });
  it("förmedling följer prislistan 2027 för alla produktområden", () => {
    const v = Object.fromEntries(termsPriceRows("commission").map(([k, val]) => [k, val.replace(/\s/g, " ")]));
    const variants = Object.entries(v).filter(([k]) => k.startsWith('Alla produktområden'));
    expect(variants).toHaveLength(1);
    expect(variants[0][1]).toBe("Mötesavgift 0 kr (Premium) / 3 500 kr (Grundprofil)");
    expect(v["Avgift vid affär"]).toContain("utan maxbelopp");
    expect(v["Avgift vid affär"]).toContain("2,5 % (Premium) eller 5 % (Grundprofil)");
    expect(v["ISV: Affärsförmedling"]).toBe("Pausad tills vidare");
    expect(Object.keys(v).some((k) => k.includes("Business Referral"))).toBe(false);
  });
  it("Premiumavtalet: kostnadsfria möten och 2,5 % utan avräkning", () => {
    const v = Object.fromEntries(termsPriceRows("commission_premium").map(([k, val]) => [k, val.replace(/\s/g, " ")]));
    expect(v["Kvalificerat möte"]).toBe("Kostnadsfritt");
    expect(v["Avgift vid affär"]).toMatch(/^2,5 %/);
    expect(v["Avräkning"]).toBeUndefined();
  });
  it("Grundprofilavtalet: 3 500 kr per möte, 5 % och full avräkning", () => {
    const v = Object.fromEntries(termsPriceRows("commission_grund").map(([k, val]) => [k, val.replace(/\s/g, " ")]));
    expect(v["Mötesavgift per kvalificerat möte"]).toBe("3 500 kr");
    expect(v["Avgift vid affär"]).toMatch(/^5 %/);
    expect(v["Tidsfönster"]).toContain("6 månader");
    expect(v["Avräkning"]).toContain("100 %");
  });
});
