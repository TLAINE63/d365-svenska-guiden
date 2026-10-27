import { Link } from "react-router-dom";
import { ArrowRight, Bot, Calculator, ClipboardList, Compass, Headphones, LineChart, MessagesSquare, Scale } from "lucide-react";
import { track } from "@/lib/track";

const CHOICES = [
  { Icon: Headphones, title: "Telefoni, köer och dirigering", need: "Samtal och kontakter ska nå rätt agent snabbt, med IVR, köer och prioritering.", next: "Utgå från volymer, toppar och hur dagens växel och köer fungerar." },
  { Icon: MessagesSquare, title: "Fler kanaler i samma vy", need: "Chatt, sms, sociala kanaler och mejl ska hanteras av samma agenter med samma kundhistorik.", next: "Börja med vilka kanaler kunderna faktiskt använder, inte alla som finns." },
  { Icon: Bot, title: "AI och självservice", need: "Röstbotar eller virtuella agenter ska ta enkla frågor och Copilot stötta agenten i realtid.", next: "Kontrollera att kunskapsbasen håller och att det finns en tydlig väg till människa." },
  { Icon: LineChart, title: "Bemanning och kvalitet", need: "Teamledare behöver realtidsläge, skiftplanering och kvalitetsuppföljning av samtal.", next: "Bedöm om ni behöver WFM och kvalitetsverktyg inbyggt eller via tillägg." },
] as const;
const BUILD = [
  { key: "behov", Icon: Compass, label: "Behov", question: "Vilka kanaler, volymer och flöden behöver kontaktcentret klara?", cta: "Analysera vårt kundservicebehov", to: "/kundservice-behovsanalys/" },
  { key: "krav", Icon: ClipboardList, label: "Krav", question: "Vilka krav på telefoni, dirigering, AI och integration ska partnern möta?", cta: "Ta fram en kravspecifikation", to: "/kravspecifikation-kundservice/?omraden=contact_center,channels,queues_routing" },
  { key: "kostnad", Icon: Calculator, label: "Kostnad", question: "Hur påverkar agenter, kanaler och samtalsminuter kostnadsbilden?", cta: "Beräkna TCO/ROI", to: "/d365contactcenter/roi-kalkylator/" },
  { key: "underlag", Icon: Scale, label: "Beslutsunderlag", question: "Vad behöver ni undersöka innan ni jämför partnerförslag?", cta: "Samla i Min D365-plan", to: "/underlag/" },
] as const;

export const trackContactJourney = (path: string, to: string, position: string) =>
  track("contact_journey_cta", { path, to, position }, null, "contact");

export default function ContactCenterDecisionGuide() {
  return (
    <section aria-labelledby="contact-decision-heading" className="border-t border-border bg-background py-8 sm:py-10">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="contact-decision-heading" className="mb-3 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">Var fastnar kundkontakten i dag?</h2>
        <p className="mb-6 max-w-3xl text-sm text-muted-foreground md:text-base">Långa köer, kunder som måste upprepa sig mellan kanaler eller agenter som letar svar kräver olika lösningar. Börja med vad som inte fungerar, inte med funktionslistan.</p>
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Vad behöver ni främst stöd för?</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {CHOICES.map((choice) => (
            <div key={choice.title} className="rounded-lg border border-border bg-card p-4">
              <choice.Icon className="mb-2 h-5 w-5 text-accent" aria-hidden />
              <h3 className="mb-2 font-semibold text-foreground">{choice.title}</h3>
              <p className="mb-2 text-sm text-foreground/85">{choice.need}</p>
              <p className="text-sm text-muted-foreground">{choice.next}</p>
                          </div>
          ))}
        </div>
        <h3 className="mb-2 font-semibold text-foreground">När passar Contact Center mindre bra?</h3>
        <p className="mb-8 max-w-3xl text-sm text-muted-foreground">Om behovet främst är att ärenden får en ägare, uppföljning och SLA, utan egen telefoni eller många kanaler, börjar ni hellre med <Link to="/d365customerservice/" onClick={() => trackContactJourney("customer-service", "/d365customerservice/", "decision")} className="text-primary underline underline-offset-4">Customer Service</Link>. Med liten volym och få kanaler räcker ofta ett enklare kontaktverktyg. Matchningstestet visar ärligt om lösningen sannolikt är överdimensionerad.</p>
        <h2 id="contact-beslutsunderlag" className="mb-3 scroll-mt-32 border-t border-border pt-8 text-xl font-bold text-foreground sm:text-2xl">Bygg ert beslutsunderlag för kontaktcenter</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BUILD.map(({ key, Icon, label, question, cta, to }) => (
            <Link key={key} to={to} onClick={() => trackContactJourney(key, to, "build")} className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50">
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
