// Behovsguiden "Vi står inför ett systemval" – frågekonfiguration (Sprint 1).
// Endast dialogstruktur: inga produktregler, ingen rekommendationslogik.
// Produktmoduler (senare sprintar) registreras i MODULES och kan begära
// gemensamma frågor (t.ex. förändringsavsikt) samt egna fördjupningsfrågor.

export const CONFIG_VERSION = "systemval-2.0.0";
export const MAX_QUESTIONS = 10;

export type EntryKey = "needs" | "product" | "problem";

export type NeedArea =
  | "erp"
  | "supply_chain"
  | "production"
  | "sales"
  | "marketing"
  | "customer_service"
  | "contact_center"
  | "field_service"
  | "projects";

export const NEED_AREAS: { id: NeedArea; label: string }[] = [
  { id: "erp", label: "Ekonomi och affärssystem" },
  { id: "supply_chain", label: "Order, lager, inköp och logistik" },
  { id: "production", label: "Produktion" },
  { id: "sales", label: "Försäljning" },
  { id: "marketing", label: "Marknadsföring och kundinsikter" },
  { id: "customer_service", label: "Kundservice" },
  { id: "contact_center", label: "Kontaktcenter och kunddialog" },
  { id: "field_service", label: "Service ute hos kund" },
  { id: "projects", label: "Projekt och resurser" },
];

/** Produktuniversum för denna guide. Endast utgångspunkt i Sprint 1. */
export type ProductKey = "bc" | "fscm" | "sales" | "ci" | "cs" | "cc" | "fs" | "po";
export const PRODUCTS: { id: ProductKey; label: string }[] = [
  { id: "bc", label: "Business Central" },
  { id: "fscm", label: "Finance & Supply Chain Management" },
  { id: "sales", label: "Sales" },
  { id: "ci", label: "Customer Insights" },
  { id: "cs", label: "Customer Service" },
  { id: "cc", label: "Contact Center" },
  { id: "fs", label: "Field Service" },
  { id: "po", label: "Project Operations" },
];

export interface Option {
  id: string;
  label: string;
  desc?: string;
  /** Exklusivt mot konkreta svar (Vet inte/osäker). */
  exclusive?: boolean;
  /** Behovssignal (problemvägen). Inte en produktrekommendation. */
  needs?: NeedArea[];
}

/** Härlett tillstånd som frågorna läser för visas_om / hoppas_över_om. */
export interface DialogContext {
  entry?: EntryKey;
  needs: NeedArea[];
  primaryNeed?: NeedArea;
  prioritySetting?: "primary" | "equal" | "unknown";
  productStart?: ProductKey | "unsure";
  problems: string[];
  answers: Record<string, string[]>;
  /** Gemensamma frågor som någon aktiv produktmodul har begärt. */
  requestedCommon: Set<string>;
  /** Antal självständiga frågor på vägen hittills (för budgetstyrda hopp). */
  questionCount: number;
}

export interface Question {
  id: string;
  module: "entry" | "common" | NeedArea | ProductKey;
  /** Statisk text eller konfigurerad mall vald utifrån kontext (aldrig fri AI). */
  text: string | ((ctx: DialogContext) => string);
  help?: string;
  type: "single" | "multi";
  options: Option[] | ((ctx: DialogContext) => Option[]);
  showIf: (ctx: DialogContext) => boolean;
  skipIf?: (ctx: DialogContext) => boolean;
  /** Lägre = ställs tidigare. Lika prioritet: konfigurationsordning. */
  priority: number;
  affects: string[];
  /** Vilka bedömningar frågan kan avgöra (avgörande_för). */
  decisiveFor?: string[];
  /** false = startvalet, räknas inte som självständig fråga. */
  countsTowardBudget: boolean;
}

export const ENTRY_OPTIONS: Option[] = [
  { id: "needs", label: "Vi vill förstå vilken lösning som passar våra behov", desc: "Börja med vad ni vill förbättra." },
  { id: "product", label: "Vi tittar redan på en viss Dynamics\u00A0365-lösning", desc: "Gå direkt till frågor kring den lösningen." },
  { id: "problem", label: "Vi vet problemen, men inte vilken lösning vi behöver", desc: "Börja med det som inte fungerar idag." },
];

