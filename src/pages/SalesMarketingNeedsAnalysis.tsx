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
import { ArrowLeft, ArrowRight, Download, Users, Megaphone, Target, Building2, Sparkles, FileText, CheckCircle2 } from "lucide-react";
// jsPDF is dynamically imported when needed to reduce initial bundle size
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const salesMarketingBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Marknad & Sälj", url: "https://d365.se/d365-sales" },
  { name: "Behovsanalys", url: "https://d365.se/salj-marknad-behovsanalys" },
];

const contactFormSchema = z.object({
  companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
  contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  phone: z.string().trim().max(20, "Telefonnummer får max vara 20 tecken").optional(),
  email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface SalesMarketingAnalysisData {
  commercialModel: string;
  b2bSalesCount: string;
  b2bStructuredPipeline: string;
  b2bMultipleDecisionMakers: string;
  b2bForecastNeeds: string;
  b2bComplexParallelDeals: string;
  b2bComplexRoleBased: string;
  b2bComplexGlobalReporting: string;
  b2bComplexPartnerChannel: string;
  digitalDataSources: string;
  digitalBehaviorSegmentation: string;
  digitalAutoCommunication: string;
  digitalCDPNeed: string;
  partnerPortalNeed: string;
  partnerDealRegistration: string;
  partnerChannelReporting: string;
  b2cSegmentation: string;
  b2cCampaignAutomation: string;
  b2cPersonalization: string;
  b2cUnifiedView: string;
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
  integrationSystems: { system: string; importance: string }[];
  kpis: string[];
  kpisOther: string;
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  wishlist: string;
  decisionTimeline: string;
  additionalInfo: string;
  currentPartners: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

const initialData: SalesMarketingAnalysisData = {
  commercialModel: "",
  b2bSalesCount: "",
  b2bStructuredPipeline: "",
  b2bMultipleDecisionMakers: "",
  b2bForecastNeeds: "",
  b2bComplexParallelDeals: "",
  b2bComplexRoleBased: "",
  b2bComplexGlobalReporting: "",
  b2bComplexPartnerChannel: "",
  digitalDataSources: "",
  digitalBehaviorSegmentation: "",
  digitalAutoCommunication: "",
  digitalCDPNeed: "",
  partnerPortalNeed: "",
  partnerDealRegistration: "",
  partnerChannelReporting: "",
  b2cSegmentation: "",
  b2cCampaignAutomation: "",
  b2cPersonalization: "",
  b2cUnifiedView: "",
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
  integrationSystems: [
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
  ],
  kpis: [],
  kpisOther: "",
  aiInterest: "",
  aiUseCases: [],
  aiDetails: "",
  wishlist: "",
  decisionTimeline: "",
  additionalInfo: "",
  currentPartners: "",
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
};

const commercialModelOptions = [
  { value: "b2b_relational", label: "Relationsbaserad B2B-försäljning", emoji: "1️⃣", description: "Personlig bearbetning, långa kundrelationer, hög andel återkommande affärer" },
  { value: "b2b_complex", label: "Komplex B2B med flera beslutsfattare", emoji: "2️⃣", description: "Långa affärscykler, RFP/upphandling, stakeholder management" },
  { value: "b2c_volume", label: "Volymbaserad B2C-försäljning", emoji: "3️⃣", description: "Många transaktioner, priskänslighet, lojalitetsprogram" },
  { value: "digital_market", label: "Marknadsdriven digital affär", emoji: "4️⃣", description: "E-handel, abonnemang, inbound-driven growth med marketing automation" },
  { value: "partner_channel", label: "Partner- eller kanaldriven försäljning", emoji: "5️⃣", description: "Återförsäljare, agenter, franchisemodeller eller allianser" },
];

const employeeOptions = [
  "1-49 anställda",
  "50-99 anställda",
  "100-249 anställda",
  "250-999 anställda",
  "1.000-4.999 anställda",
  "Mer än 5.000 anställda",
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
  {
    id: "marknad_silos",
    title: "Marknad jobbar i silos",
    subtitle: "Marketing automation, CRM och Analytics är inte kopplade",
    items: [
      "Data flyttas manuellt mellan system",
      "Ingen gemensam vy över kundresan",
    ],
    quote: "\"Vi vet inte hur våra leads beter sig efter överlämning till sälj.\"",
    quoteSource: "Marknad säger:",
  },
  {
    id: "content_relevans",
    title: "Content når inte rätt målgrupp",
    subtitle: "Samma budskap till alla – oavsett fas i köpresan",
    items: [
      "Ingen personalisering baserat på beteende",
      "Låg öppningsgrad och klickfrekvens",
    ],
    quote: "\"Vi skickar nyhetsbrev – men ingen verkar bry sig.\"",
    quoteSource: "Marknadsteamet konstaterar:",
  },
  {
    id: "roi_rapportering",
    title: "Svårt att bevisa marknadsförings-ROI",
    subtitle: "Ingen tydlig koppling mellan aktiviteter och intäkter",
    items: [
      "Attribution är en gissningslek",
      "Budget ifrågasätts varje kvartal",
    ],
    quote: "\"Vi kan inte visa vilka kampanjer som faktiskt driver pipeline.\"",
    quoteSource: "CMO:s huvudvärk:",
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

// AI use cases with descriptions for Sales & Marketing
const aiUseCaseCategories = [
  {
    id: "lead-scoring",
    title: "Predictive Lead & Opportunity Scoring",
    description: "AI rangordnar leads och affärer baserat på köpsannolikhet, affärsstorlek och tid till avslut. Tar hänsyn till historik, beteendedata, bransch, engagemang och liknande kunder.",
    benefit: "Affärsnytta: Sälj fokuserar på rätt affärer → högre win-rate, kortare säljcykler."
  },
  {
    id: "next-best-action",
    title: "Next Best Action / Next Best Offer",
    description: "AI föreslår nästa steg i affären: ring, maila, boka möte. Vilket budskap eller erbjudande som fungerar bäst. Anpassas efter affärsfas, kundbeteende och tidigare utfall.",
    benefit: "Affärsnytta: Mindre gissningar, mer konsekvent och skalbar försäljning."
  },
  {
    id: "forecasting",
    title: "AI-baserad säljprognos (Forecasting)",
    description: "Prognoser som justeras löpande baserat på pipeline-kvalitet, säljarbeteende och historiska mönster. Identifierar affärer som ser bra ut men sannolikt inte stänger.",
    benefit: "Affärsnytta: Ledningen får prognoser man kan lita på."
  },
  {
    id: "conversation-intelligence",
    title: "Conversation Intelligence",
    description: "Analys av möten, samtal och mejl: tonläge, köpsignaler, objektioner. AI sammanfattar möten och uppdaterar CRM automatiskt.",
    benefit: "Affärsnytta: Mindre admin, bättre coachning, snabbare onboarding av nya säljare."
  },
  {
    id: "churn-expansion",
    title: "Churn & Expansion Prediction (Account Intelligence)",
    description: "Identifierar kunder som riskerar churn. Upptäcker signaler för merförsäljning och uppgradering.",
    benefit: "Affärsnytta: Proaktiv kundbearbetning istället för reaktiv brandkårsutryckning."
  },
  {
    id: "ai-segmentering",
    title: "AI-driven segmentering",
    description: "Dynamiska målgrupper baserat på beteende, intent-data och liknande kunder (lookalikes). Segment uppdateras automatiskt i realtid.",
    benefit: "Affärsnytta: Rätt budskap till rätt person – automatiskt."
  },
  {
    id: "predictive-nurturing",
    title: "Predictive Nurturing & Timing",
    description: "AI avgör när en kontakt är redo för sälj och vilket innehåll som ska skickas. Anpassar flöden per individ, inte per kampanj.",
    benefit: "Affärsnytta: Högre MQL→SQL-konvertering, mindre spam."
  },
  {
    id: "personalisering",
    title: "Personalisering i stor skala",
    description: "Dynamiskt innehåll i email, landningssidor och ads. Baserat på kundens bransch, roll, beteende och fas i köpresan.",
    benefit: "Affärsnytta: Personlig upplevelse utan manuell handpåläggning."
  },
  {
    id: "kampanjoptimering",
    title: "Kampanjoptimering i realtid",
    description: "AI testar automatiskt ämnesrader, CTA och kanalval. Budget flyttas till de kampanjer som faktiskt konverterar.",
    benefit: "Affärsnytta: Mer effekt per marknadsföringskrona."
  },
  {
    id: "attribution",
    title: "Attribution & Revenue Intelligence",
    description: "AI analyserar vilka aktiviteter som verkligen driver affär. Multi-touch attribution utan Excel-gymnastik.",
    benefit: "Affärsnytta: Marknad kan bevisa sitt bidrag till intäkter."
  },
  {
    id: "ai-assistent",
    title: "AI-assistent (Copilot-liknande funktioner)",
    description: "Fråga CRM på naturligt språk: \"Vilka leads bör sälj ringa idag?\" \"Vilka kampanjer driver pipeline just nu?\" Sammanfattar, föreslår och automatiserar.",
    benefit: "Affärsnytta: CRM blir ett arbetsverktyg – inte ett rapportsystem."
  }
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

  const stepIcons = [Target, Building2, Target, Target, Target, Sparkles, FileText];
  const stepTitles = [
    "Organisation & struktur",
    "Nuvarande arbetssätt & system",
    "Datamognad & kundbild",
    "Utmaningar",
    "Integrationer",
    "AI & framtid",
    "Resultat",
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowContactForm(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (showContactForm) {
      setShowContactForm(false);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Dynamic import to reduce initial bundle size
    const { default: jsPDF } = await import("jspdf");
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

    const addBulletSection = (title: string, items: string[]) => {
      if (items.length === 0) return;
      const neededHeight = 14 + items.length * 6 + 8;
      if (yPos + neededHeight > 270) {
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
      items.forEach((item) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = margin;
        }
        pdf.text(`•  ${item}`, margin + 3, yPos);
        yPos += 6;
      });
      yPos += 4;
    };

    const commercialModelLabel = commercialModelOptions.find(o => o.value === data.commercialModel)?.label || data.commercialModel || "Ej angivet";
    addSection("Kommersiell modell", commercialModelLabel);
    if (data.commercialModel === "b2b_relational" && (data.b2bSalesCount || data.b2bStructuredPipeline || data.b2bMultipleDecisionMakers || data.b2bForecastNeeds)) {
      const b2bDetails = [
        data.b2bSalesCount && `Antal säljare: ${data.b2bSalesCount}`,
        data.b2bStructuredPipeline && `Pipeline: ${data.b2bStructuredPipeline}`,
        data.b2bMultipleDecisionMakers && `Beslutsprocess: ${data.b2bMultipleDecisionMakers}`,
        data.b2bForecastNeeds && `Forecast-behov: ${data.b2bForecastNeeds}`,
      ].filter(Boolean) as string[];
      addBulletSection("B2B-detaljer", b2bDetails);
    }
    if (data.commercialModel === "b2c_volume" && (data.b2cSegmentation || data.b2cCampaignAutomation || data.b2cPersonalization || data.b2cUnifiedView)) {
      const b2cDetails = [
        data.b2cSegmentation && `Segmentering: ${data.b2cSegmentation}`,
        data.b2cCampaignAutomation && `Kampanjautomation: ${data.b2cCampaignAutomation}`,
        data.b2cPersonalization && `Personalisering: ${data.b2cPersonalization}`,
        data.b2cUnifiedView && `Enhetlig kundvy: ${data.b2cUnifiedView}`,
      ].filter(Boolean) as string[];
      addBulletSection("B2C-detaljer", b2cDetails);
    }
    addSection("Företagsinformation", `Anställda: ${data.employees}, Bransch: ${data.industry || data.industryOther || "Ej angivet"}, Säljteam: ${data.salesTeamSize}`);
    const filledSystems = data.currentSystems.filter(s => s.product.trim());
    const systemsText = filledSystems.length > 0 
      ? filledSystems.map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ")
      : "Ej angivet";
    addSection("Nuvarande CRM", systemsText);
    const challengeItems = Object.entries(data.situationChallenges)
      .filter(([_, value]) => value && value !== "Inget problem idag")
      .map(([key, value]) => {
        const category = situationChallengeCategories.find(c => c.id === key);
        return category ? `${category.title}: ${value}` : `${key}: ${value}`;
      });
    addBulletSection("Utmaningar", challengeItems);
    addSection("Säljbehov", data.salesNeeds.join(", ") || "Ej angivet");
    addSection("Säljprocessens komplexitet", data.salesProcessComplexity || "Ej angivet");
    addSection("Marknadsföringsbehov", data.marketingNeeds.join(", ") || "Ej angivet");
    addSection("Marknadsföringskanaler", data.marketingChannels.join(", ") || "Ej angivet");
    addSection("Integrationer", data.integrationSystems.filter(s => s.system.trim()).map(s => `${s.system} (${s.importance})`).join(", ") || "Ej angivet");
    addSection("KPI:er", data.kpis.join(", ") || "Ej angivet");
    
    // Önskelista
    if (data.wishlist.trim()) {
      addSection("Önskelista", data.wishlist);
    }
    
    // Beslutstidslinje
    if (data.decisionTimeline) {
      addSection("Beslutstidslinje", data.decisionTimeline);
    }

    // AI & Framtid
    addSection("AI-intresse", data.aiInterest || "Ej angivet");
    if (data.aiUseCases.length > 0) {
      addBulletSection("AI-användningsområden", data.aiUseCases);
    }
    if (data.aiDetails) {
      addSection("AI-detaljer", data.aiDetails);
    }

    // Övrig information
    if (data.additionalInfo) {
      addSection("Övrig information", data.additionalInfo);
    }
    if (data.currentPartners) {
      addSection("Nuvarande Microsoft-partners", data.currentPartners);
    }

    // Footer with contact info
    if (yPos > 230) {
      pdf.addPage();
      yPos = margin;
    }
    yPos += 15;
    pdf.setFillColor(30, 58, 138);
    pdf.roundedRect(margin, yPos, contentWidth, 34, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dynamic Factory", margin + 8, yPos + 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Din oberoende guide till rätt Dynamics 365-lösning", margin + 8, yPos + 18);
    pdf.text("+46 72 232 40 60", pageWidth - margin - 55, yPos + 10);
    pdf.text("thomas.laine@dynamicfactory.se", pageWidth - margin - 55, yPos + 18);
    pdf.text("www.d365.se", pageWidth - margin - 55, yPos + 26);

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
            "Kommersiell modell": commercialModelOptions.find(o => o.value === data.commercialModel)?.label || data.commercialModel || "Ej angivet",
            ...(data.commercialModel === "b2b_relational" ? {
              "B2B – Antal säljare": data.b2bSalesCount || "Ej angivet",
              "B2B – Strukturerad pipeline": data.b2bStructuredPipeline || "Ej angivet",
              "B2B – Beslutsprocessens komplexitet": data.b2bMultipleDecisionMakers || "Ej angivet",
              "B2B – Forecast-behov": data.b2bForecastNeeds || "Ej angivet",
            } : {}),
            ...(data.commercialModel === "b2c_volume" ? {
              "B2C – Segmentering": data.b2cSegmentation || "Ej angivet",
              "B2C – Kampanjautomation": data.b2cCampaignAutomation || "Ej angivet",
              "B2C – Personalisering": data.b2cPersonalization || "Ej angivet",
              "B2C – Enhetlig kundvy": data.b2cUnifiedView || "Ej angivet",
            } : {}),
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
            "Säljprocessens komplexitet": data.salesProcessComplexity || "Ej angivet",
            "Marknadsföring": data.marketingNeeds.join(", ") || "Ej angivet",
            "Marknadsföringskanaler": data.marketingChannels.join(", ") || "Ej angivet",
            "Integrationer": data.integrationSystems.filter(s => s.system.trim()).map(s => `${s.system} (${s.importance})`).join(", ") || "Ej angivet",
            "KPI:er": data.kpis.join(", ") || "Ej angivet",
            "Önskelista": data.wishlist || "Ej angivet",
            "Beslutstidslinje": data.decisionTimeline || "Ej angivet",
            "AI-intresse": data.aiInterest || "Ej angivet",
            "AI-användningsområden": data.aiUseCases.join(", ") || "Ej angivet",
            "AI-detaljer": data.aiDetails || "Ej angivet",
            "Övrig information": data.additionalInfo || "Ej angivet",
            "Nuvarande partners": data.currentPartners || "Ej angivet",
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
              <p className="text-muted-foreground mb-6">
                Välj det alternativ som bäst beskriver hur er verksamhet primärt genererar affärer. Det hjälper oss att anpassa analysen till er situation.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {commercialModelOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={`${option.emoji} ${option.label}`}
                    description={option.description}
                    selected={data.commercialModel === option.value}
                    onClick={() => setData({ ...data, commercialModel: option.value })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Conditional follow-up questions for Relationsbaserad B2B */}
            {data.commercialModel === "b2b_relational" && (
              <div className="mt-6 space-y-6 border-l-4 border-primary/40 pl-5 animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-primary">Berätta lite mer om er B2B-försäljning:</p>

                {/* Antal säljare */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Antal säljare?</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["1–3", "4–10", "11–30", "30+"].map((opt) => (
                      <SelectionCard
                        key={opt}
                        label={opt}
                        selected={data.b2bSalesCount === opt}
                        onClick={() => setData({ ...data, b2bSalesCount: opt })}
                        type="radio"
                      />
                    ))}
                  </div>
                </div>

                {/* Strukturerad pipeline */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Har ni en strukturerad pipeline idag?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, väl definierad", "Delvis / informell", "Nej, saknas"].map((opt) => (
                      <SelectionCard
                        key={opt}
                        label={opt}
                        selected={data.b2bStructuredPipeline === opt}
                        onClick={() => setData({ ...data, b2bStructuredPipeline: opt })}
                        type="radio"
                      />
                    ))}
                  </div>
                </div>

                {/* Beslutsprocessen */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Flera steg i beslutsprocessen hos kunden?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, ofta 3+ beslutsfattare", "Ibland, beror på affär", "Nej, enkel beslutsprocess"].map((opt) => (
                      <SelectionCard
                        key={opt}
                        label={opt}
                        selected={data.b2bMultipleDecisionMakers === opt}
                        onClick={() => setData({ ...data, b2bMultipleDecisionMakers: opt })}
                        type="radio"
                      />
                    ))}
                  </div>
                </div>

                {/* Forecast & uppföljning */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behov av forecast & säljuppföljning?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, kritiskt", "Vore bra att ha", "Inget krav just nu"].map((opt) => (
                      <SelectionCard
                        key={opt}
                        label={opt}
                        selected={data.b2bForecastNeeds === opt}
                        onClick={() => setData({ ...data, b2bForecastNeeds: opt })}
                        type="radio"
                      />
                    ))}
                  </div>
                </div>

                {/* Recommendation hint */}
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <span className="text-xl mt-0.5">👉</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Lutning mot Dynamics 365 Sales</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Baserat på er profil passar Dynamics 365 Sales bra – med stöd för pipeline-hantering, aktivitetsuppföljning, AI-driven säljcoachning och integrerade prognoser.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional follow-up questions for Komplex B2B */}
            {data.commercialModel === "b2b_complex" && (
              <div className="mt-6 space-y-6 border-l-4 border-primary/40 pl-5 animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-primary">Berätta lite mer om er komplexa B2B-försäljning:</p>

                {/* Parallella affärer */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Hur många parallella affärer hanterar säljarna typiskt?</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Färre än 10", "10–30", "30–100", "100+"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2bComplexParallelDeals === opt} onClick={() => setData({ ...data, b2bComplexParallelDeals: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Rollbaserad säljstyrning */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behöver ni rollbaserad säljstyrning?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, vi har tydliga roller (AE, SDR, CSM...)", "Delvis, vi växer mot det", "Nej, alla gör allt idag"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2bComplexRoleBased === opt} onClick={() => setData({ ...data, b2bComplexRoleBased: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Global rapportering */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behov av global eller multi-entity-rapportering?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, flera länder/bolag", "Ja, men bara ett land", "Nej, vi är ett team"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2bComplexGlobalReporting === opt} onClick={() => setData({ ...data, b2bComplexGlobalReporting: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Partner/kanalförsäljning */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Säljer ni via partners eller kanaler?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, partners är en stor del", "Delvis, hybrid direkt/partner", "Nej, enbart direktförsäljning"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2bComplexPartnerChannel === opt} onClick={() => setData({ ...data, b2bComplexPartnerChannel: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Recommendation hint */}
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <span className="text-xl mt-0.5">👉</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Stark lutning mot Dynamics 365 Sales</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Med komplex affärsstruktur, parallella affärer och rollbaserat säljarbete passar Dynamics 365 Sales utmärkt – med avancerad pipeline-hantering, AI-prognos och inbyggt stöd för partner/kanalförsäljning. Har ni även behov av marketing automation pekar det dessutom mot Customer Insights.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional follow-up questions for Digital affär */}
            {data.commercialModel === "digital_market" && (
              <div className="mt-6 space-y-6 border-l-4 border-primary/40 pl-5 animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-primary">Berätta lite mer om er digitala affär:</p>

                {/* Flera datakällor */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Hanterar ni data från flera källor idag?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, webb, app, CRM, e-handel m.fl.", "Ja, men bara 1–2 källor", "Nej, all data i ett system"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.digitalDataSources === opt} onClick={() => setData({ ...data, digitalDataSources: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Beteendebaserad segmentering */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Arbetar ni med beteendebaserad segmentering?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, realtidssegment", "Delvis, regelbaserade segment", "Nej, manuell eller ingen segmentering"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.digitalBehaviorSegmentation === opt} onClick={() => setData({ ...data, digitalBehaviorSegmentation: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Automatisk kommunikation */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Har ni automatisk kommunikation baserat på beteende?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, triggers och kundresor", "Delvis, enkla flöden", "Nej, manuella utskick"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.digitalAutoCommunication === opt} onClick={() => setData({ ...data, digitalAutoCommunication: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* CDP-behov */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behöver ni en enhetlig kundprofil (CDP)?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, kritiskt – data är fragmenterad", "Ja, det skulle förbättra vår insikt", "Nej, vi har redan samlad kunddata"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.digitalCDPNeed === opt} onClick={() => setData({ ...data, digitalCDPNeed: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Recommendation hint */}
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <span className="text-xl mt-0.5">👉</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Tydlig lutning mot Dynamics 365 Customer Insights</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Med flera datakällor, beteendebaserade segment och automatiserad kommunikation passar Customer Insights (CDP + Marketing) utmärkt. Finns det även direktförsäljning i hybridmodellen pekar det dessutom mot en kombination med Dynamics 365 Sales.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional follow-up questions for Partner/kanalförsäljning */}
            {data.commercialModel === "partner_channel" && (
              <div className="mt-6 space-y-6 border-l-4 border-primary/40 pl-5 animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-primary">Berätta lite mer om er partner- och kanalförsäljning:</p>

                {/* Partnerportal */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behöver ni en partnerportal för era återförsäljare/agenter?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, kritiskt – partners måste kunna självbetjäna", "Ja, det vore värdefullt", "Nej, vi hanterar allt direkt med partnerna"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.partnerPortalNeed === opt} onClick={() => setData({ ...data, partnerPortalNeed: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Deal registration */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behöver ni deal registration (partners registrerar affärer)?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, vi behöver kontrollera överlapp", "Delvis, på vissa affärer", "Nej, inget sådant behov idag"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.partnerDealRegistration === opt} onClick={() => setData({ ...data, partnerDealRegistration: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Kanalrapportering */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Behöver ni kanalrapportering per partner/region?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, per partner och region", "Ja, övergripande kanalöversikt", "Nej, vi har tillräcklig insyn idag"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.partnerChannelReporting === opt} onClick={() => setData({ ...data, partnerChannelReporting: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                {/* Recommendation hint */}
                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <span className="text-xl mt-0.5">👉</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Lutning mot Dynamics 365 Sales (partnerhantering)</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dynamics 365 Sales har inbyggt stöd för partnerhantering, deal registration och kanalöversikt. Är er kanalstrategi komplex med marketing mot partners pekar det dessutom mot en kombination med Customer Insights för marketing automation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional follow-up questions for Volymbaserad B2C */}
            {data.commercialModel === "b2c_volume" && (
              <div className="mt-6 space-y-6 border-l-4 border-primary/40 pl-5 animate-in slide-in-from-top-2 duration-300">
                <p className="text-sm font-medium text-primary">Berätta lite mer om er B2C-affär:</p>

                <div>
                  <Label className="text-sm font-semibold mb-3 block">Arbetar ni med kundsegmentering idag?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, avancerad segmentering", "Ja, basic segmentering", "Nej, saknas idag"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2cSegmentation === opt} onClick={() => setData({ ...data, b2cSegmentation: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-3 block">Arbetar ni med kampanjautomation?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, i flera kanaler", "Delvis / enklare flöden", "Nej, manuella kampanjer"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2cCampaignAutomation === opt} onClick={() => setData({ ...data, b2cCampaignAutomation: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-3 block">Skickar ni personaliserade utskick idag?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, dynamiskt innehåll", "Ibland, enkel personalisering", "Nej, samma budskap till alla"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2cPersonalization === opt} onClick={() => setData({ ...data, b2cPersonalization: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-3 block">Har ni en enhetlig kundvy idag?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Ja, samlad i ett system", "Delvis, data är utspridd", "Nej, fragmenterad kunddata"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.b2cUnifiedView === opt} onClick={() => setData({ ...data, b2cUnifiedView: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <span className="text-xl mt-0.5">👉</span>
                  <div>
                    <p className="text-sm font-semibold text-primary">Lutning mot Dynamics 365 Customer Insights</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Baserat på er profil passar Dynamics 365 Customer Insights bra – med enhetlig kunddata, AI-driven segmentering, personaliserade kundresor och realtidsaktivering i alla kanaler.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        );

      case 2:
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

      case 3:
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

      case 4:
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

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Vilka system behöver ni integrera med?</p>
            <div className="border-2 border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 bg-muted border-b-2 border-border">
                <div className="p-3 font-medium text-sm">Övriga relevanta produkter/system</div>
                <div className="p-3 font-medium text-sm border-l-2 border-border">Hur viktigt är integration med detta system</div>
              </div>
              {data.integrationSystems.map((integration, index) => (
                <div key={index} className={`grid grid-cols-2 ${index < data.integrationSystems.length - 1 ? 'border-b-2 border-border' : ''}`}>
                  <div className="p-2">
                    <Input
                      placeholder=""
                      value={integration.system}
                      onChange={(e) => {
                        const newSystems = [...data.integrationSystems];
                        newSystems[index] = { ...newSystems[index], system: e.target.value };
                        setData({ ...data, integrationSystems: newSystems });
                      }}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="p-2 border-l-2 border-border">
                    <Input
                      placeholder=""
                      value={integration.importance}
                      onChange={(e) => {
                        const newSystems = [...data.integrationSystems];
                        newSystems[index] = { ...newSystems[index], importance: e.target.value };
                        setData({ ...data, integrationSystems: newSystems });
                      }}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        const aiInterestOptions = [
          { value: "Mycket intresserade", label: "Mycket intresserade - Vi vill vara i framkant" },
          { value: "Ganska intresserade", label: "Ganska intresserade - Vi vill utforska möjligheterna" },
          { value: "Avvaktande", label: "Avvaktande - Vi vill se konkreta användningsfall först" },
          { value: "Inte intresserade just nu", label: "Inte intresserade just nu" }
        ];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hur intresserade är ni av AI i CRM-systemet?</h3>
              <div className="grid grid-cols-1 gap-3">
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
              <h3 className="text-lg font-semibold mb-4">Vilka AI-användningsområden ser ni som mest intressanta?</h3>
              <div className="grid grid-cols-1 gap-4">
                {aiUseCaseCategories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCheckboxChange('aiUseCases', category.title)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      data.aiUseCases.includes(category.title)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        data.aiUseCases.includes(category.title)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {data.aiUseCases.includes(category.title) && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-2">{category.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <p className="text-sm font-medium text-primary">{category.benefit}</p>
                      </div>
                    </div>
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

      case 7: {
        const decisionTimelineOptions = [
          { value: "Under kommande halvår", label: "Under kommande halvår" },
          { value: "Inom 6-12 månader", label: "Inom 6-12 månader" },
          { value: "Under nästa 12-24 månader", label: "Under nästa 12-24 månader" },
          { value: "Inga planer just nu", label: "Inga planer just nu" },
        ];
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Om du fick önska fritt – vilka funktioner vill du se i ett nytt CRM-system?</Label>
              <Textarea
                id="wishlist"
                placeholder="Beskriv de funktioner och förmågor ni önskar i ett nytt system..."
                value={data.wishlist}
                onChange={(e) => setData({ ...data, wishlist: e.target.value })}
                className="min-h-[150px]"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Vart befinner ni er i beslutsprocessen?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {decisionTimelineOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    selected={data.decisionTimeline === option.value}
                    onClick={() => setData({ ...data, decisionTimeline: option.value })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Har ni kontakt med några Microsoftpartners idag?</Label>
              <Textarea
                placeholder="Ange vilka Microsoft-partners ni eventuellt har kontakt med..."
                value={data.currentPartners}
                onChange={(e) => setData({ ...data, currentPartners: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label className="text-base font-semibold mb-3 block">Övrig information</Label>
              <Textarea
                placeholder="Berätta mer om era behov, utmaningar eller andra relevanta faktorer..."
                value={data.additionalInfo}
                onChange={(e) => setData({ ...data, additionalInfo: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );
      }

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
                    <h3 className="text-xl font-bold text-center mb-6">Baserat på era svar lutar det mot</h3>
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
      <SEOHead 
        title="Sälj & Marknad Behovsanalys | Dynamics 365 CRM"
        description="Gör vår kostnadsfria behovsanalys och få en personlig rekommendation för Dynamics 365 Sales och Customer Insights (Marketing)."
        canonicalPath="/salj-marknad-behovsanalys"
        keywords="CRM behovsanalys, Dynamics 365 Sales, Marketing, Customer Insights, försäljning"
      />
      <ServiceSchema 
        name="Sälj & Marknad Behovsanalys"
        description="Kostnadsfri behovsanalys för att hitta rätt Dynamics 365 CRM-lösning för sälj och marknadsföring."
      />
      <BreadcrumbSchema items={salesMarketingBreadcrumbs} />
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
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-crm">
                  {showContactForm ? "100%" : `${Math.round(progress)}%`}
                </span>
                {!showContactForm && (
                  <Button onClick={handleNext} size="sm" className="bg-crm hover:bg-crm/90">
                    Nästa
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
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
