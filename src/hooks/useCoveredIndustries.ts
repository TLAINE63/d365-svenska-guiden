import { useMemo } from "react";
import { usePartners } from "@/hooks/usePartners";

const PRODUCT_KEYS = ["bc", "fsc", "sales", "service"] as const;

/**
 * Returns the set of industry names that have at least one featured partner
 * profiled against them (via product_filters.*.industries).
 * Used to hide empty industries on /branscher and /branschlosningar while
 * keeping them available for partners to choose in admin.
 */
export const useCoveredIndustries = () => {
  const { data: partners, isLoading } = usePartners();

  const covered = useMemo(() => {
    const set = new Set<string>();
    (partners || [])
      .filter((p) => p.is_featured === true)
      .forEach((p) => {
        PRODUCT_KEYS.forEach((k) => {
          const inds = p.product_filters?.[k]?.industries || [];
          inds.forEach((i: string) => set.add(i));
        });
      });
    return set;
  }, [partners]);

  return { covered, isLoading };
};
