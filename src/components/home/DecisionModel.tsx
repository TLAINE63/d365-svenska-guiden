import { track } from "@/lib/track";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, LayoutGrid, ArrowRight } from "lucide-react";

/** Fyra vägval, ett huvudmål per kort (hela kortet klickbart). */
const NODES = [
  { icon: ClipboardCheck, title: "Förstå verksamhetens behov", text: "Ekonomi och lager, sälj, kundservice eller helheten?", to: "/kom-igang/" },
  { icon: ArrowLeftRight, title: "Jämföra och räkna kostnad", text: "Införande, TCO över tid och alternativ", to: "/kostnad/" },
  { icon: LayoutGrid, title: "Redan Dynamics-kund", text: "Utöka med fler applikationer, AI eller nya arbetsområden", to: "/underlag/" },
  { icon: Users, title: "Hitta partner och expertis", text: "Specialister per lösning, bransch eller roll", to: "/valjdynamics365partner/" },
];

const renderNode = (n: (typeof NODES)[number]) => (
  <Link
    key={n.to}
    to={n.to}
    onClick={() => track("home_path_click", { path: n.title, to: n.to })}
    className="group flex min-h-[44px] items-center gap-3 rounded border border-primary-foreground/15 bg-[hsl(var(--hero-dark))] p-3 transition-colors hover:border-[hsl(var(--accent-dark-zone)/0.7)] hover:bg-primary-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-dark-zone))] min-[420px]:flex-col min-[420px]:items-start lg:min-h-32 lg:p-5"
  >
    <n.icon className="h-5 w-5 shrink-0 text-[hsl(var(--accent-dark-zone))]" aria-hidden="true" />
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-[14px] font-semibold leading-tight text-primary-foreground lg:text-[16px]">{n.title}</span>
      <span className="mt-0.5 hidden text-[12.5px] leading-snug text-primary-foreground/65 min-[420px]:block lg:mt-1 lg:text-[13.5px]">{n.text}</span>
    </span>
    <ArrowRight className="h-4 w-4 shrink-0 text-primary-foreground/60 transition-transform group-hover:translate-x-0.5 min-[420px]:mt-auto" aria-hidden="true" />
  </Link>
);

const hasStartedEvaluation = () => {
  try {
    return !!(localStorage.getItem("d365_buyer_profile_v1") || localStorage.getItem("d365_buyer_context_v1"));
  } catch {
    return false;
  }
};

/** Icke-linjär beslutsmodell. Desktop: fyra kort i en rad. Mobil: kompakta kort, diskret ingång om utvärdering påbörjats. */
const DecisionModel = () => {
  const [started, setStarted] = useState(false);
  useEffect(() => setStarted(hasStartedEvaluation()), []);

  return (
    <nav aria-label="Vägval i ert Dynamics 365-beslut">
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {NODES.map(renderNode)}
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
