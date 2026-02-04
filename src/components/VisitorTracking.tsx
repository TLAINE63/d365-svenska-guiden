import { useVisitorTracking } from "@/hooks/useVisitorTracking";

/**
 * VisitorTracking component - wraps the visitor tracking hook
 * Add this component inside BrowserRouter to enable page view tracking
 */
export default function VisitorTracking() {
  useVisitorTracking();
  return null;
}
