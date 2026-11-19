/**
 * Paket 3: "Dynamics 365 i Copilot" – ett första, rådgivande beslutsunderlag.
 * Deterministiskt: samma svar ger alltid samma observationer, vägar och öppna frågor.
 * Ingen poäng, ingen produktrekommendation och inga pris- eller licenspåståenden;
 * resultatet säger vad som är relevant att undersöka, aldrig vad kunden ska köpa.
 */
const NB = "\u00A0";
const D365 = `Dynamics${NB}365`;
const SALES = `${D365} Sales`;
const M365C = `Microsoft${NB}365 Copilot`;

export type QuestionKey = "goal" | "base" | "m365" | "process" | "friction" | "integration" | "maturity";
export interface Option { value: string; label: string }
export interface Question { key: QuestionKey; label: string; options: Option[] }

const UNKNOWN: Option = { value: "unknown", label: "Vet inte" };

export const QUESTIONS: Question[] = [
  { key: "goal", label: "Vad vill ni främst förbättra?", options: [
    { value: "admin", label: "Minska administration och dubbelregistrering för säljarna" },
    { value: "adoption", label: "Få säljarna att använda CRM mer konsekvent" },
    { value: "pipeline", label: "Förbättra pipeline, prognoser och beslutsunderlag" },
    { value: "customer_view", label: "Få en samlad kundbild över historik, avtal och dialog" },
    { value: "erp", label: "Koppla samman försäljningen med affärssystem (ERP) och leverans" },
    { value: "switch", label: "Byta från ett befintligt CRM till en modernare lösning" },
    { value: "copilot", label: "Undersöka vad Copilot och agenter kan förändra i arbetssättet" },
    UNKNOWN,
  ] },
  { key: "base", label: "Vad har ni för CRM-grund idag?", options: [
    { value: "none", label: "Inget samlat system (kalkylark, mejl och anteckningar)" },
    { value: "light", label: "Ett enklare kontaktregister eller lättare säljstöd" },
    { value: "other_crm", label: "Ett etablerat CRM från annan leverantör (t.ex. Salesforce, SuperOffice, Lime, HubSpot)" },
    { value: "d365", label: `${SALES} eller äldre Dynamics CRM, men det används mindre än tänkt` },
    UNKNOWN,
  ] },
  { key: "m365", label: `Använder organisationen ${M365C} idag?`, options: [
    { value: "active", label: "Ja, licenser finns och används i vardagen" },
    { value: "pilot", label: "En pilot eller utvärdering pågår" },
    { value: "exploring", label: "Nej, men vi undersöker möjligheterna" },
    { value: "no", label: "Nej, inga planer just nu" },
    UNKNOWN,
  ] },
  { key: "process", label: "Hur ser er försäljning och kunddialog ut?", options: [
    { value: "simple", label: "Kortare säljcykler med få beslutsfattare" },
    { value: "complex", label: "Rådgivande eller komplex B2B med flera intressenter" },
    { value: "recurring", label: "Återkommande avtal och kundvård nära leveransen" },
    { value: "mixed", label: "Både nykundsförsäljning och avtalsförvaltning" },
    UNKNOWN,
  ] },
  { key: "friction", label: "Var upplever säljarna störst friktion i vardagen?", options: [
    { value: "admin", label: "Mejl, mötesanteckningar och sammanställningar tar tid" },
    { value: "threshold", label: "Motstånd mot att logga och rapportera i ett separat system" },
    { value: "info", label: "Svårt att snabbt hitta kundhistorik och underlag" },
    { value: "process", label: "Oklara nästa steg, prioriteringar eller ansvar" },
    UNKNOWN,
  ] },
  { key: "integration", label: "Vilket behov finns av koppling till affärssystem och verksamhetsdata?", options: [
    { value: "none", label: "Inget omedelbart behov" },
    { value: "basic", label: "Orderhistorik, fakturor och leveransstatus från affärssystemet (ERP)" },
    { value: "advanced", label: "Produktkonfiguration, prislistor, lager eller branschspecifika tillägg" },
    UNKNOWN,
  ] },
  { key: "maturity", label: "Hur ser er förmåga att förvalta lösningen ut?", options: [
    { value: "standard", label: "Vi vill ha beprövad standard med lite egen förvaltning" },
    { value: "capable", label: "Egen IT eller en etablerad partner kan förvalta och anpassa" },
    { value: "no_owner", label: "Vi saknar systemägare och behöver stöd i arbetssätt" },
    UNKNOWN,
  ] },
];

