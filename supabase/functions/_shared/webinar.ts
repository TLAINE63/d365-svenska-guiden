export interface WebinarMailRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  starts_at: string;
  duration_min: number;
  speakers: string | null;
  join_url: string | null;
  recording_url: string | null;
}

export const WEBINAR_CONSENT_VERSION = "webinar-2026-11-v1";
export const NEWSLETTER_CONSENT_VERSION = "nyhetsbrev-2026-11-v1";

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] || char));
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32))).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function webinarEndsAt(webinar: Pick<WebinarMailRecord, "starts_at" | "duration_min">): Date {
  return new Date(new Date(webinar.starts_at).getTime() + webinar.duration_min * 60_000);
}

export function formatWebinarDate(webinar: Pick<WebinarMailRecord, "starts_at" | "duration_min">): string {
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

export function webinarExportDate(webinar: Pick<WebinarMailRecord, "starts_at">): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(webinar.starts_at));
}

function icsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function icsEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function webinarIcs(webinar: WebinarMailRecord): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//d365.se//Webinar//SV",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:webinar-${webinar.id}@d365.se`,
    `DTSTAMP:${icsUtc(new Date())}`,
    `DTSTART:${icsUtc(new Date(webinar.starts_at))}`,
    `DTEND:${icsUtc(webinarEndsAt(webinar))}`,
    `SUMMARY:${icsEscape(webinar.title)}`,
    `DESCRIPTION:${icsEscape(`${webinar.description}${webinar.join_url ? `\n\nLänk till webinaret: ${webinar.join_url}` : ""}`)}`,
    "LOCATION:Online",
    `URL:${webinar.join_url || `https://d365.se/webinar/${webinar.slug}/`}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function webinarIcsBase64(webinar: WebinarMailRecord): string {
  const bytes = new TextEncoder().encode(webinarIcs(webinar));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function webinarEmailHtml(options: {
  webinar: WebinarMailRecord;
  heading: string;
  intro: string;
  cancelToken: string;
  includeJoinLink?: boolean;
  includeRecordingLink?: boolean;
}): string {
  const { webinar, heading, intro, cancelToken } = options;
  const actionUrl = options.includeRecordingLink && webinar.recording_url
    ? webinar.recording_url
    : options.includeJoinLink
      ? webinar.join_url
      : `https://d365.se/webinar/${webinar.slug}/`;
  const actionLabel = options.includeRecordingLink
    ? "Se inspelningen"
    : options.includeJoinLink
      ? "Gå med i webinaret"
      : "Läs mer om webinaret";
  const cancelUrl = `https://d365.se/webinar/avanmal/?t=${encodeURIComponent(cancelToken)}`;
  return `
    <h1 style="font-size:22px;margin:0 0 14px">${escapeHtml(heading)}</h1>
    <p style="margin:0 0 16px">${escapeHtml(intro)}</p>
    <div style="border:1px solid #D8D1C6;background:#F5F2EC;padding:18px;margin:0 0 20px">
      <strong style="font-size:17px">${escapeHtml(webinar.title)}</strong><br>
      <span>${escapeHtml(formatWebinarDate(webinar))}</span><br>
      <span>Webinar, ${webinar.duration_min} minuter, kostnadsfritt</span>
      ${webinar.speakers ? `<br><span>Talare: ${escapeHtml(webinar.speakers)}</span>` : ""}
    </div>
    ${actionUrl ? `<p style="margin:0 0 22px"><a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#0E7C86;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">${actionLabel}</a></p>` : ""}
    <p style="margin:0 0 12px;font-size:13px;color:#555">Kalenderbilagan finns med i bekräftelsemejlet. Spara den gärna i din kalender.</p>
    <p style="margin:0;font-size:13px;color:#555"><a href="${escapeHtml(cancelUrl)}" style="color:#007C68">Avanmäl mig</a> från detta webinar. Då stoppas fler mejl om webinaret.</p>`;
}
