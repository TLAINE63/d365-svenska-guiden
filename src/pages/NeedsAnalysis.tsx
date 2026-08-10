import { useState, useEffect } from "react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import heroBehovsanalysErp from "@/assets/hero-behovsanalys-erp.jpg";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import RelatedPages, { needsAnalysisErpRelatedPages } from "@/components/RelatedPages";
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
import { ServiceSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/StructuredData";
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";
import { isServicesIndustry } from "@/lib/industryFilters";
import { usePartners } from "@/hooks/usePartners";
import { pickSuggestedPartners } from "@/lib/suggestPartners";
import { buildCompareUrl } from "@/lib/compareUrl";
import { appendSuggestedPartnersPage } from "@/utils/pdfSuggestedPartners";
import SuggestedPartnersCTA from "@/components/SuggestedPartnersCTA";
import type { ProductKey } from "@/hooks/usePartnerFilters";

// Breadcrumb items
const needsAnalysisBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "ERP Behovsanalys", url: "https://d365.se/ERPbehovsanalys" },
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
  // Etapp 1b - additional dimensions
  currencies: string;
  languages: string;
  ediIntegration: string;
  qualityAssurance: string;
  batchTraceability: string;
}

interface AnalysisData {
  // Step 1 - Verksamhetsmodell
  businessModel: string;
  businessModelSub: string;
  businessModelSubs: string[];
  secondaryBusinessModels: string[];
  // Step 2
  employees: string;
  revenue: string;
  erpUsers: string;
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
  // AI, automation och beslutsstöd (utbyggd)
  aiAmbitions: string[];
  aiDataQuality: Record<string, string>; // område -> Bra|Blandad|Bristfällig|Vet ej
  aiDataIssues: string[];
  aiProcessMaturity: Record<string, string>; // område -> Låg|Medel|Hög|Vet ej
  aiGovernance: string;
  aiRisks: string[];
  // Step 11
  additionalInfo: string;
  // Contact info
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  consentToContact: boolean;
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
  currencies: "",
  languages: "",
  ediIntegration: "",
  qualityAssurance: "",
  batchTraceability: "",
};

