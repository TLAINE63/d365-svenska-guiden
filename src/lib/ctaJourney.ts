export interface CtaJourney { label: string; to: string; area: "erp" | "crm" | "migration" | "partner"; keepCopy?: boolean }

/** Nästa beslut efter en konkurrentjämförelse: produktens matchningstest och kalkylator (inte partnerkontakt). */
export const COMPARISON_NEXT: Record<string, { short: string; test: string; calc: string; area: "erp" | "crm" }> = {
  bc: { short: "Business Central", test: "/businesscentral/matchningstest/", calc: "/businesscentral/roi-kalkylator/", area: "erp" },
  fscm: { short: "Finance & Supply Chain Management", test: "/finance-supply-chain-management/matchningstest/", calc: "/finance-supply-chain/roi-kalkylator/", area: "erp" },
  sales: { short: "Sales", test: "/d365sales/matchningstest/", calc: "/d365sales/roi-kalkylator/", area: "crm" },
  "customer-service": { short: "Customer Service", test: "/d365customerservice/matchningstest/", calc: "/d365customerservice/roi-kalkylator/", area: "crm" },
  "customer-insights": { short: "Customer Insights", test: "/d365marketing/matchningstest/", calc: "/d365marketing/roi-kalkylator/", area: "crm" },
  "contact-center": { short: "Contact Center", test: "/d365contactcenter/matchningstest/", calc: "/d365contactcenter/roi-kalkylator/", area: "crm" },
  "field-service": { short: "Field Service", test: "/d365fieldservice/matchningstest/", calc: "/d365fieldservice/roi-kalkylator/", area: "crm" },
};

export function contextualJourney(source = "", goal?: string | null): CtaJourney | null {
  if (/migr|flytta.*moln|uppgradera|uppgradering/i.test(source) || goal === "erp-upgrade" || goal === "erp-new") return { label: "Bedöm vår migrationssituation", to: "/underlag/?area=migration", area: "migration" };
  if (source === "next-step:erp") return { label: "Se vilka lösningar som passar er", to: "/underlag/?area=erp", area: "erp" };
  if (source.startsWith("industry:") || source === "next-step:branscher") return { label: "Se vilka lösningar som passar er verksamhet", to: "/underlag/?area=erp", area: "erp" };
  if (source === "next-step:crm") return { label: "Bedöm vad vi behöver av ett CRM", to: "/underlag/?area=crm", area: "crm" };
  if (source.startsWith("comparison:")) {
    // comparison:<produktnyckel>:<slug> leder till produktens matchningstest; okänt format förblir neutralt.
    const next = COMPARISON_NEXT[source.split(":")[1] ?? ""];
    if (next && source.split(":").length >= 3) return { label: `Testa om ${next.short} passar er`, to: next.test, area: next.area, keepCopy: true };
    return { label: "Gör en första produktbedömning", to: "/underlag/?area=erp", area: "erp" };
  }
  if (/^(next-step:(alla-partners|valj-partner)|product-partners:|partner-guide:)/.test(source)) return { label: "Jämför partners för vårt behov", to: "", area: "partner" };
  return null;
}
