/**
 * Senast redaktionellt granskad, per sida (ÅÅÅÅ-MM-DD). Underhålls manuellt:
 * uppdatera datumet när redaktionen har gått igenom sidan. Sidor som saknas
 * här visar inget datum (inga påhittade datum).
 */
export const PAGE_REVIEW_DATES: Record<string, string> = {
  "/businesscentral/": "2026-10-05",
  "/finance-supply-chain/": "2026-10-05",
  "/crm/": "2026-10-05",
  "/d365sales/": "2026-10-05",
  "/d365customerservice/": "2026-10-05",
  "/d365fieldservice/": "2026-10-05",
  "/d365marketing/": "2026-10-05",
  "/d365contactcenter/": "2026-10-05",
  "/affarssystem/": "2026-10-05",
  "/kostnad/": "2026-10-05",
  "/priser/": "2026-10-05",
  "/upphandlingsguiden/": "2026-10-05",
  "/kundservicesystem/": "2026-10-05",
  "/faltservicesystem/": "2026-10-05",
  "/jamfor/": "2026-10-05",
};

export function pageReviewDate(pathname: string): string | undefined {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return PAGE_REVIEW_DATES[p.toLowerCase()];
}
