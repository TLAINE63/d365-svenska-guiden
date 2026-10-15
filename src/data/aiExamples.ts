// Exempelbibliotek: "Ett nytt sätt att arbeta med Dynamics 365".
// Posterna är exempel på användningsfall för struktur och UX, inte verifierade
// produktpåståenden. verified=false tills källa och datum har granskats.
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

export const AI_EXAMPLES: AiExample[] = [
  // BUSINESS CENTRAL
  ex({
    slug: "bc-hitta-kundinformation", title: "Hitta kundinformation", application: "bc", category: "hitta",
    businessArea: "Försäljning och ekonomi", role: ["ekonom", "saljare"], aiType: "copilot-chat",
    summary: "Få en samlad bild av en kund utan att öppna flera kort och listor.",
    userGoal: "Jag vill snabbt se hur det står till med en kund: öppna order, obetalda fakturor och senaste kontakt.",
    promptExamples: ["Visa öppna order och förfallna fakturor för kunden Nordbygg.", "När handlade Nordbygg senast?"],
    whatHappens: "Ett exempel på användningsfall: assistenten tolkar frågan, hämtar relevanta poster och presenterar dem med länkar till ursprungsposterna.",
    humanResponsibility: "Du kontrollerar att rätt kund valts och att uppgifterna stämmer innan du agerar mot kunden.",
    efficiencyBenefit: "Färre steg mellan kundkort, orderlista och kundreskontra när du behöver en snabb lägesbild.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-faktura", "bc-hitta-order", "sales-hitta-kundinformation"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-hitta-faktura", title: "Hitta en faktura", application: "bc", category: "hitta",
    businessArea: "Ekonomi", role: ["ekonom"], aiType: "copilot-chat",
    summary: "Hitta en specifik faktura genom att beskriva den i stället för att filtrera.",
    userGoal: "Jag behöver hitta fakturan vi skickade till en kund i mars på omkring 40 000 kr.",
    promptExamples: ["Visa de senaste fakturorna.", "Hitta fakturan till Nordbygg i mars på cirka 40 000 kr."],
    whatHappens: "Exempel på användningsfall: frågan översätts till ett urval av bokförda fakturor och träffarna visas som en lista du kan öppna.",
    humanResponsibility: "Du bedömer om träffen är rätt faktura, särskilt när flera liknar varandra.",
    efficiencyBenefit: "Du behöver inte veta vilka fält du ska filtrera på eller i vilken lista fakturan ligger.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-kundinformation", "bc-analysera-lista"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-hitta-order", title: "Hitta orderinformation", application: "bc", category: "hitta",
    businessArea: "Order och lager", role: ["saljare", "inkopare"], aiType: "copilot-chat",
    summary: "Få status på en order när kunden ringer, utan att gå via flera listor.",
    userGoal: "Kunden frågar när deras order levereras. Jag vill svara direkt.",
    promptExamples: ["Vilken status har order 1045?", "Vilka order till Nordbygg är inte levererade än?"],
    whatHappens: "Exempel på användningsfall: assistenten hämtar order, rader och leveransstatus och sammanfattar läget.",
    humanResponsibility: "Du lämnar besked till kunden och kontrollerar leveransdatum vid osäkerhet.",
    efficiencyBenefit: "Kortare väg från fråga till svar i kundsamtalet.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-kundinformation", "fscm-hitta-lager"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-forsta-falt", title: "Förstå ett fält", application: "bc", category: "forsta",
    businessArea: "Allmänt", role: ["ekonom", "inkopare"], aiType: "copilot",
    summary: "Få förklarat vad ett fält betyder och hur det påverkar processen.",
    userGoal: "Jag förstår inte vad fältet på artikelkortet styr och vågar inte ändra det.",
    traditionalWorkflow: ["Hovra", "Sök i hjälpen", "Fråga kollega", "Testa", "Ändra"],
    aiWorkflow: ["Fråga", "Förklaring", "Du bedömer", "Ändra"],
    promptExamples: ["Vad betyder fältet Lagerbokföringsmall?", "Vad händer om jag ändrar det här fältet?"],
    whatHappens: "Exempel på användningsfall: assistenten förklarar fältets syfte i sammanhanget och hänvisar till dokumentation.",
    humanResponsibility: "Ändringar i inställningar beslutar du, gärna tillsammans med den som ansvarar för systemet.",
    efficiencyBenefit: "Mindre tid på att leta i dokumentation och färre frågor till nyckelanvändare.",
    automationLevel: "fraga", relatedExamples: ["bc-forsta-process", "fscm-forsta-affarsdata"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-forsta-process", title: "Få hjälp med en Business Central-process", application: "bc", category: "forsta",
    businessArea: "Allmänt", role: ["ekonom"], aiType: "copilot-chat",
    summary: "Få steg för steg-hjälp med en process du sällan gör, till exempel en kreditnota.",
    userGoal: "Jag ska göra en kreditnota och minns inte hur man gör.",
    traditionalWorkflow: ["Sök manual", "Läs", "Leta sida", "Prova", "Kontrollera"],
    aiWorkflow: ["Fråga", "Steg för steg", "Utför", "Granska"],
    promptExamples: ["Hur skapar jag en kreditnota för en bokförd faktura?"],
    whatHappens: "Exempel på användningsfall: assistenten beskriver stegen och kan länka till rätt sida.",
    humanResponsibility: "Du utför och bokför själv, och följer era interna rutiner.",
    efficiencyBenefit: "Sällan utförda moment går fortare och blir rätt oftare.",
    automationLevel: "assistans", relatedExamples: ["bc-forsta-falt", "bc-hitta-faktura"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-analysera-lista", title: "Analysera en lista med AI", application: "bc", category: "analysera",
    businessArea: "Ekonomi och försäljning", role: ["cfo", "ekonom"], aiType: "copilot",
    summary: "Ställ frågor till en lista i stället för att exportera till Excel.",
    userGoal: "Jag vill se vilka kunder som står för mest försäljning i år och hur det skiljer mot förra året.",
    traditionalWorkflow: ["Öppna lista", "Filtrera", "Exportera", "Pivotera", "Tolka"],
    aiWorkflow: ["Fråga", "Analys", "Du granskar", "Beslut"],
    promptExamples: ["Visa försäljning per kund i år jämfört med förra året.", "Vilka artiklar har minskat mest?"],
    whatHappens: "Exempel på användningsfall: en analysvy byggs utifrån frågan, som du sedan kan justera.",
    humanResponsibility: "Du tolkar resultatet och kontrollerar urval och period innan du drar slutsatser.",
    efficiencyBenefit: "Exportsteget och manuell pivotering kan ofta hoppas över för enklare frågor.",
    automationLevel: "assistans", relatedExamples: ["sales-analysera-pipeline", "fscm-analysera-data"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-skapa-produkttext", title: "Skapa produkt- och marknadstext", application: "bc", category: "skapa",
    businessArea: "Artiklar och e-handel", role: ["saljare"], aiType: "inbyggd",
    summary: "Få ett utkast till produktbeskrivning utifrån artikelns egenskaper.",
    userGoal: "Vi har hundratals artiklar utan säljande beskrivning.",
    traditionalWorkflow: ["Öppna artikel", "Läs egenskaper", "Skriv text", "Korrläs", "Spara"],
    aiWorkflow: ["Välj artikel", "Generera utkast", "Redigera", "Spara"],
    promptExamples: ["Skriv en kort produkttext för artikeln, saklig ton, max 60 ord."],
    whatHappens: "Exempel på användningsfall: ett textförslag skapas från artikelns attribut som du kan ändra.",
    humanResponsibility: "Du ansvarar för att texten är korrekt och inte lovar egenskaper produkten saknar.",
    efficiencyBenefit: "Första utkastet tar sekunder i stället för minuter per artikel.",
    automationLevel: "assistans", relatedExamples: ["service-skapa-svar", "bc-agent-repetitiv"],
    ctaType: "produkt", ctaUrl: "/businesscentral/",
  }),
  ex({
    slug: "bc-agent-repetitiv", title: "Från repetitiv process till agent", application: "bc", category: "automatisera",
    businessArea: "Order", role: ["saljare", "inkopare"], aiType: "agent",
    summary: "Låt en agent ta fram förslag på order från inkommande förfrågningar som du godkänner.",
    userGoal: "Vi får många offertförfrågningar per e-post som manuellt skrivs in i systemet.",
    traditionalWorkflow: ["Läs e-post", "Skapa offert", "Skriv rader", "Kontrollera", "Skicka"],
    aiWorkflow: ["Förfrågan kommer", "Agent skapar utkast", "Du granskar", "Godkänn"],
    promptExamples: ["Skapa ett offertutkast från den här förfrågan."],
    whatHappens: "Exempel på användningsfall: agenten läser förfrågan, matchar kund och artiklar och lägger ett utkast för granskning.",
    humanResponsibility: "Du godkänner varje utkast, och bestämmer vilka steg agenten får göra.",
    efficiencyBenefit: "Manuell inskrivning av rader minskar; granskning blir huvudmomentet.",
    automationLevel: "automatisering", relatedExamples: ["fscm-automatisera", "bc-skapa-produkttext"],
    ctaType: "partner", ctaUrl: "/agents/",
  }),
  // SALES
  ex({
    slug: "sales-hitta-kundinformation", title: "Hitta kundinformation", application: "sales", category: "hitta",
    businessArea: "Försäljning", role: ["saljare"], aiType: "copilot-chat",
    summary: "Få senaste aktiviteter, kontakter och affärer för en kund på ett ställe.",
    userGoal: "Jag vill veta vad som hänt med kunden sedan jag senast pratade med dem.",
    promptExamples: ["Vad har hänt med Nordbygg de senaste 30 dagarna?"],
    whatHappens: "Exempel på användningsfall: assistenten sammanställer aktiviteter, e-post och affärsmöjligheter.",
    humanResponsibility: "Du bedömer vad som är relevant och kompletterar med det du vet.",
    efficiencyBenefit: "Mindre klickande mellan tidslinje, kontakter och affärer.",
    automationLevel: "fraga", relatedExamples: ["sales-forbered-kundkontakt", "sales-sammanfatta-opportunity"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  ex({
    slug: "sales-sammanfatta-opportunity", title: "Sammanfatta en affärsmöjlighet", application: "sales", category: "skapa",
    businessArea: "Försäljning", role: ["saljare", "saljchef"], aiType: "copilot",
    summary: "Få en kort sammanfattning av status, intressenter och risker.",
    userGoal: "Jag tar över en affär från en kollega och vill förstå läget snabbt.",
    traditionalWorkflow: ["Öppna affär", "Läs anteckningar", "Läs e-post", "Kolla kontakter", "Sammanfatta"],
    aiWorkflow: ["Öppna affär", "Sammanfattning", "Du granskar", "Nästa steg"],
    promptExamples: ["Sammanfatta den här affären.", "Vilka risker finns?"],
    whatHappens: "Exempel på användningsfall: en sammanfattning tas fram utifrån posten och dess aktiviteter.",
    humanResponsibility: "Sammanfattningen är ett stöd. Du verifierar viktiga detaljer med kollega eller kund.",
    efficiencyBenefit: "Överlämningar och förberedelser kräver mindre läsning av historik.",
    automationLevel: "assistans", relatedExamples: ["sales-forandring-affar", "sales-forbered-kundkontakt"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  ex({
    slug: "sales-forbered-kundkontakt", title: "Förbered dig inför kundkontakt", application: "sales", category: "agera",
    businessArea: "Försäljning", role: ["saljare"], aiType: "copilot",
    summary: "Få en mötesbrief med senaste händelser och öppna frågor.",
    userGoal: "Jag har ett kundmöte om en timme och vill vara påläst.",
    promptExamples: ["Förbered mig inför mötet med Nordbygg i morgon."],
    whatHappens: "Exempel på användningsfall: en brief med senaste kontakter, öppna affärer och ärenden tas fram.",
    humanResponsibility: "Du väljer vad som tas upp och hur.",
    efficiencyBenefit: "Mötesförberedelse som tidigare krävde flera vyer samlas på ett ställe.",
    automationLevel: "assistans", relatedExamples: ["sales-hitta-kundinformation", "sales-uppgifter-uppmarksamhet"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  ex({
    slug: "sales-forandring-affar", title: "Förstå vad som förändrats på en affär", application: "sales", category: "forsta",
    businessArea: "Försäljning", role: ["saljchef"], aiType: "copilot",
    summary: "Se vad som ändrats sedan förra genomgången, utan att läsa hela historiken.",
    userGoal: "Inför pipelinemötet vill jag veta vad som hänt på de största affärerna.",
    promptExamples: ["Vad har ändrats på affären sedan förra veckan?"],
    whatHappens: "Exempel på användningsfall: ändringar i belopp, datum, steg och aktiviteter sammanfattas.",
    humanResponsibility: "Du bedömer om förändringarna påverkar prognosen.",
    efficiencyBenefit: "Snabbare pipelinegenomgångar med fokus på förändring.",
    automationLevel: "fraga", relatedExamples: ["sales-analysera-pipeline", "sales-sammanfatta-opportunity"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  ex({
    slug: "sales-analysera-pipeline", title: "Analysera pipeline", application: "sales", category: "analysera",
    businessArea: "Försäljning", role: ["saljchef"], aiType: "copilot-chat",
    summary: "Ställ frågor om pipelinen i stället för att bygga egna rapporter.",
    userGoal: "Jag vill se vilka affärer som riskerar att glida över till nästa kvartal.",
    traditionalWorkflow: ["Öppna vy", "Filtrera", "Sortera", "Exportera", "Tolka"],
    aiWorkflow: ["Fråga", "Analys", "Du granskar", "Prioritera"],
    promptExamples: ["Vilka affärer med stängning i kvartalet saknar aktivitet senaste 14 dagarna?"],
    whatHappens: "Exempel på användningsfall: affärer som matchar frågan listas med förklaring.",
    humanResponsibility: "Prognos och prioritering är fortfarande säljchefens beslut.",
    efficiencyBenefit: "Ad hoc-frågor kräver inte en ny rapport.",
    automationLevel: "assistans", relatedExamples: ["sales-uppgifter-uppmarksamhet", "bc-analysera-lista"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  ex({
    slug: "sales-uppgifter-uppmarksamhet", title: "Identifiera uppgifter som kräver uppmärksamhet", application: "sales", category: "agera",
    businessArea: "Försäljning", role: ["saljare"], aiType: "inbyggd",
    summary: "Få förslag på vilka kunder och affärer du bör följa upp i dag.",
    userGoal: "Jag vill börja dagen med det som är viktigast.",
    promptExamples: ["Vilka kunder bör jag följa upp i dag?"],
    whatHappens: "Exempel på användningsfall: en prioriterad lista med förslag och motivering visas.",
    humanResponsibility: "Du väljer vilka förslag du följer.",
    efficiencyBenefit: "Mindre tid på att själv gå igenom listor för att hitta nästa steg.",
    automationLevel: "handling", relatedExamples: ["sales-analysera-pipeline", "sales-forbered-kundkontakt"],
    ctaType: "produkt", ctaUrl: "/d365sales/",
  }),
  // CUSTOMER SERVICE
  ex({
    slug: "service-sammanfatta-arende", title: "Sammanfatta ett kundärende", application: "service", category: "skapa",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot",
    summary: "Få en kort sammanfattning av ett långt ärende innan du svarar.",
    userGoal: "Jag tar över ett ärende med lång historik.",
    promptExamples: ["Sammanfatta ärendet.", "Vad har kunden redan fått för svar?"],
    whatHappens: "Exempel på användningsfall: konversationer och anteckningar sammanfattas.",
    humanResponsibility: "Du läser det som är avgörande innan du lovar något till kunden.",
    efficiencyBenefit: "Mindre läsning vid överlämning mellan handläggare.",
    automationLevel: "assistans", relatedExamples: ["service-forsta-arende", "service-nasta-steg"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  ex({
    slug: "service-hitta-kundinformation", title: "Hitta relevant kundinformation", application: "service", category: "hitta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot-chat",
    summary: "Få kundens avtal, produkter och tidigare ärenden direkt i samtalet.",
    userGoal: "Kunden ringer och jag vill se vad de har och vad som hänt tidigare.",
    promptExamples: ["Vilka tidigare ärenden har kunden haft om samma produkt?"],
    whatHappens: "Exempel på användningsfall: relevanta poster hämtas och visas i sammanhanget.",
    humanResponsibility: "Du kontrollerar identitet och behörighet enligt era rutiner.",
    efficiencyBenefit: "Kortare väntetid för kunden medan du letar.",
    automationLevel: "fraga", relatedExamples: ["service-hitta-kunskap", "sales-hitta-kundinformation"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  ex({
    slug: "service-hitta-kunskap", title: "Hitta relevant kunskap", application: "service", category: "hitta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "inbyggd",
    summary: "Få förslag på kunskapsartiklar utifrån ärendets innehåll.",
    userGoal: "Jag vill hitta hur liknande problem har lösts tidigare.",
    promptExamples: ["Hur löser vi felkod E42 på modell X?"],
    whatHappens: "Exempel på användningsfall: kunskapsbasen genomsöks och relevanta artiklar föreslås.",
    humanResponsibility: "Du avgör om lösningen passar kundens situation.",
    efficiencyBenefit: "Mindre sökande med rätt sökord i kunskapsbasen.",
    automationLevel: "assistans", relatedExamples: ["service-skapa-svar", "service-hitta-kundinformation"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  ex({
    slug: "service-forsta-arende", title: "Förstå vad som hänt i ett ärende", application: "service", category: "forsta",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot",
    summary: "Få tidslinjen för ett ärende i klartext.",
    userGoal: "Kunden är missnöjd och jag vill förstå vad som gått fel.",
    promptExamples: ["Vad har hänt i ärendet i kronologisk ordning?"],
    whatHappens: "Exempel på användningsfall: händelser och kontakter sammanställs i ordning.",
    humanResponsibility: "Du bedömer orsak och lämplig åtgärd.",
    efficiencyBenefit: "Snabbare orientering i eskalerade ärenden.",
    automationLevel: "fraga", relatedExamples: ["service-sammanfatta-arende", "service-nasta-steg"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  ex({
    slug: "service-nasta-steg", title: "Ta fram förslag på nästa steg", application: "service", category: "agera",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot",
    summary: "Få förslag på svar eller åtgärd som du kan justera.",
    userGoal: "Jag vill svara kunden snabbt men korrekt.",
    promptExamples: ["Föreslå ett svar till kunden.", "Vilket är nästa steg?"],
    whatHappens: "Exempel på användningsfall: ett svarsutkast och förslag på åtgärd tas fram.",
    humanResponsibility: "Du skickar svaret och står för innehållet.",
    efficiencyBenefit: "Första utkastet behöver inte skrivas från början.",
    automationLevel: "handling", relatedExamples: ["service-skapa-svar", "service-sammanfatta-arende"],
    ctaType: "produkt", ctaUrl: "/d365customerservice/",
  }),
  ex({
    slug: "service-skapa-svar", title: "Skapa ett svarsutkast", application: "service", category: "skapa",
    businessArea: "Kundservice", role: ["kundservice"], aiType: "copilot",
    summary: "Formulera ett e-postsvar utifrån ärende och kunskapsartikel.",
    userGoal: "Jag vill skicka ett tydligt svar med rätt instruktioner.",
    promptExamples: ["Skriv ett vänligt svar med instruktionerna från artikeln."],
    whatHappens: "Exempel på användningsfall: ett utkast skapas som du redigerar innan det skickas.",
    humanResponsibility: "Du kontrollerar ton, fakta och vad som utlovas.",
    efficiencyBenefit: "Mindre skrivtid per ärende.",
    automationLevel: "assistans", relatedExamples: ["service-nasta-steg", "service-hitta-kunskap"],
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
  ex({
    slug: "fscm-hitta-lager", title: "Hitta order- eller lagerinformation", application: "scm", category: "hitta",
    businessArea: "Lager och logistik", role: ["inkopare"], aiType: "copilot-chat",
    summary: "Få lagersaldo och kommande inleveranser för en artikel.",
    userGoal: "Jag vill veta om vi kan leverera en större order nästa vecka.",
    promptExamples: ["Hur mycket av artikel A-200 finns i lager och vad är på väg in?"],
    whatHappens: "Exempel på användningsfall: saldo, reservationer och inköpsorder sammanställs.",
    humanResponsibility: "Du lovar leveransdatum utifrån er planering.",
    efficiencyBenefit: "Färre vyer att gå igenom för en leveransbedömning.",
    automationLevel: "fraga", relatedExamples: ["bc-hitta-order", "fscm-analysera-data"],
    ctaType: "produkt", ctaUrl: "/finance-supply-chain/",
  }),
  ex({
    slug: "fscm-automatisera", title: "Identifiera arbetsmoment som kan automatiseras", application: "scm", category: "automatisera",
    businessArea: "Supply chain", role: ["inkopare", "cfo"], aiType: "agent",
    summary: "Se vilka återkommande moment som kan bli flöden eller agenter.",
    userGoal: "Vi lägger mycket tid på manuell uppföljning av inköpsorder.",
    traditionalWorkflow: ["Lista order", "Kontrollera", "Mejla leverantör", "Uppdatera", "Följ upp"],
    aiWorkflow: ["Agent bevakar", "Föreslår åtgärd", "Du godkänner", "Uppföljning"],
    promptExamples: ["Vilka inköpsorder saknar bekräftelse från leverantören?"],
    whatHappens: "Exempel på användningsfall: en agent bevakar order och föreslår påminnelser.",
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
