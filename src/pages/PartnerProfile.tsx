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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-gradient-to-tr from-accent/15 to-primary/5 rounded-full blur-2xl" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <Link
            to="/valj-partner"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-10 group text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Tillbaka till partnerlistan
          </Link>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Logo Container */}
            <div className="relative group/logo">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-3xl blur-2xl scale-110 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 shadow-2xl border border-border/50 flex items-center justify-center p-6 shrink-0 backdrop-blur-sm overflow-hidden">
                {/* Inner shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain relative z-10"
                  />
                ) : (
                  <Building2 className="w-20 h-20 text-muted-foreground/40" />
                )}
              </div>
            </div>

            {/* Partner Info */}
            <div className="flex-1 space-y-6">
              {/* Featured badge */}
              {partner.is_featured && (
                <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white border-0 shadow-lg shadow-amber-500/25 px-4 py-1.5 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Utvald partner
                </Badge>
              )}
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                {partner.name}
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {partner.description}
              </p>
              
              {/* Quick stats row */}
              <div className="flex flex-wrap gap-4 pt-2">
                {staticPartner?.geography && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border border-border/50 shadow-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{getCumulativeGeographyDisplay(staticPartner.geography)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card/80 border border-border/50 shadow-sm">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{partner.applications.length} applikationer</span>
                </div>
                {partner.is_featured && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 shadow-sm">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Verifierad</span>
                  </div>
                )}
              </div>
              
              {/* Website link */}
              <div className="pt-2">
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
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group/link"
                >
                  <Globe className="w-4 h-4" />
                  <span className="underline underline-offset-4 decoration-primary/30 group-hover/link:decoration-primary/60 transition-colors">
                    {partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-background via-muted/20 to-muted/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Product Competencies */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Kompetenser inom Dynamics 365
                </h2>
              </div>
              
              <div className="grid gap-5">
                {productCategories.map((category) => {
                  const { primary, secondary } = getIndustriesForProduct(category);
                  const apps = getApplicationsForCategory(partner.applications, category);
                  
                  return (
                    <article 
                      key={category} 
                      className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-500"
                    >
                      {/* Top accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
                      
                      <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                            {getProductDisplayName(category)}
                          </h3>
                          {apps.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                              {apps.map(app => (
                                <Badge 
                                  key={app} 
                                  variant="outline"
                                  className="text-xs bg-muted/50 border-border/50"
                                >
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-5">
                          {/* Primary industries */}
                          {primary.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Branschfokus
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {primary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-primary/10 text-primary border border-primary/20 py-2 px-4 text-sm font-medium"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Secondary industries */}
                          {secondary.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Erfarenhet även inom
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {secondary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-amber-500 hover:bg-amber-600 text-white border-0 py-2 px-4 text-sm font-medium transition-colors"
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
            <article className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent/25 via-primary/15 to-accent/20 border border-primary/20 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/25 to-transparent rounded-full blur-2xl" />
              
              <div className="relative p-8 sm:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 shadow-lg">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      Intresserad av {partner.name}?
                    </h3>
                    <p className="text-muted-foreground">
                      Låt oss hjälpa dig helt kostnadsfritt att komma i kontakt med rätt person.
                    </p>
                  </div>
                </div>
                
                {/* Filter context */}
                <div className="mb-6 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {hasFilters ? 'Din sökning' : 'Partner'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-foreground/10 text-foreground border-foreground/20 font-semibold py-1.5 px-3">
                      {partner.name}
                    </Badge>
                    {selectedProduct && (
                      <Badge className="bg-primary/15 text-primary border-primary/30 py-1.5 px-3">
                        {selectedProduct}
                      </Badge>
                    )}
                    {selectedIndustry && (
                      <Badge variant="outline" className="border-accent/50 text-foreground py-1.5 px-3">
                        {selectedIndustry}
                      </Badge>
                    )}
                    {selectedCompanySize && (
                      <Badge variant="outline" className="border-muted-foreground/50 text-foreground py-1.5 px-3">
                        {selectedCompanySize}
                      </Badge>
                    )}
                    {selectedGeography && (
                      <Badge variant="outline" className="border-muted-foreground/50 text-foreground py-1.5 px-3">
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
