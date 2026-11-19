/**
 * Felstavningar och kortnamn från 404-loggen som leds till rätt sida i stället för 404.
 * Explicita mål (inga gissningar): stavfel nära ett känt mål och kända kortnamn.
 */
const FUZZY_TARGETS: Record<string, string> = {
  partnerprogram: "/partnerprogram/",
  isvprogram: "/isvprogram/",
};
const EXACT: Record<string, string> = {
  "businesscentral/kostnad": "/kostnad/",
  "vivicta": "/partner/vivicta/",
  "4ps": "/partner/4ps-sweden/",
};

function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

export function resolveNotFoundAlias(pathname: string): string | null {
  const key = decodeURIComponent(pathname).toLowerCase().replace(/^\/+|[/.,:;!]+$/g, "");
  if (!key) return null;
  if (EXACT[key]) return EXACT[key];
  if (key.includes("/")) return null;
  for (const [name, to] of Object.entries(FUZZY_TARGETS)) if (distance(key, name) <= 2) return to;
  return null;
}
