import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Calendar, MessageSquare, Mail, Award, Target, Shield, ExternalLink, Star, Loader2 } from "lucide-react";
import { FilterButtons, MultiFilterButtons } from "@/components/FilterButtons";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";
import partnersComparisonImg from "@/assets/partners-comparison-proposals.jpg";
import PartnerGuideDialog from "@/components/PartnerGuideDialog";
import LeadCTA from "@/components/LeadCTA";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import UrgencyBadge from "@/components/UrgencyBadge";
import PartnerCard from "@/components/PartnerCard";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const partnerBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Välj Partner", url: "https://d365.se/valj-partner" },
];
import partnerMapSweden from "@/assets/partner-map-sweden.png";
import { allIndustries } from "@/data/partners";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";

// Partner FAQs for schema
const partnerFaqs = [
  {
    question: "Hur hittar jag rätt Dynamics 365 partner i Sverige?",
    answer: "Hitta rätt Dynamics 365 partner i Sverige genom att filtrera på din bransch, vald applikation (Business Central, Sales, Customer Service m.fl.) och geografisk täckning. Välj en partner med dokumenterad erfarenhet i din bransch, relevant referensuppdrag och Microsoft-certifiering (Solutions Partner). På d365.se kan du jämföra partners kostnadsfritt och begära matchning."
  },
  {
    question: "Vad är skillnaden mellan olika Dynamics 365 partners i Sverige?",
    answer: "Business Central partner jämförelse: partners skiljer sig i storlek (10–500 konsulter), branschfokus, pris och certifieringsnivå. Stora partners som Stena/Systeam har bredare kapacitet men kan vara dyrare. Mellanstora nischade partners erbjuder ofta djupare branschkompetens och bättre tillgänglighet. Nyckelskillnader: antal certifierade konsulter, antal genomförda projekt, kundreferenser och supportmodell."
  },
  {
    question: "Vad innebär Microsoft-certifiering för Dynamics 365 partners?",
    answer: "Microsoft-certifierade partners (Solutions Partner) har genomgått Microsofts kvalitetsgranskning och uppfyller krav på antal certifierade konsulter, kundnöjdhet och genomförda projekt. Det finns fyra specialiseringar relevanta för Dynamics 365: Business Applications (ERP), Business Applications (CRM), Modern Work och Azure. En certifierad Microsoft partner ger högre trygghet vid implementering och ger kunden tillgång till Microsofts supportkanaler."
  },
  {
    question: "Hur mycket kostar ett Dynamics 365-implementeringsprojekt?",
    answer: "Implementeringskostnader varierar kraftigt: Business Central för SMB (10–50 användare) kostar typiskt 200 000–800 000 kr i konsulttid. Finance & Supply Chain för större företag kan kosta 1–5 MSEK. Faktorer som påverkar: antal användare, komplexitet av integrationer, befintliga system, branschspecifika krav och vald partner. Licenskostnaden tillkommer – Business Central från 884 kr/användare/mån."
  },
  {
    question: "Har partnern erfarenhet av vår bransch?",
    answer: "Välj en partner med erfarenhet från liknande projekt och som förstår era specifika krav inom er bransch. Många partners har branschspecifika lösningar och acceleratorer som kortar implementationstiden. Be alltid om 2–3 referensuppdrag från liknande bolag i er bransch."
  },
  {
    question: "Hur ser en bra Dynamics 365-implementationsmetodik ut?",
    answer: "Bra partners arbetar enligt beprövade metoder som Microsofts Success by Design och erbjuder tydlig projektledning, förändringsledning och utbildning. Be partnern beskriva hur de hanterar scope creep, förseningar och ändrade krav – det avslöjar deras professionalism."
  },
  {
    question: "Vilken support erbjuder Dynamics 365-partners efter implementationen?",
    answer: "Kontrollera att det finns tydlig plan för support, uppgraderingar och vidareutveckling med dedikerad supportorganisation och SLA:er. Microsoft releases 2 release waves per år – fråga hur partnern hanterar uppgraderingar och om de ingår i supportavtalet."
  },
  {
    question: "Hur transparenta är Dynamics 365-partners med kostnader?",
    answer: "Be om tydlig offert med alla kostnader specificerade – konsulttimmar, licenser, tredjepartslösningar och löpande support. Fråga specifikt hur de hanterar förändringar i projektomfattning (change requests) och om de erbjuder fast pris eller löpande räkning."
  },
];


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

