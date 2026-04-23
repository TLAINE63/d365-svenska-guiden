import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  Shuffle,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Award,
  ExternalLink
} from "lucide-react";
import {
  calculateAiScore,
  getAiLevel,
  AI_TIER_LABELS,
  AI_TIER_BADGE_STYLES,
  getCapabilityEmoji,
} from "@/utils/aiScoring";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Partner, getCumulativeGeographyDisplay } from "@/data/partners";
import { DatabasePartner } from "@/hooks/usePartners";
import { trackPartnerView } from "@/utils/trackPartnerView";
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
  "Finance & Supply Chain": FinanceIcon,
  "Supply Chain": SupplyChainIcon,
  "Supply Chain Management": SupplyChainIcon,
  "Copilot": CopilotIcon,
  "Contact Center": ContactCenterIcon,
  // Specialty products with official icons
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

// (AI labels and badge styles now come from aiScoring.ts)

// Product key to Swedish label for AI section header
const productKeyToSwedish: Record<string, string> = {
  bc: "Business Central",
  fsc: "Finance & SCM",
  sales: "Sälj & Marknad",
  service: "Kundservice",
};
// Union type to support both static and database partners
type PartnerData = Partner | DatabasePartner;

// Type guard to check if it's a DatabasePartner
function isDatabasePartner(partner: PartnerData): partner is DatabasePartner {
  return 'product_filters' in partner && 'slug' in partner;
}

interface PartnerCardProps {
  partner: PartnerData;
  profileUrl: string;
  colorScheme?: 'primary' | 'crm' | 'amber';
  productKey?: 'bc' | 'fsc' | 'crm' | 'sales' | 'service' | null;
  highlightedProduct?: string;
  highlightedIndustry?: string;
  highlightedCompanySize?: string;
  highlightedRevenue?: string;
  highlightedGeography?: string;
  showRandomIndicator?: boolean;
}

