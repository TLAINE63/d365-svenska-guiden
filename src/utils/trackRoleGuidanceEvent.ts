import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type RoleGuidanceEvent =
  | "role_selector_viewed"
  | "role_selected"
  | "role_recommendation_viewed"
  | "role_area_clicked"
  | "role_guide_clicked"
  | "role_partner_clicked";

export function trackRoleGuidanceEvent(event: RoleGuidanceEvent, metadata: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  trackFunnelEvent({ event_type: "role_guidance", event_name: event, metadata });

  const posthog = (window as Window & {
    posthog?: { capture?: (name: string, properties: Record<string, string>) => void };
  }).posthog;
  if (typeof posthog?.capture !== "function") return;
  try {
    posthog.capture(event, metadata);
  } catch {
    // Mätning får aldrig påverka vägledningen.
  }
}