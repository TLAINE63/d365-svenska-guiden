import { Check, Minus, Info } from "lucide-react";
import { DatabasePartner } from "@/hooks/usePartners";
import {
  SUPPORT_FIELDS,
  SUPPORT_LEVEL_META,
  SUPPORT_DISCLAIMER,
  type DeliveryProfileValue,
  type SupportLevel,
} from "@/data/deliveryProfileFields";
import { COMPETENCY_AREAS, LEVEL_META } from "@/lib/extendedCompetencies";
import { SOURCE_LABEL_PARTNER, SOURCE_LABEL_D365 } from "@/data/profileModel";

/**
 * Beslutsstöd högst upp på partnerprofilen: snabböversikt, särskiljande fakta,
 * typiska kunder/projekt, support & förvaltning samt d365.se:s rekommendation.
 *
 * All information härleds ur befintliga profilfält så att blocken blir
 * jämförbara mellan partners. Inga värderande formuleringar läggs till.
 */

const SIZE_ORDER = ["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"];
const GEO_ORDER = ["Sverige", "Norden", "Europa", "Globalt", "Övriga världen", "Internationellt"];

const PRODUCT_KEY_LABEL: Record<string, string> = {
  bc: "Dynamics 365 Business Central",
  fsc: "Dynamics 365 Finance & Supply Chain Management",
  sales: "Dynamics 365 Sales",
  service: "Dynamics 365 Customer Service",
  crm: "Dynamics 365 CRM",
};

const ERP_KEYS = ["bc", "fsc"];
const CRM_KEYS = ["sales", "service", "crm"];

const PROJECT_TYPE_KEYWORDS = [
  "implementation",
  "nyimplementation",
  "modernisering",
  "integration",
  "förvaltning",
  "vidareutveckling",
  "uppgradering",
  "migrering",
  "rollout",
  "support",
];

type ProductFilterLike = {
  industries?: string[];
  companySize?: string[];
  revenue?: string[];
  geography?: string[];
  deliveryProfile?: DeliveryProfileValue | null;
};

function uniq(values: (string | null | undefined)[]): string[] {
  return Array.from(new Set(values.map((v) => (v || "").trim()).filter(Boolean)));
}

function parseSizeBound(value: string): { min: number; max: number | null } | null {
  if (value === ">5.000") return { min: 5000, max: null };
  const [minStr, maxStr] = value.split("-");
  if (!minStr || !maxStr) return null;
  const min = parseInt(minStr.replace(/\./g, ""), 10);
  const max = parseInt(maxStr.replace(/\./g, ""), 10);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min, max };
}

function formatSizeRange(sizes: string[]): string | null {
  const ordered = sizes
    .filter((s) => SIZE_ORDER.includes(s))
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  if (ordered.length === 0) return null;
  const first = parseSizeBound(ordered[0]);
  const last = parseSizeBound(ordered[ordered.length - 1]);
  if (!first || !last) return null;
  if (last.max === null) return `${first.min.toLocaleString("sv-SE")}+ anställda`;
  return `${first.min.toLocaleString("sv-SE")}–${last.max.toLocaleString("sv-SE")} anställda`;
}

function sizeSegmentLabel(sizes: string[]): string | null {
  const ordered = sizes
    .filter((s) => SIZE_ORDER.includes(s))
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  if (ordered.length === 0) return null;
  const first = parseSizeBound(ordered[0]);
  const last = parseSizeBound(ordered[ordered.length - 1]);
  if (!first || !last) return null;
  if (last.max === null && first.min >= 1000) return "Stora och internationella företag";
  if (last.max === null) return "Företag i alla storlekar";
  if (last.max <= 49) return "Små företag";
  if (last.max <= 249) return "Små och medelstora företag";
  if (first.min >= 1000) return "Stora företag";
  if (first.min >= 250) return "Medelstora och större företag";
  return "Små och medelstora företag";
}

function formatGeography(geography: string[]): string | null {
  const sorted = [...new Set(geography)].sort((a, b) => {
    const ia = GEO_ORDER.indexOf(a);
    const ib = GEO_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "sv");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  if (sorted.length === 0) return null;
  if (sorted.length === 1) return sorted[0];
  return `${sorted.slice(0, -1).join(", ")} och ${sorted[sorted.length - 1]}`;
}

function activeFilters(partner: DatabasePartner): Array<[string, ProductFilterLike]> {
  const pf = (partner.product_filters || {}) as Record<string, ProductFilterLike | undefined>;
  return Object.entries(pf).filter(
    ([, v]) => !!v && Object.keys(v).length > 0,
  ) as Array<[string, ProductFilterLike]>;
}

function firstSentences(text?: string | null, maxSentences = 2): string | null {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!sentences) return clean;
  return sentences.slice(0, maxSentences).join("").trim();
}

