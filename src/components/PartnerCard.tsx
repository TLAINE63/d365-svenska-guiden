import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, CheckCircle2, Sparkles, Building2, MapPin } from "lucide-react";
import { Partner, getCumulativeGeographyDisplay } from "@/data/partners";
import { DatabasePartner } from "@/hooks/usePartners";

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
  highlightedGeography?: string;
}

const PartnerCard = ({ 
  partner, 
  profileUrl, 
  colorScheme = 'primary',
  productKey,
  highlightedProduct,
  highlightedIndustry,
  highlightedCompanySize,
  highlightedGeography
}: PartnerCardProps) => {
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

  // Get product-specific data - handle both data types
  const getProductFilter = () => {
    if (!productKey) return null;
    if (isDatabasePartner(partner)) {
      return partner.product_filters?.[productKey];
    }
    return partner.productFilters?.[productKey];
  };

  const productFilter = getProductFilter();
  
  // Get primary and secondary industries from productFilters if available
  const primaryIndustries = productFilter?.industries || (partner.industries || []).slice(0, 2);
  const secondaryIndustries = productFilter?.secondaryIndustries || [];
  const geography = productFilter?.geography || (isDatabasePartner(partner) ? (partner.geography?.[0] || 'Sverige') : partner.geography);

  const hasHighlights = highlightedProduct || highlightedIndustry || highlightedCompanySize || highlightedGeography;

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
      <div className="relative flex flex-col flex-1 p-6">
        {/* Header with logo and name on same row */}
        <div className="flex items-center gap-3 mb-5">
          {isDatabasePartner(partner) && partner.logo_url ? (
            <img 
              src={partner.logo_url} 
              alt={`${partner.name} logotyp`}
              className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-border/40 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center flex-shrink-0 shadow-inner">
              <Building2 className="w-5 h-5 text-muted-foreground/60" />
            </div>
          )}
          <Link 
            to={profileUrl}
            className="group/link flex-1 min-w-0"
          >
            <h3 className="text-lg font-bold text-foreground group-hover/link:text-primary transition-colors duration-300 leading-tight truncate">
              {partner.name || 'Partner'}
            </h3>
          </Link>
        </div>

        {/* Highlighted search criteria */}
        {hasHighlights && (
          <div className="relative mb-5 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200/50 dark:border-amber-700/30">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Matchar din sökning</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {highlightedProduct && (
                <Badge className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300/50 dark:border-amber-600/50 font-medium">
                  {highlightedProduct}
                </Badge>
              )}
              {highlightedIndustry && (
                <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-transparent">
                  {highlightedIndustry}
                </Badge>
              )}
              {highlightedCompanySize && (
                <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-transparent">
                  {highlightedCompanySize}
                </Badge>
              )}
              {highlightedGeography && (
                <Badge variant="outline" className="text-xs border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-transparent">
                  {highlightedGeography}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          {partner.description}
        </p>
        
        {/* Applications / Competencies */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Kompetenser
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(partner.applications || []).map((app, i) => (
              <Badge 
                key={i} 
                className="text-xs bg-primary text-primary-foreground border-0 font-medium shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
              >
                {app}
              </Badge>
            ))}
          </div>
        </div>

        {/* Primary Industries - Branschfokus */}
        <div className="mb-4">
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

        {/* Secondary Industries */}
        {secondaryIndustries.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-500" />
              Erfarenhet även inom
            </p>
            <div className="flex flex-wrap gap-1.5">
              {secondaryIndustries.map((industry, i) => (
                <Badge 
                  key={i} 
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-white border-0 font-medium"
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button with shimmer */}
        <div className="mt-auto pt-4">
          <Button 
            asChild 
            className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
          >
            <Link to={profileUrl} className="flex items-center justify-center gap-2">
              <span className="relative z-10">Visa partnerprofil</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

export default PartnerCard;
