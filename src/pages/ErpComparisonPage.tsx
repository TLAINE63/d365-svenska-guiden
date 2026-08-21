import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, Check, AlertTriangle, ExternalLink, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import {
  PRODUCT_COMPARISONS,
  PRODUCT_META,
  getErpComparison,
} from "@/data/erpComparisons";

const ErpComparisonPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getErpComparison(slug) : undefined;

  if (!data) {
    return <Navigate to="/jamfor/" replace />;
  }

  const meta = PRODUCT_META[data.productKey];

  const breadcrumbs = [
    { name: "Hem", url: "/" },
    { name: data.productBreadcrumb, url: data.productPath },
    { name: "Jämför", url: "/jamfor" },
    { name: `${data.productShort} vs ${data.competitor}`, url: `/jamfor/${data.slug}` },
  ];

  // Andra jämförelser från samma produkt först, sedan resten
  const sameProduct = PRODUCT_COMPARISONS.filter(
    (c) => c.productKey === data.productKey && c.slug !== data.slug,
  );
  const otherProducts = PRODUCT_COMPARISONS.filter(
    (c) => c.productKey !== data.productKey,
  ).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={`${data.title} | d365.se`}
        description={data.metaDescription}
        canonicalPath={`/jamfor/${data.slug}/`}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={data.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <Navbar />

      <main className="pt-10 flex-1">
        {/* HERO */}
        <section className="bg-[hsl(var(--hero-dark))] border-b border-primary/20 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-8 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">
              Konkurrentjämförelse · Köparsidigt perspektiv
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {data.title}
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-3xl">{data.intro}</p>
          </div>
        </section>

        {/* SUMMARIES */}
        <section className="py-8 sm:py-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {data.productName}
                </p>
                <h2 className="text-xl font-bold mb-3 text-foreground">
                  När {data.productShort} är rätt val
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{data.productSummary}</p>
                <ul className="space-y-2">
                  {data.bestFor.product.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 mt-0.5 text-[hsl(var(--cta-orange))] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {data.competitor}
                  {data.competitorUrl && (
                    <a
                      href={data.competitorUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 ml-2 text-muted-foreground/70 hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </p>
                <h2 className="text-xl font-bold mb-3 text-foreground">
                  När {data.competitor} är rätt val
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{data.competitorSummary}</p>
                <ul className="space-y-2">
                  {data.bestFor.competitor.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 mt-0.5 text-[hsl(var(--cta-orange))] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-8 sm:py-10 bg-secondary/40 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Strukturerad jämförelse
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border bg-background">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    <th className="text-left p-3 font-semibold text-foreground w-1/5">Område</th>
                    <th className="text-left p-3 font-semibold text-foreground w-2/5">{data.productShort}</th>
                    <th className="text-left p-3 font-semibold text-foreground w-2/5">{data.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r) => (
                    <tr key={r.area} className="border-t border-border align-top">
                      <td className="p-3 font-medium text-foreground">{r.area}</td>
                      <td className="p-3 text-muted-foreground">{r.product}</td>
                      <td className="p-3 text-muted-foreground">{r.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg border border-border bg-background p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Observera:</strong> Priser, licensvillkor och funktionalitet kan ändras över tid. Kontrollera aktuella uppgifter direkt med respektive leverantör eller partner innan du fattar beslut. Jämförelsen är en köparsidig vägledning, inte en garanti för att enskilda funktioner eller priser är identiska vid ditt köptillfälle.
              </p>
            </div>
            <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-4 flex gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tilläggsapplikationer breddar bilden.</strong> Dynamics 365 kompletteras av tusentals certifierade appar via <a href="https://www.microsoft.com/en-us/marketplace" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Microsoft Marketplace</a> som ger djupare funktionalitet inom specifika områden och branscher (t.ex. tillverkning, handel, fastighet, life science, projektverksamhet). En funktion som saknas i standard finns ofta som en branschbeprövad tilläggsapp. <Link to="/valjdynamics365partner/" className="text-primary hover:underline font-medium">Ta en dialog med en Dynamics 365-partner</Link> för att se vilka tillägg som matchar just dina krav.
              </p>
            </div>
          </div>
        </section>

        {/* WHEN NOT */}
        <section className="py-8 sm:py-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl grid md:grid-cols-2 gap-6">
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <h3 className="text-lg font-bold text-foreground">
                    När {data.productShort} inte passar
                  </h3>
                </div>
                <ul className="space-y-2">
                  {data.productLimits.map((b) => (
                    <li key={b} className="text-sm text-foreground/80">• {b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <h3 className="text-lg font-bold text-foreground">
                    När {data.competitor} inte passar
                  </h3>
                </div>
                <ul className="space-y-2">
                  {data.competitorLimits.map((b) => (
                    <li key={b} className="text-sm text-foreground/80">• {b}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 sm:py-10 bg-secondary/40 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Vanliga frågor</h2>
            <div className="space-y-4">
              {data.faqs.map((f) => (
                <div key={f.q} className="rounded-lg border border-border bg-background p-5">
                  <p className="font-semibold text-foreground mb-2">{f.q}</p>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-background p-6 sm:p-10 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                Vill du jämföra {data.productShort} mot ditt behov – inte mot {data.competitor}?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Starta en behovsanalys, räkna fram TCO eller utforska {data.productShort}-sidan med
                priser, funktioner och partners.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {meta.ctaPrimary && (
                  <Link
                    to={meta.ctaPrimary.url}
                    className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white font-medium px-5 py-2.5"
                  >
                    {meta.ctaPrimary.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {meta.ctaSecondary && (
                  <Link
                    to={meta.ctaSecondary.url}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-background hover:bg-secondary text-foreground font-medium px-5 py-2.5"
                  >
                    {meta.ctaSecondary.label}
                  </Link>
                )}
                <Link
                  to={data.productPath}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background hover:bg-secondary text-foreground font-medium px-5 py-2.5"
                >
                  Till {data.productShort}-sidan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* OTHER COMPARISONS */}
        {(sameProduct.length > 0 || otherProducts.length > 0) && (
          <section className="py-10 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-8">
              {sameProduct.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    Fler {data.productShort}-jämförelser
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {sameProduct.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/jamfor/${c.slug}/`}
                        className="rounded-lg border border-border p-4 hover:border-foreground/30 transition"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          Jämförelse
                        </p>
                        <p className="font-medium text-foreground">
                          {c.productShort} vs {c.competitor}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {otherProducts.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    Jämförelser för andra produkter
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {otherProducts.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/jamfor/${c.slug}/`}
                        className="rounded-lg border border-border p-4 hover:border-foreground/30 transition"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          {c.productBreadcrumb}
                        </p>
                        <p className="font-medium text-foreground">
                          {c.productShort} vs {c.competitor}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ErpComparisonPage;