function projectTypes(partner: DatabasePartner): string[] {
  const tags = ((partner as { ai_tags?: string[] }).ai_tags || []).filter(Boolean);
  return uniq(
    tags.filter((t) => PROJECT_TYPE_KEYWORDS.some((k) => t.toLowerCase().includes(k))),
  ).slice(0, 4);
}

/** Konkreta, faktabaserade punkter som går att jämföra mellan partners. */
function buildDifferentiators(partner: DatabasePartner): string[] {
  const out: string[] = [];
  const filters = activeFilters(partner);
  const keys = filters.map(([k]) => k);

  const erp = keys.filter((k) => ERP_KEYS.includes(k));
  const crm = keys.filter((k) => CRM_KEYS.includes(k));

  const implPerApp = partner.implementations_per_app || {};
  const teamPerApp = partner.team_size_per_app || {};

  // Produktfokus + dokumenterade implementationer
  for (const key of erp.concat(crm).slice(0, 2)) {
    const label = PRODUCT_KEY_LABEL[key];
    if (!label) continue;
    const impl = (implPerApp as Record<string, string>)[key];
    if (impl) {
      out.push(`${label}: ${impl} genomförda implementationer i Sverige enligt partnern`);
    } else {
      out.push(`Levererar ${label}`);
    }
  }

  if (erp.length > 0 && crm.length > 0) {
    out.push("Levererar både ERP och CRM inom samma organisation");
  }

  // Lokalt team
  const teamValues = uniq(Object.values(teamPerApp as Record<string, string>));
  if (teamValues.length > 0) {
    out.push(`Lokalt konsultteam i Sverige: ${teamValues.join(" / ")} konsulter per produktområde`);
  } else if (partner.team_size_sweden) {
    out.push(`Lokalt konsultteam i Sverige: ${partner.team_size_sweden}`);
  }

  // Kontor
  const cities = uniq(partner.office_cities || []);
  if (cities.length > 0) {
    out.push(
      cities.length > 3
        ? `Kontor på ${cities.length} orter i Sverige, bland annat ${cities.slice(0, 3).join(", ")}`
        : `Kontor i ${cities.join(", ")}`,
    );
  }

  // Verifierade kompetensområden
  const comps = partner.extended_competencies || {};
  const strong = COMPETENCY_AREAS.filter((a) => {
    const level = comps[a.key];
    return level && LEVEL_META[level] && LEVEL_META[level].rank >= 3;
  });
  if (strong.length > 0) {
    out.push(
      `d365.se har verifierat dokumenterad leverans inom ${strong.map((s) => s.label).join(", ")}`,
    );
  }

  // Förvaltningsnivå
  const level = supportLevel(partner);
  if (level && level !== "project_focus") {
    out.push(SUPPORT_LEVEL_META[level].description);
  }

  // Branschtyngdpunkt
  const industries = uniq(filters.flatMap(([, f]) => f.industries || []));
  if (industries.length > 0) {
    out.push(`Branschtyngdpunkt inom ${industries.slice(0, 3).join(", ")}`);
  }

  return uniq(out).slice(0, 5);
}

function supportLevel(partner: DatabasePartner): SupportLevel | null {
  const levels = activeFilters(partner)
    .map(([, f]) => f.deliveryProfile?.supportLevel)
    .filter(Boolean) as SupportLevel[];
  const order: SupportLevel[] = ["project_focus", "managed_offering", "lifecycle_partner"];
  if (levels.length === 0) return null;
  return levels.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0];
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function OverviewItem({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="min-w-0">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <CheckList items={items} />
    </div>
  );
}

