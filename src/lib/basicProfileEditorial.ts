/**
 * Redaktionella regler för grundprofiler (Basic) på d365.se.
 *
 * Grundprofiler är sammanställda av d365.se från publika källor och har inte
 * granskats av partnern. Därför får de bara innehålla uppgifter som går att
 * belägga – inga obestyrkta superlativ och inga jämförelser med namngivna
 * konkurrenter.
 */

export const BASIC_PROFILE_ALLOWED = [
  "Företagsnamn, kontorsorter och geografisk täckning",
  "Dynamics 365-områden, branscher och kundstorlek (som bedömning)",
  "Kort neutral beskrivning och tydligt märkta d365.se-bedömningar",
  "Certifieringar/designations – endast verifierbara",
  "Kundreferenser – endast offentliga",
];

export const BASIC_PROFILE_FORBIDDEN = [
  "Personliga kontaktuppgifter och partnerns egna foton",
  "Långa kopierade texter från partnerns webbplats",
  'Obestyrkta superlativ ("stark certifieringsnivå", "marknadsledande")',
  "Jämförelser med namngivna konkurrenter",
];

const SUPERLATIVE_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /stark(a|t)?\s+certifiering/i, label: "stark certifieringsnivå" },
  { re: /certifieringsniv/i, label: "certifieringsnivå" },
  { re: /marknadsledande|branschledande|ledande\b/i, label: "ledande" },
  { re: /\bbäst[ae]?\b|\bfrämst[ae]?\b|\bstörst[ae]?\b/i, label: "bäst/störst" },
  { re: /oberoende/i, label: "oberoende" },
  { re: /jämförbar|i klass med|precis som|liksom\s+[A-ZÅÄÖ]/i, label: "jämförelse" },
];

export interface EditorialWarning {
  type: "superlative" | "competitor";
  message: string;
}

/** Mjuk kontroll – blockerar inte sparande, men flaggar riskabla formuleringar. */
export function checkBasicProfileText(
  text: string,
  selfName: string,
  otherPartnerNames: string[],
): EditorialWarning[] {
  const warnings: EditorialWarning[] = [];
  const value = (text || "").trim();
  if (!value) return warnings;

  for (const { re, label } of SUPERLATIVE_PATTERNS) {
    if (re.test(value)) {
      warnings.push({
        type: "superlative",
        message: `Texten innehåller ett obestyrkt påstående ("${label}"). Skriv om till verifierbar fakta.`,
      });
      break;
    }
  }

  const self = (selfName || "").trim().toLowerCase();
  const mentioned = otherPartnerNames
    .map((n) => (n || "").trim())
    .filter((n) => n.length > 2 && n.toLowerCase() !== self)
    .filter((n) => new RegExp(`(^|[^\\wåäö])${escapeRe(n)}([^\\wåäö]|$)`, "i").test(value));

  if (mentioned.length) {
    warnings.push({
      type: "competitor",
      message: `Texten nämner andra partners (${[...new Set(mentioned)].slice(0, 3).join(", ")}). Ta bort jämförelser med namngivna konkurrenter.`,
    });
  }

  return warnings;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
