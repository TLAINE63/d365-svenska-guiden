import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Calendar, Check, Minus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ContactFormDialog from "@/components/ContactFormDialog";
import { useBasicPartners, PRODUCT_LABEL, type BasicPartner, type ProductKey } from "@/hooks/useBasicPartners";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import partnerData from "@/data/partnerData.json";

/**
 * "Se er profil idag" – kostnadsfri profilkoll. Partnern anger företagsnamn och ser
 * direkt en sammanfattning av nuvarande profil, en informationspoäng, vilka fält som
 * saknas och hur en verifierad profil ser ut. Endast redan publik information visas.
 */

type RawPartner = Record<string, any>;

const VERIFIED: RawPartner[] = (partnerData as RawPartner[]).filter((p) => p.is_featured);

/** Referensprofil som visar hur en komplett verifierad profil ser ut. */
const REFERENCE =
  VERIFIED.find((p) => p.slug === "knowit") ??
  VERIFIED.find((p) => p.youtube_video_id && p.customer_examples?.length) ??
  VERIFIED[0];

const PRODUCT_ORDER: ProductKey[] = ["bc", "fsc", "sales", "service"];

interface CheckRow {
  label: string;
  present: boolean;
  /** Vikt i informationspoängen. */
  weight: number;
  detail?: string;
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9åäö]/g, "");
}

function scoreOf(rows: CheckRow[]) {
  const total = rows.reduce((a, r) => a + r.weight, 0);
  const got = rows.reduce((a, r) => a + (r.present ? r.weight : 0), 0);
  return total === 0 ? 0 : Math.round((got / total) * 100);
}

function scoreLabel(score: number) {
  if (score >= 85) return "Komplett beslutsunderlag";
  if (score >= 55) return "Delvis beslutsunderlag";
  if (score >= 30) return "Begränsat beslutsunderlag";
  return "Mycket begränsat beslutsunderlag";
}

function basicRows(p: BasicPartner): CheckRow[] {
  const products = PRODUCT_ORDER.filter((k) => p.observed_products?.[k]);
  const industries = Array.from(
    new Set(PRODUCT_ORDER.flatMap((k) => p.observed_industries?.[k] || [])),
  );
  const locations = p.observed_locations || [];
  return [
    {
      label: "Företaget finns med i kartläggningen",
      present: true,
      weight: 5,
      detail: "Köpare kan hitta och jämföra er redan idag.",
    },
    {
      label: "Produktområden",
      present: products.length > 0,
      weight: 10,
      detail: products.length
        ? `${products.map((k) => PRODUCT_LABEL[k]).join(", ")} – observerat av d365.se, ej bekräftat av er.`
        : "Inga produktområden kunde säkerställas utifrån publika källor.",
    },
    {
      label: "Branscherfarenhet",
      present: industries.length > 0,
      weight: 10,
      detail: industries.length
        ? `${industries.slice(0, 4).join(", ")} – tolkat från publika källor.`
        : "Ingen branscherfarenhet är dokumenterad.",
    },
    {
      label: "Orter och närvaro",
      present: locations.length > 0,
      weight: 5,
      detail: locations.length ? locations.slice(0, 5).join(", ") : undefined,
    },
    { label: "Verifierad beskrivning av er specialisering", present: false, weight: 12 },
    { label: "Kundcase och referenser", present: false, weight: 12 },
    { label: "Passar bäst för / mindre lämplig för", present: false, weight: 10 },
    { label: "Typiska kunder, projekt och leveransprofil", present: false, weight: 10 },
    { label: "Utökade kompetensområden (Power Platform, Copilot, agenter)", present: false, weight: 8 },
    { label: "Namngiven kontaktperson och kontaktväg", present: false, weight: 10 },
    { label: "Expertinnehåll och videoprofil", present: false, weight: 8 },
  ];
}

