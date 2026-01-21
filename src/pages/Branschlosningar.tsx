import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, ArrowDown, Loader2 } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import PartnerCard from "@/components/PartnerCard";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";


// Industry images - new taxonomy (18 industries)
import tillverkningImg from "@/assets/industries/tillverkning.jpg";
import livsmedelsImg from "@/assets/industries/livsmedel.jpg";
import handelDistributionImg from "@/assets/industries/handel-distribution.jpg";
import detaljhandelImg from "@/assets/industries/detaljhandel.jpg";
import konsultforetagImg from "@/assets/industries/konsultforetag.jpg";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.jpg";
import fastigheterImg from "@/assets/industries/fastigheter.jpg";
import energiImg from "@/assets/industries/energi.jpg";
import finansForsakringImg from "@/assets/industries/finans-forsakring.jpg";
import lakemedelLifeScienceImg from "@/assets/industries/lakemedel-life-science.jpg";
import itTechImg from "@/assets/industries/it-tech.jpg";
import transportLogistikImg from "@/assets/industries/transport-logistik.jpg";
import mediaPublishingImg from "@/assets/industries/media-publishing.jpg";
import jordbrukSkogsbrukImg from "@/assets/industries/jordbruk-skogsbruk.jpg";
import halsaSjukvardImg from "@/assets/industries/halsa-sjukvard.jpg";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.jpg";
import utbildningImg from "@/assets/industries/utbildning.jpg";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.jpg";

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

