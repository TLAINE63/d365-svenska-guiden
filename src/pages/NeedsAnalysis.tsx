import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Building2, Globe, Boxes, Link2, Server, AlertTriangle, BarChart3, Sparkles, FileText, CheckCircle2 } from "lucide-react";

interface AnalysisData {
  // Step 1
  employees: string;
  revenue: string;
  // Step 2
  industries: string[];
  industryOther: string;
  // Step 3
  geography: string[];
  geographyOther: string;
  // Step 4
  modules: string[];
  modulesOther: string;
  // Step 5
  integrations: string[];
  integrationsOther: string;
  // Step 6
  currentERP: string;
  erpInstallYear: string;
  otherSystems: string[];
  otherSystemsDetails: string;
  // Step 7
  challenges: string[];
  challengesOther: string;
  // Step 8
  kpis: string[];
  kpisOther: string;
  // Step 9
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  // Step 10
  additionalInfo: string;
  // Contact info
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

const initialData: AnalysisData = {
  employees: "",
  revenue: "",
  industries: [],
  industryOther: "",
  geography: [],
  geographyOther: "",
  modules: [],
  modulesOther: "",
  integrations: [],
  integrationsOther: "",
  currentERP: "",
  erpInstallYear: "",
  otherSystems: [],
  otherSystemsDetails: "",
  challenges: [],
  challengesOther: "",
  kpis: [],
  kpisOther: "",
  aiInterest: "",
  aiUseCases: [],
  aiDetails: "",
  additionalInfo: "",
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
};

const employeeOptions = [
  "< 10",
  "10-49",
  "50-199",
  "200-499",
  "500-999",
  "1.000-4.999",
  "> 5.000",
];

const revenueOptions = [
  "< 49 MSEK",
  "50-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  "> 5.000 MSEK",
];

const industryOptions = [
  "Tillverkning",
  "Distribution & Grossist",
  "Detaljhandel",
  "Bygg & Fastighet",
  "Professionella tjänster",
  "Transport & Logistik",
  "Livsmedel & Dryck",
  "Läkemedel & Life Science",
  "Energi & Utilities",
  "Finans & Försäkring",
];

const geographyOptions = [
  "Endast Sverige",
  "Norden",
  "Europa",
  "Globalt",
  "Specifika länder",
];

const moduleOptions = [
  "Ekonomi & Redovisning",
  "Försäljning & CRM",
  "Inköp & Leverantörer",
  "Lager & Logistik",
  "Tillverkning & Produktion",
  "Projekthantering",
  "Service & Fältservice",
  "HR & Lönehantering",
  "E-handel",
  "Business Intelligence & Rapportering",
];

const integrationOptions = [
  "Bank & Betalningar",
  "E-handelsplattform",
  "EDI / Peppol",
  "CRM-system",
  "Lönesystem",
  "Transportbokning",
  "Webshop",
  "API:er till kundsystem",
  "Microsoft 365",
  "Power Platform",
];

const erpSystemOptions = [
  "Microsoft Dynamics 365 Business Central",
  "Microsoft Dynamics NAV",
  "Microsoft Dynamics AX",
  "SAP",
  "Oracle",
  "Visma",
  "Fortnox",
  "Pyramid",
  "Monitor",
  "Jeeves",
  "IFS",
  "Infor",
  "Sage",
  "Manuella processer / Excel",
  "Annat system",
];

const otherSystemOptions = [
  "Microsoft 365 (Office)",
  "Power BI",
  "Salesforce",
  "HubSpot",
  "Zendesk",
  "Jira",
  "Slack / Teams",
  "SharePoint",
  "Adobe Creative Cloud",
  "CAD-system",
];

const challengeOptions = [
  "Bristande översikt och rapportering",
  "Manuella och tidskrävande processer",
  "Dålig integration mellan system",
  "Svårt att skala verksamheten",
  "Höga underhållskostnader",
  "Föråldrad teknik utan support",
  "Bristande mobilitet och tillgänglighet",
  "Svårt att hitta kompetens",
  "Regulatoriska krav (GDPR, etc.)",
  "Behov av bättre kundinsikter",
];

const kpiOptions = [
  "Omsättning och tillväxt",
  "Bruttomarginal",
  "Lagervärde och omsättningshastighet",
  "Kundnöjdhet (NPS/CSAT)",
  "Leveransprecision",
  "Produktivitet per anställd",
  "Kassaflöde",
  "Ordervärde (AOV)",
  "Ledtider i produktion",
  "Kostnad per order",
];

const aiUseCaseOptions = [
  "Automatiserad fakturering och bokföring",
  "Intelligent kundservice (chatbots)",
  "Försäljningsprognoser",
  "Lageroptimering",
  "Produktionsplanering",
  "Dokumenthantering och analys",
  "Prediktivt underhåll",
  "Automatiserad rapportgenerering",
  "Personaliserade kundupplevelser",
];

const NeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AnalysisData>(initialData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [
    Building2, Globe, Globe, Boxes, Link2, Server, AlertTriangle, BarChart3, Sparkles, FileText
  ];

  const stepTitles = [
    "Företagsstorlek",
    "Bransch",
    "Geografi",
    "Funktioner & Moduler",
    "Integrationer",
    "Nuvarande System",
    "Utmaningar",
    "Nyckeltal",
    "AI & Framtid",
    "Övrig Information",
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowContactForm(true);
    }
  };

