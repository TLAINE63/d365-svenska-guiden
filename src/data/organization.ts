/**
 * Enda källan för entitetsdata om d365.se.
 *
 * Allt som beskriver vem som driver sajten – namn, juridiskt namn, ägare,
 * e-post och telefon – ska hämtas härifrån så att schema, footer, kontaktsida
 * och llms.txt säger exakt samma sak. AI-system knyter ihop varumärket bättre
 * när uppgifterna är identiska på alla ytor.
 */

import { rawSiteText, siteText, toE164 } from "./siteTexts";

export const ORGANIZATION = {
  /** Varumärkes-/sajtnamn – används som primärt namn överallt. */
  name: "d365.se",
  /** Juridisk person som driver sajten. */
  legalName: "Moveahead AB (Dynamic Factory)",
  /** Moderbolag/ägare. Redovisas öppet på /agande-och-intressen. */
  parentName: "Moveahead AB",
  url: "https://d365.se",
  logoUrl: "https://d365.se/d365guide-logo.png",
  description: rawSiteText("org.description"),
  foundingDate: "2020",
  countryCode: "SE",
  countryName: "Sweden",
  /** Bevakad brevlåda. Visas på kontaktsidan och i schema/llms.txt. */
  email: rawSiteText("contact.email"),
  /** E.164-format i schema och tel:-länkar. */
  telephoneE164: toE164(rawSiteText("contact.phone")),
  /** Läsbart format i synlig text. Samma nummer, ett enda skrivsätt. */
  telephoneDisplay: rawSiteText("contact.phone"),
  contactPath: "/kontakt",
  /** Företagsinformation i footern. Lämna tomt tills verifierat värde finns. */
  organizationNumber: "559045-6041",
  vatNumber: "SE559045604101",
  postalAddress: "",
  /** Endast verifierade profiler – inga gissade URL:er. */
  sameAs: ["https://dynamicfactory.se"],
  advisors: [
    {
      name: "Thomas Laine",
      email: rawSiteText("founder.thomas.email"),
      telephoneE164: toE164(rawSiteText("founder.thomas.phone")),
      telephoneDisplay: rawSiteText("founder.thomas.phone"),
    },
    {
      name: "Michael Uhman",
      email: rawSiteText("founder.michael.email"),
      telephoneE164: toE164(rawSiteText("founder.michael.phone")),
      telephoneDisplay: rawSiteText("founder.michael.phone"),
    },
  ],
};

/** "d365.se (Dynamic Factory)" – för copyright- och utgivarrader. */
export const ORGANIZATION_ATTRIBUTION = `${ORGANIZATION.name} (${ORGANIZATION.legalName})`;

/** Ordagrann köparsidig beskrivning (Thomas beslut 2026-10-05). Används på startsida, /om-oss/ och /qa/. */
export const BUYER_SIDE_DESCRIPTION = siteText("buyer.description");
export const BUYER_SIDE_EXPLAINER = siteText("buyer.explainer");
export const BUYER_SIDE_LINK_TEXT = siteText("buyer.link_text");
export const ORGANIZATION_SCHEMA_DESCRIPTION = rawSiteText("org.schema_description");
