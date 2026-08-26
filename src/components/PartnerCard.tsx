import { useEffect, useMemo, useState } from "react";
import { trackPartnerImpression, trackPartnerEvent } from "@/utils/trackPartnerEvent";
import { swedishPossessive } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
 ArrowRight, 
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
import VerifiedPartnerBadge from "@/components/VerifiedPartnerBadge";

import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import {
 Tooltip,
 TooltipContent,
 TooltipProvider,
 TooltipTrigger,
} from "@/components/ui/tooltip";
import { Partner } from "@/data/partners";
import { DatabasePartner, type ProductFilterInput, type ProductFilters } from "@/hooks/usePartners";

import { trackPartnerView } from "@/utils/trackPartnerView";
import { trackPartnerClick } from "@/utils/trackPartnerClick";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

import { displayApplicationName, getApplicationIcon, sortApplications, normalizeApplications } from "@/lib/applicationLabels";
import PartnerCardSummary from "@/components/partner/PartnerCardSummary";
import ShortlistButton from "@/components/ShortlistButton";

import {
  getResultAssessment,
  getDocumentedEvidence,
} from "@/lib/partnerResultCard";
import {
  COMPETENCY_AREAS,
  LEVEL_META,
  normalizeCompetencies,
  hasAnyCompetency,
} from "@/lib/extendedCompetencies";



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

const smallSizeBuckets = ["1-49", "50-99", "100-249"];
const largeSizeBuckets = ["1.000-4.999", ">5.000"];

