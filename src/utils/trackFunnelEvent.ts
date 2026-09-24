/**
 * Fire-and-forget funnel event tracker.
 * Used to measure where visitors drop off in the conversion funnel
 * (CTA view → click → analysis start/complete → PDF → lead).
 *
 * Never blocks UI. Uses sendBeacon when available (best for unload events),
 * falls back to fetch() with keepalive.
 */

/**
 * Anonymous measurement – no cookies, no personal data.
 * Only the internal exclusion flag stops tracking.
 */
function isTrackingAllowed(): boolean {
  // Beslut 2026-09-01: ingen exkludering – alla besökare räknas.
  if (typeof window === "undefined") return false;
  return true;
}

function getSessionId(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const key = "visitor_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return null;
  }
}

export type FunnelEventType =
  | "cta_view"
  | "cta_click"
  | "analysis_start"
  | "analysis_step"
  | "analysis_complete"
  | "pdf_download"
  | "content_view"
  | "journey"
  | "engagement"
  | "competence";

/** Fasta steg i köparresan. */
export type FunnelStep =
  | "landing"
  | "cta_view"
  | "cta_click"
  | "tool_start"
  | "tool_step_1"
  | "tool_result"
  | "shortlist_add"
  | "compare_open"
  | "intro_open"
  | "intro_sent";

const AI_HOSTS = /(chatgpt|openai|perplexity|copilot|gemini|bard|claude|anthropic|you\.com|phind)/i;
const SEARCH_HOSTS = /(google\.|bing\.|duckduckgo|yahoo\.|ecosia|startpage|yandex|baidu)/i;
const SOCIAL_HOSTS = /(linkedin|lnkd\.in|facebook|twitter|t\.co|x\.com|instagram|youtube)/i;

function classifySource(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = (params.get("utm_source") || "").toLowerCase();
    const utmMedium = (params.get("utm_medium") || "").toLowerCase();
    if (utmSource && AI_HOSTS.test(utmSource)) return "geo_ai";
    if (utmMedium === "email" || utmSource.includes("mail") || utmSource === "newsletter") return "email";
    if (utmMedium === "cpc" || utmMedium === "paid" || params.get("gclid")) return "paid";
    if (utmSource && SOCIAL_HOSTS.test(utmSource)) return "social";
    if (utmSource && SEARCH_HOSTS.test(utmSource)) return "seo";
    const ref = document.referrer;
    if (!ref) return "direct";
    const host = new URL(ref).hostname;
    if (host.endsWith("d365.se") || host === window.location.hostname) return "internal";
    if (AI_HOSTS.test(host)) return "geo_ai";
    if (SEARCH_HOSTS.test(host)) return "seo";
    if (SOCIAL_HOSTS.test(host)) return "social";
    return "referral";
  } catch {
    return "direct";
  }
}

interface Attribution {
  landing_path: string;
  traffic_source: string;
}

function getAttribution(): Attribution | null {
  try {
    const key = "funnel_attribution";
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw) as Attribution;
    const a: Attribution = { landing_path: window.location.pathname, traffic_source: classifySource() };
    sessionStorage.setItem(key, JSON.stringify(a));
    return a;
  } catch {
    return null;
  }
}

function getDevice(): string {
  const w = window.innerWidth || 1024;
  return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

function toolFromName(name: string, path: string): string | null {
  const n = name.toLowerCase();
  if (n.startsWith("kom_igang") || path.startsWith("/kom-igang")) return "kom-igang";
  if (n.startsWith("needs_analysis")) return n.replace("needs_analysis_", "behovsanalys-");
  if (n.startsWith("kravspec")) return n.replace("_", "-");
  if (n.startsWith("ai_readiness")) return "ai-readiness";
  if (n.startsWith("crm")) return "crm-test";
  return null;
}

/** Härleder funnelsteg från befintliga händelser så att gamla anrop räknas. */
function deriveStep(p: FunnelEventPayload): FunnelStep | null {
  if (p.step) return p.step;
  const m = (p.metadata || {}) as Record<string, unknown>;
  switch (p.event_type) {
    case "cta_view":
      return "cta_view";
    case "cta_click":
      if (p.event_name === "shortlist_add" || p.event_name === "partner_compare_add") return "shortlist_add";
      if (p.event_name === "shortlist_remove") return null;
      if (m.action === "compare") return "shortlist_add";
      if (m.action === "request_intro" || m.action === "intro") return "intro_open";
      return "cta_click";
    case "analysis_start":
      return "tool_start";
    case "analysis_step":
      if (p.event_name.endsWith("_exit")) return null;
      return "tool_step_1";
    case "analysis_complete":
      return "tool_result";
    default:
      return null;
  }
}

/** Tydligt steg-anrop för nya mätpunkter. */
export function trackFunnelStep(step: FunnelStep, meta: { partner_slug?: string; tool?: string; [k: string]: unknown } = {}): void {
  trackFunnelEvent({ event_type: "journey", event_name: step, step, metadata: meta });
}

/** Loggar landningen en gång per session. */
export function trackLandingOnce(): void {
  try {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("funnel_landing_sent")) return;
    sessionStorage.setItem("funnel_landing_sent", "1");
    trackFunnelStep("landing");
  } catch {
    /* ignore */
  }
}

/** Klassificerar länkklick till behovsanalys, kravspec och e-bok. */
function classifyEngagementHref(href: string): string | null {
  const p = href.toLowerCase();
  if (/behovsanalys|matchningstest|ai-mognadsanalys|beslutsmognad/.test(p)) return "needs_analysis_click";
  if (p.includes("kravspecifikation")) return "kravspec_click";
  if (p.includes("ebook") || p.includes("e-bok")) return "ebook_click";
  return null;
}

let engagementInstalled = false;
/** Global lyssnare: mäter klick till behovsanalys, kravspec och e-bok. */
export function installEngagementClickTracking(): void {
  if (engagementInstalled || typeof document === "undefined") return;
  engagementInstalled = true;
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href], [data-engagement]") as HTMLElement | null;
      if (!el) return;
      const explicit = el.getAttribute("data-engagement");
      let name = explicit;
      if (!name) {
        const href = el.getAttribute("href") || "";
        if (!href.startsWith("/") && !href.includes("d365.se")) return;
        name = classifyEngagementHref(href);
      }
      if (!name) return;
      trackFunnelEvent({
        event_type: "engagement",
        event_name: name,
        metadata: { target: el.getAttribute("href") || null },
      });
    },
    { capture: true },
  );
}

export interface FunnelEventPayload {
  event_type: FunnelEventType;
  event_name: string;
  page_path?: string;
  step_number?: number;
  metadata?: Record<string, unknown>;
  step?: FunnelStep;
}

export function trackFunnelEvent(payload: FunnelEventPayload): void {
  try {
    if (!isTrackingAllowed()) return;
    if (typeof window === "undefined") return;

    // Skip admin pages
    if (window.location.pathname.startsWith("/admin")) return;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-funnel-event`;
    const pagePath = payload.page_path ?? window.location.pathname;
    const attribution = getAttribution();
    const meta = (payload.metadata || {}) as Record<string, unknown>;
    const partnerSlug = (meta.partner_slug || meta.partner) as string | undefined;
    const body = JSON.stringify({
      ...payload,
      page_path: pagePath,
      session_id: getSessionId(),
      step: deriveStep(payload),
      landing_path: attribution?.landing_path ?? null,
      traffic_source: attribution?.traffic_source ?? null,
      tool: (meta.tool as string) || toolFromName(payload.event_name, pagePath),
      device: getDevice(),
      partner_slug: typeof partnerSlug === "string" ? partnerSlug : null,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}
