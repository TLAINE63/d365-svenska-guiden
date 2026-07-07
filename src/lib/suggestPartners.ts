import type { DatabasePartner } from "@/hooks/usePartners";
import {
  filterAndSortPartners,
  hasProduct,
  type ProductKey,
} from "@/hooks/usePartnerFilters";

/**
 * Returnerar upp till `limit` partners som passar en given produkt/bransch.
 * Använder samma rank-motor som KomIgang/PartnerGuide (agreement-signed först,
 * bransch/produkt hårda filter, geografi kan relaxas). Om industri anges men
 * ger < limit träffar backar vi av branschfiltret så vi alltid kan visa 3.
 */
export const pickSuggestedPartners = (
  partners: DatabasePartner[],
  opts: {
    product: ProductKey | ProductKey[];
    industry?: string | null;
    limit?: number;
  },
): DatabasePartner[] => {
  const limit = opts.limit ?? 3;
  const productKeys: ProductKey[] = Array.isArray(opts.product)
    ? opts.product
    : [opts.product];

  const collect = (industry?: string | null): DatabasePartner[] => {
    const seen = new Set<string>();
    const out: DatabasePartner[] = [];
    for (const pk of productKeys) {
      const list = filterAndSortPartners(
        partners,
        pk,
        industry || null,
        null,
        null,
        null,
        true,
        null,
      );
      for (const p of list) {
        if (seen.has(p.slug)) continue;
        seen.add(p.slug);
        out.push(p);
      }
    }
    return out;
  };

  let result = collect(opts.industry);
  if (result.length < limit && opts.industry) {
    // Relaxa branschfilter för att alltid ge 3 förslag.
    const withoutIndustry = collect(null).filter(
      (p) => !result.find((r) => r.slug === p.slug),
    );
    result = [...result, ...withoutIndustry];
  }
  if (result.length < limit) {
    // Sista utväg: alla partners som har produkten (utan sortering).
    const fallback = partners.filter((p) =>
      productKeys.some((pk) => hasProduct(p, pk)),
    );
    for (const p of fallback) {
      if (result.find((r) => r.slug === p.slug)) continue;
      result.push(p);
      if (result.length >= limit) break;
    }
  }
  return result.slice(0, limit);
};
