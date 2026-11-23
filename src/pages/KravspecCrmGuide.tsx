import NewsletterSignup from "@/components/NewsletterSignup";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import EditorialSource from "@/components/EditorialSource";
import ContinueEvaluation from "@/components/ContinueEvaluation";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

const PATH = "/guider/kravspecifikation-crm/";
const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Kravspecifikation för CRM", url: PATH },
];
const track = (event_name: string) => trackFunnelEvent({ event_type: "engagement", event_name, page_path: PATH, step: "cta_click" });

const costParts = [
  { t: "Licenser", d: "Kostnad per användare och månad. Nivån (t.ex. Sales Professional eller Enterprise) styrs av hur avancerade säljprocesser, prognoser och AI-stöd ni behöver. Aktuella listpriser finns på prissidan." , link: { l: "Se licenspriser", to: "/priser/" } },
  { t: "Implementation", d: "För ett typiskt CRM-projekt i medelstora företag landar implementationen ofta i spannet 150 000–600 000 kr. Integrationer mot affärssystemet, datamigrering och antal säljprocesser avgör var i spannet ni hamnar.", link: { l: "Räkna på ert projekt", to: "/kostnad/" } },
  { t: "Förvaltning", d: "Löpande support, vidareutveckling och utbildning av nya användare. Budgetera för det redan från start, så att systemet inte stannar i utvecklingen efter driftstart." },
];

const areas = [
  { t: "Leads och kvalificering", d: "Hur leads kommer in, vem som äger dem och när de räknas som kvalificerade." },
  { t: "Affärsmöjligheter och pipeline", d: "Säljsteg, sannolikheter och vad som krävs för att flytta en affär framåt." },
  { t: "Kund- och kontaktregister", d: "En samlad bild av kunden: historik, kontakter, avtal och pågående ärenden." },
  { t: "Vardagsverktyg", d: "Koppling till Outlook, kalender och Teams, så att säljarna slipper dubbelregistrera." },
  { t: "Offert och pris", d: "Enkla offerter i CRM eller koppling till prislistor och order i affärssystemet." },
  { t: "Rapporter och prognoser", d: "Vilka nyckeltal ledningen behöver se och hur ofta prognosen ska uppdateras." },
  { t: "Copilot och AI-stöd", d: "Mötessammanfattningar, e-postutkast och förslag på nästa steg. Ange vad ni vill uppnå, inte vilka funktioner ni vill ha." },
];

const pitfalls = [
  { t: "För många obligatoriska fält", d: "Ett CRM som kräver mycket inmatning används inte. Kräv bara det ni faktiskt följer upp." },
  { t: "Integrationen mot affärssystemet kommer för sent", d: "Kunder, artiklar, priser och order behöver hänga ihop. Ta med integrationen i kravspecifikationen från början." },
  { t: "Partnern väljs efter storlek", d: "Erfarenhet av er bransch och av CRM-projekt väger tyngre än antalet konsulter." },
];

const faq = [
  { q: "Vad kostar ett CRM-projekt med Dynamics 365?", a: "Utöver licenser per användare landar implementationen för medelstora företag ofta mellan 150 000 och 600 000 kr. Integrationer, datamigrering och antal processer avgör var i spannet ni hamnar." },
  { q: "Vad ska en kravspecifikation för CRM innehålla?", a: "Minst sju områden: leads, pipeline, kundregister, vardagsverktyg, offert och pris, rapporter samt AI-stöd. Beskriv behoven utifrån era säljprocesser, inte utifrån funktionslistor." },
];

