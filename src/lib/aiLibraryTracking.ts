import { trackFunnelEvent } from "@/lib/funnelTracking";
import type { AiExample } from "@/data/aiExamples";

/** AI-exempelbibliotekets händelser. Skickar aldrig personuppgifter eller fri prompttext. */
export type AiLibraryEvent =
  | "ai_library_view" | "ai_category_filter" | "ai_application_filter" | "ai_role_filter" | "ai_type_filter"
  | "ai_example_open" | "ai_prompt_copy" | "ai_related_example_click" | "ai_ai_hub_click"
  | "ai_product_content_click" | "ai_partner_cta_click" | "ai_source_click" | "ai_zero_results";

export function trackAi(event: AiLibraryEvent, ex?: AiExample | null, extra: Record<string, string | number | undefined> = {}) {
  trackFunnelEvent(event, {
    ...(ex ? { example_id: ex.id, example_title: ex.title, application: ex.application, category: ex.category, role: ex.role.join(","), ai_type: ex.aiType } : {}),
    ...extra,
  });
}
