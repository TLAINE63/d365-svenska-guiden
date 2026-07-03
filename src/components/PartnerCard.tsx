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
  ExternalLink,
  ArrowLeftRight,
  Mail
} from "lucide-react";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import RelatedPartyBadge from "@/components/RelatedPartyBadge";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
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

import { displayApplicationName, getApplicationIcon, sortApplications, normalizeApplications } from "@/lib/applicationLabels";


// (AI labels and badge styles now come from aiScoring.ts)


const productKeyToSwedish: Record<string, string> = {
  bc: "Business Central",
  fsc: "F&SCM",
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
 // When true, show a single longer industry-pitch text block instead of the positioning statement
 showIndustryPitch?: boolean;
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
 showRandomIndicator = false,
 showIndustryPitch = false,
}: PartnerCardProps) => {
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { isSelected: isCompareSelected, toggle: toggleCompare } = usePartnerCompare();
  const compareSlug = isDatabasePartner(partner) ? partner.slug : null;
  const compareActive = compareSlug ? isCompareSelected(compareSlug) : false;
  
  // Get color classes based on scheme
 const getColorClasses = () => {
 switch (colorScheme) {
 case 'crm':
 return {
 gradient: 'from-crm/20 via-transparent to-crm/10',
 accent: 'bg-crm',
 accentHover: 'group-hover:bg-crm',
 badge: 'bg-crm/10 text-crm border-crm/20',
 glow: ''
 };
 case 'amber':
 return {
 gradient: 'from-amber-500/20 via-transparent to-amber-500/10',
 accent: 'bg-amber-500',
 accentHover: 'group-hover:bg-amber-500',
 badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
 glow: ''
 };
 default:
 return {
 gradient: 'from-primary/20 via-transparent to-primary/10',
 accent: 'bg-primary',
 accentHover: 'group-hover:bg-primary',
 badge: 'bg-primary/10 text-primary border-primary/20',
 glow: ''
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
 // Stash filter context in sessionStorage so URL stays clean
 if (typeof window !== "undefined") {
 const qIdx = profileUrl.indexOf("?");
 const qs = qIdx >= 0 ? profileUrl.slice(qIdx + 1) : "";
 try {
 if (qs) sessionStorage.setItem(`partner-context:${slug}`, qs);
 else sessionStorage.removeItem(`partner-context:${slug}`);
 } catch {}
 }
 };

 // Clean URL — query context is preserved via sessionStorage
 const cleanProfileUrl = profileUrl.split("?")[0];

 // Get product-specific data - handle both data types
 const getProductFilter = () => {
 if (!productKey) return null;
 if (isDatabasePartner(partner)) {
 return partner.product_filters?.[productKey];
 }
 return partner.productFilters?.[productKey];
 };

 const productFilter = getProductFilter();
 

 // Get product-specific landing page URL
 const productLandingPageUrl = (productFilter as { landingPageUrl?: string } | null | undefined)?.landingPageUrl?.trim() || null;
 
 // Get primary and secondary industries from productFilters if available
 const primaryIndustries = productFilter?.industries || (partner.industries || []).slice(0, 3);
 const secondaryIndustries = productFilter?.secondaryIndustries || [];
 const geography = productFilter?.geography || (isDatabasePartner(partner) ? (partner.geography?.[0] || 'Sverige') : partner.geography);

  // Public-facing application badges from the partner's explicit applications list.
  // Finance/SCM aliases are merged into a single F&SCM badge by normalizeApplications.
  const getDisplayApplications = (): string[] => {
    return sortApplications(normalizeApplications(partner.applications || []));
  };


 const displayApplications = getDisplayApplications();

 const hasHighlights = highlightedProduct || highlightedIndustry || highlightedGeography || highlightedCompanySize || highlightedRevenue;

 return (
 <article 
 className={`group relative flex flex-col h-full rounded overflow-hidden
 bg-gradient-to-br from-card/80 via-card/90 to-card/70
 border border-white/20 dark:border-white/10
 backdrop-saturate-150
 
 
 ${colors.glow}
 transform transition-all duration-500 ease-out
 hover:-translate-y-2 hover:border-white/30 dark:hover:border-white/20`}
 >
 {/* Glassmorphism inner glow */}
 <div className="absolute inset-0 rounded bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
 
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
 width="72"
 height="72"
 loading="lazy"
 decoding="async"
 className={`w-[4.5rem] h-[4.5rem] object-contain rounded-lg p-2 border ${
 partner.logo_dark_bg 
 ? 'bg-slate-700 border-slate-600 brightness-125 drop-' 
 : 'bg-white border-border/40'
 }`}
 />
 ) : (
 <div className="w-[4.5rem] h-[4.5rem] rounded-lg bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center ">
 <Building2 className="w-8 h-8 text-muted-foreground/60" />
 </div>
 )}
 
 {/* Random order indicator */}
 {showRandomIndicator && (
 <TooltipProvider delayDuration={100}>
 <Tooltip>
 <TooltipTrigger asChild>
 <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded bg-background border border-border flex items-center justify-center cursor-help hover:bg-muted transition-colors">
 <Shuffle className="w-3 h-3 text-muted-foreground" />
 </div>
 </TooltipTrigger>
 <TooltipContent 
 side="right" 
 sideOffset={8}
 className="z-[100] text-xs max-w-[200px] bg-popover text-popover-foreground border"
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
 to={cleanProfileUrl}
 onClick={handleCardClick}
 className="group/link mb-3"
 >
 <h3 className="text-lg font-bold text-foreground group-hover/link:text-primary transition-colors duration-300 leading-tight truncate">
 {partner.name || 'Partner'}
 </h3>
 </Link>
 {isDatabasePartner(partner) && (partner as any).related_party && (
 <div className="mb-2 -mt-1">
 <RelatedPartyBadge />
 </div>
 )}

 {/* Highlighted search criteria */}
 {hasHighlights && (
 <div className="relative mb-4 p-3 rounded bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/40 dark:to-slate-700/20 border border-slate-200 dark:border-slate-600/40">
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
 {highlightedGeography && (
 <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-700/50">
 {getCumulativeGeographyDisplay(highlightedGeography)}
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
 </div>
 </div>
 )}

    {/* Positioning statement — gives the partner more text space */}
    {isDatabasePartner(partner) && partner.positioning_statement && (
      <div className="mb-3 p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
        <p className="text-[13px] font-medium text-foreground leading-snug line-clamp-5">
          {partner.positioning_statement}
        </p>
      </div>
    )}
 
       {/* Product competence badges */}
       {displayApplications.length > 0 && (
         <div className="mb-3">
           <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
             <span className="w-1 h-1 rounded bg-primary" />
             Kompetenser
           </p>
           <div className="flex flex-wrap gap-1.5">
             {displayApplications.map((app, i) => {
               const appIcon = getApplicationIcon(app);
               return (
                 <Badge 
                   key={i} 
                   className="text-xs bg-accent text-accent-foreground border-0 font-medium hover:bg-accent/90 transition-all"
                 >
                   {appIcon && (
                     <img src={appIcon} alt="" aria-hidden="true" width="16" height="16" loading="lazy" decoding="async" className="w-4 h-4 mr-1.5" />
                   )}
                   {displayApplicationName(app)}
                 </Badge>
               );
             })}
           </div>
         </div>
       )}


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
 className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold transition-all duration-300 group/btn"
 >
  <Link to={cleanProfileUrl} onClick={handleCardClick} className="flex items-center justify-center gap-1.5 whitespace-nowrap px-2">
  <span className="relative z-10">Visa partnerprofil</span>
  <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 shrink-0" />
 {/* Button shimmer effect */}
 <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
 </Link>
 </Button>
 {compareSlug && (
  <button
   type="button"
   onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setContactOpen(true);
   }}
   className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold border bg-[hsl(var(--cta-orange))] text-white border-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 transition-all"
  >
   <Mail className="h-4 w-4" />
   Få kontakt
  </button>
 )}
 {compareSlug && (
  <button
   type="button"
   onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare({ slug: compareSlug, name: partner.name || 'Partner' });
   }}
   aria-pressed={compareActive}
   className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border transition-all ${
    compareActive
     ? 'bg-[hsl(var(--cta-orange))] text-white border-[hsl(var(--cta-orange))]'
     : 'bg-transparent text-foreground border-border hover:border-[hsl(var(--cta-orange))] hover:text-[hsl(var(--cta-orange))]'
   }`}
  >
   <ArrowLeftRight className="h-3.5 w-3.5" />
   {compareActive ? 'Vald för jämförelse' : 'Jämför partners (välj upp till 3)'}
  </button>
 )}
 </div>
 </div>
 </div>
 {compareSlug && (
  <PartnerRequestDialog
   open={contactOpen}
   onOpenChange={setContactOpen}
   partnerSlug={compareSlug}
   partnerName={partner.name || 'Partner'}
   selectedProduct={highlightedProduct || (productKey ? productKeyToSwedish[productKey] : undefined)}
   industry={highlightedIndustry}
   geography={highlightedGeography}
   companySize={highlightedCompanySize}
   revenue={highlightedRevenue}
   mode="contact"
  />
 )}
 </article>
 );
};

export default PartnerCard;
