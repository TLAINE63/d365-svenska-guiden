// Anonyma köprese-händelser till Site Intelligence (internt analysverktyg).
// Skickas från webbläsaren eftersom mottagaren verifierar Origin = d365.se.
// Alla besökare räknas. Inga personuppgifter. Fel får aldrig påverka sidan.
const ENDPOINT = "https://sajt-analys.lovable.app/api/public/track-journey";

export type JourneyEvent = { type: string; url?: string; content_type?: string; meta?: Record<string, unknown> };

function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem("si_visitor_id");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("si_visitor_id", id); }
    return id;
  } catch { return null; }
}

export function trackJourney(event: JourneyEvent) {
  try {
    if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) return;
    const session = getVisitorId();
    if (!session) return;
    fetch(ENDPOINT, {
      method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: [{ session, type: event.type, url: event.url ?? window.location.pathname, content_type: event.content_type, meta: event.meta }] }),
    }).catch(() => {});
  } catch { /* ignore */ }
}

export function contentTypeForPath(p: string): string {
  if (/^\/(partner|basic)\//.test(p)) return "partner_profile";
  if (/jamfor|compare|\/vs-/.test(p)) return "comparison";
  if (/kostnad|pris|licens/.test(p)) return "pricing";
  if (/kunskapscenter|nyheter|partnernytt|artikel/.test(p)) return "article";
  if (/guide|kom-igang|underlag|test|ai\/exempel/.test(p)) return "guide";
  if (p === "/") return "home";
  return "page";
}

/** Mappar befintliga funnel-händelser till Site Intelligence-typer. */
export function forwardFunnelEvent(eventType: string, eventName: string, meta: Record<string, unknown>) {
  const n = eventName.toLowerCase();
  if (eventType === "pdf_download" || n.includes("download") || n.includes("exported")) return trackJourney({ type: "download", meta: { asset: eventName } });
  if (n === "intro_sent" || n.includes("inquiry_sent") || n.includes("submit") || n === "underlag_sent") return trackJourney({ type: "form_submit", meta: { form: eventName } });
  if (eventType === "analysis_start" || n === "test_started" || n.includes("tool_start")) return trackJourney({ type: "tool_use", meta: { tool: (meta.tool as string) || eventName } });
}