function getPartnerIndicators(
 partner: PartnerData,
 productKey?: string | null,
 highlightedIndustry?: string | null,
) {
 const indicators: { icon: string; label: string; tooltip: string }[] = [];

 const isDb = isDatabasePartner(partner);

 // Determine which product filter to derive size/geography from when possible
 let productFilter: ProductFilterInput | undefined = undefined;
 if (isDb && productKey) {
  productFilter = partner.product_filters?.[productKey];
 }

 // If no product key but a highlighted industry is provided, prefer a filter
 // that explicitly targets that industry so the indicator matches the context.
 if (!productFilter && isDb && highlightedIndustry) {
  const filters = partner.product_filters || {};
  for (const key of Object.keys(filters)) {
   const pf = filters[key as keyof ProductFilters];
   if (pf?.industries?.includes(highlightedIndustry)) {
    productFilter = pf;
    break;
   }
  }
 }

 // Fallback to any populated product filter
 if (!productFilter && isDb) {
  const filters = partner.product_filters || {};
  productFilter = Object.values(filters).find(
   (pf): pf is ProductFilterInput => !!pf && (pf.industries?.length > 0 || pf.companySize?.length > 0)
  );
 }

 const industries = productFilter?.industries?.length
   ? productFilter.industries
   : (partner.industries || []);

 const companySize = (productFilter?.companySize || []) as string[];

 let geography: string[] = [];
 if (productFilter?.geography?.length) {
  geography = productFilter.geography;
 } else if (isDb) {
  geography = partner.geography || [];
 } else {
  geography = partner.geography ? [partner.geography] : [];
 }

 const deliveryProfile = isDb ? partner.delivery_profile : null;

 // Industry specialist / specific industry focus
 const displayedIndustry =
  highlightedIndustry && industries.includes(highlightedIndustry)
   ? highlightedIndustry
   : industries[0];

 if (industries.length === 1) {
  const industry = displayedIndustry;
  if (industry === "Transport & Logistik") {
   indicators.push({ icon: "🚚", label: "Logistikexpert", tooltip: "Specialist på transport & logistik" });
  } else if (industry === "Tillverkningsindustri") {
   indicators.push({ icon: "🏭", label: "Tillverkningsexpert", tooltip: "Specialist på tillverkningsindustri" });
  } else if (industry === "Retail & E-handel") {
   indicators.push({ icon: "🛒", label: "Retail-specialist", tooltip: "Specialist på retail & e-handel" });
  } else if (industry === "Bygg, Entreprenad & Installation") {
   indicators.push({ icon: "🏗️", label: "Byggspecialist", tooltip: "Specialist på bygg, entreprenad & installation" });
  } else if (industry === "Livsmedel & Processindustri") {
   indicators.push({ icon: "🍽️", label: "Livsmedelsexpert", tooltip: "Specialist på livsmedel & processindustri" });
  } else {
   indicators.push({ icon: "🏭", label: "Branschspecialist", tooltip: `Djup branschkunskap inom ${industry}` });
  }
 } else if (highlightedIndustry && industries.includes(highlightedIndustry)) {
  // Show a contextual specialist badge even if the partner has other industries
  if (highlightedIndustry === "Transport & Logistik") {
   indicators.push({ icon: "🚚", label: "Logistikexpert", tooltip: "Har tydlig kompetens inom transport & logistik" });
  } else if (highlightedIndustry === "Tillverkningsindustri") {
   indicators.push({ icon: "🏭", label: "Tillverkningsexpert", tooltip: "Har tydlig kompetens inom tillverkningsindustri" });
  } else if (highlightedIndustry === "Retail & E-handel") {
   indicators.push({ icon: "🛒", label: "Retail-specialist", tooltip: "Har tydlig kompetens inom retail & e-handel" });
  } else if (highlightedIndustry === "Bygg, Entreprenad & Installation") {
   indicators.push({ icon: "🏗️", label: "Byggspecialist", tooltip: "Har tydlig kompetens inom bygg, entreprenad & installation" });
  } else if (highlightedIndustry === "Livsmedel & Processindustri") {
   indicators.push({ icon: "🍽️", label: "Livsmedelsexpert", tooltip: "Har tydlig kompetens inom livsmedel & processindustri" });
  } else {
   indicators.push({ icon: "🏭", label: "Branschspecialist", tooltip: `Har kompetens inom ${highlightedIndustry}` });
  }
 } else if (industries.length > 1 && industries.length <= 3) {
  indicators.push({ icon: "🏭", label: "Branschspecialist", tooltip: "Tydlig branschfokus" });
 }


 // SMB focus
 const hasSmall = companySize.some(s => smallSizeBuckets.includes(s));
 const hasLarge = companySize.some(s => largeSizeBuckets.includes(s));
 if (hasSmall && !hasLarge) {
  indicators.push({ icon: "💼", label: "SMB-fokus", tooltip: "Fokuserat på små och medelstora företag" });
 } else if (hasSmall && hasLarge) {
  indicators.push({ icon: "💼", label: "Alla storlekar", tooltip: "Arbetar med både SMB och stora företag" });
 }

 // Geography
 const geoSet = new Set(geography);
 if (geoSet.has("Globalt") || geoSet.has("Europa")) {
  indicators.push({ icon: "🌍", label: "Norden +", tooltip: "Verksam i Norden och internationellt" });
 } else if (geoSet.has("Norden")) {
  indicators.push({ icon: "🌍", label: "Norden", tooltip: "Verksam i Sverige och Norden" });
 }

 // Fast implementation
 const maxWeeks = deliveryProfile?.bc_project_weeks_max;
 const methodology = deliveryProfile?.methodology || "";
 if (maxWeeks && maxWeeks <= 16) {
  indicators.push({ icon: "⚡", label: "Snabb implementation", tooltip: `Typisk implementation upp till ${maxWeeks} veckor` });
 } else if (methodology.toLowerCase().includes("agil") || methodology.toLowerCase().includes("rapid") || methodology.toLowerCase().includes("iterativ")) {
  indicators.push({ icon: "⚡", label: "Agil leverans", tooltip: "Agil implementeringsmetodik" });
 }

 return indicators.slice(0, 5);
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
 // When true, show only the positioning statement as a "Passar bäst för" block (product pages)
 showBestFitOnly?: boolean;
 /**
  * Sökresultatsläge: filterkriterierna visas en gång ovanför listan, kortet fokuserar
  * på d365.se:s bedömning, "Särskilt relevant för" och dokumenterad erfarenhet.
  */
 resultView?: boolean;
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
 showBestFitOnly = false,
 resultView = false,
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

 const indicators = useMemo(() => getPartnerIndicators(partner, productKey, highlightedIndustry || null), [partner, productKey, highlightedIndustry]);

  const assessment = useMemo(() => (resultView ? getResultAssessment(partner) : null), [resultView, partner]);
 const evidence = useMemo(
  () =>
   resultView
    ? getDocumentedEvidence(partner, { productKey, focusIndustry: highlightedIndustry || null })
    : null,
  [resultView, partner, productKey, highlightedIndustry],
 );

	const resultMeta = useMemo(() => {
		if (!resultView || !isDatabasePartner(partner)) return null;
		const allFilters = Object.values(partner.product_filters || {}).filter(Boolean) as ProductFilterInput[];
		const pf = productKey ? partner.product_filters?.[productKey] : undefined;
		const offices = (partner.office_cities || []) as string[];

		const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

		let industries = (pf?.industries?.length ? pf.industries : []) as string[];
		if (!industries.length) industries = uniq((partner.industries || []) as string[]);
		if (!industries.length) industries = uniq(allFilters.flatMap((f) => (f.industries || []) as string[]));
		if (!industries.length) industries = uniq((partner.secondary_industries || []) as string[]);

		let sizes = (pf?.companySize || []) as string[];
		if (!sizes.length) sizes = uniq(allFilters.flatMap((f) => (f.companySize || []) as string[]));
		// Ingen fallback till interna storlekssignaler – raden döljs hellre än gissar.


		return { offices, industries, sizes };
	}, [resultView, partner, productKey]);






 // Nivå 1 – exponering: partnern visas i lista eller filtrerat sökresultat.
 useEffect(() => {
  const slug = isDatabasePartner(partner) ? partner.slug : (partner as any).id;
  if (!slug) return;
  const filtered = Boolean(productKey || highlightedIndustry || resultView);
  trackPartnerImpression(
   filtered ? "partner_filter_impression" : "partner_list_impression",
   [{ slug, id: isDatabasePartner(partner) ? partner.id : null }],
   { product: productKey ?? null, industry: highlightedIndustry ?? null },
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [partner, productKey, highlightedIndustry, resultView]);


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

 // Clean URL – query context is preserved via sessionStorage
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

  // Public-facing application badges from all registered product competencies:
  // product_filters keys plus the explicit applications list.
  const getDisplayApplications = (): string[] => {
    const apps: string[] = [];
    if (isDatabasePartner(partner)) {
      const pf = partner.product_filters || {};
      const map: Record<string, string> = {
        bc: "Business Central",
        fsc: "Finance & Supply Chain Management",
        sales: "Sales",
        service: "Customer Service",
        crm: "Sales",
      };
      for (const [key, filter] of Object.entries(pf)) {
        if (filter && map[key]) apps.push(map[key]);
      }
    }
    for (const app of partner.applications || []) {
      apps.push(displayApplicationName(app));
    }
    return sortApplications(normalizeApplications(apps));
  };

  const displayApplications = getDisplayApplications();


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
  <Link
   to={cleanProfileUrl}
   onClick={handleCardClick}
   className="block rounded-lg hover:opacity-80 transition-opacity"
   title={`Visa ${partner.name || "partner"}s profil`}
  >
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
  </Link>
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
 <h3 className="text-lg font-bold text-foreground group-hover/link:text-primary transition-colors duration-300 leading-tight break-words hyphens-auto">
 {partner.name || 'Partner'}
 </h3>
 </Link>
  <div className="flex flex-wrap items-center gap-1.5 mb-2 -mt-1">
   {(!isDatabasePartner(partner) || partner.is_featured !== false) && <VerifiedPartnerBadge />}
   {isDatabasePartner(partner) && (partner as any).related_party && <RelatedPartyBadge />}
  </div>

  {!resultView && isDatabasePartner(partner) && partner.is_featured !== false && (() => {
   const comp = normalizeCompetencies((partner as any).extended_competencies);
   if (!hasAnyCompetency(comp)) return null;
   return (
    <TooltipProvider delayDuration={100}>
     <div className="flex flex-wrap gap-1 mb-2.5">
      {COMPETENCY_AREAS.map((area) => {
       const lvl = comp[area.key];
       if (!lvl) return null;
       const meta = LEVEL_META[lvl];
       return (
        <Tooltip key={area.key}>
         <TooltipTrigger asChild>
          <span
           className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-semibold leading-none ${meta.className}`}
          >
           <span className={`w-1 h-1 rounded-full ${meta.dot}`} aria-hidden="true" />
           {area.shortLabel}: {meta.shortLabel}
          </span>
         </TooltipTrigger>
         <TooltipContent side="top" sideOffset={6} className="z-[100] text-xs max-w-[240px] bg-popover text-popover-foreground border">
          <p className="font-semibold">{area.label}</p>
          <p className="mt-0.5">{meta.label}. {meta.description}</p>
         </TooltipContent>
        </Tooltip>
       );
      })}
     </div>
    </TooltipProvider>
   );
  })()}



  {resultView ? (
   <>
    {assessment && (
     <div className="mb-3 rounded-md border-l-2 border-primary bg-primary/5 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
       d365.se:s bedömning
      </p>
      <p className="text-[13px] leading-relaxed text-foreground line-clamp-8 min-h-[7.5rem]">{assessment}</p>
     </div>

    )}


    {resultMeta && (
     <div className="mb-3 space-y-1.5">
      {resultMeta.offices.length > 0 && (
       <p className="text-[12px] leading-snug text-muted-foreground">
        <span className="font-semibold text-foreground/80">Kontor: </span>
        {resultMeta.offices.slice(0, 4).join(", ")}
        {resultMeta.offices.length > 4 ? ` +${resultMeta.offices.length - 4}` : ""}
       </p>
      )}
      {!highlightedIndustry && resultMeta.industries.length > 0 && (
       <p className="text-[12px] leading-snug text-muted-foreground">
        <span className="font-semibold text-foreground/80">Fokusbranscher: </span>
        {resultMeta.industries.slice(0, 4).join(", ")}
        {resultMeta.industries.length > 4 ? ` +${resultMeta.industries.length - 4}` : ""}
       </p>
      )}
      {!highlightedCompanySize && resultMeta.sizes.length > 0 && (
       <p className="text-[12px] leading-snug text-muted-foreground">
        <span className="font-semibold text-foreground/80">Passande kundstorlek: </span>
        {resultMeta.sizes.join(", ")} anställda
       </p>
      )}
     </div>
    )}
  </>

 ) : (
  <>
 {/* Matchar din sökning – visas när användaren har aktiva filter */}
 {(highlightedProduct || highlightedIndustry || highlightedGeography || highlightedCompanySize) && (
  <div className="mb-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
   <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5 flex items-center gap-1.5">
    <span aria-hidden="true">✨</span> Matchar din sökning
   </p>
   <div className="flex flex-wrap gap-1.5">
    {highlightedProduct && (
     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-background border border-border text-foreground/80">
      {highlightedProduct}
     </span>
    )}
    {highlightedIndustry && (
     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-background border border-border text-foreground/80">
      {highlightedIndustry}
     </span>
    )}
    {highlightedGeography && (
     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-background border border-border text-foreground/80">
      {highlightedGeography}
     </span>
    )}
    {highlightedCompanySize && (
     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-background border border-border text-foreground/80">
      {highlightedCompanySize} anställda
     </span>
    )}
   </div>
  </div>
 )}


 {indicators.length > 0 && (
  <TooltipProvider delayDuration={100}>
   <div className="flex flex-wrap gap-1.5 mb-3">
    {indicators.map((indicator, idx) => (
     <Tooltip key={idx}>
      <TooltipTrigger asChild>
       <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 cursor-help hover:bg-accent/15 transition-colors">
        <span className="text-xs leading-none">{indicator.icon}</span>
        <span>{indicator.label}</span>
       </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="z-[100] text-xs max-w-[220px] bg-popover text-popover-foreground border">
       <p>{indicator.tooltip}</p>
      </TooltipContent>
     </Tooltip>
    ))}
   </div>
  </TooltipProvider>
 )}



    <PartnerCardSummary
      partner={partner}
      highlightedIndustry={highlightedIndustry || null}
    />
 
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
  </>
 )}



 <div className="mt-auto pt-3 space-y-2">
 {!resultView && productLandingPageUrl && (
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
 {productKey ? `Läs mer om ${productKeyToSwedish[productKey]} på ${partner.name ? swedishPossessive(partner.name) : 'partnerns'} hemsida` : 'Besök landningssida'}
 </a>
 )}
 <Button 
 asChild 
 className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold transition-all duration-300 group/btn"
 >
  <Link to={cleanProfileUrl} onClick={handleCardClick} className="flex items-center justify-center gap-1.5 whitespace-nowrap px-2">
  <span className="relative z-10">{resultView ? 'Se partnerprofil' : 'Visa partnerprofil'}</span>
  <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 shrink-0" />
 {/* Button shimmer effect */}
 <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
 </Link>
 </Button>
 {resultView ? (
  compareSlug && (
   <div className="flex items-center gap-2">
    <button
     type="button"
     onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCompare({ slug: compareSlug, name: partner.name || 'Partner' });
     }}
     aria-pressed={compareActive}
     className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium border transition-all ${
      compareActive
       ? 'border-[hsl(var(--cta-orange))] text-[hsl(var(--cta-orange))] bg-[hsl(var(--cta-orange))]/10'
       : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
     }`}
    >
     <ArrowLeftRight className="h-3.5 w-3.5" />
     {compareActive ? 'Vald' : 'Jämför'}
    </button>
    <button
     type="button"
     onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      setContactOpen(true);
     }}
     className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium border border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
    >
     <Mail className="h-3.5 w-3.5" />
     Få kontakt
    </button>
   </div>
  )
 ) : (
  <>
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
  {compareSlug && (
   <ShortlistButton
    className="mt-2"
    entry={{ slug: compareSlug, name: partner.name || 'Partner', url: cleanProfileUrl, verified: true }}
   />
  )}

  </>
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
