import type { IsvSolution } from "@/data/bcIsvSolutions";

/**
 * Föreslår relevanta tilläggslösningar (ISV) ur den gemensamma katalogen
 * utifrån vald Dynamics 365-produkt, bransch och valda funktionsområden.
 * Används av kravspecifikation, behovsanalys och ERP-jämförelsen.
 */

export type IsvScope =
  | "bc"
  | "fscm"
  | "erp"
  | "sales"
  | "customer-insights"
  | "customer-service"
  | "field-service"
  | "contact-center";

export interface SuggestedIsv {
  solution: IsvSolution;
  score: number;
  reasons: string[];
}

const has = (arr: string[] | undefined, needle: string) =>
  (arr || []).some((v) => v.toLowerCase().includes(needle));

function inScope(s: IsvSolution, scope: IsvScope): boolean {
  const products = (s.products || []).map((p) => p.toLowerCase());
  const rel = (v?: string) => v === "yes" || v === "partial";
  switch (scope) {
    case "bc":
      return products.some((p) => p.includes("business central")) || products.length === 0;
    case "fscm":
      return (
        products.some((p) => p.includes("finance") || p.includes("supply chain")) ||
        rel(s.financeRelevance) ||
        rel(s.supplyChainRelevance)
      );
    case "erp":
      return inScope(s, "bc") || inScope(s, "fscm");
    case "sales":
      return rel(s.salesRelevance);
    case "customer-insights":
      return rel(s.customerInsightsRelevance);
    case "customer-service":
      return rel(s.customerServiceRelevance);
    case "field-service":
      return rel(s.fieldServiceRelevance);
    case "contact-center":
      return rel(s.contactCenterRelevance);
    default:
      return true;
  }
}

/** Nyckelord per funktionsområde i verktygen (id → sökord i katalogen). */
const AREA_KEYWORDS: Record<string, string[]> = {
  // ERP / kravspec ERP
  ekonomi: ["ap automation", "faktura", "ekonomi", "redovisning", "rapportering", "fp&a", "budget", "betal", "expense"],
  lager: ["wms", "lager", "logistik", "plock", "warehouse"],
  produktion: ["produktion", "planering", "aps", "shop floor", "mes", "kvalitet"],
  forsaljning: ["order", "e-handel", "commerce", "cpq", "offert", "pris"],
  inkop: ["inköp", "procure", "leverantör", "edi"],
  projekt: ["projekt", "resurs", "tid"],
  hr: ["hr", "lön", "personal"],
  service: ["service", "underhåll", "fält"],
  transport: ["frakt", "transport", "ta-system", "distribution"],
  koncern: ["konsolidering", "koncern", "flerbolag", "rapportering"],
  integration: ["integration", "edi", "connector", "api", "dokument"],
  // Sales / CE
  lead_mgmt: ["lead", "prospekt", "marketing automation"],
  opportunity: ["pipeline", "försäljning", "sales"],
  account_contact: ["kunddata", "cdp", "adress", "datakvalitet"],
  activities: ["aktivitet", "uppföljning", "produktivitet"],
  quotes_orders: ["cpq", "offert", "avtal", "e-sign", "pris"],
  analytics: ["analys", "rapport", "bi", "insikt"],
  automation: ["automation", "copilot", "ai", "workflow"],
  email_marketing: ["e-post", "kampanj", "marketing automation", "journey"],
  // Customer Service / Field Service / Contact Center
  omnichannel: ["omnikanal", "telefoni", "chatt", "contact center", "ccaas"],
  telefoni: ["telefoni", "voice", "ccaas"],
  knowledge: ["kunskap", "knowledge", "självbetjäning"],
  sla: ["sla", "ärende", "case"],
  faltservice: ["fält", "schemaläggning", "planering", "underhåll"],
};

const solutionText = (s: IsvSolution) =>
  [
    s.name,
    s.vendor,
    s.category,
    s.subcategory || "",
    s.shortDescription,
    s.what,
    (s.tags || []).join(" "),
    (s.useCases || []).join(" "),
  ]
    .join(" ")
    .toLowerCase();

export interface SuggestIsvOptions {
  scope: IsvScope;
  industry?: string | null;
  /** Id:n för valda funktionsområden i verktyget. */
  areas?: string[];
  limit?: number;
}

export function suggestIsvAddons(
  solutions: IsvSolution[],
  { scope, industry, areas = [], limit = 6 }: SuggestIsvOptions,
): SuggestedIsv[] {
  const ind = (industry || "").toLowerCase();
  const scoped = solutions.filter((s) => inScope(s, scope));

  const scored: SuggestedIsv[] = scoped.map((s) => {
    const text = solutionText(s);
    let score = 0;
    const reasons: string[] = [];

    // Funktionsområden
    const matchedAreas: string[] = [];
    for (const area of areas) {
      const kws = AREA_KEYWORDS[area];
      if (!kws) continue;
      if (kws.some((k) => text.includes(k))) matchedAreas.push(area);
    }
    if (matchedAreas.length) {
      score += matchedAreas.length * 6;
      reasons.push("Matchar valda funktionsområden");
    }

    // Bransch
    if (ind) {
      const first = ind.split(/[&,/]/)[0].trim();
      if (has(s.industryFocus, first) || has(s.industries as string[], first)) {
        score += 8;
        reasons.push(`Branschinriktning: ${industry}`);
      }
    }
    if ((s.industries as string[] | undefined)?.includes("Generell")) score += 1;

    // Nordisk/svensk relevans
    if (has(s.geo as string[], "sverige")) {
      score += 3;
      reasons.push("Finns på den svenska marknaden");
    } else if (has(s.geo as string[], "norden")) {
      score += 2;
    }
    if (s.nordicRelevance === "high") score += 2;

    return { solution: s, score, reasons };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.solution.name.localeCompare(b.solution.name, "sv"))
    .slice(0, limit);
}

export const SCOPE_LABEL: Record<IsvScope, string> = {
  bc: "Business Central",
  fscm: "Finance & Supply Chain Management",
  erp: "Business Central / Finance & Supply Chain Management",
  sales: "Sales",
  "customer-insights": "Customer Insights",
  "customer-service": "Customer Service",
  "field-service": "Field Service",
  "contact-center": "Contact Center",
};

/** Härleder funktionsområden ur fritext (utmaningar, KPI:er, integrationer). */
export function deriveAreasFromText(texts: (string | undefined | null)[]): string[] {
  const blob = texts.filter(Boolean).join(" ").toLowerCase();
  return Object.entries(AREA_KEYWORDS)
    .filter(([, kws]) => kws.some((k) => blob.includes(k)))
    .map(([id]) => id);
}