const PartnerCard = ({ 
  partner, 
  profileUrl, 
  colorScheme = 'primary',
  productKey,
  highlightedProduct,
  highlightedIndustry,
  highlightedCompanySize,
  highlightedRevenue,
  highlightedGeography,
  showRandomIndicator = false
}: PartnerCardProps) => {
  const [showAiDetails, setShowAiDetails] = useState(false);
  
  // Get color classes based on scheme
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'crm':
        return {
          gradient: 'from-crm/20 via-transparent to-crm/10',
          accent: 'bg-crm',
          accentHover: 'group-hover:bg-crm',
          badge: 'bg-crm/10 text-crm border-crm/20',
          glow: 'group-hover:shadow-[0_20px_50px_-12px_hsl(var(--crm)/0.25)]'
        };
      case 'amber':
        return {
          gradient: 'from-amber-500/20 via-transparent to-amber-500/10',
          accent: 'bg-amber-500',
          accentHover: 'group-hover:bg-amber-500',
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          glow: 'group-hover:shadow-[0_20px_50px_-12px_rgba(245,158,11,0.25)]'
        };
      default:
        return {
          gradient: 'from-primary/20 via-transparent to-primary/10',
          accent: 'bg-primary',
          accentHover: 'group-hover:bg-primary',
          badge: 'bg-primary/10 text-primary border-primary/20',
          glow: 'group-hover:shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.25)]'
        };
    }
  };

  const colors = getColorClasses();

  // Track click into partner profile (card click)
  const handleCardClick = () => {
    const slug = isDatabasePartner(partner) ? partner.slug : (partner as any).id;
    if (!slug) return;
    const partnerId = isDatabasePartner(partner) ? partner.id : null;
    const pageSource = typeof window !== "undefined" ? window.location.pathname : "unknown";
    void trackPartnerView(slug, "card_click", pageSource, partnerId);
  };

  // Get product-specific data - handle both data types
  const getProductFilter = () => {
    if (!productKey) return null;
    if (isDatabasePartner(partner)) {
      return partner.product_filters?.[productKey];
    }
    return partner.productFilters?.[productKey];
  };

  const productFilter = getProductFilter();
  
  // Get product-specific description
  const productDescription = productFilter?.productDescription || null;

  // Get product-specific landing page URL
  const productLandingPageUrl = (productFilter as { landingPageUrl?: string } | null | undefined)?.landingPageUrl?.trim() || null;
  
  // Get primary and secondary industries from productFilters if available
  const primaryIndustries = productFilter?.industries || (partner.industries || []).slice(0, 3);
  const secondaryIndustries = productFilter?.secondaryIndustries || [];
  const geography = productFilter?.geography || (isDatabasePartner(partner) ? (partner.geography?.[0] || 'Sverige') : partner.geography);

  // Derive applications from product_filters for database partners
  const getDisplayApplications = (): string[] => {
    if (isDatabasePartner(partner) && partner.product_filters) {
      const apps: string[] = [];
      if (partner.product_filters.bc) apps.push("Business Central");
      if (partner.product_filters.fsc) {
        apps.push("Finance");
        apps.push("Supply Chain Management");
      }
      if (partner.product_filters.sales) {
        apps.push("Sales");
        apps.push("Customer Insights (Marketing)");
      }
      if (partner.product_filters.service) {
        apps.push("Customer Service");
        apps.push("Field Service");
        apps.push("Contact Center");
      }
      // Add specialty products from applications array (explicitly selected)
      const specialtyProducts = ["Project Operations", "Commerce", "Human Resources"];
      specialtyProducts.forEach(product => {
        if (partner.applications?.includes(product)) {
          apps.push(product);
        }
      });
      // Remove duplicates
      return apps.length > 0 ? [...new Set(apps)] : (partner.applications || []);
    }
    return partner.applications || [];
  };

  const displayApplications = getDisplayApplications();

  const hasHighlights = highlightedProduct || highlightedIndustry || highlightedGeography;

  return (
    <article 
      className={`group relative flex flex-col h-full rounded-2xl overflow-hidden
        bg-gradient-to-br from-card/80 via-card/90 to-card/70
        border border-white/20 dark:border-white/10
        backdrop-blur-xl backdrop-saturate-150
        shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(255,255,255,0.1)]
        hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.15)]
        ${colors.glow}
        transform transition-all duration-500 ease-out
        hover:-translate-y-2 hover:border-white/30 dark:hover:border-white/20`}
    >
      {/* Glassmorphism inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      {/* Premium gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      {/* Animated shimmer overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      {/* Top accent bar with shimmer effect */}
      <div className="relative h-1.5 overflow-hidden">
        <div className={`absolute inset-0 ${colors.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" style={{ backgroundSize: '200% 100%' }} />
      </div>
      
      {/* Card Content */}
      <div className="relative flex flex-1 p-6 gap-4">
        {/* Logo column - separate on the left */}
        <div className="flex-shrink-0 relative">
          {isDatabasePartner(partner) && partner.logo_url ? (
            <img 
              src={partner.logo_url} 
              alt={`${partner.name} logotyp`}
              className={`w-[4.5rem] h-[4.5rem] object-contain rounded-lg p-2 border ${
                partner.logo_dark_bg 
                  ? 'bg-slate-700 border-slate-600 brightness-125 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]' 
                  : 'bg-white border-border/40'
              }`}
            />
          ) : (
            <div className="w-[4.5rem] h-[4.5rem] rounded-lg bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center shadow-inner">
              <Building2 className="w-8 h-8 text-muted-foreground/60" />
            </div>
          )}
          
          {/* Random order indicator */}
          {showRandomIndicator && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border shadow-sm flex items-center justify-center cursor-help hover:bg-muted transition-colors">
                    <Shuffle className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  sideOffset={8}
                  className="z-[100] text-xs max-w-[200px] bg-popover text-popover-foreground shadow-lg border"
                >
                  <p>Ordningen slumpas för rättvis exponering</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Content column - aligned with name */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Partner name */}
          <Link 
            to={profileUrl}
            onClick={handleCardClick}
            className="group/link mb-3"
          >
            <h3 className="text-lg font-bold text-foreground group-hover/link:text-primary transition-colors duration-300 leading-tight truncate">
              {partner.name || 'Partner'}
            </h3>
          </Link>

          {/* Highlighted search criteria */}
          {hasHighlights && (
            <div className="relative mb-4 p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/40 dark:to-slate-700/20 border border-slate-200 dark:border-slate-600/40">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Matchar din sökning</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {highlightedProduct && (
                  <Badge className="text-xs bg-slate-600 text-white border-slate-500 font-medium">
                    {highlightedProduct}
                  </Badge>
                )}
                {highlightedIndustry && (
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-700/50">
                    {highlightedIndustry}
                  </Badge>
                )}
                {highlightedCompanySize && (
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-700/50">
                    {highlightedCompanySize} anställda
                  </Badge>
                )}
                {highlightedRevenue && (
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-700/50">
                    {highlightedRevenue}
                  </Badge>
                )}
                {highlightedGeography && (
                  <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-700/50">
                    {highlightedGeography}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
            {partner.description}
          </p>
          
          {/* Product-specific description */}
          {productDescription && (
            <div className="mb-4 p-2.5 rounded-lg bg-muted/50 border-l-2 border-primary/40">
              <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-2">
                {productDescription}
              </p>
            </div>
          )}
          
          {/* Applications / Competencies */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Kompetenser
            </p>
            <div className="flex flex-wrap gap-1.5">
              {displayApplications.map((app, i) => {
                const appIcon = getApplicationIcon(app);
                return (
                  <Badge 
                    key={i} 
                    className="text-xs bg-accent text-accent-foreground border-0 font-medium shadow-sm hover:shadow-md hover:bg-accent/90 transition-all"
                  >
                    {appIcon && (
                      <img src={appIcon} alt="" className="w-4 h-4 mr-1.5" />
                    )}
                    {app}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Primary Industries - Branschfokus */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Branschfokus
            </p>
            <div className="flex flex-wrap gap-1.5">
              {primaryIndustries.map((industry, i) => (
                <Badge 
                  key={i} 
                  className="text-xs bg-primary text-primary-foreground border-0 font-medium shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Level Badge with hover tooltip */}
          {isDatabasePartner(partner) && (() => {
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
              <div className="mb-3">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold cursor-help ${aiLevel.color}`}
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {aiLevel.emoji} {aiLevel.label}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-xs z-[100]">
                      <p>{descriptions[aiLevel.level]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })()}


          <div className="mt-auto pt-3 space-y-2">
            {productLandingPageUrl && (
              <a
                href={productLandingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  trackPartnerClick(
                    partner.name || 'Partner',
                    productLandingPageUrl,
                    typeof window !== 'undefined' ? `${window.location.pathname}-landing-${productKey}` : `landing-${productKey}`,
                    { product: productKey }
                  );
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md border border-primary/40 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 hover:border-primary/60 transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                {productKey ? `Läs mer om ${productKeyToSwedish[productKey]} på ${partner.name || 'partnerns'} hemsida` : 'Besök landningssida'}
              </a>
            )}
            <Button 
              asChild 
              className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
            >
              <Link to={profileUrl} onClick={handleCardClick} className="flex items-center justify-center gap-2">
                <span className="relative z-10">Visa partnerprofil</span>
                <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                {/* Button shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PartnerCard;
