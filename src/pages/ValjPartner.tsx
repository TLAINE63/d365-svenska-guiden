import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Calendar, MessageSquare, Mail, Award, Target, Shield, ExternalLink, Star } from "lucide-react";
import { FilterButtons, MultiFilterButtons } from "@/components/FilterButtons";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";
import partnersComparisonImg from "@/assets/partners-comparison-proposals.jpg";
import PartnerGuideDialog from "@/components/PartnerGuideDialog";
import LeadCTA from "@/components/LeadCTA";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import UrgencyBadge from "@/components/UrgencyBadge";
import PartnerCard from "@/components/PartnerCard";
import { partners, Partner, allIndustries, matchesProductFilter, getProductRanking as getProductFilterRanking } from "@/data/partners";


// All available Dynamics 365 applications for filtering
const allApplications = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Service",
  "Customer Insights (Marketing)",
  "Field Service",
  "Contact Center",
  "Project Operations",
  "Commerce",
  "Human Resources"
];

// Company size filter options with mapping to partner data values
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

// Helper function to convert company sizes to readable categories
const getCompanySizeCategories = (sizes: string[]): string[] => {
  const categories = new Set<string>();
  
  sizes.forEach(size => {
    if (size === "1-49" || size === "50-99") {
      categories.add("SMB (1-99 anställda)");
    }
    if (size === "100-249" || size === "250-999") {
      categories.add("Mid-market (100-999)");
    }
    if (size === "1.000-4.999" || size === ">5.000") {
      categories.add("Enterprise (1.000+)");
    }
  });
  
  return Array.from(categories);
};

