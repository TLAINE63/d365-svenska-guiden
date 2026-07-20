// Delade brand-färger för alla PDF:er (BC-matchning, CRM, ROI, kravspec, partner guide, suggested partners).
// Håller PDF-outputen i linje med sajtens design tokens i src/index.css.
//
// Site tokens:
//   --primary / --cta-orange = #B23D19  (mörkad logo-orange, primär CTA)
//   --cta-orange-hover       = #9A3214
//   --accent (teal)          = #007C68  (sekundär accent, ikoner/rules)
//   --hero-dark              = #15130F  (mörk header-bakgrund)

export type RGB = [number, number, number];

export const PDF_BRAND = {
  /** Primär CTA-orange – används på länkar, CTA-boxar, aksentstreck. */
  primary: [178, 61, 25] as RGB,           // #B23D19
  primaryHover: [154, 50, 20] as RGB,      // #9A3214
  /** Sekundär teal – sektionsavdelare, ikonchips, subtila accenter. */
  accent: [0, 124, 104] as RGB,            // #007C68
  /** Mörk headerbakgrund. */
  dark: [21, 19, 15] as RGB,               // #15130F
  /** Ljus card-bakgrund (matchar sajtens muted/off-white). */
  cardBg: [248, 246, 241] as RGB,
  cardBorder: [230, 226, 218] as RGB,
  /** Textnyanser. */
  text: [21, 19, 15] as RGB,
  textMuted: [110, 110, 118] as RGB,
  textSubtle: [140, 140, 148] as RGB,
  /** Warning/insight amber (används på disclaimer-rutor). */
  warningBg: [255, 248, 230] as RGB,
  warningBorder: [245, 158, 11] as RGB,
  warningText: [120, 80, 0] as RGB,
} as const;

/** Bakåtkompatibla alias för äldre PDF-generatorer. */
export const BRAND_PRIMARY = PDF_BRAND.primary;
export const BRAND_ACCENT = PDF_BRAND.accent;
export const BRAND_DARK = PDF_BRAND.dark;
export const BRAND_MUTED = PDF_BRAND.textMuted;
