import { Check } from "lucide-react";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { deliveryModeLabel, type CompetenceGuide } from "@/data/competenceGuides";
import type { CompetenceFilterState } from "@/lib/competenceMatching";

interface Props {
  guide: CompetenceGuide;
  filters: CompetenceFilterState;
}

const List = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((t) => (
      <li key={t} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" aria-hidden="true" />
        <span>{nowrapBrand(t)}</span>
      </li>
    ))}
  </ul>
);

/**
 * Sammanfattar vad besökaren sannolikt söker efter en filtrering,
 * så att sidan ger värde även utan klick vidare till en partner.
 */
const CompetenceResultSummary = ({ guide, filters }: Props) => {
  const product = guide.type === "product" ? guide.productArea : filters.product;
  const heading = product
    ? `Ni söker sannolikt en ${guide.shortTitle} för Dynamics 365 ${product}`
    : `Ni söker sannolikt en ${guide.shortTitle}`;

  const context = [
    filters.industry,
    filters.region,
    filters.delivery ? deliveryModeLabel(filters.delivery) : undefined,
  ].filter(Boolean) as string[];

  return (
    <section className="mb-8 rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-bold mb-2">{nowrapBrand(heading)}</h2>

      {context.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {context.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm font-semibold mb-3">
        Den här rollen brukar vara relevant när ni behöver någon som kan:
      </p>
      <List items={guide.whatTheRoleDoes.slice(0, 4)} />

      <p className="text-sm font-semibold mt-6 mb-3">Kontrollera särskilt</p>
      <List items={guide.buyerChecklist.slice(0, 4)} />
    </section>
  );
};

export default CompetenceResultSummary;