const ValjPartner = () => {
  const [showLeadMagnet, setShowLeadMagnet] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);

  const toggleApplication = (app: string) => {
    setSelectedApplications(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  // Helper to get the lowest industry index for a partner (for sorting by industry priority)
  const getIndustryPriority = (partner: Partner, industry: string | null): number => {
    if (!industry) return 0;
    for (let i = 0; i < partner.industries.length; i++) {
      if (partner.industries[i].toLowerCase().includes(industry.toLowerCase()) ||
          industry.toLowerCase().includes(partner.industries[i].toLowerCase())) {
        return i;
      }
    }
    return Infinity;
  };

  // Helper to determine which product ranking to use based on selected applications
  const getProductRanking = (partner: Partner): number => {
    // Determine which product type is primarily selected
    const hasBCApp = selectedApplications.includes("Business Central");
    const hasFSCApp = selectedApplications.includes("Finance & SCM");
    const hasCRMApp = selectedApplications.some(app => 
      ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"].includes(app)
    );
    
    if (hasBCApp && !hasFSCApp && !hasCRMApp) {
      return partner.rankings?.bc ?? 999;
    }
    if (hasFSCApp && !hasBCApp && !hasCRMApp) {
      return partner.rankings?.fsc ?? 999;
    }
    if (hasCRMApp && !hasBCApp && !hasFSCApp) {
      return partner.rankings?.crm ?? 999;
    }
    
    // If mixed or no specific apps selected, return lowest ranking across all
    const bcRank = partner.rankings?.bc ?? 999;
    const fscRank = partner.rankings?.fsc ?? 999;
    const crmRank = partner.rankings?.crm ?? 999;
    return Math.min(bcRank, fscRank, crmRank);
  };

  // Helper to build partner profile URL with filter context
  const buildPartnerProfileUrl = (partnerName: string) => {
    const baseUrl = `/partner/${partnerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const params = new URLSearchParams();
    
    // Only pass the first selected application if any
    if (selectedApplications.length > 0) {
      params.set("product", selectedApplications[0]);
    }
    if (selectedIndustry) {
      params.set("industry", selectedIndustry);
    }
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  // Filter and sort partners - only show partners with productFilters defined
  const filteredPartners = useMemo(() => {
    // Determine which product type is selected
    const hasBCApp = selectedApplications.includes("Business Central");
    const hasFSCApp = selectedApplications.includes("Finance & SCM");
    const hasCRMApp = selectedApplications.some(app => 
      ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"].includes(app)
    );
    
    // Get selected size value for filtering
    const selectedSizeValue = selectedCompanySize 
      ? companySizeFilters.find(f => f.label === selectedCompanySize)?.values[0]
      : undefined;
    
    let result: Partner[] = [];
    
    if (selectedApplications.length === 0) {
      // No application selected - show all partners that have any productFilter
      result = partners.filter(partner => 
        partner.productFilters?.bc || partner.productFilters?.fsc || partner.productFilters?.crm
      );
    } else {
      // Filter based on selected applications
      const matchingPartners = new Set<Partner>();
      
      partners.forEach(partner => {
        if (hasBCApp && partner.productFilters?.bc) {
          if (matchesProductFilter(partner, 'bc', selectedIndustry || undefined, selectedSizeValue, selectedGeography || undefined)) {
            matchingPartners.add(partner);
          }
        }
        if (hasFSCApp && partner.productFilters?.fsc) {
          if (matchesProductFilter(partner, 'fsc', selectedIndustry || undefined, selectedSizeValue, selectedGeography || undefined)) {
            matchingPartners.add(partner);
          }
        }
        if (hasCRMApp && partner.productFilters?.crm) {
          if (matchesProductFilter(partner, 'crm', selectedIndustry || undefined, selectedSizeValue, selectedGeography || undefined)) {
            matchingPartners.add(partner);
          }
        }
      });
      
      result = Array.from(matchingPartners);
    }
    
    // Apply additional filters for when no apps are selected
    if (selectedApplications.length === 0) {
      if (selectedIndustry) {
        result = result.filter(partner => 
          partner.industries.some(ind => ind === selectedIndustry)
        );
      }
      
      if (selectedSizeValue) {
        result = result.filter(partner => 
          partner.companySize.includes(selectedSizeValue)
        );
      }
      
      if (selectedGeography) {
        const geographyHierarchy = ["Sverige", "Norden", "Europa", "Internationellt"];
        const selectedGeoIndex = geographyHierarchy.indexOf(selectedGeography);
        result = result.filter(partner => {
          const partnerGeoIndex = geographyHierarchy.indexOf(partner.geography);
          return partnerGeoIndex >= selectedGeoIndex;
        });
      }
    }
    
    // Shuffle partners randomly when filters are applied for fair exposure
    // Use Fisher-Yates shuffle algorithm
    const shuffled = [...result];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [selectedApplications, selectedIndustry, selectedCompanySize, selectedGeography]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Partner Guide Dialog */}
      <PartnerGuideDialog 
        open={guideOpen} 
        onOpenChange={setGuideOpen} 
        partners={partners}
      />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src={partnersComparisonImg} 
            alt="Teamwork and partnership selection" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Välj Partner
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 sm:mb-8">
                Hitta rätt partner till ditt Dynamics 365-projekt
              </p>
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto text-lg sm:text-xl h-16 sm:h-20 px-8 sm:px-12 font-bold shadow-lg hover:shadow-xl transition-all rounded-xl"
                onClick={() => setGuideOpen(true)}
              >
                <span>Få hjälp att välja rätt partner</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Fem viktiga frågor Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Fem viktiga frågor vid val av implementationspartner
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2 mb-4">
                Valet av implementationspartner är ofta den viktigaste faktorn för en lyckad Dynamics 365-implementation. 
                En bra partner kan vara skillnaden mellan ett framgångsrikt projekt och ett som kostar mer tid och pengar än planerat.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Här är fem viktiga frågor du (eller din organisation) bör ställa er själva inför valet av implementationspartner för Dynamics 365
              </p>
            </div>

            <div className="space-y-6">
              {/* Fråga 1 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Har partnern erfarenhet av vår bransch och våra processer?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Har de genomfört liknande projekt tidigare?</li>
                    <li>• Förstår de våra specifika krav inom t.ex. tillverkning, tjänster, handel eller offentlig sektor?</li>
                    <li>• Har de kanske en branschspecifik lösning som passar vår verksamhet?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 2 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Hur ser deras implementationsmetodik ut?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Arbetar de enligt en beprövad metod (t.ex. Microsoft's Success by Design)?</li>
                    <li>• Hur hanterar de projektledning, förändringsledning och utbildning?</li>
                    <li>• Erbjuder de en snabbstart eller paketerad lösning?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 3 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Vilken typ av support och förvaltning erbjuder de efter implementationen?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Finns det en tydlig plan för support, uppgraderingar och vidareutveckling?</li>
                    <li>• Har de en dedikerad supportorganisation?</li>
                    <li>• Erbjuder de SLA:er och proaktiv förvaltning?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 4 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Hur transparenta är de med kostnader och tidsplan?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Får vi en tydlig offert med alla kostnader specificerade?</li>
                    <li>• Hur hanterar de förändringar i omfattning?</li>
                    <li>• Har de referensprojekt med liknande budget och tidsram?</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Fråga 5 */}
              <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
                    <span className="text-2xl">✅</span>
                    Hur väl passar de vår organisationskultur och arbetssätt?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Är de lyhörda, pedagogiska och samarbetsvilliga?</li>
                    <li>• Känns de som en långsiktig partner snarare än bara en leverantör?</li>
                    <li>• Har vi god personkemi med deras team?</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Banner after Fem viktiga frågor */}
      {showLeadMagnet && (
        <section className="px-4 py-8 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <LeadMagnetBanner 
              sourcePage="/valj-partner" 
              onClose={() => setShowLeadMagnet(false)}
            />
          </div>
        </section>
      )}


      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Dynamics 365-partners
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
              Här är ett urval av partners som arbetar med Microsoft Dynamics 365 i Sverige. Välj de applikationer som du är mest intresserad av, vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
            </p>
          </div>

          {/* Application Filter */}
          <MultiFilterButtons
            title="Filtrera på applikation"
            icon="application"
            options={allApplications.map(app => ({ label: app, value: app }))}
            selectedValues={selectedApplications}
            onToggle={toggleApplication}
            colorScheme="amber"
          />

          {/* Industry Filter */}
          <FilterButtons
            title="Filtrera på bransch"
            icon="industry"
            options={allIndustries.map(ind => ({ label: ind, value: ind }))}
            selectedValue={selectedIndustry}
            onSelect={setSelectedIndustry}
            colorScheme="amber"
          />

          {/* Company Size Filter */}
          <FilterButtons
            title="Hur många anställda finns på ert företag?"
            icon="employees"
            options={companySizeFilters.map(f => ({ label: f.label, value: f.label }))}
            selectedValue={selectedCompanySize}
            onSelect={setSelectedCompanySize}
            colorScheme="amber"
          />

          {/* Geography Filter */}
          <FilterButtons
            title="Ange geografi som måste täckas in"
            icon="geography"
            options={geographyFilters.map(f => ({ label: f.label, value: f.value }))}
            selectedValue={selectedGeography}
            onSelect={setSelectedGeography}
            colorScheme="amber"
          />

          {/* Filter Results Summary */}
          {(selectedApplications.length > 0 || selectedIndustry || selectedCompanySize || selectedGeography) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
                {selectedApplications.length > 0 && <> som levererar <span className="font-semibold text-primary">{selectedApplications.join(', ')}</span></>}
                {selectedIndustry && <> inom <span className="font-semibold text-accent">{selectedIndustry}</span></>}
                {selectedCompanySize && <> för <span className="font-semibold text-primary">{selectedCompanySize}</span></>}
                {selectedGeography && <> i <span className="font-semibold text-accent">{selectedGeography}</span></>}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedApplications([]);
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

          {filteredPartners.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-border/50">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Märkligt…inga partners blev listade här…
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Men ingen fara. Om du kontaktar oss, så hjälper vi dig hitta några bra alternativ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedApplications([]);
                    setSelectedIndustry(null);
                    setSelectedCompanySize(null);
                    setSelectedGeography(null);
                  }}
                >
                  Rensa alla filter
                </Button>
                <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Link to="/kontakt">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Kontakta oss för hjälp
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPartners.map((partner, index) => {
                // Determine which product key to use for this partner
                const hasBCApp = selectedApplications.includes("Business Central");
                const hasFSCApp = selectedApplications.includes("Finance & SCM");
                const hasCRMApp = selectedApplications.some(app => 
                  ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"].includes(app)
                );
                
                let productKey: 'bc' | 'fsc' | 'crm' | null = null;
                if (hasBCApp && partner.productFilters?.bc) productKey = 'bc';
                else if (hasFSCApp && partner.productFilters?.fsc) productKey = 'fsc';
                else if (hasCRMApp && partner.productFilters?.crm) productKey = 'crm';
                else if (partner.productFilters?.bc) productKey = 'bc';
                else if (partner.productFilters?.fsc) productKey = 'fsc';
                else if (partner.productFilters?.crm) productKey = 'crm';

                return (
                  <PartnerCard
                    key={index}
                    partner={partner}
                    profileUrl={buildPartnerProfileUrl(partner.name)}
                    colorScheme="amber"
                    productKey={productKey}
                    highlightedProduct={selectedApplications.length > 0 ? selectedApplications.join(", ") : undefined}
                    highlightedIndustry={selectedIndustry || undefined}
                  />
                );
              })}
            </div>
          )}

          {/* Lead CTA with urgency badge */}
          <div className="max-w-xl mx-auto mt-12">
            <div className="flex justify-center mb-4">
              <UrgencyBadge variant="consultation" />
            </div>
            <LeadCTA
              sourcePage="/valj-partner"
              selectedProducts={selectedApplications.length > 0 ? selectedApplications : undefined}
              selectedIndustry={selectedIndustry || undefined}
              selectedCompanySize={selectedCompanySize || undefined}
              selectedGeography={selectedGeography || undefined}
              title="Låt oss hjälpa dig (helt kostnadsfritt) att hitta rätt partner"
              description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="flex-shrink-0">
                <img 
                  src={thomasLainePhoto} 
                  alt="Thomas Laine" 
                  className="w-48 h-48 rounded-full object-cover object-[50%_15%] border-4 border-primary/20"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Behöver du vägledning?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Med vår breda erfarenhet av Dynamics 365-marknaden kan vi hjälpa dig att hitta rätt partner för just dina behov och förutsättningar.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl">
                <Link to="/kontakt">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Kontakta oss
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                onClick={() => window.open('https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ep=mlink', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Boka möte
              </Button>
              <Button asChild size="lg" className="bg-muted hover:bg-muted/80 text-muted-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl border border-border">
                <a href="mailto:thomas.laine@dynamicfactory.se">
                  <Mail className="w-5 h-5 mr-2" />
                  Emaila mig
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ValjPartner;