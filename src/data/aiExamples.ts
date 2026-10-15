// Exempelbibliotek: "Ett nytt sätt att arbeta med Dynamics 365".
// Exempel skapade med vx() är granskade mot Microsoft Learn (källa + datum).
// Exempel skapade med ex() är användningsfall och visas som overifierade.
// Modellen är fristående (inga React-beroenden) så att BC-exemplen senare kan
// återanvändas på businesscentral.se via getExamplesForApplication("bc").

const D = "Dynamics\u00A0365";

export type AiCategory = "hitta" | "forsta" | "analysera" | "skapa" | "agera" | "automatisera";
export type AiApplication = "bc" | "sales" | "service" | "finance" | "scm" | "fieldservice" | "projectops";
export type AiType = "copilot" | "copilot-chat" | "inbyggd" | "agent" | "mcp";
export type AiRole =
  | "cfo" | "ekonom" | "saljare" | "saljchef" | "kundservice" | "inkopare" | "projektledare" | "servicepersonal";
export type AutomationLevel = "fraga" | "assistans" | "handling" | "automatisering";

export interface AiExample {
  id: string;
  slug: string;
  title: string;
  summary: string;
  application: AiApplication;
  category: AiCategory;
  businessArea: string;
  role: AiRole[];
  aiType: AiType;
  userGoal: string;
  traditionalWorkflow: string[];
  aiWorkflow: string[];
  promptExamples: string[];
  whatHappens: string;
  humanResponsibility: string;
  efficiencyBenefit: string;
  automationLevel: AutomationLevel;
  relatedExamples?: string[];
  sourceUrl?: string;
  sourceName?: string;
  verified: boolean;
  lastVerified?: string;
  ctaType: "produkt" | "losning" | "partner";
  ctaUrl: string;
}

export const AI_CATEGORIES: { key: AiCategory; label: string; text: string }[] = [
  { key: "hitta", label: "Hitta", text: "Få fram rätt information utan att leta i menyer." },
  { key: "forsta", label: "Förstå", text: "Få förklarat vad ett fält, en post eller en process betyder." },
  { key: "analysera", label: "Analysera", text: "Se mönster och avvikelser i listor och data." },
  { key: "skapa", label: "Skapa", text: "Ta fram utkast till texter, svar och sammanfattningar." },
  { key: "agera", label: "Agera", text: "Gå från insikt till nästa steg snabbare." },
  { key: "automatisera", label: "Automatisera", text: "Låt återkommande moment hanteras av ett flöde eller en agent." },
];

export const AI_APPLICATIONS: { key: AiApplication; label: string; icon: string; productUrl: string }[] = [
  { key: "bc", label: "Business Central", icon: "/d365-icons/BusinessCentral-new.webp", productUrl: "/businesscentral/" },
  { key: "sales", label: `${D} Sales`, icon: "/d365-icons/Sales.svg", productUrl: "/d365sales/" },
  { key: "service", label: "Customer Service", icon: "/d365-icons/CustomerService.svg", productUrl: "/d365customerservice/" },
  { key: "finance", label: "Finance", icon: "/d365-icons/Finance.svg", productUrl: "/finance-supply-chain/" },
  { key: "scm", label: "Supply Chain Management", icon: "/d365-icons/Finance.svg", productUrl: "/finance-supply-chain/" },
  { key: "fieldservice", label: "Field Service", icon: "/d365-icons/FieldService.svg", productUrl: "/d365fieldservice/" },
  { key: "projectops", label: "Project Operations", icon: "/d365-icons/ProjectOperations.svg", productUrl: "/d365projectoperations/" },
];

export const AI_TYPES: Record<AiType, { label: string; text: string }> = {
  copilot: { label: "Copilot", text: "AI hjälper användaren i det man redan gör." },
  "copilot-chat": { label: "Copilot Chat", text: "Användaren arbetar med naturligt språk i en dialog." },
  inbyggd: { label: "Inbyggd AI", text: "AI är en del av en specifik funktion eller process." },
  agent: { label: "Agent", text: "En agent hanterar delar av ett arbetsflöde." },
  mcp: { label: "MCP / avancerat", text: "Agentiska lösningar eller integrationer." },
};

export const AI_ROLES: Record<AiRole, string> = {
  cfo: "CFO / Ekonomichef", ekonom: "Ekonom", saljare: "Säljare", saljchef: "Säljchef",
  kundservice: "Kundservice", inkopare: "Inköpare", projektledare: "Projektledare", servicepersonal: "Servicepersonal",
};

export const AUTOMATION_STEPS: { key: AutomationLevel; label: string }[] = [
  { key: "fraga", label: "Fråga" },
  { key: "assistans", label: "Assistans" },
  { key: "handling", label: "Handling" },
  { key: "automatisering", label: "Automatisering" },
];

const VERIFIED_AT = "2026-10-15";
const ML = "https://learn.microsoft.com/sv-se/dynamics365";
const BC_CHAT = { sourceName: "Microsoft Learn: Chatta med Copilot i Business Central", sourceUrl: `${ML}/business-central/chat-with-copilot` };
const SALES_INFO = { sourceName: "Microsoft Learn: Hämta information med Copilot i Sales", sourceUrl: `${ML}/sales/copilot-get-information` };
const CS_COPILOT = { sourceName: "Microsoft Learn: Använd Copilot-funktioner i Customer Service", sourceUrl: `${ML}/customer-service/use/use-copilot-features` };

const TRAD_FIND = ["Meny", "Lista", "Filter", "Post", "Granska", "Åtgärd"];
const AI_FIND = ["Behov", "Fråga", "AI hjälper", "Du granskar", "Nästa steg"];

type Base = Omit<AiExample, "id" | "verified" | "traditionalWorkflow" | "aiWorkflow"> &
  Partial<Pick<AiExample, "traditionalWorkflow" | "aiWorkflow">>;

