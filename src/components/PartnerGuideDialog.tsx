import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle, Building2, Search, Shuffle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LeadCTA from "@/components/LeadCTA";
import { Partner } from "@/data/partners";
import { DatabasePartner } from "@/hooks/usePartners";

// Union type to support both static and database partners
type PartnerData = Partner | DatabasePartner;

// Type guard to check if it's a DatabasePartner
function isDatabasePartner(partner: PartnerData): partner is DatabasePartner {
  return 'product_filters' in partner && 'slug' in partner;
}

interface PartnerGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partners: PartnerData[];
}

const applicationOptions = [
  "Business Central",
  "Finance & SCM",
  "Sales",
  "Customer Insights (Marketing)",
  "Customer Service",
  "Field Service",
  "Contact Center",
  "Project Operations",
  "Commerce",
  "Human Resources"
];

const industryOptions = [
  "Tillverkningsindustri",
  "Livsmedel & Processindustri",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Konsulttjänster",
  "Bygg & Entreprenad",
  "Fastighet & Förvaltning",
  "Energi & Utilities",
  "Finans & Försäkring",
  "Life Science / Medtech",
  "Telekom & IT-tjänster",
  "Logistik & Transport",
  "Media & Publishing",
  "Jordbruk & Skogsbruk",
  "Hälsa- & sjukvård",
  "Non-profit / Organisationer",
  "Utbildning",
  "Offentlig sektor",
  "Uthyrningsverksamhet",
];

const marketOptions = [
  { value: "Sverige", label: "Sverige" },
  { value: "Norden", label: "Norden" },
  { value: "Europa", label: "Europa" },
  { value: "Övriga världen", label: "Övriga världen" }
];

const sizeOptions = [
  { value: "1-49", label: "1-49 anställda" },
  { value: "50-99", label: "50-99 anställda" },
  { value: "100-249", label: "100-249 anställda" },
  { value: "250-999", label: "250-999 anställda" },
  { value: "1.000-4.999", label: "1.000-4.999 anställda" },
  { value: ">5.000", label: "Mer än 5.000 anställda" }
];

// Product key type matching database structure
type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

// Helper to match product filter for database partners
const matchesDbProductFilter = (
  partner: DatabasePartner, 
  productKey: ProductKey,
  industry?: string,
  companySize?: string,
  geography?: string
): boolean => {
  const productFilter = partner.product_filters?.[productKey];
  if (!productFilter) return false;
  
  if (industry && !productFilter.industries?.includes(industry)) {
    return false;
  }
  
  if (companySize && productFilter.companySize && !productFilter.companySize.includes(companySize)) {
    return false;
  }
  
  if (geography) {
    // Geography is now an array - check if partner covers the selected geography
    const partnerGeo = Array.isArray(productFilter.geography) ? productFilter.geography : (productFilter.geography ? [productFilter.geography] : ["Sverige"]);
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
    const selectedGeoIndex = geographyHierarchy.indexOf(geography);
    const maxPartnerGeoIndex = Math.max(...partnerGeo.map(g => geographyHierarchy.indexOf(g)));
    if (maxPartnerGeoIndex < selectedGeoIndex) {
      return false;
    }
  }
  
  return true;
};

const getDbProductRanking = (partner: DatabasePartner, productKey: ProductKey): number => {
  return partner.product_filters?.[productKey]?.ranking ?? 999;
};

