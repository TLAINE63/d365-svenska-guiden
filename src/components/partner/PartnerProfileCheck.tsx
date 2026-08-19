import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, Minus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBasicPartners, PRODUCT_LABEL, type BasicPartner, type ProductKey } from "@/hooks/useBasicPartners";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import partnerData from "@/data/partnerData.json";

/**
 * "Gratis hälsokontroll" – partnern skriver in sitt företagsnamn och ser direkt
 * hur företaget presenteras för köpare idag, vad som saknas och hur en
 * verifierad profil ser ut. Ren presentation av redan publik information.
 */

type RawPartner = Record<string, any>;

const VERIFIED: RawPartner[] = (partnerData as RawPartner[]).filter((p) => p.is_featured);

const PRODUCT_ORDER: ProductKey[] = ["bc", "fsc", "sales", "service"];

interface CheckRow {
  label: string;
  present: boolean;
  detail?: string;
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9åäö]/g, "");
}

function basicRows(p: BasicPartner): CheckRow[] {
  const products = PRODUCT_ORDER.filter((k) => p.observed_products?.[k]);
  const industries = Array.from(
    new Set(PRODUCT_ORDER.flatMap((k) => p.observed_industries?.[k] || [])),
  );
  return [
    {
      label: "Företaget finns med i kartläggningen",
      present: true,
      detail: "Köpare kan hitta och jämföra er redan idag.",
    },
    {
      label: "Produktområden",
      present: products.length > 0,
      detail: products.length
        ? `${products.map((k) => PRODUCT_LABEL[k]).join(", ")} – observerat av d365.se, ej bekräftat av er.`
        : "Inga produktområden kunde säkerställas utifrån publika källor.",
    },
    {
      label: "Branscherfarenhet",
      present: industries.length > 0,
      detail: industries.length
        ? `${industries.slice(0, 4).join(", ")} – tolkat från publika källor.`
        : "Ingen branscherfarenhet är dokumenterad.",
    },
    { label: "Verifierad beskrivning av er specialisering", present: false },
    { label: "Kundcase och referenser", present: false },
    { label: "Passar bäst för / mindre lämplig för", present: false },
    { label: "Namngiven kontaktperson och kontaktväg", present: false },
    { label: "Expertinnehåll och video", present: false },
  ];
}

function verifiedRows(p: RawPartner): CheckRow[] {
  const pf = p.product_filters || {};
  const products = Object.keys(pf);
  const industries: string[] = Array.isArray(p.industries) ? p.industries : [];
  return [
    { label: "Verifierad partnerprofil", present: true },
    {
      label: "Produktområden",
      present: products.length > 0,
      detail: products.length ? `${products.length} produktområden profilerade.` : undefined,
    },
    {
      label: "Branscherfarenhet",
      present: industries.length > 0,
      detail: industries.length ? industries.slice(0, 4).join(", ") : undefined,
    },
    { label: "Kundcase och referenser", present: Boolean(p.customer_examples?.length) },
    { label: "Passar bäst för", present: Boolean(p.best_fit_for) },
    { label: "Mindre lämplig för", present: Boolean(p.not_a_fit) },
    { label: "Namngiven kontaktperson", present: Boolean(p.contact_person) },
    { label: "Expertintervju / video", present: Boolean(p.youtube_video_id) },
    { label: "Utökade kompetensområden", present: Boolean(p.extended_competencies) },
  ];
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
      return {
        name: v.name as string,
        verified: true,
        url: `/partner/${v.slug}/`,
        rows: verifiedRows(v),
      };
    }
    const b = (basicPartners || []).find((p) => p.slug === selected);
    if (b) {
      return { name: b.name, verified: false, url: `/basic/${b.slug}/`, rows: basicRows(b) };
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

  return (
    <section id="profilkoll" className="py-14 md:py-20 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-3">
            Kostnadsfri profilkoll
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Så här ser köpare ert företag idag
          </h2>
          <p className="text-muted-foreground mb-6">
            Skriv in ert företagsnamn så visar vi direkt vilken information som finns om er på
            d365.se, vad som saknas jämfört med en verifierad profil – och vad det innebär när en
            köpare jämför.
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
          <div className="mt-8 grid gap-5 lg:grid-cols-2 max-w-5xl">
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

              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Det här ser köparen idag
              </p>
              <ul className="space-y-2 mb-6">
                {present.map((r) => (
                  <li key={r.label} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <span className="text-foreground font-medium">{r.label}</span>
                      {r.detail && (
                        <span className="block text-muted-foreground">{r.detail}</span>
                      )}
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
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {missing.length ? "Det här saknas i beslutsunderlaget" : "Profilen är komplett"}
              </p>
              {missing.length ? (
                <ul className="space-y-2 mb-6">
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
                <p className="text-sm text-muted-foreground mb-6">
                  All information som köpare efterfrågar finns på plats. Vi går gärna igenom hur den
                  kan hållas aktuell.
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-4">
                Så här ser motsvarande information ut i en komplett, verifierad profil:
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/partner/knowit/">
                  Jämför med en verifierad profil
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnerProfileCheck;
