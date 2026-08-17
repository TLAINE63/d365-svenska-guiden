import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getComparisonBySlug, ISV_COMPARISONS } from "@/data/isvComparisons";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";

const IsvCompare = () => {
  const { slug } = useParams<{ slug: string }>();
  const comparison = slug ? getComparisonBySlug(slug) : undefined;
  const BC_ISV_SOLUTIONS = useIsvSolutions();

  if (!comparison) {
    return <Navigate to="/kunskapscenter/dynamics-365-tillagg/?produkt=Business%20Central" replace />;
  }

  const solutions = comparison.solutionIds
    .map((id) => BC_ISV_SOLUTIONS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const cols =
    solutions.length >= 4
      ? "lg:grid-cols-4"
      : solutions.length === 3
      ? "lg:grid-cols-3"
      : "lg:grid-cols-2";

  // Bransch-konsistens: hitta gemensamma branscher (exkl. "Generell" som matchar allt)
  const industryArrays = solutions.map((s) =>
    (s.industries as string[]).filter((i) => i !== "Generell")
  );
  const allGeneral = industryArrays.every((arr) => arr.length === 0);
  const sharedIndustries = allGeneral
    ? []
    : industryArrays.reduce<string[]>((acc, arr, idx) => {
        if (idx === 0) return [...arr];
        return acc.filter((i) => arr.includes(i));
      }, []);
  const hasIndustryFocus = industryArrays.some((arr) => arr.length > 0);
  const crossIndustry = hasIndustryFocus && sharedIndustries.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${comparison.title} – jämförelse | d365.se`}
        description={comparison.intro}
        canonicalPath={`/compare/${comparison.slug}/`}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-[hsl(var(--hero-dark))] text-white border-b border-[hsl(var(--line-dark))]">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Link
            to={`/kunskapscenter/business-central/${comparison.parentArticleSlug}/`}
            className="inline-flex items-center text-sm text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Tillbaka till {comparison.category}
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">
            Jämförelse · {comparison.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{comparison.title}</h1>
          <p className="text-lg text-white/85 max-w-3xl leading-relaxed">{comparison.intro}</p>
        </div>
      </section>

      {/* Comparison grid */}
      <section className="container mx-auto px-4 py-10 max-w-6xl">
        {hasIndustryFocus && (
          <div
            className={`mb-6 p-4 rounded-lg border text-sm ${
              crossIndustry
                ? "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                : "border-primary/30 bg-primary/5 text-foreground"
            }`}
          >
            {crossIndustry ? (
              <>
                <strong>Obs – olika branscher:</strong> lösningarna nedan riktar sig till olika
                branscher och är inte direkt utbytbara. Använd jämförelsen som översikt, inte som
                head-to-head-val.
              </>
            ) : (
              <>
                <strong>Bransch:</strong> alla lösningar nedan är relevanta för{" "}
                {sharedIndustries.join(", ")}. Jämförelsen sker inom samma bransch.
              </>
            )}
          </div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-6`}>
          {solutions.map((s) => (
            <article
              key={s.id}
              className="border border-border rounded-lg bg-card p-6 flex flex-col"
            >
              <header className="mb-4">
                <h2 className="text-xl font-bold text-foreground">{s.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">{s.vendor}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{s.tier}</Badge>
                  {s.geo.map((g) => (
                    <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {s.industries.map((ind) => (
                    <Badge key={ind} variant="outline" className="text-[10px] border-primary/40 text-primary">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </header>

              <div className="space-y-4 text-sm leading-relaxed text-foreground/85 flex-1">
                <section>
                  <h3 className="font-semibold text-foreground mb-1">Vad det är</h3>
                  <p>{s.what}</p>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">Typiska användningsfall</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {s.useCases.slice(0, 4).map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-foreground mb-1">När den passar</h3>
                  <p>{s.whenFits}</p>
                </section>

                {s.combos.length > 0 && (
                  <section>
                    <h3 className="font-semibold text-foreground mb-1">Vanliga kombinationer</h3>
                    <ul className="space-y-0.5">
                      {s.combos.map((c) => (
                        <li key={c}>→ {c}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 md:p-8 rounded-lg border border-border bg-secondary/40 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Behöver ni en BC-partner som faktiskt jobbar med dessa tillägg?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-5">
            Vi matchar er mot Business Central-partners som har dokumenterad erfarenhet av rätt
            ISV-lösning, bransch och processdjup. Ingen partner betalar för att rankas högre.
          </p>
          <Button asChild>
            <Link to="/businesscentral#partners">Hitta Business Central-partners →</Link>
          </Button>
        </div>

        {/* Andra jämförelser */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-foreground mb-3">Fler jämförelser</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {ISV_COMPARISONS.filter((c) => c.slug !== comparison.slug)
              .slice(0, 8)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/compare/${c.slug}/`}
                    className="text-primary hover:underline"
                  >
                    {c.title}
                  </Link>
                  <span className="text-muted-foreground"> – {c.category}</span>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IsvCompare;
