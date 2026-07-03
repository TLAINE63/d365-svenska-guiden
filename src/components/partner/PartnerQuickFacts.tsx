import { DatabasePartner } from "@/hooks/usePartners";
import { Card, CardContent } from "@/components/ui/card";
import { TabKey } from "./PartnerProductTabs";

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
  if (sizes.length === 1) {
    return `${sizes[0]} anställda`;
  }
  const ordered = sizes
    .filter((s) => SIZE_ORDER.includes(s))
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  if (ordered.length === 0) return `${sizes.join(", ")} anställda`;
  const first = parseSizeBound(ordered[0]);
  const last = parseSizeBound(ordered[ordered.length - 1]);
  if (!first || !last) return `${ordered.join(", ")} anställda`;
  const min = first.min;
  const max = last.max === null ? null : last.max;
  if (max === null) return `${min.toLocaleString("sv-SE")}+ anställda`;
  return `${min.toLocaleString("sv-SE")}–${max.toLocaleString("sv-SE")} anställda`;
}

function dedupeStrings<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function formatIndustries(industries: string[]): string {
  if (industries.length === 0) return "";
  return industries.join(", ");
}

function formatGeography(geography: string[]): string {
  if (geography.length === 0) return "";
  if (geography.length === 1) return geography[0];
  // Join all but the last with commas, then add " och " before the last item
  if (geography.length === 2) return geography.join(" och ");
  return `${geography.slice(0, -1).join(", ")} och ${geography[geography.length - 1]}`;
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
  const hasSmall = revenue.some((r) => r.includes("1-24") || r.includes("25-99"));
  const hasMedium = revenue.some((r) => r.includes("100-499") || r.includes("500-999"));
  const hasLarge = revenue.some((r) => r.includes("1.000") || r.includes(">5.000"));

  if (hasLarge && hasSmall) return "företag i alla storlekar";
  if (hasLarge) return "stora företag";
  if (hasMedium && hasSmall) return "små och medelstora företag";
  if (hasMedium) return "medelstora och större företag";
  if (hasSmall) return "små och medelstora företag";
  return "företag i olika storlekar";
}

interface PartnerQuickFactsProps {
  partner: DatabasePartner;
  activeTab: TabKey;
}

export function PartnerQuickFacts({ partner, activeTab }: PartnerQuickFactsProps) {
  const { companySize, geography, industries } = getTabFilter(partner, activeTab);

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

  if (companySize.length > 0) {
    bullets.push({ icon: "📈", text: `Passar främst ${formatCompanySizeLabel(companySize)}` });
  }

  if (bullets.length === 0) return null;

  return (
    <Card className="bg-[hsl(var(--hero-dark))] border-[hsl(var(--line-dark))] text-primary-foreground overflow-hidden">
      <CardContent className="p-0">
        <div className="px-5 py-3 border-b border-[hsl(var(--line-dark))]">
          <h3 className="text-sm font-semibold tracking-wide text-primary-foreground">Kort profil</h3>
        </div>
        <ul className="py-3 px-5 space-y-3 text-sm" aria-label="Kort profil">
          {bullets.map((bullet) => (
            <li key={bullet.text} className="flex items-start gap-3 text-primary-foreground">
              <span className="shrink-0" aria-hidden="true">{bullet.icon}</span>
              <span>{bullet.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default PartnerQuickFacts;
