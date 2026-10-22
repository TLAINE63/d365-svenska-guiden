import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublishedAktuellt } from "@/hooks/useAktuellt";
import { AKTUELLT_PLACEMENTS, countContextualAktuellt, pickContextualAktuellt, type AktuelltContext } from "@/lib/aktuellt";
import AktuelltCard from "@/components/aktuellt/AktuelltCard";

interface Props extends AktuelltContext {
  /** Registrerad sida i AKTUELLT_PLACEMENTS; styr vilka artiklar som matchar. */
  placement?: keyof typeof AKTUELLT_PLACEMENTS;
  /** T.ex. "Aktuellt inom Dynamics 365 Finance". */
  heading: string;
  className?: string;
}

/**
 * Sekundärt block med högst två av d365.se:s egna analyser som rör sidans ämne.
 * Placeras efter sidans köp- och beslutsinnehåll och renderas inte alls utan
 * publicerade, färska och matchande artiklar.
 */
export default function AktuelltContextSection({ heading, className, placement, ...rest }: Props) {
  const { data, isLoading } = usePublishedAktuellt({ limit: 60 });
  if (isLoading || !data) return null;
  const ctx: AktuelltContext = placement ? (AKTUELLT_PLACEMENTS[placement].ctx as AktuelltContext) : rest;
  const items = pickContextualAktuellt(data, ctx);
  if (items.length === 0) return null;
  const showMore = countContextualAktuellt(data, ctx) > items.length;

  return (
    <section aria-label={heading} data-contextual-aktuellt className={`border-t border-border py-10 sm:py-12 ${className ?? ""}`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">{heading}</h2>
            <p className="mt-1 text-sm text-muted-foreground">d365.se:s analys av förändringar som kan påverka val och befintliga lösningar.</p>
          </div>
          {showMore && (
            <Link to="/aktuellt/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline">
              <span>Fler analyser i Aktuellt</span> <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <AktuelltCard key={item.id} item={item} clickSource="contextual" />
          ))}
        </div>
      </div>
    </section>
  );
}
