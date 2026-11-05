import { describe, it, expect } from "vitest";
import { INDUSTRY_ERP_SECTIONS } from "@/data/industryErpSections";
import { INDUSTRY_SHARPENING } from "@/data/industrySharpening";
import { PARTNER_EDITORIAL_FAQ } from "@/data/partnerEditorialFaq";

const bygg = INDUSTRY_ERP_SECTIONS["bygg-entreprenad"];
const faq = PARTNER_EDITORIAL_FAQ["4ps-sweden"];

describe("bygg- och entreprenadsidan", () => {
  it("har rubriken om byggföretag, entreprenad och anläggning", () => {
    expect(bygg.heading).toBe("Affärssystem för byggföretag, entreprenad och anläggning");
  });
  it("har H2-avsnitt om vinstavräkning och om kalkyl med mängdberäkning", () => {
    const h2 = bygg.subSections?.map((s) => s.h2) ?? [];
    expect(h2).toContain("Stöd för successiv vinstavräkning och projektredovisning i byggbranschen");
    expect(h2).toContain("Integrerat kalkylprogram och mängdberäkning");
  });
  it("förklarar affärssystemet och branschpaketet som ett gemensamt spår", () => {
    expect(bygg.marketStandard).toContain("Business Central");
    expect(bygg.marketStandard).toContain("4PS Construct");
  });
  it("länkar till 4PS-profilen och partnerväljaren", () => {
    const targets = [
      ...(bygg.extraLinks ?? []).map((l) => l.to),
      bygg.cta.to,
      ...(bygg.subSections ?? []).flatMap((s) => (s.links ?? []).map((l) => l.to)),
    ];
    expect(targets).toContain("/partner/4ps-sweden/");
    expect(targets.some((t) => t.startsWith("/valjdynamics365partner/"))).toBe(true);
  });
  it("rådgivningsrubriken är 20-minuters rådgivning med Thomas Laine", () => {
    expect(INDUSTRY_SHARPENING["bygg-entreprenad"].advisory?.heading).toBe(
      "Boka 20 minuters kostnadsfri rådgivning kring affärssystem för bygg och entreprenad med Thomas Laine",
    );
  });
});

describe("4PS-profilen", () => {
  it("har frågorna om kostnad och lämplighet för byggbolag", () => {
    const qs = faq.faqs.map((f) => f.q);
    expect(qs).toContain("Vad kostar 4PS Construct?");
    expect(qs).toContain("Är 4PS Construct ett bra affärssystem för byggbolag?");
  });
  it("kostnadsfrågan beskriver licensiering och kostnadsdrivare", () => {
    const kostnad = faq.faqs.find((f) => f.q === "Vad kostar 4PS Construct?")?.a ?? "";
    expect(kostnad).toContain("Business Central");
    expect(kostnad).toContain("antal användare");
    expect(kostnad).toContain("modul");
  });
  it("rådgivningsrubriken är densamma som på branschsidan", () => {
    expect(faq.advisory.heading).toBe(
      "Boka 20 minuters kostnadsfri rådgivning kring affärssystem för bygg och entreprenad med Thomas Laine",
    );
  });
});
