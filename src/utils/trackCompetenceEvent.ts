import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/**
 * Mätning för kompetensfunktionen.
 * Går via PostHog, som endast laddas efter statistik-samtycke i cookie-bannern.
 * Ingen fritext och inga personuppgifter skickas.
 */
type CompetenceEvent =
  | "kompetens_overview_view"
  | "kompetens_guide_view"
  | "kompetens_search"
  | "kompetens_empty_state"
  | "kompetens_partner_card_view"
  | "kompetens_partner_profile_click"
  | "kompetens_partner_contact_click"
  | "kompetens_need_form_open"
  | "kompetens_need_form_submit"
  // Sprint 1.0: förgrening partner/expert från startsidans kompetenskort.
  | "competence_path_opened"
  | "competence_type_selected"
  | "partner_search_started"
  | "expert_requirement_started"
  // Sprint 1.1: partnersökningens tratt (se src/lib/partnerSearchFunnel.ts).
  | "partner_need_selected"
  | "partner_filters_applied"
  | "partner_verification_filter_applied"
  | "partner_profile_viewed"
  | "partner_compare_started"
  | "partner_selfservice_clicked"
  | "partner_selection_help_requested"
  // Sprint 1.0: osäker-vägen skickad till d365.se (Hand Raise, ingen partnerdistribution).
  | "competence_help_requested"
  // Sprint 1.2: expert- och konsultvägen (se src/lib/expertRequirement.ts).
  | "expert_search_started"
  | "expert_role_selected"
  | "expert_specialism_selected"
  | "expert_requirement_submitted";

export function trackCompetenceEvent(
  event: CompetenceEvent,
  props: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === "undefined") return;
  // Egen databasmätning för kompetensresan (anonym, ingen fritext).
  try {
    const meta: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(props)) if (v !== undefined && v !== "") meta[k] = v;
    trackFunnelEvent({ event_type: "competence", event_name: event, metadata: meta });
  } catch { /* ignoreras */ }
  const ph = (window as any).posthog;
  if (!ph || typeof ph.capture !== "function") return;
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined && v !== "") clean[k] = v;
  }
  try {
    ph.capture(event, clean);
  } catch {
    /* mätning får aldrig påverka användaren */
  }
}
