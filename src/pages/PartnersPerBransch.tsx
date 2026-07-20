import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePartners, type DatabasePartner } from "@/hooks/usePartners";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";
import { ArrowRight, Building2 } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";
import { useBasicPartners, PRODUCT_LABEL, PRODUCT_ORDER } from "@/hooks/useBasicPartners";
import { Badge } from "@/components/ui/badge";

// Static featured-partner snapshot bundled at build time. Used as the
// source for the initial render (SSG/crawlers) so partnernamn, branscher
// och länkar finns i HTML utan att kräva klient-side JavaScript.
const STATIC_FEATURED = (partnerDataJson as any[]).filter(
  (p) => p.is_featured !== false,
) as unknown as DatabasePartner[];

const PartnersPerBransch = () => {
  const { data: livePartners = [], isLoading } = usePartners();
  const { data: basicPartners = [] } = useBasicPartners();
  // Use live DB data when available, otherwise the static snapshot so the
  // prerendered HTML always contains the full partner-per-bransch grid.
  const partners: DatabasePartner[] = livePartners.length > 0 ? livePartners : STATIC_FEATURED;

  // Group Basic partners by industry (from observed_industries per product area)
  const basicByIndustry = new Map<string, typeof basicPartners>();
  STANDARD_INDUSTRIES.forEach((i) => basicByIndustry.set(i.name, []));
  basicPartners.forEach((p) => {
    const seen = new Set<string>();
    (["bc", "fsc", "sales", "service"] as const).forEach((k) => {
      (p.observed_industries?.[k] || []).forEach((ind) => {
        if (basicByIndustry.has(ind) && !seen.has(ind)) {
          seen.add(ind);
          basicByIndustry.get(ind)!.push(p);
        }
      });
    });
  });
  basicByIndustry.forEach((list) =>
    list.sort((a, b) => a.name.localeCompare(b.name, "sv")),
  );

  // Build map: industry name -> partners[]
  const byIndustry = new Map<string, DatabasePartner[]>();
  STANDARD_INDUSTRIES.forEach((i) => byIndustry.set(i.name, []));

  partners.forEach((p) => {
    const inds = collectPartnerIndustries(p);
    inds.forEach((name) => {
      if (byIndustry.has(name)) byIndustry.get(name)!.push(p);
    });
  });

  // Sort each list: avtalspartners first, then alphabetical
  byIndustry.forEach((list) => {
    list.sort((a, b) => {
      const ag = a.agreement_signed ? 1 : 0;
      const bg = b.agreement_signed ? 1 : 0;
      if (ag !== bg) return bg - ag;
      return a.name.localeCompare(b.name, "sv");
    });
  });

  return (
    <>
      <SEOHead
        title="Dynamics 365-partners per bransch – Sverige | d365.se"
        description="Hitta Dynamics 365-partners per bransch i Sverige: tillverkning, retail, finans, offentlig sektor, hälsa & sjukvård m.fl. Köparsidig guide vid partnerval."
        canonicalPath="/partners-per-bransch/"
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Partners per bransch", url: "https://d365.se/partners-per-bransch/" },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-12 lg:pt-28">
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Översikt
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Dynamics 365-partners per bransch
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl">
              Alla listade partners grupperade efter bransch. Klicka på en partner
              för att se profil, referenscase och kontaktväg.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 max-w-5xl">
            {isLoading && partners.length === 0 ? (
              <p className="text-muted-foreground">Laddar partners…</p>
            ) : (
              <div className="space-y-10">
                {[...STANDARD_INDUSTRIES]
                  .sort((a, b) => {
                    const ac = (byIndustry.get(a.name) || []).length;
                    const bc = (byIndustry.get(b.name) || []).length;
                    if ((ac === 0) !== (bc === 0)) return ac === 0 ? 1 : -1;
                    return 0;
                  })
                  .map((industry) => {
                  const list = byIndustry.get(industry.name) || [];
                  return (
                    <div key={industry.slug} id={industry.slug} className="scroll-mt-24">
                      <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-border">
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                          <Link
                            to={`/branscher/${industry.slug}/`}
                            className="hover:text-primary transition-colors"
                          >
                            Dynamics 365-partners för {industry.name}
                          </Link>
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({list.length})
                          </span>
                        </h2>
                        <Link
                          to={`/branscher/${industry.slug}/`}
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1 shrink-0"
                        >
                          Branschguide <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {list.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          Inga listade partners för denna bransch ännu.{" "}
                          <Link to="/kontakt/" className="text-primary hover:underline">
                            Kontakta oss
                          </Link>{" "}
                          för vägledning.
                        </p>
                      ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {list.map((p) => (
                            <li key={p.id}>
                              <Link
                                to={`/partner/${p.slug}/`}
                                className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50  transition-all"
                              >
                                {p.logo_url ? (
                                  <img
                                    src={p.logo_url}
                                    alt={`${p.name} logotyp`}
                                    loading="lazy"
                                    className="w-10 h-10 rounded object-contain bg-white p-1 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-muted shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className="font-medium text-foreground group-hover:text-primary truncate block">
                                    {p.name}
                                  </span>
                                  {p.applications?.length > 0 && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {p.applications.slice(0, 3).join(", ")}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Basic partners per bransch – observed data, same layout as /alla-d365-partners/ */}
        {basicPartners.length > 0 && (
          <section className="py-10 bg-secondary/40 border-t border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Övriga D365-partners per bransch – Basickort
                </h2>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Dessa partners har ännu inte en egen profil på d365.se. Vi visar
                  observerad data (branscher, produktområden, orter) sammanställd
                  från publika källor – grupperat per bransch.
                </p>
              </div>
              <div className="space-y-10">
                {[...STANDARD_INDUSTRIES]
                  .sort((a, b) => {
                    const ac = (basicByIndustry.get(a.name) || []).length;
                    const bc = (basicByIndustry.get(b.name) || []).length;
                    if ((ac === 0) !== (bc === 0)) return ac === 0 ? 1 : -1;
                    return 0;
                  })
                  .map((industry) => {
                    const list = basicByIndustry.get(industry.name) || [];
                    if (list.length === 0) return null;
                    return (
                      <div key={`basic-${industry.slug}`} className="scroll-mt-24">
                        <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-border">
                          <h3 className="text-lg md:text-xl font-semibold text-foreground">
                            {industry.name}
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                              ({list.length})
                            </span>
                          </h3>
                        </div>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {list.map((p) => {
                            const basicProducts = PRODUCT_ORDER.filter(
                              (k) => p.observed_products?.[k],
                            );
                            return (
                              <li key={p.id}>
                                <Link
                                  to={`/basic/${p.slug}/`}
                                  className="group relative flex items-center justify-between gap-3 p-4 rounded-lg border border-dashed border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm transition-all"
                                >
                                  <div className="min-w-0">
                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                      {p.name}
                                    </div>
                                    {basicProducts.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {basicProducts.map((k) => (
                                          <Badge
                                            key={k}
                                            variant="outline"
                                            className="text-[10px] px-1.5 py-0 border-accent/30 text-accent bg-accent/5"
                                          >
                                            {PRODUCT_LABEL[k]}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PartnersPerBransch;
