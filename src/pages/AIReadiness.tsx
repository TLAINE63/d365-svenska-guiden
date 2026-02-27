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
} from "lucide-react";
import SelectionCard from "@/components/SelectionCard";
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ─── TYPES ───────────────────────────────────────────────

type RoleId = "it" | "sales" | "marketing" | "finance" | "project" | "logistics";
type IndexId = "ai_potential" | "data_maturity" | "process_stability" | "org_readiness";
type ProfileId = "exploring" | "structurally_ready" | "scaling";
type SystemTrack = "optimization" | "transformation" | "strategy";

interface FoundationAnswers {
  system: string;
  maturity: string;
  goal: string;
  industry: string;
}

interface IndexedQuestion {
  id: string;
  question: string;
  index: IndexId;
  options: { label: string; score: number }[];
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
  aiPotentials: { label: string; description: string; d365Context: string }[];
  risks: { condition: (scores: IndexScores) => boolean; text: string }[];
}

interface IndexScores {
  ai_potential: number;
  data_maturity: number;
  process_stability: number;
  org_readiness: number;
}

// ─── SYSTEM TRACK LOGIC ─────────────────────────────────

function getSystemTrack(system: string): SystemTrack {
  if (system === "Dynamics 365") return "optimization";
  if (system === "Oklart / blandat") return "strategy";
  return "transformation"; // "Annat ERP/CRM" or "Flera system"
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
    description: "Er systemsituation är oklar, vilket ofta indikerar att en strategisk kartläggning behövs innan AI-initiativ startas. Rätt beslut nu sparar betydande tid och resurser längre fram.",
    recommendation: "Börja med att kartlägga ert nuvarande systemlandskap och identifiera var AI kan ge störst effekt. En kvalificerad partner kan hjälpa er navigera alternativen.",
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

// ─── FOUNDATION QUESTIONS ────────────────────────────────

const foundationQuestions: { id: keyof FoundationAnswers; question: string; index: IndexId | null; options: { label: string; score: number }[] }[] = [
  {
    id: "system",
    question: "Vilket affärssystem använder ni idag?",
    index: "data_maturity",
    options: [
      { label: "Dynamics 365", score: 3 },
      { label: "Annat ERP/CRM", score: 2 },
      { label: "Flera system", score: 1 },
      { label: "Oklart / blandat", score: 0 },
    ],
  },
  {
    id: "maturity",
    question: "Hur upplever ni er digitala mognad?",
    index: "process_stability",
    options: [
      { label: "Mycket hög", score: 3 },
      { label: "Stabil", score: 2 },
      { label: "Fragmenterad", score: 1 },
      { label: "Efter", score: 0 },
    ],
  },
  {
    id: "goal",
    question: "Vad är ert huvudsakliga mål med AI?",
    index: "org_readiness",
    options: [
      { label: "Effektivisering", score: 3 },
      { label: "Tillväxt", score: 3 },
      { label: "Bättre beslutsstöd", score: 3 },
      { label: "Kostnadsbesparing", score: 2 },
      { label: "Utforskar", score: 1 },
    ],
  },
  {
    id: "industry",
    question: "Vilken bransch verkar ni inom?",
    index: null,
    options: industryOptions.map((i) => ({ label: i, score: 0 })),
  },
];

// ─── ROLE TRACKS ─────────────────────────────────────────

const roleTracks: RoleTrack[] = [
  {
    id: "it",
    label: "IT",
    emoji: "🔵",
    icon: Monitor,
    color: "text-blue-600",
    headerBg: "bg-blue-600",
    measures: "Teknisk förutsättning + governance",
    questions: [
      { id: "it_api", question: "Har ni API-struktur och integrationsplattform?", index: "data_maturity", options: [{ label: "Ja, dokumenterad och aktiv", score: 3 }, { label: "Delvis, men ofullständig", score: 2 }, { label: "Nej", score: 0 }] },
      { id: "it_data", question: "Är er data centraliserad eller silobaserad?", index: "data_maturity", options: [{ label: "Centraliserad med gemensam datamodell", score: 3 }, { label: "Delvis centraliserad", score: 2 }, { label: "Silobaserad", score: 0 }] },
      { id: "it_ownership", question: "Har ni tydligt dataägarskap?", index: "process_stability", options: [{ label: "Ja, definierat och efterlevt", score: 3 }, { label: "Delvis", score: 1 }, { label: "Nej", score: 0 }] },
      { id: "it_governance", question: "Har ni AI-policy / governance?", index: "org_readiness", options: [{ label: "Ja, formaliserad", score: 3 }, { label: "Under utveckling", score: 2 }, { label: "Nej", score: 0 }] },
      { id: "it_testenv", question: "Har ni testmiljö för innovation?", index: "ai_potential", options: [{ label: "Ja, dedikerad sandbox", score: 3 }, { label: "Delvis", score: 1 }, { label: "Nej", score: 0 }] },
    ],
    aiPotentials: [
      { label: "API-orchestration & automation", description: "Automatisera systemintegrationer och dataflöden med AI", d365Context: "Dynamics 365 erbjuder inbyggda API:er och Power Platform-integrationer för detta" },
      { label: "Data mesh / centralisering", description: "AI-driven datakvalitet och masterdatahantering", d365Context: "Dataverse i Dynamics 365 ger en enhetlig datamodell som grund" },
      { label: "AI governance framework", description: "Strukturerat ramverk för ansvarsfull AI-användning", d365Context: "Microsoft Responsible AI-ramverket är integrerat i plattformen" },
      { label: "Innovation sandbox", description: "Säker miljö för att testa och validera AI-initiativ", d365Context: "Sandbox-miljöer och Power Platform ger en trygg experimentyta" },
    ],
    risks: [
      { condition: (s) => s.data_maturity < 40, text: "Silobaserad data begränsar AI:s förmåga att ge insikter tvärs system" },
      { condition: (s) => s.org_readiness < 40, text: "Avsaknad av AI-governance ökar risk för okontrollerade initiativ" },
      { condition: (s) => s.process_stability < 40, text: "Otydligt dataägarskap gör det svårt att säkerställa datakvalitet" },
    ],
  },
  {
    id: "sales",
    label: "Försäljning",
    emoji: "🟢",
    icon: TrendingUp,
    color: "text-green-600",
    headerBg: "bg-green-600",
    measures: "Automationspotential + datakvalitet + pipeline-struktur",
    questions: [
      { id: "sales_admin", question: "Hur mycket tid lägger säljare på administration?", index: "ai_potential", options: [{ label: "Under 20%", score: 3 }, { label: "20–40%", score: 2 }, { label: "Över 40%", score: 1 }] },
      { id: "sales_pipeline", question: "Är pipeline konsekvent uppdaterad?", index: "process_stability", options: [{ label: "Ja, i realtid", score: 3 }, { label: "Delvis, varierar mellan säljare", score: 2 }, { label: "Nej, sporadiskt", score: 0 }] },
      { id: "sales_history", question: "Finns historisk affärsdata?", index: "data_maturity", options: [{ label: "Ja, 2+ år strukturerad data", score: 3 }, { label: "Ja, men ofullständig", score: 2 }, { label: "Begränsat", score: 0 }] },
      { id: "sales_comms", question: "Har ni strukturerad kundkommunikation?", index: "data_maturity", options: [{ label: "Ja, loggad i CRM", score: 3 }, { label: "Delvis", score: 2 }, { label: "Nej, mestadels i mejl/telefon", score: 0 }] },
      { id: "sales_kpi", question: "Har ni tydliga KPI:er per säljare?", index: "org_readiness", options: [{ label: "Ja, med regelbunden uppföljning", score: 3 }, { label: "Ja, men inte konsekvent", score: 2 }, { label: "Nej", score: 0 }] },
    ],
    aiPotentials: [
      { label: "Lead scoring", description: "AI rangordnar leads baserat på köpsannolikhet och historik", d365Context: "I en modern CRM-plattform som Dynamics 365 Sales är detta inbyggt via Copilot" },
      { label: "Mötessammanfattning", description: "Automatisk sammanfattning och CRM-uppdatering efter möten", d365Context: "Copilot i Dynamics 365 sammanfattar möten och uppdaterar CRM automatiskt" },
      { label: "Next-best-action", description: "AI föreslår nästa steg baserat på affärsfas och kundbeteende", d365Context: "Dynamics 365 Sales erbjuder AI-drivna rekommendationer per affär" },
      { label: "Prognosförbättring", description: "Pipeline-prognoser baserade på data istället för magkänsla", d365Context: "Prediktiv prognos är en inbyggd funktion i Dynamics 365 Sales" },
    ],
    risks: [
      { condition: (s) => s.data_maturity < 40, text: "Datakvalitet riskerar att begränsa precision i lead scoring och prognoser" },
      { condition: (s) => s.process_stability < 40, text: "Inkonsekvent pipeline-disciplin gör prediktiv AI opålitlig" },
      { condition: (s) => s.org_readiness < 40, text: "Utan tydliga KPI:er går det inte att mäta AI:s faktiska effekt" },
    ],
  },
  {
    id: "marketing",
    label: "Marknad",
    emoji: "🟣",
    icon: Megaphone,
    color: "text-purple-600",
    headerBg: "bg-purple-600",
    measures: "Datadriven marknadsföring + segmentering",
    questions: [
      { id: "mkt_segment", question: "Har ni segmenterad kunddata?", index: "data_maturity", options: [{ label: "Ja, dynamiska segment", score: 3 }, { label: "Ja, manuella segment", score: 2 }, { label: "Nej", score: 0 }] },
      { id: "mkt_automation", question: "Använder ni marketing automation?", index: "process_stability", options: [{ label: "Ja, med flöden och scoring", score: 3 }, { label: "Grundläggande e-postutskick", score: 1 }, { label: "Nej", score: 0 }] },
      { id: "mkt_roi", question: "Spårar ni kampanj-ROI?", index: "ai_potential", options: [{ label: "Ja, end-to-end attribution", score: 3 }, { label: "Delvis, manuella rapporter", score: 2 }, { label: "Nej", score: 0 }] },
      { id: "mkt_integration", question: "Är CRM och marknadssystem integrerade?", index: "data_maturity", options: [{ label: "Ja, sömlöst", score: 3 }, { label: "Delvis, manuell synk", score: 1 }, { label: "Nej, separata system", score: 0 }] },
      { id: "mkt_content", question: "Produceras innehåll strukturerat?", index: "process_stability", options: [{ label: "Ja, med content calendar och process", score: 3 }, { label: "Delvis", score: 2 }, { label: "Ad hoc", score: 0 }] },
    ],
    aiPotentials: [
      { label: "Automatiserad innehållsgenerering", description: "AI skapar anpassat innehåll per segment och kanal", d365Context: "Copilot i Customer Insights genererar segmentanpassade budskap" },
      { label: "Segmentoptimering", description: "Dynamiska segment baserade på beteende och intent-data", d365Context: "Customer Insights skapar AI-drivna segment automatiskt" },
      { label: "Prediktiv kampanjanalys", description: "AI optimerar budget och kanalval i realtid", d365Context: "Customer Insights erbjuder prediktiv analys av kampanjeffekt" },
      { label: "Personaliserad kommunikation", description: "Individuellt anpassade budskap i stor skala", d365Context: "Journey orchestration i Customer Insights möjliggör detta i stor skala" },
    ],
    risks: [
      { condition: (s) => s.data_maturity < 40, text: "Fragmenterad kunddata gör segmentering och personalisering opålitlig" },
      { condition: (s) => s.process_stability < 40, text: "Utan marketing automation saknas infrastruktur för AI-drivna flöden" },
      { condition: (s) => s.ai_potential < 40, text: "Utan kampanj-ROI-mätning går det inte att optimera med AI" },
    ],
  },
  {
    id: "finance",
    label: "Ekonomi",
    emoji: "🟡",
    icon: Calculator,
    color: "text-yellow-600",
    headerBg: "bg-yellow-600",
    measures: "Transaktionsstruktur + analysförmåga",
    questions: [
      { id: "fin_ap", question: "Hur automatiserad är er leverantörsreskontra?", index: "process_stability", options: [{ label: "Hög grad av automation", score: 3 }, { label: "Delvis automatiserad", score: 2 }, { label: "Manuell", score: 0 }] },
      { id: "fin_close", question: "Hur lång tid tar månadsbokslut?", index: "process_stability", options: [{ label: "1–3 dagar", score: 3 }, { label: "4–7 dagar", score: 2 }, { label: "Mer än en vecka", score: 0 }] },
      { id: "fin_forecast", question: "Har ni realtidsprognoser?", index: "ai_potential", options: [{ label: "Ja, löpande uppdaterade", score: 3 }, { label: "Kvartalsvis", score: 2 }, { label: "Nej", score: 0 }] },
      { id: "fin_anomaly", question: "Identifieras avvikelser manuellt?", index: "data_maturity", options: [{ label: "Nej, automatiserat", score: 3 }, { label: "Delvis automatiserat", score: 2 }, { label: "Ja, helt manuellt", score: 0 }] },
      { id: "fin_reports", question: "Finns standardiserade rapporter?", index: "data_maturity", options: [{ label: "Ja, med dashboards", score: 3 }, { label: "Ja, men manuella", score: 2 }, { label: "Nej, ad hoc", score: 0 }] },
    ],
    aiPotentials: [
      { label: "Avvikelseidentifiering", description: "AI upptäcker anomalier i transaktioner automatiskt", d365Context: "Dynamics 365 Finance erbjuder inbyggd avvikelsedetektering via Copilot" },
      { label: "Kassaflödesprognoser", description: "Realtidsprognoser baserade på historik och mönster", d365Context: "Cash flow forecasting är en inbyggd AI-funktion i Dynamics 365 Finance" },
      { label: "Automatiserad matchning", description: "AI matchar fakturor, betalningar och order", d365Context: "Intelligent fakturamatchning automatiserar detta i Dynamics 365" },
      { label: "Bokslutsagenter", description: "Autonoma agenter som assisterar vid periodavslut", d365Context: "AI-agenter i Finance kan automatisera delar av bokslutsprocessen" },
    ],
    risks: [
      { condition: (s) => s.process_stability < 40, text: "Manuella bokslutsprocesser gör det svårt att införa AI-automatisering" },
      { condition: (s) => s.data_maturity < 40, text: "Utan strukturerade rapporter saknas datagrund för AI-prognoser" },
      { condition: (s) => s.ai_potential < 40, text: "Avsaknad av prognosprocess begränsar möjligheten att utnyttja prediktiv AI" },
    ],
  },
  {
    id: "project",
    label: "Projekt",
    emoji: "🟠",
    icon: FolderKanban,
    color: "text-orange-600",
    headerBg: "bg-orange-600",
    measures: "Resursstyrning + prognosprecision",
    questions: [
      { id: "proj_forecast", question: "Hur exakt är era projektprognoser?", index: "ai_potential", options: [{ label: "Inom 10% avvikelse", score: 3 }, { label: "Inom 20% avvikelse", score: 2 }, { label: "Stor variation", score: 0 }] },
      { id: "proj_data", question: "Uppdateras projektdata löpande?", index: "data_maturity", options: [{ label: "Ja, i realtid", score: 3 }, { label: "Veckovis", score: 2 }, { label: "Sporadiskt", score: 0 }] },
      { id: "proj_profit", question: "Spåras lönsamhet i realtid?", index: "data_maturity", options: [{ label: "Ja, per projekt", score: 3 }, { label: "Ja, men manuellt", score: 2 }, { label: "Nej", score: 0 }] },
      { id: "proj_risk", question: "Identifieras risker proaktivt?", index: "process_stability", options: [{ label: "Ja, med tidiga varningsindikatorer", score: 3 }, { label: "Delvis, vid milstolpar", score: 2 }, { label: "Nej, reaktivt", score: 0 }] },
      { id: "proj_resource", question: "Är resurser över- eller underallokerade?", index: "org_readiness", options: [{ label: "Optimerad resursallokering", score: 3 }, { label: "Viss obalans", score: 2 }, { label: "Stor obalans", score: 0 }] },
    ],
    aiPotentials: [
      { label: "Riskprediktion", description: "AI identifierar riskprojekt innan de spårar ur", d365Context: "Dynamics 365 Project Operations erbjuder AI-driven riskanalys" },
      { label: "Resursoptimering", description: "Intelligent allokering baserat på kompetens och kapacitet", d365Context: "Resursschemaläggning med AI-stöd finns i Project Operations" },
      { label: "Marginalanalys", description: "Löpande marginalprognos per projekt", d365Context: "Realtidsmarginaler beräknas automatiskt i Project Operations" },
      { label: "Automatiserad statusrapportering", description: "AI sammanställer status från projektdata", d365Context: "Copilot kan generera projektstatusrapporter automatiskt" },
    ],
    risks: [
      { condition: (s) => s.data_maturity < 40, text: "Sporadisk datainsamling gör prediktiv analys opålitlig" },
      { condition: (s) => s.process_stability < 40, text: "Avsaknad av proaktiv riskhantering ökar projektrisken" },
      { condition: (s) => s.org_readiness < 40, text: "Obalanserad resursallokering tyder på svag styrning" },
    ],
  },
  {
    id: "logistics",
    label: "Logistik / Supply Chain",
    emoji: "🔵",
    icon: Truck,
    color: "text-cyan-600",
    headerBg: "bg-cyan-600",
    measures: "Prognos, lagerstruktur, reaktivitet",
    questions: [
      { id: "log_forecast", question: "Hur ofta justeras lagerprognoser?", index: "process_stability", options: [{ label: "Dagligen / automatiserat", score: 3 }, { label: "Veckovis", score: 2 }, { label: "Sällan / ad hoc", score: 0 }] },
      { id: "log_history", question: "Finns historisk efterfrågedata?", index: "data_maturity", options: [{ label: "Ja, 2+ år strukturerad", score: 3 }, { label: "Ja, men ofullständig", score: 2 }, { label: "Begränsat", score: 0 }] },
      { id: "log_overstock", question: "Uppstår ofta överlager?", index: "ai_potential", options: [{ label: "Sällan, proaktiv styrning", score: 3 }, { label: "Ibland", score: 2 }, { label: "Regelbundet", score: 0 }] },
      { id: "log_anomaly", question: "Hanteras avvikelser manuellt?", index: "data_maturity", options: [{ label: "Nej, automatiserat", score: 3 }, { label: "Delvis", score: 2 }, { label: "Ja, helt manuellt", score: 0 }] },
      { id: "log_delivery", question: "Har ni leveransprecision över 95%?", index: "process_stability", options: [{ label: "Ja, konsekvent", score: 3 }, { label: "Varierar", score: 2 }, { label: "Under 90%", score: 0 }] },
    ],
    aiPotentials: [
      { label: "Efterfrågeprognoser", description: "AI-drivna prognoser baserade på historik och externa signaler", d365Context: "Demand forecasting är inbyggt i Dynamics 365 Supply Chain Management" },
      { label: "Lageroptimering", description: "Automatiserad beställningspunktsberäkning och säkerhetslager", d365Context: "AI-driven lageroptimering finns i Supply Chain Management" },
      { label: "Avvikelsedetektion", description: "AI flaggar anomalier i leverans- och lagermönster", d365Context: "Proaktiva notifieringar och anomalidetektering via Copilot" },
      { label: "Leveransriskanalys", description: "Prediktiv analys av leverantörs- och transportrisker", d365Context: "Supply risk assessment-funktioner i Dynamics 365" },
    ],
    risks: [
      { condition: (s) => s.data_maturity < 40, text: "Otillräcklig historisk data begränsar prognosens träffsäkerhet" },
      { condition: (s) => s.process_stability < 40, text: "Oregelbunden prognosprocess minskar AI:s effekt" },
      { condition: (s) => s.ai_potential < 40, text: "Återkommande överlager tyder på manuella processer som AI kan förbättra" },
    ],
  },
];

// ─── SCORING ─────────────────────────────────────────────

function calcIndexScores(
  foundationAnswers: FoundationAnswers,
  role: RoleId,
  roleScoreMap: Record<string, number>
): IndexScores {
  const track = roleTracks.find((t) => t.id === role)!;

  const indexPoints: Record<IndexId, number[]> = {
    ai_potential: [],
    data_maturity: [],
    process_stability: [],
    org_readiness: [],
  };

  foundationQuestions.forEach((fq) => {
    if (!fq.index) return;
    const answer = foundationAnswers[fq.id];
    const opt = fq.options.find((o) => o.label === answer);
    if (opt) indexPoints[fq.index].push(opt.score);
  });

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
    ai_potential: calcPct(indexPoints.ai_potential),
    data_maturity: calcPct(indexPoints.data_maturity),
    process_stability: calcPct(indexPoints.process_stability),
    org_readiness: calcPct(indexPoints.org_readiness),
  };
}

