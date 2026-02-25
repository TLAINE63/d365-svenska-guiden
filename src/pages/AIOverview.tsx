import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, BarChart3, Headphones, Truck, Bot, Sparkles, TrendingUp, Brain, Users, Package, Cog, LineChart, ShieldAlert, Heart, DollarSign, Check, Search, ArrowRight, CircleCheck, CircleDot, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    emoji: "💼",
    title: "CFO / Ekonomichef",
    focus: "Effektivare bokslut, kassaflöde, avvikelser, prognoser",
    icon: Briefcase,
    color: "from-blue-600/20 to-indigo-600/20 border-blue-500/30",
    link: "/copilot",
  },
  {
    emoji: "📈",
    title: "Försäljningschef",
    focus: "Bättre pipeline, träffsäkrare prioritering, snabbare avslut",
    icon: BarChart3,
    color: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30",
    link: "/d365-sales",
  },
  {
    emoji: "🎧",
    title: "Kundservicechef",
    focus: "Kortare svarstid, automatiserade ärenden, högre kundnöjdhet",
    icon: Headphones,
    color: "from-purple-600/20 to-fuchsia-600/20 border-purple-500/30",
    link: "/d365-customer-service",
  },
  {
    emoji: "🚚",
    title: "Supply Chain / Logistik",
    focus: "Lageroptimering, prognoser, avvikelser",
    icon: Truck,
    color: "from-amber-600/20 to-orange-600/20 border-amber-500/30",
    link: "/finance-supply-chain",
  },
];

const benefits = [
  { icon: Bot, text: "Automatisera repetitiva uppgifter" },
  { icon: Brain, text: "Få bättre beslutsunderlag i realtid" },
  { icon: TrendingUp, text: "Öka träffsäkerhet i försäljning" },
  { icon: Package, text: "Effektivisera ekonomi- och lagerprocesser" },
  { icon: Users, text: "Skala kundservice utan att öka personalstyrkan" },
];

const goals = [
  {
    id: "automate",
    emoji: "⚙️",
    icon: Cog,
    title: "Automatisera manuellt arbete",
    color: "from-sky-600/20 to-blue-600/20 border-sky-500/30",
    scenario: {
      heading: "AI-automation i praktiken",
      description: "Copilot och agenter kan ta över repetitiva uppgifter som fakturamatchning, datainmatning och ärendesortering – så att ditt team fokuserar på det som skapar värde.",
      examples: [
        "Automatisk kontering och fakturamatchning i Business Central",
        "Agenter som kategoriserar och dirigerar supportärenden",
        "Copilot som skapar utkast till e-post och sammanfattningar",
      ],
      cta: { label: "Läs mer om Copilot", link: "/copilot" },
    },
  },
  {
    id: "forecast",
    emoji: "📊",
    icon: LineChart,
    title: "Få bättre prognoser",
    color: "from-indigo-600/20 to-violet-600/20 border-indigo-500/30",
    scenario: {
      heading: "Prediktiva insikter med AI",
      description: "Dynamics 365 analyserar historisk data och marknadstrender för att ge mer träffsäkra prognoser – från kassaflöde till försäljningspipeline.",
      examples: [
        "Kassaflödesprognoser i Finance",
        "Sales forecasting med Dynamics 365 Sales",
        "Lagerprognoser i Supply Chain Management",
      ],
      cta: { label: "Utforska Finance & Supply Chain", link: "/finance-supply-chain" },
    },
  },
  {
    id: "risk",
    emoji: "🛡️",
    icon: ShieldAlert,
    title: "Identifiera risker tidigare",
    color: "from-red-600/20 to-rose-600/20 border-red-500/30",
    scenario: {
      heading: "Proaktiv riskhantering",
      description: "AI flaggar avvikelser, sena betalningar och operativa risker innan de blir problem – ge ledningen ett försprång.",
      examples: [
        "Avvikelsedetektering i ekonomidata",
        "Kreditriskbedömning vid offerter",
        "Copilot som sammanfattar risker i projekt",
      ],
      cta: { label: "Läs om Business Central", link: "/business-central" },
    },
  },
  {
    id: "cx",
    emoji: "💚",
    icon: Heart,
    title: "Förbättra kundupplevelsen",
    color: "from-emerald-600/20 to-green-600/20 border-emerald-500/30",
    scenario: {
      heading: "AI-driven kundservice",
      description: "Snabbare svar, personligare bemötande och automatisk ärendehantering – utan att öka personalstyrkan.",
      examples: [
        "Copilot som föreslår svar baserat på kunskapsartiklar",
        "Sentimentanalys i realtid på kundsamtal",
        "Agenter som löser vanliga ärenden helt autonomt",
      ],
      cta: { label: "Utforska Customer Service", link: "/d365-customer-service" },
    },
  },
  {
    id: "revenue",
    emoji: "💰",
    icon: DollarSign,
    title: "Öka försäljning per kund",
    color: "from-amber-600/20 to-yellow-600/20 border-amber-500/30",
    scenario: {
      heading: "Smartare sälj med AI",
      description: "Copilot hjälper säljare att identifiera rätt kunder, prioritera affärer och stänga snabbare med datadrivna rekommendationer.",
      examples: [
        "Lead scoring och prioritering med AI",
        "Copilot-förslag på nästa bästa åtgärd",
        "Merförsäljning baserat på kundbeteende",
      ],
      cta: { label: "Utforska Dynamics 365 Sales", link: "/d365-sales" },
    },
  },
];

