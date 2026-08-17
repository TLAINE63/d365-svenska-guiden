import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

interface Props {
  /** Produktnamnet exakt som det används i fördjupningsartiklarna, t.ex. "Business Central". */
  product: string;
  /** Visningsnamn i rubriken – faller tillbaka på product. */
  label?: string;
  count?: number;
}

export default function ProductDeepDiveLink({ product, label, count }: Props) {
  const name = label || product;
  const href = `/kunskapscenter?kategori=fordjupning&produkt=${encodeURIComponent(product)}`;

  return (
    <section className="py-8 sm:py-10 bg-secondary/20 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded border border-border bg-card">
          <BookOpen className="w-8 h-8 text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1">
              Fördjupningsartiklar om {name}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {count
                ? `${count} fördjupningar om moduler, funktioner och användning – samlade i Kunskapscentret.`
                : "Fördjupningar om moduler, funktioner och användning – samlade i Kunskapscentret."}
            </p>
          </div>
          <Link
            to={href}
            className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded font-semibold text-sm text-white bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] transition-colors flex-shrink-0"
          >
            Läs fördjupningarna <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
