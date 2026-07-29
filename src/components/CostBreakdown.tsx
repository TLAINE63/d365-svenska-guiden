import { Link } from "react-router-dom";
import { Receipt, Layers, Wrench, RefreshCw } from "lucide-react";
import { costBreakdowns, type CostBreakdownContent } from "@/data/costBreakdown";

interface CostBreakdownProps {
  /** Produktnyckel som matchar costBreakdowns (t.ex. "sales", "business-central"). */
  product: keyof typeof costBreakdowns;
  /** Valfri override av rubrik. */
  heading?: string;
  /** Visa inte länken till samlade kostnads­guiden. */
  hideOverviewLink?: boolean;
}

/**
 * Köparvänlig kostnadsdel: prismodell + S/M/L-intervall + drivare + löpande kostnader.
 * Återanvänds även på den samlade /kostnad/-sidan (där produktnyckeln kan vara t.ex. "business-central").
 */
const CostBreakdown = ({ product, heading, hideOverviewLink = false }: CostBreakdownProps) => {
  const data: CostBreakdownContent | undefined = costBreakdowns[product];
  if (!data) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            På köparens sida
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {heading ?? "Vad kostar det – egentligen?"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground flex items-start gap-3">
            <Receipt className="w-5 h-5 mt-1 shrink-0 text-primary" aria-hidden="true" />
            <span>{data.pricingModel}</span>
          </p>
        </div>

        {/* S / M / L-intervall */}
        <div className="mb-10 sm:mb-12">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" aria-hidden="true" />
            Implementations­intervall
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {data.ranges.map((r) => (
              <article
                key={r.size}
                className="rounded border border-border bg-card p-5 sm:p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-primary/10 text-primary text-xs font-bold">
                    {r.size}
                  </span>
                  <h4 className="text-base sm:text-lg font-semibold text-card-foreground">
                    {r.label}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{r.scope}</p>
                <dl className="mt-auto space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Engångskostnad</dt>
                    <dd className="font-semibold text-card-foreground text-right">{r.oneTime}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Projekttid</dt>
                    <dd className="font-medium text-card-foreground text-right">{r.weeks}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        {/* Drivare + löpande */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <article className="rounded border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded bg-primary/10 text-primary">
                <Wrench className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                  Vanliga kostnads­drivare
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Det här flyttar er över eller under spannet ovan.
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm sm:text-base text-card-foreground/90 list-disc pl-5">
              {data.drivers.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded bg-primary/10 text-primary">
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                  Löpande kostnader efter go-live
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Det syns sällan i offerten – men det är här totalkostnaden växer.
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm sm:text-base text-card-foreground/90 list-disc pl-5">
              {data.ongoing.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </article>
        </div>

        {(data.note || !hideOverviewLink) && (
          <p className="mt-6 text-xs sm:text-sm text-muted-foreground">
            {data.note}
            {!hideOverviewLink && (
              <>
                {" "}Se även den samlade{" "}
                <Link to="/kostnad/" className="underline hover:text-foreground">
                  kostnadsguiden för Dynamics 365
                </Link>{" "}
                och <Link to="/priser/" className="underline hover:text-foreground">prislistan</Link>.
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
};

export default CostBreakdown;
