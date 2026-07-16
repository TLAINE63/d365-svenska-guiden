import { Link } from "react-router-dom";
import { Building2, FileText, Globe2, Info, MapPin, Tag, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BASIC_COPY,
  BasicPartner,
  PRODUCT_LABEL,
  PRODUCT_ORDER,
  ProductKey,
  normalizeObservedIndustries,
} from "@/hooks/useBasicPartners";

interface PartnerBasicCardProps {
  partner: BasicPartner;
  /**
   * standalone: full-page single card (shows footer, CTA, "kan inte kontaktas" text, outlink)
   * list: shown inline in a filter/marketplace list (compact, tag "Basic", link to standalone view)
   */
  variant?: "list" | "standalone";
  /** For list rendering: highlight a specific industry the user filtered on. */
  highlightedIndustry?: string | null;
}

function observedProductKeys(p: BasicPartner): ProductKey[] {
  const src = p.observed_products || {};
  return PRODUCT_ORDER.filter((k) => !!src[k]);
}

const PRODUCT_THEME: Record<ProductKey, string> = {
  bc: "bg-business-central text-business-central-foreground",
  fsc: "bg-finance-supply text-finance-supply-foreground",
  sales: "bg-sales text-sales-foreground",
  service: "bg-customer-service text-customer-service-foreground",
};

