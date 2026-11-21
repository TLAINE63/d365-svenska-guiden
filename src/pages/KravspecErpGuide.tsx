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

const PATH = "/guider/kravspecifikation-affarssystem/";
const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Kravspecifikation för affärssystem", url: PATH },
];
const track = (event_name: string) => trackFunnelEvent({ event_type: "engagement", event_name, page_path: PATH, step: "cta_click" });

const costParts = [
  { t: "Licenser", d: "Kostnad per användare och månad. Business Central passar oftast små och medelstora företag, Finance & Supply Chain Management större och mer komplexa verksamheter. Aktuella listpriser finns på prissidan.", link: { l: "Se licenspriser", to: "/priser/" } },
  { t: "Implementation", d: "För Business Central går en snabbstart från cirka 50 000 kr och ett litet till stort projekt landar ofta mellan 175 000 kr och 2,9 MSEK. För Finance & Supply Chain Management är spannet ofta 2–15 MSEK eller mer. Integrationer, datamigrering och anpassningar avgör var ni hamnar.", link: { l: "Räkna på ert projekt", to: "/kostnad/" } },
  { t: "Förvaltning", d: "Löpande support, uppdateringar, vidareutveckling och utbildning. Budgetera för det från start, så att systemet följer med när verksamheten förändras." },
];

const areas = [
  { t: "Ekonomi och redovisning", d: "Huvudbok, kund- och leverantörsreskontra, koncern, valuta och bokslut." },
  { t: "Order och försäljning", d: "Offert, order, prissättning, rabatter och fakturering." },
  { t: "Inköp och leverantörer", d: "Inköpsflöde, attest, avtal och leverantörsuppföljning." },
  { t: "Lager och logistik", d: "Artiklar, lagerställen, plock, leveranser och spårbarhet." },
  { t: "Produktion eller projekt", d: "Tillverkning, planering eller projektredovisning, beroende på hur ni tjänar pengar." },
  { t: "Integrationer", d: "Kopplingar till CRM, e-handel, bank, lön, EDI och andra system som ska leva kvar." },
  { t: "Rapporter och nyckeltal", d: "Vilka siffror ledningen behöver, hur ofta och från vilka källor." },
  { t: "Roller, behörigheter och AI-stöd", d: "Vem som får göra vad, attestregler och var Copilot och automation ska hjälpa till." },
];

const pitfalls = [
  { t: "Gamla rutiner byggs om i det nya systemet", d: "Anpassningar gör projektet dyrare och uppgraderingar svårare. Utgå från standard och anpassa bara det som skiljer er från konkurrenterna." },
  { t: "Datamigreringen planeras för sent", d: "Rensning och flytt av kunder, artiklar och saldon tar ofta längre tid än väntat. Ta med det i kravspecifikationen från början." },
  { t: "Partnern väljs efter storlek", d: "Erfarenhet av er bransch och av liknande projekt väger tyngre än antalet konsulter." },
];

const faq = [
  { q: "Vad kostar ett affärssystem med Dynamics 365?", a: "Utöver licenser per användare kostar ett Business Central-projekt ofta mellan 175 000 kr och 2,9 MSEK, med snabbstart från cirka 50 000 kr. Finance & Supply Chain Management kostar oftast från 2 MSEK och uppåt." },
  { q: "Vad ska en kravspecifikation för affärssystem innehålla?", a: "Minst åtta områden: ekonomi, order, inköp, lager, produktion eller projekt, integrationer, rapporter samt roller och behörigheter. Rangordna kraven som måste, bör och trevligt att ha." },
];

const KravspecErpGuide = () => {
  useEffect(() => { trackFunnelEvent({ event_type: "engagement", event_name: "kravspec_erp_guide_view", page_path: PATH, step: "landing" }); }, []);
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <SEOHead
        title="Kravspecifikation för affärssystem: kostnad och checklista"
        description="Vad kostar ett affärssystem och vad ska kravspecifikationen innehålla? Kostnadsramar, åtta områden att täcka och tre vanliga fallgropar vid val av ERP."
        canonicalPath={PATH}
        breadcrumbs={breadcrumbs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
          <header className="max-w-4xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">Vad ska en kravspecifikation för affärssystem innehålla?</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{nowrapBrand("Ett underlag för er som ska välja eller byta affärssystem (ERP), till exempel Business Central eller Finance & Supply Chain Management (F&SCM). Här finns ungefärliga kostnadsramar, de åtta områden som behöver finnas med och de vanligaste misstagen.")}</p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vad kostar ett affärssystemsprojekt?</h2>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Åtta områden som ska finnas med</h2>
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
              {["Utgår från områdena ovan", "Kan delas med ledningsgrupp och partners"].map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-accent mt-0.5" aria-hidden />{x}</li>)}
            </ul>
            <Button asChild><Link to="/kravspecifikation/" onClick={() => track("kravspec_erp_guide_to_tool")}>Skapa kravspecifikation <ArrowRight className="h-4 w-4" /></Link></Button>
          </section>

          <AdvisoryOffer
            variant="inline"
            placement="next_step_help"
            pageType="erp"
            cta="Boka 20 min rådgivning"
            heading="Vill ni bolla kravbilden eller en offert?"
            text="Boka 20 minuter med Thomas Laine. Ni får en genomgång av kravbild, ungefärlig budget och vilka partners som brukar passa, innan ni pratar med någon leverantör."
            className="mb-12"
          />

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vanliga frågor</h2>
            <div className="space-y-4">
              {faq.map((f) => <div key={f.q}><h3 className="font-semibold">{nowrapBrand(f.q)}</h3><p className="text-sm text-muted-foreground">{nowrapBrand(f.a)}</p></div>)}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Vidare läsning</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-primary hover:underline" to="/affarssystem/">Välja eller byta affärssystem</Link></li>
              <li><Link className="text-primary hover:underline" to="/businesscentral/">{nowrapBrand("Business Central")}</Link></li>
              <li><Link className="text-primary hover:underline" to="/upphandlingsguiden/">Upphandlingsguiden</Link></li>
              <li><Link className="text-primary hover:underline" to="/second-opinion/">Second opinion på en offert</Link></li>
            </ul>
          </section>

          <ContinueEvaluation template="guide" className="-mx-4 sm:-mx-6" />
          <EditorialSource sourceType="Köpguide" />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default KravspecErpGuide;
