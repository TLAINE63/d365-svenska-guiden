import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import EditorialSource from "@/components/EditorialSource";
import { Button } from "@/components/ui/button";
import PlanContactDialog, { type ContactTopic } from "@/components/plan/PlanContactDialog";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { getBuyerContext, shortProductName } from "@/lib/buyerContext";
import { secondOpinionContext } from "@/lib/existingDiagnosis";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

const PATH = "/second-opinion/";
const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Redan Dynamics 365-kund", url: "/befintlig-kund/" },
  { name: "Second opinion", url: PATH },
];
const track = (event_name: string, metadata: Record<string, unknown> = {}) =>
  trackFunnelEvent({ event_type: "engagement", event_name, page_path: PATH, metadata: { tool: "second-opinion", ...metadata } });

const situations = [
  "Vi är osäkra på om den föreslagna lösningen är rätt.",
  "Projektet har blivit dyrare eller mer komplext än väntat.",
  "Vi vill granska en offert eller en rekommenderad lösning.",
  "Vi vet inte om problemet ligger i systemet, processerna, förvaltningen eller partnerrelationen.",
  "Vi funderar på att byta partner men vill först få en extern bedömning.",
  "Vi står inför en större förändring, uppgradering eller vidareutveckling.",
];
const reviewable = [
  { t: "Offert och omfattning", d: "Är omfattning, antaganden och tidsplan rimliga för det ni faktiskt behöver?" },
  { t: "Lösning och arkitektur", d: "Passar valda applikationer, anpassningar, integrationer och tillägg er verksamhet?" },
  { t: "Licenser och kostnad", d: "Stämmer licensval och total kostnad över tid med hur lösningen används?" },
  { t: "Förvaltning och samarbete", d: "Är ansvar, supportnivå, dokumentation och avtal tydliga?" },
];
const bring = ["Offert, avtal eller projektplan (om det finns)", "Vilka Dynamics\u00A0365-applikationer ni har eller överväger", "Vad som inte fungerar, med konkreta exempel", "Integrationer och tillägg som berörs", "Kostnader och tidsplan hittills", "Vad ni vill kunna besluta efter bedömningen"];
const outcomes = ["Fortsätt med nuvarande partner, med tydligare underlag", "Förändra arbetssätt eller förvaltning", "Optimera den befintliga lösningen", "Ta in kompletterande specialistkompetens", "Utvärdera alternativa lösningar", "Utvärdera en annan partner"];
const faq = [
  { q: "Innebär en second opinion att vi bör byta partner?", a: "Nej. Ofta blir slutsatsen att fortsätta med nuvarande partner, med tydligare krav, förändrad förvaltning eller ett kompletterande specialistområde. Byte är ett av flera möjliga utfall." },
  { q: "Kontaktas någon partner när vi skickar förfrågan?", a: "Nej. Förfrågan går bara till d365.se. Ingen partner kontaktas utan ert uttryckliga godkännande." },
  { q: "Vad behöver vi ha förberett?", a: "Inget måste vara klart. Har ni offert, avtal eller en beskrivning av problemet går bedömningen snabbare, men en kort beskrivning räcker för att börja." },
];

