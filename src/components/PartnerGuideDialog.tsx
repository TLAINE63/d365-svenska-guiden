import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle, ExternalLink } from "lucide-react";
import { trackPartnerClick } from "@/utils/trackPartnerClick";

interface Partner {
  name: string;
  logo: string;
  website: string;
  description: string;
  applications: string[];
  industries: string[];
  companySize: string[];
  markets?: string[];
}

interface PartnerGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partners: Partner[];
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
  "Commerce",
  "Copilot"
];

const industryOptions = [
  "Tillverkningsindustrin",
  "Handel (Retail & eCommerce)",
  "Grossist/Distribution",
  "Bank & Försäkring",
  "Hälso- & sjukvård",
  "Life Science",
  "Konsulttjänster",
  "Offentlig sektor",
  "Energi & Utilities",
  "Utbildning",
  "Nonprofit"
];

const marketOptions = [
  { value: "sverige", label: "Sverige" },
  { value: "norden", label: "Norden" },
  { value: "internationellt", label: "Internationellt" }
];

const sizeOptions = [
  { value: "sma", label: "Små (1-50 anställda)" },
  { value: "medelstora", label: "Medelstora (51-250 anställda)" },
  { value: "stora", label: "Stora (250+ anställda)" }
];

const PartnerGuideDialog = ({ open, onOpenChange, partners }: PartnerGuideDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [suggestedPartners, setSuggestedPartners] = useState<Partner[]>([]);

  const totalSteps = 4;

  const handleAppToggle = (app: string) => {
    setSelectedApps(prev =>
      prev.includes(app)
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const calculatePartnerScore = (partner: Partner): number => {
    let score = 0;

    // Application match
    selectedApps.forEach(app => {
      if (partner.applications.some(pApp => 
        pApp.toLowerCase().includes(app.toLowerCase()) ||
        app.toLowerCase().includes(pApp.toLowerCase())
      )) {
        score += 3;
      }
    });

    // Industry match
    selectedIndustries.forEach(industry => {
      if (partner.industries.some(pInd => 
        pInd.toLowerCase().includes(industry.toLowerCase()) ||
        industry.toLowerCase().includes(pInd.toLowerCase()) ||
        pInd === "Alla branscher"
      )) {
        score += 2;
      }
    });

    // Size match
    const sizeMap: Record<string, string> = {
      "sma": "Små",
      "medelstora": "Medelstora",
      "stora": "Stora"
    };
    if (selectedSize && partner.companySize.includes(sizeMap[selectedSize])) {
      score += 2;
    }

    // Market match - bonus for international partners if international selected
    if (selectedMarket === "internationellt") {
      if (partner.description.toLowerCase().includes("internationell") ||
          partner.description.toLowerCase().includes("global") ||
          partner.description.toLowerCase().includes("europa") ||
          partner.description.toLowerCase().includes("norden")) {
        score += 1;
      }
    }

    return score;
  };

  const findBestPartners = () => {
    const scoredPartners = partners.map(partner => ({
      partner,
      score: calculatePartnerScore(partner)
    }));

    scoredPartners.sort((a, b) => b.score - a.score);

    // Get top 3 with score > 0
    const topPartners = scoredPartners
      .filter(sp => sp.score > 0)
      .slice(0, 3)
      .map(sp => sp.partner);

    // If we don't have 3, fill with random partners
    if (topPartners.length < 3) {
      const remaining = partners.filter(p => !topPartners.includes(p));
      while (topPartners.length < 3 && remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        topPartners.push(remaining.splice(randomIndex, 1)[0]);
      }
    }

    setSuggestedPartners(topPartners);
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
    setSelectedApps([]);
    setSelectedIndustries([]);
    setSelectedMarket("");
    setSelectedSize("");
    setSuggestedPartners([]);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedApps.length > 0;
      case 2: return selectedIndustries.length > 0;
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
            {step <= totalSteps ? `Steg ${step} av ${totalSteps}` : "Dina förslag"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vilka applikationer är du intresserad av?</h3>
            <p className="text-sm text-muted-foreground">Välj en eller flera</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {applicationOptions.map(app => (
                <div
                  key={app}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedApps.includes(app)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleAppToggle(app)}
                >
                  <Checkbox
                    checked={selectedApps.includes(app)}
                    onCheckedChange={() => handleAppToggle(app)}
                  />
                  <Label className="cursor-pointer text-sm">{app}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vilken bransch tillhör du?</h3>
            <p className="text-sm text-muted-foreground">Välj en eller flera</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {industryOptions.map(industry => (
                <div
                  key={industry}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedIndustries.includes(industry)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleIndustryToggle(industry)}
                >
                  <Checkbox
                    checked={selectedIndustries.includes(industry)}
                    onCheckedChange={() => handleIndustryToggle(industry)}
                  />
                  <Label className="cursor-pointer text-sm">{industry}</Label>
                </div>
              ))}
            </div>
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
              <h3 className="text-lg font-semibold">Baserat på dina val rekommenderar vi dessa partners:</h3>
            </div>
            
            <div className="space-y-4">
              {suggestedPartners.map((partner, index) => (
                <Card key={index} className="border border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {partner.applications.map((app, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild variant="default" className="w-full mt-3">
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackPartnerClick(partner.name, partner.website, "Partner Guide")}
                      >
                        Besök hemsida
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Vill du ha hjälp att komma i kontakt med dessa partners? Kontakta oss så hjälper vi dig vidare.
            </p>
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
