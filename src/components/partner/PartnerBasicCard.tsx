import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Mail } from "lucide-react";
import {
  BASIC_COPY,
  BasicPartner,
  PRODUCT_LABEL,
  PRODUCT_ORDER,
  ProductKey,
} from "@/hooks/useBasicPartners";
import { getBasicPartnerIndustries } from "@/lib/basicPartnerMatch";
import { BASIC_PROFILE_DISCLAIMER, BASIC_PROFILE_LABEL } from "@/components/BasicPartnerBadge";
import BasicPartnerInquiryDialog from "@/components/BasicPartnerInquiryDialog";
import { Button } from "@/components/ui/button";
import ShortlistButton from "@/components/ShortlistButton";
import { trackPartnerCardEvent } from "@/utils/trackPartnerEvent";


interface PartnerBasicCardProps {
  partner: BasicPartner;
  /**
   * standalone: full-page single card (Basicprofil)
   * list: kompakt, klickbart kort i en lista
   */
  variant?: "list" | "standalone";
  /** Produktområde som redan är känt av kontexten (t.ex. produktsida) – upprepas inte. */
  excludeProductKey?: ProductKey;
}

/** Dokumenterade Dynamics 365-områden utifrån observerad data. */
export function documentedProductKeys(partner: BasicPartner): ProductKey[] {
  return PRODUCT_ORDER.filter(
    (k) =>
      !!partner.observed_products?.[k] ||
      !!partner.observed_industries?.[k]?.length ||
      !!partner.observed_company_sizes?.[k]?.length ||
      !!partner.observed_revenue?.[k]?.length ||
      !!partner.observed_delivery_geo?.[k]?.length,
  );
}

