import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import { allIndustries } from "@/data/partners";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";

// Geography filter options
const geographyFilters = [
  { label: "Sverige", value: "Sverige" },
  { label: "Norden", value: "Norden" },
  { label: "Europa", value: "Europa" },
  { label: "Internationellt", value: "Internationellt" }
];

interface ApplicationPartnersProps {
  applicationFilter: string;
  pageSource: string;
}

const ApplicationPartners = ({ applicationFilter, pageSource }: ApplicationPartnersProps) => {
  const { data: dbPartners, isLoading } = usePartners();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);

  // Filter to only show featured partners
  const partners = useMemo(() => {
    return (dbPartners || []).filter(p => p.is_featured === true);
  }, [dbPartners]);

  // Determine which product key to use based on application filter
  const productKey: 'bc' | 'fsc' | 'sales' | 'service' | null = useMemo(() => {
    if (applicationFilter === "Business Central") return 'bc';
    if (applicationFilter === "Finance & SCM") return 'fsc';
    if (["Sales", "Customer Insights (Marketing)"].includes(applicationFilter)) {
      return 'sales';
    }
    if (["Customer Service", "Field Service", "Contact Center", "Project Operations"].includes(applicationFilter)) {
      return 'service';
    }
    return null;
  }, [applicationFilter]);

  const filteredPartners = useMemo(() => {
    if (!productKey) return [];
    
    // Only show partners with product_filters for this product
    let result = partners.filter(partner => partner.product_filters?.[productKey]);
    
    // Apply product-specific filters
    result = result.filter(partner => {
      const pf = partner.product_filters?.[productKey];
      if (!pf) return false;
      if (selectedIndustry && !pf.industries?.includes(selectedIndustry)) return false;
      if (selectedGeography) {
        const geoHierarchy = ["Sverige", "Norden", "Europa", "Internationellt"];
        const selIdx = geoHierarchy.indexOf(selectedGeography);
        const partnerIdx = geoHierarchy.indexOf(pf.geography || "Sverige");
        if (partnerIdx < selIdx) return false;
      }
      return true;
    });
    
    // Sort by product ranking, then alphabetically
    return result.sort((a, b) => {
      const rankA = a.product_filters?.[productKey]?.ranking ?? 999;
      const rankB = b.product_filters?.[productKey]?.ranking ?? 999;
      if (rankA !== rankB) return rankA - rankB;
      return (a.name || '').localeCompare(b.name || '', 'sv');
    });
  }, [productKey, partners, selectedIndustry, selectedGeography]);

  // Get available industries for this product's partners
  const availableIndustries = useMemo(() => {
    if (!productKey) return allIndustries;
    const industries = new Set<string>();
    partners.forEach(partner => {
      partner.product_filters?.[productKey]?.industries?.forEach(ind => industries.add(ind));
    });
    return allIndustries.filter(ind => industries.has(ind));
  }, [productKey, partners]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="partners" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Hitta rätt partner
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
            Här är ett urval av partners som arbetar med {applicationFilter} i Sverige. 
            Filtrera på bransch och företagsstorlek för att hitta partners som passar dig bäst.
          </p>
        </div>

        {/* Industry Filter */}
        <FilterButtons
          title="Filtrera på bransch"
          icon="industry"
          options={availableIndustries.map(ind => ({ label: ind, value: ind }))}
          selectedValue={selectedIndustry}
          onSelect={setSelectedIndustry}
          colorScheme="crm"
        />

        {/* Geography Filter */}
        <FilterButtons
          title="Ange geografi som måste täckas in"
          icon="geography"
          options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
          selectedValue={selectedGeography}
          onSelect={setSelectedGeography}
          colorScheme="crm"
        />

        {/* Filter Results Summary */}
        {(selectedIndustry || selectedGeography) && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
              {selectedIndustry && <> inom <span className="font-semibold text-crm">{selectedIndustry}</span></>}
              {(selectedIndustry && selectedGeography) && <> och</>}
              {selectedGeography && <> med täckning i <span className="font-semibold text-crm">{selectedGeography}</span></>}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedIndustry(null);
                setSelectedGeography(null);
              }}
              className="mt-2 text-muted-foreground hover:text-foreground"
            >
              Rensa alla filter
            </Button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners.map((partner, index) => {
            // Build profile URL with filter context
            const baseUrl = `/partner/${partner.slug}`;
            const params = new URLSearchParams();
            params.set("product", applicationFilter);
            if (selectedIndustry) {
              params.set("industry", selectedIndustry);
            }
            if (selectedGeography) {
              params.set("geography", selectedGeography);
            }
            const profileUrl = `${baseUrl}?${params.toString()}`;
            
            return (
              <PartnerCard
                key={index}
                partner={partner}
                profileUrl={profileUrl}
                colorScheme="crm"
                productKey={productKey}
                highlightedProduct={applicationFilter}
                highlightedIndustry={selectedIndustry || undefined}
                highlightedGeography={selectedGeography || undefined}
              />
            );
          })}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">Märkligt…inga partners blev listade här…</h3>
            <p className="text-muted-foreground">
              Men ingen fara. Om du kontaktar oss, så hjälper vi dig hitta några bra alternativ.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/valj-partner">
              Se alla partners
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Lead CTA - shows when partners are filtered */}
        {(selectedIndustry || selectedGeography) && (
          <div className="max-w-xl mx-auto mt-12">
            <LeadCTA
              sourcePage={pageSource}
              selectedProduct={applicationFilter}
              selectedIndustry={selectedIndustry || undefined}
              title="Låt oss hjälpa dig (helt kostnadsfritt) att hitta rätt partner"
              description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationPartners;
