/**
 * Fire-and-forget funnel event tracker.
 * Used to measure where visitors drop off in the conversion funnel
 * (CTA view → click → analysis start/complete → PDF → lead).
 *
 * Never blocks UI. Uses sendBeacon when available (best for unload events),
 * falls back to fetch() with keepalive.
 */

const EXCLUDE_TRACKING_KEY = "d365_exclude_from_tracking";

/**
 * Anonymous measurement – no cookies, no personal data.
 * Only the internal exclusion flag stops tracking.
 */
function isTrackingAllowed(): boolean {
  // Beslut 2026-09-01: ingen exkludering – alla besökare räknas.
  if (typeof window === "undefined") return false;
  return true;
}

function getSessionId(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const key = "visitor_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

export type FunnelEventType =
  | "cta_view"
  | "cta_click"
  | "analysis_start"
  | "analysis_step"
  | "analysis_complete"
  | "pdf_download"
  | "content_view";

export interface FunnelEventPayload {
  event_type: FunnelEventType;
  event_name: string;
  page_path?: string;
  step_number?: number;
  metadata?: Record<string, unknown>;
}

export function trackFunnelEvent(payload: FunnelEventPayload): void {
  try {
    if (!isTrackingAllowed()) return;
    if (typeof window === "undefined") return;

    // Skip admin pages
    if (window.location.pathname.startsWith("/admin")) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-funnel-event`;
    const body = JSON.stringify({
      ...payload,
      page_path: payload.page_path ?? window.location.pathname,
      session_id: getSessionId(),
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}