export function PartnerBasicCard({
  partner,
  variant = "list",
  excludeProductKey,
}: PartnerBasicCardProps) {
  const isStandalone = variant === "standalone";
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const locations = (partner.observed_locations || []).slice(0, 4);
  const documented = documentedProductKeys(partner);
  const additional = documented.filter((k) => k !== excludeProductKey);

  // Partnerfakta (grundprofil): värde eller "Uppgift saknas" per fält.
  // Företagsstorlek visas som "Uppgift saknas" tills uppgifterna är
  // partnerbekräftade. Huvudbranscher visas upp till tre observerade rader med
  // en förklarande notis om att observationsdata inte är verifierade.
  const uniq = (arr: string[]) => Array.from(new Set(arr));
  const factGeo = uniq(
    PRODUCT_ORDER.flatMap((k) => partner.observed_delivery_geo?.[k] || []),
  );
  // Samma branschinsikt som används i filtreringen (max 3 per produktområde,
  // deduplicerad) – totalt max 3 rader visas på kortet.
  const factIndustries = getBasicPartnerIndustries(partner, PRODUCT_ORDER).slice(0, 3);
  const factRows: { label: string; value: string | null }[] = [
    {
      label: "Primärt Dynamics 365-område",
      value: documented.length ? documented.map((k) => PRODUCT_LABEL[k]).join(", ") : null,
    },
    {
      label: "Huvudbranscher",
      value: factIndustries.length ? factIndustries.join(", ") : null,
    },
    { label: "Företagsstorlek", value: null },
    {
      label: "Geografi",
      value: factGeo.length ? factGeo.join(", ") : locations.length ? locations.join(", ") : null,
    },
    { label: "Kontaktperson", value: null },
    // Sekundära fält grupperas till en rad för att undvika upprepade "Uppgift saknas" i rad.
    {
      label: "Kundcase, referenser och kompetensnivåer inom Power Platform, Copilot och Copilot Studio",
      value: null,
    },
  ];

  const publicInfo =
    partner.extended_summary?.trim() ||
    (partner.extended_content
      ? partner.extended_content.split(/\n\s*\n/)[0].replace(/\n+/g, " ").trim()
      : "");

  if (!isStandalone) {
    return (
      <article
        className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/40"
        data-basic-partner
      >
        <h3 className="text-base font-semibold text-foreground">
          <Link
            to={`/basic/${partner.slug}/`}
            className="before:absolute before:inset-0 before:content-[''] hover:text-primary focus-visible:text-primary"
          >
            {partner.name}
          </Link>
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
          {BASIC_PROFILE_LABEL}
        </p>

        <div className="mt-3 flex-1">
          {additional.length > 0 ? (
            <>
              <p className="text-[11px] font-medium text-muted-foreground">
                {excludeProductKey ? "Även dokumenterat" : "Dokumenterade områden"}
              </p>
              <ul className="mt-1 space-y-0.5 text-sm text-foreground/80">
                {additional.map((k) => (
                  <li key={k}>{PRODUCT_LABEL[k]}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ingen ytterligare produktinformation dokumenterad.
            </p>
          )}
        </div>

        <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
          Visa grundinformation
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </article>
    );
  }

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
      data-basic-partner
      aria-label={`${partner.name} – grundprofil, ej partnerverifierad`}
    >
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{partner.name}</h1>
        {locations.length > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span>{locations.join(" · ")}</span>
          </p>
        )}
      </header>

      <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {BASIC_PROFILE_LABEL}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {BASIC_PROFILE_DISCLAIMER}
        </p>
      </div>

      <section className="mb-6" aria-label="Partnerfakta">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Partnerfakta</h2>
        <dl className="divide-y divide-border rounded-lg border border-border">
          {factRows.map((row) => {
            const isMissing = row.value == null;
            return (
              <div key={row.label} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className={`text-sm sm:text-right ${isMissing ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                  {row.value ?? BASIC_COPY.missingValue}
                  {isMissing && (
                    <span className="block text-xs text-muted-foreground/80 mt-0.5">
                      {BASIC_COPY.missingValueHint}
                    </span>
                  )}
                  {row.label === "Huvudbranscher" && !isMissing && (
                    <span className="block text-xs text-muted-foreground/80 mt-0.5">
                      {BASIC_COPY.industriesLabel}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
        <p className="mt-2 text-xs leading-snug text-muted-foreground">
          {BASIC_COPY.partnerFactsNote}
        </p>
      </section>

      {publicInfo && (
        <section className="mb-6" aria-label={`Om ${partner.name}`}>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Om {partner.name}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{publicInfo}</p>
        </section>
      )}

      <div className="rounded-lg border border-border bg-background/60 p-4">
        <h2 className="text-sm font-semibold text-foreground">
          Vill du veta om {partner.name} passar ditt projekt?
        </h2>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">
          {BASIC_COPY.buyerGuidanceBody}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            trackPartnerCardEvent("klick_kontakta_vagledning", { slug: partner.slug }, "basic");
            setInquiryOpen(true);
          }}
          className="mt-3 bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90"
        >
          <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          {BASIC_COPY.buyerGuidanceCta}
        </Button>
        <ShortlistButton
          className="mt-3"
          cardType="basic"
          entry={{
            slug: partner.slug,
            name: partner.name,
            url: `/basic/${partner.slug}/`,
            verified: false,
          }}
        />
      </div>


      <BasicPartnerInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        partnerName={partner.name}
        partnerSlug={partner.slug}
        sourcePage={`/basic/${partner.slug}/`}
      />

      <footer className="mt-6 border-t border-border pt-4">
        <h2 className="text-sm font-medium text-foreground">
          Representerar du {partner.name}?
        </h2>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {BASIC_COPY.partnerRepBody}
        </p>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {BASIC_COPY.partnerRepNoForwarding}
        </p>
        <Link
          to="/partnerprogram/"
          onClick={() =>
            trackPartnerCardEvent("klick_komplettera_partnerprofil", { slug: partner.slug }, "basic")
          }
          className="group mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          {BASIC_COPY.cta}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </footer>
    </article>
  );
}

export default PartnerBasicCard;
