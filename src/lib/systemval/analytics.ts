// Förberedda mätpunkter för Behovsguiden. Endast id:n och enumvärden, aldrig fritext eller personuppgifter.
export type SystemvalEvent =
  | "erp_module_started" | "erp_question_shown" | "erp_question_answered" | "answer_changed"
  | "erp_dialog_completed" | "erp_result_shown" | "solution_result_shown" | "next_step_clicked" | "deep_started" | "deep_completed";

export function trackSystemval(event: SystemvalEvent, props: Record<string, string | number | boolean> = {}): void {
  try {
    if (typeof window === "undefined") return;
    const w = window as unknown as { dataLayer?: unknown[] };
    (w.dataLayer ??= []).push({ event: `systemval_${event}`, ...props });
  } catch { /* ignore */ }
}
