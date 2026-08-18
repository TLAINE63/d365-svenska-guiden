import { SlidersHorizontal } from "lucide-react";

export interface SearchCriterion {
  label: string;
}

interface SearchResultSummaryProps {
  /** Aktiva sökkriterier – visas en gång ovanför resultatlistan */
  criteria: (string | null | undefined)[];
  /** Antal verifierade partners som matchar */
  count: number;
  /** Länk/åtgärd för att ändra filter (scrollar till filtren) */
  onChangeFilters?: () => void;
}

/**
 * Resultathuvud: visar användarens sökning en gång ovanför partnerkorten,
 * så att korten kan fokusera på vad som särskiljer partnerna.
 */
export default function SearchResultSummary({
  criteria,
  count,
  onChangeFilters,
}: SearchResultSummaryProps) {
  const active = criteria.filter((c): c is string => !!c && !!c.trim());
  if (active.length === 0) return null;

  return (
    <div className="mb-8 rounded-lg border border-border bg-muted/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base sm:text-lg font-bold text-foreground">
          {count === 1
            ? "1 verifierad partner matchar dina kriterier"
            : `${count} verifierade partners matchar dina kriterier`}
        </h3>
        {onChangeFilters && (
          <button
            type="button"
            onClick={onChangeFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Ändra filter
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        Din sökning
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {active.map((c) => (
          <span
            key={c}
            className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground/80"
          >
            {c}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Samtliga partners nedan uppfyller dessa kriterier. Korten visar vad som skiljer dem åt.
      </p>
    </div>
  );
}
