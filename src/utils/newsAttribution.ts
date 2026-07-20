/**
 * Client-side attribution: remembers the last Partnernytt article the visitor
 * engaged with so that any subsequent lead / CTA submission can be linked
 * back to the article that drove it.
 *
 * Stored in sessionStorage with a 24h TTL (session is usually shorter).
 */

const STORAGE_KEY = "d365_news_attribution_v1";
const TTL_MS = 24 * 60 * 60 * 1000;

export type NewsAttributionSource =
  | "home_hero"
  | "partnernytt_list"
  | "partner_profile"
  | "related"
  | "detail_view"
  | "product_page"
  | "ai_page"
  | "other";

export interface NewsAttribution {
  news_id: string;
  editorial_title?: string | null;
  partner_slug?: string | null;
  source: NewsAttributionSource;
  set_at: number;
}

export function setNewsAttribution(a: Omit<NewsAttribution, "set_at">): void {
  if (typeof window === "undefined") return;
  try {
    const payload: NewsAttribution = { ...a, set_at: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* swallow */
  }
}

export function getNewsAttribution(): NewsAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NewsAttribution;
    if (!parsed?.news_id) return null;
    if (Date.now() - (parsed.set_at ?? 0) > TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Convenience: returns the two body fields consumed by the submit-lead
 * edge function so callers can spread them straight into a lead payload:
 *
 *   supabase.functions.invoke("submit-lead", {
 *     body: { ...form, ...newsAttributionForLead() }
 *   });
 */
export function newsAttributionForLead(): {
  attribution_news_id?: string;
  attribution_source?: string;
} {
  const a = getNewsAttribution();
  if (!a) return {};
  return {
    attribution_news_id: a.news_id,
    attribution_source: a.source,
  };
}