function getProfile(scores: IndexScores): ProfileId {
  const avg = (scores.ai_potential + scores.data_maturity + scores.process_stability + scores.org_readiness) / 4;
  const structureAvg = (scores.data_maturity + scores.process_stability) / 2;

  if (avg >= 65 && structureAvg >= 55) return "scaling";
  if (avg >= 35 || structureAvg >= 45) return "structurally_ready";
  return "exploring";
}

const profileData: Record<ProfileId, { emoji: string; color: string; title: string; subtitle: string; description: string }> = {
  exploring: {
    emoji: "🔴",
    color: "text-red-600",
    title: "Utforskande fas",
    subtitle: "Hög potential – låg struktur",
    description: "Ni har ambitioner och ser AI:s potential, men datakvalitet, processer och governance behöver stärkas innan AI kan ge verklig effekt. Risken är att initiativ ger begränsat resultat utan denna grund.",
  },
  structurally_ready: {
    emoji: "🟠",
    color: "text-amber-600",
    title: "Strukturellt redo",
    subtitle: "Stabil grund – begränsad AI-implementation",
    description: "Ni har en fungerande grund med rimlig datakvalitet och processer. Fokusera på ett avgränsat pilotprojekt i den funktion där AI kan ge störst och snabbast effekt.",
  },
  scaling: {
    emoji: "🟢",
    color: "text-emerald-600",
    title: "Skalningsfas",
    subtitle: "Struktur + datamognad + mandat",
    description: "Ni har den datagrund, processstruktur och det organisatoriska mandat som krävs. Fokus bör vara breddinförande av AI och autonoma agenter för att accelerera verksamheten.",
  },
};

