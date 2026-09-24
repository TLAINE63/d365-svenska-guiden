import { DISCLAIMER_TEXT, SELECTION_TEXT } from "@/data/competenceGuides";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { ChevronDown } from "lucide-react";

export const MatchInfoDisclosure = ({ className = "" }: { className?: string }) => (
  <details className={`group rounded-lg border border-border/70 bg-background ${className}`}>
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
      Hur fungerar matchningen?
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
    </summary>
    <div className="space-y-4 border-t border-border/60 px-4 py-4">
      <div>
        <h2 className="text-sm font-semibold mb-1.5">Så väljs partners ut</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {nowrapBrand(SELECTION_TEXT)}
        </p>
      </div>
      <div>
        <h2 className="text-sm font-semibold mb-1.5">Om informationen på sidan</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {nowrapBrand(DISCLAIMER_TEXT)}
        </p>
      </div>
    </div>
  </details>
);
