import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/** Del 5: anonyma lead-händelser. Lagras i funnel_events (event_type "lead_steg"), aldrig PII. */
export const LEAD_EVENTS = ["nasta_steg_visad", "nasta_steg_klick", "forfragan_paborjad", "forfragan_skickad", "verktyg_resultat", "verktyg_sparat", "partner_tillagd"] as const;
export type LeadEvent = (typeof LEAD_EVENTS)[number];

const once = new Set<string>();
export function trackLeadStep(handelse: LeadEvent, sidtyp: string, opts: { once?: boolean } = {}): void {
  if (typeof window === "undefined") return;
  const key = `${handelse}|${window.location.pathname}|${sidtyp}`;
  if (opts.once) { if (once.has(key)) return; once.add(key); }
  trackFunnelEvent({ event_type: "lead_steg", event_name: handelse, metadata: { sidtyp: sidtyp.slice(0, 40) } });
}
