import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, FileText, ScrollText, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BASIC_PROFILE_DISCLAIMER } from "@/components/BasicPartnerBadge";
import BasicPartnerInquiryDialog from "@/components/BasicPartnerInquiryDialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface PartnerBasicCardProps {
  partner: BasicPartner;
  /**
   * standalone: full-page single card (shows footer, CTA, "kan inte kontaktas" text, outlink)
   * list: shown inline in a filter/marketplace list (compact, tag "Basic", link to standalone view)
   */
  variant?: "list" | "standalone";
}

export function PartnerBasicCard({
  partner,
  variant = "list",
}: PartnerBasicCardProps) {
  const isStandalone = variant === "standalone";
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const locations = (partner.observed_locations || []).slice(0, 4);
  const firstParagraph =
    isStandalone && partner.extended_content
      ? partner.extended_content.split(/\n\s*\n/)[0].replace(/\n+/g, " ").trim()
      : null;

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
          <div className="mb-2">
            <BasicPartnerBadge size={isStandalone ? "md" : "sm"} />
          </div>
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

      <p className="relative mb-4 text-xs leading-snug text-muted-foreground">
        {BASIC_PROFILE_DISCLAIMER}
      </p>



      {partner.extended_summary?.trim() && (
        <section
          className="relative mb-6 rounded border border-border bg-muted/30 p-4"
          aria-label="Sammanfattning"
        >
          <div className="mb-2 flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              Sammanfattning
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {partner.extended_summary.trim()}
          </p>
        </section>
      )}

      {firstParagraph && (
        <section className="relative mb-6 border-l-2 border-accent pl-4" aria-label="Fördjupning">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              Fördjupning
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                  aria-label="Information om källan"
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                <p>{BASIC_COPY.extendedLabel}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{firstParagraph}</p>
        </section>
      )}

      {/* Köparsidig CTA – Basic-profiler hänvisas alltid till d365.se */}
      <div className="relative z-10 mt-auto space-y-2 rounded-lg border border-border bg-background/60 p-3">
        <p className="text-[11px] leading-snug text-muted-foreground">
          {BASIC_COPY.buyerGuidanceBody}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => setInquiryOpen(true)}
          className="w-full bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90"
        >
          <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          {BASIC_COPY.buyerGuidanceCta}
        </Button>
      </div>

      <BasicPartnerInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        partnerName={partner.name}
        partnerSlug={partner.slug}
        sourcePage={isStandalone ? `/basic/${partner.slug}/` : "partnerlista"}
      />

      {/* Footer + partneranmälan */}
      <footer className="relative z-10 mt-4 border-t border-border pt-4">
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
