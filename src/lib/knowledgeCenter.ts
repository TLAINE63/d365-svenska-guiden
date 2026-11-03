/**
 * Kunskapscentret (WP1): fyra ingångar, Situation och Ämne som metadata ovanpå
 * den befintliga innehållslistan. Rent och deterministiskt, inga React-beroenden.
 * Metadata härleds från fält som redan finns (typ, produkter, URL, kategori, titel),
 * plus en kort redaktionell lista per resurs-id. Inga nya innehållsbibliotek.
 */

export type KnowledgeEntryId = "behov" | "jamfor" | "planera" | "partner";

export type KnowledgeSituation =
  | "utvarderar_ny"
  | "planerar_inforande"
  | "befintlig_kund"
  | "utveckla"
  | "partner_kompetens";

export type KnowledgeTopic = "erp" | "crm" | "ai" | "partnerval" | "forvaltning" | "tillagg" | "bransch";

export interface KnowledgeItemLike {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  url: string | null;
  products: string[];
  /** Redaktionell kategori när den finns (t.ex. bloggartiklarnas category). */
  category?: string | null;
  tags?: string[];
}

export interface KnowledgeEntry {
  id: KnowledgeEntryId;
  question: string;
  title: string;
  description: string;
  cta: string;
  /** Närliggande ingång som fyller på när träffarna är få. */
  related: KnowledgeEntryId;
  /** Befintliga destinationer som nästa steg efter ingången. */
  nextSteps: { label: string; to: string }[];
}

export const KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: "behov",
    title: "Förstå vad vi behöver",
    question: "Vad behöver vi förändra, förbättra eller lösa?",
    description: "Guider och analyser som hjälper er att beskriva behovet, oavsett om ni ska välja nytt eller utveckla det ni redan har.",
    cta: "Utforska våra behov",
    related: "jamfor",
    nextSteps: [
      { label: "Starta behovsguiden", to: "/kom-igang/" },
      { label: "Redan Dynamics-kund? Hitta nästa steg", to: "/befintlig-kund/" },
    ],
  },
  {
    id: "jamfor",
    title: "Jämför lösningar och möjligheter",
    question: "Vilka lösningar och vägval passar vår verksamhet?",
    description: "Produktjämförelser, branschguider, tilläggslösningar och möjligheter med AI.",
    cta: "Jämför alternativen",
    related: "behov",
    nextSteps: [
      { label: "Gör en behovsanalys", to: "/kom-igang/" },
      { label: "Se tilläggslösningar", to: "/kunskapscenter/dynamics-365-tillagg/" },
    ],
  },
  {
    id: "planera",
    title: "Planera vårt projekt",
    question: "Hur tar vi fram krav, budget och en realistisk plan?",
    description: "Stöd för införande, vidareutveckling, uppgradering, upphandling och andra förändringsprojekt.",
    cta: "Planera nästa steg",
    related: "behov",
    nextSteps: [
      { label: "Räkna på kostnaden", to: "/kostnad/" },
      { label: "Ta fram en kravspecifikation", to: "/kravspecifikation/" },
    ],
  },
  {
    id: "partner",
    title: "Välj eller utvärdera partner",
    question: "Har vi rätt partner och kompetens för det vi vill uppnå?",
    description: "Checklistor, partnerguider, jämförelser och erfarenheter från verkliga projekt.",
    cta: "Förbered partnerutvärderingen",
    related: "planera",
    nextSteps: [
      { label: "Jämför partners", to: "/jamfor-partners/" },
      { label: "Hitta kompetens", to: "/kompetens/" },
      { label: "Utvärdera nuvarande partner", to: "/guider/byta-dynamics-partner/" },
    ],
  },
];

export const SITUATION_LABEL: Record<KnowledgeSituation, string> = {
  utvarderar_ny: "Vi utvärderar en ny lösning",
  planerar_inforande: "Vi planerar ett införande",
  befintlig_kund: "Vi använder redan Dynamics 365",
  utveckla: "Vi vill utveckla eller komplettera lösningen",
  partner_kompetens: "Vi utvärderar partner eller kompetens",
};

export const TOPIC_LABEL: Record<KnowledgeTopic, string> = {
  erp: "Affärssystem (ERP)",
  crm: "CRM",
  ai: "AI och Copilot",
  partnerval: "Partnerval",
  forvaltning: "Förvaltning och vidareutveckling",
  tillagg: "Tilläggslösningar",
  bransch: "Branscher",
};

const ERP_PRODUCTS = new Set(["Business Central", "Finance & SCM", "Finance & Supply Chain"]);
const CRM_PRODUCTS = new Set(["Sales", "Customer Insights", "Customer Service", "Field Service", "Contact Center"]);
/** Resurser som gäller alla produkter (fler än så här räknas som generella, inte produktspecifika). */
const BROAD = 5;

/** Redaktionell koppling för befintliga verktyg och guider (id från Kunskapscentrets lista). */
const EDITORIAL: Record<string, KnowledgeEntryId[]> = {
  "tool-behovsanalys-erp": ["behov"],
  "tool-behovsanalys-salj": ["behov"],
  "tool-behovsanalys-kundservice": ["behov"],
  "tool-ai-readiness": ["behov", "jamfor"],
  "tool-bc-matchningstest": ["jamfor", "behov"],
  "tool-branschjamforelse": ["jamfor"],
  "tool-kravspec-erp": ["planera"],
  "tool-kravspec-sales": ["planera"],
  "tool-kravspec-marketing": ["planera"],
  "tool-kravspec-kundservice": ["planera"],
  "tool-guide-valj-partner": ["partner"],
  "tool-ebook-partnervalet": ["partner"],
  "tool-faq-affarssystem-partnerval": ["jamfor", "partner"],
  "tool-upphandlingsresan": ["planera"],
  "video-byta-affarssystem": ["behov"],
  "video-crm-affarssystem-byte": ["behov"],
  "video-inspirerad-personal": ["behov"],
  "video-partners-skillnader": ["partner"],
};

