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
        q: "När passar 4PS Construct mindre bra?",
        a: "För företag utanför bygg, installation och service, och för organisationer vars ERP-behov snarare talar för Dynamics\u00A0365 Finance & Supply Chain Management.",
      },
    ],
    advisory: {
      heading: "Inför partnervalet: boka 20 minuters kostnadsfri rådgivning",
      text: "Funderar ni på 4PS Construct eller ett annat branschsystem för bygg och entreprenad? Thomas Laine hjälper er att reda ut kraven och vilka alternativ som är värda att jämföra. Ingen partner deltar i samtalet.",
    },
  },
};
