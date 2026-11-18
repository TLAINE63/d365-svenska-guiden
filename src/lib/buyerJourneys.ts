/**
 * Generalplan 2027, implementationspaket 1: intern klassificering av rådgivningsärenden
 * efter de fem köpresorna. Deterministisk och bara för admin; påverkar aldrig kvalificering,
 * rekommendationer eller partnerrelevans.
 *
 * Köpresan bestäms i första hand av besökarens uttryckliga val och delade projektkontext
 * (advisory_cases.journey_selection / journey_context). Hjälpvägen (origin_placement) används
 * bara som ledtråd när inga uttryckliga signaler finns, och behovsguiden antas aldrig betyda systembyte.
 */
export type BuyerJourney = "valja" | "befintlig" | "partner" | "isv" | "specialist";
export type JourneyBasis = "uttryckligt" | "ledtrad" | "okand";

export const BUYER_JOURNEY_LABEL: Record<BuyerJourney, string> = {
  valja: "Välja och implementera",
  befintlig: "Utveckla befintlig miljö",
  partner: "Utvärdera eller byta partner",
  isv: "ISV- och tilläggslösningar",
  specialist: "Dynamics-specialister",
};

export const JOURNEY_BASIS_LABEL: Record<JourneyBasis, string> = {
  uttryckligt: "Enligt kundens val",
  ledtrad: "Ledtråd från hjälpvägen",
  okand: "Ej fastställd",
};

export interface JourneyClassification {
  primary: BuyerJourney | null;
  secondary: BuyerJourney[];
  basis: JourneyBasis;
}

type Sel = Record<string, unknown> | null | undefined;
const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Uttryckliga avsikter som ärendet redan sparar (intent_type, initial_intent, intent). */
const INTENT_JOURNEYS: Record<string, BuyerJourney[]> = {
  ExpertRequirement: ["specialist"],
  CompetenceSearch: ["specialist"],
  PartnerChange: ["partner"],
  IsvRequirement: ["isv"],
  ExistingDevelopment: ["befintlig"],
  ExistingAI: ["befintlig"],
  ExistingOther: ["befintlig"],
  ExistingSupport: ["befintlig", "partner"],
};

/** Befintlig kunds val på /befintlig-kund/. */
const OPTION_JOURNEYS: Record<string, BuyerJourney[]> = {
  vidareutveckla: ["befintlig"],
  ai: ["befintlig"],
  annat: ["befintlig"],
  support: ["befintlig", "partner"],
  kompetens: ["befintlig", "specialist"],
  partnersamarbete: ["befintlig", "partner"],
};

/** Hjälpvägen som ensam ledtråd. Ingångar som inte säger något om situationen saknas med flit. */
const PLACEMENT_HINT: Record<string, BuyerJourney> = {
  expert_requirement: "specialist",
  partner_switch: "partner",
  partner_relationship_review: "partner",
  compare: "partner",
  partner_search: "partner",
  second_opinion: "partner",
  existing_dynamics: "befintlig",
  isv_product_help: "isv",
  tool_result: "valja",
  cost_help: "valja",
};

const EXISTING_CONTEXT = /befintlig dynamics\s?365-kund|kör redan dynamics|befintlig kund/i;

function contextLines(project: Sel): string[] {
  return Object.values(project || {}).flatMap((v) => (Array.isArray(v) ? v : [v])).filter((v): v is string => typeof v === "string");
}

export function classifyBuyerJourney(selection: Sel, project: Sel, placement: string | null | undefined): JourneyClassification {
  const sel = selection || {};
  const found: BuyerJourney[] = [];
  const add = (list?: BuyerJourney[]) => { for (const j of list || []) if (!found.includes(j)) found.push(j); };

  // 1. Uttryckliga val i ärendet.
  if (s(sel.ordered_by) || s(sel.assignment_role) || s(sel.role)) add(["specialist"]);
  add(OPTION_JOURNEYS[s(sel.option)]);
  for (const key of ["intent_type", "initial_intent", "intent"]) add(INTENT_JOURNEYS[s(sel[key])]);
  // 2. Delad projektkontext (t.ex. Min D365-plans situationsrad).
  if (contextLines(project).some((l) => EXISTING_CONTEXT.test(l))) add(["befintlig"]);
  // En uttrycklig önskan om ett nytt CRM- eller affärssystem räknas bara när inget pekar på befintlig miljö.
  if (s(sel.initial_intent) === "BuyerProject" && s(sel.need) && !found.includes("befintlig") && found.length) add(["valja"]);

  if (found.length) return { primary: found[0], secondary: found.slice(1), basis: "uttryckligt" };

  const hint = placement ? PLACEMENT_HINT[placement] : undefined;
  if (hint) return { primary: hint, secondary: [], basis: "ledtrad" };
  return { primary: null, secondary: [], basis: "okand" };
}
