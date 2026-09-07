import { useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FAQSchema } from "@/components/StructuredData";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { CE_APP_LABEL, ceApps } from "@/data/bcIsvSolutions";
import { findCeCategoryPage } from "@/data/ceIsvCategoryPages";

/** Indexerbar landningssida för en utvald tilläggskategori inom Customer Engagement. */
const CeIsvCategoryPage = () => {
  const { kategori } = useParams<{ kategori: string }>();
  const page = findCeCategoryPage(kategori);
  const all = useIsvSolutions();

  const solutions = useMemo(() => {
    if (!page) return [];
    const cats = new Set(page.categories.map((c) => c.toLowerCase()));
    return all
      .filter((s) => cats.has((s.category || "").toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [all, page]);

  if (!page) return <Navigate to="/kunskapscenter/dynamics-365-tillagg/" replace />;

  const catalogHref = `/kunskapscenter/dynamics-365-tillagg/?kategori=${page.categories
    .map(encodeURIComponent)
    .join(",")}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={page.metaTitle}
        description={page.metaDescription}
        canonicalPath={`/customer-engagement/tillagg/${page.slug}`}
        breadcrumbs={[
          { name: "Hem", url: "/" },
          { name: "Customer Engagement", url: "/crm/" },
          { name: page.h1, url: `/customer-engagement/tillagg/${page.slug}/` },
        ]}
      />
      <FAQSchema faqs={page.faq.map((f) => ({ question: f.q, answer: f.a }))} />
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            to="/kunskapscenter/dynamics-365-tillagg/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Till tilläggskatalogen
          </Link>

          <header className="max-w-3xl mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{page.h1}</h1>
            <p className="text-muted-foreground leading-relaxed">{page.intro}</p>
          </header>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Lösningar i den här kategorin
            </h2>
            {solutions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Vi arbetar med att verifiera lösningar inom det här området. Hör av dig om du vill
                ha en genomgång utifrån dina krav.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {solutions.map((s) => (
                  <Link
                    key={s.id}
                    to={`/kunskapscenter/dynamics-365-tillagg/?losning=${encodeURIComponent(s.id)}`}
                    className="group block rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {s.vendor}
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition">
                      {s.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ceApps(s)
                        .slice(0, 3)
                        .map((a) => (
                          <span
                            key={a}
                            className="text-[11px] font-medium px-2 py-0.5 rounded border border-accent/30 bg-accent/10 text-accent"
                          >
                            {CE_APP_LABEL[a]}
                          </span>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                      {s.shortDescription}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Vanliga frågor</h2>
            <div className="space-y-5">
              {page.faq.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-lg border border-border bg-muted/30 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground max-w-xl">
              Vill du jämföra fler tillägg för Dynamics 365 Customer Engagement? Hela katalogen
              täcker Business Central, Finance &amp; Supply Chain Management och Customer
              Engagement.
            </p>
            <Link
              to={catalogHref}
              className="inline-flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              Öppna katalogen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CeIsvCategoryPage;
