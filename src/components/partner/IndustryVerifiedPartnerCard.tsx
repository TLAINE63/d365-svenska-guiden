import PartnerSelectionFacts from "@/components/partner/PartnerSelectionFacts";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Lightbulb, Mail, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";

import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import VerifiedPartnerBadge from "@/components/VerifiedPartnerBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DatabasePartner, ProductFilterInput } from "@/hooks/usePartners";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import {
  getDocumentedEvidence,
  getRelevanceFactors,
  getResultAssessment,
} from "@/lib/partnerResultCard";

interface IndustryVerifiedPartnerCardProps {
  partner: DatabasePartner;
  industry?: string | null;
  productKey?: string | null;
  productLabel?: string | null;
  profileUrl?: string;
  geography?: string | null;
  companySize?: string | null;
  revenue?: string | null;
  compactSelectionFacts?: boolean;
}

function firstUsefulSentence(text?: string | null, maxChars = 230): string | null {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const sentence = clean.match(/^[^.!?]+[.!?]?/)?.[0]?.trim() || clean;
  return sentence.length > maxChars
    ? `${sentence.slice(0, maxChars - 1).trimEnd()}…`
    : sentence;
}

function keepDynamics365Together(text: string): string {
  return text.replace(/Microsoft Dynamics 365/g, "Microsoft\u00a0Dynamics\u00a0365").replace(/Dynamics 365/g, "Dynamics\u00a0365");
}

function selectedProductFilter(
  partner: DatabasePartner,
  productKey?: string | null,
): ProductFilterInput | null {
  if (!productKey) return null;
  return (
    (partner.product_filters as Record<string, ProductFilterInput | undefined>)[productKey] ||
    null
  );
}

function partnerProvidedRelevance(
  partner: DatabasePartner,
  industry?: string | null,
  productKey?: string | null,
): string | null {
  const productFilter = selectedProductFilter(partner, productKey);
  const matchingPitch = industry ? partner.industry_pitches?.find(
    (pitch) =>
      pitch.industry?.toLocaleLowerCase("sv") === industry.toLocaleLowerCase("sv") &&
      (!productKey || !pitch.product || pitch.product === productKey),
  ) : null;

  return firstUsefulSentence(
    matchingPitch?.text || productFilter?.whyChoose || productFilter?.productDescription ||
      partner.positioning_statement || partner.description,
  );
}

const PRODUCT_LABELS: Record<string, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain Management",
  sales: "Sales",
  service: "Customer Service",
  crm: "Sales",
};

function deliveredApplications(partner: DatabasePartner, productLabel?: string | null): string[] {
  const candidates = [
    ...(productLabel ? [productLabel] : []),
    ...Object.entries(partner.product_filters || {})
      .filter(([, filter]) => Boolean(filter))
      .map(([key]) => PRODUCT_LABELS[key])
      .filter(Boolean),
    ...(partner.applications || []),
  ];
  const canonical = (value: string) => {
    const normalized = value.toLocaleLowerCase("sv");
    if (normalized === "finance" || normalized === "supply chain management" || normalized.includes("f&sc")) {
      return "Finance & Supply Chain Management";
    }
    return value;
  };
  return Array.from(new Set(candidates.map(canonical)));
}

