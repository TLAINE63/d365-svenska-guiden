import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  AlertTriangle,
  Rocket,
  Target,
  Brain,
  Download,
  Monitor,
  Users,
  TrendingUp,
  BarChart3,
  Briefcase,
  Truck,
  Settings,
  Megaphone,
  Calculator,
  FolderKanban,
  Shield,
  Zap,
  Factory,
  Headphones,
  Lightbulb,
  Sparkles,
  Bot,
  Eye,
  Activity,
  DollarSign,
  Clock,
  Percent,
} from "lucide-react";
import SelectionCard from "@/components/SelectionCard";
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ─── TYPES ───────────────────────────────────────────────

type RoleId = "it" | "sales" | "marketing" | "finance" | "project" | "logistics" | "production" | "customer_service";
type IndexId = "automation" | "augmentation" | "prediction" | "governance";
type ProfileId = "exploring" | "structurally_ready" | "scaling";
type SystemTrack = "optimization" | "transformation" | "strategy";

interface FoundationAnswers {
  system: string;
  industry: string;
  headcount: string;
  repetitive: string;
  gut_decisions: string;
  decision_time: string;
  anomaly_speed: string;
}

interface IndexedQuestion {
  id: string;
  question: string;
  index: IndexId;
  options: { label: string; score: number }[];
}

interface AIResult {
  label: string;
  labelEn: string;
  description: string;
  d365Context: string;
}

interface RoleTrack {
  id: RoleId;
  label: string;
  emoji: string;
  icon: typeof Settings;
  color: string;
  headerBg: string;
  measures: string;
  questions: IndexedQuestion[];
  aiResults: AIResult[];
  risks: { condition: (scores: IndexScores) => boolean; text: string }[];
  timeSavingsRange: string;
  forecastImprovement: string;
  riskReduction: string;
}

interface IndexScores {
  automation: number;
  augmentation: number;
  prediction: number;
  governance: number;
}

// ─── SYSTEM TRACK LOGIC ─────────────────────────────────

function getSystemTrack(system: string): SystemTrack {
  if (system === "Dynamics 365") return "optimization";
  if (system === "Oklart / blandat") return "strategy";
  return "transformation";
}

const systemTrackData: Record<SystemTrack, { label: string; emoji: string; color: string; description: string; recommendation: string }> = {
  optimization: {
    label: "Optimeringsspår",
    emoji: "🟢",
    color: "text-emerald-600",
    description: "Ni använder redan en plattform med inbyggd AI-kapacitet. Nästa steg är att aktivera och strukturera nyttjandet – inte att byta system, utan att maximera värdet ur er nuvarande investering.",
    recommendation: "Fokusera på att aktivera Copilot och AI-agenter inom er befintliga Dynamics 365-miljö. Prioritera de funktioner som ger snabbast ROI baserat på er rollanalys.",
  },
  transformation: {
    label: "Transformationsspår",
    emoji: "🔄",
    color: "text-blue-600",
    description: "För att realisera den AI-nivå analysen pekar mot krävs en strukturerad CRM/ERP-plattform med centraliserad data och inbyggt AI-stöd. Plattformar som Microsoft Dynamics 365 är designade för just detta.",
    recommendation: "Utvärdera moderna affärssystem med inbyggda AI-kapabiliteter. En plattform med integrerat AI-stöd eliminerar behovet av separata AI-verktyg och ger snabbare tid till värde.",
  },
  strategy: {
    label: "Strategispår",
    emoji: "🧭",
    color: "text-purple-600",
    description: "Systemsituationen är oklar, vilket ofta indikerar att en strategisk kartläggning behövs innan AI-initiativ startas. Rätt beslut nu sparar betydande tid och resurser längre fram.",
    recommendation: "Börja med att kartlägga det nuvarande systemlandskapet och identifiera var AI kan ge störst effekt. En kvalificerad partner kan hjälpa er navigera alternativen.",
  },
};

// ─── INDUSTRY OPTIONS ────────────────────────────────────

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

const headcountOptions = [
  { label: "1–49 anställda", score: 1 },
  { label: "50–249 anställda", score: 2 },
  { label: "250–999 anställda", score: 3 },
  { label: "1 000+ anställda", score: 3 },
];

// ─── FOUNDATION QUESTIONS (AI-focused) ──────────────────

interface FoundationQuestion {
  id: keyof FoundationAnswers;
  question: string;
  index: IndexId | null;
  options: { label: string; score: number }[];
}

const foundationQuestions: FoundationQuestion[] = [
  {
    id: "system",
    question: "Vilket/vilka CRM- och ERP/Affärssystem använder ni idag?",
    index: null,
    options: [
      { label: "Dynamics 365", score: 3 },
      { label: "Annat ERP/CRM", score: 2 },
      { label: "Flera system", score: 1 },
      { label: "Oklart / blandat", score: 0 },
    ],
  },
  {
    id: "industry",
    question: "Vilken bransch verkar ni inom?",
    index: null,
    options: industryOptions.map((i) => ({ label: i, score: 0 })),
  },
  {
    id: "headcount",
    question: "Hur många anställda har organisationen?",
    index: null,
    options: headcountOptions,
  },
  {
    id: "repetitive",
    question: "Hur stor andel av ert dagliga arbete är repetitivt och regelstyrt?",
    index: "automation",
    options: [
      { label: "Under 20%", score: 1 },
      { label: "20–50%", score: 2 },
      { label: "Över 50%", score: 3 },
    ],
  },
  {
    id: "gut_decisions",
    question: "Hur ofta fattas beslut baserat på magkänsla snarare än data?",
    index: "augmentation",
    options: [
      { label: "Sällan – data styr", score: 1 },
      { label: "Ibland – blandat", score: 2 },
      { label: "Ofta – magkänsla dominerar", score: 3 },
    ],
  },
  {
    id: "decision_time",
    question: "Hur lång tid tar det att sammanställa underlag inför beslut?",
    index: "augmentation",
    options: [
      { label: "Realtid / minuter", score: 1 },
      { label: "Några timmar", score: 2 },
      { label: "Flera dagar", score: 3 },
    ],
  },
  {
    id: "anomaly_speed",
    question: "Hur snabbt upptäcks avvikelser eller risker i verksamheten?",
    index: "prediction",
    options: [
      { label: "Omedelbart via systemlarm", score: 1 },
      { label: "Efter rapport eller granskning", score: 2 },
      { label: "Ofta för sent", score: 3 },
    ],
  },
];

// ─── ROLE TRACKS (AI-spetsade) ──────────────────────────

