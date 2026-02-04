import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const EXCLUDE_TRACKING_KEY = "d365_exclude_from_tracking";

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

    // Don't track admin pages, excluded visitors, or if already tracked this path
    if (
      currentPath.startsWith("/admin") || 
      hasTrackedPage.current === currentPath ||
      isExcludedFromTracking()
    ) {
      return;
    }

    // Track the page visit
    const trackVisit = async (isBounce: boolean, timeOnPage?: number) => {
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
              time_on_page_seconds: timeOnPage,
              is_bounce: isBounce,
            }),
          }
        );
      } catch (error) {
        // Silent fail - don't break the app for analytics
        console.debug("Visitor tracking failed:", error);
      }
    };

    // Track initial page view
    trackVisit(isFirstPage.current, undefined);
    hasTrackedPage.current = currentPath;
    pageLoadTime.current = Date.now();
    isFirstPage.current = false;

    // Update with time on page when leaving
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageLoadTime.current) / 1000);
      // Use sendBeacon for reliable delivery during unload
      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-visitor`,
        JSON.stringify({
          page_path: currentPath,
          session_id: getSessionId(),
          time_on_page_seconds: timeOnPage,
          is_bounce: false,
        })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);
}
