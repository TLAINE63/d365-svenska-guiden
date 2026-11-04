import { CalendarDays, Mail } from "lucide-react";
import { ADVISOR_BOOKING_URL, ADVISOR_BOOKING_CTA, ADVISOR_EMAIL_HREF } from "@/data/organization";
import { trackConsultationLead } from "@/lib/siteIntelligence";

/** Ämnesrad i mejlet till Thomas. */
export const ADVISOR_EMAIL_SUBJECT = "Boka 20 minuters kostnadsfri rådgivning";
export const ADVISOR_EMAIL_WITH_SUBJECT = `${ADVISOR_EMAIL_HREF}?subject=${encodeURIComponent(ADVISOR_EMAIL_SUBJECT)}`;
/** Kort variant när den fulla knapptexten inte får plats. */
export const ADVISOR_BOOKING_CTA_SHORT = "Boka en kostnadsfri rådgivning";

interface Props {
  /** compact = kort text för smala ytor. */
  compact?: boolean;
  /** dark = ljus text på mörk bakgrund. */
  dark?: boolean;
  className?: string;
}

/** Två vägar till rådgivning med Thomas: Bookings eller mejl. Spåras via Site Intelligence utan PII. */
export default function AdvisorContactButtons({ compact = false, dark = false, className = "" }: Props) {
  const secondary = dark
    ? "border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
    : "border-border text-foreground hover:bg-primary/10 hover:text-primary";
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <a
        href={ADVISOR_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackConsultationLead("bookings_20min_thomas")}
        className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 font-semibold text-primary-foreground hover:bg-primary/90 ${compact ? "text-xs" : "text-sm"}`}
      >
        <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
        {compact ? ADVISOR_BOOKING_CTA_SHORT : ADVISOR_BOOKING_CTA}
      </a>
      <a
        href={ADVISOR_EMAIL_WITH_SUBJECT}
        onClick={() => trackConsultationLead("email_cta_thomas")}
        className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-3 py-2 font-semibold ${secondary} ${compact ? "text-xs" : "text-sm"}`}
      >
        <Mail className="h-4 w-4 shrink-0" aria-hidden />
        {compact ? "Mejla" : "Mejla Thomas"}
      </a>
    </div>
  );
}
