import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Columns3, Compass, MessageCircle } from "lucide-react";
import CompetenceChoiceDialog from "@/components/kompetens/CompetenceChoiceDialog";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { nextStepOptions, nextStepPage, type NextStepKind, type NextStepOption } from "@/lib/nextSteps";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

const ICONS: Record<NextStepKind, typeof BookOpen> = { knowledge: BookOpen, comparison: Columns3, tool: Compass, help: MessageCircle };

interface Props {
  /** Sidans sökväg. Komponenten visas bara på sidor i pilotlistan. */
  path: string;
  className?: string;
}

/**
 * Sprint 1.6: "Fortsätt er utvärdering". Högst fyra nästa steg med mätning av visning och klick
 * (conversion_type, recipient, source_page, buyer_stage, intent_type). Personlig hjälp skapar
 * ett internt ärende hos d365.se via rådgivningsflödet och skickas aldrig till partners.
 */
export default function ContinueEvaluation({ path, className = "" }: Props) {
  const page = nextStepPage(path);
  const ref = useRef<HTMLElement>(null);
  const viewed = useRef(false);
  const [competenceOpen, setCompetenceOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const base = (o?: NextStepOption) => ({
    source_page: path,
    buyer_stage: page?.buyerStage,
    intent_type: page?.intentType,
    ...(o ? { step: o.kind, cta_type: o.ctaType, conversion_type: o.conversionType, recipient: o.recipient, target: o.to ?? (o.opensCompetenceChoice ? "competence_choice" : "help") } : {}),
  });

  useEffect(() => {
    if (!page || !ref.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((entries) => {
      if (viewed.current || !entries.some((e) => e.isIntersecting)) return;
      viewed.current = true;
      trackFunnelEvent({ event_type: "cta_view", event_name: "next_step_view", page_path: path, metadata: { ...base(), options: nextStepOptions(page).map((o) => o.kind).join(",") } });
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (!page) return null;
  const options = nextStepOptions(page);

  const clicked = (o: NextStepOption) =>
    trackFunnelEvent({ event_type: "cta_click", event_name: "next_step_clicked", page_path: path, metadata: base(o) });

  const cardCls = "group flex h-full w-full flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const body = (o: NextStepOption) => {
    const Icon = ICONS[o.kind];
    return (
      <>
        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
        <span className="font-semibold text-foreground group-hover:text-primary">{nowrapBrand(o.label)} <ArrowRight className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" /></span>
        <span className="text-sm text-muted-foreground">{nowrapBrand(o.text)}</span>
      </>
    );
  };

  return (
    <section ref={ref} className={`py-10 sm:py-12 print:hidden ${className}`} aria-labelledby="fortsatt-utvardering-h">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">Nästa steg</p>
        <h2 id="fortsatt-utvardering-h" className="mb-5 text-2xl font-bold text-foreground">Fortsätt er utvärdering</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((o) => (
            <li key={o.kind}>
              {o.kind === "help" ? (
                <button type="button" className={cardCls} onClick={() => { clicked(o); setHelpOpen(true); }}>{body(o)}</button>
              ) : o.opensCompetenceChoice ? (
                <button type="button" className={cardCls} onClick={() => { clicked(o); setCompetenceOpen(true); }}>{body(o)}</button>
              ) : (
                <Link to={o.to!} className={cardCls} onClick={() => clicked(o)}>{body(o)}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <CompetenceChoiceDialog open={competenceOpen} onOpenChange={setCompetenceOpen} />

      {helpOpen && (
        <Suspense fallback={null}>
          <PlanContactDialog
            mode="advisory"
            onClose={() => setHelpOpen(false)}
            topic={{
              title: "Få hjälp att bedöma nästa steg",
              description: "Beskriv kort var ni står. d365.se går igenom det manuellt och hör av sig. Inget skickas till någon partner.",
              helpWith: `Nästa steg: ${page.context}`,
              startEvent: "next_step_help_started",
              submitEvent: "next_step_help_requested",
              messageLabel: "Kort meddelande",
              hideFocus: true,
              extras: [{ key: "sammanhang", label: "Sammanhang", lines: [`Sida: ${page.context} (${path})`] }],
              metadata: { ...base(HELP_STEP_META), intent_context: page.context },
              advisory: { placement: "next_step_help", cta: "Få hjälp att bedöma nästa steg", pageType: page.buyerStage },
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
    </section>
  );
}

const HELP_STEP_META: NextStepOption = { kind: "help", label: "", text: "", ctaType: "hand_raise", conversionType: "contact_d365", recipient: "d365" };
