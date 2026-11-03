/**
 * Anonyma signaler till Demand Engine (steg 2, 3B.4): tool_completed och download.
 * Inga personuppgifter, inget sessions-id. Formulärhändelser skapas bara av databasen.
 */

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

// Webbläsarhändelser till track-demand-event är borttagna (2026-11-03); verktygsanvändning mäts via Site Intelligence.
