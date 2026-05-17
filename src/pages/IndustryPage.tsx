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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Briefcase, Users, AlertTriangle, Layers, HelpCircle, Filter, Building2 } from "lucide-react";

import BusinessCentralIcon from "@/assets/icons/BusinessCentral.svg";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";

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

// Product filters mapped to product_filters keys in the database.
// Visningen är granulär (Sales / Customer Insights / Customer Service / Field Service / Contact Center)
// men matchningen sker mot de fyra underliggande nycklarna i product_filters.
type UnderlyingKey = "bc" | "fsc" | "sales" | "service";
type FilterKey = "bc" | "fsc" | "sales" | "ci" | "cs" | "fs" | "cc";
const FILTER_TO_UNDERLYING: Record<FilterKey, UnderlyingKey> = {
  bc: "bc",
  fsc: "fsc",
  sales: "sales",
  ci: "sales",
  cs: "service",
  fs: "service",
  cc: "service",
};
const PRODUCT_FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: "bc", label: "Business Central", icon: BusinessCentralIcon },
  { key: "fsc", label: "Finance & Supply Chain", icon: FinanceIcon },
  { key: "sales", label: "Sales", icon: SalesIcon },
  { key: "ci", label: "Customer Insights (Marketing Automation)", icon: MarketingIcon },
  { key: "cs", label: "Customer Service", icon: CustomerServiceIcon },
  { key: "fs", label: "Field Service", icon: FieldServiceIcon },
  { key: "cc", label: "Contact Center", icon: ContactCenterIcon },
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
  const [selected, setSelected] = useState<FilterKey[]>([]);

  const industryName = page?.name || meta?.name || "Bransch";
  const heroImage = slug ? INDUSTRY_IMAGES[slug] : undefined;

  const matchingPartners = useMemo(() => {
    if (!partners || !meta) return [];
    const industryName = meta.name;

    const underlyingSelected = Array.from(
      new Set(selected.map((k) => FILTER_TO_UNDERLYING[k])),
    );
    const filtered = partners.filter((p) => {
      const pf = p.product_filters || {};
      const productsToCheck: UnderlyingKey[] = underlyingSelected.length > 0
        ? underlyingSelected
        : (["bc", "fsc", "sales", "service"] as UnderlyingKey[]);
      return productsToCheck.some((k) => {
        const inds = pf[k]?.industries || [];
        return inds.includes(industryName);
      });
    });

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
        <section className="relative border-b border-border overflow-hidden min-h-[240px] md:min-h-[300px] flex items-center">
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
          <div className="relative container mx-auto px-4 max-w-5xl py-8 md:py-12">
            <nav className="text-xs text-muted-foreground mb-2">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/branscher" className="hover:text-foreground">Branscher</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{industryName}</span>
            </nav>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2 drop-shadow-sm">
              {industryName}
            </h1>
            {page?.intro && (
              <p className="text-xs md:text-sm text-foreground/90 leading-relaxed max-w-3xl whitespace-pre-line">
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

        {/* Innehåll – full bredd */}
        <section className="py-10 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl space-y-10">
            {/* Collapsible sektioner – endast rubriker visas tills man klickar */}
            <Accordion type="multiple" className="space-y-3">
              {page?.processes && page.processes.length > 0 && (
                <AccordionItem value="processes" className="border border-border rounded-lg bg-card px-5">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Typiska affärsprocesser
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
                      {page.processes.map((p, i) => (
                        <div key={i} className="rounded-lg border border-border bg-background p-5">
                          <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                          <p className="text-sm text-muted-foreground">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}


              {page?.challenges && page.challenges.length > 0 && (
                <AccordionItem value="challenges" className="border border-border rounded-lg bg-card px-5">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      Vanliga utmaningar
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
                      {page.challenges.map((c, i) => (
                        <div key={i} className="rounded-lg border border-border bg-background p-5">
                          <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                          <p className="text-sm text-muted-foreground">{c.description}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {page?.roles && page.roles.length > 0 && (
                <AccordionItem value="roles" className="border border-border rounded-lg bg-card px-5">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                      <Users className="w-5 h-5 text-primary" />
                      Roller & funktioner
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
                      {page.roles.map((r, i) => (
                        <div key={i} className="rounded-lg border border-border bg-background p-5">
                          <h3 className="font-semibold text-foreground mb-2">{r.role}</h3>
                          <p className="text-sm text-muted-foreground">{r.needs}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {page?.applications && page.applications.length > 0 && (
                <AccordionItem value="applications" className="border border-border rounded-lg bg-card px-5">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                      <Layers className="w-5 h-5 text-primary" />
                      Dynamics 365-applikationer som passar branschen
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
                      {page.applications.map((a, i) => (
                        <div key={i} className="rounded-lg border border-border bg-background p-5">
                          <Badge variant="outline" className="mb-2">{a.app}</Badge>
                          <p className="text-sm text-muted-foreground">{a.relevance}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {page?.faq && page.faq.length > 0 && (
                <AccordionItem value="faq" className="border border-border rounded-lg bg-card px-5">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="flex items-center gap-2 text-lg md:text-xl font-bold">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      Vanliga frågor
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2 pb-4">
                      {page.faq.map((f, i) => (
                        <div key={i} className="rounded-lg border border-border bg-background p-5">
                          <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{f.a}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </section>

        {/* Partners + produktfilter längst ned */}
        <section id="partners" className="py-12 border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">
                {matchingPartners.length} partners inom {industryName}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Profilerade mot {industryName.toLowerCase()}. Filtrera per produktområde nedan.
            </p>

            <div className="mb-6">
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
              <div className="flex flex-wrap gap-2">
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-all ${
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/40"
                      }`}
                    >
                      <img src={f.icon} alt="" className="w-4 h-4 flex-shrink-0" />
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {matchingPartners.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm rounded-lg border border-dashed border-border bg-background">
                <p className="mb-3">Inga matchande partners just nu.</p>
                <Link to="/kontakt" className="text-primary hover:underline">
                  Kontakta oss →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingPartners.map((p) => {
                  const activeProductKey =
                    selected.length === 1 ? FILTER_TO_UNDERLYING[selected[0]] : null;
                  return (
                    <PartnerCard
                      key={p.id}
                      partner={p as any}
                      profileUrl={`/partner/${(p as any).slug}`}
                      highlightedIndustry={meta?.name}
                      productKey={activeProductKey as any}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

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
