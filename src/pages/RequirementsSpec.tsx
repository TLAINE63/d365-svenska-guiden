import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateRequirementsSpec, type RequirementsData } from "@/utils/generateRequirementsSpec";
import { allIndustries } from "@/data/partners";
import {
  ArrowLeft, ArrowRight, FileText, Download,
  Calculator, Package, Factory, ShoppingCart, Boxes, Wrench,
  Link2, CheckCircle2, Loader2, Eye, Lock, Users, Landmark, Truck,
} from "lucide-react";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kravspecifikation", url: "https://d365.se/kravspecifikation" },
];

const erpTeamSizes = ["1–25", "26–50", "51–100", "101–250", "251–500", "500+"];

const areaOptions = [
  { id: "ekonomi", label: "Ekonomi & Redovisning", icon: Calculator },
  { id: "lager", label: "Lager & Logistik", icon: Package },
  { id: "produktion", label: "Produktion & Tillverkning", icon: Factory },
  { id: "forsaljning", label: "Försäljning & Order", icon: ShoppingCart },
  { id: "inkop", label: "Inköp & Anskaffning", icon: Boxes },
  { id: "projekt", label: "Projekt & Resurser", icon: Wrench },
  { id: "hr", label: "Personal & HR", icon: Users },
  { id: "service", label: "Service & Underhåll", icon: Wrench },
  { id: "transport", label: "Transport & Distribution", icon: Truck },
  { id: "koncern", label: "Koncern & Flerbolag", icon: Landmark },
  { id: "integration", label: "Integrationer", icon: Link2 },
];

