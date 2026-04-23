import { FilterButtons } from "@/components/FilterButtons";
import { companySizes, revenueOptions } from "@/data/partners";

interface SizeFiltersProps {
  selectedCompanySize: string | null;
  selectedRevenue: string | null;
  onCompanySizeChange: (value: string | null) => void;
  onRevenueChange: (value: string | null) => void;
  colorScheme?: "primary" | "business-central" | "crm" | "finance-supply" | "amber";
}

/**
 * Optional customer size filters (employees + revenue) used on
 * product listing pages and partner-discovery flows.
 * Soft matching: empty selection = all partners shown.
 */
export function SizeFilters({
  selectedCompanySize,
  selectedRevenue,
  onCompanySizeChange,
  onRevenueChange,
  colorScheme = "primary",
}: SizeFiltersProps) {
  return (
    <>
      <FilterButtons
        title="Filtrera på er storlek – antal anställda (frivilligt)"
        icon="employees"
        options={companySizes.map((s) => ({ label: s, value: s }))}
        selectedValue={selectedCompanySize}
        onSelect={onCompanySizeChange}
        colorScheme={colorScheme}
      />
      <FilterButtons
        title="Filtrera på er omsättning i MSEK (frivilligt)"
        icon="revenue"
        options={revenueOptions.map((r) => ({ label: r, value: r }))}
        selectedValue={selectedRevenue}
        onSelect={onRevenueChange}
        colorScheme={colorScheme}
      />
    </>
  );
}
