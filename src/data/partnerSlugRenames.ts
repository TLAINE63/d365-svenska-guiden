/**
 * Bytta partneradresser (beslut Thomas 2026-11-05). Gamla adresser 301:as till nya.
 * `basic: true` = grundprofil under /basic/, annars publicerad profil under /partner/.
 */
export const PARTNER_SLUG_RENAMES: { from: string; to: string; basic: boolean }[] = [
  { from: "update-affarssystem-ab", to: "update-affarssystem", basic: false },
  { from: "b3-consulting-group", to: "b3-elevate", basic: false },
  { from: "columbus-sweden-ab", to: "columbus", basic: false },
  { from: "navipro-ab", to: "evidi", basic: true },
  { from: "future-it-partner", to: "upheads", basic: true },
  { from: "exsitec", to: "brightcom", basic: true },
  { from: "ecit-sverige-ab", to: "ecit", basic: true },
  { from: "enqore-ab", to: "enqore", basic: true },
  { from: "it-stod-ab", to: "it-stod", basic: true },
  { from: "midpoint-ab", to: "midpoint", basic: true },
  { from: "navet-ab", to: "navet", basic: true },
  { from: "sherpas-group-ab", to: "sherpas", basic: true },
];

export const partnerSlugTarget = (r: { to: string; basic: boolean }) => `/${r.basic ? "basic" : "partner"}/${r.to}/`;
