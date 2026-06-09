import { useMemo } from "react";
import { usePartners } from "@/hooks/usePartners";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";

/**
 * Returns the set of industry names that have at least one featured partner
 * profiled against them. Uses the shared collectPartnerIndustries helper so
 * the coverage matches /partners-per-bransch and /branscher exactly.
 */
export const useCoveredIndustries = () => {
  const { data: partners, isLoading } = usePartners();

  const covered = useMemo(() => {
    const set = new Set<string>();
    (partners || [])
      .filter((p) => p.is_featured === true)
      .forEach((p) => {
        collectPartnerIndustries(p).forEach((i) => set.add(i));
      });
    return set;
  }, [partners]);

  return { covered, isLoading };
};
