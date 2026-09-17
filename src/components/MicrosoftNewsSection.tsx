import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePublishedPartnerNews } from "@/hooks/usePartnerNews";
import { partnerNewsProductLabel, partnerNewsTypeLabel } from "@/components/PartnerNewsCard";
import type { PartnerNewsProductArea } from "@/hooks/usePartnerNews";
import { formatDateYYYYMMDD } from "@/lib/utils";

interface Props {
  limit?: number;
  className?: string;
}

/** Nyheter från Microsoft, hämtade från Microsofts officiella Dynamics 365-bloggar
 *  och publicerade efter redaktionell granskning. */
export default function MicrosoftNewsSection({ limit = 3, className }: Props) {
  const { data, isLoading } = usePublishedPartnerNews({ sourceOrg: "microsoft", limit });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className={className ?? "py-12 border-b border-border bg-muted/30"}>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Nyheter från Microsoft</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Produktnyheter och releaser från Microsofts officiella Dynamics 365-kanaler, utvalda av redaktionen.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/partnernytt/" className="inline-flex items-center gap-1">
              Visa allt <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => {
            const areas = item.product_areas?.length ? item.product_areas : [item.product_area];
            return (
              <Link
                key={item.id}
                to={`/partnernytt/artikel/${item.id}/`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-[hsl(var(--accent))] hover:shadow-xl hover:-translate-y-1"
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
                    <Badge variant="secondary" className="bg-[#0078D4]/10 text-[#0058a3] hover:bg-[#0078D4]/10 text-[11px]">
                      Microsoft
                    </Badge>
                    <Badge variant="secondary" className="text-[11px]">
                      {partnerNewsTypeLabel(item.news_type)}
                    </Badge>
                    {areas.slice(0, 1).map((area) => (
                      <Badge key={area} variant="outline" className="text-[11px] border-slate-300 text-slate-600">
                        {partnerNewsProductLabel(area as PartnerNewsProductArea)}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-[hsl(var(--accent))] transition-colors">
                    {item.editorial_title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.summary}</p>
                  <div className="mt-auto pt-3 border-t border-border text-xs text-muted-foreground">
                    {formatDateYYYYMMDD(item.news_date)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