// ─── EFFECT LEVEL ────────────────────────────────────────

function getEffectLevel(scores: IndexScores, aiPotentialIdx: number): "high" | "medium" | "low" {
  const dataReady = scores.data_maturity >= 55;
  const processReady = scores.process_stability >= 50;
  if (dataReady && processReady && aiPotentialIdx >= 0) return "high";
  if (dataReady || processReady) return "medium";
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

// ─── COMPONENT ───────────────────────────────────────────

type Step = "intro" | "foundation" | "role_select" | "role_questions" | "result";

const AIReadiness = () => {
  const [step, setStep] = useState<Step>("intro");
  const [foundationStep, setFoundationStep] = useState(0);
  const [foundationAnswers, setFoundationAnswers] = useState<FoundationAnswers>({
    system: "",
    maturity: "",
    goal: "",
    industry: "",
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
    if (step === "role_questions" && roleQuestionIdx > 0) setRoleQuestionIdx(roleQuestionIdx - 1);
    else if (step === "role_questions") setStep("role_select");
    else if (step === "role_select") { setFoundationStep(foundationCount - 1); setStep("foundation"); }
    else if (step === "foundation" && foundationStep > 0) setFoundationStep(foundationStep - 1);
  };

  // ─── Report submit ───────────────────────────────────
  const handleReportSubmit = async () => {
    if (!reportForm.name || !reportForm.company || !reportForm.email) {
      toast({ title: "Fyll i alla obligatoriska fält", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const scores = calcIndexScores(foundationAnswers, selectedRole!, roleScores);
      const profile = getProfile(scores);
      const roadmap = generateRoadmap(selectedRole!, profile, foundationAnswers.system);
      const sysTrack = getSystemTrack(foundationAnswers.system);

      const answerSummary = [
        `System: ${foundationAnswers.system}`,
        `Digital mognad: ${foundationAnswers.maturity}`,
        `AI-mål: ${foundationAnswers.goal}`,
        `Bransch: ${foundationAnswers.industry}`,
        `Roll: ${track!.label}`,
        `Systemspår: ${systemTrackData[sysTrack].label}`,
        ...track!.questions.map((q) => `${q.question}: ${roleAnswers[q.id] || "—"}`),
      ].join("\n");

      const message = `AI & Affärssystem-analys\n\nRoll: ${track!.label}\nProfil: ${profileData[profile].title}\nBransch: ${foundationAnswers.industry}\nSystemspår: ${systemTrackData[sysTrack].label}\n\nIndex:\n- AI-Potential: ${scores.ai_potential}%\n- Datamognad: ${scores.data_maturity}%\n- Processtabilitet: ${scores.process_stability}%\n- Organisatorisk beredskap: ${scores.org_readiness}%\n\nSvar:\n${answerSummary}\n\nRoadmap:\nQ1: ${roadmap.q1.text}\nQ2: ${roadmap.q2.text}\nQ3: ${roadmap.q3.text}\nQ4: ${roadmap.q4.text}`;

      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          company_name: reportForm.company,
          contact_name: reportForm.name,
          email: reportForm.email,
          phone: "",
          message,
          source_page: "/ai-readiness",
          source_type: "ai-business-impact-assessment",
          selected_product: "AI & Copilot",
          industry: foundationAnswers.industry,
          company_size: "",
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

  // ─── PDF Generation (4 pages) ────────────────────────
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
    addHeader("AI & Affärssystem-analys – Executive Summary");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Datum: ${new Date().toLocaleDateString("sv-SE")}`, lm, y);
    if (reportForm.company) { doc.text(`Företag: ${reportForm.company}`, lm + 80, y); }
    y += 8;

    const summaryItems = [
      { label: "Roll", value: track!.label },
      { label: "Bransch", value: foundationAnswers.industry || "Ej angiven" },
      { label: "System", value: foundationAnswers.system },
      { label: "Systemspår", value: sysData.label },
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

    addSectionTitle("Mognadsprofil");
    const indices = [
      { label: "AI-Potential Index", value: scores.ai_potential },
      { label: "Data Maturity Index", value: scores.data_maturity },
      { label: "Process Stability Index", value: scores.process_stability },
      { label: "Organizational Readiness Index", value: scores.org_readiness },
    ];
    indices.forEach((idx) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${idx.label}: ${getLevelLabel(idx.value)} (${idx.value}%)`, lm + 3, y);
      doc.setFillColor(229, 231, 235);
      doc.rect(lm + 100, y - 3, 60, 4, "F");
      const barColor = idx.value >= 70 ? [16, 185, 129] : idx.value >= 40 ? [245, 158, 11] : [239, 68, 68];
      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.rect(lm + 100, y - 3, (idx.value / 100) * 60, 4, "F");
      y += 7;
    });
    y += 5;

    addSectionTitle("3 viktigaste insikterna");
    const insights: string[] = [];
    if (scores.ai_potential >= 60) insights.push("Hög AI-potential – ni kan realisera konkret affärsnytta med rätt prioritering");
    else insights.push("AI-potentialen behöver stärkas genom bättre datagrund och processer");
    if (scores.data_maturity >= 55) insights.push("Er datamognad ger en solid grund för prediktiv AI");
    else insights.push("Datamognad är ett utvecklingsområde – prioritera strukturering och kvalitetssäkring");
    if (scores.org_readiness >= 55) insights.push("Organisationen har mandat och vilja att driva AI-initiativ");
    else insights.push("Stärk organisatorisk beredskap genom tydligare ägarskap och governance");

    insights.forEach((insight) => {
      doc.text(`–  ${insight}`, lm + 3, y);
      y += 6;
    });
    y += 5;

    addSectionTitle(`Profil: ${pd.title}`);
    addText(pd.description);

    y += 3;
    addSectionTitle(`Systemrekommendation: ${sysData.label}`);
    addText(sysData.description);

    // ═══ PAGE 2: AI Potential per area ═══
    doc.addPage();
    addHeader(`AI-möjlighet inom ${track!.label}`);

    addText("Baserat på era svar finns potential att:");
    y += 2;

    track!.aiPotentials.forEach((ap, i) => {
      const effect = getEffectLevel(scores, i);
      const badge = getEffectBadge(effect);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(ap.label, lm, y);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`[${badge.label}]`, lm + 100, y);
      y += 5;
      addText(ap.description, 3);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const ctxLines = doc.splitTextToSize(ap.d365Context, pw - 10);
      doc.text(ctxLines, lm + 3, y);
      y += ctxLines.length * 4 + 4;
      doc.setTextColor(0, 0, 0);
    });

    y += 5;
    addSectionTitle("Rekommenderad start");
    if (profile === "scaling") {
      addText("Identifiera de 2–3 processer där AI ger störst ROI. Starta med en avgränsad pilot och mät resultat.");
    } else if (profile === "structurally_ready") {
      addText("Välj en process med hög repetitiv belastning. Säkerställ datakvalitet i det området och testa AI i begränsad skala.");
    } else {
      addText("Fokusera på att stärka datakvalitet och etablera processdisciplin. AI-effekten blir begränsad utan denna grund.");
    }

    // ═══ PAGE 3: Risk areas ═══
    doc.addPage();
    addHeader("Riskområden");

    if (activeRisks.length > 0) {
      activeRisks.forEach((risk) => {
        doc.setFontSize(10);
        doc.text(`⚠  ${risk.text}`, lm + 3, y);
        y += 8;
      });
    } else {
      addText("Inga kritiska riskområden identifierades. Er grund är stabil.");
    }
    y += 5;

    addSectionTitle("Generella observationer");
    if (scores.process_stability < 50) {
      addText("– Otydlig processägarstruktur kan leda till att AI-initiativ saknar förankring");
    }
    if (scores.data_maturity < 50) {
      addText("– Datakvalitet riskerar att begränsa precision i AI-modeller");
    }
    if (scores.org_readiness < 50) {
      addText("– Avsaknad av AI-governance ökar risken för okontrollerade initiativ");
    }
    if (scores.ai_potential < 50) {
      addText("– Begränsad insikt i AI:s möjligheter kan bromsa organisationens utveckling");
    }

    y += 8;
    addSectionTitle("Rekommenderad partnertyp");
    addText("Baserat på er roll, bransch och mognadsnivå rekommenderar vi en partner med följande profil:");
    y += 2;
    partners.forEach((p) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${p.icon}  ${p.type}`, lm + 3, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(p.description, pw - 10);
      doc.text(descLines, lm + 8, y);
      y += descLines.length * 4 + 4;
    });

    // ═══ PAGE 4: 12-month Roadmap ═══
    doc.addPage();
    addHeader(`12-månaders AI-roadmap – ${track!.label}`);

    [
      { label: "Kvartal 1 (Månad 1–3)", data: roadmap.q1 },
      { label: "Kvartal 2 (Månad 4–6)", data: roadmap.q2 },
      { label: "Kvartal 3 (Månad 7–9)", data: roadmap.q3 },
      { label: "Kvartal 4 (Månad 10–12)", data: roadmap.q4 },
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
    // D365 footnote
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
    const disc = "Denna analys är vägledande och baseras på de svar du angivit. Den ersätter inte en fullständig förstudie. Vi rekommenderar att du diskuterar dina behov med en kvalificerad Microsoft-partner.";
    const discLines = doc.splitTextToSize(disc, pw);
    doc.text(discLines, lm, y);
    y += discLines.length * 4 + 5;
    doc.setFont("helvetica", "normal");
    doc.text("d365.se – Oberoende guide till Dynamics 365 i Sverige", lm, y);

    doc.save("AI-Affarssystem-Analys.pdf");
  }, [foundationAnswers, selectedRole, roleScores, track, reportForm]);

  const resetAll = () => {
    setStep("intro");
    setFoundationStep(0);
    setFoundationAnswers({ system: "", maturity: "", goal: "", industry: "" });
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
          title="AI & Affärssystem-analys – Hur redo är ni för AI? | d365.se"
          description="Rollbaserad AI-analys kopplad till Dynamics 365. Förstå er AI-mognad, var AI ger störst effekt och vilken typ av partner som passar er situation."
          canonicalPath="/ai-readiness"
        />
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <section className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI & Affärssystem-analys
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Hur redo är ni att skapa affärsvärde med AI?
            </h1>
            <p className="text-lg text-muted-foreground mb-3">
              – och hur kan Dynamics 365 stödja er?
            </p>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              Oavsett om ni redan använder Dynamics 365 eller utvärderar plattformen hjälper denna analys er att förstå:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8 text-left">
              {[
                { icon: BarChart3, text: "Er AI-mognad" },
                { icon: Zap, text: "Var AI ger störst effekt i er roll" },
                { icon: Settings, text: "Vilka förutsättningar som krävs" },
                { icon: Users, text: "Vilken typ av partner som passar" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3">
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-8">
              Detta är rådgivande – men kontextuellt anpassat efter er systemsituation, roll och bransch.
            </p>

            <Button size="lg" className="text-lg px-8 py-6" onClick={() => setStep("foundation")}>
              Starta analysen (3 minuter) <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-10 grid grid-cols-4 gap-3 text-center">
              {[
                { val: "9", label: "frågor totalt" },
                { val: "4", label: "AI-index" },
                { val: "6", label: "rollspår" },
                { val: "PDF", label: "rapport" },
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

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {step === "foundation" ? `Grundfråga ${foundationStep + 1} av ${foundationCount}` : step === "role_select" ? "Välj din roll" : `Rollfråga ${roleQuestionIdx + 1} av 5`}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {step === "foundation" && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">🔹</span>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">Steg 1 – Grundval</span>
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
                <p className="text-sm text-muted-foreground mb-6">Härifrån anpassas analysen efter din roll.</p>
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

  const indexBars: { label: string; shortLabel: string; value: number; icon: typeof Rocket }[] = [
    { label: "AI-Potential Index", shortLabel: "AI-Potential", value: scores.ai_potential, icon: Zap },
    { label: "Data Maturity Index", shortLabel: "Datamognad", value: scores.data_maturity, icon: BarChart3 },
    { label: "Process Stability Index", shortLabel: "Processtabilitet", value: scores.process_stability, icon: Shield },
    { label: "Organizational Readiness", shortLabel: "Org. beredskap", value: scores.org_readiness, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`AI & Affärssystem-analys: ${pd.title} | d365.se`} description={pd.description.slice(0, 150)} canonicalPath="/ai-readiness" />
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

          {/* 1️⃣ AI Profile – 4 indices */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-8">
            <div className="bg-slate-800 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">📊 AI-profil</h3>
            </div>
            <div className="p-5 bg-background space-y-4">
              <p className="text-sm text-muted-foreground mb-2">{pd.description}</p>
              {indexBars.map((d) => {
                const DIcon = d.icon;
                return (
                  <div key={d.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{d.label}</span>
                      </div>
                      <span className={`text-sm font-bold ${getLevelTextColor(d.value)}`}>
                        {getLevelLabel(d.value)} ({d.value}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${getLevelColor(d.value)}`} style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2️⃣ AI Opportunity in your role (with subtle D365 context) */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className={`px-5 py-3 ${track!.headerBg}`}>
              <h3 className="font-bold text-white text-sm tracking-wide">⚡ AI-möjlighet inom {track!.label}</h3>
            </div>
            <div className="p-5 bg-background space-y-1">
              <p className="text-sm text-muted-foreground mb-4">Baserat på era svar finns potential att:</p>
              {track!.aiPotentials.map((ap, i) => {
                const effect = getEffectLevel(scores, i);
                const badge = getEffectBadge(effect);
                const showD365Context = foundationAnswers.system === "Dynamics 365" || profile === "scaling";
                return (
                  <div key={ap.label} className="px-3 py-3 rounded-lg bg-muted/30 border border-border/50 mb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{ap.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ap.description}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    {showD365Context && (
                      <p className="text-xs text-muted-foreground/70 mt-2 italic flex items-start gap-1.5">
                        <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
                        {ap.d365Context}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3️⃣ System Recommendation (smart, not aggressive) */}
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

          {/* 12-month Roadmap with D365 footnote */}
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
              {/* D365 footnote */}
              {roadmap.q4.d365Note && (
                <p className="text-xs text-muted-foreground/60 italic mt-5 pt-4 border-t border-border/50 flex items-start gap-1.5">
                  <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
                  {roadmap.q4.d365Note}
                </p>
              )}
            </div>
          </div>

          {/* Partner matching – curated feel */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-primary px-5 py-3">
              <h3 className="font-bold text-primary-foreground text-sm tracking-wide">🤝 Rekommenderad partnertyp</h3>
            </div>
            <div className="p-5 bg-background space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Baserat på er roll, bransch och mognadsnivå rekommenderar vi en partner med följande profil:
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

          {/* Reality Check */}
          <div className="rounded-lg border bg-muted/30 p-6 mt-8 text-center">
            <p className="text-foreground font-medium italic text-lg">
              "AI misslyckas sällan på grund av teknik.
              <br />
              Det misslyckas på grund av otydliga processer och brist på ägarskap."
            </p>
          </div>

          {/* Unlock report */}
          {!showReportForm && !submitted && (
            <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 sm:p-8 text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Ladda ner din AI-rapport som PDF</h3>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto text-sm">
                  En professionell 4-sidig rapport med:
                </p>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto mb-6 text-xs text-muted-foreground">
                  <span className="bg-muted/50 rounded px-2 py-1">📄 Executive Summary</span>
                  <span className="bg-muted/50 rounded px-2 py-1">⚡ AI-möjlighet per område</span>
                  <span className="bg-muted/50 rounded px-2 py-1">⚠️ Riskområden & roadmap</span>
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
