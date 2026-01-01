import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { partners, Partner, crmApplications } from "@/data/partners";
import { trackPartnerClick, buildPartnerUrl } from "@/utils/trackPartnerClick";
import { ArrowLeft, ExternalLink, Building2, Briefcase, Users, ArrowDown } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";

// Industry images
import tillverkningImg from "@/assets/industries/tillverkning.jpg";
import handelDistributionImg from "@/assets/industries/handel-distribution.jpg";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.jpg";
import transportLogistikImg from "@/assets/industries/transport-logistik.jpg";
import fastigheterImg from "@/assets/industries/fastigheter.jpg";
import livsmedel from "@/assets/industries/livsmedel.jpg";
import lakemedelLifeScienceImg from "@/assets/industries/lakemedel-life-science.jpg";
import energiImg from "@/assets/industries/energi.jpg";
import serviceUnderhallImg from "@/assets/industries/service-underhall.jpg";
import konsultforetagImg from "@/assets/industries/konsultforetag.jpg";
import itTechImg from "@/assets/industries/it-tech.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.jpg";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.jpg";
import miljoAtervinningImg from "@/assets/industries/miljo-atervinning.jpg";
import partiAgenturhandelImg from "@/assets/industries/parti-agenturhandel.jpg";

type ProductFilter = "bc" | "fsc" | "crm-sales" | "crm-service" | null;

interface Industry {
  name: string;
  slug: string;
  image: string;
  description: string;
  products: ProductFilter[];
  partnerIndustries: string[]; // Maps to partner industry names
}

