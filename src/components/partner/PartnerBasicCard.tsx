import { Link } from "react-router-dom";
import { Building2, ExternalLink, FileText, Globe2, Info, MapPin, Tag, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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


  return (
    <article
      className={
        isStandalone
          ? "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm"
          : "relative flex h-full flex-col rounded-xl border border-dashed border-border bg-muted/30 p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50"
      }
      data-basic-partner
      aria-label={`${partner.name} – Basic-profil`}
    >
      {/* Header: name replaces logo per spec */}
      <header className="mb-3 flex items-start justify-between gap-3">
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
        <Badge
          variant="outline"
          className="shrink-0 border-muted-foreground/40 bg-background/60 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
        >
          Basic
        </Badge>
      </header>

      {/* Observed products */}
      {products.length > 0 && (
        <section className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Building2 className="h-3 w-3" aria-hidden />
            Observerade produktområden
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex text-muted-foreground/70 hover:text-muted-foreground"
                  aria-label="Om observerade produktområden"
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {BASIC_COPY.productsLabel}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {products.map((k) => (
              <Badge
                key={k}
                variant="secondary"
                className="bg-secondary/70 text-xs font-medium"
              >
                {PRODUCT_LABEL[k]}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Observed industries per product */}
      {products.some((k) => (industriesByProduct[k] || []).length > 0) && (
        <section className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Tag className="h-3 w-3" aria-hidden />
            Observerad branschinriktning
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex text-muted-foreground/70 hover:text-muted-foreground"
                  aria-label="Om observerad branschinriktning"
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {BASIC_COPY.industriesLabel}
              </TooltipContent>
            </Tooltip>
          </div>
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
          <section className="mb-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <Users className="h-3 w-3" aria-hidden />
              Observerad målgrupp & leverans
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex text-muted-foreground/70 hover:text-muted-foreground"
                    aria-label="Om observerad målgrupp och leveransgeografi"
                  >
                    <Info className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  Sammanställt från publika källor. Ej bekräftat av partnern.
                </TooltipContent>
              </Tooltip>
            </div>
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
        <section className="mb-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <FileText className="h-3 w-3" aria-hidden />
            Fördjupning
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex text-muted-foreground/70 hover:text-muted-foreground"
                  aria-label="Om fördjupningstexten"
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {BASIC_COPY.extendedLabel}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {extended}
          </div>
        </section>
      )}

      {/* Footer + CTA */}
      <footer className="relative z-10 mt-auto pt-3">

        <p className="text-[11px] leading-snug text-muted-foreground">
          {BASIC_COPY.footer}
        </p>

        {isStandalone && (
          <>
            <div className="mt-4 rounded-md border border-border bg-background/50 p-3 text-sm text-muted-foreground">
              {BASIC_COPY.standaloneNoContact}
            </div>
            {partner.website && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Besök partnerns webbplats
                </a>
              </Button>
            )}
          </>
        )}

        <div className="mt-3">
          <Link
            to="/kontakt/?intent=partneranmalan"
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            {BASIC_COPY.cta} →
          </Link>
        </div>

        {!isStandalone && (
          <div className="mt-2">
            <Link
              to={`/basic/${partner.slug}/`}
              className="text-xs text-muted-foreground hover:text-foreground"
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
