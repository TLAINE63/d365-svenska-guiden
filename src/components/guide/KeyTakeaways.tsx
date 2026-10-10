import { Lightbulb, ArrowDown } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  items: ReactNode[];
  /** Ankare till sidans partnerruta, visas som diskret länk. */
  partnersAnchor?: string;
  className?: string;
}

/** "Viktigaste insikterna i korthet" – manuellt skrivna sammanfattningar överst i guider. */
const KeyTakeaways = ({ items, partnersAnchor, className = "" }: Props) => (
  <aside aria-labelledby="key-takeaways-heading" className={`rounded-lg border border-border bg-secondary/40 p-5 sm:p-6 ${className}`}>
    <h2 id="key-takeaways-heading" className="flex items-center gap-2 text-base font-semibold text-foreground mb-3">
      <Lightbulb className="h-5 w-5 text-accent" aria-hidden />
      Viktigaste insikterna i korthet
    </h2>
    <ul className="space-y-2 text-sm sm:text-base text-muted-foreground list-disc pl-5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
    {partnersAnchor && (
      <a href={`#${partnersAnchor}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        Gå direkt till verifierade partners och nästa steg <ArrowDown className="h-3.5 w-3.5" aria-hidden />
      </a>
    )}
  </aside>
);

export default KeyTakeaways;