export type Answers = Partial<Record<QuestionKey, string>>;

export type PathKey = "improve_existing" | "compare_alternatives" | "evaluate_crm" | "copilot_workspace" | "integration" | "change" | "clarify";
export interface SolutionPath { key: PathKey; title: string; why: string; links: { label: string; to: string }[] }

export interface AssessmentResult {
  complete: boolean;
  limited: boolean;
  observations: string[];
  paths: SolutionPath[];
  openQuestions: string[];
}

/** Fasta, källhänvisade skillnader mellan produkterna. Inga licensinnehåll påstås. */
export const COPILOT_PRODUCTS: { name: string; text: string }[] = [
  { name: M365C, text: "Stöd i Outlook, Teams och Office för mejl, möten och informationssökning. Personlig produktivitet, inget kundregister." },
  { name: SALES, text: "CRM-plattformen: kundregister, aktiviteter, pipeline, prognoser, behörigheter och affärslogik." },
  { name: "Copilot- och agentfunktioner för försäljning", text: "Funktioner kopplade till CRM-data som kan ha egna licens- eller förbrukningsvillkor. Vad som ingår i en viss licens ska kontrolleras mot Microsofts aktuella dokumentation." },
  { name: "Specialutvecklade agenter", text: "Agenter som byggs i t.ex. Copilot Studio för era egna processer, ofta tillsammans med en partner." },
];
export const MICROSOFT_SOURCES = [
  { label: "Microsoft Learn: Copilot i Dynamics 365 Sales", url: "https://learn.microsoft.com/dynamics365/sales/copilot-overview" },
  { label: "Microsoft: licensguide för Dynamics 365", url: "https://go.microsoft.com/fwlink/?LinkId=866544" },
];

const P = (key: PathKey, title: string, why: string, links: SolutionPath["links"]): SolutionPath => ({ key, title, why, links });
const OPTIONS = Object.fromEntries(QUESTIONS.map((q) => [q.key, q.options]));
export const answerLabel = (k: QuestionKey, v?: string) => (OPTIONS[k] as Option[]).find((o) => o.value === v)?.label ?? "";

