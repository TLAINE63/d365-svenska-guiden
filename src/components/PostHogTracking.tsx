import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent-v2";

const hasStatisticsConsent = (): boolean => {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    return !!c?.statistics;
  } catch {
    return false;
  }
};

/**
 * PostHog product analytics. Laddas först efter statistik-samtycke
 * och skjuts upp tills efter första interaktionen (eller 6s) så att
 * första renderingen inte blockeras.
 */
const PostHogTracking = () => {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const check = () => setConsent(hasStatisticsConsent());
    check();
    window.addEventListener("cookie-consent-changed", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("cookie-consent-changed", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  useEffect(() => {
    if (!consent) return;
    const token = import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_API_KEY;
    if (!token) return;

    let cancelled = false;
    let timer: number | undefined;

    const init = async () => {
      if (cancelled) return;
      const { default: posthog } = await import("posthog-js");
      if (cancelled || (posthog as any).__loaded) return;
      const region = import.meta.env.VITE_LOVABLE_CONNECTOR_POSTHOG_REGION || "eu";
      posthog.init(token, {
        api_host: region === "us" ? "https://us.i.posthog.com" : "https://eu.i.posthog.com",
        defaults: "2026-05-30",
        person_profiles: "identified_only",
      });
    };

    const onInteraction = () => {
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      window.removeEventListener("scroll", onInteraction);
      init();
    };

    window.addEventListener("pointerdown", onInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onInteraction, { once: true, passive: true });
    window.addEventListener("scroll", onInteraction, { once: true, passive: true });
    timer = window.setTimeout(onInteraction, 6000);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      window.removeEventListener("scroll", onInteraction);
    };
  }, [consent]);

  return null;
};

export default PostHogTracking;