const RequirementsSpec = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [industry, setIndustry] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "ekonomi", "lager", "forsaljning", "inkop", "integration",
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<RequirementsData | null>(null);

  const [email, setEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!industry;
      case 2: return !!companySize;
      case 3: return selectedAreas.length > 0;
      default: return true;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-requirements", {
        body: { product: "erp", industry, companySize, areas: selectedAreas },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      setStep(4);
    } catch (err: any) {
      console.error("Generation error:", err);
      toast({
        title: "Kunde inte generera kravspecifikation",
        description: err.message || "Försök igen om en stund",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    if (!email) {
      toast({ title: "Ange din e-postadress", variant: "destructive" });
      return;
    }
    setIsDownloading(true);
    try {
      await supabase.functions.invoke("submit-lead", {
        body: {
          email,
          company_name: "Kravspecifikation Download",
          contact_name: email.split("@")[0] || "Lead",
          source_page: "/kravspecifikation",
          source_type: "requirements_spec",
          message: `Laddat ner kravspecifikation: ERP - ${result.industry}`,
        },
      });

      await generateRequirementsSpec(result);
      toast({ title: "Kravspecifikationen har laddats ner!" });
    } catch (err: any) {
      console.error("Download error:", err);
      toast({
        title: "Nedladdningen misslyckades",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    ekonomi: "Ekonomi & Redovisning",
    lager: "Lager & Logistik",
    produktion: "Produktion & Tillverkning",
    forsaljning: "Försäljning & Order",
    inkop: "Inköp & Anskaffning",
    projekt: "Projekt & Resurser",
    hr: "Personal & HR",
    service: "Service & Underhåll",
    transport: "Transport & Distribution",
    koncern: "Koncern & Flerbolag",
    integration: "Integrationer & Teknik",
  };

  const priorityColors: Record<string, string> = {
    must: "bg-destructive/10 text-destructive border-destructive/20",
    should: "bg-warning/10 text-warning-foreground border-warning/20",
    could: "bg-muted text-muted-foreground border-border",
  };

  const priorityLabels: Record<string, string> = {
    must: "Måste ha",
    should: "Bör ha",
    could: "Kan ha",
  };

  return (
    <>
      <SEOHead
        title="Kravspecifikation för Dynamics 365 ERP | d365.se"
        description="Skapa en systemoberoende kravspecifikation för ERP. Anpassad efter din bransch med AI-berikade krav, KPI:er och produktrekommendation."
        canonicalPath="/kravspecifikation"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FileText className="h-4 w-4" />
              Kravspecifikation – ERP
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Skapa din ERP-kravspecifikation
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fånga dina verksamhetsbehov oberoende av system. AI:n rekommenderar sedan vilken
              produktkombination (Business Central, Finance & SCM eller båda) som passar bäst.
            </p>
          </div>

          {/* Progress */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Steg {step} av {totalSteps - 1}</span>
                <span>{Math.round((step / (totalSteps - 1)) * 100)}%</span>
              </div>
              <Progress value={(step / (totalSteps - 1)) * 100} className="h-2" />
            </div>
          )}

          {/* Step 1: Industry */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Välj bransch</h2>
              <p className="text-sm text-muted-foreground">
                Branschen påverkar vilka specialkrav och KPI:er som inkluderas.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allIndustries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`p-3 rounded-lg border text-left text-sm transition-all ${
                      industry === ind
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Company Size */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Antal anställda</h2>
              <p className="text-sm text-muted-foreground">
                Storleken påverkar komplexitet och vilka funktioner som prioriteras.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {erpTeamSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setCompanySize(size)}
                    className={`p-4 rounded-lg border text-center text-sm transition-all ${
                      companySize === size
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {size} medarbetare
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Areas */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Vilka funktionsområden är relevanta?</h2>
              <p className="text-sm text-muted-foreground">Välj de områden du vill inkludera i kravspecifikationen.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {areaOptions.map((area) => {
                  const Icon = area.icon;
                  const isSelected = selectedAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      onClick={() => toggleArea(area.id)}
                      className={`p-4 rounded-lg border flex items-center gap-3 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className={`p-2 rounded-md ${isSelected ? "bg-primary/20" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`font-medium text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {area.label}
                      </span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && result && (
            <div className="space-y-8">
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">
                        Kravspecifikation – ERP / Affärssystem
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {result.industry} | {result.companySize} medarbetare | {result.baseRequirements.length} funktionsområden
                      </p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      <Eye className="h-3 w-3 mr-1" /> Förhandsvisning
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Product recommendation */}
              {result.aiEnrichment.productRecommendation && (
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      Rekommenderad produktkombination
                      <Badge variant="secondary" className="text-xs">AI-genererat</Badge>
                    </h3>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {result.aiEnrichment.productRecommendation.recommendation}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {result.aiEnrichment.productRecommendation.rationale}
                    </p>
                  </CardContent>
                </Card>
              )}

              {result.baseRequirements.map((req) => (
                <Card key={req.category}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {categoryLabels[req.category] || req.category}
                    </h3>
                    {req.sections.map((section) => (
                      <div key={section.area} className="mb-4 last:mb-0">
                        <h4 className="text-sm font-semibold text-foreground mb-2">{section.area}</h4>
                        <ul className="space-y-1">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1.5 block w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {result.aiEnrichment.industryRequirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    Branschspecifika krav – {result.industry}
                    <Badge variant="secondary" className="text-xs">AI-genererat</Badge>
                  </h3>
                  {result.aiEnrichment.industryRequirements.map((req, i) => (
                    <Card key={i} className="mb-3">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-foreground">{req.area}</h4>
                          <Badge className={`text-xs ${priorityColors[req.priority] || ""}`}>
                            {priorityLabels[req.priority] || req.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground italic mb-3">{req.rationale}</p>
                        <ul className="space-y-1">
                          {req.items.map((item, j) => (
                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {result.aiEnrichment.kpis.length > 0 && (
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Föreslagna KPI:er</h3>
                    {result.aiEnrichment.kpis.slice(0, 2).map((kpi, i) => (
                      <div key={i} className="mb-3 last:mb-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">{kpi.name}</span>
                          <span className="text-xs text-primary font-medium">Mål: {kpi.target}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{kpi.description}</p>
                      </div>
                    ))}
                    {result.aiEnrichment.kpis.length > 2 && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent flex items-end justify-center pb-4">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          +{result.aiEnrichment.kpis.length - 2} KPI:er i den fullständiga PDF:en
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        Ladda ner komplett kravspecifikation (PDF)
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Inkluderar alla funktionskrav, branschkrav, KPI:er, produktrekommendation och integrationsförslag.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="din@epost.se"
                        className="sm:w-48 bg-background/80"
                        disabled={isDownloading}
                      />
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading || !email}
                        className="whitespace-nowrap"
                      >
                        {isDownloading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Laddar...</>
                        ) : (
                          <><Download className="mr-2 h-4 w-4" /> Ladda ner PDF</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="ghost" onClick={() => { setStep(1); setResult(null); }}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Skapa ny kravspecifikation
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka
              </Button>

              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                  Nästa <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleGenerate} disabled={!canProceed() || isGenerating}>
                  {isGenerating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Genererar...</>
                  ) : (
                    <><FileText className="mr-2 h-4 w-4" /> Generera kravspecifikation</>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RequirementsSpec;
