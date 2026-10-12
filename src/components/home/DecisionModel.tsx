import { track } from "@/lib/track";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, LayoutGrid, type LucideIcon } from "lucide-react";

/** Fyra vägval, ett huvudmål per kort (hela kortet klickbart) med enhetlig text-CTA. */
const NODES: {
  icon: LucideIcon;
  title: string;
  text: string;
  cta: string;
  to: string;
  /** Kortet öppnar startsidans val av behovsanalys. */
  needsAnalysis?: boolean;
}[] = [
  { icon: ClipboardCheck, title: "Hitta rätt lösning", text: "Få vägledning kring vilka Dynamics\u00A0365-lösningar som är relevanta för era behov.", cta: "Starta behovsguiden", to: "/kom-igang/?source=startsida" },
  { icon: ArrowLeftRight, title: "Räkna på kostnaden", text: "Se införandekostnad, löpande kostnader och 3-års TCO.", cta: "Beräkna er kostnad", to: "/kostnad/" },
  { icon: LayoutGrid, title: "Redan Dynamics-kund", text: "Utöka, uppgradera, använd AI eller byt partner.", cta: "Se era alternativ", to: "/befintlig-kund/" },
  { icon: Users, title: "Hitta rätt partner", text: "Filtrera efter lösning, bransch och kompetens.", cta: "Hitta partners", to: "/valjdynamics365partner/" },
];

const cardClass =
  "group flex h-full min-h-[44px] w-full flex-col items-start gap-2 rounded border border-primary-foreground/15 bg-[hsl(var(--hero-dark))] p-4 text-left transition-colors hover:border-[hsl(var(--accent-dark-zone)/0.7)] hover:bg-primary-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))] lg:p-6";

const CardBody = ({ n }: { n: (typeof NODES)[number] }) => (
  <>
    <n.icon className="h-5 w-5 shrink-0 text-[hsl(var(--accent-dark-zone))] lg:h-6 lg:w-6" aria-hidden="true" />
    <span className="text-[14px] font-semibold leading-tight text-primary-foreground lg:text-[17px]">{n.title}</span>
    <span className="text-[12.5px] leading-snug text-primary-foreground/65 lg:text-[14.5px]">{n.text}</span>
    <span className="mt-auto pt-1.5 text-[13px] font-semibold text-primary-foreground lg:text-[14px] underline-offset-4 group-hover:underline">
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
    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
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
          <Link key={n.to} to={n.to} className={cardClass} onClick={() => track("home_path_click", { path: n.title, to: n.to })}>
            <CardBody n={n} />
          </Link>
        ),
      )}
    </div>
  </nav>
);

export default DecisionModel;
