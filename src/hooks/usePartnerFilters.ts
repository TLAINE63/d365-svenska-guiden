import { DatabasePartner, ProductFilters, SwedishRegion } from "./usePartners";

// Product key types
export type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

// Size match bonus weights (used for soft ranking, not hard filtering)
export const SIZE_MATCH_WEIGHT = 5; // % bonus for matching company size
export const REVENUE_MATCH_WEIGHT = 5; // % bonus for matching revenue

// Threshold above which a partner's stated target audience is considered "too generic"
// (likely a "we take everyone" claim) and the bonus is reduced.
export const TARGET_AUDIENCE_GENERIC_THRESHOLD = 3;
export const GENERIC_TARGET_BONUS_FACTOR = 0.4; // 40% of full bonus when partner picked >3 buckets

// Returns a 0–10 bonus score for how well a partner matches the customer's size/revenue
// for a given product. Soft matching: missing target on either side = neutral (0 points,
// no penalty). Explicit match on each dimension grants the corresponding weight, but
// partners that ticked >3 buckets in a dimension are considered "too generic" and only
// get a fraction of the bonus (they get rewarded less than truly focused partners).
export const getSizeMatchBonus = (
  partner: DatabasePartner,
  product: ProductKey,
  selectedCompanySize?: string | null,
  selectedRevenue?: string | null
): number => {
  const productFilter = partner.product_filters?.[product];
  if (!productFilter) return 0;

  let bonus = 0;

  if (selectedCompanySize) {
    const targets = productFilter.companySize || [];
    if (targets.length > 0 && targets.includes(selectedCompanySize)) {
      const factor = targets.length > TARGET_AUDIENCE_GENERIC_THRESHOLD
        ? GENERIC_TARGET_BONUS_FACTOR
        : 1;
      bonus += SIZE_MATCH_WEIGHT * factor;
    }
  }

  if (selectedRevenue) {
    const targets = productFilter.revenue || [];
    if (targets.length > 0 && targets.includes(selectedRevenue)) {
      const factor = targets.length > TARGET_AUDIENCE_GENERIC_THRESHOLD
        ? GENERIC_TARGET_BONUS_FACTOR
        : 1;
      bonus += REVENUE_MATCH_WEIGHT * factor;
    }
  }

  return bonus;
};

// Helper function to check if a database partner matches product-specific filters.
// NOTE: companySize and revenue are NOT used as hard filters here – they are soft
// signals applied via getSizeMatchBonus() during ranking. We never hide a partner
// because their stated target audience does not include the customer's size.
export const matchesDatabaseProductFilter = (
  partner: DatabasePartner,
  product: ProductKey,
  selectedIndustry?: string,
  _selectedCompanySize?: string,
  selectedGeography?: string,
  selectedRegions?: SwedishRegion[],
  _selectedRevenue?: string
): boolean => {
  const productFilter = partner.product_filters?.[product];
  
  // If no product filter exists, partner doesn't participate in this product
  if (!productFilter) return false;
  
  // Check industry match - ONLY uses primary industries, not secondaryIndustries
  if (selectedIndustry && !productFilter.industries?.includes(selectedIndustry)) {
    return false;
  }
  
  // Check geography match (hierarchical: Sverige < Norden < Europa < Övriga världen)
  if (selectedGeography) {
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
    
    // Read geography from product filter, not top-level partner.geography
    const pfGeo = productFilter.geography;
    const partnerGeographies = Array.isArray(pfGeo) && pfGeo.length > 0 
      ? pfGeo 
      : (typeof pfGeo === 'string' && pfGeo ? [pfGeo] : ['Sverige']);
    
    // Check if partner covers the selected geography
    // A partner with broader coverage (e.g., "Norden") can serve narrower areas (e.g., "Sverige")
    const selectedGeoIndex = geographyHierarchy.indexOf(selectedGeography);
    
    // Partner matches if any of their geographies cover the selected geography
    const partnerCoversGeography = partnerGeographies.some(geo => {
      const partnerGeoIndex = geographyHierarchy.indexOf(geo);
      return partnerGeoIndex >= selectedGeoIndex;
    });
    
    if (!partnerCoversGeography) {
      return false;
    }
  }
  
  // Check Sweden region match (only if Sverige is selected and regions are specified)
  if (selectedGeography === "Sverige" && selectedRegions && selectedRegions.length > 0) {
    const partnerRegions = productFilter.swedenRegions || [];
    
    // If partner has no regions specified, they cover all of Sweden (pass the filter)
    if (partnerRegions.length === 0) {
      return true;
    }
    
    // Partner must cover at least one of the selected regions
    const hasMatchingRegion = selectedRegions.some(region => 
      partnerRegions.includes(region)
    );
    
    if (!hasMatchingRegion) {
      return false;
    }
  }
  
  return true;
};

