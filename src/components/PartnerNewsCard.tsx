import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import type { PartnerNewsItem, PartnerNewsProductArea, PartnerNewsSourceType, PartnerNewsType } from "@/hooks/usePartnerNews";

const PRODUCT_LABELS: Record<PartnerNewsProductArea, string> = {
  "business-central": "Business Central",
  "finance-scm": "Finance & Supply Chain",
  "crm-sales": "CRM – Sales & Customer Insights",
  "crm-service": "CRM – Customer Service, Field Service & Contact Center",
  "crm": "CRM / Customer Engagement",
  "power-platform": "Power Platform",
  "microsoft-ai": "Microsoft AI",
  "ovrigt": "Övrigt Dynamics 365",
};

const TYPE_LABELS: Record<PartnerNewsType, string> = {
  kundcase: "Kundcase",
  event: "Event",
  webinar: "Webinar",
  erbjudande: "Erbjudande",
  artikel: "Artikel",
  rapport: "Rapport",
  branschlosning: "Branschlösning",
  produktnyhet: "Produktnyhet",
  partnernyhet: "Partnernyhet",
  analys: "Analys",
};

const SOURCE_LABELS: Record<PartnerNewsSourceType, string> = {
  linkedin: "LinkedIn",
  partner_web: "Partnerwebb",
  blog: "Blogg",
  press: "Pressrum",
  webinar: "Webinar",
  event: "Eventsida",
  other: "Källa",
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export function partnerNewsProductLabel(area: PartnerNewsProductArea) {
  return PRODUCT_LABELS[area];
}
export function partnerNewsTypeLabel(type: PartnerNewsType) {
  return TYPE_LABELS[type];
}
export function partnerNewsSourceLabel(src: PartnerNewsSourceType) {
  return SOURCE_LABELS[src];
}

interface Props {
  item: PartnerNewsItem;
  partnerName?: string;
  partnerSlug?: string;
  partnerLogoUrl?: string | null;
  hidePartnerLink?: boolean;
  layout?: "vertical" | "horizontal";
}

export default function PartnerNewsCard({ item, partnerName, partnerSlug, partnerLogoUrl, hidePartnerLink, layout = "vertical" }: Props) {
  const name = partnerName ?? item.partner?.name ?? "";
  const slug = partnerSlug ?? item.partner?.slug ?? "";
  const logo = partnerLogoUrl ?? item.partner?.logo_url ?? null;

  if (layout === "horizontal") {
    return (
      <Card className="overflow-hidden border-border bg-card hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row">
          {item.image_url ? (
            <div className="sm:w-56 sm:flex-shrink-0 aspect-[16/9] bg-muted overflow-hidden">
              <img
                src={item.image_url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
          <CardContent className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {item.is_featured && (
                <Badge className="bg-[hsl(var(--cta-orange))] text-white gap-1">
                  <Sparkles className="w-3 h-3" /> Utvald
                </Badge>
              )}
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                {TYPE_LABELS[item.news_type]}
              </Badge>
              {(item.product_areas && item.product_areas.length > 0
                ? item.product_areas
                : [item.product_area]
              ).map((area) => (
                <Badge key={area} variant="outline" className="border-slate-300 text-slate-600">
                  {PRODUCT_LABELS[area]}
                </Badge>
              ))}
              {item.industry && (
                <Badge variant="outline" className="border-teal-300 text-teal-700">
                  {item.industry}
                </Badge>
              )}
            </div>

            <h3 className="text-base font-semibold text-foreground leading-snug">
              {item.editorial_title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {item.summary}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
              <span>{formatDate(item.news_date)}</span>
              <span aria-hidden>·</span>
              <span>{SOURCE_LABELS[item.source_type]}</span>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener nofollow"
                className="ml-auto inline-flex items-center gap-1 font-medium text-[hsl(var(--cta-orange))] hover:underline"
              >
                Läs på originalkällan <ExternalLink className="w-3.5 h-3.5" />
            </a>
            </div>
            {!hidePartnerLink && slug && (
              <div className="pt-1">
                <Link
                  to={`/partner/${slug}/`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                >
                  {name ? `Läs mer om ${name}` : "Läs mer om denna partner"} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-border bg-card hover:shadow-lg transition-shadow">
      {item.image_url ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={item.image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.is_featured && (
            <Badge className="bg-[hsl(var(--cta-orange))] text-white gap-1">
              <Sparkles className="w-3 h-3" /> Utvald
            </Badge>
          )}
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
            {TYPE_LABELS[item.news_type]}
          </Badge>
          {(item.product_areas && item.product_areas.length > 0
            ? item.product_areas
            : [item.product_area]
          ).map((area) => (
            <Badge key={area} variant="outline" className="border-slate-300 text-slate-600">
              {PRODUCT_LABELS[area]}
            </Badge>
          ))}
          {item.industry && (
            <Badge variant="outline" className="border-teal-300 text-teal-700">
              {item.industry}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold text-foreground leading-snug">
          {item.editorial_title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {item.summary}
        </p>

        <div className="mt-auto pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
          {logo && slug ? (
            <Link
              to={`/partner/${slug}/`}
              className="flex-shrink-0 rounded hover:opacity-80 transition-opacity"
              title={`Visa ${name}s partnerprofil på d365.se`}
            >
              <img src={logo} alt={`${name} logotyp`} className="h-6 w-6 rounded object-contain bg-white" loading="lazy" />
            </Link>
          ) : logo ? (
            <img src={logo} alt="" className="h-6 w-6 rounded object-contain bg-white" loading="lazy" />
          ) : null}
          <span className="font-medium text-foreground">{name}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(item.news_date)}</span>
          <span aria-hidden>·</span>
          <span>{SOURCE_LABELS[item.source_type]}</span>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-1 font-medium text-[hsl(var(--cta-orange))] hover:underline"
          >
            Läs på originalkällan <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {!hidePartnerLink && slug && (
            <Link
              to={`/partner/${slug}/`}
              className="inline-flex items-center gap-1 font-medium text-teal-700 hover:underline"
            >
              {name ? `Läs mer om ${name}` : "Läs mer om denna partner"} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
