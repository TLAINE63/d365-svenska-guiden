import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DELIVERY_PROFILE_FIELDS,
  DELIVERY_PROFILE_MAX,
  DELIVERY_PROFILE_MIN,
  type DeliveryProfileValue,
} from "@/data/deliveryProfileFields";

interface Props {
  productLabel: string;
  value?: DeliveryProfileValue | null;
  onChange: (next: DeliveryProfileValue) => void;
}

/** Redigering av leveransprofil för ett produktområde. Används i både admin och partnerformulär. */
const DeliveryProfileEditor = ({ productLabel, value, onChange }: Props) => {
  const v = value || {};

  const setField = (key: string, text: string) => {
    onChange({ ...v, [key]: text.slice(0, DELIVERY_PROFILE_MAX) });
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-semibold">Leveransprofil – {productLabel}</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Beskriv hur ni normalt engageras under och efter go-live. Skriv om kundtyper, uppdragstyper,
          arbetsformer och dokumenterad erfarenhet – inte generella marknadsföringspåståenden.
          Varje fält {DELIVERY_PROFILE_MIN}–{DELIVERY_PROFILE_MAX} tecken.
        </p>
      </div>

      {DELIVERY_PROFILE_FIELDS.map((field) => {
        const text = v[field.key] || "";
        const len = text.trim().length;
        const tooShort = len > 0 && len < DELIVERY_PROFILE_MIN;
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
