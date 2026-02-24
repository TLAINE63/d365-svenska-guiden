import { useState } from "react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Download, Building2, Globe, Boxes, Link2, Server, AlertTriangle, BarChart3, Sparkles, FileText, CheckCircle2, Layers, Shield, TrendingUp } from "lucide-react";
import SelectionCard from "@/components/SelectionCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";

// Breadcrumb items
const needsAnalysisBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "ERP Behovsanalys", url: "https://d365.se/behovsanalys" },
];

// Contact form validation schema
const contactFormSchema = z.object({
  companyName: z.string().trim().min(1, "Företagsnamn krävs").max(100, "Företagsnamn får max vara 100 tecken"),
  contactName: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  phone: z.string().trim().min(1, "Telefonnummer krävs").max(20, "Telefonnummer får max vara 20 tecken"),
  email: z.string().trim().min(1, "E-postadress krävs").email("Ogiltig e-postadress").max(255, "E-postadress får max vara 255 tecken"),
});

type ContactFormErrors = Partial<Record<keyof z.infer<typeof contactFormSchema>, string>>;

interface ComplexityData {
  legalEntities: string;
  countries: string;
  intercompany: string;
  consolidation: string;
  productionType: string;
  warehouseManagement: string;
  warehouseCount: string;
  mrpAps: string;
  transactionVolume: string;
  itOrganization: string;
  integrationPlatform: string;
  governance: string;
  globalStandardization: string;
  // Consulting-specific
  simultaneousProjects: string;
  projectAccounting: string;
  globalDelivery: string;
  billingModels: string;
  // Retail-specific
  storeCount: string;
  ecommercePlatform: string;
  posIntegration: string;
  realtimeInventory: string;
  campaignPricing: string;
}

interface AnalysisData {
  // Step 1 - Business model
  businessModel: string;
  businessModelSub: string;
  businessModelSubs: string[];
  // Step 2
  employees: string;
  revenue: string;
  // Step 3
  industry: string;
  industryOther: string;
  // Step 4 - Complexity assessment
  complexity: ComplexityData;
  // Step 5
  geography: string;
  geographyOther: string;
  // Step 6 (Önskelista moved)
  wishlist: string;
  // Step 7
  currentSituationReason: string;
  situationChallenges: Record<string, string>;
  decisionTimeline: string;
  // Step 8
  integrationSystems: { system: string; importance: string }[];
  // Step 8
  currentSystems: { product: string; year: string }[];
  otherSystems: string[];
  otherSystemsDetails: string;
  // Step 9
  challenges: string[];
  challengesOther: string;
  // Step 10
  kpis: string[];
  kpisOther: string;
  // Step 11
  aiInterest: string;
  aiUseCases: string[];
  aiDetails: string;
  // Step 11
  additionalInfo: string;
  // Contact info
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
}

const initialComplexity: ComplexityData = {
  legalEntities: "",
  countries: "",
  intercompany: "",
  consolidation: "",
  productionType: "",
  warehouseManagement: "",
  warehouseCount: "",
  mrpAps: "",
  transactionVolume: "",
  itOrganization: "",
  integrationPlatform: "",
  governance: "",
  globalStandardization: "",
  simultaneousProjects: "",
  projectAccounting: "",
  globalDelivery: "",
  billingModels: "",
  storeCount: "",
  ecommercePlatform: "",
  posIntegration: "",
  realtimeInventory: "",
  campaignPricing: "",
};

const businessModelOptions = [
  {
    value: "Produktion",
    label: "Produktion / Tillverkningsindustrin",
    subcategories: [
      "Lagerstyrd produktion",
      "Orderstyrd leverans",
      "Projekt- eller konstruktionsdriven leverans",
      "Reglerad eller receptbaserad produktion",
    ],
    multiSelect: true,
  },
  {
    value: "Distribution",
    label: "Grossist / Distribution",
    subQuestion: "Hur komplex är er lager- och leveransstruktur?",
    subcategories: [
      "Enkel (1–2 lager, lokal verksamhet)",
      "Flera lager inom Norden",
      "Flera lager internationellt",
      "Avancerad logistik med integrationer/3PL",
    ],
    multiSelect: true,
    exclusiveGroup: ["Enkel (1–2 lager, lokal verksamhet)", "Flera lager inom Norden", "Flera lager internationellt"],
  },
  {
    value: "Konsult",
    label: "Konsult / Projektbaserad verksamhet",
    subcategories: [
      "Tjänsteproduktion",
      "Projektleveranser",
    ],
  },
  {
    value: "Retail",
    label: "Retail",
    subcategories: [
      "Enbart fysisk butik",
      "Enbart e-handel",
      "Kombination butik + e-handel",
      "Omnikanal med realtidsintegration",
    ],
    multiSelect: true,
    exclusiveGroup: ["Enbart fysisk butik", "Enbart e-handel", "Kombination butik + e-handel"],
    subQuestion: "Hur ser er försäljningsmodell ut?",
  },
  {
    value: "Annat",
    label: "Annat",
    subcategories: [],
  },
];

