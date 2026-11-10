import { lazy, Suspense, useState } from "react";
import { CalendarDays } from "lucide-react";
import { ADVISOR_BOOKING_URL, ADVISOR_BOOKING_CTA, ADVISOR_EMAIL_HREF } from "@/data/organization";
import { trackConsultationLead } from "@/lib/siteIntelligence";
import type { ContactTopic } from "@/components/plan/PlanContactDialog";

const PlanContactDialog = lazy(() => import("@/components/plan/PlanContactDialog"));

/** Ämnesrad i mejlet till Thomas. */
export const ADVISOR_EMAIL_SUBJECT = "Boka 20 minuters kostnadsfri rådgivning";
export const ADVISOR_EMAIL_WITH_SUBJECT = `${ADVISOR_EMAIL_HREF}?subject=${encodeURIComponent(ADVISOR_EMAIL_SUBJECT)}`;
/** Kort variant när den fulla knapptexten inte får plats. */
export const ADVISOR_BOOKING_CTA_SHORT = "Boka en kostnadsfri rådgivning";

/** Förfrågan om 20-minutersmötet. Blir ett rådgivningsärende som Thomas svarar på. */
export const MEETING_TOPIC: ContactTopic = {
  title: "Boka 20 minuters kostnadsfri rådgivning",
  description: "Berätta kort vad ni vill prata om. Thomas Laine svarar personligen och föreslår en tid. Ingen partner deltar och inget skickas vidare.",
  helpWith: "20 minuters rådgivning",
  startEvent: "advisory_meeting_form_opened",
  submitEvent: "advisory_meeting_requested",
  advisory: { placement: "meeting_20min", cta: "Boka 20 min rådgivning", pageType: "advisor_buttons" },
  messageLabel: "Vad vill ni prata om? Föreslå gärna några tider som passar (valfritt)",
  doneTitle: "Tack, Thomas har fått er förfrågan",
  doneNotes: ["Thomas svarar personligen via e-post och föreslår en tid för mötet.", "Ingen partner har kontaktats."],
};

interface Props {
  /** compact = kort text för smala ytor. */
  compact?: boolean;
  /** dark = ljus text på mörk bakgrund. */
  dark?: boolean;
  className?: string;
  /** Egen knapptext för bokningsknappen (t.ex. "Boka 20 min rådgivning"). */
  bookingLabel?: string;
}

/** Vägar till rådgivning med Thomas: förfrågan via formulär (blir ett ärende), mejl eller direkt i kalendern. */
export default function AdvisorContactButtons({ compact = false, dark = false, className = "", bookingLabel }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 font-semibold text-primary-foreground hover:bg-primary/90 ${compact ? "text-xs" : "text-sm"}`}
        >
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          {bookingLabel ?? (compact ? ADVISOR_BOOKING_CTA_SHORT : ADVISOR_BOOKING_CTA)}
        </button>
        <a
          href={ADVISOR_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConsultationLead("bookings_20min_thomas")}
          className={`inline-flex min-h-10 items-center px-1 font-medium underline underline-offset-4 ${compact ? "text-xs" : "text-sm"} ${dark ? "text-primary-foreground/85 hover:text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}
        >
          eller välj en tid i kalendern
        </a>
      </div>
      {open && (
        <Suspense fallback={null}>
          <PlanContactDialog mode="advisory" topic={MEETING_TOPIC} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
