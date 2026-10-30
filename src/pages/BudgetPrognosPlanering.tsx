import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import EditorialSource from "@/components/EditorialSource";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import {
  AIMPLAN_TEXT,
  BUDGET_ARCHITECTURE_STEPS,
  BUDGET_ARCHITECTURE_TEXT,
  BUDGET_CTA_BUYERS,
  BUDGET_CTA_PARTNERS,
  BUDGET_FAQ,
  BUDGET_FUTURE_PROOF,
  BUDGET_GUIDE_H1,
  BUDGET_GUIDE_INTRO,
  BUDGET_GUIDE_PATH,
  BUDGET_GUIDE_SEO,
  BUDGET_GUIDE_SHORT_ANSWER,
  BUDGET_RELATED,
  BUDGET_REQUIREMENTS,
  BUDGET_SOURCES,
  BUDGET_SYSTEMS,
} from "@/data/budgetPlanningGuide";

const BASE = "https://d365.se";
const crumbs = [
  { name: "Start", url: "/" },
  { name: "Guider", url: "/guider/" },
  { name: "Budget, prognos och planering", url: BUDGET_GUIDE_PATH },
];

const track = (target: string) =>
  trackFunnelEvent({
    event_type: "cta_click",
    event_name: "guide_cta_click",
    page_path: BUDGET_GUIDE_PATH,
    metadata: { source: "budget_guide", target },
  });

