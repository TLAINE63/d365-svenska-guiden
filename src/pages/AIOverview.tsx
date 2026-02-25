import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, BarChart3, Headphones, Truck, Bot, Sparkles, TrendingUp, Brain, Users, Package } from "lucide-react";

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

const AIOverview = () => {
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

          {/* Benefits list */}
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

        {/* Role cards */}
        <section className="max-w-5xl mx-auto">
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
      </main>
      <Footer />
    </div>
  );
};

export default AIOverview;
