/**
 * F&SCM Matchningstest – frågestruktur.
 * Funktionsorienterat behovsmatchningstest (inte mognadsbetyg).
 * Ton: produktneutral, köparsidig. Resultatet kan vara "Sannolikt överdimensionerat".
 */

export type AnswerValue = string;
export type Answers = Record<string, AnswerValue>;

export type QuestionType = "single" | "yesno" | "scale4";

export interface Option {
  /** Värdet som lagras i answers. Kort, snake/kebab-case eller siffra som sträng. */
  value: string;
  /** Vad användaren ser i UI. */
  label: string;
  /** Poäng som ges till frågans block. */
  points: number;
}

export interface Question {
  id: string;
  block: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  type: QuestionType;
  options: Option[];
  /** Om satt: frågan visas endast om predikatet returnerar true. */
  showIf?: (a: Answers) => boolean;
  /** Hjälptext under frågan. */
  help?: string;
}

export const BLOCKS: Record<1 | 2 | 3 | 4 | 5 | 6, { title: string; description: string }> = {
  1: {
    title: "Verksamhet och struktur",
    description: "Övergripande bild av koncernen, branschen och geografisk räckvidd.",
  },
  2: {
    title: "Ekonomi och koncernstyrning",
    description: "Hur du hanterar ekonomi, intercompany och regulatoriska krav i dag.",
  },
  3: {
    title: "Supply chain, lager och inköp",
    description: "Lagerstruktur, tillverkning, inköp och spårbarhet.",
  },
  4: {
    title: "Projekt och tjänsteleverans",
    description: "Hur du säljer och styr projektbaserade uppdrag.",
  },
  5: {
    title: "Handel och kundkontakt",
    description: "E-handel, omnikanal och integration mot ekonomi/lager.",
  },
  6: {
    title: "Mognad och framtid",
    description: "Hur väl rustade dina nuvarande system är för tillväxt och AI.",
  },
};

const yn = (yesPts: number, unsurePts: number = Math.round(yesPts / 3)): Option[] => [
  { value: "yes", label: "Ja", points: yesPts },
  { value: "no", label: "Nej", points: 0 },
  { value: "unsure", label: "Vet inte", points: unsurePts },
];

/** Branscher där supply chain / produktion / omnikanal inte är relevant. */
const isServicesOnly = (a: Answers): boolean => a.q3_industry === "tjanster";

