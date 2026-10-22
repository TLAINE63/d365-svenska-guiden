import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { useAktuelltArticle } from "@/hooks/useAktuellt";
import { nowrapBrand } from "@/lib/nowrapBrand";
import {
  AKTUELLT_ACTION_HINTS,
  AKTUELLT_AUDIENCES,
  AKTUELLT_PRODUCT_PAGES,
  aktuelltActionLabel,
  aktuelltAvailabilityLabel,
  aktuelltPath,
  aktuelltProductLabel,
  aktuelltTopicLabel,
  showsAvailability,
  type AktuelltArticle as AktuelltArticleType,
} from "@/lib/aktuellt";
import { trackAktuelltOutbound, trackAktuelltView } from "@/utils/trackAktuelltEvent";

interface Props {
  initialData?: AktuelltArticleType | null;
}

const d = (s: string | null | undefined) => (s || "").slice(0, 10);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">{nowrapBrand(title)}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export default function AktuelltArticle({ initialData = null }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const { data: fetched, isLoading: queryLoading } = useAktuelltArticle(slug);
  const item = fetched ?? initialData;
  const isLoading = queryLoading && !initialData;

  useEffect(() => {
    if (item?.id) trackAktuelltView(item);
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:pt-36">
          <p className="text-muted-foreground">Laddar analysen…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Analysen hittades inte" description="Analysen finns inte eller är inte längre publicerad på d365.se." noIndex />
        <Navbar />
        <main className="container mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:pt-36">
          <h1 className="text-2xl font-bold text-foreground">Analysen hittades inte</h1>
          <p className="mt-3 text-muted-foreground">Den finns inte eller är inte längre publicerad.</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/aktuellt/" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Till Aktuellt
            </Link>
            <Link to="/events/" className="font-semibold text-primary hover:underline">Letar du efter event och webbinarier?</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const a = item.analysis ?? {};
  const canonical = aktuelltPath(item.slug);
  const productLabels = (item.product_keys ?? []).map(aktuelltProductLabel).filter(Boolean);
  const kind = productLabels[0] || aktuelltTopicLabel(item.topic) || "Dynamics 365";
  const showEval = (item.customer_status === "evaluating" || item.customer_status === "both") && !!a.for_evaluators;
  const showExisting = (item.customer_status === "existing" || item.customer_status === "both") && !!a.for_customers;
  const audiences = (item.target_roles ?? []).map((r) => AKTUELLT_AUDIENCES.find((x) => x.key === r)?.label).filter(Boolean) as string[];
  const productPage = (item.product_keys ?? []).map((k) => AKTUELLT_PRODUCT_PAGES[k]).find(Boolean);
  const extraSources = (item.extra_sources ?? []).filter((s) => s?.url);
  const description = (item.description || a.what_happened || item.title).replace(/\s+/g, " ").trim().slice(0, 158);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${item.title} | Aktuellt`}
        description={description}
        canonicalPath={canonical}
        ogType="article"
        ogImage={item.image_url || undefined}
        ogImageAlt={item.title}
        articlePublishedTime={item.published_at ? new Date(item.published_at).toISOString() : undefined}
        articleModifiedTime={item.updated_at ? new Date(item.updated_at).toISOString() : undefined}
        articleAuthor="d365.se-redaktionen"
        articleSection={kind}
        articleTags={[...productLabels, aktuelltTopicLabel(item.topic)].filter(Boolean)}
        dateModified={d(item.fact_checked_at) || undefined}
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Aktuellt", url: "/aktuellt/" },
          { name: item.title, url: canonical },
        ]}
      />
      <ArticleSchema
        headline={item.title}
        description={description}
        url={`https://d365.se${canonical}`}
        image={item.image_url || undefined}
        datePublished={item.published_at ? new Date(item.published_at).toISOString() : undefined}
        dateModified={item.updated_at ? new Date(item.updated_at).toISOString() : undefined}
        authorName="d365.se-redaktionen"
        authorType="Organization"
        authorUrl="https://d365.se/om-oss/"
        section={kind}
      />
      <Navbar />

      <main className="pt-24 lg:pt-32">
        <section className="border-b border-border bg-secondary/40 py-10 sm:py-14">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <Link to="/aktuellt/" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Aktuellt
            </Link>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold uppercase tracking-wider text-accent">{nowrapBrand(kind)}</span>
              {showsAvailability(item.availability_status) && (
                <span className="rounded-full border border-border bg-card px-2 py-0.5 font-medium text-muted-foreground">
                  {aktuelltAvailabilityLabel(item.availability_status)}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">{nowrapBrand(item.title)}</h1>
            {item.description && <p className="mt-4 text-lg text-muted-foreground">{nowrapBrand(item.description)}</p>}
          </div>
        </section>

        <article className="container mx-auto max-w-4xl px-4 pb-14 sm:px-6">
          {a.what_happened && <Section title="Vad har hänt?"><p>{nowrapBrand(a.what_happened)}</p></Section>}
          {a.business_impact && <Section title="Vad innebär det för verksamheten?"><p>{nowrapBrand(a.business_impact)}</p></Section>}
          {showEval && <Section title="För er som utvärderar Dynamics 365"><p>{nowrapBrand(a.for_evaluators!)}</p></Section>}
          {showExisting && <Section title="För er som redan använder Dynamics 365"><p>{nowrapBrand(a.for_customers!)}</p></Section>}

          {item.recommended_action && (
            <Section title="Behöver ni agera?">
              <p className="text-lg font-semibold text-foreground">{aktuelltActionLabel(item.recommended_action)}</p>
              {AKTUELLT_ACTION_HINTS[item.recommended_action] && <p className="text-muted-foreground">{AKTUELLT_ACTION_HINTS[item.recommended_action]}</p>}
            </Section>
          )}

          <Section title="Fördjupning">
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[12rem_1fr]">
              {showsAvailability(item.availability_status) && (<><dt className="font-semibold text-foreground">Tillgänglighet</dt><dd>{aktuelltAvailabilityLabel(item.availability_status)}</dd></>)}
              {productLabels.length > 0 && (<><dt className="font-semibold text-foreground">Berörda produkter</dt><dd>{productLabels.join(", ")}</dd></>)}
              {audiences.length > 0 && (<><dt className="font-semibold text-foreground">Berörda målgrupper</dt><dd>{audiences.join(", ")}</dd></>)}
              {item.industry && (<><dt className="font-semibold text-foreground">Bransch</dt><dd>{item.industry}</dd></>)}
            </dl>
            {(a.partner_questions?.length ?? 0) > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-foreground">Frågor att ta med till partnern</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {a.partner_questions!.map((q, i) => <li key={i}>{nowrapBrand(q)}</li>)}
                </ul>
              </div>
            )}
            {extraSources.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-foreground">Kompletterande källor</p>
                <ul className="mt-2 space-y-1">
                  {extraSources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noopener nofollow" className="text-primary hover:underline">{s.name || s.url}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </Section>

          <section className="mt-10 rounded-xl border border-border bg-card p-5 text-sm">
            <h2 className="text-base font-semibold text-foreground">Källinformation</h2>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
              {item.published_at && (<><dt className="text-muted-foreground">Publicerad på d365.se</dt><dd>{d(item.published_at)}</dd></>)}
              {item.fact_checked_at && (<><dt className="text-muted-foreground">Senast faktakontrollerad</dt><dd>{d(item.fact_checked_at)}</dd></>)}
              {item.source_url && (
                <>
                  <dt className="text-muted-foreground">Primärkälla</dt>
                  <dd>
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener"
                      onClick={() => trackAktuelltOutbound(item, "source", item.source_url!)}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      {item.source_name || "Originalkällan"}{item.source_published_at ? `, ${d(item.source_published_at)}` : ""}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </dd>
                </>
              )}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Sammanfattning och analys av d365.se-redaktionen, med stöd av AI och granskad före publicering. Läs alltid originalkällan för fullständiga villkor.
            </p>
          </section>

          <section className="mt-10 border-t border-border pt-8">
            <h2 className="text-xl font-bold text-foreground">Relevant nästa steg</h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {item.cta_url && (
                <Button asChild className="bg-[hsl(var(--cta-orange))] text-primary-foreground hover:bg-[hsl(var(--cta-orange-hover))]">
                  <Link to={item.cta_url} onClick={() => trackAktuelltOutbound(item, "primary_cta", item.cta_url!)}>
                    {nowrapBrand(item.cta_label || "Gå vidare")} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {productPage && productPage !== item.cta_url && (
                <Link to={productPage} onClick={() => trackAktuelltOutbound(item, "product_page", productPage)} className="text-sm font-semibold text-primary hover:underline">
                  Läs om {productLabels[0] || "produkten"}
                </Link>
              )}
              {item.cta_url !== "/kom-igang/" && (
                <Link to="/kom-igang/" onClick={() => trackAktuelltOutbound(item, "needs_guide", "/kom-igang/")} className="text-sm font-semibold text-primary hover:underline">
                  Hitta rätt lösning
                </Link>
              )}
              {item.cta_url !== "/alla-d365-partners/" && (
                <Link to="/alla-d365-partners/" onClick={() => trackAktuelltOutbound(item, "partners", "/alla-d365-partners/")} className="text-sm font-semibold text-primary hover:underline">
                  Se Dynamics&nbsp;365-partners
                </Link>
              )}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
