// Beslutsmognadsindex v2: all questions, texts and scoring rules in one place.
// Read by the bmi-score edge function (scoring) and the frontend (rendering only).
// Pure TypeScript, no imports, so it runs in both Deno and Vite.

export type BmiArea = "erp" | "crm" | "marketing" | "service" | "platform";
export type BmiPhase = "tidig" | "analys" | "utvardering" | "beslut";
export type BmiSectionId = "S1" | "S2" | "S3" | "S4" | "S5";
export type BmiQuestionId =
  | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "F13" | "F14" | "F15";

export const BMI_INTRO = {
  title: "Beslutsmognadsindex",
  text: "Hur väl förberedda är ni inför valet av system och partner? 21 frågor, ungefär 5 minuter. Du får resultatet direkt och kan ladda ner det som PDF.",
  button: "Starta",
};

export const BMI_STEP3_INTRO = {
  title: "För att kunna jämföra er med liknande verksamheter",
  text: "Fyra korta frågor till, sedan visas resultatet.",
};

export const BMI_AREA_VARS: Record<BmiArea, { nytt_system: string; systemet: string }> = {
  erp: { nytt_system: "ett nytt affärssystem", systemet: "affärssystemet" },
  crm: { nytt_system: "ett nytt CRM-system", systemet: "CRM-systemet" },
  marketing: { nytt_system: "ett nytt system för marknadsautomation", systemet: "systemet" },
  service: { nytt_system: "ett nytt system för kundservice och fältservice", systemet: "systemet" },
  platform: { nytt_system: "en ny plattform", systemet: "plattformen" },
};

export const BMI_B0 = {
  question: "Vilket område gäller utvärderingen?",
  options: [
    { value: "erp", label: "Affärssystem (ERP)" },
    { value: "crm", label: "Försäljning (CRM)" },
    { value: "marketing", label: "Marknadsautomation" },
    { value: "service", label: "Kundservice och fältservice" },
    { value: "platform", label: "Flera områden / hela plattformen" },
  ] as { value: BmiArea; label: string }[],
};

export const BMI_B5 = {
  question: "Var befinner ni er i processen?",
  options: [
    { value: 1, label: "Frågan finns, men vi har inte börjat" },
    { value: 2, label: "Vi har börjat diskutera internt" },
    { value: 3, label: "Vi har gjort en första analys av behoven" },
    { value: 4, label: "Vi tittar på partners och leverantörer" },
    { value: 5, label: "Vi har en pågående upphandling (RFP)" },
    { value: 6, label: "Vi har valt partner men inte skrivit avtal" },
  ],
};

export const BMI_B3 = {
  question: "Vilken roll har du?",
  options: [
    "VD / affärsledning",
    "CFO / ekonomichef",
    "CIO / IT-chef",
    "COO / operations / produktion",
    "Försäljnings-, marknads- eller kundservicechef",
    "Affärsutveckling / digitalisering",
    "Projektledare / projektägare",
    "Annan roll",
  ],
};

export const BMI_B1 = { question: "Vilken bransch är ni verksamma i?", other: "Annan" };

export const BMI_B2 = {
  question: "Ungefär hur stor är er årsomsättning?",
  options: ["Under 50 MSEK", "50–100 MSEK", "100–500 MSEK", "500 MSEK – 1 miljard", "1–5 miljarder", "Över 5 miljarder"],
};

const B4_ERP = ["Dynamics 365 Business Central", "Dynamics 365 Finance & Supply Chain Management", "Dynamics AX", "Dynamics NAV (Navision)", "SAP", "Infor (M3 m.fl.)", "IFS", "Oracle / NetSuite", "Unit4", "Visma, Fortnox eller liknande", "Monitor, Pyramid eller liknande", "Egenutvecklat", "Annat", "Vet inte"];
const B4_CRM = ["Dynamics 365 Sales / Dynamics CRM", "Salesforce", "HubSpot", "Lime", "SuperOffice", "Upsales", "Excel eller inget CRM", "Annat", "Vet inte"];

