/**
 * Bygger validerade Open Graph- och Twitter-bilddata från artikeldata.
 * Fallbacks om fält saknas eller URL är ogiltig.
 */
const SITE = "https://d365.se";
const FALLBACK_IMAGE = `${SITE}/og-erp.png`;
const FALLBACK_W = 1200;
const FALLBACK_H = 630;

export interface OgImageInput {
  src?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  fallbackAlt?: string;
}

export interface OgImageData {
  url: string;
  alt: string;
  width: number;
  height: number;
}

const isValidUrl = (u: string): boolean => {
  if (!u) return false;
  if (u.startsWith("/")) return true;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const toAbsolute = (u: string): string => {
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${SITE}${u}`;
  // Vite-importerade bilder kan komma som /assets/... även utan ledande slash – normalisera
  return `${SITE}/${u.replace(/^\.?\/?/, "")}`;
};

const sanitizeAlt = (s: string, max = 125): string => {
  const c = s.replace(/\s+/g, " ").trim();
  if (c.length <= max) return c;
  const slice = c.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice) + "…";
};

export const resolveOgImage = (input: OgImageInput): OgImageData => {
  const rawSrc = (input.src ?? "").trim();
  const url = rawSrc && isValidUrl(rawSrc) ? toAbsolute(rawSrc) : FALLBACK_IMAGE;

  const altCandidate = (input.alt ?? "").trim() || (input.fallbackAlt ?? "").trim();
  const alt = altCandidate
    ? sanitizeAlt(altCandidate)
    : "d365.se – oberoende kunskap om Microsoft Dynamics 365";

  const width = Number.isFinite(input.width) && (input.width as number) > 0
    ? Math.round(input.width as number)
    : FALLBACK_W;
  const height = Number.isFinite(input.height) && (input.height as number) > 0
    ? Math.round(input.height as number)
    : FALLBACK_H;

  return { url, alt, width, height };
};
