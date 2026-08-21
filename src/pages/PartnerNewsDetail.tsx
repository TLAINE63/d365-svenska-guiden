import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePartnerNewsItem } from "@/hooks/usePartnerNews";
import {
  partnerNewsProductLabel,
  partnerNewsTypeLabel,
  partnerNewsSourceLabel,
} from "@/components/PartnerNewsCard";
import { ArrowLeft, ExternalLink, Calendar, Building2 } from "lucide-react";
import { setNewsAttribution } from "@/utils/newsAttribution";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export default function PartnerNewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, error } = usePartnerNewsItem(id);

  useEffect(() => {
    if (!item?.id) return;
    setNewsAttribution({
      news_id: item.id,
      editorial_title: item.editorial_title ?? null,
      partner_slug: item.partner?.slug ?? null,
      source: "detail_view",
    });
    trackFunnelEvent({
      event_type: "content_view",
      event_name: "partner_news_view",
      metadata: {
        news_id: item.id,
        editorial_title: item.editorial_title ?? null,
        partner_id: item.partner?.id ?? null,
        partner_slug: item.partner?.slug ?? null,
        news_type: item.news_type ?? null,
        product_areas: item.product_areas ?? null,
      },
    });
  }, [item?.id, item?.editorial_title, item?.partner?.id, item?.partner?.slug, item?.news_type, item?.product_areas]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-12">
            <p className="text-center text-muted-foreground">Laddar artikel…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Artikeln hittades inte | Partnernytt | d365.se"
          description="Artikeln kunde inte hittas."
          canonicalPath="/partnernytt/"
        />
        <Navbar />
        <main className="pt-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-3">Artikeln hittades inte</h1>
            <p className="text-muted-foreground mb-6">
              Artikeln du sökte finns inte eller är inte publicerad.
            </p>
            <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
              <Link to="/partnernytt/">Tillbaka till Partnernytt</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const partner = item.partner;
  const productAreas = item.product_areas?.length ? item.product_areas : [item.product_area];

  const cleanSummary = (item.summary || "").replace(/\s+/g, " ").trim();
  const metaDescription = (() => {
    const base = cleanSummary || `Redaktionellt utvalt från ${partner?.name ?? "Dynamics 365-partner"} på d365.se.`;
    if (base.length <= 160) return base;
    const cut = base.slice(0, 157);
    const lastSpace = cut.lastIndexOf(" ");
    return `${lastSpace > 100 ? cut.slice(0, lastSpace) : cut}…`;
  })();

  const titleParts = [item.editorial_title];
  if (partner?.name) titleParts.push(partner.name);
  titleParts.push("Partnernytt");
  const seoTitle = titleParts.join(" | ");

  const productLabels = productAreas.map((a) => partnerNewsProductLabel(a));
  const articleTags = [
    partnerNewsTypeLabel(item.news_type),
    ...productLabels,
    item.industry,
    partner?.name,
  ].filter((v): v is string => Boolean(v));

  const ogImage = item.image_url || undefined;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={metaDescription}
        canonicalPath={`/partnernytt/artikel/${item.id}/`}
        ogType="article"
        ogImage={ogImage}
        ogImageAlt={ogImage ? item.editorial_title : undefined}
        articlePublishedTime={item.news_date ? new Date(item.news_date).toISOString() : undefined}
        articleModifiedTime={item.updated_at ? new Date(item.updated_at).toISOString() : undefined}
        articleAuthor={partner?.name}
        articleSection={productLabels[0]}
        articleTags={articleTags}
      />
      <ArticleSchema
        headline={item.editorial_title}
        description={metaDescription}
        url={`https://d365.se/partnernytt/artikel/${item.id}/`}
        image={ogImage}
        datePublished={item.news_date ? new Date(item.news_date).toISOString() : undefined}
        dateModified={item.updated_at ? new Date(item.updated_at).toISOString() : undefined}
        authorName={partner?.name || "d365.se"}
        authorType={partner?.name ? "Organization" : "Person"}
        section={productLabels[0]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Hem", url: "https://d365.se/" },
          { name: "Partnernytt", url: "https://d365.se/partnernytt/" },
          { name: item.editorial_title, url: `https://d365.se/partnernytt/artikel/${item.id}/` },
        ]}
      />

      <Navbar />

      <main className="pt-24">
        <section className="bg-[hsl(var(--hero-dark))] text-white py-12 border-b border-[hsl(var(--line-dark))]">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <Link
              to="/partnernytt/"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till Partnernytt
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{item.editorial_title}</h1>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                {partnerNewsTypeLabel(item.news_type)}
              </Badge>
              {productAreas.map((area) => (
                <Badge key={area} variant="outline" className="border-slate-300 text-slate-600">
                  {partnerNewsProductLabel(area)}
                </Badge>
              ))}
              {item.industry && (
                <Badge variant="outline" className="border-teal-300 text-teal-700">
                  {item.industry}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-8">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(item.news_date)}
              </span>
              <span aria-hidden>·</span>
              <span>{partnerNewsSourceLabel(item.source_type)}</span>
              {partner?.slug && (
                <>
                  <span aria-hidden>·</span>
                  <Link
                    to={`/partner/${partner.slug}/`}
                    className="inline-flex items-center gap-1.5 text-[hsl(var(--accent))] hover:underline font-medium"
                  >
                    <Building2 className="w-4 h-4" />
                    {partner.name}
                  </Link>
                </>
              )}
            </div>

            {item.image_url && (
              <div className="mb-8 rounded-lg overflow-hidden border border-border bg-muted aspect-[16/9]">
                <img
                  src={item.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-line">
                {item.summary}
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-border">
              <Button
                asChild
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white"
              >
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener nofollow"
                  onClick={() =>
                    trackFunnelEvent({
                      event_type: "cta_click",
                      event_name: "partner_news_source_click",
                      metadata: {
                        news_id: item.id,
                        editorial_title: item.editorial_title,
                        partner_slug: item.partner?.slug ?? null,
                        news_type: item.news_type ?? null,
                        source_url: item.source_url,
                      },
                    })
                  }
                >
                  Läs originalartikeln <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </Button>
            </div>

            {productPageLinks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Fördjupa dig</p>
                <ul className="space-y-1.5">
                  {productPageLinks.map((l) => (
                    <li key={l.path}>
                      <Link to={l.path} className="text-sm text-primary hover:underline font-medium">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
