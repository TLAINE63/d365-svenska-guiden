import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import type { AdvisoryPlacement, ContactSection } from "@/components/plan/PlanContactDialog";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

interface Props {
  /** compact = textrad med länk, inline = rådgivningskort. */
  variant: "compact" | "inline";
  placement: AdvisoryPlacement;
  /** CTA-text, styrd av beslutssituationen. */
  cta: string;
  pageType: string;
  heading?: string;
  text: string;
  /** Underlag från köpresan som visas och kan följa med (besökaren kan avmarkera i formuläret). */
  sections?: ContactSection[];
  dialogTitle?: string;
  dialogDescription?: string;
  metadata?: Record<string, unknown>;
  className?: string;
}

/**
 * Gemensam rådgivningskomponent (WP1). Ett sekundärt, kontextuellt erbjudande vid en beslutspunkt.
 * Återanvänder befintligt rådgivningsflöde (PlanContactDialog advisory → submit-inquiry) och konkurrerar
 * aldrig med direktkontakt: knappen är alltid sekundär och inget öppnas automatiskt.
 */
export default function AdvisoryOffer({ variant, placement, cta, pageType, heading, text, sections = [], dialogTitle, dialogDescription, metadata = {}, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const meta = { placement, cta, page_type: pageType, variant, context_sections: sections.length, ...metadata };

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (seen.current || !entries.some((e) => e.isIntersecting)) return;
      seen.current = true;
      trackFunnelEvent({ event_type: "advisory", event_name: "advisory_cta_view", metadata: meta });
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [placement, cta]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    trackFunnelEvent({ event_type: "advisory", event_name: "advisory_cta_click", metadata: meta });
    setOpen(true);
  };

  const carried = sections.map((s) => s.label);
  const carriedNote = carried.length
    ? `Följer med om ni vill: ${carried.join(", ").toLowerCase()}. Ni ser och kan avmarkera allt innan ni skickar.`
    : "Ni ser exakt vad som skickas innan ni skickar.";

  return (
    <div ref={ref} className={`print:hidden ${className}`} data-advisory-placement={placement}>
      {variant === "inline" ? (
        <aside aria-label="Kostnadsfri rådgivning" className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Kostnadsfri rådgivning
          </p>
          {heading && <h3 className="mb-1.5 text-lg font-bold leading-snug text-foreground">{nowrapBrand(heading)}</h3>}
          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{nowrapBrand(text)}</p>
          <Button type="button" variant="outline" onClick={start} className="min-h-11 whitespace-normal text-left">
            {cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">{carriedNote} Ingen partner deltar och inget delas utan ert godkännande.</p>
        </aside>
      ) : (
        <p className="text-sm text-muted-foreground">
          {nowrapBrand(text)}{" "}
          <button type="button" onClick={start} className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4 hover:text-accent">
            {cta}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </button>
          <span className="block mt-1 text-xs">Kostnadsfritt, ingen partner deltar. {carriedNote}</span>
        </p>
      )}
      {open && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setOpen(false)}
            topic={{
              title: dialogTitle || cta,
              description: dialogDescription || "En rådgivare på köparens sida går igenom ert underlag med er. Ingen partner deltar och ingen kontaktas utan ert godkännande.",
              helpWith: cta,
              startEvent: "advisory_form_opened",
              submitEvent: "advisory_booking_completed",
              extras: sections,
              metadata: { variant, ...metadata },
              advisory: { placement, cta, pageType },
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
