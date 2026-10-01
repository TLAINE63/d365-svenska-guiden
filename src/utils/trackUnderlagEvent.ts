import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type UnderlagEvent =
  | "test_started"
  | "test_completed"
  | "underlag_viewed"
  | "compare_prefilled"
  | "partner_saved"
  | "partners_compared"
  | "partner_profile_opened"
  | "decision_package_exported"
  | "underlag_sent";

/** Anonyma, cookielösa händelser för underlagsfunneln. track = fscm | crm. */
export function trackUnderlagEvent(name: UnderlagEvent, meta: { track?: "fscm" | "crm"; [k: string]: unknown } = {}) {
  trackFunnelEvent({ event_type: "underlag", event_name: name, metadata: meta });
}
