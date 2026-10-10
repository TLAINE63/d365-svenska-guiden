import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, FileText, ArrowRight } from "lucide-react";

/** Fyra vägval, ett huvudmål per kort (hela kortet klickbart). */
const NODES = [
  { icon: ClipboardCheck, title: "Förstå våra behov", text: "ERP, CRM eller båda?", to: "/kom-igang/" },
  { icon: ArrowLeftRight, title: "Jämföra lösningar", text: "ERP- och CRM-appar med listpriser", to: "/priser/" },
  { icon: FileText, title: "Förbereda beslut", text: "Kravunderlag och upphandling", to: "/kravspecifikation/" },
  { icon: Users, title: "Hitta rätt partner", text: "Partner eller kompetens", to: "/valjdynamics365partner/" },
];

const renderNode = (n: (typeof NODES)[number]) => (
  <Link
    key={n.to}
    to={n.to}
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

/** Icke-linjär beslutsmodell. Desktop: 2×2 kring "Mitt Dynamics-projekt". Mobil: kompakta kort, diskret ingång om utvärdering påbörjats. */
const DecisionModel = () => {
  const [started, setStarted] = useState(false);
  useEffect(() => setStarted(hasStartedEvaluation()), []);

  return (
    <nav aria-label="Vägval i ert Dynamics 365-beslut">
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:gap-4">
        {NODES.slice(0, 2).map(renderNode)}
        <div className="col-span-full hidden lg:flex justify-center">
          <div className="rounded border border-[hsl(var(--accent-dark-zone)/0.6)] bg-[hsl(var(--accent-dark-zone)/0.1)] px-5 py-2.5 text-center">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/60">Mitt Dynamics-projekt</span>
            <span className="block text-[13px] font-bold leading-tight text-primary-foreground">Gemensamt beslutsunderlag</span>
          </div>
        </div>
        {NODES.slice(2).map(renderNode)}
      </div>
      {started && (
        <Link
          to="/underlag/"
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-semibold text-primary-foreground/80 underline-offset-4 hover:underline lg:hidden"
        >
          Fortsätt Din Dynamics-utvärdering
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
};

export default DecisionModel;
