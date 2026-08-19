import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Mail, MapPin, Minus, User, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VerifiedPartnerBadge from "@/components/VerifiedPartnerBadge";
import { PRODUCT_LABEL, useBasicPartners, type BasicPartner, type ProductKey } from "@/hooks/useBasicPartners";
import { documentedProductKeys } from "@/components/partner/PartnerBasicCard";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import partnerData from "@/data/partnerData.json";

/**
 * Benchmark: Basic-profil vs en verklig profilerad referensprofil.
 * Referensprofilen är ett *exempel på informationsdjup* – aldrig en rekommendation.
 */

/** Utbyggbar struktur: fler referenstyper (fullservice, niche, regional …) kan läggas till här. */
export type BenchmarkCategory =
  | "bc_specialist"
  | "fscm_specialist"
  | "ce_specialist"
  | "fullservice"
  | "niche"
  | "regional";

interface CategoryConfig {
  id: BenchmarkCategory;
  label: string;
  /** Produktnycklar i product_filters som kvalificerar en partner som referens. */
  productKeys: string[];
  /** Fast vald referensprofil (slug). Faller tillbaka på poängsättning om den saknas. */
  preferredSlug?: string;
  /** Visas i UI i denna version. */
  visible: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  { id: "bc_specialist", label: "BC-specialist", productKeys: ["bc"], preferredSlug: "nab-solutions", visible: true },
  { id: "fscm_specialist", label: "F&SCM-specialist", productKeys: ["fsc"], preferredSlug: "fellowmind", visible: true },
  { id: "ce_specialist", label: "CRM / CE-specialist", productKeys: ["sales", "service", "crm"], preferredSlug: "b3-consulting-group", visible: true },
  { id: "fullservice", label: "Fullservicepartner", productKeys: ["bc", "fsc", "sales", "service"], visible: false },
  { id: "niche", label: "Nischspecialist", productKeys: [], visible: false },
  { id: "regional", label: "Regional partner", productKeys: [], visible: false },
];

const VISIBLE_CATEGORIES = CATEGORIES.filter((c) => c.visible);


type RawPartner = Record<string, any>;

const VERIFIED: RawPartner[] = (partnerData as RawPartner[]).filter((p) => p.is_featured);

function categoryScore(partner: RawPartner, cfg: CategoryConfig): number {
  const pf = partner.product_filters || {};
  const keys: string[] = Object.keys(pf);
  const hits = cfg.productKeys.filter((k) => pf[k]);
  if (!hits.length) return -1;
  const focus = hits.length / Math.max(keys.length, 1); // renodlad specialisering premieras
  const filter = pf[hits[0]] || {};
  return (
    focus * 20 +
    (partner.best_fit_for?.length || 0) * 2 +
    (partner.ai_tags?.length || 0) * 0.4 +
    (filter.industries?.length || 0) * 1.5 +
    (filter.companySize?.length ? 3 : 0) +
    (filter.geography?.length ? 2 : 0) +
    (partner.not_a_fit?.length ? 3 : 0) +
    (partner.positioning_statement ? 4 : 0) +
    (partner.contact_person ? 3 : 0) +
    (partner.customer_examples?.length ? 3 : 0) +
    (partner.youtube_video_id ? 3 : 0) +
    (partner.ai_summary_full ? 3 : 0)
  );
}

function referenceFor(cfg: CategoryConfig): RawPartner | null {
  if (cfg.preferredSlug) {
    const pinned = VERIFIED.find((p) => p.slug === cfg.preferredSlug);
    if (pinned) return pinned;
  }
  let best: RawPartner | null = null;
  let bestScore = -Infinity;

  for (const p of VERIFIED) {
    if (p.slug === "knowit") continue; // inte som exempel
    const s = categoryScore(p, cfg);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }
  return bestScore > 0 ? best : null;
}

/** Härled sannolik huvudkategori för en partner utifrån observerade produktområden. */
function deriveCategory(basic: BasicPartner | null | undefined): BenchmarkCategory | null {
  if (!basic) return null;
  const keys = documentedProductKeys(basic);
  if (!keys.length) return null;
  if (keys.includes("bc")) return "bc_specialist";
  if (keys.includes("fsc")) return "fscm_specialist";
  if (keys.includes("sales") || keys.includes("service")) return "ce_specialist";
  return null;
}

