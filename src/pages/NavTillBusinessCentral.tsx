import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { nowrapBrand } from "@/lib/nowrapBrand";

const TEST_ID = "nav-test";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se/" },
  { name: "Business Central", url: "https://d365.se/businesscentral/" },
  { name: "NAV till Business Central", url: "https://d365.se/nav-till-business-central/" },
];

const faqs = [
  {
    question: "Vad är skillnaden mellan Navision, Dynamics NAV och Business Central?",
    answer:
      "Det är samma produktfamilj i olika generationer. Navision blev Microsoft Dynamics NAV, och Business Central är Microsofts nuvarande affärssystem i den linjen. Business Central finns främst som molntjänst och skiljer sig i teknik, licensmodell och hur anpassningar byggs.",
  },
  {
    question: "Vad ersätter Microsoft Dynamics NAV?",
    answer:
      "Microsoft lyfter fram Dynamics 365 Business Central som efterföljaren till Dynamics NAV. Vilka supportdatum som gäller för just er version bör ni kontrollera hos Microsoft eller er partner.",
  },
  {
    question: "Kan man uppgradera Dynamics NAV till Business Central?",
    answer:
      "Ja, det finns uppgraderingsvägar från NAV till Business Central. Hur direkt vägen blir beror på vilken NAV-version ni har och hur mycket lösningen är anpassad. Be er partner beskriva vägen för just er version.",
  },
  {
    question: "Kan man migrera Navision till Business Central?",
    answer:
      "Ja, men för äldre Navision-lösningar handlar det oftare om att flytta data och bygga om processer än om en ren uppgradering. Ju äldre och mer anpassad lösningen är, desto viktigare blir frågan vad som ska följa med.",
  },
  {
    question: "Kan NAV flyttas till Business Central Online?",
    answer:
      "Ja, det är möjligt att gå från NAV till Business Central Online. Anpassningar måste då byggas som tillägg (appar) eftersom molnversionen inte tillåter ändringar direkt i standardkoden. Vilken väg som gäller för er version bör en partner bekräfta.",
  },
  {
    question: "Vad händer med NAV-anpassningar vid en uppgradering till Business Central?",
    answer:
      "De flyttas inte automatiskt som de är. Varje anpassning behöver prövas: behålla, ersätta med standard, ersätta med en app eller avveckla. Många anpassningar löser problem som standard eller appar hanterar idag.",
  },
  {
    question: "Kan historik och data från NAV flyttas till Business Central?",
    answer:
      "Data kan flyttas, men det betyder inte att all historik bör flyttas. Den viktigare frågan är hur mycket historik verksamheten faktiskt behöver arbeta med i Business Central, och hur resten ska arkiveras och vara sökbar.",
  },
  {
    question: "Vad kostar det att uppgradera NAV till Business Central?",
    answer:
      "Det finns inget generellt pris. Kostnaden styrs av NAV-version, antal användare och bolag, anpassningar, integrationer, mängden historisk data och vilken migrationsstrategi ni väljer. Be om offerter som redovisar dessa delar separat.",
  },
  {
    question: "Hur lång tid tar det att migrera NAV till Business Central?",
    answer:
      "Det beror på samma faktorer som kostnaden. En lösning nära standard går betydligt snabbare än en kraftigt anpassad lösning med många integrationer. Be partnern om en tidplan som bygger på en genomgång av er faktiska lösning.",
  },
  {
    question: "Bör man uppgradera NAV eller implementera Business Central på nytt?",
    answer:
      "Uppgradering passar oftare när lösningen ligger nära standard. Ny implementation är värd att utreda när lösningen är kraftigt anpassad eller bygger på arbetssätt som inte längre gäller. Det är ett verksamhetsbeslut, inte bara ett tekniskt.",
  },
  {
    question: "Hur väljer man partner för NAV till Business Central?",
    answer:
      "Välj en partner som först vill förstå er nuvarande lösning och era behov, inte en som direkt lovar att flytta allt. Fråga efter erfarenhet av liknande övergångar, hur de prövar anpassningar och hur de hanterar historisk data.",
  },
];

const navVersions = [
  "NAV 2018",
  "NAV 2017",
  "NAV 2016",
  "NAV 2015",
  "NAV 2013 / 2013 R2",
  "NAV 2009",
  "Äldre Navision/NAV",
];

const customizationChecklist = [
  "Används funktionen fortfarande?",
  "Vilket verksamhetsproblem löser den?",
  "Finns motsvarande funktion i Business Central?",
  "Kan behovet lösas med standard?",
  "Kan en app lösa behovet?",
  "Behövs fortfarande specialutveckling?",
  "Kan funktionen tas bort?",
];

