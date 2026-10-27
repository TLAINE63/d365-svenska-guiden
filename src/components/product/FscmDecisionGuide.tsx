import { Link } from "react-router-dom";
import { ArrowRight, Scale, Calculator, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { track } from "@/lib/track";

/**
 * F&SCM-pilot: beslutsstöd högt upp på produktsidan.
 * Återanvänder befintliga sidor (jämförelse, kostnad, partnerlista, matchningstest)
 * och lägger inte till nya fakta, priser eller partnerkompetenser.
 */
const PATHS = [
  {
    key: "matchtest",
    Icon: Scale,
    who: "1. Matcha produkt",
    title: "Osäker? Gör matchningstestet",
    to: "/finance-supply-chain-management/matchningstest/",
    primary: true,
  },
  {
    key: "cost",
    Icon: Calculator,
    who: "2. Bygg beslutsunderlag",
    title: "Räkna TCO/ROI och ta fram kravbild",
    to: "/finance-supply-chain/roi-kalkylator/",
    primary: false,
  },
  {
    key: "partner",
    Icon: Users,
    who: "3. Matcha partner",
    title: "Jämför F&SCM-partners",
    to: "/finance-supply-chain-partners-sverige/",
    primary: false,
  },
] as const;

const FIT = [
  {
    title: "Finance kan vara relevant när ...",
    items: [
      "ni har flera juridiska bolag, valutor eller länder att konsolidera",
      "ekonomistyrning, budget och regelefterlevnad är avancerad",
      "ekonomifunktionen behöver integreras mot många andra system",
    ],
  },
  {
    title: "Supply Chain Management kan vara relevant när ...",
    items: [
      "ni har egen produktion med avancerad planering (MRP/MPS)",
      "lager och warehouse management är kritiskt för leveranserna",
      "inköp, transport och planering spänner över flera enheter",
    ],
  },
  {
    title: "Bör utvärderas tillsammans när ...",
    items: [
      "ekonomi och logistik är tätt sammanvävda i samma flöden",
      "ni ersätter ett heltäckande ERP med global räckvidd",
      "produktion, lager och koncernekonomi behöver en gemensam datamodell",
    ],
  },
];

const LESS_FIT = [
  "Är verksamhetens processer så komplexa att de kräver en enterprise-plattform, eller räcker standardfunktioner?",
  "Har organisationen kapacitet att driva ett längre förändringsprojekt med intern projektledning?",
  "Hur många integrationer behövs egentligen, och vem förvaltar dem efter driftstart?",
  "Skulle ett enklare affärssystem, till exempel Business Central, täcka de funktionella kraven?",
];


const nb = (s: string) => s.replace(/Dynamics 365/g, "Dynamics\u00A0365");

export default function FscmDecisionGuide() {
  const onPath = (key: string, to: string, position: string) =>
    track("fscm_pilot_cta", { path: key, to, position }, null, "fscm");

  return (
    <section aria-labelledby="fscm-decision-heading" className="py-8 sm:py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 id="fscm-decision-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
          Var befinner ni er i beslutet?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-3xl">
          {nb("Finance hanterar ekonomi och finansiell styrning. Supply Chain Management hanterar produktion, lager, inköp och logistik. Tre steg: matcha produkten, bygg beslutsunderlaget, matcha partnern.")}
        </p>
        <div className="grid gap-2 sm:gap-3 md:grid-cols-3 mb-7 sm:mb-10">
          {PATHS.map(({ key, Icon, who, title, to, primary }) => (
            <Link
              key={key}
              to={to}
              onClick={() => onPath(key, to, "top")}
              className={`group flex flex-col rounded-lg border px-4 py-3 sm:p-4 transition-colors ${
                primary ? "border-primary bg-primary/5 hover:bg-primary/10" : "border-border bg-card hover:bg-secondary/50"
              }`}
            >
              <Icon className="hidden sm:block h-5 w-5 text-accent mb-2" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{who}</span>
              <span className="font-semibold text-foreground inline-flex items-center gap-1.5">
                {title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Passar Finance och Supply Chain Management oss?</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          Utgå från behov och komplexitet, inte från omsättning eller antal anställda.
        </p>
        <div className="grid gap-2 sm:gap-3 md:grid-cols-3 mb-7 sm:mb-10">
          {FIT.map((col) => (
            <div key={col.title} className="rounded-lg border border-border bg-card px-4 py-3 sm:p-4">
              <h3 className="font-semibold text-foreground mb-2">{col.title}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {col.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" aria-hidden />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">När passar det mindre bra?</h2>
          <p className="text-sm text-muted-foreground mb-3">Frågor att ställa innan ni går vidare:</p>
          <ul className="space-y-2 mb-4">
            {LESS_FIT.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-foreground">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" aria-hidden />
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              to="/affarssystem/#comparison"
              onClick={() => onPath("compare", "/affarssystem/#comparison", "less-fit")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Jämför med Business Central <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              to="/finance-supply-chain-management/matchningstest/"
              onClick={() => onPath("matchtest", "/finance-supply-chain-management/matchningstest/", "less-fit")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Låt matchningstestet avgöra <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
