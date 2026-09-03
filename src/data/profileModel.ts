/**
 * Gemensamma formuleringar om d365.se:s partnermodell.
 *
 * Modellen: d365.se kartlägger löpande Dynamics 365-partners på den svenska
 * marknaden. Partners utan profileringsavtal visas med en grundprofil som
 * d365.se sammanställt från publika källor. Partners med profileringsavtal kan
 * själva granska och komplettera sin profil. Avtalet ger ingen rankingvikt,
 * bonuspoäng eller köpt placering.
 */

/** Kort statuslabel för grundprofiler. */
export const PROFILE_LABEL_BASIC = "Grundprofil – ej partnerverifierad";

/** Kort statuslabel för profiler som partnern själv granskat. */
export const PROFILE_LABEL_VERIFIED = "Partnerverifierad profil";

export const PROFILE_EXPLAINER_BASIC =
  "Profilen är sammanställd av d365.se utifrån publikt tillgängliga uppgifter. Informationen har inte granskats eller bekräftats av partnern.";

export const PROFILE_EXPLAINER_VERIFIED_SHORT =
  "Partnern har ett profileringsavtal med d365.se och har granskat och kompletterat informationen i profilen.";

export const PROFILE_EXPLAINER_VERIFIED_MORE =
  "Partnerverifiering innebär inte kvalitetscertifiering och ger ingen köpt fördel i d365.se:s ranking eller rekommendationer.";

/** Ett stycke – används där båda meningarna får plats. */
export const PROFILE_EXPLAINER_VERIFIED = `${PROFILE_EXPLAINER_VERIFIED_SHORT} ${PROFILE_EXPLAINER_VERIFIED_MORE}`;

/** Kort transparensmening om kartläggningen (ersätter "alla relevanta partners"). */
export const COVERAGE_STATEMENT =
  "d365.se kartlägger löpande relevanta Dynamics 365-partners på den svenska marknaden. Partners utan profileringsavtal visas med en grundprofil sammanställd från publika källor, medan partners med profileringsavtal själva kan granska och komplettera sin profil.";

/** Rankingprincipen – används i transparensavsnitt och partnerprogram. */
export const RANKING_STATEMENT =
  "Betalning ger ingen rankingvikt, bonuspoäng eller köpt placering. Mer komplett och partnerverifierad information kan däremot göra det möjligt för d365.se att bedöma en partners relevans mer precist.";

/** Rubriker som visar vem som står bakom informationen på en partnerprofil. */
export const SOURCE_LABEL_PARTNER = "Partnerns information";
export const SOURCE_LABEL_D365 = "d365.se:s analys";