function verifiedRows(p: RawPartner): CheckRow[] {
  const pf = p.product_filters || {};
  const products = Object.keys(pf);
  const industries: string[] = Array.isArray(p.industries) ? p.industries : [];
  const dp = p.delivery_profile || {};
  return [
    { label: "Verifierad partnerprofil", present: true, weight: 5 },
    {
      label: "Produktområden",
      present: products.length > 0,
      weight: 10,
      detail: products.length ? `${products.length} produktområden profilerade.` : undefined,
    },
    {
      label: "Branscherfarenhet",
      present: industries.length > 0,
      weight: 10,
      detail: industries.length ? industries.slice(0, 4).join(", ") : undefined,
    },
    { label: "Orter och närvaro", present: Boolean(p.office_cities?.length), weight: 5 },
    { label: "Beskrivning av er specialisering", present: Boolean(p.positioning_statement || p.description), weight: 12 },
    { label: "Kundcase och referenser", present: Boolean(p.customer_examples?.length), weight: 12 },
    {
      label: "Passar bäst för / mindre lämplig för",
      present: Boolean(p.best_fit_for?.length || p.not_a_fit?.length),
      weight: 10,
    },
    {
      label: "Typiska kunder, projekt och leveransprofil",
      present: Object.keys(dp).length > 0,
      weight: 10,
    },
    {
      label: "Utökade kompetensområden (Power Platform, Copilot, agenter)",
      present: Object.keys(p.extended_competencies || {}).length > 0,
      weight: 8,
    },
    { label: "Namngiven kontaktperson", present: Boolean(p.contact_person), weight: 10 },
    { label: "Expertintervju / videoprofil", present: Boolean(p.youtube_video_id), weight: 8 },
  ];
}

function basicSummary(p: BasicPartner) {
  const products = PRODUCT_ORDER.filter((k) => p.observed_products?.[k]).map((k) => PRODUCT_LABEL[k]);
  const industries = Array.from(
    new Set(PRODUCT_ORDER.flatMap((k) => p.observed_industries?.[k] || [])),
  );
  const parts: string[] = [
    `${p.name} presenteras idag med en Basic-profil, sammanställd av d365.se utifrån publika källor.`,
  ];
  parts.push(
    products.length
      ? `Köpare ser att ni arbetar med ${products.join(", ")}.`
      : "Köpare ser inga bekräftade produktområden.",
  );
  if (industries.length) parts.push(`Branscherfarenhet anges som ${industries.slice(0, 4).join(", ")}.`);
  parts.push(
    "Beskrivning, kundcase, kontaktperson och er egen positionering saknas, vilket gör att en köpare har begränsat underlag när ert företag jämförs med profilerade partners.",
  );
  return parts.join(" ");
}

function verifiedSummary(p: RawPartner) {
  return (
    p.ai_summary ||
    p.positioning_statement ||
    `${p.name} har en verifierad partnerprofil på d365.se med granskad information om kompetens, branscher och kundcase.`
  );
}

