import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Sparkles,
  ClipboardList,
  FileText,
  Search,
  Scale,
  Users,
  Rocket,
  ShieldCheck,
} from "lucide-react";

type Step = {
  num: number;
  icon: typeof ClipboardList;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  links: { label: string; to: string }[];
  primary?: boolean;
};

const steps: Step[] = [
  {
    num: 1,
    icon: ClipboardList,
    tag: "Steg 1 · Vad behöver ni?",
    title: "Behovsanalys",
    highlight: "förankrad i verksamheten",
    description:
      "Kartlägg processer, utmaningar och förbättringspotential innan ni ställer krav eller väljer system. Resultatet är en prioriterad bild av vilka förmågor som är mest affärskritiska – ett stabilt beslutsunderlag som vässar kravbilden och styr upphandlingen mot rätt lösning från start.",
    links: [
      { label: "ERP-behovsanalys", to: "/ERPbehovsanalys/" },
      { label: "CRM-behovsanalys", to: "/CRMbehovsanalys/" },
      { label: "Kundservice & Field Service", to: "/kundservice-behovsanalys/" },
    ],
  },
  {
    num: 2,
    icon: FileText,
    tag: "Steg 2 · Sätt kravbilden",
    title: "Kravspecifikation",
    highlight: "som leverantörerna förstår",
    description:
      "En tydlig, prioriterad och verksamhetsförankrad kravspecifikation säkerställer att Dynamics 365-partnerna kan visa hur deras lösning faktiskt stödjer era processer. Mindre risk för missförstånd – och betydligt enklare att utvärdera anbuden.",
    links: [
      { label: "Kravspec ERP", to: "/kravspecifikation/" },
      { label: "Kravspec Sales", to: "/kravspecifikation-sales/" },
      { label: "Kravspec Marketing", to: "/kravspecifikation-marketing/" },
      { label: "Kravspec Kundservice", to: "/kravspecifikation-kundservice/" },
    ],
  },
  {
    num: 3,
    icon: Search,
    tag: "Steg 3 · Marknads- & partneranalys",
    title: "Hitta rätt typ av Dynamics 365-partner",
    highlight: "med köparsidig vägledning",
    description:
      "Få en strukturerad överblick över vilka partners som matchar er bransch, era produktområden, er geografi och er storlek. Vi står på köparens sida – inga direktlänkar till leverantörer, all kontakt går via plattformens mediarade matchning.",
    links: [
      { label: "Hitta Dynamics 365-partner", to: "/valjdynamics365partner/" },
      { label: "Utforska branscher", to: "/branscher/" },
    ],
    primary: true,
  },
  {
    num: 4,
    icon: Scale,
    tag: "Steg 4 · Utvärdering",
    title: "Utvärdering av lösning och partner",
    highlight: "transparent och faktabaserad",
    description:
      "Jämför partners och lösningar utifrån funktionalitet, branschdjup, AI-mognad, leveransförmåga och risk. Vår AI-guide ger en strukturerad rekommendation baserad på era svar – och du ser tydligt varför varje partner föreslås.",
    links: [
      { label: "Starta AI-guiden", to: "/valjdynamics365partner/?ai=1" },
      { label: "AI Readiness Assessment", to: "/ai-readiness/" },
    ],
  },
  {
    num: 5,
    icon: Users,
    tag: "Steg 5 · Implementeringspartner",
    title: "Välj rätt implementeringspartner",
    highlight: "team, metodik och bemanning",
    description:
      "Rätt implementeringspartner är avgörande för ett lyckat införande. Granska kundexempel, certifieringar, AI-förmågor och referenser för Business Central, F&SCM, Sales, Customer Service, Field Service, Customer Insights och Contact Center.",
    links: [
      { label: "Bläddra bland partners", to: "/valjdynamics365partner/" },
      { label: "Så väljer du rätt partner", to: "/valjdynamics365partner/?ai=1" },
    ],
  },
  {
    num: 6,
    icon: Rocket,
    tag: "Steg 6 · Införande & avtal",
    title: "Införandeplan och avtal",
    highlight: "från beslut till go-live",
    description:
      "Strukturera mål, tidplan, roller, milstolpar och risker innan ni skriver avtal. En tydlig införandeplan minskar riskerna och skapar förutsägbarhet – och avtalet ska spegla det ni faktiskt har kommit överens om.",
    links: [
      { label: "Upphandlingsresan – 7 stadier", to: "/kunskapscenter/upphandlingsresan" },
      { label: "Kunskapscenter", to: "/kunskapscenter" },
    ],
  },
];

