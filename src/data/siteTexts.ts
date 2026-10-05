import snapshot from "./siteTexts.json";
import { SITE_TEXT_DEFAULTS } from "./siteTextDefaults";

const saved = snapshot as Record<string, string>;
const defaults = Object.fromEntries(SITE_TEXT_DEFAULTS.map((d) => [d.key, d.value]));

/** Rå text från textbanken (sparad text, annars standard). */
export function rawSiteText(key: string): string {
  const v = saved[key];
  return (typeof v === "string" && v.trim() ? v : defaults[key] ?? "").trim();
}

/** Text för visning: "Dynamics 365" hålls ihop med hårt mellanslag. */
export function siteText(key: string): string {
  return rawSiteText(key).replace(/Dynamics 365/g, "Dynamics\u00A0365");
}

/** Stycken (separerade med tom rad). */
export function siteParagraphs(key: string): string[] {
  return siteText(key).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** "+46 72 232 40 60" → "+46722324060" */
export function toE164(display: string): string {
  return display.replace(/[^\d+]/g, "");
}
