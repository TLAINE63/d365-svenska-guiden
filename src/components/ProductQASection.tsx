import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";

export interface QAItem {
  question: string;
  answer: string | JSX.Element;
}

export interface ProductQACategory {
  product: string;
  icon?: string;
  description?: string;
  items: QAItem[];
}

interface ProductQASectionProps {
  categories: ProductQACategory[];
}

const ProductQASection = ({ categories }: ProductQASectionProps) => {
  const [activeProduct, setActiveProduct] = useState<string>(
    categories[0]?.product || ""
  );

  const activeCategory = categories.find((c) => c.product === activeProduct);

  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Fördjupning per produkt
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vanliga frågor om funktionalitet, licenspriser och implementering –
            sorterat per Dynamics 365-applikation.
          </p>
        </div>

        {/* Product tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.product}
              onClick={() => setActiveProduct(cat.product)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeProduct === cat.product
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              {cat.product}
            </button>
          ))}
        </div>

        {/* Q&A accordion */}
        {activeCategory && (
          <div className="max-w-3xl mx-auto">
            {activeCategory.description && (
              <p className="text-muted-foreground text-sm mb-6 text-center">
                {activeCategory.description}
              </p>
            )}
            {activeCategory.items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Innehåll kommer snart.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-3">
                {activeCategory.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${activeProduct}-${idx}`}
                    className="border border-border rounded-lg bg-card px-5 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                        {typeof item.answer === "string" ? (
                          <p>{item.answer}</p>
                        ) : (
                          item.answer
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductQASection;
