/**
 * Intern vy: blocket "Synlighet i AI-svar" ska bara visas för admin, redaktion
 * och för partnern själv via profileringslänken, aldrig för vanliga besökare.
 */
export function isInternalViewer(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("insyn") === "1") return true;
    const s = window.sessionStorage;
    return Boolean(s.getItem("admin_token") || s.getItem("editor_token"));
  } catch {
    return false;
  }
}
