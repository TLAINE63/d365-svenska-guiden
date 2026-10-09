/**
 * NAV → Business Central: regelbaserad beslutsmodell.
 * Frågor, regler och resultattexter hålls här, separerat från UI.
 * Poängen är interna vikter för att välja väg A/B/C och visas aldrig som procent.
 */

export type NavAnswers = Record<string, string | string[] | undefined>;

export interface NavOption {
  value: string;
  label: string;
}

export interface NavQuestion {
  id: string;
  question: string;
  multi?: boolean;
  options: NavOption[];
}

const o = (value: string, label: string): NavOption => ({ value, label });

export const NAV_QUESTIONS: NavQuestion[] = [
  {
    id: "version",
    question: "Vilken version av NAV eller Navision använder ni?",
    options: [
      o("2018", "NAV 2018"), o("2017", "NAV 2017"), o("2016", "NAV 2016"), o("2015", "NAV 2015"),
      o("2013", "NAV 2013 / 2013 R2"), o("2009", "NAV 2009"), o("older", "Äldre Navision/NAV"), o("unknown", "Vet inte"),
    ],
  },
  {
    id: "hosting",
    question: "Var körs NAV idag?",
    options: [o("own", "Egen server"), o("hosting", "Hostingpartner"), o("azure", "Azure"), o("unknown", "Vet inte")],
  },
  {
    id: "custom",
    question: "Hur anpassad är lösningen?",
    options: [
      o("standard", "Nästan standard"), o("minor", "Några mindre anpassningar"),
      o("many", "Många verksamhetsspecifika anpassningar"), o("heavy", "Kraftigt specialutvecklad"), o("unknown", "Vet inte"),
    ],
  },
  {
    id: "importance",
    question: "Hur viktiga är anpassningarna idag?",
    options: [
      o("most", "De flesta behövs fortfarande"), o("some", "Vissa behövs, andra kan tas bort"),
      o("replaceable", "Mycket bör kunna ersättas med standard eller appar"), o("unknown", "Vi vet inte varför vissa anpassningar finns"),
    ],
  },
  {
    id: "integrations",
    question: "Hur många externa integrationer har ni?",
    options: [o("0", "Inga"), o("1-3", "1–3"), o("4-10", "4–10"), o("10+", "Fler än 10"), o("unknown", "Vet inte")],
  },
  {
    id: "history",
    question: "Hur mycket historik behöver följa med?",
    options: [
      o("master", "Masterdata och ingående balanser räcker"), o("years", "Några års transaktioner behöver följa med"),
      o("large", "Stora delar av historiken"), o("all", "All historik"), o("unknown", "Vet inte"),
    ],
  },
  {
    id: "areas",
    question: "Vilka delar av verksamheten hanteras i NAV?",
    multi: true,
    options: [
      o("finance", "Ekonomi"), o("sales", "Försäljning"), o("purchase", "Inköp"), o("warehouse", "Lager och logistik"),
      o("project", "Projekt"), o("production", "Produktion"), o("service", "Service"), o("other", "Annat"),
    ],
  },
  {
    id: "companies",
    question: "Hur många bolag använder lösningen?",
    options: [o("1", "1"), o("2-3", "2–3"), o("4-10", "4–10"), o("10+", "Fler än 10")],
  },
  {
    id: "specialists",
    question: "Hur beroende är ni av NAV-specialister?",
    options: [
      o("low", "Väldigt lite"), o("sometimes", "Vi behöver specialiststöd ibland"),
      o("partner", "Vi är ganska beroende av vår NAV-partner"), o("developers", "Lösningen är svår att förändra utan utvecklare"),
    ],
  },
  {
    id: "reason",
    question: "Vad är främsta anledningen till att ni överväger att lämna NAV?",
    options: [
      o("old", "Vår NAV-version börjar bli för gammal"), o("cloud", "Vi vill gå från on-premises till molnet"),
      o("custom", "Lösningen har blivit för specialanpassad"), o("costly", "Det är svårt eller dyrt att vidareutveckla NAV"),
      o("modernize", "Vi vill modernisera våra arbetssätt"), o("growth", "Verksamheten har vuxit eller förändrats"),
      o("evaluate", "Vi vill utvärdera Business Central"), o("undecided", "Vi har inte bestämt oss ännu"),
    ],
  },
];

// ---------- Vikter (interna, ändras här) ----------
const W = {
  custom: { standard: 0, minor: 1, many: 3, heavy: 4 } as Record<string, number>,
  importance: { most: 2, some: 1, replaceable: 0, unknown: 1 } as Record<string, number>,
  integrations: { "0": 0, "1-3": 1, "4-10": 2, "10+": 3 } as Record<string, number>,
  history: { master: 0, years: 1, large: 2, all: 3 } as Record<string, number>,
  companies: { "1": 0, "2-3": 1, "4-10": 2, "10+": 3 } as Record<string, number>,
  specialists: { low: 0, sometimes: 1, partner: 2, developers: 3 } as Record<string, number>,
};
/** Gränser för vägval. */
const THRESHOLD = { B: 6, C: 13 };
/** Antal "Vet inte" som ger kartläggningsblock resp. osäker bedömning. */
const UNKNOWN_BLOCK = 2;
const UNKNOWN_UNSAFE = 3;

