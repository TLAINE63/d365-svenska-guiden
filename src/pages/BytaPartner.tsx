import { useEffect, useState } from "react";
import ContinueEvaluation from "@/components/ContinueEvaluation";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ClipboardCheck, Scale, ShieldCheck, Repeat } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import EditorialSource from "@/components/EditorialSource";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { analyse, asksPartnerApps, partnerSearch, PRODUCT_LABEL, type PsAnswers } from "@/lib/partnerSwitch";
import { addScopeApps, setAnswer } from "@/lib/buyerProfile";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import { ADVISORY_CTA } from "@/lib/advisory";

const PATH = "/guider/byta-dynamics-partner/";
const breadcrumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Byta Dynamics 365-partner", url: PATH },
];
const track = (event_name: string, step?: "landing" | "tool_start" | "tool_result" | "cta_click", metadata?: Record<string, unknown>) =>
  trackFunnelEvent({ event_type: "engagement", event_name, page_path: PATH, step, metadata });

const paths = [
  { icon: Scale, title: "Utvärdera nuvarande samarbete", q: "Är ett partnerbyte verkligen nödvändigt?", text: "För er som är osäkra. Ibland löses problemet med tydligare avtal eller en kompletterande specialist." },
  { icon: ShieldCheck, title: "Minska partnerberoendet", q: "Få bättre kontroll över lösningen", text: "Säkra kod, appar, integrationer, avtal, licenser, dokumentation och behörigheter." },
  { icon: Repeat, title: "Byta partner", q: "Förbered och genomför ett partnerbyte", text: "För er som vill gå vidare och jämföra andra Dynamics\u00A0365-partners." },
];

const productFocus = [
  { p: "Business Central", items: ["Extensions och kundunika anpassningar", "Branschappar och ISV-appar från AppSource", "Integrationer", "Förvaltning av uppdateringar"] },
  { p: "Finance & Supply Chain Management", items: ["Anpassningar och utvecklingsgrenar", "Integrationer och kringliggande lösningar", "Teknisk dokumentation", "Förvaltning och releaseplanering"] },
  { p: "Sales och Customer Service", items: ["Lösningar i Dataverse", "Power Platform: appar och automationer", "Kundunika lösningar", "Integrationer"] },
];

const dependency = ["Microsoft-tenant och miljöer", "Dynamics\u00A0365-applikationer", "Microsoft-licenser och CSP", "Power Platform", "Azure-resurser, om sådana finns", "Integrationer", "ISV-appar", "Partnerns egna appar och lösningar", "Kundspecifik utveckling", "Källkod och repositories", "Teknisk dokumentation", "Administrativa behörigheter", "Support- och förvaltningsavtal", "Pågående utveckling", "Öppna supportärenden"];

const checklist = ["Kontrollera befintligt avtal och uppsägningstid", "Kartlägg Microsoft-licenser och CSP", "Dokumentera Dynamics\u00A0365-miljöer", "Inventera integrationer", "Inventera tredjepartsappar", "Identifiera partnerägda lösningar och appar", "Inventera kundunika anpassningar", "Kontrollera kod och repositories", "Kontrollera äganderätt och nyttjanderätt i avtal", "Säkerställ egna administrativa behörigheter", "Samla teknisk dokumentation", "Dokumentera öppna ärenden", "Dokumentera pågående utveckling", "Bestäm ansvar under övergången", "Planera överlämningen"];

const faq = [
  { q: "Måste vi byta system om vi byter partner?", a: "Nej. Lösningen ligger i er Microsoft-tenant och kan i regel förvaltas av en annan partner. Det som behöver säkras är tillgång till kod, dokumentation, licenser och behörigheter." },
  { q: "Vem äger anpassningarna och koden?", a: "Det avgörs av ert avtal. Kontrollera vad det säger om äganderätt, nyttjanderätt, källkod och fortsatt användning efter avslutat samarbete." },
  { q: "Måste licenserna flyttas samtidigt?", a: "Inte nödvändigtvis. Licens- och CSP-partner kan vara en annan än den som förvaltar lösningen. Följ Microsofts aktuella regler om ni vill flytta abonnemangen." },
];

const SCOPE_LABEL: Record<string, string> = { all: "Hela partnerrelationen", support: "Support och förvaltning", development: "Vidareutveckling", specialist: "Komplettera med specialist" };
const REASON_LABEL: Record<string, string> = { support: "Support och respons", competence: "Saknad kompetens", cost: "Kostnader", unclear: "Otydligt samarbete", strategy: "Ny riktning" };