// Helper function to get product-specific ranking
export const getDatabaseProductRanking = (partner: DatabasePartner, product: ProductKey): number => {
  return partner.product_filters?.[product]?.ranking ?? 999;
};

// Helper to check if partner has a specific product
export const hasProduct = (partner: DatabasePartner, product: ProductKey): boolean => {
  return !!partner.product_filters?.[product];
};

// Get all industries used by partners for a specific product
export const getProductIndustries = (
  partners: DatabasePartner[],
  product: ProductKey,
  allIndustries: string[]
): string[] => {
  const industries = new Set<string>();
  partners.forEach(partner => {
    partner.product_filters?.[product]?.industries?.forEach(ind => industries.add(ind));
  });
  return allIndustries.filter(ind => industries.has(ind));
};

// Seeded random shuffle for consistent ordering per session
const seededShuffle = <T,>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  
  // Simple seeded random number generator
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  
  while (currentIndex > 0) {
    const randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  return shuffled;
};

// Get a session-stable seed (same for entire browser session)
let sessionSeed: number | null = null;
const getSessionSeed = (): number => {
  if (sessionSeed === null) {
    sessionSeed = Math.floor(Math.random() * 1000000);
  }
  return sessionSeed;
};

// Filter and sort partners for a specific product
export const filterAndSortPartners = (
  partners: DatabasePartner[],
  product: ProductKey,
  selectedIndustry?: string | null,
  selectedGeography?: string | null,
  selectedCompanySize?: string | null,
  selectedRegions?: SwedishRegion[] | null,
  randomize: boolean = true,
  selectedRevenue?: string | null
): DatabasePartner[] => {
  // Only show partners with the product filter defined
  let result = partners.filter(partner => hasProduct(partner, product));
  
  // Apply product-specific filters
  result = result.filter(partner => 
    matchesDatabaseProductFilter(
      partner,
      product,
      selectedIndustry || undefined,
      selectedCompanySize || undefined,
      selectedGeography || undefined,
      selectedRegions && selectedRegions.length > 0 ? selectedRegions : undefined,
      selectedRevenue || undefined
    )
  );
  
  // Two-tier ranking when size/revenue is specified: partners whose stated target
  // audience matches the customer go first (slumpat inom gruppen), partners with no
  // bonus go after. Partners with empty target audience get 0 bonus = neutral position.
  const hasSizeSignal = !!selectedCompanySize || !!selectedRevenue;

  // Helper: split list into [signedAgreement, others] preserving inner order
  const splitByAgreement = (arr: DatabasePartner[]): [DatabasePartner[], DatabasePartner[]] => {
    const signed: DatabasePartner[] = [];
    const unsigned: DatabasePartner[] = [];
    arr.forEach(p => (p.agreement_signed ? signed : unsigned).push(p));
    return [signed, unsigned];
  };

  if (randomize) {
    if (hasSizeSignal) {
      const withBonus: DatabasePartner[] = [];
      const withoutBonus: DatabasePartner[] = [];
      result.forEach(p => {
        const bonus = getSizeMatchBonus(p, product, selectedCompanySize, selectedRevenue);
        if (bonus > 0) withBonus.push(p);
        else withoutBonus.push(p);
      });
      const seed = getSessionSeed();
      const [bonusSigned, bonusUnsigned] = splitByAgreement(withBonus);
      const [otherSigned, otherUnsigned] = splitByAgreement(withoutBonus);
      // Agreement signed alltid först inom respektive bonus-grupp
      return [
        ...seededShuffle(bonusSigned, seed),
        ...seededShuffle(bonusUnsigned, seed + 1),
        ...seededShuffle(otherSigned, seed + 2),
        ...seededShuffle(otherUnsigned, seed + 3),
      ];
    }
    // Shuffle with session-stable seed but signed-agreement partners first
    const seed = getSessionSeed();
    const [signed, unsigned] = splitByAgreement(result);
    return [
      ...seededShuffle(signed, seed),
      ...seededShuffle(unsigned, seed + 1),
    ];
  }
  
  // Fallback: Agreement signed first, then size-bonus DESC, ranking, alphabetically
  return result.sort((a, b) => {
    const agA = a.agreement_signed ? 1 : 0;
    const agB = b.agreement_signed ? 1 : 0;
    if (agA !== agB) return agB - agA;
    const bonusA = getSizeMatchBonus(a, product, selectedCompanySize, selectedRevenue);
    const bonusB = getSizeMatchBonus(b, product, selectedCompanySize, selectedRevenue);
    if (bonusA !== bonusB) return bonusB - bonusA;
    const rankA = getDatabaseProductRanking(a, product);
    const rankB = getDatabaseProductRanking(b, product);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.name.localeCompare(b.name, 'sv');
  });
};
