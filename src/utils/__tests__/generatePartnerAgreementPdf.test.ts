import { describe, expect, it } from "vitest";
import { agreementPriceRows } from "@/utils/generatePartnerAgreementPdf";

describe("partneravtalets prisbilaga", () => {
  it("visar Premium 995 kr/mån eller 7 990 kr/år för ett produktområde", () => {
    expect(agreementPriceRows()[0][1].replace(/\s/g, " ")).toBe("995 kr/mån eller 7 990 kr/år");
  });
  it("visar ISV Presence 5 990 kr/år", () => {
    expect(agreementPriceRows()[3][1].replace(/\s/g, " ")).toBe("5 990 kr/år");
  });
  it("visar expertförmedling 50 kr per timme för alla", () => {
    expect(agreementPriceRows()[5][1]).toBe("50 kr per debiterad timme");
    expect(agreementPriceRows().some((r) => /kundmöte/i.test(r[0]))).toBe(false);
  });
});
