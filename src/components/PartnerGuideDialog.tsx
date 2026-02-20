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
import { Card, CardContent } from "@/components/ui/card";
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

// CRM apps that trigger the workload step
const crmApps = ["Sales", "Customer Insights (Marketing)", "Customer Service", "Field Service", "Contact Center"];

// Workload options per CRM application
const workloadOptions: Record<string, { value: string; label: string; description: string }[]> = {
  "Sales": [
    { value: "b2b-komplex", label: "B2B komplex säljcykel", description: "Långa affärer med flera beslutsfattare och anbudssteg" },
    { value: "transaktionell", label: "Transaktionell försäljning", description: "Hög volym, kortare cykler och standardiserade erbjudanden" },
    { value: "prenumeration", label: "Prenumeration / Recurring", description: "Abonnemang, löpande avtal och förnyelser" },
    { value: "partner-kanal", label: "Partner- och kanalförsäljning", description: "Försäljning via återförsäljare, agenter eller kanalnätverk" },
  ],
  "Customer Insights (Marketing)": [
    { value: "kampanj", label: "Kampanjhantering", description: "E-post, event och flerkanalskampanjer" },
    { value: "cdp", label: "CDP / Dataplattform", description: "Kunddata från flera källor, segmentering och aktivering" },
    { value: "lojalitet", label: "Lojalitet & personalisering", description: "Lojalitetsprogram och riktade budskap baserade på beteende" },
    { value: "b2b-marknad", label: "B2B-marknadsföring (ABM)", description: "Account-based marketing mot specifika målkonton" },
  ],
  "Customer Service": [
    { value: "arendehantering", label: "Ärendehantering", description: "Ticketsystem, SLA och eskaleringsflöden" },
    { value: "sjalvbetjaning", label: "Självbetjäning / Kundportal", description: "Kunskapsbas, FAQ och kundportaler" },
    { value: "sla-kontrakt", label: "SLA & kontraktsstyrning", description: "Garantier, serviceavtal och kontraktsbaserad support" },
    { value: "omni-service", label: "Omnikanal-service", description: "Enhetlig serviceupplevelse via e-post, chatt, telefon och webb" },
  ],
  "Field Service": [
    { value: "planerat-underhall", label: "Planerat underhåll", description: "Schemalagt förebyggande underhåll och inspektioner" },
    { value: "felanmalan", label: "Felanmälan & akututryckningar", description: "Reaktiv service och snabb utryckning vid driftstopp" },
    { value: "iot", label: "IoT-kopplad service", description: "Sensordata som triggar serviceorder automatiskt" },
    { value: "installation", label: "Installation & driftsättning", description: "Projektstyrd installation och idrifttagning hos kund" },
  ],
  "Contact Center": [
    { value: "omnikanal-cc", label: "Omnikanal-kontaktcenter", description: "Samlar röst, chatt, e-post och sociala medier i en vy" },
    { value: "ai-assisterad", label: "AI-assisterad service", description: "Copilot, bot-integration och föreslagen respons" },
    { value: "volym", label: "Högvolym & routing", description: "Automatisk köhantering, routing och kompetensbaserad fördelning" },
    { value: "outbound", label: "Utgående kontakt (Outbound)", description: "Kampanjsamtal, påminnelser och proaktiv kundkontakt" },
  ],
};

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
    const partnerGeo = Array.isArray(productFilter.geography) ? productFilter.geography : (productFilter.geography ? [productFilter.geography] : ["Sverige"]);
    const geographyHierarchy = ["Sverige", "Norden", "Europa", "Övriga världen", "Internationellt"];
    const selectedGeoIndex = geographyHierarchy.indexOf(geography);
    const maxPartnerGeoIndex = Math.max(...partnerGeo.map((g: string) => geographyHierarchy.indexOf(g)));
    if (maxPartnerGeoIndex < selectedGeoIndex) {
      return false;
    }
  }
  
  return true;
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