export const BMI_B4: Record<BmiArea, { question: string; groups: { title?: string; options: string[] }[] }> = {
  erp: { question: "Vilket eller vilka affärssystem använder ni idag?", groups: [{ options: B4_ERP }] },
  crm: { question: "Vilket CRM-system använder ni idag?", groups: [{ options: B4_CRM }] },
  marketing: {
    question: "Vilket system använder ni idag för marknadsautomation?",
    groups: [{ options: ["Dynamics 365 Customer Insights", "HubSpot", "Salesforce Marketing Cloud", "Adobe Marketo", "Apsis", "Ungapped", "Mailchimp eller liknande", "Inget", "Annat", "Vet inte"] }],
  },
  service: {
    question: "Vilket system använder ni idag för kundservice och fältservice?",
    groups: [{ options: ["Dynamics 365 Customer Service / Field Service", "Salesforce Service Cloud", "ServiceNow", "Zendesk", "Freshdesk", "Inget särskilt system", "Annat", "Vet inte"] }],
  },
  platform: {
    question: "Vilka system använder ni idag?",
    groups: [{ title: "Affärssystem", options: B4_ERP }, { title: "CRM", options: B4_CRM }],
  },
};

export const BMI_HINT = "Välj det som stämmer bäst idag.";

export interface BmiQuestion {
  id: BmiQuestionId;
  section: BmiSectionId;
  text: string;
  options: [string, string, string, string];
  title: string;
  next: string;
}

export const BMI_SECTIONS: { id: BmiSectionId; name: string; questions: BmiQuestionId[] }[] = [
  { id: "S1", name: "Behovsbild", questions: ["F1", "F2", "F3"] },
  { id: "S2", name: "Intern samsyn", questions: ["F4", "F5", "F6"] },
  { id: "S3", name: "Risk och resurser", questions: ["F7", "F8", "F9"] },
  { id: "S4", name: "Partnermarknad", questions: ["F10", "F11", "F12"] },
  { id: "S5", name: "Beslutsstruktur", questions: ["F13", "F14", "F15"] },
];