const ex = (e: Base): AiExample => ({
  traditionalWorkflow: TRAD_FIND,
  aiWorkflow: AI_FIND,
  ...e,
  id: e.slug,
  verified: false,
});

/** Verifierat exempel: kräver källa från Microsoft och granskningsdatum. */
const vx = (e: Base & { sourceUrl: string; sourceName: string }): AiExample => ({
  ...ex(e),
  verified: true,
  lastVerified: VERIFIED_AT,
});

export const AI_EXAMPLES: AiExample[] = [
  // BUSINESS CENTRAL (verifierade mot Microsoft Learn)
  vx({
    slug: "bc-hitta-faktura", title: "Hitta den senaste fakturan från en kund eller leverantör", application: "bc", category: "hitta",
    businessArea: "Ekonomi", role: ["ekonom"], aiType: "copilot-chat", ...BC_CHAT,
    summary: "Beskriv vilken faktura du letar efter i stället för att leta upp rätt lista och filtrera.",
    userGoal: "En leverantör ringer om sin senaste faktura. Jag vill snabbt se vilken det är och vad den gällde.",
    traditionalWorkflow: ["Öppna rätt sida", "Hitta rätt lista", "Filtrera på kund eller leverantör", "Sortera på datum", "Öppna posten"],
    aiWorkflow: ["Beskriv vad du söker", "Copilot hittar posten", "Öppna och granska"],
    promptExamples: ["Visa den senaste fakturan från Contoso.", "Vilken var den senaste inköpsfakturan från Fabrikam?"],
    whatHappens: "Copilot-chatten i Business Central kan söka efter poster utifrån en fråga på naturligt språk och visa träffar med länkar som öppnar posten.",
    humanResponsibility: "Du kontrollerar att det är rätt kund eller leverantör och rätt faktura innan du lämnar besked.",
    efficiencyBenefit: "Du behöver inte veta i vilken lista fakturan ligger eller vilka filter som ska sättas.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-dokumentnummer", "bc-forsta-process", "bc-analysera-lista"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-hitta-dokumentnummer", title: "Hitta information via dokumentnummer eller referens", application: "bc", category: "hitta",
    businessArea: "Order och ekonomi", role: ["ekonom", "saljare", "inkopare"], aiType: "copilot-chat", ...BC_CHAT,
    summary: "Har du bara ett nummer eller en referens? Fråga efter den i stället för att gissa vilken dokumenttyp det är.",
    userGoal: "Jag har ett ordernummer i ett mejl men vet inte om det är en order, en följesedel eller en faktura.",
    traditionalWorkflow: ["Gissa dokumenttyp", "Öppna listan", "Sök på numret", "Prova nästa lista", "Öppna posten"],
    aiWorkflow: ["Skriv numret i frågan", "Copilot hittar posten", "Granska"],
    promptExamples: ["Visa order 101005.", "Hitta dokumentet med externt dokumentnummer INV-2231."],
    whatHappens: "Copilot-chatten söker bland posterna i Business Central och returnerar matchande poster som du kan öppna.",
    humanResponsibility: "Du bedömer om träffen är rätt dokument, särskilt om flera poster har liknande nummer.",
    efficiencyBenefit: "Färre försök i olika listor när du bara har ett nummer att gå på.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-faktura", "bc-forsta-falt", "bc-sales-order-agent"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-forsta-process", title: "Fråga hur en Business Central-process fungerar", application: "bc", category: "forsta",
    businessArea: "Allmänt", role: ["ekonom"], aiType: "copilot-chat", ...BC_CHAT,
    summary: "Få en förklaring av en process du sällan gör, till exempel hur man krediterar en bokförd faktura.",
    userGoal: "Jag ska göra en kreditnota och minns inte stegen.",
    traditionalWorkflow: ["Sök i dokumentationen", "Läs", "Leta upp rätt sida", "Prova", "Fråga en kollega"],
    aiWorkflow: ["Fråga hur man gör", "Copilot förklarar stegen", "Utför själv"],
    promptExamples: ["Hur krediterar jag en bokförd försäljningsfaktura?", "Hur fungerar periodavslut i Business Central?"],
    whatHappens: "Copilot-chatten kan svara på frågor om hur Business Central fungerar, med stöd i Microsofts dokumentation.",
    humanResponsibility: "Du utför och bokför själv och följer era egna rutiner, som kan skilja sig från standardbeskrivningen.",
    efficiencyBenefit: "Mindre letande i dokumentation för moment du gör några gånger per år.",
    automationLevel: "fraga", relatedExamples: ["bc-forsta-falt", "bc-hitta-faktura", "bc-bankavstamning"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-forsta-falt", title: "Fråga vad ett fält betyder eller används till", application: "bc", category: "forsta",
    businessArea: "Allmänt", role: ["ekonom", "inkopare"], aiType: "copilot-chat", ...BC_CHAT,
    summary: "Få förklarat vad ett fält styr innan du ändrar det.",
    userGoal: "Jag förstår inte vad ett fält på artikelkortet påverkar och vill inte ändra fel.",
    traditionalWorkflow: ["Läs verktygstipset", "Sök i hjälpen", "Fråga en kollega", "Testa"],
    aiWorkflow: ["Fråga om fältet", "Copilot förklarar", "Du beslutar"],
    promptExamples: ["Vad används fältet Lagerbokföringsmall till?", "Vad betyder Kostnadsmetod på artikelkortet?"],
    whatHappens: "Copilot-chatten kan förklara fält och begrepp i Business Central utifrån dokumentationen.",
    humanResponsibility: "Ändringar av inställningar beslutar du, gärna tillsammans med den som ansvarar för systemet.",
    efficiencyBenefit: "Färre frågor till nyckelanvändare om grundläggande begrepp.",
    automationLevel: "fraga", relatedExamples: ["bc-forsta-process", "bc-hitta-dokumentnummer", "bc-analysera-lista"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-analysera-lista", title: "Skapa en analys av en lista med naturligt språk", application: "bc", category: "analysera",
    businessArea: "Ekonomi och försäljning", role: ["cfo", "ekonom"], aiType: "copilot",
    sourceName: "Microsoft Learn: Analysera listdata med Copilot", sourceUrl: `${ML}/business-central/analysis-assist`,
    summary: "Beskriv vilken analys du vill ha av en lista i stället för att exportera till Excel.",
    userGoal: "Jag vill se försäljning per kund och månad utan att bygga en pivottabell.",
    traditionalWorkflow: ["Öppna listan", "Exportera till Excel", "Bygg pivottabell", "Gruppera", "Tolka"],
    aiWorkflow: ["Öppna analysläget", "Beskriv analysen", "Copilot bygger vyn", "Granska och justera"],
    promptExamples: ["Visa försäljning per kund och månad.", "Gruppera på säljare och visa summa belopp."],
    whatHappens: "I analysläget på en lista kan Copilot skapa en analysflik med rader, kolumner och summeringar utifrån din beskrivning.",
    humanResponsibility: "Du kontrollerar urval, period och summeringar innan du drar slutsatser.",
    efficiencyBenefit: "Exporten och den manuella pivoteringen kan hoppas över för vanliga frågor.",
    automationLevel: "assistans", relatedExamples: ["bc-andra-analys", "bc-hitta-faktura", "bc-forsta-falt"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-andra-analys", title: "Ändra en befintlig analys genom att beskriva ändringen", application: "bc", category: "analysera",
    businessArea: "Ekonomi och försäljning", role: ["cfo", "ekonom"], aiType: "copilot",
    sourceName: "Microsoft Learn: Analysera listdata med Copilot", sourceUrl: `${ML}/business-central/analysis-assist`,
    summary: "Justera en analysvy genom att säga vad du vill ändra, i stället för att dra om fält.",
    userGoal: "Analysen är nästan rätt, men jag vill ha kvartal i stället för månad och bara ett land.",
    traditionalWorkflow: ["Öppna analysfliken", "Hitta fältlistan", "Dra om kolumner", "Sätt filter", "Kontrollera"],
    aiWorkflow: ["Beskriv ändringen", "Copilot justerar", "Granska"],
    promptExamples: ["Visa per kvartal i stället för per månad.", "Ta bara med kunder i Sverige."],
    whatHappens: "Copilot kan ändra en analysflik som redan finns utifrån en beskrivning av vad som ska ändras.",
    humanResponsibility: "Du kontrollerar att analysen fortfarande visar det du menar efter ändringen.",
    efficiencyBenefit: "Mindre tid på att hitta rätt inställning i analysläget.",
    automationLevel: "assistans", relatedExamples: ["bc-analysera-lista", "bc-bankavstamning", "bc-forsta-falt"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-skapa-produkttext", title: "Skapa produkt- och marknadstext med Copilot", application: "bc", category: "skapa",
    businessArea: "Artiklar och e-handel", role: ["saljare"], aiType: "inbyggd",
    sourceName: "Microsoft Learn: Lägg till marknadsföringstext till artiklar", sourceUrl: `${ML}/business-central/item-marketing-text`,
    summary: "Få ett första utkast till produktbeskrivning utifrån artikelns egenskaper.",
    userGoal: "Vi har många artiklar utan säljande beskrivning i webbutiken.",
    traditionalWorkflow: ["Öppna artikeln", "Läs egenskaperna", "Skriv text", "Korrläs", "Spara"],
    aiWorkflow: ["Välj Utkast med Copilot", "Välj ton och längd", "Redigera", "Spara"],
    promptExamples: ["Skriv en saklig text som lyfter hållbarheten.", "Gör texten kortare och mindre säljig."],
    whatHappens: "På artikelkortet kan Copilot skriva ett utkast till marknadsföringstext utifrån artikelns attribut, med val av ton och längd.",
    humanResponsibility: "Du granskar och ansvarar för att texten är korrekt och inte lovar egenskaper produkten saknar.",
    efficiencyBenefit: "Det första utkastet behöver inte skrivas från tomt papper för varje artikel.",
    automationLevel: "assistans", relatedExamples: ["service-skapa-svar", "bc-sales-order-agent", "bc-forsta-falt"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-bankavstamning", title: "Arbeta med AI vid bankavstämning", application: "bc", category: "agera",
    businessArea: "Ekonomi", role: ["ekonom"], aiType: "inbyggd",
    sourceName: "Microsoft Learn: Bankavstämning med Copilot", sourceUrl: `${ML}/business-central/bank-reconciliation-with-copilot`,
    summary: "Låt Copilot föreslå matchningar mellan bankrader och bokförda poster, som du sedan godkänner.",
    userGoal: "Bankavstämningen tar lång tid eftersom många rader inte matchas automatiskt.",
    traditionalWorkflow: ["Importera kontoutdrag", "Matcha automatiskt", "Leta upp resten", "Matcha manuellt", "Bokför"],
    aiWorkflow: ["Starta avstämning med Copilot", "Granska förslag", "Godkänn", "Bokför"],
    promptExamples: ["Stäm av bankkontot med Copilot.", "Föreslå konton för de rader som inte matchade."],
    whatHappens: "Copilot föreslår matchningar för bankrader och kan föreslå konton för rader utan motsvarande post. Förslagen visas för granskning innan något sparas.",
    humanResponsibility: "Du granskar varje förslag och beslutar vad som ska bokföras.",
    efficiencyBenefit: "Mindre manuell matchning av rader som standardregeln inte klarar.",
    automationLevel: "handling", relatedExamples: ["bc-analysera-lista", "bc-forsta-process", "bc-sales-order-agent"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-sales-order-agent", title: "Sales Order Agent: från förfrågan till orderutkast", application: "bc", category: "automatisera",
    businessArea: "Order", role: ["saljare"], aiType: "agent",
    sourceName: "Microsoft Learn: Sales Order Agent", sourceUrl: `${ML}/business-central/sales-order-agent`,
    summary: "En agent läser inkommande kundförfrågningar per e-post och tar fram offerter och order för granskning.",
    userGoal: "Vi får många förfrågningar per e-post som skrivs in manuellt.",
    traditionalWorkflow: ["Läs e-post", "Hitta kunden", "Skapa offert", "Skriv rader", "Kontrollera", "Svara"],
    aiWorkflow: ["Förfrågan kommer in", "Agenten skapar utkast", "Du granskar", "Godkänn och skicka"],
    promptExamples: ["(Kundens mejl) Vi vill beställa 20 st av artikel 1896-S till nästa vecka."],
    whatHappens: "Agenten bevakar en brevlåda, identifierar kund och artiklar, kontrollerar tillgänglighet och skapar offert- eller orderutkast. Steg som kräver granskning stannar tills en användare godkänner.",
    humanResponsibility: "Du godkänner utkast och svar och bestämmer vilka behörigheter agenten har.",
    efficiencyBenefit: "Manuell inskrivning av förfrågningar minskar och granskning blir huvudmomentet.",
    automationLevel: "automatisering", relatedExamples: ["bc-hitta-dokumentnummer", "bc-skapa-produkttext", "bc-bankavstamning"],
    ctaType: "partner", ctaUrl: "/agents/",
  }),
  // DYNAMICS 365 SALES (verifierade)
  vx({
    slug: "sales-sammanfatta-lead", title: "Sammanfatta ett lead", application: "sales", category: "forsta",
    businessArea: "Försäljning", role: ["saljare"], aiType: "copilot", ...SALES_INFO,
    summary: "Få en kort bild av ett lead innan du tar första kontakten.",
    userGoal: "Jag har fått ett nytt lead och vill veta vad vi vet innan jag ringer.",
    traditionalWorkflow: ["Öppna leadet", "Läs fälten", "Läs tidslinjen", "Kolla företaget", "Sammanfatta själv"],
    aiWorkflow: ["Öppna leadet", "Be om en sammanfattning", "Granska"],
    promptExamples: ["Sammanfatta det här leadet.", "Vad vet vi om det här företaget?"],
    whatHappens: "Copilot i Sales kan sammanfatta ett lead utifrån uppgifterna och aktiviteterna som finns registrerade.",
    humanResponsibility: "Du bedömer om leadet är relevant och hur du tar kontakt.",
    efficiencyBenefit: "Mindre läsning av fält och historik före första kontakten.",
    automationLevel: "assistans", relatedExamples: ["sales-sammanfatta-opportunity", "sales-forbered-kundkontakt", "sales-uppgifter-uppmarksamhet"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  vx({
    slug: "sales-sammanfatta-opportunity", title: "Sammanfatta en affärsmöjlighet", application: "sales", category: "forsta",
    businessArea: "Försäljning", role: ["saljare", "saljchef"], aiType: "copilot", ...SALES_INFO,
    summary: "Få status, nyckeluppgifter och senaste aktiviteter för en affär i en kort sammanfattning.",
    userGoal: "Jag tar över en affär från en kollega och vill förstå läget snabbt.",
    traditionalWorkflow: ["Öppna affären", "Läs anteckningar", "Läs e-post", "Kolla kontakter", "Sammanfatta"],
    aiWorkflow: ["Öppna affären", "Be om sammanfattning", "Granska", "Planera nästa steg"],
    promptExamples: ["Sammanfatta den här affärsmöjligheten.", "Vilka är de viktigaste kontakterna?"],
    whatHappens: "Copilot sammanfattar affärsmöjligheten utifrån posten och dess relaterade aktiviteter.",
    humanResponsibility: "Sammanfattningen är ett stöd. Viktiga detaljer verifierar du med kollega eller kund.",
    efficiencyBenefit: "Överlämningar kräver mindre genomläsning av historik.",
    automationLevel: "assistans", relatedExamples: ["sales-forandring-affar", "sales-sammanfatta-lead", "sales-forbered-kundkontakt"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  vx({
    slug: "sales-forandring-affar", title: "Se de senaste förändringarna i en affär", application: "sales", category: "forsta",
    businessArea: "Försäljning", role: ["saljchef", "saljare"], aiType: "copilot", sourceName: "Microsoft Learn: Fråga Copilot om senaste ändringar i säljposter", sourceUrl: `${ML}/sales/copilot-ask-questions`,
    summary: "Se vad som ändrats sedan du senast tittade, utan att läsa hela historiken.",
    userGoal: "Inför pipelinemötet vill jag veta vad som hänt på de största affärerna.",
    traditionalWorkflow: ["Öppna affären", "Läs tidslinjen", "Jämför fält", "Anteckna"],
    aiWorkflow: ["Fråga vad som är nytt", "Copilot listar ändringar", "Granska"],
    promptExamples: ["Vad är nytt på den här affären?", "Vad har ändrats den senaste veckan?"],
    whatHappens: "Copilot kan visa vad som uppdaterats på en post, till exempel ändrade fält och nya aktiviteter.",
    humanResponsibility: "Du bedömer om förändringarna påverkar prognos och prioritering.",
    efficiencyBenefit: "Genomgångar kan fokusera på det som ändrats.",
    automationLevel: "fraga", relatedExamples: ["sales-sammanfatta-opportunity", "sales-uppgifter-uppmarksamhet", "sales-forbered-kundkontakt"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  vx({
    slug: "sales-forbered-kundkontakt", title: "Förbered information inför ett kundmöte", application: "sales", category: "agera",
    businessArea: "Försäljning", role: ["saljare"], aiType: "copilot",
    sourceName: "Microsoft Learn: Förbered säljmöten med Copilot i Sales", sourceUrl: `${ML}/sales/copilot-stay-ahead`,
    summary: "Få en samlad bild av kund, affär och senaste kontakter inför mötet.",
    userGoal: "Jag har ett kundmöte om en timme och vill vara påläst.",
    traditionalWorkflow: ["Öppna kunden", "Läs affärer", "Sök i e-post", "Läs anteckningar", "Skriv minneslista"],
    aiWorkflow: ["Öppna mötesförberedelsen", "Läs sammanfattningen", "Ställ följdfrågor"],
    promptExamples: ["Förbered mig inför mötet med Contoso.", "Vilka öppna frågor finns hos kunden?"],
    whatHappens: "Mötesförberedelsen samlar en kort sammanfattning av mötessammanhanget, relaterade affärer och senaste kommunikationen med kunden.",
    humanResponsibility: "Du väljer vad som tas upp och hur.",
    efficiencyBenefit: "Förberedelse som krävde flera vyer och inkorgen samlas på ett ställe.",
    automationLevel: "assistans", relatedExamples: ["sales-sammanfatta-opportunity", "sales-sammanfatta-lead", "sales-forandring-affar"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  vx({
    slug: "sales-uppgifter-uppmarksamhet", title: "Identifiera affärer som behöver uppmärksamhet", application: "sales", category: "agera",
    businessArea: "Försäljning", role: ["saljare", "saljchef"], aiType: "copilot",
    sourceName: "Microsoft Learn: Fråga Copilot om senaste ändringar i säljposter", sourceUrl: `${ML}/sales/copilot-ask-questions`,
    summary: "Få en överblick över vilka poster som uppdaterats och kan behöva följas upp.",
    userGoal: "Jag vill börja dagen med de affärer som behöver mig mest.",
    traditionalWorkflow: ["Öppna vyn", "Sortera", "Öppna affär för affär", "Bedöm", "Planera"],
    aiWorkflow: ["Fråga vad som är nytt", "Copilot lyfter fram poster", "Du prioriterar"],
    promptExamples: ["Vad har hänt med mina affärer sedan i går?", "Vilka av mina affärer har uppdaterats?"],
    whatHappens: "Copilot kan lyfta fram uppdateringar på affärer och konton du följer, så att du ser var något har hänt.",
    humanResponsibility: "Prioriteringen och uppföljningen är fortfarande ditt beslut.",
    efficiencyBenefit: "Mindre tid på att själv gå igenom listor för att hitta förändringar.",
    automationLevel: "assistans", relatedExamples: ["sales-forandring-affar", "sales-forbered-kundkontakt", "sales-sammanfatta-lead"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  // CUSTOMER SERVICE (verifierade)
  vx({
    slug: "service-sammanfatta-arende", title: "Sammanfatta ett kundärende", application: "service", category: "forsta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot", ...CS_COPILOT,
    summary: "Få en kort sammanfattning av ett ärende innan du svarar eller tar över det.",
    userGoal: "Jag tar över ett ärende med lång historik.",
    traditionalWorkflow: ["Öppna ärendet", "Läs anteckningar", "Läs e-post", "Läs tidslinjen", "Sammanfatta"],
    aiWorkflow: ["Öppna ärendet", "Be om sammanfattning", "Granska"],
    promptExamples: ["Sammanfatta ärendet.", "Vad har kunden redan fått för svar?"],
    whatHappens: "Copilot kan sammanfatta ett ärende med de viktigaste uppgifterna, som kund, problem och vad som gjorts.",
    humanResponsibility: "Du läser det som är avgörande innan du lovar något till kunden.",
    efficiencyBenefit: "Mindre läsning vid överlämning mellan handläggare.",
    automationLevel: "assistans", relatedExamples: ["service-sammanfatta-konversation", "service-nasta-steg", "service-skapa-svar"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  vx({
    slug: "service-sammanfatta-konversation", title: "Sammanfatta en konversation", application: "service", category: "forsta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot", ...CS_COPILOT,
    summary: "Få en sammanfattning av en chatt eller ett samtal, till exempel när det förs över till dig.",
    userGoal: "En kollega skickar över en pågående chatt och jag vill inte be kunden upprepa sig.",
    traditionalWorkflow: ["Scrolla igenom chatten", "Läs allt", "Anteckna", "Fortsätt dialogen"],
    aiWorkflow: ["Ta emot konversationen", "Läs sammanfattningen", "Fortsätt dialogen"],
    promptExamples: ["Sammanfatta konversationen.", "Vad vill kunden ha hjälp med?"],
    whatHappens: "Copilot kan sammanfatta en konversation med kundens fråga, vad som hänt och vad som återstår.",
    humanResponsibility: "Du stämmer av med kunden om något i sammanfattningen är oklart.",
    efficiencyBenefit: "Kunden slipper upprepa sig och du kommer snabbare in i ärendet.",
    automationLevel: "assistans", relatedExamples: ["service-sammanfatta-arende", "service-hitta-kunskap", "service-skapa-svar"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  vx({
    slug: "service-hitta-kunskap", title: "Hitta relevant kunskap", application: "service", category: "hitta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot-chat", ...CS_COPILOT,
    summary: "Ställ en fråga och få svar baserat på er kunskapsbas, med hänvisning till källan.",
    userGoal: "Jag vill hitta hur ett liknande problem har lösts tidigare.",
    traditionalWorkflow: ["Öppna kunskapsbasen", "Gissa sökord", "Läs artiklar", "Hitta rätt avsnitt"],
    aiWorkflow: ["Ställ frågan", "Copilot svarar med källor", "Kontrollera i artikeln"],
    promptExamples: ["Hur återställer kunden sin router?", "Vad gäller vid retur efter 30 dagar?"],
    whatHappens: "Du kan ställa frågor till Copilot, som svarar utifrån kunskapskällor som organisationen har gett åtkomst till och visar vilka källor svaret bygger på.",
    humanResponsibility: "Du avgör om svaret passar kundens situation och kontrollerar källan vid osäkerhet.",
    efficiencyBenefit: "Mindre sökande med rätt sökord i kunskapsbasen.",
    automationLevel: "fraga", relatedExamples: ["service-skapa-svar", "service-nasta-steg", "service-sammanfatta-konversation"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  vx({
    slug: "service-nasta-steg", title: "Föreslå nästa steg i ett ärende", application: "service", category: "agera",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot", ...CS_COPILOT,
    summary: "Fråga Copilot hur ärendet kan lösas och få förslag utifrån kunskapsbasen.",
    userGoal: "Jag vet inte direkt hur ärendet ska lösas och vill veta vad som brukar fungera.",
    traditionalWorkflow: ["Läs ärendet", "Sök lösning", "Fråga kollega", "Bestäm åtgärd"],
    aiWorkflow: ["Fråga om nästa steg", "Copilot föreslår", "Du väljer åtgärd"],
    promptExamples: ["Hur kan jag lösa det här ärendet?", "Vilka steg ska kunden prova först?"],
    whatHappens: "Copilot kan föreslå lösningssteg utifrån ärendet och tillgängliga kunskapskällor.",
    humanResponsibility: "Du väljer åtgärd och ansvarar för vad som lovas kunden.",
    efficiencyBenefit: "Snabbare väg till en trolig lösning utan att först eskalera.",
    automationLevel: "assistans", relatedExamples: ["service-hitta-kunskap", "service-skapa-svar", "service-sammanfatta-arende"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  vx({
    slug: "service-skapa-svar", title: "Ta fram ett utkast till svar", application: "service", category: "skapa",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot", ...CS_COPILOT,
    summary: "Få ett utkast till e-post eller chattsvar som du redigerar innan det skickas.",
    userGoal: "Jag vill skicka ett tydligt svar med rätt instruktioner.",
    traditionalWorkflow: ["Öppna e-post", "Leta upp instruktioner", "Skriv svar", "Korrläs", "Skicka"],
    aiWorkflow: ["Be om utkast", "Välj ton", "Redigera", "Skicka"],
    promptExamples: ["Skriv ett vänligt svar med instruktionerna från artikeln.", "Gör svaret kortare."],
    whatHappens: "Copilot kan skriva utkast till e-post och svar i konversationer utifrån ärendets sammanhang.",
    humanResponsibility: "Du kontrollerar ton, fakta och vad som utlovas, och det är du som skickar.",
    efficiencyBenefit: "Första versionen behöver inte skrivas från början.",
    automationLevel: "assistans", relatedExamples: ["service-nasta-steg", "service-hitta-kunskap", "bc-skapa-produkttext"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  // ÖVRIGA EXEMPEL (bc/sales/service verifierade i omgång 2)
  vx({
    slug: "bc-hitta-kundinformation", title: "Hitta kundinformation", application: "bc", category: "hitta",
    businessArea: "Försäljning och ekonomi", role: ["ekonom", "saljare"], aiType: "copilot-chat", ...BC_CHAT,
    summary: "Få en samlad bild av en kund utan att öppna flera kort och listor.",
    userGoal: "Jag vill snabbt se hur det står till med en kund: öppna order, obetalda fakturor och senaste kontakt.",
    promptExamples: ["Visa öppna order och förfallna fakturor för kunden Nordbygg.", "När handlade Nordbygg senast?"],
    whatHappens: "Copilot i Business Central besvarar frågor om er företagsdata på naturligt språk och visar relevanta poster som du kan öppna.",
    humanResponsibility: "Du kontrollerar att rätt kund valts och att uppgifterna stämmer innan du agerar mot kunden.",
    efficiencyBenefit: "Färre steg mellan kundkort, orderlista och kundreskontra när du behöver en snabb lägesbild.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-faktura", "bc-hitta-order", "sales-hitta-kundinformation"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-hitta-order", title: "Hitta orderinformation", application: "bc", category: "hitta",
    businessArea: "Order och lager", role: ["saljare", "inkopare"], aiType: "copilot-chat", ...BC_CHAT,
    summary: "Få status på en order när kunden ringer, utan att gå via flera listor.",
    userGoal: "Kunden frågar när deras order levereras. Jag vill svara direkt.",
    promptExamples: ["Vilken status har order 1045?", "Vilka order till Nordbygg är inte levererade än?"],
    whatHappens: "Copilot i Business Central besvarar frågor om er data, till exempel order, och visar träffar som du kan öppna.",
    humanResponsibility: "Du lämnar besked till kunden och kontrollerar leveransdatum vid osäkerhet.",
    efficiencyBenefit: "Kortare väg från fråga till svar i kundsamtalet.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-kundinformation", "fscm-hitta-lager"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  vx({
    slug: "bc-agent-repetitiv", title: "Från repetitiv process till agent", application: "bc", category: "automatisera",
    businessArea: "Order", role: ["saljare", "inkopare"], aiType: "agent", sourceName: "Microsoft Learn: Sales Order Agent", sourceUrl: `${ML}/business-central/sales-order-agent`,
    summary: "Låt en agent ta fram förslag på order från inkommande förfrågningar som du godkänner.",
    userGoal: "Vi får många offertförfrågningar per e-post som manuellt skrivs in i systemet.",
    traditionalWorkflow: ["Läs e-post", "Skapa offert", "Skriv rader", "Kontrollera", "Skicka"],
    aiWorkflow: ["Förfrågan kommer", "Agent skapar utkast", "Du granskar", "Godkänn"],
    promptExamples: ["Skapa ett offertutkast från den här förfrågan."],
    whatHappens: "Sales Order Agent läser inkommande förfrågningar, matchar kund och artiklar och skapar utkast som väntar på granskning.",
    humanResponsibility: "Du godkänner varje utkast, och bestämmer vilka steg agenten får göra.",
    efficiencyBenefit: "Manuell inskrivning av rader minskar; granskning blir huvudmomentet.",
    automationLevel: "automatisering", relatedExamples: ["fscm-automatisera", "bc-skapa-produkttext"],
    ctaType: "partner", ctaUrl: "/agents/",
  }),
  // SALES
  vx({
    slug: "sales-hitta-kundinformation", title: "Hitta kundinformation", application: "sales", category: "hitta",
    businessArea: "Försäljning", role: ["saljare"], aiType: "copilot-chat", ...SALES_INFO,
    summary: "Få senaste aktiviteter, kontakter och affärer för en kund på ett ställe.",
    userGoal: "Jag vill veta vad som hänt med kunden sedan jag senast pratade med dem.",
    promptExamples: ["Vad har hänt med Nordbygg de senaste 30 dagarna?"],
    whatHappens: "Copilot i Sales kan sammanfatta konton, leads och affärsmöjligheter och visa senaste nyheter om kunden.",
    humanResponsibility: "Du bedömer vad som är relevant och kompletterar med det du vet.",
    efficiencyBenefit: "Mindre klickande mellan tidslinje, kontakter och affärer.",
    automationLevel: "fraga", relatedExamples: ["sales-forbered-kundkontakt", "sales-sammanfatta-opportunity"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  vx({
    slug: "sales-analysera-pipeline", title: "Analysera pipeline", application: "sales", category: "analysera",
    businessArea: "Försäljning", role: ["saljchef"], aiType: "copilot-chat", ...SALES_INFO,
    summary: "Ställ frågor om pipelinen i stället för att bygga egna rapporter.",
    userGoal: "Jag vill se vilka affärer som riskerar att glida över till nästa kvartal.",
    traditionalWorkflow: ["Öppna vy", "Filtrera", "Sortera", "Exportera", "Tolka"],
    aiWorkflow: ["Fråga", "Analys", "Du granskar", "Prioritera"],
    promptExamples: ["Vilka affärer med stängning i kvartalet saknar aktivitet senaste 14 dagarna?"],
    whatHappens: "Copilot i Sales kan ge information om din pipeline via färdiga frågor eller naturligt språk. Hur detaljerade urval som stöds beror på data och konfiguration.",
    humanResponsibility: "Prognos och prioritering är fortfarande säljchefens beslut.",
    efficiencyBenefit: "Ad hoc-frågor kräver inte en ny rapport.",
    automationLevel: "assistans", relatedExamples: ["sales-uppgifter-uppmarksamhet", "bc-analysera-lista"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  vx({
    slug: "service-hitta-kundinformation", title: "Hitta relevant kundinformation", application: "service", category: "hitta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot-chat", ...CS_COPILOT,
    summary: "Få kundens avtal, produkter och tidigare ärenden direkt i samtalet.",
    userGoal: "Kunden ringer och jag vill se vad de har och vad som hänt tidigare.",
    promptExamples: ["Vilka tidigare ärenden har kunden haft om samma produkt?"],
    whatHappens: "Copilot i Customer Service kan svara på frågor om ärendets data och visa sammanfattningar av ärendet och tidigare konversationer.",
    humanResponsibility: "Du kontrollerar identitet och behörighet enligt era rutiner.",
    efficiencyBenefit: "Kortare väntetid för kunden medan du letar.",
    automationLevel: "fraga", relatedExamples: ["service-hitta-kunskap", "sales-hitta-kundinformation"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  vx({
    slug: "service-forsta-arende", title: "Förstå vad som hänt i ett ärende", application: "service", category: "forsta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot", ...CS_COPILOT,
    summary: "Få tidslinjen för ett ärende i klartext.",
    userGoal: "Kunden är missnöjd och jag vill förstå vad som gått fel.",
    promptExamples: ["Vad har hänt i ärendet i kronologisk ordning?"],
    whatHappens: "Copilot kan sammanfatta ärendet och tidigare konversationer, och du kan ställa frågor om ärendets data.",
    humanResponsibility: "Du bedömer orsak och lämplig åtgärd.",
    efficiencyBenefit: "Snabbare orientering i eskalerade ärenden.",
    automationLevel: "fraga", relatedExamples: ["service-sammanfatta-arende", "service-nasta-steg"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  // FINANCE / SCM
  ex({
    slug: "finance-hitta-ekonomisk-information", title: "Hitta ekonomisk information", application: "finance", category: "hitta",
    businessArea: "Ekonomi", role: ["cfo", "ekonom"], aiType: "copilot-chat",
    summary: "Få fram saldon och transaktioner genom att fråga.",
    userGoal: "Jag vill se vad som bokats på ett konto under perioden.",
    promptExamples: ["Visa transaktioner på konto 6540 i september."],
    whatHappens: "Exempel på användningsfall: relevanta transaktioner hämtas och presenteras.",
    humanResponsibility: "Du kontrollerar period, bolag och dimensioner.",
    efficiencyBenefit: "Färre steg i förfrågningar som tidigare krävde rätt vy och filter.",
    automationLevel: "fraga", relatedExamples: ["fscm-forsta-affarsdata", "fscm-analysera-data"],
    ctaType: "produkt", ctaUrl: "/finance-supply-chain/",
  }),
  ex({
    slug: "fscm-forsta-affarsdata", title: "Förstå affärsdata", application: "finance", category: "forsta",
    businessArea: "Ekonomi", role: ["cfo", "ekonom"], aiType: "copilot",
    summary: "Få förklarat varför ett utfall avviker från förväntan.",
    userGoal: "Kostnaden för perioden är högre än budget och jag vill förstå varför.",
    promptExamples: ["Vilka poster förklarar avvikelsen mot budget?"],
    whatHappens: "Exempel på användningsfall: de största bidragande posterna lyfts fram.",
    humanResponsibility: "Du tolkar orsaken och beslutar om åtgärd.",
    efficiencyBenefit: "Mindre manuell nedbrytning av avvikelser.",
    automationLevel: "assistans", relatedExamples: ["finance-hitta-ekonomisk-information", "fscm-analysera-data"],
    ctaType: "produkt", ctaUrl: "/finance-supply-chain/",
  }),
  ex({
    slug: "fscm-analysera-data", title: "Analysera data", application: "scm", category: "analysera",
    businessArea: "Supply chain", role: ["inkopare"], aiType: "copilot-chat",
    summary: "Hitta mönster i leveranser och leverantörsprestanda.",
    userGoal: "Jag vill veta vilka leverantörer som ofta levererar sent.",
    traditionalWorkflow: ["Öppna rapport", "Filtrera", "Exportera", "Beräkna", "Tolka"],
    aiWorkflow: ["Fråga", "Analys", "Du granskar", "Åtgärd"],
    promptExamples: ["Vilka leverantörer har flest sena leveranser i år?"],
    whatHappens: "Exempel på användningsfall: en sammanställning tas fram med underlag.",
    humanResponsibility: "Du bedömer orsaker och tar leverantörsdialogen.",
    efficiencyBenefit: "Analysen kräver inte egen rapport eller export.",
    automationLevel: "assistans", relatedExamples: ["fscm-hitta-lager", "bc-analysera-lista"],
    ctaType: "produkt", ctaUrl: "/finance-supply-chain/",
  }),
  vx({
    slug: "fscm-hitta-lager", title: "Hitta order- eller lagerinformation", application: "scm", category: "hitta",
    businessArea: "Lager och logistik", role: ["inkopare"], aiType: "copilot-chat", sourceName: "Microsoft Learn: AI-sammanfattningar med Copilot i Supply Chain Management", sourceUrl: `${ML}/supply-chain/get-started/copilot-summaries-overview`,
    summary: "Få lagersaldo och kommande inleveranser för en artikel.",
    userGoal: "Jag vill veta om vi kan leverera en större order nästa vecka.",
    promptExamples: ["Hur mycket av artikel A-200 finns i lager och vad är på väg in?"],
    whatHappens: "AI-sammanfattningar med Copilot visar en överblick av det viktigaste på sidan, till exempel antal artiklar i ett lager eller rader på en inköpsorder.",
    humanResponsibility: "Du lovar leveransdatum utifrån er planering.",
    efficiencyBenefit: "Färre vyer att gå igenom för en leveransbedömning.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-order", "fscm-analysera-data"],
    ctaType: "produkt", ctaUrl: "/finance-supply-chain/",
  }),
  vx({
    slug: "fscm-automatisera", title: "Identifiera arbetsmoment som kan automatiseras", application: "scm", category: "automatisera",
    businessArea: "Supply chain", role: ["inkopare", "cfo"], aiType: "agent", sourceName: "Microsoft Learn: Agent för leverantörskommunikation", sourceUrl: `${ML}/supply-chain/procurement/supplier-com-agent-setup`,
    summary: "Se vilka återkommande moment som kan bli flöden eller agenter.",
    userGoal: "Vi lägger mycket tid på manuell uppföljning av inköpsorder.",
    traditionalWorkflow: ["Lista order", "Kontrollera", "Mejla leverantör", "Uppdatera", "Följ upp"],
    aiWorkflow: ["Agent bevakar", "Föreslår åtgärd", "Du godkänner", "Uppföljning"],
    promptExamples: ["Vilka inköpsorder saknar bekräftelse från leverantören?"],
    whatHappens: "Agenten för leverantörskommunikation (förhandsversion klar för produktion) följer upp med leverantörer och föreslår uppdateringar av inköpsorder enligt regler som ni själva bestämmer.",
    humanResponsibility: "Du bestämmer vilka steg agenten får ta och följer upp utfallet.",
    efficiencyBenefit: "Bevakning som tidigare var manuell kan ske löpande.",
    automationLevel: "automatisering", relatedExamples: ["bc-agent-repetitiv", "fscm-analysera-data"],
    ctaType: "partner", ctaUrl: "/agents/",
  }),
];

export const getExampleBySlug = (slug: string) => AI_EXAMPLES.find((e) => e.slug === slug);
export const getExamplesForApplication = (app: AiApplication) => AI_EXAMPLES.filter((e) => e.application === app);
export const getApplication = (key: AiApplication) => AI_APPLICATIONS.find((a) => a.key === key)!;
export const getCategory = (key: AiCategory) => AI_CATEGORIES.find((c) => c.key === key)!;

export function filterExamples(opts: { categories?: AiCategory[]; applications?: AiApplication[]; roles?: AiRole[] }) {
  return AI_EXAMPLES.filter(
    (e) =>
      (!opts.categories?.length || opts.categories.includes(e.category)) &&
      (!opts.applications?.length || opts.applications.includes(e.application)) &&
      (!opts.roles?.length || e.role.some((r) => opts.roles!.includes(r))),
  );
}

export function getRelatedExamples(ex: AiExample, max = 4): AiExample[] {
  const explicit = (ex.relatedExamples ?? []).map(getExampleBySlug).filter(Boolean) as AiExample[];
  const fill = AI_EXAMPLES.filter(
    (e) => e.slug !== ex.slug && !explicit.includes(e) && (e.application === ex.application || e.category === ex.category),
  );
  return [...explicit, ...fill].slice(0, max);
}
