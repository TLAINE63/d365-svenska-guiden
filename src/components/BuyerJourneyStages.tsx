import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  Search,
  Zap,
  ClipboardList,
  GitBranch,
  Users,
  CheckCircle,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

type Phase = "TIDIGA SIGNALER" | "BEHOVET AKTIVERAS" | "PARTNERVAL";

type Stage = {
  id: number;
  phase: Phase;
  title: string;
  paragraphs: [string, string];
  recommendation: string;
  recommendationHref: string;
  nextStep: {
    label: string;
    href: string;
    helper: string;
    options?: { label: string; href: string }[];
  };
  Icon: LucideIcon;
};

const STAGES: Stage[] = [
  {
    id: 1,
    phase: "TIDIGA SIGNALER",
    title: "Allt fungerar, men ni vill hålla er orienterade",
    paragraphs: [
      "Verksamheten rullar. Driften är stabil. Inget tvingar fram en utvärdering just nu. Men ni vill förstå hur marknaden för affärssystem och kundnära system (ERP, Sales, Marketing/Customer Insights, Customer Service, Field Service, Contact Center) rör sig, vad andra organisationer ser i ett tidigt skede, och vilka signaler som brukar gå före en faktisk förändring.",
      "Poängen i det här läget är inte att förbereda ett beslut. Det är att inte stå oförberedd den dagen frågan blir aktuell.",
    ],
    recommendation: "Orienterande artiklar och löpande bevakning av branschen",
    recommendationHref: "/kunskapscenter",
    nextStep: {
      label: "Bevaka marknaden i Kunskapscentret",
      href: "/kunskapscenter",
      helper: "Läs orienterande artiklar och håll er uppdaterade utan att binda upp er.",
    },
    Icon: Lightbulb,
  },
  {
    id: 2,
    phase: "TIDIGA SIGNALER",
    title: "Det skaver i vardagen, men ni vet inte var problemet ligger",
    paragraphs: [
      "Rapporteringen tar för lång tid. Manuellt arbete växer. Säljarna jobbar i Excel vid sidan av CRM, marknad saknar koll på leads, kundservice tappar ärenden mellan kanaler, eller fältteknikerna kör på egna listor. Något bromsar — frågan är om det är ERP, CRM, kundserviceplattformen, processen, datakvaliteten eller en kombination.",
      "Det är ett vanligt och underskattat läge. Att gå direkt till partnerdialog här leder ofta till ett systembyte som inte löser grundproblemet.",
    ],
    recommendation: "Fördjupningar om hur ni skiljer processproblem från systembegränsningar",
    recommendationHref: "/kunskapscenter",
    nextStep: {
      label: "Gör en behovsanalys",
      href: "/ERPbehovsanalys",
      helper: "Välj vilket område som skaver mest — analysen anpassas efter det.",
      options: [
        { label: "ERP (ekonomi, operations)", href: "/ERPbehovsanalys" },
        { label: "Sälj & Marknad", href: "/CRMbehovsanalys" },
        { label: "Kundservice", href: "/kundservice-behovsanalys" },
      ],
    },
    Icon: Search,
  },
  {
    id: 3,
    phase: "BEHOVET AKTIVERAS",
    title: "Något har hänt som tvingar fram en utvärdering",
    paragraphs: [
      "Ett förvärv, en ny ägare, en version som tas ur stöd, ett regelkrav, en koncernkonsolidering, en ny kommersiell strategi eller ett uttalat mål om bättre kundupplevelse. Det kan handla om ERP lika mycket som om Sales, Marketing/Customer Insights, Customer Service, Field Service eller Contact Center. Frågan är inte längre om — utan när och hur. Tidsfönstret är oftast snävare än beslutsgruppen först inser.",
      "Största risken här är att hoppa direkt till partnerdialog innan en intern nulägesanalys är gjord. Ordningen avgör hur försvarbart beslutet blir senare.",
    ],
    recommendation: "Tematiska guider per triggertyp och mall för intern nulägesanalys",
    recommendationHref: "/kom-igang",
    nextStep: {
      label: "Starta er nulägesanalys",
      href: "/kom-igang",
      helper: "Strukturera triggern internt innan ni öppnar dialogen med partners.",
    },
    Icon: Zap,
  },
  {
    id: 4,
    phase: "BEHOVET AKTIVERAS",
    title: "Vi behöver strukturera vad vi faktiskt behöver",
    paragraphs: [
      "Mandatet finns. Men kraven är spridda. Ekonomi ser ett problem. IT ser ett annat. Operations, sälj, marknad, kundservice och fältservice har egna prioriteringar — och kraven på ERP, CRM och kundserviceplattformarna hänger ofta ihop mer än man tror. Risken är att gå ut till marknaden med en kravbild som inte representerar hela verksamheten.",
      "Det här arbetet sker bäst internt, innan partners blandas in. När alla funktioner är representerade i underlaget blir partnerdialogen helt annorlunda.",
    ],
    recommendation: "Strukturmall för intern behovsanalys och workshop-underlag",
    recommendationHref: "/kravspecifikation",
    nextStep: {
      label: "Bygg en kravspecifikation",
      href: "/kravspecifikation",
      helper: "Välj område — varje kravspec är anpassad efter sin verksamhet.",
      options: [
        { label: "ERP (Business Central, F&SCM)", href: "/kravspecifikation" },
        { label: "Sales", href: "/kravspecifikation-sales" },
        { label: "Marketing", href: "/kravspecifikation-marketing" },
        { label: "Kundservice", href: "/kravspecifikation-kundservice" },
      ],
    },
    Icon: ClipboardList,
  },
  {
    id: 5,
    phase: "BEHOVET AKTIVERAS",
    title: "Vi väger olika vägar framåt",
    paragraphs: [
      "Uppgradera befintligt? Byta system? Konsolidera flera system till en plattform? Ta ERP och CRM i samma program eller i olika spår? Lägga till Customer Insights, Field Service eller Contact Center på det ni redan har? Varje väg har olika riskprofil, olika kompetenskrav hos partnern, och olika konsekvenser för verksamheten under själva genomförandet.",
      "Det är sällan en ren teknisk fråga. Den hänger ihop med verksamhetens komplexitet, tillväxttakt och vilken förvaltningsmodell ni klarar av att bära långsiktigt.",
    ],
    recommendation: "Översikt över de olika vägarna och hur valet brukar landa",
    recommendationHref: "/aioversikt",
    nextStep: {
      label: "Jämför ERP- och CRM-vägarna",
      href: "/ai-readiness",
      helper: "Se hur olika spår skiljer sig i risk, tid och förvaltning.",
    },
    Icon: GitBranch,
  },
  {
    id: 6,
    phase: "PARTNERVAL",
    title: "Vi jämför partners, eller är på väg att göra det",
    paragraphs: [
      "Partnerdialogen är igång. Eller också är ni på väg att sätta en kortlista. Frågan är vilka som faktiskt passar er bransch, er storlek, det område ni prioriterar (ERP, Sales, Marketing/Customer Insights, Customer Service, Field Service eller Contact Center) och er metodik — och hur ni jämför dem på rättvisa grunder.",
      "Det är här d365.se gör störst skillnad. Den traditionella RFP-processen jämför ofta fel saker, och kortlistan formas tidigare än de flesta tror.",
    ],
    recommendation: "Matchning mot partners som passar er bransch och era förutsättningar – vi står på köparens sida",
    recommendationHref: "/valjdynamics365partner",
    nextStep: {
      label: "Hitta matchande partners",
      href: "/valjdynamics365partner",
      helper: "Få en kortlista som matchar bransch, storlek och fokusområde – vi står på köparens sida.",
    },
    Icon: Users,
  },
  {
    id: 7,
    phase: "PARTNERVAL",
    title: "Vi är nära ett beslut, men det måste hålla över tid",
    paragraphs: [
      "Samsynen finns. Budget och inriktning är klara. En partner ligger främst. Men beslutet ska försvaras både i styrelsen och under tre till fem år framåt.",
      "Det är nu valet kan stresstestas — metodiken, scope, leveransmodellen, och hur partnern hanterar avvikelser. Det är också nu det är billigast att justera.",
    ],
    recommendation: "Beslutsmognadsindex — stresstesta mognaden inför viktiga investeringsbeslut",
    recommendationHref: "/beslutsmognadsindex",
    nextStep: {
      label: "Gå till Beslutsmognadsindex",
      href: "/beslutsmognadsindex",
      helper: "Mät er beslutsmognad och få en objektiv bedömning av hur väl förberedda ni är innan kontraktet skrivs under.",
    },
    Icon: CheckCircle,
  },
];