const PartnerGuideDialog = ({ open, onOpenChange, partners }: PartnerGuideDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedWorkload, setSelectedWorkload] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [suggestedPartners, setSuggestedPartners] = useState<PartnerData[]>([]);

  const isCrmApp = crmApps.includes(selectedApp);
  // CRM apps get an extra workload step → 5 steps total, others 4
  const totalSteps = isCrmApp ? 5 : 4;

  // Map logical step index to content, skipping workload step for non-CRM
  // Step 1 = App, Step 2 = Workload (CRM only), Step 3/2 = Industry, Step 4/3 = Market, Step 5/4 = Size
  const getContentStep = (s: number): 'app' | 'workload' | 'industry' | 'market' | 'size' => {
    if (s === 1) return 'app';
    if (isCrmApp) {
      if (s === 2) return 'workload';
      if (s === 3) return 'industry';
      if (s === 4) return 'market';
      if (s === 5) return 'size';
    } else {
      if (s === 2) return 'industry';
      if (s === 3) return 'market';
      if (s === 4) return 'size';
    }
    return 'size';
  };

  // Determine product key from selected application
  const getProductKey = (app: string): ProductKey | null => {
    if (app === "Business Central") return 'bc';
    if (app === "Finance & SCM") return 'fsc';
    if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
    if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
    if (["Project Operations", "Commerce", "Human Resources"].includes(app)) return 'fsc';
    return null;
  };

  const findBestPartners = () => {
    const productKey = getProductKey(selectedApp);
    
    if (!productKey) {
      setSuggestedPartners([]);
      setStep(totalSteps + 1);
      return;
    }

    const matchingPartners = partners.filter(partner => {
      if (isDatabasePartner(partner)) {
        return matchesDbProductFilter(
          partner,
          productKey,
          selectedIndustry || undefined,
          undefined,
          selectedMarket || undefined
        );
      }
      return partner.productFilters?.[productKey];
    });

    const sessionSeed = Math.floor(Date.now() / (1000 * 60 * 60));
    const shuffledPartners = seededShuffle(matchingPartners, sessionSeed);

    setSuggestedPartners(shuffledPartners);
    setStep(totalSteps + 1);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      // When moving from step 1, reset workload if app changed to non-CRM
      if (step === 1 && !crmApps.includes(selectedApp)) {
        setSelectedWorkload("");
      }
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
    setSelectedWorkload("");
    setSelectedIndustry("");
    setSelectedMarket("");
    setSelectedSize("");
    setSuggestedPartners([]);
  };

  const canProceed = () => {
    const content = getContentStep(step);
    switch (content) {
      case 'app': return selectedApp !== "";
      case 'workload': return selectedWorkload !== "";
      case 'industry': return selectedIndustry !== "";
      case 'market': return selectedMarket !== "";
      case 'size': return selectedSize !== "";
      default: return true;
    }
  };

  const isResultStep = step === totalSteps + 1;

  // Get selected workload label for display
  const selectedWorkloadLabel = selectedApp && workloadOptions[selectedApp]
    ? workloadOptions[selectedApp].find(w => w.value === selectedWorkload)?.label
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {!isResultStep ? `Steg ${step} av ${totalSteps}` : "Partnerförslag"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Application */}
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

        {/* Step 2 (CRM only): Workload focus */}
        {step === 2 && isCrmApp && workloadOptions[selectedApp] && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vilket workload-fokus är viktigast för er?</h3>
            <p className="text-sm text-muted-foreground">
              Välj det som bäst beskriver era behov inom <strong>{selectedApp}</strong>
            </p>
            <RadioGroup value={selectedWorkload} onValueChange={setSelectedWorkload}>
              <div className="space-y-3">
                {workloadOptions[selectedApp].map(option => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedWorkload === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedWorkload(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={`workload-${option.value}`} className="mt-0.5" />
                    <div>
                      <Label htmlFor={`workload-${option.value}`} className="cursor-pointer text-base font-medium">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Industry step */}
        {getContentStep(step) === 'industry' && (
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

        {/* Market step */}
        {getContentStep(step) === 'market' && (
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

        {/* Size step */}
        {getContentStep(step) === 'size' && (
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

        {/* Results step */}
        {isResultStep && (
          <div className="space-y-6">
            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">{selectedApp}</Badge>
              {selectedWorkloadLabel && (
                <Badge variant="secondary">{selectedWorkloadLabel}</Badge>
              )}
              {selectedIndustry && <Badge variant="outline">{selectedIndustry}</Badge>}
              {selectedMarket && <Badge variant="outline">{selectedMarket}</Badge>}
            </div>

            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">
                {suggestedPartners.length > 0 
                  ? "Baserat på dina val skulle följande partners kunna passa er verksamhet:"
                  : "Inga partner listas med denna filtrering"}
              </h3>
            </div>
            
            {suggestedPartners.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
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

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          {step > 1 && !isResultStep ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka
            </Button>
          ) : isResultStep ? (
            <Button variant="outline" onClick={handleReset}>
              Börja om
            </Button>
          ) : (
            <div />
          )}
          
          {!isResultStep && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === totalSteps ? "Visa förslag" : "Nästa"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {isResultStep && (
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
