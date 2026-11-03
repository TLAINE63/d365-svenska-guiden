/**
 * Anonyma signaler till Demand Engine (steg 2, 3B.4): tool_completed och download.
 * Inga personuppgifter, inget sessions-id. Formulärhändelser skapas bara av databasen.
 */
import { isInternalTraffic } from "@/lib/sessionPages";

export type DemandEventType = "tool_completed" | "download";

/** Verktyg i 1.1 (object = slug). Ska matcha listan i track-demand-event. */
export const DEMAND_TOOL_OBJECTS = [
  "kom-igang", "snabbguide",
  "bc-matchningstest", "fscm-matchningstest", "crm-matchningstest",
  "kostnad", "implementationskalkylator",
  "kravspec-erp", "kravspec-sales", "kravspec-marketing", "kravspec-kundservice",
  "ai-readiness", "befintlig-kund", "nav-till-business-central",
  "roi-businesscentral", "roi-d365sales", "roi-finance-scm", "roi-customer-service",
  "roi-customer-insights", "roi-contact-center", "roi-field-service",
] as const;

/** Fria underlag i 1.3. */
export const DEMAND_FREE_DOWNLOADS = [
  "bc-matchningstest-pdf", "crm-matchningstest-pdf", "nav-till-business-central-pdf",
  "partnerlandskap-pdf", "partnerlandskap-csv", "e-bok-partnervalet",
] as const;

const fired = new Set<string>();

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16));
  }
}

/** Skickar en händelse. `onceKey` hindrar dubbletter inom samma sidladdning. */
export function sendDemandEvent(type: DemandEventType, object: string, path: string, onceKey?: string): void {
  if (typeof window === "undefined" || isInternalTraffic()) return;
  const key = onceKey ?? `${type}:${object}`;
  if (fired.has(key)) return;
  fired.add(key);
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-demand-event`;
    const body = JSON.stringify({ event_id: uuid(), type, object, path });
    if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }))) return;
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
  } catch {
    /* tyst */
  }
}

/** Anropas där resultatet räknas fram (inte när resultatsidan visas). */
export function trackToolCompleted(object: (typeof DEMAND_TOOL_OBJECTS)[number], resultPath: string): void {
  sendDemandEvent("tool_completed", object, resultPath);
}

export function trackFreeDownload(object: (typeof DEMAND_FREE_DOWNLOADS)[number] | string, path?: string): void {
  sendDemandEvent("download", object, path ?? (typeof window !== "undefined" ? window.location.pathname : ""));
}
