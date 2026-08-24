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

      {DELIVERY_PROFILE_FIELDS.map((field) => {
        const text = v[field.key] || "";
        const len = text.trim().length;
        const tooShort = len > 0 && len < DELIVERY_PROFILE_MIN;
        const suggestion = (suggestions[field.key] || "").trim();
        return (
          <div key={field.key}>
            <Label className="text-sm">{field.label}</Label>
            <p className="text-xs text-muted-foreground mt-1 mb-2">{field.help}</p>
            <Textarea
              value={text}
              maxLength={DELIVERY_PROFILE_MAX}
              placeholder={field.placeholder}
              onChange={(e) => setField(field.key, e.target.value)}
              className="min-h-[110px]"
            />
            <p className={`text-xs mt-1 ${tooShort ? "text-amber-600" : "text-muted-foreground"}`}>
              {len} / {DELIVERY_PROFILE_MAX} tecken
              {tooShort ? ` – minst ${DELIVERY_PROFILE_MIN} tecken rekommenderas` : ""}
            </p>
            {suggestion && (
              <div className="mt-2 rounded-md border border-dashed border-primary/40 bg-muted/40 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" /> AI-förslag
                </p>
                <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-7 px-2 text-xs"
                  onClick={() => setField(field.key, suggestion)}
                >
                  Använd förslaget
                </Button>
              </div>
            )}
          </div>
        );
      })}

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
