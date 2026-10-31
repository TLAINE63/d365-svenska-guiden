/**
 * Sprint 2.2 Funnelmätning. Översätter befintliga mäthändelser till ett gemensamt
 * resemått i tre nivåer: 1) progression, 2) Hand Raise till d365.se, 3) leverantörskontakt
 * (självservice) respektive buyer-approved introduction (förmedlad kontakt, loggas av databasen).
 * Självservice, kontakt till d365.se och förmedlad kontakt hålls alltid isär.
 * Analysen används aldrig för att ändra ranking automatiskt.
 */
export type JourneyType = "solution" | "partner" | "expert" | "cost" | "existing" | "isv";
export type CanonicalEvent =
  | "journey_started"
  | "journey_progressed"
  | "contact_d365_submitted"
  | "supplier_selfservice_clicked";

export const JOURNEY_LABEL: Record<JourneyType, string> = {
  solution: "CRM- eller affärssystem (ERP)",
  partner: "Partner",
  expert: "Expert/konsult",
  cost: "Kostnad",
  existing: "Befintlig Dynamics 365",
  isv: "ISV",
};

type Resolver = JourneyType | ((m: Record<string, unknown>) => JourneyType | null);

const HERO_JOURNEY: Record<string, JourneyType | null> = {
  new_system: "solution",
  cost: "cost",
  existing_customer: "existing",
  competence: null, // besökaren väljer partner eller expert i nästa steg
};

/** Befintliga händelser → resenivå och funnel. Händelser som inte finns här påverkar inte funnelmåtten. */
export const JOURNEY_EVENT_MAP: Record<string, { canonical: CanonicalEvent; journey: Resolver }> = {
  // Start
  homepage_journey_selected: { canonical: "journey_started", journey: (m) => HERO_JOURNEY[String(m.journey_type)] ?? null },
  solution_journey_started: { canonical: "journey_started", journey: "solution" },
  partner_search_started: { canonical: "journey_started", journey: "partner" },
  expert_search_started: { canonical: "journey_started", journey: "expert" },
  competence_type_selected: { canonical: "journey_started", journey: (m) => (m.competence_type === "expert" ? "expert" : m.competence_type === "partner" ? "partner" : null) },
  cost_journey_started: { canonical: "journey_started", journey: "cost" },
  existing_dynamics_option_selected: { canonical: "journey_started", journey: "existing" },
  second_opinion_view: { canonical: "journey_started", journey: "existing" },
  isv_product_viewed: { canonical: "journey_started", journey: "isv" },
  // Progression
  business_need_selected: { canonical: "journey_progressed", journey: "solution" },
  solution_area_viewed: { canonical: "journey_progressed", journey: "solution" },
  assessment_started: { canonical: "journey_progressed", journey: "solution" },
  assessment_completed: { canonical: "journey_progressed", journey: "solution" },
  assessment_selfservice_continued: { canonical: "journey_progressed", journey: "solution" },
  partner_need_selected: { canonical: "journey_progressed", journey: "partner" },
  partner_filters_applied: { canonical: "journey_progressed", journey: "partner" },
  partner_verification_filter_applied: { canonical: "journey_progressed", journey: "partner" },
  partner_profile_viewed: { canonical: "journey_progressed", journey: "partner" },
  partner_compare_started: { canonical: "journey_progressed", journey: "partner" },
  expert_role_selected: { canonical: "journey_progressed", journey: "expert" },
  expert_specialism_selected: { canonical: "journey_progressed", journey: "expert" },
  expert_requirement_started: { canonical: "journey_progressed", journey: "expert" },
  cost_calculation_completed: { canonical: "journey_progressed", journey: "cost" },
  cost_next_step_clicked: { canonical: "journey_progressed", journey: "cost" },
  second_opinion_to_partner_switch: { canonical: "journey_progressed", journey: "existing" },
  second_opinion_to_existing: { canonical: "journey_progressed", journey: "existing" },
  isv_vendor_viewed: { canonical: "journey_progressed", journey: "isv" },
  isv_verification_filter_applied: { canonical: "journey_progressed", journey: "isv" },
  // Hand Raise till d365.se
  solution_assessment_requested: { canonical: "contact_d365_submitted", journey: "solution" },
  solution_advice_requested: { canonical: "contact_d365_submitted", journey: "solution" },
  assessment_contact_requested: { canonical: "contact_d365_submitted", journey: "solution" },
  partner_selection_help_requested: { canonical: "contact_d365_submitted", journey: "partner" },
  partner_profile_help_requested: { canonical: "contact_d365_submitted", journey: "partner" },
  competence_help_requested: { canonical: "contact_d365_submitted", journey: "partner" },
  expert_requirement_submitted: { canonical: "contact_d365_submitted", journey: "expert" },
  cost_help_requested: { canonical: "contact_d365_submitted", journey: "cost" },
  existing_dynamics_help_requested: { canonical: "contact_d365_submitted", journey: "existing" },
  partner_relationship_review_requested: { canonical: "contact_d365_submitted", journey: "existing" },
  second_opinion_submit: { canonical: "contact_d365_submitted", journey: "existing" },
  isv_product_help_requested: { canonical: "contact_d365_submitted", journey: "isv" },
  question_submitted: { canonical: "contact_d365_submitted", journey: "knowledge" },
  // Självservice till leverantör (ingen kontaktdata följer med)
  partner_selfservice_clicked: { canonical: "supplier_selfservice_clicked", journey: "partner" },
  isv_product_selfservice_clicked: { canonical: "supplier_selfservice_clicked", journey: "isv" },
};

const CONVERSION: Record<CanonicalEvent, { conversion_type: string; recipient: string }> = {
  journey_started: { conversion_type: "progression", recipient: "none" },
  journey_progressed: { conversion_type: "progression", recipient: "none" },
  contact_d365_submitted: { conversion_type: "contact_d365", recipient: "d365" },
  supplier_selfservice_clicked: { conversion_type: "supplier_selfservice", recipient: "supplier" },
};

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : typeof v === "number" ? String(v) : null);

/**
 * Returnerar den gemensamma resehändelsen för en befintlig händelse, med sprintens dimensioner.
 * session_id och tidpunkt sparas av mätfunktionen på varje rad. Fritext följer aldrig med.
 */
export function canonicalJourneyEvent(eventName: string, meta: Record<string, unknown>, pagePath: string): { name: CanonicalEvent; metadata: Record<string, string> } | null {
  const def = JOURNEY_EVENT_MAP[eventName];
  if (!def) return null;
  const journey = typeof def.journey === "function" ? def.journey(meta) : def.journey;
  if (!journey) return null;
  const conv = CONVERSION[def.canonical];
  const md: Record<string, string | null> = {
    journey_id: str(meta.journey_id),
    original_event: eventName,
    journey_type: journey,
    source_page: str(meta.source_page) ?? pagePath,
    initial_intent: str(meta.initial_intent),
    intent_type: str(meta.intent_type),
    conversion_type: conv.conversion_type,
    recipient: def.canonical === "supplier_selfservice_clicked" ? (journey === "isv" ? "isv" : "partner") : conv.recipient,
    product_context: str(meta.product) ?? str(meta.area) ?? str(meta.product_id) ?? str(meta.apps) ?? str(meta.product_area),
    competence_type: str(meta.competence_type),
    verification_status: str(meta.information_status) ?? str(meta.verification_status),
    partner_slug: str(meta.partner_slug),
  };
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(md)) if (v) out[k] = v;
  return { name: def.canonical, metadata: out };
}