const benchmarkRows: { label: string; basic: string; profiled: string }[] = [
  { label: "Produktkompetens", basic: "Grundläggande", profiled: "Detaljerad och verifierad" },
  { label: "Branscher", basic: "Grundläggande information", profiled: "Tydlig prioritering och beskrivning" },
  { label: "Kundtyper / företagsstorlek", basic: "Begränsat", profiled: "Tydligt definierat" },
  { label: "Passar bäst för", basic: "–", profiled: "Ja" },
  { label: "Kundcase / referenser", basic: "Begränsat", profiled: "Ja" },
  { label: "Erbjudanden / specialisering", basic: "–", profiled: "Ja" },
  { label: "Expertinnehåll", basic: "–", profiled: "Ja" },
  { label: "Kontaktperson", basic: "–", profiled: "Ja" },
  { label: "Direkt CTA", basic: "–", profiled: "Ja" },
  { label: "Videoprofil / intervju", basic: "–", profiled: "Ja, där det ingår" },
  { label: "Indexerbart expertinnehåll", basic: "Begränsat", profiled: "Ja" },
];

interface Props {
  partnerSlug?: string | null;
  /** Renderar primär CTA (t.ex. inbäddad i sidans kontaktdialog). */
  renderBookCta?: (onClick: () => void) => React.ReactNode;
}

