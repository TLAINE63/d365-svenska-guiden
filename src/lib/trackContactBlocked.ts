import { supabase } from "@/integrations/supabase/client";

/**
 * Anonymously log that a buyer attempted to contact a Basic (non-connected) partner.
 * NO buyer identity is sent – only partner_id + a coarse source context.
 * Fire-and-forget: never blocks UX, never surfaces errors.
 */
export function trackContactBlocked(
  partnerId: string,
  sourceContext: "basic_card" | "compare_mix" | "list_card" | "matching" = "basic_card",
): void {
  try {
    void supabase.functions.invoke("track-contact-blocked", {
      body: { partner_id: partnerId, source_context: sourceContext },
    });
  } catch {
    // Swallow – privacy > analytics.
  }
}
