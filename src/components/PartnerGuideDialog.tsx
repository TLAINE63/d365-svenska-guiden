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
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
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
  "Customer Service",
  "Field Service",
  "Customer Insights (Marketing)",
  "Contact Center",
  "Project Operations",
  "Commerce"
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
];

const marketOptions = [
  { value: "Sverige", label: "Sverige" },
  { value: "Norden", label: "Norden" },
  { value: "Europa", label: "Europa" },
  { value: "Internationellt", label: "Internationellt" }
];

const sizeOptions = [
  { value: "1-49", label: "1-49 anställda" },
  { value: "50-99", label: "50-99 anställda" },
  { value: "100-249", label: "100-249 anställda" },
  { value: "250-999", label: "250-999 anställda" },
  { value: "1.000-4.999", label: "1.000-4.999 anställda" },
  { value: ">5.000", label: "Mer än 5.000 anställda" }
];

// Helper to match product filter for database partners
const matchesDbProductFilter = (
  partner: DatabasePartner, 
  productKey: 'bc' | 'fsc' | 'crm',
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
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Internationellt"];
    const selectedGeoIndex = geographyHierarchy.indexOf(geography);
    const partnerGeoIndex = geographyHierarchy.indexOf(productFilter.geography || "Sverige");
    if (partnerGeoIndex < selectedGeoIndex) {
      return false;
    }
  }
  
  return true;
};

const getDbProductRanking = (partner: DatabasePartner, productKey: 'bc' | 'fsc' | 'crm'): number => {
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

  // Determine product type from selected application
  const getProductType = (app: string): 'bc' | 'fsc' | 'crm' | null => {
    if (app === "Business Central") return 'bc';
    if (app === "Finance & SCM") return 'fsc';
    if (["Sales", "Customer Service", "Field Service", "Customer Insights (Marketing)", "Contact Center", "Project Operations", "Commerce"].includes(app)) {
      return 'crm';
    }
    return null;
  };

  const findBestPartners = () => {
    const productType = getProductType(selectedApp);
    
    if (!productType) {
      setSuggestedPartners([]);
      setStep(5);
      return;
    }

    // Filter partners using the same logic as the rest of the site
    const matchingPartners = partners.filter(partner => {
      if (isDatabasePartner(partner)) {
        return matchesDbProductFilter(
          partner,
          productType,
          selectedIndustry || undefined,
          selectedSize || undefined,
          selectedMarket || undefined
        );
      }
      // For static partners, use simple check
      return partner.productFilters?.[productType];
    });

    // Sort by product ranking (same as ValjPartner.tsx)
    const sortedPartners = matchingPartners.sort((a, b) => {
      if (isDatabasePartner(a) && isDatabasePartner(b)) {
        const rankA = getDbProductRanking(a, productType);
        const rankB = getDbProductRanking(b, productType);
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        return (a.name || '').localeCompare(b.name || '', 'sv');
      }
      return 0;
    });

    // Show all matching partners
    setSuggestedPartners(sortedPartners);
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
              <h3 className="text-lg font-semibold">Baserat på dina val skulle följande partners kunna passa er verksamhet:</h3>
            </div>
            
            <div className="space-y-4">
            {suggestedPartners.map((partner, index) => {
                const partnerSlug = isDatabasePartner(partner) 
                  ? partner.slug 
                  : (partner.name || '').toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const profileUrl = `/partner/${partnerSlug}${selectedApp ? `?product=${encodeURIComponent(selectedApp)}` : ""}${selectedIndustry ? `${selectedApp ? "&" : "?"}industry=${encodeURIComponent(selectedIndustry)}` : ""}`;
                
                return (
                  <Card key={index} className="border border-border">
                    <CardHeader className="pb-2">
                      <Link to={profileUrl} onClick={() => onOpenChange(false)}>
                        <CardTitle className="text-lg hover:text-primary transition-colors">
                          {partner.name || 'Partner'}
                        </CardTitle>
                      </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{partner.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {(partner.applications || []).map((app, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link to={profileUrl} onClick={() => onOpenChange(false)}>
                          Öppna partnerkortet
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <LeadCTA
              sourcePage="partner-guide-dialog"
              selectedProducts={selectedApp ? [selectedApp] : []}
              selectedIndustry={selectedIndustry}
              selectedCompanySize={sizeOptions.find(o => o.value === selectedSize)?.label}
              title="Låt oss hjälpa dig vidare"
              description="Lämna dina uppgifter så hjälper vi dig att komma i kontakt med rätt partner och kontaktperson."
            />
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
