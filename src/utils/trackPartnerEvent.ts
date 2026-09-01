import { supabase } from "@/integrations/supabase/client";
import { isExcludedFromTracking } from "@/hooks/useVisitorTracking";

/**
 * Partner Performance – event tracking.
 *
 * Fyra nivåer:
 *  1 Exponering  – partnern visas i listor, filter, jämförelser, matchningar
 *  2 Engagemang  – besökaren interagerar med profilen
 *  3 Köpsignal   – besökaren visar aktiv ERP/CRM/AI-köpresa
 *  4 Lead        – besökaren lämnar uppgifter eller ber om kontakt
 *
 * Alla events innehåller partnerId/slug, visitorId, sessionId och timestamp
 * (timestamp sätts serverside). Ingen personuppgift lagras.
 */
export type PartnerEventName =
  | "partner_list_impression"
  | "partner_filter_impression"
  | "partner_comparison_impression"
  | "partner_match_impression"
  | "partner_profile_view"
  | "partner_profile_return"
  | "partner_case_click"
  | "partner_competency_click"
  | "partner_saved"
  | "partner_added_to_comparison"
  | "partner_match_recommended"
  | "partner_match_selected"
  | "partner_contact_request"
  | "partner_intro_request";

export type PartnerIntentTrack = "erp" | "crm" | "ai";

export interface PartnerEventInput {
  event: PartnerEventName;
  partnerSlug: string;
  partnerId?: string | null;
  intentTrack?: PartnerIntentTrack | null;
  metadata?: Record<string, unknown>;
}

const VISITOR_KEY = "d365-visitor-id";
const SESSION_KEY = "d365-session-id";
/** Dedupe-nyckel per session för exponeringar (undviker dubbelräkning). */
const IMPRESSION_KEY = "d365-partner-impressions";

const randomId = (): string => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    /* ignore */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getVisitorId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
};

export const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = randomId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
};

/** true om besökaren redan setts på profilen tidigare (=> återbesök). */
export const isReturningVisitorForPartner = (slug: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("d365-partner-seen");
    const seen: Record<string, number> = raw ? JSON.parse(raw) : {};
    const before = Boolean(seen[slug]);
    seen[slug] = Date.now();
    localStorage.setItem("d365-partner-seen", JSON.stringify(seen));
    return before;
  } catch {
    return false;
  }
};

const seenImpression = (key: string): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const raw = sessionStorage.getItem(IMPRESSION_KEY);
    const set: string[] = raw ? JSON.parse(raw) : [];
    if (set.includes(key)) return true;
    set.push(key);
    sessionStorage.setItem(IMPRESSION_KEY, JSON.stringify(set.slice(-800)));
    return false;
  } catch {
    return false;
  }
};

// ── Batching ──────────────────────────────────────────────────────────
type QueuedEvent = {
  event_name: string;
  partner_slug: string;
  partner_id: string | null;
  visitor_id: string;
  session_id: string;
  page_path: string;
  intent_track: string | null;
  metadata: Record<string, unknown>;
  client_ts: string;
};

let queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

const flush = async () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;
  const events = queue.splice(0, 60);
  try {
    await supabase.functions.invoke("track-partner-event", { body: { events } });
  } catch {
    /* fire & forget */
  }
};

const enqueue = (e: QueuedEvent) => {
  queue.push(e);
  if (queue.length >= 25) {
    void flush();
    return;
  }
  if (!timer) timer = setTimeout(() => void flush(), 1500);
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => void flush());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
}

/** Loggar ett partner-event. Fire-and-forget – blockerar aldrig UI. */
export const trackPartnerEvent = (input: PartnerEventInput): void => {
  if (typeof window === "undefined") return;
  if (isExcludedFromTracking()) return;
  if (!input?.partnerSlug || !input?.event) return;
  enqueue({
    event_name: input.event,
    partner_slug: input.partnerSlug,
    partner_id: input.partnerId ?? null,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    page_path: window.location.pathname,
    intent_track: input.intentTrack ?? null,
    metadata: input.metadata ?? {},
    client_ts: new Date().toISOString(),
  });
};

/** Exponering (nivå 1) – dedupas per session, partner och kontext. */
export const trackPartnerImpression = (
  event: Extract<
    PartnerEventName,
    | "partner_list_impression"
    | "partner_filter_impression"
    | "partner_comparison_impression"
    | "partner_match_impression"
  >,
  partners: { slug: string; id?: string | null }[],
  metadata: Record<string, unknown> = {},
): void => {
  if (typeof window === "undefined" || partners.length === 0) return;
  const ctx = `${event}:${window.location.pathname}:${JSON.stringify(metadata)}`;
  for (const p of partners) {
    if (!p?.slug) continue;
    if (seenImpression(`${ctx}:${p.slug}`)) continue;
    trackPartnerEvent({ event, partnerSlug: p.slug, partnerId: p.id ?? null, metadata });
  }
};