type Opt = { v: string; l: string };
const Q = ({ label, opts, value, onChange }: { label: string; opts: Opt[]; value?: string; onChange: (v: string) => void }) => (
  <fieldset className="mb-5">
    <legend className="font-semibold text-foreground mb-2">{nowrapBrand(label)}</legend>
    <div className="flex flex-wrap gap-2">
      {opts.map((o) => (
        <button key={o.v} type="button" aria-pressed={value === o.v} onClick={() => onChange(o.v)}
          className={`rounded-md border px-3 py-2 text-sm ${value === o.v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>{nowrapBrand(o.l)}</button>
      ))}
    </div>
  </fieldset>
);
const control: Opt[] = [{ v: "yes", l: "Ja" }, { v: "partly", l: "Delvis" }, { v: "no", l: "Nej" }, { v: "unknown", l: "Vet inte" }];

const Analysis = () => {
  const [a, setA] = useState<PsAnswers>({ reasons: [] });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const set = (k: keyof PsAnswers) => (v: string) => setA((s) => ({ ...s, [k]: v }));
  const toggleReason = (v: string) => setA((s) => ({ ...s, reasons: s.reasons.includes(v) ? s.reasons.filter((r) => r !== v) : [...s.reasons, v] }));
  const steps = 3;
  const canNext = step === 0 ? !!a.product && !!a.scope : step === 1 ? !!a.licenses && (!asksPartnerApps(a) || !!a.partnerApps) : !!a.code && !!a.docs && !!a.admin && !!a.timing;
  const next = () => {
    if (step === 0) track("partner_switch_analysis_start", "tool_start", { product: a.product });
    if (step < steps - 1) { setStep(step + 1); return; }
    const areas = analyse(a);
    if (a.product && a.product !== "other") addScopeApps([PRODUCT_LABEL[a.product]]);
    setAnswer("project", "partner_switch", a.scope ?? "all");
    track("partner_switch_analysis_complete", "tool_result", { product: a.product, scope: a.scope, areas: areas.map((x) => x.id) });
    setDone(true);
  };
  if (done) {
    const areas = analyse(a);
    return (
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {areas.length === 0 ? "Ni har god kontroll över lösningen." : `${areas.length === 1 ? "Ett område" : `${areas.length} områden`} bör utredas innan ni går vidare.`}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">Baserat på era svar. Det är ingen bedömning av er nuvarande partner, bara vad som är klokt att kontrollera.</p>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {areas.map((x) => (
            <div key={x.id} className="rounded-lg border border-border bg-background p-4">
              <p className="font-semibold text-foreground">{x.title}</p>
              <p className="text-sm text-muted-foreground mb-2">{nowrapBrand(x.why)}</p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">{x.check.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild><Link to={partnerSearch(a)} onClick={() => track("partner_switch_to_partners", "cta_click")}>Se partners som matchar era behov <ArrowRight className="h-4 w-4" /></Link></Button>
          <Button asChild variant="outline"><Link to="/jamfor-partners/" onClick={() => track("partner_switch_to_compare", "cta_click")}>Jämför partners</Link></Button>
          <Button variant="ghost" onClick={() => { setDone(false); setStep(0); }}>Ändra svar</Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Produkt och omfattning sparas bara i er webbläsare och följer med till partnerurval och Min D365-plan.</p>
        <AdvisoryOffer
          className="mt-6"
          variant="inline"
          placement="partner_switch"
          pageType="guide"
          cta={ADVISORY_CTA.partner_switch}
          heading={areas.length ? "Osäkra på hur ni ska tolka resultatet?" : "Vill ni få resultatet bekräftat?"}
          text="Gå igenom analysen med en rådgivare innan ni bestämmer er. Ofta blir slutsatsen att fortsätta med nuvarande partner, med tydligare krav eller förvaltning."
          sections={[
            { key: "partnerbyte_lage", label: "Ert läge", lines: [
              a.product && a.product !== "other" ? `Produkt: ${PRODUCT_LABEL[a.product]}` : null,
              a.scope ? `Vill förändra: ${SCOPE_LABEL[a.scope] ?? a.scope}` : null,
              a.reasons.length ? `Skäl: ${a.reasons.map((r) => REASON_LABEL[r] ?? r).join(", ")}` : null,
            ].filter(Boolean) as string[] },
            ...(areas.length ? [{ key: "partnerbyte_resultat", label: "Resultat från partnerbytesanalysen", lines: areas.map((x) => x.title) }] : []),
          ].filter((s) => s.lines.length > 0)}
          metadata={{ areas: areas.length }}
        />
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Steg {step + 1} av {steps}</p>
      {step === 0 && (<>
        <Q label="Vilken Dynamics 365-produkt har ni?" value={a.product} onChange={set("product")} opts={[{ v: "bc", l: "Business Central" }, { v: "fscm", l: "Finance & Supply Chain" }, { v: "crm", l: "Sales / Customer Service" }, { v: "other", l: "Annan" }]} />
        <fieldset className="mb-5">
          <legend className="font-semibold text-foreground mb-2">Varför överväger ni en förändring? <span className="font-normal text-muted-foreground">(valfritt, flera val)</span></legend>
          <div className="flex flex-wrap gap-2">
            {[{ v: "support", l: "Support och respons" }, { v: "competence", l: "Saknad kompetens" }, { v: "cost", l: "Kostnader" }, { v: "unclear", l: "Otydligt samarbete" }, { v: "strategy", l: "Ny riktning" }].map((o) => (
              <button key={o.v} type="button" aria-pressed={a.reasons.includes(o.v)} onClick={() => toggleReason(o.v)}
                className={`rounded-md border px-3 py-2 text-sm ${a.reasons.includes(o.v) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>{o.l}</button>
            ))}
          </div>
        </fieldset>
        <Q label="Vad vill ni förändra?" value={a.scope} onChange={set("scope")} opts={[{ v: "all", l: "Hela partnerrelationen" }, { v: "support", l: "Support och förvaltning" }, { v: "development", l: "Vidareutveckling" }, { v: "specialist", l: "Komplettera med specialist" }]} />
      </>)}
      {step === 1 && (<>
        <Q label="Vem hanterar era Microsoft-licenser (CSP) i dag?" value={a.licenses} onChange={set("licenses")} opts={[{ v: "partner", l: "Nuvarande partner" }, { v: "other", l: "Annan leverantör eller vi själva" }, { v: "unknown", l: "Vet inte" }]} />
        {asksPartnerApps(a) && <Q label="Använder ni appar som nuvarande partner själv har utvecklat och äger?" value={a.partnerApps} onChange={set("partnerApps")} opts={[{ v: "yes", l: "Ja" }, { v: "no", l: "Nej" }, { v: "unknown", l: "Vet inte" }]} />}
      </>)}
      {step === 2 && (<>
        <Q label="Har ni tillgång till källkod och repositories för era anpassningar?" value={a.code} onChange={set("code")} opts={control} />
        <Q label="Finns aktuell teknisk dokumentation?" value={a.docs} onChange={set("docs")} opts={control} />
        <Q label="Har ni egna administratörskonton för tenant och miljöer?" value={a.admin} onChange={set("admin")} opts={control} />
        <Q label="När vill ni ha en förändring på plats?" value={a.timing} onChange={set("timing")} opts={[{ v: "now", l: "Inom 3 månader" }, { v: "6m", l: "Inom 6 månader" }, { v: "later", l: "Senare eller osäkert" }]} />
      </>)}
      <div className="flex gap-3">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Tillbaka</Button>}
        <Button disabled={!canNext} onClick={next}>{step < steps - 1 ? "Nästa" : "Visa resultat"}</Button>
      </div>
    </div>
  );
};

