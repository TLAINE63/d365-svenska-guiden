import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CalculatorIndustryPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2" role="group" aria-label="Bransch">
      <Label>Bransch</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STANDARD_INDUSTRIES.map((industry) => (
          <Button key={industry.slug} type="button" variant={value === industry.name ? "default" : "outline"}
            aria-pressed={value === industry.name} onClick={() => onChange(industry.name)}
            className="h-auto min-h-12 whitespace-normal break-words rounded-md px-3 py-2 text-xs leading-snug">
            {industry.name}
          </Button>
        ))}
      </div>
    </div>
  );
}