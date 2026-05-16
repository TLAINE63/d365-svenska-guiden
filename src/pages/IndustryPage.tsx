import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import PartnerCard from "@/components/PartnerCard";
import { useIndustryPage } from "@/hooks/useIndustryPage";
import { usePartners } from "@/hooks/usePartners";
import { findIndustryBySlug } from "@/data/standardIndustries";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Users, AlertTriangle, Layers, HelpCircle, Filter, Building2 } from "lucide-react";

import BusinessCentralIcon from "@/assets/icons/BusinessCentral.svg";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";

// Industry hero images (webp). Falls back to a default gradient if missing.
import tillverkningImg from "@/assets/industries/tillverkning.webp";
import livsmedelsImg from "@/assets/industries/livsmedel.webp";
import handelDistributionImg from "@/assets/industries/handel-distribution.webp";
import detaljhandelImg from "@/assets/industries/detaljhandel.webp";
import konsultforetagImg from "@/assets/industries/konsultforetag.webp";
import byggEntreprenadImg from "@/assets/industries/bygg-entreprenad.webp";
import fastigheterImg from "@/assets/industries/fastigheter.webp";
import energiImg from "@/assets/industries/energi.webp";
import finansForsakringImg from "@/assets/industries/finans-forsakring.webp";
import lakemedelImg from "@/assets/industries/lakemedel-life-science.webp";
import itTechImg from "@/assets/industries/it-tech.webp";
import transportLogistikImg from "@/assets/industries/transport-logistik.webp";
import mediaPublishingImg from "@/assets/industries/media-publishing.webp";
import jordbrukImg from "@/assets/industries/jordbruk-skogsbruk.webp";
import halsaImg from "@/assets/industries/halsa-sjukvard.webp";
import medlemsorganisationerImg from "@/assets/industries/medlemsorganisationer.webp";
import utbildningImg from "@/assets/industries/utbildning.webp";
import offentligSektorImg from "@/assets/industries/offentlig-sektor.webp";
import uthyrningImg from "@/assets/industries/uthyrning.webp";

const INDUSTRY_IMAGES: Record<string, string> = {
  "tillverkning": tillverkningImg,
  "livsmedel-processindustri": livsmedelsImg,
  "grossist-distribution": handelDistributionImg,
  "retail-ehandel": detaljhandelImg,
  "konsulttjanster": konsultforetagImg,
  "bygg-entreprenad": byggEntreprenadImg,
  "fastighet-forvaltning": fastigheterImg,
  "energi-utilities": energiImg,
  "finans-forsakring": finansForsakringImg,
  "life-science-medtech": lakemedelImg,
  "telekom-it-tjanster": itTechImg,
  "logistik-transport": transportLogistikImg,
  "media-publishing": mediaPublishingImg,
  "jordbruk-skogsbruk": jordbrukImg,
  "halsa-sjukvard": halsaImg,
  "nonprofit-organisationer": medlemsorganisationerImg,
  "medlemsorganisationer": medlemsorganisationerImg,
  "utbildning": utbildningImg,
  "offentlig-sektor": offentligSektorImg,
  "uthyrning": uthyrningImg,
};

// Product filters mapped to product_filters keys in the database
const PRODUCT_FILTERS: { key: "bc" | "fsc" | "sales" | "service"; label: string; short: string; icon: string }[] = [
  { key: "bc", label: "Business Central", short: "Business Central", icon: BusinessCentralIcon },
  { key: "fsc", label: "Finance & Supply Chain", short: "Finance & SCM", icon: FinanceIcon },
  { key: "sales", label: "Sales & Customer Insights (Marketing Automation)", short: "CRM Sales", icon: SalesIcon },
  { key: "service", label: "Customer Service & Field Service & Contact Center", short: "CRM Service", icon: CustomerServiceIcon },
];

