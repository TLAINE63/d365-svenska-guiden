/**
 * Alla kostnadsfria beslutsverktyg på d365.se.
 * Används bl.a. för att räkna ut antalet verktyg i hero-statistiken,
 * så att siffran alltid speglar vad sajten faktiskt innehåller.
 */
export interface FreeTool {
  path: string;
  label: string;
  category: "behovsanalys" | "matchningstest" | "kalkylator" | "kravspec" | "partnerval" | "diagnos";
}

export const FREE_TOOLS: FreeTool[] = [
  // Behovsanalyser
  { path: "/ERPbehovsanalys/", label: "Behovsanalys ERP (affärssystem)", category: "behovsanalys" },
  { path: "/CRMbehovsanalys/", label: "Behovsanalys Sälj & Marknad", category: "behovsanalys" },
  { path: "/kundservice-behovsanalys/", label: "Behovsanalys Kundservice & Fältservice", category: "behovsanalys" },

  // Matchningstester
  { path: "/businesscentral/matchningstest/", label: "Matchningstest Business Central", category: "matchningstest" },
  { path: "/finance-supply-chain-management/matchningstest/", label: "Matchningstest Finance & Supply Chain", category: "matchningstest" },
  { path: "/d365sales/matchningstest/", label: "Matchningstest Sales", category: "matchningstest" },
  { path: "/d365customerservice/matchningstest/", label: "Matchningstest Customer Service", category: "matchningstest" },
  { path: "/d365marketing/matchningstest/", label: "Matchningstest Customer Insights", category: "matchningstest" },
  { path: "/d365fieldservice/matchningstest/", label: "Matchningstest Field Service", category: "matchningstest" },
  { path: "/d365contactcenter/matchningstest/", label: "Matchningstest Contact Center", category: "matchningstest" },

  // Kalkylatorer
  { path: "/implementationskalkylator/", label: "Pris- och omfattningskalkylator", category: "kalkylator" },
  { path: "/businesscentral/roi-kalkylator/", label: "ROI-kalkylator Business Central", category: "kalkylator" },
  { path: "/finance-supply-chain/roi-kalkylator/", label: "ROI-kalkylator Finance & Supply Chain", category: "kalkylator" },
  { path: "/d365sales/roi-kalkylator/", label: "ROI-kalkylator Sales", category: "kalkylator" },
  { path: "/d365customerservice/roi-kalkylator/", label: "ROI-kalkylator Customer Service", category: "kalkylator" },
  { path: "/d365marketing/roi-kalkylator/", label: "ROI-kalkylator Customer Insights", category: "kalkylator" },
  { path: "/d365fieldservice/roi-kalkylator/", label: "ROI-kalkylator Field Service", category: "kalkylator" },
  { path: "/d365contactcenter/roi-kalkylator/", label: "ROI-kalkylator Contact Center", category: "kalkylator" },

  // Kravspecifikationer
  { path: "/kravspecifikation/", label: "Kravspecifikation ERP", category: "kravspec" },
  { path: "/kravspecifikation-sales/", label: "Kravspecifikation Sales", category: "kravspec" },
  { path: "/kravspecifikation-marketing/", label: "Kravspecifikation Marketing", category: "kravspec" },
  { path: "/kravspecifikation-kundservice/", label: "Kravspecifikation Kundservice", category: "kravspec" },

  // Partnerval & diagnos
  { path: "/valjdynamics365partner/", label: "Partnerguiden – hitta rätt partner", category: "partnerval" },
  { path: "/jamfor-partners/", label: "Jämför partners sida vid sida", category: "partnerval" },
  { path: "/upphandlingsguiden/", label: "Upphandlingsguiden", category: "diagnos" },
  { path: "/ai-readiness/", label: "AI Readiness Assessment", category: "diagnos" },
  { path: "/beslutsmognad/", label: "Beslutsmognadsindex", category: "diagnos" },
];

export const FREE_TOOL_COUNT = FREE_TOOLS.length;
