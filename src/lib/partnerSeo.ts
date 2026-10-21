/**
 * Sökmotortexter för grundprofiler (/basic/:slug/). Delas av sidan och
 * förgenereringen så att crawlers och besökare ser samma titel/beskrivning.
 */
import { META_DESCRIPTION_MAX } from "@/lib/metaDescription";

/** Titel utan varumärke; SEOHead lägger till " | d365.se". */
export function basicPartnerSeoTitle(name: string): string {
  const full = `${name} – Dynamics 365-partner i Sverige`;
  return full.length <= 50 ? full : `${name} – Dynamics 365-partner`;
}

export function basicPartnerSeoDescription(name: string, observedApps: string[] = []): string {
  const apps = observedApps.slice(0, 3).join(", ");
  const withApps = `${name} och Microsoft Dynamics 365: observerade produktområden (${apps}), branscher och täckning, sammanställt av d365.se från publika källor.`;
  if (apps && withApps.length <= META_DESCRIPTION_MAX) return withApps;
  return `${name} och Microsoft Dynamics 365: observerade produktområden, branscher och täckning, sammanställt av d365.se från publika källor.`;
}
