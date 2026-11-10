import { describe, expect, it } from "vitest";
import { agreementPriceRows } from "@/utils/generatePartnerAgreementPdf";

describe("partneravtalets prisbilaga", () => {
  it("visar Premium 995 kr/mån eller 7 990 kr/år för ett produktområde", () => {
    expect(agreementPriceRows()[0][1].replace(/\s/g, " ")).toBe("995 kr/mån eller 7 990 kr/år");
  });
  it("visar ISV Presence 5 990 kr/år", () => {
    expect(agreementPriceRows()[3][1].replace(/\s/g, " ")).toBe("5 990 kr/år");
  });
  it("visar expertförmedling 40/80 kr per timme", () => {
    expect(agreementPriceRows()[6][1]).toContain("40 kr (Premium) / 80 kr (grundprofil)");
  });
});
