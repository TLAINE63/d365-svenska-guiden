import { Link } from "react-router-dom";
import { ArrowRight, Compass, FileText, Users, ClipboardList, Calculator, Scale, Database, Send, Layers } from "lucide-react";
import { track } from "@/lib/track";

/**
 * Customer Insights-köpresan: Journeys, Data eller båda, tre köparlägen och ett samlat beslutsunderlag.
 * Återanvänder befintliga verktyg och sidinnehåll; lägger inte till nya fakta.
 */
const PATHS = [
  { key: "assess", Icon: Compass, who: "Vi är osäkra på vad vi behöver", title: "Analysera vårt behov", to: "/d365marketing/matchningstest/", primary: true },
  { key: "build", Icon: FileText, who: "Vi utvärderar Customer Insights", title: "Bygg vårt beslutsunderlag", to: "#ci-beslutsunderlag", primary: false },
  { key: "match", Icon: Users, who: "Vi vet vad vi behöver", title: "Hitta rätt partner", to: "/dynamics-365-crm-partners-sverige/", primary: false },
] as const;

const CHOICES = [
  {
    key: "journeys", Icon: Send, title: "Marketing automation", product: "Customer Insights – Journeys",
    when: "Ni behöver kundresor, segment och utskick i flera kanaler, med leads som lämnas över till sälj.",
    note: "B2B-företag som främst arbetar i Dynamics\u00A0365 Sales behöver ofta bara Journeys.",
  },
  {
    key: "data", Icon: Database, title: "Samla och aktivera kunddata", product: "Customer Insights – Data (CDP)",
    when: "Kunddata finns i flera källor (CRM, affärssystem, webb, butik) och ska bli en gemensam kundprofil för segmentering.",
    note: "Mest värdefullt med stora kundvolymer och många datakällor, ofta B2C. Utan fungerande kunddata har en CDP inget att bygga på.",
  },
  {
    key: "both", Icon: Layers, title: "Båda", product: "Data + Journeys",
    when: "Ni vill både samla kunddatan och använda den direkt i kundresor och kampanjer.",
    note: "Störst projekt: datakällor, samtycke och integrationer avgör tid och kostnad.",
  },
] as const;

const BUILD = [
  { key: "behov", Icon: Compass, label: "Behov", q: "Vad behöver marknad, sälj och service?", cta: "Gör behovsanalysen", to: "/CRMbehovsanalys/" },
  { key: "krav", Icon: ClipboardList, label: "Krav och data", q: "Vilka datakällor, integrationer och krav ska partnern hantera?", cta: "Ta fram kravspecifikation", to: "/kravspecifikation-marketing/" },
  { key: "kostnad", Icon: Calculator, label: "Kostnad", q: "Vilka faktorer påverkar investeringen?", cta: "Räkna TCO/ROI", to: "/d365marketing/roi-kalkylator/" },
  { key: "utvardering", Icon: Scale, label: "Beslutsunderlag", q: "Hur får vi ett jämförbart underlag inför partnerdialog?", cta: "Samla i Min D365-plan", to: "/underlag/" },
] as const;

export default function InsightsDecisionGuide() {
  const onClick = (key: string, to: string, position: string) =>
    track("insights_journey_cta", { path: key, to, position }, null, "insights");

  return (
    <section aria-labelledby="ci-decision-heading" className="py-8 sm:py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <h2 id="ci-decision-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
          Journeys, Data eller båda?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-5 max-w-3xl">
          Det är det första vägvalet. Behöver ni främst nyhetsbrev och enkla flöden kan ett enklare marketing automation-verktyg räcka.
        </p>
        <div className="grid gap-3 md:grid-cols-3 mb-8 sm:mb-10">
          {CHOICES.map(({ key, Icon, title, product, when, note }) => (
            <div key={key} className="rounded-lg border border-border bg-card p-4">
              <Icon className="h-5 w-5 text-accent mb-2" aria-hidden />
              <p className="font-semibold text-foreground">{title}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{product}</p>
              <p className="text-sm text-foreground/85 mb-2">{when}</p>
              <p className="text-sm text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Är Customer Insights rätt väg för oss?</h2>
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

        <h2 id="ci-beslutsunderlag" className="scroll-mt-32 border-t border-border pt-8 text-xl sm:text-2xl font-bold text-foreground mb-2">
          Bygg ert beslutsunderlag
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
