import { useState } from "react";
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
  Sparkles,
  Lock,
  AlertTriangle,
  Rocket,
  Target,
  Brain,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// --- QUIZ DATA ---

interface QuizQuestion {
  id: string;
  section: string;
  sectionEmoji: string;
  question: string;
  hint?: string;
  options: { label: string; score: number }[];
}

const questions: QuizQuestion[] = [
  // DEL 1 – Affärsdriv
  {
    id: "goal",
    section: "Affärsdriv",
    sectionEmoji: "🎯",
    question: "Vad är ert primära mål med AI?",
    options: [
      { label: "Minska manuellt arbete", score: 3 },
      { label: "Öka försäljning", score: 3 },
      { label: "Förbättra prognoser", score: 3 },
      { label: "Förbättra kundservice", score: 3 },
      { label: "Utforskar möjligheterna", score: 1 },
    ],
  },
  {
    id: "business_kpi",
    section: "Affärsdriv",
    sectionEmoji: "🎯",
    question: "Finns ett tydligt affärsmål kopplat till effektivisering?",
    options: [
      { label: "Ja, med KPI:er", score: 3 },
      { label: "Delvis", score: 2 },
      { label: "Nej", score: 0 },
    ],
  },
  // DEL 2 – Datamognad
  {
    id: "data_structure",
    section: "Datamognad",
    sectionEmoji: "📊",
    question: "Är er data strukturerad och konsekvent i Dynamics 365?",
    options: [
      { label: "Ja", score: 3 },
      { label: "Delvis", score: 2 },
      { label: "Nej", score: 0 },
    ],
  },
  {
    id: "processes",
    section: "Datamognad",
    sectionEmoji: "📊",
    question: "Har ni tydliga processer i ERP/CRM?",
    options: [
      { label: "Standardiserade", score: 3 },
      { label: "Varierar mellan avdelningar", score: 2 },
      { label: "Otydliga", score: 0 },
    ],
  },
  {
    id: "data_quality",
    section: "Datamognad",
    sectionEmoji: "📊",
    question: "Hur är datakvaliteten?",
    hint: "AI förstärker kvalitet – både bra och dålig.",
    options: [
      { label: "Hög", score: 3 },
      { label: "Acceptabel", score: 2 },
      { label: "Bristfällig", score: 0 },
    ],
  },
  // DEL 3 – Teknik & Infrastruktur
  {
    id: "copilot_usage",
    section: "Teknik & Infrastruktur",
    sectionEmoji: "⚙️",
    question: "Använder ni redan Copilot i någon del?",
    options: [
      { label: "Ja, aktivt", score: 3 },
      { label: "Testar", score: 2 },
      { label: "Nej", score: 0 },
    ],
  },
  {
    id: "integrations",
    section: "Teknik & Infrastruktur",
    sectionEmoji: "⚙️",
    question: "Har ni integrationsstruktur (Power Platform, API:er etc.)?",
    options: [
      { label: "Ja", score: 3 },
      { label: "Delvis", score: 2 },
      { label: "Nej", score: 0 },
    ],
  },
  // DEL 4 – Organisation & Kultur
  {
    id: "ai_receptivity",
    section: "Organisation & Kultur",
    sectionEmoji: "👥",
    question: "Hur mottaglig är organisationen för AI?",
    options: [
      { label: "Positiv och nyfiken", score: 3 },
      { label: "Blandad", score: 2 },
      { label: "Skeptisk", score: 0 },
    ],
  },
  {
    id: "sponsor",
    section: "Organisation & Kultur",
    sectionEmoji: "👥",
    question: "Finns en intern sponsor (CFO, Sales Director etc.)?",
    options: [
      { label: "Ja", score: 3 },
      { label: "Osäkert", score: 1 },
      { label: "Nej", score: 0 },
    ],
  },
  // DEL 5 – Prioriteringsförmåga
  {
    id: "identified_process",
    section: "Prioriteringsförmåga",
    sectionEmoji: "🔍",
    question: "Har ni identifierat en specifik process att börja med?",
    options: [
      { label: "Ja", score: 3 },
      { label: "Flera möjliga", score: 2 },
      { label: "Nej", score: 0 },
    ],
  },
  // BONUS-frågor
  {
    id: "manual_work",
    section: "Fördjupning",
    sectionEmoji: "🧠",
    question: "Hur mycket manuellt arbete sker i era kärnprocesser?",
    options: [
      { label: "Under 20%", score: 3 },
      { label: "20–50%", score: 2 },
      { label: "Över 50%", score: 1 },
    ],
  },
  {
    id: "forecast_frequency",
    section: "Fördjupning",
    sectionEmoji: "🧠",
    question: "Hur ofta uppdateras prognoser?",
    options: [
      { label: "Realtid", score: 3 },
      { label: "Månatligen", score: 2 },
      { label: "Manuellt vid behov", score: 0 },
    ],
  },
  {
    id: "previous_ai",
    section: "Fördjupning",
    sectionEmoji: "🧠",
    question: "Har ni tidigare AI-initiativ som inte gav effekt?",
    hint: "Ärlig reflektion ger bättre resultat.",
    options: [
      { label: "Ja", score: 1 },
      { label: "Nej", score: 2 },
    ],
  },
];

