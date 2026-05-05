/**
 * Bygger en SEO-vänlig meta description (max ~155 tecken).
 * Prioritet: metaDescription -> summary -> fallback. Trunkerar på ordgräns med "…".
 */
const MAX = 155;
const MIN = 70;

const clean = (s: string) =>
  s.replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();

const truncateAtWord = (s: string, max: number): string => {
  if (s.length <= max) return s;
  const slice = s.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[.,;:!?–-]+$/, "") + "…";
};

export const buildMetaDescription = (
  candidates: Array<string | undefined | null>,
  fallback = "Oberoende kunskap om Microsoft Dynamics 365 — ERP, CRM och partnerval."
): string => {
  for (const raw of candidates) {
    if (!raw) continue;
    const c = clean(raw);
    if (c.length >= MIN && c.length <= MAX) return c;
    if (c.length > MAX) return truncateAtWord(c, MAX);
    // för kort → testa nästa kandidat
  }
  // Om ingen var tillräckligt lång: använd första icke-tomma (även kort) eller fallback
  const firstNonEmpty = candidates.map((c) => c && clean(c)).find(Boolean);
  return firstNonEmpty || fallback;
};