const KravspecCrmGuide = () => {
  useEffect(() => { trackFunnelEvent({ event_type: "engagement", event_name: "kravspec_crm_guide_view", page_path: PATH, step: "landing" }); }, []);
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <SEOHead
        title="Kravspecifikation för CRM: kostnad, checklista och fallgropar"
        description="Vad kostar ett CRM-projekt och vad ska kravspecifikationen innehålla? Kostnadsramar, sju områden att täcka och tre vanliga fallgropar vid val av CRM."
        canonicalPath={PATH}
        breadcrumbs={breadcrumbs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
          <header className="max-w-4xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">Vad ska en kravspecifikation för CRM innehålla?</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{nowrapBrand("Ett underlag för er som planerar eller utvärderar CRM och säljstöd, till exempel Dynamics 365 Sales. Här finns ungefärliga kostnadsramar, de sju områden som behöver finnas med och de vanligaste misstagen.")}</p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vad kostar ett CRM-projekt?</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {costParts.map((c) => (
                <div key={c.t} className="rounded-lg border border-border bg-card p-5 flex flex-col">
                  <h3 className="font-semibold mb-2">{c.t}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{nowrapBrand(c.d)}</p>
                  {c.link && <Link to={c.link.to} className="mt-auto text-sm font-semibold text-primary inline-flex items-center gap-1">{c.link.l} <ArrowRight className="h-3.5 w-3.5" /></Link>}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Sju områden som ska finnas med</h2>
            <ol className="grid gap-3 sm:grid-cols-2">
              {areas.map((a, i) => (
                <li key={a.t} className="flex gap-3 rounded-md border border-border bg-card p-4">
                  <span className="font-semibold text-accent">{i + 1}</span>
                  <div><p className="font-semibold text-foreground">{a.t}</p><p className="text-sm text-muted-foreground">{a.d}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Tre vanliga fallgropar</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {pitfalls.map((p) => (
                <div key={p.t} className="rounded-lg border border-border bg-card p-5">
                  <AlertTriangle className="h-5 w-5 text-accent mb-2" aria-hidden />
                  <h3 className="font-semibold mb-1">{p.t}</h3>
                  <p className="text-sm text-muted-foreground">{p.d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 rounded-lg border border-border bg-secondary/40 p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2"><FileText className="h-6 w-6 text-accent" aria-hidden />Gör er egen kravspecifikation</h2>
            <p className="text-muted-foreground mb-4">Välj bransch, storlek och områden och ladda ner en färdig kravspecifikation som PDF. Tar några minuter.</p>
            <ul className="mb-5 space-y-1 text-sm">
              {["Utgår från de sju områdena ovan", "Kan delas med ledningsgrupp och partners"].map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-accent mt-0.5" aria-hidden />{x}</li>)}
            </ul>
            <Button asChild><Link to="/kravspecifikation-sales/" onClick={() => track("kravspec_crm_guide_to_tool")}>Skapa kravspecifikation <ArrowRight className="h-4 w-4" /></Link></Button>
          </section>

          <AdvisoryOffer
            variant="inline"
            placement="next_step_help"
            pageType="crm"
            cta="Boka 20 min rådgivning"
            heading="Vill ni bolla kravbilden eller en offert?"
            text="Boka 20 minuter med Thomas Laine. Ni får en genomgång av kravbild, ungefärlig budget och vilka partners som brukar passa, innan ni pratar med någon leverantör."
            className="mb-12"
          />

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vanliga frågor</h2>
            <div className="space-y-4">
              {faq.map((f) => <div key={f.q}><h3 className="font-semibold">{nowrapBrand(f.q)}</h3><p className="text-sm text-muted-foreground">{f.a}</p></div>)}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Vidare läsning</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-primary hover:underline" to="/crm/">Välja CRM-system</Link></li>
              <li><Link className="text-primary hover:underline" to="/d365sales/">{nowrapBrand("Dynamics 365 Sales")}</Link></li>
              <li><Link className="text-primary hover:underline" to="/second-opinion/">Second opinion på en offert</Link></li>
              <li><Link className="text-primary hover:underline" to="/dynamics-365-crm-partners-sverige/">Jämför CRM-partners</Link></li>
            </ul>
          </section>

          <ContinueEvaluation template="guide" className="-mx-4 sm:-mx-6" />
          <EditorialSource sourceType="Köpguide" />
        </div>
      </main>
      <NewsletterSignup />
      <Footer />
    </>
  );
};
export default KravspecCrmGuide;
