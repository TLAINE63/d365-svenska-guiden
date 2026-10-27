import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Compass, FileText, Users, ClipboardList, Calculator, Scale } from "lucide-react";
import { track } from "@/lib/track";

/**
 * Sales-köpresan: tre köparlägen och ett samlat beslutsunderlag.
 * Återanvänder befintliga verktyg och sidor; lägger inte till nya fakta.
 */
const PATHS = [
  { key: "assess", Icon: Compass, who: "Vi är osäkra på vad vi behöver", title: "Analysera vårt CRM-behov", to: "/d365sales/matchningstest/", primary: true },
  { key: "build", Icon: FileText, who: "Vi utvärderar Dynamics\u00A0365 Sales", title: "Bygg vårt beslutsunderlag", to: "#crm-beslutsunderlag", primary: false },
  { key: "match", Icon: Users, who: "Vi vet vad vi behöver", title: "Hitta rätt Sales-partner", to: "/dynamics-365-crm-partners-sverige/", primary: false },
] as const;

const PROBLEMS = [
  "Kundinformationen ligger utspridd i mejl, Excel och olika system.",
  "Säljpipelinen är svår att överblicka.",
  "Säljprocessen skiljer sig mellan säljarna.",
  "Uppföljningen sker manuellt och faller mellan stolarna.",
  "Ledningen saknar en pipeline och prognos att lita på.",
  "CRM och affärssystemet fungerar dåligt tillsammans.",
];

const BUILD = [
  { key: "behov", Icon: Compass, label: "Behov", q: "Vad behöver säljorganisationen faktiskt?", cta: "Gör CRM-behovsanalysen", to: "/CRMbehovsanalys/" },
  { key: "krav", Icon: ClipboardList, label: "Krav", q: "Vilka CRM-krav ska partners kunna möta?", cta: "Ta fram kravspecifikation", to: "/kravspecifikation-sales/" },
  { key: "kostnad", Icon: Calculator, label: "Kostnad", q: "Vad påverkar investering och löpande kostnad?", cta: "Räkna TCO/ROI", to: "/d365sales/roi-kalkylator/" },
  { key: "utvardering", Icon: Scale, label: "Utvärdering", q: "Hur jämför vi lösningar och partnerförslag?", cta: "Samla i Min D365-plan", to: "/underlag/" },
] as const;

export default function SalesDecisionGuide() {
  const onClick = (key: string, to: string, position: string) =>
    track("sales_journey_cta", { path: key, to, position }, null, "sales");

  return (
    <section aria-labelledby="sales-decision-heading" className="py-8 sm:py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 id="sales-decision-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
          Behöver vi byta eller förbättra vårt CRM?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-3xl">
          Känner ni igen flera av de här problemen är det värt att se över säljstödet. Det betyder inte automatiskt att Dynamics&nbsp;365 Sales är svaret, ibland räcker ett enklare CRM eller ett bättre arbetssätt.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2 mb-8 max-w-4xl">
          {PROBLEMS.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-foreground">
              <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Är Dynamics&nbsp;365 Sales rätt väg för oss?</h2>
        <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-3xl">
          Börja där ni befinner er. Ni behöver inte gå igenom alla steg.
        </p>
        <div className="grid gap-2 sm:gap-3 md:grid-cols-3 mb-8 sm:mb-10">
          {PATHS.map(({ key, Icon, who, title, to, primary }) => {
            const cls = `group flex flex-col rounded-lg border px-4 py-3 sm:p-4 transition-colors ${
              primary ? "border-primary bg-primary/5 hover:bg-primary/10" : "border-border bg-card hover:bg-secondary/50"
            }`;
            const inner = (
              <>
                <Icon className="hidden sm:block h-5 w-5 text-accent mb-2" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{who}</span>
                <span className="font-semibold text-foreground inline-flex items-center gap-1.5">
                  {title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </>
            );
            return to.startsWith("#") ? (
              <a key={key} href={to} onClick={() => onClick(key, to, "top")} className={cls}>{inner}</a>
            ) : (
              <Link key={key} to={to} onClick={() => onClick(key, to, "top")} className={cls}>{inner}</Link>
            );
          })}
        </div>

        <h2 id="crm-beslutsunderlag" className="scroll-mt-32 border-t border-border pt-8 text-xl sm:text-2xl font-bold text-foreground mb-2">
          Bygg ert CRM-beslutsunderlag
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
          Fyra delar som gör att olika lösningar och partnerförslag går att jämföra på samma grund.
        </p>
        <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUILD.map(({ key, Icon, label, q, cta, to }) => (
            <Link
              key={key}
              to={to}
              onClick={() => onClick(key, to, "build")}
              className="group flex flex-col rounded-lg border border-border bg-card px-4 py-3 sm:p-4 hover:bg-secondary/50 transition-colors"
            >
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                <Icon className="h-4 w-4 text-accent" aria-hidden /> {label}
              </span>
              <span className="text-sm text-foreground mb-2">{q}</span>
              <span className="mt-auto text-sm font-semibold text-primary inline-flex items-center gap-1">
                {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
