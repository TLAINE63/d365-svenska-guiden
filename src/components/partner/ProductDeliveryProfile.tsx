import { Sparkles, Users, Briefcase, Workflow, LifeBuoy, TrendingUp, Bot } from "lucide-react";
import {
  DELIVERY_FIELDS,
  type DeliveryProfileFieldKey,
  type DeliveryProfileValue,
} from "@/data/deliveryProfileFields";

const ICONS: Record<DeliveryProfileFieldKey, typeof Users> = {
  typicalCustomers: Users,
  typicalProjects: Briefcase,
  deliveryModel: Workflow,
  managedServices: LifeBuoy,
  furtherDevelopment: TrendingUp,
  aiAutomation: Bot,
};

interface Props {
  value: DeliveryProfileValue;
  productLabel: string;
  partnerName: string;
}

/** Publik visning av partnerns leveransprofil för ett produktområde. */
const ProductDeliveryProfile = ({ value, productLabel, partnerName }: Props) => {
  const items = DELIVERY_FIELDS.map((f) => ({
    ...f,
    text: (value[f.key] || "").trim(),
  })).filter((f) => f.text.length > 0);

  if (items.length === 0 && !value.aiSummary) return null;


  return (
    <section aria-labelledby="leveransprofil-rubrik">
      <h2
        id="leveransprofil-rubrik"
        className="text-xl sm:text-2xl font-bold text-foreground mb-2 flex items-center gap-2"
      >
        <Workflow className="w-5 h-5 text-primary" />
        Leveransprofil – {productLabel}
      </h2>
      <p className="text-sm text-muted-foreground mb-5 max-w-[72ch]">
        Så beskriver {partnerName} hur de normalt engageras under och efter go-live.
      </p>

      {value.aiSummary && (
        <div className="mb-5 rounded-lg border border-border bg-muted/40 p-4 sm:p-5">
          <p className="text-[15px] text-foreground leading-relaxed max-w-[72ch]">{value.aiSummary}</p>
          <div className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Neutral AI-sammanfattning från d365.se
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = ICONS[item.key];
          return (
            <article key={item.key} className="rounded-lg border border-border bg-card p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                {item.label}
              </h3>
              <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProductDeliveryProfile;
