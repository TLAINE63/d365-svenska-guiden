import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackJourney, contentTypeForPath } from "@/lib/siJourney";
import { installTracking } from "@/lib/siteIntelligence";
import { initTracking } from "@/lib/track";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { initPartnerLinkClickTracking } from "@/utils/trackPartnerLinkClicks";
import { trackLandingOnce, installEngagementClickTracking } from "@/utils/trackFunnelEvent";

/**
 * VisitorTracking component - wraps the visitor tracking hook
 * Add this component inside BrowserRouter to enable page view tracking
 */
export default function VisitorTracking() {
  useVisitorTracking();
  const { pathname } = useLocation();
  useEffect(() => installTracking(), []);
  useEffect(() => { trackJourney({ type: "page_view", url: pathname, content_type: contentTypeForPath(pathname) }); }, [pathname]);

  useEffect(() => initTracking(), []);
  useEffect(() => initPartnerLinkClickTracking(), []);
  useEffect(() => trackLandingOnce(), []);
  useEffect(() => installEngagementClickTracking(), []);

  return null;
}
