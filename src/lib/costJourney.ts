import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/**
 * Sprint 1.5: kostnadsresan. Återanvänder kalkylatorerna och kostnadsguiden; den här modulen
 * håller bara gemensamma val, nästa steg och anonym mätning. Ärendet går till d365.se och
 * blir aldrig automatiskt kvalificerat eller skickat till partners.
 */
export const COST_SOLUTION_AREAS = [
  "Business Central",
  "Finance & Supply Chain Management",
  "Sales",
  "Customer Service",
  "Field Service",
  "Project Operations",
  "Flera lösningar",
  "Vet inte ännu",
] as const;

export const COST_ORG_SIZES = [
  "1–25 användare",
  "26–50 användare",
  "51–100 användare",
  "101–250 användare",
  "251–500 användare",
  "Fler än 500 användare",
  "Vet inte",
] as const;

export const COST_ASSESSMENT_SUBJECTS = [
  "Budget inför beslut",
  "Granska en offert",
  "Jämföra lösningar eller partners",
  "Licenskostnad",
  "Löpande kostnad efter go-live",
] as const;

export const COST_PROJECT_PHASES = [
  "Tidig utvärdering",
  "Förstudie eller kravarbete",
  "Offertfas",
  "Har redan Dynamics 365",
] as const;

export type CostNextStepKey = "compare" | "scope" | "implementation" | "partner_cost";

export interface CostNextStep { key: CostNextStepKey; label: string; text: string; href: string }

/** Nästa steg efter ett kostnadsresultat, alla till befintliga sidor. */
export function costNextSteps(costAnchor?: string): CostNextStep[] {
  return [
    { key: "compare", label: "Jämför lösningar", text: "Se hur alternativen skiljer sig i funktion och kostnad.", href: "/jamfor/" },
    { key: "scope", label: "Bedöm projektets omfattning", text: "Räkna med integrationer, bolag, datamigrering och konsultpris.", href: "/implementationskalkylator/" },
    { key: "implementation", label: "Förstå implementationen", text: "Vad som driver införandet och vad som blir löpande efter go-live.", href: costAnchor ? `/kostnad/#${costAnchor}` : "/kostnad/#per-applikation" },
    { key: "partner_cost", label: "Förstå partnerkostnaden", text: "Hur offerter byggs upp och vad ni bör jämföra mellan partners.", href: "/upphandlingsguiden/" },
  ];
}

/** Kalkylatorns lösningsnycklar → kostnadsguidens avsnitt och etiketter. */
export const SOLUTION_TO_COST: Record<string, { anchor: string; area: (typeof COST_SOLUTION_AREAS)[number] }> = {
  bc: { anchor: "business-central", area: "Business Central" },
  fscm: { anchor: "finance-scm", area: "Finance & Supply Chain Management" },
  sales: { anchor: "sales", area: "Sales" },
  "customer-service": { anchor: "customer-service", area: "Customer Service" },
  "field-service": { anchor: "field-service", area: "Field Service" },
  "project-operations": { anchor: "project-operations", area: "Project Operations" },
};

export interface CostHelpDraft {
  area?: string;
  size?: string;
  subject?: string;
  phase?: string;
}

/** Rader som visas och skickas med i "Få hjälp att bedöma kostnadsbilden". Bara ifyllda fält. */
export function costHelpLines(d: CostHelpDraft, estimate?: string[]): string[] {
  const rows: [string, string | undefined][] = [
    ["Lösningsområde", d.area],
    ["Organisation/användare", d.size],
    ["Bedömningen gäller", d.subject],
    ["Projektfas", d.phase],
  ];
  return [
    ...rows.filter((r): r is [string, string] => !!r[1]).map(([l, v]) => `${l}: ${v}`),
    ...(estimate || []),
  ];
}

const STARTED_KEY = "d365_cost_journey_started";

export type CostEvent = "cost_journey_started" | "cost_calculation_completed" | "cost_next_step_clicked";

export function trackCost(event: CostEvent, metadata: Record<string, unknown> = {}) {
  trackFunnelEvent({ event_type: "cta_click", event_name: event, metadata: { initial_intent: "BuyerProject", ...metadata } });
}

/** Startar kostnadsresan en gång per besök, oavsett ingång. */
export function startCostJourney(page: string) {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STARTED_KEY) === "1") return;
    sessionStorage.setItem(STARTED_KEY, "1");
  } catch { /* ignoreras */ }
  trackCost("cost_journey_started", { source_page: page });
}
