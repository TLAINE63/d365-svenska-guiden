import type { DatabasePartner } from "@/hooks/usePartners";
import {
  filterAndSortPartners,
  getSizeMatchBonus,
  type ProductKey,
} from "@/hooks/usePartnerFilters";

/**
 * Returnerar upp till `limit` partners som passar en given produkt/bransch.
 *
 * PRIORITETSORDNING (enligt `partner-ranking-priority-order-sv`):
 *   1. Produkt (hårt filter – relaxas ALDRIG)
 *   2. Bransch (hårt filter – relaxas ALDRIG)
 *   3. Storlek/omsättning (mjuk bonus, tiebreaker)
 *   4. Geografi (mjuk bonus, tiebreaker)
 *
 * Om färre än `limit` partners matchar produkt+bransch returnerar vi bara de
 * som faktiskt passar. Vi fyller ALDRIG ut listan med random partners som
 * saknar branschen – hellre färre förslag än fel förslag (TAYA).
 */
export const pickSuggestedPartners = (
  partners: DatabasePartner[],
  opts: {
    product: ProductKey | ProductKey[];
    industry?: string | null;
    companySize?: string | null;
    revenue?: string | null;
    geography?: string | null;
    limit?: number;
  },
): DatabasePartner[] => {
  const limit = opts.limit ?? 5;
  const productKeys: ProductKey[] = Array.isArray(opts.product)
    ? opts.product
    : [opts.product];

  const seen = new Set<string>();
  const scored: { partner: DatabasePartner; product: ProductKey; bonus: number }[] = [];

  for (const pk of productKeys) {
    // Hårda filter: produkt + bransch. Geografi lämnas oanvänt här (mjuk bonus).
    const list = filterAndSortPartners(
      partners,
      pk,
      opts.industry || null,
      null,
      null,
      null,
      true,
      null,
    );
    for (const p of list) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      const bonus = getSizeMatchBonus(p, pk, opts.companySize ?? null, opts.revenue ?? null);
      scored.push({ partner: p, product: pk, bonus });
    }
  }

  // Sortera: avtalspartner först, sedan storleks-/omsättningsbonus, behåll
  // filterAndSortPartners inre ordning för lika bonus.
  scored.sort((a, b) => {
    const agA = a.partner.agreement_signed ? 1 : 0;
    const agB = b.partner.agreement_signed ? 1 : 0;
    if (agA !== agB) return agB - agA;
    return b.bonus - a.bonus;
  });

  return scored.slice(0, limit).map((s) => s.partner);
};