const PartnerProfileCheck = ({ initialSlug }: { initialSlug?: string | null }) => {
  const { data: basicPartners } = useBasicPartners();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(initialSlug ?? null);

  const options = useMemo(() => {
    const v = VERIFIED.map((p) => ({ slug: p.slug as string, name: p.name as string, verified: true }));
    const b = (basicPartners || []).map((p) => ({ slug: p.slug, name: p.name, verified: false }));
    return [...v, ...b].sort((a, b2) => a.name.localeCompare(b2.name, "sv"));
  }, [basicPartners]);

  const suggestions = useMemo(() => {
    const q = norm(query);
    if (q.length < 2) return [];
    return options.filter((o) => norm(o.name).includes(q)).slice(0, 6);
  }, [query, options]);

  const result = useMemo(() => {
    if (!selected) return null;
    const v = VERIFIED.find((p) => p.slug === selected);
    if (v) {
      const rows = verifiedRows(v);
      return {
        name: v.name as string,
        verified: true,
        url: `/partner/${v.slug}/`,
        rows,
        score: scoreOf(rows),
        summary: verifiedSummary(v),
      };
    }
    const b = (basicPartners || []).find((p) => p.slug === selected);
    if (b) {
      const rows = basicRows(b);
      return {
        name: b.name,
        verified: false,
        url: `/basic/${b.slug}/`,
        rows,
        score: scoreOf(rows),
        summary: b.extended_summary || basicSummary(b),
      };
    }
    return null;
  }, [selected, basicPartners]);

  const pick = (slug: string, name: string) => {
    setSelected(slug);
    setQuery("");
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "partnerprogram_profile_check",
      metadata: { partner: slug, partner_name: name },
    });
  };

  const missing = result?.rows.filter((r) => !r.present) ?? [];
  const present = result?.rows.filter((r) => r.present) ?? [];
  const referenceRows = REFERENCE ? verifiedRows(REFERENCE) : [];
  const referenceScore = scoreOf(referenceRows);

  return (
    <section id="profilkoll" className="py-14 md:py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">
            Kostnadsfri profilkoll
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Se er profil idag – så här ser köpare ert företag
          </h2>
          <p className="text-muted-foreground mb-6">
            Skriv in ert företagsnamn så visar vi direkt en sammanfattning av er nuvarande profil,
            en informationspoäng, vilka fält som saknas och hur en verifierad profil ser ut.
          </p>
        </div>

        <div className="max-w-xl relative">
          <div className="relative">
            <Search
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ange företagsnamn"
              aria-label="Ange företagsnamn"
              className="pl-9 h-12"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-card shadow-lg overflow-hidden">
              {suggestions.map((s) => (
                <li key={s.slug}>
                  <button
                    type="button"
                    onClick={() => pick(s.slug, s.name)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 flex items-center justify-between gap-3"
                  >
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.verified ? "Verifierad profil" : "Basic-profil"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.length >= 2 && suggestions.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Vi hittar inget företag med det namnet i kartläggningen. Hör av er så lägger vi till er.
            </p>
          )}
        </div>

        {result && (
          <div className="mt-8 space-y-5 max-w-5xl">
            {/* Sammanfattning + informationspoäng */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">{result.name}</p>
                  {result.verified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                      <BadgeCheck className="w-4 h-4" aria-hidden="true" />
                      Verifierad partnerprofil
                    </span>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Basic-profil – information från publika källor
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Rensa val"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-6">{result.summary}</p>

              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <div className="flex items-end justify-between gap-4 mb-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Informationspoäng
                    </p>
                    <p className="text-sm text-foreground">{scoreLabel(result.score)}</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground leading-none">
                    {result.score}
                    <span className="text-base font-medium text-muted-foreground">/100</span>
                  </p>
                </div>
                <Progress value={result.score} className="h-2" aria-label="Informationspoäng" />
                {REFERENCE && (
                  <p className="text-xs text-muted-foreground mt-2">
                    En komplett verifierad profil ligger på {referenceScore}/100.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Det här ser köparen idag
                </p>
                <ul className="space-y-2 mb-6">
                  {present.map((r) => (
                    <li key={r.label} className="flex gap-2 text-sm">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <span className="text-foreground font-medium">{r.label}</span>
                        {r.detail && <span className="block text-muted-foreground">{r.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm">
                  <Link to={result.url}>
                    Se profilen som köpare ser den
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-secondary/40 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  {missing.length ? "Det här saknas i beslutsunderlaget" : "Profilen är komplett"}
                </p>
                {missing.length ? (
                  <ul className="space-y-2">
                    {missing.map((r) => (
                      <li key={r.label} className="flex gap-2 text-sm text-muted-foreground">
                        <Minus className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          <span className="text-foreground">{r.label}</span>
                          {r.detail && <span className="block">{r.detail}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    All information som köpare efterfrågar finns på plats. Vi går gärna igenom hur
                    den kan hållas aktuell.
                  </p>
                )}
              </div>
            </div>

            {/* Exempel: verifierad profil */}
            {REFERENCE && (
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Så ser en verifierad profil ut
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {REFERENCE.name} är ett exempel på en komplett verifierad profil. Den innehåller
                  följande information som köpare kan väga in:
                </p>
                <ul className="grid gap-2 md:grid-cols-2 mb-6">
                  {referenceRows
                    .filter((r) => r.present)
                    .map((r) => (
                      <li key={r.label} className="flex gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                        {r.label}
                      </li>
                    ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/partner/${REFERENCE.slug}/`}>
                      Öppna exempelprofilen
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Link>
                  </Button>
                  <ContactFormDialog>
                    <Button
                      size="sm"
                      onClick={() =>
                        trackFunnelEvent({
                          event_type: "cta_click",
                          event_name: "partnerprogram_profile_check_book",
                          metadata: { partner: selected, score: result.score },
                        })
                      }
                    >
                      <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                      Boka en genomgång av er profil
                    </Button>
                  </ContactFormDialog>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnerProfileCheck;
