/**
 * Dynamiska regler för meta title.
 *
 * Mål:
 *  - Längd 50–60 tecken (Google klipper ~60).
 *  - Primärt sökord (artikelns category eller första tag) ska finnas i titeln.
 *  - Brand-suffix " | d365.se" läggs till om det får plats.
 *  - För artiklar som nås via "Nytt i Kunskapscentret"-bannern används ett
 *    kortare "Nytt:"-prefix i stället för hela frasen, så att sökordet och
 *    artikeltiteln får plats inom 60 tecken.
 */

export const META_TITLE_MIN = 50;
export const META_TITLE_MAX = 60;
const BRAND_SUFFIX = " | d365.se";
const KC_PREFIX_FULL = "Nytt i Kunskapscentret: ";
const KC_PREFIX_SHORT = "Nytt: ";

const isDev =
  typeof import.meta !== "undefined" &&
  (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

const warn = (msg: string, ctx: Record<string, unknown>) => {
  if (!isDev) return;
  // eslint-disable-next-line no-console
  console.warn(`[meta-title] ${msg}`, ctx);
};

const norm = (s: string) => s.toLowerCase();

const containsKeyword = (title: string, keyword: string | undefined): boolean => {
  if (!keyword) return true;
  return norm(title).includes(norm(keyword));
};

const truncateAtWord = (s: string, max: number): string => {
  if (s.length <= max) return s;
  const slice = s.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[.,;:!?–-]+$/, "") + "…";
};

export interface MetaTitleResult {
  value: string;
  length: number;
  status: "ok" | "padded" | "truncated" | "missing-keyword";
  warnings: string[];
}

export interface BuildMetaTitleOptions {
  /** Råtitel från artikeln (article.title eller article.metaTitle). */
  baseTitle: string;
  /** Primärt sökord — ofta artikelns category eller första tag. */
  primaryKeyword?: string;
  /** Sätt till true när användaren landade via KC-bannern. */
  fromKcBanner?: boolean;
  /** Lägg till brand-suffix om det får plats (default true). */
  appendBrand?: boolean;
}

/**
 * Bygger en meta title enligt reglerna ovan.
 */
export const buildMetaTitle = ({
  baseTitle,
  primaryKeyword,
  fromKcBanner = false,
  appendBrand = true,
}: BuildMetaTitleOptions): MetaTitleResult => {
  const warnings: string[] = [];
  const cleanBase = baseTitle.replace(/\s+/g, " ").trim();

  // 1. Strippa ev. existerande brand-suffix så vi kan bygga om den.
  const stripped = cleanBase.replace(/\s*\|\s*d365\.se\s*$/i, "").trim();

  // 2. Säkerställ primärt sökord (om angivet och saknas → försök prependa kategorin).
  let withKeyword = stripped;
  let keywordStatus: "present" | "added" | "missing" = "present";
  if (primaryKeyword && !containsKeyword(stripped, primaryKeyword)) {
    const candidate = `${primaryKeyword}: ${stripped}`;
    if (candidate.length <= META_TITLE_MAX) {
      withKeyword = candidate;
      keywordStatus = "added";
    } else {
      keywordStatus = "missing";
      const msg = `Primärt sökord "${primaryKeyword}" saknas och får inte plats i titeln.`;
      warnings.push(msg);
      warn(msg, { baseTitle, primaryKeyword });
    }
  }

  // 3. KC-banner-prefix: välj kort eller full beroende på utrymme.
  if (fromKcBanner) {
    const fullCandidate = `${KC_PREFIX_FULL}${withKeyword}`;
    const shortCandidate = `${KC_PREFIX_SHORT}${withKeyword}`;
    if (fullCandidate.length <= META_TITLE_MAX) {
      withKeyword = fullCandidate;
    } else if (shortCandidate.length <= META_TITLE_MAX) {
      withKeyword = shortCandidate;
    } else {
      // Trunkera artikeldelen så "Nytt: " ryms.
      const room = META_TITLE_MAX - KC_PREFIX_SHORT.length;
      withKeyword = KC_PREFIX_SHORT + truncateAtWord(withKeyword, room);
    }
  }

  // 4. Brand-suffix om det får plats utan att överstiga max.
  let value = withKeyword;
  if (appendBrand) {
    if (value.length + BRAND_SUFFIX.length <= META_TITLE_MAX) {
      value = value + BRAND_SUFFIX;
    } else if (value.length > META_TITLE_MAX) {
      // Trunkera först, lägg sedan till suffix om det fortfarande får plats.
      value = truncateAtWord(value, META_TITLE_MAX - BRAND_SUFFIX.length);
      value = value + BRAND_SUFFIX;
    }
    // annars: hoppa över suffix för att inte överskrida max
  } else if (value.length > META_TITLE_MAX) {
    value = truncateAtWord(value, META_TITLE_MAX);
  }

  // 5. Klassificera status.
  let status: MetaTitleResult["status"] = "ok";
  if (keywordStatus === "missing") {
    status = "missing-keyword";
  } else if (value.endsWith("…")) {
    status = "truncated";
    const msg = `Titel trunkerades för att rymmas inom ${META_TITLE_MAX} tecken.`;
    warnings.push(msg);
    warn(msg, { value });
  } else if (value.length < META_TITLE_MIN) {
    status = "padded";
    const msg = `Titeln är kortare än rekommenderat (${value.length} < ${META_TITLE_MIN} tecken).`;
    warnings.push(msg);
    warn(msg, { value });
  }

  return { value, length: value.length, status, warnings };
};
