import { DatabasePartner } from "@/hooks/usePartners";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { TabKey } from "./PartnerProductTabs";

const SIZE_ORDER = ["1-49", "50-99", "100-249", "250-999", "1.000-4.999", ">5.000"];

const TAB_PRODUCT_TYPE: Record<TabKey, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain",
  crm: "CRM (Sales, Service, Marketing)",
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

function deriveFocus(industries: string[]): string {
  if (industries.length <= 1) return "Branschspecialist";
  if (industries.length <= 3) return "Specialist";
  return "Generalist";
}

function formatDeliveryModel(engagement?: string | null): string {
  if (!engagement) return "";
  return engagement;
}

function formatIndustries(industries: string[]): string {
  if (industries.length === 0) return "";
  if (industries.length <= 3) return industries.join(", ");
  return `${industries.slice(0, 3).join(", ")} +${industries.length - 3} till`;
}

function getTabFilter(partner: DatabasePartner, tab: TabKey) {
  const keys = TAB_FILTER_KEYS[tab];
  const filters = keys.map((k) => partner.product_filters?.[k]).filter(Boolean);
  const companySize = dedupeStrings(filters.flatMap((f) => f?.companySize || []));
  const geography = dedupeStrings(filters.flatMap((f) => f?.geography || []));
  const industries = dedupeStrings(filters.flatMap((f) => f?.industries || []));
  return { companySize, geography, industries };
}

interface PartnerQuickFactsProps {
  partner: DatabasePartner;
  activeTab: TabKey;
}

export function PartnerQuickFacts({ partner, activeTab }: PartnerQuickFactsProps) {
  const { companySize, geography, industries } = getTabFilter(partner, activeTab);
  const deliveryModel = formatDeliveryModel(partner.delivery_profile?.engagement_model);

  const rows: { label: string; value: string }[] = [];

  if (companySize.length > 0) {
    rows.push({ label: "Kundstorlek", value: formatSizeRange(companySize) });
  }

  if (geography.length > 0) {
    rows.push({ label: "Geografi", value: geography.join(", ") });
  }

  if (industries.length > 0) {
    rows.push({ label: "Fokus", value: deriveFocus(industries) });
  }

  if (deliveryModel) {
    rows.push({ label: "Leveransmodell", value: deliveryModel });
  }

  if (industries.length > 0) {
    rows.push({ label: "Branscher", value: formatIndustries(industries) });
  }

  rows.push({ label: "Projekttyp", value: TAB_PRODUCT_TYPE[activeTab] });

  if (rows.length === 0) return null;

  return (
    <Card className="bg-[hsl(var(--hero-dark))] border-[hsl(var(--line-dark))] text-primary-foreground overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[hsl(var(--line-dark))]">
          <Zap className="h-4 w-4 text-[hsl(var(--signature))]" />
          <h3 className="text-sm font-semibold tracking-wide text-primary-foreground">Snabbfakta</h3>
        </div>
        <table className="w-full text-sm" aria-label="Snabbfakta">
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.label}
                className={
                  idx !== rows.length - 1 ? "border-b border-[hsl(var(--line-dark))]" : ""
                }
              >
                <th
                  scope="row"
                  className="px-5 py-2.5 font-medium text-[hsl(var(--muted-dark))] w-[40%] align-top text-left"
                >
                  {row.label}
                </th>
                <td className="px-5 py-2.5 text-primary-foreground align-top">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default PartnerQuickFacts;
