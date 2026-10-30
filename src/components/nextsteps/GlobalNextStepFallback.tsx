import { lazy, Suspense, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { deadEndMeta } from "@/lib/nextSteps";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

/** Interna sidor där den globala fallbacken inte visas. */
const INTERNAL = /^\/(admin|redaktion|isv-profil|partnersvar|partner-portal|mitt-konto)/;

/**
 * Sprint 2.1 global fallback, ligger direkt ovanför sidfoten på alla publika sidor.
 * Döljs via CSS (index.css, :has) när sidan redan har ett nästa steg-block, så att hjälpen inte visas två gånger.
 */
export default function GlobalNextStepFallback() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  if (INTERNAL.test(pathname)) return null;

  return (
    <div data-global-next-step="" className="border-t border-border bg-muted/40 print:hidden">
      <div className="container mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <p className="text-sm text-foreground">Osäker på vad som är rätt nästa steg?</p>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          onClick={() => {
            trackFunnelEvent({ event_type: "cta_click", event_name: "dead_end_next_step_clicked", page_path: pathname, metadata: deadEndMeta("other", pathname, "global_fallback", "help_d365") });
            setOpen(true);
          }}
        >
          Prata med d365.se <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      {open && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setOpen(false)}
            topic={{
              title: "Prata med d365.se",
              description: "Beskriv kort var ni står. d365.se går igenom det manuellt och hör av sig. Inget skickas till någon partner.",
              helpWith: "Osäker på nästa steg",
              startEvent: "next_step_help_started",
              submitEvent: "next_step_help_requested",
              messageLabel: "Kort meddelande",
              hideFocus: true,
              extras: [{ key: "sammanhang", label: "Sammanhang", lines: [`Sida: ${pathname}`] }],
              metadata: { ...deadEndMeta("other", pathname, "global_fallback", "help_d365"), intent_context: "Osäker på nästa steg" },
              advisory: { placement: "next_step_help", cta: "Prata med d365.se", pageType: "global_fallback" },
              doneTitle: "Tack, vi hör av oss",
              showDoneSummary: true,
              doneNotes: [
                "d365.se går igenom er fråga manuellt och hör av sig.",
                "Inget har skickats till någon partner. En introduktion görs bara efter ert godkännande.",
              ],
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
