import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, BarChart3, Headphones, Truck, Bot, Sparkles, TrendingUp, Brain, Users, Package, Cog, LineChart, ShieldAlert, Heart, DollarSign, Check } from "lucide-react";

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

const AIOverview = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const activeScenario = goals.find((g) => g.id === selectedGoal)?.scenario;

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
        <section className="max-w-5xl mx-auto">
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

          {/* Scenario result */}
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
      </main>
      <Footer />
    </div>
  );
};

export default AIOverview;
