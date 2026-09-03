import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import partnerDataJson from "@/data/partnerData.json";
import { PRODUCT_PARTNERS_SVERIGE } from "@/data/productPartnersSverige";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

const breadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Partners-sitemap", url: "https://d365.se/partners-sitemap" },
];

/**
 * Ren HTML-sitemap över alla partnerverifierade profiler.
 * Använder partnerData.json direkt så att SSG-prerendret innehåller
 * fullständiga <a href>-länkar utan beroende av klient-fetch.
 */
export default function PartnersSitemap() {
  const featured = (partnerDataJson as any[])
    .filter((p) => p.is_featured !== false)
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));

  const byIndustry: Record<string, any[]> = {};
  for (const ind of STANDARD_INDUSTRIES) {
    byIndustry[ind.slug] = featured.filter((p) => {
      const pf = p.product_filters || {};
      return (["bc", "fsc", "sales", "service"] as const).some((k) => {
        const inds: string[] = pf[k]?.industries || [];
        return inds.includes(ind.name);
      });
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Partners-sitemap – alla Dynamics 365-partners | d365.se"
        description="HTML-sitemap över alla partnerverifierade Dynamics 365-profiler på d365.se – sorterade A–Ö, per produktområde och per bransch."
        canonicalPath="/partners-sitemap/"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />

      <main className="pt-10">
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Partners-sitemap</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Partners-sitemap
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              En ren HTML-översikt över alla {featured.length} partnerverifierade
              Microsoft Dynamics 365-partners på d365.se. Sidan finns för att
              både sökmotorer och AI-assistenter ska hitta alla partners som
              vanliga länkar.
            </p>
          </div>
        </section>

        {/* A–Ö */}
        <section className="py-8 sm:py-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Alla partners A–Ö
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              {featured.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/partner/${p.slug}/`}
                    className="text-foreground hover:text-primary hover:underline"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Per produktområde */}
        <section className="py-8 sm:py-10 bg-secondary/40 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Partners per produktområde
            </h2>
            <ul className="space-y-2 text-sm">
              {PRODUCT_PARTNERS_SVERIGE.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/${c.slug}/`}
                    className="text-foreground hover:text-primary hover:underline"
                  >
                    {c.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Per bransch */}
        <section className="py-8 sm:py-10 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Partners per bransch
            </h2>
            <div className="space-y-8">
              {STANDARD_INDUSTRIES.map((ind) => {
                const list = byIndustry[ind.slug] || [];
                if (list.length === 0) return null;
                return (
                  <div key={ind.slug}>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      <Link to={`/branscher/${ind.slug}/`} className="hover:text-primary hover:underline">
                        {ind.name}
                      </Link>
                      <span className="text-xs text-muted-foreground ml-2 font-normal">
                        ({list.length})
                      </span>
                    </h3>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {list.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/partner/${p.slug}/`}
                            className="text-foreground hover:text-primary hover:underline"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
