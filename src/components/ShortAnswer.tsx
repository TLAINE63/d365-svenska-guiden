import { nowrapBrand } from "@/lib/nowrapBrand";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ShortAnswerProps {
  /** Heading shown above the answer. Defaults to "Kort svar". */
  title?: string;
  /** 2–4 sentences answering the page's main question. Plain text or ReactNode. */
  children: React.ReactNode;
  /** Optional className passthrough for layout tweaks. */
  className?: string;
  /** Optional CTA button shown below the answer. */
  cta?: {
    label: string;
    to: string;
  };
}

/**
 * Answers the visitor's main question before deeper decision support.
 * Keeps a semantic heading and any existing next-step link.
 */
const ShortAnswer = ({ title = "Kort svar", children, className = "", cta }: ShortAnswerProps) => {
  return (
    <section
      aria-label={title}
      className={`py-6 sm:py-8 bg-background ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div>
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-foreground m-0">
                {nowrapBrand(title)}
              </h2>
            </div>
            <div className="text-base leading-relaxed text-foreground [&>p]:m-0 [&>p+p]:mt-3">
              {typeof children === "string" ? <p>{nowrapBrand(children)}</p> : children}
            </div>
            {cta && (
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <Link to={cta.to}>{cta.label}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortAnswer;