const BudgetPrognosPlanering = () => {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: BUDGET_GUIDE_H1,
    description: BUDGET_GUIDE_SEO.description,
    inLanguage: "sv-SE",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}${BUDGET_GUIDE_PATH}` },
    author: { "@type": "Organization", name: "d365.se", url: BASE },
    publisher: { "@type": "Organization", name: "d365.se", url: BASE },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BUDGET_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };


  return (
    <>
      <SEOHead
        title={BUDGET_GUIDE_SEO.title}
        description={BUDGET_GUIDE_SEO.description}
        canonicalPath={BUDGET_GUIDE_PATH}
        ogType="article"
        articleSection="Planering och uppföljning"
        breadcrumbs={crumbs}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <article className="container mx-auto max-w-6xl px-4 sm:px-6">
          <GuideBreadcrumb items={crumbs} className="mb-5" />

          <header className="max-w-3xl mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">{nowrapBrand(BUDGET_GUIDE_H1)}</h1>
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-6">{nowrapBrand(BUDGET_GUIDE_INTRO)}</p>
            <div className="rounded-lg border border-border border-l-4 border-l-accent bg-muted/40 p-5">
              <h2 className="text-lg font-bold mb-2">Kort svar</h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{nowrapBrand(BUDGET_GUIDE_SHORT_ANSWER)}</p>
            </div>
          </header>

          {/* Tre verkligheter, tre system */}
          <section className="mb-14" aria-labelledby="tre-system">
            <h2 id="tre-system" className="text-2xl font-bold tracking-tight mb-2">Tre verkligheter, tre system</h2>
            <p className="text-muted-foreground mb-6 max-w-3xl">
              {nowrapBrand("Utmaningen ser olika ut beroende på om ni kör Business Central, Finance & Supply Chain Management eller Dynamics 365 Sales. Lösningen bygger ändå på samma idé: planera där uppföljningen redan finns.")}
            </p>
            <div className="grid gap-5 lg:grid-cols-3">
              {BUDGET_SYSTEMS.map((s) => (
                <div key={s.key} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="mb-3 inline-flex w-fit rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                  <h3 className="text-lg font-bold leading-snug mb-4">{nowrapBrand(s.title)}</h3>
                  <p className="text-sm font-semibold text-foreground mb-2">{s.challengeTitle}</p>
                  <ul className="mb-5 space-y-2">
                    {s.challenges.map((c) => (
                      <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                        <span>{nowrapBrand(c)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-semibold text-foreground mb-2">{s.approachTitle}</p>
                  <ul className="mb-5 space-y-2 flex-1">
                    {s.approach.map((a) => (
                      <li key={a} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        <span>{nowrapBrand(a)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={s.link.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    <span>{nowrapBrand(s.link.label)}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Arkitekturen */}
          <section className="mb-14" aria-labelledby="arkitektur">
            <h2 id="arkitektur" className="text-2xl font-bold tracking-tight mb-6">Arkitekturen: Power BI, Microsoft Fabric och write-back</h2>
            <ol className="mb-8 grid gap-3 md:grid-cols-3">
              {BUDGET_ARCHITECTURE_STEPS.map((step, i) => (
                <li key={step.title} className="relative rounded-xl border border-border bg-secondary/40 p-5">
                  <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <p className="font-semibold mb-1">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{nowrapBrand(step.text)}</p>
                  {i < BUDGET_ARCHITECTURE_STEPS.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-background text-muted-foreground md:block" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
            <div className="max-w-3xl space-y-4">
              {BUDGET_ARCHITECTURE_TEXT.map((t) => (
                <p key={t} className="text-[15px] leading-relaxed text-muted-foreground">{nowrapBrand(t)}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold mb-2">Aimplan: write-back i Power BI och Fabric</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground mb-4">{nowrapBrand(AIMPLAN_TEXT)}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Vill ni jämföra med andra verktyg finns{" "}
                  <Link to="/compare/jet-vs-solver-vs-aimplan/" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                    jämförelsen av Jet Reports, Solver och Aimplan
                  </Link>{" "}
                  och{" "}
                  <Link to="/business-central/tillagg/rapportering-fpa/" className="font-medium text-primary underline underline-offset-4 hover:no-underline">
                    fler lösningar för rapportering och FP&amp;A
                  </Link>
                  .
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold mb-3">Varför arkitekturen håller över tid</h3>
                <ul className="space-y-2">
                  {BUDGET_FUTURE_PROOF.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[15px] leading-relaxed">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      <span>{nowrapBrand(f)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Kravställning */}
          <section className="mb-14" aria-labelledby="krav">
            <h2 id="krav" className="text-2xl font-bold tracking-tight mb-2">Frågor att besvara innan ni väljer lösning</h2>
            <p className="text-muted-foreground mb-5 max-w-3xl">Svaren styr både vilket planeringsverktyg som passar och vilken kompetens partnern behöver ha.</p>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm">
              {BUDGET_REQUIREMENTS.map((r) => (
                <li key={r} className="flex gap-2 rounded-md border border-border bg-card px-3 py-2.5">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />
                  {nowrapBrand(r)}
                </li>
              ))}
            </ul>
          </section>

          {/* Två CTA-boxar */}
          <section className="mb-14 print:hidden" aria-label="Nästa steg">
            <div className="grid gap-5 lg:grid-cols-2">
              <aside className="flex flex-col rounded-xl border border-[hsl(var(--cta-orange))]/40 border-l-4 border-l-[hsl(var(--cta-orange))] bg-card p-6 sm:p-7 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{BUDGET_CTA_BUYERS.eyebrow}</p>
                <h2 className="text-xl font-bold tracking-tight mb-2">{nowrapBrand(BUDGET_CTA_BUYERS.heading)}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground mb-6 flex-1">{nowrapBrand(BUDGET_CTA_BUYERS.text)}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link
                    to={BUDGET_CTA_BUYERS.button.to}
                    onClick={() => track(BUDGET_CTA_BUYERS.button.to)}
                    className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--cta-orange))] px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-[hsl(var(--cta-orange-hover))] hover:-translate-y-0.5"
                  >
                    <span>{nowrapBrand(BUDGET_CTA_BUYERS.button.label)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={BUDGET_CTA_BUYERS.secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(BUDGET_CTA_BUYERS.secondary.href)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {BUDGET_CTA_BUYERS.secondary.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </aside>
              <aside className="flex flex-col rounded-xl border border-border bg-secondary/40 p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{BUDGET_CTA_PARTNERS.eyebrow}</p>
                <h2 className="text-xl font-bold tracking-tight mb-2">{nowrapBrand(BUDGET_CTA_PARTNERS.heading)}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground mb-6 flex-1">{nowrapBrand(BUDGET_CTA_PARTNERS.text)}</p>
                <div>
                  <Button asChild variant="outline">
                    <a
                      href={BUDGET_CTA_PARTNERS.button.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track(BUDGET_CTA_PARTNERS.button.href)}
                    >
                      {BUDGET_CTA_PARTNERS.button.label}
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  </Button>
                </div>
              </aside>
            </div>
          </section>

          {/* Läs vidare */}
          <section className="mb-14" aria-labelledby="las-vidare">
            <h2 id="las-vidare" className="text-2xl font-bold tracking-tight mb-4">Läs vidare</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BUDGET_RELATED.map((l) => (
                <Link key={l.to} to={l.to} className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary">
                  <span>{nowrapBrand(l.label)}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10" aria-labelledby="faq">
            <h2 id="faq" className="text-2xl font-bold tracking-tight mb-4">Vanliga frågor</h2>
            <div className="space-y-4 max-w-3xl">
              {BUDGET_FAQ.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold">{nowrapBrand(f.q)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{nowrapBrand(f.a)}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
        <SourcesAndMethod variant="guide" externalSources={BUDGET_SOURCES} />
      </main>
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </>
  );
};

export default BudgetPrognosPlanering;
