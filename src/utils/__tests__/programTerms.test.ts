import { describe, expect, it } from "vitest";
import { termsPriceRows } from "../programTerms";

describe("områdesspecifika prisbilagor", () => {
  it("partner innehåller tre prenumerationsnivåer utan förmedlingsavgifter", () => {
    expect(termsPriceRows("partner").map((row) => row[1].replace(/\s/g, " "))).toEqual([
      "995 kr/mån eller 7 990 kr/år", "1 295 kr/mån eller 9 990 kr/år", "1 495 kr/mån eller 11 990 kr/år",
    ]);
  });
  it("ISV inkluderar grundavgift och extra produkt", () => {
    expect(termsPriceRows("isv").map((row) => row[1].replace(/\s/g, " "))).toEqual(["5 990 kr/år", "995 kr/år"]);
  });
  it("förmedling har samma villkor för alla, utan mötesavgift", () => {
    expect(termsPriceRows("commission").map((row) => row[1].replace(/\s/g, " "))).toEqual([
      "5 000 kr", "10 000 kr", "3 500 kr", "7 500 kr", "2,5 %", "50 kr/debiterad timme",
    ]);
  });
});