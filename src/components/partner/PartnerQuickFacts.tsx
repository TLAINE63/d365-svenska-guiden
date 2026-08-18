import { DatabasePartner } from "@/hooks/usePartners";
import { Card, CardContent } from "@/components/ui/card";
import type { TabKey } from "./types";

const SIZE_ORDER = ["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"];

const TAB_PRODUCT_TYPE: Record<TabKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  crm: "CRM",
};

const TAB_FILTER_KEYS: Record<TabKey, Array<"bc" | "fsc" | "sales" | "service" | "crm">> = {
  bc: ["bc"],
  fsc: ["fsc"],
  crm: ["sales", "service", "crm"],
};

function parseSizeBound(value: string): { min: number; max: number | null } | null {
  if (value === ">5.000") return { min: 5000, max: null };
  const [minStr, maxStr] = value.split("-");
  if (!minStr || !maxStr) return null;
  const min = parseInt(minStr.replace(/\./g, ""), 10);
  const max = parseInt(maxStr.replace(/\./g, ""), 10);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min, max };
}

function formatSizeRange(sizes: string[]): string {
  if (sizes.length === 0) return "";
  const orderedIdx = sizes
    .filter((s) => SIZE_ORDER.includes(s))
    .map((s) => SIZE_ORDER.indexOf(s))
    .sort((a, b) => a - b);
  if (orderedIdx.length === 0) return `${sizes.join(", ")} anställda`;

  // Gruppera i sammanhängande segment så att luckor inte döljs.
  // Ex: [0,1,3] → [[0,1],[3]] → "1–99, 250–999".
  const groups: number[][] = [];
  for (const idx of orderedIdx) {
    const last = groups[groups.length - 1];
    if (last && idx === last[last.length - 1] + 1) last.push(idx);
    else groups.push([idx]);
  }

  const parts = groups.map((g) => {
    const first = parseSizeBound(SIZE_ORDER[g[0]]);
    const last = parseSizeBound(SIZE_ORDER[g[g.length - 1]]);
    if (!first || !last) return SIZE_ORDER[g[0]];
    if (last.max === null) return `${first.min.toLocaleString("sv-SE")}+`;
    return `${first.min.toLocaleString("sv-SE")}–${last.max.toLocaleString("sv-SE")}`;
  });
  return `${parts.join(", ")} anställda`;
}

function dedupeStrings<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function formatIndustries(industries: string[]): string {
  if (industries.length === 0) return "";
  return industries.join(", ");
}

const GEO_ORDER = ["Sverige", "Norden", "Europa", "Globalt", "Övriga världen", "Internationellt"];

