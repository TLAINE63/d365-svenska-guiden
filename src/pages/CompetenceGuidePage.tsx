import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GuideBreadcrumb from "@/components/guides/GuideBreadcrumb";
import { Button } from "@/components/ui/button";
import NotFound from "./NotFound";
import CompetencePartnerSection from "@/components/kompetens/CompetencePartnerSection";
import CompetenceResultSummary from "@/components/kompetens/CompetenceResultSummary";
import DescribeNeedDialog from "@/components/kompetens/DescribeNeedDialog";
import { CompetenceDisclaimer, SelectionNotice } from "@/components/kompetens/GuideNotices";
import { guideBySlug, guidePath, type DeliveryMode } from "@/data/competenceGuides";
import { nowrapBrand } from "@/lib/nowrapBrand";
import type { CompetenceFilterState } from "@/lib/competenceMatching";
import { trackCompetenceEvent } from "@/utils/trackCompetenceEvent";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold mb-3">{nowrapBrand(title)}</h2>
    {children}
  </section>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground leading-relaxed">
    {items.map((t) => (
      <li key={t}>{nowrapBrand(t)}</li>
    ))}
  </ul>
);

interface Props {
  /** Används vid prerendering där routern saknar parametrar. */
  slug?: string;
}

const CompetenceGuidePage = ({ slug: slugProp }: Props) => {
  const params = useParams();
  const slug = slugProp ?? params.slug ?? "";
  const guide = guideBySlug(slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const [needOpen, setNeedOpen] = useState(false);

  const hasFilterParams =
    !!searchParams.get("produkt") ||
    !!searchParams.get("bransch") ||
    !!searchParams.get("omrade") ||
    !!searchParams.get("leveransform");

  const filters: CompetenceFilterState = useMemo(
    () => ({
      product:
        guide?.type === "product"
          ? guide.productArea
          : searchParams.get("produkt") || undefined,
      industry: searchParams.get("bransch") || undefined,
      region: searchParams.get("omrade") || undefined,
      delivery: (searchParams.get("leveransform") as DeliveryMode) || undefined,
    }),
    [searchParams, guide]
  );

  useEffect(() => {
    if (guide) trackCompetenceEvent("kompetens_guide_view", { guide: guide.slug });
  }, [guide]);

  if (!guide) return <NotFound />;

  const applyFilters = (next: CompetenceFilterState) => {
    const sp = new URLSearchParams();
    if (guide.type !== "product" && next.product) sp.set("produkt", next.product);
    if (next.industry) sp.set("bransch", next.industry);
    if (next.region) sp.set("omrade", next.region);
    if (next.delivery) sp.set("leveransform", next.delivery);
    setSearchParams(sp, { replace: true });
    trackCompetenceEvent("kompetens_search", {
      guide: guide.slug,
      produkt: next.product,
      bransch: next.industry,
      omrade: next.region,
      leveransform: next.delivery,
    });
  };

  const breadcrumbs = [
    { name: "Start", url: "/" },
    { name: "Kompetens", url: "/kompetens/" },
    { name: guide.shortTitle, url: guidePath(guide.slug) },
  ];

  return (
    <>
      <SEOHead
        title={guide.seoTitle}
        description={guide.seoDescription}
        canonicalPath={guidePath(guide.slug)}
        noIndex={guide.status !== "published" || hasFilterParams}
        breadcrumbs={breadcrumbs}
      />
      <Navbar />
      <main className="min-h-screen pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <GuideBreadcrumb items={breadcrumbs} className="mb-5" />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {nowrapBrand(guide.title)}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            {nowrapBrand(guide.intro)}
          </p>

          <Section title="Vad rollen gör">
            <Bullets items={guide.whatTheRoleDoes} />
          </Section>

          <Section title="När rollen vanligtvis behövs">
            <Bullets items={guide.whenNeeded} />
          </Section>

          <Section title="Typiska ansvarsområden och leveranser">
            <Bullets items={guide.responsibilities} />
          </Section>

          <Section title="Vad köparen bör kontrollera">
            <Bullets items={guide.buyerChecklist} />
          </Section>

          <Section title="Vanliga risker och missförstånd">
            <ul className="space-y-3">
              {guide.risks.map((r) => (
                <li key={r.risk} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold">{nowrapBrand(r.risk)}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {nowrapBrand(r.mitigation)}
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          {hasFilterParams && <CompetenceResultSummary guide={guide} filters={filters} />}

          <CompetencePartnerSection
            guide={guide}
            filters={filters}
            onFiltersChange={applyFilters}
            onDescribeNeed={() => {
              setNeedOpen(true);
              trackCompetenceEvent("kompetens_need_form_open", { guide: guide.slug });
            }}
          />

          <section className="my-10 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-2">Beskriv ert behov för d365.se</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
              Berätta vad ni behöver, så går vi igenom det och återkommer om vi ser ett relevant
              nästa steg. Behovet skickas inte vidare till partners automatiskt.
            </p>
            <Button
              onClick={() => {
                setNeedOpen(true);
                trackCompetenceEvent("kompetens_need_form_open", { guide: guide.slug });
              }}
            >
              Beskriv ert behov
            </Button>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectionNotice />
            <CompetenceDisclaimer />
          </div>
        </div>
      </main>
      <Footer />

      <DescribeNeedDialog
        open={needOpen}
        onOpenChange={setNeedOpen}
        roleLabel={guide.title}
        guideSlug={guide.slug}
        filters={filters}
      />
    </>
  );
};

export default CompetenceGuidePage;
