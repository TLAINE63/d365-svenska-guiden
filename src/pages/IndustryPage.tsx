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
import { ArrowRight, Briefcase, Users, AlertTriangle, Layers, HelpCircle } from "lucide-react";

const APP_TO_KEY: Record<string, string> = {
  "Business Central": "bc",
  "Finance & Supply Chain": "fsc",
  "Sales": "sales",
  "Customer Service": "service",
  "Field Service": "field_service",
  "Contact Center": "contact_center",
  "Customer Insights": "customer_insights",
};

const PRODUCT_FILTERS: { key: string; label: string }[] = [
  { key: "bc", label: "Business Central" },
  { key: "fsc", label: "Finance & Supply Chain" },
  { key: "sales", label: "Sales" },
  { key: "service", label: "Customer Service" },
  { key: "field_service", label: "Field Service" },
  { key: "contact_center", label: "Contact Center" },
  { key: "customer_insights", label: "Customer Insights" },
];

const IndustryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? findIndustryBySlug(slug) : undefined;
  const { page, loading } = useIndustryPage(slug);
  const { data: partners } = usePartners();
  const [selected, setSelected] = useState<string[]>([]);

  const industryName = page?.name || meta?.name || "Bransch";

  const matchingPartners = useMemo(() => {
    if (!partners || !meta) return [];
    return partners.filter((p) => {
      const inds = [...(p.industries || []), ...(p.secondary_industries || [])];
      const matches = inds.includes(meta.name);
      if (!matches) return false;
      if (selected.length === 0) return true;
      return selected.some((k) => (p.applications || []).includes(k));
    });
  }, [partners, meta, selected]);

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
        {/* Hero */}
        <section className="relative py-10 md:py-14 bg-gradient-to-b from-muted/40 to-background border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <nav className="text-xs text-muted-foreground mb-3">
              <Link to="/" className="hover:text-foreground">Hem</Link>
              <span className="mx-2">/</span>
              <Link to="/branscher" className="hover:text-foreground">Branscher</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{industryName}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              {industryName}
            </h1>
            {page?.intro && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
                {page.intro}
              </p>
            )}
          </div>
        </section>

        {/* Affärsprocesser */}
        {page?.processes && page.processes.length > 0 && (
          <section className="py-12 border-b border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-2 mb-6">
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
          </section>
        )}

        {/* Utmaningar */}
        {page?.challenges && page.challenges.length > 0 && (
          <section className="py-12 border-b border-border bg-muted/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-2 mb-6">
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
          </section>
        )}

        {/* Roller */}
        {page?.roles && page.roles.length > 0 && (
          <section className="py-12 border-b border-border">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-2 mb-6">
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
          </section>
        )}

        {/* Applikationer */}
        {page?.applications && page.applications.length > 0 && (
          <section className="py-12 border-b border-border bg-muted/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-2 mb-6">
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
          </section>
        )}

        {/* Partners */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold mb-2">Partners inom {industryName}</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Filtrera på produktområde för att hitta rätt kompetens.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
              {selected.length > 0 && (
                <button
                  onClick={() => setSelected([])}
                  className="text-xs text-primary hover:underline ml-2"
                >
                  Rensa
                </button>
              )}
            </div>

            {matchingPartners.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">
                  Vi har inte hittat matchande partners just nu. Hör av dig så hjälper vi dig vidare.
                </p>
                <Link to="/kontakt" className="text-primary hover:underline">
                  Kontakta oss →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchingPartners.map((p) => (
                  <PartnerCard key={p.id} partner={p as any} />
                ))}
              </div>
            )}
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
