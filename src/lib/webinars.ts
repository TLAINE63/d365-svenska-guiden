export const WEBINAR_CONSENT_VERSION = "webinar-2026-11-v1";
export const NEWSLETTER_CONSENT_VERSION = "nyhetsbrev-2026-11-v1";
export const WEBINAR_PUBLIC_SELECT = "id,slug,title,description,body,starts_at,duration_min,theme,speakers,recording_url,status,created_at,updated_at";

export type ContentTheme = "partnerval" | "pris" | "migrering" | "business-central" | "fscm" | "crm" | "ai";
export type WebinarStatus = "utkast" | "publicerad" | "genomford" | "installd";

export interface PublicWebinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string | null;
  starts_at: string;
  duration_min: number;
  theme: ContentTheme;
  speakers: string | null;
  recording_url: string | null;
  status: WebinarStatus;
  created_at: string;
  updated_at: string;
}

export function webinarEndsAt(webinar: Pick<PublicWebinar, "starts_at" | "duration_min">): Date {
  return new Date(new Date(webinar.starts_at).getTime() + webinar.duration_min * 60_000);
}

export function formatWebinarDate(webinar: Pick<PublicWebinar, "starts_at" | "duration_min">): string {
  const start = new Date(webinar.starts_at);
  const end = webinarEndsAt(webinar);
  const date = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm", weekday: "long", day: "numeric", month: "long",
  }).format(start);
  const time = (value: Date) => new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(value).replace(":", ".");
  return `${date} kl. ${time(start)}–${time(end)}`;
}

export function webinarSchema(webinar: PublicWebinar) {
  const url = `https://d365.se/webinar/${webinar.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: webinar.title,
    description: webinar.description,
    startDate: webinar.starts_at,
    endDate: webinarEndsAt(webinar).toISOString(),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: webinar.status === "installd" ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url },
    url,
    image: "https://d365.se/og-erp.png",
    organizer: { "@type": "Organization", name: "d365.se", url: "https://d365.se/" },
    performer: webinar.speakers ? { "@type": "Person", name: webinar.speakers } : undefined,
    offers: { "@type": "Offer", price: "0", priceCurrency: "SEK", availability: "https://schema.org/InStock", url },
  };
}

function icsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
function icsEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function publicWebinarIcs(webinar: PublicWebinar): string {
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//d365.se//Webinar//SV", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:webinar-${webinar.id}@d365.se`, `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART:${icsUtc(new Date(webinar.starts_at))}`, `DTEND:${icsUtc(webinarEndsAt(webinar))}`,
    `SUMMARY:${icsEscape(webinar.title)}`,
    `DESCRIPTION:${icsEscape(`${webinar.description}\n\nhttps://d365.se/webinar/${webinar.slug}/`)}`,
    "LOCATION:Online", `URL:https://d365.se/webinar/${webinar.slug}/`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadPublicWebinarIcs(webinar: PublicWebinar): void {
  const blob = new Blob([publicWebinarIcs(webinar)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `webinar-${webinar.slug}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
