import { Link } from "react-router-dom";
import { ArrowRight, Layers, Sparkles, LifeBuoy, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import EditorialSource from "@/components/EditorialSource";
import { nowrapBrand } from "@/lib/nowrapBrand";

const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Redan Dynamics-kund", url: "/befintlig-kund/" },
];

type Area = {
  icon: typeof Layers;
  title: string;
  text: string;
  points: string[];
  links: { label: string; href: string }[];
};

const areas: Area[] = [
  {
    icon: Layers,
    title: "Utöka med fler applikationer",
    text: "Många börjar med ett affärssystem eller ett CRM och bygger vidare när behoven växer. Dynamics 365-applikationerna delar data, så nästa steg kan ofta byggas på det ni redan har.",
    points: [
      "Affärssystem och säljstöd: offert, order och kundhistorik i samma flöde.",
      "Kundservice och fältservice kopplat till lager, inköp och fakturering.",
      "Marknad och kunddata som bygger på det sälj och service redan registrerar.",
    ],
    links: [
      { label: "Affärssystem: Business Central och F&SCM", href: "/affarssystem/" },
      { label: "CRM: sälj, marknad och kundservice", href: "/crm/" },
    ],
  },
  {
    icon: Sparkles,
    title: "AI och Copilot i befintlig lösning",
    text: "Copilot och AI-agenter kan ofta tas i bruk i den lösning ni redan har. Börja med en konkret arbetsuppgift där tid eller kvalitet går att mäta.",
    points: [
      "Vilka arbetsmoment tar mest tid i dag?",
      "Är datan i systemet tillräckligt bra för att AI ska ge rätt svar?",
      "Vem ansvarar för behörigheter och uppföljning?",
    ],
    links: [{ label: "AI och Copilot i Dynamics 365", href: "/aioversikt/" }],
  },
  {
    icon: LifeBuoy,
    title: "Förvaltning och vidareutveckling",
    text: "Efter driftstart behövs löpande uppdateringar, support och utveckling. Förvaltningen avgör ofta hur mycket nytta lösningen ger över tid.",
    points: [
      "Hur hanteras Microsofts två större uppdateringar per år?",
      "Finns tydlig supportnivå och kontaktväg för era användare?",
      "Finns en plan för vidareutveckling, inte bara felrättning?",
    ],
    links: [{ label: "Kompetensområden hos partners", href: "/kompetens/" }],
  },
  {
    icon: Target,
    title: "Spetskompetens för ett avgränsat behov",
    text: "Ibland behövs kompetens som nuvarande partner inte har, till exempel en bransch, en integration eller ett nytt produktområde. Det går att ta in en specialist för just det.",
    points: [
      "Beskriv behovet så avgränsat som möjligt.",
      "Fråga efter liknande uppdrag och vem som faktiskt gör jobbet.",
      "Klargör hur specialisten samarbetar med er nuvarande partner.",
    ],
    links: [{ label: "Hitta partner per produkt och bransch", href: "/valjdynamics365partner/" }],
  },
];

const BefintligKund = () => (
  <>
    <SEOHead
      title="Redan Dynamics 365-kund? Utöka, AI och förvaltning"
      description="För er som redan har Dynamics 365: bygg vidare med fler applikationer, kom igång med AI och Copilot, säkra förvaltningen och hitta spetskompetens."
      canonicalPath="/befintlig-kund/"
      breadcrumbs={breadcrumbs}
    />
    <Navbar />
    <main className="min-h-screen pt-28 lg:pt-32 pb-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
        <header className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            {nowrapBrand("Har ni redan Dynamics 365? Så bygger ni vidare")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {nowrapBrand("Den största nyttan kommer ofta efter första införandet. Här finns fyra vanliga vägar vidare: fler applikationer, AI, förvaltning och spetskompetens.")}
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {areas.map(({ icon: Icon, title, text, points, links }) => (
            <section key={title} className="rounded-lg border border-border bg-card p-6 flex flex-col">
              <Icon className="h-6 w-6 text-accent mb-3" aria-hidden />
              <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{nowrapBrand(text)}</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-5">
                {points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <ul className="mt-auto space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                      {nowrapBrand(l.label)} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-lg border border-border bg-secondary/40 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Samla era behov innan ni pratar med en partner</h2>
          <p className="text-muted-foreground mb-5 max-w-3xl">
            Gör en egen utvärdering av vad ni vill utöka eller förbättra. Underlaget sparas bara i er webbläsare och kan användas i dialog med er nuvarande eller en ny partner.
          </p>
          <Link to="/underlag/" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Starta Din Dynamics-utvärdering <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <EditorialSource sourceType="Köpguide" />
      </div>
    </main>
    <Footer />
  </>
);

export default BefintligKund;
