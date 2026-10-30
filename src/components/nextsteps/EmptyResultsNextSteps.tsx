import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, MessageCircle, RotateCcw, SlidersHorizontal } from "lucide-react";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { deadEndMeta, type SourceTemplate } from "@/lib/nextSteps";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

export interface EmptyAlternative { label: string; to: string }

interface Props {
  /** Sidtyp där det tomma resultatet visas. */
  sourceTemplate: SourceTemplate;
  /** Kort förklaring, t.ex. "Inga partners matchar valen just nu." */
  message: string;
  /** Ändra filter: nollställer besökarens val. */
  onResetFilters?: () => void;
  resetLabel?: string;
  /** Bredda behovet, som länk eller som åtgärd. */
  broaden?: { label: string; to?: string; onClick?: () => void };
  /** Närliggande alternativ. */
  alternatives?: EmptyAlternative[];
  /** Sammanhang som följer med om besökaren ber om hjälp. */
  context: string;
  className?: string;
}

/**
 * Sprint 2.1 No Dead Ends: tomma resultat visar aldrig bara "Inga resultat".
 * Erbjuder ändra filter, bredda behovet, närliggande alternativ och hjälp från d365.se.
 * Hjälpen skapar ett internt ärende och skickas aldrig till partner eller leverantör.
 */
export default function EmptyResultsNextSteps({
  sourceTemplate, message, onResetFilters, resetLabel = "Ändra filter", broaden, alternatives = [], context, className = "",
}: Props) {
  const { pathname } = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackFunnelEvent({ event_type: "cta_view", event_name: "dead_end_next_step_viewed", page_path: pathname, metadata: { ...deadEndMeta(sourceTemplate, pathname, "empty_results"), context } });
  }, [pathname, sourceTemplate, context]);

  const clicked = (type: string, destination: string) =>
    trackFunnelEvent({ event_type: "cta_click", event_name: "dead_end_next_step_clicked", page_path: pathname, metadata: { ...deadEndMeta(sourceTemplate, pathname, type, destination), context } });

  const btn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div data-next-step-block="" data-source-template={sourceTemplate} className={`rounded-lg border border-dashed border-border bg-muted/30 p-6 text-left ${className}`} role="status">
      <p className="font-semibold text-foreground">{nowrapBrand(message)}</p>
      <p className="mt-1 text-sm text-muted-foreground">Så kan ni gå vidare:</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {onResetFilters && (
          <button type="button" className={btn} onClick={() => { clicked("reset_filters", "same_page"); onResetFilters(); }}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> {resetLabel}
          </button>
        )}
        {broaden && (broaden.to ? (
          <Link to={broaden.to} className={btn} onClick={() => clicked("broaden", broaden.to!)}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> {nowrapBrand(broaden.label)}
          </Link>
        ) : (
          <button type="button" className={btn} onClick={() => { clicked("broaden", "same_page"); broaden.onClick?.(); }}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> {nowrapBrand(broaden.label)}
          </button>
        ))}
        {alternatives.map((a) => (
          <Link key={a.to} to={a.to} className={btn} onClick={() => clicked("alternative", a.to)}>
            {nowrapBrand(a.label)} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ))}
        <button type="button" className={btn} onClick={() => { clicked("help", "help_d365"); setHelpOpen(true); }}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Prata med d365.se
        </button>
      </div>

      {helpOpen && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setHelpOpen(false)}
            topic={{
              title: "Prata med d365.se",
              description: "Beskriv kort vad ni letar efter. d365.se går igenom det manuellt och hör av sig. Inget skickas till någon partner eller leverantör.",
              helpWith: `Inga träffar: ${context}`,
              startEvent: "next_step_help_started",
              submitEvent: "next_step_help_requested",
              messageLabel: "Vad letar ni efter?",
              hideFocus: true,
              extras: [{ key: "sammanhang", label: "Sammanhang", lines: [`${context} (${pathname})`] }],
              metadata: { ...deadEndMeta(sourceTemplate, pathname, "help", "help_d365"), intent_context: context },
              advisory: { placement: "next_step_help", cta: "Prata med d365.se", pageType: sourceTemplate },
              doneTitle: "Tack, vi hör av oss",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom er fråga manuellt och hör av sig.",
                "Inget har skickats till någon partner eller leverantör.",
              ],
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
