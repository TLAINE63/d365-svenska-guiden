// Sidhistorik och samtyckesversion från köparformulär (Demand Engine, steg 2).
const PATH = /^\/[^\s?#]{0,299}$/;

export function cleanPagePath(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const p = v.trim().split("#")[0].split("?")[0];
  return PATH.test(p) ? p : null;
}

export function cleanSessionPages(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out = v.map(cleanPagePath).filter((x): x is string => !!x).slice(0, 30);
  return out.length ? out : null;
}

export function cleanConsentVersion(v: unknown): string | null {
  return typeof v === "string" && /^[0-9A-Za-z.\-]{1,40}$/.test(v.trim()) ? v.trim() : null;
}

/** Fält att spara på formulärets rad. landing_page skrivs bara när värdet saknas. */
export function formContextFields(d: Record<string, unknown>, existingLanding?: string | null) {
  return {
    session_pages: cleanSessionPages(d.session_pages),
    source_page: cleanPagePath(d.source_page),
    landing_page: existingLanding || cleanPagePath(d.landing_page),
    consent_text_version: cleanConsentVersion(d.consent_text_version),
  };
}