export type NavPath = "A" | "B" | "C";

export interface NavResult {
  path: NavPath;
  situation: string[];
  factors: string[];
  investigate: string[];
  partnerQuestions: string[];
  unknowns: string[];
  unsafe: boolean;
}

const one = (a: NavAnswers, id: string) => (typeof a[id] === "string" ? (a[id] as string) : undefined);
const label = (id: string, v?: string) =>
  NAV_QUESTIONS.find((q) => q.id === id)?.options.find((x) => x.value === v)?.label ?? "";

const UNKNOWN_TEXT: Record<string, string> = {
  version: "Ni vet ännu inte vilken NAV-version ni kör. Ta reda på det, eftersom versionen påverkar vilka uppgraderingsvägar som finns.",
  hosting: "Ni vet ännu inte var NAV körs. Klargör drift och avtal, så vet ni vad som behöver avvecklas eller flyttas.",
  custom: "Ni vet ännu inte hur anpassad lösningen är. Låt någon lista anpassningarna innan ni jämför migrationsalternativ.",
  importance: "Ni vet inte varför vissa anpassningar finns. Gå igenom dem med verksamheten innan något flyttas.",
  integrations: "Ni vet ännu inte hur många integrationer NAV har. Kartlägg dessa innan ni jämför migrationsalternativ.",
  history: "Ni vet ännu inte hur mycket historik som behöver följa med. Fråga ekonomi och verksamhet vad de faktiskt söker i gammal data.",
};

