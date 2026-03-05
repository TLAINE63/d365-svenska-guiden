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
  User,
  Mail,
  Phone,
  Package
} from "lucide-react";
import LeadCTA from "@/components/LeadCTA";
import PartnerEventsSection from "@/components/PartnerEventsSection";
import { usePartner } from "@/hooks/usePartners";
import { getCumulativeGeographyDisplay } from "@/data/partners";
import { Helmet } from "react-helmet";
import { trackPartnerClick } from "@/utils/trackPartnerClick";
import { calculateProductAiScore, calculateAiScore, getAiLevel } from "@/utils/aiScoring";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import ProjectOperationsIcon from "@/assets/icons/ProjectOperations.svg";
import CommerceIcon from "@/assets/icons/Commerce.svg";
import HumanResourcesIcon from "@/assets/icons/HumanResources.svg";

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
  "Project Operations": ProjectOperationsIcon,
  "Commerce": CommerceIcon,
  "Human Resources": HumanResourcesIcon,
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
// NOTE: Project Operations, Commerce, Human Resources are specialty products shown separately
const getProductCategory = (app: string): 'bc' | 'fsc' | 'sales' | 'service' | null => {
  if (app === "Business Central") return 'bc';
  if (["Finance", "Supply Chain Management", "Finance & SCM", "Finance & Supply Chain"].includes(app)) return 'fsc';
  if (["Sales", "Customer Insights", "Customer Insights (Marketing)", "Marketing"].includes(app)) return 'sales';
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

// Get default applications for a category when none are in the applications array
const getDefaultApplicationsForCategory = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
  switch (category) {
    case 'bc': return ['Business Central'];
    case 'fsc': return ['Finance', 'Supply Chain Management'];
    case 'sales': return ['Sales', 'Customer Insights (Marketing)'];
    case 'service': return ['Customer Service', 'Field Service', 'Contact Center'];
  }
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
  
  // Use database partner directly (no static fallback needed - all partners are in DB)
  const partner = dbPartner ?? null;

  // Get product categories this partner supports
  // Get product categories this partner supports - check both applications array AND product_filters
  const getProductCategories = (): ('bc' | 'fsc' | 'sales' | 'service')[] => {
    if (!partner) return [];
    const categories = new Set<'bc' | 'fsc' | 'sales' | 'service'>();
    
    // Check applications array
    partner.applications.forEach(app => {
      const cat = getProductCategory(app);
      if (cat) categories.add(cat);
    });
    
    // Also check product_filters for categories with valid data
    const productFilters = dbPartner?.product_filters as Record<string, unknown> | undefined;
    if (productFilters) {
      const filterCategories: ('bc' | 'fsc' | 'sales' | 'service')[] = ['bc', 'fsc', 'sales', 'service'];
      filterCategories.forEach(cat => {
        if (productFilters[cat]) {
          categories.add(cat);
        }
      });
    }
    
    return Array.from(categories);
  };

  // Get industries for a specific product
  const getIndustriesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { primary: string[] } => {
    const dbProductFilters = dbPartner?.product_filters as Record<string, { industries?: string[] }> | undefined;
    
    // Try the direct key first (sales, service, bc, fsc)
    if (dbProductFilters?.[category]?.industries && dbProductFilters[category].industries.length > 0) {
      return { primary: dbProductFilters[category].industries };
    }
    
    // Legacy fallback: sales/service were previously stored under 'crm'
    if (category === 'sales' || category === 'service') {
      if (dbProductFilters?.['crm']?.industries && dbProductFilters['crm'].industries.length > 0) {
        return { primary: dbProductFilters['crm'].industries };
      }
    }
    
    // Final fallback to general industries
    const allIndustries = partner?.industries || [];
    return { primary: allIndustries.slice(0, 3) };
  };

  // Get geography for a specific product - prioritize database data, return as array
  // Normalize to only valid values: Sverige, Norden, Europa, Övriga världen (in this exact order)
  const getGeographyForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    
    // Valid geography values in display order - "Internationellt" should be mapped to "Övriga världen"
    const geographyOrder = ["Sverige", "Norden", "Europa", "Övriga världen"];
    
    const normalizeAndSortGeography = (geoArray: string[]): string[] => {
      const normalized = geoArray.map(geo => 
        geo === "Internationellt" ? "Övriga världen" : geo
      );
      // Find the broadest geography level and include all levels up to it
      const maxIndex = Math.max(...normalized.map(geo => geographyOrder.indexOf(geo)).filter(i => i >= 0));
      if (maxIndex < 0) return [];
      // Return all levels from Sverige up to the broadest selected
      return geographyOrder.slice(0, maxIndex + 1);
    };
    
    // Check database partner's product_filters first
    const dbProductFilters = dbPartner?.product_filters as Record<string, { geography?: string | string[] }> | undefined;
    const dbProductGeo = dbProductFilters?.[filterKey]?.geography;
    if (dbProductGeo) {
      const geoArray = Array.isArray(dbProductGeo) ? dbProductGeo : [dbProductGeo];
      return normalizeAndSortGeography(geoArray);
    }
    // Fall back to partner's geography array
    if (dbPartner?.geography && dbPartner.geography.length > 0) {
      return normalizeAndSortGeography(dbPartner.geography);
    }
    return [];
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

  // Sweden regions and cities functions removed - no longer displaying regions on profiles

  // Get customer case links for a specific product
  const getCustomerCaseLinksForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
    const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
    const dbProductFilters = dbPartner?.product_filters as Record<string, { customerCaseLinks?: string[] }> | undefined;
    return dbProductFilters?.[filterKey]?.customerCaseLinks || [];
  };

  // Get industry apps for a specific product category
  interface IndustryApp {
    name: string;
    url: string;
    application: string;
    industry: string;
    description: string;
  }

  const getIndustryAppsForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): IndustryApp[] => {
    const rawApps = dbPartner?.industry_apps;
    if (!rawApps || !Array.isArray(rawApps)) return [];
    
    // Map category to matching application names
    const categoryApps: Record<string, string[]> = {
      bc: ['Business Central'],
      fsc: ['Finance', 'Supply Chain Management'],
      sales: ['Sales', 'Customer Insights (Marketing)'],
      service: ['Customer Service', 'Field Service', 'Contact Center'],
    };
    
    const matchingApps = categoryApps[category] || [];
    return rawApps.filter((app: IndustryApp) => 
      matchingApps.includes(app.application)
    );
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

      {/* Premium Hero Header - Light theme */}
      <header className="relative overflow-hidden mt-16 text-slate-900">
        {/* Always-light background regardless of theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-100/30 via-transparent to-transparent" />
        
        {/* Subtle floating orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-sky-200/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-sky-200/15 to-teal-200/10 rounded-full blur-[80px]" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 group text-sm font-medium bg-slate-200/50 px-3 py-1.5 rounded-full border border-slate-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Tillbaka till partnerlistan
          </button>

          {/* Main content - centered layout */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Logo Container - only shown if logo exists */}
            {partner.logo_url && (
              <div className="relative mb-6">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logotyp`}
                    className="max-w-full max-h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </div>
            )}

            {/* Partner name and badge */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                {partner.name}
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-light mb-6">
              {partner.description}
            </p>
            
            {/* Overall AI Level Badge */}
            {(() => {
              const score = calculateAiScore(partner.product_filters);
              const aiLevel = getAiLevel(score);
              if (aiLevel.level === "none") return null;
              const descriptions: Record<string, string> = {
                enabled: "Aktiverar och implementerar Microsofts inbyggda AI",
                integration: "Bygger anpassade AI-agenter och processer",
                advanced: "Utvecklar kundunika AI-lösningar och prediktiva modeller",
                transformation: "Levererar avancerade Azure AI-arkitekturer",
              };
              return (
                <div className="mb-4">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Badge
                            variant="outline"
                            className={`text-sm font-semibold px-4 py-1.5 cursor-help ${aiLevel.color} border-2`}
                          >
                            <Award className="w-4 h-4 mr-1.5" />
                            {aiLevel.emoji} {aiLevel.label}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs text-sm">
                        <p>{descriptions[aiLevel.level]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
            })()}

            {/* Premium stats row - centered */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Website link only - geography and competency count removed */}
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
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary/80 to-primary backdrop-blur-md border border-primary/50 text-sm text-primary-foreground shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            {/* Office cities */}
            {(() => {
              const cities = dbPartner?.office_cities as string[] | undefined;
              return cities && cities.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-200/50 border border-slate-200 text-sm text-slate-700 shadow-sm">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-medium">
                      Vi har kontor i: {cities.join(', ')}
                    </span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Sales contact - separate row */}
            {dbPartner?.contactPerson && (
              <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-slate-700 shadow-sm">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Säljkontakt: {dbPartner.contactPerson}</span>
                </div>
                {dbPartner?.email && (
                  <a 
                    href={`mailto:${dbPartner.email}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-200/50 border border-slate-200 text-sm text-slate-700 shadow-sm hover:bg-slate-200/80 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">{dbPartner.email}</span>
                  </a>
                )}
                {dbPartner?.phone && (
                  <a 
                    href={`tel:${dbPartner.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-200/50 border border-slate-200 text-sm text-slate-700 shadow-sm hover:bg-slate-200/80 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">{dbPartner.phone}</span>
                  </a>
                )}
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
                  const appsFromArray = getApplicationsForCategory(partner.applications, category);
                  // If no apps found in applications array, use defaults based on category
                  const apps = appsFromArray.length > 0 ? appsFromArray : getDefaultApplicationsForCategory(category);
                  const customerExamples = getCustomerExamplesForProduct(category);
                  const productDescription = getProductDescriptionForProduct(category);
                  const customerCaseLinks = getCustomerCaseLinksForProduct(category);
                  const geography = getGeographyForProduct(category);
                  const industryAppsForProduct = getIndustryAppsForProduct(category);
                  
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

                        {/* Per-product AI Level */}
                        {(() => {
                          const pf = partner.product_filters?.[category];
                          if (!pf?.aiCapabilities || pf.aiCapabilities.length === 0) return null;
                          const productScore = calculateProductAiScore(pf.aiCapabilities, pf.aiProjectCount, category);
                          const productLevel = getAiLevel(productScore);
                          if (productLevel.level === "none") return null;
                          const descriptions: Record<string, string> = {
                            enabled: "Aktiverar och implementerar Microsofts inbyggda AI",
                            integration: "Bygger anpassade AI-agenter och processer",
                            advanced: "Utvecklar kundunika AI-lösningar och prediktiva modeller",
                            transformation: "Levererar avancerade Azure AI-arkitekturer",
                          };
                          return (
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="mb-3 self-start">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs font-semibold cursor-help ${productLevel.color}`}
                                    >
                                      <Award className="w-3 h-3 mr-1" />
                                      {productLevel.emoji} {productLevel.label}
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs text-xs z-[100]">
                                  <p>{descriptions[productLevel.level]}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })()}
                        
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

                          {/* Geographic coverage - countries/continents only, no regions */}
                          {geography.length > 0 && (
                            <div className="space-y-2.5">
                              <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                Geografisk täckning
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {geography.map((geo, idx) => (
                                  <Badge 
                                    key={`geo-${idx}`}
                                    variant="outline"
                                    className="bg-background/50 text-foreground/80 border-border py-1.5 px-3 text-sm font-medium"
                                  >
                                    {geo}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Product Description - above Customer Examples */}
                          {productDescription && (
                            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3 italic">
                              {productDescription}
                            </p>
                          )}

                          {/* Customer Examples with linked case studies */}
                          <div className="space-y-2.5 pt-2 border-t border-border/50">
                            <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-muted-foreground" />
                              Kundexempel
                            </p>
                            {customerExamples.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {customerExamples.map((customer, idx) => {
                                  const caseLink = customerCaseLinks[idx];
                                  return caseLink ? (
                                    <a
                                      key={idx}
                                      href={caseLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group"
                                    >
                                      <Badge 
                                        variant="outline"
                                        className="bg-background/50 text-foreground/80 border-border py-1.5 px-3 text-sm font-medium hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
                                      >
                                        {customer}
                                        <ExternalLink className="w-3 h-3 ml-1.5 opacity-60 group-hover:opacity-100" />
                                      </Badge>
                                    </a>
                                  ) : (
                                    <Badge 
                                      key={idx}
                                      variant="outline"
                                      className="bg-background/50 text-foreground/80 border-border py-1.5 px-3 text-sm font-medium"
                                    >
                                      {customer}
                                    </Badge>
                                  );
                                })}
                                {/* Show remaining case links that don't have a matching customer */}
                                {customerCaseLinks.slice(customerExamples.length).map((link, idx) => (
                                  <a
                                    key={`extra-case-${idx}`}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Läs kundcase
                                  </a>
                                ))}
                              </div>
                            ) : customerCaseLinks.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {customerCaseLinks.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Läs kundcase {customerCaseLinks.length > 1 ? idx + 1 : ''}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                Kundexempel kan tillhandahållas på förfrågan
                              </p>
                            )}
                          </div>

                          {/* Industry Apps / AppSource Extensions */}
                          {industryAppsForProduct.length > 0 && (
                            <div className="space-y-2.5 pt-2 border-t border-border/50">
                              <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest flex items-center gap-2">
                                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                                Branschapplikationer (Microsoft Marketplace)
                              </p>
                              <div className="space-y-2">
                                {industryAppsForProduct.map((app, idx) => (
                                  <a
                                    key={idx}
                                    href={app.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/app flex items-start gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-foreground group-hover/app:text-primary transition-colors truncate">
                                          {app.name}
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover/app:opacity-100 transition-opacity flex-shrink-0" />
                                      </div>
                                      {app.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{app.description}</p>
                                      )}
                                      {app.industry && (
                                        <Badge variant="outline" className="text-[10px] mt-1 px-1.5 py-0 border-border/60">
                                          {app.industry}
                                        </Badge>
                                      )}
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Specialty Products Section - Project Operations, Commerce, Human Resources */}
            {(() => {
              const specialtyProducts = ['Project Operations', 'Commerce', 'Human Resources'];
              const partnerSpecialties = partner.applications.filter(app => specialtyProducts.includes(app));
              
              if (partnerSpecialties.length === 0) return null;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        Tilläggsområden
                      </h2>
                      <p className="text-muted-foreground text-sm mt-0.5">Ytterligare Dynamics 365-kompetenser</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-3">
                    {partnerSpecialties.map((product) => {
                      const icon = getApplicationIcon(product);
                      return (
                        <div 
                          key={product}
                          className="group relative rounded-xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400" />
                          
                          <div className="relative p-4 flex items-center gap-3">
                            {icon && (
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                                <img src={icon} alt="" className="w-7 h-7" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-foreground text-sm sm:text-base">
                                Dynamics 365 {product}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Events Section */}
            {dbPartner?.id && (
              <PartnerEventsSection 
                partnerId={dbPartner.id} 
                partnerName={partner.name} 
              />
            )}

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
