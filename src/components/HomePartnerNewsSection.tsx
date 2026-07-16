import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import {
  partnerNewsProductLabel,
  partnerNewsTypeLabel,
} from "@/components/PartnerNewsCard";
import type { PartnerNewsItem, PartnerNewsProductArea } from "@/hooks/usePartnerNews";
import { trackPartnerNewsClick } from "@/utils/trackPartnerNewsClick";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function HomeNewsCard({ item }: { item: PartnerNewsItem }) {
  const productAreas = item.product_areas?.length
    ? item.product_areas
    : [item.product_area];
  const partner = item.partner;

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
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.is_featured && (
            <Badge className="bg-[hsl(var(--cta-orange))] text-white gap-1">
              <Sparkles className="w-3 h-3" /> Utvald
            </Badge>
          )}
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
          {partner?.name && (
            <span className="font-medium text-foreground">{partner.name}</span>
          )}
          {partner?.name && <span aria-hidden>·</span>}
          <span>{formatDate(item.news_date)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePartnerNewsSection() {
  const { data, isLoading } = usePublishedPartnerNews({ showOnHome: true, limit: 6 });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Aktuellt från Dynamics 365-partners
          </h2>
          <p className="mt-3 text-muted-foreground">
            Redaktionellt utvalda nyheter, kundcase och event från publicerade partners på d365.se.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {data.map((item) => (
            <HomeNewsCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
            <Link to="/partnernytt/">Visa allt partnernytt</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
