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
import { ArrowRight, ArrowLeft, CheckCircle, Building2, Search, Shuffle, Sparkles, Loader2, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LeadCTA from "@/components/LeadCTA";
import { Partner } from "@/data/partners";
import { DatabasePartner } from "@/hooks/usePartners";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    { value: "B2B komplex säljcykel", label: "B2B komplex säljcykel", description: "Långa affärer med flera beslutsfattare och anbudssteg" },
    { value: "Transaktionell försäljning", label: "Transaktionell försäljning", description: "Hög volym, kortare cykler och standardiserade erbjudanden" },
    { value: "Prenumeration / Recurring", label: "Prenumeration / Recurring", description: "Abonnemang, löpande avtal och förnyelser" },
    { value: "Partner- och kanalförsäljning", label: "Partner- och kanalförsäljning", description: "Försäljning via återförsäljare, agenter eller kanalnätverk" },
  ],
  "Customer Insights (Marketing)": [
    { value: "Kampanjhantering", label: "Kampanjhantering", description: "E-post, event och flerkanalskampanjer" },
    { value: "CDP / Dataplattform", label: "CDP / Dataplattform", description: "Kunddata från flera källor, segmentering och aktivering" },
    { value: "Lojalitet & personalisering", label: "Lojalitet & personalisering", description: "Lojalitetsprogram och riktade budskap baserade på beteende" },
    { value: "B2B-marknadsföring (ABM)", label: "B2B-marknadsföring (ABM)", description: "Account-based marketing mot specifika målkonton" },
  ],
  "Customer Service": [
    { value: "Ärendehantering", label: "Ärendehantering", description: "Ticketsystem, SLA och eskaleringsflöden" },
    { value: "Självbetjäning / Kundportal", label: "Självbetjäning / Kundportal", description: "Kunskapsbas, FAQ och kundportaler" },
    { value: "SLA & kontraktsstyrning", label: "SLA & kontraktsstyrning", description: "Garantier, serviceavtal och kontraktsbaserad support" },
    { value: "Omnikanal-service", label: "Omnikanal-service", description: "Enhetlig serviceupplevelse via e-post, chatt, telefon och webb" },
  ],
  "Field Service": [
    { value: "Planerat underhåll", label: "Planerat underhåll", description: "Schemalagt förebyggande underhåll och inspektioner" },
    { value: "Felanmälan & akututryckningar", label: "Felanmälan & akututryckningar", description: "Reaktiv service och snabb utryckning vid driftstopp" },
    { value: "IoT-kopplad service", label: "IoT-kopplad service", description: "Sensordata som triggar serviceorder automatiskt" },
    { value: "Installation & driftsättning", label: "Installation & driftsättning", description: "Projektstyrd installation och idrifttagning hos kund" },
  ],
  "Contact Center": [
    { value: "Omnikanal-kontaktcenter", label: "Omnikanal-kontaktcenter", description: "Samlar röst, chatt, e-post och sociala medier i en vy" },
    { value: "AI-assisterad service", label: "AI-assisterad service", description: "Copilot, bot-integration och föreslagen respons" },
    { value: "Högvolym & routing", label: "Högvolym & routing", description: "Automatisk köhantering, routing och kompetensbaserad fördelning" },
    { value: "Utgående kontakt (Outbound)", label: "Utgående kontakt (Outbound)", description: "Kampanjsamtal, påminnelser och proaktiv kundkontakt" },
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

const aiInterestOptions = [
  { value: "high", label: "Ja, det är viktigt", description: "Vi vill ha en partner med stark kompetens inom Copilot, AI-agenter och/eller Copilot Studio" },
  { value: "medium", label: "Intressant men inte avgörande", description: "Vi vill veta mer, men det är inte ett krav för val av partner" },
  { value: "none", label: "Nej, inte aktuellt just nu", description: "AI är inte prioriterat i vår implementering" },
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

// Determine product key from selected application
const getProductKey = (app: string): ProductKey | null => {
  if (app === "Business Central") return 'bc';
  if (app === "Finance & SCM") return 'fsc';
  if (["Sales", "Customer Insights (Marketing)"].includes(app)) return 'sales';
  if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
  if (["Project Operations", "Commerce", "Human Resources"].includes(app)) return 'fsc';
  return null;
};

// Score color helper
const getScoreColor = (score: number) => {
  if (score >= 75) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-muted-foreground";
};

const getScoreBg = (score: number) => {
  if (score >= 75) return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (score >= 50) return "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800";
  return "bg-muted/30 border-border";
};

// AI match result type
interface AiMatchResult {
  id: string;
  score: number;
  matchReason: string;
}

const PartnerGuideDialog = ({ open, onOpenChange, partners }: PartnerGuideDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedWorkload, setSelectedWorkload] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedAiInterest, setSelectedAiInterest] = useState<string>("");
  const [suggestedPartners, setSuggestedPartners] = useState<PartnerData[]>([]);
  const [aiMatches, setAiMatches] = useState<AiMatchResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const isCrmApp = crmApps.includes(selectedApp);
  // CRM apps get an extra workload step → 6 steps total, others 5
  const totalSteps = isCrmApp ? 6 : 5;

  // Map logical step index to content, skipping workload step for non-CRM
  const getContentStep = (s: number): 'app' | 'workload' | 'industry' | 'market' | 'size' | 'ai' => {
    if (s === 1) return 'app';
    if (isCrmApp) {
      if (s === 2) return 'workload';
      if (s === 3) return 'industry';
      if (s === 4) return 'market';
      if (s === 5) return 'size';
      if (s === 6) return 'ai';
    } else {
      if (s === 2) return 'industry';
      if (s === 3) return 'market';
      if (s === 4) return 'size';
      if (s === 5) return 'ai';
    }
    return 'ai';
  };

  // CRM apps where at least one result should be a CRM-only specialist (no ERP)
  const crmSpecialistApps = ["Customer Insights (Marketing)", "Customer Service", "Contact Center", "Sales", "Field Service"];
  const erpApps = ["Business Central", "Finance & SCM"];

  const isCrmSpecialistApp = crmSpecialistApps.includes(selectedApp);

  // Check if a partner is an ERP specialist (has ERP apps but no or very few CRM apps)
  const isCrmOnlyPartner = (partner: PartnerData): boolean => {
    const apps = partner.applications || [];
    const hasErp = apps.some(a => erpApps.includes(a));
    return !hasErp;
  };

  const findBestPartnersWithAi = (aiInterestOverride?: string) => {
    const aiInterest = aiInterestOverride ?? selectedAiInterest;
    findBestPartnersInner(aiInterest);
  };

  const findBestPartners = () => findBestPartnersInner(selectedAiInterest);

  const findBestPartnersInner = async (aiInterest: string) => {
    const productKey = getProductKey(selectedApp);
    
    if (!productKey) {
      setSuggestedPartners([]);
      setStep(totalSteps + 1);
      return;
    }

    const MIN_RESULTS = 3;

    // Helper: filter partners by criteria with optional relaxations
    const filterPartners = (
      relaxIndustry: boolean,
      relaxGeography: boolean
    ): PartnerData[] => {
      return partners.filter(partner => {
        if (isDatabasePartner(partner)) {
          return matchesDbProductFilter(
            partner,
            productKey,
            relaxIndustry ? undefined : (selectedIndustry || undefined),
            undefined, // size always relaxed – AI scores it
            relaxGeography ? undefined : (selectedMarket || undefined)
          );
        }
        return partner.productFilters?.[productKey];
      });
    };

    // Step 1: strict filter (industry + geography)
    let matchingPartners = filterPartners(false, false);

    // Step 2: relax industry if < MIN_RESULTS
    if (matchingPartners.length < MIN_RESULTS) {
      matchingPartners = filterPartners(true, false);
    }

    // Step 3: relax geography too if still < MIN_RESULTS
    if (matchingPartners.length < MIN_RESULTS) {
      matchingPartners = filterPartners(true, true);
    }

    // For CRM apps: ensure at least one CRM-only partner in the set
    // We do this by promoting a CRM-only partner if none exists in current results
    let finalPartners = [...matchingPartners];
    if (isCrmSpecialistApp && finalPartners.length >= MIN_RESULTS) {
      const hasCrmOnly = finalPartners.some(isCrmOnlyPartner);
      if (!hasCrmOnly) {
        // Find a CRM-only partner from the full pool (relaxed filters)
        const allCrmOnlyPartners = filterPartners(true, true).filter(isCrmOnlyPartner);
        if (allCrmOnlyPartners.length > 0) {
          // Add one CRM-only partner (shuffle picks random one)
          const crmOnlyCandidate = allCrmOnlyPartners[Math.floor(Math.random() * allCrmOnlyPartners.length)];
          // Only add if not already present
          if (!finalPartners.find(p => {
            const pId = isDatabasePartner(p) ? p.id : p.name;
            const cId = isDatabasePartner(crmOnlyCandidate) ? crmOnlyCandidate.id : crmOnlyCandidate.name;
            return pId === cId;
          })) {
            finalPartners = [...finalPartners, crmOnlyCandidate];
          }
        }
      }
    }

    setSuggestedPartners(finalPartners);
    setStep(totalSteps + 1);

    // Step 2: AI ranking (async, non-blocking)
    if (finalPartners.length > 0) {
      setIsAiLoading(true);
      try {
        const partnerPayload = finalPartners
          .filter(isDatabasePartner)
          .map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            applications: p.applications || [],
            industries: p.industries || [],
            geography: p.geography || [],
            product_filters: p.product_filters || {},
          }));

        if (partnerPayload.length === 0) {
          setIsAiLoading(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('match-partners', {
          body: {
            partners: partnerPayload,
            criteria: {
              application: selectedApp,
              productKey,
              industry: selectedIndustry,
              geography: selectedMarket,
              companySize: selectedSize,
               workload: selectedWorkload || undefined,
              preferCrmOnly: isCrmSpecialistApp,
              aiInterest: aiInterest || undefined,
            },
          },
        });

        if (error) throw error;
        if (data?.error) {
          if (data.error.includes('Rate limit') || data.error.includes('429')) {
            toast({ title: "AI temporärt otillgänglig", description: "Partners visas utan AI-rangordning.", variant: "destructive" });
          }
          throw new Error(data.error);
        }

        const matches: AiMatchResult[] = data?.matches || [];
        setAiMatches(matches);

        // Re-sort by AI score (desc), but if CRM app: guarantee a CRM-only partner
        // appears in the top 3 by swapping the lowest-ranked CRM-only in if needed
        if (matches.length > 0) {
          const scoreMap = new Map(matches.map(m => [m.id, m.score]));

          let sorted = [...finalPartners].sort((a, b) => {
            const scoreA = isDatabasePartner(a) ? (scoreMap.get(a.id) ?? 0) : 0;
            const scoreB = isDatabasePartner(b) ? (scoreMap.get(b.id) ?? 0) : 0;
            return scoreB - scoreA;
          });

          // For CRM apps: if no CRM-only partner is in top 3, swap one in
          if (isCrmSpecialistApp && sorted.length >= MIN_RESULTS) {
            const top3HasCrmOnly = sorted.slice(0, MIN_RESULTS).some(isCrmOnlyPartner);
            if (!top3HasCrmOnly) {
              // Find highest-scored CRM-only partner outside top 3
              const crmOnlyIdx = sorted.findIndex((p, i) => i >= MIN_RESULTS && isCrmOnlyPartner(p));
              if (crmOnlyIdx !== -1) {
                // Swap it into position 3 (index 2) – the weakest of the top 3
                const temp = sorted[MIN_RESULTS - 1];
                sorted[MIN_RESULTS - 1] = sorted[crmOnlyIdx];
                sorted[crmOnlyIdx] = temp;
              }
            }
          }

          setSuggestedPartners(sorted);
        }
      } catch (e) {
        console.error('AI matching error:', e);
        // Graceful degradation: keep partners in current order
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
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
    setSelectedAiInterest("");
    setSuggestedPartners([]);
    setAiMatches([]);
    setIsAiLoading(false);
  };

  const canProceed = () => {
    const content = getContentStep(step);
    switch (content) {
      case 'app': return selectedApp !== "";
      case 'workload': return selectedWorkload !== "";
      case 'industry': return selectedIndustry !== "";
      case 'market': return selectedMarket !== "";
      case 'size': return selectedSize !== "";
      case 'ai': return selectedAiInterest !== "";
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

        {/* AI interest step – auto-submits on click */}
        {getContentStep(step) === 'ai' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hur viktigt är AI i ert val av partner?</h3>
            <p className="text-sm text-muted-foreground">
              Microsoft erbjuder AI-funktioner som Copilot, AI-agenter, Copilot Studio och Azure AI Foundry. Vill ni att partnern har kompetens inom dessa?
            </p>
            <div className="space-y-3">
              {aiInterestOptions.map(option => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAiInterest === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    setSelectedAiInterest(option.value);
                    findBestPartnersWithAi(option.value);
                  }}
                >
                  <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 ${selectedAiInterest === option.value ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`} />
                  <div>
                    <span className="text-base font-medium">{option.label}</span>
                    <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results step */}
        {isResultStep && (
          <div className="space-y-6">
            {/* Structured summary */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <h4 className="text-sm font-semibold mb-2 text-foreground">Dessa val har du gjort</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <span className="text-muted-foreground">Produkt:</span>
                <span className="font-medium">{selectedApp}{selectedWorkloadLabel ? ` – ${selectedWorkloadLabel}` : ''}</span>
                <span className="text-muted-foreground">Bransch:</span>
                <span className="font-medium">{selectedIndustry || '–'}</span>
                <span className="text-muted-foreground">Marknad:</span>
                <span className="font-medium">{selectedMarket || '–'}</span>
                <span className="text-muted-foreground">Företagsstorlek:</span>
                <span className="font-medium">{sizeOptions.find(o => o.value === selectedSize)?.label || '–'}</span>
                <span className="text-muted-foreground">AI-fokus:</span>
                <span className="font-medium">{aiInterestOptions.find(o => o.value === selectedAiInterest)?.label || '–'}</span>
              </div>
            </div>

            {/* AI loading indicator */}
            {isAiLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-4 py-3">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>AI analyserar och rangordnar partners efter dina behov…</span>
              </div>
            )}

            {/* AI ranked badge (shown after loading) */}
            {!isAiLoading && aiMatches.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-lg px-4 py-2.5 border border-primary/20">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">AI-rangordnade resultat</span>
                <span className="text-muted-foreground text-xs">– baserat på profil, erbjudande och branschmatchning</span>
              </div>
            )}

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
                  
                  const aiMatch = isDatabasePartner(partner) 
                    ? aiMatches.find(m => m.id === partner.id)
                    : undefined;
                  
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
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <Link 
                                  to={profileUrl} 
                                  onClick={() => onOpenChange(false)}
                                  className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                                >
                                  {partner.name || 'Partner'}
                                </Link>
                                {/* Only show shuffle icon when no AI scores */}
                                {aiMatches.length === 0 && !isAiLoading && (
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center cursor-help flex-shrink-0">
                                          <Shuffle className="w-2.5 h-2.5 text-muted-foreground" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="text-xs">
                                        <p>Ordningen slumpas för rättvis exponering</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                              
                              {/* AI Match Score */}
                              {aiMatch && !isAiLoading && (
                                <TooltipProvider delayDuration={100}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold flex-shrink-0 cursor-help ${getScoreBg(aiMatch.score)}`}>
                                        <Star className={`w-3 h-3 ${getScoreColor(aiMatch.score)}`} />
                                        <span className={getScoreColor(aiMatch.score)}>{aiMatch.score}%</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs max-w-48">
                                      <p className="font-medium mb-1">AI-matchning</p>
                                      <p>{aiMatch.matchReason}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            
                            {/* AI match reason inline */}
                            {aiMatch && !isAiLoading && (
                              <p className="text-xs text-muted-foreground italic mb-2 flex items-start gap-1">
                                <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary/60" />
                                {aiMatch.matchReason}
                              </p>
                            )}
                            
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
          
          {!isResultStep && getContentStep(step) !== 'ai' && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Nästa
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
