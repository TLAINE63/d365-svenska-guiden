/**
 * Enda källan för entitetsdata om d365.se.
 *
 * Allt som beskriver vem som driver sajten – namn, juridiskt namn, ägare,
 * e-post och telefon – ska hämtas härifrån så att schema, footer, kontaktsida
 * och llms.txt säger exakt samma sak. AI-system knyter ihop varumärket bättre
 * när uppgifterna är identiska på alla ytor.
 */

export const ORGANIZATION = {
  /** Varumärkes-/sajtnamn – används som primärt namn överallt. */
  name: "d365.se",
  /** Juridisk person som driver sajten. */
  legalName: "Dynamic Factory AB",
  /** Moderbolag/ägare. Redovisas öppet på /agande-och-intressen. */
  parentName: "Cloud Ahead AB",
  url: "https://d365.se",
  logoUrl: "https://d365.se/d365guide-logo.png",
  description:
    "Köparsidig guide som hjälper svenska företag att förstå Microsoft Dynamics 365 och hitta rätt partner utifrån behov, bransch och storlek.",
  foundingDate: "2020",
  countryCode: "SE",
  countryName: "Sweden",
  /** Bevakad brevlåda. Visas på kontaktsidan och i schema/llms.txt. */
  email: "thomas.laine@dynamicfactory.se",
  /** E.164-format i schema och tel:-länkar. */
  telephoneE164: "+46722324060",
  /** Läsbart format i synlig text. Samma nummer, ett enda skrivsätt. */
  telephoneDisplay: "+46 72 232 40 60",
  contactPath: "/kontakt",
  /** Företagsinformation i footern. Lämna tomt tills verifierat värde finns. */
  organizationNumber: "",
  vatNumber: "",
  postalAddress: "",
  /** Endast verifierade profiler – inga gissade URL:er. */
  sameAs: ["https://dynamicfactory.se"],
  advisors: [
    {
      name: "Thomas Laine",
      email: "thomas.laine@dynamicfactory.se",
      telephoneE164: "+46722324060",
      telephoneDisplay: "+46 72 232 40 60",
    },
    {
      name: "Michael Uhman",
      email: "michael.uhman@dynamicfactory.se",
      telephoneE164: "+46705748850",
      telephoneDisplay: "+46 70 574 88 50",
    },
  ],
} as const;

/** "d365.se (Dynamic Factory AB)" – för copyright- och utgivarrader. */
export const ORGANIZATION_ATTRIBUTION = `${ORGANIZATION.name} (${ORGANIZATION.legalName})`;
