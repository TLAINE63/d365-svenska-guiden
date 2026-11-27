import { describe, expect, it } from "vitest";
import { agreementPriceRows } from "@/utils/generatePartnerAgreementPdf";

describe("partneravtalets prisbilaga", () => {
  it("visar Premium 8 000 kr/år (667 kr/mån) eller 1 000 kr/mån för ett produktområde", () => {
    expect(agreementPriceRows()[0][1].replace(/\s/g, " ")).toBe("8 000 kr/år (motsvarar 667 kr/mån) eller 1 000 kr/mån");
  });
  it("visar ISV Presence 5 000 kr/år", () => {
    expect(agreementPriceRows()[3][1].replace(/\s/g, " ")).toBe("5 000 kr/år");
  });
  it("visar gemensam mötesavgift och inga fasta expertavgifter", () => {
    const rows = agreementPriceRows().map((r) => r[1].replace(/\s/g, " "));
    expect(rows).toContain("Mötesavgift 0 kr (Premium och Grundprofil)");
    expect(rows.some((r) => r.includes("7 500"))).toBe(false);
  });
});
