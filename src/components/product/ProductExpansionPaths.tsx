import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { COPILOT_NOTE, expansionFor, PRODUCT_INFO, type ExpansionProduct } from "@/lib/productExpansion";
import { track } from "@/lib/track";

/** Naturliga nästa steg för den som redan har produkten (paket 2). */
const ProductExpansionPaths = ({ product }: { product: ExpansionProduct }) => {
  const steps = expansionFor(product);
  if (steps.length === 0) return null;
  const current = PRODUCT_INFO[product].label;
  return (
    <section aria-labelledby="expansion-heading" className="border-t border-border bg-background py-8 sm:py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="expansion-heading" className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
          Har ni redan <span className="whitespace-nowrap">{current}</span>? Vanliga nästa steg
        </h2>
        <p className="mb-6 max-w-3xl text-muted-foreground">
          Vägarna utgår från affärsbehov vi ofta ser, inte från vad som tekniskt går att koppla ihop. Andra kombinationer kan vara rätt när ert behov motiverar dem.
        </p>
        <ul className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => {
            const info = PRODUCT_INFO[s.product];
            return (
              <li key={s.product} className="flex flex-col rounded-lg border border-border bg-card p-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.strength === "typisk" ? "Vanlig utveckling" : "När behovet finns"}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  <span className="whitespace-nowrap">Dynamics&nbsp;365</span> <span className="whitespace-nowrap">{info.label}</span>
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">{s.need}</p>
                <Link
                  to={info.href}
                  onClick={() => track("expansion_path_click", { from: product, to: s.product, strength: s.strength })}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Läs om {info.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 flex max-w-3xl items-start gap-2 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <span>{COPILOT_NOTE} <Link to="/ai/" className="text-foreground underline underline-offset-4">AI och Copilot i Dynamics&nbsp;365</Link></span>
        </p>
      </div>
    </section>
  );
};

export default ProductExpansionPaths;