const STEP1_OPTIONS = [
  { label: "Allt fungerar — vi vill bara hålla oss orienterade", result: 1 as const },
  { label: "Det skaver i vardagen, men inget är akut", result: 2 as const },
  { label: "En specifik händelse har gjort frågan akut", result: 3 as const },
  { label: "Vi har redan mandat och har påbörjat en upphandling", result: "next" as const },
];

const STEP2_OPTIONS = [
  { label: "Vi behöver strukturera vad vi faktiskt behöver", result: 4 as const },
  { label: "Vi väger olika vägar framåt (uppgradera, byta, bygga om)", result: 5 as const },
  { label: "Vi jämför eller är på väg att jämföra partners", result: 6 as const },
  { label: "Vi är nära ett beslut och vill säkra det", result: 7 as const },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5006D] focus-visible:ring-offset-2";

const PhaseTag = ({ phase }: { phase: Phase }) => (
  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66]">
    {phase}
  </span>
);

const OptionCard = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group w-full text-left rounded-xl border border-[#E5E5E8] bg-white p-5 sm:p-6 transition-all duration-200 hover:bg-[#FFF0F6] hover:border-[#E5006D] hover:shadow-md ${focusRing}`}
  >
    <span className="block text-[15px] sm:text-base font-medium text-[#0B0B0F] leading-snug">
      {label}
    </span>
  </button>
);

