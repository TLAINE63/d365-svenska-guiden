import { useEffect } from "react";

/**
 * Snitcher (B2B-företagsidentifiering) laddas ENDAST efter samtycke i
 * kategorin "Marknadsföring" (cookie-consent-v2.marketing === true).
 * - Ingen kod i index.html; detta är den enda laddningsvägen.
 * - Start fördröjs till första interaktion eller 6 s, och sker högst en gång per sidladdning.
 * - Vid återkallat samtycke rensas Snitchers cookies/lagring på sajtens domän;
 *   redan laddat skript stoppas av nästa sidladdning.
 */
const CONSENT_KEY_V2 = "cookie-consent-v2";
const CONFIG = {
  apiEndpoint: "radar.snitcher.com",
  cdn: "cdn.snitcher.com",
  namespace: "Snitcher",
  profileId: "sisWjf3iiU",
};

function hasMarketingConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY_V2);
    return !!raw && JSON.parse(raw)?.marketing === true;
  } catch {
    return false;
  }
}

function clearSnitcherStorage() {
  try {
    const host = location.hostname;
    const domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0].trim();
      if (!/snitcher|radar/i.test(name)) return;
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
      });
    });
    [localStorage, sessionStorage].forEach((s) => {
      Object.keys(s).filter((k) => /snitcher|radar/i.test(k)).forEach((k) => s.removeItem(k));
    });
  } catch {
    /* ignore */
  }
}

let started = false;

function loadSnitcher() {
  if (started || document.getElementById("__radar__")) return;
  started = true;
  const w = window as any;
  const ns = CONFIG.namespace;
  const s = (w[ns] = Array.isArray(w[ns]) ? w[ns] : []);
  if (s.initialized || s._loaded) return;
  s._loaded = true;
  [
    "track", "page", "identify", "group", "alias", "ready", "debug", "on", "off", "once",
    "trackClick", "trackSubmit", "trackLink", "trackForm", "pageview", "screen", "reset",
    "register", "setAnonymousId", "addSourceMiddleware", "addIntegrationMiddleware",
    "addDestinationMiddleware", "giveCookieConsent",
  ].forEach((m) => {
    s[m] = (...args: any[]) => {
      const cur = w[ns];
      if (cur.initialized) return cur[m](...args);
      cur.push([m, ...args]);
      return cur;
    };
  });
  const script = document.createElement("script");
  script.async = true;
  script.id = "__radar__";
  script.setAttribute("data-settings", JSON.stringify(CONFIG));
  script.src = `https://${CONFIG.cdn}/releases/latest/radar.min.js`;
  document.head.appendChild(script);
}

const SnitcherTracking = () => {
  useEffect(() => {
    const host = location.hostname;
    if (host !== "d365.se" && host !== "www.d365.se") return;

    const evts = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    let timer: number | undefined;
    const kick = () => {
      evts.forEach((e) => window.removeEventListener(e, kick));
      if (timer) clearTimeout(timer);
      if (hasMarketingConsent()) loadSnitcher();
    };
    const arm = () => {
      if (started || !hasMarketingConsent()) return;
      evts.forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
      timer = window.setTimeout(kick, 6000);
    };
    const onChange = () => {
      if (hasMarketingConsent()) arm();
      else clearSnitcherStorage();
    };

    if (!hasMarketingConsent()) clearSnitcherStorage();
    arm();
    window.addEventListener("cookie-consent-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      evts.forEach((e) => window.removeEventListener(e, kick));
      if (timer) clearTimeout(timer);
      window.removeEventListener("cookie-consent-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return null;
};

export default SnitcherTracking;