const text = (i: KnowledgeItemLike) =>
  `${i.title} ${i.description ?? ""} ${i.category ?? ""} ${(i.tags ?? []).join(" ")}`.toLowerCase();

export function topicsFor(item: KnowledgeItemLike): KnowledgeTopic[] {
  const t = new Set<KnowledgeTopic>();
  const specific = item.products.length > 0 && item.products.length <= BROAD;
  if (specific && item.products.some((p) => ERP_PRODUCTS.has(p))) t.add("erp");
  if (specific && item.products.some((p) => CRM_PRODUCTS.has(p))) t.add("crm");
  const s = text(item);
  const url = item.url ?? "";
  if (item.products.includes("AI/Copilot/Agents") && item.products.length <= 3) t.add("ai");
  if (/\b(ai|copilot|agent)/.test(s) || /\/(copilot|ai-)/.test(url)) t.add("ai");
  if (/partner(val|urval)|välj(er)? (rätt )?.*partner|val av partner/.test(s) || url.includes("valjdynamics365partner")) t.add("partnerval");
  if (/förvalt|uppgrader|vidareutveckl|befintlig|byta|byte/.test(s)) t.add("forvaltning");
  if (/tillägg|isv/.test(s) || url.includes("tillagg")) t.add("tillagg");
  if (item.type === "branscher") t.add("bransch");
  return [...t];
}

export function entriesFor(item: KnowledgeItemLike): KnowledgeEntryId[] {
  const e = new Set<KnowledgeEntryId>(EDITORIAL[item.id] ?? []);
  const s = text(item);
  const topics = topicsFor(item);
  if (item.type === "behovsanalys") e.add("behov");
  if (item.type === "kravspecifikation") e.add("planera");
  if (item.type === "branscher") e.add("jamfor");
  if (item.type === "intervju") e.add("partner");
  if (topics.includes("partnerval")) e.add("partner");
  if (topics.includes("tillagg")) e.add("jamfor");
  if (topics.includes("ai") && item.type === "artikel") e.add("jamfor");
  if (topics.includes("forvaltning")) e.add("behov");
  if (/jämför| vs |jämförelse|skillnad/.test(s)) e.add("jamfor");
  if (/kravspec|upphandl|budget|kostnad|införande|projektplan|tidplan/.test(s)) e.add("planera");
  if (/behov|varför|när (vet|passar)|signal/.test(s)) e.add("behov");
  return [...e];
}

export function situationsFor(item: KnowledgeItemLike): KnowledgeSituation[] {
  const sit = new Set<KnowledgeSituation>();
  const entries = entriesFor(item);
  const topics = topicsFor(item);
  if (entries.includes("behov") || entries.includes("jamfor")) sit.add("utvarderar_ny");
  if (entries.includes("planera")) sit.add("planerar_inforande");
  if (entries.includes("partner")) sit.add("partner_kompetens");
  if (topics.includes("forvaltning")) { sit.add("befintlig_kund"); sit.add("utveckla"); }
  if (topics.includes("tillagg") || topics.includes("ai")) sit.add("utveckla");
  return [...sit];
}

export function matchesSearch(item: KnowledgeItemLike, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = `${text(item)} ${item.products.join(" ")}`;
  return q.split(/\s+/).every((w) => hay.includes(w));
}

export interface Recommendation<T> { item: T; related: boolean }

/**
 * Rekommenderat innehåll för en ingång: redaktionellt kopplade verktyg först, därefter
 * nyast. Med färre än `min` träffar fylls listan på från den närliggande ingången,
 * markerat som närliggande, så att inget påhittat innehåll visas.
 */
export function recommendFor<T extends KnowledgeItemLike & { date?: string | null }>(
  items: T[],
  entryId: KnowledgeEntryId,
  max = 6,
  min = 3,
): Recommendation<T>[] {
  const byPriority = (list: T[]) =>
    [...list].sort((a, b) => {
      const ea = EDITORIAL[a.id]?.[0] === entryId ? 0 : 1;
      const eb = EDITORIAL[b.id]?.[0] === entryId ? 0 : 1;
      if (ea !== eb) return ea - eb;
      return (b.date ?? "").localeCompare(a.date ?? "");
    });
  const primary = byPriority(items.filter((i) => entriesFor(i).includes(entryId))).slice(0, max);
  const out: Recommendation<T>[] = primary.map((item) => ({ item, related: false }));
  if (out.length < min) {
    const entry = KNOWLEDGE_ENTRIES.find((e) => e.id === entryId)!;
    const seen = new Set(out.map((r) => r.item.id));
    const extra = byPriority(items.filter((i) => !seen.has(i.id) && entriesFor(i).includes(entry.related)));
    for (const item of extra) {
      if (out.length >= Math.max(min, Math.min(max, 4))) break;
      out.push({ item, related: true });
    }
  }
  return out;
}

export function isKnowledgeEntryId(v: string | null | undefined): v is KnowledgeEntryId {
  return !!v && KNOWLEDGE_ENTRIES.some((e) => e.id === v);
}