const phaseFor = (id: number): Phase =>
  id <= 2 ? "TIDIGA SIGNALER" : id <= 5 ? "BEHOVET AKTIVERAS" : "PARTNERVAL";

const SHORT_TITLES: Record<number, string> = {
  1: "Ser inget akut problem",
  2: "Känner friktion",
  3: "Trigger event",
  4: "Vill förstå behovet",
  5: "Utforskar alternativ",
  6: "Jämför partners",
  7: "Redo att välja",
};

const STAGE_BULLETS: Record<number, string[]> = {
  1: [
    "Verksamheten rullar stabilt",
    "Andra frågor prioriteras högre",
    "Inga budgetsamtal om systemstöd",
    "Söker inspiration i webinar",
    "Läser guider och bevakning",
    "Står långt ner på agendan",
  ],
  2: [
    "Manuellt arbete växer",
    "Rapportering tar för lång tid",
    "Excel kringgår systemet",
    "Kundbilden är spridd",
    "Säljpipen svår att överblicka",
    "System eller process — oklart",
  ],
  3: [
    "Förvärv eller ny ägare",
    "Tillväxt kräver bättre kontroll",
    "Version eller licensändring",
    "Compliance driver beslut",
    "Koncernkonsolidering",
    "Tidsfönstret är ofta snävt",
  ],
  4: [
    "System, process eller data?",
    "Vad behöver förändras?",
    "Vad händer om vi väntar?",
    "Hur stor blir förändringen?",
    "Vilka funktioner berörs?",
    "Var står vi mot branschen?",
  ],
  5: [
    "Uppgradera eller byta?",
    "En plattform eller flera?",
    "Balans mellan risk och tempo",
    "Samma eller ny leverantör?",
    "Konsekvenser för drift",
    "Vilken förändring klarar vi?",
  ],
  6: [
    "Vilka kan vår bransch?",
    "Vem känns mest trovärdig?",
    "Hur skilja liknande val?",
    "Vilka referenser väger?",
    "Vilken leveransmodell?",
    "Hur jämför vi rättvist?",
  ],
  7: [
    "Samsyn finns internt",
    "Budget och riktning klar",
    "Beslutet ska hålla över tid",
    "Förvaltningsmodellen klar",
    "Avtal och risker balanserade",
    "Internt stöd för förändringen",
  ],
};

const PHASE_LABEL_SHORT: Record<Phase, string> = {
  "TIDIGA SIGNALER": "TIDIGA SIGNALER",
  "BEHOVET AKTIVERAS": "BEHOVET AKTIVERAS",
  PARTNERVAL: "PRODUKT & PARTNERVAL",
};

