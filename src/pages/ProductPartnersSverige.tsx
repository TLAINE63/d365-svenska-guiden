import WhyTheseResults from "@/components/WhyTheseResults";
import PartnerSelectionFacts from "@/components/partner/PartnerSelectionFacts";
import { useParams, Link, Navigate } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";
import { ArrowRight, MapPin } from "lucide-react";
import ContextualCta from "@/components/ContextualCta";
import partnerDataJson from "@/data/partnerData.json";
import basicRoutes from "@/data/basicPartnerRoutes.json";
import { getPartnerSelectionFacts } from "@/lib/partnerSelectionFacts";
import { MISSING_TEXT } from "@/components/partner/PartnerSelectionFacts";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { optimizedLogo } from "@/lib/optimizedLogo";
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
  const basicCount = (basicRoutes as any[]).filter((b) => Array.isArray(b?.products) && b.products.includes(cfg.productKey)).length;
  const fill = (t: string) => t.replace(/\{\{bcVerified\}\}/g, String(partners.length)).replace(/\{\{bcBasic\}\}/g, String(basicCount));
  const faqs = cfg.faq.map((f) => ({ q: f.q, a: fill(resolvePriceTokens(f.a)) }));
  const rows = partners.map((p: any) => {
    const facts = getPartnerSelectionFacts(p, cfg.productKey === "ai" ? null : cfg.productKey);
    const get = (l: string) => facts.find((f) => f.label === l)?.value || MISSING_TEXT;
    return { p, cities: (p.office_cities || []).join(", ") || MISSING_TEXT, industries: get("Bransch"), size: get("Typisk kundstorlek") };
  });

  const breadcrumbs = [
    { name: "Hem", url: "https://d365.se" },
    { name: "Partners", url: "https://d365.se/alla-d365-partners" },
    { name: cfg.h1, url: `https://d365.se${canonical}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={cfg.metaTitle.replace("{count}", String(partners.length))}
        titleMaxLength={cfg.metaTitle.includes("{count}") ? 75 : undefined}
        description={cfg.metaDescription}
        canonicalPath={canonical}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <Navbar />

      <main className="pt-10">
        {/* Hero */}
        <section className="py-8 sm:py-12 bg-gradient-to-br from-secondary/60 to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <nav aria-label="Brödsmulor" className="text-xs text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/alla-d365-partners/" className="hover:text-foreground">Partners</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">{cfg.h1}</span>
            </nav>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
              Partnerguiden
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {cfg.h1}
            </h1>
            {cfg.intro.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className={`text-base sm:text-lg text-muted-foreground${i > 0 ? " mt-3" : ""}`}>{nowrapBrand(para)}</p>
            ))}
            <p className="text-sm text-muted-foreground mt-4">
              Vill du läsa om produkten i sig?{" "}
              <Link to={cfg.productLandingPath} className="text-primary hover:underline font-medium">
                Till {cfg.productLabel}
              </Link>
            </p>
          </div>
        </section>

        {rows.length > 0 && (
          <section className="py-8 sm:py-10 border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Jämförelse i korthet</h2>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <caption className="sr-only">{cfg.h1}: orter, branscher, typisk kundstorlek och profiltyp</caption>
                  <thead><tr className="border-b border-border bg-muted"><th scope="col" className="p-2 sm:p-3">Partner</th><th scope="col" className="p-2 sm:p-3">Orter</th><th scope="col" className="p-2 sm:p-3">Branscher</th><th scope="col" className="p-2 sm:p-3">Typisk kundstorlek</th><th scope="col" className="p-2 sm:p-3">Profiltyp</th></tr></thead>
                  <tbody>{rows.map(({ p, cities, industries, size }) => (
                    <tr key={p.id} className="border-b border-border align-top">
                      <th scope="row" className="p-2 sm:p-3 font-semibold">
                        <Link to={`/partner/${p.slug}/`} className="flex items-center gap-3 text-foreground hover:text-primary underline-offset-4 hover:underline">
                          {p.logo_url && (
                            <span className="flex h-9 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-card p-1">
                              <img src={optimizedLogo(p.logo_url, 128)} alt="" loading="lazy" className="max-h-7 max-w-full object-contain" />
                            </span>
                          )}
                          {p.name}
                        </Link>
                      </th>
                      <td className="p-2 sm:p-3 text-muted-foreground">{cities}</td>
                      <td className="p-2 sm:p-3 text-muted-foreground">{nowrapBrand(industries)}</td>
                      <td className="p-2 sm:p-3 text-muted-foreground">{size}</td>
                      <td className="p-2 sm:p-3 text-muted-foreground">Verifierad</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Partners – plain HTML list */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              {partners.length} {partners.length === 1 ? "partner" : "partners"} att jämföra
            </h2>
            <WhyTheseResults order="alphabetical" criteria={[cfg.productLabel]} explanation={cfg.productKey === "ai" ? "Dessa partners har registrerade AI-förmågor och uppgifter om svensk närvaro. Registrerad förmåga är inte ett bevis för varje enskilt AI-användningsfall." : undefined} className="mb-5" />
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
                        className="group flex flex-col gap-1 p-4 rounded-lg border border-border bg-card hover:border-primary/50  transition-all h-full"
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
                        <PartnerSelectionFacts partner={p} productKey={cfg.productKey === "ai" ? null : cfg.productKey} showMissing />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="py-8 sm:py-12 bg-secondary/40 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                Vanliga frågor
              </h2>
              <div className="space-y-6">
                {faqs.map((f, i) => (
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
        <section className="py-8 sm:py-12 border-t border-border">
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

        <ContextualCta
          eyebrow={cfg.productLabel}
          heading={`Vilka ${cfg.productLabel}-partners passar er?`}
          text="Välj bransch och svara på några korta frågor. Därefter får ni en motiverad kortlista att jämföra vidare."
          product={cfg.productKey === "bc" ? "Business Central" : cfg.productKey === "fsc" ? "Finance & Supply Chain Management (F&O)" : cfg.slug.includes("customer-insights") ? "Customer Insights (Marketing)" : cfg.slug.includes("field-service") ? "Field Service" : cfg.slug.includes("contact-center") ? "Contact Center" : cfg.slug.includes("customer-service") ? "Customer Service" : cfg.productKey === "sales" ? "Sales" : undefined}
          source={`product-partners:${cfg.slug}`}
          secondaryLabel="Jämför partners direkt"
          secondaryTo="/jamfor-partners/"
        />
      </main>

      <Footer />
    </div>
  );
}
