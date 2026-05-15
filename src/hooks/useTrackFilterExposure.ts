import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isExcludedFromTracking } from "@/hooks/useVisitorTracking";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";
const SESSION_KEY = "visitor_session_id";
const DEDUPE_KEY = "filter_exposure_dedupe_v1";

interface ExposurePartner {
  slug: string;
  id?: string | null;
}

interface UseTrackFilterExposureOpts {
  partners: ExposurePartner[];
  pagePath: string;
  filterContext?: Record<string, unknown>;
  enabled?: boolean;
}

function hasCookieConsent(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
}
function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
}

/**
 * Logs filter exposures (which partners were shown in filter results) to the backend.
 * Debounces: max 1 row per (session, partner_slug, page_path) per 24h via sessionStorage.
 */
export function useTrackFilterExposure({
  partners,
  pagePath,
  filterContext = {},
  enabled = true,
}: UseTrackFilterExposureOpts) {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (pagePath.startsWith("/admin")) return;
    if (isExcludedFromTracking()) return;
    if (!hasCookieConsent()) return;
    if (!partners.length) return;

    // Debounce: collect after the user "settles" on a filter result for ~1.5s
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        const sessionId = getSessionId();
        const dedupeRaw = sessionStorage.getItem(DEDUPE_KEY);
        const dedupe: Record<string, number> = dedupeRaw ? JSON.parse(dedupeRaw) : {};
        const cutoff = Date.now() - 24 * 3600 * 1000;
        // Clean up old entries
        for (const k of Object.keys(dedupe)) {
          if (dedupe[k] < cutoff) delete dedupe[k];
        }

        const exposures: any[] = [];
        for (const p of partners.slice(0, 50)) {
          if (!p?.slug) continue;
          const key = `${p.slug}|${pagePath}`;
          if (dedupe[key]) continue;
          dedupe[key] = Date.now();
          exposures.push({
            partner_slug: p.slug,
            partner_id: p.id || null,
            page_path: pagePath,
            filter_context: filterContext,
            session_id: sessionId,
          });
        }

        if (!exposures.length) return;
        sessionStorage.setItem(DEDUPE_KEY, JSON.stringify(dedupe));

        // Fire-and-forget
        supabase.functions
          .invoke("track-filter-exposure", { body: { exposures } })
          .catch(() => {});
      } catch {
        // ignore
      }
    }, 1500);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, pagePath, JSON.stringify(partners.map((p) => p.slug)), JSON.stringify(filterContext)]);
}
