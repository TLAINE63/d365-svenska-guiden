/**
 * Sidhistorik för köparformulär (Demand Engine, steg 2).
 * Sökvägar (utan query och fragment) sparas i sessionStorage under d365_session_pages,
 * högst 30: den första plus de 29 senaste. Skickas bara när besökaren själv skickar ett formulär.
 */

export const SESSION_PAGES_KEY = "d365_session_pages";
export const INTERNAL_KEY = "d365_internal";
/** Version av samtyckestexten som visas vid delning med partners. Byt vid ändrad text. */
export const CONSENT_TEXT_VERSION = "2026-11-v1";
const MAX = 30;

/** Intern trafik (localStorage d365_internal = 1) samlar inga signaler. */
export function isInternalTraffic(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(INTERNAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function cleanPath(path: string): string {
  const p = (path || "").split("#")[0].split("?")[0].trim();
  if (!p) return "/";
  return (p.startsWith("/") ? p : `/${p}`).slice(0, 300);
}

/** Ren funktion: lägger till en sökväg enligt reglerna (ingen dubblett i rad, första + 29 senaste). */
export function appendPage(list: string[], path: string, max = MAX): string[] {
  const p = cleanPath(path);
  if (list.length && list[list.length - 1] === p) return list;
  const next = [...list, p];
  if (next.length <= max) return next;
  return [next[0], ...next.slice(next.length - (max - 1))];
}

export function readSessionPages(): string[] {
  try {
    const raw = window.sessionStorage.getItem(SESSION_PAGES_KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function recordSessionPage(path: string): void {
  if (typeof window === "undefined" || isInternalTraffic()) return;
  try {
    const next = appendPage(readSessionPages(), path);
    window.sessionStorage.setItem(SESSION_PAGES_KEY, JSON.stringify(next));
  } catch {
    /* formuläret skickas utan sidhistorik */
  }
}

export interface FormContext {
  landing_page: string | null;
  session_pages: string[] | null;
  source_page: string | null;
  consent_text_version: string;
}

/** Fält som följer med ett köparformulär. Tomt (null) för intern trafik eller om lagringen inte fungerar. */
export function formContext(): FormContext {
  const source = typeof window !== "undefined" ? cleanPath(window.location.pathname) : null;
  if (typeof window === "undefined" || isInternalTraffic()) {
    return { landing_page: null, session_pages: null, source_page: source, consent_text_version: CONSENT_TEXT_VERSION };
  }
  const pages = readSessionPages();
  return {
    landing_page: pages[0] ?? null,
    session_pages: pages.length ? pages : null,
    source_page: source,
    consent_text_version: CONSENT_TEXT_VERSION,
  };
}