export default function IndustryVerifiedPartnerCard({
  partner,
  industry,
  productKey,
  productLabel,
  profileUrl,
  geography,
  companySize,
  revenue,
  compactSelectionFacts,
}: IndustryVerifiedPartnerCardProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const { isSelected, toggle } = usePartnerCompare();
  const compareActive = isSelected(partner.slug);
  const productFilter = selectedProductFilter(partner, productKey);
  const partnerRelevance = partnerProvidedRelevance(partner, industry, productKey);
  const documentedEvidence = getDocumentedEvidence(partner, {
    productKey,
    focusIndustry: industry || null,
  });
  const relevanceFactors = getRelevanceFactors(partner, {
    highlightedIndustry: industry || undefined,
    highlightedProduct: productLabel,
  });
  const partnerDifferentiators =
    partner.key_differentiators_source === "partner"
      ? (partner.key_differentiators || []).filter(Boolean).slice(0, 2)
      : [];
  const applicationNames = new Set(
    (partner.applications || []).map((application) => application.toLocaleLowerCase("sv")),
  );
  const proofPoints = Array.from(
    new Set([
      ...(documentedEvidence ? [documentedEvidence] : []),
      ...partnerDifferentiators,
      ...relevanceFactors.filter(
        (factor) => !applicationNames.has(factor.toLocaleLowerCase("sv")),
      ),
    ]),
  ).slice(0, 3);
  const assessment = getResultAssessment(partner);
  // Hoppa över avgränsningar som bara säger att partnern inte jobbar med en annan
  // Dynamics 365-produkt – det är självklart och förvirrar på kortet.
  const productScopePattern =
    /business central|finance|supply chain|f&scm|\bsales\b|customer service|field service|\bcrm\b|\berp\b|marketing|customer insights|commerce|project operations|human resources|huvudprojekt|huvudbehov/i;
  const checkPoint = firstUsefulSentence(
    (partner.not_a_fit || []).find((item) => item && !productScopePattern.test(item)),
    130,
  );
  const applications = deliveredApplications(partner, productLabel);
  const sourceLabel = partnerRelevance ? "Partnerns uppgifter" : "Belagd relevans";
  const sizeLabel = productFilter?.companySize?.length
    ? `Kundstorlek: ${productFilter.companySize.slice(0, 3).join(" · ")}`
    : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/45">
      <header className="flex items-start gap-4 border-b border-border px-5 py-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-border bg-background p-2">
          {partner.logo_url ? (
            <img
              src={optimizedLogo(partner.logo_url)}
              alt={`${partner.name} logotyp`}
              loading="lazy"
              className="max-h-11 max-w-full object-contain"
            />
          ) : (
            <span className="text-center text-xs font-semibold text-foreground">{partner.name}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-xl font-bold leading-tight text-foreground">{partner.name}</h3>
          <div className="mt-2">
            <VerifiedPartnerBadge size="sm" />
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 divide-y divide-border lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        <div className="space-y-5 p-5 lg:col-span-7">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {industry ? `Varför relevant för ${industry}` : "Partnerns inriktning"}
              </h4>
            </div>

            {(partnerRelevance || documentedEvidence) && (
              <div className="rounded-md border-l-4 border-l-accent bg-muted/45 p-3.5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
                  {sourceLabel}
                </p>
                <p className="text-[13px] font-medium leading-relaxed text-foreground/90">
                  {keepDynamics365Together(partnerRelevance || documentedEvidence || "")}
                </p>
              </div>
            )}
          </section>

          {proofPoints.length > 0 && (
            <section>
              <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Särskilda styrkor
              </h4>
              <ul className="space-y-2">
                {proofPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs leading-snug text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                    <span>{keepDynamics365Together(point)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <PartnerSelectionFacts partner={partner} productKey={productKey} hideLabels={compactSelectionFacts ? ["Implementationskompetens", "Förvaltning/support", "Relevant specialisering"] : undefined} />

          <div className="flex flex-wrap gap-1.5">
            <p className="w-full text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Produkter de levererar
            </p>
            {applications.slice(0, 4).map((application) => (
              <Badge
                key={application}
                variant="outline"
                className="whitespace-normal border-border bg-background px-2 py-0.5 text-[10px] font-semibold leading-snug text-foreground/75"
              >
                {application}
              </Badge>
            ))}
            {applications.length > 4 && (
              <Badge variant="outline" className="border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                +{applications.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <aside className="flex flex-col bg-muted/30 p-5 lg:col-span-5">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" aria-hidden />
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              d365.se:s bedömning
            </h4>
          </div>
          {assessment ? (
            <p className="text-[13px] italic leading-relaxed text-foreground/75">
              {keepDynamics365Together(assessment)}
            </p>
          ) : (
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Öppna profilen för att granska partnerns fullständiga underlag.
            </p>
          )}

          {(checkPoint || sizeLabel) && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Kontrollera särskilt
              </p>
              <p className="text-xs leading-snug text-foreground/75">
                {keepDynamics365Together(checkPoint || sizeLabel || "")}
              </p>
            </div>
          )}

          {assessment && (
            <EditorialReviewNote
              slug={partner.slug}
              className="mt-auto pt-5 text-[10px] leading-snug text-muted-foreground"
            />
          )}
        </aside>
      </div>

      <footer className="bg-[hsl(var(--hero-dark))] px-5 py-4">
        <div className="mb-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[hsl(var(--border-on-dark))]">
            {industry || "Partnerverifierad profil"}
          </p>
          {partner.geography?.length > 0 && (
            <p className="mt-0.5 truncate text-[10px] text-[hsl(var(--muted-dark))]">
              Leverans: {partner.geography.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>
        </div>
        <Button asChild className="mb-2.5 w-full font-bold">
          <Link to={profileUrl || `/partner/${partner.slug}/`}>
            Se partnerprofil
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toggle({ slug: partner.slug, name: partner.name })}
            aria-pressed={compareActive}
            className="min-h-10 whitespace-normal border-[hsl(var(--border-on-dark))] bg-transparent text-[hsl(var(--border-on-dark))] hover:border-primary hover:bg-transparent hover:text-primary"
          >
            <Star className={`h-4 w-4 ${compareActive ? "fill-current text-primary" : ""}`} aria-hidden />
            {compareActive ? "I shortlist" : "Lägg till i shortlist"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setContactOpen(true)}
            className="min-h-10 whitespace-normal border-[hsl(var(--border-on-dark))] bg-transparent text-[hsl(var(--border-on-dark))] hover:border-primary hover:bg-transparent hover:text-primary"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Be om introduktion
          </Button>
        </div>
      </footer>
      <PartnerRequestDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        partnerSlug={partner.slug}
        partnerName={partner.name}
        selectedProduct={productLabel || undefined}
        industry={industry || undefined}
        geography={geography || undefined}
        companySize={companySize || undefined}
        revenue={revenue || undefined}
        mode="contact"
      />
    </article>
  );
}