function SectionHeader({
  icon: Icon,
  label,
  tooltip,
  tooltipLabel,
}: {
  icon: React.ElementType;
  label: string;
  tooltip?: string;
  tooltipLabel?: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5 border-l-2 border-accent pl-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-accent" aria-hidden />
      {label}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex text-muted-foreground/70 transition-colors hover:text-muted-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  aria-label={tooltipLabel || `Om ${label.toLowerCase()}`}
                >
              <Info className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function PartnerBasicCard({
  partner,
  variant = "list",
  highlightedIndustry,
}: PartnerBasicCardProps) {
  const products = observedProductKeys(partner);
  const industriesByProduct = normalizeObservedIndustries(partner.observed_industries);
  const locations = (partner.observed_locations || []).slice(0, 4);
  const isStandalone = variant === "standalone";
  const extended = (partner.extended_content || "").trim();
  const filteredExtended = isStandalone
    ? extended
        .split(/\n\n+/)
        .filter(
          (para) =>
            !/^Tydliga styrkor:/i.test(para) &&
            !/^Räckvidd och segment:/i.test(para) &&
            !/^Passar bäst:/i.test(para) &&
            !/^Sammanfattning:/i.test(para),
        )
        .join("\n\n")
        .trim()
    : extended;

  return (
    <article
      className={
        isStandalone
          ? "relative overflow-hidden rounded-2xl border border-border border-t-4 border-t-accent bg-card p-6 sm:p-8"
          : "relative flex h-full flex-col rounded-xl border border-dashed border-border bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50"
      }
      data-basic-partner
      aria-label={`${partner.name} – observerad partnerprofil`}
    >
      {/* Header: name replaces logo per spec */}
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={
              isStandalone
                ? "text-2xl sm:text-3xl font-bold text-foreground"
                : "text-lg font-semibold text-foreground truncate"
            }
          >
            {isStandalone ? (
              partner.name
            ) : (
              <Link
                to={`/basic/${partner.slug}/`}
                className="before:absolute before:inset-0 before:z-0 before:content-[''] hover:text-primary focus-visible:text-primary"
              >
                {partner.name}
              </Link>
            )}
          </h3>
          {locations.length > 0 && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{locations.join(" · ")}</span>
            </p>
          )}
        </div>
      </header>


      {/* Observed products */}
      {products.length > 0 && (
        <section className={isStandalone ? "mb-4 rounded bg-secondary/50 p-3" : "mb-3"}>
          <SectionHeader
            icon={Building2}
            label="Observerade produktområden"
            tooltip={BASIC_COPY.productsLabel}
            tooltipLabel="Om observerade produktområden"
          />
          <div className="flex flex-wrap gap-1.5">
            {products.map((k) => (
              <Badge
                key={k}
                variant="secondary"
                className={`text-xs font-medium transition-opacity hover:opacity-90 ${PRODUCT_THEME[k]}`}
              >
                {PRODUCT_LABEL[k]}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Observed industries per product */}
      {products.some((k) => (industriesByProduct[k] || []).length > 0) && (
        <section className={isStandalone ? "mb-4 rounded bg-secondary/50 p-3" : "mb-3"}>
          <SectionHeader
            icon={Tag}
            label="Observerad branschinriktning"
            tooltip={BASIC_COPY.industriesLabel}
            tooltipLabel="Om observerad branschinriktning"
          />
          <ul className="space-y-1.5">
            {products.map((k) => {
              const list = industriesByProduct[k] || [];
              if (!list.length) return null;
              return (
                <li key={k} className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {PRODUCT_LABEL[k]}:
                  </span>{" "}
                  {list.map((ind, i) => (
                    <span key={ind}>
                      <span
                        className={
                          highlightedIndustry === ind
                            ? "font-semibold text-foreground underline decoration-dotted underline-offset-2"
                            : ""
                        }
                      >
                        {ind}
                      </span>
                      {i < list.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Målgrupp & leveransgeografi per produktområde */}
      {(() => {
        const sizes = partner.observed_company_sizes || {};
        const revs = partner.observed_revenue || {};
        const geos = partner.observed_delivery_geo || {};
        const hasAny = products.some(
          (k) =>
            (sizes[k] || []).length > 0 ||
            (revs[k] || []).length > 0 ||
            (geos[k] || []).length > 0,
        );
        if (!hasAny) return null;
        return (
          <section className={isStandalone ? "mb-4 rounded bg-secondary/50 p-3" : "mb-3"}>
            <SectionHeader
              icon={Users}
              label="Observerad målgrupp & leverans"
              tooltip="Sammanställt från publika källor. Ej bekräftat av partnern."
              tooltipLabel="Om observerad målgrupp och leveransgeografi"
            />
            <ul className="space-y-2">
              {products.map((k) => {
                const s = sizes[k] || [];
                const r = revs[k] || [];
                const g = geos[k] || [];
                if (!s.length && !r.length && !g.length) return null;
                return (
                  <li key={k} className="text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">
                      {PRODUCT_LABEL[k]}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                      {s.length > 0 && (
                        <span>
                          <span className="text-[10px] uppercase tracking-wide">
                            Anställda:
                          </span>{" "}
                          {s.join(", ")}
                        </span>
                      )}
                      {r.length > 0 && (
                        <span>
                          <span className="text-[10px] uppercase tracking-wide">
                            Omsättning:
                          </span>{" "}
                          {r.join(", ")}
                        </span>
                      )}
                      {g.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Globe2 className="h-3 w-3" aria-hidden />
                          {g.join(", ")}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })()}

      {/* Extended observed description – standalone only */}
      {isStandalone && extended && (
        <section className="mb-4 rounded bg-secondary/50 p-3">
          <SectionHeader
            icon={FileText}
            label="Fördjupning"
            tooltip={BASIC_COPY.extendedLabel}
            tooltipLabel="Om fördjupningstexten"
          />
          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {extended}
          </div>
        </section>
      )}

      {/* Footer + CTA */}
      <footer className="relative z-10 mt-auto border-t border-border pt-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">
            {BASIC_COPY.partnerRepHeading}
          </h4>
          <p className="text-[11px] leading-snug text-muted-foreground">
            {BASIC_COPY.footer} {BASIC_COPY.partnerRepBody}
          </p>
        </div>

        {isStandalone && (
          <div className="mt-4 rounded border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            {BASIC_COPY.standaloneNoContact}
          </div>
        )}

        <div className="mt-4">
          <Link
            to="/kontakt/?intent=partneranmalan"
            className="group inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 transition-colors hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {BASIC_COPY.cta}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {!isStandalone && (
          <div className="mt-2">
            <Link
              to={`/basic/${partner.slug}/`}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline"
            >
              Visa detaljer
            </Link>
          </div>
        )}
      </footer>
    </article>
  );
}

export default PartnerBasicCard;
