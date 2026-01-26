import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
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
  Users,
  User
} from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import { usePartner } from "@/hooks/usePartners";
import { partners as staticPartners, getCumulativeGeographyDisplay } from "@/data/partners";
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
  const getIndustriesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { primary: string[] } => {
    // Map sales and service to 'crm' for productFilters lookup
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    
    // Prioritize database product_filters over static data
    const dbProductFilters = dbPartner?.product_filters as Record<string, { industries?: string[] }> | undefined;
    if (dbProductFilters?.[filterKey]?.industries && dbProductFilters[filterKey].industries.length > 0) {
      return {
        primary: dbProductFilters[filterKey].industries
      };
    }
    
    // Fallback to static partner data
    if (staticPartner?.productFilters?.[filterKey]?.industries) {
      return {
        primary: staticPartner.productFilters[filterKey].industries || []
      };
    }
    
    // Final fallback to general industries
    const allIndustries = partner?.industries || [];
    return { 
      primary: allIndustries.slice(0, 3)
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

  // Get customer examples for a specific product - only from database
  const getCustomerExamplesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    // Check database partner's product_filters
    const dbProductFilters = dbPartner?.product_filters as Record<string, { customerExamples?: string[] }> | undefined;
    const dbCustomerExamples = dbProductFilters?.[filterKey]?.customerExamples;
    if (dbCustomerExamples && dbCustomerExamples.length > 0) return dbCustomerExamples;
    return [];
  };

  // Get product description for a specific product
  const getProductDescriptionForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string | null => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    const dbProductFilters = dbPartner?.product_filters as Record<string, { productDescription?: string }> | undefined;
    return dbProductFilters?.[filterKey]?.productDescription || null;
  };

  // Get Sweden cities for a specific product
  const getSwedenCitiesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    const dbProductFilters = dbPartner?.product_filters as Record<string, { swedenCities?: string[] }> | undefined;
    return dbProductFilters?.[filterKey]?.swedenCities || [];
  };

  // Get customer case links for a specific product
  const getCustomerCaseLinksForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    const dbProductFilters = dbPartner?.product_filters as Record<string, { customerCaseLinks?: string[] }> | undefined;
    return dbProductFilters?.[filterKey]?.customerCaseLinks || [];
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
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till partnerlistan
          </Button>
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
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-6 group text-sm font-medium backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Tillbaka till partnerlistan
          </button>

          {/* Main content - centered layout */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Premium Logo Container with glow effect - centered */}
            <div className="relative group/logo mb-6">
              {/* Outer glow ring */}
              <div className="absolute -inset-3 bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 rounded-3xl blur-xl opacity-60 group-hover/logo:opacity-100 transition-opacity duration-500" />
              
              {/* Logo card - dark background for better contrast with light logos */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-slate-800 shadow-2xl shadow-black/30 flex items-center justify-center p-5 overflow-hidden border-2 border-slate-700/80">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 via-transparent to-slate-900/50" />
                
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain relative z-10 brightness-110 contrast-110"
                  />
                ) : (
                  <Building2 className="w-14 h-14 text-slate-400" />
                )}
              </div>
            </div>

            {/* Partner name and badge */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                {partner.name}
              </h1>
              {partner.is_featured && (
                <Badge className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-amber-900 border-0 shadow-lg shadow-amber-500/30 px-3 py-1.5 text-sm font-bold">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Utvald partner
                </Badge>
              )}
            </div>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-white/80 max-w-3xl leading-relaxed font-light mb-6">
              {partner.description}
            </p>
            
            {/* Premium stats row - centered */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(dbPartner?.geography && dbPartner.geography.length > 0) ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{getCumulativeGeographyDisplay(dbPartner.geography[dbPartner.geography.length - 1])}</span>
                </div>
              ) : staticPartner?.geography && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{getCumulativeGeographyDisplay(staticPartner.geography)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white shadow-lg">
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
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/80 to-primary backdrop-blur-md border border-primary/50 text-sm text-white shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* Sales contact - separate row */}
            {dbPartner?.contactPerson && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-md border border-emerald-400/30 text-sm text-white shadow-lg">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">Säljkontakt: {dbPartner.contactPerson}</span>
                </div>
              </div>
            )}
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
                  const { primary } = getIndustriesForProduct(category);
                  const apps = getApplicationsForCategory(partner.applications, category);
                  const customerExamples = getCustomerExamplesForProduct(category);
                  const productDescription = getProductDescriptionForProduct(category);
                  const swedenCities = getSwedenCitiesForProduct(category);
                  const customerCaseLinks = getCustomerCaseLinksForProduct(category);
                  const geography = getGeographyForProduct(category);
                  
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
                          <h3 className="text-xl font-bold text-foreground flex items-center gap-2 shrink-0">
                            {(() => {
                              const categoryIcon = category === 'bc' 
                                ? getApplicationIcon("Business Central")
                                : category === 'fsc'
                                ? getApplicationIcon("Finance")
                                : category === 'sales'
                                ? getApplicationIcon("Sales")
                                : getApplicationIcon("Customer Service");
                              return categoryIcon && (
                                <img src={categoryIcon} alt="" className="w-6 h-6" />
                              );
                            })()}
                            {getProductDisplayName(category)}
                          </h3>
                          {apps.length >= 1 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-start sm:justify-end sm:ml-4 sm:flex-col sm:items-end">
                              {apps.map(app => {
                                const appIcon = getApplicationIcon(app);
                                return (
                                  <Badge 
                                    key={app} 
                                    className="text-[10px] sm:text-xs bg-accent text-accent-foreground border-0 py-0.5 sm:py-1 px-1.5 sm:px-2.5 font-medium shadow-sm justify-end text-right"
                                  >
                                    {appIcon && (
                                      <img src={appIcon} alt="" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    )}
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
                          
                          
                          {/* If no industries at all */}
                          {primary.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">
                              Branschoberoende
                            </p>
                          )}

                          {/* Geographic coverage with Sweden cities */}
                          {(geography || swedenCities.length > 0) && (
                            <div className="space-y-2.5">
                              <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                Geografisk täckning
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {geography && (
                                  <Badge 
                                    variant="outline"
                                    className="bg-background/50 text-foreground/80 border-border py-1.5 px-3 text-sm font-medium"
                                  >
                                    {geography}
                                  </Badge>
                                )}
                                {swedenCities.length > 0 && (
                                  <span className="text-sm text-muted-foreground">
                                    Städer: {swedenCities.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Product Description - above Customer Examples */}
                          {productDescription && (
                            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3 italic">
                              {productDescription}
                            </p>
                          )}

                          {/* Customer Examples */}
                          <div className="space-y-2.5 pt-2 border-t border-border/50">
                            <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-muted-foreground" />
                              Kundexempel
                            </p>
                            {customerExamples.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {customerExamples.map((customer, idx) => (
                                  <Badge 
                                    key={idx}
                                    variant="outline"
                                    className="bg-background/50 text-foreground/80 border-border py-1.5 px-3 text-sm font-medium"
                                  >
                                    {customer}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Kundexempel kan tillhandahållas på förfrågan
                              </p>
                            )}
                            
                            {/* Customer Case Links */}
                            {customerCaseLinks.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {customerCaseLinks.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Kundcase {customerCaseLinks.length > 1 ? idx + 1 : ''}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
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
