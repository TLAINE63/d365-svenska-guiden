import { useParams, Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, MapPin } from "lucide-react";
import partnerDataJson from "@/data/partnerData.json";
import {
  PRODUCT_PARTNERS_SVERIGE,
  findProductPartnersSverigeConfig,
  type ProductPartnersSverigeConfig,
} from "@/data/productPartnersSverige";

// Sverige-baserad: partner är "i Sverige" om de har minst ett kontor eller en
// region i Sverige, eller har Sverige listad i geography för aktuell produkt.
function isSwedenPartner(p: any, productKey: string): boolean {
  const cities: string[] = p.office_cities || [];
  if (cities.length > 0) return true;
  const pf = p.product_filters?.[productKey];
  const regions: string[] = pf?.swedenRegions || [];
  if (regions.length > 0) return true;
  const geo: string[] = pf?.geography || p.geography || [];
  return geo.includes("Sverige") || geo.includes("Norden");
}

function partnersForConfig(cfg: ProductPartnersSverigeConfig) {
  const featured = (partnerDataJson as any[]).filter((p) => p.is_featured !== false);
  if (cfg.productKey === "ai") {
    return featured
      .filter((p) => {
        const pfs = p.product_filters || {};
        return (["bc", "fsc", "sales", "service"] as const).some((k) => {
          const caps = pfs[k]?.aiCapabilities || [];
          return Array.isArray(caps) && caps.length > 0;
        });
      })
      .filter((p) => isSwedenPartner(p, "bc") || isSwedenPartner(p, "fsc") || isSwedenPartner(p, "sales") || isSwedenPartner(p, "service"))
      .sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }
  return featured
    .filter((p) => !!p.product_filters?.[cfg.productKey])
    .filter((p) => isSwedenPartner(p, cfg.productKey))
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

interface Props {
  configSlug?: string; // Optional override för SSR/test
}

export default function ProductPartnersSverige({ configSlug }: Props) {
  const params = useParams();
  const slug = configSlug || params.slug || "";
  const cfg = findProductPartnersSverigeConfig(slug);
  if (!cfg) return <Navigate to="/alla-d365-partners/" replace />;

  const partners = useMemo(() => partnersForConfig(cfg), [cfg]);
  const canonical = `/${cfg.slug}/`;

  const breadcrumbs = [
    { name: "Hem", url: "https://d365.se" },
    { name: "Partners", url: "https://d365.se/alla-d365-partners" },
    { name: cfg.h1, url: `https://d365.se${canonical}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={cfg.metaTitle}
        description={cfg.metaDescription}
        canonicalPath={canonical}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={cfg.faq.map((f) => ({ question: f.q, answer: resolvePriceTokens(f.a) }))} />
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/alla-d365-partners/" className="hover:text-foreground">Partners</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">{cfg.h1}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {cfg.h1}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {cfg.intro}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Vill du läsa om produkten i sig?{" "}
              <Link to={cfg.productLandingPath} className="text-primary hover:underline font-medium">
                Till {cfg.productLabel}
              </Link>
            </p>
          </div>
        </section>

        {/* Partners – plain HTML list */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              {partners.length} {partners.length === 1 ? "partner" : "partners"} att jämföra
            </h2>
            {partners.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Vi har ännu inte profilerat någon partner med denna inriktning.{" "}
                <Link to="/kontakt/" className="text-primary hover:underline">
                  Kontakta oss
                </Link>{" "}
                så hjälper vi dig att hitta en lämplig kandidat.
              </p>
            ) : (
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partners.map((p: any) => {
                  const cities: string[] = p.office_cities || [];
                  return (
                    <li key={p.id}>
                      <Link
                        to={`/partner/${p.slug}/`}
                        className="group flex flex-col gap-1 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all h-full"
                        aria-label={`${p.name} – ${cfg.productLabel}-partner`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {p.name}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        {cities.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cities.slice(0, 3).join(", ")}
                            {cities.length > 3 ? ` +${cities.length - 3}` : ""}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* FAQ */}
        {cfg.faq.length > 0 && (
          <section className="py-12 sm:py-16 bg-secondary/40 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Vanliga frågor
              </h2>
              <div className="space-y-6">
                {cfg.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related landing pages */}
        <section className="py-12 sm:py-16 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Utforska partners inom andra Dynamics 365-områden
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRODUCT_PARTNERS_SVERIGE.filter((c) => c.slug !== cfg.slug).map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/${c.slug}/`}
                    className="block p-3 rounded-md border border-border hover:border-primary/50 hover:bg-secondary/40 transition-all text-sm text-foreground"
                    aria-label={c.h1}
                  >
                    {c.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-secondary/40 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Vill du ha hjälp att hitta rätt {cfg.productLabel}-partner?
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              Vi vägleder dig köparsidigt och kostnadsfritt – berätta vad du behöver
              så återkopplar vi med 2–3 lämpliga partners att jämföra.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white"
            >
              <Link to="/kontakt/">
                <MessageSquare className="w-4 h-4 mr-2" />
                Kontakta oss för matchning
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