// Geography filter options
const geographyFilters = [
  { label: "Sverige", value: "Sverige" },
  { label: "Norden", value: "Norden" },
  { label: "Europa", value: "Europa" },
  { label: "Övriga världen", value: "Övriga världen" }
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

// Product key type matching the database structure
type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

// Map application names to product keys
const getProductKeysForApp = (app: string): ProductKey[] => {
  switch (app) {
    case "Business Central":
      return ['bc'];
    case "Finance & SCM":
      return ['fsc'];
    case "Sales":
      return ['sales'];
    case "Customer Service":
    case "Field Service":
    case "Contact Center":
      return ['service'];
    case "Customer Insights (Marketing)":
      return ['sales']; // Marketing is grouped with sales
    // Specialty products - no product key mapping, filtered via applications array
    case "Project Operations":
    case "Commerce":
    case "Human Resources":
      return []; // These are standalone products
    default:
      return [];
  }
};

// Specialty products that are filtered via applications array, not product_filters
const specialtyProducts = ["Project Operations", "Commerce", "Human Resources"];

// Helper to check if a database partner matches product filter criteria
const matchesDbProductFilter = (
  partner: DatabasePartner, 
  productKey: ProductKey,
  industry?: string,
  companySize?: string,
  geography?: string
): boolean => {
  const productFilter = partner.product_filters?.[productKey];
  if (!productFilter) return false;
  
  // Check industry filter
  if (industry && !productFilter.industries?.includes(industry)) {
    return false;
  }
  
  // Check company size filter
  if (companySize && productFilter.companySize && !productFilter.companySize.includes(companySize)) {
    return false;
  }
  
  // Check geography filter with hierarchy
  if (geography) {
    // Geography is now an array - check if partner covers the selected geography
    const partnerGeo = Array.isArray(productFilter.geography) ? productFilter.geography : (productFilter.geography ? [productFilter.geography] : ["Sverige"]);
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
    const selectedGeoIndex = geographyHierarchy.indexOf(geography);
    const maxPartnerGeoIndex = Math.max(...partnerGeo.map(g => geographyHierarchy.indexOf(g)));
    if (maxPartnerGeoIndex < selectedGeoIndex) {
      return false;
    }
  }
  
  return true;
};

// Helper to get product ranking from database partner
const getDbProductRanking = (partner: DatabasePartner, productKey: ProductKey): number => {
  return partner.product_filters?.[productKey]?.ranking ?? 999;
};

const ValjPartner = () => {
  const { data: dbPartners, isLoading } = usePartners();
  const [showLeadMagnet, setShowLeadMagnet] = useState(true);
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);

  // Filter to only show featured partners from database
  const partners = useMemo(() => {
    return (dbPartners || []).filter(p => p.is_featured === true);
  }, [dbPartners]);

  const toggleApplication = (app: string) => {
    setSelectedApplications(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  // Helper to get the lowest industry index for a partner (for sorting by industry priority)
  const getIndustryPriority = (partner: DatabasePartner, industry: string | null): number => {
    if (!industry) return 0;
    for (let i = 0; i < (partner.industries || []).length; i++) {
      if ((partner.industries || [])[i].toLowerCase().includes(industry.toLowerCase()) ||
          industry.toLowerCase().includes((partner.industries || [])[i].toLowerCase())) {
        return i;
      }
    }
    return Infinity;
  };

  // Helper to determine which product ranking to use based on selected applications
  const getProductRanking = (partner: DatabasePartner): number => {
    // Determine which product type is primarily selected (excluding specialty products)
    const hasBCApp = selectedApplications.includes("Business Central");
    const hasFSCApp = selectedApplications.includes("Finance & SCM");
    const hasSalesApp = selectedApplications.some(app => 
      ["Sales", "Customer Insights (Marketing)"].includes(app)
    );
    const hasServiceApp = selectedApplications.some(app => 
      ["Customer Service", "Field Service", "Contact Center"].includes(app)
    );
    
    if (hasBCApp && !hasFSCApp && !hasSalesApp && !hasServiceApp) {
      return getDbProductRanking(partner, 'bc');
    }
    if (hasFSCApp && !hasBCApp && !hasSalesApp && !hasServiceApp) {
      return getDbProductRanking(partner, 'fsc');
    }
    if (hasSalesApp && !hasBCApp && !hasFSCApp && !hasServiceApp) {
      return getDbProductRanking(partner, 'sales');
    }
    if (hasServiceApp && !hasBCApp && !hasFSCApp && !hasSalesApp) {
      return getDbProductRanking(partner, 'service');
    }
    
    // If mixed or no specific apps selected, return lowest ranking across all
    const bcRank = getDbProductRanking(partner, 'bc');
    const fscRank = getDbProductRanking(partner, 'fsc');
    const salesRank = getDbProductRanking(partner, 'sales');
    const serviceRank = getDbProductRanking(partner, 'service');
    return Math.min(bcRank, fscRank, salesRank, serviceRank);
  };

  // Helper to build partner profile URL with filter context
  const buildPartnerProfileUrl = (partnerSlug: string) => {
    const baseUrl = `/partner/${partnerSlug}`;
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

  // Filter and sort partners - only show featured partners from database
  const filteredPartners = useMemo(() => {
    // Determine which product type is selected (excluding specialty products)
    const hasBCApp = selectedApplications.includes("Business Central");
    const hasFSCApp = selectedApplications.includes("Finance & SCM");
    const hasSalesApp = selectedApplications.some(app => 
      ["Sales", "Customer Insights (Marketing)"].includes(app)
    );
    const hasServiceApp = selectedApplications.some(app => 
      ["Customer Service", "Field Service", "Contact Center"].includes(app)
    );
    
    // Check for specialty products (filtered via applications array)
    const selectedSpecialtyProducts = selectedApplications.filter(app => 
      specialtyProducts.includes(app)
    );
    
    let result: DatabasePartner[] = [];
    
    if (selectedApplications.length === 0) {
      // No application selected - show all featured partners that have any productFilter
      result = partners.filter(partner => 
        partner.product_filters?.bc || partner.product_filters?.fsc || 
        partner.product_filters?.sales || partner.product_filters?.service
      );
    } else if (selectedSpecialtyProducts.length > 0 && !hasBCApp && !hasFSCApp && !hasSalesApp && !hasServiceApp) {
      // Only specialty products selected - filter by applications array
      result = partners.filter(partner => 
        selectedSpecialtyProducts.every(app => partner.applications?.includes(app))
      );
    } else {
      // Filter based on selected applications (product_filters)
      const matchingPartners = new Set<DatabasePartner>();
      
      partners.forEach(partner => {
        let matchesProductFilter = false;
        
        if (hasBCApp && partner.product_filters?.bc) {
          if (matchesDbProductFilter(partner, 'bc', selectedIndustry || undefined, undefined, selectedGeography || undefined)) {
            matchesProductFilter = true;
          }
        }
        if (hasFSCApp && partner.product_filters?.fsc) {
          if (matchesDbProductFilter(partner, 'fsc', selectedIndustry || undefined, undefined, selectedGeography || undefined)) {
            matchesProductFilter = true;
          }
        }
        if (hasSalesApp && partner.product_filters?.sales) {
          if (matchesDbProductFilter(partner, 'sales', selectedIndustry || undefined, undefined, selectedGeography || undefined)) {
            matchesProductFilter = true;
          }
        }
        if (hasServiceApp && partner.product_filters?.service) {
          if (matchesDbProductFilter(partner, 'service', selectedIndustry || undefined, undefined, selectedGeography || undefined)) {
            matchesProductFilter = true;
          }
        }
        
        // If specialty products are also selected, partner must have them in applications
        const matchesSpecialtyProducts = selectedSpecialtyProducts.length === 0 || 
          selectedSpecialtyProducts.every(app => partner.applications?.includes(app));
        
        if (matchesProductFilter && matchesSpecialtyProducts) {
          matchingPartners.add(partner);
        }
      });
      
      result = Array.from(matchingPartners);
    }
    
    // Apply additional filters for when no apps are selected
    if (selectedApplications.length === 0) {
      if (selectedIndustry) {
        result = result.filter(partner => 
          (partner.industries || []).some(ind => ind === selectedIndustry)
        );
      }
      
      if (selectedGeography) {
        const geographyHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
        const selectedGeoIndex = geographyHierarchy.indexOf(selectedGeography);
        result = result.filter(partner => {
          // Check geography in any product filter - geography is now an array
          const getMaxGeoIndex = (geo: string | string[] | undefined) => {
            const geoArray = Array.isArray(geo) ? geo : (geo ? [geo] : ["Sverige"]);
            return Math.max(...geoArray.map(g => geographyHierarchy.indexOf(g)));
          };
          const bcGeoIdx = getMaxGeoIndex(partner.product_filters?.bc?.geography);
          const fscGeoIdx = getMaxGeoIndex(partner.product_filters?.fsc?.geography);
          const salesGeoIdx = getMaxGeoIndex(partner.product_filters?.sales?.geography);
          const serviceGeoIdx = getMaxGeoIndex(partner.product_filters?.service?.geography);
          const maxGeoIndex = Math.max(bcGeoIdx, fscGeoIdx, salesGeoIdx, serviceGeoIdx);
          return maxGeoIndex >= selectedGeoIndex;
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
  }, [partners, selectedApplications, selectedIndustry, selectedCompanySize, selectedGeography]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Hitta Dynamics 365 Partner Sverige – Jämför certifierade Microsoft-partners"
        description="Jämför Microsoft-certifierade Dynamics 365 partners i Sverige. Filtrera på bransch, applikation och geografi. Business Central, Finance, Sales & CRM. Kostnadsfri matchning."
        canonicalPath="/valj-partner"
        keywords="hitta Dynamics 365 partner Sverige, Business Central partner jämförelse, Microsoft partner certifierad, Dynamics 365 implementering Sverige, ERP partner Sverige, CRM partner Sverige, Microsoft Solutions Partner, Business Central konsult"
        ogImage="https://d365.se/og-partner.png"
      />
      <FAQSchema faqs={partnerFaqs} />
      <ServiceSchema 
        name="Dynamics 365 Partnerval"
        description="Hjälp att välja rätt Microsoft Dynamics 365 implementeringspartner baserat på bransch, storlek och behov."
      />
      <BreadcrumbSchema items={partnerBreadcrumbs} />
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
                Det kritiska partnervalet
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
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 sm:mb-10 md:mb-12">
            {/* Partner Map */}
            <div className="shrink-0 w-48 md:w-56">
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                <img 
                  src={partnerMapSweden} 
                  alt="Karta över Dynamics 365-partners kontor i Sverige" 
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Kontorsplaceringar för partners i Sverige
              </p>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Vem är din mest lämpade Dynamics 365-partner?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Nedan följer ett urval av partners som arbetar med Microsoft Dynamics 365 i Sverige och som även har kontor på platserna som kartan visar. Ännu viktigare vid partnerval, är vilken kompetens partner besitter, dels inom respektive applikationsområde, men framförallt att de förstår din verksamhet - din bransch. Välj de applikationer som du är mest intresserad av, vilken bransch du tillhör, så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
              </p>
            </div>
          </div>

          {/* Application Filter */}
          <MultiFilterButtons
            title="Filtrera på Dynamics 365 Applikation"
            icon="application"
            options={allApplications.map(app => ({ label: app, value: app }))}
            selectedValues={selectedApplications}
            onToggle={toggleApplication}
            colorScheme="amber"
            showApplicationIcons={true}
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

          {/* Geography Filter */}
          <FilterButtons
            title="Ange vart geografiskt ni har er verksamhet och som är relevant för denna lösning (organisation, kontor/personal)"
            icon="geography"
            options={geographyFilters.map(f => ({ label: f.label, value: f.value }))}
            selectedValue={selectedGeography}
            onSelect={setSelectedGeography}
            colorScheme="amber"
          />

          {/* Filter Results Summary */}
          {(selectedApplications.length > 0 || selectedIndustry || selectedGeography) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
                {selectedApplications.length > 0 && <> som levererar <span className="font-semibold text-primary">{selectedApplications.join(', ')}</span></>}
                {selectedIndustry && <> inom <span className="font-semibold text-accent">{selectedIndustry}</span></>}
                {selectedGeography && <> i <span className="font-semibold text-accent">{selectedGeography}</span></>}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedApplications([]);
                  setSelectedIndustry(null);
                  setSelectedGeography(null);
                }}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                Rensa alla filter
              </Button>
            </div>
          )}

          {filteredPartners.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-xl border border-border/50">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Inga partner listas med denna filtrering?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedApplications([]);
                    setSelectedIndustry(null);
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
                if (hasBCApp && partner.product_filters?.bc) productKey = 'bc';
                else if (hasFSCApp && partner.product_filters?.fsc) productKey = 'fsc';
                else if (hasCRMApp && (partner.product_filters?.crm || partner.product_filters?.sales || partner.product_filters?.service)) productKey = 'crm';
                else if (partner.product_filters?.bc) productKey = 'bc';
                else if (partner.product_filters?.fsc) productKey = 'fsc';
                else if (partner.product_filters?.crm || partner.product_filters?.sales || partner.product_filters?.service) productKey = 'crm';

                return (
                  <PartnerCard
                    key={index}
                    partner={partner}
                    profileUrl={buildPartnerProfileUrl(partner.slug)}
                    colorScheme="amber"
                    productKey={productKey}
                    highlightedProduct={selectedApplications.length > 0 ? selectedApplications.join(", ") : undefined}
                    highlightedIndustry={selectedIndustry || undefined}
                    showRandomIndicator={true}
                  />
                );
              })}
            </div>
          )}

          {/* Lead CTA with urgency badge */}
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
                {(selectedApplications.length > 0 || selectedIndustry || selectedCompanySize || selectedGeography) && (
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Din sökning
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplications.map(app => (
                        <Badge key={app} className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 backdrop-blur-sm">
                          {app}
                        </Badge>
                      ))}
                      {selectedIndustry && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedIndustry}
                        </Badge>
                      )}
                      {selectedCompanySize && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedCompanySize}
                        </Badge>
                      )}
                      {selectedGeography && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedGeography}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <LeadCTA
                  sourcePage="/valj-partner"
                  selectedProducts={selectedApplications.length > 0 ? selectedApplications : undefined}
                  selectedIndustry={selectedIndustry || undefined}
                  selectedCompanySize={selectedCompanySize || undefined}
                  selectedGeography={selectedGeography || undefined}
                  variant="inline"
                />
              </div>
            </article>
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