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
  | "kompetens_need_form_submit";

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
