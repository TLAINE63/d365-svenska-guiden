import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Step = "intro" | "company-size" | "improvement" | "approach" | "recommendations";

const InteractiveGuide = () => {
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [companySize, setCompanySize] = useState<string>("");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [approach, setApproach] = useState<string>("");

  const handleCompanySizeSelect = (value: string) => {
    setCompanySize(value);
    setCurrentStep("improvement");
  };

  const toggleImprovement = (value: string) => {
    setImprovements(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleImprovementNext = () => {
    if (improvements.length > 0) {
      setCurrentStep("approach");
    }
  };

  const handleApproachSelect = (value: string) => {
    setApproach(value);
    setCurrentStep("recommendations");
  };

  const getRecommendations = () => {
    const recommendations = new Set<string>();

    // Baserat på företagsstorlek och förbättringsområden
    const hasERP = improvements.some(imp => ["ekonomi", "lager", "tillverkning"].includes(imp));
    
    if (companySize === "small" && hasERP) {
      recommendations.add("Business Central");
    } else if (companySize === "large" && hasERP) {
      recommendations.add("Finance & Supply Chain Management");
    }

    // Baserat på specifika förbättringsområden
    if (improvements.includes("försäljning")) {
      recommendations.add("Dynamics 365 Sales");
    }
    
    if (improvements.includes("kundservice")) {
      recommendations.add("Dynamics 365 Customer Service");
      recommendations.add("Contact Center");
    }
    
    if (improvements.includes("projekt")) {
      recommendations.add("Dynamics 365 Project Operations");
    }

    return Array.from(recommendations);
  };

  const recommendations = currentStep === "recommendations" ? getRecommendations() : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          {currentStep === "intro" && (
            <div className="text-center space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Hitta rätt Dynamics 365-lösning för din verksamhet
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Välkommen till vår interaktiva guide! Här hjälper vi dig att identifiera vilken Dynamics 365-lösning som passar bäst för din verksamhet – oavsett om du söker ett nytt ERP-system, CRM-lösning eller en kombination.
                </p>
              </div>
              
              <Button 
                size="lg"
                onClick={() => setCurrentStep("company-size")}
                className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0"
              >
                Börja här
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Fråga 1: Företagsstorlek */}
          {currentStep === "company-size" && (
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Hur ser din verksamhet ut?</CardTitle>
                <CardDescription>Välj det alternativ som bäst beskriver ert företag</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup onValueChange={handleCompanySizeSelect} className="space-y-4">
                  <div
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleCompanySizeSelect("small")}
                  >
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">
                        Vi är ett mindre eller medelstort företag (1–250 anställda)
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Rekommendation: Business Central
                      </div>
                    </Label>
                  </div>

                  <div
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleCompanySizeSelect("large")}
                  >
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">
                        Vi är ett större företag eller koncern (250+ anställda)
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Rekommendation: Finance & Supply Chain Management
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Fråga 2: Förbättringsområde */}
          {currentStep === "improvement" && (
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Vad vill ni främst förbättra?</CardTitle>
                <CardDescription>Välj ett eller flera områden som är viktiga för er verksamhet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      improvements.includes("ekonomi") ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                    onClick={() => toggleImprovement("ekonomi")}
                  >
                    <Checkbox 
                      id="ekonomi" 
                      checked={improvements.includes("ekonomi")}
                      onCheckedChange={() => toggleImprovement("ekonomi")}
                    />
                    <Label htmlFor="ekonomi" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Ekonomi och redovisning</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Se ERP-lösningar (Business Central eller F&SCM)
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      improvements.includes("lager") ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                    onClick={() => toggleImprovement("lager")}
                  >
                    <Checkbox 
                      id="lager" 
                      checked={improvements.includes("lager")}
                      onCheckedChange={() => toggleImprovement("lager")}
                    />
                    <Label htmlFor="lager" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Lager, logistik och inköp</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Se ERP-lösningar (Business Central eller F&SCM)
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      improvements.includes("tillverkning") ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                    onClick={() => toggleImprovement("tillverkning")}
                  >
                    <Checkbox 
                      id="tillverkning" 
                      checked={improvements.includes("tillverkning")}
                      onCheckedChange={() => toggleImprovement("tillverkning")}
                    />
                    <Label htmlFor="tillverkning" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Tillverkning och produktion</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Se ERP-lösningar (Business Central eller F&SCM)
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      improvements.includes("försäljning") ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                    onClick={() => toggleImprovement("försäljning")}
                  >
                    <Checkbox 
                      id="försäljning" 
                      checked={improvements.includes("försäljning")}
                      onCheckedChange={() => toggleImprovement("försäljning")}
                    />
                    <Label htmlFor="försäljning" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Försäljning och kundrelationer</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Se Customer Engagement-lösningar
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      improvements.includes("kundservice") ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                    onClick={() => toggleImprovement("kundservice")}
                  >
                    <Checkbox 
                      id="kundservice" 
                      checked={improvements.includes("kundservice")}
                      onCheckedChange={() => toggleImprovement("kundservice")}
                    />
                    <Label htmlFor="kundservice" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Kundservice och support</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Se Customer Engagement-lösningar
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      improvements.includes("projekt") ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                    }`}
                    onClick={() => toggleImprovement("projekt")}
                  >
                    <Checkbox 
                      id="projekt" 
                      checked={improvements.includes("projekt")}
                      onCheckedChange={() => toggleImprovement("projekt")}
                    />
                    <Label htmlFor="projekt" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Projektstyrning och resursplanering</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Se Customer Engagement-lösningar
                      </div>
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleImprovementNext}
                  disabled={improvements.length === 0}
                  className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0"
                >
                  Fortsätt
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Fråga 3: Approach */}
          {currentStep === "approach" && (
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Vill ni ha en helhetslösning eller börja i liten skala?</CardTitle>
                <CardDescription>Välj det tillvägagångssätt som passar er bäst</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup onValueChange={handleApproachSelect} className="space-y-4">
                  <div
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleApproachSelect("small")}
                  >
                    <RadioGroupItem value="small" id="small-approach" />
                    <Label htmlFor="small-approach" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Vi vill börja enkelt och växa över tid</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → Business Central eller Sales/Customer Service
                      </div>
                    </Label>
                  </div>

                  <div
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleApproachSelect("complete")}
                  >
                    <RadioGroupItem value="complete" id="complete-approach" />
                    <Label htmlFor="complete-approach" className="flex-1 cursor-pointer">
                      <div className="font-medium text-card-foreground">Vi behöver en komplett lösning från start</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        → F&SCM + Customer Engagement + Project Operations
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {currentStep === "recommendations" && (
            <div className="space-y-8">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Dina Rekommendationer</h2>
                <p className="text-lg text-muted-foreground">
                  Baserat på dina svar rekommenderar vi följande Dynamics 365-appar
                </p>
              </div>

              {/* Recommendations Cards */}
              {recommendations.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="p-6 border-2 border-primary/20 hover:border-primary transition-colors">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{rec}</h3>
                    </Card>
                  ))}
                </div>
              )}

              {/* Table */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Vilka Dynamics 365-appar kan vara aktuella för er?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Behov</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Rekommenderad app</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Ekonomi, bokföring, fakturering</td>
                          <td className="py-3 px-4 text-foreground">Business Central eller Finance</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Lager, logistik, inköp</td>
                          <td className="py-3 px-4 text-foreground">Business Central eller Supply Chain Management</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Tillverkning</td>
                          <td className="py-3 px-4 text-foreground">Business Central (enkel) eller F&SCM (avancerad)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Försäljning & CRM</td>
                          <td className="py-3 px-4 text-foreground">Dynamics 365 Sales</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Marknadsföring</td>
                          <td className="py-3 px-4 text-foreground">Dynamics 365 Marketing</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">Kundservice & kontaktcenter</td>
                          <td className="py-3 px-4 text-foreground">Dynamics 365 Customer Service / Contact Center</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-muted-foreground">Projektstyrning</td>
                          <td className="py-3 px-4 text-foreground">Dynamics 365 Project Operations</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Vill du ha hjälp att välja?</h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Kontakta oss så hjälper vi dig att kartlägga era behov, jämföra licensalternativ och planera implementation
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                      <Link to="/kontakt">Boka en kostnadsfri rådgivning</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/konfigurator">Testa avancerad konfigurator</Link>
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={() => {
                    setCurrentStep("intro");
                    setCompanySize("");
                    setImprovements([]);
                    setApproach("");
                  }}
                  variant="ghost"
                >
                  Starta om guiden
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveGuide;
