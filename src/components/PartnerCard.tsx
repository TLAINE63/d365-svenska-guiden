import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, CheckCircle2, Circle, Search } from "lucide-react";
import { Partner, getCumulativeGeographyDisplay } from "@/data/partners";

interface PartnerCardProps {
  partner: Partner;
  profileUrl: string;
  colorScheme?: 'primary' | 'crm' | 'amber';
  productKey?: 'bc' | 'fsc' | 'crm' | null;
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
          hover: 'hover:bg-crm/5',
          accent: 'from-crm via-accent to-crm',
          title: 'group-hover:text-crm',
          badge: 'bg-crm/10 text-crm',
          text: 'text-crm'
        };
      case 'amber':
        return {
          hover: 'hover:bg-amber-500/5',
          accent: 'from-amber-500 via-accent to-amber-500',
          title: 'group-hover:text-amber-600',
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          text: 'text-amber-600'
        };
      default:
        return {
          hover: 'hover:bg-accent/5',
          accent: 'from-primary via-accent to-primary',
          title: 'group-hover:text-primary',
          badge: 'bg-primary/10 text-primary',
          text: 'text-primary'
        };
    }
  };

  const colors = getColorClasses();

  // Get product-specific data
  const productFilter = productKey ? partner.productFilters?.[productKey] : null;
  
  // Get primary and secondary industries from productFilters if available
  const primaryIndustries = productFilter?.industries || partner.industries.slice(0, 2);
  const secondaryIndustries = productFilter?.secondaryIndustries || [];
  const geography = productFilter?.geography || partner.geography;

  return (
    <Card 
      className={`group relative border border-border/50 bg-card ${colors.hover} transition-all duration-300 flex flex-col shadow-md hover:shadow-xl transform hover:-translate-y-1`}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.accent} rounded-t-lg opacity-70 group-hover:opacity-100 transition-opacity`} />
      
      <CardHeader className="pb-2 pt-6">
        <Link 
          to={profileUrl}
          className="hover:text-primary transition-colors"
        >
          <CardTitle className={`text-xl sm:text-2xl text-center font-bold text-foreground ${colors.title} transition-colors leading-tight`}>
            {partner.name}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col pt-3">

        {/* Highlighted filters - Din sökning */}
        {(highlightedProduct || highlightedIndustry || highlightedCompanySize || highlightedGeography) && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/50">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-wide flex items-center gap-1">
              <Search className="w-3 h-3" />
              Din sökning
            </p>
            <div className="flex flex-wrap gap-1.5">
              {highlightedProduct && (
                <Badge className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600">
                  {highlightedProduct}
                </Badge>
              )}
              {highlightedIndustry && (
                <Badge variant="outline" className="text-xs border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300">
                  {highlightedIndustry}
                </Badge>
              )}
              {highlightedCompanySize && (
                <Badge variant="outline" className="text-xs border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300">
                  {highlightedCompanySize}
                </Badge>
              )}
              {highlightedGeography && (
                <Badge variant="outline" className="text-xs border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300">
                  {highlightedGeography}
                </Badge>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          {partner.description}
        </p>
        
        {/* Applications */}
        <div className={`bg-primary/5 rounded-lg p-3 border border-primary/10`}>
          <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Kompetenser inom:</p>
          <div className="flex flex-wrap gap-1.5">
            {partner.applications.map((app, i) => (
              <Badge key={i} variant="secondary" className={`text-xs ${colors.badge} border-0 font-medium`}>
                {app}
              </Badge>
            ))}
          </div>
        </div>

        {/* Primary Industries - Branschfokus */}
        <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
          <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Branschfokus</p>
          <div className="flex flex-wrap gap-1.5">
            {primaryIndustries.map((industry, i) => (
              <Badge 
                key={i} 
                className="text-xs bg-primary/15 text-primary border-0 font-medium"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        {/* Secondary Industries - Erfarenhet även inom */}
        {secondaryIndustries.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-3 border border-muted/50">
            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Erfarenhet även inom</p>
            <div className="flex flex-wrap gap-1.5">
              {secondaryIndustries.map((industry, i) => (
                <Badge 
                  key={i} 
                  variant="outline"
                  className="text-xs border-muted-foreground/30 text-muted-foreground bg-transparent"
                >
                  <Circle className="w-2.5 h-2.5 mr-1" />
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Geography */}
        <div className="bg-muted/20 rounded-lg p-3 border border-muted/30">
          <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Geografisk täckning</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4 text-primary/70" />
            <span>{getCumulativeGeographyDisplay(geography)}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50">
          <Button asChild variant="outline" className="w-full">
            <Link to={profileUrl}>
              Öppna partnerkortet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerCard;
