import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import {
  COMPETENCY_AREAS,
  COMPETENCY_SIGNALS,
  LEVEL_META,
  ASSESSMENT_DISCLAIMER,
  readSignals,
  signalsKey,
  type CompetencyArea,
  type ExtendedCompetencies,
} from "@/lib/extendedCompetencies";

export type ExtendedCompetencyInput = Record<string, string>;

interface Props {
  /** Nivåer satta av d365.se – visas endast som läsbar information. */
  levels?: ExtendedCompetencies | null;
  value: ExtendedCompetencyInput;
  onChange: (value: ExtendedCompetencyInput) => void;
  maxLength?: number;
}

export default function ExtendedCompetencyInputSection({
  levels,
  value,
  onChange,
  maxLength = 800,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            Här beskriver ni er kompetens inom <strong>Power Platform</strong>,{" "}
            <strong>Copilot &amp; AI</strong> och <strong>Copilot Studio &amp; agenter</strong> som
            komplement till Dynamics 365.
          </p>
          <p>
            Nivån sätts av d365.se – inte av er själva. {ASSESSMENT_DISCLAIMER} Er text används som
            underlag och publiceras inte ordagrant.
          </p>
        </div>
      </div>

      {COMPETENCY_AREAS.map((area) => {
        const level = levels?.[area.key];
        const meta = level ? LEVEL_META[level] : null;
        return (
          <div key={area.key} className="space-y-2 rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor={`comp-${area.key}`} className="text-sm font-semibold">
                {area.label}
              </Label>
              <Badge
                variant="outline"
                className={meta ? meta.className : "bg-muted text-muted-foreground border-border"}
              >
                {meta ? `Bedömd nivå: ${meta.label}` : "Ej bedömd ännu"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">{area.description}</p>
            <Textarea
              id={`comp-${area.key}`}
              rows={4}
              maxLength={maxLength}
              value={value?.[area.key] || ""}
              onChange={(e) => onChange({ ...(value || {}), [area.key]: e.target.value })}
              placeholder="Beskriv kundcase, referenser, certifieringar, teamstorlek och konkreta leveranser inom området…"
            />
            <p className="text-[11px] text-muted-foreground text-right">
              {(value?.[area.key] || "").length}/{maxLength} tecken
            </p>
          </div>
        );
      })}
    </div>
  );
}
