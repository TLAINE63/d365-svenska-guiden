import { trackPartnerView } from "@/utils/trackPartnerView";
import { trackPartnerEvent } from "@/utils/trackPartnerEvent";

/**
 * Global kortklicksspårning.
 *
 * Tidigare loggades "klick på partnerkort" bara från PartnerCard, vilket gjorde
 * att klick från startsidans grid, branschlistor, sökresultat, jämförelsevyn
 * och partnerförslag aldrig räknades. Här fångas alla länkar till
 * /partner/<slug> med en delegerad lyssnare, så statistiken blir komplett.
 */
const RECENT_WINDOW_MS = 3000;
const recent = new Map<string, number>();

const parseSlug = (href: string): string | null => {
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const m = url.pathname.match(/^\/partner\/([^/?#]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
};

export function initPartnerLinkClickTracking(): () => void {
  if (typeof document === "undefined") return () => {};

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;

    const slug = parseSlug(anchor.getAttribute("href") || "");
    if (!slug) return;

    // Klick från partnerns egen profil räknas inte som kortklick.
    if (window.location.pathname.startsWith(`/partner/${slug}`)) return;

    const now = Date.now();
    const last = recent.get(slug) || 0;
    if (now - last < RECENT_WINDOW_MS) return;
    recent.set(slug, now);

    const pageSource = window.location.pathname;
    void trackPartnerView(slug, "card_click", pageSource, null);
    trackPartnerEvent({
      event: "partner_profile_view",
      partnerSlug: slug,
      metadata: { via: "card_click", page: pageSource },
    });
  };

  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
