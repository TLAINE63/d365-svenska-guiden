/**
 * Översätter adresser från d365guide.com till motsvarande sida på d365.se.
 *
 * D365Guide:s språkväljare skickar besökare som väljer "Sverige | SV" till
 * https://d365.se + samma path, t.ex. /all-partners/ eller /no/velg-partner/.
 * Sådana adresser finns inte här och gav 404. NotFound använder
 * `resolveD365GuidePath` för att leda besökaren till rätt svensk sida i stället.
 *
 * Slug-tabellen speglar D365Guide:s routeSlugs.ts (en/no/dk/fi -> sv) men
 * pekar på d365.se:s faktiska adresser.
 */

const LOCALE_PREFIXES = new Set(["en", "no", "dk", "fi", "sv"]);

/** [d365.se-mall, ...mallar från d365guide.com]. `:x` är dynamiska segment. */
const SLUG_TABLE: Array<[string, string[]]> = [
  ["branscher/:slug", ["industries/:slug", "bransjer/:slug", "brancher/:slug", "toimialat/:slug"]],
  ["branscher", ["industries", "bransjer", "brancher", "toimialat"]],
  ["kontakt", ["contact", "yhteystiedot"]],
  ["kunskapscenter/videor", ["knowledge/videos", "kunnskap/videos", "viden/videos", "tietopankki/videot", "kunskapscenter/videos"]],
  ["kunskapscenter/upphandlingsresan", ["knowledge/procurement-journey", "kunnskap/anskaffelsesreise", "viden/indkoebsrejse", "tietopankki/hankintamatka"]],
  ["kunskapscenter/business-central-tillagg/katalog", ["knowledge/business-central-addons/catalog", "kunnskap/business-central-tillegg/katalog", "viden/business-central-tillaeg/katalog", "tietopankki/business-central-lisaosat/luettelo"]],
  ["kunskapscenter/dynamics-365-tillagg/:kategori", ["knowledge/dynamics-365-addons/:kategori", "kunnskap/dynamics-365-tillegg/:kategori", "viden/dynamics-365-tillaeg/:kategori", "tietopankki/dynamics-365-lisaosat/:kategori"]],
  ["kunskapscenter/dynamics-365-tillagg", ["knowledge/dynamics-365-addons", "kunnskap/dynamics-365-tillegg", "viden/dynamics-365-tillaeg", "tietopankki/dynamics-365-lisaosat"]],
  ["kunskapscenter/:hub/:slug", ["knowledge/:hub/:slug", "kunnskap/:hub/:slug", "viden/:hub/:slug", "tietopankki/:hub/:slug"]],
  ["kunskapscenter/:hub", ["knowledge/:hub", "kunnskap/:hub", "viden/:hub", "tietopankki/:hub"]],
  ["kunskapscenter", ["knowledge", "kunnskap", "viden", "tietopankki"]],
  ["artiklar/:slug", ["articles/:slug", "artikler/:slug", "artikkelit/:slug"]],
  ["priser", ["pricing", "hinnat"]],
  ["befintlig-kund", ["existing-customer", "eksisterende-kunde", "olemassa-oleva-asiakas"]],
  ["kostnad", ["cost", "omkostninger", "kustannukset"]],
  ["valjdynamics365partner", ["choose-partner", "velg-partner", "vaelg-partner", "valitse-kumppani"]],
  ["alla-d365-partners", ["all-partners", "alle-partnere", "kaikki-kumppanit"]],
  ["partners-per-bransch", ["partners-by-industry", "partnere-per-bransje", "partnere-per-branche", "kumppanit-toimialoittain"]],
  ["jamfor-partners", ["compare-partners", "sammenlign-partnere", "vertaa-kumppaneita"]],
  ["compare/:slug", ["isv-compare/:slug", "isv-sammenligning/:slug"]],
  ["jamfor/:slug", ["sammenlign/:slug", "vertaa/:slug"]],
  ["jamfor", ["compare", "sammenlign", "vertaa"]],
  ["ERPbehovsanalys", ["erp-needs-analysis", "erp-behovsanalyse", "erp-tarvekartoitus"]],
  ["CRMbehovsanalys", ["crm-needs-analysis", "crm-behovsanalyse", "crm-tarvekartoitus"]],
  ["kundservice-behovsanalys", ["customer-service-needs-analysis", "kundeservice-behovsanalyse", "asiakaspalvelu-tarvekartoitus"]],
  ["kravspecifikation-sales", ["requirements-spec-sales", "kravspesifikasjon-salg", "kravspecifikation-salg", "vaatimusmaarittely-myynti"]],
  ["kravspecifikation-marketing", ["requirements-spec-marketing", "kravspesifikasjon-marked", "vaatimusmaarittely-markkinointi"]],
  ["kravspecifikation-kundservice", ["requirements-spec-customer-service", "kravspesifikasjon-kundeservice", "kravspecifikation-kundeservice", "vaatimusmaarittely-asiakaspalvelu"]],
  ["kravspecifikation", ["requirements-spec", "kravspesifikasjon", "vaatimusmaarittely"]],
  ["kom-igang", ["get-started", "kom-i-gang", "aloita"]],
  ["beslutsmognad/diagnostik", ["decision-maturity/diagnostic", "beslutningsmodenhet/diagnostikk", "beslutningsmodenhed/diagnostik", "paatoksentekokypsyys/diagnostiikka"]],
  ["beslutsmognad/resultat", ["decision-maturity/result", "beslutningsmodenhet/resultat", "beslutningsmodenhed/resultat", "paatoksentekokypsyys/tulos"]],
  ["beslutsmognad/tack", ["decision-maturity/thanks", "beslutningsmodenhet/takk", "beslutningsmodenhed/tak", "paatoksentekokypsyys/kiitos"]],
  ["beslutsmognad", ["decision-maturity", "beslutningsmodenhet", "beslutningsmodenhed", "paatoksentekokypsyys"]],
  ["agande-och-intressen", ["ownership-and-interests", "eierskap-og-interesser", "ejerskab-og-interesser", "omistajuus-ja-intressit"]],
  ["friskrivning", ["disclaimer", "ansvarsfraskrivelse", "vastuuvapautus"]],
  ["dataskydd", ["privacy", "personvern", "privatliv", "tietosuoja"]],
  ["AI-sok", ["ai-search", "ai-sok", "ai-soegning", "ai-haku"]],
  ["fraga-ai", ["ask-ai", "spor-ai", "spoerg-ai", "kysy-ai"]],
  ["upphandlingsguiden", ["procurement-guide", "anskaffelsesguide", "indkoebsguide", "hankintaopas"]],
  ["guider/valja-dynamics-365-partner", ["guides/choosing-a-dynamics-365-partner", "guider/velge-dynamics-365-partner", "guides/vaelge-dynamics-365-partner", "oppaat/dynamics-365-kumppanin-valinta"]],
  ["guider/valja-business-central-partner", ["guides/choosing-a-business-central-partner", "guider/velge-partner-business-central", "guides/vaelge-partner-business-central", "oppaat/business-central-kumppanin-valinta", "guider/valja-partner-business-central"]],
  ["guider/valja-finance-supply-chain-partner", ["guides/choosing-a-finance-supply-chain-partner", "guider/velge-partner-finance-supply-chain", "guides/vaelge-partner-finance-supply-chain", "oppaat/finance-supply-chain-kumppanin-valinta", "guider/valja-partner-finance-supply-chain"]],
  ["guider/valja-dynamics-365-sales-partner", ["guides/choosing-a-dynamics-365-sales-partner", "guider/velge-partner-dynamics-365-sales", "guides/vaelge-partner-dynamics-365-sales", "oppaat/dynamics-365-sales-kumppanin-valinta", "guider/valja-partner-dynamics-365-sales"]],
  ["guider/valja-customer-service-field-service-partner", ["guides/choosing-a-customer-service-field-service-partner", "guider/velge-partner-customer-service-field-service", "guides/vaelge-partner-customer-service-field-service", "oppaat/customer-service-field-service-kumppanin-valinta", "guider/valja-partner-customer-service-field-service"]],
  ["guider", ["guides", "oppaat"]],
  ["partnernytt/artikel/:id", ["partner-news/article/:id", "partnernytt/artikkel/:id", "partnernyt/artikel/:id", "kumppaniuutiset/artikkeli/:id"]],
  ["partnernytt", ["partner-news", "partnernyt", "kumppaniuutiset"]],
  ["om-thomas-laine", ["about-thomas-laine", "tietoa-thomas-laine"]],
  ["om-michael-uhman", ["about-michael-uhman", "tietoa-michael-uhman"]],
  ["partnerprogram", ["partner-program", "kumppaniohjelma"]],
  ["kortlista", ["shortlist", "kortliste"]],
  ["forfragan/tack", ["inquiry/thanks", "foresporsel/takk", "forespoergsel/tak", "tiedustelu/kiitos"]],
  ["roller", ["roles", "roolit"]],
  ["kompetens/:slug", ["expertise/:slug", "kompetanse/:slug", "ekspertise/:slug", "osaaminen/:slug"]],
  ["kompetens", ["expertise", "kompetanse", "ekspertise", "osaaminen"]],
  ["min-plan", ["my-plan"]],
  ["lankar-till-d365", ["links-to-d365guide"]],
  ["implementationskalkylator", ["implementation-calculator"]],
  ["kostnadskalkylator", ["calculator", "kalkulator"]],
  ["konto", ["sign-in", "signin", "login", "auth"]],
];

