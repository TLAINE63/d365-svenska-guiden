/**
 * Bygger en SEO-vänlig meta description (mål 70–155 tecken).
 * Prioritet: första kandidat som ligger i målintervallet → annars trunkerad
 * längsta kandidat → annars första icke-tomma → annars fallback.
 *
 * I dev-läge loggas varningar när:
 *  - en kandidat var för lång och behövde trunkeras
 *  - resultatet hamnar utanför målintervallet (för kort eller saknas)
 */
export const META_DESCRIPTION_MIN = 70;
export const META_DESCRIPTION_MAX = 155;

const isDev =
  typeof import.meta !== "undefined" &&
  (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

const clean = (s: string) =>
  s.replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();

const truncateAtWord = (s: string, max: number): string => {
  if (s.length <= max) return s;
  const slice = s.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[.,;:!?–-]+$/, "") + "…";
};

const warn = (msg: string, ctx: Record<string, unknown>) => {
  if (!isDev) return;
  // eslint-disable-next-line no-console
  console.warn(`[meta-description] ${msg}`, ctx);
};

export interface MetaDescriptionResult {
  value: string;
  length: number;
  status: "ok" | "truncated" | "too-short" | "fallback";
  warnings: string[];
}

/**
 * Detaljerad variant som returnerar status + varningar.
 */
export const buildMetaDescriptionDetailed = (
  candidates: Array<string | undefined | null>,
  fallback = "Oberoende kunskap om Microsoft Dynamics 365 — ERP, CRM och partnerval.",
): MetaDescriptionResult => {
  const warnings: string[] = [];
  const cleaned = candidates
    .map((c) => (c ? clean(c) : ""))
    .filter((c) => c.length > 0);

  // 1. Hitta första som redan ligger inom intervallet
  const inRange = cleaned.find(
    (c) => c.length >= META_DESCRIPTION_MIN && c.length <= META_DESCRIPTION_MAX,
  );
  if (inRange) {
    return { value: inRange, length: inRange.length, status: "ok", warnings };
  }

  // 2. Om någon är för lång → trunkera den längsta (mest information bevaras)
  const tooLong = cleaned.filter((c) => c.length > META_DESCRIPTION_MAX);
  if (tooLong.length > 0) {
    const longest = tooLong.reduce((a, b) => (a.length >= b.length ? a : b));
    const truncated = truncateAtWord(longest, META_DESCRIPTION_MAX);
    const msg = `Beskrivning trunkerades från ${longest.length} → ${truncated.length} tecken.`;
    warnings.push(msg);
    warn(msg, { original: longest, truncated });
    return {
      value: truncated,
      length: truncated.length,
      status: "truncated",
      warnings,
    };
  }

  // 3. Använd första icke-tomma (för kort) eller fallback
  const first = cleaned[0];
  if (first) {
    const msg = `Beskrivning är kortare än rekommenderat (${first.length} < ${META_DESCRIPTION_MIN} tecken).`;
    warnings.push(msg);
    warn(msg, { value: first });
    return { value: first, length: first.length, status: "too-short", warnings };
  }

  const msg = "Ingen meta description tillgänglig — använder fallback.";
  warnings.push(msg);
  warn(msg, { fallback });
  return {
    value: fallback,
    length: fallback.length,
    status: "fallback",
    warnings,
  };
};

/**
 * Bakåtkompatibel API som bara returnerar strängen.
 */
export const buildMetaDescription = (
  candidates: Array<string | undefined | null>,
  fallback?: string,
): string => buildMetaDescriptionDetailed(candidates, fallback).value;
