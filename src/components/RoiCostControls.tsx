import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const sek = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n) + " kr";

export default function RoiCostControls({ estimated, override, onImplementation, supportPercent, onSupportPercent }: {
  estimated: number;
  override: number | null;
  onImplementation: (value: number | null) => void;
  supportPercent: number;
  onSupportPercent: (value: number) => void;
}) {
  const amount = override ?? estimated;
  return (
    <div className="space-y-6" data-roi-cost-controls>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label>Införandekostnad (engångs)</Label>
          <span className="text-sm font-medium tabular-nums">{sek(amount)}</span>
        </div>
        <Slider aria-label="Införandekostnad" min={0} max={Math.max(1_000_000, Math.ceil(Math.max(estimated * 2, amount) / 10_000) * 10_000)} step={1000}
          value={[amount]} onValueChange={([value]) => onImplementation(value)} />
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{override === null ? "Beräknat från valen ovan" : "Eget kostnadsantagande"}</span>
          <Button type="button" variant="ghost" size="icon" title="Återgå till beräknad införandekostnad" aria-label="Återgå till beräknad införandekostnad"
            disabled={override === null} onClick={() => onImplementation(null)}><RotateCcw /></Button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label>Förvaltning från år 2 (% per år)</Label>
          <span className="text-sm font-medium tabular-nums">{supportPercent} %</span>
        </div>
        <Slider aria-label="Förvaltningsprocent från år 2" min={0} max={50} step={1} value={[supportPercent]}
          onValueChange={([value]) => onSupportPercent(value)} />
        <p className="text-xs text-muted-foreground">{sek(amount * supportPercent / 100)} per år</p>
      </div>
    </div>
  );
}