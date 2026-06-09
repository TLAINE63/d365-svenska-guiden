import type { DatabasePartner } from "@/hooks/usePartners";

const PRODUCT_KEYS = ["bc", "fsc", "sales", "service", "crm"] as const;

/**
 * Collect ALL industry names a partner is associated with.
 * Covers:
 *  - top-level industries / secondary_industries
 *  - product_filters[bc|fsc|sales|service|crm].industries + secondaryIndustries
 *
 * Single source of truth so /branscher, /partners-per-bransch and
 * useCoveredIndustries always agree.
 */
export function collectPartnerIndustries(p: DatabasePartner): Set<string> {
  const set = new Set<string>();
  (p.industries || []).forEach((i) => set.add(i));
  (p.secondary_industries || []).forEach((i) => set.add(i));
  const pf: any = p.product_filters || {};
  PRODUCT_KEYS.forEach((k) => {
    (pf?.[k]?.industries || []).forEach((i: string) => set.add(i));
    (pf?.[k]?.secondaryIndustries || []).forEach((i: string) => set.add(i));
  });
  return set;
}
