// Publik sektion: "Support, Förvaltning & Vidareutveckling" per produktområde.
// Texten kommer från partnern, nivån sätts av d365.se.

import { LifeBuoy, TrendingUp, Info } from "lucide-react";
import {
  SUPPORT_FIELDS,
  SUPPORT_LEVEL_META,
  SUPPORT_DISCLAIMER,
  type DeliveryProfileFieldKey,
  type DeliveryProfileValue,
} from "@/data/deliveryProfileFields";

const ICONS: Partial<Record<DeliveryProfileFieldKey, typeof LifeBuoy>> = {
  managedServices: LifeBuoy,
  furtherDevelopment: TrendingUp,
};

interface Props {
  value: DeliveryProfileValue;
  productLabel: string;
  partnerName: string;
}

const ProductSupportProfile = ({ value, productLabel, partnerName }: Props) => {
  const items = SUPPORT_FIELDS.map((f) => ({ ...f, text: (value[f.key] || "").trim() })).filter(
    (f) => f.text.length > 0,
  );
  const level = value.supportLevel ? SUPPORT_LEVEL_META[value.supportLevel] : null;

  if (items.length === 0 && !level) return null;

  return (
    <section aria-labelledby="support-forvaltning-rubrik">
      <h2
        id="support-forvaltning-rubrik"
        className="text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center gap-2"
      >
        <LifeBuoy className="w-5 h-5 text-primary" />
        Support, Förvaltning &amp; Vidareutveckling – {productLabel}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-[72ch]">
        Så beskriver {partnerName} hur lösningen stöttas och utvecklas vidare efter go-live.
      </p>

      {level && (
        <div className="mb-5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${level.className}`}
            title={level.description}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} aria-hidden="true" />
            {level.label}
          </span>
          <p className="text-xs text-muted-foreground mt-2 max-w-[72ch]">{level.description}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = ICONS[item.key] || LifeBuoy;
            return (
              <article key={item.key} className="rounded-lg border border-border bg-card p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  {item.label}
                </h3>
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>
      )}

      <p className="flex items-start gap-1.5 text-xs text-muted-foreground mt-4 max-w-[72ch]">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span>{SUPPORT_DISCLAIMER}</span>
      </p>
    </section>
  );
};

export default ProductSupportProfile;
