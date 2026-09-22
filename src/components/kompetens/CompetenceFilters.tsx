import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DELIVERY_MODES, PRODUCT_OPTIONS, REGION_OPTIONS } from "@/data/competenceGuides";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import type { CompetenceFilterState } from "@/lib/competenceMatching";

const ALL = "__alla__";

interface Props {
  value: CompetenceFilterState;
  onChange: (next: CompetenceFilterState) => void;
  /** Produktfiltret är låst på produktkompetensguider. */
  lockedProduct?: string;
  className?: string;
}

const CompetenceFilters = ({ value, onChange, lockedProduct, className = "" }: Props) => {
  const set = (key: keyof CompetenceFilterState, v: string) =>
    onChange({ ...value, [key]: v === ALL ? undefined : v });

  const hasAny = !!(value.industry || value.region || value.delivery || (!lockedProduct && value.product));

  return (
    <div className={className}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label className="text-xs font-semibold mb-1.5 block">Produkt</Label>
          {lockedProduct ? (
            <div className="flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
              {lockedProduct}
            </div>
          ) : (
            <Select value={value.product ?? ALL} onValueChange={(v) => set("product", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Alla produkter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Alla produkter</SelectItem>
                {PRODUCT_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label className="text-xs font-semibold mb-1.5 block">Bransch</Label>
          <Select value={value.industry ?? ALL} onValueChange={(v) => set("industry", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Alla branscher" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Alla branscher</SelectItem>
              {STANDARD_INDUSTRIES.map((i) => (
                <SelectItem key={i.slug} value={i.name}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold mb-1.5 block">Geografiskt område</Label>
          <Select value={value.region ?? ALL} onValueChange={(v) => set("region", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Hela Sverige" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Hela Sverige</SelectItem>
              {REGION_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-semibold mb-1.5 block">Leveransform</Label>
          <Select value={value.delivery ?? ALL} onValueChange={(v) => set("delivery", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Alla leveransformer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Alla leveransformer</SelectItem>
              {DELIVERY_MODES.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasAny && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => onChange(lockedProduct ? { product: lockedProduct } : {})}
        >
          Rensa val
        </Button>
      )}
    </div>
  );
};

export default CompetenceFilters;
