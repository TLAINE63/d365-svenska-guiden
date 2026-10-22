import type { PartnerNewsItem, PartnerNewsType } from "@/hooks/usePartnerNews";

/** Högst så många Partnernytt-poster visas i ett kontextuellt block. */
export const CONTEXTUAL_NEWS_MAX = 3;

/**
 * Typer som främst berättar vad som hänt hos en partner eller är säljerbjudanden.
 * De hör hemma i Partnernytt, inte som beslutsstöd på köpsidor.
 */
const PARTNERNYTT_ONLY: PartnerNewsType[] = ["partnernyhet", "erbjudande"];

/** Första ordet i ett branschnamn, t.ex. "Bygg, Entreprenad & Installation" -> "bygg". */
export function industryKey(name: string | null | undefined): string {
  return (name ?? "").toLowerCase().split(/[\s,&/]+/).filter(Boolean)[0] ?? "";
}

export function industryMatches(a: string | null | undefined, b: string | null | undefined): boolean {
  const ka = industryKey(a);
  const kb = industryKey(b);
  if (!ka || !kb) return false;
  return ka === kb || ka.startsWith(kb) || kb.startsWith(ka);
}

export function pickContextualPartnerNews(
  items: PartnerNewsItem[],
  opts: { industry?: string } = {},
): PartnerNewsItem[] {
  return items
    .filter((n) => !PARTNERNYTT_ONLY.includes(n.news_type))
    .filter((n) => (opts.industry ? industryMatches(n.industry, opts.industry) : true))
    .slice(0, CONTEXTUAL_NEWS_MAX);
}
