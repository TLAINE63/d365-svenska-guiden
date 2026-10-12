import { Partner } from "@/data/partners";
import { DatabasePartner } from "@/hooks/usePartners";
import { BrainCircuit } from "lucide-react";
import { getCardSummaryData } from "@/lib/partnerCardSummary";

type CardPartner = Partner | DatabasePartner;

function isDatabasePartner(p: CardPartner): p is DatabasePartner {
  return "product_filters" in p && "slug" in p;
}

interface PartnerCardSummaryProps {
  partner: CardPartner;
  highlightedIndustry?: string | null;
  /** Vald produktnyckel; prioriterar partnerns egen beskrivning för produkten. */
  highlightedProduct?: string | null;
  productLabel?: string | null;
}

export function PartnerCardSummary({ partner, highlightedIndustry, highlightedProduct, productLabel }: PartnerCardSummaryProps) {
  const productText = highlightedProduct && isDatabasePartner(partner)
    ? (partner.product_filters as any)?.[highlightedProduct]?.productDescription?.trim() || null
    : null;
  const data = getCardSummaryData(partner, highlightedIndustry || null);
  const fallbackText =
    (isDatabasePartner(partner) && partner.positioning_statement?.trim()) ||
    partner.description?.trim() ||
    null;

  return (
    <div className="mb-4">
      <ul className="space-y-1 text-[13px] leading-snug">
        <li className="flex items-start gap-2">
          <span className="shrink-0" aria-hidden="true">📍</span>
          <span className="text-muted-foreground">{data.location}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="shrink-0" aria-hidden="true">🏭</span>
          <span className="text-muted-foreground">{data.industry}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="shrink-0" aria-hidden="true">🎯</span>
          <span className="text-muted-foreground">{data.productFocus}</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="shrink-0" aria-hidden="true">👥</span>
          <span className="text-muted-foreground">{data.size}</span>
        </li>
      </ul>

      {productText ? (
        <div className="mt-3 p-3 rounded-lg bg-muted/50 border-l-2 border-accent">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            Partnerns egen beskrivning{productLabel ? ` för ${productLabel}` : ""}
          </p>
          <p className="text-[13px] text-foreground leading-snug line-clamp-4">{productText}</p>
        </div>
      ) : data.aiSummary ? (
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border-l-2 border-primary">
          <p className="text-[12px] font-semibold text-primary uppercase tracking-wide mb-1 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />
            d365.se:s sammanfattning
          </p>
          <p className="text-[13px] font-medium text-foreground leading-snug">
            {data.aiSummary}
          </p>
        </div>
      ) : fallbackText ? (
        <p className="mt-3 text-[13px] text-muted-foreground leading-snug line-clamp-4">
          {fallbackText}
        </p>
      ) : null}
    </div>
  );
}

export default PartnerCardSummary;
