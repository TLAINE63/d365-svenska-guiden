import PartnerCardHeader from "@/components/partner/PartnerCardHeader";
import ShortlistButton from "@/components/ShortlistButton";
import { shortenIndustry } from "@/lib/partnerCardSummary";

interface Props {
  partner: {
    slug: string;
    name: string;
    logo_url?: string | null;
    logo_dark_bg?: boolean | null;
    is_featured?: boolean | null;
    applications?: string[];
    product_filters?: Record<string, unknown> | null;
  };
  industries: string[];
  /** Vald bransch lyfts först. */
  highlightedIndustry?: string | null;
  productArea?: string | null;
}

const canonicalApp = (value: string) => {
  const v = value.toLocaleLowerCase("sv");
  if (v === "finance" || v === "supply chain management" || v.includes("f&sc")) return "F&SCM";
  if (v.startsWith("customer insights")) return "Customer Insights";
  return value;
};

const FILTER_LABELS: Record<string, string> = { bc: "Business Central", fsc: "F&SCM", sales: "Sales", service: "Customer Service" };

function limited(list: string[], max: number) {
  return { shown: list.slice(0, max), rest: Math.max(0, list.length - max) };
}

/** Kompakt partnerkort: logo, namn, verifierad badge, produkter och branscher. */
export default function CompactVerifiedPartnerCard({ partner, industries, highlightedIndustry, productArea }: Props) {
  const fromFilters = Object.entries(partner.product_filters || {}).filter(([, f]) => Boolean(f)).map(([k]) => FILTER_LABELS[k]).filter(Boolean);
  const apps = Array.from(new Set([...(partner.applications || []), ...fromFilters].map(canonicalApp)));
  const orderedIndustries = highlightedIndustry && industries.includes(highlightedIndustry)
    ? [highlightedIndustry, ...industries.filter((i) => i !== highlightedIndustry)]
    : industries;
  const a = limited(apps, 3);
  const i = limited(orderedIndustries.map(shortenIndustry), 2);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/45">
      <PartnerCardHeader partner={partner} to={`/partner/${partner.slug}/`} compact className="border-b border-border p-4" />
      {(a.shown.length > 0 || i.shown.length > 0) ? <dl className="flex-1 space-y-1.5 px-4 py-3 text-xs leading-snug">
        {a.shown.length > 0 && (
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 font-semibold text-muted-foreground">Produkter</dt>
            <dd className="text-foreground/85">{a.shown.join(" · ")}{a.rest > 0 && <span className="text-muted-foreground"> +{a.rest}</span>}</dd>
          </div>
        )}
        {i.shown.length > 0 && (
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 font-semibold text-muted-foreground">Bransch</dt>
            <dd className="text-foreground/85">{i.shown.join(" · ")}{i.rest > 0 && <span className="text-muted-foreground"> +{i.rest}</span>}</dd>
          </div>
        )}
      </dl> : <div className="flex-1" />}
      <div className="px-4 pb-4 pt-1">
        <ShortlistButton
          entry={{ slug: partner.slug, name: partner.name, url: `/partner/${partner.slug}/`, verified: true }}
          cardType="verifierad"
          productArea={productArea}
        />
      </div>
    </article>
  );
}
