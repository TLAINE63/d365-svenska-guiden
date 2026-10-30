import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import advisorPhoto from "@/assets/thomas-laine-radgivning.jpg.asset.json";
import type { AdvisoryPlacement, ContactSection } from "@/components/plan/PlanContactDialog";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

interface Props {
  /** compact = textrad med länk, inline = rådgivningskort, hero = ljus textrad på mörk bakgrund. */
  variant: "compact" | "inline" | "hero";
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
  /** Mätningens namn när formuläret skickats (standard advisory_booking_completed). */
  submitEvent?: string;
  /** Etikett för fritextfältet, t.ex. "Kort beskrivning av behovet (valfritt)". */
  messageLabel?: string;
}

/**
 * Gemensam rådgivningskomponent (WP1). Ett sekundärt, kontextuellt erbjudande vid en beslutspunkt.
 * Återanvänder befintligt rådgivningsflöde (PlanContactDialog advisory → submit-inquiry) och konkurrerar
 * aldrig med direktkontakt: knappen är alltid sekundär och inget öppnas automatiskt.
 */
export default function AdvisoryOffer({ variant, placement, cta, pageType, heading, text, sections = [], dialogTitle, dialogDescription, metadata = {}, className = "", submitEvent = "advisory_booking_completed", messageLabel }: Props) {
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
    <div ref={ref} className={`print:hidden ${className}`} data-advisory-placement={placement} data-next-step-block="">
      {variant === "inline" ? (
        <aside aria-label="Kostnadsfri rådgivning" className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-start sm:p-6">
          <figure className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-center sm:text-center">
            <img src={advisorPhoto.url} alt="Thomas Laine, rådgivare på d365.se" loading="lazy" width={112} height={112} className="h-20 w-20 rounded-full object-cover object-[50%_0%] ring-2 ring-border sm:h-28 sm:w-28" />
            <figcaption className="text-xs leading-tight text-muted-foreground"><span className="block font-semibold text-foreground">Thomas Laine</span>Grundare, d365.se</figcaption>
          </figure>
          <div className="min-w-0">
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
          </div>
        </aside>
      ) : variant === "hero" ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] sm:text-[14.5px] text-primary-foreground/70">
          <MessageCircle className="h-4 w-4 shrink-0 text-[hsl(var(--accent-dark-zone))]" aria-hidden />
          <span>{nowrapBrand(text)}</span>
          <button type="button" onClick={start} className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary-foreground hover:text-[hsl(var(--accent-dark-zone))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))] rounded-sm">
            {nowrapBrand(cta)}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        </p>
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
              description: dialogDescription || "Ett samtal före partnerdialogen där en rådgivare går igenom ert underlag med er. Ingen partner deltar och ingen kontaktas utan ert godkännande.",
              helpWith: cta,
              startEvent: "advisory_form_opened",
              submitEvent,
              messageLabel,
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
