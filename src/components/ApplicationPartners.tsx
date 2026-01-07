import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import { partners, allIndustries, matchesProductFilter, getProductRanking } from "@/data/partners";

// Company size filter options - matching partner data values
const companySizeFilters = [
  { label: "1-49 anställda", values: ["1-49"] },
  { label: "50-99 anställda", values: ["50-99"] },
  { label: "100-249 anställda", values: ["100-249"] },
  { label: "250-999 anställda", values: ["250-999"] },
  { label: "1.000-4.999 anställda", values: ["1.000-4.999"] },
  { label: "Mer än 5.000 anställda", values: [">5.000"] }
];

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
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);

  // Determine which product key to use based on application filter
  const productKey: 'bc' | 'fsc' | 'crm' | null = useMemo(() => {
    if (applicationFilter === "Business Central") return 'bc';
    if (applicationFilter === "Finance & SCM") return 'fsc';
    if (["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"].includes(applicationFilter)) {
      return 'crm';
    }
    return null;
  }, [applicationFilter]);

  const filteredPartners = useMemo(() => {
    if (!productKey) return [];
    
    // Only show partners with productFilters for this product (betalande partners)
    let result = partners.filter(partner => partner.productFilters?.[productKey]);
    
    // Get selected size value for filtering
    const selectedSizeValue = selectedCompanySize 
      ? companySizeFilters.find(f => f.label === selectedCompanySize)?.values[0]
      : undefined;
    
    // Apply product-specific filters
    result = result.filter(partner => 
      matchesProductFilter(partner, productKey, selectedIndustry || undefined, selectedSizeValue, selectedGeography || undefined)
    );
    
    // Sort by product ranking, then alphabetically
    return result.sort((a, b) => {
      const rankA = getProductRanking(a, productKey);
      const rankB = getProductRanking(b, productKey);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.name.localeCompare(b.name, 'sv');
    });
  }, [productKey, selectedIndustry, selectedCompanySize, selectedGeography]);

  // Get available industries for this product's betalande partners
  const availableIndustries = useMemo(() => {
    if (!productKey) return allIndustries;
    const industries = new Set<string>();
    partners.forEach(partner => {
      partner.productFilters?.[productKey]?.industries.forEach(ind => industries.add(ind));
    });
    return allIndustries.filter(ind => industries.has(ind));
  }, [productKey]);

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

        {/* Company Size Filter */}
        <FilterButtons
          title="Hur många anställda finns på ert företag?"
          icon="employees"
          options={companySizeFilters.map(f => ({ label: f.label, value: f.label }))}
          selectedValue={selectedCompanySize}
          onSelect={setSelectedCompanySize}
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
        {(selectedIndustry || selectedCompanySize || selectedGeography) && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
              {selectedIndustry && <> inom <span className="font-semibold text-crm">{selectedIndustry}</span></>}
              {(selectedIndustry && (selectedCompanySize || selectedGeography)) && <>,</>}
              {selectedCompanySize && <> för <span className="font-semibold text-crm">{selectedCompanySize}</span></>}
              {(selectedCompanySize && selectedGeography) && <> och</>}
              {selectedGeography && <> med täckning i <span className="font-semibold text-crm">{selectedGeography}</span></>}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedIndustry(null);
                setSelectedCompanySize(null);
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
            const baseUrl = `/partner/${partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            const params = new URLSearchParams();
            params.set("product", applicationFilter);
            if (selectedIndustry) {
              params.set("industry", selectedIndustry);
            }
            if (selectedCompanySize) {
              params.set("companySize", selectedCompanySize);
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
                highlightedCompanySize={selectedCompanySize || undefined}
                highlightedGeography={selectedGeography || undefined}
              />
            );
          })}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Inga partners hittades med de valda filtren. Försök att ändra dina filterval.
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
        {(selectedIndustry || selectedCompanySize || selectedGeography) && (
          <div className="max-w-xl mx-auto mt-12">
            <LeadCTA
              sourcePage={pageSource}
              selectedProduct={applicationFilter}
              selectedIndustry={selectedIndustry || undefined}
              selectedCompanySize={selectedCompanySize || undefined}
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
