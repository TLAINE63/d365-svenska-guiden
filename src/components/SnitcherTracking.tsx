import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

const SnitcherTracking = () => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check initial consent
    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      setHasConsent(consent === "true");
    };

    checkConsent();

    // Listen for storage changes (in case consent changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) {
        checkConsent();
      }
    };

    // Listen for consent changes within the same tab
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cookie-consent-changed", handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cookie-consent-changed", handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!hasConsent) return;

    // Check if Snitcher is already loaded
    if ((window as any).Snitcher?.initialized || document.getElementById("__radar__")) {
      return;
    }

    // Load Snitcher script
    const config = {
      apiEndpoint: "radar.snitcher.com",
      cdn: "cdn.snitcher.com",
      namespace: "Snitcher",
      profileId: "sisWjf3iiU"
    };

    const namespace = config.namespace;
    let snitcher = (window as any)[namespace];

    if (!snitcher || !Array.isArray(snitcher)) {
      snitcher = (window as any)[namespace] = [];
    }

    if (!snitcher.initialized && !snitcher._loaded) {
      snitcher._loaded = true;

      const methods = [
        "track", "page", "identify", "group", "alias", "ready", "debug",
        "on", "off", "once", "trackClick", "trackSubmit", "trackLink",
        "trackForm", "pageview", "screen", "reset", "register",
        "setAnonymousId", "addSourceMiddleware", "addIntegrationMiddleware",
        "addDestinationMiddleware", "giveCookieConsent"
      ];

      methods.forEach((method) => {
        snitcher[method] = function (...args: any[]) {
          const s = (window as any)[namespace];
          if (s.initialized) {
            return s[method].apply(s, args);
          }
          const queue = [method, ...args];
          s.push(queue);
          return s;
        };
      });

      const script = document.createElement("script");
      script.async = true;
      script.type = "text/javascript";
      script.id = "__radar__";
      script.setAttribute("data-settings", JSON.stringify(config));
      script.src = `https://${config.cdn}/releases/latest/radar.min.js`;

      const firstScript = document.scripts[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    }
  }, [hasConsent]);

  return null;
};

export default SnitcherTracking;