  const handleBack = () => {
    if (showContactForm) {
      setShowContactForm(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (field: keyof AnalysisData, value: string) => {
    const currentValues = data[field] as string[];
    if (currentValues.includes(value)) {
      setData({ ...data, [field]: currentValues.filter((v) => v !== value) });
    } else {
      setData({ ...data, [field]: [...currentValues, value] });
    }
  };

  const generateDocument = () => {
    const content = `
BEHOVSANALYS - DYNAMICS 365 ERP
================================
Genererad: ${new Date().toLocaleDateString('sv-SE')}

KONTAKTINFORMATION
------------------
Företag: ${data.companyName}
Kontaktperson: ${data.contactName}
Telefon: ${data.phone}
E-post: ${data.email}

1. FÖRETAGSSTORLEK
------------------
Antal anställda: ${data.employees}
Omsättning: ${data.revenue}

2. BRANSCH
----------
${data.industries.join(', ')}${data.industryOther ? `\nÖvrigt: ${data.industryOther}` : ''}

3. GEOGRAFI
-----------
${data.geography.join(', ')}${data.geographyOther ? `\nSpecifika marknader: ${data.geographyOther}` : ''}

4. FUNKTIONER & MODULER
-----------------------
${data.modules.join(', ')}${data.modulesOther ? `\nÖvriga behov: ${data.modulesOther}` : ''}

5. INTEGRATIONER
----------------
${data.integrations.join(', ')}${data.integrationsOther ? `\nÖvriga integrationer: ${data.integrationsOther}` : ''}

6. NUVARANDE SYSTEM
-------------------
Nuvarande ERP: ${data.currentERP}
Installationsår: ${data.erpInstallYear || 'Ej angivet'}
Övriga system: ${data.otherSystems.join(', ')}${data.otherSystemsDetails ? `\nDetaljer: ${data.otherSystemsDetails}` : ''}

7. UTMANINGAR
-------------
${data.challenges.join(', ')}${data.challengesOther ? `\nÖvriga utmaningar: ${data.challengesOther}` : ''}

8. NYCKELTAL
------------
${data.kpis.join(', ')}${data.kpisOther ? `\nÖvriga nyckeltal: ${data.kpisOther}` : ''}

9. AI & FRAMTID
---------------
Intresse för AI: ${data.aiInterest}
Användningsområden: ${data.aiUseCases.join(', ')}${data.aiDetails ? `\nDetaljer: ${data.aiDetails}` : ''}

10. ÖVRIG INFORMATION
---------------------
${data.additionalInfo || 'Ingen övrig information angiven.'}

================================
Detta dokument är genererat via Dynamic Factory Behovsanalys.
Kontakta oss för en djupare genomgång: thomas.laine@dynamicfactory.se
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Behovsanalys_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsComplete(true);
  };

  const isContactFormValid = () => {
    return data.companyName && data.contactName && data.phone && data.email;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Antal anställda</h3>
              <RadioGroup
                value={data.employees}
                onValueChange={(value) => setData({ ...data, employees: value })}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              >
                {employeeOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`emp-${option}`} />
                    <Label htmlFor={`emp-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Omsättning</h3>
              <RadioGroup
                value={data.revenue}
                onValueChange={(value) => setData({ ...data, revenue: value })}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {revenueOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`rev-${option}`} />
                    <Label htmlFor={`rev-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Välj en eller flera branscher som bäst beskriver er verksamhet.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ind-${option}`}
                    checked={data.industries.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('industries', option)}
                  />
                  <Label htmlFor={`ind-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="industryOther">Annan bransch</Label>
              <Input
                id="industryOther"
                placeholder="Ange annan bransch..."
                value={data.industryOther}
                onChange={(e) => setData({ ...data, industryOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Var bedriver ni er verksamhet?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {geographyOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`geo-${option}`}
                    checked={data.geography.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('geography', option)}
                  />
                  <Label htmlFor={`geo-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="geographyOther">Specifika länder/marknader</Label>
              <Input
                id="geographyOther"
                placeholder="Ange specifika marknader..."
                value={data.geographyOther}
                onChange={(e) => setData({ ...data, geographyOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka funktioner och moduler är viktigast för er verksamhet?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moduleOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mod-${option}`}
                    checked={data.modules.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('modules', option)}
                  />
                  <Label htmlFor={`mod-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="modulesOther">Övriga funktioner</Label>
              <Textarea
                id="modulesOther"
                placeholder="Beskriv övriga funktioner ni behöver..."
                value={data.modulesOther}
                onChange={(e) => setData({ ...data, modulesOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka integrationer behöver ni mot andra system?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {integrationOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`int-${option}`}
                    checked={data.integrations.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('integrations', option)}
                  />
                  <Label htmlFor={`int-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="integrationsOther">Övriga integrationer</Label>
              <Textarea
                id="integrationsOther"
                placeholder="Beskriv övriga integrationsbehov..."
                value={data.integrationsOther}
                onChange={(e) => setData({ ...data, integrationsOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nuvarande ERP-system</h3>
              <RadioGroup
                value={data.currentERP}
                onValueChange={(value) => setData({ ...data, currentERP: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {erpSystemOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`erp-${option}`} />
                    <Label htmlFor={`erp-${option}`} className="cursor-pointer text-sm">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="erpInstallYear">Installationsår (ungefärligt)</Label>
              <Input
                id="erpInstallYear"
                type="number"
                placeholder="T.ex. 2015"
                value={data.erpInstallYear}
                onChange={(e) => setData({ ...data, erpInstallYear: e.target.value })}
                className="mt-2 max-w-[150px]"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Övriga system i verksamheten</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherSystemOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`other-${option}`}
                      checked={data.otherSystems.includes(option)}
                      onCheckedChange={() => handleCheckboxChange('otherSystems', option)}
                    />
                    <Label htmlFor={`other-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="otherSystemsDetails">Övriga systemdetaljer</Label>
              <Textarea
                id="otherSystemsDetails"
                placeholder="Beskriv eventuella övriga system..."
                value={data.otherSystemsDetails}
                onChange={(e) => setData({ ...data, otherSystemsDetails: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka utmaningar upplever ni som behöver hanteras i ett nytt affärssystem?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challengeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chal-${option}`}
                    checked={data.challenges.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('challenges', option)}
                  />
                  <Label htmlFor={`chal-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="challengesOther">Övriga utmaningar</Label>
              <Textarea
                id="challengesOther"
                placeholder="Beskriv övriga utmaningar..."
                value={data.challengesOther}
                onChange={(e) => setData({ ...data, challengesOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka nyckeltal är viktigast för er verksamhet att följa och förbättra?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kpiOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`kpi-${option}`}
                    checked={data.kpis.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('kpis', option)}
                  />
                  <Label htmlFor={`kpi-${option}`} className="cursor-pointer">{option}</Label>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="kpisOther">Övriga nyckeltal</Label>
              <Textarea
                id="kpisOther"
                placeholder="Beskriv övriga nyckeltal..."
                value={data.kpisOther}
                onChange={(e) => setData({ ...data, kpisOther: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hur intresserade är ni av AI i affärssystemet?</h3>
              <RadioGroup
                value={data.aiInterest}
                onValueChange={(value) => setData({ ...data, aiInterest: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mycket intresserade" id="ai-high" />
                  <Label htmlFor="ai-high" className="cursor-pointer">Mycket intresserade - Vi vill vara i framkant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ganska intresserade" id="ai-medium" />
                  <Label htmlFor="ai-medium" className="cursor-pointer">Ganska intresserade - Vi vill utforska möjligheterna</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Avvaktande" id="ai-low" />
                  <Label htmlFor="ai-low" className="cursor-pointer">Avvaktande - Vi vill se konkreta användningsfall först</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Inte intresserade just nu" id="ai-none" />
                  <Label htmlFor="ai-none" className="cursor-pointer">Inte intresserade just nu</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Vilka AI-användningsområden ser ni som mest intressanta?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiUseCaseOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ai-${option}`}
                      checked={data.aiUseCases.includes(option)}
                      onCheckedChange={() => handleCheckboxChange('aiUseCases', option)}
                    />
                    <Label htmlFor={`ai-${option}`} className="cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="aiDetails">Beskriv hur AI skulle kunna hjälpa er verksamhet</Label>
              <Textarea
                id="aiDetails"
                placeholder="Beskriv era tankar om AI..."
                value={data.aiDetails}
                onChange={(e) => setData({ ...data, aiDetails: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Finns det något övrigt ni vill berätta om ert projekt eller era behov?</p>
            <Textarea
              placeholder="Skriv fritt om era tankar, frågor eller specifika krav..."
              value={data.additionalInfo}
              onChange={(e) => setData({ ...data, additionalInfo: e.target.value })}
              className="min-h-[200px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center">
              <CardContent className="pt-12 pb-8">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Tack för din behovsanalys!</h2>
                <p className="text-muted-foreground mb-6">
                  Ditt dokument har laddats ned. Vi kommer att kontakta dig inom kort för att diskutera era behov och hur vi kan hjälpa er.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-primary">
                    <a href="mailto:thomas.laine@dynamicfactory.se">
                      Kontakta oss direkt
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setData(initialData);
                      setCurrentStep(1);
                      setShowContactForm(false);
                      setIsComplete(false);
                    }}
                  >
                    Starta ny analys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Behovsanalys för Dynamics 365 ERP
            </h1>
            <p className="text-muted-foreground text-lg">
              Svara på frågorna nedan för att få en personlig rekommendation och analys
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {showContactForm ? "Kontaktuppgifter" : `Steg ${currentStep} av ${totalSteps}`}
              </span>
              <span className="text-sm text-muted-foreground">
                {showContactForm ? "100%" : `${Math.round(progress)}%`}
              </span>
            </div>
            <Progress value={showContactForm ? 100 : progress} className="h-2" />
          </div>

          {/* Step indicators */}
          {!showContactForm && (
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {stepTitles.map((title, index) => {
                const Icon = stepIcons[index];
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(stepNum)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{title}</span>
                    <span className="sm:hidden">{stepNum}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {showContactForm ? (
                  <>
                    <Download className="w-6 h-6 text-primary" />
                    Ladda ned din behovsanalys
                  </>
                ) : (
                  <>
                    {(() => {
                      const Icon = stepIcons[currentStep - 1];
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()}
                    {stepTitles[currentStep - 1]}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showContactForm ? (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Fyll i dina kontaktuppgifter för att ladda ned din personliga behovsanalys.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Företagsnamn *</Label>
                      <Input
                        id="companyName"
                        placeholder="Ditt företag AB"
                        value={data.companyName}
                        onChange={(e) => setData({ ...data, companyName: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactName">Ditt namn *</Label>
                      <Input
                        id="contactName"
                        placeholder="Förnamn Efternamn"
                        value={data.contactName}
                        onChange={(e) => setData({ ...data, contactName: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefonnummer *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+46 70 123 45 67"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-postadress *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="namn@foretag.se"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                renderStep()
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 && !showContactForm}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tillbaka
                </Button>
                {showContactForm ? (
                  <Button
                    onClick={generateDocument}
                    disabled={!isContactFormValid()}
                    className="bg-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Ladda ned dokument
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-primary">
                    {currentStep === totalSteps ? "Slutför" : "Nästa"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NeedsAnalysis;
