/**
 * Central plats för partnerrelaterade CTA-texter och mål.
 * Målet: samma funktion ska alltid heta samma sak på hela sajten.
 */

export const CTA = {
  /** Primär CTA på hela sajten. */
  findPartner: "Hitta rätt partner",
  findPartnerTo: "/valjdynamics365partner/",

  /** Sekundär CTA. */
  needsAnalysis: "Starta behovsanalys",
  needsAnalysisTo: "/ERPbehovsanalys/",

  /** Övriga sekundära vägar. */
  compare: "Jämför partners",
  compareTo: "/jamfor-partners/",
  aiSearch: "Fråga d365.se",
  aiSearchTo: "/fraga/",

  /** Rådgivning – aldrig ordet "oberoende" i kommersiell copy. */
  advisoryHeading: "Prata med d365.se",
  advisoryCta: "Prata med d365.se om ert behov",
  advisoryBullets: [
    "30 minuter om era behov, er lösning eller ert partnerval",
    "Ingen partner deltar i samtalet",
    "Ingen försäljning – fokus på ditt behov och dina alternativ",
  ],
} as const;

/** Bygger länk till partnerväljaren med eventuella förval från ett verktyg. */
export const findPartnerUrl = (params?: { industry?: string; product?: string }) => {
  const qs = new URLSearchParams();
  if (params?.industry) qs.set("industry", params.industry);
  if (params?.product) qs.set("product", params.product);
  const q = qs.toString();
  return q ? `${CTA.findPartnerTo}?${q}` : CTA.findPartnerTo;
};
