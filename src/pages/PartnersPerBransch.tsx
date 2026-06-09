import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePartners, type DatabasePartner } from "@/hooks/usePartners";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { collectPartnerIndustries } from "@/lib/partnerIndustries";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2 } from "lucide-react";

const PartnersPerBransch = () => {
  const { data: partners = [], isLoading } = usePartners();

  // Build map: industry name -> partners[]
  const byIndustry = new Map<string, DatabasePartner[]>();
  STANDARD_INDUSTRIES.forEach((i) => byIndustry.set(i.name, []));

  partners.forEach((p) => {
    const inds = collectIndustries(p);
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
        title="Dynamics 365-partners per bransch | d365.se"
        description="Översikt över Dynamics 365-partners grupperade per bransch – från tillverkning och retail till finans, offentlig sektor och hälsa & sjukvård."
        canonicalPath="/partners-per-bransch/"
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Partners per bransch", url: "https://d365.se/partners-per-bransch/" },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-16 lg:pt-28">
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
              Alla listade partners grupperade efter bransch. Avtalspartners visas först
              i varje lista. Klicka på en partner för att se profil, referenscase och
              kontaktväg.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 max-w-5xl">
            {isLoading ? (
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
                          {industry.name}
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
                                className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
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
      </main>
      <Footer />
    </>
  );
};

export default PartnersPerBransch;