const businessModelOptions = [
  {
    value: "Produktion",
    label: "Produktion / Tillverkningsindustrin",
    subQuestion: "Vilken typ av produktion?",
    subcategories: [
      "Lagerstyrd produktion (MTS)",
      "Kundorderstyrd produktion (MTO/ATO)",
      "Projekt- eller konstruktionsdriven leverans (ETO)",
      "Reglerad eller receptbaserad produktion (process/batch)",
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
    value: "Retail",
    label: "Retail / Handel",
    subQuestion: "Hur ser er försäljningsmodell ut?",
    subcategories: [
      "Enbart fysisk butik",
      "Enbart e-handel",
      "Kombination butik + e-handel",
      "Omnikanal med realtidsintegration",
    ],
    multiSelect: true,
    exclusiveGroup: ["Enbart fysisk butik", "Enbart e-handel", "Kombination butik + e-handel"],
  },
  {
    value: "Projekt",
    label: "Projektverksamhet / Entreprenad",
    subQuestion: "Hur ser era projekt ut?",
    subcategories: [
      "Korta uppdrag (< 3 mån)",
      "Längre projekt (3–12 mån)",
      "Fleråriga program / stora entreprenader",
      "Internationella projekt med flera bolag",
    ],
    multiSelect: true,
  },
  {
    value: "Konsult",
    label: "Konsult / Tjänsteverksamhet",
    subQuestion: "Hur tar ni betalt huvudsakligen?",
    subcategories: [
      "Löpande timdebitering",
      "Fastpris per uppdrag",
      "Abonnemang / retainer",
      "Resultat- eller licensbaserat",
    ],
    multiSelect: true,
  },
  {
    value: "Service",
    label: "Service & Fältservice",
    subQuestion: "Hur är servicen organiserad?",
    subcategories: [
      "Reaktiv service (felavhjälpande)",
      "Planerat underhåll / avtalsservice",
      "Installation och driftsättning",
      "Fältservice med tekniker ute hos kund",
    ],
    multiSelect: true,
  },
  {
    value: "Uthyrning",
    label: "Uthyrning / Leasing",
    subQuestion: "Vad hyr ni ut?",
    subcategories: [
      "Maskiner / fordon / utrustning",
      "Lokaler / fastigheter",
      "Personal / bemanning",
      "Mjukvara / licenser",
    ],
    multiSelect: true,
  },
  {
    value: "Abonnemang",
    label: "Abonnemang / SaaS / Återkommande intäkter",
    subQuestion: "Hur ser abonnemangsmodellen ut?",
    subcategories: [
      "Fast månads-/årsavgift",
      "Användarbaserad debitering",
      "Förbruknings-/transaktionsbaserad",
      "Hybrid (fast + rörlig del)",
    ],
    multiSelect: true,
  },
  {
    value: "Offentlig",
    label: "Offentlig sektor / Ideell verksamhet",
    subcategories: [
      "Statlig myndighet",
      "Kommun / region",
      "Stiftelse / förbund",
      "Medlemsorganisation",
    ],
    multiSelect: true,
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
  secondaryBusinessModels: [],
  employees: "",
  revenue: "",
  erpUsers: "",
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
  aiAmbitions: [],
  aiDataQuality: {},
  aiDataIssues: [],
  aiProcessMaturity: {},
  aiGovernance: "",
  aiRisks: [],
  additionalInfo: "",
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  consentToContact: false,
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
  "50-99 MSEK",
  "100-249 MSEK",
  "250-499 MSEK",
  "500-999 MSEK",
  "1.000-4.999 MSEK",
  "Mer än 5.000 MSEK",
];

const erpUsersOptions = [
  "1-10 användare",
  "11-25 användare",
  "26-75 användare",
  "76-200 användare",
  "Mer än 200 användare",
];

const industryOptions = [
  "Tillverkningsindustri",
  "Livsmedel & Processindustri",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Mode, Sport & Textil",
  "Konsulttjänster",
  "Bygg, Entreprenad & Installation",
  "Fastighet & Förvaltning",
  "Energi & Utilities",
  "Finans & Försäkring",
  "Life Science / Medtech",
  "Telekom & IT-tjänster",
  "Transport & Logistik",
  "Media & Publishing",
  "Jordbruk & Skogsbruk",
  "Hälsa- & sjukvård",
  "Non-profit / Organisationer",
  "Medlemsorganisationer",
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
  "Bygg, Entreprenad & Installation": [
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
  "Transport & Logistik": [
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
  "Medlemsorganisationer": [
    "Medlemstillväxt",
    "Medlemsretention",
    "Eventdeltagande",
    "Avgiftsintäkter",
    "Kommunikationseffektivitet",
    "Volontärengagemang",
    "Medlemsnöjdhet (NPS)",
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

// ============ AI, automation och beslutsstöd ============

const aiAmbitionOptions = [
  "Minska manuellt administrativt arbete",
  "Förbättra prognoser och planering",
  "Automatisera ekonomi- och fakturaprocesser",
  "Förbättra inköp och leverantörsstyrning",
  "Optimera lager och varuflöden",
  "Förbättra produktion och kapacitetsplanering",
  "Identifiera avvikelser och risker tidigare",
  "Ge ledning och chefer bättre beslutsstöd",
  "Förbättra kundservice och ärendehantering",
  "Stärka sälj- och kundprioritering",
  "Skapa bättre rapportering och analys",
  "Vi vet inte ännu, men vill förstå möjligheterna",
];

const aiUseCaseDomains: { domain: string; items: string[] }[] = [
  { domain: "Ekonomi", items: [
    "Fakturatolkning och automatiserad bokföring",
    "Avvikelseanalys i ekonomi",
    "Cash flow-prognoser",
    "Automatiserad periodisering eller uppföljning",
  ]},
  { domain: "Inköp och supply chain", items: [
    "Förslag på inköpsbehov",
    "Identifiera pris- eller leveransavvikelser",
    "Leverantörsanalys",
    "Prognoser för efterfrågan och inköp",
  ]},
  { domain: "Lager och logistik", items: [
    "Lageroptimering",
    "Identifiera bristvaror och överlager",
    "Förbättrad leveransprecision",
    "Avvikelseanalys i lagerflöden",
  ]},
  { domain: "Produktion", items: [
    "Produktionsplanering",
    "Kapacitetsrisker",
    "Kvalitetsavvikelser",
    "Prediktivt underhåll",
  ]},
  { domain: "Försäljning och kund", items: [
    "Säljprognoser",
    "Kundprioritering",
    "Offertstöd",
    "Nästa bästa aktivitet",
    "Copilot för Sales (mötesförberedelse & sammanfattning)",
    "Sales Qualification Agent (autonom leadkvalificering)",
  ]},
  { domain: "Marknad", items: [
    "Segmentering och målgruppsförslag",
    "Kampanjoptimering och A/B-test",
    "Innehållsgenerering (e-post, landningssidor, annonser)",
    "Lead scoring och nurturing-flöden",
    "Copilot i Customer Insights (Journeys & Data)",
    "AI-driven personalisering av kundresor",
  ]},
  { domain: "Service", items: [
    "Ärendesammanfattningar",
    "Kunskapsförslag",
    "Prediktivt underhåll (service)",
    "Prioritering av serviceärenden",
    "Copilot för Customer Service (svarsförslag & sammanfattning)",
    "Customer Intent / Knowledge Management Agent",
  ]},
  { domain: "Ledning och analys", items: [
    "Beslutsstöd i realtid",
    "Naturligt språk mot rapporter och data",
    "AI-genererade sammanfattningar",
    "Identifiering av trender och avvikelser",
    "Copilot i Power BI / Fabric",
  ]},
  { domain: "Copilot i Microsoft 365 & Dynamics", items: [
    "Copilot Chat (Microsoft 365) som AI-assistent i vardagen",
    "Copilot i Teams (möten, anteckningar, uppföljning)",
    "Copilot i Outlook och Word (e-post och dokument)",
    "Copilot för Finance (avstämning och periodisering)",
    "Copilot för Supply Chain (insights och störningar)",
  ]},
  { domain: "AI-agenter (autonoma)", items: [
    "Färdiga agenter i Dynamics 365 (Sales, Service, Finance)",
    "Egenbyggda agenter i Copilot Studio",
    "Supplier Communications Agent (leverantörsdialog)",
    "Account Management Agent (kontoarbete & uppföljning)",
    "Agenter kopplade till egen data via Dataverse",
  ]},
];

const aiDataAreas = [
  "Artikeldata", "Kunddata", "Leverantörsdata", "Lagerdata", "Produktionsdata",
  "Ekonomidata", "Försäljningsdata", "Historiska transaktioner", "Rapportering/BI",
  "Data i Excel eller fristående system",
];
const aiDataQualityScale = ["Bra", "Blandad", "Bristfällig", "Vet ej"];

const aiDataIssueOptions = [
  "Data finns utspridd i flera system",
  "Mycket data hanteras i Excel",
  "Rapportering visar olika siffror beroende på källa",
  "Artikeldata är inkonsekvent",
  "Kund- eller leverantörsregister är svåra att lita på",
  "Historisk data är ofullständig",
  "Det saknas tydligt dataägarskap",
  "Vi litar inte fullt ut på rapporterna",
  "Inga större dataproblem idag",
  "Vet ej",
];

const aiProcessAreas = [
  "Processerna är dokumenterade",
  "Processerna är standardiserade",
  "Det finns tydliga processägare",
  "Det finns tydliga godkännandeflöden",
  "Få manuella moment återstår i kärnflöden",
  "Få undantag och specialfall i processerna",
  "Det är tydligt vilka moment som bör automatiseras",
  "Verksamheten är redo att förändra arbetssätt",
];
const aiProcessScale = ["Stämmer inte", "Stämmer delvis", "Stämmer helt", "Vet ej"];

const aiGovernanceOptions = [
  "Ja, vi har tydliga riktlinjer",
  "Delvis, men de behöver utvecklas",
  "Nej, inte idag",
  "Vet ej",
];

const aiRiskOptions = [
  "Dataskydd och GDPR",
  "Behörigheter och åtkomst till känslig data",
  "Spårbarhet i AI-genererade förslag",
  "Risk för felaktiga AI-svar",
  "Intern acceptans hos användare",
  "Juridiska eller regulatoriska krav",
  "Oklart ägarskap för AI internt",
  "Säkerhet kring företagsdata",
  "Vi ser inga större risker idag",
  "Vet ej",
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
  currencies: [
    { value: "1", label: "1 valuta" },
    { value: "2-5", label: "2–5 valutor" },
    { value: "6+", label: "6+ valutor" },
  ],
  languages: [
    { value: "1", label: "1 språk" },
    { value: "2-3", label: "2–3 språk" },
    { value: "4+", label: "4+ språk" },
  ],
  ediIntegration: [
    { value: "nej", label: "Inget EDI-behov" },
    { value: "viss", label: "Visst EDI med några partner" },
    { value: "omfattande", label: "Omfattande EDI (>10 partner / hög volym)" },
  ],
  qualityAssurance: [
    { value: "ingen", label: "Ingen formell kvalitetshantering" },
    { value: "grundlaggande", label: "Grundläggande QA (avvikelser, dokumentation)" },
    { value: "regulerad", label: "Reglerad/spårbar (ISO, GMP, FDA, livsmedel)" },
  ],
  batchTraceability: [
    { value: "nej", label: "Ej tillämpligt" },
    { value: "viss", label: "Viss batch-/serienummerhantering" },
    { value: "full", label: "Full spårbarhet (lot, serie, hållbarhet)" },
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
  const { data: allPartners = [] } = usePartners();
  const [data, setData] = useState<AnalysisData>(initialData);
  const [isComplete, setIsComplete] = useState(false);
  const [contactErrors, setContactErrors] = useState<ContactFormErrors>({});
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const totalSteps = 9;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    trackFunnelEvent({ event_type: "analysis_start", event_name: "needs_analysis_erp" });
  }, []);

  useEffect(() => {
    if (currentStep === totalSteps) {
      trackFunnelEvent({ event_type: "analysis_complete", event_name: "needs_analysis_erp" });
    }
  }, [currentStep, totalSteps]);

  const stepIcons = [
    BarChart3, Building2, Globe, Layers, Globe, Server, AlertTriangle, Boxes, Sparkles, FileText
  ];

  const stepTitles = [
    "Verksamhetsmodell",
    "Storlek",
    "Bransch",
    "Komplexitet",
    "Geografi",
    "Situation",
    "Utmaningar",
    "AI, automation och beslutsstöd",
    "Vägledande ERP-Analys",
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

  const updateAiDataQuality = (area: string, value: string) => {
    setData({ ...data, aiDataQuality: { ...data.aiDataQuality, [area]: value } });
  };
  const updateAiProcessMaturity = (area: string, value: string) => {
    setData({ ...data, aiProcessMaturity: { ...data.aiProcessMaturity, [area]: value } });
  };

  // ============ AI Maturity Assessment ============
  const getAiMaturity = (): {
    level: "Låg" | "Medel" | "Hög" | "Avancerad";
    dataScore: number; // 0-100
    processScore: number; // 0-100
    ambitionScore: number; // 0-100
    governanceScore: number; // 0-100
    manualHeavy: boolean;
    summary: string;
  } => {
    // Data quality score
    const dq = data.aiDataQuality || {};
    const dqValues = Object.values(dq).filter(v => v && v !== "Vet ej");
    let dataScore = 50;
    if (dqValues.length > 0) {
      const map: Record<string, number> = { "Bra": 100, "Blandad": 55, "Bristfällig": 15 };
      dataScore = Math.round(dqValues.reduce((s, v) => s + (map[v] ?? 50), 0) / dqValues.length);
    }
    // Data issues penalty (except "Inga större dataproblem")
    const negativeIssues = data.aiDataIssues.filter(i => i !== "Inga större dataproblem idag" && i !== "Vet ej");
    dataScore = Math.max(0, dataScore - negativeIssues.length * 4);
    if (data.aiDataIssues.includes("Inga större dataproblem idag")) dataScore = Math.min(100, dataScore + 10);

    // Process maturity score – alla påståenden är positivt formulerade
    const pm = data.aiProcessMaturity || {};
    const pmValues = Object.entries(pm).filter(([, v]) => v && v !== "Vet ej");
    let processScore = 50;
    if (pmValues.length > 0) {
      const map: Record<string, number> = { "Stämmer inte": 20, "Stämmer delvis": 60, "Stämmer helt": 95 };
      processScore = Math.round(
        pmValues.reduce((s, [, v]) => s + (map[v] ?? 50), 0) / pmValues.length
      );
    }
    const manualHeavy = pm["Få manuella moment återstår i kärnflöden"] === "Stämmer inte";

    // Ambition score: more ambitions => higher intent
    const ambitions = data.aiAmbitions.filter(a => a !== "Vi vet inte ännu, men vill förstå möjligheterna");
    const ambitionScore = Math.min(100, ambitions.length * 18);

    // Governance score
    const govMap: Record<string, number> = {
      "Ja, vi har tydliga riktlinjer": 100,
      "Delvis, men de behöver utvecklas": 55,
      "Nej, inte idag": 15,
      "Vet ej": 30,
    };
    const governanceScore = govMap[data.aiGovernance] ?? 30;

    // Composite (data heaviest)
    const composite = Math.round(
      dataScore * 0.40 + processScore * 0.30 + ambitionScore * 0.20 + governanceScore * 0.10
    );

    let level: "Låg" | "Medel" | "Hög" | "Avancerad";
    if (composite < 35) level = "Låg";
    else if (composite < 60) level = "Medel";
    else if (composite < 80) level = "Hög";
    else level = "Avancerad";

    const summary =
      level === "Låg" ? "AI-intresse kan finnas, men data, processer eller styrning behöver först förbättras."
      : level === "Medel" ? "Det finns tydliga möjligheter, men nyttan kräver bättre datakvalitet, processkartläggning eller prioritering av use cases."
      : level === "Hög" ? "Verksamheten har tydliga mål, relativt god datagrund och identifierade processer där AI kan skapa affärsnytta."
      : "AI kan bli en central del av framtida ERP, beslutsstöd och automation. Verksamheten har både datagrund, processmognad och tydliga användningsfall.";

    return { level, dataScore, processScore, ambitionScore, governanceScore, manualHeavy, summary };
  };

  const getAiNextSteps = (): string[] => {
    const m = getAiMaturity();
    const steps: string[] = [];
    const hasAmbition = data.aiAmbitions.length > 0 && !data.aiAmbitions.every(a => a === "Vi vet inte ännu, men vill förstå möjligheterna");
    if (hasAmbition && m.dataScore < 50) {
      steps.push("Prioritera datakvalitet, masterdata och rapporteringsstruktur innan större AI-initiativ startas.");
    }
    if (hasAmbition && m.dataScore >= 50) {
      steps.push("Identifiera 2–3 konkreta AI-use cases som kan testas i samband med ERP-förstudie eller fit-gap.");
    }
    if (m.manualHeavy) {
      steps.push("Kartlägg manuella moment och bedöm vilka som kan automatiseras med standardfunktionalitet, Power Automate, Copilot eller kompletterande lösningar.");
    }
    if (data.aiGovernance === "Nej, inte idag" || data.aiGovernance === "Vet ej") {
      steps.push("Ta fram riktlinjer för AI-användning, dataskydd, behörigheter och ansvar innan AI-stöd införs brett.");
    }
    return steps;
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
    


    // ---- Growth, integration & operational pressure (höjer komplexiteten för medel-/storbolag) ----
    let growthScore = 0;
    const prioritizedFactors: string[] = [];

    // Revenue
    if (["250-499 MSEK", "500-999 MSEK"].includes(data.revenue)) {
      growthScore += 14;
      prioritizedFactors.push("Omsättning över 250 MSEK");
    } else if (["1.000-4.999 MSEK", "> 5.000 MSEK"].includes(data.revenue)) {
      growthScore += 20;
      prioritizedFactors.push("Omsättning över 1 miljard");
    }

    // ERP users
    const erpU = (data.erpUsers || "").toLowerCase();
    if (/26[-–]75/.test(erpU)) { growthScore += 10; prioritizedFactors.push("26–75 ERP-användare"); }
    else if (/76[-–]200/.test(erpU)) { growthScore += 14; prioritizedFactors.push("76–200 ERP-användare"); }
    else if (/200|201\+|fler/.test(erpU) && /\b2\d\d|\b[3-9]\d\d|\b1\d{3,}/.test(erpU)) {
      growthScore += 18; prioritizedFactors.push("Över 200 ERP-användare");
    } else if (/201\+/.test(erpU)) { growthScore += 18; prioritizedFactors.push("Över 200 ERP-användare"); }

    // Integrations count
    const integrationCount = (data.integrationSystems || []).filter(s => s.system && s.system.trim()).length;
    if (integrationCount >= 5) { growthScore += 14; prioritizedFactors.push("Omfattande integrationsbehov"); }
    else if (integrationCount >= 3) { growthScore += 10; prioritizedFactors.push("Flera integrationsbehov"); }
    else if (integrationCount >= 1) { growthScore += 4; }

    // Multiple current systems / outdated
    const currentSystemCount = (data.currentSystems || []).filter(s => s.product && s.product.trim()).length;
    if (currentSystemCount >= 4) { growthScore += 8; prioritizedFactors.push("Flera parallella system att konsolidera"); }
    const currentYear = new Date().getFullYear();
    const hasOldSystem = (data.currentSystems || []).some(s => {
      const y = parseInt(String(s.year || ""), 10);
      return !isNaN(y) && y > 1900 && (currentYear - y) >= 10;
    });
    if (hasOldSystem) { growthScore += 10; prioritizedFactors.push("Föråldrat eller riskfyllt ERP"); }

    // Operational inefficiency from 3-step situationChallenges
    const sitCh = data.situationChallenges || {};
    const significantIssues = Object.values(sitCh).filter(v => v === "Betydande problem" || v === "Betydande utmaning").length;
    if (significantIssues >= 3) { growthScore += 14; prioritizedFactors.push("Operativ ineffektivitet på flera områden"); }
    else if (significantIssues >= 1) { growthScore += 8; prioritizedFactors.push("Operativ ineffektivitet"); }

    // Distribution/Grossist + EDI/lager
    if (bm === "Distribution" || bm === "Grossist") {
      if (c.ediIntegration && c.ediIntegration !== "Inget EDI") {
        growthScore += 8; prioritizedFactors.push("EDI-flöden mot kunder/leverantörer");
      }
      if (c.warehouseCount && c.warehouseCount !== "1-2") {
        growthScore += 5; prioritizedFactors.push("Lager-/orderflöden över flera enheter");
      }
      prioritizedFactors.push("Grossist-/distributionsmodell med lager- och orderflöden");
    }

    // Secondary business models
    const secondary = data.secondaryBusinessModels || [];
    if (secondary.some(s => /service|fält|eftermarknad/i.test(s))) {
      growthScore += 8; prioritizedFactors.push("Service/eftermarknad som kompletterande verksamhet");
    }
    if (secondary.length >= 2) { growthScore += 4; }

    // Transaction volume cross-tag
    if (c.transactionVolume === "hog" || c.transactionVolume === "medel") {
      prioritizedFactors.push(c.transactionVolume === "hog" ? "Hög transaktionsvolym" : "Medelhög transaktionsvolym");
    }

    // AI ambitions raise complexity slightly
    const aiAmb = (data.aiAmbitions || []).filter(a => a && a !== "Vi vet inte ännu, men vill förstå möjligheterna");
    if (aiAmb.length >= 3) { growthScore += 8; prioritizedFactors.push("Höga AI- och automationsambitioner"); }
    else if (aiAmb.length >= 1) { growthScore += 4; prioritizedFactors.push("AI- och automationsambition"); }

    // Data quality concerns
    const dataIssues = (data.aiDataIssues || []).filter(i => i && i !== "Inga större dataproblem idag" && i !== "Vet ej");
    if (dataIssues.length >= 2) { growthScore += 6; prioritizedFactors.push("Datakvalitet och masterdata att åtgärda"); }

    // Outdated / risky narrative in situation reason
    if (/föråldrad|föråldrat|gammalt|on[- ]?prem|risk|hänger inte/i.test(data.currentSituationReason || "")) {
      if (!prioritizedFactors.includes("Föråldrat eller riskfyllt ERP")) {
        growthScore += 8;
        prioritizedFactors.push("Föråldrat eller riskfyllt nuläge");
      }
    }

    // "Tillväxt och förändrad affär"-flagg från challenges
    if (data.challenges.some(c => /tillväxt|internationali|ändrats|växer/i.test(c))) {
      prioritizedFactors.push("Tillväxt och förändrad affär");
    }

    // Cap growthScore
    growthScore = Math.min(100, growthScore);

    // Weighted total (0-100) – growth/integration nu egen vikt
    const weightedTotal = (structureScore * 0.25) + (operativeScore * 0.28) + (maturityScore * 0.17) + (growthScore * 0.30);

    // Complexity level 1-4 – lägre tröskel för att undvika att medelstora bolag hamnar i nivå 1
    let complexityLevel: number;
    if (weightedTotal < 15) complexityLevel = 1;
    else if (weightedTotal < 35) complexityLevel = 2;
    else if (weightedTotal < 60) complexityLevel = 3;
    else complexityLevel = 4;

    // Risk assessment: high complexity + low IT maturity = high risk
    const isHighComplexity = (structureScore + operativeScore + growthScore) > 60;
    const isLowMaturity = c.itOrganization === "ingen" || !c.itOrganization;
    const isHighRisk = isHighComplexity && isLowMaturity;

    let riskLevel: string;
    if (isHighRisk) riskLevel = "Hög";
    else if (weightedTotal > 50) riskLevel = "Medel-hög";
    else if (weightedTotal > 25) riskLevel = "Medel";
    else riskLevel = "Låg";

    const allCriticalFactors = [...structureFactors, ...operativeFactors, ...maturityFactors];

    // Deduplicate prioritized factors while preserving order
    const dedupedPrioritized = Array.from(new Set(prioritizedFactors));

    return {
      structureScore,
      operativeScore,
      maturityScore,
      growthScore,
      weightedTotal,
      complexityLevel,
      riskLevel,
      isHighRisk,
      criticalFactors: allCriticalFactors.slice(0, 6),
      prioritizedFactors: dedupedPrioritized.slice(0, 6),
      structureFactors,
      operativeFactors,
      maturityFactors,
    };
  };

  // ============ ERP Recommendation Logic (rewritten) ============
  const getERPRecommendation = (): {
    product: string;
    outcome: "Business Central" | "Business Central med tillägg" | "Finance & Supply Chain Management" | "Båda bör utvärderas" | "För tidigt att avgöra";
    securityLevel: "Låg" | "Medel" | "Hög";
    score: number;
    reasons: string[];
    description: string;
    isCloseCall: boolean;
    complexityLevel: number;
    riskLevel: string;
    isHighRisk: boolean;
    criticalFactors: string[];
    prioritizedFactors: string[];
    indicationBasis: string[];
    addonTriggers: string[];
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


    // ---- Complexity assessment ----
    const complexity = getComplexityScores();

    // ---- Close call detection ----
    const diff = Math.abs(bcScore - fscScore);
    const isCloseCall = diff < 15;

    // Determine recommendation
    const isBC = bcScore > fscScore;
    
    const bcDescription = `**Dynamics 365 Business Central** är Microsofts molnbaserade affärssystem för mindre och medelstora företag. Det erbjuder:

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

    // ---- Säkerhetsnivå i analysen (hur komplett är underlaget?) ----
    const c = data.complexity;
    const completenessSignals = [
      !!data.businessModel,
      !!data.employees,
      !!data.revenue,
      !!data.erpUsers,
      !!data.industry,
      !!data.geography,
      !!c.legalEntities,
      !!c.countries,
      !!c.productionType || !!c.warehouseCount || !!c.simultaneousProjects || !!c.storeCount,
      !!c.itOrganization,
      !!c.integrationPlatform,
      !!data.currentSituationReason,
      !!data.decisionTimeline,
      data.currentSystems.some(s => s.product.trim()),
      Object.values(data.situationChallenges).some(v => !!v) || data.challenges.length > 0,
    ];
    const filledCount = completenessSignals.filter(Boolean).length;
    const securityLevel: "Låg" | "Medel" | "Hög" =
      filledCount >= 11 ? "Hög" : filledCount >= 7 ? "Medel" : "Låg";

    // ---- Add-on / fit-gap signals (gör att BC kan landa i "BC med tillägg") ----
    const addonTriggers: string[] = [];
    if (data.complexity.ediIntegration && data.complexity.ediIntegration !== "Inget EDI") {
      addonTriggers.push("EDI mot kunder/leverantörer");
    }
    if (data.complexity.warehouseManagement === "avancerad") addonTriggers.push("Avancerad lagerstyrning / WMS");
    if (data.complexity.batchTraceability && data.complexity.batchTraceability !== "Ej tillämpligt") {
      addonTriggers.push("Batch-/serienummerspårning");
    }
    if (data.complexity.qualityAssurance === "Reglerad/spårbar") addonTriggers.push("Reglerad kvalitetskontroll");
    if ((data.secondaryBusinessModels || []).some(s => /service|fält|eftermarknad/i.test(s))) {
      addonTriggers.push("Service/eftermarknad");
    }
    if ((data.complexity as any).ecommercePlatform === "avancerad" || (data.complexity as any).ecommercePlatform === "enkel") {
      addonTriggers.push("E-handel/PIM");
    }
    const integrationCnt = (data.integrationSystems || []).filter(s => s.system && s.system.trim()).length;
    if (integrationCnt >= 3) addonTriggers.push("Flera integrationer / iPaaS");
    if ((data.aiAmbitions || []).filter(a => a && a !== "Vi vet inte ännu, men vill förstå möjligheterna").length >= 2) {
      addonTriggers.push("Automation / Power Platform / Copilot");
    }

    // ---- 5 utfall: BC / BC med tillägg / F&SCM / Båda / För tidigt ----
    const maxScore = Math.max(bcScore, fscScore);
    const minScore = Math.min(bcScore, fscScore);
    let outcome: "Business Central" | "Business Central med tillägg" | "Finance & Supply Chain Management" | "Båda bör utvärderas" | "För tidigt att avgöra";
    if (securityLevel === "Låg" || maxScore < 25) {
      outcome = "För tidigt att avgöra";
    } else if (isCloseCall && minScore >= 25) {
      outcome = "Båda bör utvärderas";
    } else if (isBC) {
      // BC vinner – men har vi tillägg-triggers?
      outcome = addonTriggers.length >= 2 ? "Business Central med tillägg" : "Business Central";
    } else {
      outcome = "Finance & Supply Chain Management";
    }

    // ---- Indikationen bygger främst på (konkreta faktorer, inte produktnamn) ----
    const indicationBasis: string[] = [];
    if (data.complexity.legalEntities) {
      const map: Record<string, string> = {
        "1-2": "1–2 juridiska enheter",
        "3-5": "3–5 juridiska enheter",
        "6+": "6+ juridiska enheter",
      };
      if (map[data.complexity.legalEntities]) indicationBasis.push(map[data.complexity.legalEntities]);
    }
    if (data.complexity.consolidation === "ingen") indicationBasis.push("Inget konsolideringskrav");
    else if (data.complexity.consolidation === "enkel") indicationBasis.push("Enkel konsolidering");
    else if (data.complexity.consolidation === "komplex") indicationBasis.push("Komplex konsolidering");
    if (data.geography) indicationBasis.push(`${data.geography} som geografisk räckvidd`);
    if (data.complexity.warehouseManagement === "grundlaggande") indicationBasis.push("Grundläggande lagerstyrning");
    else if (data.complexity.warehouseManagement === "avancerad") indicationBasis.push("Avancerad lagerstyrning / WMS-behov");
    if (data.complexity.transactionVolume === "hog") indicationBasis.push("Hög transaktionsvolym");
    else if (data.complexity.transactionVolume === "medel") indicationBasis.push("Medelhög transaktionsvolym");
    if (integrationCnt >= 3) indicationBasis.push("Flera system som behöver integreras");
    else if (integrationCnt >= 1) indicationBasis.push("Befintliga system att integrera");
    if (data.businessModel) indicationBasis.push(`${data.businessModel}-modell som primär affär`);
    if ((data.aiAmbitions || []).filter(a => a && a !== "Vi vet inte ännu, men vill förstå möjligheterna").length > 0) {
      indicationBasis.push("Tydligt intresse för AI och automation");
    }
    if (/föråldrad|föråldrat|gammalt|hänger inte|risk/i.test(data.currentSituationReason || "")) {
      indicationBasis.push("Behov av modernisering av nuvarande ERP");
    }

    return {
      product: isBC ? "Business Central" : "Finance & Supply Chain Management",
      outcome,
      securityLevel,
      score: isBC ? bcScore : fscScore,
      reasons: isBC ? uniqueBcReasons : uniqueFscReasons,
      description: isBC ? bcDescription : fscDescription,
      isCloseCall,
      complexityLevel: complexity.complexityLevel,
      riskLevel: complexity.riskLevel,
      isHighRisk: complexity.isHighRisk,
      criticalFactors: complexity.criticalFactors,
      prioritizedFactors: (complexity as any).prioritizedFactors || [],
      indicationBasis: Array.from(new Set(indicationBasis)).slice(0, 8),
      addonTriggers: Array.from(new Set(addonTriggers)).slice(0, 8),
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
    const aiMaturity = getAiMaturity();
    const deterministicAiNextSteps = getAiNextSteps();

    // ── Hämta köparsidig AI-tolkning (med fallback) ─────────────────────────
    let aiAnalysis: {
      executiveSummary?: string;
      aiInterpretation: string;
      valueHypothesis?: string;
      whyPoints: string[];
      risks: string[];
      partnerProfile: string;
      nextSteps: string[];
      confidence: string;
    } | null = null;
    try {
      setIsSendingEmail(true);
      const aiSummary = {
        verksamhetsmodell: data.businessModel,
        underkategorier: data.businessModelSubs,
        sekundaraModeller: data.secondaryBusinessModels,
        anstallda: data.employees,
        omsattning: data.revenue,
        erpAnvandare: data.erpUsers,
        bransch: data.industry === "Annat" ? data.industryOther : data.industry,
        geografi: data.geography,
        geografiOvrigt: data.geographyOther,
        komplexitet: data.complexity,
        komplexitetsniva: complexity.complexityLevel,
        riskniva: complexity.riskLevel,
        nuvarandeSystem: data.currentSystems.filter(s => s.product.trim()),
        ovrigaSystem: data.otherSystemsDetails,
        situationOrsak: data.currentSituationReason,
        utmaningar: data.situationChallenges,
        beslutstidslinje: data.decisionTimeline,
        integrationer: data.integrationSystems.filter(s => s.system.trim()),
        aiIntresse: data.aiInterest,
        aiAmbitioner: data.aiAmbitions,
        aiUseCases: data.aiUseCases,
        aiDatakvalitet: data.aiDataQuality,
        aiDataproblem: data.aiDataIssues,
        aiProcessmognad: data.aiProcessMaturity,
        aiGovernance: data.aiGovernance,
        aiRisker: data.aiRisks,
        aiKommentar: data.aiDetails,
        aiMognadsniva: aiMaturity.level,
        aiMognadDataScore: aiMaturity.dataScore,
        aiMognadProcessScore: aiMaturity.processScore,
        aiRekommenderadeNastaStegDeterministiska: deterministicAiNextSteps,
        onskelista: data.wishlist,
        ovrigInfo: data.additionalInfo,
      };
      const { data: aiRes, error: aiErr } = await supabase.functions.invoke("generate-erp-analysis", {
        body: {
          companyName: data.companyName,
          contactName: data.contactName,
          summary: aiSummary,
          recommendation: {
            product: recommendation.product,
            outcome: recommendation.outcome,
            securityLevel: recommendation.securityLevel,
            reasons: recommendation.reasons,
            isCloseCall: recommendation.isCloseCall,
            complexityLevel: complexity.complexityLevel,
            riskLevel: complexity.riskLevel,
            aiMaturity: aiMaturity.level,
            aiAmbitions: data.aiAmbitions,
            aiUseCases: data.aiUseCases,
            aiDataIssues: data.aiDataIssues,
            aiRisks: data.aiRisks,
          },
        },
      });
      if (aiErr) console.error("AI-tolkning fel:", aiErr);
      if (aiRes?.analysis) aiAnalysis = aiRes.analysis;
    } catch (e) {
      console.error("AI-tolkning misslyckades:", e);
    } finally {
      setIsSendingEmail(false);
    }

    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    const checkPage = (needed = 20) => { if (yPos + needed > 270) { pdf.addPage(); yPos = margin; } };

    const addSectionHeader = (title: string, r: number, g: number, b: number) => {
      checkPage(22);
      yPos += 2;
      pdf.setFillColor(r, g, b);
      pdf.roundedRect(margin, yPos, contentWidth, 11, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, margin + 5, yPos + 7.5);
      yPos += 18;
      pdf.setTextColor(51, 51, 51);
      pdf.setFont("helvetica", "normal");
    };

    const addProse = (text: string, fontSize = 9, lineGap = 5.2) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      // Split into paragraphs on double newlines or single newlines
      const paragraphs = text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean);
      paragraphs.forEach((para, idx) => {
        const lines = pdf.splitTextToSize(para, contentWidth);
        lines.forEach((line: string) => {
          checkPage(lineGap + 1);
          pdf.text(line, margin, yPos);
          yPos += lineGap;
        });
        if (idx < paragraphs.length - 1) yPos += 3;
      });
      yPos += 4;
    };

    const addTextBlock = (text: string, fontSize = 9) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text || "Ej angivet", contentWidth);
      checkPage(lines.length * 5 + 4);
      pdf.text(lines, margin, yPos);
      yPos += lines.length * 5 + 8;
    };

    const addBulletList = (items: string[]) => {
      if (!items.length) return;
      pdf.setFontSize(9);
      items.forEach(item => { checkPage(7); pdf.text(`-  ${item}`, margin + 3, yPos); yPos += 6; });
      yPos += 5;
    };

    const addKVRow = (label: string, value: string, shade: boolean) => {
      if (!value || value === "Ej angivet") return;
      checkPage(8);
      if (shade) { pdf.setFillColor(245, 247, 252); pdf.rect(margin, yPos - 4, contentWidth, 7, 'F'); }
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80, 80, 80);
      pdf.text(label, margin + 2, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(30, 30, 30);
      const valLines = pdf.splitTextToSize(value, contentWidth - 55);
      pdf.text(valLines, margin + 55, yPos);
      yPos += Math.max(6, valLines.length * 5);
    };

    // ── COVER PAGE ─────────────────────────────────────────────────────────────
    const analysisDate = new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
    pdf.setFillColor(0, 120, 108);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.setFillColor(0, 180, 160);
    pdf.rect(0, pageHeight * 0.55, pageWidth, 3, 'F');

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
    pdf.text("Dynamics 365 Affärssystem (ERP)", pageWidth / 2, 133, { align: "center" });
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 20, 142, pageWidth - margin - 20, 142);

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.companyName || "", pageWidth / 2, 158, { align: "center" });
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(200, 240, 235);
    pdf.text(data.contactName || "", pageWidth / 2, 170, { align: "center" });
    pdf.text(data.email || "", pageWidth / 2, 181, { align: "center" });

    pdf.setTextColor(180, 230, 225);
    pdf.setFontSize(9);
    pdf.text("d365.se - Vägledning för Microsoft Dynamics 365-partner", pageWidth / 2, pageHeight - 28, { align: "center" });
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(`Analysens datum: ${analysisDate}`, pageWidth / 2, pageHeight - 18, { align: "center" });
    pdf.addPage();

    // ── PAGE HEADER ────────────────────────────────────────────────────────────
    pdf.setFillColor(0, 143, 179);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("RESULTAT & REKOMMENDATIONER", margin, 22);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${data.companyName} - ${analysisDate}`, margin, 33);
    yPos = 50;

    // ══════════════════════════════════════════════════════════════════════
    // 1. SAMMANFATTNING
    // ══════════════════════════════════════════════════════════════════════
    addSectionHeader("SAMMANFATTNING", 0, 143, 179);

    const bmLabel = businessModelOptions.find(o => o.value === data.businessModel)?.label || data.businessModel || "Ej angivet";
    const geoLabel = data.geography || "Ej angivet";
    const sizeLabel = data.employees || "Ej angivet";
    const prioritized = (complexity as any).prioritizedFactors as string[] || [];
    const prioritizedCount = prioritized.length > 0
      ? `${prioritized.length} områden`
      : "Inga blockerande";

    const profileRows = [
      ["Affärsmodell", bmLabel],
      ["Organisation", sizeLabel],
      ["Geografisk räckvidd", geoLabel],
      ["Prioriterade faktorer", prioritizedCount],
    ];
    const cellW = contentWidth / 2;
    const cellH = 14;
    profileRows.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = margin + col * cellW;
      const y = yPos + row * cellH;
      pdf.setFillColor(245, 248, 252);
      pdf.roundedRect(x + 1, y, cellW - 2, cellH - 2, 2, 2, 'F');
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(label, x + 5, y + 5);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 100, 130);
      pdf.text(value, x + 5, y + 11);
    });
    yPos += Math.ceil(profileRows.length / 2) * cellH + 8;

    // ══════════════════════════════════════════════════════════════════════
    // 2. ERP-MOGNAD (Complexity Level with dots)
    // ══════════════════════════════════════════════════════════════════════
    const maturityLevel = complexity.complexityLevel;
    const maturityLabels = ["", "Grundläggande ERP", "Standardiserat ERP med tillväxt- och integrationskrav", "Avancerat ERP", "Enterprise ERP"];
    const maturityComments: Record<number, { text: string; strengths: string[]; gaps: string[] }> = {
      1: {
        text: "Er organisation har relativt enkla ERP-behov med begränsad komplexitet i struktur och processer. Det finns goda möjligheter att snabbt få värde av ett modernt affärssystem.",
        strengths: ["Enkel och snabb implementation", "Låg TCO och tydlig ROI", "Lätthanterade processer", "Flexibilitet att växa"],
        gaps: ["Begränsat systemstöd idag", "Manuella processer kan skalas bort", "Potential att standardisera mer"],
      },
      2: {
        text: "Er organisation har en standardiserad ERP-bas men tydliga tillväxt-, integrations- och effektiviseringsbehov. Rätt plattform behöver kunna stödja både dagens flöden och nästa skalningssteg utan onödig komplexitet.",
        strengths: ["Etablerade affärsprocesser", "Viss systemerfarenhet", "Tydlig ansvarsfördelning"],
        gaps: ["Integrationsbehov mellan flera system", "Manuell rapportering att automatisera", "Processer behöver standardiseras inför skalning"],
      },
      3: {
        text: "Er organisation har en påtaglig komplexitet i struktur, integrationer eller operativa processer. Implementationsprojektet kräver noggrann förberedelse, tydlig arkitektur och en partner med dokumenterad erfarenhet.",
        strengths: ["Tydliga processkrav", "IT-mognad på plats", "Strukturerad styrmodell"],
        gaps: ["Integrationsbehov kräver plan", "Förändringsledning viktigt", "Kräver branschanpassad partner"],
      },
      4: {
        text: "Er organisation har hög komplexitet – multi-entity, globala flöden eller avancerade operativa krav. Partnerurval, arkitektur och förändringsledning blir avgörande för framgång.",
        strengths: ["Stor intern IT-kapacitet", "Tydlig global styrmodell", "Avancerade systemkrav väldefinierade"],
        gaps: ["Lång implementationstid att planera för", "Kräver enterprise-certifierad partner", "Change management kritiskt"],
      },
    };
    const maturityData = maturityComments[maturityLevel];

    checkPage(40);
    addSectionHeader("ERP-KOMPLEXITETSNIVÅ", 5, 150, 105);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text("Bedömd ERP-komplexitet", margin, yPos);
    yPos += 6;
    for (let i = 1; i <= 4; i++) {
      if (i <= maturityLevel) pdf.setFillColor(5, 150, 105);
      else pdf.setFillColor(220, 220, 220);
      pdf.circle(margin + (i - 1) * 10 + 3, yPos, 3, "F");
    }
    yPos += 6;
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(51, 51, 51);
    pdf.text(`Nivå ${maturityLevel} - ${maturityLabels[maturityLevel]}`, margin, yPos);
    yPos += 4;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Risknivå: ${complexity.riskLevel}`, margin, yPos);
    yPos += 8;

    // ══════════════════════════════════════════════════════════════════════
    // 3. BEDOMNING (assessment text + critical factors)
    // ══════════════════════════════════════════════════════════════════════
    checkPage(40);
    addSectionHeader("BEDÖMNING", 80, 80, 100);
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const matDescLines = pdf.splitTextToSize(maturityData.text, contentWidth);
    matDescLines.forEach((line: string) => {
      checkPage(6);
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 3;

    const factorsForPdf: string[] = prioritized.length > 0
      ? prioritized
      : complexity.criticalFactors;

    if (factorsForPdf.length > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(9);
      pdf.text("Prioriterade faktorer att hantera:", margin, yPos);
      yPos += 6;
      pdf.setFont("helvetica", "normal");
      factorsForPdf.forEach((factor) => {
        checkPage(7);
        pdf.setFillColor(0, 143, 179);
        pdf.circle(margin + 2.5, yPos - 1.5, 1.2, "F");
        const lines = pdf.splitTextToSize(factor, contentWidth - 10);
        pdf.setTextColor(51, 51, 51);
        pdf.text(lines, margin + 7, yPos);
        yPos += lines.length * 5.2 + 2;
      });
    } else {
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9);
      pdf.setTextColor(80, 80, 80);
      const noBlockLines = pdf.splitTextToSize(
        "Inga blockerande faktorer identifierade, men flera områden bör utredas vidare i en kravspecifikation och fit-gap.",
        contentWidth,
      );
      noBlockLines.forEach((l: string) => { checkPage(6); pdf.text(l, margin, yPos); yPos += 5.2; });
    }

    // Risk warning
    if (recommendation.isHighRisk) {
      yPos += 4;
      checkPage(20);
      pdf.setFillColor(254, 243, 199);
      pdf.roundedRect(margin, yPos, contentWidth, 18, 2, 2, 'F');
      pdf.setTextColor(120, 80, 0);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text("OBS: Högriskprojekt", margin + 4, yPos + 6);
      pdf.setFont("helvetica", "normal");
      const warnLines = pdf.splitTextToSize("Hög komplexitet i kombination med låg IT-mognad. Partnerurval och projektstruktur blir avgörande.", contentWidth - 8);
      pdf.text(warnLines, margin + 4, yPos + 11);
      yPos += 20 + (warnLines.length - 1) * 4;
    }
    yPos += 6;

    // ══════════════════════════════════════════════════════════════════════
    // EXECUTIVE SUMMARY (köparsidig AI-sammanfattning)
    // ══════════════════════════════════════════════════════════════════════
    if (aiAnalysis?.executiveSummary) {
      checkPage(40);
      addSectionHeader("SAMMANFATTNING FÖR LEDNINGEN", 14, 124, 134);
      addProse(aiAnalysis.executiveSummary, 9, 5.4);
    }

    // ══════════════════════════════════════════════════════════════════════
    // AI-TOLKNING (köparsidig, från Lovable AI Gateway)
    // ══════════════════════════════════════════════════════════════════════
    if (aiAnalysis?.aiInterpretation) {
      checkPage(40);
      addSectionHeader("AI-TOLKNING AV ERT UNDERLAG", 14, 124, 134);
      addProse(aiAnalysis.aiInterpretation, 9, 5.4);
      if (aiAnalysis.confidence) {
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(120, 120, 120);
        pdf.text(`Säkerhet i analysen: ${aiAnalysis.confidence}`, margin, yPos);
        yPos += 8;
      }
      yPos += 4;
    }

    // ══════════════════════════════════════════════════════════════════════
    // VÄRDEHYPOTES (var ligger nyttan?)
    // ══════════════════════════════════════════════════════════════════════
    if (aiAnalysis?.valueHypothesis) {
      checkPage(40);
      addSectionHeader("VÄRDEHYPOTES OCH AFFÄRSNYTTA", 14, 124, 134);
      addProse(aiAnalysis.valueHypothesis, 9, 5.4);
    }



    // ══════════════════════════════════════════════════════════════════════
    // 4. STYRKOR + UTVECKLINGSOMRADEN (side by side)
    // ══════════════════════════════════════════════════════════════════════
    checkPage(50);
    const colW = (contentWidth - 4) / 2;

    pdf.setFillColor(22, 163, 74);
    pdf.roundedRect(margin, yPos, colW, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("STYRKOR", margin + 4, yPos + 5.5);

    pdf.setFillColor(245, 158, 11);
    pdf.roundedRect(margin + colW + 4, yPos, colW, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text("UTVECKLINGSOMRÅDEN", margin + colW + 8, yPos + 5.5);
    yPos += 12;

    const maxItems = Math.max(maturityData.strengths.length, maturityData.gaps.length);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    for (let i = 0; i < maxItems; i++) {
      checkPage(8);
      if (i < maturityData.strengths.length) {
        pdf.setTextColor(22, 163, 74);
        pdf.text("-", margin + 2, yPos);
        pdf.setTextColor(51, 51, 51);
        const sLines = pdf.splitTextToSize(maturityData.strengths[i], colW - 8);
        pdf.text(sLines, margin + 6, yPos);
      }
      if (i < maturityData.gaps.length) {
        pdf.setTextColor(245, 158, 11);
        pdf.text("-", margin + colW + 6, yPos);
        pdf.setTextColor(51, 51, 51);
        const gLines = pdf.splitTextToSize(maturityData.gaps[i], colW - 8);
        pdf.text(gLines, margin + colW + 10, yPos);
      }
      yPos += 6;
    }
    yPos += 8;

    // ══════════════════════════════════════════════════════════════════════
    // 5. PRELIMINÄR LÖSNINGSINRIKTNING
    // ══════════════════════════════════════════════════════════════════════
    checkPage(60);
    addSectionHeader("PRELIMINÄR LÖSNINGSINRIKTNING", 0, 100, 130);

    const isBC = recommendation.product === "Business Central";
    const directionHeadingMap: Record<string, string> = {
      "Business Central": "Business Central som relevant lösningsväg att utvärdera vidare",
      "Business Central med tillägg": "Business Central med relevanta bransch-/tilläggslösningar bör utvärderas",
      "Finance & Supply Chain Management": "Finance & Supply Chain Management bör ingå i den fortsatta utvärderingen",
      "Båda bör utvärderas": "Både Business Central och Finance & Supply Chain Management bör utvärderas vidare",
      "För tidigt att avgöra": "För tidigt att avgöra lösningsväg – kompletterande underlag behövs",
    };
    const directionLeadMap: Record<string, string> = {
      "Business Central": "Utifrån era svar framstår Business Central som en relevant lösningsväg att utvärdera vidare. Detta är en lösningshypotes, inte ett slutligt systemval.",
      "Business Central med tillägg": "Utifrån era svar framstår Business Central som en relevant lösningsväg att utvärdera vidare, sannolikt tillsammans med relevanta bransch- eller tilläggslösningar. Särskilt krav inom EDI, lager, service, rapportering och integrationer bör valideras i en fit-gap innan lösningsarkitektur beslutas.",
      "Finance & Supply Chain Management": "Utifrån era svar bör Finance & Supply Chain Management ingå i den fortsatta utvärderingen. Detta är en lösningshypotes, inte ett slutligt systemval.",
      "Båda bör utvärderas": "Utifrån era svar bör både Business Central (eventuellt med tillägg) och Finance & Supply Chain Management prövas i en fit-gap innan lösningsarkitektur beslutas.",
      "För tidigt att avgöra": "Underlaget räcker inte för att peka ut en tydlig lösningsväg. Genomför en fördjupad nulägeskartläggning och kravspecifikation innan plattformsval övervägs.",
    };
    const directionTitle = directionHeadingMap[recommendation.outcome] || directionHeadingMap["Business Central"];
    const directionLead = directionLeadMap[recommendation.outcome] || directionLeadMap["Business Central"];

    // Headline bar
    pdf.setFillColor(240, 248, 252);
    pdf.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');
    pdf.setTextColor(0, 100, 130);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(directionTitle, margin + 5, yPos + 9);
    yPos += 18;

    // Lead text
    pdf.setTextColor(40, 40, 40);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const leadLines = pdf.splitTextToSize(directionLead, contentWidth);
    leadLines.forEach((l: string) => { checkPage(6); pdf.text(l, margin, yPos); yPos += 5.4; });
    yPos += 3;

    // Säkerhet i analysen
    const secColors: Record<string, [number, number, number]> = {
      "Hög": [22, 163, 74],
      "Medel": [217, 119, 6],
      "Låg": [180, 50, 50],
    };
    const sc = secColors[recommendation.securityLevel] || [120, 120, 120];
    pdf.setFillColor(245, 248, 252);
    pdf.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    pdf.text("Säkerhet i analysen:", margin + 5, yPos + 6.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(sc[0], sc[1], sc[2]);
    pdf.text(recommendation.securityLevel, margin + 42, yPos + 6.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120, 120, 120);
    pdf.text("(lösningshypotes – ej slutligt systemval)", margin + 58, yPos + 6.5);
    yPos += 16;

    // Lösningshypotes-disclaimer
    pdf.setFillColor(252, 248, 235);
    const disclaimerLines = pdf.splitTextToSize(
      "Detta är en preliminär lösningshypotes baserad på era svar. Ett slutligt val mellan Business Central, Business Central med tillägg, Finance & Supply Chain Management eller annan lösningsarkitektur bör föregås av en fördjupad fit-gap, kravspecifikation och partnerdialog.",
      contentWidth - 8,
    );
    const disclaimerH = disclaimerLines.length * 5.0 + 8;
    pdf.roundedRect(margin, yPos, contentWidth, disclaimerH, 2, 2, 'F');
    pdf.setTextColor(110, 80, 0);
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "italic");
    let dy = yPos + 6;
    disclaimerLines.forEach((l: string) => { pdf.text(l, margin + 4, dy); dy += 5.0; });
    yPos += disclaimerH + 6;

    if (recommendation.isCloseCall) {
      pdf.setFillColor(255, 248, 225);
      pdf.roundedRect(margin, yPos, contentWidth, 14, 2, 2, 'F');
      pdf.setTextColor(180, 130, 0);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Gränsland: BC ${recommendation.bcScore}p – F&SCM ${recommendation.fscScore}p. Partnerns arkitekturkompetens blir avgörande.`, margin + 5, yPos + 9);
      yPos += 18;
    }

    // Fokusområden
    pdf.setTextColor(51, 51, 51);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("Lösningsvägen bör fokusera på:", margin, yPos);
    yPos += 7;

    const pdfFocusMap: Record<string, string[]> = {
      "Business Central": [
        "Ekonomi och redovisning i molnet",
        "Lagerstyrning och orderhantering",
        "Inbyggd BI och rapportering med Power BI",
        "Copilot AI för ökad produktivitet",
        "Sömlös integration med Microsoft 365",
      ],
      "Business Central med tillägg": [
        "Business Central som ekonomi- och orderkärna",
        "EDI, WMS, batch-/serienummerspårning vid behov",
        "Service-/eftermarknad och fältservice via tillägg",
        "E-handel, PIM och bransch-ISV där standard inte räcker",
        "Power Platform och Copilot för automation och AI",
      ],
      "Finance & Supply Chain Management": [
        "Avancerad koncernredovisning och multi-entity",
        "Global supply chain och multi-site lager",
        "Avancerad tillverkning och MRP/APS",
        "Prediktiv analys och efterfrågeprognoser",
        "Regulatorisk efterlevnad och compliance",
      ],
    };
    const focusItems = pdfFocusMap[recommendation.outcome] || pdfFocusMap[recommendation.product] || [];

    focusItems.forEach((item) => {
      checkPage(10);
      pdf.setFillColor(240, 248, 252);
      pdf.roundedRect(margin + 2, yPos - 3, contentWidth - 4, 8, 1, 1, 'F');
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      pdf.text(`  ${item}`, margin + 5, yPos + 1);
      yPos += 9;
    });
    yPos += 6;

    // Tilläggsbehov (fit-gap-triggers) – visas bara om relevanta
    if (recommendation.addonTriggers && recommendation.addonTriggers.length > 0) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 100, 130);
      pdf.text("Områden att validera i fit-gap (tillägg eller ISV kan behövas):", margin, yPos);
      yPos += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      pdf.setFontSize(9);
      recommendation.addonTriggers.forEach((t) => {
        checkPage(6);
        pdf.setFillColor(217, 119, 6);
        pdf.circle(margin + 2.5, yPos - 1.5, 1.2, "F");
        const lines = pdf.splitTextToSize(t, contentWidth - 10);
        pdf.text(lines, margin + 7, yPos);
        yPos += lines.length * 5.2 + 1.5;
      });
      yPos += 6;
    }

    // Indikationen bygger främst på – nu konkreta faktorer, inte produktnamn
    const basisItems = (recommendation.indicationBasis && recommendation.indicationBasis.length > 0)
      ? recommendation.indicationBasis
      : recommendation.reasons.slice(0, 6);

    if (basisItems.length > 0) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Indikationen bygger främst på:", margin, yPos);
      yPos += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(51, 51, 51);
      basisItems.forEach((item) => {
        checkPage(6);
        pdf.setFillColor(0, 143, 179);
        pdf.circle(margin + 2.5, yPos - 1.5, 1.2, "F");
        const lines = pdf.splitTextToSize(item, contentWidth - 10);
        pdf.text(lines, margin + 7, yPos);
        yPos += lines.length * 5.2 + 1.5;
      });
      yPos += 6;
    }

    // Sekundära verksamhetsmodeller – kort förtydligande om service/eftermarknad markerats
    const secondaryService = (data.secondaryBusinessModels || []).filter(s => /service|fält|eftermarknad/i.test(s));
    if (secondaryService.length > 0) {
      pdf.setFillColor(245, 248, 252);
      const noteLines = pdf.splitTextToSize(
        "Eftersom service/eftermarknad har markerats som kompletterande verksamhetsmodell bör ni klargöra om behovet rör enklare servicehantering, reservdelar och fakturering – eller mer avancerad fältservice med teknikerplanering, SLA och installerad bas.",
        contentWidth - 8,
      );
      const noteH = noteLines.length * 5.0 + 8;
      checkPage(noteH + 4);
      pdf.roundedRect(margin, yPos, contentWidth, noteH, 2, 2, 'F');
      pdf.setTextColor(0, 100, 130);
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "italic");
      let sy = yPos + 6;
      noteLines.forEach((l: string) => { pdf.text(l, margin + 4, sy); sy += 5.0; });
      yPos += noteH + 6;
    }

    // ══════════════════════════════════════════════════════════════════════
    // 6. PARTNERPROFIL – BESKRIVNING AV KOMPETENS
    // ══════════════════════════════════════════════════════════════════════
    checkPage(40);
    addSectionHeader("PARTNERPROFIL – KOMPETENS ATT SÖKA", 0, 100, 130);

    // Build a prose description based on triggers
    const competenceAreas: string[] = [];
    if (data.industry) competenceAreas.push(`branschkompetens inom ${data.industry.toLowerCase()}`);
    if (data.businessModel === "Distribution" || data.businessModel === "Grossist") competenceAreas.push("grossist/distribution");
    if (recommendation.addonTriggers.some(t => /EDI/i.test(t))) competenceAreas.push("EDI och kundintegrationer");
    if (recommendation.addonTriggers.some(t => /WMS|lager/i.test(t)) || data.complexity.warehouseManagement) competenceAreas.push("lager- och orderflöden");
    if (recommendation.addonTriggers.some(t => /ISV|tillägg|PIM|e-handel/i.test(t)) || recommendation.outcome === "Business Central med tillägg") competenceAreas.push("ISV-/tilläggslösningar för Business Central");
    if (recommendation.addonTriggers.some(t => /Power|Copilot|Automation/i.test(t))) competenceAreas.push("Power Platform och Copilot");
    const _integrationCnt = (data.integrationSystems || []).filter(s => s.system && s.system.trim()).length;
    if (recommendation.addonTriggers.some(t => /integration|iPaaS/i.test(t)) || _integrationCnt >= 3) competenceAreas.push("integrationer och iPaaS");
    if (recommendation.addonTriggers.some(t => /service|fält|eftermarknad/i.test(t))) competenceAreas.push("service/eftermarknad och fältservice");
    competenceAreas.push("datamigrering och masterdata");
    competenceAreas.push("långsiktig förvaltning och förändringsledning");

    const partnerProse = isBC || recommendation.outcome === "Business Central med tillägg"
      ? `Ni bör söka en Dynamics 365-partner med erfarenhet av ${competenceAreas.slice(0, 6).join(", ")} samt Business Central med relevanta tilläggslösningar. Partnern bör kunna genomföra en strukturerad fit-gap och bedöma när standardfunktionalitet räcker, när tillägg behövs och när Finance & Supply Chain Management bör övervägas.`
      : `Ni bör söka en Dynamics 365-partner med erfarenhet av ${competenceAreas.slice(0, 6).join(", ")} samt Finance & Supply Chain Management i organisationer av er storlek. Partnern bör kombinera funktionell rådgivning med arkitekturkompetens och dokumenterad förmåga inom förändringsledning.`;

    addProse(partnerProse, 9, 5.4);

    // Kompetensområden som chips
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 100, 130);
    pdf.text("Prioriterade kompetensområden:", margin, yPos);
    yPos += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(51, 51, 51);
    Array.from(new Set(competenceAreas)).forEach((area) => {
      checkPage(6);
      pdf.setFillColor(0, 143, 179);
      pdf.circle(margin + 2.5, yPos - 1.5, 1.2, "F");
      const lines = pdf.splitTextToSize(area.charAt(0).toUpperCase() + area.slice(1), contentWidth - 10);
      pdf.text(lines, margin + 7, yPos);
      yPos += lines.length * 5.2 + 1.5;
    });
    yPos += 8;

    // ══════════════════════════════════════════════════════════════════════
    // AI-MOGNAD OCH AUTOMATIONSPOTENTIAL
    // ══════════════════════════════════════════════════════════════════════
    {
      checkPage(40);
      addSectionHeader("AI-MOGNAD OCH AUTOMATIONSPOTENTIAL", 90, 60, 160);

      // Mognadsbadge
      const mc: Record<string, [number, number, number]> = {
        "Låg": [180, 90, 30],
        "Medel": [200, 150, 40],
        "Hög": [40, 130, 90],
        "Avancerad": [60, 90, 170],
      };
      const [mr, mg, mb] = mc[aiMaturity.level] || [120, 120, 120];
      pdf.setFillColor(mr, mg, mb);
      pdf.roundedRect(margin, yPos, 70, 9, 2, 2, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(`AI-mognad: ${aiMaturity.level}`, margin + 4, yPos + 6);
      yPos += 13;

      pdf.setTextColor(40, 40, 40);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const summaryLines = pdf.splitTextToSize(aiMaturity.summary, contentWidth);
      summaryLines.forEach((l: string) => { checkPage(6); pdf.text(l, margin, yPos); yPos += 5; });
      yPos += 3;

      // Ambitioner
      if (data.aiAmbitions.length) {
        checkPage(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Vad ni vill uppnå med AI:", margin, yPos); yPos += 5;
        pdf.setFont("helvetica", "normal");
        const amb = pdf.splitTextToSize("- " + data.aiAmbitions.join("\n- "), contentWidth - 4);
        amb.forEach((l: string) => { checkPage(6); pdf.text(l, margin + 2, yPos); yPos += 5; });
        yPos += 2;
      }

      // Prioriterade use cases
      if (data.aiUseCases.length) {
        checkPage(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Prioriterade AI-use cases:", margin, yPos); yPos += 5;
        pdf.setFont("helvetica", "normal");
        const uc = pdf.splitTextToSize("- " + data.aiUseCases.join("\n- "), contentWidth - 4);
        uc.forEach((l: string) => { checkPage(6); pdf.text(l, margin + 2, yPos); yPos += 5; });
        yPos += 2;
      }

      // Datamognad
      const dqEntries = Object.entries(data.aiDataQuality || {}).filter(([, v]) => v);
      if (dqEntries.length) {
        checkPage(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Datamognad (sammanvägd: ${aiMaturity.dataScore}/100):`, margin, yPos); yPos += 5;
        pdf.setFont("helvetica", "normal");
        dqEntries.forEach(([k, v]) => {
          checkPage(5);
          pdf.text(`- ${k}: ${v}`, margin + 2, yPos);
          yPos += 5;
        });
        yPos += 2;
      }
      if (data.aiDataIssues.length) {
        checkPage(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Identifierade dataproblem:", margin, yPos); yPos += 5;
        pdf.setFont("helvetica", "normal");
        const di = pdf.splitTextToSize("- " + data.aiDataIssues.join("\n- "), contentWidth - 4);
        di.forEach((l: string) => { checkPage(6); pdf.text(l, margin + 2, yPos); yPos += 5; });
        yPos += 2;
      }

      // Processmognad
      const pmEntries = Object.entries(data.aiProcessMaturity || {}).filter(([, v]) => v);
      if (pmEntries.length) {
        checkPage(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Processmognad (sammanvägd: ${aiMaturity.processScore}/100):`, margin, yPos); yPos += 5;
        pdf.setFont("helvetica", "normal");
        pmEntries.forEach(([k, v]) => {
          checkPage(5);
          pdf.text(`- ${k}: ${v}`, margin + 2, yPos);
          yPos += 5;
        });
        yPos += 2;
      }

      // Governance & risker
      if (data.aiGovernance) {
        checkPage(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("AI-governance:", margin, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(data.aiGovernance, margin + 36, yPos);
        yPos += 6;
      }
      if (data.aiRisks.length) {
        checkPage(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Risker och frågor att hantera:", margin, yPos); yPos += 5;
        pdf.setFont("helvetica", "normal");
        const r = pdf.splitTextToSize("- " + data.aiRisks.join("\n- "), contentWidth - 4);
        r.forEach((l: string) => { checkPage(6); pdf.text(l, margin + 2, yPos); yPos += 5; });
        yPos += 2;
      }

      // Rekommenderade AI-nasta steg (deterministiska)
      if (deterministicAiNextSteps.length) {
        checkPage(14);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(90, 60, 160);
        pdf.text("Rekommenderade AI-nästa steg:", margin, yPos); yPos += 5;
        pdf.setTextColor(40, 40, 40);
        pdf.setFont("helvetica", "normal");
        deterministicAiNextSteps.forEach((s, i) => {
          checkPage(10);
          pdf.setFillColor(90, 60, 160);
          pdf.circle(margin + 2, yPos - 1.5, 1, "F");
          const lines = pdf.splitTextToSize(`${i + 1}. ${s}`, contentWidth - 8);
          pdf.text(lines, margin + 6, yPos);
          yPos += lines.length * 5 + 2;
        });
      }
      yPos += 6;
    }

    // ══════════════════════════════════════════════════════════════════════
    // AI: PARTNERPROFIL, RISKER OCH NASTA STEG
    // ══════════════════════════════════════════════════════════════════════
    if (aiAnalysis?.partnerProfile) {
      checkPage(30);
      addSectionHeader("REKOMMENDERAD PARTNERPROFIL (KÖPARSIDIGT)", 14, 124, 134);
      addProse(aiAnalysis.partnerProfile, 9, 5.4);
    }

    if (aiAnalysis?.risks?.length) {
      checkPage(30);
      addSectionHeader("RISKER OCH FRÅGOR ATT UTREDA VIDARE", 180, 90, 30);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      aiAnalysis.risks.forEach((risk) => {
        checkPage(10);
        pdf.setFillColor(245, 158, 11);
        pdf.circle(margin + 2.5, yPos - 1.5, 1.2, "F");
        const lines = pdf.splitTextToSize(risk, contentWidth - 10);
        pdf.text(lines, margin + 7, yPos);
        yPos += lines.length * 5.2 + 3;
      });
      yPos += 6;
    }

    // Slå samman AI-tolkningens nasta steg med deterministiska AI-rekommendationer
    const combinedNextSteps: string[] = [];

    // Deterministiska fit-gap-steg utifrån lösningsindikation
    const productKey = recommendation.product || "";
    const addonsList = (recommendation.addonTriggers || []).filter(Boolean);
    if (/Business Central/i.test(productKey)) {
      combinedNextSteps.push(
        "Genomför en fit-gap mot Business Central standard och identifiera vilka behov som täcks av standardfunktionalitet, vilka som kräver tillägg eller ISV-lösningar och vilka som motiverar fortsatt utvärdering av Finance & Supply Chain Management."
      );
      if (addonsList.length) {
        combinedNextSteps.push(
          `Validera särskilt följande områden i fit-gap där tillägg eller branschlösningar kan behövas: ${addonsList.slice(0, 6).join(", ")}.`
        );
      }
    } else if (/Finance|Supply Chain/i.test(productKey)) {
      combinedNextSteps.push(
        "Genomför en fit-gap mot Finance & Supply Chain Management och bedöm samtidigt om delar av verksamheten skulle kunna lösas enklare i Business Central med relevanta tillägg."
      );
    } else if (/utvärderas|tidigt/i.test(productKey)) {
      combinedNextSteps.push(
        "Genomför en jämförande fit-gap där både Business Central (med eventuella tillägg) och Finance & Supply Chain Management värderas mot era prioriterade processer och datakrav."
      );
    }

    if (aiAnalysis?.nextSteps?.length) combinedNextSteps.push(...aiAnalysis.nextSteps);
    deterministicAiNextSteps.forEach(s => {
      if (!combinedNextSteps.some(x => x.toLowerCase().includes(s.toLowerCase().slice(0, 30)))) {
        combinedNextSteps.push(s);
      }
    });

    if (combinedNextSteps.length) {
      checkPage(30);
      addSectionHeader("REKOMMENDERADE NÄSTA STEG", 14, 124, 134);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(40, 40, 40);
      combinedNextSteps.forEach((step, i) => {
        checkPage(10);
        pdf.setFillColor(14, 124, 134);
        pdf.circle(margin + 2.5, yPos - 1.5, 1.2, "F");
        const lines = pdf.splitTextToSize(`${i + 1}. ${step}`, contentWidth - 10);
        pdf.text(lines, margin + 7, yPos);
        yPos += lines.length * 5.2 + 3;
      });
      yPos += 6;
    }




    // ── APPENDIX ─────────────────────────────────────────────────────────────
    pdf.addPage();
    yPos = margin;
    pdf.setFillColor(0, 143, 179);
    pdf.rect(0, 0, pageWidth, 24, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("BILAGA - DINA SVAR", margin, 16);
    yPos = 32;

    const addAppendixSection = (title: string, rows: [string, string][]) => {
      checkPage(14);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setFillColor(230, 242, 245);
      pdf.rect(margin, yPos - 4, contentWidth, 8, 'F');
      pdf.setTextColor(0, 100, 130);
      pdf.text(title, margin + 2, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      let shade = false;
      rows.forEach(([l, v]) => { addKVRow(l, v || "", shade); shade = !shade; });
      yPos += 3;
    };

    const c = data.complexity;
    const subLabel = data.businessModelSubs.length > 0 ? data.businessModelSubs.join(", ") : data.businessModelSub || "";

    const secondaryLabels = data.secondaryBusinessModels
      .map(v => businessModelOptions.find(o => o.value === v)?.label || v)
      .join(", ");

    addAppendixSection("Steg 1 - Verksamhetsmodell", [
      ["Verksamhetsmodell", bmLabel],
      ["Typ", subLabel],
      ["Sekundära modeller", secondaryLabels || "Inga"],
    ]);

    addAppendixSection("Steg 2 - Företagsstorlek", [
      ["Anställda", data.employees],
      ["Omsättning", data.revenue],
      ["Användare i affarssystemet", data.erpUsers || "Ej angivet"],
    ]);

    addAppendixSection("Steg 3 - Bransch", [
      ["Bransch", data.industry === "Annat" ? data.industryOther : data.industry],
    ]);

    // Helper to look up label across all complexity option groups
    const cxLabel = (key: keyof ComplexityData): string => {
      const val = c[key];
      if (!val) return "";
      const groups: Record<string, { value: string; label: string }[]> = {
        ...(complexityStructureOptions as any),
        ...(complexityMaturityOptions as any),
        ...(complexityConsultingOptions as any),
        ...(complexityRetailOptions as any),
      };
      return groups[key as string]?.find(o => o.value === val)?.label || val;
    };

    addAppendixSection("Steg 4 - Komplexitet (struktur)", [
      ["Juridiska enheter", cxLabel("legalEntities")],
      ["Antal länder", cxLabel("countries")],
      ["Internhandel", cxLabel("intercompany")],
      ["Konsolidering", cxLabel("consolidation")],
    ]);

    addAppendixSection("Steg 4 - Komplexitet (verksamhet)", [
      ["Produktionstyp", cxLabel("productionType")],
      ["Lagerstyrning", cxLabel("warehouseManagement")],
      ["Antal lager", cxLabel("warehouseCount")],
      ["MRP/APS-behov", cxLabel("mrpAps")],
      ["Transaktionsvolym", cxLabel("transactionVolume")],
    ]);

    addAppendixSection("Steg 4 - Komplexitet (IT-mognad)", [
      ["IT-organisation", cxLabel("itOrganization")],
      ["Integrationsplattform", cxLabel("integrationPlatform")],
      ["Governance-mognad", cxLabel("governance")],
      ["Global standardisering", cxLabel("globalStandardization")],
    ]);

    // Consulting-specific (only if any value set)
    const hasConsulting = c.simultaneousProjects || c.projectAccounting || c.globalDelivery || c.billingModels;
    if (hasConsulting) {
      addAppendixSection("Steg 4 - Komplexitet (konsult)", [
        ["Samtidiga projekt", cxLabel("simultaneousProjects")],
        ["Projektredovisning", cxLabel("projectAccounting")],
        ["Global leverans", cxLabel("globalDelivery")],
        ["Faktureringsmodeller", cxLabel("billingModels")],
      ]);
    }

    // Retail-specific (only if any value set)
    const hasRetail = c.storeCount || c.ecommercePlatform || c.posIntegration || c.realtimeInventory || c.campaignPricing;
    if (hasRetail) {
      addAppendixSection("Steg 4 - Komplexitet (retail)", [
        ["Antal butiker", cxLabel("storeCount")],
        ["E-handelsplattform", cxLabel("ecommercePlatform")],
        ["POS-integration", cxLabel("posIntegration")],
        ["Realtidslager", cxLabel("realtimeInventory")],
        ["Kampanj-/prisstyrning", cxLabel("campaignPricing")],
      ]);
    }

    addAppendixSection("Steg 5 - Geografi", [
      ["Geografi", data.geography],
      ["Specifika länder", data.geographyOther || ""],
    ]);

    const filledSystems = data.currentSystems.filter(s => s.product.trim());
    const systemsStr = filledSystems.map(s => s.year ? `${s.product} (${s.year})` : s.product).join(", ");
    const challengeEntries = Object.entries(data.situationChallenges).filter(([, v]) => v);
    const challengeStr = challengeEntries.map(([catId, val]) => {
      const cat = situationChallengeCategories.find(c => c.id === catId);
      return cat ? `${cat.title}: ${val}` : "";
    }).filter(Boolean).join("; ");

    addAppendixSection("Steg 6 - Nuvarande situation", [
      ["Nuvarande system", systemsStr],
      ["Övriga system", data.otherSystemsDetails || ""],
      ["Situation", data.currentSituationReason || ""],
      ["Utmaningar", challengeStr || ""],
      ["Beslutstidslinje", data.decisionTimeline || ""],
    ]);

    addAppendixSection("Steg 7 - Utmaningar & KPI:er", [
      ["Utmaningar", data.challenges.join(", ")],
      ["Utmaningar (annat)", data.challengesOther || ""],
      ["KPI:er", data.kpis.join(", ")],
      ["KPI:er (annat)", data.kpisOther || ""],
    ]);

    const filledIntegrations = data.integrationSystems.filter(s => s.system.trim());
    const integrationsStr = filledIntegrations.map(s => s.system).join(", ");

    const dqStr = Object.entries(data.aiDataQuality || {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("; ");
    const pmStr = Object.entries(data.aiProcessMaturity || {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("; ");

    addAppendixSection("Steg 8 - AI, automation och beslutsstöd", [
      ["AI-intresse", data.aiInterest],
      ["AI-mognadsnivå", aiMaturity.level],
      ["Ambitioner", data.aiAmbitions.join(", ")],
      ["Prioriterade use cases", data.aiUseCases.join(", ")],
      ["Datakvalitet", dqStr || "Ej angivet"],
      ["Dataproblem", data.aiDataIssues.join(", ") || "Ej angivet"],
      ["Processmognad", pmStr || "Ej angivet"],
      ["AI-governance", data.aiGovernance || "Ej angivet"],
      ["AI-risker", data.aiRisks.join(", ") || "Ej angivet"],
      ["AI - egna kommentarer", data.aiDetails || ""],
      ["Integrationer", integrationsStr],
    ]);


    // Övriga noteringar (free-text fields)
    const hasOvrigt = data.wishlist || data.additionalInfo;
    if (hasOvrigt) {
      addAppendixSection("Övriga noteringar", [
        ["Önskelista", data.wishlist || ""],
        ["Övrig information", data.additionalInfo || ""],
      ]);
    }

    // Footer
    checkPage(40);
    yPos += 10;
    pdf.setFillColor(0, 120, 108);
    pdf.roundedRect(margin, yPos, contentWidth, 32, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Dynamic Factory", margin + 8, yPos + 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Din köpar-sidiga guide till rätt Dynamics 365-lösning", margin + 8, yPos + 18);
    pdf.text("+46 72 232 40 60", pageWidth - margin - 55, yPos + 10);
    pdf.text("thomas.laine@dynamicfactory.se", pageWidth - margin - 55, yPos + 18);
    pdf.text("d365.se", pageWidth - margin - 55, yPos + 26);

    // Föreslagna partners – avslutande sida
    try {
      const _isBC = recommendation.product === "Business Central";
      const _productKey: ProductKey = _isBC ? "bc" : "fsc";
      const _industry = data.industry || null;
      const _suggested = pickSuggestedPartners(allPartners, { product: _productKey, industry: _industry, limit: 3 });
      const _origin = typeof window !== "undefined" ? window.location.origin : "https://d365.se";
      const _compareUrl = _origin + buildCompareUrl(_suggested.map(p => p.slug));
      appendSuggestedPartnersPage(pdf, _suggested.map(p => ({
        name: p.name, slug: p.slug,
        positioning: (p as any).positioning_statement, description: p.description,
      })), { compareUrl: _compareUrl, productLabel: _isBC ? "Business Central" : "Finance & Supply Chain", industry: _industry });
    } catch (e) { console.warn("Suggested partners append failed", e); }

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
            "Affärsmodell": `${data.businessModel}${data.businessModelSubs.length > 0 ? ` - ${data.businessModelSubs.join(", ")}` : data.businessModelSub ? ` - ${data.businessModelSub}` : ''}` || "Ej angivet",
            "Anställda": data.employees,
            "Omsättning": data.revenue,
            "Bransch": data.industry || "Ej angivet",
            "Geografi": data.geography || "Ej angivet",
            "Komplexitetsniva": `${complexity.complexityLevel} av 4`,
            "Risknivå": complexity.riskLevel,
            "Integrationer": integrationsStr || "Ej angivet",
            "Rekommendation": recommendation.outcome,
            "Säkerhet": recommendation.securityLevel,
          },
          recommendation: {
            product: recommendation.outcome,
            reasons: recommendation.reasons,
            isCloseCall: recommendation.isCloseCall,
            complexityLevel: complexity.complexityLevel,
            riskLevel: complexity.riskLevel,
          },
          pdfBase64: pdfBase64,
          pdfFilename: pdfFilename,
          aiAnalysis: aiAnalysis || undefined,
        },
      });

      if (error) {
        console.error("Error sending analysis email:", error);
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
      result.error.issues.forEach((err) => {
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
            <p className="text-muted-foreground">Hur skapar ni huvudsakligen intäkter och levererar värde till era kunder? Valet hjälper oss att förstå vilka processer som är mest affärskritiska i ett ERP-projekt.</p>
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
            {data.businessModel && (
              <div>
                <h3 className="text-lg font-semibold mb-1">Har ni betydande sekundära verksamhetsmodeller?</h3>
                <p className="text-sm text-muted-foreground mb-3">Valfritt – välj de som också utgör en väsentlig del av affären. Detta påverkar bedömningen av systemkomplexitet.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {businessModelOptions
                    .filter(o => o.value !== data.businessModel && o.value !== "Annat")
                    .map((option) => {
                      const isSelected = data.secondaryBusinessModels.includes(option.value);
                      return (
                        <SelectionCard
                          key={option.value}
                          label={option.label}
                          selected={isSelected}
                          onClick={() => {
                            const next = isSelected
                              ? data.secondaryBusinessModels.filter(v => v !== option.value)
                              : [...data.secondaryBusinessModels, option.value];
                            setData({ ...data, secondaryBusinessModels: next });
                          }}
                          type="checkbox"
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
            <div>
              <h3 className="text-lg font-semibold mb-1">Antal användare i affärssystemet</h3>
              <p className="text-sm text-muted-foreground mb-4">Ungefär hur många användare arbetar i eller nära affärssystemet?</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {erpUsersOptions.map((option) => (
                  <SelectionCard
                    key={option}
                    label={option}
                    selected={data.erpUsers === option}
                    onClick={() => setData({ ...data, erpUsers: option })}
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
                <div>
                  <Label className="text-sm font-medium mb-2 block">Antal valutor ni hanterar</Label>
                  {renderComplexityRadio("currencies", complexityStructureOptions.currencies)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Antal språk som systemet behöver stödja</Label>
                  {renderComplexityRadio("languages", complexityStructureOptions.languages)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">EDI-integration med kunder/leverantörer</Label>
                  {renderComplexityRadio("ediIntegration", complexityStructureOptions.ediIntegration)}
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Kvalitetshantering / regelefterlevnad</Label>
                  {renderComplexityRadio("qualityAssurance", complexityStructureOptions.qualityAssurance)}
                </div>
                {data.businessModel !== "Konsult" && !isServicesIndustry(data.industry) && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Batch- och spårbarhetskrav</Label>
                    {renderComplexityRadio("batchTraceability", complexityStructureOptions.batchTraceability)}
                  </div>
                )}
              </div>
            </div>

            {/* Block 2: Operativ komplexitet (40%) - adapts to business model */}
            <div className="border-2 border-primary/30 rounded-lg p-5 space-y-5 bg-primary/5">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Operativ komplexitet</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">Väger tyngst</span>
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
                        <div className="bg-muted border-b-2 border-border">
                          <div className="p-3 font-medium text-sm">Applikation / Systemnamn</div>
                        </div>
                        {data.integrationSystems.map((integration, index) => (
                          <div key={index} className={`${index < data.integrationSystems.length - 1 ? 'border-b-2 border-border' : ''}`}>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      {category.items
                        .filter((item) => !(isServicesIndustry(data.industry) && /lager|inköp, order/i.test(item)))
                        .map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {situationChallengeOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSituationChallengeChange(category.id, option)}
                          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                            data.situationChallenges[category.id] === option
                              ? "bg-primary text-primary-foreground "
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
        const decisionTimelineOptions = [
          { value: "Under kommande halvår", label: "Under kommande halvår" },
          { value: "Inom 6-12 månader", label: "Inom 6-12 månader" },
          { value: "Under nästa 12-24 månader", label: "Under nästa 12-24 månader" },
          { value: "Inga planer just nu", label: "Inga planer just nu" },
        ];
        const aiInterestOptions = [
          { value: "Mycket intresserade", label: "Mycket intresserade - Vi vill vara i framkant" },
          { value: "Ganska intresserade", label: "Ganska intresserade - Vi vill utforska möjligheterna" },
          { value: "Avvaktande", label: "Avvaktande - Vi vill se konkreta användningsfall först" },
        ];
        const pillBtn = (selected: boolean) =>
          `px-3 py-1.5 rounded text-xs font-medium transition-all border ${
            selected
              ? "bg-primary text-primary-foreground border-primary "
              : "bg-muted text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
          }`;
        return (
          <div className="space-y-8">
            <p className="text-muted-foreground">
              AI kan skapa stor nytta i ERP-processer, men värdet beror på tydliga mål, bra data, fungerande processer och rätt systemarkitektur. Svara på frågorna nedan för att bedöma var AI kan ge mest nytta och vad som behöver vara på plats först.
            </p>

            {/* Översiktligt intresse */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Hur intresserade är ni av AI i affärssystemet?</h3>
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

            {/* Fråga 1 - Ambitioner */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Vad vill ni främst uppnå med AI och automation?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Tänk på det affärsmässiga målet – inte tekniken. Vill ni kapa tid i repetitiva flöden,
                få bättre beslutsunderlag, höja servicekvaliteten eller helt enkelt börja förstå vad
                AI kan göra för er? Det går bra att välja flera; era svar styr hur Copilot- och
                agentscenarier prioriteras längre fram. <em>Flera val möjliga.</em>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiAmbitionOptions.map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.aiAmbitions.includes(opt)}
                    onClick={() => handleCheckboxChange("aiAmbitions", opt)}
                  />
                ))}
              </div>
            </div>

            {/* Fråga 2 - Prioriterade AI-use cases (grupperade) */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Vilka AI-områden är mest intressanta för er?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Områdena är grupperade per funktion i Dynamics 365 – från Ekonomi och Supply chain till
                Marknad, Service och de nya <strong>Copilot</strong>- och <strong>autonoma agenter</strong> som
                Microsoft släpper. Välj allt som ni redan idag ser ett konkret behov av, eller som ni vill
                utforska närmare. Det är okej att kryssa brett – syftet är att fånga intresse, inte att
                lova en investering. <em>Flera val möjliga.</em>
              </p>
              <div className="space-y-5">
                {aiUseCaseDomains.map((g) => (
                  <div key={g.domain}>
                    <h4 className="font-semibold text-sm mb-2 text-foreground/90">{g.domain}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {g.items.map((it) => (
                        <SelectionCard
                          key={it}
                          label={it}
                          selected={data.aiUseCases.includes(it)}
                          onClick={() => handleCheckboxChange("aiUseCases", it)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fråga 3 - Datamognad */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Hur bedömer ni kvaliteten på er data idag?</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Bedöm varje område utifrån fyra kriterier: <strong>komplett</strong> (inga viktiga fält saknas),
                <strong> korrekt</strong> (stämmer med verkligheten), <strong>uppdaterad</strong> (aktuell, inte gammal)
                och <strong>fri från dubbletter</strong> (ingen post finns flera gånger). AI och Copilot blir bara
                så bra som datan de bygger på – därför vill vi få en ärlig bild av nuläget.
              </p>
              <div className="text-xs text-muted-foreground mb-3 space-y-0.5">
                <div><strong>Bra</strong> – mestadels komplett, korrekt och uppdaterad. Få dubbletter.</div>
                <div><strong>Blandad</strong> – fungerar i vardagen men har kända luckor, fel eller dubbletter.</div>
                <div><strong>Bristfällig</strong> – stora luckor, mycket manuell rättning eller låg tilltro till datan.</div>
                <div><strong>Vet ej</strong> – området finns men ni har inte överblick över kvaliteten.</div>
              </div>
              <div className="space-y-3">
                {aiDataAreas.map((area) => (
                  <div key={area} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg border border-border/60 bg-card">
                    <span className="text-sm font-medium">{area}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiDataQualityScale.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => updateAiDataQuality(area, v)}
                          className={pillBtn(data.aiDataQuality[area] === v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <h4 className="font-semibold text-sm mb-1">Vilka dataproblem upplever ni idag?</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Det här handlar inte om perfektion – de flesta verksamheter har någon form av dataskuld.
                  Markera de problem som ni känner igen er i. Bilden hjälper oss att förstå vilka
                  AI-scenarier som är realistiska att börja med och vilka som först kräver lite städning
                  i grunddatan. <em>Flera val möjliga.</em>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiDataIssueOptions.map((opt) => (
                    <SelectionCard
                      key={opt}
                      label={opt}
                      selected={data.aiDataIssues.includes(opt)}
                      onClick={() => handleCheckboxChange("aiDataIssues", opt)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Fråga 4 - Processmognad */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Hur mogna är era processer för AI och automation?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Bedöm hur väl varje påstående stämmer för er idag. Alla påståenden är formulerade så att
                <strong> "Stämmer helt" är den starkaste utgångspunkten för AI och automation</strong> – inga "trick"-frågor.
              </p>
              <div className="space-y-3">
                {aiProcessAreas.map((area) => (
                  <div key={area} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg border border-border/60 bg-card">
                    <span className="text-sm font-medium">{area}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiProcessScale.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => updateAiProcessMaturity(area, v)}
                          className={pillBtn(data.aiProcessMaturity[area] === v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fråga 5 - Governance & risk */}
            <div>
              <h3 className="text-lg font-semibold mb-1">Finns riktlinjer eller krav kopplade till AI-användning?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Många organisationer har ännu inte landat sin AI-policy. Vi vill veta var ni står idag
                – inte för att döma, utan för att kunna föreslå en lagom ambitionsnivå för governance,
                säkerhet och regelefterlevnad (t.ex. EU AI Act, GDPR, branschkrav).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiGovernanceOptions.map((opt) => (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={data.aiGovernance === opt}
                    onClick={() => setData({ ...data, aiGovernance: opt })}
                    type="radio"
                  />
                ))}
              </div>
              <div className="mt-5">
                <h4 className="font-semibold text-sm mb-1">Vilka AI-risker eller frågor behöver hanteras?</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  AI öppnar nya möjligheter – men också nya frågor kring datasäkerhet, sekretess,
                  ansvarsfördelning och hur medarbetare uppfattar förändringen. Markera de områden ni
                  redan vet att ni behöver hantera, eller där ni vill ha extra stöd från en partner.
                  <em> Flera val möjliga.</em>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aiRiskOptions.map((opt) => (
                    <SelectionCard
                      key={opt}
                      label={opt}
                      selected={data.aiRisks.includes(opt)}
                      onClick={() => handleCheckboxChange("aiRisks", opt)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Fri kommentar */}
            <div>
              <Label htmlFor="aiDetails">Egna kommentarer om AI i er verksamhet (valfritt)</Label>
              <Textarea
                id="aiDetails"
                placeholder="Beskriv era tankar, hinder eller önskemål kring AI..."
                value={data.aiDetails}
                onChange={(e) => setData({ ...data, aiDetails: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Beslutstidslinje */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Var skulle du säga att ni ligger i beslutsprocessen?</h3>
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
            <div className="border rounded overflow-hidden ">
              <div className="bg-blue-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">📄 Sammanfattning</h3>
              </div>
              <div className="p-5 bg-background grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Verksamhetsmodell", value: bmLabel },
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
            <div className="border rounded overflow-hidden ">
              <div className="bg-emerald-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">🟩 ERP-komplexitetsnivå</h3>
              </div>
              <div className="p-5 bg-background space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Bedömd ERP-komplexitet</p>
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
            <div className="border rounded overflow-hidden ">
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
                        <span key={f} className="text-xs bg-finance-supply/10 border border-finance-supply/20 text-finance-supply rounded px-3 py-1">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Styrkor + Utvecklingsområden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded overflow-hidden ">
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
              <div className="border rounded overflow-hidden ">
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
            <div className="border rounded p-5 space-y-4 bg-background ">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded bg-finance-supply text-finance-supply-foreground text-xs flex items-center justify-center font-bold">1</span>
                Preliminär systemindikation
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
            <div className="border rounded p-5 space-y-4 bg-background ">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded bg-finance-supply text-finance-supply-foreground text-xs flex items-center justify-center font-bold">2</span>
                Preliminär systemindikation
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
                  Indikationen bygger främst på
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold border bg-finance-supply/10 border-finance-supply/30 text-finance-supply`}>
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
            <div className="border rounded p-5 space-y-3 bg-background ">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-base">
                <span className="w-6 h-6 rounded bg-finance-supply text-finance-supply-foreground text-xs flex items-center justify-center font-bold">3</span>
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

            <div className="border border-[hsl(var(--line-dark))] rounded overflow-hidden print:hidden">
              <div className="bg-[hsl(var(--hero-dark))] px-5 py-4 text-white">
                <h3 className="font-bold text-white flex items-center gap-2 text-base">
                  <Download className="w-5 h-5 text-[hsl(var(--cta-orange))]" />
                  Skicka PDF till min e-post
                </h3>
                <p className="text-sm text-white/75 mt-1">Fyll i dina kontaktuppgifter så skickar vi PDF-rapporten till din e-post.</p>
              </div>
              <div className="p-5 bg-background space-y-4">
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
                    <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer select-none pt-1">
                      <input
                        type="checkbox"
                        checked={data.consentToContact}
                        onChange={(e) => setData({ ...data, consentToContact: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-border accent-finance-supply"
                      />
                      <span>Jag godkänner att d365.se får kontakta mig kring analysen.</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        onClick={generateDocument}
                        disabled={!isContactFormValid() || isSendingEmail}
                        className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isSendingEmail ? "Skickar..." : "Skicka PDF till min e-post"}
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
        <main className="flex-grow pt-28 pb-12">
  
      <ShortAnswer title="Vad är en behovsanalys för ERP">
        En ERP-behovsanalys hjälper er klargöra vilka processer, integrationer och rapporter ert affärssystem ska stötta – innan ni pratar med leverantörer. Vår kostnadsfria analys ger en köparsidig rekommendation av lämplig D365-inriktning (Business Central eller Finance & Supply Chain Management) baserat på bransch, storlek och komplexitet.
      </ShortAnswer>

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
                            <span className={`w-2 h-2 rounded mt-2 flex-shrink-0 ${isBC ? 'bg-business-central' : 'bg-finance-supply'}`} />
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
                    <a href={isBC ? "/businesscentral" : "/finance-supply-chain"}>
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
                  <div className="w-10 h-10 bg-finance-supply rounded flex items-center justify-center flex-shrink-0">
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

            {/* FÖRESLAGNA PARTNERS */}
            <SuggestedPartnersCTA
              product={isBC ? "bc" : "fsc"}
              industry={data.industry || null}
              className="!py-8 mb-8 border rounded overflow-hidden !bg-secondary/40"
            />

            {/* Actions */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setData(initialData);
                  setCurrentStep(1);
                  setIsComplete(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
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
        title="Behovsanalys ERP – Business Central eller F&SCM"
        description="Kostnadsfri ERP-behovsanalys på 5 minuter: svar på frågor om verksamhet och processer ger rekommendation av Business Central eller Finance & Supply Chain."
        canonicalPath="/ERPbehovsanalys"
        keywords="ERP behovsanalys, Dynamics 365, Business Central, Finance Supply Chain, affärssystem, kravspecifikation"
        ogImage="https://d365.se/og-behovsanalys.png"
      />
      <ServiceSchema 
        name="ERP Behovsanalys"
        description="Kostnadsfri behovsanalys för att hitta rätt Microsoft Dynamics 365 ERP-lösning för din verksamhet. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
      />
      <BreadcrumbSchema items={needsAnalysisBreadcrumbs} />
      <SoftwareApplicationSchema
        name="Behovsanalys ERP"
        description="Webbaserat verktyg som kartlägger verksamhetens ERP-behov och ger en rekommendation mellan Microsoft Dynamics 365 Business Central och Finance & Supply Chain Management."
        url="https://d365.se/ERPbehovsanalys"
      />
      <Navbar />
      
      <main className="flex-grow pb-12">
        <div className="relative bg-cover bg-center pt-36 pb-10 mb-8" style={{ backgroundImage: `url(${heroBehovsanalysErp})` }}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Ringa in behovet – innan partnerdialogen börjar
            </h1>
            <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              En strukturerad behovsanalys för ERP/affärssystem som ger er ett systemneutralt underlag att jämföra partners och offerter på lika villkor.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">
                Steg {currentStep} av {totalSteps}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[hsl(var(--cta-orange))]">
                  {Math.round(progress)}%
                </span>
                <Button onClick={handleNext} size="sm" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                  Nästa
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName="bg-[hsl(var(--cta-orange))]" />
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[hsl(var(--cta-orange))] text-white"
                      : isCompleted
                      ? "bg-[hsl(var(--cta-orange))]/20 text-[hsl(var(--cta-orange))]"
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
                  return <Icon className="w-5 h-5 text-[hsl(var(--cta-orange))]" />;
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
                  <Button onClick={handleNext} className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                    Nästa
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RelatedPages heading="Fortsätt utvärdera ert ERP" pages={needsAnalysisErpRelatedPages} />
      <Footer />
    </div>
  );
};

export default NeedsAnalysis;
