import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import { partners, allIndustries } from "@/data/partners";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

// Company size filter options - matching partner data values
const companySizeFilters = [
  { label: "1-49 anställda", values: ["1-49"] },
  { label: "50-99 anställda", values: ["50-99"] },
  { label: "100-249 anställda", values: ["100-249"] },
  { label: "250-999 anställda", values: ["250-999"] },
  { label: "1.000-4.999 anställda", values: ["1.000-4.999"] },
  { label: "Mer än 5.000 anställda", values: [">5.000"] }
];

interface ApplicationPartnersProps {
  applicationFilter: string;
  pageSource: string;
}

const ApplicationPartners = ({ applicationFilter, pageSource }: ApplicationPartnersProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

  const filteredPartners = useMemo(() => {
    let result = partners.filter(partner => 
      partner.applications.includes(applicationFilter)
    );
    
    if (selectedIndustry) {
      result = result.filter(partner => 
        partner.industries.some(ind => 
          ind.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
          selectedIndustry.toLowerCase().includes(ind.toLowerCase()) ||
          ind === "Alla branscher"
        )
      );
    }

    if (selectedCompanySize) {
      const sizeFilter = companySizeFilters.find(f => f.label === selectedCompanySize);
      if (sizeFilter) {
        result = result.filter(partner => 
          partner.companySize.some(size => sizeFilter.values.includes(size))
        );
      }
    }
    
    // Determine which product ranking to use based on application filter
    const getProductRanking = (partner: typeof partners[0]): number => {
      if (applicationFilter === "Business Central") {
        return partner.rankings?.bc ?? 999;
      }
      if (applicationFilter === "Finance & SCM") {
        return partner.rankings?.fsc ?? 999;
      }
      // CRM applications
      if (["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"].includes(applicationFilter)) {
        return partner.rankings?.crm ?? 999;
      }
      return 999;
    };
    
    // Sort by product ranking first, then alphabetically
    return result.sort((a, b) => {
      const rankA = getProductRanking(a);
      const rankB = getProductRanking(b);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.name.localeCompare(b.name, 'sv');
    });
  }, [applicationFilter, selectedIndustry, selectedCompanySize]);

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
          options={allIndustries.map(ind => ({ label: ind, value: ind }))}
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

        {/* Filter Results Summary */}
        {(selectedIndustry || selectedCompanySize) && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
              {selectedIndustry && <> inom <span className="font-semibold text-crm">{selectedIndustry}</span></>}
              {selectedIndustry && selectedCompanySize && <> och</>}
              {selectedCompanySize && <> för <span className="font-semibold text-crm">{selectedCompanySize}</span></>}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedIndustry(null);
                setSelectedCompanySize(null);
              }}
              className="mt-2 text-muted-foreground hover:text-foreground"
            >
              Rensa alla filter
            </Button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPartners.map((partner, index) => (
            <Card 
              key={index} 
              className="group relative border border-border/50 bg-card hover:bg-crm/5 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl transform hover:-translate-y-1"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-crm via-accent to-crm rounded-t-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-xl sm:text-2xl text-center font-bold text-foreground group-hover:text-crm transition-colors leading-tight">
                  {partner.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {partner.description}
                </p>
                
                <div className="bg-crm/5 rounded-lg p-3 border border-crm/10">
                  <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Applikationer</p>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.applications.map((app, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-crm/10 text-crm border-0 font-medium">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
                  <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Branscher</p>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.industries.map((industry, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-accent/40 text-muted-foreground bg-transparent">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
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
        {(selectedIndustry || selectedCompanySize) && (
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
