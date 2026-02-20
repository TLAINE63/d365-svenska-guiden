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
import { ArrowLeft, ArrowRight, Download, Headphones, Wrench, Building2, BarChart3, Sparkles, FileText, CheckCircle2 } from "lucide-react";
// jsPDF is dynamically imported when needed to reduce initial bundle size
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const customerServiceBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kundservice", url: "https://d365.se/d365-customer-service" },
  { name: "Behovsanalys", url: "https://d365.se/kundservice-behovsanalys" },
];

const contactFormSchema = z.object({
  companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
  contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  phone: z.string().trim().max(20, "Telefonnummer får max vara 20 tecken").optional(),
  email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface CustomerServiceAnalysisData {
  serviceModel: string;
  // Adaptive step 2: model-specific
  ticketsPerMonth: string;
  slaRequirements: string;
  selfServicePortal: string;
  knowledgeBase: string;
  numberOfAgents: string;
  inboundVolume: string;
  contactCenterChannels: string[];
  realtimeManagement: string;
  numberOfTechnicians: string;
  schedulingNeeds: string;
  sparepartsManagement: string;
  serviceAgreements: string;
  geographicSpread: string;
  // Step 3: Servicekomplexitet
  ticketsPerMonthComplex: string;
  multiCountry: string;
  multiLanguage: string;
  slaContracts: string;
  customerPrioritization: string;
  multipleProductLines: string;
  // Step 4: Organisation & styrning
  orgStructure: string;
  sharedReporting: string;
  realtimeReporting: string;
  integratedWithSalesErp: string;
  // Step 5: Systemintegrationsberoenden
  systemDependencies: string[];
  // Step 6: AI & Automation
  aiAutomation: string[];
  employees: string;
  industry: string;
  industryOther: string;
  serviceTeamSize: string;
  currentSystems: { product: string; year: string }[];
  otherSystemsDetails: string;
  situationChallenges: Record<string, string>;
  currentSituationReason: string;
  serviceChannels: string[];
  hasFieldService: string;
  fieldServiceNeeds: string[];
  fieldServiceNeedsOther: string;
  integrationSystems: { system: string; importance: string }[];
  wishlist: string;
  decisionTimeline: string;
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  additionalInfo: string;
  currentPartners: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}


const initialData: CustomerServiceAnalysisData = {
  serviceModel: "",
  // Adaptive: Digital
  ticketsPerMonth: "",
  slaRequirements: "",
  selfServicePortal: "",
  knowledgeBase: "",
  // Adaptive: Contact Center
  numberOfAgents: "",
  inboundVolume: "",
  contactCenterChannels: [],
  realtimeManagement: "",
  // Adaptive: Fältservice
  numberOfTechnicians: "",
  schedulingNeeds: "",
  sparepartsManagement: "",
  serviceAgreements: "",
  geographicSpread: "",
  orgStructure: "",
  sharedReporting: "",
  realtimeReporting: "",
  integratedWithSalesErp: "",
  systemDependencies: [],
  aiAutomation: [],
  ticketsPerMonthComplex: "",
  multiCountry: "",
  multiLanguage: "",
  slaContracts: "",
  customerPrioritization: "",
  multipleProductLines: "",
  employees: "",
  industry: "",
  industryOther: "",
  serviceTeamSize: "",
  currentSystems: [
    { product: "", year: "" },
    { product: "", year: "" },
    { product: "", year: "" },
  ],
  otherSystemsDetails: "",
  situationChallenges: {},
  currentSituationReason: "",
  serviceChannels: [],
  hasFieldService: "",
  fieldServiceNeeds: [],
  fieldServiceNeedsOther: "",
  integrationSystems: [
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
  ],
  wishlist: "",
  decisionTimeline: "",
  aiInterest: "",
  aiUseCases: [],
  aiDetails: "",
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
  "Ej relevant",
];

// Customer Service Situation challenge categories
const situationChallengeCategories = [
  {
    id: "kunder_aterkommande",
    title: "Kunder återkommer med samma frågor",
    subtitle: "Ingen riktig ärendehistorik eller knowledge base",
    items: [
      "Kundservicemedarbetare börjar om från noll varje gång",
      "Ingen självbetjäning för kunder",
    ],
    quote: "\"Vi svarar på samma frågor om och om igen.\"",
    quoteSource: "Kundservice säger:",
  },
  {
    id: "kanaler_splittrade",
    title: "Kanaler är splittrade",
    subtitle: "Telefon, e-post, chat och social media hanteras i olika system",
    items: [
      "Ingen helhetsbild över kundens ärenden",
      "Kunder får olika svar beroende på kanal",
    ],
    quote: "\"Vi vet inte om kunden redan pratat med oss i en annan kanal.\"",
    quoteSource: "Kundservicemedarbetarnas frustration:",
  },
  {
    id: "sla_eskalering",
    title: "SLA och eskalering fungerar inte",
    subtitle: "Ärenden faller mellan stolarna eller eskaleras för sent",
    items: [
      "Ingen automatisk prioritering",
      "Svårt att mäta och följa upp kundnöjdhet",
    ],
    quote: "\"Vi upptäcker problem först när kunden klagar.\"",
    quoteSource: "Ledningens reaktion:",
  },
  {
    id: "faltservice_integration",
    title: "Fältservice och inneservice är inte integrerade",
    subtitle: "Tekniker saknar information om kundens historik",
    items: [
      "Dubbelbokningar och ineffektiv ruttplanering",
      "Reservdelar saknas vid servicebesök",
    ],
    quote: "\"Teknikerna vet inte vad kundservice lovat kunden.\"",
    quoteSource: "Fältservice säger:",
  },
  {
    id: "kundservicemedarbetare_improduktiva",
    title: "Kundservicemedarbetare lägger tid på fel saker",
    subtitle: "Mycket manuellt arbete och systembyten",
    items: [
      "Registrering i flera system",
      "Ingen AI-assistans eller automatisering",
    ],
    quote: "Vi hinner inte ta hand om kunderna ordentligt.",
    quoteSource: "Kundservicemedarbetarnas beteende:",
  },
  {
    id: "ingen_insyn",
    title: "Ledningen har ingen insyn i kundservicen",
    subtitle: "Svårt att få rapporter och nyckeltal",
    items: [
      "Oklart hur bra vi presterar mot SLA",
      "Ingen överblick över vanliga problemområden",
    ],
    quote: "Vi kan inte fatta datadrivna beslut.",
    quoteSource: "Ledningens frustration:",
  },
];

const situationChallengeOptions = ["Betydande utmaning", "Viss utmaning", "Inget problem idag"];

const serviceChannelOptions = [
  "Telefon",
  "E-post",
  "Live chat",
  "Social media",
  "Självbetjäningsportal",
  "SMS",
  "WhatsApp / Messenger",
];

const fieldServiceNeedOptions = [
  "Arbetsorderhantering",
  "Schemaläggning och resursplanering",
  "Mobil app för tekniker",
  "Reservdelshantering",
  "Preventivt underhåll",
  "Tidsrapportering",
  "Kundunderskrift på plats",
  "IoT-integration",
  "GPS och ruttoptimering",
  "Fakturaunderlag",
];

// AI use cases with descriptions for Customer Service
const aiUseCaseCategories = [
  {
    id: "intelligent-routing",
    title: "Intelligent ärenderouting och prioritering",
    description: "AI analyserar inkommande ärenden och dirigerar dem till rätt agent baserat på kompetens, kapacitet och ärendets komplexitet. Prioritering sker automatiskt baserat på kund, ärendetyp och affärspåverkan.",
    benefit: "Affärsnytta: Snabbare hantering, rätt kompetens på rätt ärende, nöjdare kunder."
  },
  {
    id: "agent-assist",
    title: "Agent Assist - Realtidsförslag",
    description: "AI lyssnar på konversationen och föreslår svar, kunskapsartiklar och nästa steg i realtid. Minskar söktid och säkerställer konsekvent kvalitet.",
    benefit: "Affärsnytta: Snabbare ärendehantering, bättre FCR, kortare upplärning."
  },
  {
    id: "sentiment-analysis",
    title: "Sentimentanalys och tidig varning",
    description: "AI analyserar kundens tonläge i text och röst. Identifierar frustrerade kunder och triggar eskalering eller proaktiv uppföljning.",
    benefit: "Affärsnytta: Minska churn genom att fånga missnöjda kunder tidigt."
  },
  {
    id: "chatbot-virtual-agent",
    title: "Chatbot och virtuell agent",
    description: "AI-driven självbetjäning som hanterar vanliga frågor dygnet runt. Sömlös överlämning till mänsklig agent vid behov.",
    benefit: "Affärsnytta: Lägre kostnad per ärende, tillgänglig 24/7, frigör kundservicemedarbetare."
  },
  {
    id: "predictive-service",
    title: "Prediktiv service och underhåll",
    description: "AI analyserar produktdata och IoT-signaler för att förutse problem innan de uppstår. Proaktiva servicebesök istället för brandkårsutryckningar.",
    benefit: "Affärsnytta: Högre kundnöjdhet, lägre servicekostnader, längre livslängd."
  },
  {
    id: "knowledge-generation",
    title: "AI-genererad kunskapsbas",
    description: "AI skapar och uppdaterar kunskapsartiklar automatiskt baserat på lösta ärenden. Identifierar luckor och föreslår förbättringar.",
    benefit: "Affärsnytta: Alltid uppdaterad knowledge base utan manuellt arbete."
  },
  {
    id: "quality-management",
    title: "Automatiserad kvalitetsgranskning",
    description: "AI analyserar samtal och ärenden för att bedöma kundservicemedarbetarnas prestation. Identifierar coachingmöjligheter och best practices.",
    benefit: "Affärsnytta: Konsekvent kvalitet, effektiv coaching, bättre kundupplevelse."
  },
  {
    id: "workforce-optimization",
    title: "Workforce Management & Optimering",
    description: "AI prognostiserar ärendevolymer och optimerar bemanning. Tar hänsyn till säsongsvariationer, kampanjer och historiska mönster.",
    benefit: "Affärsnytta: Rätt bemanning vid rätt tid, lägre väntetider, lägre kostnader."
  },
  {
    id: "field-service-optimization",
    title: "Fältserviceoptimering med AI",
    description: "AI optimerar rutter, schemaläggning och resursallokering för tekniker. Tar hänsyn till kompetens, reservdelar och kundprioritet.",
    benefit: "Affärsnytta: Fler jobb per dag, mindre körning, bättre kundupplevelse."
  },
  {
    id: "voice-transcription",
    title: "Röstanalys och transkription",
    description: "AI transkriberar samtal automatiskt och extraherar nyckelinsikter. Sammanfattar ärenden och uppdaterar CRM.",
    benefit: "Affärsnytta: Mindre admin, bättre dokumentation, snabbare uppföljning."
  },
  {
    id: "copilot-assistant",
    title: "AI-assistent (Copilot-liknande funktioner)",
    description: "Fråga systemet på naturligt språk: \"Visa alla öppna ärenden för VIP-kunder\" eller \"Sammanfatta kundens historik\". AI hjälper med rapporter och analys.",
    benefit: "Affärsnytta: Kundservice blir ett kraftfullt analysverktyg – inte bara ett ärendesystem."
  }
];

const CustomerServiceNeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<CustomerServiceAnalysisData>(initialData);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [Building2, Headphones, BarChart3, Building2, Wrench, Sparkles, CheckCircle2];
  const stepTitles = [
    "Företagsinformation",
    "Service-modell",
    "Er situation & komplexitet",
    "Organisation & styrning",
    "Systemintegration",
    "AI & Automation",
    "Er serviceprofil",
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

  const handleCheckboxChange = (field: keyof CustomerServiceAnalysisData, value: string) => {
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
    const recommendations: { 
      customerService: { score: number; reasons: string[] }; 
      fieldService: { score: number; reasons: string[] };
      contactCenter: { score: number; reasons: string[] };
    } = {
      customerService: { score: 0, reasons: [] },
      fieldService: { score: 0, reasons: [] },
      contactCenter: { score: 0, reasons: [] },
    };

    // Step 1: Service model steers the entire analysis
    if (data.serviceModel === "Ärendebaserad kundservice") {
      recommendations.customerService.score += 40;
      recommendations.customerService.reasons.push("Ärendebaserad kundservice – Customer Service passar bäst");
    } else if (data.serviceModel === "Volymbaserad kundservice / Contact Center") {
      recommendations.contactCenter.score += 40;
      recommendations.contactCenter.reasons.push("Volymbaserad kundservice med contact center-fokus – Contact Center är rätt lösning");
    } else if (data.serviceModel === "Fältservice med tekniker") {
      recommendations.fieldService.score += 40;
      recommendations.fieldService.reasons.push("Fältservice med tekniker på plats – Field Service är rätt lösning");
    } else if (data.serviceModel === "Kombination av flera") {
      recommendations.customerService.score += 20;
      recommendations.contactCenter.score += 20;
      recommendations.fieldService.score += 15;
      recommendations.customerService.reasons.push("Kombinerad service-modell kräver flexibel plattform");
    }

    // Step 2 adaptive: Digital
    if (data.ticketsPerMonth === "2 000–10 000" || data.ticketsPerMonth === "Mer än 10 000") {
      recommendations.customerService.score += 15;
      recommendations.customerService.reasons.push("Hög ärendevolym kräver skalbar ärendehantering");
    }
    if (data.slaRequirements === "Ja, strikta krav med avtalade svarstider") {
      recommendations.customerService.score += 10;
      recommendations.customerService.reasons.push("Strikta SLA-krav kräver automatisk prioritering och uppföljning");
    }
    if (data.selfServicePortal === "Nej, men vi vill ha det") {
      recommendations.customerService.score += 8;
      recommendations.customerService.reasons.push("Önskad self-service portal inkluderad i Customer Service");
    }
    if (data.knowledgeBase === "Delvis – spridd i dokument och e-post" || data.knowledgeBase === "Nej, kunskapen sitter hos individerna") {
      recommendations.customerService.score += 8;
      recommendations.customerService.reasons.push("Fragmenterad kunskap – behov av strukturerad knowledge base");
    }

    // Step 2 adaptive: Contact Center
    if (data.numberOfAgents === "51–150 kundservicemedarbetare" || data.numberOfAgents === "151–500 kundservicemedarbetare" || data.numberOfAgents === "Mer än 500 kundservicemedarbetare") {
      recommendations.contactCenter.score += 15;
      recommendations.contactCenter.reasons.push("Stort team av kundservicemedarbetare kräver Contact Center-plattform");
    }
    if (data.inboundVolume === "500–2 000 kontakter/dag" || data.inboundVolume === "Mer än 2 000 kontakter/dag") {
      recommendations.contactCenter.score += 12;
      recommendations.contactCenter.reasons.push("Hög inkommande volym kräver intelligent routing och köhantering");
    }
    if (data.contactCenterChannels.length >= 3) {
      recommendations.contactCenter.score += 10;
      recommendations.contactCenter.reasons.push(`${data.contactCenterChannels.length} kanaler – omnichannel Contact Center krävs`);
    }
    if (data.realtimeManagement === "Ja, kritiskt för oss") {
      recommendations.contactCenter.score += 10;
      recommendations.contactCenter.reasons.push("Realtidsstyrning och supervisor-dashboard är prioriterat");
    }

    // Step 2 adaptive: Field Service
    if (data.numberOfTechnicians === "51–200 tekniker" || data.numberOfTechnicians === "Mer än 200 tekniker") {
      recommendations.fieldService.score += 15;
      recommendations.fieldService.reasons.push("Stort teknikerteam kräver intelligent schemaläggning");
    }
    if (data.schedulingNeeds === "Manuellt via telefon/mail" || data.schedulingNeeds === "Excel eller enklare verktyg") {
      recommendations.fieldService.score += 10;
      recommendations.fieldService.reasons.push("Manuell schemaläggning – stor effektiviseringsvinst med Field Service");
    }
    if (data.sparepartsManagement === "Kritisk – tekniker måste ha rätt delar vid besöket") {
      recommendations.fieldService.score += 10;
      recommendations.fieldService.reasons.push("Kritisk reservdelshantering integrerad i Field Service");
    }
    if (data.serviceAgreements === "Ja, med garanterade svarstider och tillgänglighet") {
      recommendations.fieldService.score += 10;
      recommendations.fieldService.reasons.push("Serviceavtal med SLA kräver automatisk prioritering och uppföljning");
    }
    if (data.geographicSpread === "Nationellt – hela Sverige" || data.geographicSpread === "Nordiska länder" || data.geographicSpread === "Globalt") {
      recommendations.fieldService.score += 8;
      recommendations.fieldService.reasons.push("Bred geografisk spridning kräver ruttoptimering och GPS-spårning");
    }

    // Step 3: Servicekomplexitet → påverkar arkitekturvalet
    if (data.ticketsPerMonthComplex === "2 000–10 000" || data.ticketsPerMonthComplex === "Mer än 10 000") {
      recommendations.customerService.score += 10;
      recommendations.contactCenter.score += 10;
      recommendations.customerService.reasons.push("Hög ärendevolym kräver enterprise-arkitektur");
    }
    if (data.multiCountry === "Ja, Europa" || data.multiCountry === "Ja, globalt") {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 8;
      recommendations.customerService.reasons.push("Flerlandsverksamhet kräver centraliserad plattform");
    }
    if (data.multiLanguage === "Ja, 3–5 språk" || data.multiLanguage === "Ja, mer än 5 språk") {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 8;
      recommendations.customerService.reasons.push("Flerspråkigt stöd kräver avancerad routing och AI");
    }
    if (data.slaContracts === "Ja, kontraktuella SLA med viten" || data.slaContracts === "Ja, komplexa SLA per kundsegment") {
      recommendations.customerService.score += 10;
      recommendations.fieldService.score += 10;
      recommendations.customerService.reasons.push("Kontraktuella SLA kräver automatisk spårning och eskalering");
    }
    if (data.customerPrioritization === "Ja, vi har komplexa prioriteringsregler") {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 8;
      recommendations.customerService.reasons.push("Komplex kundprioritering kräver konfigurerbar routinglogik");
    }
    if (data.multipleProductLines === "Ja, mer än 5 produktlinjer" || data.multipleProductLines === "Ja, och de kräver specialistkompetens") {
      recommendations.customerService.score += 8;
      recommendations.customerService.reasons.push("Flera produktlinjer kräver specialiströuting och kunskapsdatabas");
    }


    // Step 4: Organisation & styrning
    if (data.orgStructure === "Lokal – varje land/region har sitt eget team" || data.orgStructure === "Hybrid – central styrning, lokalt utförande") {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 8;
      recommendations.customerService.reasons.push("Distribuerad organisation kräver multi-site-arkitektur");
    }
    if (data.sharedReporting === "Ja, ledningen behöver samlad bild") {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 8;
      recommendations.customerService.reasons.push("Gemensam uppföljning kräver centraliserad plattform");
    }
    if (data.realtimeReporting === "Ja, kritiskt – vi behöver live-dashboards") {
      recommendations.contactCenter.score += 12;
      recommendations.contactCenter.reasons.push("Realtids-KPI och live-dashboards är kritiska krav");
    }
    if (data.integratedWithSalesErp === "Ja, tätt integrerat – en plattform") {
      recommendations.customerService.score += 12;
      recommendations.customerService.reasons.push("Tight integration med sälj/ERP – Dynamics 365 är en naturlig plattform");
    } else if (data.integratedWithSalesErp === "Ja, integration via API eller middleware") {
      recommendations.customerService.score += 6;
      recommendations.customerService.reasons.push("API-integration med sälj och ERP krävs");
    }

    // Step 5: Systemintegrationsberoenden → påverkar partner-matchning och arkitektur
    if (data.systemDependencies.includes("erp")) {
      recommendations.customerService.score += 10;
      recommendations.fieldService.score += 8;
      recommendations.customerService.reasons.push("ERP-integration – Dynamics 365-plattformen ger sömlös koppling");
    }
    if (data.systemDependencies.includes("iot")) {
      recommendations.fieldService.score += 12;
      recommendations.fieldService.reasons.push("IoT-integration – Field Service har inbyggt IoT-stöd");
    }
    if (data.systemDependencies.includes("lager")) {
      recommendations.fieldService.score += 8;
      recommendations.fieldService.reasons.push("Lagerintegration viktig för reservdelshantering i fältservice");
    }
    if (data.systemDependencies.includes("crm_sales")) {
      recommendations.customerService.score += 10;
      recommendations.customerService.reasons.push("CRM/Sälj-integration – Customer Service och Sales på samma plattform");
    }
    if (data.systemDependencies.includes("telefoni")) {
      recommendations.contactCenter.score += 10;
      recommendations.contactCenter.reasons.push("Telefoniplattform – Contact Center med Teams/Genesys-integration");
    }
    if (data.systemDependencies.length >= 4) {
      recommendations.customerService.score += 8;
      recommendations.customerService.reasons.push("Många systemintegrationsberoenden – krävs en partner med bred erfarenhet");
    }

    // Step 6: AI & Automation
    if (data.aiAutomation.includes("auto_routing")) {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 10;
      recommendations.customerService.reasons.push("Automatisk ärenderouting – inbyggd i Customer Service och Contact Center");
    }
    if (data.aiAutomation.includes("ai_responses")) {
      recommendations.customerService.score += 10;
      recommendations.customerService.reasons.push("AI-assisterade svar – Copilot i Customer Service föreslår svar i realtid");
    }
    if (data.aiAutomation.includes("predictive_maintenance")) {
      recommendations.fieldService.score += 12;
      recommendations.fieldService.reasons.push("Prediktivt underhåll – Field Service med IoT och Copilot stödjer detta nativt");
    }
    if (data.aiAutomation.includes("chatbot_selfservice")) {
      recommendations.customerService.score += 8;
      recommendations.contactCenter.score += 8;
      recommendations.customerService.reasons.push("Chattbot/self-service – Copilot Studio möjliggör avancerade AI-botar");
    }

    if (data.serviceChannels.length >= 3) {
      recommendations.customerService.score += 10;
      recommendations.contactCenter.score += 10;
    }
    const significantChallenges = Object.entries(data.situationChallenges).filter(
      ([_, value]) => value === "Betydande utmaning"
    );
    if (significantChallenges.length > 0) {
      recommendations.customerService.score += significantChallenges.length * 4;
      recommendations.contactCenter.score += significantChallenges.length * 3;
    }
    if (data.hasFieldService === "Ja" || data.hasFieldService === "Planerar att starta") {
      recommendations.fieldService.score += 20;
      recommendations.fieldService.reasons.push("Verksamhet med fältservice");
    }

    const products = [];
    if (recommendations.customerService.score > 15) {
      products.push({
        name: "Dynamics 365 Customer Service",
        icon: "🎧",
        score: recommendations.customerService.score,
        reasons: recommendations.customerService.reasons,
        description: "Komplett ärendehantering med omnichannel-support, knowledge base och AI-assistans.",
      });
    }
    if (recommendations.fieldService.score > 15) {
      products.push({
        name: "Dynamics 365 Field Service",
        icon: "🔧",
        score: recommendations.fieldService.score,
        reasons: recommendations.fieldService.reasons,
        description: "Optimera fältserviceverksamheten med intelligent schemaläggning och mobil app.",
      });
    }
    if (recommendations.contactCenter.score > 15) {
      products.push({
        name: "Dynamics 365 Contact Center",
        icon: "📞",
        score: recommendations.contactCenter.score,
        reasons: recommendations.contactCenter.reasons,
        description: "AI-drivet Contact Center för röst och digitala kanaler med Copilot-assistans.",
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
    pdf.text("BEHOVSANALYS KUNDSERVICE", margin, 25);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Customer Service & Field Service", margin, 35);

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

    addSection("Service-modell", data.serviceModel || "Ej angivet");
    addSection("Företagsinformation", `Anställda: ${data.employees}, Bransch: ${data.industry || data.industryOther || "Ej angivet"}, Serviceteam: ${data.serviceTeamSize}`);
    const filledSystems = data.currentSystems.filter(s => s.product.trim());
    const systemsText = filledSystems.length > 0 
      ? filledSystems.map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ")
      : "Ej angivet";
    addSection("Nuvarande system", systemsText);
    const challengeItems = Object.entries(data.situationChallenges)
      .filter(([_, value]) => value && value !== "Inget problem idag")
      .map(([key, value]) => {
        const category = situationChallengeCategories.find(c => c.id === key);
        return category ? `${category.title}: ${value}` : `${key}: ${value}`;
      });
    addBulletSection("Utmaningar", challengeItems);
    addSection("Supportkanaler", data.serviceChannels.join(", ") || "Ej angivet");
    addSection("Fältservice", data.hasFieldService === "Ja" ? data.fieldServiceNeeds.join(", ") || "Ja" : data.hasFieldService || "Ej angivet");
    addSection("Integrationer", data.integrationSystems.filter(s => s.system.trim()).map(s => `${s.system} (${s.importance})`).join(", ") || "Ej angivet");
    
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
      const aiUseCaseNames = data.aiUseCases.map(id => {
        const useCase = aiUseCaseCategories.find(c => c.id === id);
        return useCase ? useCase.title : id;
      });
      addBulletSection("AI-användningsområden", aiUseCaseNames);
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
    const pdfFilename = `Behovsanalys_Kundservice_${data.companyName || 'Analys'}_${new Date().toISOString().split('T')[0]}`;
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    
    // Save PDF locally
    pdf.save(`${pdfFilename}.pdf`);

    // Send email with PDF attachment
    setIsSendingEmail(true);
    try {
      await supabase.functions.invoke("send-analysis-email", {
        body: {
          analysisType: "Kundservice",
          companyName: data.companyName,
          contactName: data.contactName,
          phone: data.phone || "",
          email: data.email,
          analysisData: {
            "Anställda": data.employees,
            "Bransch": data.industry || data.industryOther || "Ej angivet",
            "Serviceteam": data.serviceTeamSize,
            "Nuvarande system": data.currentSystems.filter(s => s.product.trim()).map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ") || "Ej angivet",
            "Utmaningar": Object.entries(data.situationChallenges)
              .filter(([_, value]) => value && value !== "Inget problem idag")
              .map(([key, value]) => {
                const category = situationChallengeCategories.find(c => c.id === key);
                return category ? `${category.title}: ${value}` : `${key}: ${value}`;
              })
              .join("; ") || "Ej angivet",
            "Supportkanaler": data.serviceChannels.join(", ") || "Ej angivet",
            "Fältservice": data.hasFieldService === "Ja" ? data.fieldServiceNeeds.join(", ") || "Ja" : data.hasFieldService || "Ej angivet",
            "Integrationer": data.integrationSystems.filter(s => s.system.trim()).map(s => `${s.system} (${s.importance})`).join(", ") || "Ej angivet",
            "Önskelista": data.wishlist || "Ej angivet",
            "Beslutstidslinje": data.decisionTimeline || "Ej angivet",
            "AI-intresse": data.aiInterest || "Ej angivet",
            "AI-användningsområden": data.aiUseCases.map(id => {
              const useCase = aiUseCaseCategories.find(c => c.id === id);
              return useCase ? useCase.title : id;
            }).join(", ") || "Ej angivet",
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
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-1 block">Hur levererar ni huvudsakligen kundservice?</Label>
              <p className="text-sm text-muted-foreground mb-4">Ditt val styr vilka frågor och rekommendationer som är relevanta för er.</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    value: "Ärendebaserad kundservice",
                    label: "1️⃣ Ärendebaserad kundservice",
                    description: "Kunder kontaktar er och ni hanterar ärenden"
                  },
                  {
                    value: "Volymbaserad kundservice / Contact Center",
                    label: "2️⃣ Volymbaserad kundservice / Contact Center",
                    description: "Hög volym av inkommande kontakter via flera kanaler"
                  },
                  {
                    value: "Fältservice med tekniker",
                    label: "3️⃣ Fältservice med tekniker på plats",
                    description: "Service utförs hos kund"
                  },
                  {
                    value: "Kombination av flera",
                    label: "4️⃣ Kombination av flera upplägg",
                    description: "Ni arbetar med en mix av ärendehantering, contact center och/eller fältservice"
                  },
                ].map((option) => (
                  <SelectionCard
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    selected={data.serviceModel === option.value}
                    onClick={() => setData({ ...data, serviceModel: option.value })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 3: {
        const isDigital = data.serviceModel === "Ärendebaserad kundservice";
        const isContactCenter = data.serviceModel === "Volymbaserad kundservice / Contact Center";
        const isFieldService = data.serviceModel === "Fältservice med tekniker";
        const isCombination = data.serviceModel === "Kombination av flera";

        const makeRadioGroup = (field: keyof CustomerServiceAnalysisData, options: string[]) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => (
              <SelectionCard
                key={opt}
                label={opt}
                selected={data[field] === opt}
                onClick={() => setData({ ...data, [field]: opt })}
                type="radio"
              />
            ))}
          </div>
        );

        return (
          <div className="space-y-8">
            {/* Header indicating this is adaptive */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-primary font-medium">
                📋 Frågorna nedan är anpassade för: <span className="font-bold">{data.serviceModel || "er valda service-modell"}</span>
              </p>
            </div>

            {/* DIGITAL ÄRENDEHANTERING */}
            {(isDigital || isCombination) && (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Hur många ärenden hanterar ni per månad?</Label>
                  {makeRadioGroup("ticketsPerMonth", [
                    "Färre än 100",
                    "100–500",
                    "500–2 000",
                    "2 000–10 000",
                    "Mer än 10 000",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Har ni SLA-krav på svarstider?</Label>
                  {makeRadioGroup("slaRequirements", [
                    "Ja, strikta krav med avtalade svarstider",
                    "Ja, informella interna mål",
                    "Nej, vi mäter inte detta idag",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Använder ni eller vill ni ha en self-service portal?</Label>
                  {makeRadioGroup("selfServicePortal", [
                    "Ja, vi har en idag",
                    "Nej, men vi vill ha det",
                    "Nej, inte aktuellt",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Har ni en strukturerad kunskapsdatabas för kundservicemedarbetare?</Label>
                  {makeRadioGroup("knowledgeBase", [
                    "Ja, uppdaterad och välstrukturerad",
                    "Delvis – spridd i dokument och e-post",
                    "Nej, kunskapen sitter hos individerna",
                  ])}
                </div>
              </>
            )}

            {/* CONTACT CENTER */}
            {(isContactCenter || isCombination) && (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {isCombination ? "Hur många kundservicemedarbetare arbetar i ert contact center?" : "Hur många kundservicemedarbetare arbetar ni med?"}
                  </Label>
                  {makeRadioGroup("numberOfAgents", [
                    "1–10 kundservicemedarbetare",
                    "11–50 kundservicemedarbetare",
                    "51–150 kundservicemedarbetare",
                    "151–500 kundservicemedarbetare",
                    "Mer än 500 kundservicemedarbetare",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Hur stor är er inkommande volym per dag?</Label>
                  {makeRadioGroup("inboundVolume", [
                    "Färre än 100 kontakter/dag",
                    "100–500 kontakter/dag",
                    "500–2 000 kontakter/dag",
                    "Mer än 2 000 kontakter/dag",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Vilka kanaler hanterar ni i ert contact center?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Telefon (röst)", "E-post", "Chatt", "Sociala medier", "SMS", "Video"].map((ch) => (
                      <SelectionCard
                        key={ch}
                        label={ch}
                        selected={data.contactCenterChannels.includes(ch)}
                        onClick={() => handleCheckboxChange("contactCenterChannels", ch)}
                        type="checkbox"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Behöver ni realtidsstyrning och dashboard för supervisors?</Label>
                  {makeRadioGroup("realtimeManagement", [
                    "Ja, kritiskt för oss",
                    "Ja, önskvärt",
                    "Nej, inte prioriterat",
                  ])}
                </div>
              </>
            )}

            {/* FÄLTSERVICE */}
            {(isFieldService || isCombination) && (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {isCombination ? "Hur många fälttekniker har ni?" : "Hur många tekniker arbetar ni med?"}
                  </Label>
                  {makeRadioGroup("numberOfTechnicians", [
                    "1–10 tekniker",
                    "11–50 tekniker",
                    "51–200 tekniker",
                    "Mer än 200 tekniker",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Hur hanterar ni schemaläggning av tekniker idag?</Label>
                  {makeRadioGroup("schedulingNeeds", [
                    "Manuellt via telefon/mail",
                    "Excel eller enklare verktyg",
                    "Specialiserat schemaläggningssystem",
                    "Ingen fast process",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Hur viktig är reservdelshantering för er?</Label>
                  {makeRadioGroup("sparepartsManagement", [
                    "Kritisk – tekniker måste ha rätt delar vid besöket",
                    "Viktig – men inte alltid avgörande",
                    "Låg – vi beställer vid behov",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Har ni serviceavtal (SLA) med kunder?</Label>
                  {makeRadioGroup("serviceAgreements", [
                    "Ja, med garanterade svarstider och tillgänglighet",
                    "Ja, men enklare åtaganden",
                    "Nej, vi arbetar på förfrågan",
                  ])}
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block">Hur stor är er geografiska spridning?</Label>
                  {makeRadioGroup("geographicSpread", [
                    "Lokalt – en stad/region",
                    "Nationellt – hela Sverige",
                    "Nordiska länder",
                    "Globalt",
                  ])}
                </div>
              </>
            )}

            {/* KOMPLEXITET – gemensamt för alla service-modeller */}
            <div className="border-t border-border pt-6">
              <h3 className="text-base font-semibold mb-1">Verksamhetens komplexitet</h3>
              <p className="text-sm text-muted-foreground mb-6">Avgör vilken arkitektur och plattformsnivå som passar er bäst.</p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Verkar ni i flera länder?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Nej, endast Sverige", "Ja, Norden", "Ja, Europa", "Ja, globalt"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.multiCountry === opt} onClick={() => setData({ ...data, multiCountry: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Behöver ni hantera flera språk i kundservice?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Nej, bara svenska", "Ja, svenska + engelska", "Ja, 3–5 språk", "Ja, mer än 5 språk"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.multiLanguage === opt} onClick={() => setData({ ...data, multiLanguage: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Prioriterar ni kunder olika baserat på t.ex. avtal, segment eller värde?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Nej, alla kunder behandlas lika", "Ja, vi delar in kunder i 2–3 nivåer", "Ja, vi har komplexa prioriteringsregler"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.customerPrioritization === opt} onClick={() => setData({ ...data, customerPrioritization: opt })} type="radio" />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Hanterar ni service för flera produktlinjer eller produktkategorier?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["Nej, en produkt/tjänst", "Ja, 2–5 produktlinjer", "Ja, mer än 5 produktlinjer", "Ja, och de kräver specialistkompetens"].map((opt) => (
                      <SelectionCard key={opt} label={opt} selected={data.multipleProductLines === opt} onClick={() => setData({ ...data, multipleProductLines: opt })} type="radio" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 4: {
        const orgRadio = (field: keyof CustomerServiceAnalysisData, options: string[]) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => (
              <SelectionCard
                key={opt}
                label={opt}
                selected={data[field] === opt}
                onClick={() => setData({ ...data, [field]: opt })}
                type="radio"
              />
            ))}
          </div>
        );
        return (
          <div className="space-y-8">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Varför frågar vi detta?</span> Svaren avgör om ni behöver en central plattform, multi-site-arkitektur eller djup integration med affärssystem.
              </p>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Hur är er serviceorganisation organiserad?</Label>
              {orgRadio("orgStructure", [
                "Central – ett team hanterar all kundservice",
                "Lokal – varje land/region har sitt eget team",
                "Hybrid – central styrning, lokalt utförande",
                "Decentraliserad – affärsenheter hanterar sin egen service",
              ])}
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Behöver ni gemensam uppföljning och rapportering över team/regioner?</Label>
              {orgRadio("sharedReporting", [
                "Ja, ledningen behöver samlad bild",
                "Delvis – på regional nivå",
                "Nej, varje enhet rapporterar lokalt",
              ])}
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Är realtidsrapportering affärskritiskt för er?</Label>
              {orgRadio("realtimeReporting", [
                "Ja, kritiskt – vi behöver live-dashboards",
                "Ja, viktigt men inte kritiskt",
                "Nej, historisk rapportering räcker",
              ])}
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Behöver kundservicesystemet vara integrerat med sälj och ERP?</Label>
              {orgRadio("integratedWithSalesErp", [
                "Ja, tätt integrerat – en plattform",
                "Ja, integration via API eller middleware",
                "Delvis – vi behöver viss datadelning",
                "Nej, systemen körs separat",
              ])}
            </div>
          </div>
        );
      }

      case 5: {
        const systemOptions = [
          { id: "erp", label: "ERP", description: "T.ex. Business Central, Finance, SAP", icon: "🏭" },
          { id: "iot", label: "IoT / Sensorer", description: "Uppkopplade produkter eller maskiner som skickar data", icon: "📡" },
          { id: "product_register", label: "Produktregister", description: "Artikeldatabas, produktkatalog eller PIM-system", icon: "📋" },
          { id: "lager", label: "Lager & lagerstyrning", description: "WMS eller lagermodul för reservdelar och produkter", icon: "📦" },
          { id: "fakturering", label: "Fakturering & ekonomi", description: "Fakturahantering, kreditgränser, betalstatus", icon: "💰" },
          { id: "crm_sales", label: "CRM / Sälj", description: "T.ex. Dynamics 365 Sales, Salesforce", icon: "🤝" },
          { id: "field_service_ext", label: "Fältservice-system", description: "Externt system för arbetsorder och tekniker", icon: "🔧" },
          { id: "telefoni", label: "Telefoni / Växel", description: "Telefoniplattform, Teams, Telavox etc.", icon: "📞" },
          { id: "e_handel", label: "E-handel", description: "Webshop, orderhantering online", icon: "🛒" },
          { id: "hr", label: "HR-system", description: "Personaldata, kompetensprofiler, certifikat", icon: "👥" },
        ];
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Varför frågar vi detta?</span> Integrationsbehoven avgör vilken arkitektur och vilka partners som passar er bäst. En partner med rätt erfarenhet av era system kan halvera implementationstiden.
              </p>
            </div>
            <div>
              <Label className="text-base font-semibold mb-1 block">Hur beroende är er service av andra system?</Label>
              <p className="text-sm text-muted-foreground mb-4">Markera alla system som er kundservice behöver läsa eller skriva data från/till.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {systemOptions.map((sys) => {
                  const isSelected = data.systemDependencies.includes(sys.id);
                  return (
                    <button
                      key={sys.id}
                      type="button"
                      onClick={() => handleCheckboxChange("systemDependencies", sys.id)}
                      className={`relative flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-200 group ${
                        isSelected
                          ? "border-primary bg-primary/[0.07] shadow-sm"
                          : "border-border/70 bg-background hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{sys.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>{sys.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{sys.description}</p>
                      </div>
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {data.systemDependencies.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    ✓ {data.systemDependencies.length} system valda – vi matchar er med partners som har erfarenhet av dessa integrationer
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      }

      case 6: {
        const aiAutomationOptions = [
          {
            id: "auto_routing",
            label: "Automatisk ärenderouting",
            description: "Ärenden dirigeras automatiskt till rätt agent/kö baserat på typ, kanal eller kundprofil",
            icon: "🔀",
          },
          {
            id: "ai_responses",
            label: "AI-assisterade svar",
            description: "Kundservicemedarbetare får förslag på svar baserade på ärendehistorik och kunskapsdatabas",
            icon: "🤖",
          },
          {
            id: "predictive_maintenance",
            label: "Prediktivt underhåll",
            description: "Systemet förutser servicebehov baserat på sensordata eller användningsmönster",
            icon: "🔮",
          },
          {
            id: "chatbot_selfservice",
            label: "Chattbot / Self-service",
            description: "Kunder löser ärenden själva via bot eller portal innan de når en agent",
            icon: "💬",
          },
        ];
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Varför frågar vi detta?</span> AI- och automationskrav påverkar vilken lösning och vilken partner som passar er – exempelvis kräver prediktivt underhåll IoT-kompetens och Contact Center-bots kräver specifik plattformserfarenhet.
              </p>
            </div>
            <div>
              <Label className="text-base font-semibold mb-1 block">Vilka AI- och automationfunktioner är intressanta för er?</Label>
              <p className="text-sm text-muted-foreground mb-4">Markera alla som är relevanta. Det är okej att inte veta ännu – välj det som låter intressant.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiAutomationOptions.map((opt) => {
                  const isSelected = data.aiAutomation.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleCheckboxChange("aiAutomation", opt.id)}
                      className={`relative flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-200 group ${
                        isSelected
                          ? "border-primary bg-primary/[0.07] shadow-sm"
                          : "border-border/70 bg-background hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0 mt-0.5">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{opt.description}</p>
                      </div>
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {data.aiAutomation.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    ✓ {data.aiAutomation.length} område{data.aiAutomation.length > 1 ? "n" : ""} valda – vi matchar er med partners som har AI-kompetens inom dessa områden
                  </p>
                </div>
              )}
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
          </div>
        );
      }

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
              <Label className="text-base font-semibold mb-3 block">Storlek på kundservice-/Contact Centerteam</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {teamSizeOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.serviceTeamSize === option}
                    onClick={() => setData({ ...data, serviceTeamSize: option })}
                    type="radio"
                  />
                ))}
              </div>
            </div>
          </div>
        );



      case 7: {
        const rec = getRecommendation();

        // 1️⃣ Er serviceprofil
        const serviceProfileMap: Record<string, { label: string; icon: string; color: string }> = {
          "Ärendebaserad kundservice": { label: "Ärendebaserad service", icon: "💻", color: "text-blue-600" },
          "Volymbaserad kundservice / Contact Center": { label: "Contact Center", icon: "📞", color: "text-purple-600" },
          "Fältservice med tekniker": { label: "Fältservice", icon: "🔧", color: "text-amber-600" },
          "Kombination av flera": { label: "Hybrid service", icon: "🔀", color: "text-green-600" },
        };
        const profile = serviceProfileMap[data.serviceModel] || { label: "Ej angiven", icon: "❓", color: "text-muted-foreground" };

        // 2️⃣ Servicekomplexitet
        let complexityScore = 0;
        if (data.ticketsPerMonthComplex === "2 000–10 000" || data.ticketsPerMonthComplex === "Mer än 10 000") complexityScore += 2;
        else if (data.ticketsPerMonthComplex === "500–2 000") complexityScore += 1;
        if (data.multiCountry === "Ja, globalt" || data.multiCountry === "Ja, Europa") complexityScore += 2;
        else if (data.multiCountry === "Ja, Norden") complexityScore += 1;
        if (data.multiLanguage === "Ja, mer än 5 språk" || data.multiLanguage === "Ja, 3–5 språk") complexityScore += 2;
        else if (data.multiLanguage === "Ja, svenska + engelska") complexityScore += 1;
        if (data.slaContracts === "Ja, komplexa SLA per kundsegment" || data.slaContracts === "Ja, kontraktuella SLA med viten") complexityScore += 2;
        else if (data.slaContracts === "Ja, informella mål") complexityScore += 1;
        if (data.customerPrioritization === "Ja, vi har komplexa prioriteringsregler") complexityScore += 2;
        else if (data.customerPrioritization === "Ja, vi delar in kunder i 2–3 nivåer") complexityScore += 1;
        if (data.multipleProductLines === "Ja, och de kräver specialistkompetens" || data.multipleProductLines === "Ja, mer än 5 produktlinjer") complexityScore += 2;
        else if (data.multipleProductLines === "Ja, 2–5 produktlinjer") complexityScore += 1;

        const complexityLevel = complexityScore >= 8 ? "Hög" : complexityScore >= 4 ? "Medel" : "Låg";
        const complexityColor = complexityLevel === "Hög" ? "text-red-600 bg-red-50 border-red-200" : complexityLevel === "Medel" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-green-600 bg-green-50 border-green-200";
        const complexityBar = complexityLevel === "Hög" ? 85 : complexityLevel === "Medel" ? 50 : 20;

        // 4️⃣ Rekommenderad partnertyp
        const partnerTypes: { icon: string; label: string; description: string }[] = [];
        const hasFieldService = rec.products.some(p => p.name.includes("Field Service") && p.score > 30);
        const hasContactCenter = rec.products.some(p => p.name.includes("Contact Center") && p.score > 30);
        const hasCustomerService = rec.products.some(p => p.name.includes("Customer Service") && p.score > 30);
        const isEnterprise = complexityLevel === "Hög" || data.multiCountry === "Ja, Europa" || data.multiCountry === "Ja, globalt" || (data.orgStructure || "").includes("Hybrid") || (data.orgStructure || "").includes("Decentraliserad");

        if (hasFieldService) {
          partnerTypes.push({ icon: "🔧", label: "Field Service-specialist", description: "Partner med djup erfarenhet av IoT, schemaläggning och fältservice-implementationer" });
        }
        if (hasContactCenter) {
          partnerTypes.push({ icon: "📞", label: "Contact Center-specialist", description: "Partner med telefoniplattformar (Teams, Genesys) och omnichannel-kompetens" });
        }
        if (isEnterprise && (hasCustomerService || hasContactCenter)) {
          partnerTypes.push({ icon: "🏢", label: "Enterprise service-arkitekt", description: "Partner med erfarenhet av komplexa multi-site och enterprise-lösningar" });
        }
        if (!isEnterprise && hasCustomerService) {
          partnerTypes.push({ icon: "⚡", label: "Mid-market servicepartner", description: "Partner specialiserad på snabba och kostnadseffektiva Customer Service-driftsättningar" });
        }
        if (partnerTypes.length === 0) {
          partnerTypes.push({ icon: "⚡", label: "Mid-market servicepartner", description: "Partner specialiserad på snabba och kostnadseffektiva Customer Service-driftsättningar" });
        }

        return (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-primary font-medium">
                🎯 Baserat på era svar har vi sammanställt er serviceprofil. Fyll i kontaktuppgifter i nästa steg för att ladda ner den fullständiga analysen.
              </p>
            </div>

            {/* 1️⃣ Er serviceprofil */}
            <div className="border rounded-xl p-5 space-y-3 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
                Er serviceprofil
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-3xl">{profile.icon}</span>
                <div>
                  <p className={`text-lg font-bold ${profile.color}`}>{profile.label}</p>
                  <p className="text-xs text-muted-foreground">Primär service-modell baserat på era svar</p>
                </div>
              </div>
              {data.serviceModel === "Kombination av flera" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {["💻 Digital", "📞 Contact Center", "🔧 Fält"].map(tag => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* 2️⃣ Servicekomplexitet */}
            <div className="border rounded-xl p-5 space-y-3 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
                Servicekomplexitet
              </h3>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${complexityColor}`}>
                {complexityLevel === "Hög" ? "🔴" : complexityLevel === "Medel" ? "🟡" : "🟢"} {complexityLevel} komplexitet
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Låg</span><span>Medel</span><span>Hög</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${complexityLevel === "Hög" ? "bg-red-500" : complexityLevel === "Medel" ? "bg-amber-500" : "bg-green-500"}`}
                    style={{ width: `${complexityBar}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { label: "Länder", value: data.multiCountry || "Ej angivet" },
                  { label: "Språk", value: data.multiLanguage || "Ej angivet" },
                  { label: "SLA", value: data.slaContracts || "Ej angivet" },
                  { label: "Kundprioritering", value: data.customerPrioritization || "Ej angivet" },
                ].map(item => (
                  <div key={item.label} className="bg-muted/40 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xs font-medium text-foreground truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3️⃣ Rekommenderad lösningsinriktning */}
            <div className="border rounded-xl p-5 space-y-4 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
                Rekommenderad lösningsinriktning
              </h3>

              {rec.products.length > 0 ? (
                <>
                  {/* Fokusområden */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">
                      Baserat på er serviceprofil rekommenderas en lösning med fokus på:
                    </p>
                    <div className="space-y-2">
                      {(() => {
                        const focusMap: Record<string, { icon: string; label: string }[]> = {
                          "Dynamics 365 Customer Service": [
                            { icon: "📋", label: "Central ärendehantering" },
                            { icon: "🔀", label: "Omnichannel och kanalsamordning" },
                            { icon: "🤖", label: "AI-assisterade kundservicemedarbetare och kunskapsbas" },
                          ],
                          "Dynamics 365 Field Service": [
                            { icon: "🗓️", label: "Schemaläggning och mobilt teknikerstöd" },
                            { icon: "📡", label: "IoT och prediktivt underhåll" },
                            { icon: "🔧", label: "Arbetsorder och reservdelshantering" },
                          ],
                          "Dynamics 365 Contact Center": [
                            { icon: "☎️", label: "Multikanalhantering och röstintegration" },
                            { icon: "📊", label: "Realtidsdashboard och supervisor-styrning" },
                            { icon: "🤖", label: "AI-driven ärenderouting och chattbot" },
                          ],
                        };
                        const seen = new Set<string>();
                        return rec.products.slice(0, 3).flatMap(p => focusMap[p.name] || []).filter(f => {
                          if (seen.has(f.label)) return false;
                          seen.add(f.label);
                          return true;
                        }).slice(0, 5).map(focus => (
                          <div key={focus.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                            <span className="text-lg flex-shrink-0">{focus.icon}</span>
                            <p className="text-sm font-medium text-foreground">{focus.label}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Plattformar bakom */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
                      Bakom kulisserna lutar det mot
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rec.products.slice(0, 3).map((product, i) => (
                        <div
                          key={product.name}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            i === 0
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          <span>{product.icon}</span>
                          <span>{product.name}</span>
                        </div>
                      ))}
                    </div>
                    {rec.products[0]?.reasons?.[0] && (
                      <p className="text-xs text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">
                        "{rec.products[0].reasons[0]}"
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Fyll i fler steg för en fullständig rekommendation.</p>
              )}
            </div>

            {/* 4️⃣ Rekommenderad partnertyp */}
            <div className="border rounded-xl p-5 space-y-3 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">4</span>
                Rekommenderad partnertyp
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {partnerTypes.map((pt) => (
                  <div key={pt.label} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20">
                    <span className="text-2xl flex-shrink-0">{pt.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{pt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/40 border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                📄 Fyll i kontaktuppgifter i nästa steg för att ladda ner er fullständiga analys med detaljerade rekommendationer och skräddarsydda partner-förslag.
              </p>
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
        title="Kundservice Behovsanalys | Dynamics 365"
        description="Gör vår kostnadsfria behovsanalys och få en personlig rekommendation för Dynamics 365 Customer Service, Field Service och Contact Center."
        canonicalPath="/kundservice-behovsanalys"
        keywords="kundservice behovsanalys, Dynamics 365 Customer Service, Field Service, Contact Center"
      />
      <ServiceSchema 
        name="Kundservice Behovsanalys"
        description="Kostnadsfri behovsanalys för att hitta rätt Dynamics 365 lösning för kundservice och fältservice."
      />
      <BreadcrumbSchema items={customerServiceBreadcrumbs} />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Behovsanalys Kundservice
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Svara på frågorna för att få en personlig rekommendation om Dynamics 365 Customer Service, Field Service och Contact Center.
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

export default CustomerServiceNeedsAnalysis;
