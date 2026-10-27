import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calculator, ClipboardList, Compass, Headphones, Layers, ListChecks, Scale } from "lucide-react";
import { track } from "@/lib/track";

const CHOICES = [
  { Icon: ListChecks, title: "Ärendehantering", need: "Ni behöver gemensam ärendehistorik, ansvar, SLA och eskaleringar när kunder hör av sig.", next: "Utgå från era ärendeflöden och vilken kundinformation handläggaren behöver." },
  { Icon: Headphones, title: "Kontaktcenter", need: "Telefoni, flera kanaler, köer och bemanning är centrala delar av kundservicen.", next: "Bedöm kanal- och telefonibehovet separat från ärendehanteringen.", to: "/d365contactcenter/", label: "Undersök Contact Center" },
  { Icon: BookOpen, title: "Självservice", need: "Kunder ska kunna hitta svar, följa ärenden eller få hjälp utan att alltid kontakta en handläggare.", next: "Börja med kunskapsbasens kvalitet, behörigheter och en tydlig väg till mänsklig hjälp." },
  { Icon: Layers, title: "En kombination", need: "Kunden behöver kunna växla mellan självservice och personlig hjälp med samma ärendehistorik.", next: "Kartlägg hela flödet innan ni väljer kanaler, tillägg och integrationer." },
] as const;
const BUILD = [
  { key: "behov", Icon: Compass, label: "Behov", question: "Vilka ärenden, kanaler och serviceflöden behöver ni stödja?", cta: "Analysera vårt kundservicebehov", to: "/kundservice-behovsanalys/" },
  { key: "krav", Icon: ClipboardList, label: "Krav", question: "Vilka SLA, integrationer och krav på kunskapsbas ska partnern möta?", cta: "Ta fram en kravspecifikation", to: "/kravspecifikation-kundservice/" },
  { key: "kostnad", Icon: Calculator, label: "Kostnad", question: "Hur påverkar agenter, kanaler och förvaltning kostnadsbilden?", cta: "Beräkna TCO/ROI", to: "/d365customerservice/roi-kalkylator/" },
  { key: "underlag", Icon: Scale, label: "Beslutsunderlag", question: "Vad behöver ni undersöka innan ni jämför partnerförslag?", cta: "Samla i Min D365-plan", to: "/underlag/" },
] as const;

export const trackServiceJourney = (path: string, to: string, position: string) =>
  track("service_journey_cta", { path, to, position }, null, "service");

export default function ServiceDecisionGuide() {
  return (
    <section aria-labelledby="service-decision-heading" className="border-t border-border bg-background py-8 sm:py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="service-decision-heading" className="mb-3 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">Var fastnar kundservicen i dag?</h2>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground md:text-base">Ärenden som saknar ägare, kunder som måste upprepa sin fråga eller svar som är svåra att hitta kräver olika åtgärder. Börja med vad som inte fungerar, inte med att välja fler funktioner.</p>
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Behöver ni ärendehantering, kontaktcenter, självservice eller en kombination?</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {CHOICES.map((choice) => (
            <div key={choice.title} className="rounded-lg border border-border bg-card p-4">
              <choice.Icon className="mb-2 h-5 w-5 text-accent" aria-hidden />
              <h3 className="mb-2 font-semibold text-foreground">{choice.title}</h3>
              <p className="mb-2 text-sm text-foreground/85">{choice.need}</p>
              <p className="text-sm text-muted-foreground">{choice.next}</p>
              {"to" in choice && <Link to={choice.to} onClick={() => trackServiceJourney("contact-center", choice.to, "decision")} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">{choice.label}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>}
            </div>
          ))}
        </div>
        <p className="mb-8 max-w-3xl text-sm text-muted-foreground">Om problemen främst gäller tekniker ute hos kund, arbetsorder och reservdelar, <Link to="/d365fieldservice/" onClick={() => trackServiceJourney("field-service", "/d365fieldservice/", "decision")} className="text-primary underline underline-offset-4">undersök Field Service</Link>. Automatisering och AI kräver en användbar kunskapsbas, rätt behörigheter och någon som ansvarar för serviceprocesserna.</p>
        <h2 id="service-beslutsunderlag" className="mb-3 scroll-mt-32 border-t border-border pt-8 text-xl font-bold text-foreground sm:text-2xl">Bygg ert beslutsunderlag för kundservice</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUILD.map(({ key, Icon, label, question, cta, to }) => (
            <Link key={key} to={to} onClick={() => trackServiceJourney(key, to, "build")} className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50">
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground"><Icon className="h-4 w-4 text-accent" aria-hidden />{label}</span>
              <span className="mb-3 text-sm text-foreground">{question}</span>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary">{cta}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
