import { describe, expect, it } from "vitest";
import { agreementPriceRows } from "@/utils/generatePartnerAgreementPdf";

describe("partneravtalets prisbilaga", () => {
  it("visar Premium 995 kr/mån eller 7 990 kr/år för ett produktområde", () => {
    expect(agreementPriceRows()[0][1].replace(/\s/g, " ")).toBe("995 kr/mån eller 7 990 kr/år");
  });
  it("visar ISV Presence 4 990 kr/år", () => {
    expect(agreementPriceRows()[3][1].replace(/\s/g, " ")).toBe("4 990 kr/år");
  });
  it("visar mötesavgift per band och inga fasta expertavgifter", () => {
    const rows = agreementPriceRows().map((r) => r[1].replace(/\s/g, " "));
    expect(rows).toContain("Mötesavgift 2 000 kr (Premium) / 5 000 kr (Grundprofil)");
    expect(rows.some((r) => r.includes("7 500"))).toBe(false);
  });
});
