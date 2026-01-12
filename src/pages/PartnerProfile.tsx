import { useParams, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Sparkles, Briefcase, CheckCircle2, Globe, MapPin, Award, Layers } from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners, getCumulativeGeographyDisplay } from "@/data/partners";
import { Helmet } from "react-helmet";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

// Map application names to product categories
const getProductCategory = (app: string): 'bc' | 'fsc' | 'sales' | 'service' | null => {
  if (app === "Business Central") return 'bc';
  if (app === "Finance & SCM") return 'fsc';
  if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
  if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
  return null;
};

// Get product display name
const getProductDisplayName = (category: 'bc' | 'fsc' | 'sales' | 'service'): string => {
  switch (category) {
    case 'bc': return 'Business Central';
    case 'fsc': return 'Finance & Supply Chain';
    case 'sales': return 'Sälj & Marknad';
    case 'service': return 'Kundservice';
  }
};

// Get applications for a product category
const getApplicationsForCategory = (apps: string[], category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
  return apps.filter(app => getProductCategory(app) === category);
};

const PartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  
  // Get filter context from URL params
  const selectedProduct = searchParams.get("product") || undefined;
  const selectedIndustry = searchParams.get("industry") || undefined;
  const selectedCompanySize = searchParams.get("companySize") || undefined;
  const selectedGeography = searchParams.get("geography") || undefined;
  const { data: dbPartner, isLoading } = usePartner(slug);
  
  // Find static partner for productFilters
  const staticPartner = staticPartners.find((p) => {
    const generatedSlug = p.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return generatedSlug === slug;
  });

  // Use dbPartner if available, otherwise fall back to static partner data
  const partner = dbPartner ?? (staticPartner ? {
    id: slug || "",
    slug: slug || "",
    name: staticPartner.name,
    description: staticPartner.description,
    logo_url: staticPartner.logo || null,
    website: staticPartner.website,
    email: staticPartner.email || null,
    contactPerson: staticPartner.contactPerson || null,
    phone: staticPartner.phone || null,
    address: null,
    applications: staticPartner.applications,
    industries: staticPartner.industries,
    is_featured: false,
    created_at: "",
    updated_at: "",
  } : null);

  // Get product categories this partner supports
  const getProductCategories = (): ('bc' | 'fsc' | 'sales' | 'service')[] => {
    if (!partner) return [];
    const categories = new Set<'bc' | 'fsc' | 'sales' | 'service'>();
    partner.applications.forEach(app => {
      const cat = getProductCategory(app);
      if (cat) categories.add(cat);
    });
    return Array.from(categories);
  };

  // Get industries for a specific product (map sales/service to crm for productFilters lookup)
  const getIndustriesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { primary: string[]; secondary: string[] } => {
    // Map sales and service to 'crm' for productFilters lookup
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    
    if (!staticPartner?.productFilters?.[filterKey]) {
      // Fallback to general industries
      const allIndustries = partner?.industries || [];
      return { 
        primary: allIndustries.slice(0, 2), 
        secondary: [] 
      };
    }
    
    const productFilter = staticPartner.productFilters[filterKey];
    return {
      primary: productFilter?.industries || [],
      secondary: productFilter?.secondaryIndustries || []
    };
  };

  // Get geography for a specific product
  const getGeographyForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string | null => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    return staticPartner?.productFilters?.[filterKey]?.geography || staticPartner?.geography || null;
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16">
          <div className="animate-pulse text-center text-muted-foreground">
            Laddar partnerinformation...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Partner hittades inte</h1>
          <p className="text-muted-foreground mb-8">
            Vi kunde inte hitta den partner du söker.
          </p>
          <Link to="/valj-partner">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till partnerlistan
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const productCategories = getProductCategories();
  const hasFilters = selectedProduct || selectedIndustry || selectedCompanySize || selectedGeography;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{partner.name} - Dynamics 365 Partner | Svenska D365-guiden</title>
        <meta
          name="description"
          content={partner.description?.slice(0, 160) || `${partner.name} är en Microsoft Dynamics 365-partner som hjälper företag med implementationer.`}
        />
      </Helmet>

      <Navbar />

      {/* Hero Header */}
      <header className="relative overflow-hidden mt-16">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link
            to="/valj-partner"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4 group text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Tillbaka till partnerlistan
          </Link>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Logo Container */}
            <div className="relative group/logo shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-card via-card to-muted/30 shadow-xl border border-border/50 flex items-center justify-center p-3 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain relative z-10"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>
            </div>

            {/* Partner Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {partner.name}
                </h1>
                {partner.is_featured && (
                  <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white border-0 shadow-md shadow-amber-500/25 px-2.5 py-0.5 text-xs font-semibold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Utvald partner
                  </Badge>
                )}
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed line-clamp-2">
                {partner.description}
              </p>
              
              {/* Quick stats row - more compact */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {staticPartner?.geography && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/50 text-xs">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="font-medium text-foreground">{getCumulativeGeographyDisplay(staticPartner.geography)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/80 border border-border/50 text-xs">
                  <Layers className="w-3 h-3 text-primary" />
                  <span className="font-medium text-foreground">{partner.applications.length} applikationer</span>
                </div>
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackPartnerClick(
                      partner.name,
                      partner.website,
                      `partner-profile-${partner.slug}`,
                      {
                        product: selectedProduct,
                        industry: selectedIndustry,
                        companySize: selectedCompanySize,
                        geography: selectedGeography,
                      }
                    );
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  <span className="font-medium">{partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-6 sm:py-8 bg-gradient-to-b from-background via-muted/20 to-muted/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Product Competencies */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Kompetenser inom Dynamics 365
                </h2>
              </div>
              
              <div className={`grid gap-3 ${productCategories.length >= 2 ? 'sm:grid-cols-2' : ''}`}>
                {productCategories.map((category) => {
                  const { primary, secondary } = getIndustriesForProduct(category);
                  const apps = getApplicationsForCategory(partner.applications, category);
                  
                  return (
                    <article 
                      key={category} 
                      className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border border-border/40 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
                      
                      <div className="p-4 sm:p-5">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <h3 className="text-lg font-bold text-foreground">
                            {getProductDisplayName(category)}
                          </h3>
                          {apps.length > 1 && (
                            <div className="flex flex-wrap gap-1.5">
                              {apps.map(app => (
                                <Badge 
                                  key={app} 
                                  variant="outline"
                                  className="text-xs bg-muted/50 border-border/50 py-0.5"
                                >
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {/* Primary industries */}
                          {primary.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                Branschfokus
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {primary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-primary/10 text-primary border border-primary/20 py-1 px-2.5 text-xs font-medium"
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Secondary industries */}
                          {secondary.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-amber-500" />
                                Erfarenhet även inom
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {secondary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-amber-500 hover:bg-amber-600 text-white border-0 py-1 px-2.5 text-xs font-medium transition-colors"
                                  >
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* If no industries at all */}
                          {primary.length === 0 && secondary.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">
                              Branschoberoende
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Contact CTA Card */}
            <article className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent/25 via-primary/15 to-accent/20 border border-primary/20 shadow-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
              
              <div className="relative p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 shadow-md">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Intresserad av {partner.name}?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Låt oss hjälpa dig helt kostnadsfritt att komma i kontakt med rätt person.
                    </p>
                  </div>
                </div>
                
                {/* Filter context */}
                <div className="mb-4 p-3 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    {hasFilters ? 'Din sökning' : 'Partner'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="bg-foreground/10 text-foreground border-foreground/20 font-semibold py-1 px-2">
                      {partner.name}
                    </Badge>
                    {selectedProduct && (
                      <Badge className="bg-primary/15 text-primary border-primary/30 py-1 px-2">
                        {selectedProduct}
                      </Badge>
                    )}
                    {selectedIndustry && (
                      <Badge variant="outline" className="border-accent/50 text-foreground py-1 px-2">
                        {selectedIndustry}
                      </Badge>
                    )}
                    {selectedCompanySize && (
                      <Badge variant="outline" className="border-muted-foreground/50 text-foreground py-1 px-2">
                        {selectedCompanySize}
                      </Badge>
                    )}
                    {selectedGeography && (
                      <Badge variant="outline" className="border-muted-foreground/50 text-foreground py-1 px-2">
                        {selectedGeography}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <LeadCTA
                  sourcePage={`partner-profile-${partner.slug}`}
                  partnerName={partner.name}
                  selectedProduct={selectedProduct}
                  selectedProducts={selectedProduct ? undefined : partner.applications}
                  selectedIndustry={selectedIndustry || partner.industries[0]}
                  variant="inline"
                />
              </div>
            </article>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
