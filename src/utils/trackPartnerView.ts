import { supabase } from "@/integrations/supabase/client";
import { isExcludedFromTracking } from "@/hooks/useVisitorTracking";
import { trackUnderlagEvent } from "@/utils/trackUnderlagEvent";

export type PartnerViewType = "card_click" | "profile_visit";

/**
 * Tracks a partner profile view (card click in lists or direct profile visit).
 * Fire-and-forget – never blocks UI.
 */
export const trackPartnerView = async (
  partnerSlug: string,
  viewType: PartnerViewType,
  pageSource: string,
  partnerId?: string | null
) => {
  if (typeof window !== "undefined" && isExcludedFromTracking()) return;
  if (viewType === "profile_visit") trackUnderlagEvent("partner_profile_opened", { partner: partnerSlug });
  try {
    await supabase.functions.invoke("track-partner-view", {
      body: {
        partner_slug: partnerSlug,
        partner_id: partnerId || null,
        view_type: viewType,
        page_source: pageSource,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      },
    });
  } catch (err) {
    console.error("trackPartnerView failed:", err);
  }
};