// Simple seeded shuffle for stable random order per session+industry
const seededShuffle = <T,>(arr: T[], seed: number): T[] => {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = Math.floor((s / 0x7fffffff) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const IndustryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? findIndustryBySlug(slug) : undefined;
  const { page, loading } = useIndustryPage(slug);
  const { data: partners } = usePartners();
  const [selected, setSelected] = useState<("bc" | "fsc" | "sales" | "service")[]>([]);

  const industryName = page?.name || meta?.name || "Bransch";
  const heroImage = slug ? INDUSTRY_IMAGES[slug] : undefined;

  const matchingPartners = useMemo(() => {
    if (!partners || !meta) return [];
    const industryName = meta.name;

    // Use product_filters[product].industries (radikal partnerprofilering)
    // Partner matches industry if ANY product they offer lists this industry.
    // If product filters are selected, partner must list industry under at
    // least one of the selected products.
    const filtered = partners.filter((p) => {
      const pf = p.product_filters || {};
      const productsToCheck = selected.length > 0
        ? selected
        : (["bc", "fsc", "sales", "service"] as const);
      return productsToCheck.some((k) => {
        const inds = pf[k]?.industries || [];
        return inds.includes(industryName);
      });
    });

    // Seeded shuffle so list is random but stable per session/industry
    const seed = hashString(`${slug}-${selected.join(",")}`);
    return seededShuffle(filtered, seed);
  }, [partners, meta, selected, slug]);

  if (!loading && !page) {
    return (
      <>
        <SEOHead
          title={`${industryName} – Dynamics 365`}
          description="Branschsidan är inte publicerad ännu."
          canonicalPath={`/branscher/${slug}`}
          noIndex
        />
        <Navbar />
        <main className="min-h-screen bg-background pt-24">
          <div className="container mx-auto px-4 max-w-3xl text-center py-20">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{industryName}</h1>
            <p className="text-muted-foreground mb-6">
              Innehållet för denna bransch är på väg. Under tiden kan du hitta partners eller göra en behovsanalys.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/valj-partner" className="text-primary hover:underline">Hitta partner →</Link>
              <Link to="/behovsanalys" className="text-primary hover:underline">Gör behovsanalys →</Link>
              <Link to="/branscher" className="text-primary hover:underline">Alla branscher →</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={page?.meta_title || `${industryName} – Microsoft Dynamics 365`}
        description={
          page?.meta_description ||
          `Microsoft Dynamics 365 för ${industryName.toLowerCase()}: affärsprocesser, utmaningar, roller och partners.`
        }
        canonicalPath={`/branscher/${slug}`}
        ogImage={heroImage}
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Branscher", url: "https://d365.se/branscher" },
          { name: industryName, url: `https://d365.se/branscher/${slug}` },
        ]}
      />
      {page?.faq && page.faq.length > 0 && (
        <FAQSchema faqs={page.faq.map((f) => ({ question: f.q, answer: f.a }))} />
      )}

      <Navbar />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero med bakgrundsbild */}
        <section className="relative border-b border-border overflow-hidden min-h-[360px] md:min-h-[440px] flex items-center">
          {heroImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: `url(${heroImage})` }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20" aria-hidden />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" aria-hidden />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-background" aria-hidden />
          )}
          <div className="relative container mx-auto px-4 max-w-5xl py-16 md:py-24">
            <nav className="text-xs text-muted-foreground mb-3">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/branscher" className="hover:text-foreground">Branscher</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{industryName}</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 drop-shadow-sm">
              {industryName}
            </h1>
            {page?.intro && (
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed max-w-3xl whitespace-pre-line">
                {page.intro}
              </p>
            )}
            <a
              href="#partners"
              className="lg:hidden mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              <Building2 className="w-4 h-4" />
              Se {matchingPartners.length} partners inom {industryName.toLowerCase()}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Två-kolumns layout: innehåll vänster, sticky partners höger */}
        <section className="py-10 border-b border-border">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Vänster: innehåll */}
              <div className="lg:col-span-2 space-y-10">
                {page?.processes && page.processes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold">Typiska affärsprocesser</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {page.processes.map((p, i) => (
                        <div key={i} className="rounded-lg border border-border bg-card p-5">
                          <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                          <p className="text-sm text-muted-foreground">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {page?.challenges && page.challenges.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold">Vanliga utmaningar</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {page.challenges.map((c, i) => (
                        <div key={i} className="rounded-lg border border-border bg-card p-5">
                          <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                          <p className="text-sm text-muted-foreground">{c.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {page?.roles && page.roles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Users className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold">Roller & funktioner</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {page.roles.map((r, i) => (
                        <div key={i} className="rounded-lg border border-border bg-card p-5">
                          <h3 className="font-semibold text-foreground mb-2">{r.role}</h3>
                          <p className="text-sm text-muted-foreground">{r.needs}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {page?.applications && page.applications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Layers className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold">D365-applikationer som passar</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {page.applications.map((a, i) => (
                        <div key={i} className="rounded-lg border border-border bg-card p-5">
                          <Badge variant="outline" className="mb-2">{a.app}</Badge>
                          <p className="text-sm text-muted-foreground">{a.relevance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Höger: sticky partnerpanel */}
              <aside id="partners" className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-primary" />
                        <h2 className="text-base font-bold">
                          {matchingPartners.length} partners inom {industryName}
                        </h2>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Profilerade mot {industryName.toLowerCase()}. Slumpmässig ordning.
                      </p>
                    </div>

                    <div className="px-5 py-4 border-b border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide">
                          <Filter className="w-3.5 h-3.5" />
                          Filtrera per produktområde
                        </div>
                        {selected.length > 0 && (
                          <button
                            onClick={() => setSelected([])}
                            className="text-xs text-primary hover:underline"
                          >
                            Rensa
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {PRODUCT_FILTERS.map((f) => {
                          const active = selected.includes(f.key);
                          return (
                            <button
                              key={f.key}
                              onClick={() =>
                                setSelected((prev) =>
                                  active ? prev.filter((k) => k !== f.key) : [...prev, f.key],
                                )
                              }
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-all text-left ${
                                active
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                  : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/40"
                              }`}
                              title={f.label}
                            >
                              <img src={f.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{f.short}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                      {matchingPartners.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          <p className="mb-3">Inga matchande partners just nu.</p>
                          <Link to="/kontakt" className="text-primary hover:underline">
                            Kontakta oss →
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {matchingPartners.map((p) => (
                            <PartnerCard
                              key={p.id}
                              partner={p as any}
                              profileUrl={`/partner/${(p as any).slug}`}
                              highlightedIndustry={meta?.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {page?.faq && page.faq.length > 0 && (
          <section className="py-12 border-b border-border bg-muted/20">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Vanliga frågor</h2>
              </div>
              <div className="space-y-4">
                {page.faq.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                Nästa steg för {industryName.toLowerCase()}
              </h2>
              <p className="text-sm text-muted-foreground mb-5 max-w-2xl mx-auto">
                Gör en kostnadsfri behovsanalys eller låt oss matcha dig med partners som kan din bransch.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/behovsanalys"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                >
                  Behovsanalys ERP <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/valj-partner"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm font-medium hover:border-primary/50"
                >
                  Hitta partner
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default IndustryPage;
