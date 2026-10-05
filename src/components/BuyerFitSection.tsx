import { Link } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { crmBuyerFit, type CrmBuyerFitKey } from "@/data/crmBuyerFit";
import { nowrapBrand } from "@/lib/nowrapBrand";

/** Köparbedömning före produktbeskrivning: passar, passar inte, alternativ, vad avgör. */
export default function BuyerFitSection({ fitKey }: { fitKey: CrmBuyerFitKey }) {
  const f = crmBuyerFit[fitKey];
  return (
    <section aria-label={`Passar ${f.category} er?`} className="bg-background pb-6 sm:pb-8">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-base font-semibold text-foreground">När passar lösningen?</h2>
            <ul className="space-y-2 text-sm text-foreground/85">
              {f.fits.map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />{nowrapBrand(t)}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-base font-semibold text-foreground">När passar den inte?</h2>
            <ul className="space-y-2 text-sm text-foreground/85">
              {f.notFits.map((t) => (
                <li key={t} className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />{nowrapBrand(t)}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-base font-semibold text-foreground">Vad avgör valet?</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/85">
              {f.decisive.map((t) => <li key={t}>{nowrapBrand(t)}</li>)}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-base font-semibold text-foreground">Jämför med alternativ</h2>
            <ul className="space-y-2 text-sm">
              {f.alternatives.map((a) => (
                <li key={a.label}>
                  {a.to ? (
                    <Link to={a.to} className="inline-flex items-start gap-1.5 text-primary hover:underline">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{nowrapBrand(a.label)}
                    </Link>
                  ) : nowrapBrand(a.label)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