const BuyerJourneyStages = ({ compact = false }: { compact?: boolean } = {}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [result, setResult] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const quizRef = useRef<HTMLDivElement | null>(null);

  const scrollToOverview = () => {
    overviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectStageFromMap = (id: number) => {
    setResult(id);
    setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const reset = () => {
    setResult(null);
    setStep(1);
  };

  const resultStage = result ? STAGES.find((s) => s.id === result) : null;

  const grouped: Record<Phase, Stage[]> = {
    "TIDIGA SIGNALER": STAGES.filter((s) => s.phase === "TIDIGA SIGNALER"),
    "BEHOVET AKTIVERAS": STAGES.filter((s) => s.phase === "BEHOVET AKTIVERAS"),
    PARTNERVAL: STAGES.filter((s) => s.phase === "PARTNERVAL"),
  };

  return (
    <section className="bg-[#FAFAFA] py-12 md:py-20 border-b border-[#E5E5E8]">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <header className="mb-10 md:mb-14 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0B0B0F] leading-tight mb-3">
            Var i systemlivscykeln står ni?
          </h2>
          <p className="text-sm text-[#5A5A66]">
            Gäller både ERP (Business Central, Finance &amp; Supply Chain) och CRM/kundnära system (Sales, Marketing/Customer Insights, Customer Service, Field Service, Contact Center).
          </p>
        </header>

        {/* Klickbar köpresekarta */}
        <div className="mb-12 md:mb-16">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0B0B0F] mb-1">
                Den typiska upphandlingsresan
              </h3>
              <p className="text-sm text-[#5A5A66]">
                Klicka på det stadie ni känner igen er i — så öppnas detaljerna och nästa steg.
              </p>
            </div>
            

          </div>

          <div className="hidden md:grid grid-cols-7 gap-3 mb-2 px-1">
            <div className="col-span-2 text-center">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66]">
                {PHASE_LABEL_SHORT["TIDIGA SIGNALER"]}
              </span>
              <div className="mt-1 h-px bg-[#E5E5E8]" />
            </div>
            <div className="col-span-3 text-center">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66]">
                {PHASE_LABEL_SHORT["BEHOVET AKTIVERAS"]}
              </span>
              <div className="mt-1 h-px bg-[#E5E5E8]" />
            </div>
            <div className="col-span-2 text-center">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66]">
                {PHASE_LABEL_SHORT["PARTNERVAL"]}
              </span>
              <div className="mt-1 h-px bg-[#E5E5E8]" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {STAGES.map((stage) => {
              const isActive = result === stage.id;
              const cardClass = `group relative flex flex-col rounded-xl border bg-white p-4 pt-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${focusRing} ${
                isActive
                  ? "border-[#E5006D] ring-2 ring-[#E5006D]/30 bg-[#FFF0F6]"
                  : "border-[#E5E5E8] hover:border-[#E5006D]"
              }`;
              const cardInner = (
                <>
                  <div className="flex justify-center mb-2">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                        isActive
                          ? "border-[#E5006D] bg-[#E5006D] text-white"
                          : "border-[#E5006D] text-[#E5006D] group-hover:bg-[#E5006D] group-hover:text-white"
                      }`}
                    >
                      {stage.id}
                    </span>
                  </div>
                  <div className="flex justify-center mb-2">
                    <stage.Icon
                      className={`w-5 h-5 ${isActive ? "text-[#E5006D]" : "text-[#5A5A66]"}`}
                    />
                  </div>
                  <div className="text-center text-[13px] sm:text-sm font-semibold text-[#0B0B0F] leading-snug mb-3 min-h-[2.5rem] flex items-center justify-center">
                    {SHORT_TITLES[stage.id]}
                  </div>
                  <div className="border-t border-[#E5E5E8] pt-3">
                    <ul className="space-y-1.5 text-[11.5px] sm:text-xs text-[#5A5A66] leading-snug">
                      {STAGE_BULLETS[stage.id].map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                </>
              );
              return compact ? (
                <a
                  key={stage.id}
                  href={`/kunskapscenter/upphandlingsresan/#stage-${stage.id}`}
                  className={cardClass}
                >
                  {cardInner}
                </a>
              ) : (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => selectStageFromMap(stage.id)}
                  aria-pressed={isActive}
                  className={cardClass}
                >
                  {cardInner}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz / Result */}
        {!compact && (
        <div ref={quizRef} className="mb-16 md:mb-20 scroll-mt-24">
          {!resultStage && null}


          {resultStage && (
            <div
              key={`result-${resultStage.id}`}
              className="rounded-xl border border-[#E5E5E8] bg-white p-6 md:p-8 transition-opacity duration-200"
            >
              <PhaseTag phase={resultStage.phase} />
              <div className="mt-2 mb-3 text-sm font-semibold text-[#E5006D]">
                Stadie {resultStage.id} av 7
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#0B0B0F] tracking-tight leading-tight mb-5 flex items-start gap-3">
                <resultStage.Icon className="w-5 h-5 mt-1.5 text-[#5A5A66] flex-shrink-0" />
                <span>{resultStage.title}</span>
              </h3>

              <div className="space-y-4 text-[15px] sm:text-base text-[#5A5A66] leading-relaxed">
                {resultStage.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <hr className="my-6 border-[#E5E5E8]" />

              <div className="rounded-xl bg-[#FFF0F6] border border-[#E5006D]/30 p-5 sm:p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E5006D] mb-2">
                  Nästa steg
                </div>
                <p className="text-[15px] text-[#0B0B0F] leading-relaxed mb-4">
                  {resultStage.nextStep.helper}
                </p>
                {resultStage.nextStep.options ? (
                  <div className="flex flex-wrap gap-2">
                    {resultStage.nextStep.options.map((opt) => (
                      <a
                        key={opt.href}
                        href={opt.href}
                        className={`inline-flex items-center gap-1.5 rounded-lg bg-[#E5006D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c9005f] transition-colors ${focusRing}`}
                      >
                        {opt.label} →
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    href={resultStage.nextStep.href}
                    className={`inline-flex items-center gap-2 rounded-lg bg-[#E5006D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c9005f] transition-colors ${focusRing}`}
                  >
                    {resultStage.nextStep.label} →
                  </a>
                )}
              </div>

              <div className="mt-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66] mb-2">
                  Användbart hos oss
                </div>
                <a
                  href={resultStage.recommendationHref}
                  className={`text-[15px] font-medium text-[#E5006D] hover:underline underline-offset-4 ${focusRing} rounded`}
                >
                  {resultStage.recommendation} →
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E8] flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={scrollToOverview}
                  className={`text-sm font-medium text-[#0B0B0F] hover:text-[#E5006D] ${focusRing} rounded`}
                >
                  Visa alla stadier
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className={`text-sm font-medium text-[#5A5A66] hover:text-[#0B0B0F] ${focusRing} rounded`}
                >
                  Gör om självskattningen
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Overview */}
        {!compact && (
        <div ref={overviewRef} className="scroll-mt-24">
          <header className="mb-8 md:mb-10 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0B0B0F] mb-2">
              De sju stadierna i en köpresa för ERP och CRM
            </h3>
            <p className="text-base text-[#5A5A66] leading-relaxed">
              Klicka på det stadie som känns mest likt er situation just nu.
            </p>
          </header>

          <div className="space-y-10">
            {(Object.keys(grouped) as Phase[]).map((phase) => (
              <div key={phase}>
                <div className="mb-4">
                  <PhaseTag phase={phase} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {grouped[phase].map((stage) => {
                    const isOpen = !!expanded[stage.id];
                    return (
                      <article
                        key={stage.id}
                        className="rounded-xl border border-[#E5E5E8] bg-white p-6 transition-shadow duration-200 hover:shadow-md flex flex-col"
                      >
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66] mb-2">
                          Stadie {stage.id}
                        </div>
                        <h4 className="text-lg font-semibold text-[#0B0B0F] leading-snug mb-3 flex items-start gap-2">
                          <stage.Icon className="w-4 h-4 mt-1 text-[#5A5A66] flex-shrink-0" />
                          <span>{stage.title}</span>
                        </h4>
                        <p className="text-sm text-[#5A5A66] leading-relaxed mb-4">
                          {stage.paragraphs[0]}
                        </p>

                        {isOpen && (
                          <div className="mb-4 space-y-4 text-sm text-[#5A5A66] leading-relaxed border-t border-[#E5E5E8] pt-4">
                            <p>{stage.paragraphs[1]}</p>
                            <div className="rounded-lg bg-[#FFF0F6] border border-[#E5006D]/30 p-4">
                              <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#E5006D] mb-1.5">
                                Nästa steg
                              </div>
                              <p className="text-sm text-[#0B0B0F] mb-3">{stage.nextStep.helper}</p>
                              {stage.nextStep.options ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {stage.nextStep.options.map((opt) => (
                                    <a
                                      key={opt.href}
                                      href={opt.href}
                                      className={`inline-flex items-center gap-1 rounded-md bg-[#E5006D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#c9005f] transition-colors ${focusRing}`}
                                    >
                                      {opt.label} →
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <a
                                  href={stage.nextStep.href}
                                  className={`inline-flex items-center gap-1.5 rounded-md bg-[#E5006D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#c9005f] transition-colors ${focusRing}`}
                                >
                                  {stage.nextStep.label} →
                                </a>
                              )}
                            </div>
                            <div>
                              <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#5A5A66] mb-1.5">
                                Användbart hos oss
                              </div>
                              <a
                                href={stage.recommendationHref}
                                className={`text-sm font-medium text-[#E5006D] hover:underline underline-offset-4 ${focusRing} rounded`}
                              >
                                {stage.recommendation} →
                              </a>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((prev) => ({ ...prev, [stage.id]: !prev[stage.id] }))
                          }
                          aria-expanded={isOpen}
                          className={`mt-auto self-start text-sm font-medium text-[#E5006D] hover:underline underline-offset-4 ${focusRing} rounded`}
                        >
                          {isOpen ? "Visa mindre" : "Läs mer →"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

      </div>
    </section>
  );
};

export default BuyerJourneyStages;