const totalQuestions = questions.length;
const maxScore = 39; // max possible

// --- RESULT LOGIC ---

type Level = "early" | "pilot" | "scale";

interface ResultData {
  level: Level;
  color: string;
  emoji: string;
  title: string;
  subtitle: string;
  risks: string[];
  recommendation: string;
  expectedEffects: string[];
  cta: { label: string; link: string };
  icon: typeof AlertTriangle;
}

function getGoalSegment(answers: Record<string, number>): string {
  const goalAnswer = questions[0].options.findIndex(
    (o) => o.score === (answers["goal"] ?? 0)
  );
  // Map goal to segment
  const goalLabels = questions[0].options.map((o) => o.label);
  const selected = goalLabels[goalAnswer] || "Utforskar möjligheterna";
  if (selected.includes("försäljning")) return "sales";
  if (selected.includes("kundservice")) return "service";
  if (selected.includes("prognoser")) return "finance";
  if (selected.includes("manuellt")) return "automation";
  return "explore";
}

function getResult(score: number, goalSegment: string): ResultData {
  if (score <= 13) {
    return {
      level: "early",
      color: "text-amber-500",
      emoji: "🟡",
      title: "Tidigt stadium",
      subtitle: "Ni har ambitioner men behöver bygga grunden först.",
      icon: AlertTriangle,
      risks: [
        "Att starta AI utan strukturerad data ger begränsad effekt",
        "Avsaknad av tydliga KPI:er gör det svårt att mäta ROI",
      ],
      recommendation:
        goalSegment === "sales"
          ? "Börja med att kvalitetssäkra er CRM-data och definiera tydliga säljmål innan ni aktiverar Copilot i Sales."
          : goalSegment === "service"
          ? "Kartlägg era vanligaste kundärenden och standardisera processerna innan ni inför AI-assisterad kundservice."
          : goalSegment === "finance"
          ? "Säkerställ att er ekonomidata är konsekvent och komplett – det är grunden för tillförlitliga AI-prognoser."
          : "Identifiera den process där mest tid läggs på manuellt arbete. Börja med att standardisera den.",
      expectedEffects: [
        "Bättre datakvalitet som grund för framtida AI",
        "Tydligare processer och ansvarsfördelning",
        "Förståelse för var AI ger störst effekt",
      ],
      cta: { label: "Boka strategisk AI-genomgång", link: "/kontakt" },
    };
  }

  if (score <= 26) {
    return {
      level: "pilot",
      color: "text-orange-500",
      emoji: "🟠",
      title: "Redo för pilotprojekt",
      subtitle: "Ni har rätt grundförutsättningar.",
      icon: Target,
      risks: [
        "Få begränsad effekt utan tydlig prioritering",
        "Skala innan datan är helt kvalitetssäkrad",
      ],
      recommendation:
        goalSegment === "sales"
          ? "Inför Copilot i Sales med fokus på lead-prioritering och mötessammanfattning."
          : goalSegment === "service"
          ? "Testa AI-agenter för automatisk ärendekategorisering och Copilot för handläggarstöd."
          : goalSegment === "finance"
          ? "Starta med kassaflödesprognoser och automatisk avvikelseanalys i Finance."
          : "Välj en avgränsad process med hög manuell belastning och kör ett Proof-of-Value.",
      expectedEffects: [
        "Kortare säljcykler / snabbare ärendehantering",
        "Ökad träffsäkerhet i prognoser",
        "Tidsbesparing 5–8 h/vecka per användare",
      ],
      cta: { label: "Få förslag på lämplig partner för pilot", link: "/valj-partner" },
    };
  }

  return {
    level: "scale",
    color: "text-emerald-500",
    emoji: "🟢",
    title: "Redo att skala AI",
    subtitle: "Ni har struktur, datagrund och sponsring på plats.",
    icon: Rocket,
    risks: [
      "Att inte agera nu innebär att konkurrenter drar ifrån",
      "Fragmenterade initiativ utan övergripande AI-strategi",
    ],
    recommendation:
      goalSegment === "sales"
        ? "Skala Copilot brett i säljorganisationen och inför autonoma agenter för lead-kvalificering."
        : goalSegment === "service"
        ? "Rulla ut AI-agenter som hanterar vanliga ärenden autonomt och Copilot som stöd vid komplexa fall."
        : goalSegment === "finance"
        ? "Automatisera periodavslut med bokslutsagenter och bredda AI-prognoser till hela supply chain."
        : "Bygg AI som strategisk kapabilitet – skala Copilot brett och inför autonoma agenter.",
    expectedEffects: [
      "20–40% minskning av manuella moment",
      "AI som strategisk konkurrensfördel",
      "Skalbar tillväxt utan proportionell personalökning",
    ],
    cta: { label: "Matcha med AI-specialiserad partner", link: "/valj-partner" },
  };
}

