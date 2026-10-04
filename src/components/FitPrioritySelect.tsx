import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setPlanDimension, usePlanMeta } from "@/lib/d365Plan";

export default function FitPrioritySelect({ dimensionKey, label }: { dimensionKey: string; label: string }) {
  const meta = usePlanMeta();
  return <Select value={meta.dimensions[dimensionKey] || "unset"} onValueChange={(value) => setPlanDimension(dimensionKey, value === "important" || value === "investigate" ? value : null)}>
    <SelectTrigger aria-label={`Prioritering: ${label}`} className="h-auto min-h-10 w-full text-left text-xs [&>span]:whitespace-normal"><SelectValue /></SelectTrigger>
    <SelectContent><SelectItem value="unset">Inte bedömt</SelectItem><SelectItem value="important">Prioriterat behov</SelectItem><SelectItem value="investigate">Behöver utredas</SelectItem></SelectContent>
  </Select>;
}