const industries: Industry[] = [
  { name: "Tillverkning", slug: "tillverkning", image: tillverkningImg, description: "Affärssystem för tillverkande företag", products: ["bc", "fsc"], partnerIndustries: ["Tillverkningsindustrin"] },
  { name: "Handel & Distribution", slug: "handel-distribution", image: handelDistributionImg, description: "Lösningar för handels- och distributionsföretag", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Grossist/Distribution", "Handel (Retail & eCommerce)"] },
  { name: "Bygg & Entreprenad", slug: "bygg-entreprenad", image: byggEntreprenadImg, description: "System för bygg- och entreprenadföretag", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Bygg & Entreprenad"] },
  { name: "Transport & Logistik", slug: "transport-logistik", image: transportLogistikImg, description: "Affärssystem för transport och logistik", products: ["bc", "fsc"], partnerIndustries: ["Transport & Logistik", "Grossist/Distribution"] },
  { name: "Fastigheter", slug: "fastigheter", image: fastigheterImg, description: "Lösningar för fastighetsbranschen", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Fastigheter", "Bygg & Entreprenad"] },
  { name: "Livsmedel", slug: "livsmedel", image: livsmedel, description: "System för livsmedelsindustrin", products: ["bc", "fsc"], partnerIndustries: ["Tillverkningsindustrin", "Grossist/Distribution"] },
  { name: "Läkemedel & Life Science", slug: "lakemedel-life-science", image: lakemedelLifeScienceImg, description: "Lösningar för läkemedel och life science", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Life Science", "Hälso- & sjukvård"] },
  { name: "Energi", slug: "energi", image: energiImg, description: "Affärssystem för energisektorn", products: ["fsc", "crm-sales", "crm-service"], partnerIndustries: ["Energi & Utilities"] },
  { name: "Service & Underhåll", slug: "service-underhall", image: serviceUnderhallImg, description: "System för serviceföretag", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Konsulttjänster"] },
  { name: "Konsultföretag", slug: "konsultforetag", image: konsultforetagImg, description: "Lösningar för konsultbolag", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Konsulttjänster"] },
  { name: "IT & Tech", slug: "it-tech", image: itTechImg, description: "Affärssystem för IT-branschen", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Konsulttjänster"] },
  { name: "Detaljhandel", slug: "detaljhandel", image: detaljhandelImg, description: "System för detaljhandeln", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Handel (Retail & eCommerce)"] },
  { name: "Medlemsorganisationer", slug: "medlemsorganisationer", image: medlemsorganisationerImg, description: "Lösningar för medlemsorganisationer", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Medlemsorganisationer", "Nonprofit", "Offentlig sektor"] },
  { name: "Miljö & Återvinning", slug: "miljo-atervinning", image: miljoAtervinningImg, description: "System för miljö- och återvinningsbranschen", products: ["bc", "fsc"], partnerIndustries: ["Tillverkningsindustrin", "Konsulttjänster"] },
  { name: "Parti- & Agenturhandel", slug: "parti-agenturhandel", image: partiAgenturhandelImg, description: "Lösningar för parti- och agenturhandel", products: ["bc", "fsc"], partnerIndustries: ["Grossist/Distribution"] },
];

const filterOptions: { value: ProductFilter; label: string; variant: "business-central" | "finance-supply" | "crm" }[] = [
  { value: "bc", label: "Business Central", variant: "business-central" },
  { value: "fsc", label: "Finance & Supply Chain", variant: "finance-supply" },
  { value: "crm-sales", label: "Sales & Customer Insights (Marketing Automation)", variant: "crm" },
  { value: "crm-service", label: "Customer Service & Field Service & Contact Center", variant: "crm" },
];

// Map product filter to application names
const getApplicationsForProduct = (product: ProductFilter): string[] => {
  switch (product) {
    case "bc":
      return ["Business Central"];
    case "fsc":
      return ["Finance & SCM"];
    case "crm-sales":
      return ["Sales", "Customer Insights"];
    case "crm-service":
      return ["Customer Service", "Field Service", "Contact Center"];
    default:
      return [];
  }
};

const Branschlosningar = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  // Helper to build partner profile URL with filter context
  const buildPartnerProfileUrl = (partnerName: string) => {
    const baseUrl = `/partner/${partnerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const params = new URLSearchParams();
    
    // Pass the selected product
    if (selectedFilter) {
      const appName = selectedFilter === "bc" ? "Business Central" : 
                      selectedFilter === "fsc" ? "Finance & SCM" : 
                      selectedFilter === "crm-sales" ? "CRM Sales" : 
                      selectedFilter === "crm-service" ? "CRM Service" : "";
      if (appName) params.set("product", appName);
    }
    // Pass the selected industry
    if (selectedIndustry) {
      params.set("industry", selectedIndustry.name);
    }
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  // Show all industries regardless of selected filter
  const displayedIndustries = industries;

  // Filter partners based on selected product and industry
  const filteredPartners = useMemo(() => {
    if (!selectedIndustry) return [];
    
    const requiredApps = getApplicationsForProduct(selectedFilter);
    
    // Helper to get the product ranking based on selected filter
    const getProductRanking = (partner: Partner): number => {
      switch (selectedFilter) {
        case "bc":
          return partner.rankings?.bc ?? 999;
        case "fsc":
          return partner.rankings?.fsc ?? 999;
        case "crm-sales":
        case "crm-service":
          return partner.rankings?.crm ?? 999;
        default:
          return 999;
      }
    };
    
    // Helper to get the lowest industry index for a partner (0, 1, 2, or Infinity if not found)
    const getIndustryPriority = (partner: Partner): number => {
      for (let i = 0; i < partner.industries.length; i++) {
        if (selectedIndustry.partnerIndustries.includes(partner.industries[i])) {
          return i;
        }
      }
      return Infinity;
    };
    
    return partners.filter((partner) => {
      // Check if partner has any of the required applications
      const hasApp = partner.applications.some(app => requiredApps.includes(app));
      // Check if partner serves any of the mapped industries
      const hasIndustry = partner.industries.some(ind => 
        selectedIndustry.partnerIndustries.includes(ind)
      );
      return hasApp && hasIndustry;
    }).sort((a, b) => {
      // First sort by product ranking
      const rankA = getProductRanking(a);
      const rankB = getProductRanking(b);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      
      // Then by industry priority (index 0, 1, 2)
      const priorityA = getIndustryPriority(a);
      const priorityB = getIndustryPriority(b);
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort alphabetically
      return a.name.localeCompare(b.name, 'sv');
    });
  }, [selectedFilter, selectedIndustry]);

  const handleIndustryClick = (industry: Industry) => {
    if (!selectedFilter) return; // Must select a solution first
    setSelectedIndustry(industry);
  };

  const handleBackToIndustries = () => {
    setSelectedIndustry(null);
  };

  const handlePartnerClick = (partner: Partner) => {
    trackPartnerClick(partner.name, partner.website, "branschlosningar");
  };

  const getProductLabel = () => {
    const option = filterOptions.find(o => o.value === selectedFilter);
    return option?.label || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Branschlösningar
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {selectedIndustry 
              ? `Partners inom ${selectedIndustry.name} med ${getProductLabel()}-kompetens`
              : "Hitta rätt partner för ditt Dynamics 365 projekt. Följ stegen nedan för att se vilka Microsoft-partners som har god verksamhetskunskap inom din bransch."
            }
          </p>

          {/* Step indicator */}
          {!selectedIndustry && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                selectedFilter 
                  ? "border-green-500 bg-green-500/10 text-green-600" 
                  : "border-amber-500 bg-amber-500/10 text-amber-600 font-medium"
              }`}>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold text-white ${
                  selectedFilter ? "bg-green-500" : "bg-amber-500"
                }`}>
                  {selectedFilter ? "✓" : "1"}
                </span>
                <span>Börja med att välja Dynamics 365-lösning</span>
              </div>
            </div>
          )}

          {/* Blinking arrow pointing to product selection */}
          {!selectedFilter && !selectedIndustry && (
            <div className="flex justify-center mb-4">
              <ArrowDown className="h-8 w-8 text-amber-500 animate-bounce" />
            </div>
          )}
          {/* Filter Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? option.variant : "outline"}
                size="lg"
                onClick={() => {
                  setSelectedFilter(option.value);
                  setSelectedIndustry(null);
                }}
                className={`w-full text-sm sm:text-base font-bold px-4 sm:px-6 py-4 sm:py-5 h-auto min-h-[70px] transition-all duration-200 ${
                  selectedFilter === option.value 
                    ? "ring-2 ring-offset-2 ring-offset-background shadow-lg scale-[1.02]" 
                    : "hover:bg-muted border-2 hover:border-primary/50 hover:shadow-md"
                } ${
                  option.value === "bc" && selectedFilter !== option.value ? "border-business-central/40 text-business-central hover:bg-business-central/10" : ""
                } ${
                  option.value === "fsc" && selectedFilter !== option.value ? "border-finance-supply/40 text-finance-supply hover:bg-finance-supply/10" : ""
                } ${
                  (option.value === "crm-sales" || option.value === "crm-service") && selectedFilter !== option.value ? "border-crm/40 text-crm hover:bg-crm/10" : ""
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Step 2 indicator - shown after solution is selected */}
          {selectedFilter && !selectedIndustry && (
            <>
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-600 font-medium">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold bg-amber-500 text-white">
                    2
                  </span>
                  <span>Välj bransch nedan</span>
                </div>
              </div>
              {/* Arrow pointing to industry selection */}
              <div className="flex justify-center mt-4">
                <ArrowDown className="h-8 w-8 text-amber-500 animate-bounce" />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Partners View */}
      {selectedIndustry ? (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={handleBackToIndustries}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Tillbaka till branscher
            </Button>

            {/* Industry header */}
            <div className="mb-8 flex items-center gap-4">
              <img
                src={selectedIndustry.image}
                alt={selectedIndustry.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedIndustry.name}</h2>
                <p className="text-muted-foreground">{selectedIndustry.description}</p>
              </div>
            </div>

            {/* Partners grid */}
            {filteredPartners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPartners.map((partner) => {
                  const partnerSlug = partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  return (
                    <div
                      key={partner.name}
                      className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                    >
                      <h3 className="text-xl font-semibold text-foreground mb-3">{partner.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{partner.description}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {partner.applications.slice(0, 4).map((app) => (
                              <span key={app} className="text-xs bg-muted px-2 py-0.5 rounded">
                                {app}
                              </span>
                            ))}
                            {partner.applications.length > 4 && (
                              <span className="text-xs text-muted-foreground">+{partner.applications.length - 4}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {partner.industries.slice(0, 3).map((ind) => (
                              <span key={ind} className="text-xs bg-muted px-2 py-0.5 rounded">
                                {ind}
                              </span>
                            ))}
                            {partner.industries.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{partner.industries.length - 3}</span>
                            )}
                          </div>
                        </div>
                        
                      </div>

                      <Link 
                        to={buildPartnerProfileUrl(partner.name)}
                        className="text-sm text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1"
                      >
                        Öppna partnerkortet
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
                <p className="text-foreground text-xl font-medium mb-2">
                  Är det ingen partner som är listad för just denna bransch?
                </p>
                <p className="text-muted-foreground text-lg mb-6">
                  Ingen fara, kontakta oss så hjälper vi dig att hitta en lämplig partner!
                </p>
                <Button 
                  onClick={() => navigate('/kontakta-oss')}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Kontakta oss
                </Button>
              </div>
            )}

            {/* Lead CTA - shows after partner list */}
            <div className="max-w-xl mx-auto mt-12">
              <LeadCTA
                sourcePage="/branschlosningar"
                selectedProduct={getProductLabel() || undefined}
                selectedIndustry={selectedIndustry?.name}
                title="Låt oss hjälpa dig (helt kostnadsfritt) att hitta rätt partner"
                description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Industries Grid */}
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedIndustries.map((industry) => (
                  <button
                    key={industry.slug}
                    onClick={() => handleIndustryClick(industry)}
                    disabled={!selectedFilter}
                    className={`group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 text-left ${
                      selectedFilter 
                        ? "hover:border-primary hover:shadow-lg cursor-pointer" 
                        : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${selectedFilter ? "group-hover:scale-105" : ""}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <span className={`text-sm font-medium transition-colors line-clamp-2 ${
                        selectedFilter ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                      }`}>
                        {industry.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {displayedIndustries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Inga branscher hittades.</p>
                </div>
              )}
            </div>
          </section>

          {/* Lead CTA Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-xl">
              <LeadCTA
                sourcePage="/branschlosningar"
                selectedProduct={selectedFilter || undefined}
                title="Låt oss hjälpa dig (helt kostnadsfritt) att hitta rätt partner"
                description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
              />
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Branschlosningar;