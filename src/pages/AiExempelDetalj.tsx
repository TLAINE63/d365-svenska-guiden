import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { trackAi } from "@/lib/aiLibraryTracking";
import { ArrowRight, Check, Copy, MessageSquare, ShieldCheck, MousePointerClick } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NotFound from "@/pages/NotFound";
import BeforeAfterWorkflow from "@/components/ai-examples/BeforeAfterWorkflow";
import AiExampleCard from "@/components/ai-examples/AiExampleCard";
import AiTypeBadge from "@/components/ai-examples/AiTypeBadge";
import { AI_CATEGORIES, AI_TYPES, getApplication, getCategory, getExampleBySlug, getRelatedExamples, productCtaLabel } from "@/data/aiExamples";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="border-t border-border py-7">
    <h2 id={id} className="text-xl font-bold text-foreground">{title}</h2>
    <div className="mt-4 text-muted-foreground">{children}</div>
  </section>
);

const AiExempelDetalj = () => {
  const { slug = "" } = useParams();
  const ex = getExampleBySlug(slug);
  const [copied, setCopied] = useState(false);
  const [back, setBack] = useState("/ai/exempel/");
  useEffect(() => {
    if (ex) trackAi("ai_example_open", ex);
    try { const q = sessionStorage.getItem("ai_library_filters"); if (q) setBack(`/ai/exempel/?${q}#exempel`); } catch { /* */ }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ex) return <NotFound />;
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); trackAi("ai_prompt_copy", ex); setTimeout(() => setCopied(false), 2500); } catch { /* */ }
  };
  const t = (ev: Parameters<typeof trackAi>[0], dest: string) => () => trackAi(ev, ex, { cta_destination: dest });
  const app = getApplication(ex.application);
  const level = AI_CATEGORIES.findIndex((c) => c.key === ex.category);
  const [firstPrompt, ...morePrompts] = ex.promptExamples;
  const isAgent = ex.aiType === "agent" || ex.aiType === "mcp";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${ex.title} med AI i ${app.label}`}
        description={`${ex.summary} ${ex.whatHappens}`.slice(0, 158)}
        canonicalPath={`/ai/exempel/${ex.slug}/`}
        ogType="article"
        articleModifiedTime={ex.lastVerified}
        articleSection={app.label}
        breadcrumbs={[{ name: "Start", url: "/" }, { name: "AI-exempel", url: "/ai/exempel/" }, { name: ex.title, url: `/ai/exempel/${ex.slug}/` }]}
      />
      <Navbar />
      <main className="pt-24">
        <article className="container mx-auto max-w-3xl px-4 py-10">
          <Link to={back} className={`rounded-sm text-sm text-muted-foreground hover:text-primary ${focus}`}>← Alla exempel</Link>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-muted-foreground">
              <img src={app.icon} alt="" className="h-4 w-4" /> <span className="whitespace-nowrap">{app.label}</span>
            </span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">{getCategory(ex.category).label}</span>
            <AiTypeBadge type={ex.aiType} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">{ex.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{ex.summary}</p>

          <Section id="vad" title="Vad vill du göra?"><p className="text-lg italic text-foreground">"{ex.userGoal}"</p></Section>

          <Section id="forr-nu" title="Tidigare och med AI">
            <BeforeAfterWorkflow traditional={ex.traditionalWorkflow} ai={ex.aiWorkflow} />
          </Section>

          {ex.imageUrl && (
            <figure className="border-t border-border py-7">
              <img src={ex.imageUrl} alt={ex.imageAlt ?? ""} className="w-full rounded-xl border border-border" loading="lazy" />
              {(ex.imageCaption || ex.imageSource) && (
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  {ex.imageCaption}
                  {ex.imageSource && <span className="block text-xs">Bildkälla: {ex.imageSourceUrl ? <a className="underline" href={ex.imageSourceUrl} target="_blank" rel="noopener">{ex.imageSource}</a> : ex.imageSource}</span>}
                </figcaption>
              )}
            </figure>
          )}

          {firstPrompt ? (
            <Section id="prova" title="Prova att fråga">
              <div className="flex items-start gap-3 rounded-2xl rounded-bl-sm border border-primary/30 bg-primary/5 p-4">
                <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <p className="flex-1 break-words text-lg font-medium text-foreground">{firstPrompt}</p>
                <button type="button" onClick={() => copy(firstPrompt)} aria-label="Kopiera prompten"
                  className={`inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 ${focus}`}>
                  {copied ? <Check className="h-3.5 w-3.5 text-accent" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />} Kopiera
                </button>
              </div>
              <p className="mt-2 min-h-[1.25rem] text-sm text-accent" role="status" aria-live="polite">{copied ? "Prompten är kopierad" : ""}</p>
              {morePrompts.length > 0 && (
                <>
                  <h3 className="mt-5 text-sm font-semibold text-foreground">Prova också</h3>
                  <ul className="mt-2 space-y-2">
                    {morePrompts.slice(0, 3).map((p) => (
                      <li key={p} className="rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-foreground break-words">{p}</li>
                    ))}
                  </ul>
                </>
              )}
            </Section>
          ) : ex.howToStart ? (
            <Section id="prova" title="Så kommer du åt det">
              <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <MousePointerClick className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <p className="text-foreground">{ex.howToStart} Du behöver inte skriva någon fråga.</p>
              </div>
            </Section>
          ) : null}

          <Section id="hander" title="Vad händer?"><p>{ex.whatHappens}</p></Section>
          <Section id="kontroll" title="Du har fortfarande kontrollen">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
              <p className="text-foreground">{ex.humanResponsibility}</p>
            </div>
          </Section>
          <Section id="forandras" title="Vad förändras?"><p className="text-foreground">{ex.efficiencyBenefit}</p></Section>

          <Section id="niva" title="Nästa nivå">
            <ol className="flex flex-wrap gap-2" aria-label="Från hitta till automatisera">
              {AI_CATEGORIES.map((c, i) => (
                <li key={c.key} aria-current={i === level ? "step" : undefined}
                  className={`rounded-md border px-3 py-1.5 text-sm ${i === level ? "border-primary bg-primary font-semibold text-primary-foreground" : "border-border text-muted-foreground"}`}>
                  {i === level ? `Idag: ${c.label}` : c.label}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm">Markerat steg visar var exemplet befinner sig. Om nästa steg stöds beror på licens, version och era processer.</p>
          </Section>

          <section aria-labelledby="relaterade" className="border-t border-border py-7">
            <h2 id="relaterade" className="text-xl font-bold text-foreground">Relaterade exempel</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {getRelatedExamples(ex).map((r) => <div key={r.id} onClickCapture={t("ai_related_example_click", `/ai/exempel/${r.slug}/`)}><AiExampleCard example={r} /></div>)}
            </div>
          </section>

          <section aria-labelledby="kalla" className="border-t border-border py-6 text-sm text-muted-foreground">
            <h2 id="kalla" className="sr-only">Källa och verifiering</h2>
            <dl className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-foreground">Källa</dt>
              <dd>{ex.sourceUrl ? <a href={ex.sourceUrl} onClick={t("ai_source_click", ex.sourceUrl)} className="underline" rel="noopener" target="_blank">{ex.sourceName}</a> : "Exempel på användningsfall"}</dd>
              {ex.lastVerified && (<><dt className="font-medium text-foreground">Senast verifierad</dt><dd>{ex.lastVerified}</dd></>)}
              <dt className="font-medium text-foreground">Typ av funktion</dt><dd>{AI_TYPES[ex.aiType].label}: {AI_TYPES[ex.aiType].text}</dd>
            </dl>
          </section>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-border bg-card p-5">
            <Link to="/ai/exempel/" className={`inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 ${focus}`}>Se fler exempel <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            {isAgent
              ? <Link to="/agents/" onClick={t("ai_ai_hub_click", "/agents/")} className={`rounded-sm text-sm font-medium text-primary hover:underline ${focus}`}>Utforska AI-agenter i Dynamics&nbsp;365</Link>
              : <Link to={app.productUrl} onClick={t("ai_product_content_click", app.productUrl)} className={`rounded-sm text-sm font-medium text-primary hover:underline ${focus}`}>{productCtaLabel(ex.application).replace("Dynamics 365", "Dynamics\u00A0365")}</Link>}
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            Vill du se hur det här kan fungera hos er?{" "}
            <Link to="/valjdynamics365partner/" onClick={t("ai_partner_cta_click", "/valjdynamics365partner/")} className={`rounded-sm font-medium text-primary hover:underline ${focus}`}>Hitta en Dynamics&nbsp;365-partner</Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default AiExempelDetalj;
