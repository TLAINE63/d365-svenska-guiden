// Lightweight funnel tracking helper. Pushes GA4 events via gtag when
// available, and falls back to GTM's dataLayer. Safe on SSR and when
// analytics have been blocked (consent, ad blockers, etc.).

type EventParams = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

export function trackFunnelEvent(eventName: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as AnalyticsWindow;
    const payload: EventParams = { ...params };
    if (typeof w.gtag === "function") {
      w.gtag("event", eventName, payload);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: eventName, ...payload });
    }
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[funnel]", eventName, payload);
    }
  } catch {
    /* best-effort */
  }
}

// Deduplicate identical events within a single tab session (e.g. prevent
// StrictMode double-firing "start" or repeated "result_view" on remount).
const fired = new Set<string>();
export function trackFunnelEventOnce(key: string, eventName: string, params: EventParams = {}): void {
  if (fired.has(key)) return;
  fired.add(key);
  trackFunnelEvent(eventName, params);
}
