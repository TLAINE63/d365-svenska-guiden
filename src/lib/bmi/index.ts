// Frontend access to the shared Beslutsmognadsindex v2 config. Scoring happens only in bmi-score.
export * from "../../../supabase/functions/_shared/bmi";
import type { BmiResult } from "../../../supabase/functions/_shared/bmi";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type BmiResponse = BmiResult & { submission_id: string };
export const BMI_DRAFT_KEY = "bmi_v2_draft";
export const BMI_RESULT_KEY = "bmi_v2_result";

export function bmiTrack(event_type: "analysis_start" | "analysis_step" | "analysis_complete", event_name: string, metadata: Record<string, unknown> = {}) {
  trackFunnelEvent({ event_type, event_name, metadata: { tool: "beslutsmognad", ...metadata } });
}