export const PROBLEM_OPTIONS: Option[] = [
  { id: "closing", label: "Bokslut och ekonomiarbete tar för mycket tid", needs: ["erp"] },
  { id: "inventory", label: "Lager och leveranser är svåra att styra", needs: ["supply_chain"] },
  { id: "production_manual", label: "Produktion eller planering sker för manuellt", needs: ["production"] },
  { id: "pipeline", label: "Affärer och försäljningsprognoser är svåra att överblicka", needs: ["sales"] },
  { id: "leads_lost", label: "Leads tappas mellan marknad och försäljning", needs: ["marketing", "sales"] },
  { id: "cases_email", label: "Kundärenden hamnar i mejl eller olika system", needs: ["customer_service"] },
  { id: "channels", label: "Kunddialogen fungerar dåligt mellan olika kanaler", needs: ["contact_center"] },
  { id: "technicians", label: "Tekniker ute hos kund saknar rätt information", needs: ["field_service"] },
  { id: "project_margin", label: "Projekt, resurser eller projektmarginaler är svåra att styra", needs: ["projects"] },
  { id: "duplicate_entry", label: "Information registreras flera gånger i olika system", needs: ["erp"] },
  { id: "unsure", label: "Vi är osäkra", exclusive: true },
];

const needOptions: Option[] = [
  ...NEED_AREAS.map((a) => ({ id: a.id, label: a.label })),
  { id: "unknown", label: "Vi vet inte ännu", exclusive: true },
];

export const QUESTIONS: Question[] = [
  {
    id: "entry",
    module: "entry",
    text: "Var vill ni börja?",
    type: "single",
    options: ENTRY_OPTIONS,
    showIf: () => true,
    priority: 0,
    affects: ["entry"],
    countsTowardBudget: false,
  },
  {
    id: "product_start",
    module: "entry",
    text: "Vilken Dynamics\u00A0365-lösning tittar ni på?",
    help: "Vi sparar det som er utgångspunkt, inte som vår bedömning.",
    type: "single",
    options: [...PRODUCTS.map((p) => ({ id: p.id, label: p.label })), { id: "unsure", label: "Vi är ändå osäkra", exclusive: true }],
    showIf: (c) => c.entry === "product",
    priority: 10,
    affects: ["productStart"],
    countsTowardBudget: true,
  },
  {
    id: "problems",
    module: "entry",
    text: "Vilka av de här problemen känner ni igen?",
    type: "multi",
    options: PROBLEM_OPTIONS,
    showIf: (c) => c.entry === "problem",
    priority: 10,
    affects: ["problems", "needs"],
    countsTowardBudget: true,
  },
  {
    id: "needs_areas",
    module: "entry",
    text: "Vad vill ni framför allt förbättra eller få hjälp med?",
    type: "multi",
    options: needOptions,
    // Behovsvägen, samt fallback utan omstart när produkt/problem är osäkert.
    showIf: (c) =>
      c.entry === "needs" ||
      (c.entry === "product" && c.productStart === "unsure") ||
      (c.entry === "problem" && c.answers.problems?.includes("unsure") === true),
    priority: 20,
    affects: ["needs"],
    countsTowardBudget: true,
  },
  {
    id: "priority",
    module: "common",
    text: "Vilket område är viktigast att börja med?",
    type: "single",
    options: (c) => [
      ...c.needs.map((n) => ({ id: n, label: NEED_AREAS.find((a) => a.id === n)!.label })),
      { id: "equal", label: "Flera är lika viktiga", exclusive: true },
      { id: "unknown", label: "Vet inte", exclusive: true },
    ],
    showIf: (c) => c.needs.length >= 2,
    priority: 30,
    affects: ["primaryNeed", "secondaryNeeds"],
    countsTowardBudget: true,
  },
  {
    id: "change_intent",
    module: "common",
    text: "Vad vill ni framför allt förändra?",
    type: "single",
    options: [
      { id: "introduce", label: "Införa systemstöd vi saknar idag" },
      { id: "replace", label: "Ersätta ett befintligt system" },
      { id: "consolidate", label: "Samla flera system i en gemensammare lösning" },
      { id: "improve", label: "Förbättra eller modernisera nuvarande lösning" },
      { id: "integrate", label: "Koppla ihop system som ska finnas kvar" },
      { id: "unknown", label: "Vet inte", exclusive: true },
    ],
    // Inte obligatorisk: visas bara när en produktmodul begär den.
    showIf: (c) => c.requestedCommon.has("change_intent"),
    priority: 40,
    affects: ["changeIntent"],
    countsTowardBudget: true,
  },
];

/** Produktmoduler registreras i MODULES (src/lib/systemval/modules). */
export interface NeedModule {
  id: string;
  /** Modulen är aktiv när detta returnerar true. */
  activeIf: (c: DialogContext) => boolean;
  /** Gemensamma frågor modulen behöver (t.ex. "change_intent"). */
  requestsCommon?: (c: DialogContext) => string[];
  questions: Question[];
  /** Deterministisk modulbedömning utifrån aktiva svar. */
  evaluate?: (c: DialogContext) => unknown;
}