export function calculateNavResult(a: NavAnswers): NavResult {
  const custom = one(a, "custom");
  const importance = one(a, "importance");
  const integrations = one(a, "integrations");
  const history = one(a, "history");
  const companies = one(a, "companies");
  const specialists = one(a, "specialists");
  const version = one(a, "version");
  const hosting = one(a, "hosting");
  const reason = one(a, "reason");
  const areas = Array.isArray(a.areas) ? a.areas : [];

  const pts = (map: Record<string, number>, v?: string) => (v && v in map ? map[v] : 0);
  const sCustom = pts(W.custom, custom);
  const sInteg = pts(W.integrations, integrations);
  const sHist = pts(W.history, history);
  const hasProduction = areas.includes("production");
  const hasWarehouse = areas.includes("warehouse");
  const sBreadth = (areas.length >= 5 ? 2 : areas.length >= 3 ? 1 : 0) + (hasProduction ? 1 : 0);

  const score =
    sCustom + pts(W.importance, importance) + sInteg + sHist + sBreadth +
    pts(W.companies, companies) + pts(W.specialists, specialists) +
    (version === "older" || version === "2009" ? 1 : 0);

  let path: NavPath = "A";
  if (score >= THRESHOLD.C || (custom === "heavy" && (sInteg >= 2 || sHist >= 2))) path = "C";
  else if (score >= THRESHOLD.B || sCustom >= 3 || importance === "replaceable" || importance === "unknown") path = "B";

  // Vet inte
  const unknownIds = ["version", "hosting", "custom", "importance", "integrations", "history"].filter(
    (id) => one(a, id) === "unknown",
  );
  const unknowns = unknownIds.map((id) => UNKNOWN_TEXT[id]);
  const unsafe = unknownIds.length >= UNKNOWN_UNSAFE;
  // Många "Vet inte" ger ingen hög komplexitet, men en rak väg kan inte påstås förrän miljön kartlagts.
  if (unsafe && path === "A") path = "B";

  // Utgångsläge
  const situation: string[] = [];
  if (version && version !== "unknown") situation.push(`Ni kör ${label("version", version)}`);
  if (hosting && hosting !== "unknown") situation.push(`drift: ${label("hosting", hosting).toLowerCase()}`);
  if (custom && custom !== "unknown") situation.push(`anpassningsgrad: ${label("custom", custom).toLowerCase()}`);
  if (integrations && integrations !== "unknown")
    situation.push(integrations === "0" ? "inga externa integrationer" : `${label("integrations", integrations).toLowerCase()} integrationer`);
  if (companies) situation.push(companies === "1" ? "ett bolag" : `${label("companies", companies).toLowerCase()} bolag`);
  if (areas.length) situation.push(`NAV används för ${areas.map((v) => label("areas", v).toLowerCase()).join(", ")}`);
  if (reason) situation.push(`främsta skäl: ${label("reason", reason).toLowerCase()}`);

  // Faktorer (bara det som följer av svaren)
  const factors: string[] = [];
  if (sCustom >= 3) factors.push(custom === "heavy" ? "Kraftigt specialutvecklad NAV-lösning" : "Många verksamhetsspecifika NAV-anpassningar");
  if (sInteg >= 2) factors.push(integrations === "10+" ? "Fler än 10 externa integrationer" : "Flera externa integrationer (4–10)");
  if (sHist >= 2) factors.push(history === "all" ? "Behov av att flytta all historik" : "Stort behov av historik");
  if (pts(W.companies, companies) >= 1) factors.push(`Flera bolag (${label("companies", companies)})`);
  if (hasProduction) factors.push("Produktionsprocesser i NAV");
  else if (hasWarehouse && areas.length >= 3) factors.push("Lager och logistik i NAV");
  if (pts(W.specialists, specialists) >= 2) factors.push("Starkt beroende av NAV-specialister");
  if (importance === "replaceable") factors.push("Många anpassningar bedöms kunna ersättas");
  if (factors.length === 0) {
    if (custom === "standard" || custom === "minor") factors.push("Lösningen ligger nära standard");
    if (integrations === "0" || integrations === "1-3") factors.push("Få integrationer att hantera");
    if (history === "master") factors.push("Begränsat behov av historik");
  }

  // Undersök först
  const investigate: string[] = [];
  if (sCustom >= 1 || importance) investigate.push("Lista alla NAV-anpassningar och pröva var och en: behåll, standard, app eller avveckla.");
  if (sInteg >= 1) investigate.push("Kartlägg varje integration: vad den gör, vem som äger den och om den behöver byggas om.");
  if (sHist >= 1) investigate.push("Bestäm vilken historik som måste finnas i Business Central och vilken som kan arkiveras sökbart.");
  if (pts(W.companies, companies) >= 1) investigate.push("Se över bolagsstruktur, koncerninterna flöden och om alla bolag ska byta samtidigt.");
  if (hasProduction || hasWarehouse) investigate.push("Gå igenom produktions- och lagerprocesser särskilt, de är ofta mest anpassade.");
  if (pts(W.specialists, specialists) >= 2) investigate.push("Dokumentera kunskapen som idag finns hos specialister innan projektet startar.");
  if (version === "older" || version === "2009") investigate.push("Kontrollera med en partner vilka uppgraderingsvägar som finns från er version.");
  if (investigate.length === 0) investigate.push("Gör en kort förstudie av version, data, integrationer och anpassningar.");

  // Partnerfrågor
  const partnerQuestions: string[] = [];
  if (sCustom >= 1) partnerQuestions.push("Vilka av våra NAV-anpassningar kan ersättas med standardfunktionalitet eller appar?");
  if (sHist >= 1) partnerQuestions.push("Vilken historik behöver migreras till Business Central och vilken kan göras tillgänglig på annat sätt?");
  if (sInteg >= 1) partnerQuestions.push("Hur hanterar ni våra integrationer, och vilka behöver byggas om?");
  if (pts(W.companies, companies) >= 1) partnerQuestions.push("Hur har ni genomfört övergångar för koncerner med flera bolag?");
  if (hasProduction) partnerQuestions.push("Vilken erfarenhet har ni av produktion i Business Central?");
  if (pts(W.specialists, specialists) >= 2) partnerQuestions.push("Hur minskar vi vårt beroende av specialister efter bytet?");
  if (path === "C") partnerQuestions.push("Kan ni jämföra migrering med en ny implementation för vår situation?");
  if (version) partnerQuestions.push("Vilken uppgraderingsväg gäller för vår NAV-version?");

  return {
    path,
    situation,
    factors: factors.slice(0, 4),
    investigate: investigate.slice(0, 5),
    partnerQuestions: partnerQuestions.slice(0, 5),
    unknowns: unknownIds.length >= UNKNOWN_BLOCK ? unknowns : [],
    unsafe,
  };
}

export const NAV_PATH_TEXT: Record<NavPath, { title: string; body: string; next: string }> = {
  A: {
    title: "Relativt rak väg mot Business Central",
    body: "Era svar innehåller relativt få indikatorer på hög komplexitet. Det talar för att en uppgradering och migrering kan vara en rimlig väg att utreda.",
    next: "Förstudie av version, data, integrationer och anpassningar följt av kostnadsbedömning.",
  },
  B: {
    title: "Förenkla innan ni migrerar",
    body: "Anpassningar, integrationer, historik eller verksamhetens komplexitet bör analyseras innan projektets omfattning bestäms. Allt som finns i NAV behöver inte följa med.",
    next: "Gå igenom anpassningar och integrationer och bestäm vad som ska behållas, ersättas med standard eller appar, eller avvecklas.",
  },
  C: {
    title: "Jämför migration med en ny Business Central-implementation",
    body: "NAV-miljön verkar tillräckligt komplex för att det är relevant att utreda två alternativ innan ni bestämmer er.",
    next: "Be en partner beskriva båda alternativen för er situation, med omfattning och risker för vart och ett.",
  },
};

export const NAV_UNSAFE_TEXT =
  "Det finns delar av er NAV-miljö som behöver kartläggas innan migrationsvägen kan bedömas säkert.";
