import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { partners, Partner, crmApplications } from "@/data/partners";
import { trackPartnerClick, buildPartnerUrl } from "@/utils/trackPartnerClick";
import { ArrowLeft, ExternalLink, Building2, Briefcase, Users, ArrowDown } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import UrgencyBadge from "@/components/UrgencyBadge";

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

// Product icons
import businessCentralIcon from "@/assets/icons/BusinessCentral.svg";
import financeIcon from "@/assets/icons/Finance.svg";
import salesIcon from "@/assets/icons/Sales.svg";
import customerServiceIcon from "@/assets/icons/CustomerService.svg";

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

const filterOptions: { value: ProductFilter; label: string; variant: "business-central" | "finance-supply" | "crm"; icon: string }[] = [
  { value: "bc", label: "Business Central", variant: "business-central", icon: businessCentralIcon },
  { value: "fsc", label: "Finance & Supply Chain", variant: "finance-supply", icon: financeIcon },
  { value: "crm-sales", label: "Sales & Customer Insights (Marketing Automation)", variant: "crm", icon: salesIcon },
  { value: "crm-service", label: "Customer Service & Field Service & Contact Center", variant: "crm", icon: customerServiceIcon },
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
  const [showLeadMagnet, setShowLeadMagnet] = useState(true);
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
      <section className="pt-24 pb-6 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
            Branschlösningar
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            {selectedIndustry 
              ? `Partners inom ${selectedIndustry.name} med ${getProductLabel()}-kompetens`
              : "Hitta rätt partner för ditt Dynamics 365 projekt. Följ stegen nedan för att se vilka Microsoft-partners som har god verksamhetskunskap inom din bransch."
            }
          </p>

          {/* Step indicator - only show before solution is selected */}
          {!selectedIndustry && !selectedFilter && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-sm border-amber-500 bg-amber-500/10 text-amber-600 font-medium">
                <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-amber-500 text-white">
                  1
                </span>
                <span>Börja med att välja Dynamics 365-lösning</span>
              </div>
            </div>
          )}

          {/* Blinking arrow pointing to product selection */}
          {!selectedFilter && !selectedIndustry && (
            <div className="flex justify-center mb-2">
              <ArrowDown className="h-6 w-6 text-amber-500 animate-bounce" />
            </div>
          )}
          {/* Filter Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedFilter(option.value);
                  setSelectedIndustry(null);
                }}
                className={`group w-full text-xs sm:text-sm font-semibold px-3 sm:px-4 py-3 sm:py-4 min-h-[56px] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedFilter === option.value 
                    ? option.value === "bc" 
                      ? "bg-gradient-to-br from-business-central to-business-central/80 text-white shadow-lg shadow-business-central/25 scale-[1.02]"
                      : option.value === "fsc"
                        ? "bg-gradient-to-br from-finance-supply to-finance-supply/80 text-white shadow-lg shadow-finance-supply/25 scale-[1.02]"
                        : "bg-gradient-to-br from-crm to-crm/80 text-white shadow-lg shadow-crm/25 scale-[1.02]"
                    : "bg-card border border-border/50 hover:border-border shadow-sm hover:shadow-md"
                } ${
                  option.value === "bc" && selectedFilter !== option.value 
                    ? "hover:bg-business-central/5 hover:border-business-central/30" 
                    : ""
                } ${
                  option.value === "fsc" && selectedFilter !== option.value 
                    ? "hover:bg-finance-supply/5 hover:border-finance-supply/30" 
                    : ""
                } ${
                  (option.value === "crm-sales" || option.value === "crm-service") && selectedFilter !== option.value 
                    ? "hover:bg-crm/5 hover:border-crm/30" 
                    : ""
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  selectedFilter === option.value 
                    ? "bg-white/20" 
                    : option.value === "bc" 
                      ? "bg-business-central/10 group-hover:bg-business-central/20"
                      : option.value === "fsc"
                        ? "bg-finance-supply/10 group-hover:bg-finance-supply/20"
                        : "bg-crm/10 group-hover:bg-crm/20"
                }`}>
                  <img src={option.icon} alt="" className="h-5 w-5" />
                </div>
                <span className={selectedFilter !== option.value 
                  ? option.value === "bc" 
                    ? "text-business-central" 
                    : option.value === "fsc" 
                      ? "text-finance-supply" 
                      : "text-crm"
                  : ""
                }>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Step 2 indicator - shown after solution is selected */}
          {selectedFilter && !selectedIndustry && (
            <>
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-600 font-medium text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-amber-500 text-white">
                    2
                  </span>
                  <span>Välj bransch nedan</span>
                </div>
              </div>
              {/* Arrow pointing to industry selection */}
              <div className="flex justify-center mt-2">
                <ArrowDown className="h-6 w-6 text-amber-500 animate-bounce" />
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

            {/* Lead CTA - shows after partner list with urgency */}
            <div className="max-w-xl mx-auto mt-12">
              <div className="flex flex-col items-center gap-2 mb-4">
                <UrgencyBadge variant="consultation" />
                <UrgencyBadge variant="spots" spotsLeft={3} />
              </div>
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

          {/* Lead Magnet Banner - below industries */}
          {showLeadMagnet && (
            <section className="px-4 pb-8">
              <div className="container mx-auto max-w-4xl">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-foreground">
                  Få hjälp att välja rätt partner
                </h2>
                <LeadMagnetBanner
                  sourcePage="/branschlosningar" 
                  onClose={() => setShowLeadMagnet(false)}
                />
              </div>
            </section>
          )}

          {/* Lead CTA Section with Urgency - only show before solution is selected */}
          {!selectedFilter && (
            <section className="py-16 px-4 bg-muted/30">
              <div className="container mx-auto max-w-xl">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <UrgencyBadge variant="consultation" />
                  <UrgencyBadge variant="spots" spotsLeft={3} />
                </div>
                <LeadCTA
                  sourcePage="/branschlosningar"
                  selectedProduct={selectedFilter || undefined}
                  title="Låt oss hjälpa dig (helt kostnadsfritt) att hitta rätt partner"
                  description="Det här var ett första steg i rätt riktning, men ännu bättre om du låter oss hjälpa dig att hitta rätt partner och rätt kontaktperson. Kostnadsfritt förstås."
                />
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Branschlosningar;