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
  ExternalLink
} from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner, DatabasePartner, ProductFilters } from "@/hooks/usePartners";
import { getCumulativeGeographyDisplay } from "@/data/partners";
import { Helmet } from "react-helmet";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

// Dynamics 365 icons
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";
import CopilotIcon from "@/assets/icons/Copilot.png";

// Map application names to Dynamics 365 icons
const applicationIcons: Record<string, string> = {
  "Business Central": BusinessCentralIcon,
  "Sales": SalesIcon,
  "Customer Service": CustomerServiceIcon,
  "Field Service": FieldServiceIcon,
  "Marketing": MarketingIcon,
  "Customer Insights": MarketingIcon,
  "Customer Insights (Marketing)": MarketingIcon,
  "Finance": FinanceIcon,
  "Finance & SCM": FinanceIcon,
  "Finance & Supply Chain": FinanceIcon,
  "Supply Chain": SupplyChainIcon,
  "Supply Chain Management": SupplyChainIcon,
  "Copilot": CopilotIcon,
  "Contact Center": ContactCenterIcon,
};

const getApplicationIcon = (appName: string): string | null => {
  // Try exact match first
  if (applicationIcons[appName]) return applicationIcons[appName];
  
  // Try partial match
  const lowerName = appName.toLowerCase();
  for (const [key, icon] of Object.entries(applicationIcons)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return icon;
    }
  }
  
  // No matching icon
  return null;
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
  const { data: partner, isLoading } = usePartner(slug);

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

  // Get industries for a specific product from database product_filters
  const getIndustriesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { primary: string[]; secondary: string[] } => {
    // Map sales and service to appropriate keys for productFilters lookup
    const filterKey = (category === 'sales' || category === 'service') ? 'sales' : category;
    
    const productFilters = partner?.product_filters as ProductFilters | undefined;
    const productFilter = productFilters?.[filterKey];
    
    if (!productFilter) {
      // Fallback to general industries
      const allIndustries = partner?.industries || [];
      return { 
        primary: allIndustries.slice(0, 2), 
        secondary: [] 
      };
    }
    
    return {
      primary: productFilter.industries || [],
      secondary: productFilter.secondaryIndustries || []
    };
  };

  // Get geography for a specific product - from database
  const getGeographyForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string | null => {
    const filterKey = (category === 'sales' || category === 'service') ? 'sales' : category;
    
    // Check database partner's product_filters first
    const productFilters = partner?.product_filters as ProductFilters | undefined;
    const productGeo = productFilters?.[filterKey]?.geography;
    if (productGeo) return productGeo;
    
    // Fall back to partner's geography array (use highest level)
    if (partner?.geography && partner.geography.length > 0) {
      return partner.geography[partner.geography.length - 1];
    }
    
    return null;
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
            {/* Premium Logo Container with light background for better contrast */}
            <div className="relative group/logo shrink-0">
              {/* Subtle outer glow */}
              <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-md opacity-60 group-hover/logo:opacity-100 transition-opacity duration-500" />
              
              {/* Logo card - light background for universal logo compatibility */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white shadow-2xl shadow-black/20 flex items-center justify-center p-4 overflow-hidden border border-gray-100">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-gray-400" />
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
                {partner.geography && partner.geography.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">{getCumulativeGeographyDisplay(partner.geography[partner.geography.length - 1])}</span>
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
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 shadow-sm group-hover:shadow-md transition-shadow">
                              {apps[0] && getApplicationIcon(apps[0]) ? (
                                <img 
                                  src={getApplicationIcon(apps[0])!} 
                                  alt={apps[0]} 
                                  className="w-6 h-6 sm:w-7 sm:h-7"
                                />
                              ) : (
                                <Briefcase className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
                                {getProductDisplayName(category)}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {apps.length} {apps.length === 1 ? 'applikation' : 'applikationer'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Geography badge */}
                          {getGeographyForProduct(category) && (
                            <Badge variant="outline" className="text-xs px-2.5 py-1 bg-muted/50 border-muted-foreground/20 shrink-0">
                              <MapPin className="w-3 h-3 mr-1.5" />
                              {getGeographyForProduct(category)}
                            </Badge>
                          )}
                        </div>

                        {/* Applications list */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {apps.map((app) => {
                            const icon = getApplicationIcon(app);
                            return (
                              <Badge 
                                key={app} 
                                variant="secondary" 
                                className="text-xs px-2 py-0.5 bg-secondary/60 hover:bg-secondary transition-colors flex items-center gap-1"
                              >
                                {icon && <img src={icon} alt="" className="w-3.5 h-3.5" />}
                                {app}
                              </Badge>
                            );
                          })}
                        </div>

                        {/* Industries */}
                        {(primary.length > 0 || secondary.length > 0) && (
                          <div className="space-y-3 pt-3 border-t border-border/50">
                            {primary.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="w-4 h-4 text-primary" />
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Branschfokus</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {primary.map((ind) => (
                                    <Badge 
                                      key={ind} 
                                      className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                    >
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      {ind}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {secondary.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Layers className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs font-medium text-muted-foreground">Erfarenhet även inom</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {secondary.map((ind) => (
                                    <Badge 
                                      key={ind} 
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 border-muted-foreground/30 text-muted-foreground"
                                    >
                                      {ind}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Contact Card */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        {/* Premium dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
        
        {/* Animated orbs */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/25 to-accent/15 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                Intresserad av {partner.name}?
              </h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Låt oss hjälpa dig helt kostnadsfritt att komma i kontakt med rätt person.
              </p>
            </div>
            
            {/* Search context badges */}
            {(selectedProduct || selectedIndustry || selectedCompanySize || selectedGeography) && (
              <div className="mb-8">
                <p className="text-white/60 text-sm text-center mb-3 font-medium uppercase tracking-wide">
                  Din sökning
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm">
                    {partner.name}
                  </Badge>
                  {selectedProduct && (
                    <Badge className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm px-4 py-2 text-sm">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                      {selectedProduct}
                    </Badge>
                  )}
                  {selectedIndustry && (
                    <Badge className="bg-accent/20 text-white border-accent/30 backdrop-blur-sm px-4 py-2 text-sm">
                      <Building2 className="w-3.5 h-3.5 mr-1.5" />
                      {selectedIndustry}
                    </Badge>
                  )}
                  {selectedCompanySize && (
                    <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm">
                      {selectedCompanySize} anställda
                    </Badge>
                  )}
                  {selectedGeography && (
                    <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-4 py-2 text-sm">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {selectedGeography}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Lead CTA Form */}
            <LeadCTA 
              variant="inline"
              sourcePage={`partner-profile-${partner.slug}`}
              selectedProduct={selectedProduct}
              selectedIndustry={selectedIndustry}
              partnerName={partner.name}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
