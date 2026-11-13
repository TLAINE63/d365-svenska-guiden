import { useMemo } from "react";
import { Puzzle } from "lucide-react";
import { useIsvSolutions } from "@/hooks/useIsvSolutions";
import { isvSolutionsForIndustry } from "@/lib/industryIsvSolutions";
import type { IsvSolution } from "@/data/bcIsvSolutions";

interface Props {
  industry: string;
  product: string | string[];
  selectedId: string | null;
  onSelect: (s: IsvSolution | null) => void;
}

/** Branschlösningar (ISV) för vald bransch + produkt; ett val lyfter återförsäljare först. */
export default function IndustryIsvPicker({ industry, product, selectedId, onSelect }: Props) {
  const all = useIsvSolutions();
  const list = useMemo(() => isvSolutionsForIndustry(all, industry, product), [all, industry, product]);
  if (!list.length) return null;
  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
        <Puzzle className="h-4 w-4 text-accent" aria-hidden /> Typiska branschlösningar inom {industry}
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Välj en lösning för att se partners som leverantören angett som återförsäljare först. Övriga partners visas fortfarande.
      </p>
      <div className="flex flex-wrap gap-2">
        {list.map((s) => {
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(active ? null : s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary"}`}
            >
              {s.name} <span className="opacity-70">· {s.vendor}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
