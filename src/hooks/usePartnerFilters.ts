import { DatabasePartner, ProductFilters, SwedishRegion } from "./usePartners";

// Product key types
export type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

// Helper function to check if a database partner matches product-specific filters
export const matchesDatabaseProductFilter = (
  partner: DatabasePartner,
  product: ProductKey,
  selectedIndustry?: string,
  selectedCompanySize?: string,
  selectedGeography?: string,
  selectedRegions?: SwedishRegion[]
): boolean => {
  const productFilter = partner.product_filters?.[product];
  
  // If no product filter exists, partner doesn't participate in this product
  if (!productFilter) return false;
  
  // Check industry match - ONLY uses primary industries, not secondaryIndustries
  if (selectedIndustry && !productFilter.industries?.includes(selectedIndustry)) {
    return false;
  }
  
  // Check company size match
  if (selectedCompanySize && !productFilter.companySize?.includes(selectedCompanySize)) {
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
  randomize: boolean = true
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
      selectedRegions && selectedRegions.length > 0 ? selectedRegions : undefined
    )
  );
  
  if (randomize) {
    // Shuffle with session-stable seed for fair exposure
    return seededShuffle(result, getSessionSeed());
  }
  
  // Fallback: Sort by product ranking, then alphabetically
  return result.sort((a, b) => {
    const rankA = getDatabaseProductRanking(a, product);
    const rankB = getDatabaseProductRanking(b, product);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.name.localeCompare(b.name, 'sv');
  });
};