const costDrivers = [
  "NAV-version",
  "Antal användare",
  "Antal bolag",
  "Anpassningar",
  "Integrationer",
  "Historisk data",
  "Verksamhetsprocesser",
  "Migrationsstrategi",
];

const scrollToTest = () => {
  document.getElementById(TEST_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const TestCta = ({ label = "Gör NAV → Business Central-testet", size = "lg" }: { label?: string; size?: "lg" | "default" }) => (
  <Button size={size} onClick={scrollToTest}>
    {label}
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
);

/** Platshållare där NAV → Business Central-testet byggs i nästa steg. */
export const NavBcTestContainer = () => (
  <div
    data-nav-bc-test-root
    className="rounded-xl border border-dashed border-border bg-muted/40 p-6 sm:p-10 text-center"
  >
    <p className="text-sm font-medium text-foreground">Testet öppnar här inom kort.</p>
    <p className="mt-2 text-sm text-muted-foreground">
      Under tiden kan ni läsa om de tre vägarna nedan eller titta på{" "}
      <Link to="/businesscentral/" className="underline underline-offset-2 hover:text-foreground">
        Business Central-guiden
      </Link>
      .
    </p>
  </div>
);

const NavTillBusinessCentral = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const testEl = document.getElementById(TEST_ID);
    let heroOut = false;
    let testIn = false;
    const update = () => setShowSticky(heroOut && !testIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === el) heroOut = !e.isIntersecting;
        if (e.target === testEl) testIn = e.isIntersecting;
      }
      update();
    });
    io.observe(el);
    if (testEl) io.observe(testEl);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Navision & Dynamics NAV till Business Central | Guide + test"
        titleMaxLength={75}
        description="Kör ni Navision eller Dynamics NAV? Se om ni bör uppgradera, migrera eller börja om med Business Central. Gör NAV-testet och få en första rekommendation."
        canonicalPath="/nav-till-business-central/"
        ogType="article"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />
      <Navbar />

      <main>
        {/* Hero */}
        <section ref={heroRef} className="pt-24 pb-12 sm:pt-28 sm:pb-16 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="Brödsmulor" className="mb-6 text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1">
                  <li><Link to="/" className="hover:text-foreground">Hem</Link></li>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  <li><Link to="/businesscentral/" className="hover:text-foreground">Business Central</Link></li>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  <li aria-current="page" className="text-foreground">NAV till Business Central</li>
                </ol>
              </nav>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Navision och Dynamics NAV till Business Central: uppgradera, migrera eller börja om?
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Kör ni fortfarande Navision eller Dynamics NAV? Ta reda på vilken väg till Business Central som kan passa
                ert företag, vad som kan göra migreringen komplex och vad ni bör undersöka innan ni begär offert.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <TestCta />
                <span className="text-sm text-muted-foreground">10 frågor. Få en första rekommendation direkt.</span>
              </div>

              <ol className="mt-10 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
                {["10 frågor", "Förstå komplexiteten", "Få rekommenderad väg"].map((step, i) => (
                  <li key={step} className="contents">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{step}</span>
                    </div>
                    {i < 2 && <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground mx-auto" aria-hidden />}
                  </li>
                ))}
              </ol>

              <blockquote className="mt-10 border-l-4 border-accent pl-5 text-lg sm:text-xl font-medium text-foreground leading-snug">
                ”Om ni införde Business Central idag, vad från er gamla NAV-lösning skulle ni faktiskt vilja ta med er?”
              </blockquote>
            </div>
          </div>
        </section>

        {/* Tre vägar */}
        <section className="py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Tre vägar från Navision och Dynamics NAV till Business Central
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Uppgradera och migrera NAV till Business Central</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    Relevant att utreda när den befintliga NAV-lösningen ligger relativt nära standard och mängden
                    specialanpassningar och integrationer är hanterbar.
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Förenkla NAV-lösningen före migreringen</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      Relevant när NAV utvecklats under många år och innehåller anpassningar eller integrationer som bör
                      omprövas innan de flyttas.
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-foreground">
                      {["Behåll", "Standard", "App", "Avveckla"].map((s, i) => (
                        <span key={s} className="flex items-center gap-1.5">
                          <span className="rounded-full border border-border bg-muted px-2.5 py-1">{s}</span>
                          {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden />}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs">d365.se:s sätt att strukturera frågan, inte en officiell Microsoft-metodik.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Implementera Business Central på nytt</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      Relevant att utreda när den befintliga NAV-lösningen är kraftigt specialanpassad eller innehåller
                      mycket historiskt arv.
                    </p>
                    <p className="font-medium text-foreground">
                      ”Är det bättre att återskapa gamla NAV eller bygga den Business Central-lösning verksamheten behöver
                      idag?”
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="mt-8">
                <TestCta label="Vilken väg passar er? Gör testet" size="default" />
              </div>
            </div>
          </div>
        </section>

        {/* Testsektion */}
        <section id={TEST_ID} className="py-14 sm:py-16 bg-muted/30 border-y border-border scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Test: Vilken väg från NAV till Business Central passar ert företag?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Svara på 10 frågor om er Navision- eller NAV-lösning och få en första bedömning av ert utgångsläge inför
                en övergång till Business Central.
              </p>
              <div className="mt-8">
                <NavBcTestContainer />
              </div>
            </div>
          </div>
        </section>

        {/* Fördjupning */}
        <article className="py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-14">
              <section>
                <h2 className="text-2xl font-bold text-foreground">
                  Ska ni uppgradera NAV eller implementera Business Central på nytt?
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  En NAV-lösning som använts i många år bär ofta på mer än själva systemet:
                </p>
                <ul className="mt-3 space-y-1.5 text-muted-foreground list-disc pl-5">
                  <li>specialanpassningar</li>
                  <li>integrationer</li>
                  <li>historisk data</li>
                  <li>äldre arbetssätt</li>
                  <li>funktioner som idag kan lösas annorlunda</li>
                </ul>
                <p className="mt-4 font-medium text-foreground">
                  Flytta inte automatiskt allt bara för att det finns i den gamla lösningen.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground">
                  Vad händer med era NAV-anpassningar när ni går till Business Central?
                </h2>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  Behålla, ersätta eller ta bort gamla NAV-anpassningar?
                </h3>
                <p className="mt-2 text-muted-foreground">Gå igenom varje anpassning med de här frågorna:</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {customizationChecklist.map((q) => (
                    <li key={q} className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      {q}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground">
                  Kan data och historik flyttas från NAV till Business Central?
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Vanlig fråga</p>
                    <p className="mt-1 font-medium text-foreground">”Kan vi flytta all historik?”</p>
                  </div>
                  <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Bättre fråga</p>
                    <p className="mt-1 font-medium text-foreground">
                      ”Hur mycket historik behöver verksamheten faktiskt i Business Central?”
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Allt som flyttas ska kontrolleras, mappas och testas. Äldre historik kan ofta arkiveras och hållas
                  sökbar utan att följa med in i det nya systemet.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground">Vad kostar det att uppgradera NAV till Business Central?</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Det finns inget generellt pris. Kostnaden påverkas bland annat av:
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {costDrivers.map((c) => (
                    <li key={c} className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground">{c}</li>
                  ))}
                </ul>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Be om offerter där dessa delar redovisas separat, så blir de jämförbara. Licenspriser för Business
                  Central finns på{" "}
                  <Link to="/priser/" className="underline underline-offset-2 hover:text-foreground">prissidan</Link>.
                </p>
                <div className="mt-6">
                  <TestCta label="Gör NAV-testet innan ni räknar på kostnaden" size="default" />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground">Vilken NAV-version har ni och varför spelar den roll?</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Versionen påverkar vilken uppgraderingsväg som är möjlig och hur mycket arbete som krävs. Exakt väg för
                  er version bör bekräftas av Microsofts dokumentation eller er partner.
                </p>
                <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {navVersions.map((v) => (
                    <li key={v} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-center text-foreground">{v}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground">
                  Vanliga frågor om Navision, Dynamics NAV och Business Central
                </h2>
                <Accordion type="multiple" className="mt-6">
                  {faqs.map((f, i) => (
                    <AccordionItem key={f.question} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">
                        <span className="flex items-start gap-2">
                          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                          {nowrapBrand(f.question)}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {nowrapBrand(f.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <p className="mt-6 text-xs text-muted-foreground">
                  Produktuppgifter om Business Central bygger på Microsofts allmänna beskrivning. Rekommendationer om
                  vägval är d365.se-redaktionens bedömning. Versionskrav, supportdatum och uppgraderingsvägar för en
                  specifik NAV-version ska bekräftas av Microsoft eller er partner. Under redaktionell faktagranskning.
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>

      {/* Diskret sticky CTA, endast desktop */}
      <div
        className={`hidden lg:block fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          showSticky ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
        }`}
        aria-hidden={!showSticky}
      >
        <Button onClick={scrollToTest} className="shadow-lg" tabIndex={showSticky ? 0 : -1}>
          Gör NAV-testet
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default NavTillBusinessCentral;
