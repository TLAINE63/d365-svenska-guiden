import { describe, expect, it } from "vitest";
import { agreementPriceRows } from "@/utils/generatePartnerAgreementPdf";

describe("partneravtalets prisbilaga", () => {
  it("visar Premium 1 000 kr/mån eller 8 000 kr/år för ett produktområde", () => {
    expect(agreementPriceRows()[0][1].replace(/\s/g, " ")).toBe("1 000 kr/mån eller 8 000 kr/år");
  });
  it("visar ISV Presence 5 000 kr/år", () => {
    expect(agreementPriceRows()[3][1].replace(/\s/g, " ")).toBe("5 000 kr/år");
  });
  it("visar gemensam mötesavgift och inga fasta expertavgifter", () => {
    const rows = agreementPriceRows().map((r) => r[1].replace(/\s/g, " "));
    expect(rows).toContain("Mötesavgift 0 kr (Premium) / 3 500 kr (Grundprofil)");
    expect(rows.some((r) => r.includes("7 500"))).toBe(false);
  });
});