const PartnerDecisionOverview = ({ partner }: { partner: DatabasePartner }) => {
  const filters = activeFilters(partner);
  const keys = filters.map(([k]) => k);

  const sizes = uniq(filters.flatMap(([, f]) => f.companySize || []));
  const revenue = uniq(filters.flatMap(([, f]) => f.revenue || []));
  const geography = uniq([
    ...(partner.geography || []),
    ...filters.flatMap(([, f]) => f.geography || []),
  ]);
  const industries = uniq([
    ...filters.flatMap(([, f]) => f.industries || []),
    ...(partner.industries || []),
  ]);

  const products = uniq(keys.map((k) => PRODUCT_KEY_LABEL[k]));
  const projects = projectTypes(partner);
  const notFit = uniq(partner.not_a_fit || []);
  const bestFit = uniq(partner.best_fit_for || []);
  const differentiators = buildDifferentiators(partner);

  const sizeLabel = sizeSegmentLabel(sizes);
  const sizeRange = formatSizeRange(sizes);
  const geoLabel = formatGeography(geography);

  const level = supportLevel(partner);
  const supportTexts = filters
    .map(([key, f]) => ({ key, profile: f.deliveryProfile }))
    .filter((x) => !!x.profile)
    .flatMap(({ key, profile }) =>
      SUPPORT_FIELDS.map((field) => ({
        product: PRODUCT_KEY_LABEL[key] || key,
        label: field.label,
        text: firstSentences(profile?.[field.key], 2),
      })),
    )
    .filter((x) => !!x.text)
    .slice(0, 4);

  const typicalCustomers = firstSentences(
    filters.map(([, f]) => f.deliveryProfile?.typicalCustomers).find(Boolean),
    2,
  );
  const typicalProjects = firstSentences(
    filters.map(([, f]) => f.deliveryProfile?.typicalProjects).find(Boolean),
    2,
  );

  const hasOverview =
    !!sizeLabel || products.length > 0 || industries.length > 0 || !!geoLabel || projects.length > 0;
  const hasTypical = !!sizeRange || revenue.length > 0 || !!typicalCustomers || !!typicalProjects || projects.length > 0;
  const hasSupport = !!level || supportTexts.length > 0;
  const hasRecommendation = bestFit.length > 0 || notFit.length > 0;

  if (!hasOverview && !hasTypical && !hasSupport && !hasRecommendation) return null;

  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-5">
          {/* PRIORITET 1 – Snabböversikt */}
          {hasOverview && (
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Snabböversikt
              </h2>
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <OverviewItem label="Passar bäst för" items={[sizeLabel, sizeRange].filter(Boolean) as string[]} />
                <OverviewItem label="Primärt fokus" items={products.slice(0, 3)} />
                <OverviewItem label="Starkaste branscher" items={industries.slice(0, 3)} />
                <OverviewItem label="Geografi" items={geoLabel ? [geoLabel] : []} />
                <OverviewItem label="Typiska projekt" items={projects} />
                <OverviewItem label="Mindre lämplig för" items={notFit.slice(0, 2)} />
              </div>
            </div>
          )}

          {/* PRIORITET 2 – Varför företag väljer denna partner */}
          {differentiators.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Varför företag väljer denna partner
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                Faktabaserade punkter ur partnerns profil och d365.se:s bedömning – inga
                marknadsföringspåståenden.
              </p>
              <CheckList items={differentiators} />
            </div>
          )}

          {/* PRIORITET 3 – Typiska kunder och projekt */}
          {hasTypical && (
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Typiska kunder och projekt
              </h2>
              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <OverviewItem label="Företagsstorlek" items={sizeRange ? [sizeRange] : []} />
                <OverviewItem label="Omsättning" items={revenue.slice(0, 4)} />
                <OverviewItem label="Typiska uppdrag" items={projects} />
                <OverviewItem
                  label="Projektstorlek"
                  items={products.length > 0 && sizeLabel ? [`${sizeLabel} inom ${products[0]}`] : []}
                />
              </div>
              {(typicalCustomers || typicalProjects) && (
                <div className="mt-5 space-y-3 border-t border-border pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {SOURCE_LABEL_PARTNER}
                  </p>
                  {typicalCustomers && (
                    <p className="max-w-[72ch] text-sm leading-relaxed text-foreground/90">
                      {typicalCustomers}
                    </p>
                  )}
                  {typicalProjects && (
                    <p className="max-w-[72ch] text-sm leading-relaxed text-foreground/90">
                      {typicalProjects}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PRIORITET 4 – Support, förvaltning och långsiktigt samarbete */}
          {hasSupport && (
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  Support, förvaltning och långsiktigt samarbete
                </h2>
                {level && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${SUPPORT_LEVEL_META[level].className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${SUPPORT_LEVEL_META[level].dot}`} />
                    {SUPPORT_LEVEL_META[level].label}
                  </span>
                )}
              </div>
              {level && (
                <p className="mb-4 max-w-[72ch] text-sm leading-relaxed text-foreground/90">
                  {SUPPORT_LEVEL_META[level].description}
                </p>
              )}
              {supportTexts.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {supportTexts.map((item, i) => (
                    <div key={i} className="rounded-lg border border-border bg-muted/40 p-4">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label} – {item.product}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/90">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {SUPPORT_DISCLAIMER}
              </p>
            </div>
          )}

          {/* PRIORITET 5 – d365.se:s rekommendation */}
          {hasRecommendation && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
              <h2 className="mb-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                d365.se:s rekommendation
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">{SOURCE_LABEL_D365}</p>
              <div className="grid gap-6 md:grid-cols-2">
                {bestFit.length > 0 && (
                  <article>
                    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Passar särskilt bra för
                    </h3>
                    <CheckList items={bestFit} />
                  </article>
                )}
                {notFit.length > 0 && (
                  <article>
                    <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Överväg alternativa partners om
                    </h3>
                    <ul className="space-y-1.5">
                      {notFit.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
                        >
                          <Minus
                            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}
              </div>
              <p className="mt-4 text-[11px] leading-snug text-muted-foreground">
                Bedömningen bygger på d365.se:s analysmodell och AI-assisterade genomgång av
                partnerdata och publika källor. Den är jämförbar mellan partnerprofiler, är inte
                verifierade fakta och är inte granskad eller godkänd av partnern.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnerDecisionOverview;