const Upphandlingsguiden = () => {
  return (
    <>
      <SEOHead
        title="Upphandlingsguiden – så upphandlar du Dynamics 365"
        description="Köparsidig vägledning genom hela upphandlingen av Microsoft Dynamics 365 – från behovsanalys och kravspec till partnerval, införande och avtal."
        canonicalPath="/upphandlingsguiden"
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(195_45%_10%)] via-[hsl(190_40%_14%)] to-[hsl(20_55%_18%)]">
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-[hsl(var(--cta-orange))]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-[24rem] h-[24rem] rounded-full bg-primary/25 blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white mb-6 backdrop-blur">
              <Sparkles className="w-3 h-3" />
              Upphandlingsguiden för Dynamics 365
            </div>
            <h1 className="text-[26px] sm:text-4xl md:text-[44px] font-bold text-white leading-[1.15] tracking-tight mb-5">
              På <span className="whitespace-nowrap text-[hsl(var(--cta-orange))]">d365.se</span> får din verksamhet
              <span className="block text-white/90 mt-1">vägledning genom upphandlingsresan</span>
            </h1>
            <p className="text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
              På d365.se får din verksamhet köparsidig vägledning genom hela resan – från behovsanalys och hjälp att skriva kravspecifikation, till jämförelser av Dynamics 365-partners och fördjupade insikter i Dynamics 365-applikationerna. Allt samlat på ett ställe, så att ni kan fatta trygga beslut hela vägen fram till avtal och införande.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white text-[15px] font-semibold h-12 px-7 rounded-xl shadow-lg shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5 transition-all"
              >
                <Link to="/valjdynamics365partner/">
                  Hitta rätt partner
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white text-[15px] font-semibold h-12 px-7 rounded-xl"
              >
                <Link to="/ERPbehovsanalys/">Starta behovsanalys</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Köparsidigt löfte */}
        <section className="px-4 sm:px-6 py-10 bg-[#F4F8F8] border-b border-border">
          <div className="container mx-auto max-w-5xl grid sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, title: "Köparens sida", text: "Vi vägleder utan att sälja in en specifik partner." },
              { icon: Check, title: "Strukturerad metodik", text: "Sex tydliga steg från behov till avtal." },
              { icon: Sparkles, title: "AI-stödd matchning", text: "Datadriven rekommendation baserad på era behov." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border shadow-sm">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-[14px]">{title}</div>
                  <div className="text-[13px] text-muted-foreground leading-relaxed">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Steg */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-3xl mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-foreground leading-tight tracking-tight mb-3">
                Vår metodik – från krav till kontrakt
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Sex steg som tar er tryggt genom upphandlingen av Microsoft Dynamics 365. Varje steg länkar vidare till verktyg och guider på sajten så ni kan komma igång direkt.
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const isPrimary = step.primary;
                return (
                  <article
                    key={step.num}
                    className={`group relative overflow-hidden rounded-2xl border shadow-xl p-6 sm:p-8 ${
                      isPrimary
                        ? "bg-gradient-to-br from-[hsl(195_45%_10%)] via-[hsl(190_40%_14%)] to-[hsl(20_55%_18%)] border-[hsl(var(--cta-orange))]/30"
                        : "bg-gradient-to-br from-white via-[hsl(40_30%_98%)] to-[hsl(180_25%_95%)] border-border"
                    }`}
                  >
                    {isPrimary ? (
                      <>
                        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[hsl(var(--cta-orange))]/25 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
                      </>
                    ) : (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-[hsl(var(--cta-orange))] pointer-events-none" />
                    )}

                    <div className="relative grid lg:grid-cols-[auto_1fr] gap-5 lg:gap-8 items-start">
                      <div
                        className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${
                          isPrimary
                            ? "bg-[hsl(var(--cta-orange))] text-white shadow-lg shadow-[hsl(var(--cta-orange))]/40"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </div>

                      <div className="min-w-0">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-[0.12em] mb-4 ${
                            isPrimary
                              ? "bg-white/10 text-white border border-white/20"
                              : "bg-primary/10 text-primary border border-primary/30"
                          }`}
                        >
                          {step.tag}
                        </div>
                        <h3
                          className={`text-xl sm:text-2xl md:text-[28px] font-bold leading-tight tracking-tight mb-3 ${
                            isPrimary ? "text-white" : "text-foreground"
                          }`}
                        >
                          {step.title}{" "}
                          <span className={isPrimary ? "text-[hsl(var(--cta-orange))]" : "text-primary"}>
                            – {step.highlight}
                          </span>
                        </h3>
                        <p
                          className={`text-[14px] sm:text-[15px] leading-relaxed mb-5 max-w-3xl ${
                            isPrimary ? "text-white/80" : "text-muted-foreground"
                          }`}
                        >
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.links.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              className={`group/item inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all hover:-translate-y-0.5 ${
                                isPrimary
                                  ? "bg-white text-foreground hover:bg-white/90 shadow-md"
                                  : "bg-card border border-border text-foreground hover:bg-primary/5 hover:border-primary/40 hover:shadow-md"
                              }`}
                            >
                              {link.label}
                              <ArrowRight className="w-3.5 h-3.5 group-hover/item:translate-x-0.5 transition-transform" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* TAYA / köparsidig vägledning */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-[#F4F8F8]">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary mb-5">
              Så jobbar vi köparsidigt
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight mb-4">
              Radikal transparens i hela upphandlingen
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
              Vi visar öppet vilka partners som har avtal med plattformen och vilka som inte har det, och vi redovisar våra egna ägar- och intresseförhållanden. Du ska kunna lita på rekommendationerna – och själv se hur de räknas fram.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/5"
            >
              <Link to="/agande-och-intressen">
                Läs om ägande och intressen
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Avslut CTA */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(195_45%_10%)] via-[hsl(190_40%_14%)] to-[hsl(20_55%_18%)] border border-[hsl(var(--cta-orange))]/30 shadow-2xl p-8 sm:p-12 text-center">
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[hsl(var(--cta-orange))]/25 blur-3xl pointer-events-none" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white leading-tight tracking-tight mb-4">
                  Redo att starta er upphandling?
                </h2>
                <p className="text-[15px] sm:text-base text-white/80 leading-relaxed mb-7 max-w-2xl mx-auto">
                  Börja med en behovsanalys eller hoppa direkt till partnermatchningen. Båda är gratis och tar bara några minuter.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white text-[15px] font-semibold h-12 px-7 rounded-xl shadow-lg shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5 transition-all"
                  >
                    <Link to="/valjdynamics365partner/">
                      Starta partnermatchning
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white text-[15px] font-semibold h-12 px-7 rounded-xl"
                  >
                    <Link to="/kontakt">Kontakta en rådgivare</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Upphandlingsguiden;
