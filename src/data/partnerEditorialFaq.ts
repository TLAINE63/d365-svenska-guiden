/**
 * Redaktionella frågor och svar per partnerprofil (manuellt underhållna av d365.se-redaktionen).
 * Bygger på partnerns egna uppgifter i profilen; skriver aldrig över partnerns profilfält.
 */
export interface PartnerEditorialFaq {
  heading: string;
  faqs: { q: string; a: string }[];
  advisory: { heading: string; text: string };
}

export const PARTNER_EDITORIAL_FAQ: Record<string, PartnerEditorialFaq> = {
  "4ps-sweden": {
    heading: "Vanliga frågor om 4PS Construct",
    faqs: [
      {
        q: "Vad är 4PS Construct?",
        a: "4PS Construct är ett branschsystem för bygg-, installations- och serviceföretag som är byggt på Microsoft Dynamics\u00A0365 Business Central. Det samlar kalkyl, projektstyrning och projektredovisning, inköp, resursplanering, service och eftermarknad i samma affärssystem.",
      },
      {
        q: "Vem äger 4PS?",
        a: "4PS Construction Software AB är den svenska delen av 4PS Group, som enligt partnerns egna uppgifter ägs av Hilti sedan 2023. Produktutvecklingen sker i gruppen, medan den svenska enheten säljer, implementerar och ger support i Sverige.",
      },
      {
        q: "Vilka bygg- och installationsbolag använder 4PS Construct?",
        a: "Lösningen används av byggentreprenörer, installationsföretag inom el, VVS och ventilation, serviceföretag med underhållsavtal samt anläggnings- och miljöföretag med projektorienterade processer. Exempel på kunder som partnern anger är Assemblin, Caverion, Certego, Envac och Remondis.",
      },
      {
        q: "Vad kostar 4PS Construct?",
        a: "4PS Construct licensieras som ett branschpaket ovanpå Microsoft Dynamics\u00A0365 Business Central, inte som ett separat grundsystem. Totalkostnaden blir därför summan av Business Central-licenser efter antal användare och vilka rättigheter de behöver, plus licens för branschtillägget i de moduler ni tar i anspråk – till exempel kalkyl och mängdberäkning, projekt, fältservice och serviceavtal. Till det kommer engångskostnaden för införande, som beror på hur mycket data som ska migreras, antal projektmallar och omfattningen av integrationer. d365.se publicerar inte 4PS egen prislista, eftersom den följer partnerns och Microsofts licensmodeller och ändras över tid. Begär offert hos partnern och jämför totalsumman för de första åren, inte bara månadslicensen.",
      },
      {
        q: "Är 4PS Construct ett bra affärssystem för byggbolag?",
        a: "För bygg-, installations- och serviceföretag som arbetar projekt- och avtalsstyrt är 4PS Construct ett av de starkare alternativen på Business Central-sidan, eftersom det täcker hela kedjan från anbud, kalkyl och mängdberäkning genom produktion, projektredovisning och slutbesiktning till eftermarknad och serviceavtal. Styrkan är att kalkyl, projekt, tidrapportering, inköp, underentreprenörer, maskiner och KMA finns i samma system som ekonomin, vilket minskar manuella överföringar och dubbelarbete. Bedömningen vänder för bolag utanför bygg, installation och service, för organisationer vars behov snarare talar för Dynamics\u00A0365 Finance & Supply Chain Management, eller för er som redan har en fungerande kalkylprocess och främst saknar ekonomi.",
      },
      {
        q: "När passar 4PS Construct mindre bra?",
        a: "För företag utanför bygg, installation och service, och för organisationer vars ERP-behov snarare talar för Dynamics\u00A0365 Finance & Supply Chain Management.",
      },
    ],
    advisory: {
      heading: "Boka 20 minuters kostnadsfri rådgivning kring affärssystem för bygg och entreprenad med Thomas Laine",
      text: "Funderar ni på 4PS Construct eller ett annat branschsystem för bygg och entreprenad? Thomas Laine hjälper er att reda ut kraven och vilka alternativ som är värda att jämföra. Ingen partner deltar i samtalet.",
    },
  },
};