function sortGeography(geography: string[]): string[] {
  return [...geography].sort((a, b) => {
    const ia = GEO_ORDER.indexOf(a);
    const ib = GEO_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "sv");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function formatGeography(geography: string[]): string {
  const sorted = sortGeography(geography);
  if (sorted.length === 0) return "";
  if (sorted.length === 1) return sorted[0];
  if (sorted.length === 2) return sorted.join(" och ");
  return `${sorted.slice(0, -1).join(", ")} och ${sorted[sorted.length - 1]}`;
}

function formatCompanySizeLabel(sizes: string[]): string {
  if (sizes.length === 0) return "företag i olika storlekar";
  const ordered = sizes
    .filter((s) => SIZE_ORDER.includes(s))
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  if (ordered.length === 0) return `${sizes.join(", ")} anställda`;

  const first = parseSizeBound(ordered[0]);
  const last = parseSizeBound(ordered[ordered.length - 1]);
  if (!first || !last) return `${ordered.join(", ")} anställda`;

  const min = first.min;
  const max = last.max;

  if (min === 1 && max !== null && max <= 49) return "små företag";
  if (min >= 50 && max !== null && max <= 249) return "medelstora företag";
  if (min >= 250 && max !== null && max <= 999) return "medelstora och större företag";
  if (min >= 1000 && max !== null) return "stora företag";
  if (max === null) return "stora företag";
  return "företag i olika storlekar";
}

function getTabFilter(partner: DatabasePartner, tab: TabKey) {
  const keys = TAB_FILTER_KEYS[tab];
  const filters = keys.map((k) => partner.product_filters?.[k]).filter(Boolean);
  const companySize = dedupeStrings(filters.flatMap((f) => f?.companySize || []));
  const revenue = dedupeStrings(filters.flatMap((f) => f?.revenue || []));
  const geography = dedupeStrings(filters.flatMap((f) => f?.geography || []));
  const industries = dedupeStrings(filters.flatMap((f) => f?.industries || []));
  return { companySize, revenue, geography, industries };
}

function formatSizeLabelFromRevenue(revenue: string[]): string {
  if (revenue.length === 0) return "företag i olika storlekar";
  const hasVeryLarge = revenue.some((r) => r.includes("1.000") || r.includes(">5.000"));
  const hasMediumLarge = revenue.some((r) => r.includes("100-499") || r.includes("500-999"));
  const hasSmall = revenue.some((r) => r.includes("25-99") || r.includes("1-24"));

  if (hasVeryLarge) return "stora företag";
  if (hasMediumLarge) return "medelstora och större företag";
  if (hasSmall) return "små och medelstora företag";
  return "företag i olika storlekar";
}

interface PartnerQuickFactsProps {
  partner: DatabasePartner;
  activeTab: TabKey;
}

export function PartnerQuickFacts({ partner, activeTab }: PartnerQuickFactsProps) {
  const { companySize, revenue, geography, industries } = getTabFilter(partner, activeTab);

  const bullets: { icon: string; text: string }[] = [];

  if (activeTab === "bc" || activeTab === "fsc") {
    bullets.push({ icon: "🏢", text: "ERP-specialist" });
  } else {
    bullets.push({ icon: "🏢", text: `${TAB_PRODUCT_TYPE[activeTab]}-specialist` });
  }

  if (geography.length > 0) {
    bullets.push({ icon: "🌍", text: `Levererar i ${formatGeography(geography)}` });
  }

  if (industries.length > 0) {
    bullets.push({ icon: "🏭", text: `Starkast inom ${formatIndustries(industries)}` });
  }

  const sizeText = (() => {
    if (companySize.length > 0) {
      const range = formatSizeRange(companySize);
      return `Passar främst företag med ${range}`;
    }
    if (revenue.length > 0) {
      return `Passar främst ${formatSizeLabelFromRevenue(revenue)}`;
    }
    return null;
  })();
  if (sizeText) {
    bullets.push({ icon: "📈", text: sizeText });
  }

  const facts: { label: string; value: string }[] = [
    { label: "Primärt Dynamics 365-område", value: TAB_PRODUCT_TYPE[activeTab] },
  ];
  if (companySize.length > 0) {
    facts.push({ label: "Företagsstorlek", value: formatSizeRange(companySize) });
  } else if (revenue.length > 0) {
    facts.push({ label: "Företagsstorlek", value: formatSizeLabelFromRevenue(revenue) });
  }
  if (industries.length > 0) {
    facts.push({ label: "Huvudbranscher", value: formatIndustries(industries) });
  }
  if (geography.length > 0) {
    facts.push({ label: "Geografi", value: sortGeography(geography).join(" / ") });
  }
  if (revenue.length > 0 && companySize.length > 0) {
    facts.push({ label: "Omsättning", value: revenue.join(", ") });
  }

  // Vanliga projekttyper – härleds ur partnerns taggar, annars utelämnas raden.
  const PROJECT_TYPE_KEYWORDS = [
    "Implementation",
    "ERP-modernisering",
    "Integration",
    "Integrationer",
    "Förvaltning",
    "Vidareutveckling",
    "Uppgradering",
    "Migrering",
    "Support",
  ];
  const tags = ((partner as unknown as { ai_tags?: string[] }).ai_tags || []).filter(Boolean);
  const projectTypes = dedupeStrings(
    tags.filter((t) =>
      PROJECT_TYPE_KEYWORDS.some((k) => t.toLowerCase().includes(k.toLowerCase())),
    ),
  ).slice(0, 4);
  if (projectTypes.length > 0) {
    facts.push({ label: "Vanliga projekttyper", value: projectTypes.join(", ") });
  }

  if (facts.length <= 1) return null;


  return (
    <Card className="bg-[hsl(var(--color-warm))] border-[hsl(var(--color-line))] text-foreground overflow-hidden shadow-sm">
      <CardContent className="p-0">
        <div className="px-5 py-3 border-b border-[hsl(var(--color-line))]">
          <h3 className="text-sm font-semibold tracking-wide text-foreground">Partnerfakta</h3>
        </div>
        <dl className="grid gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-2" aria-label="Partnerfakta">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

export default PartnerQuickFacts;
