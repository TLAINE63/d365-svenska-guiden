// Google Ads conversions. Fire only with marketing consent and never under Global Privacy Control.
// "Kontakt" is deduped per form per page load; "Boka rådgivning (klick)" once per page load.
const CONTACT_SEND_TO = "AW-17947547907/NXvUCLD81IEcEIOyh-5C";
export const BOOKING_SEND_TO = "AW-17947547907/8tiiCIPl37odEIOyh-5C";
const fired = new Set<string>();

export function hasMarketingConsent(): boolean {
  try {
    if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true) return false;
    const c = JSON.parse(localStorage.getItem("cookie-consent-v2") || "null");
    return Boolean(c && c.marketing);
  } catch { return false; }
}

function report(key: string, sendTo: string): void {
  if (typeof window === "undefined") return;
  try {
    if (!hasMarketingConsent() || fired.has(key)) return;
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;
    fired.add(key);
    gtag("event", "conversion", { send_to: sendTo, value: 1.0, currency: "SEK" });
  } catch { /* best-effort */ }
}

export function trackAdsContactConversion(formId: string): void {
  report(`contact:${formId}`, CONTACT_SEND_TO);
}

/** Click on the Microsoft Bookings link for the free 20-minute advisory meeting with Thomas. */
export function trackAdsBookingConversion(): void {
  report("booking", BOOKING_SEND_TO);
}
