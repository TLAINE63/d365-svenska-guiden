import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/**
 * Sprint Conversion & Trust: tre kontaktnivåer som mäts likadant i alla formulär.
 * 1 fråga till d365.se, 2 rådgivning med d365.se, 3 direkt partnerkontakt.
 * Bara nivå, ingång och sidtyp följer med, aldrig namn, e-post eller fritext.
 */
export type ContactLevel = "question" | "advisory" | "partner";
export type ContactStage = "started" | "submitted";

export const CONTACT_LEVEL_EVENTS: Record<ContactStage, string> = {
  started: "contact_level_started",
  submitted: "contact_level_submitted",
};

/** Rådgivningsformulärets ingång avgör nivån; "question" är nivå 1, övriga ingångar nivå 2. */
export function contactLevelFor(advisoryPlacement: string | null | undefined): ContactLevel {
  if (!advisoryPlacement) return "partner";
  return advisoryPlacement === "question" ? "question" : "advisory";
}

export function trackContactLevel(stage: ContactStage, level: ContactLevel, meta: { placement?: string | null; page_type?: string | null; partner_count?: number } = {}) {
  trackFunnelEvent({
    event_type: "engagement",
    event_name: CONTACT_LEVEL_EVENTS[stage],
    metadata: { level, placement: meta.placement ?? null, page_type: meta.page_type ?? null, ...(meta.partner_count != null ? { partner_count: meta.partner_count } : {}) },
  });
}
