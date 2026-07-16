import { trackFunnelEvent } from "./trackFunnelEvent";

export type PartnerNewsClickSource =
  | "home_hero"
  | "partnernytt_list"
  | "partner_profile"
  | "related"
  | "other";

interface Args {
  newsId: string;
  editorialTitle?: string | null;
  partnerId?: string | null;
  partnerSlug?: string | null;
  newsType?: string | null;
  productAreas?: string[] | null;
  source: PartnerNewsClickSource;
}

function getViewport(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/**
 * Fire-and-forget click tracking for partner news card links.
 * Persisted via the existing track-funnel-event edge function
 * (event_type=cta_click, event_name=partner_news_card_click).
 */
export function trackPartnerNewsClick(args: Args): void {
  try {
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "partner_news_card_click",
      metadata: {
        news_id: args.newsId,
        editorial_title: args.editorialTitle ?? null,
        partner_id: args.partnerId ?? null,
        partner_slug: args.partnerSlug ?? null,
        news_type: args.newsType ?? null,
        product_areas: args.productAreas ?? null,
        source: args.source,
        viewport: getViewport(),
        viewport_width: typeof window !== "undefined" ? window.innerWidth : null,
      },
    });
  } catch {
    /* swallow */
  }
}
