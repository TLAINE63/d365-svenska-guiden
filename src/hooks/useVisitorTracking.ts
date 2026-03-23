import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const EXCLUDE_TRACKING_KEY = "d365_exclude_from_tracking";
const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

// Check if current visitor should be excluded from tracking
export function isExcludedFromTracking(): boolean {
  return localStorage.getItem(EXCLUDE_TRACKING_KEY) === "true";
}

// Set exclusion status
export function setExcludeFromTracking(exclude: boolean): void {
  if (exclude) {
    localStorage.setItem(EXCLUDE_TRACKING_KEY, "true");
  } else {
    localStorage.removeItem(EXCLUDE_TRACKING_KEY);
  }
}

// Check if user has accepted cookies
function hasCookieConsent(): boolean {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
}

// Generate or retrieve session ID
function getSessionId(): string {
  const key = "visitor_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function useVisitorTracking() {
  const location = useLocation();
  const pageLoadTime = useRef<number>(Date.now());
  const hasTrackedPage = useRef<string>("");
  const isFirstPage = useRef<boolean>(true);

  useEffect(() => {
    const currentPath = location.pathname;

    // Don't track: admin pages, excluded visitors, no cookie consent, or already tracked this path
    if (
      currentPath.startsWith("/admin") || 
      hasTrackedPage.current === currentPath ||
      isExcludedFromTracking() ||
      !hasCookieConsent()
    ) {
      return;
    }

    // Track the page visit (insert new row)
    const trackVisit = async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-visitor`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              page_path: currentPath,
              referrer: document.referrer || null,
              session_id: getSessionId(),
              is_bounce: isFirstPage.current,
            }),
          }
        );
      } catch (error) {
        console.debug("Visitor tracking failed:", error);
      }
    };

    trackVisit();
    hasTrackedPage.current = currentPath;
    pageLoadTime.current = Date.now();
    isFirstPage.current = false;

    // Update time on page when leaving (no new insert, just update)
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageLoadTime.current) / 1000);
      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-visitor`,
        JSON.stringify({
          action: "update",
          page_path: currentPath,
          session_id: getSessionId(),
          time_on_page_seconds: timeOnPage,
        })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);
}
