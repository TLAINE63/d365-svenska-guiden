import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import SwedenRegionMap from "@/components/SwedenRegionMap";
import { allIndustries } from "@/data/partners";
import { usePartners, SwedishRegion } from "@/hooks/usePartners";

// Geography filter options
const geographyFilters = [
  { label: "Sverige", value: "Sverige" },
  { label: "Norden", value: "Norden" },
  { label: "Europa", value: "Europa" },
  { label: "Övriga världen", value: "Övriga världen" }
];

interface ApplicationPartnersProps {
  applicationFilter: string;
  pageSource: string;
}

const ApplicationPartners = ({ applicationFilter, pageSource }: ApplicationPartnersProps) => {
  const { data: dbPartners, isLoading } = usePartners();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<SwedishRegion[]>([]);

  // Clear regions when geography changes away from Sverige
  useEffect(() => {
    if (selectedGeography !== "Sverige") {
      setSelectedRegions([]);
    }
  }, [selectedGeography]);

  const handleToggleRegion = (region: SwedishRegion) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

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

  // Session-stable seed for consistent random ordering
  const sessionSeed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  
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
        // Geography is now an array - check if partner covers the selected geography
        const partnerGeo = Array.isArray(pf.geography) ? pf.geography : (pf.geography ? [pf.geography] : ["Sverige"]);
        const geoHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
        const selIdx = geoHierarchy.indexOf(selectedGeography);
        // Partner matches if they have the selected geography or a broader one
        const maxPartnerIdx = Math.max(...partnerGeo.map(g => geoHierarchy.indexOf(g)));
        if (maxPartnerIdx < selIdx) return false;
        
        // If Sverige is selected and regions are selected, filter by regions
        if (selectedGeography === "Sverige" && selectedRegions.length > 0) {
          const partnerRegions = pf.swedenRegions || [];
          // Partner matches if they have no regions (covers all Sweden) or if any selected region matches
          if (partnerRegions.length > 0) {
            const hasMatchingRegion = selectedRegions.some(r => partnerRegions.includes(r));
            if (!hasMatchingRegion) return false;
          }
        }
      }
      return true;
    });
    
    // Seeded shuffle for fair exposure
    const seededShuffle = <T,>(array: T[], seed: number): T[] => {
      const shuffled = [...array];
      let currentIndex = shuffled.length;
      let currentSeed = seed;
      
      const seededRandom = () => {
        currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
        return currentSeed / 0x7fffffff;
      };
      
      while (currentIndex > 0) {
        const randomIndex = Math.floor(seededRandom() * currentIndex);
        currentIndex--;
        [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
      }
      
      return shuffled;
    };
    
    return seededShuffle(result, sessionSeed);
  }, [productKey, partners, selectedIndustry, selectedGeography, selectedRegions, sessionSeed]);

  // Show all 18 industries in the filter
  const availableIndustries = allIndustries;

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
          title="Ange vart geografiskt ni har er verksamhet och som är relevant för denna lösning (organisation, kontor/personal)"
          icon="geography"
          options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
          selectedValue={selectedGeography}
          onSelect={setSelectedGeography}
          colorScheme="crm"
        />

        {/* Swedish Region Map - shows when Sverige is selected */}
        {selectedGeography === "Sverige" && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                Välj region i Sverige (valfritt)
              </h3>
              <p className="text-sm text-muted-foreground">
                Klicka på en eller flera regioner för att filtrera partners som har lokal närvaro där
              </p>
            </div>
            <div className="flex justify-center">
              <SwedenRegionMap
                selectedRegions={selectedRegions}
                onToggleRegion={handleToggleRegion}
                colorScheme="crm"
              />
            </div>
            {selectedRegions.length > 0 && (
              <div className="text-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedRegions([])}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Rensa regionval
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Filter Results Summary */}
        {(selectedIndustry || selectedGeography || selectedRegions.length > 0) && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
              {selectedIndustry && <> inom <span className="font-semibold text-crm">{selectedIndustry}</span></>}
              {(selectedIndustry && (selectedGeography || selectedRegions.length > 0)) && <> och</>}
              {selectedGeography && <> med täckning i <span className="font-semibold text-crm">{selectedGeography}</span></>}
              {selectedRegions.length > 0 && <> ({selectedRegions.join(", ")})</>}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedIndustry(null);
                setSelectedGeography(null);
                setSelectedRegions([]);
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
                showRandomIndicator={true}
              />
            );
          })}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Inga partner listas med denna filtrering?</h3>
            <p className="text-muted-foreground">
              Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
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
        {(selectedIndustry || selectedGeography || selectedRegions.length > 0) && (
          <div className="max-w-xl mx-auto mt-12">
            {/* Premium Contact CTA Card - same design as PartnerProfile */}
            <article className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
              
              {/* Animated orb */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/40 to-transparent rounded-full blur-3xl animate-pulse" />
              
              <div className="relative p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Låt oss hjälpa dig hitta rätt partner
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      Det här var ett första steg i rätt riktning. Låt oss hjälpa dig vidare – helt kostnadsfritt.
                    </p>
                  </div>
                </div>
                
                {/* Filter context with glass effect */}
                <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Din sökning
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 backdrop-blur-sm">
                      {applicationFilter}
                    </Badge>
                    {selectedIndustry && (
                      <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                        {selectedIndustry}
                      </Badge>
                    )}
                    {selectedGeography && (
                      <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                        {selectedGeography}
                      </Badge>
                    )}
                    {selectedRegions.map(region => (
                      <Badge key={region} className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <LeadCTA
                  sourcePage={pageSource}
                  selectedProduct={applicationFilter}
                  selectedIndustry={selectedIndustry || undefined}
                  variant="inline"
                />
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationPartners;
