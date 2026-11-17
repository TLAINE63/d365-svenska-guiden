import { describe, expect, it } from "vitest";
import { agreementPriceRows } from "@/utils/generatePartnerAgreementPdf";

describe("partneravtalets prisbilaga", () => {
  it("visar Premium 995 kr/mån eller 7 990 kr/år för ett produktområde", () => {
    expect(agreementPriceRows()[0][1].replace(/\s/g, " ")).toBe("995 kr/mån eller 7 990 kr/år");
  });
  it("visar ISV Presence 5 990 kr/år", () => {
    expect(agreementPriceRows()[3][1].replace(/\s/g, " ")).toBe("5 990 kr/år");
  });
  it("visar fast expertavgift och partnerbytesavgift", () => {
    expect(agreementPriceRows().some((r) => r[1].replace(/\s/g, " ").startsWith("7 500 kr (Premium)"))).toBe(true);
    expect(agreementPriceRows().some((r) => r[0] === "Partnerbyte: mötesavgift")).toBe(true);
  });
});
