import { Link } from "react-router-dom";
import { ArrowRight, Calculator, CalendarClock, ClipboardList, Compass, Cpu, Scale, Smartphone, Wrench } from "lucide-react";
import { track } from "@/lib/track";

const CHOICES = [
  { Icon: CalendarClock, title: "Arbetsorder och planering", need: "Ni behöver styra vem som åker vart, när och med vilken kompetens, och planera om när något akut dyker upp.", next: "Utgå från hur många tekniker, uppdrag och omplaneringar ni har per dag." },
  { Icon: Smartphone, title: "Mobil tekniker", need: "Teknikerna behöver arbetsorder, kundhistorik, checklistor och reservdelar i mobilen, ibland utan uppkoppling.", next: "Börja i teknikerns arbetsdag och vad som i dag registreras dubbelt." },
  { Icon: Cpu, title: "Förebyggande underhåll", need: "Utrustning ska servas enligt avtal eller larma själv innan den går sönder.", next: "Kartlägg serviceavtal, utrustningsregister och vilka signaler som finns i dag." },
  { Icon: Wrench, title: "Kopplat till kundservice och affärssystem", need: "Ärenden, arbetsorder, lager och fakturering ska hänga ihop utan manuell överföring.", next: "Bedöm integrationen mot ert affärssystem och kundservice tidigt.", to: "/d365customerservice/", label: "Undersök Customer Service" },
] as const;
const BUILD = [
  { key: "behov", Icon: Compass, label: "Behov", question: "Hur ser ert serviceflöde ut från felanmälan till fakturering?", cta: "Analysera vårt servicebehov", to: "/kundservice-behovsanalys/" },
  { key: "krav", Icon: ClipboardList, label: "Krav", question: "Vilka krav på planering, mobilitet, SLA och integration ska partnern möta?", cta: "Ta fram en kravspecifikation", to: "/kravspecifikation-kundservice/?omraden=field_service,scheduling" },
  { key: "kostnad", Icon: Calculator, label: "Kostnad", question: "Hur påverkar antal tekniker, integrationer och förvaltning kostnadsbilden?", cta: "Beräkna TCO/ROI", to: "/d365fieldservice/roi-kalkylator/" },
  { key: "underlag", Icon: Scale, label: "Beslutsunderlag", question: "Vad behöver ni undersöka innan ni jämför partnerförslag?", cta: "Samla i Min D365-plan", to: "/underlag/" },
] as const;

export const trackFieldJourney = (path: string, to: string, position: string) =>
  track("field_journey_cta", { path, to, position }, null, "field");

export default function FieldServiceDecisionGuide() {
  return (
    <section aria-labelledby="field-decision-heading" className="border-t border-border bg-background py-8 sm:py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="field-decision-heading" className="mb-3 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">Var fastnar fältservicen i dag?</h2>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground md:text-base">Dubbelbokade tekniker, återbesök för att reservdelar saknas eller arbetsorder som faktureras sent kräver olika lösningar. Börja med vad som inte fungerar, inte med funktionslistan.</p>
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Vad behöver ni främst stöd för?</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {CHOICES.map((choice) => (
            <div key={choice.title} className="rounded-lg border border-border bg-card p-4">
              <choice.Icon className="mb-2 h-5 w-5 text-accent" aria-hidden />
              <h3 className="mb-2 font-semibold text-foreground">{choice.title}</h3>
              <p className="mb-2 text-sm text-foreground/85">{choice.need}</p>
              <p className="text-sm text-muted-foreground">{choice.next}</p>
              {"to" in choice && <Link to={choice.to} onClick={() => trackFieldJourney("customer-service", choice.to, "decision")} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">{choice.label}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden /></Link>}
            </div>
          ))}
        </div>
        <h3 className="mb-2 font-semibold text-foreground">När passar Field Service mindre bra?</h3>
        <p className="mb-8 max-w-3xl text-sm text-muted-foreground">Med ett fåtal tekniker, enkel planering och inget behov av koppling till kundservice eller affärssystem räcker ofta ett enklare planeringsverktyg eller funktionerna i ert affärssystem. Matchningstestet visar ärligt om lösningen sannolikt är överdimensionerad för er.</p>
        <h2 id="field-beslutsunderlag" className="mb-3 scroll-mt-32 border-t border-border pt-8 text-xl font-bold text-foreground sm:text-2xl">Bygg ert beslutsunderlag för fältservice</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUILD.map(({ key, Icon, label, question, cta, to }) => (
            <Link key={key} to={to} onClick={() => trackFieldJourney(key, to, "build")} className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50">
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