/** Kunskapscentrets hubbar har egna översatta slugs på D365Guide. */
const HUB_ALIASES: Record<string, string> = {
  procurement: "upphandling",
  "business-central-addons": "business-central-tillagg",
  "business-central-tillegg": "business-central-tillagg",
  "business-central-tillaeg": "business-central-tillagg",
  "business-central-lisaosat": "business-central-tillagg",
  videos: "videor",
  videot: "videor",
};

function matchTemplate(template: string, segments: string[]): Record<string, string> | null {
  const parts = template.split("/");
  if (parts.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith(":")) {
      if (!segments[i]) return null;
      params[p.slice(1)] = segments[i];
    } else if (p.toLowerCase() !== segments[i].toLowerCase()) {
      return null;
    }
  }
  return params;
}

function fill(template: string, params: Record<string, string>): string {
  return template
    .split("/")
    .map((p) => {
      if (!p.startsWith(":")) return p;
      const key = p.slice(1);
      const value = params[key] ?? "";
      return key === "hub" ? HUB_ALIASES[value] ?? value : value;
    })
    .join("/");
}

function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Returnerar d365.se-adressen (med avslutande snedstreck) som motsvarar en
 * d365guide.com-adress, eller null om ingen översättning behövs/finns.
 */
export function resolveD365GuidePath(pathname: string): string | null {
  const segments = safeDecode(pathname).split("/").filter(Boolean);
  if (segments.length === 0) return null;

  let hadPrefix = false;
  if (LOCALE_PREFIXES.has(segments[0].toLowerCase())) {
    segments.shift();
    hadPrefix = true;
  }
  if (segments.length === 0) return "/";

  for (const [target, sources] of SLUG_TABLE) {
    for (const source of sources) {
      const params = matchTemplate(source, segments);
      if (params) return `/${fill(target, params)}/`;
    }
  }

  // Okänd slug men med språkprefix (t.ex. /no/crm): prova samma sida utan prefix.
  if (hadPrefix) return `/${segments.join("/")}/`;
  return null;
}
