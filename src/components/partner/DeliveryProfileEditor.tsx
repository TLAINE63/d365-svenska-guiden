import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DELIVERY_PROFILE_FIELDS,
  DELIVERY_PROFILE_MAX,
  DELIVERY_PROFILE_MIN,
  SUPPORT_LEVELS,
  SUPPORT_LEVEL_META,
  type DeliveryProfileField,
  type DeliveryProfileValue,
  type SupportLevel,
} from "@/data/deliveryProfileFields";

interface Props {
  productLabel: string;
  value?: DeliveryProfileValue | null;
  onChange: (next: DeliveryProfileValue) => void;
  /** Visar nivåväljaren för Support/Förvaltning – endast i admin (d365.se sätter nivån). */
  allowLevelEdit?: boolean;
}

/** Redigering av leveransprofil för ett produktområde. Används i både admin och partnerformulär. */
const DeliveryProfileEditor = ({ productLabel, value, onChange, allowLevelEdit = false }: Props) => {
  const v = value || {};
  const suggestions = v.suggestions || {};
  const hasSuggestions = DELIVERY_PROFILE_FIELDS.some((f) => (suggestions[f.key] || "").trim());

  const setField = (key: string, text: string) => {
    onChange({ ...v, [key]: text.slice(0, DELIVERY_PROFILE_MAX) });
  };

  const useAllSuggestions = () => {
    const next: DeliveryProfileValue = { ...v };
    DELIVERY_PROFILE_FIELDS.forEach((f) => {
      const s = (suggestions[f.key] || "").trim();
      if (s && !(v[f.key] || "").trim()) next[f.key] = s.slice(0, DELIVERY_PROFILE_MAX);
    });
    onChange(next);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-semibold">Leveransprofil – {productLabel}</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Beskriv hur du normalt engageras under och efter go-live. Skriv om kundtyper, uppdragstyper,
          arbetsformer och dokumenterad erfarenhet – inte generella marknadsföringspåståenden.
          Varje fält {DELIVERY_PROFILE_MIN}–{DELIVERY_PROFILE_MAX} tecken.
        </p>
      </div>

      {hasSuggestions && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-förslag finns för detta produktområde. Förslagen visas bara här – de publiceras först när de förs in i fälten.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={useAllSuggestions}>
            Fyll tomma fält med förslagen
          </Button>
        </div>
      )}

      {renderFields(DELIVERY_PROFILE_FIELDS.filter((f) => f.group === "delivery"))}

      <div className="pt-2 border-t border-border">
        <Label className="text-sm font-semibold">Support, Förvaltning &amp; Vidareutveckling</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Beskriv hur lösningen stöttas och utvecklas vidare efter go-live. Visas som en egen sektion
          på partnerprofilen.
        </p>
      </div>

      {renderFields(DELIVERY_PROFILE_FIELDS.filter((f) => f.group === "support"))}

      {allowLevelEdit && (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <Label className="text-sm">Bedömd nivå (sätts av d365.se)</Label>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            Visas som badge i sektionen. Lämna tom om ingen bedömning gjorts.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={!v.supportLevel ? "default" : "outline"}
              onClick={() => onChange({ ...v, supportLevel: null })}
            >
              Ingen nivå
            </Button>
            {SUPPORT_LEVELS.map((lvl: SupportLevel) => (
              <Button
                key={lvl}
                type="button"
                size="sm"
                variant={v.supportLevel === lvl ? "default" : "outline"}
                title={SUPPORT_LEVEL_META[lvl].description}
                onClick={() => onChange({ ...v, supportLevel: lvl })}
              >
                {SUPPORT_LEVEL_META[lvl].label}
              </Button>
            ))}
          </div>
        </div>
      )}


      {v.aiSummary && (
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            AI-sammanfattning (visas publikt)
          </p>
          <p className="text-sm text-foreground leading-relaxed">{v.aiSummary}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryProfileEditor;
