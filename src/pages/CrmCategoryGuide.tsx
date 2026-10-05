import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import ShortAnswer from "@/components/ShortAnswer";
import ContextualCta from "@/components/ContextualCta";
import EditorialSource from "@/components/EditorialSource";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { CRM_CATEGORY_GUIDES, type CrmCategoryGuideKey } from "@/data/crmCategoryGuides";

/** Generisk köparguide (kundservicesystem, fältservicesystem) som leder vidare till Dynamics 365-apparna. */
export default function CrmCategoryGuide({ guide }: { guide: CrmCategoryGuideKey }) {
  const g = CRM_CATEGORY_GUIDES[guide];
  const breadcrumbs = [
    { name: "Hem", url: "https://d365.se" },
    { name: "CRM", url: "https://d365.se/crm/" },
    { name: g.h1, url: `https://d365.se${g.path}` },
  ];
  return (
    <div className="min-h-screen">
      <SEOHead title={g.metaTitle} description={g.metaDescription} canonicalPath={g.path} />
      <BreadcrumbSchema items={breadcrumbs} />
      <Navbar />
      <main>
        <ProductHero
          eyebrow="CRM-guiden"
          title={g.h1}
          subhead={g.subhead}
          primary={{ label: g.primaryCta.label, to: g.primaryCta.to }}
          secondary={{ label: "Jämför CRM-partners", to: "/dynamics-365-crm-partners-sverige/" }}
        />
        <ShortAnswer>{g.shortAnswer}</ShortAnswer>

        <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">{g.problemsHeading}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.problems.map((p) => (
              <div key={p.t} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-foreground">{p.t}</p>
                <p className="mt-1 text-sm text-foreground/80">{nowrapBrand(p.d)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Vilka typer av lösningar finns?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.types.map((p) => (
              <div key={p.t} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-foreground">{p.t}</p>
                <p className="mt-1 text-sm text-foreground/80">{nowrapBrand(p.d)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h2 className="mb-3 text-2xl font-bold text-foreground">Vad avgör valet?</h2>
          <ul className="space-y-2 text-foreground/85">
            {g.decisive.map((d) => (
              <li key={d} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />{nowrapBrand(d)}</li>
            ))}
          </ul>
        </section>

        <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h2 className="mb-2 text-base font-semibold text-foreground">D365.SE:s bedömning</h2>
          <p className="max-w-4xl text-sm leading-relaxed text-foreground/85">{nowrapBrand(g.assessment)}</p>
        </section>

        <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-foreground">{nowrapBrand("När är Dynamics 365 rätt spår?")}</h2>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {g.apps.map((a) => (
              <li key={a.to}>
                <Link to={a.to} className="flex flex-col gap-1 p-4 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-foreground"><strong>{nowrapBrand(a.app)}</strong>: {nowrapBrand(a.when)}</span>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-primary sm:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mb-2 mt-6 font-semibold text-foreground">Jämför med alternativ</h3>
          <ul className="space-y-1.5 text-sm">
            {g.comparisons.map((c) => (
              <li key={c.to}><Link to={c.to} className="text-primary hover:underline">{nowrapBrand(c.label)}</Link></li>
            ))}
          </ul>
        </section>

        <ContextualCta source={`next-step:${guide}`} heading={g.cta.heading} text={g.cta.text} primaryLabel="Få hjälp att hitta rätt partner" product={g.product} links={g.cta.links} />
        <EditorialSource sourceType="Köpguide" />
        <SourcesAndMethod />
      </main>
      <Footer />
    </div>
  );
}
