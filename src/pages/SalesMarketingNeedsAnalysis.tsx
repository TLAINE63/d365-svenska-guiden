import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Users, Megaphone, Target, Building2, BarChart3, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import jsPDF from "jspdf";
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
  contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  phone: z.string().trim().max(20, "Telefonnummer får max vara 20 tecken").optional(),
  email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface SalesMarketingAnalysisData {
  employees: string;
  industry: string;
  industryOther: string;
  salesTeamSize: string;
  currentSystems: { product: string; year: string }[];
  otherSystemsDetails: string;
  situationChallenges: Record<string, string>;
  currentSituationReason: string;
  salesNeeds: string[];
  salesNeedsOther: string;
  salesProcessComplexity: string;
  marketingNeeds: string[];
  marketingNeedsOther: string;
  marketingChannels: string[];
  integrations: string[];
  integrationsOther: string;
  kpis: string[];
  kpisOther: string;
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  wishlist: string;
  additionalInfo: string;
  currentPartners: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

const initialData: SalesMarketingAnalysisData = {
  employees: "",
  industry: "",
  industryOther: "",
  salesTeamSize: "",
  currentSystems: [
    { product: "", year: "" },
    { product: "", year: "" },
    { product: "", year: "" },
  ],
  otherSystemsDetails: "",
  situationChallenges: {},
  currentSituationReason: "",
  salesNeeds: [],
  salesNeedsOther: "",
  salesProcessComplexity: "",
  marketingNeeds: [],
  marketingNeedsOther: "",
  marketingChannels: [],
  integrations: [],
  integrationsOther: "",
  kpis: [],
  kpisOther: "",
  aiInterest: "",
  aiUseCases: [],
  aiDetails: "",
  wishlist: "",
  additionalInfo: "",
  currentPartners: "",
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
};

const employeeOptions = [
  "1-49 anställda",
  "50-99 anställda",
  "100-249 anställda",
  "250-999 anställda",
  "1.000-4.999 anställda",
  "Mer än 5.000 anställda",
];

const industryOptions = [
  "Tillverkningsindustrin",
  "Handel (Retail & eCommerce)",
  "Grossist/Distribution",
  "Bank & Försäkring",
  "Bygg & Entreprenad",
  "Hälso- & sjukvård",
  "Life Science",
  "Konsulttjänster",
  "Offentlig sektor",
  "Energi & Utilities",
  "Transport & Logistik",
  "Fastigheter",
  "Medlemsorganisationer",
  "Utbildning",
  "Nonprofit",
];

const teamSizeOptions = [
  "1-5",
  "6-15",
  "16-50",
  "51-100",
  "100+",
];


// CRM Situation challenge categories
const situationChallengeCategories = [
  {
    id: "lead_to_cash",
    title: "Lead-to-cash är trasigt",
    subtitle: "Leads konverteras i CRM men dör i överlämningen",
    items: [
      "Order läggs manuellt i ERP",
      "Ingen spårbarhet från kampanj → intäkt",
    ],
    quote: "\"Vi vet inte vilka kampanjer som faktiskt ger affär.\"",
    quoteSource: "Sälj/Marknad säger:",
  },
  {
    id: "offerter_prissattning",
    title: "Offerter och prissättning är manuella",
    subtitle: "Priser ligger i Excel eller \"i huvudet på seniora säljare\"",
    items: [
      "Rabatter ges utan kontroll",
      "Offerter tar dagar istället för timmar",
    ],
    quote: "\"Vi tappar affärer på ledtid – inte på pris.\"",
    quoteSource: "Sälj säger:",
  },
  {
    id: "crm_sanning",
    title: "CRM saknar \"sanning\"",
    subtitle: "Kunddata skiljer sig mellan CRM, ERP och fakturering",
    items: [
      "Sälj litar inte på systemet → jobbar utanför",
      "Prognoser är mer gissning än fakta",
    ],
    quote: "\"Vi kan inte styra försäljningen på magkänsla.\"",
    quoteSource: "Ledningens reaktion:",
  },
  {
    id: "produktivitet",
    title: "Systemet bromsar säljarnas produktivitet",
    subtitle: "Mycket administration, för lite kundtid",
    items: [
      "Dubbelregistrering i flera system",
      "Mobilitet och användarupplevelse är usel",
    ],
    quote: "CRM uppdateras i efterhand – om alls.",
    quoteSource: "Säljarnas beteende:",
  },
  {
    id: "go_to_market",
    title: "Nya go-to-market-initiativ faller",
    subtitle: "ABM, inbound, partnerförsäljning går inte att stödja",
    items: [
      "Marketing automation saknar korrekt masterdata",
      "Kampanjer kan inte personaliseras",
    ],
    quote: "\"Vi har verktyg – men ingen fungerande grund.\"",
    quoteSource: "Marknad säger:",
  },
  {
    id: "kundupplevelse",
    title: "Kundupplevelsen blir inkonsekvent",
    subtitle: "Kunden får olika svar från sälj, support och ekonomi",
    items: [
      "Ingen ser helheten: avtal, order, leverans, fakturor",
      "Uppföljning sker för sent",
    ],
    quote: "Kunder börjar klaga eller byta leverantör.",
    quoteSource: "Extern signal:",
  },
];

const situationChallengeOptions = ["Betydande utmaning", "Viss utmaning", "Inget problem idag"];

const salesNeedOptions = [
  "Lead-hantering och kvalificering",
  "Opportunity management",
  "Säljprognoser och pipeline-hantering",
  "Offerthantering",
  "Account management",
  "Territory management",
  "Säljaktiviteter och uppgifter",
  "Produktkatalog och prissättning",
  "Konkurrensspårning",
  "Partner/Kanalförsäljning",
];

const salesComplexityOptions = [
  "Enkel (kort säljcykel, få steg)",
  "Medel (viss komplexitet, flera beslutsfattare)",
  "Komplex (lång säljcykel, många intressenter)",
  "Mycket komplex (stora projekt, upphandlingar)",
];

const marketingNeedOptions = [
  "E-postmarknadsföring",
  "Marketing automation",
  "Lead scoring och nurturing",
  "Kampanjhantering",
  "Event management",
  "Landningssidor och formulär",
  "Social media marketing",
  "Kundresor (customer journeys)",
  "Segmentering",
  "A/B-testning",
];

const marketingChannelOptions = [
  "E-post",
  "Social media",
  "Webbsida",
  "SMS",
  "Events/Webinars",
  "Digital annonsering",
  "Print/Direct mail",
];

const integrationOptions = [
  "Microsoft 365 (Outlook, Teams)",
  "LinkedIn Sales Navigator",
  "ERP-system",
  "Ekonomisystem",
  "E-handelsplattform",
  "Marketing automation-verktyg",
  "Power BI",
  "Azure / molntjänster",
];

const kpiOptions = [
  "Säljkonvertering (lead to close)",
  "Genomsnittligt ordervärde",
  "Customer Lifetime Value (CLV)",
  "Win rate",
  "Pipeline-värde",
  "Marketing ROI",
  "Lead-kvalitet",
  "Kampanjeffektivitet",
];

const aiUseCaseOptions = [
  "Prediktiv lead scoring",
  "Intelligenta säljrekommendationer",
  "E-postassistent (AI-genererad text)",
  "Insikter från kunddata",
  "Automatiserade arbetsflöden",
  "Nästa bästa åtgärd (NBA)",
  "Content-generering för marknadsföring",
  "Konversationsintelligens (samtalsanalys och coaching)",
  "AI-assisterad pipeline-prognos",
  "Kundsegmentering och lookalike-audiences",
  "Personaliserade kundresor",
  "A/B-testoptimering med AI",
  "Social listening och varumärkesbevakning",
  "Automatiserad mötesbokning och uppföljning",
];

const SalesMarketingNeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SalesMarketingAnalysisData>(initialData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [Building2, Target, Target, Target, Sparkles, BarChart3, FileText];
  const stepTitles = [
    "Företagsinformation",
    "Nuvarande Situation",
    "Utmaningar",
    "Integrationer",
    "Önskelista",
    "KPI & AI",
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

  const handleCheckboxChange = (field: keyof SalesMarketingAnalysisData, value: string) => {
    const currentValues = data[field] as string[];
    if (currentValues.includes(value)) {
      setData({ ...data, [field]: currentValues.filter((v) => v !== value) });
    } else {
      setData({ ...data, [field]: [...currentValues, value] });
    }
  };

  const handleSituationChallengeChange = (categoryId: string, value: string) => {
    setData({
      ...data,
      situationChallenges: {
        ...data.situationChallenges,
        [categoryId]: value,
      },
    });
  };

  const getRecommendation = () => {
    const recommendations: { sales: { score: number; reasons: string[] }; marketing: { score: number; reasons: string[] } } = {
      sales: { score: 0, reasons: [] },
      marketing: { score: 0, reasons: [] },
    };

    if (data.salesNeeds.length > 0) {
      recommendations.sales.score += data.salesNeeds.length * 5;
      recommendations.sales.reasons.push(`${data.salesNeeds.length} säljfunktioner identifierade`);
    }
    if (data.salesProcessComplexity.includes("Komplex") || data.salesProcessComplexity.includes("Mycket komplex")) {
      recommendations.sales.score += 20;
      recommendations.sales.reasons.push("Komplex säljprocess kräver avancerat säljstöd");
    }
    if (data.salesTeamSize && data.salesTeamSize !== "1-5") {
      recommendations.sales.score += 15;
      recommendations.sales.reasons.push("Större säljteam behöver strukturerat CRM-stöd");
    }

    if (data.marketingNeeds.length > 0) {
      recommendations.marketing.score += data.marketingNeeds.length * 5;
      recommendations.marketing.reasons.push(`${data.marketingNeeds.length} marknadsföringsfunktioner identifierade`);
    }
    if (data.marketingChannels.length >= 3) {
      recommendations.marketing.score += 15;
      recommendations.marketing.reasons.push("Multichannel-marknadsföring kräver centraliserad plattform");
    }
    // Check for significant challenges
    const significantChallenges = Object.entries(data.situationChallenges).filter(
      ([_, value]) => value === "Betydande utmaning"
    );
    if (significantChallenges.length > 0) {
      recommendations.sales.score += significantChallenges.length * 5;
      recommendations.marketing.score += significantChallenges.length * 3;
      recommendations.sales.reasons.push(`${significantChallenges.length} betydande utmaningar identifierade`);
    }

    const products = [];
    if (recommendations.sales.score > 15) {
      products.push({
        name: "Dynamics 365 Sales",
        icon: "💼",
        score: recommendations.sales.score,
        reasons: recommendations.sales.reasons,
        description: "Microsofts ledande säljplattform för moderna säljteam med AI-driven insikter och pipeline-hantering.",
      });
    }
    if (recommendations.marketing.score > 15) {
      products.push({
        name: "Dynamics 365 Customer Insights (Marketing)",
        icon: "📣",
        score: recommendations.marketing.score,
        reasons: recommendations.marketing.reasons,
        description: "Skapa personaliserade kundupplevelser med marketing automation och kundresor.",
      });
    }

    return { products: products.sort((a, b) => b.score - a.score) };
  };

  const validateContactForm = (): boolean => {
    const result = contactFormSchema.safeParse({
      companyName: data.companyName,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
    });

    if (!result.success) {
      const errors: ContactFormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormErrors;
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setContactErrors(errors);
      return false;
    }

    setContactErrors({});
    return true;
  };

  const generateDocument = async () => {
    if (!validateContactForm()) return;
    
    const recommendation = getRecommendation();
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Header
    pdf.setFillColor(30, 58, 138);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("BEHOVSANALYS SÄLJ & MARKNAD", margin, 25);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Sales & Marketing", margin, 35);

    yPos = 60;

    // Contact info
    pdf.setFillColor(240, 245, 255);
    pdf.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'F');
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("KONTAKTINFORMATION", margin + 8, yPos + 12);
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.companyName, margin + 8, yPos + 22);
    pdf.text(data.contactName, margin + 8, yPos + 30);
    pdf.text(`E-post: ${data.email}`, pageWidth / 2, yPos + 22);
    
    yPos += 50;

    // Recommendations
    if (recommendation.products.length > 0) {
      pdf.setFillColor(30, 58, 138);
      pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("REKOMMENDERADE APPLIKATIONER", margin + 5, yPos + 8);
      yPos += 18;

      recommendation.products.forEach((product, index) => {
        pdf.setFillColor(240, 245, 255);
        pdf.roundedRect(margin, yPos, contentWidth, 25, 2, 2, 'F');
        pdf.setTextColor(30, 58, 138);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${index + 1}. ${product.name}`, margin + 5, yPos + 10);
        pdf.setTextColor(51, 51, 51);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text(product.description, margin + 5, yPos + 18);
        yPos += 30;
      });
    }

    // Summary sections
    const addSection = (title: string, content: string) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setFillColor(30, 58, 138);
      pdf.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, margin + 5, yPos + 7);
      yPos += 14;
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(content || "Ej angivet", contentWidth);
      pdf.text(lines, margin, yPos);
      yPos += lines.length * 5 + 8;
    };

    addSection("Företagsinformation", `Anställda: ${data.employees}, Bransch: ${data.industry || data.industryOther || "Ej angivet"}, Säljteam: ${data.salesTeamSize}`);
    const filledSystems = data.currentSystems.filter(s => s.product.trim());
    const systemsText = filledSystems.length > 0 
      ? filledSystems.map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ")
      : "Ej angivet";
    addSection("Nuvarande CRM", systemsText);
    const challengesText = Object.entries(data.situationChallenges)
      .filter(([_, value]) => value && value !== "Inget problem idag")
      .map(([key, value]) => {
        const category = situationChallengeCategories.find(c => c.id === key);
        return category ? `${category.title}: ${value}` : `${key}: ${value}`;
      })
      .join("; ") || "Ej angivet";
    addSection("Utmaningar", challengesText);
    addSection("Säljbehov", data.salesNeeds.join(", ") || "Ej angivet");
    addSection("Marknadsföringsbehov", data.marketingNeeds.join(", ") || "Ej angivet");
    addSection("Integrationer", data.integrations.join(", ") || "Ej angivet");
    addSection("KPI:er", data.kpis.join(", ") || "Ej angivet");

    // Generate PDF as base64 for email attachment
    const pdfFilename = `Behovsanalys_Salj_Marknad_${data.companyName || 'Analys'}_${new Date().toISOString().split('T')[0]}`;
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    
    // Save PDF locally
    pdf.save(`${pdfFilename}.pdf`);

    // Send email with PDF attachment
    setIsSendingEmail(true);
    try {
      await supabase.functions.invoke("send-analysis-email", {
        body: {
          analysisType: "Sälj & Marknad",
          companyName: data.companyName,
          contactName: data.contactName,
          phone: data.phone || "",
          email: data.email,
          analysisData: {
            "Anställda": data.employees,
            "Bransch": data.industry || data.industryOther || "Ej angivet",
            "Säljteam": data.salesTeamSize,
            "Nuvarande CRM": data.currentSystems.filter(s => s.product.trim()).map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ") || "Ej angivet",
            "Utmaningar": Object.entries(data.situationChallenges)
              .filter(([_, value]) => value && value !== "Inget problem idag")
              .map(([key, value]) => {
                const category = situationChallengeCategories.find(c => c.id === key);
                return category ? `${category.title}: ${value}` : `${key}: ${value}`;
              })
              .join("; ") || "Ej angivet",
            "Säljbehov": data.salesNeeds.join(", ") || "Ej angivet",
            "Marknadsföring": data.marketingNeeds.join(", ") || "Ej angivet",
            "Integrationer": data.integrations.join(", ") || "Ej angivet",
            "KPI:er": data.kpis.join(", ") || "Ej angivet",
            "AI-intresse": data.aiInterest || "Ej angivet",
          },
          recommendation: recommendation.products.length > 0 ? {
            product: recommendation.products.map(p => p.name).join(", "),
            reasons: recommendation.products.flatMap(p => p.reasons).slice(0, 5),
          } : undefined,
          pdfBase64: pdfBase64,
          pdfFilename: pdfFilename,
        },
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsSendingEmail(false);
    }

    setIsComplete(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Antal anställda i företaget</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {employeeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.employees === option}
                    onClick={() => setData({ ...data, employees: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Bransch</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industryOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.industry === option}
                    onClick={() => setData({ ...data, industry: option })}
                    type="radio"
                  />
                ))}
              </div>
              <div className="mt-3">
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
            <div>
              <Label className="text-base font-semibold mb-3 block">Storlek på säljteam</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {teamSizeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.salesTeamSize === option}
                    onClick={() => setData({ ...data, salesTeamSize: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nuvarande CRM-system</h3>
              <div className="border-2 border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-muted border-b-2 border-border">
                  <div className="p-3 font-medium text-sm">CRM-system (för Sälj- och/eller Marknadsavdelningen)</div>
                  <div className="p-3 font-medium text-sm border-l-2 border-border">Driftsattes år</div>
                </div>
                {data.currentSystems.map((system, index) => (
                  <div key={index} className={`grid grid-cols-2 ${index < data.currentSystems.length - 1 ? 'border-b-2 border-border' : ''}`}>
                    <div className="p-2">
                      <Input
                        placeholder=""
                        value={system.product}
                        onChange={(e) => {
                          const newSystems = [...data.currentSystems];
                          newSystems[index] = { ...newSystems[index], product: e.target.value };
                          setData({ ...data, currentSystems: newSystems });
                        }}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="p-2 border-l-2 border-border">
                      <Input
                        type="number"
                        placeholder="T.ex. 2020"
                        value={system.year}
                        onChange={(e) => {
                          const newSystems = [...data.currentSystems];
                          newSystems[index] = { ...newSystems[index], year: e.target.value };
                          setData({ ...data, currentSystems: newSystems });
                        }}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 max-w-[120px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="otherSystemsDetails">Övriga system som används i verksamheten</Label>
              <Textarea
                id="otherSystemsDetails"
                placeholder="Beskriv vilka övriga system som används, t.ex. e-handelsplattform, marketing automation, ekonomisystem..."
                value={data.otherSystemsDetails}
                onChange={(e) => setData({ ...data, otherSystemsDetails: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Vad är anledningen till att ni ser över ert CRM System (Sälj- och/eller Marketing Automation)?</h3>
            <Textarea
              id="currentSituationReason"
              placeholder="Beskriv er nuvarande situation och varför ni överväger ett nytt CRM-system..."
              value={data.currentSituationReason}
              onChange={(e) => setData({ ...data, currentSituationReason: e.target.value })}
              className="min-h-[150px]"
            />

            <div className="space-y-4">
              <p className="text-muted-foreground">
                Låt oss hjälpa dig på traven lite. Nedan listas några vanliga utmaningar som CRM-projekt (Sälj- och/eller Marketing Automation) brukar adressera. 
                Klicka gärna i de områden som stämmer för din verksamhet.
              </p>
              <div className="space-y-6">
                {situationChallengeCategories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-foreground">{category.title}</h4>
                      <p className="text-sm text-muted-foreground italic">{category.subtitle}</p>
                    </div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {category.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground font-medium">{category.quoteSource}</p>
                      <p className="text-sm italic text-foreground">{category.quote}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {situationChallengeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSituationChallengeChange(category.id, option)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            data.situationChallenges[category.id] === option
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka integrationer är viktiga för er?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrationOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.integrations.includes(option)}
                    onClick={() => handleCheckboxChange("integrations", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga integrationer..."
                value={data.integrationsOther}
                onChange={(e) => setData({ ...data, integrationsOther: e.target.value })}
                className="mt-3"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Om du fick önska fritt - vilka funktioner vill du få in i ett nytt CRM-system för sälj och/eller marknadsföring?</p>
            <div>
              <Textarea
                id="wishlist"
                placeholder="Beskriv de funktioner och förmågor ni önskar i ett nytt system..."
                value={data.wishlist}
                onChange={(e) => setData({ ...data, wishlist: e.target.value })}
                className="min-h-[200px]"
              />
            </div>
          </div>
        );

      case 6:
        const aiInterestOptions = [
          { value: "Mycket intresserade", label: "Mycket intresserade" },
          { value: "Ganska intresserade", label: "Ganska intresserade" },
          { value: "Lite intresserade", label: "Lite intresserade" },
          { value: "Ej intresserade just nu", label: "Ej intresserade just nu" }
        ];
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka nyckeltal (KPI:er) är viktigast för er?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {kpiOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.kpis.includes(option)}
                    onClick={() => handleCheckboxChange("kpis", option)}
                    type="checkbox"
                  />
                ))}
              </div>
              <Textarea
                placeholder="Övriga KPI:er..."
                value={data.kpisOther}
                onChange={(e) => setData({ ...data, kpisOther: e.target.value })}
                className="mt-3"
              />
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur intresserade är ni av AI och automation?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiInterestOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={data.aiInterest === option.value}
                    onClick={() => setData({ ...data, aiInterest: option.value })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka AI-användningsområden är intressanta?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiUseCaseOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.aiUseCases.includes(option)}
                    onClick={() => handleCheckboxChange("aiUseCases", option)}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Har ni kontakt med några Microsoftpartners idag?</Label>
              <Textarea
                placeholder="Ange vilka Microsoft-partners ni eventuellt har kontakt med..."
                value={data.currentPartners}
                onChange={(e) => setData({ ...data, currentPartners: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Övrig information</Label>
              <Textarea
                placeholder="Berätta mer om era behov, utmaningar, tidplan eller andra relevanta faktorer..."
                value={data.additionalInfo}
                onChange={(e) => setData({ ...data, additionalInfo: e.target.value })}
                className="min-h-[150px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContactForm = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Fyll i era kontaktuppgifter för att få tillgång till er personliga rekommendation och analys.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Företagsnamn *</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => {
              setData({ ...data, companyName: e.target.value });
              if (contactErrors.companyName) setContactErrors({ ...contactErrors, companyName: undefined });
            }}
            placeholder="Ert företagsnamn"
            className={contactErrors.companyName ? 'border-destructive' : ''}
          />
          {contactErrors.companyName && <p className="text-sm text-destructive mt-1">{contactErrors.companyName}</p>}
        </div>
        <div>
          <Label htmlFor="contactName">Ditt namn *</Label>
          <Input
            id="contactName"
            value={data.contactName}
            onChange={(e) => {
              setData({ ...data, contactName: e.target.value });
              if (contactErrors.contactName) setContactErrors({ ...contactErrors, contactName: undefined });
            }}
            placeholder="För- och efternamn"
            className={contactErrors.contactName ? 'border-destructive' : ''}
          />
          {contactErrors.contactName && <p className="text-sm text-destructive mt-1">{contactErrors.contactName}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="Telefonnummer"
          />
        </div>
        <div>
          <Label htmlFor="email">E-post *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => {
              setData({ ...data, email: e.target.value });
              if (contactErrors.email) setContactErrors({ ...contactErrors, email: undefined });
            }}
            placeholder="din.email@foretag.se"
            className={contactErrors.email ? 'border-destructive' : ''}
          />
          {contactErrors.email && <p className="text-sm text-destructive mt-1">{contactErrors.email}</p>}
        </div>
      </div>
    </div>
  );

  const recommendation = getRecommendation();

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="border-2 border-crm/30">
              <CardHeader className="text-center bg-gradient-to-r from-crm/10 to-crm/5">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-crm rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl text-crm">Tack för din behovsanalys!</CardTitle>
                <p className="text-muted-foreground mt-2">Din analys har sparats och PDF:en har laddats ner.</p>
              </CardHeader>
              <CardContent className="pt-8">
                {recommendation.products.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-center mb-6">Rekommenderade Dynamics 365-applikationer</h3>
                    <div className="space-y-4">
                      {recommendation.products.map((product, index) => (
                        <Card key={product.name} className={`border-2 ${index === 0 ? 'border-crm bg-crm/5' : 'border-border'}`}>
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{product.icon}</span>
                              <CardTitle className={`text-lg ${index === 0 ? 'text-crm' : ''}`}>{product.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            <ul className="mt-3 space-y-1">
                              {product.reasons.map((reason, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-crm mt-0.5 flex-shrink-0" />
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Vi kommer att kontakta dig inom kort.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-crm hover:bg-crm/90">
                      <Link to="/crm">Läs mer om Dynamics 365 CRM</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/kontakt">Kontakta oss direkt</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const StepIcon = stepIcons[currentStep - 1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Behovsanalys Sälj & Marknad
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Svara på frågorna för att få en personlig rekommendation om Dynamics 365 Sales och Marketing.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {showContactForm ? "Kontaktuppgifter" : `Steg ${currentStep} av ${totalSteps}`}
              </span>
              <span className="text-sm font-medium text-crm">
                {showContactForm ? "100%" : `${Math.round(progress)}%`}
              </span>
            </div>
            <Progress value={showContactForm ? 100 : progress} className="h-2" />
          </div>

          {!showContactForm && (
            <div className="hidden md:flex justify-between mb-8 overflow-x-auto pb-2">
              {stepTitles.map((title, index) => {
                const Icon = stepIcons[index];
                const isActive = currentStep === index + 1;
                const isCompleted = currentStep > index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index + 1)}
                    className="flex flex-col items-center min-w-[80px] cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isActive ? 'bg-crm text-white' : 
                      isCompleted ? 'bg-crm/20 text-crm' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs text-center ${isActive ? 'text-crm font-medium' : 'text-muted-foreground'}`}>
                      {title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-crm/10 to-crm/5 border-b">
              <div className="flex items-center gap-3">
                {showContactForm ? (
                  <FileText className="w-6 h-6 text-crm" />
                ) : (
                  <StepIcon className="w-6 h-6 text-crm" />
                )}
                <CardTitle className="text-xl text-crm">
                  {showContactForm ? "Kontaktuppgifter" : stepTitles[currentStep - 1]}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {showContactForm ? renderContactForm() : renderStep()}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6">
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
                disabled={!data.companyName || !data.contactName || !data.email}
                className="bg-crm hover:bg-crm/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Ladda ner analys
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-crm hover:bg-crm/90">
                Nästa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalesMarketingNeedsAnalysis;
