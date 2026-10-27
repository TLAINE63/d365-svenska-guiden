// Google Ads conversion "Kontakt". Fires only with marketing consent; deduped per form per page load.
const SEND_TO = "AW-17947547907/NXvUCLD81IEcEIOyh-5C";
const fired = new Set<string>();

export function hasMarketingConsent(): boolean {
  try {
    const c = JSON.parse(localStorage.getItem("cookie-consent-v2") || "null");
    return Boolean(c && c.marketing);
  } catch { return false; }
}

export function trackAdsContactConversion(formId: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!hasMarketingConsent() || fired.has(formId)) return;
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;
    fired.add(formId);
    gtag("event", "conversion", { send_to: SEND_TO, value: 1.0, currency: "SEK" });
  } catch { /* best-effort */ }
}
