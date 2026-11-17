import { describe, expect, it } from "vitest";
import { termsPriceRows } from "../programTerms";

describe("områdesspecifika prisbilagor", () => {
  it("partner innehåller tre prenumerationsnivåer utan förmedlingsavgifter", () => {
    expect(termsPriceRows("partner").map((row) => row[1].replace(/\s/g, " "))).toEqual([
      "995 kr/mån eller 7 990 kr/år", "1 295 kr/mån eller 9 990 kr/år", "1 495 kr/mån eller 11 990 kr/år",
    ]);
  });
  it("ISV inkluderar grundavgift och extra produkt", () => {
    expect(termsPriceRows("isv").map((row) => row[1].replace(/\s/g, " "))).toEqual(["5 990 kr/år", "995 kr/år", "2 990 kr"]);
  });
  it("förmedling följer prismodellen 2026-11-17 med mötesavgift, 2,5 % och ISV 0 %", () => {
    const v = Object.fromEntries(termsPriceRows("commission").map(([k, val]) => [k, val.replace(/\s/g, " ")]));
    expect(v["Nya projekt under 250 tkr: mötesavgift"]).toBe("1 500 kr (Premium och Basic)");
    expect(v["Nya projekt över 1 Mkr: avgift vid affär"]).toBe("2,5 %, högst 100 000 kr");
    expect(v["Partnerbyte Finance & SCM: mötesavgift"]).toBe("6 000 kr (Premium) / 9 000 kr (Basic)");
    expect(v["ISV: Finder’s fee"]).toBe("0 %");
  });
});