// --- COMPONENT ---

const AIReadiness = () => {
  const [step, setStep] = useState<"intro" | "quiz" | "result" | "report">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({ name: "", company: "", role: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const goalSegment = getGoalSegment(scores);
  const result = getResult(totalScore, goalSegment);

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / totalQuestions) * 100;

  const selectAnswer = (optionLabel: string, score: number) => {
    setAnswers({ ...answers, [q.id]: optionLabel });
    setScores({ ...scores, [q.id]: score });

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQ < totalQuestions - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setStep("result");
      }
    }, 300);
  };

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleReportSubmit = async () => {
    if (!reportForm.name || !reportForm.company || !reportForm.email) {
      toast({ title: "Fyll i alla obligatoriska fält", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      // Build message with quiz results
      const answerSummary = questions
        .map((q) => `${q.question}: ${answers[q.id] || "—"}`)
        .join("\n");

      const message = `AI Readiness Assessment\n\nMognadsnivå: ${result.title} (${totalScore}/${maxScore} poäng)\nSegment: ${goalSegment}\n\nSvar:\n${answerSummary}\n\nRekommendation: ${result.recommendation}`;

      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          company_name: reportForm.company,
          contact_name: reportForm.name,
          email: reportForm.email,
          phone: "",
          message,
          source_page: "/ai-readiness",
          source_type: "ai-readiness-quiz",
          selected_product: goalSegment === "sales" ? "Dynamics 365 Sales" : goalSegment === "service" ? "Dynamics 365 Customer Service" : goalSegment === "finance" ? "Dynamics 365 Finance" : "AI & Copilot",
          industry: "",
          company_size: "",
        },
      });

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "Tack! Din rapport skickas inom kort." });
    } catch {
      toast({ title: "Något gick fel. Försök igen.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  // --- INTRO ---
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="AI Readiness Assessment – Är ni redo för AI i Dynamics 365? | d365.se"
          description="Svara på 13 snabba frågor och få en personlig rekommendation för hur ni tar nästa steg med Copilot och agenter i Dynamics 365."
          canonicalPath="/ai-readiness"
        />
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <section className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI Readiness Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Är din organisation redo för AI i Dynamics 365?
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Många vill införa AI. Få är strukturellt redo.
            </p>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Svara på <strong>13 snabba frågor</strong> och få en personlig rekommendation för hur ni bör ta nästa steg med Copilot och agenter i Dynamics 365.
            </p>

            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => setStep("quiz")}
            >
              Starta Assessment (2 minuter) <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-foreground">13</p>
                <p className="text-xs text-muted-foreground">frågor</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-foreground">2 min</p>
                <p className="text-xs text-muted-foreground">att genomföra</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-foreground">Direkt</p>
                <p className="text-xs text-muted-foreground">resultat</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // --- QUIZ ---
  if (step === "quiz") {
    const currentSection = q.section;
    const sectionStart = questions.findIndex((x) => x.section === currentSection);
    const isNewSection = currentQ === sectionStart;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Fråga {currentQ + 1} av {totalQuestions}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Section header */}
            {isNewSection && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-2xl">{q.sectionEmoji}</span>
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  {q.section}
                </span>
              </div>
            )}

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              {q.question}
            </h2>
            {q.hint && (
              <p className="text-sm text-muted-foreground mb-6 italic">{q.hint}</p>
            )}
            {!q.hint && <div className="mb-6" />}

            {/* Options */}
            <div className="grid gap-3">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => selectAnswer(opt.label, opt.score)}
                    className={`w-full text-left rounded-lg border px-5 py-4 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border bg-card hover:bg-muted/50 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className="font-medium text-foreground">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={currentQ === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Föregående
              </Button>
              {answers[q.id] && (
                <Button
                  onClick={() => {
                    if (currentQ < totalQuestions - 1) {
                      setCurrentQ(currentQ + 1);
                    } else {
                      setStep("result");
                    }
                  }}
                >
                  {currentQ < totalQuestions - 1 ? "Nästa" : "Visa resultat"}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- RESULT ---
  const ResultIcon = result.icon;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`AI Readiness: ${result.title} | d365.se`}
        description={result.subtitle}
        canonicalPath="/ai-readiness"
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Result header */}
          <div className="text-center mb-10">
            <span className="text-5xl mb-4 block">{result.emoji}</span>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
              Er AI-mognad
            </p>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${result.color}`}>
              {result.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {result.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Poäng: {totalScore} av {maxScore}
            </p>
          </div>

          {/* Risks */}
          <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Riskerar att:
              </h3>
              <ul className="space-y-2">
                {result.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-amber-500 shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Rekommenderad start
              </h3>
              <p className="text-muted-foreground">{result.recommendation}</p>
            </CardContent>
          </Card>

          {/* Expected effects */}
          <Card className="mb-8 border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Förväntad effekt
              </h3>
              <ul className="space-y-2">
                {result.expectedEffects.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mb-12">
            <Link
              to={result.cta.link}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
            >
              {result.cta.label} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Reality Check */}
          <div className="rounded-lg border bg-muted/30 p-6 mb-12 text-center">
            <p className="text-foreground font-medium italic text-lg">
              "AI misslyckas sällan på grund av teknik.
              <br />
              Det misslyckas på grund av otydliga processer och brist på ägarskap."
            </p>
          </div>

          {/* Unlock full report */}
          {!showReportForm && !submitted && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6 sm:p-8 text-center">
                <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Lås upp din fullständiga AI-rapport
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Få en personlig rapport med rekommenderad startpunkt, riskområden, förväntad effekt och rekommenderad partnerprofil.
                </p>
                <Button size="lg" onClick={() => setShowReportForm(true)}>
                  Få din rapport <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Report form */}
          {showReportForm && !submitted && (
            <Card className="border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                  Fyll i dina uppgifter
                </h3>
                <div className="grid gap-4 max-w-md mx-auto">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Namn *</label>
                    <Input
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                      placeholder="Ditt namn"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Företag *</label>
                    <Input
                      value={reportForm.company}
                      onChange={(e) => setReportForm({ ...reportForm, company: e.target.value })}
                      placeholder="Företagsnamn"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Roll</label>
                    <Input
                      value={reportForm.role}
                      onChange={(e) => setReportForm({ ...reportForm, role: e.target.value })}
                      placeholder="T.ex. CFO, IT-chef"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">E-post *</label>
                    <Input
                      type="email"
                      value={reportForm.email}
                      onChange={(e) => setReportForm({ ...reportForm, email: e.target.value })}
                      placeholder="din@epost.se"
                    />
                  </div>
                  <Button
                    className="w-full mt-2"
                    size="lg"
                    onClick={handleReportSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Skickar..." : "Skicka och få din rapport"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Vi delar aldrig dina uppgifter. Läs vår{" "}
                    <Link to="/dataskydd" className="underline">integritetspolicy</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submitted confirmation */}
          {submitted && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-6 sm:p-8 text-center">
                <Check className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Tack! Din rapport är på väg.
                </h3>
                <p className="text-muted-foreground">
                  Vi återkommer inom kort med din personliga AI-rapport och rekommendationer.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Restart */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => {
                setStep("intro");
                setCurrentQ(0);
                setAnswers({});
                setScores({});
                setShowReportForm(false);
                setSubmitted(false);
                setReportForm({ name: "", company: "", role: "", email: "" });
              }}
            >
              Gör om assessmentet
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIReadiness;