export function assess(a: Answers): AssessmentResult {
  const complete = QUESTIONS.every((q) => !!a[q.key]);
  const known = QUESTIONS.filter((q) => a[q.key] && a[q.key] !== "unknown").length;
  const limited = known < 4;
  const obs: string[] = [];
  const paths: SolutionPath[] = [];
  const qs: string[] = [];
  const add = (p: SolutionPath) => { if (!paths.some((x) => x.key === p.key)) paths.push(p); };

  const adminPain = a.friction === "admin" || a.friction === "threshold" || a.goal === "admin" || a.goal === "adoption";
  const structuredNeed = a.goal === "pipeline" || a.goal === "customer_view" || a.goal === "erp" || a.process === "complex" || a.process === "recurring" || a.process === "mixed";
  const needsIntegration = a.integration === "basic" || a.integration === "advanced" || a.goal === "erp";

  // A. Vad svaren indikerar
  if (a.base === "d365") obs.push(`Era svar tyder på att ni redan har en CRM-grund i ${D365} och att frågan främst gäller hur den används, snarare än vilket system ni har.`);
  if (a.base === "other_crm") obs.push(a.goal === "switch"
    ? "Era svar tyder på att ni överväger att byta CRM. Det kan vara klokt att först tydliggöra vad i nuvarande lösning som inte fungerar, så att ett byte löser rätt problem."
    : "Era svar tyder på att ni har ett etablerat CRM. En viktig fråga inför beslutet är om behoven kan mötas genom att utveckla det ni har.");
  if (a.base === "none" || a.base === "light") obs.push(structuredNeed
    ? "Era svar tyder på behov av mer strukturerad kundhantering (gemensamt kundregister, uppföljning och pipeline) än vad ni har idag."
    : "Era svar tyder på en enklare försäljning. Det kan ändå vara relevant att undersöka om ni behöver ett gemensamt kundregister och uppföljning.");
  if (adminPain) obs.push("Era svar tyder på att arbetssätt och administration är viktiga frågor att undersöka innan ni tar ställning till ett eventuellt systembyte.");
  if (a.m365 === "active" || a.m365 === "pilot") obs.push(`Ni använder eller testar ${M365C}. Det ger stöd i mejl och möten, men ersätter inte i sig kundregister, pipeline eller behörigheter.`);
  if (needsIntegration) obs.push(a.integration === "advanced"
    ? "Era svar tyder på att prislogik, produktkonfiguration eller branschkrav kan vara avgörande, vilket brukar kräva mer än standardfunktioner."
    : "Era svar tyder på att kopplingen mellan försäljning och affärssystem (ERP) är en viktig del av beslutet.");
  if (a.maturity === "no_owner") obs.push("Era svar visar att systemägarskapet behöver tydliggöras. Det är en viktig förutsättning för att få bättre användning av CRM och Copilot.");
  if (limited) obs.push("Många svar är \"Vet inte\". Underlaget blir därför översiktligt och pekar främst på vad som behöver klargöras först.");

  // B. Vägar att undersöka (flera kan gälla samtidigt)
  if (a.base === "d365") add(P("improve_existing", `Utveckla ert befintliga ${D365}`,
    "Det kan vara relevant att se över vyer, obligatoriska fält och processteg så att säljarna får nytta av systemet innan nya licenser eller system utvärderas.",
    [{ label: `Om ${SALES}`, to: "/d365sales/" }, { label: "Befintlig kund: nästa steg", to: "/befintlig-kund/" }]));
  if (a.base === "other_crm") {
    add(P("improve_existing", "Utveckla nuvarande CRM", "Det kan vara relevant att undersöka om nuvarande CRM kan förenklas eller kompletteras innan ett byte.", [{ label: "CRM-guiden", to: "/crm/" }]));
    add(P("compare_alternatives", `Jämför nuvarande CRM med ${SALES}`,
      "Om nuvarande lösning begränsar er kan en strukturerad jämförelse av funktioner, integrationer och totalkostnad ge ett bättre beslutsunderlag än en jämförelse av licenspriser.",
      [{ label: `${SALES} vs Salesforce`, to: "/jamfor/sales-vs-salesforce-sales-cloud/" }, { label: `${SALES} vs HubSpot`, to: "/jamfor/sales-vs-hubspot-sales-hub/" }]));
  }
  if ((a.base === "none" || a.base === "light" || a.base === "unknown") && (structuredNeed || a.goal === "switch")) add(P("evaluate_crm", `Utvärdera CRM-alternativ, däribland ${SALES}`,
    "Det kan vara relevant att jämföra lösningar utifrån er säljprocess, integrationer och förmåga att förvalta, inte utifrån ett enskilt produktnamn.",
    [{ label: "CRM-guiden", to: "/crm/" }, { label: `Om ${SALES}`, to: "/d365sales/" }]));
  if (adminPain || a.goal === "copilot" || a.m365 === "active" || a.m365 === "pilot") add(P("copilot_workspace", "Undersök hur Copilot kan minska administrationen",
    `Det kan vara relevant att undersöka om säljarna kan arbeta mer i Outlook och Teams. Skilj mellan ${M365C} och Copilot-funktioner kopplade till CRM, och kontrollera vad som faktiskt finns tillgängligt för er.`,
    [{ label: "AI och Copilot i Dynamics\u00A0365", to: "/ai/" }]));
  if (needsIntegration) add(P("integration", a.integration === "advanced" ? "Kartlägg integrations-, ISV- och branschkrav" : "Kartlägg kopplingen till affärssystemet (ERP)",
    "En viktig fråga inför beslutet är vilken information som ska flöda mellan försäljning och affärssystem, och om tillägg (ISV) behövs.",
    [{ label: "Tilläggslösningar (ISV) för Sales", to: "/kunskapscenter/dynamics-365-tillagg/?ce=Sales" }]));
  if (a.maturity === "no_owner" || a.friction === "process" || a.goal === "adoption") add(P("change", "Se över ägarskap, arbetssätt och datakvalitet",
    "Det kan vara relevant att utse en ägare, enas om processen och se över datakvaliteten. AI-funktioner ger sällan tillförlitliga svar på ofullständig kunddata.",
    [{ label: "Kravspecifikation för Sales", to: "/kravspecifikation-sales/" }]));
  if (paths.length === 0 || limited) add(P("clarify", "Klargör behov och nuläge först",
    "Innan vägval görs kan det vara relevant att beskriva vad som fungerar dåligt i dag och vad ni vill uppnå.",
    [{ label: "Behovsguiden", to: "/kom-igang/" }]));

  // C. Frågor som behöver utredas vidare
  qs.push("Vilka moment i säljprocessen behöver strukturerade fält och uppföljning, och vad räcker det att få stöd med i Outlook och Teams?");
  qs.push(`Vilka licenser och roller behövs? Kontrollera mot Microsofts aktuella dokumentation vad som ingår i ${M365C}, i ${SALES} och i Copilot-funktioner med särskilda villkor.`);
  qs.push("Vad blir totalkostnaden, inklusive införande, anpassning, integration och löpande förvaltning?");
  if (adminPain || a.base === "d365") qs.push("Vem ansvarar för att arbetssättet etableras så att verktygen faktiskt används?");
  if (a.m365 === "active" || a.m365 === "pilot" || a.goal === "copilot") qs.push("Är kunddatan tillräckligt komplett och behörighetsstyrd för att AI-funktioner ska ge tillförlitliga svar?");
  if (a.base === "other_crm") qs.push("Vad kostar och innebär en migrering av data, integrationer och anpassningar från nuvarande CRM?");
  if (needsIntegration) qs.push("Vilka data ska synkas med affärssystemet, i vilken riktning och hur ofta?");
  for (const q of QUESTIONS) if (a[q.key] === "unknown") qs.push(`Ej besvarat: ${q.label.replace(/\?$/, "")}. Ta reda på detta inför nästa steg.`);

  return { complete, limited, observations: obs, paths, openQuestions: qs };
}

