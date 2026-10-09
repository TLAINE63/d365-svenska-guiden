import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowLeftRight, Users, FileText, ArrowRight } from "lucide-react";

const NODES = [
  { icon: ClipboardCheck, title: "Utforska behov", text: "ERP, CRM eller båda?", links: [{ label: "Kom igång", to: "/kom-igang/" }] },
  { icon: ArrowLeftRight, title: "Jämföra lösningar", text: "Appar och listpriser", links: [{ label: "ERP", to: "/affarssystem/" }, { label: "CRM", to: "/crm/" }] },
  { icon: FileText, title: "Planera projekt", text: "Kravunderlag och upphandling", links: [{ label: "Kravunderlag", to: "/kravspecifikation/" }, { label: "Upphandlingsguiden", to: "/upphandlingsguiden/" }] },
  { icon: Users, title: "Jämföra partners", text: "Partner eller kompetens", links: [{ label: "Partners", to: "/valjdynamics365partner/" }, { label: "Kompetens", to: "/kompetens/" }] },
];

const renderNode = (n: (typeof NODES)[number]) => (
  <div key={n.title} className="relative z-10 rounded border border-white/15 bg-[hsl(var(--hero-dark))] p-3 sm:p-4">
    <n.icon className="mb-1.5 h-5 w-5 text-accent" aria-hidden="true" />
    <h3 className="text-[14px] sm:text-[15px] font-semibold leading-tight text-white">{n.title}</h3>
    <p className="mb-2 text-[12.5px] leading-snug text-white/65">{n.text}</p>
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {n.links.map((l) => (
        <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 text-[13px] font-semibold text-white underline-offset-4 hover:underline">
          {l.label}
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      ))}
    </div>
  </div>
);

/** Icke-linjär beslutsmodell: fyra fristående ingångar kring ett gemensamt beslutsunderlag. */
const DecisionModel = () => (
  <nav aria-label="Var i ert beslut befinner ni er?" className="relative">
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
      Börja var ni vill – allt hänger ihop
    </p>
    <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
      {/* Prickade kopplingar */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g stroke="hsl(var(--accent))" strokeOpacity="0.55" strokeWidth="0.5" strokeDasharray="1.5 1.5" fill="none" vectorEffect="non-scaling-stroke">
          <rect x="25" y="25" width="50" height="50" vectorEffect="non-scaling-stroke" />
          <line x1="25" y1="25" x2="75" y2="75" vectorEffect="non-scaling-stroke" />
          <line x1="75" y1="25" x2="25" y2="75" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      {NODES.slice(0, 2).map(renderNode)}
      <div className="relative z-10 col-span-2 flex justify-center -my-1">
        <div className="rounded-full border border-accent/60 bg-[hsl(var(--hero-dark))] px-4 py-1.5 text-center">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">Mitt Dynamics-projekt</span>
          <span className="block text-[12px] font-bold leading-tight text-white whitespace-nowrap">Gemensamt beslutsunderlag</span>
        </div>
      </div>
      {NODES.slice(2).map(renderNode)}
    </div>
  </nav>
);

export default DecisionModel;
