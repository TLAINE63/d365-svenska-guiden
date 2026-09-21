import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { BLOG_ARTICLES } from "@/data/blogArticles";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import {
  partnerNewsProductLabel,
  partnerNewsTypeLabel,
} from "@/components/PartnerNewsCard";
import type { PartnerNewsItem, PartnerNewsProductArea } from "@/hooks/usePartnerNews";
import { trackPartnerNewsClick } from "@/utils/trackPartnerNewsClick";
import { formatDateYYYYMMDD } from "@/lib/utils";

const formatDate = formatDateYYYYMMDD;


function HomeNewsCard({ item, index }: { item: PartnerNewsItem; index: number }) {
  const productAreas = item.product_areas?.length
    ? item.product_areas
    : [item.product_area];
  const partner = item.partner;
  const isFirst = index === 0;

  return (
    <Link
      to={`/partnernytt/artikel/${item.id}/`}
      onClick={() =>
        trackPartnerNewsClick({
          newsId: item.id,
          editorialTitle: item.editorial_title,
          partnerId: partner?.id ?? null,
          partnerSlug: partner?.slug ?? null,
          newsType: item.news_type,
          productAreas: productAreas as string[],
          source: "home_hero",
        })
      }
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all cursor-pointer hover:border-[hsl(var(--accent))] hover:bg-secondary/30 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-[hsl(var(--accent))]"
    >
      {item.image_url ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={item.image_url}
            alt={item.title}
            width={640}
            height={360}
            loading={isFirst ? "eager" : "lazy"}
            fetchPriority={isFirst ? "high" : "auto"}
            decoding={isFirst ? "sync" : "async"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[11px] tracking-wide">
            {partnerNewsTypeLabel(item.news_type)}
          </Badge>
          {productAreas.slice(0, 1).map((area) => (
            <Badge
              key={area}
              variant="outline"
              className="text-[11px] border-slate-300 text-slate-600"
            >
              {partnerNewsProductLabel(area as PartnerNewsProductArea)}
            </Badge>
          ))}
          {item.industry && (
            <Badge
              variant="outline"
              className="text-[11px] border-teal-300 text-teal-700"
            >
              {item.industry}
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-[hsl(var(--accent))] transition-colors">
          {item.editorial_title}
        </h3>
        <div className="mt-auto pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {item.source_org === "microsoft" ? (
            <span className="font-medium text-[#0058a3]">Microsoft</span>
          ) : partner?.name ? (
            <span className="font-medium text-foreground">{partner.name}</span>
          ) : null}
          {(item.source_org === "microsoft" || partner?.name) && <span aria-hidden>·</span>}
          <span>{formatDate(item.news_date)}</span>
        </div>
      </div>
    </Link>
  );
}

const getLatestArticles = (count: number) =>
  [...BLOG_ARTICLES]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, count);

export default function HomePartnerNewsSection() {
  const { data, isLoading } = usePublishedPartnerNews({ showOnHome: true, limit: 6 });

  const articles = getLatestArticles(3);

  const hasNews = !isLoading && !!data && data.length > 0;

  if (!hasNews && articles.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        {hasNews && (
          <>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Aktuellt från Dynamics 365-partners
              </h2>
              <p className="mt-3 text-muted-foreground">
                Redaktionellt utvalda nyheter, kundcase och event från publicerade partners, samt produktnyheter från Microsoft.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {data.map((item, index) => (
                <HomeNewsCard key={item.id} item={item} index={index} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
                <Link to="/partnernytt/">Visa allt partnernytt</Link>
              </Button>
            </div>
          </>
        )}

        {articles.length > 0 && (
          <div className={hasNews ? "mt-16 pt-12 border-t border-border" : ""}>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Senaste artiklarna från d365.se
              </h2>
              <p className="mt-3 text-muted-foreground">
                Analyser, guider och råd om affärssystem, AI och partnerval i Dynamics 365.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {articles.map((a, index) => (
                <Link
                  key={a.slug}
                  to={`/artiklar/${a.slug}/`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all cursor-pointer hover:border-[hsl(var(--accent))] hover:bg-secondary/30 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {a.heroImage ? (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                      <img
                        src={a.heroImage}
                        alt={a.title}
                        width={640}
                        height={360}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding={index === 0 ? "sync" : "async"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <Badge variant="secondary" className="w-fit text-[11px] tracking-wide">
                      {a.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-[hsl(var(--accent))] transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {a.summary}
                    </p>
                    <div className="mt-auto pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{a.author.name}</span>
                      <span aria-hidden>·</span>
                      <span>{formatDate(a.publishedAt)}</span>
                      <ArrowRight className="ml-auto w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline">
                <Link to="/kunskapscenter/" className="inline-flex items-center gap-1">
                  Alla artiklar i Kunskapscentret <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
