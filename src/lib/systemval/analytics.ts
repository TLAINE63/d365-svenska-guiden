// Förberedda mätpunkter för Behovsguiden. Endast id:n och enumvärden, aldrig fritext eller personuppgifter.
export type SystemvalEvent =
  | "erp_module_started" | "erp_question_shown" | "erp_question_answered" | "answer_changed"
  | "erp_dialog_completed" | "erp_result_shown" | "solution_result_shown" | "next_step_clicked" | "deep_started" | "deep_completed"
  | "primary_cta_clicked" | "secondary_cta_clicked" | "why_opened" | "answer_changed_from_result" | "plan_started" | "guide_started" | "partner_selection_started";

import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

// Händelser som också sparas i köparresan (anonymt) så att /redaktion kan följa guide → plan → partnerkontakt.
const JOURNEY: Partial<Record<SystemvalEvent, string>> = {
  guide_started: "systemval_guide_started",
  solution_result_shown: "systemval_result",
  plan_started: "systemval_plan_transfer",
};

export function trackSystemval(event: SystemvalEvent, props: Record<string, string | number | boolean> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const w = window as unknown as { dataLayer?: unknown[] };
    (w.dataLayer ??= []).push({ event: `systemval_${event}`, ...props });
    const name = JOURNEY[event];
    if (name) trackFunnelEvent({ event_type: "journey", event_name: name, metadata: { tool: "behovsguide" } });
  } catch { /* ignore */ }
}
