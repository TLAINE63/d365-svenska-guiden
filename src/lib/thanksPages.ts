/**
 * Tacksidor för köparformulär (Demand Engine, steg 2, 1.2). Varje lyckad inskickning
 * ger en egen adress under /tack/. Formulär med bekräftelse i dialogen behåller exakt
 * samma text: adressen byts med history.pushState medan dialogen visas och återställs
 * när dialogen stängs. Formulär som bara visar en toast går till tacksidan.
 */

export const THANKS_KINDS = ["radgivning", "second-opinion", "partnermatchning", "kompetens", "skicka-underlag", "underlag", "kontakt"] as const;
export type ThanksKind = (typeof THANKS_KINDS)[number];

export function thanksPath(kind: ThanksKind): string {
  return `/tack/${kind}/`;
}

export function isThanksKind(v: string | undefined): v is ThanksKind {
  return !!v && (THANKS_KINDS as readonly string[]).includes(v);
}

/** Rådgivningsplacering till tacksida: second opinion och kompetensbehov får egna adresser. */
export function thanksKindForAdvisory(placement: string | null | undefined): ThanksKind {
  if (placement === "second_opinion") return "second-opinion";
  if (placement === "expert_requirement") return "kompetens";
  return "radgivning";
}

const MARK = "d365ThanksMarker";

/** Visar tacksidans adress medan bekräftelsen i dialogen visas. */
export function markThanksUrl(kind: ThanksKind): void {
  if (typeof window === "undefined") return;
  try {
    if (window.location.pathname === thanksPath(kind)) return;
    window.history.pushState({ ...(window.history.state || {}), [MARK]: true }, "", thanksPath(kind));
  } catch {
    /* adressen byts inte, bekräftelsen visas ändå */
  }
}

/** Återgår till sidan där formuläret skickades när dialogen stängs. */
export function leaveThanksUrl(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.history.state && window.history.state[MARK]) window.history.back();
  } catch {
    /* tyst */
  }
}

export interface ThanksState {
  title?: string;
  description?: string;
  back?: string;
}

/** Formulärkrävda underlag (1.3): sourceType till slug i /hamtat/{slug}/. */
export function downloadSlug(sourceType: string): string {
  if (sourceType.startsWith("buyer_guide_")) return "kopparguide-2026";
  if (sourceType === "implementation_calculator_pdf") return "implementationskalkyl";
  if (sourceType === "partner_guide") return "partnerguide";
  if (sourceType === "ai_readiness") return "ai-mognad";
  if (sourceType.startsWith("roi_pdf_")) return `roi-${sourceType.slice(8).replace(/-roi$/, "")}`;
  return sourceType.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

/** Visar /hamtat/{slug}/ efter nedladdning utan att lämna resultatvyn. */
export function markDownloadUrl(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const path = `/hamtat/${slug}/`;
    if (window.location.pathname === path) return;
    window.history.pushState({ ...(window.history.state || {}), [MARK]: true }, "", path);
  } catch {
    /* tyst */
  }
}