export const BMI_QUESTIONS: BmiQuestion[] = [
  { id: "F1", section: "S1", text: "Hur väl har ni formulerat vad {nytt_system} ska lösa?",
    options: ["Vi vet att dagens lösning inte räcker, men har inte formulerat varför", "Vi har en lista över brister och önskemål", "Vi har beskrivit de viktigaste affärsproblemen och prioriterat dem", "Problemen är prioriterade, kvantifierade och förankrade i ledningen"],
    title: "Formulera affärsproblemen",
    next: "Samla beslutsgruppen och skriv ner de tre till fem viktigaste problemen som det nya systemet ska lösa. Ange för vart och ett vad det kostar idag, i tid eller pengar, och vilket som är viktigast." },
  { id: "F2", section: "S1", text: "Vad utgår kraven främst från?",
    options: ["Det vi saknar i dagens system", "En blandning, men mest dagens brister", "Främst hur verksamheten ska utvecklas", "En uttalad plan för var verksamheten ska vara om 3–5 år"],
    title: "Låt kraven utgå från verksamhetens riktning",
    next: "Gå igenom kravlistan och markera vilka krav som bara beskriver dagens system. Komplettera med var verksamheten ska vara om tre till fem år: nya marknader, förvärv, nya affärsmodeller." },
  { id: "F3", section: "S1", text: "Hur kommer ni att avgöra om investeringen blev lyckad?",
    options: ["Det har vi inte pratat om", "Vi har en allmän bild, till exempel effektivare processer", "Vi har några konkreta mål, men de är inte mätbara", "Vi har mätbara mål och vet var vi står idag"],
    title: "Bestäm hur ni mäter framgång",
    next: "Välj två eller tre mått som ska bli bättre, till exempel tid för månadsbokslut, leveransprecision eller tid per ärende, och mät dem nu. Utan nuläge går det inte att visa effekt i efterhand." },
  { id: "F4", section: "S2", text: "Vem äger frågan?",
    options: ["Det är inte bestämt", "En person eller funktion driver den, men utan formellt mandat", "Det finns en utsedd sponsor i ledningen", "Sponsorn har tydligt mandat, en budgetram och en beslutsgrupp"],
    title: "Utse en ägare med mandat",
    next: "Utse en sponsor i ledningen med mandat att prioritera och fatta beslut, och bestäm vilka som ingår i beslutsgruppen. Utan det stannar processen ofta när de första svåra avvägningarna kommer." },
  { id: "F5", section: "S2", text: "Hur lika är bilden av varför ni gör detta, mellan ledning, berörda verksamheter och IT?",
    options: ["Bilderna skiljer sig tydligt åt", "Vi tror att vi är överens, men har inte stämt av", "Vi har diskuterat det och är i stort sett överens", "Syftet är nedskrivet och förankrat hos alla nyckelfunktioner"],
    title: "Stäm av syftet",
    next: "Låt ledning, berörda funktioner och IT var för sig beskriva syftet med projektet i två meningar. Skillnaderna visar vad som behöver redas ut innan ni träffar partners." },
  { id: "F6", section: "S2", text: "Hur tydligt har ni beskrivit vad som händer om ni inte gör något de närmaste två åren?",
    options: ["Det har vi inte diskuterat", "Vi har en känsla av att det blir sämre", "Vi har beskrivit konsekvenserna översiktligt", "Konsekvenser och kostnader är beskrivna och styr tidsplanen"],
    title: "Beskriv vad det kostar att vänta",
    next: "Beskriv vad det innebär att vänta två år: kostnader, risker, support som upphör och vad ni inte kan göra. Det blir ofta det tydligaste underlaget när projektet ska prioriteras mot annat." },
  { id: "F7", section: "S3", text: "Hur har ni hanterat riskerna med projektet?",
    options: ["Vi har inte gått igenom dem", "Vi har pratat om dem, men inget är nedskrivet", "De största riskerna är nedskrivna, främst de tekniska", "Både tekniska och organisatoriska risker, som kompetens och förändringsvilja, är nedskrivna och har ägare"],
    title: "Skriv ner riskerna och ge dem ägare",
    next: "Skriv ner de fem största riskerna och se till att minst hälften är organisatoriska: kompetens, tid, förändringsvilja. Ge varje risk en ägare som ansvarar för åtgärden." },
  { id: "F8", section: "S3", text: "Hur mycket tid kan era nyckelpersoner lägga på projektet?",
    options: ["Det har vi inte tagit ställning till", "De får göra det vid sidan av ordinarie arbete", "Vi räknar med att avlasta dem delvis", "Vi vet vilka som ska delta och har planerat avlastningen"],
    title: "Planera tid för nyckelpersonerna",
    next: "Identifiera nyckelpersonerna och uppskatta hur mycket tid de behöver lägga i varje fas. Planera avlastningen innan projektet startar. Det är svårare att lösa när projektet redan pågår." },
  { id: "F9", section: "S3", text: "Hur förbereder ni er på att projektet blir större eller dyrare än planerat?",
    options: ["Vi utgår från att budgeten håller", "Vi räknar med viss marginal, men har inte bestämt hur stor", "Vi har en budgetbuffert", "Vi har en buffert, tydliga gränser och vet vem som beslutar när de passeras"],
    title: "Sätt en buffert och en gräns",
    next: "Bestäm en buffert och en gräns för när avvikelser i scope eller budget ska upp till sponsorn. Det gör det lättare att hålla emot tillägg som inte är nödvändiga." },
  { id: "F10", section: "S4", text: "Hur god bild har ni av partnermarknaden för Dynamics 365 i Sverige?",
    options: ["Vi känner till någon enstaka partner", "Vi känner till flera, men ser inte tydligt hur de skiljer sig åt", "Vi vet vilka typer av partners som passar oss, till exempel storlek, bransch och leveransmodell", "Vi har en kortlista som bygger på tydliga kriterier"],
    title: "Bestäm vilken typ av partner ni söker",
    next: "Bestäm vilken typ av partner som passar er innan ni bokar möten: storlek i förhållande till ert projekt, branscherfarenhet och hur de levererar. Det gör kortlistan mer träffsäker." },
  { id: "F11", section: "S4", text: "Vad har er bedömning av partners hittills byggt på?",
    options: ["Vi har inte börjat utvärdera ännu", "Webbplatser, säljmaterial och presentationer", "Möten och demonstrationer", "Referenssamtal, genomgång av metodik och möten med teamet som ska leverera"],
    title: "Gå djupare i utvärderingen",
    next: "Be om referenser från verksamheter som liknar er och träffa de personer som faktiskt ska arbeta i projektet. Presentationer visar hur partnern säljer, inte hur de levererar." },
  { id: "F12", section: "S4", text: "Hur väl känner ni till vad som brukar gå fel i partnerleveranser?",
    options: ["Inte särskilt väl", "Vi har hört om andras problem", "Vi känner till de vanligaste och har diskuterat dem", "Vi har konkreta frågor och krav till partners utifrån dem"],
    title: "Lär er de vanligaste fallgroparna",
    next: "Gör en lista över vanliga problem, till exempel att teamet byts ut efter avtal, att scope glider och att förvaltningen blir svagare än utlovat. Formulera frågor till partners utifrån listan." },
  { id: "F13", section: "S5", text: "Hur kommer ni att jämföra och välja partner?",
    options: ["Utifrån möten och magkänsla", "Vi har några kriterier, men de är inte nedskrivna", "Nedskrivna kriterier som alla i beslutsgruppen använder", "Viktade kriterier och ett underlag som håller om styrelse eller ägare granskar det"],
    title: "Skriv ner och vikta kriterierna",
    next: "Skriv ner jämförelsekriterierna och vikta dem innan ni träffar partners. Då jämför ni mot era behov och inte mot den senaste presentationen, och valet går att förklara i efterhand." },
  { id: "F14", section: "S5", text: "Hur mycket väger tiden efter avtalet in i ert val?",
    options: ["Vi fokuserar på valet och priset", "Vi har frågat om implementationen", "Vi bedömer både implementation och förvaltning", "Vi jämför totalkostnad och samarbetsform över flera år"],
    title: "Väg in tiden efter avtalet",
    next: "Jämför förvaltningsmodell och kostnad över tre till fem år, inte bara implementationen. Samarbetet med partnern pågår oftast betydligt längre än själva projektet." },
  { id: "F15", section: "S5", text: "Hur är själva beslutet planerat?",
    options: ["Det är inte bestämt", "Vi vet ungefär när, men inte hur", "Vi vet vem som beslutar och när", "Datum, beslutsfattare och vilket underlag som krävs finns i planen"],
    title: "Planera beslutspunkten",
    next: "Bestäm vem som fattar beslutet, när och vilket underlag som krävs, och lägg in det som en milstolpe i planen." },
];

