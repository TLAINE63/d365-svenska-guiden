// Gemensam mätning mot backendfunktionen track-event (delas med businesscentral.se).
// Fel får aldrig påverka sidan.
const SESSION_KEY = "d365_session";
const SOURCE_KEY = "d365_source";

type Source = { utm_source?: string | null; utm_medium?: string | null; utm_campaign?: string | null; utm_content?: string | null; utm_term?: string | null; referrer?: string | null; landing_page?: string | null };

export function getTrackSession(): string | null {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) { id = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`; sessionStorage.setItem(SESSION_KEY, id); }
    return id;
  } catch { return null; }
}

export function getTrackSource(): Source {
  try {
    const raw = sessionStorage.getItem(SOURCE_KEY);
    if (raw) return JSON.parse(raw);
    const q = new URLSearchParams(window.location.search);
    const src: Source = {
      utm_source: q.get("utm_source"), utm_medium: q.get("utm_medium"), utm_campaign: q.get("utm_campaign"),
      utm_content: q.get("utm_content"), utm_term: q.get("utm_term"),
      referrer: document.referrer || null, landing_page: window.location.pathname,
    };
    sessionStorage.setItem(SOURCE_KEY, JSON.stringify(src));
    return src;
  } catch { return {}; }
}

/** Initiera session och källa vid första sidvisningen. */
export function initTracking() { getTrackSession(); getTrackSource(); }

export function track(eventName: string, metadata?: Record<string, unknown> | null, partnerSlug?: string | null, productArea?: string | null) {
  try {
    if (typeof window === "undefined") return;
    if (eventName === "partner_profile_view" && partnerSlug) {
      const k = `d365_pv_${partnerSlug}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    }
    const src = getTrackSource();
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-event`, {
      method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({
        event_name: eventName, partner_slug: partnerSlug ?? null, page_path: window.location.pathname,
        session_id: getTrackSession(), product_area: productArea ?? null,
        utm_source: src.utm_source ?? null, utm_medium: src.utm_medium ?? null, utm_campaign: src.utm_campaign ?? null,
        metadata: metadata ?? null,
      }),
    }).catch(() => {});
  } catch { /* ignore */ }
}

/** Partnerns webbplats med d365.se-parametrar, befintliga parametrar behålls. */
export function partnerWebsiteUrl(website?: string | null): string | null {
  if (!website) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`);
    u.searchParams.set("utm_source", "d365.se");
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", "partnerprofil");
    return u.toString();
  } catch { return null; }
}
