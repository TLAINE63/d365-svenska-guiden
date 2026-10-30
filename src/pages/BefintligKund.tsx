import ExistingCustomerDiagnosis from "@/components/ExistingCustomerDiagnosis";
import ExistingDynamicsNextStep, { PARTNER_REVIEW_HASH } from "@/components/existing/ExistingDynamicsNextStep";
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
    text: "Många börjar med ett affärssystem eller ett CRM och bygger vidare när behoven växer. Dynamics\u00A0365\u2011applikationerna delar data, så nästa steg kan ofta byggas på det ni redan har.",
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
    links: [
      { label: "Kompetensområden hos partners", href: "/kompetens/" },
    ],
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
            {nowrapBrand("Den största nyttan kommer ofta efter första införandet. Här finns fyra vanliga vägar vidare: fler applikationer inom ERP eller CRM, AI, förvaltning och spetskompetens.")}
          </p>
        </header>

        <ExistingDynamicsNextStep />

        <ExistingCustomerDiagnosis />

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Fyra vanliga vägar för befintliga kunder</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Utvärdera partnersamarbetet", d: "Bedöm vad som fungerar och vad som behöver förbättras innan ni beslutar.", h: "/guider/byta-dynamics-partner/" },
              { t: "Second opinion", d: "En extra genomgång av lösning, offert eller partner innan ni beslutar.", h: "/second-opinion/" },
              { t: "Optimera och felsöka", d: "Prestanda, anpassningar, integrationer och användning.", h: "/guider/optimera-dynamics-365/" },
              { t: "Support och förvaltning", d: "Vad avtalet ska omfatta och hur ansvaret fördelas.", h: "/guider/dynamics-365-support-forvaltning/" },
            ].map((x) => (
              <Link key={x.h} to={x.h} className="group rounded-lg border border-border bg-card p-5 hover:border-primary transition-colors">
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary">{x.t}</h3>
                <p className="text-sm text-muted-foreground">{x.d}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {areas.map(({ icon: Icon, title, text, points, links }) => (
            <section key={title} className="rounded-lg border border-border bg-card p-6 flex flex-col">
              <Icon className="h-6 w-6 text-accent mb-3" aria-hidden />
              <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground mb-4">{nowrapBrand(text)}</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground mb-5">
                {points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <p className="mt-auto text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Nästa steg</p>
              <ul className="space-y-2">
                {links.map((l, i) => (
                  <li key={l.href}>
                    <Link to={l.href} className={i === 0 ? "inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90" : "inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"}>
                      {nowrapBrand(l.label)} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-lg border border-border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Vill ni utvärdera partnersamarbetet?</h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {nowrapBrand("Friktion i samarbetet betyder inte att ni måste byta partner eller system. Ofta går det att förbättra samarbetet. Om ni ändå väljer att byta finns Dynamics 365-lösningen och era data kvar, det som byts är vem som förvaltar och utvecklar den.")}
          </p>
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            {[
              { t: "Utvärdera", d: "Hitta orsakerna till friktionen innan ni agerar." },
              { t: "Minska beroendet", d: "Säkra dokumentation, adminåtkomst, kod och licenser." },
              { t: "Om ni väljer att byta", d: "Så fungerar uppsägning, överlämning och ny partner i praktiken." },
            ].map((x) => (
              <div key={x.t} className="rounded-md border border-border bg-secondary/40 p-4">
                <h3 className="font-semibold text-foreground mb-1">{x.t}</h3>
                <p className="text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
          <a href={`#${PARTNER_REVIEW_HASH}`} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Få hjälp att utvärdera partnersamarbetet <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <Link to="/guider/byta-dynamics-partner/" className="ml-0 sm:ml-3 mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-primary hover:bg-secondary">
            Läs guiden om partnersamarbete <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to="/second-opinion/" className="ml-0 sm:ml-3 mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-primary hover:bg-secondary">
            Osäkra? Be om en second opinion först <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

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
