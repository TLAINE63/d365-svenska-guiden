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
import { getBasicPartnerIndustries } from "@/lib/basicPartnerMatch";
import { useBasicPartners, BASIC_COPY } from "@/hooks/useBasicPartners";
import { useState } from "react";
import VerifiedOnlyToggle from "@/components/VerifiedOnlyToggle";
import PartnerCard from "@/components/PartnerCard";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";


// Static featured-partner snapshot bundled at build time. Used as the
// source for the initial render (SSG/crawlers) so partnernamn, branscher
// och länkar finns i HTML utan att kräva klient-side JavaScript.
const STATIC_FEATURED = (partnerDataJson as any[]).filter(
  (p) => p.is_featured !== false,
) as unknown as DatabasePartner[];

const PartnersPerBransch = () => {
  const { data: livePartners = [], isLoading } = usePartners();
  const { data: basicPartners = [] } = useBasicPartners();
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  // Use live DB data when available, otherwise the static snapshot so the
  // prerendered HTML always contains the full partner-per-bransch grid.
  const partners: DatabasePartner[] = livePartners.length > 0 ? livePartners : STATIC_FEATURED;

  // Group Basic partners by industry (from observed_industries per product area)
  const basicByIndustry = new Map<string, typeof basicPartners>();
  STANDARD_INDUSTRIES.forEach((i) => basicByIndustry.set(i.name, []));
  basicPartners.forEach((p) => {
    getBasicPartnerIndustries(p).forEach((ind) => {
      if (basicByIndustry.has(ind)) basicByIndustry.get(ind)!.push(p);
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

  // Nivå 1 – exponering: alla partners som listas på sidan.
  usePartnerImpressions("partner_list_impression", partners as any[], { surface: "partners-per-bransch" });
  usePartnerImpressions("partner_list_impression", basicPartners as any[], { surface: "partners-per-bransch-basic" });

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
            <div className="mt-5">
              <VerifiedOnlyToggle checked={verifiedOnly} onChange={setVerifiedOnly} />
            </div>
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
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {list.map((p) => (
                            <li key={p.id} className="h-full">
                              <PartnerCard
                                partner={p}
                                profileUrl={`/partner/${p.slug}/`}
                                colorScheme="primary"
                                highlightedIndustry={industry.name}
                                resultView
                              />
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
        {!verifiedOnly && basicPartners.length > 0 && (
          <section className="py-10 bg-secondary/40 border-t border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Fler partners som arbetar med Dynamics 365
                </h2>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Profilerna bygger på publikt tillgängliga uppgifter och har ännu inte
                  verifierats tillsammans med partnern. De innehåller därför varken
                  kontaktperson, kundcase eller detaljerade kompetenser – här visas de
                  grupperade per bransch. {BASIC_COPY.industriesLabel}
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
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {list.map((p) => (
                            <li key={p.id}>
                              <PartnerBasicCard partner={p} variant="list" />
                            </li>
                          ))}
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
