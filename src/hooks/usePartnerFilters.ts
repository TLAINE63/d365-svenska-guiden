import { DatabasePartner, ProductFilters } from "./usePartners";

// Product key types
export type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

// Helper function to check if a database partner matches product-specific filters
export const matchesDatabaseProductFilter = (
  partner: DatabasePartner,
  product: ProductKey,
  selectedIndustry?: string,
  selectedCompanySize?: string,
  selectedGeography?: string
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
  
  // Check geography match (hierarchical: Sverige < Norden < Europa < Internationellt)
  if (selectedGeography) {
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Internationellt"];
    
    // Handle both string and array geography formats
    const partnerGeographies = partner.geography || ['Sverige'];
    
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

// Filter and sort partners for a specific product
export const filterAndSortPartners = (
  partners: DatabasePartner[],
  product: ProductKey,
  selectedIndustry?: string | null,
  selectedGeography?: string | null,
  selectedCompanySize?: string | null
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
      selectedGeography || undefined
    )
  );
  
  // Sort by product ranking, then alphabetically
  return result.sort((a, b) => {
    const rankA = getDatabaseProductRanking(a, product);
    const rankB = getDatabaseProductRanking(b, product);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.name.localeCompare(b.name, 'sv');
  });
};
