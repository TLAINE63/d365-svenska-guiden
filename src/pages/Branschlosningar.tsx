import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { partners, Partner, crmApplications } from "@/data/partners";
import { trackPartnerClick, buildPartnerUrl } from "@/utils/trackPartnerClick";
import { ArrowLeft, ExternalLink, Building2, Briefcase, Users } from "lucide-react";

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

type ProductFilter = "bc" | "fsc" | "crm" | null;

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
  { name: "Handel & Distribution", slug: "handel-distribution", image: handelDistributionImg, description: "Lösningar för handels- och distributionsföretag", products: ["bc", "fsc", "crm"], partnerIndustries: ["Grossist/Distribution", "Handel (Retail & eCommerce)"] },
  { name: "Bygg & Entreprenad", slug: "bygg-entreprenad", image: byggEntreprenadImg, description: "System för bygg- och entreprenadföretag", products: ["bc", "fsc", "crm"], partnerIndustries: ["Bygg & Entreprenad"] },
  { name: "Transport & Logistik", slug: "transport-logistik", image: transportLogistikImg, description: "Affärssystem för transport och logistik", products: ["bc", "fsc"], partnerIndustries: ["Transport & Logistik", "Grossist/Distribution"] },
  { name: "Fastigheter", slug: "fastigheter", image: fastigheterImg, description: "Lösningar för fastighetsbranschen", products: ["bc", "fsc", "crm"], partnerIndustries: ["Fastigheter", "Bygg & Entreprenad"] },
  { name: "Livsmedel", slug: "livsmedel", image: livsmedel, description: "System för livsmedelsindustrin", products: ["bc", "fsc"], partnerIndustries: ["Tillverkningsindustrin", "Grossist/Distribution"] },
  { name: "Läkemedel & Life Science", slug: "lakemedel-life-science", image: lakemedelLifeScienceImg, description: "Lösningar för läkemedel och life science", products: ["bc", "fsc", "crm"], partnerIndustries: ["Life Science", "Hälso- & sjukvård"] },
  { name: "Energi", slug: "energi", image: energiImg, description: "Affärssystem för energisektorn", products: ["fsc", "crm"], partnerIndustries: ["Energi & Utilities"] },
  { name: "Service & Underhåll", slug: "service-underhall", image: serviceUnderhallImg, description: "System för serviceföretag", products: ["bc", "fsc", "crm"], partnerIndustries: ["Konsulttjänster"] },
  { name: "Konsultföretag", slug: "konsultforetag", image: konsultforetagImg, description: "Lösningar för konsultbolag", products: ["bc", "crm"], partnerIndustries: ["Konsulttjänster"] },
  { name: "IT & Tech", slug: "it-tech", image: itTechImg, description: "Affärssystem för IT-branschen", products: ["bc", "crm"], partnerIndustries: ["Konsulttjänster"] },
  { name: "Detaljhandel", slug: "detaljhandel", image: detaljhandelImg, description: "System för detaljhandeln", products: ["bc", "fsc", "crm"], partnerIndustries: ["Handel (Retail & eCommerce)"] },
  { name: "Medlemsorganisationer", slug: "medlemsorganisationer", image: medlemsorganisationerImg, description: "Lösningar för medlemsorganisationer", products: ["bc", "crm"], partnerIndustries: ["Medlemsorganisationer", "Nonprofit", "Offentlig sektor"] },
  { name: "Miljö & Återvinning", slug: "miljo-atervinning", image: miljoAtervinningImg, description: "System för miljö- och återvinningsbranschen", products: ["bc", "fsc"], partnerIndustries: ["Tillverkningsindustrin", "Konsulttjänster"] },
  { name: "Parti- & Agenturhandel", slug: "parti-agenturhandel", image: partiAgenturhandelImg, description: "Lösningar för parti- och agenturhandel", products: ["bc", "fsc"], partnerIndustries: ["Grossist/Distribution"] },
];

const filterOptions: { value: ProductFilter; label: string; variant: "business-central" | "finance-supply" | "crm" }[] = [
  { value: "bc", label: "Business Central", variant: "business-central" },
  { value: "fsc", label: "Finance & Supply Chain", variant: "finance-supply" },
  { value: "crm", label: "CRM / Customer Engagement", variant: "crm" },
];

// Map product filter to application names
const getApplicationsForProduct = (product: ProductFilter): string[] => {
  switch (product) {
    case "bc":
      return ["Business Central"];
    case "fsc":
      return ["Finance & SCM"];
    case "crm":
      return crmApplications;
    default:
      return [];
  }
};

const Branschlosningar = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

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
        case "crm":
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
              : "Hitta partners med branschkunskap inom Dynamics 365. Följ stegen nedan för att se vilka Microsoft-partners som har god verksamhetskunskap inom din bransch."
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
                <span>Välj Dynamics 365-lösning</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                selectedFilter 
                  ? "border-amber-500 bg-amber-500/10 text-amber-600 font-medium" 
                  : "border-muted-foreground/30 bg-muted/30 text-muted-foreground"
              }`}>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                  selectedFilter ? "bg-amber-500 text-white" : "bg-muted-foreground/30 text-muted-foreground"
                }`}>
                  2
                </span>
                <span>Välj bransch</span>
              </div>
            </div>
          )}
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? option.variant : "outline"}
                onClick={() => {
                  setSelectedFilter(option.value);
                  setSelectedIndustry(null);
                }}
                className={`text-sm sm:text-base ${
                  selectedFilter === option.value 
                    ? "" 
                    : "hover:bg-muted"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
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
                {filteredPartners.map((partner) => (
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
                      
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">
                          {partner.companySize.join(", ")} företag
                        </span>
                      </div>
                    </div>

                    <a
                      href={buildPartnerUrl(partner.website, partner.name, { 
                        application: selectedFilter, 
                        industry: selectedIndustry?.name 
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handlePartnerClick(partner)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Besök hemsida
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
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

          {/* CTA Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Hittar du inte din bransch?
              </h2>
              <p className="text-muted-foreground mb-6">
                Kontakta oss så hjälper vi dig att hitta rätt lösning och partner för just din verksamhet.
              </p>
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Kontakta oss
              </Link>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Branschlosningar;