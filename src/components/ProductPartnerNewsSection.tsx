import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublishedPartnerNews, type PartnerNewsProductArea } from "@/hooks/usePartnerNews";
import PartnerNewsCard from "@/components/PartnerNewsCard";
import { pickContextualPartnerNews } from "@/lib/contextualPartnerNews";

interface Props {
  /** Produktområde i Partnernytt som sidans ämne motsvarar. */
  productArea?: PartnerNewsProductArea;
  /** Bransch (sidans namn); matchas mot Partnernytts branschfält. */
  industry?: string;
  /** T.ex. "Relaterat om Dynamics 365 Sales". */
  heading: string;
  className?: string;
}

/**
 * Litet, sekundärt block med högst tre Partnernytt-poster som rör sidans ämne.
 * Visas inte alls utan relevanta träffar. Länkar till befintliga artiklar,
 * Partnernytt är huvudarkivet.
 */
export default function ProductPartnerNewsSection({ productArea, industry, heading, className }: Props) {
  const { data, isLoading } = usePublishedPartnerNews({ productArea, limit: industry ? 80 : 12 });
  if (isLoading || !data) return null;
  const items = pickContextualPartnerNews(data, { industry });
  if (items.length === 0) return null;

  const moreHref = productArea ? `/partnernytt/?produkt=${productArea}` : "/partnernytt/";

  return (
    <section aria-label={heading} data-contextual-partner-news className={`border-t border-border py-10 sm:py-12 ${className ?? ""}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">{heading}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Utvalt från Partnernytt, innehåll från Dynamics&nbsp;365-partners.</p>
          </div>
          <Link to={moreHref} className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline">
            <span>Se fler i Partnernytt</span> <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PartnerNewsCard key={item.id} item={item} clickSource="related" />
          ))}
        </div>
      </div>
    </section>
  );
}
