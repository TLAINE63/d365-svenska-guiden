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
} from "lucide-react";
import SelectionCard from "@/components/SelectionCard";
import AnalysisDisclaimer from "@/components/AnalysisDisclaimer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ─── TYPES ───────────────────────────────────────────────

type RoleId = "it" | "sales" | "marketing" | "finance" | "project" | "logistics";

interface FoundationAnswers {
  system: string;
  maturity: string;
  goal: string;
}

interface RoleQuestion {
  id: string;
  question: string;
  options: { label: string; score: number }[];
}

interface RoleTrack {
  id: RoleId;
  label: string;
  emoji: string;
  icon: typeof Settings;
  color: string;
  measures: string;
  questions: RoleQuestion[];
  aiPotentials: string[];
  resultLevels: {
    high: { emoji: string; title: string; text: string };
    medium: { emoji: string; title: string; text: string };
    low: { emoji: string; title: string; text: string };
  };
}

// ─── FOUNDATION QUESTIONS ────────────────────────────────

const foundationQuestions = [
  {
    id: "system",
    question: "Hur ser er systemsituation ut idag?",
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
    options: [
      { label: "Effektivisering", score: 3 },
      { label: "Tillväxt", score: 3 },
      { label: "Bättre beslutsstöd", score: 3 },
      { label: "Kostnadsbesparing", score: 2 },
      { label: "Utforskar", score: 1 },
    ],
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
    measures: "Teknisk förutsättning + governance",
    questions: [
      {
        id: "it_api",
        question: "Har ni API-struktur och integrationsplattform?",
        options: [
          { label: "Ja, dokumenterad och aktiv", score: 3 },
          { label: "Delvis, men ofullständig", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "it_data",
        question: "Är er data centraliserad eller silobaserad?",
        options: [
          { label: "Centraliserad med gemensam datamodell", score: 3 },
          { label: "Delvis centraliserad", score: 2 },
          { label: "Silobaserad", score: 0 },
        ],
      },
      {
        id: "it_ownership",
        question: "Har ni tydligt dataägarskap?",
        options: [
          { label: "Ja, definierat och efterlevt", score: 3 },
          { label: "Delvis", score: 1 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "it_governance",
        question: "Har ni AI-policy / governance?",
        options: [
          { label: "Ja, formaliserad", score: 3 },
          { label: "Under utveckling", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "it_testenv",
        question: "Har ni testmiljö för innovation?",
        options: [
          { label: "Ja, dedikerad sandbox", score: 3 },
          { label: "Delvis", score: 1 },
          { label: "Nej", score: 0 },
        ],
      },
    ],
    aiPotentials: ["API-orchestration", "Data mesh / centralisering", "AI governance framework", "Innovation sandbox"],
    resultLevels: {
      high: { emoji: "🟢", title: "AI-ready Infrastructure", text: "Ni har en solid teknisk grund med centraliserad data, API-struktur och governance. Er organisation är redo att skala AI-initiativ." },
      medium: { emoji: "🟠", title: "Struktur finns men governance saknas", text: "Den tekniska grunden finns delvis, men ni behöver formalisera dataägarskap och AI-policy innan ni skalar." },
      low: { emoji: "🔴", title: "Fragmenterad miljö", text: "Risk för isolerade AI-initiativ. Prioritera att centralisera data och etablera grundläggande governance." },
    },
  },
  {
    id: "sales",
    label: "Försäljning",
    emoji: "🟢",
    icon: TrendingUp,
    color: "text-green-600",
    measures: "Automationspotential + datakvalitet + pipeline-struktur",
    questions: [
      {
        id: "sales_admin",
        question: "Hur mycket tid lägger säljare på administration?",
        options: [
          { label: "Under 20%", score: 3 },
          { label: "20–40%", score: 2 },
          { label: "Över 40%", score: 1 },
        ],
      },
      {
        id: "sales_pipeline",
        question: "Är pipeline konsekvent uppdaterad?",
        options: [
          { label: "Ja, i realtid", score: 3 },
          { label: "Delvis, varierar mellan säljare", score: 2 },
          { label: "Nej, sporadiskt", score: 0 },
        ],
      },
      {
        id: "sales_history",
        question: "Finns historisk affärsdata?",
        options: [
          { label: "Ja, 2+ år strukturerad data", score: 3 },
          { label: "Ja, men ofullständig", score: 2 },
          { label: "Begränsat", score: 0 },
        ],
      },
      {
        id: "sales_comms",
        question: "Har ni strukturerad kundkommunikation?",
        options: [
          { label: "Ja, loggad i CRM", score: 3 },
          { label: "Delvis", score: 2 },
          { label: "Nej, mestadels i mejl/telefon", score: 0 },
        ],
      },
      {
        id: "sales_kpi",
        question: "Har ni tydliga KPI:er per säljare?",
        options: [
          { label: "Ja, med regelbunden uppföljning", score: 3 },
          { label: "Ja, men inte konsekvent", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
    ],
    aiPotentials: ["Lead scoring", "Mötes-sammanfattning", "Next-best-action", "Prognosförbättring"],
    resultLevels: {
      high: { emoji: "🟢", title: "AI kan direkt förbättra träffsäkerhet", text: "Er säljorganisation har strukturerad data och processer. AI kan direkt ge effekt genom lead scoring, prognoser och automatiserade sammanfattningar." },
      medium: { emoji: "🟠", title: "Börja med pipeline-disciplin", text: "Grunden finns men datakvaliteten varierar. Börja med att säkerställa konsekvent pipeline-uppdatering innan ni aktiverar prediktiv AI." },
      low: { emoji: "🔴", title: "Datagrund för svag för prediktiv AI", text: "Fokusera först på att etablera grundläggande CRM-disciplin och historisk dataregistrering." },
    },
  },
  {
    id: "marketing",
    label: "Marknad",
    emoji: "🟣",
    icon: Megaphone,
    color: "text-purple-600",
    measures: "Datadriven marknadsföring + segmentering",
    questions: [
      {
        id: "mkt_segment",
        question: "Har ni segmenterad kunddata?",
        options: [
          { label: "Ja, dynamiska segment", score: 3 },
          { label: "Ja, manuella segment", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "mkt_automation",
        question: "Använder ni marketing automation?",
        options: [
          { label: "Ja, med flöden och scoring", score: 3 },
          { label: "Grundläggande e-postutskick", score: 1 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "mkt_roi",
        question: "Spårar ni kampanj-ROI?",
        options: [
          { label: "Ja, end-to-end attribution", score: 3 },
          { label: "Delvis, manuella rapporter", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "mkt_integration",
        question: "Är CRM och marknadssystem integrerade?",
        options: [
          { label: "Ja, sömlöst", score: 3 },
          { label: "Delvis, manuell synk", score: 1 },
          { label: "Nej, separata system", score: 0 },
        ],
      },
      {
        id: "mkt_content",
        question: "Produceras innehåll strukturerat?",
        options: [
          { label: "Ja, med content calendar och process", score: 3 },
          { label: "Delvis", score: 2 },
          { label: "Ad hoc", score: 0 },
        ],
      },
    ],
    aiPotentials: ["Automatiserad innehållsgenerering", "Segmentoptimering", "Prediktiv kampanjanalys", "Personaliserad kommunikation"],
    resultLevels: {
      high: { emoji: "🟢", title: "Redo för AI-driven marknadsföring", text: "Ni har datadrivna processer och integrerade system. AI kan optimera segmentering, personalisering och kampanjanalys direkt." },
      medium: { emoji: "🟠", title: "Grundstruktur finns – integrera först", text: "Börja med att integrera CRM och marknadssystem, sedan kan AI lyfta segmentering och personalisering." },
      low: { emoji: "🔴", title: "Manuella processer begränsar AI-effekt", text: "Prioritera marketing automation och strukturerad kunddata innan AI-initiativ." },
    },
  },
  {
    id: "finance",
    label: "Ekonomi",
    emoji: "🟡",
    icon: Calculator,
    color: "text-yellow-600",
    measures: "Transaktionsstruktur + analysförmåga",
    questions: [
      {
        id: "fin_ap",
        question: "Hur automatiserad är er leverantörsreskontra?",
        options: [
          { label: "Hög grad av automation", score: 3 },
          { label: "Delvis automatiserad", score: 2 },
          { label: "Manuell", score: 0 },
        ],
      },
      {
        id: "fin_close",
        question: "Hur lång tid tar månadsbokslut?",
        options: [
          { label: "1–3 dagar", score: 3 },
          { label: "4–7 dagar", score: 2 },
          { label: "Mer än en vecka", score: 0 },
        ],
      },
      {
        id: "fin_forecast",
        question: "Har ni realtidsprognoser?",
        options: [
          { label: "Ja, löpande uppdaterade", score: 3 },
          { label: "Kvartalsvis", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "fin_anomaly",
        question: "Identifieras avvikelser manuellt?",
        options: [
          { label: "Nej, automatiserat", score: 3 },
          { label: "Delvis automatiserat", score: 2 },
          { label: "Ja, helt manuellt", score: 0 },
        ],
      },
      {
        id: "fin_reports",
        question: "Finns standardiserade rapporter?",
        options: [
          { label: "Ja, med dashboards", score: 3 },
          { label: "Ja, men manuella", score: 2 },
          { label: "Nej, ad hoc", score: 0 },
        ],
      },
    ],
    aiPotentials: ["Avvikelseidentifiering", "Kassaflödesprognoser", "Automatiserad matchning", "Bokslutsagenter"],
    resultLevels: {
      high: { emoji: "🟢", title: "Redo för AI-driven ekonomistyrning", text: "Ni har strukturerade processer och automatisering. AI kan direkt förbättra prognoser, avvikelsedetektering och automatisera bokslutsprocesser." },
      medium: { emoji: "🟠", title: "Automatisera grundprocesser först", text: "Ni har viss struktur men manuella moment. Automatisera leverantörsreskontra och standardisera rapporter innan AI." },
      low: { emoji: "🔴", title: "Manuella processer dominerar", text: "Fokusera på att digitalisera grundläggande ekonomiprocesser. AI-effekten blir begränsad utan strukturerad transaktionsdata." },
    },
  },
  {
    id: "project",
    label: "Projekt",
    emoji: "🟠",
    icon: FolderKanban,
    color: "text-orange-600",
    measures: "Resursstyrning + prognosprecision",
    questions: [
      {
        id: "proj_forecast",
        question: "Hur exakt är era projektprognoser?",
        options: [
          { label: "Inom 10% avvikelse", score: 3 },
          { label: "Inom 20% avvikelse", score: 2 },
          { label: "Stor variation", score: 0 },
        ],
      },
      {
        id: "proj_data",
        question: "Uppdateras projektdata löpande?",
        options: [
          { label: "Ja, i realtid", score: 3 },
          { label: "Veckovis", score: 2 },
          { label: "Sporadiskt", score: 0 },
        ],
      },
      {
        id: "proj_profit",
        question: "Spåras lönsamhet i realtid?",
        options: [
          { label: "Ja, per projekt", score: 3 },
          { label: "Ja, men manuellt", score: 2 },
          { label: "Nej", score: 0 },
        ],
      },
      {
        id: "proj_risk",
        question: "Identifieras risker proaktivt?",
        options: [
          { label: "Ja, med tidiga varningsindikatorer", score: 3 },
          { label: "Delvis, vid milstolpar", score: 2 },
          { label: "Nej, reaktivt", score: 0 },
        ],
      },
      {
        id: "proj_resource",
        question: "Är resurser över- eller underallokerade?",
        options: [
          { label: "Optimerad resursallokering", score: 3 },
          { label: "Viss obalans", score: 2 },
          { label: "Stor obalans", score: 0 },
        ],
      },
    ],
    aiPotentials: ["Riskprediktion", "Resursoptimering", "Marginalanalys", "Automatiserad statusrapportering"],
    resultLevels: {
      high: { emoji: "🟢", title: "Redo för AI-driven projektstyrning", text: "Ni har löpande datainsamling och strukturerade processer. AI kan ge prediktiva riskvarningar och optimera resursallokering." },
      medium: { emoji: "🟠", title: "Förbättra datainsamling", text: "Grundstrukturen finns men data uppdateras inte tillräckligt ofta. Börja med automatisk datainsamling." },
      low: { emoji: "🔴", title: "Saknar datagrund för prediktiv AI", text: "Prioritera löpande registrering av projektdata och resurstid innan AI kan ge tillförlitliga prognoser." },
    },
  },
  {
    id: "logistics",
    label: "Logistik / Supply Chain",
    emoji: "🔵",
    icon: Truck,
    color: "text-cyan-600",
    measures: "Prognos, lagerstruktur, reaktivitet",
    questions: [
      {
        id: "log_forecast",
        question: "Hur ofta justeras lagerprognoser?",
        options: [
          { label: "Dagligen / automatiserat", score: 3 },
          { label: "Veckovis", score: 2 },
          { label: "Sällan / ad hoc", score: 0 },
        ],
      },
      {
        id: "log_history",
        question: "Finns historisk efterfrågedata?",
        options: [
          { label: "Ja, 2+ år strukturerad", score: 3 },
          { label: "Ja, men ofullständig", score: 2 },
          { label: "Begränsat", score: 0 },
        ],
      },
      {
        id: "log_overstock",
        question: "Uppstår ofta överlager?",
        options: [
          { label: "Sällan, proaktiv styrning", score: 3 },
          { label: "Ibland", score: 2 },
          { label: "Regelbundet", score: 0 },
        ],
      },
      {
        id: "log_anomaly",
        question: "Hanteras avvikelser manuellt?",
        options: [
          { label: "Nej, automatiserat", score: 3 },
          { label: "Delvis", score: 2 },
          { label: "Ja, helt manuellt", score: 0 },
        ],
      },
      {
        id: "log_delivery",
        question: "Har ni leveransprecision över 95%?",
        options: [
          { label: "Ja, konsekvent", score: 3 },
          { label: "Varierar", score: 2 },
          { label: "Under 90%", score: 0 },
        ],
      },
    ],
    aiPotentials: ["Efterfrågeprognoser", "Lageroptimering", "Avvikelsedetektion", "Leveransriskanalys"],
    resultLevels: {
      high: { emoji: "🟢", title: "Redo för AI-driven supply chain", text: "Ni har strukturerad data och automatiserade processer. AI kan ge direkt effekt på prognoser, lageroptimering och riskanalys." },
      medium: { emoji: "🟠", title: "Förbättra datahistorik", text: "Grundprocesser finns men historisk data är ofullständig. Börja med att strukturera efterfrågedata." },
      low: { emoji: "🔴", title: "Manuella processer och svag prognos", text: "Fokusera på att automatisera grundläggande lagerstyrning och börja samla strukturerad efterfrågedata." },
    },
  },
];

// ─── SCORING HELPERS ─────────────────────────────────────

function calcDimensionScores(
  foundationAnswers: FoundationAnswers,
  role: RoleId,
  roleAnswers: Record<string, number>
) {
  const track = roleTracks.find((t) => t.id === role)!;
  const roleScore = Object.values(roleAnswers).reduce((a, b) => a + b, 0);
  const maxRoleScore = track.questions.length * 3;
  const roleRatio = roleScore / maxRoleScore;

  // Foundation scores
  const systemScore = foundationQuestions[0].options.find(
    (o) => o.label === foundationAnswers.system
  )?.score ?? 0;
  const maturityScore = foundationQuestions[1].options.find(
    (o) => o.label === foundationAnswers.maturity
  )?.score ?? 0;
  const goalScore = foundationQuestions[2].options.find(
    (o) => o.label === foundationAnswers.goal
  )?.score ?? 0;

  // AI-Potential: mainly from goal + role performance
  const aiPotential = Math.round(((goalScore / 3) * 0.3 + roleRatio * 0.7) * 100);
  // Datamognad: system + maturity + role data questions
  const dataMognad = Math.round(((systemScore / 3) * 0.3 + (maturityScore / 3) * 0.3 + roleRatio * 0.4) * 100);
  // Automationsgrad: from role answers
  const automationsgrad = Math.round(roleRatio * 100);
  // Organisatorisk beredskap: maturity + goal
  const beredskap = Math.round(((maturityScore / 3) * 0.5 + (goalScore / 3) * 0.5) * 100);

  return { aiPotential, dataMognad, automationsgrad, beredskap, roleScore, maxRoleScore };
}

function getLevel(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

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

// ─── ROADMAP GENERATOR ───────────────────────────────────

function generateRoadmap(role: RoleId, level: "high" | "medium" | "low", foundationAnswers: FoundationAnswers) {
  const hasDynamics = foundationAnswers.system === "Dynamics 365";

  const roadmaps: Record<RoleId, Record<string, { q1: string; q2: string; q3: string; q4: string }>> = {
    it: {
      high: { q1: "Formalisera AI-governance och säkerhetspolicyer", q2: "Etablera centralt AI-kompetenscenter", q3: "Skala pilotprojekt till produktion", q4: "Utvärdera och optimera AI-initiativ" },
      medium: { q1: "Inventera datalandskap och identifiera silos", q2: "Etablera dataägarskap och governance", q3: "Skapa sandbox-miljö för AI-experiment", q4: "Starta första AI-pilot" },
      low: { q1: "Kartlägg systemlandskap och integrationsbehov", q2: "Centralisera nyckeldata", q3: "Etablera grundläggande API-struktur", q4: "Definiera AI-policy och roadmap" },
    },
    sales: {
      high: { q1: hasDynamics ? "Aktivera Copilot i Sales för mötessammanfattning" : "Implementera CRM med AI-kapabiliteter", q2: "Inför prediktiv lead scoring", q3: "Skala next-best-action till hela teamet", q4: "Automatisera prognoser och pipeline-analys" },
      medium: { q1: "Kvalitetssäkra CRM-data och pipeline-process", q2: "Standardisera KPI:er och uppföljningsrytm", q3: hasDynamics ? "Aktivera Copilot för grundläggande assistans" : "Utforska AI-verktyg för CRM", q4: "Mäta och utvärdera AI-effekt" },
      low: { q1: "Etablera grundläggande CRM-disciplin", q2: "Definiera pipeline-steg och konverteringsmått", q3: "Börja logga all kundkommunikation", q4: "Utvärdera AI-readiness på nytt" },
    },
    marketing: {
      high: { q1: "Implementera AI-driven segmentering", q2: "Aktivera personalisering i stor skala", q3: "Prediktiv kampanjoptimering", q4: "AI-genererat innehåll och attribution" },
      medium: { q1: "Integrera CRM och marknadssystem", q2: "Etablera marketing automation-flöden", q3: "Börja spåra kampanj-ROI end-to-end", q4: "Testa AI för segmentering" },
      low: { q1: "Strukturera kunddata och segment", q2: "Implementera grundläggande marketing automation", q3: "Skapa content-process och kalender", q4: "Integrera med CRM" },
    },
    finance: {
      high: { q1: hasDynamics ? "Aktivera Copilot i Finance" : "Utforska AI-verktyg för ekonomistyrning", q2: "Implementera AI-driven avvikelsedetektering", q3: "Automatisera kassaflödesprognoser", q4: "Testa bokslutsagenter" },
      medium: { q1: "Automatisera leverantörsreskontra", q2: "Standardisera rapporter och dashboards", q3: "Förkorta bokslutsprocess", q4: "Utforska AI-prognoser" },
      low: { q1: "Digitalisera manuella processer", q2: "Implementera standardiserade rapporter", q3: "Etablera löpande prognosprocess", q4: "Utvärdera AI-potential" },
    },
    project: {
      high: { q1: "Implementera AI-driven riskprediktion", q2: "Automatisera statusrapportering", q3: "AI-optimerad resursallokering", q4: "Prediktiv marginalanalys" },
      medium: { q1: "Automatisera datainsamling i projekt", q2: "Etablera realtidsspårning av lönsamhet", q3: "Definiera riskvarningsindikatorer", q4: "Testa prediktiv projektanalys" },
      low: { q1: "Börja registrera projektdata löpande", q2: "Etablera standardiserad projektmodell", q3: "Spåra resurstid och kostnader", q4: "Utvärdera verktygsbehov" },
    },
    logistics: {
      high: { q1: "Implementera AI-drivna efterfrågeprognoser", q2: "Automatisera lageroptimering", q3: "AI-driven avvikelsedetektion", q4: "Prediktiv leveransriskanalys" },
      medium: { q1: "Strukturera historisk efterfrågedata", q2: "Automatisera grundläggande lagerplanering", q3: "Implementera avvikelsevarningar", q4: "Testa prediktiv prognos" },
      low: { q1: "Digitalisera lagerstyrning", q2: "Börja samla efterfrågedata", q3: "Automatisera beställningspunkter", q4: "Utvärdera prognosverktyg" },
    },
  };

  return roadmaps[role][level];
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
  });
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [roleQuestionIdx, setRoleQuestionIdx] = useState(0);
  const [roleAnswers, setRoleAnswers] = useState<Record<string, string>>({});
  const [roleScores, setRoleScores] = useState<Record<string, number>>({});

  // Report state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({ name: "", company: "", role: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const track = selectedRole ? roleTracks.find((t) => t.id === selectedRole)! : null;

  // Total progress calc
  const totalSteps = 3 + 1 + 5; // 3 foundation + 1 role select + 5 role questions
  const currentProgress =
    step === "foundation"
      ? foundationStep + 1
      : step === "role_select"
      ? 4
      : step === "role_questions"
      ? 4 + roleQuestionIdx + 1
      : step === "result"
      ? totalSteps
      : 0;
  const progressPct = (currentProgress / totalSteps) * 100;

  // ─── Foundation handlers ─────────────────────────────
  const handleFoundationAnswer = (label: string) => {
    const keys: (keyof FoundationAnswers)[] = ["system", "maturity", "goal"];
    const key = keys[foundationStep];
    setFoundationAnswers({ ...foundationAnswers, [key]: label });

    setTimeout(() => {
      if (foundationStep < 2) {
        setFoundationStep(foundationStep + 1);
      } else {
        setStep("role_select");
      }
    }, 300);
  };

  // ─── Role selection ──────────────────────────────────
  const handleRoleSelect = (roleId: RoleId) => {
    setSelectedRole(roleId);
    setRoleQuestionIdx(0);
    setRoleAnswers({});
    setRoleScores({});
    setTimeout(() => setStep("role_questions"), 300);
  };

  // ─── Role question handlers ──────────────────────────
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
      setFoundationStep(2);
      setStep("foundation");
    } else if (step === "foundation" && foundationStep > 0) {
      setFoundationStep(foundationStep - 1);
    }
  };

  // ─── Report submit ───────────────────────────────────
  const handleReportSubmit = async () => {
    if (!reportForm.name || !reportForm.company || !reportForm.email) {
      toast({ title: "Fyll i alla obligatoriska fält", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const dims = calcDimensionScores(foundationAnswers, selectedRole!, roleScores);
      const overallLevel = getLevel(Math.round((dims.aiPotential + dims.dataMognad + dims.automationsgrad + dims.beredskap) / 4));
      const roadmap = generateRoadmap(selectedRole!, overallLevel, foundationAnswers);

      const answerSummary = [
        `System: ${foundationAnswers.system}`,
        `Digital mognad: ${foundationAnswers.maturity}`,
        `AI-mål: ${foundationAnswers.goal}`,
        `Roll: ${track!.label}`,
        ...track!.questions.map((q) => `${q.question}: ${roleAnswers[q.id] || "—"}`),
      ].join("\n");

      const message = `AI Business Impact Assessment\n\nRoll: ${track!.label}\nAI-Potential: ${dims.aiPotential}%\nDatamognad: ${dims.dataMognad}%\nAutomationsgrad: ${dims.automationsgrad}%\nBeredskap: ${dims.beredskap}%\n\nSvar:\n${answerSummary}\n\nRoadmap:\nQ1: ${roadmap.q1}\nQ2: ${roadmap.q2}\nQ3: ${roadmap.q3}\nQ4: ${roadmap.q4}`;

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
          industry: "",
          company_size: "",
        },
      });

      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Tack! Din rapport skickas inom kort." });

      // Generate PDF
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
    const dims = calcDimensionScores(foundationAnswers, selectedRole!, roleScores);
    const overallLevel = getLevel(Math.round((dims.aiPotential + dims.dataMognad + dims.automationsgrad + dims.beredskap) / 4));
    const roadmap = generateRoadmap(selectedRole!, overallLevel, foundationAnswers);
    const resultLevel = track!.resultLevels[overallLevel];

    let y = 20;
    const lm = 20;
    const pw = 170;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("AI Business Impact Assessment", lm, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Roll: ${track!.label} | Datum: ${new Date().toLocaleDateString("sv-SE")}`, lm, y);
    y += 5;
    if (reportForm.company) {
      doc.text(`Företag: ${reportForm.company}`, lm, y);
      y += 5;
    }
    y += 5;

    // Line
    doc.setDrawColor(200);
    doc.line(lm, y, lm + pw, y);
    y += 10;

    // AI Profile
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Er AI-profil", lm, y);
    y += 8;

    const dimensions = [
      { label: "AI-Potential", value: dims.aiPotential },
      { label: "Datamognad", value: dims.dataMognad },
      { label: "Automationsgrad", value: dims.automationsgrad },
      { label: "Organisatorisk beredskap", value: dims.beredskap },
    ];

    doc.setFontSize(10);
    dimensions.forEach((d) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${d.label}: ${getLevelLabel(d.value)} (${d.value}%)`, lm, y);
      y += 6;
    });
    y += 5;

    // Result
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${resultLevel.title}`, lm, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const resultLines = doc.splitTextToSize(resultLevel.text, pw);
    doc.text(resultLines, lm, y);
    y += resultLines.length * 5 + 5;

    // AI Potentials
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("AI-potential inom " + track!.label, lm, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    track!.aiPotentials.forEach((p) => {
      doc.text(`– ${p}`, lm + 3, y);
      y += 5;
    });
    y += 5;

    // Roadmap
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("12-månaders AI-roadmap", lm, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    [
      { label: "Q1 (Månad 1–3)", text: roadmap.q1 },
      { label: "Q2 (Månad 4–6)", text: roadmap.q2 },
      { label: "Q3 (Månad 7–9)", text: roadmap.q3 },
      { label: "Q4 (Månad 10–12)", text: roadmap.q4 },
    ].forEach((q) => {
      doc.setFont("helvetica", "bold");
      doc.text(q.label, lm, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(q.text, pw - 5);
      doc.text(lines, lm + 3, y);
      y += lines.length * 5 + 3;
    });
    y += 5;

    // Disclaimer
    doc.setDrawColor(200);
    doc.line(lm, y, lm + pw, y);
    y += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    const disclaimer = "Denna analys är vägledande och baseras på de svar du angivit. Den ersätter inte en fullständig förstudie. Vi rekommenderar att du diskuterar dina behov med en kvalificerad Microsoft-partner.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, pw);
    doc.text(disclaimerLines, lm, y);
    y += disclaimerLines.length * 4 + 5;

    doc.setFont("helvetica", "normal");
    doc.text("d365.se – Oberoende guide till Dynamics 365 i Sverige", lm, y);

    doc.save("AI-Business-Impact-Assessment.pdf");
  }, [foundationAnswers, selectedRole, roleScores, track, reportForm]);

  // ─── Reset ───────────────────────────────────────────
  const resetAll = () => {
    setStep("intro");
    setFoundationStep(0);
    setFoundationAnswers({ system: "", maturity: "", goal: "" });
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
          title="AI Business Impact Assessment – Rollbaserad AI-analys | d365.se"
          description="En rollbaserad analys av er AI-potential. Svara på frågor anpassade för din roll och få en personlig AI-roadmap."
          canonicalPath="/ai-readiness"
        />
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <section className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI Business Impact Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              En rollbaserad analys av er AI-potential
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              AI-potential varierar mellan roller och avdelningar. Denna analys anpassas efter just din verklighet.
            </p>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Svara på <strong>3 grundfrågor</strong>, välj din roll och besvara <strong>5 rollspecifika frågor</strong>. Du får en personlig AI-profil och en 12-månaders roadmap.
            </p>

            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setStep("foundation")}
            >
              Starta analysen (3 minuter) <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">frågor totalt</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">rollspår</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-foreground">Direkt</p>
                <p className="text-xs text-muted-foreground">resultat + roadmap</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // QUIZ WRAPPER (foundation, role select, role questions)
  // ═══════════════════════════════════════════════════════
  if (step === "foundation" || step === "role_select" || step === "role_questions") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {step === "foundation"
                    ? `Grundfråga ${foundationStep + 1} av 3`
                    : step === "role_select"
                    ? "Välj din roll"
                    : `Rollfråga ${roleQuestionIdx + 1} av 5`}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(progressPct)}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {/* ─── FOUNDATION ───────────────────────────── */}
            {step === "foundation" && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">🔹</span>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Steg 1 – Grundval
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  {foundationQuestions[foundationStep].question}
                </h2>
                <div className="grid gap-3">
                  {foundationQuestions[foundationStep].options.map((opt) => {
                    const keys: (keyof FoundationAnswers)[] = ["system", "maturity", "goal"];
                    const isSelected = foundationAnswers[keys[foundationStep]] === opt.label;
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

            {/* ─── ROLE SELECT ──────────────────────────── */}
            {step === "role_select" && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">🔹</span>
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Steg 2 – Välj roll
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Jag arbetar inom:
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Härifrån anpassas analysen efter din roll.
                </p>
                <div className="grid gap-3">
                  {roleTracks.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleRoleSelect(t.id)}
                        className={`w-full text-left rounded-lg border-2 px-5 py-4 transition-all duration-200 flex items-center gap-4 ${
                          selectedRole === t.id
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                            : "border-border bg-card hover:bg-muted/50 hover:border-primary/30"
                        }`}
                      >
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

            {/* ─── ROLE QUESTIONS ────────────────────────── */}
            {step === "role_questions" && track && (
              <>
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-2xl">{track.emoji}</span>
                  <span className={`text-sm font-semibold uppercase tracking-wide ${track.color}`}>
                    {track.label}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  {track.questions[roleQuestionIdx].question}
                </h2>
                <div className="grid gap-3">
                  {track.questions[roleQuestionIdx].options.map((opt) => {
                    const isSelected = roleAnswers[track.questions[roleQuestionIdx].id] === opt.label;
                    return (
                      <SelectionCard
                        key={opt.label}
                        label={opt.label}
                        selected={isSelected}
                        onClick={() => handleRoleAnswer(opt.label, opt.score)}
                        type="radio"
                      />
                    );
                  })}
                </div>
              </>
            )}

            {/* Navigation */}
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
  const dims = calcDimensionScores(foundationAnswers, selectedRole!, roleScores);
  const overallPct = Math.round((dims.aiPotential + dims.dataMognad + dims.automationsgrad + dims.beredskap) / 4);
  const overallLevel = getLevel(overallPct);
  const resultLevel = track!.resultLevels[overallLevel];
  const roadmap = generateRoadmap(selectedRole!, overallLevel, foundationAnswers);

  const dimensionBars = [
    { label: "AI-Potential", value: dims.aiPotential, icon: Rocket },
    { label: "Datamognad", value: dims.dataMognad, icon: BarChart3 },
    { label: "Automationsgrad", value: dims.automationsgrad, icon: Settings },
    { label: "Organisatorisk beredskap", value: dims.beredskap, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`AI Impact: ${resultLevel.title} | d365.se`}
        description={resultLevel.text.slice(0, 150)}
        canonicalPath="/ai-readiness"
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Result header */}
          <div className="text-center mb-10">
            <span className="text-5xl mb-4 block">{resultLevel.emoji}</span>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              Er AI-profil – {track!.label}
            </p>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${getLevelTextColor(overallPct)}`}>
              {resultLevel.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {resultLevel.text}
            </p>
          </div>

          <AnalysisDisclaimer />

          {/* Dimension bars */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-slate-700 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">📊 Er AI-profil</h3>
            </div>
            <div className="p-5 bg-background space-y-4">
              {dimensionBars.map((d) => {
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
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getLevelColor(d.value)}`}
                        style={{ width: `${d.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Potentials */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className={`px-5 py-3 ${
              selectedRole === "it" ? "bg-blue-600" :
              selectedRole === "sales" ? "bg-green-600" :
              selectedRole === "marketing" ? "bg-purple-600" :
              selectedRole === "finance" ? "bg-yellow-600" :
              selectedRole === "project" ? "bg-orange-600" :
              "bg-cyan-600"
            }`}>
              <h3 className="font-bold text-white text-sm tracking-wide">⚡ AI-potential inom {track!.label}</h3>
            </div>
            <div className="p-5 bg-background">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {track!.aiPotentials.map((p) => (
                  <div key={p} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/10">
                    <span className="text-primary flex-shrink-0">✦</span>
                    <span className="text-sm font-medium text-foreground">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended next step */}
          <div className="border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="bg-emerald-600 px-5 py-3">
              <h3 className="font-bold text-white text-sm tracking-wide">🧭 Rekommenderat nästa steg</h3>
            </div>
            <div className="p-5 bg-background space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${
                overallLevel === "high" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                overallLevel === "medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
                "text-red-600 bg-red-50 border-red-200"
              }`}>
                {resultLevel.emoji} {overallLevel === "high" ? "AI med hög potential" : overallLevel === "medium" ? "AI med strukturell potential" : "Grundarbete behövs"}
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {overallLevel === "high" && (
                  <>
                    <p>Ni har tydliga processer och hög datakvalitet. Ni kan börja skala AI med tydlig affärsnytta.</p>
                    <ul className="space-y-1 mt-3">
                      <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Identifiera de 2–3 processer där AI ger störst ROI</li>
                      <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Starta med en avgränsad pilot</li>
                      <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> Mät och kommunicera resultat internt</li>
                    </ul>
                  </>
                )}
                {overallLevel === "medium" && (
                  <>
                    <p>Ni har tydliga processer men varierande datakvalitet.</p>
                    <ul className="space-y-1 mt-3">
                      <li className="flex items-start gap-2"><Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> Identifiera 1 process med hög repetitiv belastning</li>
                      <li className="flex items-start gap-2"><Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> Säkerställ datakvalitet i det området</li>
                      <li className="flex items-start gap-2"><Target className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> Testa AI i begränsad skala</li>
                    </ul>
                  </>
                )}
                {overallLevel === "low" && (
                  <>
                    <p>Ni behöver stärka den digitala grunden innan AI kan ge verklig effekt.</p>
                    <ul className="space-y-1 mt-3">
                      <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Kartlägg nuvarande datalandskap</li>
                      <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Etablera grundläggande processer och systemstöd</li>
                      <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> Fokusera på digitalisering före AI</li>
                    </ul>
                  </>
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
                  { label: "Q1", period: "Månad 1–3", text: roadmap.q1, color: "border-l-blue-500" },
                  { label: "Q2", period: "Månad 4–6", text: roadmap.q2, color: "border-l-emerald-500" },
                  { label: "Q3", period: "Månad 7–9", text: roadmap.q3, color: "border-l-amber-500" },
                  { label: "Q4", period: "Månad 10–12", text: roadmap.q4, color: "border-l-purple-500" },
                ].map((q) => (
                  <div key={q.label} className={`border-l-4 ${q.color} pl-4 py-2`}>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{q.label} <span className="font-normal">({q.period})</span></p>
                    <p className="text-sm text-foreground mt-1">{q.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamics 365 note */}
          {foundationAnswers.system === "Dynamics 365" && (
            <Card className="mt-6 border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Ni har redan Dynamics 365
                </h3>
                <p className="text-sm text-muted-foreground">
                  Det innebär att ni kan nyttja Copilot och agenter direkt inom er befintliga plattform. Roadmapen ovan är anpassad för att maximera värde ur er nuvarande investering.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Reality Check */}
          <div className="rounded-lg border bg-muted/30 p-6 mt-8 text-center">
            <p className="text-foreground font-medium italic text-lg">
              "AI misslyckas sällan på grund av teknik.
              <br />
              Det misslyckas på grund av otydliga processer och brist på ägarskap."
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mt-8 mb-8">
            <Link
              to="/valj-partner"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
            >
              Hitta rätt partner för ert AI-initiativ <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Unlock full report */}
          {!showReportForm && !submitted && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 sm:p-8 text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ladda ner din AI-rapport som PDF
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Få en komplett rapport med AI-profil, rollanpassade rekommendationer och er 12-månaders roadmap.
                </p>
                <Button size="lg" onClick={() => setShowReportForm(true)}>
                  <Download className="mr-2 h-4 w-4" /> Ladda ner rapport
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Report form */}
          {showReportForm && !submitted && (
            <Card className="border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                  Fyll i dina uppgifter för att ladda ner rapporten
                </h3>
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
                    Vi delar aldrig dina uppgifter. Läs vår{" "}
                    <Link to="/dataskydd" className="underline">integritetspolicy</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submitted */}
          {submitted && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <Check className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Tack! Din PDF-rapport har laddats ner.
                </h3>
                <p className="text-muted-foreground">
                  Vi har också sparat dina uppgifter och kan kontakta dig vid behov.
                </p>
                <Button variant="outline" className="mt-4" onClick={generatePDF}>
                  <Download className="mr-2 h-4 w-4" /> Ladda ner igen
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Restart */}
          <div className="text-center mt-8">
            <Button variant="ghost" onClick={resetAll}>
              Gör om analysen
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIReadiness;