const readinessQuestions = [
  "Har ni strukturerad och kvalitetssäkrad data?",
  "Är era processer standardiserade?",
  "Arbetar ni redan i Dynamics 365?",
  "Har ni identifierat flaskhalsar?",
  "Finns tydliga affärsmål kopplade till effektivisering?",
];

const crmScenarios = [
  {
    num: "1",
    title: "Smart lead-prioritering",
    desc: "Copilot analyserar historiska affärer, beteende och kommunikation → visar vilka affärer du bör fokusera på denna vecka.",
  },
  {
    num: "2",
    title: "Automatiska mötessammanfattningar",
    desc: "Efter Teams-möten skapas automatiska sammanfattningar, uppgifter och nästa steg.",
  },
  {
    num: "3",
    title: "Förslag på nästa bästa åtgärd",
    desc: "Systemet föreslår åtgärder baserat på kunddata, historik och sannolikhet.",
  },
  {
    num: "4",
    title: "AI-baserad kundservice",
    desc: "Agenter kan svara på vanliga frågor, skapa ärenden automatiskt och föreslå lösningar till handläggare.",
  },
];

const erpScenarios = [
  {
    num: "1",
    title: "Automatisk avvikelseanalys",
    desc: "AI identifierar transaktioner som avviker från normala mönster.",
  },
  {
    num: "2",
    title: "Prognoser för kassaflöde",
    desc: "Prediktiv analys baserad på historik och aktuella data.",
  },
  {
    num: "3",
    title: "Lageroptimering",
    desc: "AI förutser efterfrågan och minskar överlager.",
  },
  {
    num: "4",
    title: "Bokslutsagenter",
    desc: "Automatiserade moment i periodavslut och rapportering.",
  },
];

const practicalEffects = [
  "20–40% minskning av manuella moment",
  "Kortare ledtider i säljcykeln",
  "Förbättrad prognosprecision",
  "Färre fel i ekonomiprocesser",
  "Ökad kundnöjdhet",
];

type ReadinessLevel = "early" | "pilot" | "scale" | null;

const readinessResults: Record<Exclude<ReadinessLevel, null>, { icon: typeof CircleAlert; color: string; title: string; description: string }> = {
  early: {
    icon: CircleAlert,
    color: "text-amber-500",
    title: "Tidigt läge – börja med datagrund",
    description: "Ni har potential men behöver först säkerställa datakvalitet och standardiserade processer. Vi rekommenderar att börja med en nulägesanalys.",
  },
  pilot: {
    icon: CircleDot,
    color: "text-blue-500",
    title: "Redo för pilotprojekt",
    description: "Ni har en bra grund. Nästa steg är att identifiera ett avgränsat område för ett AI-pilotprojekt med tydliga KPI:er.",
  },
  scale: {
    icon: CircleCheck,
    color: "text-emerald-500",
    title: "Redo för AI-skalning",
    description: "Ni har förutsättningarna på plats för att bredda AI-användningen. Dags att skapa en roadmap för skalbar AI i hela verksamheten.",
  },
};

