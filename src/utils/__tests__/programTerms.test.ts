import { describe, expect, it } from "vitest";
import { termsPriceRows } from "../programTerms";

describe("områdesspecifika prisbilagor", () => {
  it("partner innehåller tre prenumerationsnivåer utan förmedlingsavgifter", () => {
    expect(termsPriceRows("partner").map((row) => row[1].replace(/\s/g, " "))).toEqual([
      "995 kr/mån eller 8 000 kr/år", "1 295 kr/mån eller 9 990 kr/år", "1 495 kr/mån eller 11 990 kr/år",
    ]);
  });
  it("ISV inkluderar grundavgift och extra produkt", () => {
    expect(termsPriceRows("isv").map((row) => row[1].replace(/\s/g, " "))).toEqual(["6 000 kr/år", "500 kr/år", "3 000 kr"]);
  });
  it("förmedling följer prismodellen 2026-11-24 med band efter produktområde", () => {
    const v = Object.fromEntries(termsPriceRows("commission").map(([k, val]) => [k, val.replace(/\s/g, " ")]));
    expect(v["Band 1: Business Central, fristående Power Platform och Copilot"]).toBe("Mötesavgift 1 000 kr (Premium) / 3 000 kr (Grundprofil)");
    expect(v["Band 2: CRM"]).toBe("Mötesavgift 1 500 kr (Premium) / 4 000 kr (Grundprofil)");
    expect(v["Band 3: Finance, SCM, Project Operations, Commerce, Human Resources"]).toBe("Mötesavgift 2 000 kr (Premium) / 5 000 kr (Grundprofil)");
    expect(v["Avgift vid affär"]).toContain("högst 100 000 kr per affär");
    expect(v["ISV: Finder’s fee"]).toBe("Pausad tills vidare");
    expect(Object.keys(v).some((k) => k.includes("Business Referral"))).toBe(false);
  });
});