export default function PartnerProgramBenchmark({ partnerSlug, renderBookCta }: Props) {

  const { data: basicPartners } = useBasicPartners();
  const [category, setCategory] = useState<BenchmarkCategory>("bc_specialist");
  const [userPicked, setUserPicked] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewed = useRef(false);

  const ownBasic = useMemo(
    () => (partnerSlug ? basicPartners?.find((p) => p.slug === partnerSlug) ?? null : null),
    [partnerSlug, basicPartners],
  );

  /** Generiskt exempel när ingen partner är angiven: en riktig Basic-profil med mest data. */
  const exampleBasic = useMemo(() => {
    if (!basicPartners?.length) return null;
    return [...basicPartners].sort(
      (a, b) => documentedProductKeys(b).length - documentedProductKeys(a).length,
    )[0];
  }, [basicPartners]);

  const basic = ownBasic ?? exampleBasic;

  // Förvälj kategori utifrån partnerns observerade/verifierade produktområden.
  useEffect(() => {
    if (userPicked) return;
    let derived = deriveCategory(ownBasic);
    if (!derived && partnerSlug) {
      const verified = VERIFIED.find((p) => p.slug === partnerSlug);
      const pf = verified?.product_filters || {};
      if (pf.bc) derived = "bc_specialist";
      else if (pf.fsc) derived = "fscm_specialist";
      else if (pf.sales || pf.service || pf.crm) derived = "ce_specialist";
    }
    if (derived) setCategory(derived);
  }, [ownBasic, userPicked, partnerSlug]);


  const cfg = CATEGORIES.find((c) => c.id === category)!;
  const reference = useMemo(() => referenceFor(cfg), [cfg]);

  const refFilter = useMemo(() => {
    if (!reference) return null;
    const pf = reference.product_filters || {};
    const key = cfg.productKeys.find((k) => pf[k]);
    return key ? pf[key] : null;
  }, [reference, cfg]);

  const trackMeta = useMemo(
    () => ({
      benchmark_category: category,
      ...(partnerSlug ? { partner_slug: partnerSlug } : {}),
      ...(ownBasic?.id ? { partner_id: ownBasic.id } : {}),
      ...(reference?.id ? { reference_partner_id: reference.id } : {}),
    }),
    [category, partnerSlug, ownBasic, reference],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !viewed.current) {
            viewed.current = true;
            trackFunnelEvent({
              event_type: "content_view",
              event_name: "partner_benchmark_view",
              metadata: trackMeta,
            });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // trackMeta avsiktligt utanför deps – eventet ska bara skickas en gång
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCategory = (id: BenchmarkCategory) => {
    setUserPicked(true);
    setCategory(id);
    trackFunnelEvent({
      event_type: "cta_click",
      event_name: "partner_benchmark_category_select",
      metadata: { ...trackMeta, benchmark_category: id },
    });
  };

  const documented = basic ? documentedProductKeys(basic) : [];
  const ownLabel = ownBasic ? `${ownBasic.name}s profil idag` : "Exempel på Basic-profil";

  return (
    <section ref={sectionRef} className="py-14 md:py-20 bg-secondary/20 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Hur står sig er profil när kunden jämför?
        </h2>
        <p className="max-w-3xl text-base text-muted-foreground">
          Alla relevanta Dynamics 365-partners finns redan på d365.se. Med en Basic-profil visas
          grundläggande information. En profilerad partner kan ge köparen ett betydligt rikare
          beslutsunderlag om kompetens, specialisering, kundcase och kontaktvägar.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Välj en partnerprofil som bäst motsvarar er verksamhet och se skillnaden.
        </p>

        {/* Kategorival */}
        <div
          role="tablist"
          aria-label="Referenskategori"
          className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {VISIBLE_CATEGORIES.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectCategory(c.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Visuell jämförelse */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Vänster: Basic */}
          <article className="flex h-full flex-col rounded-2xl border border-dashed border-border bg-muted/30 p-6 opacity-95">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {ownBasic ? "Er profil idag" : "Basic-profil"}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{ownLabel}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Ej verifierad profil – informationen är sammanställd av d365.se från publika källor.
            </p>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Dokumenterade produktområden
                </p>
                <p className="mt-1 text-foreground/80">
                  {documented.length
                    ? documented.map((k: ProductKey) => PRODUCT_LABEL[k]).join(" · ")
                    : "Inga områden dokumenterade"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Branscher
                </p>
                <p className="mt-1 text-muted-foreground">Grundläggande information</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Kundtyper och storlek
                </p>
                <p className="mt-1 text-muted-foreground">Begränsat underlag</p>
              </div>
              {!!basic?.observed_locations?.length && (
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {basic.observed_locations.slice(0, 4).join(" · ")}
                </p>
              )}
              <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                Passar bäst för, kundcase, erbjudanden, kontaktperson och video saknas i en
                Basic-profil.
              </div>
            </div>

            {basic && (
              <Link
                to={`/basic/${basic.slug}/`}
                onClick={() =>
                  trackFunnelEvent({
                    event_type: "cta_click",
                    event_name: "partner_benchmark_own_profile_click",
                    metadata: trackMeta,
                  })
                }
                className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {ownBasic ? "Se er nuvarande profil" : "Se Basic-profilen"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </article>

          {/* Höger: profilerad referens */}
          <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent/30 bg-card shadow-[0_20px_60px_-25px_hsl(var(--accent)/0.45)] ring-1 ring-accent/20">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent via-primary to-accent" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative flex flex-1 flex-col p-6 pt-7">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {reference?.logo_url && (
                  <img
                    src={reference.logo_url}
                    alt={`${reference.name} logotyp`}
                    loading="lazy"
                    className={`h-14 w-14 shrink-0 rounded-lg object-contain p-1.5 shadow-sm ring-1 ring-border ${
                      reference.logo_dark_bg ? "bg-foreground" : "bg-background"
                    }`}
                  />
                )}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                    Exempel på profilerad partner
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    {reference?.name ?? "Referensprofil"}
                  </h3>
                </div>
              </div>
              <VerifiedPartnerBadge size="sm" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Referensprofil som visar hur en komplett partnerprofil kan se ut. Inget omdöme om
              partnerns kvalitet.
            </p>



            {reference && (
              <div className="mt-5 space-y-4 text-sm">
                {reference.positioning_statement && (
                  <p className="text-foreground">{reference.positioning_statement}</p>
                )}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Produktområden
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {Object.keys(reference.product_filters || {}).map((k) => (
                      <Badge key={k} variant="secondary" className="text-[11px]">
                        {PRODUCT_LABEL[k as ProductKey] ?? k.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
                {!!refFilter?.industries?.length && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Branscher
                    </p>
                    <p className="mt-1 text-foreground/80">{refFilter.industries.join(" · ")}</p>
                  </div>
                )}
                {(!!refFilter?.companySize?.length || !!refFilter?.geography?.length) && (
                  <div className="grid grid-cols-2 gap-3">
                    {!!refFilter?.companySize?.length && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Kundstorlek
                        </p>
                        <p className="mt-1 text-foreground/80">
                          {refFilter.companySize.join(", ")} anställda
                        </p>
                      </div>
                    )}
                    {!!refFilter?.geography?.length && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Geografi
                        </p>
                        <p className="mt-1 text-foreground/80">{refFilter.geography.join(", ")}</p>
                      </div>
                    )}
                  </div>
                )}
                {!!reference.best_fit_for?.length && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Passar bäst för
                    </p>
                    <ul className="mt-1 space-y-1">
                      {reference.best_fit_for.slice(0, 3).map((b: string) => (
                        <li key={b} className="flex gap-2 text-foreground/80">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!!reference.not_a_fit?.length && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Mindre lämplig för
                    </p>
                    <p className="mt-1 text-muted-foreground">{reference.not_a_fit[0]}</p>
                  </div>
                )}
                {reference.ai_summary_full && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      d365.se:s analys
                    </p>
                    <p className="mt-1 line-clamp-4 text-foreground/80">
                      {reference.ai_summary_full}
                    </p>
                  </div>
                )}
                {(reference.team_size_sweden || reference.implementations_done) && (
                  <div className="grid grid-cols-2 gap-3">
                    {reference.team_size_sweden && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Team i Sverige
                        </p>
                        <p className="mt-1 text-foreground/80">{reference.team_size_sweden}</p>
                      </div>
                    )}
                    {reference.implementations_done && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Implementationer
                        </p>
                        <p className="mt-1 text-foreground/80">{reference.implementations_done}</p>
                      </div>
                    )}
                  </div>
                )}
                {!!reference.customer_examples?.length && (
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Kundexempel
                    </p>
                    <p className="mt-1 text-foreground/80">
                      {reference.customer_examples
                        .slice(0, 5)
                        .map((c: any) => (typeof c === "string" ? c : c?.name))
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                )}
                {!!reference.office_cities?.length && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    {reference.office_cities.slice(0, 5).join(" · ")}
                  </p>
                )}
                {!!reference.ai_tags?.length && (
                  <div className="flex flex-wrap gap-1.5">
                    {reference.ai_tags.slice(0, 8).map((t: string) => (
                      <Badge key={t} variant="outline" className="text-[11px] font-normal">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {reference.contact_person && (
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" aria-hidden />
                      Kontaktperson: {reference.contact_person}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    Kontaktväg via d365.se
                  </span>
                  {reference.youtube_video_id && (
                    <span className="inline-flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5" aria-hidden />
                      Videoprofil
                    </span>
                  )}
                </div>
              </div>
            )}

            {reference && (
              <Button
                asChild
                className="mt-6 self-start"
                onClick={() =>
                  trackFunnelEvent({
                    event_type: "cta_click",
                    event_name: "partner_benchmark_reference_profile_click",
                    metadata: trackMeta,
                  })
                }
              >
                <Link to={`/partner/${reference.slug}/`}>
                  Se komplett profil
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
            )}
            </div>
          </article>

        </div>

        {/* Benchmark-tabell */}
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Jämförelse av informationsdjup mellan Basic-profil och profilerad partnerprofil
            </caption>
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                  Innehåll i profilen
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                  Basic
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                  Profilerad
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarkRows.map((r) => (
                <tr key={r.label} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">
                    {r.label}
                  </th>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.basic === "–" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Minus className="h-4 w-4" aria-hidden />
                        <span className="sr-only">Ingår inte</span>
                      </span>
                    ) : (
                      r.basic
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    <span className="inline-flex items-start gap-1.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      {r.profiled}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          En profilerad partner kan dessutom bidra med mer unikt och indexerbart innehåll om
          kompetenser, branscher, kundcase, experter och erbjudande. Det ger både köpare, sökmotorer
          och AI-tjänster bättre underlag för att förstå när partnern är relevant. Det är ingen
          garanti om ranking eller AI-citeringar.
        </p>

        {/* CTA efter jämförelsen */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground">
            Hur skulle er kompletta profil kunna se ut?
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Vi tar gärna fram ett första förslag baserat på information som redan finns om er
            verksamhet.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {renderBookCta ? (
              renderBookCta(() =>
                trackFunnelEvent({
                  event_type: "cta_click",
                  event_name: "partner_benchmark_cta_click",
                  metadata: trackMeta,
                }),
              )
            ) : (
              <Button
                size="lg"
                onClick={() =>
                  trackFunnelEvent({
                    event_type: "cta_click",
                    event_name: "partner_benchmark_cta_click",
                    metadata: trackMeta,
                  })
                }
              >
                Boka en 20 min partnergenomgång
              </Button>
            )}

            <Button asChild variant="outline" size="lg">
              <Link to={basic ? `/basic/${basic.slug}/` : "/valjdynamics365partner/"}>
                {ownBasic ? "Se vår nuvarande profil" : "Se en Basic-profil"}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