const AIOverview = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>(new Array(readinessQuestions.length).fill(false));
  const [showResult, setShowResult] = useState(false);

  const activeScenario = goals.find((g) => g.id === selectedGoal)?.scenario;

  const yesCount = answers.filter(Boolean).length;
  const readinessLevel: ReadinessLevel = !showResult
    ? null
    : yesCount <= 2
    ? "early"
    : yesCount <= 4
    ? "pilot"
    : "scale";

  const toggleAnswer = (index: number) => {
    const next = [...answers];
    next[index] = !next[index];
    setAnswers(next);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="AI med Copilot & Agenter i Dynamics 365 | d365.se"
        description="Från automation till verklig affärseffekt. Se hur Copilot och intelligenta agenter i Dynamics 365 effektiviserar din verksamhet."
        canonicalPath="/ai-oversikt"
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Microsoft AI i Dynamics 365
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            AI med Copilot &amp; Agenter i Dynamics 365
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-medium mb-8">
            Från automation till verklig affärseffekt
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            AI i Dynamics 365 handlar inte om experiment. Det handlar om att:
          </p>

          <div className="grid gap-4 max-w-xl mx-auto text-left mb-10">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3">
                <b.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{b.text}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Med <strong>Copilot</strong> och <strong>intelligenta agenter</strong> byggs AI direkt in i dina affärsprocesser.
          </p>
        </section>

        {/* Copilot vs Agenter */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">📌</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Copilot vs Agenter – vad är skillnaden?
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-10">
            Många blandar ihop begreppen. Här är den viktiga skillnaden.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Copilot */}
            <Card className="border bg-gradient-to-br from-sky-600/10 to-blue-600/10 border-sky-500/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-7 w-7 text-sky-500" />
                  <h3 className="text-xl font-bold text-foreground">Copilot</h3>
                </div>
                <p className="text-lg font-semibold text-foreground/90 mb-4">
                  Assisterar användare
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-sky-500 shrink-0 mt-1" />
                    <span>Föreslår svar, sammanfattar och ger rekommendationer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-sky-500 shrink-0 mt-1" />
                    <span>Användaren fattar beslut och bekräftar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-sky-500 shrink-0 mt-1" />
                    <span>Inbyggd i gränssnittet – alltid till hands</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-lg bg-sky-500/10 px-4 py-3">
                  <p className="text-sm font-medium text-foreground/80 italic">
                    "Din AI-assistent som gör dig snabbare och smartare."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Agenter */}
            <Card className="border bg-gradient-to-br from-purple-600/10 to-fuchsia-600/10 border-purple-500/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Bot className="h-7 w-7 text-purple-500" />
                  <h3 className="text-xl font-bold text-foreground">Agenter</h3>
                </div>
                <p className="text-lg font-semibold text-foreground/90 mb-4">
                  Automatiserar processer självständigt
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
                    <span>Utför uppgifter utan manuell inblandning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
                    <span>Övervakar, agerar och eskalerar vid behov</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
                    <span>Arbetar dygnet runt i bakgrunden</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-lg bg-purple-500/10 px-4 py-3">
                  <p className="text-sm font-medium text-foreground/80 italic">
                    "Din digitala medarbetare som jobbar även när du inte gör det."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Step 1 – Role cards */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-3">
            Steg 1 – Välj din roll
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Klicka på den roll som bäst beskriver dig för att se relevanta AI-möjligheter.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Link key={role.title} to={role.link}>
                <Card className={`group relative overflow-hidden border bg-gradient-to-br ${role.color} hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full`}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-4xl mb-4">{role.emoji}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground/80">Fokus:</span> {role.focus}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Step 2 – Goals */}
        <section className="max-w-5xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🧠</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Steg 2 – Vad vill du uppnå?
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-10">
            Välj ett mål nedan så visar vi ett relevant AI-scenario.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {goals.map((goal) => {
              const isActive = selectedGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(isActive ? null : goal.id)}
                  className="text-left w-full"
                >
                  <Card className={`group relative overflow-hidden border transition-all duration-300 h-full ${
                    isActive
                      ? `bg-gradient-to-br ${goal.color} ring-2 ring-primary/50 scale-[1.02]`
                      : "bg-card hover:bg-muted/50 hover:scale-[1.01]"
                  }`}>
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{goal.emoji}</span>
                        <div>
                          <h3 className={`font-bold text-foreground mb-0.5 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}>
                            {goal.title}
                          </h3>
                        </div>
                        {isActive && (
                          <Check className="h-5 w-5 text-primary ml-auto shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>

          {activeScenario && (
            <div className="max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    {activeScenario.heading}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {activeScenario.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {activeScenario.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{ex}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={activeScenario.cta.link}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    {activeScenario.cta.label} →
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Concrete AI Scenarios */}
        <section className="max-w-5xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🎯</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Konkreta AI-scenarier i Dynamics 365
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-12">
            Så används Copilot och agenter i verkliga affärsprocesser.
          </p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* CRM column */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                AI i CRM (Sales &amp; Customer Service)
              </h3>
              <div className="space-y-5">
                {crmScenarios.map((s) => (
                  <div key={s.num} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {s.num}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ERP column */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                AI i ERP (Finance &amp; Supply Chain)
              </h3>
              <div className="space-y-5">
                {erpScenarios.map((s) => (
                  <div key={s.num} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {s.num}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{s.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Practical effects */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">📊</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Vad betyder detta i praktiken?
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-8">
            Typiska effekter vi ser i projekt med AI i Dynamics 365:
          </p>
          <div className="grid gap-3">
            {practicalEffects.map((effect, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted/50 rounded-lg px-5 py-3.5">
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-foreground font-medium">{effect}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Getting started steps */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🛠</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Så kommer ni igång
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-10">
            Tre steg från idé till verklig AI-effekt.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: "1", title: "Identifiera process", desc: "Vi definierar var AI ger störst affärseffekt." },
              { step: "2", title: "Proof of Value", desc: "Testa i liten skala." },
              { step: "3", title: "Skala", desc: "Rulla ut brett med rätt partner." },
            ].map((s) => (
              <Card key={s.step} className="border bg-card text-center">
                <CardContent className="p-6 sm:p-8">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/valj-partner"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-lg hover:bg-primary/90 transition-colors"
            >
              👉 Hitta rätt Dynamics 365-partner för AI <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* AI Readiness Check */}
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Search className="h-7 w-7 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">
              Är ni redo för AI?
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-10">
            Svara på 5 snabba frågor och se var ni befinner er på AI-resan.
          </p>

          <Card className="border-primary/10">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4 mb-8">
                {readinessQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => toggleAnswer(i)}
                    className="w-full flex items-center gap-4 text-left rounded-lg border px-4 py-3.5 transition-all hover:bg-muted/50"
                  >
                    <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      answers[i] ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}>
                      {answers[i] && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <span className="text-foreground font-medium">{q}</span>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setShowResult(true)}
                className="w-full"
                size="lg"
              >
                Visa mitt resultat <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {readinessLevel && (
                <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  {(() => {
                    const result = readinessResults[readinessLevel];
                    const ResultIcon = result.icon;
                    return (
                      <div className="rounded-lg border bg-muted/30 p-6">
                        <div className="flex items-start gap-4">
                          <ResultIcon className={`h-8 w-8 shrink-0 ${result.color}`} />
                          <div>
                            <h4 className="text-lg font-bold text-foreground mb-2">{result.title}</h4>
                            <p className="text-muted-foreground mb-4">{result.description}</p>
                            <Link
                              to="/kontakt"
                              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                              Boka AI-workshop <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIOverview;
