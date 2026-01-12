import { useParams, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  Globe, 
  MapPin, 
  Award, 
  Layers, 
  ExternalLink,
  Calculator,
  Users,
  Headphones,
  Wrench,
  TrendingUp,
  Megaphone,
  Bot,
  Phone,
  Package,
  Wallet,
  type LucideIcon
} from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners, getCumulativeGeographyDisplay } from "@/data/partners";
import { Helmet } from "react-helmet";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

// Map application names to icons
const applicationIcons: Record<string, LucideIcon> = {
  "Business Central": Calculator,
  "Sales": TrendingUp,
  "Customer Service": Headphones,
  "Field Service": Wrench,
  "Marketing": Megaphone,
  "Customer Insights (Marketing)": Megaphone,
  "Finance": Wallet,
  "Finance & SCM": Wallet,
  "Supply Chain": Package,
  "Copilot": Bot,
  "Contact Center": Phone,
  "CRM": Users,
};

const getApplicationIcon = (appName: string): LucideIcon => {
  // Try exact match first
  if (applicationIcons[appName]) return applicationIcons[appName];
  
  // Try partial match
  const lowerName = appName.toLowerCase();
  for (const [key, icon] of Object.entries(applicationIcons)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return icon;
    }
  }
  
  // Default icon
  return CheckCircle2;
};

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

  // Get geography for a specific product - prioritize database data
  const getGeographyForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string | null => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    // Check database partner's product_filters first, then geography array
    const dbProductFilters = dbPartner?.product_filters as Record<string, { geography?: string }> | undefined;
    const dbProductGeo = dbProductFilters?.[filterKey]?.geography;
    if (dbProductGeo) return dbProductGeo;
    // Fall back to partner's geography array (use first/highest level)
    if (dbPartner?.geography && dbPartner.geography.length > 0) {
      return dbPartner.geography[dbPartner.geography.length - 1]; // Use highest level (last in array)
    }
    // Final fallback to static data
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <Helmet>
        <title>{partner.name} - Dynamics 365 Partner | Svenska D365-guiden</title>
        <meta
          name="description"
          content={partner.description?.slice(0, 160) || `${partner.name} är en Microsoft Dynamics 365-partner som hjälper företag med implementationer.`}
        />
      </Helmet>

      <Navbar />

      {/* Premium Hero Header */}
      <header className="relative overflow-hidden mt-16">
        {/* Sophisticated multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/25 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-accent/25 to-primary/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link
            to="/valj-partner"
            className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-6 group text-sm font-medium backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Tillbaka till partnerlistan
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            {/* Premium Logo Container with glow effect */}
            <div className="relative group/logo shrink-0">
              {/* Outer glow ring */}
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 rounded-3xl blur-xl opacity-60 group-hover/logo:opacity-100 transition-opacity duration-500" />
              
              {/* Logo card - dark background for better contrast with light logos */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-800 shadow-2xl shadow-black/30 flex items-center justify-center p-4 overflow-hidden border-2 border-slate-700">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 via-transparent to-slate-900/50" />
                
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain relative z-10 brightness-110 contrast-110"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-slate-400" />
                )}
              </div>
            </div>

            {/* Partner Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                  {partner.name}
                </h1>
                {partner.is_featured && (
                  <Badge className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-amber-900 border-0 shadow-lg shadow-amber-500/30 px-3 py-1 text-sm font-bold animate-pulse">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Utvald partner
                  </Badge>
                )}
              </div>
              
              <p className="text-base sm:text-lg text-white/80 max-w-3xl leading-relaxed font-light">
                {partner.description}
              </p>
              
              {/* Premium stats row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {(dbPartner?.geography && dbPartner.geography.length > 0) ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{getCumulativeGeographyDisplay(dbPartner.geography[dbPartner.geography.length - 1])}</span>
                  </div>
                ) : staticPartner?.geography && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{getCumulativeGeographyDisplay(staticPartner.geography)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
                  <Layers className="w-4 h-4 text-accent" />
                  <span className="font-medium">{partner.applications.length} Dynamics 365-applikationer</span>
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
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/80 to-primary backdrop-blur-md border border-primary/50 text-sm text-white shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
                >
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </header>

      {/* Content Section */}
      <section className="py-8 sm:py-12 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Product Competencies */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent shadow-lg shadow-primary/25">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Kompetenser inom Dynamics 365
                  </h2>
                  <p className="text-muted-foreground text-sm mt-0.5">Expertområden och branscherfarenhet</p>
                </div>
              </div>
              
              <div className={`grid gap-4 ${productCategories.length >= 2 ? 'sm:grid-cols-2' : ''}`}>
                {productCategories.map((category, index) => {
                  const { primary, secondary } = getIndustriesForProduct(category);
                  const apps = getApplicationsForCategory(partner.applications, category);
                  
                  return (
                    <article 
                      key={category} 
                      className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Animated gradient border effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Top accent with animation */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] group-hover:animate-[shimmer_2s_ease-in-out_infinite]" />
                      
                      <div className="relative p-5 sm:p-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                            {getProductDisplayName(category)}
                          </h3>
                          {apps.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                              {apps.map(app => {
                                const AppIcon = getApplicationIcon(app);
                                return (
                                  <Badge 
                                    key={app} 
                                    className="text-xs bg-accent text-accent-foreground border-0 py-1 px-2.5 font-medium shadow-sm"
                                  >
                                    <AppIcon className="w-3 h-3 mr-1" />
                                    {app}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          {/* Primary industries */}
                          {primary.length > 0 && (
                            <div className="space-y-2.5">
                              <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Branschfokus
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {primary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-primary text-primary-foreground border-0 py-1.5 px-3 text-sm font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    {ind}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Secondary industries */}
                          {secondary.length > 0 && (
                            <div className="space-y-2.5">
                              <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                                Erfarenhet även inom
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {secondary.map(ind => (
                                  <Badge 
                                    key={ind}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 py-1.5 px-3 text-sm font-medium shadow-sm hover:shadow-md transition-all"
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

            {/* Premium Contact CTA Card */}
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
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Intresserad av {partner.name}?
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      Låt oss hjälpa dig helt kostnadsfritt att komma i kontakt med rätt person.
                    </p>
                  </div>
                </div>
                
                {/* Filter context with glass effect */}
                <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {hasFilters ? 'Din sökning' : 'Partner'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/20 text-white border-white/30 font-semibold py-1.5 px-3 backdrop-blur-sm">
                      {partner.name}
                    </Badge>
                    {selectedProduct && (
                      <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 backdrop-blur-sm">
                        {selectedProduct}
                      </Badge>
                    )}
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
