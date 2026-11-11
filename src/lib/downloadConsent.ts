import { formContextBody } from "@/lib/sessionPages";

/** Frivillig kontaktönskan vid nedladdning (Demand Engine). Versionen sparas med varje nedladdning. */
export const DOWNLOAD_CONSENT_VERSION = "nedladdning-2026-11-v1";
export const DOWNLOAD_CONSENT_LABEL = "Jag vill gärna bli kontaktad av d365.se om vårt systemval.";

export interface DownloadConsent {
  consent: boolean;
  name: string;
  phone: string;
  company: string;
}
export const EMPTY_DOWNLOAD_CONSENT: DownloadConsent = { consent: false, name: "", phone: "", company: "" };

/** Felmeddelande om kontaktönskan saknar obligatoriskt namn, annars null. */
export function downloadConsentError(v: DownloadConsent, askName: boolean): string | null {
  if (v.consent && askName && v.name.trim().length < 2) return "Ange ditt namn så att vi kan kontakta dig.";
  return null;
}

/**
 * Fält att sprida i submit-lead-anropet. Sidhistorik följer alltid med; namn, telefon och
 * företag bara när rutan är ikryssad. Formulärets egen source_page ska läggas efter.
 */
export function downloadConsentBody(v: DownloadConsent): Record<string, unknown> {
  const out: Record<string, unknown> = {
    ...formContextBody(),
    consent_contact: v.consent === true,
    consent_text_version: DOWNLOAD_CONSENT_VERSION,
  };
  if (v.consent && v.phone.trim()) out.phone = v.phone.trim().slice(0, 20);
  return out;
}