export const BMI_COUNTED: Record<BmiPhase, BmiSectionId[]> = {
  tidig: ["S1", "S2", "S3"],
  analys: ["S1", "S2", "S3", "S4"],
  utvardering: ["S1", "S2", "S3", "S4", "S5"],
  beslut: ["S1", "S2", "S3", "S4", "S5"],
};

export const BMI_UNCOUNTED_NOTES: Partial<Record<BmiSectionId, string>> = {
  S4: "Blir aktuellt när ni har gjort en första analys av behoven.",
  S5: "Blir aktuellt när ni börjar utvärdera partners.",
};

export const BMI_LEVELS = [
  { min: 80, name: "Beslutsredo", summary: "Ni har ett genomarbetat underlag och en tydlig process. Fokus framåt är att hålla i strukturen när förhandling och projektstart börjar." },
  { min: 60, name: "Strukturerad", summary: "Ni har en strukturerad process och de flesta delar på plats. Det som återstår är att stärka de områden som ligger lägst, så att underlaget håller hela vägen till beslut." },
  { min: 40, name: "Under uppbyggnad", summary: "Grunden finns, men flera viktiga delar saknas fortfarande. Ta tag i punkterna nedan innan beslutet närmar sig, så blir både partnerval och projekt lättare att styra." },
  { min: 0, name: "Tidigt skede", summary: "Ni är tidigt i arbetet. Det viktigaste nu är att formulera behoven och bestämma vem som äger frågan, innan ni börjar träffa partners." },
];

