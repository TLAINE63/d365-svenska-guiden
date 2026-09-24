import { useEffect } from "react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { initPartnerLinkClickTracking } from "@/utils/trackPartnerLinkClicks";
import { trackLandingOnce, installEngagementClickTracking } from "@/utils/trackFunnelEvent";

/**
 * VisitorTracking component - wraps the visitor tracking hook
 * Add this component inside BrowserRouter to enable page view tracking
 */
export default function VisitorTracking() {
  useVisitorTracking();

  useEffect(() => initPartnerLinkClickTracking(), []);
  useEffect(() => trackLandingOnce(), []);
  useEffect(() => installEngagementClickTracking(), []);

  return null;
}
