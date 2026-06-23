import { Sparkles } from "lucide-react";

interface ShortAnswerProps {
  /** Heading shown above the answer. Defaults to "Kort svar". */
  title?: string;
  /** 2–4 sentences answering the page's main question. Plain text or ReactNode. */
  children: React.ReactNode;
  /** Optional className passthrough for layout tweaks. */
  className?: string;
}

/**
 * "Kort svar"-block för AIO/AI Overview-readiness och featured snippets.
 *
 * Visas högt upp på pelarsidor (efter ingressen) och svarar direkt på
 * sidans huvudfråga i 2–4 meningar. Rubriken är h2 så Google/AI-läsare
 * lätt kan plocka ut svaret.
 */
const ShortAnswer = ({ title = "Kort svar", children, className = "" }: ShortAnswerProps) => {
  return (
    <section
      aria-label={title}
      className={`py-8 sm:py-10 bg-background ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded border border-primary/20 bg-primary/[0.04] p-5 sm:p-7 ">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-[0.12em] text-primary m-0">
                {title}
              </h2>
            </div>
            <div className="text-base sm:text-lg leading-relaxed text-foreground [&>p]:m-0 [&>p+p]:mt-3">
              {typeof children === "string" ? <p>{children}</p> : children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortAnswer;