export const BMI_ACTION_PRIORITY: BmiQuestionId[] = ["F4", "F1", "F8", "F6", "F5", "F3", "F7", "F9", "F13", "F15", "F2", "F10", "F11", "F12", "F14"];
export const BMI_NO_ACTIONS_TEXT = "Ni har inga uppenbara luckor i de delar som är aktuella i ert skede. Gå igenom underlaget med beslutsgruppen och se om ni gör samma bedömning.";

export const BMI_STRENGTH_TEXTS: Record<BmiSectionId, string> = {
  S1: "Ni vet vad ni vill uppnå. Det gör alla senare steg enklare.",
  S2: "Det finns ägarskap och samsyn, och det är ofta det som avgör om processen håller tempot.",
  S3: "Ni har tänkt igenom risker och resurser, vilket många skjuter upp för länge.",
  S4: "Ni har en god bild av partnermarknaden och vet vad ni letar efter.",
  S5: "Ni har en tydlig beslutsprocess, och valet kommer att gå att förklara i efterhand.",
};

type A = Record<BmiQuestionId, number>;
const late = (p: BmiPhase) => p === "utvardering" || p === "beslut";
export const BMI_WARNINGS: { id: string; test: (a: A, p: BmiPhase) => boolean; text: string }[] = [
  { id: "W1", test: (a, p) => late(p) && a.F1 <= 1, text: "Ni tittar på partners innan behoven är prioriterade. Risken är att partnernas presentationer börjar forma kraven i stället för tvärtom." },
  { id: "W2", test: (a, p) => late(p) && a.F4 === 0, text: "Ingen äger beslutet formellt. Det brukar märkas först när två partners står mot varandra och ingen kan avgöra." },
  { id: "W3", test: (a) => a.F8 <= 1, text: "Nyckelpersonerna ska klara projektet vid sidan av ordinarie arbete. Det är en av de vanligaste orsakerna till förseningar och svagare krav." },
  { id: "W4", test: (a, p) => p === "beslut" && a.F13 <= 1, text: "Beslutet är nära, men jämförelsekriterierna är inte nedskrivna. Det blir svårt att förklara valet för styrelse eller ägare i efterhand." },
  { id: "W5", test: (a, p) => p !== "tidig" && a.F6 === 0, text: "Utan en bild av vad det kostar att vänta är det svårt att prioritera projektet, och tidsplanen glider lätt." },
  { id: "W6", test: (a, p) => late(p) && a.F3 === 0, text: "Det finns inga framgångsmått. Efter avtal saknas då något att styra projektet och partnern mot." },
  { id: "W7", test: (a) => a.F9 === 0 && a.F14 === 0, text: "Budgeten förutsätts hålla och valet fokuserar på pris vid avtal. Den kombinationen gör ofta förvaltningskostnaden till en överraskning." },
];

