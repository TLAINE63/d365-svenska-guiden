import { useCallback, useEffect, useRef } from "react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

/**
 * Reusable CTA measurement.
 * Fires one anonymous `cta_view` when the element becomes visible and
 * exposes `trackClick()` for the CTA's primary action.
 */
export function useCtaTracking<T extends HTMLElement = HTMLDivElement>(
  ctaName: string,
  metadata?: Record<string, unknown>,
) {
  const ref = useRef<T | null>(null);
  const viewedRef = useRef(false);
  const metaRef = useRef(metadata);
  metaRef.current = metadata;

  useEffect(() => {
    const el = ref.current;
    if (!el || viewedRef.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !viewedRef.current) {
            viewedRef.current = true;
            trackFunnelEvent({
              event_type: "cta_view",
              event_name: ctaName,
              metadata: metaRef.current,
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ctaName]);

  const trackClick = useCallback(
    (extra?: Record<string, unknown>) => {
      trackFunnelEvent({
        event_type: "cta_click",
        event_name: ctaName,
        metadata: { ...metaRef.current, ...extra },
      });
    },
    [ctaName],
  );

  return { ref, trackClick };
}
