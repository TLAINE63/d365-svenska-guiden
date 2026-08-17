import { costBreakdowns } from "@/data/costBreakdown";

interface Props {
  /** Produktnyckel som matchar costBreakdowns. */
  product: keyof typeof costBreakdowns;
}

/**
 * Typexempel på faktiska projekt för en produkt. Renderas bara om produkten
 * har `examples` i costBreakdown-datan (idag Business Central).
 */
const CostProjectExamples = ({ product }: Props) => {
  const examples = costBreakdowns[product]?.examples;
  if (!examples || examples.length === 0) return null;

  return (
    <section className="pb-8 sm:pb-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            Typexempel på projekt
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-3xl">
            Ett par exempel som ger en generell uppfattning. Bransch, företagsstorlek,
            anpassningar och integrationer kan skilja mycket – och det skiljer även mellan
            partners beroende på erfarenhet och färdiga paketeringar.
          </p>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {examples.map((ex) => (
              <article
                key={ex.title}
                className="bg-card rounded border border-border p-5 sm:p-6"
              >
                <h4 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
                  {ex.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">{ex.scope}</p>
                <div className="text-lg sm:text-xl font-bold text-primary mb-4">
                  {ex.range}
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                  {ex.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostProjectExamples;