export const BMI_PARTNER_QUESTIONS: Partial<Record<BmiQuestionId, string>> = {
  F7: "Vilka risker ser ni i vårt projekt, och vilka brukar kunder underskatta?",
  F8: "Hur mycket tid behöver våra nyckelpersoner lägga, per fas och roll?",
  F9: "Hur hanterar ni ändringar i scope, och hur har utfallet mot budget sett ut i era senaste projekt?",
  F10: "Hur många projekt av vår storlek och i vår bransch har ni levererat de senaste tre åren?",
  F11: "Kan vi prata med två referenskunder i liknande storlek och bransch, varav en där projektet inte gick som planerat?",
  F12: "Vilka personer i ert team kommer att arbeta i vårt projekt, och kan vi träffa dem före avtal?",
  F13: "Hur ser er metodik ut, och vilka beslut förväntar ni er att vi fattar i varje fas?",
  F14: "Hur ser förvaltningen ut efter driftsättning, och vad kostar den normalt per år för en kund av vår storlek?",
};

/** Läs vidare: sektion -> artikel i kunskapscentret. Tom post = ingen länk. */
export const BMI_READ_MORE: Partial<Record<BmiSectionId, { title: string; url: string }>> = {
  S1: { title: "Upphandlingsguiden: från behovsanalys till beslut", url: "/upphandlingsguiden/" },
  S2: { title: "AI-skiftet i Dynamics\u00A0365: vad ledningsgruppen behöver förstå", url: "/artiklar/ai-skiftet-dynamics-365-build-2026/" },
  S3: { title: "Den största risken sitter sällan i systemet. Den sitter i partnern.", url: "/artiklar/partnervalet-avgor-erp-crm-projekt/" },
  S4: { title: "När flera ERP- och CRM-system klarar kraven avgör partnern resultatet", url: "/artiklar/partnervalet-avgor-resultatet/" },
  S5: { title: "Support och förvaltning av Dynamics\u00A0365", url: "/guider/dynamics-365-support-forvaltning/" },
};

export const BMI_RESULT_FOOTER = "Resultatet bygger på era egna svar och är en självskattning, inte en granskning.";

// ---------- Scoring ----------

export interface BmiInput {
  version: 2;
  b0: BmiArea;
  b5: number;
  answers: A;
  b1?: string; b2?: string; b3?: string; b4?: string[];
}

export interface BmiResult {
  phase: BmiPhase;
  total: number;
  level: string;
  summary: string;
  sections: { id: BmiSectionId; name: string; score: number; counted: boolean; note: string | null }[];
  strength: { id: BmiSectionId; text: string } | null;
  actions: { question: BmiQuestionId; title: string; text: string }[];
  warnings: { id: string; text: string }[];
  partner_questions: { question: BmiQuestionId; text: string }[];
  read_more: { section: BmiSectionId; title: string; url: string }[];
}

export function bmiPhase(b5: number): BmiPhase {
  if (b5 <= 2) return "tidig";
  if (b5 === 3) return "analys";
  if (b5 <= 5) return "utvardering";
  return "beslut";
}

const AREAS = BMI_B0.options.map((o) => o.value as string);
const QIDS = BMI_QUESTIONS.map((q) => q.id);

/** Returns an error message, or null when the payload is valid. */
export function bmiValidate(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Ogiltig förfrågan.";
  const b = body as Record<string, unknown>;
  if (b.version !== 2) return "version måste vara 2.";
  if (typeof b.b0 !== "string" || !AREAS.includes(b.b0)) return "b0 saknas eller är ogiltigt.";
  if (!Number.isInteger(b.b5) || (b.b5 as number) < 1 || (b.b5 as number) > 6) return "b5 saknas eller är ogiltigt.";
  const ans = b.answers as Record<string, unknown> | undefined;
  if (!ans || typeof ans !== "object") return "answers saknas.";
  for (const id of QIDS) {
    const v = ans[id];
    if (!Number.isInteger(v) || (v as number) < 0 || (v as number) > 3) return `${id} saknas eller är ogiltigt.`;
  }
  for (const k of ["b1", "b2", "b3"]) {
    if (b[k] !== undefined && b[k] !== null && (typeof b[k] !== "string" || (b[k] as string).length > 120)) return `${k} är ogiltigt.`;
  }
  if (b.b2 && !BMI_B2.options.includes(b.b2 as string)) return "b2 är ogiltigt.";
  if (b.b3 && !BMI_B3.options.includes(b.b3 as string)) return "b3 är ogiltigt.";
  if (b.b4 !== undefined && b.b4 !== null) {
    if (!Array.isArray(b.b4) || b.b4.length > 30) return "b4 är ogiltigt.";
    const allowed = BMI_B4[b.b0 as BmiArea].groups.flatMap((g) => g.options);
    if (b.b4.some((x) => typeof x !== "string" || !allowed.includes(x))) return "b4 är ogiltigt.";
  }
  return null;
}

