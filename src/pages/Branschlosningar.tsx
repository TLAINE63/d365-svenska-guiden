import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { partners, Partner, crmApplications } from "@/data/partners";
import { trackPartnerClick } from "@/utils/trackPartnerClick";
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

type ProductFilter = "all" | "bc" | "fsc" | "crm";

interface Industry {
  name: string;
  slug: string;
  image: string;
  description: string;
  products: ProductFilter[];
  partnerIndustries: string[]; // Maps to partner industry names
}

const industries: Industry[] = [
  { name: "Tillverkning", slug: "tillverkning", image: tillverkningImg, description: "Affärssystem för tillverkande företag", products: ["bc", "fsc"], partnerIndustries: ["Tillverkning"] },
  { name: "Handel & Distribution", slug: "handel-distribution", image: handelDistributionImg, description: "Lösningar för handels- och distributionsföretag", products: ["bc", "fsc", "crm"], partnerIndustries: ["Grossist", "Distribution", "Retail"] },
  { name: "Bygg & Entreprenad", slug: "bygg-entreprenad", image: byggEntreprenadImg, description: "System för bygg- och entreprenadföretag", products: ["bc", "fsc", "crm"], partnerIndustries: ["Bygg & Fastighet"] },
  { name: "Transport & Logistik", slug: "transport-logistik", image: transportLogistikImg, description: "Affärssystem för transport och logistik", products: ["bc", "fsc"], partnerIndustries: ["Logistik", "Distribution"] },
  { name: "Fastigheter", slug: "fastigheter", image: fastigheterImg, description: "Lösningar för fastighetsbranschen", products: ["bc", "fsc", "crm"], partnerIndustries: ["Bygg & Fastighet"] },
  { name: "Livsmedel", slug: "livsmedel", image: livsmedel, description: "System för livsmedelsindustrin", products: ["bc", "fsc"], partnerIndustries: ["Tillverkning", "Grossist"] },
  { name: "Läkemedel & Life Science", slug: "lakemedel-life-science", image: lakemedelLifeScienceImg, description: "Lösningar för läkemedel och life science", products: ["bc", "fsc", "crm"], partnerIndustries: ["Tillverkning"] },
  { name: "Energi", slug: "energi", image: energiImg, description: "Affärssystem för energisektorn", products: ["fsc", "crm"], partnerIndustries: ["Energisektorn"] },
  { name: "Service & Underhåll", slug: "service-underhall", image: serviceUnderhallImg, description: "System för serviceföretag", products: ["bc", "fsc", "crm"], partnerIndustries: ["Tjänsteföretag"] },
  { name: "Konsultföretag", slug: "konsultforetag", image: konsultforetagImg, description: "Lösningar för konsultbolag", products: ["bc", "crm"], partnerIndustries: ["Tjänsteföretag"] },
  { name: "IT & Tech", slug: "it-tech", image: itTechImg, description: "Affärssystem för IT-branschen", products: ["bc", "crm"], partnerIndustries: ["Tech", "Tjänsteföretag"] },
  { name: "Detaljhandel", slug: "detaljhandel", image: detaljhandelImg, description: "System för detaljhandeln", products: ["bc", "fsc", "crm"], partnerIndustries: ["Retail"] },
  { name: "Medlemsorganisationer", slug: "medlemsorganisationer", image: medlemsorganisationerImg, description: "Lösningar för medlemsorganisationer", products: ["bc", "crm"], partnerIndustries: ["Tjänsteföretag", "Offentlig sektor"] },
  { name: "Miljö & Återvinning", slug: "miljo-atervinning", image: miljoAtervinningImg, description: "System för miljö- och återvinningsbranschen", products: ["bc", "fsc"], partnerIndustries: ["Tillverkning", "Tjänsteföretag"] },
  { name: "Parti- & Agenturhandel", slug: "parti-agenturhandel", image: partiAgenturhandelImg, description: "Lösningar för parti- och agenturhandel", products: ["bc", "fsc"], partnerIndustries: ["Grossist", "Distribution"] },
];

const filterOptions: { value: ProductFilter; label: string; variant: "amber" | "business-central" | "finance-supply" | "crm" }[] = [
  { value: "all", label: "Alla", variant: "amber" },
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
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>("all");
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  const filteredIndustries = selectedFilter === "all" 
    ? industries 
    : industries.filter((industry) => industry.products.includes(selectedFilter));

  // Filter partners based on selected product and industry
  const filteredPartners = useMemo(() => {
    if (!selectedIndustry || selectedFilter === "all") return [];
    
    const requiredApps = getApplicationsForProduct(selectedFilter);
    
    return partners.filter((partner) => {
      // Check if partner has any of the required applications
      const hasApp = partner.applications.some(app => requiredApps.includes(app));
      // Check if partner serves any of the mapped industries
      const hasIndustry = partner.industries.some(ind => 
        selectedIndustry.partnerIndustries.includes(ind)
      );
      return hasApp && hasIndustry;
    }).sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  }, [selectedFilter, selectedIndustry]);

  const handleIndustryClick = (industry: Industry) => {
    if (selectedFilter === "all") return; // Do nothing if no product filter selected
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
              : "Välj ut en Dynamics 365 lösning nedan och därefter den bransch som du tillhör, för att se vilka Microsoftpartners som har god verksamhetskunskap inom denna bransch."
            }
          </p>
          
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
      {selectedIndustry && selectedFilter !== "all" ? (
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
                      href={partner.website}
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
              {selectedFilter === "all" && (
                <p className="text-center text-muted-foreground mb-8">
                  Välj en produkt ovan för att se partners inom respektive bransch.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredIndustries.map((industry) => (
                  <button
                    key={industry.slug}
                    onClick={() => handleIndustryClick(industry)}
                    disabled={selectedFilter === "all"}
                    className={`group flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 text-left ${
                      selectedFilter === "all" 
                        ? "opacity-60 cursor-not-allowed" 
                        : "hover:border-primary hover:shadow-lg cursor-pointer"
                    }`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          selectedFilter !== "all" ? "group-hover:scale-105" : ""
                        }`}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <span className={`text-sm font-medium transition-colors line-clamp-2 ${
                        selectedFilter !== "all" 
                          ? "text-foreground group-hover:text-primary" 
                          : "text-muted-foreground"
                      }`}>
                        {industry.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {filteredIndustries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Inga branscher hittades för det valda filtret.</p>
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