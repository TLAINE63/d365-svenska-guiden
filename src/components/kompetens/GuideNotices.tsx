import { DISCLAIMER_TEXT, SELECTION_TEXT } from "@/data/competenceGuides";
import { nowrapBrand } from "@/lib/nowrapBrand";

export const SelectionNotice = ({ className = "" }: { className?: string }) => (
  <section className={`rounded-lg border border-border bg-muted/40 p-4 ${className}`}>
    <h2 className="text-sm font-semibold mb-1.5">Så väljs partners ut</h2>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {nowrapBrand(SELECTION_TEXT)}
    </p>
  </section>
);

export const CompetenceDisclaimer = ({ className = "" }: { className?: string }) => (
  <section className={`rounded-lg border border-border/70 bg-background p-4 ${className}`}>
    <h2 className="text-sm font-semibold mb-1.5">Om informationen på sidan</h2>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {nowrapBrand(DISCLAIMER_TEXT)}
    </p>
  </section>
);
