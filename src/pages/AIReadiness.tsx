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

type RoleId = "it" | "sales" | "marketing" | "finance" | "project" | "logistics";
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
    question: "Vilket affärssystem använder ni idag?",
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
  };

  // Team size estimate per headcount bracket
  const teamSizeMap: Record<string, Record<RoleId, number>> = {
    "1–49 anställda": { sales: 3, finance: 2, it: 2, marketing: 2, project: 3, logistics: 3 },
    "50–249 anställda": { sales: 8, finance: 5, it: 5, marketing: 4, project: 6, logistics: 8 },
    "250–999 anställda": { sales: 20, finance: 12, it: 12, marketing: 8, project: 15, logistics: 20 },
    "1 000+ anställda": { sales: 50, finance: 25, it: 25, marketing: 15, project: 30, logistics: 50 },
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
  const totalSteps = foundationCount + 1 + 5;
  const currentProgress =
    step === "foundation" ? foundationStep + 1
    : step === "role_select" ? foundationCount + 1
    : step === "role_questions" ? foundationCount + 1 + roleQuestionIdx + 1
    : step === "result" ? totalSteps
    : 0;
  const progressPct = (currentProgress / totalSteps) * 100;

  // ─── Foundation handlers ─────────────────────────────
  const handleFoundationAnswer = (label: string) => {
    const key = foundationQuestions[foundationStep].id;
    setFoundationAnswers({ ...foundationAnswers, [key]: label });

    setTimeout(() => {
      if (foundationStep < foundationCount - 1) {
        setFoundationStep(foundationStep + 1);
      } else {
        setStep("role_select");
      }
    }, 300);
  };

  const handleRoleSelect = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setRoleQuestionIdx(0);
    setRoleAnswers({});
    setRoleScores({});
    setTimeout(() => setStep("role_questions"), 300);
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
      setStep("role_select");
    } else if (step === "role_select") {
      setFoundationStep(foundationCount - 1);
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

    const lm = 20;
    const pw = 170;
    let y = 0;

    const addHeader = (title: string) => {
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 28, "F");
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(title, lm, 18);
      doc.setTextColor(0, 0, 0);
      y = 40;
    };

    const addSectionTitle = (title: string) => {
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(title, lm, y);
      y += 8;
    };

    const addText = (text: string, indent = 0) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(text, pw - indent);
      doc.text(lines, lm + indent, y);
      y += lines.length * 5 + 2;
    };

    // ═══ PAGE 1: Executive Summary ═══
    addHeader("AI Impact & Readiness Assessment – Executive Summary");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Datum: ${new Date().toLocaleDateString("sv-SE")}`, lm, y);
    if (reportForm.company) { doc.text(`Foretag: ${reportForm.company}`, lm + 80, y); }
    y += 8;

    const summaryItems = [
      { label: "Roll", value: track!.label },
      { label: "Bransch", value: foundationAnswers.industry || "Ej angiven" },
      { label: "Storlek", value: foundationAnswers.headcount },
      { label: "System", value: foundationAnswers.system },
      { label: "Systemspar", value: sysData.label },
      { label: "AI-profil", value: pd.title },
    ];

    summaryItems.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(item.label + ":", lm, y);
      doc.setFont("helvetica", "normal");
      doc.text(item.value, lm + 40, y);
      y += 6;
    });
    y += 5;

    // AI Impact overview
    addSectionTitle("AI-effektpotential");
    const impactItems = [
      { label: "Automation Impact", value: getImpactLabel(scores.automation) },
      { label: "Prediction Impact", value: getImpactLabel(scores.prediction) },
      { label: "Decision Augmentation", value: getImpactLabel(scores.augmentation) },
    ];
    impactItems.forEach((item) => {
      doc.setFontSize(10);
      doc.text(`${item.label}: ${item.value}`, lm + 3, y);
      y += 6;
    });
    y += 3;

    addSectionTitle("Uppskattad AI-effekt");
    addText(`Tidsbesparing: ~${roi.timeSavingPct}%`);
    if (roi.forecastImprovePct > 0) {
      addText(`Forbattrad prognosprecision: ~${roi.forecastImprovePct}%`);
    }
    addText(`Uppskattad arlig besparing: ~${formatSEK(roi.annualSavingSEK)}`);
    addText(track!.riskReduction);
    y += 3;

    addSectionTitle("3 viktigaste insikterna");
    const insights: string[] = [];
    if (scores.automation >= 60) insights.push("Hog automationspotential – repetitiva processer kan effektiviseras med AI");
    else insights.push("Automation redan delvis pa plats – fokusera pa avancerade AI-anvandningsfall");
    if (scores.prediction >= 55) insights.push("Tydlig potential for prediktiv AI – historisk data kan ge battre prognoser");
    else insights.push("Prediktiv kapacitet finns – vidareutveckla med mer strukturerad data");
    if (scores.augmentation >= 55) insights.push("AI kan markbart forbattra beslutsstod och insikter i er roll");
    else insights.push("Beslutsstod ar redan relativt starkt – overväg avancerad AI-analys");

    insights.forEach((insight) => {
      doc.text(`- ${insight}`, lm + 3, y);
      y += 6;
    });

    // ═══ PAGE 2: AI potential per area ═══
    doc.addPage();
    addHeader(`AI-potential inom ${track!.label}`);

    addText("Baserat pa era svar finns foljande AI-mojligheter:");
    y += 2;

    track!.aiResults.forEach((ar, i) => {
      const effect = getEffectLevel(scores, i);
      const badge = getEffectBadge(effect);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(ar.label, lm, y);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`[${badge.label}]`, lm + 100, y);
      y += 5;
      addText(ar.description, 3);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const ctxLines = doc.splitTextToSize(ar.d365Context, pw - 10);
      doc.text(ctxLines, lm + 3, y);
      y += ctxLines.length * 4 + 4;
      doc.setTextColor(0, 0, 0);
    });

    y += 5;
    addSectionTitle("Systemrekommendation");
    addText(`${sysData.label}: ${sysData.description}`);

    // ═══ PAGE 3: Risk areas ═══
    doc.addPage();
    addHeader("Riskanalys");

    if (activeRisks.length > 0) {
      activeRisks.forEach((risk) => {
        doc.setFontSize(10);
        doc.text(`! ${risk.text}`, lm + 3, y);
        y += 8;
      });
    } else {
      addText("Inga kritiska riskomraden identifierades. Grunden ar stabil.");
    }
    y += 5;

    addSectionTitle("Generella observationer");
    if (scores.automation >= 60) addText("– Hog andel repetitivt arbete – AI-automatisering kan ge snabb effekt");
    if (scores.augmentation >= 60) addText("– Beslut baseras ofta pa magkansla – AI-beslutsst kan ge markbar forbattring");
    if (scores.prediction >= 60) addText("– Avvikelser upptacks sent – prediktiv AI kan forbattra reaktionstiden");
    if (scores.governance >= 60) addText("– Avsaknad av AI-governance okar risken for okontrollerade initiativ");

    y += 8;
    addSectionTitle("Rekommenderad partnertyp");
    addText("Baserat pa roll, bransch och mognadsniva rekommenderas en partner med foljande profil:");
    y += 2;
    partners.forEach((p) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${p.icon} ${p.type}`, lm + 3, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(p.description, pw - 10);
      doc.text(descLines, lm + 8, y);
      y += descLines.length * 4 + 4;
    });

    // ═══ PAGE 4: 12-month Roadmap ═══
    doc.addPage();
    addHeader(`12-manaders AI-roadmap – ${track!.label}`);

    [
      { label: "Kvartal 1 (Manad 1-3)", data: roadmap.q1 },
      { label: "Kvartal 2 (Manad 4-6)", data: roadmap.q2 },
      { label: "Kvartal 3 (Manad 7-9)", data: roadmap.q3 },
      { label: "Kvartal 4 (Manad 10-12)", data: roadmap.q4 },
    ].forEach((q) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(q.label, lm, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(q.data.text, pw - 8);
      doc.text(lines, lm + 5, y);
      y += lines.length * 5 + 8;
    });

    y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    const footNote = roadmap.q4.d365Note || "";
    if (footNote) {
      const fnLines = doc.splitTextToSize(footNote, pw);
      doc.text(fnLines, lm, y);
      y += fnLines.length * 4 + 5;
    }
    doc.setTextColor(0, 0, 0);

    y += 5;
    doc.setDrawColor(200);
    doc.line(lm, y, lm + pw, y);
    y += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    const disc = "Denna analys ar vagledande och baseras pa de svar du angivit. Den ersatter inte en fullstandig forstudie. Uppskattade besparingar ar indikativa och baseras pa branschgenomsnitt. Vi rekommenderar att du diskuterar dina behov med en kvalificerad Microsoft-partner.";
    const discLines = doc.splitTextToSize(disc, pw);
    doc.text(discLines, lm, y);
    y += discLines.length * 4 + 5;
    doc.setFont("helvetica", "normal");
    doc.text("d365.se – Oberoende guide till Dynamics 365 i Sverige", lm, y);

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

    // Determine which section label
    const isAiMapping = step === "foundation" && foundationStep >= 3;
    const sectionLabel = isAiMapping
      ? "AI-kartläggning"
      : step === "foundation"
        ? "Grundval"
        : step === "role_select"
          ? "Välj roll"
          : track!.label;

    const sectionNumber = isAiMapping ? 2 : step === "foundation" ? 1 : step === "role_select" ? 3 : 3;

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
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Steg 3 – Välj roll</span>
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