export const PDF_NOTE = "Ett första beslutsunderlag baserat på era sju svar på d365.se. Det innehåller inga beräkningar och är inte en kravspecifikation, en CRM-upphandling eller en produktrekommendation. Funktioner och licensvillkor behöver kontrolleras mot Microsofts aktuella dokumentation.";

/** PDF: svaren i tabellen, A/B/C som rubricerade punktlistor (samma innehåll som skärmen). */
export function pdfContent(a: Answers, r: AssessmentResult) {
  const values: Record<string, string> = {};
  for (const q of QUESTIONS) values[q.label] = answerLabel(q.key, a[q.key]) || "Ej besvarad";
  return {
    values,
    pdf: {
      note: PDF_NOTE,
      tableHeading: "Era svar",
      sections: [
        { heading: "A. Vad svaren indikerar", items: r.observations.map((text) => ({ text })) },
        { heading: "B. Vägar som kan vara relevanta att undersöka", intro: "Flera vägar kan gälla samtidigt. Ordningen är ingen rangordning.", items: r.paths.map((p) => ({ title: p.title, text: p.why })) },
        { heading: "C. Frågor som behöver utredas vidare", items: r.openQuestions.map((text) => ({ text })) },
      ],
    },
  };
}

/** Samma innehåll som skärmen, för delat underlag. */
export function summaryRows(a: Answers, r: AssessmentResult): Record<string, string> {
  const rows: Record<string, string> = {};
  for (const q of QUESTIONS) rows[q.label] = answerLabel(q.key, a[q.key]) || "Ej besvarad";
  rows["A. Vad svaren indikerar"] = r.observations.join(" • ");
  rows["B. Vägar att undersöka"] = r.paths.map((p) => `${p.title}: ${p.why}`).join(" • ");
  rows["C. Frågor att utreda vidare"] = r.openQuestions.join(" • ");
  rows["Om underlaget"] = "Ett första beslutsunderlag, inte en kravspecifikation eller produktrekommendation.";
  return rows;
}
