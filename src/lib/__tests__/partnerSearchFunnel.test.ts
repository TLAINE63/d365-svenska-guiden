import { describe, it, expect } from "vitest";
import { PARTNER_NEEDS, intentForNeed, neutralPartnerOrder, countPartnerCases } from "@/lib/partnerSearchFunnel";
import { seededShuffle } from "@/hooks/usePartnerFilters";

describe("Sprint 1.1 partnersökning", () => {
  it("steg 1 har exakt de sju behoven i ordning", () => {
    expect(PARTNER_NEEDS.map((n) => n.label)).toEqual([
      "Nytt projekt eller införande",
      "Vidareutveckla en befintlig lösning",
      "Support och förvaltning",
      "Integrationer och teknisk utveckling",
      "Kompetens och förstärkning",
      "Utvärdera partnersamarbetet",
      "Annat",
    ]);
  });

  it("PartnerChange sätts bara när besökaren väljer att utvärdera partnersamarbetet", () => {
    expect(intentForNeed("utvardera")).toBe("PartnerChange");
    for (const n of PARTNER_NEEDS.filter((x) => x.key !== "utvardera")) expect(intentForNeed(n.key)).toBe("PartnerSearch");
    expect(intentForNeed(null)).toBe("PartnerSearch");
  });

  it("kommersiell status påverkar inte ordningen", () => {
    const base = Array.from({ length: 8 }, (_, i) => ({ id: `p${i}`, agreement_signed: false }));
    const withAgreements = base.map((p, i) => ({ ...p, agreement_signed: i % 2 === 0 }));
    const a = neutralPartnerOrder(base, seededShuffle, 42).map((p) => p.id);
    const b = neutralPartnerOrder(withAgreements, seededShuffle, 42).map((p) => p.id);
    expect(b).toEqual(a);
  });

  it("räknar unika kundcase från profil och produkter", () => {
    expect(countPartnerCases({ customer_examples: ["Acme", "Beta"], product_filters: { bc: { customerExamples: ["acme", "Gamma"] } } })).toBe(3);
    expect(countPartnerCases({})).toBe(0);
  });
});