const roleTracks: RoleTrack[] = [
  {
    id: "sales",
    label: "Försäljning",
    emoji: "🟢",
    icon: TrendingUp,
    color: "text-green-600",
    headerBg: "bg-green-600",
    measures: "Prediktiv precision · Administrativ belastning · Kundinsikt",
    timeSavingsRange: "15–30%",
    forecastImprovement: "10–25%",
    riskReduction: "Minskad churn-risk",
    questions: [
      { id: "sales_forecast", question: "Hur exakt är era säljprognoser (± avvikelse)?", index: "prediction", options: [{ label: "Inom ±10%", score: 1 }, { label: "Inom ±25%", score: 2 }, { label: "Över ±25% eller ingen prognos", score: 3 }] },
      { id: "sales_admin", question: "Hur mycket tid lägger säljare på CRM-administration per vecka?", index: "automation", options: [{ label: "Under 2 timmar", score: 1 }, { label: "2–5 timmar", score: 2 }, { label: "Över 5 timmar", score: 3 }] },
      { id: "sales_pipeline", question: "Uppdateras pipeline i realtid?", index: "augmentation", options: [{ label: "Ja, automatiserat", score: 1 }, { label: "Delvis, varierar mellan säljare", score: 2 }, { label: "Nej, sporadiskt", score: 3 }] },
      { id: "sales_churn", question: "Kan ni identifiera vilka affärer som sannolikt faller bort?", index: "prediction", options: [{ label: "Ja, med datadrivna varningar", score: 1 }, { label: "Delvis, erfarenhetsbaserat", score: 2 }, { label: "Nej, det överraskar oss", score: 3 }] },
      { id: "sales_nba", question: "Får säljare automatiska rekommendationer om nästa steg?", index: "augmentation", options: [{ label: "Ja, AI-drivna förslag", score: 1 }, { label: "Viss vägledning via playbooks", score: 2 }, { label: "Nej, helt manuellt", score: 3 }] },
    ],
    aiResults: [
      { label: "Lead Scoring Potential", labelEn: "Lead Scoring", description: "AI rangordnar leads baserat på köpsannolikhet och historik", d365Context: "Inbyggt i Dynamics 365 Sales via Copilot" },
      { label: "Forecast AI Potential", labelEn: "Forecast AI", description: "Pipeline-prognoser baserade på data istället för magkänsla", d365Context: "Prediktiv prognos är en inbyggd funktion i Dynamics 365 Sales" },
      { label: "Conversational AI Potential", labelEn: "Conversational AI", description: "Automatisk mötessammanfattning och CRM-uppdatering", d365Context: "Copilot i Dynamics 365 sammanfattar möten och uppdaterar CRM automatiskt" },
    ],
    risks: [
      { condition: (s) => s.prediction < 40, text: "Bristande prognosdata begränsar AI:s prediktiva förmåga i pipeline" },
      { condition: (s) => s.augmentation < 40, text: "Manuell pipeline-hantering gör det svårt att implementera beslutsstöd" },
      { condition: (s) => s.governance < 40, text: "Avsaknad av AI-governance riskerar okontrollerad AI-användning i säljprocessen" },
    ],
  },
  {
    id: "finance",
    label: "Ekonomi",
    emoji: "🟡",
    icon: Calculator,
    color: "text-yellow-600",
    headerBg: "bg-yellow-600",
    measures: "Transaktionsvolym · Avvikelsefrekvens · Prognosprecision",
    timeSavingsRange: "20–40%",
    forecastImprovement: "15–30%",
    riskReduction: "Minskad felfrekvens",
    questions: [
      { id: "fin_volume", question: "Hur många manuella verifikationer hanteras per månad?", index: "automation", options: [{ label: "Under 100", score: 1 }, { label: "100–500", score: 2 }, { label: "Över 500", score: 3 }] },
      { id: "fin_errors", question: "Hur ofta upptäcks fel efter bokslut?", index: "prediction", options: [{ label: "Sällan, systemkontroller fångar det", score: 1 }, { label: "Ibland, vid stickprov", score: 2 }, { label: "Regelbundet", score: 3 }] },
      { id: "fin_cashflow", question: "Hur exakt är kassaflödesprognosen?", index: "prediction", options: [{ label: "Hög precision, löpande uppdaterad", score: 1 }, { label: "Rimlig, kvartalsvis", score: 2 }, { label: "Svag eller saknas", score: 3 }] },
      { id: "fin_matching", question: "Matchas leverantörsfakturor automatiskt?", index: "automation", options: [{ label: "Ja, automatiserat", score: 1 }, { label: "Delvis", score: 2 }, { label: "Nej, manuellt", score: 3 }] },
      { id: "fin_anomaly", question: "Identifieras ovanliga transaktioner systematiskt?", index: "augmentation", options: [{ label: "Ja, med automatiska larm", score: 1 }, { label: "Delvis, via rapporter", score: 2 }, { label: "Nej, manuellt", score: 3 }] },
    ],
    aiResults: [
      { label: "Anomaly Detection Potential", labelEn: "Anomaly Detection", description: "AI upptäcker anomalier i transaktioner automatiskt", d365Context: "Inbyggd avvikelsedetektering via Copilot i Dynamics 365 Finance" },
      { label: "Predictive Cashflow Potential", labelEn: "Predictive Cashflow", description: "Realtidsprognoser baserade på historik och mönster", d365Context: "Cash flow forecasting är en inbyggd AI-funktion i Dynamics 365 Finance" },
      { label: "Close Automation Potential", labelEn: "Close Automation", description: "Autonoma agenter som assisterar vid periodavslut", d365Context: "AI-agenter i Finance kan automatisera delar av bokslutsprocessen" },
    ],
    risks: [
      { condition: (s) => s.automation < 40, text: "Manuella transaktionsprocesser begränsar möjligheten till AI-automatisering" },
      { condition: (s) => s.prediction < 40, text: "Svag prognosförmåga gör det svårt att utnyttja prediktiv AI för kassaflöde" },
      { condition: (s) => s.augmentation < 40, text: "Utan systematisk avvikelsehantering saknas datagrund för AI-detektering" },
    ],
  },
  {
    id: "it",
    label: "IT",
    emoji: "🔵",
    icon: Monitor,
    color: "text-blue-600",
    headerBg: "bg-blue-600",
    measures: "AI Governance · Infrastruktur · Datakontroll",
    timeSavingsRange: "10–25%",
    forecastImprovement: "N/A",
    riskReduction: "Minskad säkerhetsrisk",
    questions: [
      { id: "it_policy", question: "Har ni definierat en AI-policy?", index: "governance", options: [{ label: "Ja, formaliserad och kommunicerad", score: 1 }, { label: "Under utveckling", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "it_logging", question: "Loggas AI-genererade beslut och rekommendationer?", index: "governance", options: [{ label: "Ja, systematiskt", score: 1 }, { label: "Delvis", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "it_classified", question: "Är er data klassificerad (känslig, intern, publik)?", index: "augmentation", options: [{ label: "Ja, fullständig klassificering", score: 1 }, { label: "Delvis", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "it_platform", question: "Finns en central dataplattform?", index: "automation", options: [{ label: "Ja, med enhetlig datamodell", score: 1 }, { label: "Delvis centraliserad", score: 2 }, { label: "Silobaserad", score: 3 }] },
      { id: "it_sandbox", question: "Har ni testmiljö för AI-initiativ?", index: "automation", options: [{ label: "Ja, dedikerad sandbox", score: 1 }, { label: "Delvis", score: 2 }, { label: "Nej", score: 3 }] },
    ],
    aiResults: [
      { label: "Responsible AI Readiness", labelEn: "Responsible AI", description: "Strukturerat ramverk för ansvarsfull AI-användning", d365Context: "Microsoft Responsible AI-ramverket är integrerat i plattformen" },
      { label: "Integration AI Readiness", labelEn: "Integration AI", description: "Automatisera systemintegrationer och dataflöden med AI", d365Context: "Power Platform och Dataverse ger en enhetlig datamodell" },
      { label: "Scalable AI Infrastructure", labelEn: "Scalable AI Infra", description: "Säker miljö för att testa och validera AI-initiativ", d365Context: "Sandbox-miljöer och Power Platform ger en trygg experimentyta" },
    ],
    risks: [
      { condition: (s) => s.governance < 40, text: "Avsaknad av AI-policy ökar risk för okontrollerade initiativ" },
      { condition: (s) => s.automation < 40, text: "Silobaserad data begränsar AI:s förmåga att ge insikter tvärs system" },
      { condition: (s) => s.augmentation < 40, text: "Oklassificerad data ökar säkerhetsrisken vid AI-implementation" },
    ],
  },
  {
    id: "marketing",
    label: "Marknad",
    emoji: "🟣",
    icon: Megaphone,
    color: "text-purple-600",
    headerBg: "bg-purple-600",
    measures: "Personalisering · Kampanjoptimering · Innehållsproduktion",
    timeSavingsRange: "15–35%",
    forecastImprovement: "10–20%",
    riskReduction: "Minskad churn-risk",
    questions: [
      { id: "mkt_segment", question: "Segmenteras kunder dynamiskt baserat på beteende?", index: "prediction", options: [{ label: "Ja, dynamiska AI-segment", score: 1 }, { label: "Manuella segment", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "mkt_ai_content", question: "Används AI för innehållsgenerering?", index: "automation", options: [{ label: "Ja, i produktionen", score: 1 }, { label: "Testar", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "mkt_predict", question: "Predikteras kampanjutfall innan lansering?", index: "prediction", options: [{ label: "Ja, med datamodeller", score: 1 }, { label: "Baserat på erfarenhet", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "mkt_churn", question: "Identifieras churn-risk hos kunder?", index: "augmentation", options: [{ label: "Ja, med prediktiv analys", score: 1 }, { label: "Delvis, via manuella signaler", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "mkt_crm", question: "Är data från CRM och marketing integrerad?", index: "augmentation", options: [{ label: "Ja, sömlöst", score: 1 }, { label: "Delvis, manuell synk", score: 2 }, { label: "Nej, separata system", score: 3 }] },
    ],
    aiResults: [
      { label: "Personalization AI Potential", labelEn: "Personalization AI", description: "Individuellt anpassade budskap i stor skala", d365Context: "Customer Insights möjliggör personalisering via journey orchestration" },
      { label: "Content AI Leverage", labelEn: "Content AI", description: "AI skapar anpassat innehåll per segment och kanal", d365Context: "Copilot i Customer Insights genererar segmentanpassade budskap" },
      { label: "Predictive Marketing Potential", labelEn: "Predictive Marketing", description: "AI optimerar budget och kanalval i realtid", d365Context: "Customer Insights erbjuder prediktiv analys av kampanjeffekt" },
    ],
    risks: [
      { condition: (s) => s.augmentation < 40, text: "Fragmenterad kunddata gör segmentering och personalisering opålitlig" },
      { condition: (s) => s.automation < 40, text: "Utan AI-stödd innehållsproduktion begränsas skalbarheten" },
      { condition: (s) => s.prediction < 40, text: "Utan prediktiv analys optimeras kampanjer reaktivt istället för proaktivt" },
    ],
  },
  {
    id: "project",
    label: "Projekt",
    emoji: "🟠",
    icon: FolderKanban,
    color: "text-orange-600",
    headerBg: "bg-orange-600",
    measures: "Resursoptimering · Riskidentifiering · Prognosprecision",
    timeSavingsRange: "10–25%",
    forecastImprovement: "15–30%",
    riskReduction: "Minskad marginalavvikelse",
    questions: [
      { id: "proj_margin", question: "Hur ofta avviker projektmarginaler från prognos?", index: "prediction", options: [{ label: "Sällan (under 10%)", score: 1 }, { label: "Ibland (10–25%)", score: 2 }, { label: "Ofta (över 25%)", score: 3 }] },
      { id: "proj_delays", question: "Upptäcks förseningar proaktivt eller reaktivt?", index: "prediction", options: [{ label: "Proaktivt med tidiga varningar", score: 1 }, { label: "Vid milstolpar", score: 2 }, { label: "Reaktivt, ofta för sent", score: 3 }] },
      { id: "proj_overalloc", question: "Är resurser ofta över- eller underallokerade?", index: "automation", options: [{ label: "Sällan, optimerad allokering", score: 1 }, { label: "Viss obalans", score: 2 }, { label: "Stor obalans", score: 3 }] },
      { id: "proj_realtime", question: "Spåras projektlönsamhet i realtid?", index: "augmentation", options: [{ label: "Ja, per projekt i realtid", score: 1 }, { label: "Ja, men manuellt/veckovis", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "proj_status", question: "Sammanställs statusrapporter manuellt?", index: "automation", options: [{ label: "Nej, automatiserat", score: 1 }, { label: "Delvis automatiserat", score: 2 }, { label: "Ja, helt manuellt", score: 3 }] },
    ],
    aiResults: [
      { label: "Risk Prediction Potential", labelEn: "Risk Prediction", description: "AI identifierar riskprojekt innan de spårar ur", d365Context: "Dynamics 365 Project Operations erbjuder AI-driven riskanalys" },
      { label: "Resource Optimization Potential", labelEn: "Resource Optimization", description: "Intelligent allokering baserat på kompetens och kapacitet", d365Context: "Resursschemaläggning med AI-stöd finns i Project Operations" },
    ],
    risks: [
      { condition: (s) => s.prediction < 40, text: "Bristande prognosprecision gör prediktiv projektanalys opålitlig" },
      { condition: (s) => s.automation < 40, text: "Manuella statusrapporter och allokeringsprocesser begränsar AI-effekt" },
      { condition: (s) => s.augmentation < 40, text: "Utan realtidsdata saknas grund för AI-drivet beslutsstöd" },
    ],
  },
  {
    id: "logistics",
    label: "Logistik / Supply Chain",
    emoji: "🔵",
    icon: Truck,
    color: "text-cyan-600",
    headerBg: "bg-cyan-600",
    measures: "Efterfrågevariation · Lagerbindning · Leveransprecision",
    timeSavingsRange: "15–30%",
    forecastImprovement: "20–40%",
    riskReduction: "Minskad lagerbindning",
    questions: [
      { id: "log_forecast_err", question: "Hur stor är avvikelsen i era efterfrågeprognoser?", index: "prediction", options: [{ label: "Under 10%", score: 1 }, { label: "10–25%", score: 2 }, { label: "Över 25% eller ingen prognos", score: 3 }] },
      { id: "log_overstock", question: "Uppstår ofta överlager?", index: "automation", options: [{ label: "Sällan, proaktiv styrning", score: 1 }, { label: "Ibland", score: 2 }, { label: "Regelbundet", score: 3 }] },
      { id: "log_late", question: "Hur ofta drabbas ni av sena leveranser?", index: "prediction", options: [{ label: "Under 5% av leveranser", score: 1 }, { label: "5–15%", score: 2 }, { label: "Över 15%", score: 3 }] },
      { id: "log_anomaly", question: "Hanteras avvikelser i leveranskedjan manuellt?", index: "augmentation", options: [{ label: "Nej, automatiserade larm", score: 1 }, { label: "Delvis", score: 2 }, { label: "Ja, helt manuellt", score: 3 }] },
      { id: "log_history", question: "Finns strukturerad historisk efterfrågedata (2+ år)?", index: "prediction", options: [{ label: "Ja, kvalitetssäkrad", score: 1 }, { label: "Ja, men ofullständig", score: 2 }, { label: "Begränsat", score: 3 }] },
    ],
    aiResults: [
      { label: "Demand Forecast AI Potential", labelEn: "Demand Forecast AI", description: "AI-drivna prognoser baserade på historik och externa signaler", d365Context: "Demand forecasting är inbyggt i Dynamics 365 Supply Chain Management" },
      { label: "Inventory Optimization Potential", labelEn: "Inventory Optimization", description: "Automatiserad beställningspunktsberäkning och säkerhetslager", d365Context: "AI-driven lageroptimering finns i Supply Chain Management" },
      { label: "Disruption Prediction Potential", labelEn: "Disruption Prediction", description: "Prediktiv analys av leverantörs- och transportrisker", d365Context: "Supply risk assessment-funktioner i Dynamics 365" },
    ],
    risks: [
      { condition: (s) => s.prediction < 40, text: "Otillräcklig historisk data begränsar prognosens träffsäkerhet" },
      { condition: (s) => s.automation < 40, text: "Manuell lagerstyrning ökar risken för över- och underlager" },
      { condition: (s) => s.augmentation < 40, text: "Utan automatiska larm detekteras avvikelser för sent" },
    ],
  },
  {
    id: "production",
    label: "Produktion",
    emoji: "🏭",
    icon: Factory,
    color: "text-rose-600",
    headerBg: "bg-rose-600",
    measures: "Maskinutnyttjande · Kvalitetsavvikelser · Produktionsplanering",
    timeSavingsRange: "15–35%",
    forecastImprovement: "15–30%",
    riskReduction: "Minskad kassation och stillestånd",
    questions: [
      { id: "prod_downtime", question: "Hur ofta drabbas ni av oplanerade produktionsstopp?", index: "prediction", options: [{ label: "Sällan, prediktivt underhåll", score: 1 }, { label: "Ibland, planerat underhåll", score: 2 }, { label: "Regelbundet, reaktivt", score: 3 }] },
      { id: "prod_quality", question: "Hur identifieras kvalitetsavvikelser i produktionen?", index: "augmentation", options: [{ label: "Automatiskt via sensorer/system", score: 1 }, { label: "Vid stickprov och slutkontroll", score: 2 }, { label: "Ofta först hos kund", score: 3 }] },
      { id: "prod_planning", question: "Hur hanteras produktionsplanering och sekvensering?", index: "automation", options: [{ label: "Automatiserat med optimering", score: 1 }, { label: "Delvis manuellt med systemstöd", score: 2 }, { label: "Helt manuellt (Excel/whiteboard)", score: 3 }] },
      { id: "prod_oee", question: "Mäts OEE (Overall Equipment Effectiveness) systematiskt?", index: "augmentation", options: [{ label: "Ja, i realtid med dashboards", score: 1 }, { label: "Ja, men manuellt/periodvis", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "prod_waste", question: "Hur mycket kassation/spill uppstår i produktion?", index: "prediction", options: [{ label: "Under 2%, aktivt optimerat", score: 1 }, { label: "2–5%", score: 2 }, { label: "Över 5% eller okänt", score: 3 }] },
    ],
    aiResults: [
      { label: "Predictive Maintenance Potential", labelEn: "Predictive Maintenance", description: "AI förutser maskinfel och optimerar underhållsintervall", d365Context: "Dynamics 365 Supply Chain Management stöder IoT-baserat prediktivt underhåll" },
      { label: "Quality AI Potential", labelEn: "Quality AI", description: "AI-driven kvalitetskontroll som identifierar avvikelser i realtid", d365Context: "Kvalitetshantering med AI-stöd finns i Dynamics 365 Supply Chain Management" },
      { label: "Production Scheduling AI", labelEn: "Scheduling AI", description: "Intelligent produktionsplanering som optimerar sekvens och resurser", d365Context: "AI-optimerad planering och schemaläggning i Dynamics 365 Supply Chain Management" },
    ],
    risks: [
      { condition: (s) => s.prediction < 40, text: "Utan prediktivt underhåll ökar risken för kostsamma oplanerade stopp" },
      { condition: (s) => s.automation < 40, text: "Manuell produktionsplanering begränsar möjligheten till AI-optimering" },
      { condition: (s) => s.augmentation < 40, text: "Utan realtidsdata från produktion saknas grund för AI-driven kvalitetskontroll" },
    ],
  },
  {
    id: "customer_service",
    label: "Kundservice",
    emoji: "🎧",
    icon: Headphones,
    color: "text-teal-600",
    headerBg: "bg-teal-600",
    measures: "Lösningstid · Självbetjäningsgrad · Kundnöjdhet",
    timeSavingsRange: "20–40%",
    forecastImprovement: "10–20%",
    riskReduction: "Minskad eskaleringsfrekvens",
    questions: [
      { id: "cs_resolution", question: "Hur lång är den genomsnittliga lösningstiden för ärenden?", index: "automation", options: [{ label: "Under 4 timmar", score: 1 }, { label: "4–24 timmar", score: 2 }, { label: "Över 24 timmar", score: 3 }] },
      { id: "cs_selfservice", question: "Hur stor andel av ärenden löses via självbetjäning?", index: "automation", options: [{ label: "Över 40%", score: 1 }, { label: "10–40%", score: 2 }, { label: "Under 10% eller ingen självbetjäning", score: 3 }] },
      { id: "cs_routing", question: "Hur dirigeras ärenden till rätt medarbetare?", index: "augmentation", options: [{ label: "AI-driven routing baserat på kompetens", score: 1 }, { label: "Regelbaserad routing", score: 2 }, { label: "Manuellt eller round-robin", score: 3 }] },
      { id: "cs_sentiment", question: "Analyseras kundsentiment under pågående ärenden?", index: "prediction", options: [{ label: "Ja, i realtid med AI", score: 1 }, { label: "Delvis, via enkäter efteråt", score: 2 }, { label: "Nej", score: 3 }] },
      { id: "cs_knowledge", question: "Får agenter automatiska förslag på lösningar från kunskapsdatabasen?", index: "augmentation", options: [{ label: "Ja, AI-drivna förslag i realtid", score: 1 }, { label: "Manuell sökning i kunskapsbas", score: 2 }, { label: "Ingen strukturerad kunskapsbas", score: 3 }] },
    ],
    aiResults: [
      { label: "Conversational AI Potential", labelEn: "Conversational AI", description: "AI-drivna chatbottar och virtuella agenter som löser ärenden autonomt", d365Context: "Copilot i Dynamics 365 Customer Service ger AI-assisterad ärendehantering" },
      { label: "Sentiment Analysis Potential", labelEn: "Sentiment Analysis", description: "Realtidsanalys av kundsentiment för proaktiv eskalering", d365Context: "Sentimentanalys är inbyggd i Dynamics 365 Customer Service och Contact Center" },
      { label: "Knowledge AI Potential", labelEn: "Knowledge AI", description: "AI som automatiskt föreslår relevanta artiklar och lösningar", d365Context: "Copilot i Customer Service söker och sammanfattar kunskapsartiklar automatiskt" },
    ],
    risks: [
      { condition: (s) => s.automation < 40, text: "Låg självbetjäningsgrad och manuell ärendehantering begränsar AI-automatisering" },
      { condition: (s) => s.augmentation < 40, text: "Utan intelligent routing och kunskapsstöd utnyttjas inte AI:s beslutsstöd" },
      { condition: (s) => s.prediction < 40, text: "Avsaknad av sentimentanalys gör det svårt att prediktera eskaleringar" },
    ],
  },
];

// ─── SCORING (inverted: high score = high AI opportunity) ─

function calcIndexScores(
  foundationAnswers: FoundationAnswers,
  role: RoleId,
  roleScoreMap: Record<string, number>
): IndexScores {
  const track = roleTracks.find((t) => t.id === role)!;

  const indexPoints: Record<IndexId, number[]> = {
    automation: [],
    augmentation: [],
    prediction: [],
    governance: [],
  };

  // Foundation questions contribute
  foundationQuestions.forEach((fq) => {
    if (!fq.index) return;
    const answer = foundationAnswers[fq.id];
    const opt = fq.options.find((o) => o.label === answer);
    if (opt) indexPoints[fq.index].push(opt.score);
  });

  // Role questions contribute
  track.questions.forEach((rq) => {
    const score = roleScoreMap[rq.id];
    if (score !== undefined) indexPoints[rq.index].push(score);
  });

  const calcPct = (points: number[]) => {
    if (points.length === 0) return 50;
    const max = points.length * 3;
    return Math.round((points.reduce((a, b) => a + b, 0) / max) * 100);
  };

  return {
    automation: calcPct(indexPoints.automation),
    augmentation: calcPct(indexPoints.augmentation),
    prediction: calcPct(indexPoints.prediction),
    governance: calcPct(indexPoints.governance),
  };
}

function getProfile(scores: IndexScores): ProfileId {
  const avg = (scores.automation + scores.augmentation + scores.prediction + scores.governance) / 4;
  // Higher scores = more gaps = more AI opportunity but less readiness
  if (avg <= 40) return "scaling"; // Low scores = already mature = scaling
  if (avg <= 65) return "structurally_ready";
  return "exploring"; // High scores = many gaps = exploring
}

const profileData: Record<ProfileId, { emoji: string; color: string; title: string; subtitle: string; description: string }> = {
  exploring: {
    emoji: "🔴",
    color: "text-red-600",
    title: "Utforskande fas",
    subtitle: "Hög AI-potential – låg strukturell beredskap",
    description: "Analysen visar betydande utrymme för AI-driven förbättring – men datakvalitet, processer och governance behöver stärkas innan AI kan ge full effekt. Risken är att initiativ ger begränsat resultat utan denna grund.",
  },
  structurally_ready: {
    emoji: "🟠",
    color: "text-amber-600",
    title: "Strukturellt redo",
    subtitle: "Tydlig AI-potential med stabil grund",
    description: "Grundläggande struktur finns. Fokusera på ett avgränsat pilotprojekt i den funktion där AI kan ge störst och snabbast effekt. Potential att snabbt realisera mätbart värde.",
  },
  scaling: {
    emoji: "🟢",
    color: "text-emerald-600",
    title: "Skalningsfas",
    subtitle: "Mogen grund – redo för breddinförande",
    description: "Datagrund, processtruktur och organisatorisk beredskap är på plats. Fokus bör vara breddinförande av AI och autonoma agenter för att accelerera verksamheten.",
  },
};

// ─── ROI CALCULATION ─────────────────────────────────────

function calcROI(
  role: RoleId,
  scores: IndexScores,
  headcount: string
): { annualSavingSEK: number; timeSavingPct: number; forecastImprovePct: number } {
  const track = roleTracks.find((t) => t.id === role)!;

  // Base multiplier from headcount
  const hcMap: Record<string, number> = {
    "1–49 anställda": 0.6,
    "50–249 anställda": 1.0,
    "250–999 anställda": 1.5,
    "1 000+ anställda": 2.2,
  };
  const hcMultiplier = hcMap[headcount] || 1.0;

  // AI opportunity intensity (higher scores = more gaps = more potential)
  const avgScore = (scores.automation + scores.augmentation + scores.prediction) / 3;
  const opportunityFactor = avgScore / 100; // 0..1

  // Base annual cost per FTE in function (approximate average SEK)
  const roleCostBase: Record<RoleId, number> = {
    sales: 650000,
    finance: 700000,
    it: 750000,
    marketing: 600000,
    project: 700000,
    logistics: 600000,
    production: 550000,
    customer_service: 500000,
  };

  // Team size estimate per headcount bracket
  const teamSizeMap: Record<string, Record<RoleId, number>> = {
    "1–49 anställda": { sales: 3, finance: 2, it: 2, marketing: 2, project: 3, logistics: 3, production: 10, customer_service: 4 },
    "50–249 anställda": { sales: 8, finance: 5, it: 5, marketing: 4, project: 6, logistics: 8, production: 30, customer_service: 12 },
    "250–999 anställda": { sales: 20, finance: 12, it: 12, marketing: 8, project: 15, logistics: 20, production: 80, customer_service: 30 },
    "1 000+ anställda": { sales: 50, finance: 25, it: 25, marketing: 15, project: 30, logistics: 50, production: 200, customer_service: 80 },
  };
  const teamSize = teamSizeMap[headcount]?.[role] || 5;

  // Calculate time saving percentage based on score ranges in track
  const tsRange = track.timeSavingsRange.match(/(\d+)–(\d+)/);
  const tsLow = tsRange ? parseInt(tsRange[1]) : 15;
  const tsHigh = tsRange ? parseInt(tsRange[2]) : 30;
  const timeSavingPct = Math.round(tsLow + (tsHigh - tsLow) * opportunityFactor);

  // Forecast improvement
  const fiRange = track.forecastImprovement.match(/(\d+)–(\d+)/);
  const forecastImprovePct = fiRange
    ? Math.round(parseInt(fiRange[1]) + (parseInt(fiRange[2]) - parseInt(fiRange[1])) * opportunityFactor)
    : 0;

  // Annual saving = teamSize * costPerFTE * timeSavingPct
  const annualSavingSEK = Math.round((teamSize * roleCostBase[role] * timeSavingPct) / 100 / 10000) * 10000;

  return { annualSavingSEK, timeSavingPct, forecastImprovePct };
}

function formatSEK(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace(".", ",")} MSEK`;
  }
  return `${Math.round(amount / 1000)} TSEK`;
}

// ─── EFFECT LEVEL ────────────────────────────────────────

function getEffectLevel(scores: IndexScores, aiResultIdx: number): "high" | "medium" | "low" {
  const avgOpp = (scores.automation + scores.augmentation + scores.prediction) / 3;
  if (avgOpp >= 60) return "high";
  if (avgOpp >= 35) return "medium";
  return "low";
}

// ─── PARTNER MATCHING ────────────────────────────────────

interface PartnerSuggestion {
  icon: string;
  type: string;
  description: string;
}

function getPartnerSuggestions(
  role: RoleId,
  system: string,
  profile: ProfileId,
  industry: string
): PartnerSuggestion[] {
  const suggestions: PartnerSuggestion[] = [];
  const hasDynamics = system === "Dynamics 365";

  const rolePartnerMap: Record<RoleId, { icon: string; type: string; desc: string }> = {
    it: { icon: "🏗️", type: "Integrations- och arkitekturfokus", desc: "Partner med erfarenhet av systemlandskap, API-strategi och dataarkitektur" },
    sales: { icon: "📈", type: "CRM- och säljspecialist", desc: "Partner med djup erfarenhet av CRM-plattformar och AI-driven försäljning" },
    marketing: { icon: "🎯", type: "Marketing automation-specialist", desc: "Partner med kompetens inom kundinsikter och marketing automation" },
    finance: { icon: "💰", type: "Finance & AI-specialist", desc: "Partner med erfarenhet av modern ekonomistyrning och AI-driven analys" },
    project: { icon: "📊", type: "Project Operations-specialist", desc: "Partner med expertis inom projektbaserade verksamheter" },
    logistics: { icon: "🚛", type: "Supply Chain-specialist", desc: "Partner med erfarenhet av lagerstyrning, prognos och supply chain-optimering" },
    production: { icon: "🏭", type: "Produktions- och tillverkningsspecialist", desc: "Partner med erfarenhet av smart manufacturing, prediktivt underhåll och produktionsoptimering" },
    customer_service: { icon: "🎧", type: "Customer Service-specialist", desc: "Partner med erfarenhet av kundservice, ärendehantering och AI-drivna kontaktcenter" },
  };

  suggestions.push({
    icon: rolePartnerMap[role].icon,
    type: rolePartnerMap[role].type,
    description: rolePartnerMap[role].desc,
  });

  if (profile === "exploring") {
    suggestions.push({
      icon: "🧭",
      type: "Strategisk rådgivare",
      description: "Partner som kan hjälpa er kartlägga nuläge och bygga en stabil grund innan AI-satsning",
    });
  } else if (profile === "scaling") {
    suggestions.push({
      icon: "🚀",
      type: "AI-skalningspartner",
      description: "Partner med erfarenhet av breddinförande av Copilot och autonoma agenter",
    });
  }

  if (!hasDynamics && (role === "sales" || role === "finance" || role === "logistics")) {
    suggestions.push({
      icon: "🔄",
      type: "Transformationspartner",
      description: "Partner som kan genomföra systemskifte och etablera en modern plattform som grund för AI",
    });
  }

  if (industry) {
    suggestions.push({
      icon: "🏭",
      type: `Branschexpert: ${industry}`,
      description: `Partner med specifik erfarenhet inom ${industry.toLowerCase()} och dess unika affärskrav`,
    });
  }

  return suggestions;
}

// ─── ROADMAP ─────────────────────────────────────────────

interface RoadmapQuarter { text: string; d365Note?: string }

function generateRoadmap(role: RoleId, profile: ProfileId, system: string): { q1: RoadmapQuarter; q2: RoadmapQuarter; q3: RoadmapQuarter; q4: RoadmapQuarter } {
  const hasDynamics = system === "Dynamics 365";

  const d365RoleApp: Record<RoleId, string> = {
    it: "Dynamics 365 och Power Platform",
    sales: "Dynamics 365 Sales",
    marketing: "Dynamics 365 Customer Insights",
    finance: "Dynamics 365 Finance",
    project: "Dynamics 365 Project Operations",
    logistics: "Dynamics 365 Supply Chain Management",
    production: "Dynamics 365 Supply Chain Management",
    customer_service: "Dynamics 365 Customer Service",
  };

  const roadmaps: Record<RoleId, Record<ProfileId, { q1: string; q2: string; q3: string; q4: string }>> = {
    it: {
      scaling: { q1: "Formalisera AI-governance och säkerhetspolicyer", q2: "Etablera centralt AI-kompetenscenter", q3: "Skala pilotprojekt till produktion", q4: "Utvärdera och optimera AI-initiativ" },
      structurally_ready: { q1: "Inventera datalandskap och identifiera silos", q2: "Etablera dataägarskap och governance", q3: "Skapa sandbox-miljö för AI-experiment", q4: "Starta första AI-pilot" },
      exploring: { q1: "Kartlägg systemlandskap och integrationsbehov", q2: "Centralisera nyckeldata", q3: "Etablera grundläggande API-struktur", q4: "Definiera AI-policy och roadmap" },
    },
    sales: {
      scaling: { q1: hasDynamics ? "Aktivera Copilot för mötessammanfattning" : "Implementera CRM med AI-kapabiliteter", q2: "Inför prediktiv lead scoring", q3: "Skala next-best-action till hela teamet", q4: "Automatisera prognoser och pipeline-analys" },
      structurally_ready: { q1: "Kvalitetssäkra CRM-data och pipeline-process", q2: "Standardisera KPI:er och uppföljningsrytm", q3: hasDynamics ? "Aktivera Copilot för grundläggande assistans" : "Utforska AI-verktyg för CRM", q4: "Mäta och utvärdera AI-effekt" },
      exploring: { q1: "Etablera grundläggande CRM-disciplin", q2: "Definiera pipeline-steg och konverteringsmått", q3: "Börja logga all kundkommunikation", q4: "Utvärdera AI-readiness på nytt" },
    },
    marketing: {
      scaling: { q1: "Implementera AI-driven segmentering", q2: "Aktivera personalisering i stor skala", q3: "Prediktiv kampanjoptimering", q4: "AI-genererat innehåll och attribution" },
      structurally_ready: { q1: "Integrera CRM och marknadssystem", q2: "Etablera marketing automation-flöden", q3: "Börja spåra kampanj-ROI end-to-end", q4: "Testa AI för segmentering" },
      exploring: { q1: "Strukturera kunddata och segment", q2: "Implementera grundläggande marketing automation", q3: "Skapa content-process och kalender", q4: "Integrera med CRM" },
    },
    finance: {
      scaling: { q1: hasDynamics ? "Aktivera Copilot i Finance" : "Utforska AI-verktyg för ekonomistyrning", q2: "Implementera AI-driven avvikelsedetektering", q3: "Automatisera kassaflödesprognoser", q4: "Testa bokslutsagenter" },
      structurally_ready: { q1: "Automatisera leverantörsreskontra", q2: "Standardisera rapporter och dashboards", q3: "Förkorta bokslutsprocess", q4: "Utforska AI-prognoser" },
      exploring: { q1: "Digitalisera manuella processer", q2: "Implementera standardiserade rapporter", q3: "Etablera löpande prognosprocess", q4: "Utvärdera AI-potential" },
    },
    project: {
      scaling: { q1: "Implementera AI-driven riskprediktion", q2: "Automatisera statusrapportering", q3: "AI-optimerad resursallokering", q4: "Prediktiv marginalanalys" },
      structurally_ready: { q1: "Automatisera datainsamling i projekt", q2: "Etablera realtidsspårning av lönsamhet", q3: "Definiera riskvarningsindikatorer", q4: "Testa prediktiv projektanalys" },
      exploring: { q1: "Börja registrera projektdata löpande", q2: "Etablera standardiserad projektmodell", q3: "Spåra resurstid och kostnader", q4: "Utvärdera verktygsbehov" },
    },
    logistics: {
      scaling: { q1: "Implementera AI-drivna efterfrågeprognoser", q2: "Automatisera lageroptimering", q3: "AI-driven avvikelsedetektion", q4: "Prediktiv leveransriskanalys" },
      structurally_ready: { q1: "Strukturera historisk efterfrågedata", q2: "Automatisera grundläggande lagerplanering", q3: "Implementera avvikelsevarningar", q4: "Testa prediktiv prognos" },
      exploring: { q1: "Digitalisera lagerstyrning", q2: "Börja samla efterfrågedata", q3: "Automatisera beställningspunkter", q4: "Utvärdera prognosverktyg" },
    },
    production: {
      scaling: { q1: "Implementera prediktivt underhåll med IoT-data", q2: "AI-driven kvalitetskontroll i realtid", q3: "Optimera produktionssekvensering med AI", q4: "Skala till autonoma produktionsagenter" },
      structurally_ready: { q1: "Koppla maskiner och sensorer till central dataplattform", q2: "Standardisera OEE-mätning och KPI:er", q3: "Testa prediktivt underhåll på pilotlinje", q4: "Utvärdera AI-driven schemaläggning" },
      exploring: { q1: "Digitalisera produktionsrapportering", q2: "Börja samla maskindata och stilleståndstider", q3: "Etablera systematisk kvalitetsuppföljning", q4: "Utvärdera IoT- och AI-readiness" },
    },
    customer_service: {
      scaling: { q1: "Implementera AI-drivna virtuella agenter", q2: "Aktivera sentimentanalys i realtid", q3: "Automatisera ärendeklassificering och routing", q4: "Skala till autonoma kundserviceagenter" },
      structurally_ready: { q1: "Strukturera kunskapsdatabas och FAQ", q2: "Implementera intelligent ärenderouting", q3: hasDynamics ? "Aktivera Copilot i Customer Service" : "Testa AI-assisterad ärendehantering", q4: "Mäta och optimera självbetjäningsgrad" },
      exploring: { q1: "Centralisera alla kundservicekanaler", q2: "Etablera ärendekategorisering och SLA:er", q3: "Bygga grundläggande kunskapsdatabas", q4: "Utvärdera AI-readiness för kundservice" },
    },
  };

  const rm = roadmaps[role][profile];
  const d365App = d365RoleApp[role];
  const footnote = hasDynamics
    ? `Dessa steg stöds av AI-funktionalitet i er befintliga ${d365App}-miljö.`
    : `Dessa steg stöds av AI-funktionalitet i moderna affärssystem såsom ${d365App}.`;

  return {
    q1: { text: rm.q1 },
    q2: { text: rm.q2 },
    q3: { text: rm.q3 },
    q4: { text: rm.q4, d365Note: footnote },
  };
}

// ─── HELPERS ─────────────────────────────────────────────

function getLevelLabel(pct: number): string {
  if (pct >= 70) return "Hög";
  if (pct >= 40) return "Medel";
  return "Låg";
}
function getLevelColor(pct: number): string {
  if (pct >= 70) return "bg-emerald-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-red-500";
}
function getLevelTextColor(pct: number): string {
  if (pct >= 70) return "text-emerald-600";
  if (pct >= 40) return "text-amber-600";
  return "text-red-600";
}
function getEffectBadge(level: "high" | "medium" | "low") {
  if (level === "high") return { label: "Hög effekt", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (level === "medium") return { label: "Medel effekt", color: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "Låg effekt", color: "text-red-600 bg-red-50 border-red-200" };
}

// Impact labels for the 3 AI dimensions
function getImpactLabel(pct: number): string {
  if (pct >= 65) return "Hög";
  if (pct >= 40) return "Medel";
  return "Låg";
}

// ─── COMPONENT ───────────────────────────────────────────

type Step = "intro" | "foundation" | "role_select" | "role_questions" | "result";

const AIReadiness = () => {
  const [step, setStep] = useState<Step>("intro");
  const [foundationStep, setFoundationStep] = useState(0);
  const [foundationAnswers, setFoundationAnswers] = useState<FoundationAnswers>({
    system: "",
    industry: "",
    headcount: "",
    repetitive: "",
    gut_decisions: "",
    decision_time: "",
    anomaly_speed: "",
  });
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [roleQuestionIdx, setRoleQuestionIdx] = useState(0);
  const [roleAnswers, setRoleAnswers] = useState<Record<string, string>>({});
  const [roleScores, setRoleScores] = useState<Record<string, number>>({});

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({ name: "", company: "", role: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const track = selectedRole ? roleTracks.find((t) => t.id === selectedRole)! : null;

  const foundationCount = foundationQuestions.length;
  // Flow: foundation(0-2) → role_select → foundation(3-6) → role_questions(5) → result
  const totalSteps = foundationCount + 1 + 5; // 7 foundation + 1 role_select + 5 role questions = 13
  const currentProgress =
    step === "foundation" && foundationStep <= 2 ? foundationStep + 1
    : step === "role_select" ? 4
    : step === "foundation" && foundationStep >= 3 ? 4 + (foundationStep - 2) // steps 5-8
    : step === "role_questions" ? foundationCount + 1 + roleQuestionIdx + 1
    : step === "result" ? totalSteps
    : 0;
  const progressPct = (currentProgress / totalSteps) * 100;

  // ─── Foundation handlers ─────────────────────────────
  const handleFoundationAnswer = (label: string) => {
    const key = foundationQuestions[foundationStep].id;
    setFoundationAnswers({ ...foundationAnswers, [key]: label });

    setTimeout(() => {
      if (foundationStep === 2) {
        // After headcount (question 3), go to role selection
        setStep("role_select");
      } else if (foundationStep < foundationCount - 1) {
        setFoundationStep(foundationStep + 1);
      } else {
        // After all foundation questions, go to role-specific questions
        setStep("role_questions");
      }
    }, 300);
  };

  const handleRoleSelect = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setRoleQuestionIdx(0);
    setRoleAnswers({});
    setRoleScores({});
    // After role selection, continue with foundation questions from step 3
    setTimeout(() => {
      setFoundationStep(3);
      setStep("foundation");
    }, 300);
  };

  const handleRoleAnswer = (label: string, score: number) => {
    const q = track!.questions[roleQuestionIdx];
    setRoleAnswers({ ...roleAnswers, [q.id]: label });
    setRoleScores({ ...roleScores, [q.id]: score });

    setTimeout(() => {
      if (roleQuestionIdx < track!.questions.length - 1) {
        setRoleQuestionIdx(roleQuestionIdx + 1);
      } else {
        setStep("result");
      }
    }, 300);
  };

  const goBackInQuiz = () => {
    if (step === "role_questions" && roleQuestionIdx > 0) {
      setRoleQuestionIdx(roleQuestionIdx - 1);
    } else if (step === "role_questions" && roleQuestionIdx === 0) {
      // Go back to last foundation question
      setFoundationStep(foundationCount - 1);
      setStep("foundation");
    } else if (step === "foundation" && foundationStep === 3) {
      // Going back from first AI-mapping question → role_select
      setStep("role_select");
    } else if (step === "role_select") {
      // Going back from role_select → headcount (step 2)
      setFoundationStep(2);
      setStep("foundation");
    } else if (step === "foundation" && foundationStep > 0) {
      setFoundationStep(foundationStep - 1);
    }
  };

  // ─── Report submit ──────────────────────────────────
  const handleReportSubmit = async () => {
    if (!reportForm.name || !reportForm.company || !reportForm.email) {
      toast({ title: "Fyll i namn, företag och e-post.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          contact_name: reportForm.name,
          company_name: reportForm.company,
          email: reportForm.email,
          phone: "",
          message: `AI Impact Assessment – Roll: ${track!.label}, Bransch: ${foundationAnswers.industry || "Ej angiven"}, System: ${foundationAnswers.system}`,
          source_type: "ai_readiness",
          source_page: "/ai-readiness",
          selected_product: `AI Assessment – ${track!.label}`,
          industry: foundationAnswers.industry || "",
          company_size: foundationAnswers.headcount || "",
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Tack! Din rapport laddas ner." });
      generatePDF();
    } catch {
      toast({ title: "Något gick fel. Försök igen.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── PDF Generation ──────────────────────────────────
  const generatePDF = useCallback(async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const scores = calcIndexScores(foundationAnswers, selectedRole!, roleScores);
    const profile = getProfile(scores);
    const pd = profileData[profile];
    const roadmap = generateRoadmap(selectedRole!, profile, foundationAnswers.system);
    const partners = getPartnerSuggestions(selectedRole!, foundationAnswers.system, profile, foundationAnswers.industry);
    const activeRisks = track!.risks.filter((r) => r.condition(scores));
    const sysTrack = getSystemTrack(foundationAnswers.system);
    const sysData = systemTrackData[sysTrack];
    const roi = calcROI(selectedRole!, scores, foundationAnswers.headcount);

    const pw = 210;
    const ph = 297;
    const lm = 20;
    const rm = pw - 20;
    const cw = rm - lm;
    let y = 0;
    let pageNum = 0;

    // Brand colors
    const slate800 = { r: 30, g: 41, b: 59 };
    const slate600 = { r: 71, g: 85, b: 105 };
    const slate400 = { r: 148, g: 163, b: 184 };
    const emerald = { r: 16, g: 185, b: 129 };
    const emerald700 = { r: 4, g: 120, b: 87 };
    const blue500 = { r: 59, g: 130, b: 246 };
    const amber500 = { r: 245, g: 158, b: 11 };
    const purple500 = { r: 168, g: 85, b: 247 };
    const red500 = { r: 239, g: 68, b: 68 };

    const profileColors: Record<ProfileId, { r: number; g: number; b: number }> = {
      scaling: emerald,
      structurally_ready: amber500,
      exploring: red500,
    };

    const trackColors: Record<RoleId, { r: number; g: number; b: number }> = {
      sales: { r: 22, g: 163, b: 74 },
      finance: { r: 202, g: 138, b: 4 },
      it: blue500,
      marketing: purple500,
      project: { r: 234, g: 88, b: 12 },
      logistics: { r: 6, g: 182, b: 212 },
      production: { r: 225, g: 29, b: 72 },
      customer_service: { r: 13, g: 148, b: 136 },
    };

    const addPageFooter = () => {
      pageNum++;
      doc.setDrawColor(200, 210, 220);
      doc.setLineWidth(0.3);
      doc.line(lm, ph - 18, rm, ph - 18);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate400.r, slate400.g, slate400.b);
      doc.text("d365.se – Oberoende guide till Dynamics 365 i Sverige", lm, ph - 12);
      doc.text(`Sida ${pageNum}`, rm, ph - 12, { align: "right" });
    };

    const newPage = (headerTitle: string, headerColor?: { r: number; g: number; b: number }) => {
      doc.addPage();
      const hc = headerColor || slate800;
      doc.setFillColor(hc.r, hc.g, hc.b);
      doc.rect(0, 0, pw, 32, "F");
      // Subtle gradient overlay
      doc.setFillColor(255, 255, 255);
      doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
      doc.rect(0, 0, pw * 0.6, 32, "F");
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(headerTitle, lm, 21);
      y = 44;
    };

    const addSectionBox = (title: string, color: { r: number; g: number; b: number }) => {
      doc.setFillColor(color.r, color.g, color.b);
      doc.roundedRect(lm, y, cw, 9, 1.5, 1.5, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(title, lm + 5, y + 6.2);
      y += 14;
    };

    const addText = (text: string, indent = 0, size = 9.5) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      const lines = doc.splitTextToSize(text, cw - indent);
      doc.text(lines, lm + indent, y);
      y += lines.length * (size * 0.45) + 3;
    };

    const addProgressBar = (label: string, value: number, color: { r: number; g: number; b: number }, description?: string) => {
      // Label + value
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text(label, lm + 3, y);
      const impactLabel = getImpactLabel(value);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(color.r, color.g, color.b);
      doc.text(impactLabel, rm - 3, y, { align: "right" });
      y += 4;
      // Bar background
      doc.setFillColor(235, 238, 242);
      doc.roundedRect(lm + 3, y, cw - 6, 4, 2, 2, "F");
      // Bar fill
      const barWidth = Math.max(((cw - 6) * value) / 100, 4);
      doc.setFillColor(color.r, color.g, color.b);
      doc.roundedRect(lm + 3, y, barWidth, 4, 2, 2, "F");
      y += 6;
      if (description) {
        doc.setFontSize(7.5);
        doc.setTextColor(slate400.r, slate400.g, slate400.b);
        doc.text(description, lm + 3, y);
        y += 4;
      }
      y += 2;
    };

    const checkSpace = (needed: number) => {
      if (y > ph - needed - 25) {
        addPageFooter();
        return true;
      }
      return false;
    };

    // ═══ COVER PAGE ═══
    // Full dark background
    doc.setFillColor(slate800.r, slate800.g, slate800.b);
    doc.rect(0, 0, pw, ph, "F");

    // Accent bar at top
    doc.setFillColor(emerald.r, emerald.g, emerald.b);
    doc.rect(0, 0, pw, 6, "F");

    // Title
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("AI Impact &", lm, 70);
    doc.text("Readiness Assessment", lm, 85);

    // Accent line
    doc.setDrawColor(emerald.r, emerald.g, emerald.b);
    doc.setLineWidth(2.5);
    doc.line(lm, 95, lm + 70, 95);

    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(slate400.r, slate400.g, slate400.b);
    doc.text("Hur stor effekt kan AI skapa i er roll?", lm, 112);

    // Summary info cards
    const cardY = 140;
    const cardW = (cw - 10) / 3;
    const cardData = [
      { label: "Roll", value: track!.label },
      { label: "Bransch", value: foundationAnswers.industry || "Ej angiven" },
      { label: "AI-profil", value: pd.title },
    ];
    cardData.forEach((cd, i) => {
      const cx = lm + i * (cardW + 5);
      doc.setFillColor(40, 52, 72);
      doc.roundedRect(cx, cardY, cardW, 30, 3, 3, "F");
      doc.setFontSize(8);
      doc.setTextColor(emerald.r, emerald.g, emerald.b);
      doc.setFont("helvetica", "bold");
      doc.text(cd.label.toUpperCase(), cx + 8, cardY + 12);
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      const valLines = doc.splitTextToSize(cd.value, cardW - 16);
      doc.text(valLines[0], cx + 8, cardY + 22);
    });

    // ROI highlight
    const roiY = 190;
    doc.setFillColor(emerald700.r, emerald700.g, emerald700.b);
    doc.roundedRect(lm, roiY, cw, 38, 4, 4, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("UPPSKATTAD ARLIG AI-EFFEKT", lm + 10, roiY + 12);
    doc.setFontSize(28);
    doc.text(`~${formatSEK(roi.annualSavingSEK)}`, lm + 10, roiY + 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 240, 220);
    doc.text(`~${roi.timeSavingPct}% tidsbesparing`, lm + 100, roiY + 18);
    if (roi.forecastImprovePct > 0) {
      doc.text(`~${roi.forecastImprovePct}% prognosprecision`, lm + 100, roiY + 28);
    }

    // Bottom info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(slate400.r, slate400.g, slate400.b);
    doc.text(`Datum: ${new Date().toLocaleDateString("sv-SE")}`, lm, ph - 50);
    if (reportForm.company) {
      doc.text(`Foretag: ${reportForm.company}`, lm, ph - 42);
    }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(emerald.r, emerald.g, emerald.b);
    doc.text("www.d365.se", lm, ph - 25);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(slate400.r, slate400.g, slate400.b);
    doc.text("Oberoende guide till Dynamics 365 i Sverige", lm, ph - 19);

    // ═══ PAGE 1: Executive Summary ═══
    newPage("Executive Summary");

    // Profile badge
    const pc = profileColors[profile];
    doc.setFillColor(pc.r, pc.g, pc.b);
    doc.roundedRect(lm, y, cw, 22, 3, 3, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${pd.emoji}  ${pd.title}`, lm + 8, y + 10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(pd.subtitle, lm + 8, y + 17);
    y += 28;

    addText(pd.description);
    y += 3;

    // Summary grid
    addSectionBox("Sammanfattning", slate600);
    const summaryPairs = [
      ["Roll", track!.label],
      ["Bransch", foundationAnswers.industry || "Ej angiven"],
      ["Storlek", foundationAnswers.headcount],
      ["System", foundationAnswers.system],
      ["Systemspar", sysData.label],
    ];
    summaryPairs.forEach(([label, value]) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(slate600.r, slate600.g, slate600.b);
      doc.text(label + ":", lm + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text(value, lm + 40, y);
      y += 6;
    });
    y += 5;

    // AI Impact dimensions with progress bars
    addSectionBox("AI-effektpotential", emerald700);
    const dimColors = [blue500, purple500, amber500];
    const dimDescriptions = [
      "Repetitivt arbete som AI kan automatisera",
      "Prognoser och risker AI kan forutse",
      "Beslutsstod som AI kan forbattra",
    ];
    const dimData = [
      { label: "Automation Impact", value: scores.automation },
      { label: "Prediction Impact", value: scores.prediction },
      { label: "Decision Augmentation", value: scores.augmentation },
    ];
    dimData.forEach((d, i) => {
      addProgressBar(d.label, d.value, dimColors[i], dimDescriptions[i]);
    });
    if (scores.governance > 0) {
      addProgressBar("AI Governance", scores.governance, slate600, "Ramverk for ansvarsfull AI-anvandning");
    }

    y += 3;

    // Key insights
    addSectionBox("3 viktigaste insikterna", slate800);
    const insights: string[] = [];
    if (scores.automation >= 60) insights.push("Hog automationspotential – repetitiva processer kan effektiviseras med AI");
    else insights.push("Automation delvis pa plats – fokusera pa avancerade AI-anvandningsfall");
    if (scores.prediction >= 55) insights.push("Tydlig potential for prediktiv AI – historisk data kan ge battre prognoser");
    else insights.push("Prediktiv kapacitet finns – vidareutveckla med mer strukturerad data");
    if (scores.augmentation >= 55) insights.push("AI kan markbart forbattra beslutsstod och insikter i er roll");
    else insights.push("Beslutsstod ar redan relativt starkt – overväg avancerad AI-analys");

    insights.forEach((insight) => {
      doc.setFillColor(245, 248, 252);
      doc.roundedRect(lm + 2, y - 3.5, cw - 4, 8, 1.5, 1.5, "F");
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text(`–  ${insight}`, lm + 5, y + 1);
      y += 10;
    });

    addPageFooter();

    // ═══ PAGE 2: AI potential per role ═══
    const tc = trackColors[selectedRole!];
    newPage(`AI-potential inom ${track!.label}`, tc);

    addText("Baserat pa era svar finns foljande AI-mojligheter:");
    y += 3;

    track!.aiResults.forEach((ar, i) => {
      if (checkSpace(40)) {
        newPage(`AI-potential inom ${track!.label} (forts.)`, tc);
      }

      const effect = getEffectLevel(scores, i);
      const badge = getEffectBadge(effect);
      const badgeColor = effect === "high" ? emerald : effect === "medium" ? amber500 : slate400;

      // Card background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(lm, y, cw, 30, 3, 3, "F");
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.roundedRect(lm, y, cw, 30, 3, 3, "S");

      // Effect badge
      doc.setFillColor(badgeColor.r, badgeColor.g, badgeColor.b);
      const badgeWidth = doc.getTextWidth(badge.label) * 0.8 + 10;
      doc.roundedRect(rm - badgeWidth - 5, y + 4, badgeWidth, 7, 3, 3, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(badge.label, rm - badgeWidth / 2 - 2.5, y + 8.8, { align: "center" });

      // Title
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text(ar.label, lm + 6, y + 9);

      // Description
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate600.r, slate600.g, slate600.b);
      doc.text(ar.description, lm + 6, y + 16);

      // D365 context
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(slate400.r, slate400.g, slate400.b);
      const ctxLines = doc.splitTextToSize(ar.d365Context, cw - 14);
      doc.text(ctxLines, lm + 6, y + 23);

      y += 35;
    });

    y += 5;

    // System recommendation
    if (checkSpace(50)) {
      newPage("Systemrekommendation", slate600);
    } else {
      addSectionBox("Systemrekommendation", slate600);
    }

    const sysColor = sysTrack === "optimization" ? emerald : sysTrack === "transformation" ? blue500 : purple500;
    doc.setFillColor(sysColor.r, sysColor.g, sysColor.b);
    doc.roundedRect(lm + 2, y, 55, 7, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(`${sysData.emoji}  ${sysData.label}`, lm + 6, y + 5);
    y += 12;
    addText(sysData.description);
    y += 2;
    doc.setFillColor(245, 248, 252);
    doc.roundedRect(lm + 2, y, cw - 4, 18, 2, 2, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(slate800.r, slate800.g, slate800.b);
    doc.text("Rekommendation:", lm + 6, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(slate600.r, slate600.g, slate600.b);
    const recLines = doc.splitTextToSize(sysData.recommendation, cw - 16);
    doc.text(recLines, lm + 6, y + 12);
    y += 24;

    addPageFooter();

    // ═══ PAGE 3: Risk + Partners ═══
    newPage("Riskanalys & Partnermatchning");

    if (activeRisks.length > 0) {
      addSectionBox("Identifierade riskområden", red500);
      activeRisks.forEach((risk) => {
        doc.setFillColor(254, 242, 242);
        const riskLines = doc.splitTextToSize(risk.text, cw - 18);
        const riskH = riskLines.length * 4 + 6;
        doc.roundedRect(lm + 2, y - 2, cw - 4, riskH, 2, 2, "F");
        doc.setDrawColor(252, 165, 165);
        doc.setLineWidth(0.3);
        doc.roundedRect(lm + 2, y - 2, cw - 4, riskH, 2, 2, "S");
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(153, 27, 27);
        doc.text(`!  ${riskLines[0]}`, lm + 6, y + 2);
        if (riskLines.length > 1) {
          doc.text(riskLines.slice(1), lm + 9, y + 6);
        }
        y += riskH + 3;
      });
    } else {
      addSectionBox("Riskanalys", emerald700);
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(lm + 2, y - 2, cw - 4, 12, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text("Inga kritiska riskomraden identifierades. Grunden ar stabil.", lm + 6, y + 4);
      y += 16;
    }

    // General observations
    y += 3;
    addSectionBox("Generella observationer", slate600);
    const observations: string[] = [];
    if (scores.automation >= 60) observations.push("Hog andel repetitivt arbete – AI-automatisering kan ge snabb effekt");
    if (scores.augmentation >= 60) observations.push("Beslut baseras ofta pa magkansla – AI-beslutsstod kan ge forbattring");
    if (scores.prediction >= 60) observations.push("Avvikelser upptacks sent – prediktiv AI kan forbattra reaktionstiden");
    if (scores.governance >= 60) observations.push("Avsaknad av AI-governance okar risken for okontrollerade initiativ");
    if (observations.length === 0) observations.push("Generellt god mognad – fokusera pa att skala befintliga AI-initiativ");

    observations.forEach((obs) => {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text(`–  ${obs}`, lm + 5, y);
      y += 6;
    });

    y += 8;

    // Partner matching
    addSectionBox("Rekommenderad partnertyp", emerald);
    addText("Baserat pa roll, bransch och mognadsniva rekommenderas en partner med foljande profil:");
    y += 2;
    partners.forEach((p) => {
      if (checkSpace(25)) {
        newPage("Partnermatchning (forts.)");
      }
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(lm + 2, y, cw - 4, 16, 2, 2, "F");
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      doc.text(`${p.icon}  ${p.type}`, lm + 6, y + 6);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate600.r, slate600.g, slate600.b);
      const descLines = doc.splitTextToSize(p.description, cw - 18);
      doc.text(descLines, lm + 10, y + 12);
      y += 20;
    });

    addPageFooter();

    // ═══ PAGE 4: 12-month Roadmap ═══
    newPage(`12-manaders AI-roadmap – ${track!.label}`, slate800);

    const qColors = [blue500, emerald, amber500, purple500];
    const quarters = [
      { label: "Q1", period: "Manad 1–3", data: roadmap.q1 },
      { label: "Q2", period: "Manad 4–6", data: roadmap.q2 },
      { label: "Q3", period: "Manad 7–9", data: roadmap.q3 },
      { label: "Q4", period: "Manad 10–12", data: roadmap.q4 },
    ];

    quarters.forEach((q, i) => {
      const qc = qColors[i];
      // Color accent bar
      doc.setFillColor(qc.r, qc.g, qc.b);
      doc.rect(lm, y, 4, 28, "F");
      // Background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(lm + 4, y, cw - 4, 28, 0, 0, "F");
      // Quarter label
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(qc.r, qc.g, qc.b);
      doc.text(q.label, lm + 10, y + 9);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate400.r, slate400.g, slate400.b);
      doc.text(q.period, lm + 24, y + 9);
      // Content
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(slate800.r, slate800.g, slate800.b);
      const qLines = doc.splitTextToSize(q.data.text, cw - 22);
      doc.text(qLines, lm + 10, y + 18);
      y += 34;
    });

    // D365 footnote
    const footNote = roadmap.q4.d365Note || "";
    if (footNote) {
      y += 3;
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(lm, y, cw, 16, 3, 3, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(emerald700.r, emerald700.g, emerald700.b);
      const fnLines = doc.splitTextToSize(footNote, cw - 14);
      doc.text(fnLines, lm + 7, y + 7);
      y += 22;
    }

    y += 10;
    // Disclaimer
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.line(lm, y, rm, y);
    y += 8;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(slate400.r, slate400.g, slate400.b);
    const disc = "Denna analys ar vagledande och baseras pa de svar du angivit. Den ersatter inte en fullstandig forstudie. Uppskattade besparingar ar indikativa och baseras pa branschgenomsnitt. Vi rekommenderar att du diskuterar dina behov med en kvalificerad Microsoft-partner.";
    const discLines = doc.splitTextToSize(disc, cw);
    doc.text(discLines, lm, y);

    addPageFooter();

    doc.save("AI-Impact-Assessment.pdf");
  }, [foundationAnswers, selectedRole, roleScores, track, reportForm]);

  const resetAll = () => {
    setStep("intro");
    setFoundationStep(0);
    setFoundationAnswers({ system: "", industry: "", headcount: "", repetitive: "", gut_decisions: "", decision_time: "", anomaly_speed: "" });
    setSelectedRole(null);
    setRoleQuestionIdx(0);
    setRoleAnswers({});
    setRoleScores({});
    setShowReportForm(false);
    setSubmitted(false);
    setReportForm({ name: "", company: "", role: "", email: "" });
  };

  // ═══════════════════════════════════════════════════════
  // INTRO
  // ═══════════════════════════════════════════════════════
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="AI Impact & Readiness Assessment – Hur stor effekt kan AI skapa? | d365.se"
          description="Rollbaserad AI-analys: mät automation, prediktion och beslutsstöd. Få uppskattat ROI i kronor, rollspecifik roadmap och intelligent partnermatchning."
          canonicalPath="/ai-readiness"
        />
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <section className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI Impact & Readiness Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Hur stor effekt kan AI faktiskt skapa i er roll?
            </h1>
            <p className="text-lg text-muted-foreground mb-3">
              – och hur kan Dynamics 365 stödja er?
            </p>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Denna analys mäter tre AI-dimensioner i er verksamhet och ger konkreta svar på:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-4 text-left">
              {[
                { icon: Bot, text: "Automation Potential", desc: "Repetitivt arbete som AI kan ersätta" },
                { icon: Eye, text: "Augmentation Potential", desc: "Beslutsstöd som AI kan förbättra" },
                { icon: Activity, text: "Prediction Potential", desc: "Prognoser och risker AI kan förutse" },
              ].map((item) => (
                <div key={item.text} className="bg-muted/50 rounded-lg px-4 py-3 text-center">
                  <item.icon className="h-5 w-5 text-primary mx-auto mb-1.5" />
                  <span className="text-xs font-semibold text-foreground block">{item.text}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8 text-left">
              {[
                { icon: DollarSign, text: "Uppskattat ROI i kronor" },
                { icon: Percent, text: "Effekt- och besparingsnivåer" },
                { icon: BarChart3, text: "Rollspecifik AI-roadmap (12 mån)" },
                { icon: Users, text: "Intelligent partnermatchning" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3">
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-8">
              Rådgivande och kontextuellt anpassad efter systemsituation, roll och bransch.
            </p>

            <Button size="lg" className="text-lg px-8 py-6" onClick={() => setStep("foundation")}>
              Starta analysen (3 minuter) <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-10 grid grid-cols-4 gap-3 text-center">
              {[
                { val: "12", label: "frågor totalt" },
                { val: "3", label: "AI-dimensioner" },
                { val: "6", label: "rollspår" },
                { val: "ROI", label: "i kronor" },
              ].map((s) => (
                <div key={s.label} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xl font-bold text-foreground">{s.val}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // QUIZ
  // ═══════════════════════════════════════════════════════
  if (step === "foundation" || step === "role_select" || step === "role_questions") {
    const isIndustryStep = step === "foundation" && foundationQuestions[foundationStep].id === "industry";

    // Determine which section label - Flow: Grundval(1) → Välj roll(2) → AI-kartläggning(3) → Rollfrågor(4)
    const isAiMapping = step === "foundation" && foundationStep >= 3;
    const sectionLabel = isAiMapping
      ? "AI-kartläggning"
      : step === "foundation"
        ? "Grundval"
        : step === "role_select"
          ? "Välj roll"
          : track!.label;

    const sectionNumber = isAiMapping ? 3 : step === "foundation" ? 1 : step === "role_select" ? 2 : 4;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {step === "foundation" ? `Fråga ${foundationStep + 1} av ${foundationCount}` : step === "role_select" ? "Välj din roll" : `Rollfråga ${roleQuestionIdx + 1} av 5`}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {step === "foundation" && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">{isAiMapping ? "🧠" : "🔹"}</span>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Steg {sectionNumber} – {sectionLabel}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  {foundationQuestions[foundationStep].question}
                </h2>
                <div className={`grid gap-3 ${isIndustryStep ? "grid-cols-1 sm:grid-cols-2" : ""}`}>
                  {foundationQuestions[foundationStep].options.map((opt) => {
                    const isSelected = foundationAnswers[foundationQuestions[foundationStep].id] === opt.label;
                    return (
                      <SelectionCard
                        key={opt.label}
                        label={opt.label}
                        selected={isSelected}
                        onClick={() => handleFoundationAnswer(opt.label)}
                        type="radio"
                      />
                    );
                  })}
                </div>
              </>
            )}

            {step === "role_select" && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">🔹</span>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Steg 2 – Välj roll</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Jag arbetar inom:</h2>
                <p className="text-sm text-muted-foreground mb-6">Härifrån anpassas analysen efter din roll med AI-spetsade frågor.</p>
                <div className="grid gap-3">
                  {roleTracks.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button key={t.id} onClick={() => handleRoleSelect(t.id)}
                        className={`w-full text-left rounded-lg border-2 px-5 py-4 transition-all duration-200 flex items-center gap-4 ${
                          selectedRole === t.id ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border bg-card hover:bg-muted/50 hover:border-primary/30"
                        }`}>
                        <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${t.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{t.label}</span>
                          <p className="text-xs text-muted-foreground">{t.measures}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === "role_questions" && track && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">{track.emoji}</span>
                  <span className={`text-sm font-semibold uppercase tracking-wide ${track.color}`}>{track.label}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  {track.questions[roleQuestionIdx].question}
                </h2>
                <div className="grid gap-3">
                  {track.questions[roleQuestionIdx].options.map((opt) => {
                    const isSelected = roleAnswers[track.questions[roleQuestionIdx].id] === opt.label;
                    return (
                      <SelectionCard key={opt.label} label={opt.label} selected={isSelected}
                        onClick={() => handleRoleAnswer(opt.label, opt.score)} type="radio" />
                    );
                  })}
                </div>
              </>
            )}

            <div className="flex items-center justify-between mt-8">
              <Button variant="ghost" onClick={goBackInQuiz} disabled={step === "foundation" && foundationStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Föregående
              </Button>
              <div />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════
  const scores = calcIndexScores(foundationAnswers, selectedRole!, roleScores);
  const profile = getProfile(scores);
  const pd = profileData[profile];
  const roadmap = generateRoadmap(selectedRole!, profile, foundationAnswers.system);
  const activeRisks = track!.risks.filter((r) => r.condition(scores));
  const partners = getPartnerSuggestions(selectedRole!, foundationAnswers.system, profile, foundationAnswers.industry);
  const sysTrack = getSystemTrack(foundationAnswers.system);
  const sysData = systemTrackData[sysTrack];
  const roi = calcROI(selectedRole!, scores, foundationAnswers.headcount);

  const impactDimensions = [
    { label: "Automation Impact", icon: Bot, value: scores.automation, desc: "Hur mycket repetitivt arbete kan automatiseras" },
    { label: "Prediction Impact", icon: Activity, value: scores.prediction, desc: "Hur mycket som kan bli mer förutsägbart" },
    { label: "Decision Augmentation", icon: Eye, value: scores.augmentation, desc: "Hur mycket beslutsstöd kan förbättras" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`AI Impact Assessment: ${pd.title} | d365.se`} description={pd.description.slice(0, 150)} canonicalPath="/ai-readiness" />
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-5xl mb-4 block">{pd.emoji}</span>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              AI-profil – {track!.label} {foundationAnswers.industry ? `| ${foundationAnswers.industry}` : ""}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{pd.title}</h1>
            <p className="text-lg text-muted-foreground">{pd.subtitle}</p>
          </div>

          <AnalysisDisclaimer />

          {/* 1️⃣ AI Effect Potential – 3 dimensions */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-8">
            <div className="bg-slate-800 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">🎯 AI-effektpotential</h3>
            </div>
            <div className="p-5 bg-background space-y-4">
              <p className="text-sm text-muted-foreground mb-2">{pd.description}</p>
              {impactDimensions.map((d) => {
                const DIcon = d.icon;
                return (
                  <div key={d.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="text-sm font-medium text-foreground">{d.label}</span>
                          <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">{d.desc}</span>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${getLevelTextColor(d.value)}`}>
                        {getImpactLabel(d.value)}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${getLevelColor(d.value)}`} style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                );
              })}
              {scores.governance > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">AI Governance</span>
                    </div>
                    <span className={`text-sm font-bold ${getLevelTextColor(scores.governance)}`}>
                      {getImpactLabel(scores.governance)}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${getLevelColor(scores.governance)}`} style={{ width: `${scores.governance}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2️⃣ ROI Estimate */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-emerald-700 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">💰 Uppskattad AI-effekt</h3>
            </div>
            <div className="p-5 bg-background">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center bg-muted/30 rounded-xl p-4 border border-border/50">
                  <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">~{roi.timeSavingPct}%</p>
                  <p className="text-xs text-muted-foreground">Tidsbesparing</p>
                </div>
                {roi.forecastImprovePct > 0 && (
                  <div className="text-center bg-muted/30 rounded-xl p-4 border border-border/50">
                    <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">~{roi.forecastImprovePct}%</p>
                    <p className="text-xs text-muted-foreground">Förbättrad prognosprecision</p>
                  </div>
                )}
                <div className="text-center bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <DollarSign className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-700">~{formatSEK(roi.annualSavingSEK)}</p>
                  <p className="text-xs text-emerald-600">Uppskattad årlig besparing</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                {track!.riskReduction}. Beräkningen är indikativ och baseras på branschgenomsnitt och antal anställda.
              </p>
            </div>
          </div>

          {/* 3️⃣ Role-specific AI Results */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className={`px-5 py-3 ${track!.headerBg}`}>
              <h3 className="font-bold text-white text-sm tracking-wide">⚡ AI-möjlighet inom {track!.label}</h3>
            </div>
            <div className="p-5 bg-background space-y-1">
              <p className="text-sm text-muted-foreground mb-4">Baserat på era svar finns potential inom:</p>
              {track!.aiResults.map((ar, i) => {
                const effect = getEffectLevel(scores, i);
                const badge = getEffectBadge(effect);
                const showD365Context = foundationAnswers.system === "Dynamics 365" || profile === "scaling";
                return (
                  <div key={ar.label} className="px-3 py-3 rounded-lg bg-muted/30 border border-border/50 mb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{ar.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ar.description}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    {showD365Context && (
                      <p className="text-xs text-muted-foreground/70 mt-2 italic flex items-start gap-1.5">
                        <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
                        {ar.d365Context}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4️⃣ System Recommendation */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-slate-700 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> Systemrekommendation
              </h3>
            </div>
            <div className="p-5 bg-background">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 ${
                sysTrack === "optimization" ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                : sysTrack === "transformation" ? "text-blue-600 bg-blue-50 border-blue-200"
                : "text-purple-600 bg-purple-50 border-purple-200"
              }`}>
                {sysData.emoji} {sysData.label}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{sysData.description}</p>
              <div className="bg-muted/40 rounded-lg p-4 border border-border/50">
                <p className="text-sm text-foreground font-medium mb-1">Rekommendation:</p>
                <p className="text-sm text-muted-foreground">{sysData.recommendation}</p>
              </div>
              <p className="text-xs text-muted-foreground/60 italic mt-4 flex items-start gap-1.5">
                <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
                För organisationer som använder moderna plattformar som Microsoft Dynamics 365 finns många av dessa AI-funktioner redan integrerade via Copilot och inbyggd prediktiv analys.
              </p>
            </div>
          </div>

          {/* Risk areas */}
          {activeRisks.length > 0 && (
            <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
              <div className="bg-red-600 px-5 py-3">
                <h3 className="font-bold text-white text-sm tracking-wide">⚠️ Riskområden</h3>
              </div>
              <div className="p-5 bg-background space-y-3">
                {activeRisks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{risk.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended next step */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-emerald-600 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">🧭 Rekommenderat nästa steg</h3>
            </div>
            <div className="p-5 bg-background space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${
                profile === "scaling" ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                : profile === "structurally_ready" ? "text-amber-600 bg-amber-50 border-amber-200"
                : "text-red-600 bg-red-50 border-red-200"
              }`}>
                {pd.emoji} {pd.title}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {profile === "scaling" && (
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Identifiera de 2–3 processer där AI ger störst ROI</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Breddinför Copilot och testa autonoma agenter</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Mät och kommunicera resultat internt</li>
                  </ul>
                )}
                {profile === "structurally_ready" && (
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> Välj en process med hög repetitiv belastning</li>
                    <li className="flex items-start gap-2"><Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> Säkerställ datakvalitet i det området</li>
                    <li className="flex items-start gap-2"><Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> Starta ett avgränsat pilotprojekt</li>
                  </ul>
                )}
                {profile === "exploring" && (
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Process- och datagrund före AI-skalning</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Kartlägg nuvarande datalandskap och processägarskap</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Etablera grundläggande systemstöd och governance</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* 12-month Roadmap */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-slate-700 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">🗓️ 12-månaders AI-roadmap – {track!.label}</h3>
            </div>
            <div className="p-5 bg-background">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Q1", period: "Månad 1–3", data: roadmap.q1, color: "border-l-blue-500" },
                  { label: "Q2", period: "Månad 4–6", data: roadmap.q2, color: "border-l-emerald-500" },
                  { label: "Q3", period: "Månad 7–9", data: roadmap.q3, color: "border-l-amber-500" },
                  { label: "Q4", period: "Månad 10–12", data: roadmap.q4, color: "border-l-purple-500" },
                ].map((q) => (
                  <div key={q.label} className={`border-l-4 ${q.color} pl-4 py-2`}>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{q.label} <span className="font-normal">({q.period})</span></p>
                    <p className="text-sm text-foreground mt-1">{q.data.text}</p>
                  </div>
                ))}
              </div>
              {roadmap.q4.d365Note && (
                <p className="text-xs text-muted-foreground/60 italic mt-5 pt-4 border-t border-border/50 flex items-start gap-1.5">
                  <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
                  {roadmap.q4.d365Note}
                </p>
              )}
            </div>
          </div>

          {/* Partner matching */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-primary px-5 py-3">
              <h3 className="font-bold text-primary-foreground text-sm tracking-wide">🤝 Rekommenderad partnertyp</h3>
            </div>
            <div className="p-5 bg-background space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Baserat på roll, bransch och mognadsnivå rekommenderas en partner med följande profil:
              </p>
              {partners.map((p, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-3 rounded-lg bg-muted/30 border border-border/50">
                  <span className="text-xl flex-shrink-0">{p.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.type}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                </div>
              ))}
              <div className="text-center mt-5 pt-4 border-t border-border/50">
                <Link to="/valj-partner">
                  <Button variant="outline" className="gap-2">
                    Se matchande partners <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="rounded-lg border bg-muted/30 p-6 mt-8 text-center">
            <p className="text-foreground font-medium italic text-lg">
              "AI misslyckas sällan på grund av teknik.
              <br />
              Det misslyckas på grund av otydliga processer och brist på ägarskap."
            </p>
          </div>

          {/* Report form */}
          {!showReportForm && !submitted && (
            <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 sm:p-8 text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Ladda ner din AI Impact-rapport som PDF</h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto text-sm">
                  En professionell 4-sidig rapport med:
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto mb-6 text-xs text-muted-foreground">
                  <span className="bg-muted/50 rounded px-2 py-1">📄 Executive Summary + ROI</span>
                  <span className="bg-muted/50 rounded px-2 py-1">⚡ AI-potential per område</span>
                  <span className="bg-muted/50 rounded px-2 py-1">⚠️ Riskanalys & roadmap</span>
                  <span className="bg-muted/50 rounded px-2 py-1">🤝 Partnermatchning</span>
                </div>
                <Button size="lg" onClick={() => setShowReportForm(true)}>
                  <Download className="mr-2 h-4 w-4" /> Ladda ner rapport
                </Button>
              </CardContent>
            </Card>
          )}

          {showReportForm && !submitted && (
            <Card className="mt-8 border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 text-center">Fyll i dina uppgifter</h3>
                <div className="grid gap-4 max-w-md mx-auto">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Namn *</label>
                    <Input value={reportForm.name} onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })} placeholder="Ditt namn" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Företag *</label>
                    <Input value={reportForm.company} onChange={(e) => setReportForm({ ...reportForm, company: e.target.value })} placeholder="Företagsnamn" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Roll</label>
                    <Input value={reportForm.role} onChange={(e) => setReportForm({ ...reportForm, role: e.target.value })} placeholder="T.ex. CFO, IT-chef" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">E-post *</label>
                    <Input type="email" value={reportForm.email} onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })} placeholder="din@epost.se" />
                  </div>
                  <Button className="w-full mt-2" size="lg" onClick={handleReportSubmit} disabled={submitting}>
                    {submitting ? "Skickar..." : "Ladda ner PDF-rapport"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Vi delar aldrig dina uppgifter. Läs vår <Link to="/dataskydd" className="underline">integritetspolicy</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {submitted && (
            <Card className="mt-8 border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <Check className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Tack! Din PDF-rapport har laddats ner.</h3>
                <p className="text-muted-foreground">Vi har också sparat dina uppgifter och kan kontakta dig vid behov.</p>
                <Button variant="outline" className="mt-4" onClick={generatePDF}>
                  <Download className="mr-2 h-4 w-4" /> Ladda ner igen
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-8">
            <Button variant="ghost" onClick={resetAll}>Gör om analysen</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIReadiness;
