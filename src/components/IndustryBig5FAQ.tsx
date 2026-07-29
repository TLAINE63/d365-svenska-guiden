import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQSchema } from "@/components/StructuredData";
import { HelpCircle } from "lucide-react";
import { usePriceMap } from "@/hooks/usePriceMap";
import { resolvePriceTokens } from "@/lib/productPriceFormat";

export interface Big5FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: Big5FAQItem[];
  industryLabel?: string;
}

const IndustryBig5FAQ = ({ items, industryLabel }: Props) => {
  const priceMap = usePriceMap();
  const resolved = useMemo(
    () =>
      (items ?? []).map((it) => ({
        question: resolvePriceTokens(it.question, priceMap),
        answer: resolvePriceTokens(it.answer, priceMap),
      })),
    [items, priceMap],
  );

  if (!resolved.length) return null;

  return (
    <aside
      aria-label="Vanliga frågor"
      className="mt-12 pt-8 border-t border-border"
    >
      <FAQSchema faqs={resolved} />
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="!text-[1.35rem] md:!text-[1.625rem] font-bold tracking-tight !text-[#1F4E79] !m-0">
          Vanliga frågor{industryLabel ? ` – ${industryLabel}` : ""}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Raka svar på de fem frågor köpare oftast ställer.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {resolved.map((item, i) => (
          <AccordionItem key={i} value={`big5-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[1rem] leading-[1.7] text-foreground/85 whitespace-pre-line">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
};

export default IndustryBig5FAQ;