const SecondOpinion = () => {
  const [params] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState<{ need: string | null; needLabel: string | null; product: string | null }>({ need: null, needLabel: null, product: null });

  useEffect(() => {
    const product = getBuyerContext().product ?? null;
    const c = secondOpinionContext(params.get("behov"));
    setCtx({ need: c?.need ?? null, needLabel: c?.label ?? null, product });
    const fromDx = params.get("kalla") === "diagnos";
    track("second_opinion_view", { from_diagnosis: fromDx, need: c?.need ?? null, known_product: Boolean(product) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const productName = ctx.product ? shortProductName(ctx.product) ?? ctx.product : null;
  const known = [productName && `Produkt: ${productName}`, ctx.needLabel && `Utgångsläge från diagnosen: ${ctx.needLabel}`].filter(Boolean) as string[];
  const meta = { need: ctx.need, known_product: Boolean(ctx.product), from_diagnosis: params.get("kalla") === "diagnos" };
  const topic: ContactTopic = {
    title: "Be om en second opinion",
    description: "d365.se går igenom ert läge och återkommer med hur en bedömning kan läggas upp. Ingen partner kontaktas.",
    helpWith: "Second opinion",
    startEvent: "second_opinion_start",
    submitEvent: "second_opinion_submit",
    extra: known.length ? { key: "second_opinion", label: "Second opinion", lines: known } : undefined,
    metadata: meta,
    advisory: { placement: "second_opinion", cta: "Be om en second opinion", pageType: "guide" },
  };
  const start = () => { setOpen(true); };
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <>
      <SEOHead
        title="Second opinion på Dynamics 365: lösning, offert eller partner"
        description="Osäkra på er Dynamics 365-lösning, offert, implementation eller partner? Se när en second opinion är relevant, vad som granskas och vilka beslut den kan leda till."
        canonicalPath={PATH}
        breadcrumbs={breadcrumbs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
          <header className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{nowrapBrand("När behöver ni en second opinion på Dynamics 365?")}</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">{nowrapBrand("En second opinion är en extra genomgång av er lösning, offert, implementation eller partnersamarbete innan ni beslutar. Målet är ett bättre beslut, inte automatiskt ett partnerbyte.")}</p>
            {known.length > 0 && (
              <div className="mb-6 rounded-md border border-border bg-secondary/40 p-4 text-sm">
                <p className="font-semibold text-foreground mb-1">Det här vet vi redan, ni behöver inte beskriva det igen</p>
                <ul className="text-muted-foreground">{known.map((k) => <li key={k}>{nowrapBrand(k)}</li>)}</ul>
              </div>
            )}
            <Button size="lg" onClick={start}>Be om en second opinion <ArrowRight className="h-4 w-4" /></Button>
            <p className="mt-2 text-xs text-muted-foreground">Förfrågan går bara till d365.se. Ingen partner kontaktas.</p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">När är en second opinion relevant?</h2>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm">
              {situations.map((s) => <li key={s} className="flex gap-2 rounded-md border border-border bg-card px-3 py-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{s}</li>)}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vad kan granskas?</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {reviewable.map((r) => <div key={r.t} className="rounded-lg border border-border bg-card p-5"><h3 className="font-semibold mb-1">{r.t}</h3><p className="text-sm text-muted-foreground">{nowrapBrand(r.d)}</p></div>)}
            </div>
          </section>

          <section className="mb-12 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Bra att ha med sig</h2>
              <ul className="space-y-2 text-sm">{bring.map((b) => <li key={b} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{b}</li>)}</ul>
              <p className="mt-3 text-xs text-muted-foreground">Inget måste vara klart innan ni hör av er.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Vad bedömningen kan leda till</h2>
              <ul className="space-y-2 text-sm">{outcomes.map((o) => <li key={o} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{o}</li>)}</ul>
              <p className="mt-3 text-xs text-muted-foreground">Byte av partner är ett av flera möjliga utfall, aldrig utgångspunkten.</p>
            </div>
          </section>

          <section className="mb-12 rounded-lg border border-border bg-secondary/40 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Redo att få en bedömning?</h2>
            <p className="text-muted-foreground mb-5 max-w-3xl">Beskriv kort ert läge. Det ni redan valt på sajten följer med och ni ser exakt vad som delas innan ni skickar.</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={start}>Be om en second opinion <ArrowRight className="h-4 w-4" /></Button>
              <Button asChild variant="outline"><Link to="/guider/byta-dynamics-partner/" onClick={() => track("second_opinion_to_partner_switch")}>Läs partnerbytesguiden</Link></Button>
              <Button asChild variant="ghost"><Link to="/befintlig-kund/" onClick={() => track("second_opinion_to_existing")}>Tillbaka till diagnosen</Link></Button>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vanliga frågor</h2>
            <div className="space-y-4">{faq.map((f) => <div key={f.q}><h3 className="font-semibold">{f.q}</h3><p className="text-sm text-muted-foreground">{f.a}</p></div>)}</div>
          </section>

          <EditorialSource sourceType="Köpguide" />
        </div>
      </main>
      <Footer />
      {open && <PlanContactDialog mode="advisory" topic={topic} onClose={() => setOpen(false)} />}
    </>
  );
};
export default SecondOpinion;