const PartnerGuideDialog = ({ open, onOpenChange, partners }: PartnerGuideDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [suggestedPartners, setSuggestedPartners] = useState<PartnerData[]>([]);

  const totalSteps = 4;

  // Determine product key from selected application - matches database structure
  const getProductKey = (app: string): ProductKey | null => {
    if (app === "Business Central") return 'bc';
    if (app === "Finance & SCM") return 'fsc';
    // Sales-related products
    if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
    // Service-related products  
    if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
    // Standalone products - check both bc and fsc as they're typically bundled
    if (["Project Operations", "Commerce", "Human Resources"].includes(app)) return 'fsc';
    return null;
  };

  // Session-stable seeded shuffle for fair partner exposure
  const seededShuffle = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    let currentSeed = seed;
    
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const findBestPartners = () => {
    const productKey = getProductKey(selectedApp);
    
    if (!productKey) {
      setSuggestedPartners([]);
      setStep(5);
      return;
    }

    // Filter partners using the same logic as the rest of the site
    // Note: Company size is collected for information but not used for filtering
    const matchingPartners = partners.filter(partner => {
      if (isDatabasePartner(partner)) {
        return matchesDbProductFilter(
          partner,
          productKey,
          selectedIndustry || undefined,
          undefined, // Company size not used for filtering
          selectedMarket || undefined
        );
      }
      // For static partners, use simple check
      return partner.productFilters?.[productKey];
    });

    // Shuffle randomly with session-stable seed for fair exposure
    const sessionSeed = Math.floor(Date.now() / (1000 * 60 * 60)); // Changes every hour
    const shuffledPartners = seededShuffle(matchingPartners, sessionSeed);

    // Show all matching partners
    setSuggestedPartners(shuffledPartners);
    setStep(5);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      findBestPartners();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedApp("");
    setSelectedIndustry("");
    setSelectedMarket("");
    setSelectedSize("");
    setSuggestedPartners([]);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedApp !== "";
      case 2: return selectedIndustry !== "";
      case 3: return selectedMarket !== "";
      case 4: return selectedSize !== "";
      default: return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {step <= totalSteps ? `Steg ${step} av ${totalSteps}` : "Partnerförslag"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vilken applikation är du intresserad av?</h3>
            <p className="text-sm text-muted-foreground">Välj en</p>
            <RadioGroup value={selectedApp} onValueChange={setSelectedApp}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {applicationOptions.map(app => (
                  <div
                    key={app}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedApp === app
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <RadioGroupItem value={app} id={`app-${app}`} />
                    <Label htmlFor={`app-${app}`} className="cursor-pointer text-sm">{app}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vilken bransch tillhör du?</h3>
            <p className="text-sm text-muted-foreground">Välj en</p>
            <RadioGroup value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {industryOptions.map(industry => (
                  <div
                    key={industry}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedIndustry === industry
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedIndustry(industry)}
                  >
                    <RadioGroupItem value={industry} id={`industry-${industry}`} />
                    <Label htmlFor={`industry-${industry}`} className="cursor-pointer text-sm">{industry}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vilken marknad gäller det?</h3>
            <RadioGroup value={selectedMarket} onValueChange={setSelectedMarket}>
              <div className="space-y-3">
                {marketOptions.map(option => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMarket === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedMarket(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Storlek på er verksamhet?</h3>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <div className="space-y-3">
                {sizeOptions.map(option => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedSize === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSize(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">
                {suggestedPartners.length > 0 
                  ? "Baserat på dina val skulle följande partners kunna passa er verksamhet:"
                  : "Inga partners hittades för dina sökkriterier"}
              </h3>
            </div>
            
            {suggestedPartners.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Just nu finns inga partners som matchar alla dina valda kriterier. 
                  Prova att börja om och justera dina val, eller kontakta oss direkt så hjälper vi dig.
                </p>
                <Button variant="outline" onClick={handleReset} className="mt-2">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Börja om med nya val
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedPartners.map((partner, index) => {
                  const partnerSlug = isDatabasePartner(partner) 
                    ? partner.slug 
                    : (partner.name || '').toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  const profileUrl = `/partner/${partnerSlug}${selectedApp ? `?product=${encodeURIComponent(selectedApp)}` : ""}${selectedIndustry ? `${selectedApp ? "&" : "?"}industry=${encodeURIComponent(selectedIndustry)}` : ""}`;
                  
                  return (
                    <Card 
                      key={index} 
                      className="group relative overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card via-card to-muted/20"
                    >
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Logo */}
                          <div className="flex-shrink-0">
                            {isDatabasePartner(partner) && partner.logo_url ? (
                              <img 
                                src={partner.logo_url} 
                                alt={`${partner.name} logotyp`}
                                className={`w-12 h-12 object-contain rounded-lg p-1.5 border ${
                                  partner.logo_dark_bg 
                                    ? 'bg-slate-700 border-slate-600 brightness-125' 
                                    : 'bg-white border-border/40'
                                }`}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-muted/80 to-muted flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-muted-foreground/60" />
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Link 
                                to={profileUrl} 
                                onClick={() => onOpenChange(false)}
                                className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                              >
                                {partner.name || 'Partner'}
                              </Link>
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center cursor-help">
                                      <Shuffle className="w-2.5 h-2.5 text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p>Ordningen slumpas för rättvis exponering</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{partner.description}</p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {(partner.applications || []).slice(0, 4).map((app, i) => (
                                <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                                  {app}
                                </Badge>
                              ))}
                              {(partner.applications || []).length > 4 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                                  +{(partner.applications || []).length - 4}
                                </Badge>
                              )}
                            </div>
                            
                            <Button asChild size="sm" className="w-full sm:w-auto">
                              <Link to={profileUrl} onClick={() => onOpenChange(false)}>
                                Visa partnerprofil
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {suggestedPartners.length > 0 && (
              <LeadCTA
                sourcePage="partner-guide-dialog"
                selectedProducts={selectedApp ? [selectedApp] : []}
                selectedIndustry={selectedIndustry}
                selectedCompanySize={sizeOptions.find(o => o.value === selectedSize)?.label}
                title="Låt oss hjälpa dig vidare"
                description="Lämna dina uppgifter så hjälper vi dig att komma i kontakt med rätt partner och kontaktperson."
              />
            )}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          {step > 1 && step <= totalSteps ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka
            </Button>
          ) : step === 5 ? (
            <Button variant="outline" onClick={handleReset}>
              Börja om
            </Button>
          ) : (
            <div />
          )}
          
          {step <= totalSteps && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === totalSteps ? "Visa förslag" : "Nästa"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {step === 5 && (
            <Button onClick={() => onOpenChange(false)}>
              Stäng
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerGuideDialog;
