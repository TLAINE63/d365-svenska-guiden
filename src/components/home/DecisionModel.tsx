import { track } from "@/lib/track";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, LayoutGrid, ArrowRight, type LucideIcon } from "lucide-react";

/** Fyra vägval, ett huvudmål per kort (hela kortet klickbart). */
const NODES: {
  icon: LucideIcon;
  title: string;
  text: string;
  to: string;
  /** Visar en extra ingång till behovsanalys i kortet. */
  needsAnalysis?: boolean;
  /** Visar en extra ingång till jämförelser av alternativ. */
  compare?: boolean;
}[] = [
  {
    icon: ClipboardCheck,
    title: "Matcha verksamhetsbehov",
    text: "Rätt affärsapplikation & partner för era behov",
    to: "/kom-igang/",
    needsAnalysis: true,
  },
  { icon: ArrowLeftRight, title: "Jämföra & räkna TCO", text: "Införandekostnad, 3-års TCO & alternativ", to: "/kostnad/", compare: true },
  { icon: LayoutGrid, title: "Redan Dynamics-kund", text: "Utöka med fler applikationer, AI eller nya arbetsområden", to: "/befintlig-kund/" },
  { icon: Users, title: "Hitta partner & expertis", text: "Specialister per produkt, bransch eller roll", to: "/valjdynamics365partner/" },
];

const renderNode = (n: (typeof NODES)[number], onStartNeedsAnalysis?: () => void) => (
  <div
    key={n.to}
    className="group flex min-h-[44px] flex-col rounded border border-primary-foreground/15 bg-[hsl(var(--hero-dark))] p-3 transition-colors hover:border-[hsl(var(--accent-dark-zone)/0.7)] focus-within:border-[hsl(var(--accent-dark-zone)/0.7)] lg:p-5"
  >
    <Link
      to={n.to}
      onClick={() => track("home_path_click", { path: n.title, to: n.to })}
      className="flex min-h-[44px] flex-1 items-center gap-3 rounded transition-colors hover:bg-primary-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))] min-[420px]:flex-col min-[420px]:items-start lg:min-h-24"
    >
      <n.icon className="h-5 w-5 shrink-0 text-[hsl(var(--accent-dark-zone))]" aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[14px] font-semibold leading-tight text-primary-foreground lg:text-[16px]">{n.title}</span>
        <span className="mt-0.5 hidden text-[12.5px] leading-snug text-primary-foreground/65 min-[420px]:block lg:mt-1 lg:text-[13.5px]">{n.text}</span>
      </span>
      {!n.needsAnalysis && !n.compare && (
        <ArrowRight className="h-4 w-4 shrink-0 text-primary-foreground/60 transition-transform group-hover:translate-x-0.5 min-[420px]:mt-auto" aria-hidden="true" />
      )}
    </Link>
    {n.compare && (
      <Link
        to="/jamfor/"
        onClick={() => track("home_compare_click", { source: "beslutsmodell" })}
        className="mt-auto inline-flex min-h-[44px] items-end self-start rounded pb-1 text-[13px] font-semibold text-primary-foreground/80 underline-offset-4 hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))]"
      >
        Jämför alternativ
      </Link>
    )}
    {n.needsAnalysis && onStartNeedsAnalysis && (
      <button
        type="button"
        onClick={() => {
          track("home_needs_analysis_click", { source: "beslutsmodell" });
          onStartNeedsAnalysis();
        }}
        className="mt-auto inline-flex min-h-[44px] items-end self-start rounded pb-1 text-[13px] font-semibold text-primary-foreground/80 underline-offset-4 hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))]"
      >
        Gör en behovsanalys
      </button>
    )}
  </div>
);

const hasStartedEvaluation = () => {
  try {
    return !!(localStorage.getItem("d365_buyer_profile_v1") || localStorage.getItem("d365_buyer_context_v1"));
  } catch {
    return false;
  }
};

interface DecisionModelProps {
  /** Öppnar startsidans val av behovsanalys (ERP, CRM eller kundservice). */
  onStartNeedsAnalysis?: () => void;
}

/** Icke-linjär beslutsmodell. Desktop: fyra kort i en rad. Mobil: kompakta kort, diskret ingång om utvärdering påbörjats. */
const DecisionModel = ({ onStartNeedsAnalysis }: DecisionModelProps) => {
  const [started, setStarted] = useState(false);
  useEffect(() => setStarted(hasStartedEvaluation()), []);

  return (
    <nav aria-label="Vägval i ert Dynamics 365-beslut">
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {NODES.map((n) => renderNode(n, onStartNeedsAnalysis))}
      </div>
      {started && (
        <Link
          to="/underlag/"
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-primary-foreground/80 underline-offset-4 hover:underline"
        >
          Fortsätt Din Dynamics-utvärdering
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
};

export default DecisionModel;
