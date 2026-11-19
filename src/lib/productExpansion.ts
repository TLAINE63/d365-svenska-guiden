/**
 * Paket 2: naturliga nästa steg för den som redan har en Dynamics 365-applikation.
 * Alla applikationer är likvärdiga på d365.se, men alla kombinationer är inte lika
 * naturliga. Ordningen speglar typiska utvecklingsvägar och varje steg motiveras av
 * ett affärsbehov, aldrig enbart teknisk kompatibilitet. Ingen partner- eller
 * rankningslogik läser detta.
 */
export type ExpansionProduct =
  | "business-central"
  | "finance-supply-chain"
  | "sales"
  | "customer-service"
  | "field-service"
  | "marketing"
  | "contact-center";

export interface ExpansionStep {
  product: ExpansionProduct;
  /** Affärsbehovet som motiverar steget. */
  need: string;
  /** "typisk" = prioriterad väg, "vid-behov" = öppen men inte standard. */
  strength: "typisk" | "vid-behov";
}

export const PRODUCT_INFO: Record<ExpansionProduct, { label: string; href: string }> = {
  "business-central": { label: "Business Central", href: "/businesscentral/" },
  "finance-supply-chain": { label: "Finance & Supply Chain", href: "/finance-supply-chain/" },
  sales: { label: "Sales", href: "/d365sales/" },
  "customer-service": { label: "Customer Service", href: "/d365customerservice/" },
  "field-service": { label: "Field Service", href: "/d365fieldservice/" },
  marketing: { label: "Customer Insights", href: "/d365marketing/" },
  "contact-center": { label: "Contact Center", href: "/d365contactcenter/" },
};

export const EXPANSION_PATHS: Record<ExpansionProduct, ExpansionStep[]> = {
  "business-central": [
    { product: "sales", need: "När säljarbetet behöver pipeline, prognoser och offerter kopplade till ordrar och kunddata i affärssystemet.", strength: "typisk" },
    { product: "customer-service", need: "När kundärenden, reklamationer och garantier behöver hanteras med samma kund- och orderhistorik.", strength: "typisk" },
    { product: "marketing", need: "När kampanjer och kundresor ska bygga på köp- och kunddata som redan finns.", strength: "vid-behov" },
  ],
  "finance-supply-chain": [
    { product: "sales", need: "När säljprocessen behöver kopplas till produktion, leveransförmåga och kreditlimiter.", strength: "typisk" },
    { product: "customer-service", need: "När kundservice behöver se order, leveranser och fakturor för att lösa ärenden snabbt.", strength: "typisk" },
    { product: "field-service", need: "När service ute hos kund behöver planering, reservdelar och fakturering ihop med lager och ekonomi.", strength: "typisk" },
  ],
  sales: [
    { product: "marketing", need: "När marknad ska leverera kvalificerade leads och följa upp kundresor som säljarna kan ta vidare.", strength: "typisk" },
    { product: "customer-service", need: "När kunden efter affären behöver service med samma kundbild som säljarna ser.", strength: "typisk" },
  ],
  "customer-service": [
    { product: "contact-center", need: "När röst, chatt och fler kanaler behöver styras, bemannas och automatiseras i en gemensam lösning.", strength: "typisk" },
    { product: "marketing", need: "När ärendedata ska användas för att förebygga kontakter och följa upp kundnöjdhet.", strength: "typisk" },
    { product: "sales", need: "När servicekontakter regelbundet leder till merförsäljning som behöver följas upp.", strength: "vid-behov" },
  ],
  "field-service": [
    { product: "customer-service", need: "När ärenden ska kunna bli serviceuppdrag utan dubbelregistrering.", strength: "typisk" },
  ],
  marketing: [
    { product: "sales", need: "När leads från kampanjer behöver hanteras i en strukturerad säljprocess.", strength: "vid-behov" },
    { product: "customer-service", need: "När kundresor även ska omfatta service och uppföljning efter köp.", strength: "vid-behov" },
  ],
  "contact-center": [
    { product: "customer-service", need: "När kontakterna behöver bli spårbara ärenden med SLA och kunskapsbas.", strength: "typisk" },
  ],
};

/** Copilot och agenter kompletterar samtliga vägar, aldrig som eget produktsteg. */
export const COPILOT_NOTE =
  "Copilot och AI-agenter kan ofta tas i bruk i den lösning ni redan har. Börja med en konkret arbetsuppgift innan ni lägger till en ny applikation.";

export const expansionFor = (product: ExpansionProduct): ExpansionStep[] =>
  [...(EXPANSION_PATHS[product] ?? [])].sort((a, b) =>
    a.strength === b.strength ? 0 : a.strength === "typisk" ? -1 : 1,
  );
