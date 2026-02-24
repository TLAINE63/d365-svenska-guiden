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
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";

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
  unifiedCustomerView: string;
  multipleDataSources: string;
  personalizationCritical: string;
  ciCurrentMarketing: string;
  ciJourneyNeed: string;
  ciLeadScoring: string;
  ciEventManagement: string;
  ciMeasurement: string;
  integrationScope: string;
  integrationTypes: string[];
  integrationTypesCustom: string;
  aiAmbition: string;
  aiDataMaturity: string;
  currentCrmUsage: string;
  customerDataSpread: string;
  followUpMethod: string;
  wishlist: string;
  decisionTimeline: string;
  additionalInfo: string;
  currentPartners: string;
  multiCountry: string;
  globalCommercialModel: string;
  marketingOrgStructure: string;
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
  currentCrmUsage: "",
  unifiedCustomerView: "",
  multipleDataSources: "",
  personalizationCritical: "",
  ciCurrentMarketing: "",
  ciJourneyNeed: "",
  ciLeadScoring: "",
  ciEventManagement: "",
  ciMeasurement: "",
  integrationScope: "",
  integrationTypes: [],
  integrationTypesCustom: "",
  aiAmbition: "",
  aiDataMaturity: "",
  customerDataSpread: "",
  followUpMethod: "",
  multiCountry: "",
  globalCommercialModel: "",
  marketingOrgStructure: "",
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
  "Lead scoring och nurturing",
  "Kampanjhantering",
  "Event management",
  "Landningssidor och formulär",
  "Social media marketing",
  "Automatiserade Kundresor (customer journeys)",
  "Flexibel Segmentering",
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
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [Target, Building2, Target, Target, Megaphone, Target, Sparkles, FileText];
  const stepTitles = [
    "Kommersiell modell",
    "Organisation & struktur",
    "Nuvarande arbetssätt & system",
    "Datamognad & kundbild",
    "Customer Insights",
    "Integrationer",
    "AI & framtid",
    "Resultat",
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) {
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

    // ── Kör samma poängmotor som steg 7 ─────────────────────────────────
    let pdfSalesScore = 0;
    if (data.commercialModel === "b2b_relational") pdfSalesScore += 4;
    if (data.commercialModel === "b2b_complex") pdfSalesScore += 3;
    if (data.commercialModel === "partner_channel") pdfSalesScore += 3;
    if (data.b2bStructuredPipeline === "Vi arbetar enligt en gemensam metodik med tydlig uppföljning") pdfSalesScore += 2;
    if (data.b2bStructuredPipeline === "Vi har definierade säljsteg") pdfSalesScore += 1;
    if (data.b2bForecastNeeds === "Ja, kritiskt") pdfSalesScore += 2;
    if (data.b2bForecastNeeds === "Vore bra att ha") pdfSalesScore += 1;
    if (data.b2bMultipleDecisionMakers?.startsWith("Ja")) pdfSalesScore += 1;
    if (data.b2bComplexRoleBased?.startsWith("Ja")) pdfSalesScore += 2;
    if (data.b2bComplexParallelDeals && data.b2bComplexParallelDeals !== "Färre än 10") pdfSalesScore += 1;
    if (data.b2bComplexPartnerChannel?.startsWith("Ja")) pdfSalesScore += 1;
    if (data.partnerPortalNeed && !data.partnerPortalNeed.startsWith("Nej")) pdfSalesScore += 2;
    if (data.partnerDealRegistration && !data.partnerDealRegistration.startsWith("Nej")) pdfSalesScore += 1;
    if (data.partnerChannelReporting && !data.partnerChannelReporting.startsWith("Nej")) pdfSalesScore += 1;
    if (data.followUpMethod === "Mestadels genom Excel" || data.followUpMethod === "Flera olika rapporter från flera olika system, beroende på avdelning, enhet, organisation") pdfSalesScore += 1;
    if (data.currentCrmUsage === "Enkelt" || data.currentCrmUsage === "Nej") pdfSalesScore += 1;
    if (data.multiCountry === "Ja, flera länder") pdfSalesScore += 1;

    let pdfInsightsScore = 0;
    if (data.commercialModel === "digital_market") pdfInsightsScore += 4;
    if (data.commercialModel === "b2c_volume") pdfInsightsScore += 4;
    if (data.digitalDataSources && !data.digitalDataSources.startsWith("Nej")) pdfInsightsScore += 2;
    if (data.digitalBehaviorSegmentation?.startsWith("Ja")) pdfInsightsScore += 2;
    if (data.digitalAutoCommunication?.startsWith("Ja")) pdfInsightsScore += 2;
    if (data.digitalCDPNeed?.startsWith("Ja, kritiskt")) pdfInsightsScore += 2;
    else if (data.digitalCDPNeed?.startsWith("Ja")) pdfInsightsScore += 1;
    if (data.b2cSegmentation?.startsWith("Ja")) pdfInsightsScore += 2;
    if (data.b2cCampaignAutomation && !data.b2cCampaignAutomation.startsWith("Nej")) pdfInsightsScore += 2;
    if (data.b2cPersonalization?.startsWith("Ja")) pdfInsightsScore += 2;
    if (data.b2cUnifiedView === "Nej, fragmenterad kunddata") pdfInsightsScore += 2;
    if (data.multipleDataSources === "Ja") pdfInsightsScore += 2;
    if (data.unifiedCustomerView === "Nej, informationen är spridd") pdfInsightsScore += 2;
    if (data.unifiedCustomerView === "Delvis, men inte komplett") pdfInsightsScore += 1;
    if (data.personalizationCritical === "I hög grad") pdfInsightsScore += 3;
    if (data.personalizationCritical === "I viss utsträckning") pdfInsightsScore += 1;
    if ((data.integrationTypes || []).includes("Marketing automation")) pdfInsightsScore += 2;
    if ((data.integrationTypes || []).includes("E-handel")) pdfInsightsScore += 1;
    if ((data.integrationTypes || []).includes("BI")) pdfInsightsScore += 1;
    if (data.aiInterest === "Mycket intresserade – Vi vill vara i framkant") pdfInsightsScore += 3;
    if (data.aiInterest === "Ganska intresserade – Vi vill utforska möjligheterna") pdfInsightsScore += 2;
    if ((data.aiUseCases || []).includes("AI-driven segmentering")) pdfInsightsScore += 2;
    if ((data.aiUseCases || []).includes("Predictive Nurturing & Timing")) pdfInsightsScore += 1;
    if ((data.aiUseCases || []).includes("Personalisering i stor skala")) pdfInsightsScore += 1;
    if (data.customerDataSpread === "Spridd i flera system") pdfInsightsScore += 1;
    // Steg 5 – Customer Insights & Marketing Automation
    if (data.ciCurrentMarketing?.includes("Avancerat")) pdfInsightsScore += 2;
    else if (data.ciCurrentMarketing?.includes("grundläggande")) pdfInsightsScore += 1;
    if (data.ciJourneyNeed?.includes("Kritiskt")) pdfInsightsScore += 3;
    else if (data.ciJourneyNeed?.includes("Viktigt")) pdfInsightsScore += 2;
    if (data.ciLeadScoring?.includes("automatiserad nurturing")) pdfInsightsScore += 2;
    else if (data.ciLeadScoring?.includes("poängsätta")) pdfInsightsScore += 1;
    if (data.ciEventManagement?.includes("viktig del")) pdfInsightsScore += 2;
    else if (data.ciEventManagement?.includes("regelbundet")) pdfInsightsScore += 1;
    if (data.ciMeasurement?.includes("Avancerat")) pdfInsightsScore += 2;
    else if (data.ciMeasurement?.includes("Grundläggande")) pdfInsightsScore += 1;
    if (data.marketingNeeds.length >= 5) pdfInsightsScore += 3;
    else if (data.marketingNeeds.length >= 3) pdfInsightsScore += 2;
    else if (data.marketingNeeds.length > 0) pdfInsightsScore += 1;
    if (data.marketingChannels.length >= 4) pdfInsightsScore += 2;
    else if (data.marketingChannels.length >= 2) pdfInsightsScore += 1;

    const pdfGap = pdfSalesScore - pdfInsightsScore;
    const PDF_THRESHOLD = 5;
    const pdfProduct = pdfGap > PDF_THRESHOLD ? "Dynamics 365 Sales"
      : -pdfGap > PDF_THRESHOLD ? "Dynamics 365 Customer Insights"
      : "Dynamics 365 Sales + Customer Insights";

    // Datakomplexitet
    const pdfDataComplexity = (() => {
      let s = 0;
      if (data.multipleDataSources === "Ja") s += 2;
      if (data.customerDataSpread === "Spridd i flera system") s += 2;
      else if (data.customerDataSpread === "Delvis samlad") s += 1;
      if (data.integrationScope === "Omfattande och affärskritiskt") s += 2;
      else if (data.integrationScope === "Måttligt") s += 1;
      if (data.unifiedCustomerView === "Nej, informationen är spridd") s += 1;
      return s <= 2 ? "Låg" : s <= 5 ? "Medel" : "Hög";
    })();

    const pdfComplexity = pdfSalesScore <= 4 ? "Låg" : pdfSalesScore <= 9 ? "Medel" : "Hög";

    const pdfScalability = (() => {
      if (["250-999 anställda", "1.000-4.999 anställda", "Mer än 5.000 anställda"].includes(data.employees) || data.b2bComplexGlobalReporting?.startsWith("Ja")) return "Hög";
      if (["100-249 anställda"].includes(data.employees) || data.b2bComplexRoleBased?.startsWith("Ja")) return "Medel";
      return "Låg";
    })();

    const pdfAiReadiness = (() => {
      const uses = data.aiUseCases?.length ?? 0;
      if (data.aiInterest === "Inte just nu" || uses === 0) return "Ej påbörjad";
      if (data.aiInterest === "Ganska intresserade – Vi vill utforska möjligheterna" || uses <= 3) return "Påbörjad";
      return "Redo";
    })();

    // Dynamisk bedömningstext (samma logik som steg 7)
    const pdfModelLabel: Record<string, string> = {
      b2b_relational: "relationsbaserad B2B-försäljning",
      b2b_complex: "komplex B2B med långa affärscykler",
      b2c_volume: "volymbaserad B2C-försäljning",
      digital_market: "marknadsdriven digital affär",
      partner_channel: "partner- och kanaldriven försäljning",
    };
    const pdfModelText = pdfModelLabel[data.commercialModel] ?? "er kommersiella modell";
    const pdfHasNoProcess = data.b2bStructuredPipeline?.includes("ad hoc") || data.b2bStructuredPipeline?.includes("Nej");
    const pdfHasBasicPipeline = data.b2bStructuredPipeline === "Vi har definierade säljsteg";
    const pdfHasPipeline = data.b2bStructuredPipeline === "Vi arbetar enligt en gemensam metodik med tydlig uppföljning";
    const pdfSpreadData = data.unifiedCustomerView === "Nej, informationen är spridd" || data.customerDataSpread === "Spridd i flera system";
    const pdfPartialData = data.unifiedCustomerView === "Delvis, men inte komplett" || data.customerDataSpread === "Delvis samlad";
    const pdfUnifiedData = data.unifiedCustomerView === "Ja, vi har en samlad bild";
    const pdfIsLarge = ["250-999 anställda", "1.000-4.999 anställda", "Mer än 5.000 anställda"].includes(data.employees);
    const pdfIsMid = ["100-249 anställda"].includes(data.employees);
    const pdfIsSmall = ["1-49 anställda", "50-99 anställda"].includes(data.employees);
    const pdfAiHigh = data.aiInterest === "Mycket intresserade – Vi vill vara i framkant";
    const pdfAiMedium = data.aiInterest === "Ganska intresserade – Vi vill utforska möjligheterna";
    const pdfAiRisk = (pdfAiHigh || pdfAiMedium) && pdfSpreadData;
    const pdfUsesExcel = data.followUpMethod === "Mestadels genom Excel" || data.currentCrmUsage === "Nej";
    const pdfUsesBasicCrm = data.currentCrmUsage === "Enkelt";

    let pdfAssessmentIntro = `Er verksamhet arbetar med ${pdfModelText}`;
    if (pdfIsLarge) pdfAssessmentIntro += ` och har en organisation av en storlek där skalbarhet och standardisering är avgörande`;
    else if (pdfIsMid) pdfAssessmentIntro += ` i en organisation där strukturerade arbetsflöden börjar bli affärskritiska`;
    else if (pdfIsSmall) pdfAssessmentIntro += ` i ett tillväxtskede där rätt plattform lägger grunden för skalbarhet`;
    pdfAssessmentIntro += ".";
    if (pdfHasPipeline) pdfAssessmentIntro += " Ni har en väldefinierad och gemensam säljprocess – en stark utgångspunkt.";
    else if (pdfHasBasicPipeline) pdfAssessmentIntro += " Ni har definierade säljsteg men det finns potential att göra processen mer enhetlig och datadriven.";
    else if (pdfHasNoProcess) pdfAssessmentIntro += " Säljprocessen saknar i dagsläget en gemensam struktur, vilket är en av de viktigaste sakerna att adressera.";
    if (pdfSpreadData) pdfAssessmentIntro += " Kundinformationen är spridd i flera system, vilket begränsar möjligheten att agera på rätt underlag vid rätt tillfälle.";
    else if (pdfPartialData) pdfAssessmentIntro += " Ni har en delvis samlad kundbild men det finns luckor som påverkar möjligheten till personalisering.";
    else if (pdfUnifiedData) pdfAssessmentIntro += " Ni har redan en samlad kundbild – nu handlar det om att omsätta den i automatisering och AI-driven insikt.";

    const pdfAssessmentPoints: string[] = [];
    if (pdfHasNoProcess || pdfHasBasicPipeline) pdfAssessmentPoints.push("Strukturera och standardisera er säljprocess");
    if (data.b2bForecastNeeds === "Ja, kritiskt") pdfAssessmentPoints.push("Implementera pålitlig pipeline-prognos och säljstyrning");
    if (data.b2bMultipleDecisionMakers?.startsWith("Ja")) pdfAssessmentPoints.push("Hantera komplexa affärer med flera beslutsfattare");
    if (data.b2bComplexRoleBased?.startsWith("Ja")) pdfAssessmentPoints.push("Rollbaserad säljstyrning och behörighetsstyrning");
    if (data.partnerPortalNeed && !data.partnerPortalNeed.startsWith("Nej")) pdfAssessmentPoints.push("Partnerportal och kanalhantering");
    if (pdfSpreadData) pdfAssessmentPoints.push("Konsolidera kundinformation till en enhetlig bild");
    if (data.personalizationCritical === "I hög grad") pdfAssessmentPoints.push("Möjliggöra personalisering i stor skala");
    if (data.multipleDataSources === "Ja") pdfAssessmentPoints.push("Integrera datakällor för en komplett kundprofil");
    if ((data.integrationTypes || []).includes("Marketing automation")) pdfAssessmentPoints.push("Integrera marketing automation med säljdata");
    if (data.b2cCampaignAutomation && !data.b2cCampaignAutomation.startsWith("Nej")) pdfAssessmentPoints.push("Automatisera kampanjflöden baserat på beteende");
    if (data.digitalBehaviorSegmentation?.startsWith("Ja")) pdfAssessmentPoints.push("Beteendebaserad segmentering och triggerkommunikation");
    if (data.integrationScope === "Omfattande och affärskritiskt") pdfAssessmentPoints.push("Säkerställa robusta integrationer mot affärskritiska system");
    else if (data.integrationScope === "Måttligt") pdfAssessmentPoints.push("Bygga ut integrationer mot befintliga system");
    if (data.ciJourneyNeed?.includes("Kritiskt")) pdfAssessmentPoints.push("Implementera flerkanaliga, personaliserade kundresor");
    if (data.ciLeadScoring?.includes("automatiserad nurturing")) pdfAssessmentPoints.push("Automatisera lead scoring och nurturing");
    if (data.ciEventManagement?.includes("viktig del")) pdfAssessmentPoints.push("Integrera event management i marknadsplattformen");
    if (data.ciMeasurement === "Vi mäter inte systematiskt") pdfAssessmentPoints.push("Etablera mätning av marknadsföringens bidrag till pipeline");
    if (pdfAiHigh && !pdfAiRisk) {
      if ((data.aiUseCases?.length ?? 0) >= 4) pdfAssessmentPoints.push(`Realisera AI-initiativ inom ${(data.aiUseCases || []).slice(0, 2).join(" och ")}`);
      else pdfAssessmentPoints.push("Påbörja AI-driven säljcoachning och prediktion");
    } else if (pdfAiMedium) pdfAssessmentPoints.push("Börja utforska AI-funktioner i kontrollerad skala");
    if (pdfUsesExcel) pdfAssessmentPoints.push("Ersätta Excel-baserad säljuppföljning med strukturerat CRM");
    else if (pdfUsesBasicCrm) pdfAssessmentPoints.push("Uppgradera från befintligt CRM till en mer komplett plattform");
    if (pdfAssessmentPoints.length === 0) pdfAssessmentPoints.push("Stärka den kommersiella plattformen för framtida tillväxt");

    // Avgörande faktorer (samma logik som steg 7)
    const pdfKeyFactors: string[] = [];
    if (data.commercialModel === "b2b_relational" || data.commercialModel === "b2b_complex") pdfKeyFactors.push("Relationsbaserad / komplex B2B-försäljning");
    if (data.commercialModel === "partner_channel") pdfKeyFactors.push("Partner- och kanaldriven försäljning");
    if (data.commercialModel === "digital_market" || data.commercialModel === "b2c_volume") pdfKeyFactors.push("Digital / volymbaserad kundaffär");
    if (data.personalizationCritical === "I hög grad") pdfKeyFactors.push("Personalisering är affärskritiskt");
    if (data.multipleDataSources === "Ja") pdfKeyFactors.push("Data från flera källor");
    if (data.b2bForecastNeeds === "Ja, kritiskt") pdfKeyFactors.push("Kritiskt behov av säljprognos");
    if (data.b2bComplexRoleBased?.startsWith("Ja")) pdfKeyFactors.push("Rollbaserad säljstyrning");
    if ((data.integrationTypes || []).includes("Marketing automation")) pdfKeyFactors.push("Integrerat marketing automation");
    if (data.partnerPortalNeed && !data.partnerPortalNeed.startsWith("Nej")) pdfKeyFactors.push("Behov av partnerportal");
    if (data.ciJourneyNeed?.includes("Kritiskt")) pdfKeyFactors.push("Kritiskt behov av automatiserade kundresor");
    if (data.ciLeadScoring?.includes("automatiserad nurturing")) pdfKeyFactors.push("Automatiserad lead nurturing");
    if (data.marketingNeeds.length >= 5) pdfKeyFactors.push("Brett behov av marketing automation");

    // Dynamic import to reduce initial bundle size
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // ─── COVER PAGE ─────────────────────────────────────────────────────────────
    const analysisDate = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFillColor(30, 58, 138);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    try {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        logoImg.onload = () => {
          try {
            const logoW = 70;
            const logoH = (logoImg.height / logoImg.width) * logoW;
            pdf.addImage(logoImg, "JPEG", pageWidth / 2 - logoW / 2, 30, logoW, logoH);
          } catch {}
          resolve();
        };
        logoImg.onerror = () => resolve();
        logoImg.src = "/src/assets/dynamic-factory-logo-new.jpg";
      });
    } catch {}

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text("BEHOVSANALYS", pageWidth / 2, 120, { align: "center" });
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Sales & Marketing", pageWidth / 2, 133, { align: "center" });

    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 20, 142, pageWidth - margin - 20, 142);

    // Contact info block – centered, clean
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255, 255, 255);
    pdf.text(data.companyName || "", pageWidth / 2, 158, { align: "center" });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(200, 215, 255);
    pdf.text(data.contactName || "", pageWidth / 2, 170, { align: "center" });
    pdf.text(data.email || "", pageWidth / 2, 181, { align: "center" });

    pdf.setTextColor(180, 200, 255);
    pdf.setFontSize(9);
    pdf.text("d365.se – Vägledning för Microsoft Dynamics 365-partner", pageWidth / 2, pageHeight - 28, { align: "center" });
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(`Analysens datum: ${analysisDate}`, pageWidth / 2, pageHeight - 18, { align: "center" });

    pdf.addPage();

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

    // ── ER KOMMERSIELLA PROFIL ────────────────────────────────────────────
    if (yPos > 200) { pdf.addPage(); yPos = margin; }
    yPos += 5;
    pdf.setFillColor(30, 58, 138);
    pdf.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("ER KOMMERSIELLA PROFIL", margin + 5, yPos + 7);
    yPos += 14;

    const profileRows = [
      ["Säljkomplexitet", pdfComplexity],
      ["Datamognad", pdfDataComplexity],
      ["Skalbarhetskrav", pdfScalability],
      ["AI-beredskap", pdfAiReadiness],
    ];
    profileRows.forEach(([label, value], i) => {
      if (i % 2 === 0) pdf.setFillColor(248, 250, 252);
      else pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, yPos - 4, contentWidth, 8, 'F');
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(label, margin + 3, yPos);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 58, 138);
      pdf.text(value, margin + contentWidth - 3, yPos, { align: "right" });
      yPos += 8;
    });
    yPos += 5;

    // ── BEDÖMNING ─────────────────────────────────────────────────────────
    if (yPos > 210) { pdf.addPage(); yPos = margin; }
    pdf.setFillColor(30, 58, 138);
    pdf.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("BEDÖMNING", margin + 5, yPos + 7);
    yPos += 14;

    // Dynamisk bedömningstext
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const introLines = pdf.splitTextToSize(pdfAssessmentIntro, contentWidth);
    introLines.forEach((line: string) => {
      if (yPos > 270) { pdf.addPage(); yPos = margin; }
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 4;

    // Fokusområden
    if (pdfAssessmentPoints.length > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(51, 51, 51);
      pdf.text("Prioriterade fokusområden:", margin, yPos);
      yPos += 6;
      pdf.setFont("helvetica", "normal");
      pdfAssessmentPoints.forEach((point) => {
        if (yPos > 270) { pdf.addPage(); yPos = margin; }
        const lines = pdf.splitTextToSize(`– ${point}`, contentWidth - 5);
        pdf.text(lines, margin + 2, yPos);
        yPos += lines.length * 5 + 2;
      });
    }

    // AI-risk-varning
    if (pdfAiRisk) {
      yPos += 4;
      if (yPos > 260) { pdf.addPage(); yPos = margin; }
      pdf.setFillColor(254, 243, 199);
      pdf.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');
      pdf.setTextColor(120, 80, 0);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text("OBS: AI-ambition vs datamognad", margin + 4, yPos + 6);
      pdf.setFont("helvetica", "normal");
      const warnLines = pdf.splitTextToSize("Hög AI-ambition men kundinformationen är spridd. En lyckad AI-satsning kräver att datagrunden konsolideras först.", contentWidth - 8);
      pdf.text(warnLines, margin + 4, yPos + 11);
      yPos += 16 + (warnLines.length - 1) * 4;
    }
    yPos += 8;

    // ── REKOMMENDERAD LÖSNING ─────────────────────────────────────────────
    if (yPos > 230) { pdf.addPage(); yPos = margin; }
    pdf.setFillColor(30, 58, 138);
    pdf.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("REKOMMENDERAD LÖSNING", margin + 5, yPos + 7);
    yPos += 14;

    pdf.setFillColor(240, 245, 255);
    pdf.roundedRect(margin, yPos, contentWidth, pdfKeyFactors.length > 0 ? 12 + pdfKeyFactors.slice(0,5).length * 6 : 12, 2, 2, 'F');
    pdf.setTextColor(30, 58, 138);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(pdfProduct, margin + 5, yPos + 9);
    yPos += 14;

    if (pdfKeyFactors.length > 0) {
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Avgörande faktorer:", margin + 5, yPos);
      yPos += 5;
      pdf.setFont("helvetica", "normal");
      pdfKeyFactors.slice(0, 5).forEach((f) => {
        if (yPos > 270) { pdf.addPage(); yPos = margin; }
        const fLines = pdf.splitTextToSize(`– ${f}`, contentWidth - 10);
        pdf.text(fLines, margin + 7, yPos);
        yPos += fLines.length * 5 + 1;
      });
      yPos += 6;
    }

    // ── Helpers för frågeavsnitt ──────────────────────────────────────────
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

    // ── Sidbrytning innan frågeavsnitten ──────────────────────────────────
    pdf.addPage();
    yPos = margin;

    // Rubrik för appendix
    pdf.setFillColor(30, 58, 138);
    pdf.rect(0, 0, pageWidth, 24, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("BILAGA – DINA SVAR", margin, 16);
    yPos = 32;

    // ── STEG 1: Kommersiell modell ────────────────────────────────────────
    const commercialModelLabel = commercialModelOptions.find(o => o.value === data.commercialModel)?.label || data.commercialModel || "Ej angivet";
    addSection("Steg 1 – Vilken kommersiell modell stämmer bäst?", commercialModelLabel);

    if (data.commercialModel === "b2b_relational") {
      const b2bDetails = [
        data.b2bStructuredPipeline && `Hur strukturerad är er säljprocess? → ${data.b2bStructuredPipeline}`,
        data.b2bMultipleDecisionMakers && `Flera steg i beslutsprocessen? → ${data.b2bMultipleDecisionMakers}`,
        data.b2bForecastNeeds && `Behov av forecast & säljuppföljning? → ${data.b2bForecastNeeds}`,
      ].filter(Boolean) as string[];
      if (b2bDetails.length > 0) addBulletSection("  Relationsbaserad B2B – följdfrågor", b2bDetails);
    }
    if (data.commercialModel === "b2b_complex") {
      const b2bComplexDetails = [
        data.b2bComplexParallelDeals && `Parallella affärer per säljare? → ${data.b2bComplexParallelDeals}`,
        data.b2bComplexRoleBased && `Rollbaserad säljstyrning? → ${data.b2bComplexRoleBased}`,
        data.b2bComplexGlobalReporting && `Global/multi-entity-rapportering? → ${data.b2bComplexGlobalReporting}`,
        data.b2bComplexPartnerChannel && `Försäljning via partners/kanaler? → ${data.b2bComplexPartnerChannel}`,
      ].filter(Boolean) as string[];
      if (b2bComplexDetails.length > 0) addBulletSection("  Komplex B2B – följdfrågor", b2bComplexDetails);
    }
    if (data.commercialModel === "digital_market") {
      const digitalDetails = [
        data.digitalDataSources && `Data från flera källor? → ${data.digitalDataSources}`,
        data.digitalBehaviorSegmentation && `Beteendebaserad segmentering? → ${data.digitalBehaviorSegmentation}`,
        data.digitalAutoCommunication && `Automatisk kommunikation baserat på beteende? → ${data.digitalAutoCommunication}`,
        data.digitalCDPNeed && `Behov av enhetlig kundprofil (CDP)? → ${data.digitalCDPNeed}`,
      ].filter(Boolean) as string[];
      if (digitalDetails.length > 0) addBulletSection("  Marknadsdriven digital affär – följdfrågor", digitalDetails);
    }
    if (data.commercialModel === "partner_channel") {
      const partnerDetails = [
        data.partnerPortalNeed && `Partnerportal för återförsäljare/agenter? → ${data.partnerPortalNeed}`,
        data.partnerDealRegistration && `Deal registration? → ${data.partnerDealRegistration}`,
        data.partnerChannelReporting && `Kanalrapportering per partner/region? → ${data.partnerChannelReporting}`,
      ].filter(Boolean) as string[];
      if (partnerDetails.length > 0) addBulletSection("  Partner-/kanalförsäljning – följdfrågor", partnerDetails);
    }
    if (data.commercialModel === "b2c_volume") {
      const b2cDetails = [
        data.b2cSegmentation && `Kundsegmentering idag? → ${data.b2cSegmentation}`,
        data.b2cCampaignAutomation && `Kampanjautomation? → ${data.b2cCampaignAutomation}`,
        data.b2cPersonalization && `Personaliserade utskick? → ${data.b2cPersonalization}`,
        data.b2cUnifiedView && `Enhetlig kundvy? → ${data.b2cUnifiedView}`,
      ].filter(Boolean) as string[];
      if (b2cDetails.length > 0) addBulletSection("  Volymbaserad B2C – följdfrågor", b2cDetails);
    }

    // ── STEG 2: Organisation & Struktur ──────────────────────────────────
    addSection("Steg 2 – Antal anställda i företaget", data.employees || "Ej angivet");
    addSection("Bransch", data.industry || data.industryOther || "Ej angivet");
    addSection("Storlek på säljteam", data.salesTeamSize || "Ej angivet");
    if (data.multiCountry) addSection("Är ni verksamma i flera länder?", data.multiCountry);
    if (data.globalCommercialModel) addSection("Hur enhetligt ska sälj- och marknadsarbetet vara?", data.globalCommercialModel);
    if (data.marketingOrgStructure) addSection("Central eller lokal marknadsorganisation?", data.marketingOrgStructure);

    // ── STEG 3: Nuvarande arbetssätt & system ─────────────────────────────
    if (data.currentCrmUsage) addSection("Steg 3 – Använder ni något CRM-system idag?", data.currentCrmUsage);
    if (data.customerDataSpread) addSection("Är kunddata samlad eller spridd?", data.customerDataSpread);
    if (data.followUpMethod) addSection("Hur sker uppföljning idag?", data.followUpMethod);

    // ── STEG 4: Datamognad & kundbild ─────────────────────────────────────
    if (data.unifiedCustomerView) addSection("Steg 4 – Samlad och tillförlitlig information om kunder på ett ställe?", data.unifiedCustomerView);
    if (data.multipleDataSources) addSection("Samlas kunddata från flera källor?", data.multipleDataSources);

    // ── STEG 5: Customer Insights & Marketing Automation ──────────────────
    if (data.ciCurrentMarketing) addSection("Steg 5 – Hur arbetar ni med marknadsföring idag?", data.ciCurrentMarketing);
    if (data.marketingNeeds.length > 0) {
      const mktgNeeds = [...data.marketingNeeds];
      if (data.marketingNeedsOther?.trim()) mktgNeeds.push(`Övriga: ${data.marketingNeedsOther.trim()}`);
      addBulletSection("Viktiga funktioner inom marketing automation", mktgNeeds);
    }
    if (data.ciJourneyNeed) addSection("Behov av automatiserade kundresor", data.ciJourneyNeed);
    if (data.ciLeadScoring) addSection("Behov av lead scoring och nurturing", data.ciLeadScoring);
    if (data.personalizationCritical) addSection("Personaliserat innehåll i kommunikation", data.personalizationCritical);
    if (data.ciEventManagement) addSection("Event management via marknadsplattformen", data.ciEventManagement);
    if (data.marketingChannels.length > 0) addBulletSection("Kommunikationskanaler", data.marketingChannels);
    if (data.ciMeasurement) addSection("Mätning av marknadsföringens effekt", data.ciMeasurement);

    // ── STEG 6: Integrationer ──────────────────────────────────────────────
    if (data.integrationScope) addSection("Steg 6 – Hur omfattande är behovet av att CRM samverkar med andra system?", data.integrationScope);
    if ((data.integrationTypes || []).length > 0) {
      const integTypes = [...(data.integrationTypes || [])];
      if (data.integrationTypesCustom?.trim()) integTypes.push(`Övriga: ${data.integrationTypesCustom.trim()}`);
      addBulletSection("Vilka system behöver CRM samverka med?", integTypes);
    } else if (data.integrationTypesCustom?.trim()) {
      addSection("Övriga system att integrera med", data.integrationTypesCustom);
    }

    // ── STEG 7: AI & Framtid ──────────────────────────────────────────────
    if (data.aiInterest) addSection("Steg 7 – Hur intresserade är ni av AI i CRM-systemet?", data.aiInterest);
    if ((data.aiUseCases || []).length > 0) addBulletSection("Vilka AI-användningsområden är mest intressanta?", data.aiUseCases);
    if (data.aiDetails) addSection("Beskriv hur AI skulle kunna hjälpa er verksamhet", data.aiDetails);

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
            "CI – Nuvarande marknadsföring": data.ciCurrentMarketing || "Ej angivet",
            "CI – Kundresor": data.ciJourneyNeed || "Ej angivet",
            "CI – Lead scoring": data.ciLeadScoring || "Ej angivet",
            "CI – Personalisering": data.personalizationCritical || "Ej angivet",
            "CI – Event management": data.ciEventManagement || "Ej angivet",
            "CI – Mätning": data.ciMeasurement || "Ej angivet",
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
          recommendation: pdfKeyFactors.length > 0 ? {
            product: pdfProduct,
            reasons: pdfKeyFactors.slice(0, 5),
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

                {/* Strukturerad säljprocess */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Hur strukturerad är er säljprocess?</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "Vi arbetar främst relationsbaserat utan fast struktur",
                      "Vi har definierade säljsteg",
                      "Vi arbetar enligt en gemensam metodik med tydlig uppföljning",
                    ].map((opt) => (
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

            {/* Internationell närvaro */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Är ni verksamma i flera länder?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Ja, flera länder", "Planerar expansion", "Nej, enbart Sverige"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.multiCountry === opt}
                    onClick={() => setData({ ...data, multiCountry: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Gemensam kommersiell modell */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur enhetligt ska sälj- och marknadsarbetet vara mellan era länder/bolag?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Varje enhet arbetar relativt självständigt",
                  "Vi strävar efter gemensamma arbetssätt",
                  "Vi kräver enhetliga processer och rapportering",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.globalCommercialModel === opt}
                    onClick={() => setData({ ...data, globalCommercialModel: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Central eller lokal marknadsorganisation */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Central eller lokal marknadsorganisation?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Centralt styrd", "Hybridmodell", "Lokalt styrd per marknad"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.marketingOrgStructure === opt}
                    onClick={() => setData({ ...data, marketingOrgStructure: opt })}
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
            {/* CRM-användning */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Använder ni något CRM-system idag?</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Nej",
                  "Vi har ett enklare CRM-system som används av delar av organisationen",
                  "Ja, vi har ett avancerat CRM-system",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.currentCrmUsage === opt}
                    onClick={() => setData({ ...data, currentCrmUsage: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Kunddata */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Är kunddata samlad eller spridd?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Samlad i ett system", "Delvis samlad", "Spridd i flera system"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.customerDataSpread === opt}
                    onClick={() => setData({ ...data, customerDataSpread: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Uppföljning */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur sker uppföljning idag?</Label>
              <div className="grid grid-cols-1 gap-3">
                {["Mestadels genom Excel", "Flera olika rapporter från flera olika system, beroende på avdelning, enhet, organisation", "Central rapportering"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.followUpMethod === opt}
                    onClick={() => setData({ ...data, followUpMethod: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Enhetlig kundvy */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Har ni samlad och tillförlitlig information om era kunder på ett ställe?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Nej, informationen är spridd",
                  "Delvis, men inte komplett",
                  "Ja, vi har en samlad och uppdaterad kundbild"
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.unifiedCustomerView === opt}
                    onClick={() => setData({ ...data, unifiedCustomerView: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Kunddata från flera källor */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Samlas kunddata från flera källor?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Nej", "Ja"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.multipleDataSources === opt}
                    onClick={() => setData({ ...data, multipleDataSources: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Nuvarande marknadsföring */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur arbetar ni med marknadsföring idag?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Mest manuellt (nyhetsbrev, enstaka kampanjer)",
                  "Vi har grundläggande automation (e-postflöden, enkel segmentering)",
                  "Avancerat (marketing automation, kundresor, lead scoring)",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.ciCurrentMarketing === opt}
                    onClick={() => setData({ ...data, ciCurrentMarketing: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Funktioner inom marketing automation */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka funktioner inom marketing automation är viktigast för er? (välj alla som stämmer)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {marketingNeedOptions.map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.marketingNeeds.includes(opt)}
                    onClick={() => handleCheckboxChange("marketingNeeds", opt)}
                    type="checkbox"
                  />
                ))}
              </div>
              <div className="mt-3">
                <Label className="text-sm text-muted-foreground mb-1.5 block">Övriga behov (fritext)</Label>
                <input
                  type="text"
                  placeholder="Ange övriga behov..."
                  value={data.marketingNeedsOther}
                  onChange={(e) => setData({ ...data, marketingNeedsOther: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Kundresor */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur viktigt är det att kunna skapa automatiserade kundresor (customer journeys)?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Inte aktuellt just nu",
                  "Viktigt – vi vill guida leads genom köpresan automatiskt",
                  "Kritiskt – vi behöver flerkanaliga, personaliserade kundresor",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.ciJourneyNeed === opt}
                    onClick={() => setData({ ...data, ciJourneyNeed: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Lead scoring */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Behöver ni lead scoring och nurturing?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Nej, våra leads hanteras direkt av sälj",
                  "Ja, vi vill poängsätta och kvalificera leads innan överlämning till sälj",
                  "Ja, med automatiserad nurturing baserat på beteende och engagemang",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.ciLeadScoring === opt}
                    onClick={() => setData({ ...data, ciLeadScoring: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Personalisering */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur viktigt är personaliserat och beteendeanpassat innehåll i er kommunikation?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "I begränsad utsträckning",
                  "I viss utsträckning",
                  "I hög grad"
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.personalizationCritical === opt}
                    onClick={() => setData({ ...data, personalizationCritical: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Event management */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Behöver ni hantera event (fysiska eller digitala) via marknadsplattformen?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Nej, det är inte relevant för oss",
                  "Ja, vi arrangerar event och webinars regelbundet",
                  "Ja, event är en viktig del av vår leadgenerering",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.ciEventManagement === opt}
                    onClick={() => setData({ ...data, ciEventManagement: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Kanaler */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka kanaler vill ni kommunicera via? (välj alla som stämmer)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {marketingChannelOptions.map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.marketingChannels.includes(opt)}
                    onClick={() => handleCheckboxChange("marketingChannels", opt)}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>

            {/* Mätning */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur mäter ni marknadsföringens effekt idag?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Vi mäter inte systematiskt",
                  "Grundläggande (öppningsgrad, klick, antal leads)",
                  "Avancerat (attribution, kampanj-ROI, pipeline-bidrag)",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.ciMeasurement === opt}
                    onClick={() => setData({ ...data, ciMeasurement: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Integrationsbehov */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur omfattande är ert behov av att CRM samverkar med andra system?</Label>
              <div className="grid grid-cols-1 gap-3">
                {["Begränsat", "Måttligt", "Omfattande och affärskritiskt"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.integrationScope === opt}
                    onClick={() => setData({ ...data, integrationScope: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* Systeminriktningar – checklista */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka system behöver CRM samverka med? (välj alla som stämmer)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["ERP", "E-handel", "Marketing automation", "BI", "Supportsystem", "Partnerportal"].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={(data.integrationTypes || []).includes(opt)}
                    onClick={() => {
                      const current = data.integrationTypes || [];
                      const updated = current.includes(opt)
                        ? current.filter((v) => v !== opt)
                        : [...current, opt];
                      setData({ ...data, integrationTypes: updated });
                    }}
                    type="checkbox"
                  />
                ))}
              </div>
              <div className="mt-3">
                <Label className="text-sm text-muted-foreground mb-1.5 block">Övriga system (fritext)</Label>
                <input
                  type="text"
                  placeholder="Ange övriga system här..."
                  value={data.integrationTypesCustom || ""}
                  onChange={(e) => setData({ ...data, integrationTypesCustom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        );

      case 7: {
        const aiUseCaseOptions = [
          {
            label: "Predictive Lead & Opportunity Scoring",
            description: "AI rangordnar leads och affärer baserat på köpsannolikhet, affärsstorlek och tid till avslut. Tar hänsyn till historik, beteendedata, bransch, engagemang och liknande kunder.\n\nAffärsnytta: Sälj fokuserar på rätt affärer → högre win-rate, kortare säljcykler."
          },
          {
            label: "Next Best Action / Next Best Offer",
            description: "AI föreslår nästa steg i affären: ring, maila, boka möte. Vilket budskap eller erbjudande som fungerar bäst. Anpassas efter affärsfas, kundbeteende och tidigare utfall.\n\nAffärsnytta: Mindre gissningar, mer konsekvent och skalbar försäljning."
          },
          {
            label: "AI-baserad säljprognos (Forecasting)",
            description: "Prognoser som justeras löpande baserat på pipeline-kvalitet, säljarbeteende och historiska mönster. Identifierar affärer som ser bra ut men sannolikt inte stänger.\n\nAffärsnytta: Ledningen får prognoser man kan lita på."
          },
          {
            label: "Conversation Intelligence",
            description: "Analys av möten, samtal och mejl: tonläge, köpsignaler, objektioner. AI sammanfattar möten och uppdaterar CRM automatiskt.\n\nAffärsnytta: Mindre admin, bättre coachning, snabbare onboarding av nya säljare."
          },
          {
            label: "Churn & Expansion Prediction (Account Intelligence)",
            description: "Identifierar kunder som riskerar churn. Upptäcker signaler för merförsäljning och uppgradering.\n\nAffärsnytta: Proaktiv kundbearbetning istället för reaktiv brandkårsutryckning."
          },
          {
            label: "AI-driven segmentering",
            description: "Dynamiska målgrupper baserat på beteende, intent-data och liknande kunder (lookalikes). Segment uppdateras automatiskt i realtid.\n\nAffärsnytta: Rätt budskap till rätt person – automatiskt."
          },
          {
            label: "Predictive Nurturing & Timing",
            description: "AI avgör när en kontakt är redo för sälj och vilket innehåll som ska skickas. Anpassar flöden per individ, inte per kampanj.\n\nAffärsnytta: Högre MQL→SQL-konvertering, mindre spam."
          },
          {
            label: "Personalisering i stor skala",
            description: "Dynamiskt innehåll i email, landningssidor och ads. Baserat på kundens bransch, roll, beteende och fas i köpresan.\n\nAffärsnytta: Personlig upplevelse utan manuell handpåläggning."
          },
          {
            label: "Kampanjoptimering i realtid",
            description: "AI testar automatiskt ämnesrader, CTA och kanalval. Budget flyttas till de kampanjer som faktiskt konverterar.\n\nAffärsnytta: Mer effekt per marknadsföringskrona."
          },
          {
            label: "Attribution & Revenue Intelligence",
            description: "AI analyserar vilka aktiviteter som verkligen driver affär. Multi-touch attribution utan Excel-gymnastik.\n\nAffärsnytta: Marknad kan bevisa sitt bidrag till intäkter."
          },
          {
            label: "AI-assistent (Copilot-liknande funktioner)",
            description: "Fråga CRM på naturligt språk: \"Vilka leads bör sälj ringa idag?\" \"Vilka kampanjer driver pipeline just nu?\" Sammanfattar, föreslår och automatiserar.\n\nAffärsnytta: CRM blir ett arbetsverktyg – inte ett rapportsystem."
          },
        ];

        return (
          <div className="space-y-6">
            {/* AI-intresse */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Hur intresserade är ni av AI i CRM-systemet?</Label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Mycket intresserade – Vi vill vara i framkant",
                  "Ganska intresserade – Vi vill utforska möjligheterna",
                  "Avvaktande – Vi vill se konkreta användningsfall först",
                ].map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.aiInterest === opt}
                    onClick={() => setData({ ...data, aiInterest: opt })}
                    type="radio"
                  />
                ))}
              </div>
            </div>

            {/* AI-användningsområden */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Vilka AI-användningsområden ser ni som mest intressanta?</Label>
              <div className="grid grid-cols-1 gap-2">
                {aiUseCaseOptions.map((opt) => (
                  <SelectionCard
                    key={opt.label}
                    label={opt.label}
                    description={opt.description}
                    selected={(data.aiUseCases || []).includes(opt.label)}
                    onClick={() => {
                      const current = data.aiUseCases || [];
                      const updated = current.includes(opt.label)
                        ? current.filter((v) => v !== opt.label)
                        : [...current, opt.label];
                      setData({ ...data, aiUseCases: updated });
                    }}
                    type="checkbox"
                  />
                ))}
              </div>
            </div>

            {/* Fritext AI */}
            <div>
              <Label className="text-base font-semibold mb-2 block">Beskriv hur AI skulle kunna hjälpa er verksamhet</Label>
              <textarea
                rows={4}
                placeholder="Berätta med egna ord..."
                value={data.aiDetails || ""}
                onChange={(e) => setData({ ...data, aiDetails: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        );
      }

      case 8: {
        // ── POÄNGMOTOR ───────────────────────────────────────────────────
        // Signaler för D365 Sales
        let salesScore = 0;
        // Kommersiell modell
        if (data.commercialModel === "b2b_relational") salesScore += 4;
        if (data.commercialModel === "b2b_complex") salesScore += 3;
        if (data.commercialModel === "partner_channel") salesScore += 3;
        // B2B-relational följdfrågor
        if (data.b2bStructuredPipeline === "Vi arbetar enligt en gemensam metodik med tydlig uppföljning") salesScore += 2;
        if (data.b2bStructuredPipeline === "Vi har definierade säljsteg") salesScore += 1;
        if (data.b2bForecastNeeds === "Ja, kritiskt") salesScore += 2;
        if (data.b2bForecastNeeds === "Vore bra att ha") salesScore += 1;
        if (data.b2bMultipleDecisionMakers?.startsWith("Ja")) salesScore += 1;
        // B2B-komplex följdfrågor
        if (data.b2bComplexRoleBased?.startsWith("Ja")) salesScore += 2;
        if (data.b2bComplexParallelDeals && data.b2bComplexParallelDeals !== "Färre än 10") salesScore += 1;
        if (data.b2bComplexPartnerChannel?.startsWith("Ja")) salesScore += 1;
        // Partner-kanal följdfrågor
        if (data.partnerPortalNeed && !data.partnerPortalNeed.startsWith("Nej")) salesScore += 2;
        if (data.partnerDealRegistration && !data.partnerDealRegistration.startsWith("Nej")) salesScore += 1;
        if (data.partnerChannelReporting && !data.partnerChannelReporting.startsWith("Nej")) salesScore += 1;
        // Steg 3 – nuläge
        if (data.followUpMethod === "Mestadels genom Excel" || data.followUpMethod === "Flera olika rapporter från flera olika system, beroende på avdelning, enhet, organisation") salesScore += 1;
        if (data.currentCrmUsage === "Enkelt" || data.currentCrmUsage === "Nej") salesScore += 1;
        // AI-ambition sälj
        if (data.aiAmbition === "AI-stöd i sälj (prognos, rekommendationer)") salesScore += 2;
        // Multi-country → ger sales-komplexitet
        if (data.multiCountry === "Ja, flera länder") salesScore += 1;

        // Signaler för D365 Customer Insights
        let insightsScore = 0;
        // Kommersiell modell
        if (data.commercialModel === "digital_market") insightsScore += 4;
        if (data.commercialModel === "b2c_volume") insightsScore += 4;
        // Digital affär följdfrågor
        if (data.digitalDataSources && !data.digitalDataSources.startsWith("Nej")) insightsScore += 2;
        if (data.digitalBehaviorSegmentation?.startsWith("Ja")) insightsScore += 2;
        if (data.digitalAutoCommunication?.startsWith("Ja")) insightsScore += 2;
        if (data.digitalCDPNeed?.startsWith("Ja, kritiskt")) insightsScore += 2;
        else if (data.digitalCDPNeed?.startsWith("Ja")) insightsScore += 1;
        // B2C följdfrågor
        if (data.b2cSegmentation?.startsWith("Ja")) insightsScore += 2;
        if (data.b2cCampaignAutomation && !data.b2cCampaignAutomation.startsWith("Nej")) insightsScore += 2;
        if (data.b2cPersonalization?.startsWith("Ja")) insightsScore += 2;
        if (data.b2cUnifiedView === "Nej, fragmenterad kunddata") insightsScore += 2;
        // Steg 4 – datamognad
        if (data.multipleDataSources === "Ja") insightsScore += 2;
        if (data.unifiedCustomerView === "Nej, informationen är spridd") insightsScore += 2;
        if (data.unifiedCustomerView === "Delvis, men inte komplett") insightsScore += 1;
        if (data.personalizationCritical === "I hög grad") insightsScore += 3;
        if (data.personalizationCritical === "I viss utsträckning") insightsScore += 1;
        // Steg 5 – integrationer
        if ((data.integrationTypes || []).includes("Marketing automation")) insightsScore += 2;
        if ((data.integrationTypes || []).includes("E-handel")) insightsScore += 1;
        if ((data.integrationTypes || []).includes("BI")) insightsScore += 1;
        // Steg 6 – AI
        if (data.aiInterest === "Mycket intresserade – Vi vill vara i framkant") insightsScore += 3;
        if (data.aiInterest === "Ganska intresserade – Vi vill utforska möjligheterna") insightsScore += 2;
        if ((data.aiUseCases || []).includes("AI-driven segmentering")) insightsScore += 2;
        if ((data.aiUseCases || []).includes("Predictive Nurturing & Timing")) insightsScore += 1;
        if ((data.aiUseCases || []).includes("Personalisering i stor skala")) insightsScore += 1;
        if (data.customerDataSpread === "Spridd i flera system") insightsScore += 1;
        // Steg 5 – Customer Insights & Marketing Automation
        if (data.ciCurrentMarketing?.includes("Avancerat")) insightsScore += 2;
        else if (data.ciCurrentMarketing?.includes("grundläggande")) insightsScore += 1;
        if (data.ciJourneyNeed?.includes("Kritiskt")) insightsScore += 3;
        else if (data.ciJourneyNeed?.includes("Viktigt")) insightsScore += 2;
        if (data.ciLeadScoring?.includes("automatiserad nurturing")) insightsScore += 2;
        else if (data.ciLeadScoring?.includes("poängsätta")) insightsScore += 1;
        if (data.ciEventManagement?.includes("viktig del")) insightsScore += 2;
        else if (data.ciEventManagement?.includes("regelbundet")) insightsScore += 1;
        if (data.ciMeasurement?.includes("Avancerat")) insightsScore += 2;
        else if (data.ciMeasurement?.includes("Grundläggande")) insightsScore += 1;
        if (data.marketingNeeds.length >= 5) insightsScore += 3;
        else if (data.marketingNeeds.length >= 3) insightsScore += 2;
        else if (data.marketingNeeds.length > 0) insightsScore += 1;
        if (data.marketingChannels.length >= 4) insightsScore += 2;
        else if (data.marketingChannels.length >= 2) insightsScore += 1;

        // ── Avgörande: produkt & inriktning ────────────────────────────
        const gap = salesScore - insightsScore;
        const THRESHOLD = 5;
        let product: string;
        let direction: string;
        let isGransland = false;

        if (gap > THRESHOLD) {
          product = "Dynamics 365 Sales";
          direction = "Fokus på strukturerad säljplattform";
        } else if (-gap > THRESHOLD) {
          product = "Dynamics 365 Customer Insights";
          direction = "Fokus på datadriven kundplattform";
        } else {
          product = "Dynamics 365 Sales + Customer Insights";
          direction = "Integrerad kommersiell plattform";
          isGransland = Math.abs(gap) < 3;
        }

        // ── Drivande faktorer ───────────────────────────────────────────
        const keyFactors: string[] = [];
        if (data.commercialModel === "b2b_relational" || data.commercialModel === "b2b_complex") keyFactors.push("Relationsbaserad / komplex B2B-försäljning");
        if (data.commercialModel === "partner_channel") keyFactors.push("Partner- och kanaldriven försäljning");
        if (data.commercialModel === "digital_market" || data.commercialModel === "b2c_volume") keyFactors.push("Digital / volymbaserad kundaffär");
        if (data.personalizationCritical === "I hög grad") keyFactors.push("Personalisering är affärskritiskt");
        if (data.multipleDataSources === "Ja") keyFactors.push("Data från flera källor");
        if (data.b2bForecastNeeds === "Ja, kritiskt") keyFactors.push("Kritiskt behov av säljprognos");
        if (data.aiAmbition === "AI-driven segmentering & personalisering") keyFactors.push("AI-driven segmentering");
        if (data.aiAmbition === "AI-stöd i sälj (prognos, rekommendationer)") keyFactors.push("AI-stöd i säljprocessen");
        if (data.b2bComplexRoleBased?.startsWith("Ja")) keyFactors.push("Rollbaserad säljstyrning");
        if ((data.integrationTypes || []).includes("Marketing automation")) keyFactors.push("Integrerat marketing automation");
        if (data.partnerPortalNeed && !data.partnerPortalNeed.startsWith("Nej")) keyFactors.push("Behov av partnerportal");
        if (data.ciJourneyNeed?.includes("Kritiskt")) keyFactors.push("Kritiskt behov av automatiserade kundresor");
        if (data.ciLeadScoring?.includes("automatiserad nurturing")) keyFactors.push("Automatiserad lead nurturing");
        if (data.marketingNeeds.length >= 5) keyFactors.push("Brett behov av marketing automation");

        // ── Kommersiell mognadsnivå (1–4) ──────────────────────────────
        const maturityScore = (() => {
          let score = 0;
          if (["b2b_complex", "digital_market", "partner_channel"].includes(data.commercialModel)) score += 2;
          else if (data.commercialModel) score += 1;
          if (data.b2bStructuredPipeline === "Vi arbetar enligt en gemensam metodik med tydlig uppföljning") score += 1;
          if (data.currentCrmUsage === "Avancerat") score += 1;
          if (data.b2bComplexRoleBased?.startsWith("Ja")) score += 1;
          if (data.b2bForecastNeeds === "Ja, kritiskt") score += 1;
          if (["AI-driven segmentering & personalisering", "Strategisk AI-satsning"].includes(data.aiAmbition)) score += 1;
          return Math.min(4, Math.max(1, Math.round(1 + (score / 7) * 3)));
        })();
        const maturityLabels = ["", "Grundläggande", "Utvecklande", "Avancerad", "Ledande"];
        const maturityColors = ["", "bg-muted text-muted-foreground", "bg-blue-100 text-blue-700", "bg-primary/10 text-primary", "bg-green-100 text-green-700"];

        // ── Datakomplexitet ──────────────────────────────────────────────
        const dataComplexity = (() => {
          let score = 0;
          if (data.multipleDataSources === "Ja") score += 2;
          if (data.customerDataSpread === "Spridd i flera system") score += 2;
          else if (data.customerDataSpread === "Delvis samlad") score += 1;
          if (data.integrationScope === "Omfattande och affärskritiskt") score += 2;
          else if (data.integrationScope === "Måttligt") score += 1;
          if (data.unifiedCustomerView === "Nej, informationen är spridd") score += 1;
          if (data.aiDataMaturity === "Låg – data är spridd och ostrukturerad") score += 1;
          if (score <= 2) return "Låg";
          if (score <= 5) return "Medel";
          return "Hög";
        })();

        // ── Dimensionsetiketter för profilen ────────────────────────────────
        const complexityLabel = (() => {
          const score = salesScore;
          if (score <= 4) return "Låg";
          if (score <= 9) return "Medel";
          return "Hög";
        })();

        const aiReadinessLabel = (() => {
          const uses = data.aiUseCases?.length ?? 0;
          if (data.aiInterest === "Inte just nu" || uses === 0) return "Ej påbörjad";
          if (data.aiInterest === "Ganska intresserade – Vi vill utforska möjligheterna" || uses <= 3) return "Påbörjad";
          if (data.aiInterest === "Mycket intresserade – Vi vill vara i framkant" || uses > 3) return "Redo";
          return "Påbörjad";
        })();

        const scalabilityLabel = (() => {
          if (data.employees === "500+" || data.b2bComplexGlobalReporting?.startsWith("Ja")) return "Hög";
          if (data.employees === "101–500" || data.b2bComplexRoleBased?.startsWith("Ja")) return "Medel";
          return "Låg";
        })();

        // ── Dynamisk bedömningstextmotor ─────────────────────────────────
        const modelLabel: Record<string, string> = {
          b2b_relational: "relationsbaserad B2B-försäljning",
          b2b_complex: "komplex B2B med långa affärscykler",
          b2c_volume: "volymbaserad B2C-försäljning",
          digital_market: "marknadsdriven digital affär",
          partner_channel: "partner- och kanaldriven försäljning",
        };
        const modelText = modelLabel[data.commercialModel] ?? "er kommersiella modell";

        const hasPipeline = data.b2bStructuredPipeline === "Vi arbetar enligt en gemensam metodik med tydlig uppföljning";
        const hasBasicPipeline = data.b2bStructuredPipeline === "Vi har definierade säljsteg";
        const hasNoProcess = data.b2bStructuredPipeline?.includes("ad hoc") || data.b2bStructuredPipeline?.includes("Nej");
        const hasSpreadData = data.unifiedCustomerView === "Nej, informationen är spridd" || data.customerDataSpread === "Spridd i flera system";
        const hasPartialData = data.unifiedCustomerView === "Delvis, men inte komplett" || data.customerDataSpread === "Delvis samlad";
        const hasUnifiedData = data.unifiedCustomerView === "Ja, vi har en samlad bild";
        const hasHeavyIntegrations = data.integrationScope === "Omfattande och affärskritiskt";
        const hasModerateIntegrations = data.integrationScope === "Måttligt";
        const aiHighAmbition = data.aiInterest === "Mycket intresserade – Vi vill vara i framkant";
        const aiMediumAmbition = data.aiInterest === "Ganska intresserade – Vi vill utforska möjligheterna";
        const aiUseCaseCount = data.aiUseCases?.length ?? 0;
        const aiRiskFlag = (aiHighAmbition || aiMediumAmbition) && hasSpreadData;
        const usesExcel = data.followUpMethod === "Mestadels genom Excel" || data.currentCrmUsage === "Nej";
        const usesBasicCrm = data.currentCrmUsage === "Enkelt";
        const isLarge = ["250-999 anställda", "1.000-4.999 anställda", "Mer än 5.000 anställda"].includes(data.employees);
        const isMid = ["100-249 anställda"].includes(data.employees);
        const isSmall = ["1-49 anställda", "50-99 anställda"].includes(data.employees);

        let assessmentIntro = `Er verksamhet arbetar med ${modelText}`;
        if (isLarge) assessmentIntro += ` och har en organisation av en storlek där skalbarhet och standardisering är avgörande`;
        else if (isMid) assessmentIntro += ` i en organisation där strukturerade arbetsflöden börjar bli affärskritiska`;
        else if (isSmall) assessmentIntro += ` i ett tillväxtskede där rätt plattform lägger grunden för skalbarhet`;
        assessmentIntro += ".";
        if (hasPipeline) assessmentIntro += " Ni har en väldefinierad och gemensam säljprocess – en stark utgångspunkt för att maximera effekten av en CRM-plattform.";
        else if (hasBasicPipeline) assessmentIntro += " Ni har definierade säljsteg men det finns potential att göra processen mer enhetlig och datadriven.";
        else if (hasNoProcess) assessmentIntro += " Säljprocessen saknar i dagsläget en gemensam struktur, vilket är en av de viktigaste sakerna att adressera.";
        if (hasSpreadData) assessmentIntro += " Kundinformationen är spridd i flera system, vilket begränsar möjligheten att agera på rätt underlag vid rätt tillfälle.";
        else if (hasPartialData) assessmentIntro += " Ni har en delvis samlad kundbild men det finns luckor som påverkar möjligheten till personalisering och proaktivt agerande.";
        else if (hasUnifiedData) assessmentIntro += " Ni har redan en samlad kundbild – nu handlar det om att omsätta den i automatisering och AI-driven insikt.";

        const assessmentPoints: string[] = [];
        if (hasNoProcess || hasBasicPipeline) assessmentPoints.push("Strukturera och standardisera er säljprocess");
        if (data.b2bForecastNeeds === "Ja, kritiskt") assessmentPoints.push("Implementera pålitlig pipeline-prognos och säljstyrning");
        if (data.b2bMultipleDecisionMakers?.startsWith("Ja")) assessmentPoints.push("Hantera komplexa affärer med flera beslutsfattare");
        if (data.b2bComplexRoleBased?.startsWith("Ja")) assessmentPoints.push("Rollbaserad säljstyrning och behörighetsstyrning");
        if (data.partnerPortalNeed && !data.partnerPortalNeed.startsWith("Nej")) assessmentPoints.push("Partnerportal och kanalhantering");
        if (hasSpreadData) assessmentPoints.push("Konsolidera kundinformation till en enhetlig bild");
        if (data.personalizationCritical === "I hög grad") assessmentPoints.push("Möjliggöra personalisering i stor skala");
        if (data.multipleDataSources === "Ja") assessmentPoints.push("Integrera datakällor för en komplett kundprofil");
        if ((data.integrationTypes || []).includes("Marketing automation")) assessmentPoints.push("Integrera marketing automation med säljdata");
        if (data.b2cCampaignAutomation && !data.b2cCampaignAutomation.startsWith("Nej")) assessmentPoints.push("Automatisera kampanjflöden baserat på beteende");
        if (data.digitalBehaviorSegmentation?.startsWith("Ja")) assessmentPoints.push("Beteendebaserad segmentering och triggerkommunikation");
        if (data.ciJourneyNeed?.includes("Kritiskt")) assessmentPoints.push("Implementera flerkanaliga, personaliserade kundresor");
        if (data.ciLeadScoring?.includes("automatiserad nurturing")) assessmentPoints.push("Automatisera lead scoring och nurturing");
        if (data.ciEventManagement?.includes("viktig del")) assessmentPoints.push("Integrera event management i marknadsplattformen");
        if (data.ciMeasurement === "Vi mäter inte systematiskt") assessmentPoints.push("Etablera mätning av marknadsföringens bidrag till pipeline");
        if (hasHeavyIntegrations) assessmentPoints.push("Säkerställa robusta integrationer mot affärskritiska system");
        else if (hasModerateIntegrations) assessmentPoints.push("Bygga ut integrationer mot befintliga system");
        if (aiHighAmbition && !aiRiskFlag) {
          if (aiUseCaseCount >= 4) assessmentPoints.push(`Realisera AI-initiativ inom ${(data.aiUseCases || []).slice(0, 2).join(" och ")}`);
          else assessmentPoints.push("Påbörja AI-driven säljcoachning och prediktion");
        } else if (aiMediumAmbition) assessmentPoints.push("Börja utforska AI-funktioner i kontrollerad skala");
        if (usesExcel) assessmentPoints.push("Ersätta Excel-baserad säljuppföljning med strukturerat CRM");
        else if (usesBasicCrm) assessmentPoints.push("Uppgradera från befintligt CRM till en mer komplett plattform");
        if (assessmentPoints.length === 0) assessmentPoints.push("Stärka den kommersiella plattformen för framtida tillväxt");

        const showAiRiskWarning = aiRiskFlag;

        const profileDimensions = [
          { label: "Säljkomplexitet", value: complexityLabel },
          { label: "Datamognad", value: dataComplexity },
          { label: "Skalbarhetskrav", value: scalabilityLabel },
          { label: "AI-beredskap", value: aiReadinessLabel },
        ];

        const valueColors: Record<string, string> = {
          "Låg": "text-muted-foreground",
          "Medel": "text-yellow-700 dark:text-yellow-400",
          "Hög": "text-primary",
          "Ej påbörjad": "text-muted-foreground",
          "Påbörjad": "text-yellow-700 dark:text-yellow-400",
          "Redo": "text-green-700 dark:text-green-400",
          "Grundläggande": "text-muted-foreground",
          "Utvecklande": "text-blue-700 dark:text-blue-400",
          "Avancerad": "text-primary",
          "Ledande": "text-green-700 dark:text-green-400",
        };

        // Mognadsnivå (1–4) kommentarer
        const maturityCommentData: Record<number, { text: string; strengths: string[]; gaps: string[] }> = {
          1: {
            text: "Er kommersiella organisation är i ett tidigt skede med begränsad processstruktur och systemstöd. Det finns stor potential att snabbt skapa ordning och effektivitet med rätt CRM-plattform.",
            strengths: ["Flexibelt och anpassningsbart", "Kort beslutsväg i organisationen", "Hög förändringsvilja"],
            gaps: ["Ingen strukturerad säljprocess", "Begränsad uppföljning av pipeline", "Kunddata spridd i flera system", "Manuell kommunikation och uppföljning"],
          },
          2: {
            text: "Er säljorganisation har grundläggande processer på plats men saknar ännu fullt systemstöd. Nästa steg är att samla kunddata och säljaktiviteter på en plattform.",
            strengths: ["Definierade säljsteg finns", "Viss uppföljning av affärer", "Tydlig ansvarsfördelning"],
            gaps: ["Begränsad integration mellan system", "Ingen automatisering av kommunikation", "Forecast bygger på magkänsla", "Manuell rapportering"],
          },
          3: {
            text: "Er kommersiella organisation är strukturerad med tydlig säljprocess och systemstöd. Ni har god datamognad men har ännu inte fullt utnyttjat AI och automatisering.",
            strengths: ["Tydlig säljprocess och metodik", "God pipeline-synlighet", "Systematisk kunduppföljning", "Central kunddata"],
            gaps: ["Begränsad AI-driven insikt", "Automation kan byggas ut", "Prediktiv prognos ej implementerat"],
          },
          4: {
            text: "Er kommersiella organisation är mogen och datadriven med hög grad av automatisering. Fokus handlar nu om att optimera och nyttja AI till fullo för att skapa konkurrensfördel.",
            strengths: ["Hög automationsgrad", "AI-drivet beslutsstöd", "Prediktiv pipeline och scoring", "Sömlösa system-integrationer"],
            gaps: ["Kontinuerlig AI-modelloptimering", "Skalning till nya marknader"],
          },
        };
        const maturityComment = maturityCommentData[maturityScore];

        // Fokusområden per produkt
        const crmFocusMap: Record<string, { icon: string; label: string }[]> = {
          "Dynamics 365 Sales": [
            { icon: "🎯", label: "Strukturerad pipeline och säljprognos" },
            { icon: "🤝", label: "Hantering av komplexa affärer och beslutsfattare" },
            { icon: "📊", label: "Säljcoachning och aktivitetsuppföljning" },
            { icon: "🤖", label: "Copilot AI för mötessammanfattning och e-postförslag" },
            { icon: "🔗", label: "Integration med Microsoft Teams och Outlook" },
          ],
          "Dynamics 365 Customer Insights": [
            { icon: "🧩", label: "Enhetlig kundprofil (CDP) och datainsamling" },
            { icon: "🎯", label: "AI-driven segmentering och målgruppsaktivering" },
            { icon: "✉️", label: "Personaliserade kundresor i alla kanaler" },
            { icon: "📈", label: "Realtidsaktivering och beteendebaserade triggers" },
            { icon: "🔍", label: "Analys av kundlivstidsvärde och churn-risk" },
          ],
        };
        const crmFocusItems = crmFocusMap[product] || crmFocusMap["Dynamics 365 Sales"];

        return (
          <div className="space-y-6">
            <div className="bg-crm/5 border border-crm/20 rounded-lg p-4">
              <p className="text-sm text-crm font-medium">
                🎯 Baserat på era svar har vi sammanställt er kommersiella profil. Fyll i kontaktuppgifter längst ned för att ladda ner den fullständiga analysen som PDF.
              </p>
            </div>

            <AnalysisDisclaimer />

            {/* Sammanfattning */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-blue-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">📄 Sammanfattning</h3>
              </div>
              <div className="p-5 bg-background grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileDimensions.map(({ label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-lg px-4 py-3">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                    <p className={`text-sm font-semibold ${valueColors[value] ?? "text-foreground"}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Kommersiell mognad */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-emerald-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">🟩 Kommersiell mognad</h3>
              </div>
              <div className="p-5 bg-background space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Commercial Maturity Level</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} className={`text-2xl leading-none ${i <= maturityScore ? "text-emerald-500" : "text-muted-foreground/30"}`}>⬤</span>
                  ))}
                </div>
                <p className="text-lg font-bold text-foreground">Nivå {maturityScore} – {maturityLabels[maturityScore]}</p>
              </div>
            </div>

            {/* Kommentar / Bedömning */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-700 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">🧠 Bedömning</h3>
              </div>
              <div className="p-5 bg-background space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{maturityComment.text}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{assessmentIntro}</p>
                {assessmentPoints.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {assessmentPoints.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-crm flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {showAiRiskWarning && (
                  <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                    <span className="text-base mt-0.5">⚠️</span>
                    <p className="text-xs text-foreground leading-snug">
                      <strong>AI-ambition vs datamognad:</strong> Ni har hög AI-ambition men kundinformationen är fortfarande spridd. En lyckad AI-satsning kräver att datagrunden konsolideras först.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Styrkor + Utvecklingsområden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-green-600 px-5 py-3">
                  <h3 className="font-bold text-white text-sm tracking-wide">🟢 Styrkor</h3>
                </div>
                <ul className="p-5 space-y-2 bg-background">
                  {maturityComment.strengths.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✔</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-amber-500 px-5 py-3">
                  <h3 className="font-bold text-white text-sm tracking-wide">🟡 Utvecklingsområden</h3>
                </div>
                <ul className="p-5 space-y-2 bg-background">
                  {maturityComment.gaps.map(g => (
                    <li key={g} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">–</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-2" />

            {/* Rekommenderad lösningsinriktning */}
            <div className="border rounded-xl p-5 space-y-4 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-crm text-crm-foreground text-xs flex items-center justify-center font-bold">1</span>
                Rekommenderad lösningsinriktning
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-3xl">💼</span>
                <div>
                  <p className="text-lg font-bold text-crm">{product}</p>
                  <p className="text-xs text-muted-foreground">Primär plattformsrekommendation baserat på era svar</p>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">Baserat på er kommersiella profil rekommenderas en plattform med fokus på:</p>
              <div className="space-y-2">
                {crmFocusItems.map(focus => (
                  <div key={focus.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-crm/5 border border-crm/10">
                    <span className="text-lg flex-shrink-0">{focus.icon}</span>
                    <p className="text-sm font-medium text-foreground">{focus.label}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
                  Bakom kulisserna lutar det mot
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-crm/10 border-crm/30 text-crm">
                    <span>💼</span>
                    <span>{product}</span>
                  </div>
                </div>
                {keyFactors[0] && (
                  <p className="text-xs text-muted-foreground mt-3 italic border-l-2 border-crm/30 pl-3">
                    "{keyFactors[0]}"
                  </p>
                )}
              </div>
            </div>

            {/* Rekommenderad partnertyp */}
            <div className="border rounded-xl p-5 space-y-3 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-crm text-crm-foreground text-xs flex items-center justify-center font-bold">2</span>
                Rekommenderad partnertyp
              </h3>
              {(() => {
                const partners: { icon: string; label: string; description: string }[] = [];
                if (product.includes("Sales")) {
                  if (["500+", "250-999 anställda"].includes(data.employees)) {
                    partners.push({ icon: "🏢", label: "Enterprise CRM-arkitekt", description: "Partner med erfarenhet av komplexa säljorganisationer och globala CRM-implementationer" });
                  } else {
                    partners.push({ icon: "⚡", label: "Sales-specialist", description: "Partner specialiserad på effektiva Dynamics 365 Sales-implementationer för tillväxtbolag" });
                  }
                }
                if (product.includes("Customer Insights")) {
                  partners.push({ icon: "🎯", label: "Customer Insights-specialist", description: "Partner med kompetens inom CDP, AI-segmentering och personaliserade kundresor" });
                }
                if ((data.integrationTypes || []).length >= 3 || data.integrationScope === "Omfattande och affärskritiskt") {
                  partners.push({ icon: "🔗", label: "Integrationsspecialist", description: "Partner med stark kompetens i systemintegrationer och dataarkitektur för komplexa CRM-projekt" });
                }
                if (partners.length === 0) {
                  partners.push({ icon: "⚡", label: "CRM-specialist", description: "Partner specialiserad på Dynamics 365 CRM-lösningar för er affärsmodell" });
                }
                return partners.map(p => (
                  <div key={p.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                    <span className="text-xl flex-shrink-0">{p.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Kontaktformulär */}
            <div className="border-t border-border pt-6 mt-2 print:hidden">
              <div className="border rounded-xl p-5 bg-background shadow-sm space-y-4">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                  <Download className="w-5 h-5 text-crm" />
                  Ladda ned din fullständiga Sälj & Marknad-analys
                </h3>
                <p className="text-sm text-muted-foreground">Fyll i kontaktuppgifter för att ladda ned en PDF med din analys och alla svar.</p>
                {isComplete ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Analys skickad!</p>
                      <p className="text-sm text-green-700 dark:text-green-300">Din PDF har laddats ned och analysen har skickats till {data.email}.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Företagsnamn *</Label>
                        <Input
                          id="companyName"
                          placeholder="Ert företagsnamn"
                          value={data.companyName}
                          onChange={(e) => {
                            setData({ ...data, companyName: e.target.value });
                            if (contactErrors.companyName) setContactErrors({ ...contactErrors, companyName: undefined });
                          }}
                          className={`mt-2 ${contactErrors.companyName ? 'border-destructive' : ''}`}
                        />
                        {contactErrors.companyName && <p className="text-sm text-destructive mt-1">{contactErrors.companyName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="contactName">Ditt namn *</Label>
                        <Input
                          id="contactName"
                          placeholder="För- och efternamn"
                          value={data.contactName}
                          onChange={(e) => {
                            setData({ ...data, contactName: e.target.value });
                            if (contactErrors.contactName) setContactErrors({ ...contactErrors, contactName: undefined });
                          }}
                          className={`mt-2 ${contactErrors.contactName ? 'border-destructive' : ''}`}
                        />
                        {contactErrors.contactName && <p className="text-sm text-destructive mt-1">{contactErrors.contactName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          placeholder="Telefonnummer"
                          value={data.phone}
                          onChange={(e) => setData({ ...data, phone: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-post *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="din.email@foretag.se"
                          value={data.email}
                          onChange={(e) => {
                            setData({ ...data, email: e.target.value });
                            if (contactErrors.email) setContactErrors({ ...contactErrors, email: undefined });
                          }}
                          className={`mt-2 ${contactErrors.email ? 'border-destructive' : ''}`}
                        />
                        {contactErrors.email && <p className="text-sm text-destructive mt-1">{contactErrors.email}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={generateDocument}
                        disabled={!data.companyName || !data.contactName || !data.email || isSendingEmail}
                        className="bg-crm hover:bg-crm/90 flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isSendingEmail ? "Skickar..." : "Ladda ner & skicka analys"}
                      </Button>
                      <Button variant="outline" onClick={() => window.print()} className="flex-shrink-0">
                        🖨️ Skriv ut
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

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
        ogImage="https://d365.se/og-salj-marknad-behovsanalys.png"
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
              Svara på frågorna för att få en personlig rekommendation om Dynamics 365 Sales och Marketing (Customer Insights).
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Steg {currentStep} av {totalSteps}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-crm">
                  {Math.round(progress)}%
                </span>
                <Button onClick={handleNext} size="sm" className="bg-crm hover:bg-crm/90">
                  Nästa
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

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

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-crm/10 to-crm/5 border-b">
              <div className="flex items-center gap-3">
                <StepIcon className="w-6 h-6 text-crm" />
                <CardTitle className="text-xl text-crm">
                  {stepTitles[currentStep - 1]}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="analysis-form theme-crm">
                {renderStep()}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between mt-6 print:hidden">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
            </Button>
            {currentStep < totalSteps && (
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