export const QUESTIONS: Question[] = [
  // ---- Block 1: Verksamhet och struktur ----
  {
    id: "q1_employees",
    block: 1,
    text: "Hur många anställda har koncernen?",
    type: "single",
    options: [
      { value: "<50", label: "Färre än 50", points: 0 },
      { value: "50-250", label: "50–250", points: 0 },
      { value: "250-1000", label: "250–1 000", points: 0 },
      { value: "1000+", label: "Fler än 1 000", points: 0 },
    ],
  },
  {
    id: "q2_revenue",
    block: 1,
    text: "Vad är koncernens årsomsättning?",
    type: "single",
    options: [
      { value: "<100", label: "Under 100 Mkr", points: 0 },
      { value: "100-500", label: "100–500 Mkr", points: 0 },
      { value: "500-2000", label: "500 Mkr – 2 Mdr", points: 0 },
      { value: ">2000", label: "Över 2 Mdr", points: 0 },
    ],
  },
  {
    id: "q3_industry",
    block: 1,
    text: "Vilken bransch beskriver er verksamhet bäst?",
    type: "single",
    options: [
      { value: "tillverkning", label: "Tillverkning", points: 0 },
      { value: "grossist", label: "Grossist och distributionshandel", points: 0 },
      { value: "detaljhandel", label: "Detaljhandel", points: 0 },
      { value: "tjanster", label: "Tjänster och projekt", points: 0 },
      { value: "blandad", label: "Blandad verksamhet", points: 0 },
    ],
  },
  {
    id: "q4_legal_entities",
    block: 1,
    text: "Hur många legala enheter (bolag) ingår i koncernen?",
    type: "single",
    options: [
      { value: "1", label: "1", points: 0 },
      { value: "2-5", label: "2–5", points: 15 },
      { value: "6-15", label: "6–15", points: 25 },
      { value: "16+", label: "16 eller fler", points: 35 },
    ],
  },
  {
    id: "q5_intl_entities",
    block: 1,
    text: "Hur många av dessa bolag finns i andra länder än Sverige?",
    type: "single",
    options: [
      { value: "0", label: "Inga", points: 0 },
      { value: "1-3", label: "1–3", points: 20 },
      { value: "4+", label: "4 eller fler", points: 30 },
    ],
  },
  {
    id: "q6_export",
    block: 1,
    text: "Säljer du till kunder i andra länder, oavsett om du har egen verksamhet där?",
    type: "single",
    options: [
      { value: "none", label: "Nej, endast hemmamarknaden", points: 0 },
      { value: "some", label: "Ja, till några länder", points: 5 },
      { value: "extensive", label: "Ja, omfattande exportförsäljning", points: 10 },
    ],
  },

  // ---- Block 2: Ekonomi och koncernstyrning ----
  {
    id: "q7_consolidation",
    block: 2,
    text: "Behöver du konsolidera flera bolag till en koncernredovisning idag?",
    type: "yesno",
    options: yn(15, 5),
  },
  {
    id: "q8_intercompany",
    block: 2,
    text: "Sker det regelbundna transaktioner mellan dina egna bolag (intercompany) som idag hanteras manuellt?",
    type: "yesno",
    options: yn(15, 5),
  },
  {
    id: "q9_multicurrency",
    block: 2,
    text: "Hanterar du flera valutor inom samma bolag eller mellan bolag i koncernen?",
    type: "yesno",
    options: yn(10, 3),
  },
  {
    id: "q10_systems_count",
    block: 2,
    text: "Hur många separata system används idag för ekonomi, lager, inköp och projekt sammantaget?",
    type: "single",
    options: [
      { value: "1", label: "1 system", points: 0 },
      { value: "2-3", label: "2–3 system", points: 0 },
      { value: "4+", label: "4 eller fler", points: 0 },
    ],
  },
  {
    id: "q11_reporting_quality",
    block: 2,
    text: "Hur upplever du kvaliteten på koncernens samlade finansiella rapportering idag?",
    type: "scale4",
    options: [
      { value: "1", label: "Snabb och tillförlitlig", points: 0 },
      { value: "2", label: "Acceptabel men med vissa manuella moment", points: 0 },
      { value: "3", label: "Tidskrävande och delvis manuell", points: 0 },
      { value: "4", label: "Långsam och opålitlig", points: 0 },
    ],
  },
  {
    id: "q12_regulatory",
    block: 2,
    text: "Har du regulatoriska krav som varierar mellan länder (lokal bokföring, momsregler, skatterapportering) som idag kräver mycket manuellt arbete?",
    type: "yesno",
    options: yn(15, 5),
  },

  // ---- Block 3: Supply chain, lager och inköp ----
  {
    id: "q13_warehouse",
    block: 3,
    text: "Bedriver du egen lagerverksamhet?",
    type: "yesno",
    showIf: (a) => !isServicesOnly(a),
    options: [
      { value: "yes", label: "Ja", points: 10 },
      { value: "no", label: "Nej", points: 0 },
    ],
  },
  {
    id: "q14_warehouse_complexity",
    block: 3,
    text: "Hur komplex är din lagerstyrning?",
    type: "single",
    showIf: (a) => !isServicesOnly(a) && a.q13_warehouse === "yes",
    options: [
      { value: "simple", label: "Enkla in- och utleveranser", points: 5 },
      { value: "multi", label: "Flera lager eller zoner", points: 15 },
      { value: "pick", label: "Plockoptimering", points: 20 },
      { value: "serial", label: "Serienummer- eller batchspårning", points: 25 },
    ],
  },
  {
    id: "q15_manufacturing",
    block: 3,
    text: "Hanterar du produktion eller tillverkning?",
    type: "single",
    showIf: (a) => !isServicesOnly(a),
    options: [
      { value: "no", label: "Nej", points: 0 },
      { value: "discrete", label: "Diskret tillverkning", points: 20 },
      { value: "process", label: "Processtillverkning", points: 20 },
      { value: "mixed", label: "Blandad tillverkning", points: 25 },
    ],
  },
  {
    id: "q16_purchasing",
    block: 3,
    text: "Hur sker din inköpsplanering idag?",
    type: "single",
    showIf: (a) => !isServicesOnly(a),
    options: [
      { value: "manual", label: "Manuellt eller i Excel", points: 5 },
      { value: "simple", label: "Enklare system", points: 10 },
      { value: "mrp", label: "Avancerad behovsplanering (MRP)", points: 20 },
    ],
    help: "Hög befintlig mognad ger ändå poäng – det visar att behovet av avancerad funktionalitet är etablerat.",
  },
  {
    id: "q17_forecasting",
    block: 3,
    text: "Har du behov av avancerad efterfrågeplanering eller prognostisering baserat på historisk försäljning?",
    type: "yesno",
    showIf: (a) => !isServicesOnly(a),
    options: yn(15, 5),
  },
  {
    id: "q18_traceability",
    block: 3,
    text: "Hur viktig är fullständig spårbarhet i kedjan, från inköp till leverans, för er verksamhet (t.ex. för livsmedel, läkemedel eller andra reglerade branscher)?",
    type: "scale4",
    showIf: (a) => !isServicesOnly(a),
    options: [
      { value: "1", label: "Inte viktigt", points: 0 },
      { value: "2", label: "Viktigt men inte kritiskt", points: 5 },
      { value: "3", label: "Viktigt", points: 10 },
      { value: "4", label: "Avgörande", points: 15 },
    ],
  },

  // ---- Block 4: Projekt och tjänsteleverans ----
  {
    id: "q19_project_sales",
    block: 4,
    text: "Säljer du projektbaserade tjänster eller uppdrag?",
    type: "yesno",
    options: [
      { value: "yes", label: "Ja", points: 20 },
      { value: "no", label: "Nej", points: 0 },
    ],
  },
  {
    id: "q20_project_integration",
    block: 4,
    text: "Behöver du tidrapportering, projektfakturering och lönsamhetsuppföljning per projekt integrerat med ekonomisystemet?",
    type: "yesno",
    showIf: (a) => a.q19_project_sales === "yes",
    options: [
      { value: "yes", label: "Ja", points: 40 },
      { value: "no", label: "Nej", points: 0 },
      { value: "unsure", label: "Vet inte", points: 15 },
    ],
  },
  {
    id: "q21_resource_planning",
    block: 4,
    text: "Arbetar du med flera samtidiga projekt som delar resurser (personal, utrustning) och som behöver resursplanering över projekt?",
    type: "yesno",
    showIf: (a) => a.q19_project_sales === "yes",
    options: [
      { value: "yes", label: "Ja", points: 40 },
      { value: "no", label: "Nej", points: 0 },
      { value: "unsure", label: "Vet inte", points: 15 },
    ],
  },

  // ---- Block 5: Handel och kundkontakt ----
  {
    id: "q22_ecommerce",
    block: 5,
    text: "Säljer du via egen e-handel idag, eller planerar du det?",
    type: "single",
    options: [
      { value: "yes", label: "Ja, idag", points: 15 },
      { value: "planning", label: "Planerar att göra det", points: 10 },
      { value: "no", label: "Nej", points: 0 },
    ],
  },
  {
    id: "q23_ecom_integration",
    block: 5,
    text: "Är det viktigt att e-handeln är direkt integrerad med lager, prissättning och ekonomi i realtid, snarare än ett separat system med manuell synk?",
    type: "yesno",
    showIf: (a) => a.q22_ecommerce !== "no",
    options: [
      { value: "yes", label: "Ja", points: 40 },
      { value: "no", label: "Nej", points: 0 },
      { value: "unsure", label: "Vet inte", points: 15 },
    ],
  },
  {
    id: "q24_omnichannel",
    block: 5,
    text: "Hanterar du omnikanalförsäljning (butik, e-handel, grossist) som idag kräver flera separata system?",
    type: "yesno",
    showIf: (a) => !isServicesOnly(a),
    options: [
      { value: "yes", label: "Ja", points: 45 },
      { value: "no", label: "Nej", points: 0 },
      { value: "unsure", label: "Vet inte", points: 15 },
    ],
  },

  // ---- Block 6: Mognad och framtid ----
  {
    id: "q25_growth_capacity",
    block: 6,
    text: "Hur ser du på dina nuvarande systems förmåga att hantera tillväxt de kommande 3–5 åren?",
    type: "scale4",
    options: [
      { value: "1", label: "Väl rustade", points: 0 },
      { value: "2", label: "Klarar troligen behovet", points: 33 },
      { value: "3", label: "Osäkert", points: 66 },
      { value: "4", label: "Otillräckliga", points: 100 },
    ],
  },
  {
    id: "q26_ai_importance",
    block: 6,
    text: "Hur viktigt är det för dig att kunna dra nytta av AI-funktioner (automatiserad bokföring, prognoser, Copilot-assisterad analys) i dina processer framöver?",
    type: "scale4",
    options: [
      { value: "1", label: "Inte viktigt", points: 0 },
      { value: "2", label: "Visst intresse", points: 33 },
      { value: "3", label: "Viktigt", points: 66 },
      { value: "4", label: "Avgörande", points: 100 },
    ],
  },
];

export const isQuestionVisible = (q: Question, answers: Answers): boolean =>
  !q.showIf || q.showIf(answers);

export const visibleQuestions = (answers: Answers): Question[] =>
  QUESTIONS.filter((q) => isQuestionVisible(q, answers));
