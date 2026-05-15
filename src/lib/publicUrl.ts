/**
 * Returnerar alltid den publika produktionsdomänen för länkar som skickas
 * till partners (profileringslänk, eventportal, mail-länkar osv).
 *
 * Lovables preview-domän (id-preview--*.lovable.app, *.lovableproject.com)
 * injicerar en fetch-proxy som bryter POST/upload-requests, vilket gör att
 * partners får "Failed to fetch" och "ogiltig länk"-fel om vi skickar dem
 * preview-URL:er. Tvinga därför alltid produktionsdomän.
 */
export const PUBLIC_SITE_URL = "https://d365.se";

export function getPublicBaseUrl(): string {
  if (typeof window === "undefined") return PUBLIC_SITE_URL;
  const origin = window.location.origin;
  const isPreview =
    origin.includes("lovableproject.com") ||
    origin.includes("id-preview--") ||
    origin.includes("lovable.app");
  return isPreview ? PUBLIC_SITE_URL : origin;
}
