/**
 * Automatisk förkortning av <title> så att alla sidor håller sig
 * under Googles teckenbegränsning (~60 tecken) och ändå blir läsbara.
 *
 * Ordning när en titel är för lång:
 *  1. Ta bort avslutande delar efter en naturlig avgränsare (" – ", " | ", ": ")
 *     så länge resten fortfarande är beskrivande. Ingen ellips behövs.
 *  2. Om själva sidtiteln ryms utan varumärkessuffixet används den hel
 *     (Google visar sajtnamnet separat i sökresultatet).
 *  3. Sista utväg: kapa på ordgräns och lägg till ellips (…) före suffixet.
 *
 * Funktionen arbetar på klartext. HTML-kodade titlar (t.ex. "&amp;")
 * ska avkodas före och kodas efter, se decodeHtmlEntities/encodeHtmlText.
 */

export const TITLE_MAX_LENGTH = 60;
export const BRAND_SUFFIX = " | d365.se";

/** Avgränsare som markerar en naturlig delning i en titel. */
const SEPARATORS = [" – ", " — ", " | ", ": ", " - "];
/** En förkortad titel ska fortfarande säga något om sidan. */
const MIN_READABLE = 18;

function lastSeparatorCut(body: string): string | null {
  let best = -1;
  for (const sep of SEPARATORS) {
    const i = body.lastIndexOf(sep);
    if (i > best) best = i;
  }
  return best > 0 ? body.slice(0, best).trim() : null;
}

export function truncateSeoTitle(title: string, maxLength: number = TITLE_MAX_LENGTH): string {
  const clean = (title || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;

  // Separera ut varumärkessuffix om det finns
  const hasBrand = clean.endsWith(BRAND_SUFFIX);
  const brand = hasBrand ? BRAND_SUFFIX : "";
  const body = hasBrand ? clean.slice(0, -BRAND_SUFFIX.length).trim() : clean;

  // 1. Släpp avslutande deltitlar vid naturliga avgränsare
  let candidate: string | null = body;
  while (candidate) {
    const next = lastSeparatorCut(candidate);
    if (!next || next.length < MIN_READABLE) break;
    candidate = next;
    if (candidate.length + brand.length <= maxLength) return `${candidate}${brand}`;
  }

  // 2. Hela sidtiteln utan suffix
  if (hasBrand && body.length <= maxLength) return body;

  // 3. Kapa på ordgräns med ellips
  const budget = maxLength - brand.length - 1; // -1 för ellips
  if (budget <= 0) {
    return clean.slice(0, maxLength - 1).trimEnd() + "…";
  }
  let cut = body.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > budget * 0.5) cut = cut.slice(0, lastSpace);
  cut = cut.replace(/[\s.,;:&|–-]+$/, "");

  return `${cut}…${brand}`;
}

/** Bygger full titel med varumärke och förkortar den vid behov. */
export function buildSeoTitle(title: string, maxLength: number = TITLE_MAX_LENGTH): string {
  const clean = (title || "").replace(/\s+/g, " ").trim();
  const withBrand = clean.includes("d365.se") ? clean : `${clean}${BRAND_SUFFIX}`;
  return truncateSeoTitle(withBrand, maxLength);
}

/** Avkodar de HTML-entiteter som förekommer i renderade titlar. */
export function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, "\u00A0")
    .replace(/&amp;/g, "&");
}

/** Kodar text för säker användning i HTML-attribut och <title>. */
export function encodeHtmlText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Förkortar en HTML-kodad titel utan att bryta entiteter som "&amp;". */
export function truncateEncodedSeoTitle(encoded: string, maxLength: number = TITLE_MAX_LENGTH): string {
  const decoded = decodeHtmlEntities(encoded);
  if (decoded.replace(/\s+/g, " ").trim().length <= maxLength) return encoded;
  return encodeHtmlText(truncateSeoTitle(decoded, maxLength));
}
