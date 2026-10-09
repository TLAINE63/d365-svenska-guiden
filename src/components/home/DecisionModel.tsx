import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, FileText, ArrowRight } from "lucide-react";

const NODES = [
  { icon: ClipboardCheck, title: "Utforska behov", text: "ERP, CRM eller båda?", links: [{ label: "Kom igång", to: "/kom-igang/" }] },
  { icon: ArrowLeftRight, title: "Jämföra lösningar", text: "Appar och listpriser", links: [{ label: "ERP", to: "/affarssystem/" }, { label: "CRM", to: "/crm/" }] },
  { icon: FileText, title: "Planera projekt", text: "Kravunderlag och upphandling", links: [{ label: "Kravunderlag", to: "/kravspecifikation/" }, { label: "Upphandlingsguiden", to: "/upphandlingsguiden/" }] },
  { icon: Users, title: "Jämföra partners", text: "Partner eller kompetens", links: [{ label: "Partners", to: "/valjdynamics365partner/" }, { label: "Kompetens", to: "/kompetens/" }] },
];

const renderNode = (n: (typeof NODES)[number]) => (
  <div key={n.title} className="rounded border border-primary-foreground/15 bg-[hsl(var(--hero-dark))] p-3 sm:p-4 min-h-36 sm:min-h-32 flex flex-col">
    <n.icon className="mb-2 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
    <h3 className="text-[14px] sm:text-[15px] font-semibold leading-tight text-primary-foreground">{n.title}</h3>
    <p className="mt-1 mb-3 text-[12.5px] leading-snug text-primary-foreground/65">{n.text}</p>
    <div className="mt-auto flex flex-wrap gap-x-3 gap-y-2">
      {n.links.map((l) => (
        <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary-foreground underline-offset-4 hover:underline">
          {l.label}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      ))}
    </div>
  </div>
);

/** Icke-linjär beslutsmodell: fyra fristående ingångar kring ett gemensamt beslutsunderlag. */
const DecisionModel = () => (
  <nav aria-label="Var i ert beslut befinner ni er?">
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {NODES.slice(0, 2).map(renderNode)}
      <div className="col-span-2 flex items-center gap-3 sm:gap-4" aria-label="Modellens gemensamma mittpunkt">
        <span className="h-px flex-1 bg-accent/35" aria-hidden="true" />
        <div className="min-w-0 rounded border border-accent/60 bg-accent/10 px-4 py-2.5 text-center">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/60">Mitt Dynamics-projekt</span>
          <span className="block text-[12px] sm:text-[13px] font-bold leading-tight text-primary-foreground">Gemensamt beslutsunderlag</span>
        </div>
        <span className="h-px flex-1 bg-accent/35" aria-hidden="true" />
      </div>
      {NODES.slice(2).map(renderNode)}
    </div>
  </nav>
);

export default DecisionModel;