const initialData: AnalysisData = {
  businessModel: "",
  businessModelSub: "",
  businessModelSubs: [],
  employees: "",
  revenue: "",
  industry: "",
  industryOther: "",
  complexity: { ...initialComplexity },
  geography: "",
  geographyOther: "",
  wishlist: "",
  currentSituationReason: "",
  situationChallenges: {},
  decisionTimeline: "",
  integrationSystems: [
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
    { system: "", importance: "" },
  ],
  currentSystems: [
    { product: "", year: "" },
    { product: "", year: "" },
    { product: "", year: "" },
  ],
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

// Situation challenge categories for Step 6
const situationChallengeCategories = [
  {
    id: "tillvaxt",
    title: "Tillväxt & förändrad affär",
    subtitle: "Affären växer snabbare än systemen klarar av",
    items: [
      "Kraftig omsättnings- eller personalökning",
      "Expansion till nya länder/marknader",
      "Nya affärsmodeller (abonnemang, e-handel, tjänstefiering)",
      "Fler bolag eller juridiska enheter",
    ],
  },
  {
    id: "ma",
    title: "M&A, avknoppningar eller koncernförändringar",
    subtitle: "Strukturförändringar som spräcker systemlandskapet",
    items: [
      "Förvärv av bolag med andra system",
      "Fusioner som kräver konsolidering",
      "Avknoppning från moderbolag",
    ],
  },
  {
    id: "foraldrat",
    title: "Befintligt ERP är föråldrat eller riskfyllt",
    subtitle: "Teknisk skuld blir affärsrisk",
    items: [
      "Systemet är on-prem, tungt anpassat, svårt att uppgradera",
      "Leverantören slutar supportera versionen",
      "Brist på integrationer / API:er",
      "Svårt att hitta kompetens på marknaden",
    ],
  },
  {
    id: "ekonomistyrning",
    title: "Ekonomistyrning & rapportering brister",
    subtitle: "Ledningen upplever bristande kontrollfunktioner",
    items: [
      "Lång bokslutsprocess (många manuella steg)",
      "Ingen realtidsvy på lönsamhet, kassaflöde eller lager",
      "Svårt att följa upp projekt, affärer eller kunder",
    ],
  },
  {
    id: "regelverk",
    title: "Regelverk, compliance & risk",
    subtitle: "Yttre krav som inte går att ignorera",
    items: [
      "Nya lagkrav (ex. redovisning, skatt, spårbarhet)",
      "Branschkrav (life science, tillverkning, finans)",
      "Internrevision eller extern revision som slår larm",
    ],
  },
  {
    id: "ineffektivitet",
    title: "Operativ ineffektivitet",
    subtitle: "Folk jobbar runt systemet istället för i det",
    items: [
      "Mycket manuellt arbete i inköp, order, lager",
      "Fel i order, fakturering eller leveranser",
      "Processer skiljer sig mellan avdelningar",
    ],
  },
  {
    id: "digitalisering",
    title: "Strategisk digitalisering",
    subtitle: "ERP blir en möjliggörare, inte bara ett stöd",
    items: [
      "Initiativ kring automation, AI eller datadrivet beslutsfattande",
      "CRM, BI eller e-handel kräver stabil masterdata",
      "Ledningen vill standardisera och skala",
    ],
  },
];

const situationChallengeOptions = ["Betydande utmaning", "Viss utmaning", "Inget problem idag"];

const employeeOptions = [
  "1-49 anställda",
  "50-99 anställda",
  "100-249 anställda",
  "250-999 anställda",
  "1.000-4.999 anställda",
  "Mer än 5.000 anställda",
];

const revenueOptions = [
  "1-9 MSEK",
  "10-49 MSEK",
  "50-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  "> 5.000 MSEK",
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
  "Produktion & Montering",
  "Projekthantering",
  "Service & Fältservice",
  "Offert & Order",
  "E-handel",
  "Business Intelligence & Rapportering",
];

const challengeOptions = [
  "Stark tillväxt eller internationalisering",
  "Större omorganisation/koncernstruktur",
  "Förvärv/sammanslagning",
  "Bristande översikt och rapportering",
  "Manuella och tidskrävande processer",
  "Dålig integration med övriga system i verksamheten",
  "Höga underhållskostnader",
  "Föråldrad teknik utan support",
  "Bristande mobilitet och tillgänglighet",
  "Svårt att hitta kompetens",
  "Förändrade regulatoriska krav",
  "Behov av bättre kundinsikter",
  "Ekonomi och styrning funkar – men kräver för mycket manuellt jobb (bokslut tar för lång tid, många excel-kranar, bristande spårbarhet/audit trail, otydlig kostnadsfördelning)",
  "Fragmenterade system och dubbelregistrering (data i silos, sköra/dyra integrationer)",
  "Brister i lager- och leveransprecision (bristande spårbarhet batch/serie/lot, planering på känsla)",
  "Processerna är inte standardiserade eller skalbara (varje avdelning jobbar på sitt sätt, svårt att rulla ut nya produkter/marknader)",
  "Affären har ändrats – ERP:et hänger inte med (nya affärsmodeller, ökad internationell komplexitet)",
  "Bristande rapportering och beslutstöd (svårt att få prognoser, scenarioanalys, KPI:er man kan lita på)",
  "Gamla, kraftigt kundanpassade on-prem-lösningar (dyra uppgraderingar, prestanda-/driftsproblem)",
  "Order-to-cash eller procure-to-pay tar för lång tid (mycket brandsläckning, beroende av nyckelpersoner)",
];

// Common KPIs that apply to all industries
const commonKpis = [
  "Omsättning och tillväxt",
  "Bruttomarginal",
  "Kassaflöde",
  "Produktivitet per anställd",
  "Kundnöjdhet (NPS/CSAT)",
];

// Industry-specific KPIs mapping
const industryKpiMapping: Record<string, string[]> = {
  "Tillverkningsindustri": [
    "Ledtider i produktion",
    "OEE (Overall Equipment Effectiveness)",
    "Lagervärde och omsättningshastighet",
    "Leveransprecision",
    "Produktionskostnad per enhet",
    "Kassationsgrad/spill",
    "Kapacitetsutnyttjande",
  ],
  "Livsmedel & Processindustri": [
    "Batchspårbarhet",
    "Hållbarhetskontroll",
    "Produktionskostnad per enhet",
    "Kvalitetsavvikelser",
    "Lagervärde och omsättningshastighet",
    "Leveransprecision",
    "Recepthantering",
  ],
  "Grossist & Distribution": [
    "Leveransprecision",
    "Lagervärde och omsättningshastighet",
    "Ordervärde (AOV)",
    "Fyllnadsgrad",
    "Kostnad per order",
    "Ledtid order-till-leverans",
    "Kundretention",
  ],
  "Retail & E-handel": [
    "Ordervärde (AOV)",
    "Konverteringsgrad",
    "Lagervärde och omsättningshastighet",
    "Kundlivstidsvärde (CLV)",
    "Returer och reklamationer",
    "Försäljning per kvadratmeter",
    "Kundanskaffningskostnad (CAC)",
  ],
  "Konsulttjänster": [
    "Faktureringsgrad",
    "Debiteringsgrad per konsult",
    "Projektlönsamhet",
    "Kundnöjdhet per uppdrag",
    "Personalomsättning",
    "Pipeline-värde",
    "Genomsnittlig projekttid",
  ],
  "Bygg & Entreprenad": [
    "Projektlönsamhet",
    "Leveransprecision material",
    "Resursbeläggning",
    "Säkerhetsincidenter",
    "Budgetutfall per projekt",
    "Kundnöjdhet",
    "Ledtid projekt",
  ],
  "Fastighet & Förvaltning": [
    "Uthyrningsgrad",
    "Hyresintäkt per kvm",
    "Driftkostnad per kvm",
    "Vakansgrad",
    "Underhållskostnad",
    "Hyresgästnöjdhet",
    "Energiförbrukning",
  ],
  "Energi & Utilities": [
    "Leveranssäkerhet",
    "Nätförluster",
    "Kostnad per producerad enhet",
    "Hållbarhetsmål (CO2, förnybart)",
    "Kundavbrott (SAIDI/SAIFI)",
    "Underhållskostnad",
    "Kapacitetsutnyttjande",
  ],
  "Finans & Försäkring": [
    "Skadefrekvens",
    "Combined ratio",
    "Kundanskaffningskostnad (CAC)",
    "Kundlivstidsvärde (CLV)",
    "Regelefterlevnad",
    "Handläggningstid",
    "Digital adoptionsgrad",
  ],
  "Life Science / Medtech": [
    "Time-to-market",
    "R&D-kostnad per projekt",
    "Regulatorisk efterlevnad",
    "Batchavkastning",
    "Kvalitetsavvikelser",
    "Spårbarhet (batch/lot)",
    "Kliniska prövningsresultat",
  ],
  "Telekom & IT-tjänster": [
    "Kundchurn",
    "ARPU (Average Revenue Per User)",
    "Servicetillgänglighet (uptime)",
    "Kundnöjdhet (NPS)",
    "Faktureringsgrad",
    "Supportärendetid",
    "Projektlönsamhet",
  ],
  "Logistik & Transport": [
    "Leveransprecision",
    "Fyllnadsgrad",
    "Kostnad per km/ton",
    "Fordonsutnyttjande",
    "Bränsleförbrukning",
    "Ledtid",
    "Skadefrekvens",
  ],
  "Media & Publishing": [
    "Prenumeranttillväxt",
    "Churn rate",
    "Annonsintäkter",
    "Innehållsproduktionskostnad",
    "Engagemang (tid på sida, visningar)",
    "Digital vs. print-intäkt",
    "Royalty-hantering",
  ],
  "Jordbruk & Skogsbruk": [
    "Avkastning per hektar",
    "Produktionskostnad",
    "Säsongsplanering",
    "Tillgångsunderhåll",
    "Lagervärde",
    "Kvalitetsmätningar",
    "Hållbarhetsmål",
  ],
  "Hälsa- & sjukvård": [
    "Patientnöjdhet",
    "Väntetider",
    "Beläggningsgrad",
    "Kostnad per patient",
    "Återinläggningsfrekvens",
    "Personaltäthet",
    "Kvalitetsindikatorer",
  ],
  "Non-profit / Organisationer": [
    "Insamlade medel",
    "Administrationskostnad (%)",
    "Givarretention",
    "Projekteffektivitet",
    "Volontärengagemang",
    "Räckvidd (personer hjälpta)",
    "Transparens och rapportering",
  ],
  "Utbildning": [
    "Genomströmning",
    "Studentnöjdhet",
    "Kostnad per student",
    "Lärartäthet",
    "Betygssnitt",
    "Anställningsbarhet efter examen",
    "Forskningsoutput",
  ],
  "Offentlig sektor": [
    "Handläggningstid",
    "Medborgarnöjdhet",
    "Budgetutfall",
    "Digitala tjänster (andel)",
    "Tillgänglighet",
    "Regelefterlevnad",
    "Kostnad per ärende",
  ],
};

// Function to get KPIs based on selected industry
const getKpisForIndustry = (selectedIndustry: string): string[] => {
  if (!selectedIndustry) {
    return [
      ...commonKpis,
      "Lagervärde och omsättningshastighet",
      "Leveransprecision",
      "Ordervärde (AOV)",
      "Ledtider i produktion",
      "Kostnad per order",
    ];
  }
  const industrySpecificKpis = industryKpiMapping[selectedIndustry] || [];
  return [...commonKpis, ...industrySpecificKpis];
};

// AI use cases with descriptions
const aiUseCaseCategories = [
  {
    id: "prognoser-planering",
    title: "Prognoser & planering",
    description: "Efterfrågeprognoser som justeras i realtid baserat på historik, säsong, kampanjer och externa faktorer. Produktions- och kapacitetsplanering som minimerar flaskhalsar och övertid. Likviditetsprognoser med bättre precision än traditionella Excel-modeller.",
    benefit: "Affärsnytta: Mindre lager, färre bristsituationer, bättre kassaflöde."
  },
  {
    id: "automatiserad-ekonomi",
    title: "Automatiserad ekonomi & redovisning",
    description: "Automatisk kontering av leverantörsfakturor baserat på tidigare beteenden. Avvikelsedetektering som flaggar fel, dubbletter eller potentiellt bedrägeri. Prediktiv bokslutsanalys som visar var problem sannolikt uppstår innan månadsbokslut.",
    benefit: "Affärsnytta: Lägre administrativa kostnader, snabbare bokslut, minskad risk."
  },
  {
    id: "smart-inkop",
    title: "Smart inköp & supply chain",
    description: "Rekommenderade inköpstidpunkter baserat på prisutveckling, leveranstider och efterfrågan. Leverantörsranking som tar hänsyn till pris, kvalitet, leveransprecision och risk. Riskanalys (t.ex. sannolikhet för leveransförseningar).",
    benefit: "Affärsnytta: Lägre inköpskostnader och mer robust leveranskedja."
  },
  {
    id: "forsaljning-kundhantering",
    title: "Försäljning & kundhantering",
    description: "Lead scoring – AI prioriterar affärer med högst sannolikhet att stängas. Nästa-bästa-åtgärd: systemet föreslår när, hur och med vilket erbjudande säljaren bör kontakta kunden. Kundanalyser som förutser churn eller korsförsäljningsmöjligheter.",
    benefit: "Affärsnytta: Högre win-rate och mer träffsäkra säljinsatser."
  },
  {
    id: "hr-resursoptimering",
    title: "HR & resursoptimering",
    description: "Prediktion av personalomsättning baserat på mönster i frånvaro, prestation och engagemang. Smart schemaläggning som balanserar kostnad, kompetens och arbetsbelastning. Kompetensmatchning för projekt och interna roller.",
    benefit: "Affärsnytta: Lägre personalomsättning och bättre nyttjande av kompetens."
  },
  {
    id: "beslutsstod-realtid",
    title: "Beslutsstöd i realtid",
    description: "AI-drivna dashboards som inte bara visar siffror – utan förklarar varför något händer. Simuleringar: \"Vad händer med marginalen om vi höjer priset 3 %?\" Automatiska rekommendationer istället för statiska rapporter.",
    benefit: "Affärsnytta: Snabbare och bättre beslut på alla nivåer."
  },
  {
    id: "naturligt-sprak",
    title: "Naturligt språk & användarupplevelse",
    description: "Fråga ERP-systemet på vanlig svenska: \"Vilka kunder riskerar att sluta handla nästa kvartal?\" \"Var tappar vi mest marginal just nu?\" AI sammanfattar rapporter och föreslår åtgärder.",
    benefit: "Affärsnytta: Lägre tröskel till insikter – fler använder systemet rätt."
  }
];

// ============ Complexity Assessment Options ============

const complexityStructureOptions = {
  legalEntities: [
    { value: "1-2", label: "1–2 bolag" },
    { value: "3-5", label: "3–5 bolag" },
    { value: "6+", label: "6+ bolag" },
  ],
  countries: [
    { value: "1", label: "1 land" },
    { value: "2-5", label: "2–5 länder" },
    { value: "6+", label: "6+ länder" },
  ],
  intercompany: [
    { value: "ingen", label: "Ingen internhandel" },
    { value: "viss", label: "Viss internhandel" },
    { value: "omfattande", label: "Omfattande internhandel" },
  ],
  consolidation: [
    { value: "nej", label: "Inget konsolideringskrav" },
    { value: "enkel", label: "Enkel konsolidering" },
    { value: "komplex", label: "Komplex konsolidering (multi-GAAP, valutor)" },
  ],
};

const complexityOperativeOptions = {
  productionType: [
    { value: "ingen", label: "Ingen produktion" },
    { value: "enkel", label: "Enkel diskret produktion / montering" },
    { value: "avancerad", label: "Avancerad MRP / komplex planering / processproduktion" },
  ],
  warehouseManagement: [
    { value: "nej", label: "Ingen avancerad lagerstyrning" },
    { value: "grundlaggande", label: "Grundläggande WMS" },
    { value: "avancerad", label: "Avancerad WMS med zoner, plockrundor, automation" },
  ],
  warehouseCount: [
    { value: "1-2", label: "1–2 lager" },
    { value: "3-5", label: "3–5 lager" },
    { value: "flera-lander", label: "Flera lager i flera länder" },
  ],
  mrpAps: [
    { value: "nej", label: "Inget MRP/APS-behov" },
    { value: "grundlaggande", label: "Grundläggande materialplanering" },
    { value: "avancerat", label: "Avancerad produktionsplanering (APS/kapacitetsplanering)" },
  ],
  transactionVolume: [
    { value: "lag", label: "Låg (< 1 000 order/mån)" },
    { value: "medel", label: "Medel (1 000–10 000 order/mån)" },
    { value: "hog", label: "Hög (> 10 000 order/mån)" },
  ],
};

const complexityMaturityOptions = {
  itOrganization: [
    { value: "ingen", label: "Ingen/minimal intern IT" },
    { value: "liten", label: "Liten IT-avdelning (1–3 pers)" },
    { value: "stor", label: "Stor/dedikerad IT-organisation" },
  ],
  integrationPlatform: [
    { value: "inga", label: "Vi har idag inga externa system som behöver kopplas samman med affärssystemet" },
    { value: "nagra", label: "Vi har flera system som behöver integreras" },
    { value: "manga", label: "Vi är starkt beroende av flera affärskritiska integrationer" },
  ],
  governance: [
    { value: "informell", label: "Vi arbetar flexibelt och beslutar löpande vid behov" },
    { value: "viss", label: "Vi har definierade processer men anpassar oss vid behov" },
    { value: "formell", label: "Vi har tydliga roller, beslutsforum och fastställda arbetssätt" },
  ],
  globalStandardization: [
    { value: "nej", label: "Varje enhet arbetar relativt självständigt" },
    { value: "viss", label: "Vi strävar efter gemensamma arbetssätt där det är möjligt" },
    { value: "hog", label: "Vi kräver enhetliga processer och system över hela organisationen" },
  ],
};

// ============ Consulting-specific Complexity Options ============
const complexityConsultingOptions = {
  simultaneousProjects: [
    { value: "fa", label: "1–20 samtidiga projekt" },
    { value: "medel", label: "20–100 samtidiga projekt" },
    { value: "manga", label: "100+ samtidiga projekt" },
  ],
  projectAccounting: [
    { value: "enkel", label: "Enkel projektredovisning" },
    { value: "avancerad", label: "Avancerad projektredovisning (intäktsperiodisering, WIP)" },
  ],
  globalDelivery: [
    { value: "nej", label: "Lokal/nationell leverans" },
    { value: "ja", label: "Global leverans med internationella team" },
  ],
  billingModels: [
    { value: "enkel", label: "Enkel faktureringsmodell (T&M eller fast pris)" },
    { value: "komplex", label: "Komplex (blandade modeller, success fee, milestones)" },
  ],
};

// ============ Retail-specific Complexity Options ============
const complexityRetailOptions = {
  storeCount: [
    { value: "1-10", label: "1–10 butiker" },
    { value: "10-50", label: "10–50 butiker" },
    { value: "50+", label: "50+ butiker" },
  ],
  ecommercePlatform: [
    { value: "nej", label: "Ingen e-handel" },
    { value: "enkel", label: "Enkel e-handel (få integrationer)" },
    { value: "avancerad", label: "Avancerad e-handel (omnichannel)" },
  ],
  posIntegration: [
    { value: "nej", label: "Ingen POS-integration" },
    { value: "ja", label: "POS-integration krävs" },
  ],
  realtimeInventory: [
    { value: "nej", label: "Lagersaldo uppdateras periodiskt" },
    { value: "ja", label: "Realtids-lagersaldo krävs" },
  ],
  campaignPricing: [
    { value: "enkel", label: "Enkel prishantering" },
    { value: "avancerad", label: "Avancerad kampanj- och prishantering" },
  ],
};

const NeedsAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AnalysisData>(initialData);
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 9;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [
    BarChart3, Building2, Globe, Layers, Globe, Server, AlertTriangle, Boxes, Sparkles, FileText
  ];

  const stepTitles = [
    "Affärsmodell",
    "Företagsstorlek",
    "Bransch",
    "Komplexitet",
    "Geografi",
    "Nuvarande Situation",
    "Utmaningar",
    "AI & Framtid",
    "ERP-profil",
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

  const handleCheckboxChange = (field: keyof AnalysisData, value: string) => {
    const currentValues = data[field] as string[];
    if (currentValues.includes(value)) {
      setData({ ...data, [field]: currentValues.filter((v) => v !== value) });
    } else {
      setData({ ...data, [field]: [...currentValues, value] });
    }
  };

  const updateComplexity = (field: keyof ComplexityData, value: string) => {
    setData({
      ...data,
      complexity: { ...data.complexity, [field]: value },
    });
  };

  // ============ Complexity Scoring ============
  const getComplexityScores = () => {
    const c = data.complexity;
    
    // Structure score (0-100, weight 30%)
    let structureScore = 0;
    const structureFactors: string[] = [];
    
    if (c.legalEntities === "6+") { structureScore += 30; structureFactors.push("6+ juridiska enheter"); }
    else if (c.legalEntities === "3-5") { structureScore += 15; }
    else if (c.legalEntities === "1-2") { structureScore += 5; }
    
    if (c.countries === "6+") { structureScore += 30; structureFactors.push("Verksamhet i 6+ länder"); }
    else if (c.countries === "2-5") { structureScore += 15; }
    else if (c.countries === "1") { structureScore += 5; }
    
    if (c.intercompany === "omfattande") { structureScore += 20; structureFactors.push("Omfattande internhandel"); }
    else if (c.intercompany === "viss") { structureScore += 10; }
    
    if (c.consolidation === "komplex") { structureScore += 20; structureFactors.push("Komplex konsolidering"); }
    else if (c.consolidation === "enkel") { structureScore += 10; }

    // Operative complexity score (0-100, weight 40%)
    // Adapts based on business model
    let operativeScore = 0;
    const operativeFactors: string[] = [];
    const bm = data.businessModel;

    if (bm === "Konsult") {
      // Consulting: project & finance architecture drives complexity
      if (c.simultaneousProjects === "manga") { operativeScore += 25; operativeFactors.push("100+ samtidiga projekt"); }
      else if (c.simultaneousProjects === "medel") { operativeScore += 12; }
      else if (c.simultaneousProjects === "fa") { operativeScore += 5; }

      if (c.projectAccounting === "avancerad") { operativeScore += 25; operativeFactors.push("Avancerad projektredovisning"); }
      else if (c.projectAccounting === "enkel") { operativeScore += 8; }

      if (c.globalDelivery === "ja") { operativeScore += 25; operativeFactors.push("Global projektleverans"); }

      if (c.billingModels === "komplex") { operativeScore += 25; operativeFactors.push("Komplexa faktureringsmodeller"); }
      else if (c.billingModels === "enkel") { operativeScore += 8; }
    } else if (bm === "Retail") {
      // Retail: volume and real-time logic drives complexity
      if (c.storeCount === "50+") { operativeScore += 25; operativeFactors.push("50+ butiker"); }
      else if (c.storeCount === "10-50") { operativeScore += 15; }
      else if (c.storeCount === "1-10") { operativeScore += 5; }

      if (c.ecommercePlatform === "avancerad") { operativeScore += 20; operativeFactors.push("Avancerad e-handel (omnichannel)"); }
      else if (c.ecommercePlatform === "enkel") { operativeScore += 10; }

      if (c.posIntegration === "ja") { operativeScore += 15; operativeFactors.push("POS-integration"); }

      if (c.realtimeInventory === "ja") { operativeScore += 20; operativeFactors.push("Realtids-lagersaldo"); }

      if (c.campaignPricing === "avancerad") { operativeScore += 20; operativeFactors.push("Avancerad kampanj-/prishantering"); }
      else if (c.campaignPricing === "enkel") { operativeScore += 5; }
    } else {
      // Default: production/logistics (Produktion, Distribution, Annat)
      if (c.productionType === "avancerad") { operativeScore += 25; operativeFactors.push("Avancerad produktion/MRP"); }
      else if (c.productionType === "enkel") { operativeScore += 10; }
      
      if (c.warehouseManagement === "avancerad") { operativeScore += 20; operativeFactors.push("Avancerad WMS"); }
      else if (c.warehouseManagement === "grundlaggande") { operativeScore += 10; }
      
      if (c.warehouseCount === "flera-lander") { operativeScore += 20; operativeFactors.push("Flera lager i flera länder"); }
      else if (c.warehouseCount === "3-5") { operativeScore += 10; }
      
      if (c.mrpAps === "avancerat") { operativeScore += 20; operativeFactors.push("Avancerad produktionsplanering (APS)"); }
      else if (c.mrpAps === "grundlaggande") { operativeScore += 10; }
      
      if (c.transactionVolume === "hog") { operativeScore += 15; operativeFactors.push("Hög transaktionsvolym"); }
      else if (c.transactionVolume === "medel") { operativeScore += 8; }
    }

    // Maturity score (0-100, weight 30%)
    let maturityScore = 0;
    const maturityFactors: string[] = [];
    
    if (c.itOrganization === "stor") { maturityScore += 25; maturityFactors.push("Stor/dedikerad IT-organisation"); }
    else if (c.itOrganization === "liten") { maturityScore += 15; }
    else if (c.itOrganization === "ingen") { maturityScore += 5; }
    
    if (c.integrationPlatform === "manga") { maturityScore += 25; maturityFactors.push("Många affärskritiska integrationer"); }
    else if (c.integrationPlatform === "nagra") { maturityScore += 15; }
    
    if (c.governance === "formell") { maturityScore += 25; maturityFactors.push("Formell styrmodell"); }
    else if (c.governance === "viss") { maturityScore += 15; }
    
    if (c.globalStandardization === "hog") { maturityScore += 25; maturityFactors.push("Höga krav på global standardisering"); }
    else if (c.globalStandardization === "viss") { maturityScore += 12; }

    // Weighted total (0-100)
    const weightedTotal = (structureScore * 0.3) + (operativeScore * 0.4) + (maturityScore * 0.3);
    
    // Complexity level 1-4
    let complexityLevel: number;
    if (weightedTotal < 20) complexityLevel = 1;
    else if (weightedTotal < 40) complexityLevel = 2;
    else if (weightedTotal < 65) complexityLevel = 3;
    else complexityLevel = 4;

    // Risk assessment: high complexity + low IT maturity = high risk
    const isHighComplexity = (structureScore + operativeScore) > 50;
    const isLowMaturity = c.itOrganization === "ingen" || (!c.itOrganization && !c.governance);
    const isHighRisk = isHighComplexity && isLowMaturity;
    
    let riskLevel: string;
    if (isHighRisk) riskLevel = "Hög";
    else if (weightedTotal > 50) riskLevel = "Medel-hög";
    else if (weightedTotal > 25) riskLevel = "Medel";
    else riskLevel = "Låg";

    const allCriticalFactors = [...structureFactors, ...operativeFactors, ...maturityFactors];

    return {
      structureScore,
      operativeScore,
      maturityScore,
      weightedTotal,
      complexityLevel,
      riskLevel,
      isHighRisk,
      criticalFactors: allCriticalFactors.slice(0, 6),
      structureFactors,
      operativeFactors,
      maturityFactors,
    };
  };

  // ============ ERP Recommendation Logic (rewritten) ============
  const getERPRecommendation = (): { 
    product: string; 
    score: number; 
    reasons: string[]; 
    description: string;
    isCloseCall: boolean;
    complexityLevel: number;
    riskLevel: string;
    isHighRisk: boolean;
    criticalFactors: string[];
    bcScore: number;
    fscScore: number;
  } => {
    let bcScore = 0;
    let fscScore = 0;
    const bcReasons: string[] = [];
    const fscReasons: string[] = [];

    // ---- Company size (softer gradient) ----
    const emp = data.employees;
    if (["1-49 anställda", "50-99 anställda"].includes(emp)) {
      bcScore += 15;
      bcReasons.push("Företagsstorlek (< 150 anställda) passar typiskt Business Central");
    } else if (["100-249 anställda"].includes(emp)) {
      bcScore += 10;
      fscScore += 10;
    } else if (["250-999 anställda"].includes(emp)) {
      bcScore += 5;
      fscScore += 10;
    } else if (["1.000-4.999 anställda", "Mer än 5.000 anställda"].includes(emp)) {
      fscScore += 15;
      fscReasons.push("Stor organisation (600+ anställda) gynnas av F&SC:s skalbarhet");
    }




    // ---- Legal entities (more important than revenue) ----
    const le = data.complexity.legalEntities;
    if (le === "1-2") {
      bcScore += 20;
      bcReasons.push("Få juridiska enheter passar Business Central väl");
    } else if (le === "3-5") {
      bcScore += 10;
      fscScore += 10;
    } else if (le === "6+") {
      fscScore += 20;
      fscReasons.push("Många juridiska enheter (6+) kräver F&SC:s koncernfunktionalitet");
    }

    // ---- Revenue (less weight than before) ----
    const rev = data.revenue;
    if (["1-9 MSEK", "10-49 MSEK", "50-499 MSEK"].includes(rev)) {
      bcScore += 10;
    } else if (["1.000-4.999 MSEK", "> 5.000 MSEK"].includes(rev)) {
      fscScore += 10;
      fscReasons.push("Hög omsättning motiverar F&SC:s avancerade ekonomistyrning");
    }

    // ---- Production depth (key factor) ----
    const prod = data.complexity.productionType;
    if (prod === "enkel") {
      bcScore += 10;
      bcReasons.push("Enkel produktion/montering hanteras väl i Business Central");
    } else if (prod === "avancerad") {
      fscScore += 15;
      fscReasons.push("Avancerad tillverkning/MRP kräver F&SC:s produktionsmodul");
    }

    // ---- Warehouse & logistics ----
    const wc = data.complexity.warehouseCount;
    const wms = data.complexity.warehouseManagement;
    if (wc === "1-2" && wms !== "avancerad") {
      bcScore += 10;
      bcReasons.push("Enkel lagerstruktur passar Business Central");
    }
    if (wc === "flera-lander") {
      fscScore += 12;
      fscReasons.push("Flera lager i flera länder kräver F&SC:s globala lagerhantering");
    } else if (wc === "3-5") {
      fscScore += 8;
    }
    if (wms === "avancerad") {
      fscScore += 12;
      fscReasons.push("Avancerad WMS kräver F&SC:s lagerhanteringsmodul");
    }

    // ---- Business model specific scoring ----
    const bm = data.businessModel;
    const bmSub = data.businessModelSub;

    if (bm === "Konsult") {
      // Consulting: project & finance architecture drives the choice
      if (["1-49 anställda", "50-99 anställda", "100-249 anställda"].includes(emp)) {
        bcScore += 15;
        bcReasons.push("Konsultbolag med < 250 anställda passar Business Central väl");
      }
      if (["1.000-4.999 anställda", "Mer än 5.000 anställda"].includes(emp)) {
        fscScore += 15;
        fscReasons.push("Stor konsultverksamhet gynnas av F&SC:s projektstyrning");
      }
      // Consulting-specific complexity factors
      const cc = data.complexity;
      if (cc.projectAccounting === "enkel") {
        bcScore += 20;
        bcReasons.push("Enkel projektredovisning hanteras väl i Business Central");
      } else if (cc.projectAccounting === "avancerad") {
        fscScore += 15;
        fscReasons.push("Avancerad projektredovisning gynnas av F&SC");
      }
      if (cc.globalDelivery === "ja") {
        fscScore += 15;
        fscReasons.push("Global projektleverans med internationella team gynnas av F&SC");
      }
      if (cc.billingModels === "komplex") {
        fscScore += 10;
        fscReasons.push("Komplexa faktureringsmodeller gynnas av F&SC");
      }
      if (cc.simultaneousProjects === "fa") {
        bcScore += 10;
      } else if (cc.simultaneousProjects === "manga") {
        fscScore += 10;
      }
      if (le === "6+") {
        fscScore += 5;
      }
    } else if (bm === "Retail") {
      // Retail: volume and real-time logic drives the choice
      const rc = data.complexity;
      if (rc.storeCount === "1-10") {
        bcScore += 15;
        bcReasons.push("Retail med 1–10 butiker passar Business Central");
      } else if (rc.storeCount === "50+") {
        fscScore += 15;
        fscReasons.push("Retail med 50+ butiker kräver F&SC:s skalbarhet");
      } else if (rc.storeCount === "10-50") {
        fscScore += 10;
      }
      if (rc.realtimeInventory === "ja") {
        fscScore += 15;
        fscReasons.push("Realtids-lagersaldo kräver F&SC:s avancerade lagerhantering");
      }
      if (rc.ecommercePlatform === "avancerad") {
        fscScore += 15;
        fscReasons.push("Avancerad omnichannel-e-handel gynnas av F&SC");
      } else if (rc.ecommercePlatform === "enkel") {
        bcScore += 10;
        fscScore += 10;
      }
      if (rc.campaignPricing === "avancerad") {
        fscScore += 10;
        fscReasons.push("Avancerad kampanj- och prishantering gynnas av F&SC");
      }
      // Retail subcategory scoring
      const retailSubs = data.businessModelSubs;
      if (retailSubs.includes("Enbart fysisk butik")) {
        bcScore += 15;
        bcReasons.push("Enbart fysisk butik passar Business Central väl");
      }
      if (retailSubs.includes("Enbart e-handel")) {
        bcScore += 10;
        bcReasons.push("Enbart e-handel hanteras väl av Business Central");
      }
      if (retailSubs.includes("Kombination butik + e-handel")) {
        bcScore += 5;
        fscScore += 5;
        bcReasons.push("Kombination butik + e-handel kan hanteras av båda plattformarna");
      }
      if (retailSubs.includes("Omnikanal med realtidsintegration")) {
        fscScore += 15;
        fscReasons.push("Omnikanal med realtidsintegration kräver F&SC:s avancerade kapacitet");
      }
    } else if (bm === "Produktion") {
      const prodSubs = data.businessModelSubs;
      if (prodSubs.includes("Projekt- eller konstruktionsdriven leverans") || prodSubs.includes("Reglerad eller receptbaserad produktion")) {
        fscScore += 10;
        fscReasons.push("Projekt-/konstruktionsdriven eller reglerad produktion kräver ofta F&SC:s avancerade produktionsstyrning");
      }
      if (prodSubs.includes("Lagerstyrd produktion") && prod !== "avancerad") {
        bcScore += 5;
      }
    } else if (bm === "Distribution") {
      const distSubs = data.businessModelSubs;
      if (wc === "flera-lander") {
        fscScore += 5;
      }
      if (distSubs.includes("Flera lager internationellt")) {
        fscScore += 10;
        fscReasons.push("Internationell lagerstruktur gynnas av F&SC:s avancerade logistikmoduler");
      }
      if (distSubs.includes("Avancerad logistik med integrationer/3PL")) {
        fscScore += 10;
        fscReasons.push("Avancerad logistik/3PL kräver F&SC:s integrationskapacitet");
      }
      if (distSubs.includes("Enkel (1–2 lager, lokal verksamhet)") && wms !== "avancerad") {
        bcScore += 10;
        bcReasons.push("Enkel lokal lagerstruktur passar Business Central väl");
      }
      if (distSubs.includes("Flera lager inom Norden") && wms !== "avancerad") {
        bcScore += 5;
      }
    }


    const intPlatform = data.complexity.integrationPlatform;
    if (intPlatform === "fa") {
      bcScore += 10;
      bcReasons.push("Få integrationer – Business Central har enkel integrationsmodell");
    } else if (intPlatform === "manga") {
      fscScore += 10;
      fscReasons.push("Många affärskritiska integrationer gynnas av F&SC:s integrationsramverk");
    }

    // ---- Industry analysis ----
    const complexIndustries = ["Tillverkningsindustri", "Livsmedel & Processindustri", "Life Science / Medtech", "Finans & Försäkring", "Energi & Utilities"];
    if (data.industry && complexIndustries.includes(data.industry)) {
      fscScore += 5;
      fscReasons.push(`${data.industry} har ofta komplexa krav som gynnas av F&SC`);
    }

    // ---- Geography ----
    if (data.geography === "Globalt" || data.geography === "Europa") {
      fscScore += 10;
      fscReasons.push("Global/europeisk verksamhet kräver F&SC:s multi-site hantering");
    }
    if (data.geography === "Endast Sverige" || data.geography === "Norden") {
      bcScore += 10;
      bcReasons.push("Regional verksamhet hanteras väl av Business Central");
    }

    // ---- Keyword analysis (specific terms, not text length) ----
    const allText = `${data.wishlist} ${data.additionalInfo} ${data.currentSituationReason}`.toLowerCase();
    const fscKeywords = ["multi-entity", "intercompany", "konsolidering", "avancerad planering", "regulatoriska krav", "multi-site", "koncernredovisning", "processproduktion", "lean manufacturing"];
    const bcKeywords = ["enkel", "snabb implementation", "liten organisation", "microsoft 365"];
    
    fscKeywords.forEach(kw => {
      if (allText.includes(kw)) {
        fscScore += 3;
        fscReasons.push(`Nyckelord "${kw}" indikerar behov av F&SC`);
      }
    });
    bcKeywords.forEach(kw => {
      if (allText.includes(kw)) {
        bcScore += 5;
      }
    });

    // ---- Countries ----
    const countries = data.complexity.countries;
    if (countries === "6+") {
      fscScore += 10;
      fscReasons.push("Verksamhet i 6+ länder kräver F&SC:s globala kapacitet");
    } else if (countries === "2-5") {
      fscScore += 5;
    } else if (countries === "1") {
      bcScore += 5;
    }

    // ---- Intercompany ----
    const intercompany = data.complexity.intercompany;
    if (intercompany === "omfattande") {
      fscScore += 10;
      fscReasons.push("Omfattande internhandel kräver F&SC:s intercompany-modul");
    } else if (intercompany === "viss") {
      fscScore += 5;
    } else if (intercompany === "ingen") {
      bcScore += 5;
    }

    // ---- Transaction volume ----
    const txVol = data.complexity.transactionVolume;
    if (txVol === "hog") {
      fscScore += 10;
      fscReasons.push("Hög transaktionsvolym (>10 000 order/mån) kräver F&SC:s skalbarhet");
    } else if (txVol === "medel") {
      fscScore += 5;
    } else if (txVol === "lag") {
      bcScore += 10;
      bcReasons.push("Låg transaktionsvolym hanteras effektivt i Business Central");
    }

    // ---- IT organization / maturity ----
    const itOrg = data.complexity.itOrganization;
    if (itOrg === "stor") {
      fscScore += 10;
      fscReasons.push("Stor IT-organisation kan dra nytta av F&SC:s konfigurerbarhets­djup");
    } else if (itOrg === "ingen") {
      bcScore += 10;
      bcReasons.push("Minimal IT-resurs gynnas av Business Centrals lägre komplexitet");
    }

    // ---- Governance ----
    const gov = data.complexity.governance;
    if (gov === "formell") {
      fscScore += 10;
      fscReasons.push("Formell styrmodell matchar F&SC:s strukturerade processhantering");
    } else if (gov === "informell") {
      bcScore += 5;
    }

    // ---- POS integration (Retail) ----
    if (bm === "Retail" && data.complexity.posIntegration === "ja") {
      fscScore += 10;
      fscReasons.push("POS-integration kräver ofta F&SC:s Commerce-modul");
    }

    // ---- Decision timeline ----
    if (data.decisionTimeline === "Under kommande halvår") {
      bcScore += 5;
      bcReasons.push("Kort beslutshorisont gynnar Business Centrals snabbare implementation");
    }

    // ---- KPI analysis ----
    const kpis = data.kpis || [];
    const fscKpis = ["OEE (Overall Equipment Effectiveness)", "Genomloppstid i produktion", "Leveransprecision", "Perfect order rate", "Supply chain-kostnad per enhet", "Forecast accuracy"];
    const bcKpis = ["Kassaflöde", "Bruttomarginal"];
    fscKpis.forEach(kpi => {
      if (kpis.includes(kpi)) {
        fscScore += 2;
      }
    });
    bcKpis.forEach(kpi => {
      if (kpis.includes(kpi)) {
        bcScore += 3;
      }
    });

    // ---- Challenge analysis ----
    if (data.challenges.includes("Höga underhållskostnader")) {
      bcScore += 10;
      bcReasons.push("Business Central har generellt lägre TCO");
    }
    if (data.challenges.includes("Bristande översikt och rapportering") || data.challenges.includes("Bristande rapportering och beslutstöd (svårt att få prognoser, scenarioanalys, KPI:er man kan lita på)")) {
      fscScore += 5;
      fscReasons.push("F&SC erbjuder avancerad realtidsrapportering och beslutstöd");
    }
    if (data.challenges.includes("Stark tillväxt eller internationalisering") || data.challenges.includes("Affären har ändrats – ERP:et hänger inte med (nya affärsmodeller, ökad internationell komplexitet)")) {
      fscScore += 5;
    }
    if (data.challenges.includes("Manuella och tidskrävande processer") || data.challenges.includes("Ekonomi och styrning funkar – men kräver för mycket manuellt jobb (bokslut tar för lång tid, många excel-kranar, bristande spårbarhet/audit trail, otydlig kostnadsfördelning)")) {
      bcScore += 5;
      bcReasons.push("Business Central automatiserar vanliga manuella processer effektivt");
    }
    if (data.challenges.includes("Fragmenterade system och dubbelregistrering (data i silos, sköra/dyra integrationer)")) {
      fscScore += 5;
    }
    if (data.challenges.includes("Förvärv/sammanslagning") || data.challenges.includes("Större omorganisation/koncernstruktur")) {
      fscScore += 5;
    }

    // ---- MRP/APS ----
    if (data.complexity.mrpAps === "avancerat") {
      fscScore += 10;
      fscReasons.push("Avancerat MRP/APS-behov kräver F&SC");
    }

    // ---- Consolidation ----
    if (data.complexity.consolidation === "komplex") {
      fscScore += 10;
      fscReasons.push("Komplex konsolidering (multi-GAAP) kräver F&SC");
    }

    // ---- Global standardization ----
    if (data.complexity.globalStandardization === "hog") {
      fscScore += 5;
      fscReasons.push("Höga krav på global standardisering gynnas av F&SC");
    }

    // ---- Complexity assessment ----
    const complexity = getComplexityScores();

    // ---- Close call detection ----
    const diff = Math.abs(bcScore - fscScore);
    const isCloseCall = diff < 15;

    // Determine recommendation
    const isBC = bcScore > fscScore;
    
    const bcDescription = `**Dynamics 365 Business Central** är Microsofts molnbaserade affärssystem för små och medelstora företag. Det erbjuder:

• **Komplett ERP-lösning** – Ekonomi, försäljning, inköp, lager och projekt i ett system
• **Smidig implementation** – Snabbare uppstart och lägre implementationskostnad
• **Microsoft-integration** – Sömlös koppling till Microsoft 365, Power BI och Teams
• **Flexibel prissättning** – Licensmodell anpassad för mindre organisationer
• **Stort partnernätverk** – Många svenska partners med branschexpertis
• **Copilot AI** – Inbyggd AI-assistent för ökad produktivitet

Business Central passar företag som vill ha ett kraftfullt men lättanvänt affärssystem med snabb avkastning på investeringen.`;

    const fscDescription = `**Dynamics 365 Finance & Supply Chain Management** är Microsofts enterprise-plattform för komplexa organisationer. Det erbjuder:

• **Avancerad ekonomistyrning** – Koncernredovisning, budgetering och finansiell analys
• **Komplex tillverkning** – Stöd för make-to-order, processproduktion och lean manufacturing
• **Global Supply Chain** – Multi-site, multi-warehouse och avancerad logistik
• **Prediktiv analys** – AI-driven efterfrågeprognos och lageroptimering
• **Regulatorisk efterlevnad** – Stöd för internationella redovisningsstandarder
• **Enterprise-skalbarhet** – Hanterar stora transaktionsvolymer och komplex organisationsstruktur

Finance & Supply Chain passar organisationer med höga krav på funktionalitet, global närvaro och komplexa affärsprocesser.`;

    // Deduplicate and limit reasons
    const uniqueBcReasons = [...new Set(bcReasons)].slice(0, 5);
    const uniqueFscReasons = [...new Set(fscReasons)].slice(0, 5);

    return {
      product: isBC ? "Business Central" : "Finance & Supply Chain Management",
      score: isBC ? bcScore : fscScore,
      reasons: isBC ? uniqueBcReasons : uniqueFscReasons,
      description: isBC ? bcDescription : fscDescription,
      isCloseCall,
      complexityLevel: complexity.complexityLevel,
      riskLevel: complexity.riskLevel,
      isHighRisk: complexity.isHighRisk,
      criticalFactors: complexity.criticalFactors,
      bcScore,
      fscScore,
    };
  };

  const generateDocument = async () => {
    if (!validateContactForm()) {
      return;
    }
    
    const recommendation = getERPRecommendation();
    const complexity = getComplexityScores();
    // Dynamic import to reduce initial bundle size
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Helper functions
    const addNewPageIfNeeded = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    const drawLine = (y: number, color: [number, number, number] = [0, 150, 136]) => {
      pdf.setDrawColor(...color);
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
    };

    const addSectionHeader = (title: string, number: string) => {
      addNewPageIfNeeded(25);
      pdf.setFillColor(0, 150, 136);
      pdf.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${number}. ${title}`, margin + 5, yPos + 8);
      yPos += 18;
      pdf.setTextColor(51, 51, 51);
    };

    const addContentRow = (label: string, value: string) => {
      addNewPageIfNeeded(12);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text(label, margin, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      
      const valueLines = pdf.splitTextToSize(value || "Ej angivet", contentWidth - 50);
      pdf.text(valueLines, margin + 50, yPos);
      yPos += Math.max(8, valueLines.length * 5) + 4;
    };

    const addBulletList = (items: string[], otherText?: string) => {
      if (items.length === 0 && !otherText) {
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Inga val gjorda", margin + 5, yPos);
        yPos += 8;
        return;
      }
      
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      items.forEach((item) => {
        addNewPageIfNeeded(8);
        pdf.text(`– ${item}`, margin + 3, yPos);
        yPos += 7;
      });
      
      if (otherText) {
        addNewPageIfNeeded(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        const otherLines = pdf.splitTextToSize(`Övrigt: ${otherText}`, contentWidth - 10);
        pdf.text(otherLines, margin + 5, yPos);
        yPos += otherLines.length * 5 + 3;
        pdf.setFont("helvetica", "normal");
      }
      yPos += 5;
    };

    // ─── COVER PAGE ─────────────────────────────────────────────────────────────
    const analysisDate = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
    
    // Cover background – deep teal
    pdf.setFillColor(0, 120, 108);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Accent stripe
    pdf.setFillColor(0, 180, 160);
    pdf.rect(0, pageHeight * 0.55, pageWidth, 3, 'F');
    
    // Try to add logo
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
    
    // Title block
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text("BEHOVSANALYS", pageWidth / 2, 120, { align: "center" });
    
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Affärssystem (ERP)", pageWidth / 2, 133, { align: "center" });
    
    // Divider
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 20, 142, pageWidth - margin - 20, 142);
    
    // Company info
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.companyName || "", pageWidth / 2, 158, { align: "center" });
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(200, 240, 235);
    pdf.text(data.contactName || "", pageWidth / 2, 167, { align: "center" });
    pdf.text(data.email || "", pageWidth / 2, 176, { align: "center" });
    
    // Footer area
    pdf.setTextColor(180, 230, 225);
    pdf.setFontSize(9);
    pdf.text("d365.se – Vägledning för Microsoft Dynamics 365-partner", pageWidth / 2, pageHeight - 28, { align: "center" });
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(`Analysens datum: ${analysisDate}`, pageWidth / 2, pageHeight - 18, { align: "center" });

    // Start report on page 2
    pdf.addPage();

    // Header with gradient-like effect – Business Central cyan (MS officiell)
    pdf.setFillColor(0, 143, 179);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    pdf.setFillColor(0, 112, 140);
    pdf.rect(0, 45, pageWidth, 5, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("BEHOVSANALYS", margin, 25);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Dynamics 365 Affärssystem (ERP)", margin, 35);
    
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(pageWidth - 60, 15, 45, 20, 3, 3, 'F');
    pdf.setTextColor(0, 143, 179);
    pdf.setFontSize(8);
    pdf.text("Genererad", pageWidth - 55, 23);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(new Date().toLocaleDateString('sv-SE'), pageWidth - 55, 31);
    
    yPos = 60;

    // Introduction text
    pdf.setTextColor(80, 80, 80);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    const introText = "Detta dokument sammanfattar er behovsanalys för ett nytt affärssystem (ERP) baserat på Microsoft Dynamics 365. Analysen har genomförts via Dynamic Factorys digitala verktyg och ger en första indikation på vilket system som passar era behov bäst.";
    const introLines = pdf.splitTextToSize(introText, contentWidth);
    pdf.text(introLines, margin, yPos);
    yPos += introLines.length * 5 + 8;

    // Contact Information Box
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(margin, yPos, contentWidth, 50, 3, 3, 'F');
    pdf.setDrawColor(0, 150, 136);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 50);
    
    pdf.setTextColor(0, 150, 136);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("KONTAKTINFORMATION", margin + 8, yPos + 12);
    
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const contactY = yPos + 22;
    pdf.setFont("helvetica", "bold");
    pdf.text(data.companyName, margin + 8, contactY);
    pdf.setFont("helvetica", "normal");
    pdf.text(data.contactName, margin + 8, contactY + 8);
    pdf.text(`Tel: ${data.phone || "Ej angivet"}`, margin + 8, contactY + 16);
    pdf.text(`E-post: ${data.email}`, pageWidth / 2, contactY);
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Analys genomförd: ${new Date().toLocaleDateString('sv-SE')}`, pageWidth / 2, contactY + 8);
    
    yPos += 60;

    // COMPLEXITY ASSESSMENT in PDF
    addNewPageIfNeeded(60);
    pdf.setFillColor(240, 240, 255);
    pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');
    pdf.setDrawColor(100, 100, 200);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 45);
    
    pdf.setTextColor(60, 60, 150);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("KOMPLEXITETSBEDÖMNING", margin + 8, yPos + 12);
    
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Komplexitetsnivå: ${complexity.complexityLevel} av 4`, margin + 8, yPos + 22);
    pdf.text(`Risknivå: ${complexity.riskLevel}`, margin + 8, yPos + 30);
    if (complexity.criticalFactors.length > 0) {
      pdf.text(`Kritiska faktorer: ${complexity.criticalFactors.slice(0, 3).join(", ")}`, margin + 8, yPos + 38);
    }
    yPos += 55;

    // RECOMMENDATION SECTION
    addNewPageIfNeeded(100);
    
    const recommendationColor: [number, number, number] = recommendation.product === "Business Central" 
      ? [25, 118, 210]
      : [156, 39, 176];
    
    pdf.setFillColor(...recommendationColor);
    pdf.roundedRect(margin, yPos, contentWidth, 18, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    
    if (recommendation.isCloseCall) {
      pdf.text("PRELIMINÄR BEDÖMNING", margin + 5, yPos + 12);
    } else {
      pdf.text("BASERAT PÅ ERA SVAR LUTAR DET MOT", margin + 5, yPos + 12);
    }
    yPos += 25;

    // Close call warning
    if (recommendation.isCloseCall) {
      pdf.setFillColor(255, 248, 225);
      pdf.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F');
      pdf.setTextColor(180, 130, 0);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ni befinner er i gränslandet mellan plattformarna. Partnerns arkitekturkompetens blir avgörande.", margin + 5, yPos + 8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Poängfördelning: BC ${recommendation.bcScore} – F&SC ${recommendation.fscScore}`, margin + 5, yPos + 15);
      yPos += 25;
    }

    // Risk flag
    if (recommendation.isHighRisk) {
      pdf.setFillColor(255, 235, 235);
      pdf.roundedRect(margin, yPos, contentWidth, 15, 2, 2, 'F');
      pdf.setTextColor(180, 30, 30);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("⚠ Högriskprojekt: Hög komplexitet + låg IT-mognad. Partnerurval och projektstruktur blir avgörande.", margin + 5, yPos + 10);
      yPos += 20;
    }
    
    pdf.setTextColor(...recommendationColor);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Microsoft Dynamics 365 ${recommendation.product}`, margin, yPos);
    yPos += 12;
    
    // Reasons box
    if (recommendation.reasons.length > 0) {
      pdf.setFillColor(245, 245, 250);
      const reasonsBoxHeight = recommendation.reasons.length * 8 + 15;
      addNewPageIfNeeded(reasonsBoxHeight + 10);
      pdf.roundedRect(margin, yPos, contentWidth, reasonsBoxHeight, 2, 2, 'F');
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Baserat på er behovsanalys:", margin + 5, yPos + 10);
      yPos += 18;
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      recommendation.reasons.forEach((reason) => {
        const reasonLines = pdf.splitTextToSize(`– ${reason}`, contentWidth - 15);
        pdf.text(reasonLines, margin + 8, yPos);
        yPos += reasonLines.length * 5 + 3;
      });
      yPos += 5;
    }
    
    // Description section
    addNewPageIfNeeded(80);
    yPos += 5;
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Om ${recommendation.product}:`, margin, yPos);
    yPos += 8;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const descriptionLines = recommendation.description.split('\n');
    descriptionLines.forEach((line) => {
      addNewPageIfNeeded(8);
      let cleanLine = line.replace(/\*\*/g, '');
      if (line.startsWith('•')) {
        const textLines = pdf.splitTextToSize(`– ${cleanLine.substring(2)}`, contentWidth - 5);
        pdf.text(textLines, margin + 3, yPos);
        yPos += textLines.length * 5 + 2;
      } else if (cleanLine.trim()) {
        const textLines = pdf.splitTextToSize(cleanLine, contentWidth);
        pdf.text(textLines, margin, yPos);
        yPos += textLines.length * 5 + 2;
      } else {
        yPos += 3;
      }
    });
    
    yPos += 10;
    drawLine(yPos, recommendationColor);
    yPos += 15;

    // Section 1: Business Model
    addSectionHeader("AFFÄRSMODELL", "1");
    const bmLabel = businessModelOptions.find(o => o.value === data.businessModel)?.label || "Ej angivet";
    addContentRow("Affärsmodell:", bmLabel);
    const subLabel = data.businessModelSubs.length > 0
      ? data.businessModelSubs.join(", ")
      : data.businessModelSub || "";
    if (subLabel) {
      addContentRow("Typ:", subLabel);
    }
    yPos += 5;

    // Section 2: Company Size
    addSectionHeader("FÖRETAGSSTORLEK", "2");
    addContentRow("Anställda:", data.employees);
    addContentRow("Omsättning:", data.revenue);
    yPos += 5;

    // Section 2: Industry
    addSectionHeader("BRANSCH", "3");
    addBulletList(data.industry ? [data.industry] : [], data.industryOther);

    // Section 3: Complexity Assessment
    addSectionHeader("KOMPLEXITETSBEDÖMNING", "4");
    const c = data.complexity;
    
    // Structure labels (always shown)
    const structureLabels: { label: string; value: string }[] = [
      { label: "Juridiska enheter", value: complexityStructureOptions.legalEntities.find(o => o.value === c.legalEntities)?.label || "Ej angivet" },
      { label: "Antal länder", value: complexityStructureOptions.countries.find(o => o.value === c.countries)?.label || "Ej angivet" },
      { label: "Internhandel", value: complexityStructureOptions.intercompany.find(o => o.value === c.intercompany)?.label || "Ej angivet" },
      { label: "Konsolidering", value: complexityStructureOptions.consolidation.find(o => o.value === c.consolidation)?.label || "Ej angivet" },
    ];
    structureLabels.forEach(({ label, value }) => addContentRow(`${label}:`, value));

    // Operative labels (business model specific)
    let operativeLabels: { label: string; value: string }[] = [];
    if (data.businessModel === "Konsult") {
      operativeLabels = [
        { label: "Samtidiga projekt", value: complexityConsultingOptions.simultaneousProjects.find(o => o.value === c.simultaneousProjects)?.label || "Ej angivet" },
        { label: "Projektredovisning", value: complexityConsultingOptions.projectAccounting.find(o => o.value === c.projectAccounting)?.label || "Ej angivet" },
        { label: "Global leverans", value: complexityConsultingOptions.globalDelivery.find(o => o.value === c.globalDelivery)?.label || "Ej angivet" },
        { label: "Faktureringsmodell", value: complexityConsultingOptions.billingModels.find(o => o.value === c.billingModels)?.label || "Ej angivet" },
      ];
    } else if (data.businessModel === "Retail") {
      operativeLabels = [
        { label: "Antal butiker", value: complexityRetailOptions.storeCount.find(o => o.value === c.storeCount)?.label || "Ej angivet" },
        { label: "E-handel", value: complexityRetailOptions.ecommercePlatform.find(o => o.value === c.ecommercePlatform)?.label || "Ej angivet" },
        { label: "POS-integration", value: complexityRetailOptions.posIntegration.find(o => o.value === c.posIntegration)?.label || "Ej angivet" },
        { label: "Realtidslager", value: complexityRetailOptions.realtimeInventory.find(o => o.value === c.realtimeInventory)?.label || "Ej angivet" },
        { label: "Kampanj/pris", value: complexityRetailOptions.campaignPricing.find(o => o.value === c.campaignPricing)?.label || "Ej angivet" },
      ];
    } else {
      operativeLabels = [
        { label: "Produktionstyp", value: complexityOperativeOptions.productionType.find(o => o.value === c.productionType)?.label || "Ej angivet" },
        { label: "Lagerstyrning", value: complexityOperativeOptions.warehouseManagement.find(o => o.value === c.warehouseManagement)?.label || "Ej angivet" },
        { label: "Antal lager", value: complexityOperativeOptions.warehouseCount.find(o => o.value === c.warehouseCount)?.label || "Ej angivet" },
        { label: "MRP/APS", value: complexityOperativeOptions.mrpAps.find(o => o.value === c.mrpAps)?.label || "Ej angivet" },
        { label: "Transaktionsvolym", value: complexityOperativeOptions.transactionVolume.find(o => o.value === c.transactionVolume)?.label || "Ej angivet" },
      ];
    }
    operativeLabels.forEach(({ label, value }) => addContentRow(`${label}:`, value));

    // Maturity labels (always shown)
    const maturityLabels: { label: string; value: string }[] = [
      { label: "IT-organisation", value: complexityMaturityOptions.itOrganization.find(o => o.value === c.itOrganization)?.label || "Ej angivet" },
      { label: "Integrationer", value: complexityMaturityOptions.integrationPlatform.find(o => o.value === c.integrationPlatform)?.label || "Ej angivet" },
      { label: "Governance", value: complexityMaturityOptions.governance.find(o => o.value === c.governance)?.label || "Ej angivet" },
      { label: "Global standard.", value: complexityMaturityOptions.globalStandardization.find(o => o.value === c.globalStandardization)?.label || "Ej angivet" },
    ];
    maturityLabels.forEach(({ label, value }) => addContentRow(`${label}:`, value));

    // Section 4: Geography
    addSectionHeader("GEOGRAFI", "5");
    addBulletList(data.geography ? [data.geography] : [], data.geographyOther);

    // Section 5: Current Systems
    addSectionHeader("NUVARANDE SITUATION", "6");
    const filledSystems = data.currentSystems.filter(s => s.product.trim());
    if (filledSystems.length > 0) {
      filledSystems.forEach((system) => {
        addContentRow("System:", `${system.product}${system.year ? ` (driftsatt ${system.year})` : ''}`);
      });
    }
    if (data.otherSystemsDetails) {
      addContentRow("Övriga system:", data.otherSystemsDetails);
    }
    if (data.currentSituationReason) {
      addNewPageIfNeeded(30);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Nuvarande situation:", margin + 5, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      const reasonLines = pdf.splitTextToSize(data.currentSituationReason, contentWidth - 10);
      reasonLines.forEach((line: string) => {
        addNewPageIfNeeded(6);
        pdf.text(line, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 4;
    }
    
    // Situation challenges
    const situationChallengeEntries = Object.entries(data.situationChallenges).filter(([, value]) => value);
    if (situationChallengeEntries.length > 0) {
      addNewPageIfNeeded(20);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Bedömning av utmaningsområden:", margin + 5, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      
      situationChallengeEntries.forEach(([categoryId, value]) => {
        addNewPageIfNeeded(8);
        const category = situationChallengeCategories.find(c => c.id === categoryId);
        if (category) {
          pdf.text(`– ${category.title}: ${value}`, margin + 5, yPos);
          yPos += 7;
        }
      });
      yPos += 5;
    }

    if (data.decisionTimeline) {
      addContentRow("Beslutstidslinje:", data.decisionTimeline);
    }

    // Challenges as bullet list
    if (data.challenges && data.challenges.length > 0) {
      addNewPageIfNeeded(20);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Utmaningar:", margin + 5, yPos);
      yPos += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      data.challenges.forEach((challenge: string) => {
        addNewPageIfNeeded(8);
        const challengeLines = pdf.splitTextToSize(`– ${challenge}`, contentWidth - 10);
        pdf.text(challengeLines, margin + 5, yPos);
        yPos += challengeLines.length * 6;
      });
      if (data.challengesOther) {
        addNewPageIfNeeded(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        const otherLines = pdf.splitTextToSize(`Övrigt: ${data.challengesOther}`, contentWidth - 10);
        pdf.text(otherLines, margin + 5, yPos);
        yPos += otherLines.length * 5 + 3;
        pdf.setFont("helvetica", "normal");
      }
      yPos += 5;
    }

    // KPIs as bullet list
    if (data.kpis && data.kpis.length > 0) {
      addNewPageIfNeeded(20);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("KPI:er:", margin + 5, yPos);
      yPos += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      data.kpis.forEach((kpi: string) => {
        addNewPageIfNeeded(8);
        pdf.text(`– ${kpi}`, margin + 5, yPos);
        yPos += 7;
      });
      if (data.kpisOther) {
        addNewPageIfNeeded(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        const otherKpiLines = pdf.splitTextToSize(`Övrigt: ${data.kpisOther}`, contentWidth - 10);
        pdf.text(otherKpiLines, margin + 5, yPos);
        yPos += otherKpiLines.length * 5 + 3;
        pdf.setFont("helvetica", "normal");
      }
      yPos += 5;
    }

    // Section 7: Integrations
    addSectionHeader("INTEGRATIONER", "8");
    const filledIntegrations = data.integrationSystems.filter(s => s.system.trim());
    if (filledIntegrations.length > 0) {
      filledIntegrations.forEach((integration) => {
        const importanceText = integration.importance ? ` (${integration.importance})` : "";
        addContentRow("System:", `${integration.system}${importanceText}`);
      });
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Inga integrationer angivna", margin + 5, yPos);
      yPos += 8;
    }

    // Section 8: Wishlist
    addSectionHeader("ÖNSKELISTA", "9");
    if (data.wishlist.trim()) {
      const wishlistLines = pdf.splitTextToSize(data.wishlist, contentWidth - 10);
      wishlistLines.forEach((line: string) => {
        if (yPos > 270) { pdf.addPage(); yPos = 20; }
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(line, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 4;
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Ingen önskelista angiven", margin + 5, yPos);
      yPos += 8;
    }

    // Section 9: AI & Future
    addSectionHeader("AI & FRAMTID", "10");
    addContentRow("Intresse:", data.aiInterest);
    if (data.aiUseCases.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Användningsområden:", margin, yPos);
      yPos += 7;
      addBulletList(data.aiUseCases);
    }
    if (data.aiDetails) {
      addNewPageIfNeeded(15);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      const detailLines = pdf.splitTextToSize(data.aiDetails, contentWidth - 10);
      pdf.text(detailLines, margin + 5, yPos);
      yPos += detailLines.length * 5 + 5;
    }

    // Section 10: Additional Info
    addSectionHeader("ÖVRIG INFORMATION", "11");
    if (data.additionalInfo) {
      pdf.setFontSize(10);
      pdf.setTextColor(51, 51, 51);
      const infoLines = pdf.splitTextToSize(data.additionalInfo, contentWidth - 10);
      addNewPageIfNeeded(infoLines.length * 5 + 10);
      pdf.text(infoLines, margin + 5, yPos);
      yPos += infoLines.length * 5 + 10;
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Ingen övrig information angiven.", margin + 5, yPos);
      yPos += 10;
    }

    // Next Steps Section
    addNewPageIfNeeded(60);
    yPos += 5;
    pdf.setFillColor(255, 248, 225);
    pdf.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');
    pdf.setDrawColor(255, 193, 7);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 45);
    
    pdf.setTextColor(180, 130, 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("NÄSTA STEG", margin + 8, yPos + 12);
    
    pdf.setTextColor(100, 80, 0);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const nextStepsY = yPos + 20;
    pdf.text("1. Vi kontaktar er inom 1-2 arbetsdagar för att diskutera resultatet", margin + 8, nextStepsY);
    pdf.text("2. Gemensam genomgång av era behov och vår rekommendation", margin + 8, nextStepsY + 6);
    pdf.text("3. Presentation av lämpliga implementationspartners", margin + 8, nextStepsY + 12);
    pdf.text("4. Detaljerad offert och projektplan vid fortsatt intresse", margin + 8, nextStepsY + 18);
    
    yPos += 55;

    // Recommendation to contact
    addNewPageIfNeeded(45);
    pdf.setFillColor(232, 245, 233);
    pdf.roundedRect(margin, yPos, contentWidth, 38, 3, 3, 'F');
    pdf.setDrawColor(76, 175, 80);
    pdf.setLineWidth(1);
    pdf.line(margin, yPos, margin, yPos + 38);
    
    pdf.setTextColor(46, 125, 50);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("REKOMMENDATION", margin + 8, yPos + 11);
    
    pdf.setTextColor(56, 95, 58);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("• Kontakta oss på Dynamic Factory för en kostnadsfri rådgivning", margin + 8, yPos + 20);
    pdf.text("• Besök vår partnerkatalog på d365.se/valj-partner för att hitta rätt", margin + 8, yPos + 27);
    pdf.text("  implementationspartner som matchar era behov", margin + 8, yPos + 33);
    
    yPos += 45;

    // Disclaimer
    addNewPageIfNeeded(25);
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    const disclaimerText = "Denna analys ger en första indikation baserat på de uppgifter ni angett. En fullständig behovsanalys bör genomföras tillsammans med en certifierad Microsoft-partner för att säkerställa optimal lösning.";
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth);
    pdf.text(disclaimerLines, margin, yPos);
    yPos += disclaimerLines.length * 4 + 5;

    // Footer
    addNewPageIfNeeded(35);
    yPos = pageHeight - 40;
    drawLine(yPos);
    yPos += 8;
    
    pdf.setFillColor(0, 150, 136);
    pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dynamic Factory", margin + 8, yPos + 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Din oberoende guide till rätt Dynamics 365-lösning", margin + 8, yPos + 18);
    
    pdf.setFontSize(9);
    pdf.text("+46 72 232 40 60", pageWidth - margin - 55, yPos + 10);
    pdf.text("thomas.laine@dynamicfactory.se", pageWidth - margin - 55, yPos + 18);
    pdf.text("www.d365.se", pageWidth - margin - 55, yPos + 26);

    // Generate PDF
    const pdfFilename = `Behovsanalys_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    pdf.save(`${pdfFilename}.pdf`);
    
    // Send email notification
    setIsSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke("send-analysis-email", {
        body: {
          analysisType: "ERP",
          companyName: data.companyName,
          contactName: data.contactName,
          phone: data.phone,
          email: data.email,
          analysisData: {
            "Affärsmodell": `${data.businessModel}${data.businessModelSubs.length > 0 ? ` – ${data.businessModelSubs.join(", ")}` : data.businessModelSub ? ` – ${data.businessModelSub}` : ''}` || "Ej angivet",
            "Anställda": data.employees,
            "Omsättning": data.revenue,
            "Bransch": data.industry || "Ej angivet",
            "Geografi": data.geography || "Ej angivet",
            "Juridiska enheter": data.complexity.legalEntities || "Ej angivet",
            "Produktionstyp": data.complexity.productionType || "Ej angivet",
            "Komplexitetsnivå": `${complexity.complexityLevel} av 4`,
            "Risknivå": complexity.riskLevel,
            "Önskelista": data.wishlist || "Ej angivet",
            "Integrationer": data.integrationSystems.filter(s => s.system.trim()).map(s => s.system).join(", ") || "Ej angivet",
            "Nuvarande situation": data.currentSystems.filter(s => s.product.trim()).map(s => s.product).join(", ") || "Ej angivet",
            "KPI:er": data.kpis.join(", ") || "Ej angivet",
            "AI-intresse": data.aiInterest || "Ej angivet",
            "Övrig info": data.additionalInfo || "Ej angivet",
          },
          recommendation: {
            product: recommendation.product,
            reasons: recommendation.reasons,
            isCloseCall: recommendation.isCloseCall,
            complexityLevel: complexity.complexityLevel,
            riskLevel: complexity.riskLevel,
          },
          pdfBase64: pdfBase64,
          pdfFilename: pdfFilename,
        },
      });

      if (error) {
        console.error("Error sending analysis email:", error);
      } else {
        console.log("Analysis email sent successfully");
      }
    } catch (error) {
      console.error("Failed to send analysis email:", error);
    } finally {
      setIsSendingEmail(false);
    }
    
    setIsComplete(true);
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

  const isContactFormValid = () => {
    return data.companyName && data.contactName && data.phone && data.email;
  };

  // Complexity step radio group helper
  const renderComplexityRadio = (
    field: keyof ComplexityData,
    options: { value: string; label: string }[]
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((option) => (
        <SelectionCard
          key={option.value}
          label={option.label}
          selected={data.complexity[field] === option.value}
          onClick={() => updateComplexity(field, option.value)}
          type="radio"
        />
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: {
        const selectedModel = businessModelOptions.find(m => m.value === data.businessModel);
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Välj den affärsmodell som bäst beskriver er verksamhet. Detta hjälper oss anpassa analysen efter era förutsättningar.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {businessModelOptions.map((option) => (
                <SelectionCard
                  key={option.value}
                  label={option.label}
                  selected={data.businessModel === option.value}
                  onClick={() => setData({ ...data, businessModel: option.value, businessModelSub: "", businessModelSubs: [] })}
                  type="radio"
                />
              ))}
            </div>
            {selectedModel && selectedModel.subcategories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{selectedModel.subQuestion || "Specificera typ"} {selectedModel.multiSelect && <span className="text-sm font-normal text-muted-foreground">(flerval möjligt)</span>}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedModel.subcategories.map((sub) => {
                    const subDescriptions: Record<string, string> = {
                      "Tjänsteproduktion": "T.ex.: IT-konsultbolag, Juristbyråer, Redovisningsbyråer, Managementkonsulter",
                      "Projektleveranser": "T.ex.: Byggprojekt, Produktutvecklingsprojekt",
                    };
                    const isMulti = selectedModel.multiSelect;
                    const isSelected = isMulti
                      ? data.businessModelSubs.includes(sub)
                      : data.businessModelSub === sub;
                    const exclusiveGroup = selectedModel.exclusiveGroup;
                    const handleClick = () => {
                      if (isMulti) {
                        let subs: string[];
                        if (data.businessModelSubs.includes(sub)) {
                          subs = data.businessModelSubs.filter(s => s !== sub);
                        } else if (exclusiveGroup && exclusiveGroup.includes(sub)) {
                          // Clicking an exclusive item: remove other exclusive items, keep non-exclusive
                          subs = [...data.businessModelSubs.filter(s => !exclusiveGroup.includes(s)), sub];
                        } else {
                          subs = [...data.businessModelSubs, sub];
                        }
                        setData({ ...data, businessModelSubs: subs });
                      } else {
                        setData({ ...data, businessModelSub: sub });
                      }
                    };
                    return (
                      <SelectionCard
                        key={sub}
                        label={sub}
                        description={subDescriptions[sub]}
                        selected={isSelected}
                        onClick={handleClick}
                        type={isMulti ? (exclusiveGroup && exclusiveGroup.includes(sub) ? "radio" : "checkbox") : "radio"}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Antal anställda</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <h3 className="text-lg font-semibold mb-4">Omsättning</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {revenueOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.revenue === option}
                    onClick={() => setData({ ...data, revenue: option })}
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
            <p className="text-muted-foreground">Välj den bransch som bäst beskriver er verksamhet.</p>
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

      case 4:
        return (
          <div className="space-y-8">
            <p className="text-muted-foreground">
              Denna bedömning hjälper oss att förstå er verksamhets komplexitet och ge en mer träffsäker rekommendation. 
              Operativ komplexitet väger tyngst i analysen.
            </p>

            {/* Block 1: Struktur (30%) */}
            <div className="border rounded-lg p-5 space-y-5 bg-muted/20">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Struktur</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">30 % vikt</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Antal juridiska enheter (bolag)</Label>
                  {renderComplexityRadio("legalEntities", complexityStructureOptions.legalEntities)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Antal länder med verksamhet</Label>
                  {renderComplexityRadio("countries", complexityStructureOptions.countries)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Internhandel mellan bolag</Label>
                  {renderComplexityRadio("intercompany", complexityStructureOptions.intercompany)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Konsolideringskrav</Label>
                  {renderComplexityRadio("consolidation", complexityStructureOptions.consolidation)}
                </div>
              </div>
            </div>

            {/* Block 2: Operativ komplexitet (40%) - adapts to business model */}
            <div className="border-2 border-primary/30 rounded-lg p-5 space-y-5 bg-primary/5">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Operativ komplexitet</h3>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">40 % vikt – väger tyngst</span>
              </div>
              
              {data.businessModel === "Konsult" ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">
                    För konsult- och projektverksamhet är det projekt- och finansarkitektur som driver komplexiteten, inte produktion.
                  </p>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Antal samtidiga projekt</Label>
                    {renderComplexityRadio("simultaneousProjects", complexityConsultingOptions.simultaneousProjects)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Projektredovisningens komplexitet</Label>
                    {renderComplexityRadio("projectAccounting", complexityConsultingOptions.projectAccounting)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Global leverans?</Label>
                    {renderComplexityRadio("globalDelivery", complexityConsultingOptions.globalDelivery)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Faktureringsmodeller</Label>
                    {renderComplexityRadio("billingModels", complexityConsultingOptions.billingModels)}
                  </div>
                </div>
              ) : data.businessModel === "Retail" ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground italic">
                    För retail handlar komplexiteten om volym, realtidslogik och kanalintegration.
                  </p>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Antal butiker</Label>
                    {renderComplexityRadio("storeCount", complexityRetailOptions.storeCount)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">E-handelsplattform</Label>
                    {renderComplexityRadio("ecommercePlatform", complexityRetailOptions.ecommercePlatform)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">POS-integration</Label>
                    {renderComplexityRadio("posIntegration", complexityRetailOptions.posIntegration)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Realtids-lagersaldo</Label>
                    {renderComplexityRadio("realtimeInventory", complexityRetailOptions.realtimeInventory)}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Kampanj- och prishantering</Label>
                    {renderComplexityRadio("campaignPricing", complexityRetailOptions.campaignPricing)}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.businessModel === "Produktion" && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Produktionstyp</Label>
                    {renderComplexityRadio("productionType", complexityOperativeOptions.productionType)}
                  </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Avancerad lagerstyrning (WMS)</Label>
                    {renderComplexityRadio("warehouseManagement", complexityOperativeOptions.warehouseManagement)}
                  </div>
                  {data.businessModel !== "Distribution" && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Antal lager</Label>
                    {renderComplexityRadio("warehouseCount", complexityOperativeOptions.warehouseCount)}
                  </div>
                  )}
                  {data.businessModel === "Produktion" && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">MRP / APS-behov</Label>
                    {renderComplexityRadio("mrpAps", complexityOperativeOptions.mrpAps)}
                  </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Transaktionsvolym</Label>
                    {renderComplexityRadio("transactionVolume", complexityOperativeOptions.transactionVolume)}
                  </div>
                </div>
              )}
            </div>

            {/* Block 3: Organisationsmognad (30%) */}
            <div className="border rounded-lg p-5 space-y-5 bg-muted/20">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Organisationsmognad</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">30 % vikt</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Intern IT-organisation</Label>
                  {renderComplexityRadio("itOrganization", complexityMaturityOptions.itOrganization)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Hur omfattande är ert behov av att koppla ERP/Affärssystem till andra system?</Label>
                  {renderComplexityRadio("integrationPlatform", complexityMaturityOptions.integrationPlatform)}
                  
                  {(data.complexity.integrationPlatform === "nagra" || data.complexity.integrationPlatform === "manga") && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-3">
                      <Label className="text-sm font-medium">Vilka system behöver ni integrera med?</Label>
                      <div className="border-2 border-border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 bg-muted border-b-2 border-border">
                          <div className="p-3 font-medium text-sm">Applikation / Systemnamn</div>
                          <div className="p-3 font-medium text-sm border-l-2 border-border">Hur viktigt är integrationen?</div>
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
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Hur strukturerat arbetar ni med system- och processbeslut?</Label>
                  {renderComplexityRadio("governance", complexityMaturityOptions.governance)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Hur viktigt är det att arbeta enligt gemensamma processer i hela organisationen?</Label>
                  {renderComplexityRadio("globalStandardization", complexityMaturityOptions.globalStandardization)}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Var bedriver ni er verksamhet?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {geographyOptions.map((option) => (
                <SelectionCard
                  key={option}
                  label={option}
                  selected={data.geography === option}
                  onClick={() => setData({ ...data, geography: option })}
                  type="radio"
                />
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

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Nuvarande Affärssystem/ERP</h3>
              <div className="border-2 border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-muted border-b-2 border-border">
                  <div className="p-3 font-medium text-sm">ERP/Affärssystem</div>
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
                        placeholder="T.ex. 2015"
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
                placeholder="Beskriv vilka övriga system som används i verksamheten, t.ex. Microsoft 365, Power BI, CRM-system, ärendehantering, CAD-system..."
                value={data.otherSystemsDetails}
                onChange={(e) => setData({ ...data, otherSystemsDetails: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 7: {
        const handleSituationChallengeChange = (categoryId: string, value: string) => {
          setData({
            ...data,
            situationChallenges: {
              ...data.situationChallenges,
              [categoryId]: value,
            },
          });
        };

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Vad är anledningen till att du är ute och söker efter alternativa ERP/Affärssystem?</h3>
            <Textarea
              id="currentSituationReason"
              placeholder="Beskriv er nuvarande situation och varför ni överväger ett nytt affärssystem..."
              value={data.currentSituationReason}
              onChange={(e) => setData({ ...data, currentSituationReason: e.target.value })}
              className="min-h-[150px]"
            />

            <div className="space-y-4">
              <p className="text-muted-foreground">Låt oss hjälpa dig på traven lite. Nedan listas några vanliga exempel på som påverkar verksamheten så pass mycket att det är dags att se över nuvarande ERP/Affärssystem. Klicka gärna i de områden som stämmer för din verksamhet.</p>
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
      }

      case 8: {
        const aiInterestOptions = [
          { value: "Mycket intresserade", label: "Mycket intresserade - Vi vill vara i framkant" },
          { value: "Ganska intresserade", label: "Ganska intresserade - Vi vill utforska möjligheterna" },
          { value: "Avvaktande", label: "Avvaktande - Vi vill se konkreta användningsfall först" }
        ];
        const decisionTimelineOptions = [
          { value: "Under kommande halvår", label: "Under kommande halvår" },
          { value: "Inom 6-12 månader", label: "Inom 6-12 månader" },
          { value: "Under nästa 12-24 månader", label: "Under nästa 12-24 månader" },
          { value: "Inga planer just nu", label: "Inga planer just nu" },
        ];
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hur intresserade är ni av AI i affärssystemet?</h3>
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Vart skulle du säga att ni ligger i beslutsprocessen?</h3>
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
          </div>
        );
      }

      case 9: {
        const rec = getERPRecommendation();
        const complexity = getComplexityScores();
        const isBC = rec.product === "Business Central";
        const productColor = isBC ? "text-business-central" : "text-finance-supply";
        const headerBg = isBC ? "bg-business-central" : "bg-finance-supply";

        // Mognadsnivå (1–4)
        const maturityLevel = complexity.complexityLevel;
        const maturityLabels = ["", "Grundläggande ERP", "Strukturerat ERP", "Avancerat ERP", "Enterprise ERP"];
        const maturityComments: Record<number, { text: string; strengths: string[]; gaps: string[] }> = {
          1: {
            text: "Er organisation har relativt enkla ERP-behov med begränsad komplexitet i struktur och processer. Det finns stor möjlighet att snabbt få värde av ett modernt affärssystem.",
            strengths: ["Enkel och snabb implementation", "Låg TCO och tydlig ROI", "Lätthanterade processer", "Flexibilitet att växa"],
            gaps: ["Begränsat systemstöd idag", "Manuella processer kan skalas bort", "Potential att standardisera mer"],
          },
          2: {
            text: "Er organisation har en måttlig komplexitet med etablerade affärsprocesser. Rätt ERP-plattform ger er möjlighet att effektivisera och automatisera utan onödig komplexitet.",
            strengths: ["Etablerade affärsprocesser", "Viss systemerfarenhet", "Tydlig ansvarsfördelning"],
            gaps: ["Begränsad integrationskapacitet", "Manuell rapportering", "Processer ej fullt standardiserade"],
          },
          3: {
            text: "Er organisation har en påtaglig komplexitet i struktur eller operativa processer. Implementationsprojektet kräver noggrann förberedelse och en partner med dokumenterad erfarenhet.",
            strengths: ["Tydliga processkrav", "IT-mognad på plats", "Strukturerad styrmodell"],
            gaps: ["Integrationsbehov kräver plan", "Förändringsledning viktigt", "Kräver branschanpassad partner"],
          },
          4: {
            text: "Er organisation har hög komplexitet – multi-entity, globala flöden eller avancerade operativa krav. Partnerurval och projektarkitektur är avgörande för framgång.",
            strengths: ["Stor intern IT-kapacitet", "Tydlig global styrmodell", "Avancerade systemkrav väldefinierade"],
            gaps: ["Lång implementationstid att planera för", "Kräver enterprise-certifierad partner", "Change management kritiskt"],
          },
        };
        const maturityData = maturityComments[maturityLevel];

        // Profildimensioner
        const geoLabel = data.geography || "Ej angivet";
        const sizeLabel = data.employees || "Ej angivet";
        const bmLabel = data.businessModel || "Ej angivet";

        // Fokusområden per produkt
        const focusMap: Record<string, { icon: string; label: string }[]> = {
          "Business Central": [
            { icon: "💰", label: "Ekonomi & redovisning i molnet" },
            { icon: "📦", label: "Lagerstyrning och orderhantering" },
            { icon: "📊", label: "Inbyggd BI och rapportering med Power BI" },
            { icon: "🤖", label: "Copilot AI för ökad produktivitet" },
            { icon: "🔗", label: "Sömlös integration med Microsoft 365" },
          ],
          "Finance & Supply Chain Management": [
            { icon: "🏢", label: "Avancerad koncernredovisning och multi-entity" },
            { icon: "🌍", label: "Global supply chain och multi-site lager" },
            { icon: "🏭", label: "Avancerad tillverkning och MRP/APS" },
            { icon: "📈", label: "Prediktiv analys och efterfrågeprognoser" },
            { icon: "⚖️", label: "Regulatorisk efterlevnad och compliance" },
          ],
        };
        const focusItems = focusMap[rec.product] || [];

        return (
          <div className="space-y-6">
            <div className="bg-finance-supply/5 border border-finance-supply/20 rounded-lg p-4">
              <p className="text-sm text-finance-supply font-medium">
                🎯 Baserat på era svar har vi sammanställt er ERP-profil. Fyll i kontaktuppgifter längst ned för att ladda ner den fullständiga analysen som PDF.
              </p>
            </div>

            <AnalysisDisclaimer />

            {/* Sammanfattning */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-blue-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">📄 Sammanfattning</h3>
              </div>
              <div className="p-5 bg-background grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Affärsmodell", value: bmLabel },
                  { label: "Organisation", value: sizeLabel },
                  { label: "Geografisk räckvidd", value: geoLabel },
                  { label: "Kritiska faktorer", value: complexity.criticalFactors.length > 0 ? `${complexity.criticalFactors.length} identifierade` : "Inga kritiska" },
                ].map(item => (
                  <div key={item.label} className="bg-muted/40 rounded-lg px-4 py-3">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ERP-mognad */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-emerald-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">🟩 ERP-komplexitetsnivå</h3>
              </div>
              <div className="p-5 bg-background space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">ERP Complexity Level</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <span key={i} className={`text-2xl leading-none ${i <= maturityLevel ? "text-emerald-500" : "text-muted-foreground/30"}`}>⬤</span>
                  ))}
                </div>
                <p className="text-lg font-bold text-foreground">Nivå {maturityLevel} – {maturityLabels[maturityLevel]}</p>
                <p className="text-xs text-muted-foreground">Risknivå: <span className={`font-semibold ${complexity.riskLevel === "Hög" ? "text-red-600" : complexity.riskLevel === "Medel-hög" ? "text-orange-500" : complexity.riskLevel === "Medel" ? "text-yellow-600" : "text-green-600"}`}>{complexity.riskLevel}</span></p>
              </div>
            </div>

            {/* Kommentar */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-700 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">🧠 Kommentar</h3>
              </div>
              <div className="p-5 bg-background">
                <p className="text-sm text-foreground leading-relaxed">{maturityData.text}</p>
                {complexity.criticalFactors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Faktorer som driver bedömningen:</p>
                    <div className="flex flex-wrap gap-2">
                      {complexity.criticalFactors.map(f => (
                        <span key={f} className="text-xs bg-finance-supply/10 border border-finance-supply/20 text-finance-supply rounded-full px-3 py-1">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Styrkor + Utvecklingsområden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-green-600 px-5 py-3">
                  <h3 className="font-bold text-white text-sm tracking-wide">🟢 Möjligheter</h3>
                </div>
                <ul className="p-5 space-y-2 bg-background">
                  {maturityData.strengths.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✔</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-amber-500 px-5 py-3">
                  <h3 className="font-bold text-white text-sm tracking-wide">🟡 Att tänka på</h3>
                </div>
                <ul className="p-5 space-y-2 bg-background">
                  {maturityData.gaps.map(g => (
                    <li key={g} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">–</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-2" />

            {/* Rekommenderad plattform */}
            <div className="border rounded-xl p-5 space-y-4 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-finance-supply text-finance-supply-foreground text-xs flex items-center justify-center font-bold">1</span>
                Rekommenderad ERP-plattform
              </h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-3xl">{isBC ? "📗" : "📘"}</span>
                <div>
                  <p className={`text-lg font-bold ${productColor}`}>Microsoft Dynamics 365 {rec.product}</p>
                  <p className="text-xs text-muted-foreground">{rec.isCloseCall ? "Preliminär rekommendation – ni befinner er i gränslandet" : "Primär plattformsrekommendation baserat på era svar"}</p>
                </div>
              </div>
              {rec.isCloseCall && (
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                  <span className="text-base mt-0.5">⚠️</span>
                  <p className="text-xs text-foreground leading-snug">
                    <strong>Gränsland:</strong> Poängskillnaden är liten (BC: {rec.bcScore}p / F&SC: {rec.fscScore}p). Båda plattformarna kan vara aktuella – rådgör med en partner.
                  </p>
                </div>
              )}
            </div>

            {/* Fokusområden */}
            <div className="border rounded-xl p-5 space-y-4 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-finance-supply text-finance-supply-foreground text-xs flex items-center justify-center font-bold">2</span>
                Rekommenderad lösningsinriktning
              </h3>
              <p className="text-sm font-medium text-foreground mb-3">
                Baserat på er ERP-profil rekommenderas en plattform med fokus på:
              </p>
              <div className="space-y-2">
                {focusItems.map(focus => (
                  <div key={focus.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-finance-supply/5 border border-finance-supply/10">
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
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-finance-supply/10 border-finance-supply/30 text-finance-supply`}>
                    <span>{isBC ? "📗" : "📘"}</span>
                    <span>Dynamics 365 {rec.product}</span>
                  </div>
                  {rec.reasons[0] && (
                    <p className="w-full text-xs text-muted-foreground mt-2 italic border-l-2 border-finance-supply/30 pl-3">
                      "{rec.reasons[0]}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rekommenderad partnertyp */}
            <div className="border rounded-xl p-5 space-y-3 bg-background shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded-full bg-finance-supply text-finance-supply-foreground text-xs flex items-center justify-center font-bold">3</span>
                Rekommenderad partnertyp
              </h3>
              {(() => {
                const partners: { icon: string; label: string; description: string }[] = [];
                
                // Resolve display names for business model and industry
                const businessModelDisplay = data.businessModel || "Generell";
                const industryDisplay = data.industry === "Övrigt" && data.industryOther 
                  ? data.industryOther 
                  : (data.industry || "");

                if (maturityLevel >= 3 || complexity.riskLevel === "Hög" || complexity.riskLevel === "Medel-hög") {
                  partners.push({ icon: "🏢", label: "Enterprise ERP-arkitekt", description: "Partner med dokumenterad erfarenhet av komplexa multi-entity eller globala implementationer" });
                }
                if (isBC && maturityLevel <= 2) {
                  partners.push({ icon: "⚡", label: "Business Central-specialist", description: "Partner specialiserad på snabba och kostnadseffektiva BC-implementationer för tillväxtbolag" });
                }
                if (!isBC) {
                  partners.push({ icon: "🔬", label: "Auktoriserad partner inom Finance & Supply Chain", description: "Partner med certifiering och bevisad kompetens i Finance & Supply Chain Management" });
                }
                if (data.businessModel === "Produktion") {
                  partners.push({ icon: "🏭", label: "Tillverkningsspecialist", description: "Partner med djup kunskap om MRP, APS och produktionsprocesser i Dynamics 365" });
                }
                if (partners.length === 0) {
                  partners.push({ icon: "⚡", label: "Business Central-specialist", description: "Partner specialiserad på effektiva ERP-implementationer för medelstora organisationer" });
                }

                // Always add business model competency
                if (businessModelDisplay && businessModelDisplay !== "Generell") {
                  const modelIcons: Record<string, string> = { "Produktion": "🏭", "Distribution": "📦", "Konsulttjänster": "💼", "Retail / E-handel": "🛒" };
                  const modelDescriptions: Record<string, string> = {
                    "Produktion": "Erfarenhet av tillverkningsprocesser, MRP/APS, produktionsplanering och kvalitetsstyrning",
                    "Distribution": "Erfarenhet av lager, logistik, inköp och supply chain-processer",
                    "Konsulttjänster": "Erfarenhet av projektredovisning, resursplanering och konsultverksamhet",
                    "Retail / E-handel": "Erfarenhet av butikslösningar, POS, e-handel och omnikanalförsäljning",
                  };
                  // Only add if not already covered by a more specific entry (e.g. Produktion)
                  if (!partners.some(p => p.label.toLowerCase().includes(businessModelDisplay.toLowerCase().split(" ")[0]))) {
                    partners.push({
                      icon: modelIcons[businessModelDisplay] || "📋",
                      label: `Kompetens inom ${businessModelDisplay}`,
                      description: modelDescriptions[businessModelDisplay] || `Partner med erfarenhet av affärsmodellen ${businessModelDisplay}`
                    });
                  }
                }

                // Always add industry competency
                if (industryDisplay) {
                  partners.push({
                    icon: "🎯",
                    label: `Branscherfarenhet: ${industryDisplay}`,
                    description: `Partner med dokumenterade kundcase eller specialisering inom ${industryDisplay}`
                  });
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
                  <Download className="w-5 h-5 text-finance-supply" />
                  Ladda ned din fullständiga ERP-analys
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
                          placeholder="Ditt företag AB"
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
                          placeholder="Förnamn Efternamn"
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
                        <Label htmlFor="phone">Telefonnummer *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+46 70 123 45 67"
                          value={data.phone}
                          onChange={(e) => {
                            setData({ ...data, phone: e.target.value });
                            if (contactErrors.phone) setContactErrors({ ...contactErrors, phone: undefined });
                          }}
                          className={`mt-2 ${contactErrors.phone ? 'border-destructive' : ''}`}
                        />
                        {contactErrors.phone && <p className="text-sm text-destructive mt-1">{contactErrors.phone}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">E-postadress *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="namn@foretag.se"
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
                        disabled={!isContactFormValid() || isSendingEmail}
                        className="bg-finance-supply hover:bg-finance-supply/90 text-finance-supply-foreground flex-1"
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

  if (isComplete) {
    const recommendation = getERPRecommendation();
    const complexity = getComplexityScores();
    const isBC = recommendation.product === "Business Central";
    
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Success Message */}
            <Card className="text-center mb-8">
              <CardContent className="pt-8 pb-6">
                <CheckCircle2 className="w-16 h-16 text-finance-supply mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Tack för din behovsanalys!</h2>
                <p className="text-muted-foreground">
                  Ditt dokument har laddats ned. Vi kommer att kontakta dig inom kort.
                </p>
              </CardContent>
            </Card>

            <AnalysisDisclaimer />

            {/* Complexity & Risk Summary */}
            <Card className="mb-8 border-2 border-finance-supply/40 bg-gradient-to-r from-finance-supply/5 to-finance-supply/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Layers className="w-6 h-6 text-finance-supply" />
                  Komplexitetsbedömning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-background rounded-lg border">
                    <div className="text-3xl font-bold text-finance-supply">{complexity.complexityLevel}</div>
                    <div className="text-xs text-muted-foreground">av 4</div>
                    <div className="text-sm font-medium mt-1">Komplexitetsnivå</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border">
                    <div className={`text-xl font-bold ${
                      complexity.riskLevel === "Hög" ? "text-red-600" :
                      complexity.riskLevel === "Medel-hög" ? "text-orange-500" :
                      complexity.riskLevel === "Medel" ? "text-yellow-600" : "text-green-600"
                    }`}>
                      {complexity.riskLevel}
                    </div>
                    <div className="text-sm font-medium mt-1">Risknivå</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border">
                    <div className="text-xl font-bold text-finance-supply">
                      {complexity.criticalFactors.length}
                    </div>
                    <div className="text-sm font-medium mt-1">Kritiska faktorer</div>
                  </div>
                </div>

                {complexity.criticalFactors.length > 0 && (
                  <div className="bg-background rounded-lg p-4 border">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Kritiska faktorer som driver analysen:</h4>
                    <ul className="space-y-1">
                      {complexity.criticalFactors.map((factor, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-finance-supply flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.isHighRisk && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm">Högriskprojekt</h4>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          Projektet bedöms som högrisk oavsett plattform. Hög operativ komplexitet kombinerat med låg IT-mognad 
                          innebär att partnerurval och projektstruktur blir avgörande för framgång.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Close Call Warning */}
            {recommendation.isCloseCall && (
              <Card className="mb-8 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Ni befinner er i gränslandet mellan plattformarna</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                        Poängskillnaden mellan Business Central ({recommendation.bcScore}p) och Finance & Supply Chain ({recommendation.fscScore}p) är liten.
                        Partnerns arkitekturkompetens blir avgörande för att säkerställa rätt val.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <Button asChild variant="outline" size="sm" className="border-business-central text-business-central hover:bg-business-central/10">
                          <a href="/partners?app=business-central">
                            👉 Visa Business Central-partners
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="border-finance-supply text-finance-supply hover:bg-finance-supply/10">
                          <a href="/partners?app=finance-supply-chain">
                            👉 Visa Finance & Supply Chain-partners
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendation Card */}
            <Card className={`mb-8 border-2 ${isBC ? 'border-business-central' : 'border-finance-supply'}`}>
              <CardHeader className={`${isBC ? 'bg-business-central' : 'bg-finance-supply'} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Sparkles className="w-6 h-6" />
                  {recommendation.isCloseCall ? "Preliminär bedömning" : "Baserat på era svar lutar det mot"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${isBC ? 'text-business-central' : 'text-finance-supply'}`}>
                  🔹 Microsoft Dynamics 365 {recommendation.product}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {recommendation.isCloseCall 
                    ? "Observera att skillnaden är liten – båda plattformarna kan vara aktuella."
                    : "Denna bedömning är baserad på de svar ni angett och ska ses som vägledande, inte absolut."
                  }
                </p>
                
                {/* Driving Factors */}
                {recommendation.criticalFactors && recommendation.criticalFactors.length > 0 && (
                  <div className={`rounded-lg p-4 mb-6 border ${isBC ? 'bg-business-central/5 border-business-central/30' : 'bg-finance-supply/5 border-finance-supply/30'}`}>
                    <h4 className="font-semibold text-sm text-foreground mb-3">
                      Rekommendationen baseras främst på:
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.criticalFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <TrendingUp className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isBC ? 'text-business-central' : 'text-finance-supply'}`} />
                          <span className="text-sm font-medium">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reasons */}
                {recommendation.reasons.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                      Övriga faktorer som stödjer bedömningen:
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isBC ? 'text-business-central' : 'text-finance-supply'}`} />
                          <span className="text-sm">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Description */}
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-3">Om {recommendation.product}:</h4>
                  <div className="space-y-2 text-muted-foreground">
                    {recommendation.description.split('\n').map((line, index) => {
                      const cleanLine = line.replace(/\*\*/g, '');
                      if (line.startsWith('•')) {
                        return (
                          <div key={index} className="flex items-start gap-2">
                            <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isBC ? 'bg-business-central' : 'bg-finance-supply'}`} />
                            <span>{cleanLine.substring(2)}</span>
                          </div>
                        );
                      } else if (cleanLine.trim()) {
                        return <p key={index} className="text-foreground">{cleanLine}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    asChild 
                    className={`flex-1 ${isBC ? 'bg-business-central hover:bg-business-central/90 text-business-central-foreground' : 'bg-finance-supply hover:bg-finance-supply/90 text-finance-supply-foreground'}`}
                  >
                    <a href={isBC ? "/business-central" : "/finance-supply-chain"}>
                      Läs mer om {recommendation.product}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="mailto:thomas.laine@dynamicfactory.se">
                      Kontakta oss direkt
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="mb-8 border-2 border-finance-supply/30 bg-gradient-to-r from-finance-supply/5 to-finance-supply/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 bg-finance-supply rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">TL</span>
                  </div>
                  <div>
                    <p className="text-foreground font-bold">Thomas Laine</p>
                    <p className="text-sm text-muted-foreground font-normal">Partner & Rådgivare, Dynamic Factory</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Har du frågor om din behovsanalys eller vill diskutera hur Dynamics 365 kan hjälpa er verksamhet? Tveka inte att kontakta mig.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1" variant="outline">
                    <a href="mailto:thomas.laine@dynamicfactory.se">
                      <span className="mr-2">✉️</span>
                      thomas.laine@dynamicfactory.se
                    </a>
                  </Button>
                  <Button asChild className="flex-1" variant="outline">
                    <a href="tel:+46722324060">
                      <span className="mr-2">📞</span>
                      +46 72 232 40 60
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setData(initialData);
                  setCurrentStep(1);
                  setIsComplete(false);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Starta ny analys
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        title="ERP Behovsanalys | Hitta rätt Dynamics 365-lösning"
        description="Gör vår kostnadsfria ERP-behovsanalys och få en personlig rekommendation för Business Central eller Finance & Supply Chain Management."
        canonicalPath="/behovsanalys"
        keywords="ERP behovsanalys, Dynamics 365, Business Central, Finance Supply Chain, affärssystem, kravspecifikation"
        ogImage="https://d365.se/og-behovsanalys.png"
      />
      <ServiceSchema 
        name="ERP Behovsanalys"
        description="Kostnadsfri behovsanalys för att hitta rätt Microsoft Dynamics 365 ERP-lösning för din verksamhet."
      />
      <BreadcrumbSchema items={needsAnalysisBreadcrumbs} />
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Behovsanalys för Dynamics 365 ERP
            </h1>
            <p className="text-muted-foreground text-sm">
              Svara på frågorna nedan för att få en personlig rekommendation och analys
            </p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                Steg {currentStep} av {totalSteps}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-finance-supply">
                  {Math.round(progress)}%
                </span>
                <Button onClick={handleNext} size="sm" className="bg-finance-supply hover:bg-finance-supply/90 text-finance-supply-foreground">
                  Nästa
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
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
                      ? "bg-finance-supply text-finance-supply-foreground"
                      : isCompleted
                      ? "bg-finance-supply/20 text-finance-supply"
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

          {/* Content */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {(() => {
                  const Icon = stepIcons[currentStep - 1];
                  return <Icon className="w-5 h-5 text-finance-supply" />;
                })()}
                {stepTitles[currentStep - 1]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="analysis-form theme-erp">
                {renderStep()}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t print:hidden">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tillbaka
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="bg-finance-supply hover:bg-finance-supply/90 text-finance-supply-foreground">
                    Nästa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : null}
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