const BytaPartner = () => {
  useEffect(() => { track("partner_switch_guide_view", "landing"); }, []);
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <SEOHead
        title="Byta Dynamics 365-partner: så fungerar det i praktiken"
        description="Funderar ni på att byta Dynamics 365-partner? Se vad som berörs: licenser och CSP, kod, appar, dokumentation och behörigheter. Gör en kort partnerbytesanalys."
        canonicalPath={PATH}
        breadcrumbs={breadcrumbs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />
          <header className="max-w-3xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{nowrapBrand("Byta Dynamics 365-partner: så fungerar det i praktiken")}</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{nowrapBrand("Ett partnerbyte betyder inte att ni byter Dynamics 365 eller börjar om. Den viktiga frågan är hur ni behåller kontrollen över er lösning: licenser, kod, appar, integrationer, dokumentation, behörigheter och förvaltning.")}</p>
          </header>

          <section aria-labelledby="vagar" className="mb-12">
            <h2 id="vagar" className="sr-only">Tre möjliga vägar</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {paths.map(({ icon: Icon, title, q, text }) => (
                <a key={title} href="#analys" className="rounded-lg border border-border bg-card p-5 hover:border-primary transition-colors flex flex-col">
                  <Icon className="h-6 w-6 text-accent mb-3" aria-hidden />
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm font-medium text-foreground/80 mb-2">{q}</p>
                  <p className="text-sm text-muted-foreground mb-3">{text}</p>
                  <span className="mt-auto text-sm font-semibold text-primary inline-flex items-center gap-1">Till analysen <ArrowRight className="h-3.5 w-3.5" /></span>
                </a>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Tre saker som ofta blandas ihop</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-5"><h3 className="font-semibold mb-1">Byta Dynamics-partner</h3><p className="text-sm text-muted-foreground">Vem som implementerar, supporterar, förvaltar och vidareutvecklar lösningen.</p></div>
              <div className="rounded-lg border border-border bg-card p-5"><h3 className="font-semibold mb-1">Byta CSP- eller licenspartner</h3><p className="text-sm text-muted-foreground">Vem som ansvarar för och fakturerar era Microsoft-abonnemang. Kan vara en annan än förvaltningspartnern. Följ Microsofts aktuella regler vid överföring.</p></div>
              <div className="rounded-lg border border-border bg-card p-5"><h3 className="font-semibold mb-1">Byta Microsoft-tenant</h3><p className="text-sm text-muted-foreground">En separat och större fråga. Ingår normalt inte i ett vanligt partnerbyte.</p></div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Kartlägg ert partnerberoende</h2>
            <p className="text-muted-foreground mb-4 max-w-3xl">Gå igenom vad som finns och vem som har tillgång. Vad ni äger eller får använda avgörs av era avtal: kontrollera vad de säger om äganderätt, nyttjanderätt, källkod, dokumentation, överlämning och fortsatt användning efter avslutat samarbete.</p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              {dependency.map((d) => <li key={d} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{d}</li>)}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vad som är extra viktigt per produkt</h2>
            <div className="space-y-2">
              {productFocus.map((f) => (
                <details key={f.p} className="rounded-lg border border-border bg-card p-4">
                  <summary className="font-semibold cursor-pointer">{f.p}</summary>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">{f.items.map((i) => <li key={i}>{i}</li>)}</ul>
                </details>
              ))}
            </div>
          </section>

          <section id="analys" className="mb-12 scroll-mt-28 rounded-lg border border-border bg-secondary/40 p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">{nowrapBrand("Partnerbytesanalys för Dynamics 365")}</h2>
            <p className="text-muted-foreground mb-6">Få en första bild av vad ni bör kontrollera innan ni förändrar eller byter partner. Tar cirka två minuter.</p>
            <Analysis />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-accent" aria-hidden />{nowrapBrand("Checklista innan ni byter Dynamics 365-partner")}</h2>
            <ol className="grid gap-2 sm:grid-cols-2 text-sm">
              {checklist.map((c, i) => <li key={c} className="flex gap-3 rounded-md border border-border bg-card px-3 py-2"><span className="font-semibold text-accent">{i + 1}</span>{c}</li>)}
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vanliga frågor</h2>
            <div className="space-y-4">
              {faq.map((f) => <div key={f.q}><h3 className="font-semibold">{f.q}</h3><p className="text-sm text-muted-foreground">{nowrapBrand(f.a)}</p></div>)}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-3">Vidare läsning</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-primary hover:underline" to="/second-opinion/">{nowrapBrand("Second opinion: få en extern bedömning innan ni byter")}</Link></li>
              <li><Link className="text-primary hover:underline" to="/befintlig-kund/">{nowrapBrand("Redan Dynamics 365-kund: utöka, AI och förvaltning")}</Link></li>
              <li><Link className="text-primary hover:underline" to="/guider/valja-business-central-partner/">Välja Business Central-partner</Link></li>
              <li><Link className="text-primary hover:underline" to="/kompetens/">Kompetensområden hos partners</Link></li>
              <li><Link className="text-primary hover:underline" to="/priser/">Licenspriser</Link></li>
            </ul>
          </section>

          <ContinueEvaluation path="/guider/byta-dynamics-partner/" className="-mx-4 sm:-mx-6" />
          <EditorialSource sourceType="Köpguide" />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default BytaPartner;
