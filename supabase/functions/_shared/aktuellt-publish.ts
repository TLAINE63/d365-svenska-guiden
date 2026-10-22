// Gemensamma publiceringsregler för Aktuellt (redaktionen och manage-aktuellt).
// Databasens spärr är sista försvaret; här formuleras samma krav begripligt.

export interface AktuelltPublishInput {
  source_url?: string | null;
  fact_checked_at?: string | null;
  needs_verification?: boolean | null;
  description?: string | null;
  slug?: string | null;
  analysis?: { what_happened?: string | null } | null;
}

/**
 * Vad som saknas innan en Aktuellt-artikel får publiceras.
 * confirmFactCheck = redaktören intygar i samma klick att uppgifterna är
 * kontrollerade mot primärkällan idag; då räknas faktakontroll och
 * verifieringsflagga som klara. Tom lista = får publiceras.
 */
export function aktuelltPublishBlockers(a: AktuelltPublishInput, confirmFactCheck = false): string[] {
  const missing: string[] = [];
  if (!a.source_url?.trim()) missing.push("primärkälla");
  if (!a.description?.trim()) missing.push("ingress");
  if (!a.analysis?.what_happened?.trim()) missing.push("Vad har hänt?");
  if (!a.slug?.trim()) missing.push("adress (slug)");
  if (!confirmFactCheck) {
    if (!a.fact_checked_at) missing.push("datum för senaste faktakontroll");
    if (a.needs_verification) missing.push("bocka ur Behöver verifieras efter kontroll");
  }
  return missing;
}

/** Behöver redaktören intyga faktakontrollen i publiceringssteget? */
export function aktuelltNeedsFactConfirmation(a: AktuelltPublishInput): boolean {
  return !a.fact_checked_at || !!a.needs_verification;
}