// New industry taxonomy with 18 industries in specified order
const industries: Industry[] = [
  { name: "Tillverkningsindustri", slug: "tillverkning", image: tillverkningImg, description: "Affärssystem för tillverkande företag", products: ["bc", "fsc"], partnerIndustries: ["Tillverkningsindustri"] },
  { name: "Livsmedel & Processindustri", slug: "livsmedel-processindustri", image: livsmedelsImg, description: "Lösningar för livsmedels- och processindustrin", products: ["bc", "fsc"], partnerIndustries: ["Livsmedel & Processindustri"] },
  { name: "Grossist & Distribution", slug: "grossist-distribution", image: handelDistributionImg, description: "System för grossist- och distributionsföretag", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Grossist & Distribution"] },
  { name: "Retail & E-handel", slug: "retail-ehandel", image: detaljhandelImg, description: "Lösningar för detaljhandel och e-handel", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Retail & E-handel"] },
  { name: "Konsulttjänster", slug: "konsulttjanster", image: konsultforetagImg, description: "System för konsultbolag och tjänsteföretag", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Konsulttjänster"] },
  { name: "Bygg & Entreprenad", slug: "bygg-entreprenad", image: byggEntreprenadImg, description: "Affärssystem för bygg- och entreprenadföretag", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Bygg & Entreprenad"] },
  { name: "Fastighet & Förvaltning", slug: "fastighet-forvaltning", image: fastigheterImg, description: "Lösningar för fastighets- och förvaltningsbranschen", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Fastighet & Förvaltning"] },
  { name: "Energi & Utilities", slug: "energi-utilities", image: energiImg, description: "System för energisektorn och utilities", products: ["fsc", "crm-sales", "crm-service"], partnerIndustries: ["Energi & Utilities"] },
  { name: "Finans & Försäkring", slug: "finans-forsakring", image: finansForsakringImg, description: "Lösningar för bank, finans och försäkring", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Finans & Försäkring"] },
  { name: "Life Science / Medtech", slug: "life-science-medtech", image: lakemedelLifeScienceImg, description: "System för läkemedel och medicinsk teknik", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Life Science / Medtech"] },
  { name: "Telekom & IT-tjänster", slug: "telekom-it-tjanster", image: itTechImg, description: "Affärssystem för IT- och telekombranschen", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Telekom & IT-tjänster"] },
  { name: "Logistik & Transport", slug: "logistik-transport", image: transportLogistikImg, description: "Lösningar för transport och logistik", products: ["bc", "fsc"], partnerIndustries: ["Logistik & Transport"] },
  { name: "Media & Publishing", slug: "media-publishing", image: mediaPublishingImg, description: "System för media- och förlagsbranschen", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Media & Publishing"] },
  { name: "Jordbruk & Skogsbruk", slug: "jordbruk-skogsbruk", image: jordbrukSkogsbrukImg, description: "Affärssystem för jord- och skogsbruk", products: ["bc", "fsc"], partnerIndustries: ["Jordbruk & Skogsbruk"] },
  { name: "Hälsa- & sjukvård", slug: "halsa-sjukvard", image: halsaSjukvardImg, description: "Lösningar för hälso- och sjukvårdssektorn", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Hälsa- & sjukvård"] },
  { name: "Non-profit / Organisationer", slug: "nonprofit-organisationer", image: medlemsorganisationerImg, description: "System för ideella organisationer och föreningar", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Non-profit / Organisationer"] },
  { name: "Utbildning", slug: "utbildning", image: utbildningImg, description: "Lösningar för utbildningssektorn", products: ["bc", "crm-sales", "crm-service"], partnerIndustries: ["Utbildning"] },
  { name: "Offentlig sektor", slug: "offentlig-sektor", image: offentligSektorImg, description: "Affärssystem för myndigheter och offentlig verksamhet", products: ["bc", "fsc", "crm-sales", "crm-service"], partnerIndustries: ["Offentlig sektor"] },
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
  const { data: dbPartners, isLoading } = usePartners();
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(null);
  const [showLeadMagnet, setShowLeadMagnet] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  // Filter to only show featured partners
  const partners = useMemo(() => {
    return (dbPartners || []).filter(p => p.is_featured === true);
  }, [dbPartners]);

  // Helper to build partner profile URL with filter context
  const buildPartnerProfileUrl = (partnerSlug: string) => {
    const baseUrl = `/partner/${partnerSlug}`;
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

  // Filter partners based on selected product and industry - only show featured partners
  const filteredPartners = useMemo(() => {
    if (!selectedIndustry) return [];
    
    // Determine which product key to use for filtering
    const getProductKey = (): 'bc' | 'fsc' | 'crm' | null => {
      switch (selectedFilter) {
        case "bc": return 'bc';
        case "fsc": return 'fsc';
        case "crm-sales":
        case "crm-service": return 'crm';
        default: return null;
      }
    };
    
    const productKey = getProductKey();
    if (!productKey) return [];
    
    // Get selected industry name
    const industryName = selectedIndustry.partnerIndustries[0];
    
    // Filter to only show featured partners with matching product_filters
    return partners
      .filter(partner => {
        const productFilter = partner.product_filters?.[productKey];
        if (!productFilter) return false;
        return productFilter.industries?.includes(industryName);
      })
      .sort((a, b) => {
        const rankA = a.product_filters?.[productKey]?.ranking ?? 999;
        const rankB = b.product_filters?.[productKey]?.ranking ?? 999;
        if (rankA !== rankB) return rankA - rankB;
        return (a.name || '').localeCompare(b.name || '', 'sv');
      });
  }, [selectedFilter, selectedIndustry, partners]);

  const handleIndustryClick = (industry: Industry) => {
    if (!selectedFilter) return; // Must select a solution first
    setSelectedIndustry(industry);
  };

  const handleBackToIndustries = () => {
    setSelectedIndustry(null);
  };

  const getProductLabel = () => {
    const option = filterOptions.find(o => o.value === selectedFilter);
    return option?.label || "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => {
                  // Determine product key for PartnerCard
                  const productKey: 'bc' | 'fsc' | 'crm' | null = 
                    selectedFilter === 'bc' ? 'bc' : 
                    selectedFilter === 'fsc' ? 'fsc' : 
                    (selectedFilter === 'crm-sales' || selectedFilter === 'crm-service') ? 'crm' : null;
                  
                  return (
                    <PartnerCard
                      key={partner.slug}
                      partner={partner}
                      profileUrl={buildPartnerProfileUrl(partner.slug)}
                      colorScheme={selectedFilter === 'bc' ? 'primary' : selectedFilter === 'fsc' ? 'primary' : 'crm'}
                      productKey={productKey}
                      highlightedProduct={getProductLabel()}
                      highlightedIndustry={selectedIndustry?.name}
                      showRandomIndicator={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Märkligt…inga partners blev listade här…</h3>
                <p className="text-muted-foreground">
                  Men ingen fara. Om du kontaktar oss, så hjälper vi dig hitta några bra alternativ.
                </p>
              </div>
            )}

            {/* Lead CTA */}
            <div className="mt-12">
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
                        Behöver du hjälp att välja rätt partner?
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">
                        Beskriv ditt projekt så hjälper vi dig att hitta rätt partner för dina behov.
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
                        {selectedFilter === "bc" ? "Business Central" : selectedFilter === "fsc" ? "Finance & SCM" : selectedFilter === "crm-sales" ? "CRM Sales" : "CRM Service"}
                      </Badge>
                      {selectedIndustry && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedIndustry.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <LeadCTA 
                    sourcePage="branschlosningar"
                    variant="inline" 
                    selectedIndustry={selectedIndustry?.name}
                    selectedProduct={selectedFilter === "bc" ? "Business Central" : selectedFilter === "fsc" ? "Finance & SCM" : selectedFilter === "crm-sales" ? "CRM Sales" : "CRM Service"}
                  />
                </div>
              </article>
            </div>
          </div>
        </section>
      ) : (
        /* Industries Grid */
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {displayedIndustries.map((industry) => (
                <button
                  key={industry.slug}
                  onClick={() => handleIndustryClick(industry)}
                  disabled={!selectedFilter}
                  className={`group relative overflow-hidden rounded-xl aspect-square transition-all duration-300 ${
                    selectedFilter 
                      ? "cursor-pointer hover:scale-105 hover:shadow-xl" 
                      : "cursor-not-allowed opacity-60"
                  }`}
                >
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <h3 className="text-white font-semibold text-xs sm:text-sm leading-tight">
                      {industry.name}
                    </h3>
                  </div>
                  {selectedFilter && (
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lead Magnet Banner */}
      {showLeadMagnet && !selectedIndustry && (
        <LeadMagnetBanner sourcePage="branschlosningar" onClose={() => setShowLeadMagnet(false)} />
      )}

      <Footer />
    </div>
  );
};

export default Branschlosningar;
