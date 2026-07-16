import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import {
  partnerNewsProductLabel,
  partnerNewsTypeLabel,
} from "@/components/PartnerNewsCard";
import { ArrowRight } from "lucide-react";
import type { PartnerNewsItem, PartnerNewsProductArea } from "@/hooks/usePartnerNews";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

function HomeNewsRow({ item }: { item: PartnerNewsItem }) {
  const productAreas = item.product_areas?.length
    ? item.product_areas
    : [item.product_area];
  const partner = item.partner;

  return (
    <Link
      to={`/partnernytt/artikel/${item.id}/`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-[hsl(var(--accent))]/40 hover:bg-secondary/30"
    >
      <div className="flex flex-col sm:flex-row">
        {item.image_url ? (
          <div className="sm:w-48 sm:flex-shrink-0 aspect-[16/9] sm:aspect-auto bg-muted overflow-hidden">
            <img
              src={item.image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : null}
        <div className="flex flex-1 items-start justify-between gap-3 p-4 sm:p-5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
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
            <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug group-hover:text-[hsl(var(--accent))] transition-colors">
              {item.editorial_title}
            </h3>
            {partner?.name && (
              <p className="mt-1 text-xs text-muted-foreground">{partner.name}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground min-w-[5.5rem] text-right shrink-0">
            <span>{formatDate(item.news_date)}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--accent))] transition-colors" />
          </div>
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
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Aktuellt från Dynamics 365-partners
          </h2>
          <p className="mt-3 text-muted-foreground">
            Redaktionellt utvalda nyheter, kundcase och event från publicerade partners på d365.se.
          </p>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {data.map((item) => (
            <HomeNewsRow key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white">
            <Link to="/partnernytt/">Visa allt partnernytt</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
