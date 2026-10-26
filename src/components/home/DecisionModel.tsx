import { track } from "@/lib/track";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, LayoutGrid, type LucideIcon } from "lucide-react";

/** Fyra vägval, ett huvudmål per kort (hela kortet klickbart) med enhetlig text-CTA. */
const NODES: {
  icon: LucideIcon;
  title: string;
  text: string;
  cta: string;
  to: string;
  journey: string;
  /** Kortet öppnar startsidans val av behovsanalys. */
  needsAnalysis?: boolean;
}[] = [
  { icon: ClipboardCheck, title: "Vi behöver ett nytt affärssystem (ERP) eller CRM", text: "Utforska och jämför alternativ utifrån verksamhetens behov.", cta: "Hitta rätt lösning", to: "/kom-igang/?source=startsida", journey: "new_system" },
  { icon: ArrowLeftRight, title: "Vi vill förstå vad det kostar", text: "Beräkna licenser, införande, löpande kostnader och TCO.", cta: "Beräkna kostnaden", to: "/kostnad/", journey: "cost" },
  { icon: LayoutGrid, title: "Vi använder redan Dynamics\u00A0365", text: "Få stöd kring utveckling, AI, support, förvaltning eller byte av partner.", cta: "Utforska nästa steg", to: "/befintlig-kund/", journey: "existing_customer" },
  { icon: Users, title: "Vi behöver en Dynamics\u00A0365-partner", text: "Jämför partners utifrån lösning, bransch, kompetens och behov.", cta: "Hitta rätt partner", to: "/valjdynamics365partner/", journey: "find_partner" },
];

const cardClass =
  "group flex h-full min-h-[44px] w-full flex-col items-start gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/[0.07] shadow-md p-3 sm:p-3.5 text-left transition-colors hover:border-[hsl(var(--accent-dark-zone)/0.7)] hover:bg-primary-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))] lg:p-5";

const CardBody = ({ n }: { n: (typeof NODES)[number] }) => (
  <>
    <n.icon className="h-5 w-5 shrink-0 text-[hsl(var(--accent-dark-zone))] lg:h-6 lg:w-6" aria-hidden="true" />
    <span className="text-balance text-[14.5px] sm:text-[16px] font-bold leading-tight text-primary-foreground lg:text-[19px]">{n.title}</span>
    <span className="text-[12.5px] leading-snug text-primary-foreground/65 lg:text-[14px]">{n.text}</span>
    <span className="mt-auto inline-flex items-center gap-1 rounded-md bg-primary-foreground/10 px-2 py-1 text-[13px] font-semibold text-primary-foreground lg:bg-transparent lg:px-0 lg:py-0 lg:pt-1.5 lg:text-[14px] underline-offset-4 group-hover:underline">
      {n.cta} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
    </span>
  </>
);

interface DecisionModelProps {
  /** Öppnar startsidans val av behovsanalys (ERP, CRM eller kundservice). */
  onStartNeedsAnalysis?: () => void;
}

/** Icke-linjär beslutsmodell. Desktop: fyra kort i en rad. */
const DecisionModel = ({ onStartNeedsAnalysis }: DecisionModelProps) => (
  <nav aria-label="Vägval i ert Dynamics 365-beslut">
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
      {NODES.map((n) =>
        n.needsAnalysis && onStartNeedsAnalysis ? (
          <button
            key={n.to}
            type="button"
            className={cardClass}
            onClick={() => {
              track("home_needs_analysis_click", { source: "beslutsmodell" });
              onStartNeedsAnalysis();
            }}
          >
            <CardBody n={n} />
          </button>
        ) : (
          <Link key={n.to} to={n.to} className={cardClass} onClick={() => { track("home_path_click", { path: n.title, to: n.to }); trackFunnelEvent({ event_type: "journey", event_name: "homepage_journey_selected", metadata: { journey_type: n.journey, to: n.to } }); }}>
            <CardBody n={n} />
          </Link>
        ),
      )}
    </div>
  </nav>
);

export default DecisionModel;
