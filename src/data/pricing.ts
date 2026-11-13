/**
 * Gemensam källa för prissiffror i löpande text (införandespann, förvaltning,
 * tidsåtgång, konsultdag). Listpriser per licens kommer från prisregistret
 * ({{price:...}}-tokens); denna fil ska inte duplicera dem.
 */
export const PRICING_UPDATED = "2026-11-13";

export const CONSULTANT_HOUR_SEK = 1490;
export const CONSULTANT_HOURS_PER_DAY = 8;
export const CONSULTANT_DAY_SEK = CONSULTANT_HOUR_SEK * CONSULTANT_HOURS_PER_DAY;

export const BC_IMPLEMENTATION = {
  quickStartFrom: 50000,
  small: { low: 178800, high: 476800, label: "180 000–475 000 kr", users: "5–15 användare", weeks: "8–14 veckor" },
  medium: { low: 476800, high: 1192000, label: "475 000 kr–1,2 MSEK", users: "15–35 användare", weeks: "14–24 veckor" },
  large: { low: 1192000, high: 2980000, label: "1,2–3,0 MSEK", users: "35+ användare" },
} as const;

export const FSCM_IMPLEMENTATION = {
  small: { low: 2000000, high: 6000000, label: "2–6 MSEK" },
  medium: { low: 6000000, high: 15000000, label: "6–15 MSEK" },
  large: { low: 15000000, label: "från 15 MSEK" },
} as const;

/** Förvaltning per år, andel av införandekostnaden. */
export const SUPPORT_SHARE = { low: 0.15, high: 0.25, label: "15–25 %" } as const;

export const BC_DURATION_TEXT =
  "Ett litet projekt tar ofta 2–3 månader och ett medelstort 3–6 månader. Större projekt tar längre tid.";

export const PRICING_BASIS_TEXT = `Spannen bygger på offerter, projektutfall och samtal med svenska Dynamics\u00A0365-partners som d365.se tagit del av. De visar storleksordningar, inte priser. Räkneexemplen utgår från ${CONSULTANT_HOUR_SEK.toLocaleString("sv-SE")} kr per timme och ${CONSULTANT_HOURS_PER_DAY} timmar per konsultdag (${CONSULTANT_DAY_SEK.toLocaleString("sv-SE")} kr).`;
