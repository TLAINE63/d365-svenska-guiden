import { lazy, Suspense, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADVISOR_BOOKING_URL, ORGANIZATION } from "@/data/organization";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import type { AdvisoryPlacement, ContactSection } from "@/components/plan/PlanContactDialog";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));
interface Props {
  placement: string;
  advisoryPlacement?: AdvisoryPlacement;
  sections?: ContactSection[];
  metadata?: Record<string, unknown>;
  submitEvent?: string;
  className?: string;
}
export default function BookingOffer({ placement, advisoryPlacement = "tool_result", sections = [], metadata = {}, submitEvent = "advisory_booking_completed", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [sourcePage, setSourcePage] = useState("");
  const thomas = ORGANIZATION.advisors[0];
  return (
    <section data-booking-placement={placement} data-next-step-block="" className={`print:hidden border-t border-border py-8 ${className}`} aria-label="Kostnadsfri rådgivning">
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">20 minuter med {thomas.name}: en second opinion inför ert val</h2>
      <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">Du berättar var ni står, jag berättar vad jag ser och vad jag skulle ta reda på härnäst. Kostnadsfritt. Inga partners deltar om du inte själv vill bli introducerad.</p>
      <p className="mt-5 mb-2 font-semibold text-sm text-foreground">Passar om</p>
      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
        <li>ni funderar på att byta eller uppgradera CRM- eller affärssystem (ERP)</li>
        <li>ni har fått offerter och vill ha en second opinion</li>
        <li>ni vill veta vilka partners som brukar passa er storlek och bransch</li>
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">{thomas.name} har arbetat med Dynamics i 30 år, bland annat 13 år på Microsoft, och är medgrundare av d365.se.</p>
      <div className="mt-5 flex flex-col items-start gap-2">
        <Button asChild><a href={ADVISOR_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackFunnelEvent({ event_type: "cta_click", event_name: "booking_click", metadata: { placement, path: window.location.pathname } })}><CalendarDays className="h-4 w-4 mr-2" aria-hidden="true" />Boka 20 minuter</a></Button>
        <Button variant="link" className="px-0 h-auto whitespace-normal text-left" onClick={() => { setSourcePage(`${window.location.pathname}#${placement}`); setOpen(true); }}>Hellre att jag hör av mig</Button>
      </div>
      {open && <Suspense fallback={null}><PlanContactDialog mode="advisory" onClose={() => setOpen(false)} topic={{ title: "Prata med d365.se", description: "Thomas hör av sig för att resonera om ert behov. Kostnadsfritt. Inget skickas till någon partner utan ert godkännande.", helpWith: "En second opinion inför ert val", startEvent: "advisory_form_opened", submitEvent, sourcePage, extras: sections, metadata, advisory: { placement: advisoryPlacement, cta: "Hellre att jag hör av mig", pageType: placement } }} /></Suspense>}
    </section>
  );
}