export function bmiScore(input: BmiInput): BmiResult {
  const a = input.answers;
  const phase = bmiPhase(input.b5);
  const counted = BMI_COUNTED[phase];
  const raw: Record<BmiSectionId, number> = {} as Record<BmiSectionId, number>;
  for (const s of BMI_SECTIONS) raw[s.id] = (s.questions.reduce((sum, q) => sum + a[q], 0) / 9) * 100;

  const sections = BMI_SECTIONS.map((s) => {
    const isCounted = counted.includes(s.id);
    return { id: s.id, name: s.name, score: Math.round(raw[s.id]), counted: isCounted, note: isCounted ? null : BMI_UNCOUNTED_NOTES[s.id] ?? null };
  });

  const total = Math.round(counted.reduce((sum, id) => sum + raw[id], 0) / counted.length);
  const lvl = BMI_LEVELS.find((l) => total >= l.min)!;

  let best: BmiSectionId | null = null;
  for (const s of BMI_SECTIONS) if (counted.includes(s.id) && (best === null || raw[s.id] > raw[best])) best = s.id;
  const strength = best && raw[best] >= 50 ? { id: best, text: BMI_STRENGTH_TEXTS[best] } : null;

  const qById = new Map(BMI_QUESTIONS.map((q) => [q.id, q]));
  const prio = (id: BmiQuestionId) => BMI_ACTION_PRIORITY.indexOf(id);
  const candidates = BMI_QUESTIONS.filter((q) => counted.includes(q.section) && a[q.id] <= 2)
    .map((q) => q.id)
    .sort((x, y) => a[x] - a[y] || prio(x) - prio(y));
  const low = candidates.filter((id) => a[id] <= 1);
  const picked = (low.length >= 3 ? low : candidates).slice(0, 3);
  const actions = picked.map((id) => ({ question: id, title: qById.get(id)!.title, text: qById.get(id)!.next }));

  const warnings = BMI_WARNINGS.filter((w) => w.test(a, phase)).slice(0, 3).map((w) => ({ id: w.id, text: w.text }));

  const pq = (Object.keys(BMI_PARTNER_QUESTIONS) as BmiQuestionId[]).filter((id) => a[id] <= 1);
  if (pq.length < 3) for (const id of ["F11", "F12"] as BmiQuestionId[]) if (!pq.includes(id)) pq.push(id);
  const num = (id: string) => Number(id.slice(1));
  const partner_questions = pq.sort((x, y) => num(x) - num(y)).slice(0, 5).map((id) => ({ question: id, text: BMI_PARTNER_QUESTIONS[id]! }));

  const read_more = counted
    .filter((id) => raw[id] < 60 && BMI_READ_MORE[id])
    .slice(0, 3)
    .map((id) => ({ section: id, ...BMI_READ_MORE[id]! }));

  return { phase, total, level: lvl.name, summary: lvl.summary, sections, strength, actions, warnings, partner_questions, read_more };
}

/** Inserts {nytt_system}/{systemet} and capitalises a leading variable. */
export function bmiQuestionText(text: string, area: BmiArea): string {
  const v = BMI_AREA_VARS[area];
  const leading = /^\{(nytt_system|systemet)\}/.test(text);
  let out = text.replace("{nytt_system}", v.nytt_system).replace("{systemet}", v.systemet);
  if (leading) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}
