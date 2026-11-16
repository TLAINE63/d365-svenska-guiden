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

/** Verktygskontext från kalkylatorer och guider: högst 8 verktyg, 12 korta värden var, inga fria långa texter. */
export function cleanToolContext(v: unknown): Record<string, unknown>[] | null {
  if (!Array.isArray(v)) return null;
  const s = (x: unknown, n: number) => (typeof x === "string" ? x.trim().slice(0, n) : "");
  const out = v.slice(-8).flatMap((t: any) => {
    if (!t || typeof t !== "object" || !/^[a-z0-9_-]{1,40}$/i.test(String(t.tool || ""))) return [];
    const values = Object.fromEntries(Object.entries(t.values && typeof t.values === "object" ? t.values : {})
      .map(([k, x]) => [s(k, 60), s(x, 120)]).filter(([k, x]) => k && x).slice(0, 12));
    const users = Number(t.users);
    return [{ tool: String(t.tool), label: s(t.label, 80), at: s(t.at, 30), ...(s(t.industry, 120) ? { industry: s(t.industry, 120) } : {}), ...(Number.isFinite(users) && users > 0 && users < 1e6 ? { users: Math.round(users) } : {}), values }];
  });
  return out.length ? out : null;
}
