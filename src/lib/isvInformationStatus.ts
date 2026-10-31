/**
 * Sprint 1.9: informationsstatus för ISV-leverantörer och ISV-produkter.
 *
 * Leverantör (isv_vendors) och produkt (isv_solutions) har var sin status och påverkar aldrig varandra:
 * en verifierad leverantör gör inte dess produkter verifierade, och tvärtom.
 * Databasen härleder statusen ur verifiering och bekräftelse (trigger isv_information_status_validate);
 * Premium, avtal eller källa kan aldrig göra en post verifierad och påverkar aldrig ordningen.
 */
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";

export type IsvInformationStatus = "verified" | "vendor_confirmed" | "compiled";
export type IsvStatusFilter = "all" | IsvInformationStatus;

export const ISV_INFORMATION_STATUSES: { value: IsvInformationStatus; label: string; description: string }[] = [
  {
    value: "verified",
    label: "Verifierad av d365.se",
    description: "d365.se-redaktionen har granskat centrala uppgifter enligt verifieringsprocessen.",
  },
  {
    value: "vendor_confirmed",
    label: "Bekräftad av leverantören",
    description: "Leverantören har själv granskat och bekräftat uppgifterna.",
  },
  {
    value: "compiled",
    label: "Automatiskt sammanställd",
    description: "Informationen är automatiskt sammanställd från publika källor med hjälp av AI. Den är inte granskad av d365.se och inte bekräftad av leverantören.",
  },
];

export const ISV_STATUS_FILTERS: { value: IsvStatusFilter; label: string }[] = [
  { value: "all", label: "Alla" },
  ...ISV_INFORMATION_STATUSES.map((s) => ({ value: s.value as IsvStatusFilter, label: s.label })),
];

export function isIsvInformationStatus(v: unknown): v is IsvInformationStatus {
  return v === "verified" || v === "vendor_confirmed" || v === "compiled";
}

/** Okänd eller saknad status behandlas som sammanställd, aldrig som verifierad. */
export function isvInformationStatusOf(v: string | null | undefined): IsvInformationStatus {
  return isIsvInformationStatus(v) ? v : "compiled";
}

export function isvInformationStatusLabel(s: IsvInformationStatus): string {
  return ISV_INFORMATION_STATUSES.find((x) => x.value === s)!.label;
}

/** Filtret ändrar bara urvalet, aldrig ordningen. "Alla" släpper igenom allt. */
export function matchesIsvStatusFilter(status: string | null | undefined, filter: IsvStatusFilter): boolean {
  return filter === "all" || isvInformationStatusOf(status) === filter;
}

export type IsvEvent =
  | "isv_vendor_viewed"
  | "isv_product_viewed"
  | "isv_verification_filter_applied"
  | "isv_product_selfservice_clicked"
  | "isv_product_help_requested";

/** Anonym mätning: bara id:n och valda värden, aldrig fritext eller kontaktuppgifter. */
export function trackIsv(event: IsvEvent, props: Record<string, string | number | boolean | null | undefined> = {}) {
  const meta: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) if (v !== undefined && v !== null && v !== "") meta[k] = v;
  try {
    trackFunnelEvent({ event_type: "isv", event_name: event, metadata: meta });
  } catch {
    /* mätning får aldrig påverka besökaren */
  }
}

/** Underlaget som följer med när besökaren ber d365.se bedöma en lösning (ISV Requirement-kandidat). */
export function isvHelpLines(p: {
  name: string;
  vendor: string;
  category?: string;
  products?: string[];
  informationStatus?: string | null;
}): string[] {
  return [
    `Lösning: ${p.name}`,
    `Leverantör: ${p.vendor}`,
    p.category ? `Kategori: ${p.category}` : "",
    p.products?.length ? `Byggd för: ${p.products.join(", ")}` : "",
    `Informationsstatus: ${isvInformationStatusLabel(isvInformationStatusOf(p.informationStatus))}`,
  ].filter(Boolean);
}
