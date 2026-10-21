import PartnerSelectionFacts from "@/components/partner/PartnerSelectionFacts";
import EditorialReviewNote from "@/components/partner/EditorialReviewNote";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Lightbulb, Mail, Star } from "lucide-react";
import { Link } from "react-router-dom";

import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import PartnerCardHeader from "@/components/partner/PartnerCardHeader";
import { Button } from "@/components/ui/button";
import type { DatabasePartner, ProductFilterInput } from "@/hooks/usePartners";
import { optimizedLogo } from "@/lib/optimizedLogo";
import { useShortlist } from "@/contexts/ShortlistContext";
import { useInquiry } from "@/contexts/InquiryContext";
import { track } from "@/lib/track";
import { productCustomerExamples } from "@/lib/productCustomerExamples";
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
  showCustomerExamples?: boolean;
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
  showCustomerExamples = false,
}: IndustryVerifiedPartnerCardProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const kortlista = useShortlist();
  const inquiry = useInquiry();
  const productFilter = selectedProductFilter(partner, productKey);
  const customerExamples = showCustomerExamples ? productCustomerExamples(productFilter) : [];
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

  const isSaved = kortlista.isSaved(partner.slug);
  const relevanceText = partnerRelevance || documentedEvidence;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 hover:border-primary/45">
      <header className="border-b border-border">
        <PartnerCardHeader partner={partner} to={profileUrl || `/partner/${partner.slug}/`} className="px-6 py-5">
          {applications.length > 0 && (
            <p className="mt-3 text-sm leading-snug text-muted-foreground">
              {applications.slice(0, 3).map(keepDynamics365Together).join(" · ")}
              {applications.length > 3 ? ` · +${applications.length - 3}` : ""}
            </p>
          )}
          {partner.geography?.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Leverans: {partner.geography.slice(0, 3).join(" · ")}
            </p>
          )}
        </PartnerCardHeader>
      </header>

      <div className="flex-1 space-y-6 px-6 py-6">
        {(relevanceText || proofPoints.length > 0) && (
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                {industry ? `Varför relevant för ${industry}` : "Partnerns inriktning"}
              </h4>
              {relevanceText && <span className="text-xs text-muted-foreground">{sourceLabel}</span>}
            </div>
            {relevanceText && (
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {keepDynamics365Together(relevanceText)}
              </p>
            )}
            {proofPoints.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {proofPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm leading-snug text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <span>{keepDynamics365Together(point)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <PartnerSelectionFacts partner={partner} productKey={productKey} />

        {customerExamples.length > 0 && (
          <section>
            <h4 className="mb-2 text-sm font-semibold text-foreground">Kundexempel för {productLabel}</h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {customerExamples.map(({ name, url }) => (
                <li key={name}>
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{keepDynamics365Together(name)}</a> : <span className="text-foreground">{keepDynamics365Together(name)}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Registrerat av partnern för detta produktområde, inte belägg för en viss bransch. Be om en referens med liknande processer och omfattning som era.</p>
          </section>
        )}

        <section className="rounded-md bg-muted/40 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" aria-hidden />
            <h4 className="text-sm font-semibold text-foreground">d365.se:s bedömning</h4>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {assessment
              ? keepDynamics365Together(assessment)
              : "Öppna profilen för att granska partnerns fullständiga underlag."}
          </p>
          {(checkPoint || sizeLabel) && (
            <p className="mt-3 text-sm leading-snug text-foreground/80">
              <span className="font-semibold text-foreground">Kontrollera särskilt: </span>
              {keepDynamics365Together(checkPoint || sizeLabel || "")}
            </p>
          )}
          {assessment && (
            <EditorialReviewNote slug={partner.slug} className="mt-3 text-xs leading-snug text-muted-foreground" />
          )}
        </section>
      </div>

      <footer className="flex flex-col gap-2 border-t border-border px-6 py-4 sm:flex-row sm:flex-wrap">
        <Button asChild className="font-bold sm:flex-1">
          <Link to={profileUrl || `/partner/${partner.slug}/`}>
            Se partnerprofil
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => { kortlista.toggle({ slug: partner.slug, name: partner.name, url: `/partner/${partner.slug}/`, verified: true }); track(isSaved ? "shortlist_remove" : "shortlist_add", null, partner.slug); }}
          aria-pressed={isSaved}
          className="whitespace-normal"
        >
          <Star className={`h-4 w-4 ${isSaved ? "fill-current text-primary" : ""}`} aria-hidden />
          {isSaved ? "I kortlistan" : "Lägg till i kortlista"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => inquiry.open({ partners: [{ slug: partner.slug, name: partner.name }], type: "partner" })}
          className="whitespace-normal"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Be om kontakt
        </Button>
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