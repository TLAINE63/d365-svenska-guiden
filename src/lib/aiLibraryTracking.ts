import { trackFunnelEvent } from "@/lib/funnelTracking";
import { trackFunnelEvent as trackFirstParty } from "@/utils/trackFunnelEvent";
import type { AiExample } from "@/data/aiExamples";

/** AI-exempelbibliotekets händelser. Skickar aldrig personuppgifter eller fri prompttext. */
export type AiLibraryEvent =
  | "ai_library_view" | "ai_category_filter" | "ai_application_filter" | "ai_role_filter" | "ai_type_filter"
  | "ai_example_open" | "ai_prompt_copy" | "ai_related_example_click" | "ai_ai_hub_click"
  | "ai_product_content_click" | "ai_partner_cta_click" | "ai_source_click" | "ai_zero_results"
  | "ai_library_entry_click";

// Skydd mot dubbelregistrering (t.ex. dubbel montering): samma händelse + data inom 1 s räknas en gång.
const recent = new Map<string, number>();

export function trackAi(event: AiLibraryEvent, ex?: AiExample | null, extra: Record<string, string | number | undefined> = {}) {
  const params = {
    ...(ex ? { example_id: ex.id, example_title: ex.title, application: ex.application, category: ex.category, role: ex.role.join(","), ai_type: ex.aiType } : {}),
    ...extra,
  };
  const key = `${event}|${JSON.stringify(params)}`;
  const now = Date.now();
  if ((recent.get(key) ?? 0) > now - 1000) return;
  recent.set(key, now);
  trackFunnelEvent(event, params);
  // Egen anonym lagring för redaktionens uppföljning (ingen PII, ingen prompttext).
  const { example_title: _t, ...stored } = params as Record<string, unknown>;
  trackFirstParty({ event_type: "ai_library", event_name: event, metadata: stored });
}
