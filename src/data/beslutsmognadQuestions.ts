export type Dimension =
  | "behovsbild"
  | "samsyn"
  | "riskinsikt"
  | "partnermarknad"
  | "beslutsstruktur";

export type Question =
  | {
      id: string;
      section: string;
      type: "single_select";
      text: string;
      options: { value: string; label: string }[];
    }
  | {
      id: string;
      section: string;
      type: "multi_select";
      text: string;
      hint?: string;
      options: { value: string; label: string }[];
    }
  | {
      id: string;
      section: string;
      type: "likert_5";
      text: string;
      anchor_low: string;
      anchor_high: string;
      dimension: Dimension;
    };

export const questions: Question[] = [
  // ───── SEKTION I: BAKGRUND ─────
  {
    id: "b1", section: "Bakgrund", type: "single_select",
    text: "Vilken bransch tillhör er verksamhet?",
    options: [
      { value: "tillverkning", label: "Tillverkning" },
      { value: "handel", label: "Handel & distribution" },
      { value: "tjanst", label: "Tjänsteföretag" },
      { value: "offentlig", label: "Offentlig sektor" },
      { value: "bygg", label: "Bygg & anläggning" },
      { value: "annan", label: "Annan" },
    ],
  },
  {
    id: "b2", section: "Bakgrund", type: "single_select",
    text: "Vilken är er ungefärliga årsomsättning?",
    options: [
      { value: "u100", label: "Under 100 MSEK" },
      { value: "100-500", label: "100–500 MSEK" },
      { value: "500-1000", label: "500 MSEK – 1 MdSEK" },
      { value: "1000-3000", label: "1–3 MdSEK" },
      { value: "3000-5000", label: "3–5 MdSEK" },
      { value: "o5000", label: "Över 5 MdSEK" },
    ],
  },
  {
    id: "b3", section: "Bakgrund", type: "single_select",
    text: "Vilken roll har du i beslutsprocessen?",
    options: [
      { value: "vd", label: "VD / Affärsledning" },
      { value: "cfo", label: "CFO / Ekonomichef" },
      { value: "cio", label: "CIO / IT-chef" },
      { value: "coo", label: "COO / Operations" },
      { value: "aff", label: "Affärsutveckling / Digitalisering" },
      { value: "annan", label: "Annan funktionschef" },
    ],
  },
  {
    id: "b4", section: "Bakgrund", type: "single_select",
    text: "Vilket ERP-system använder ni huvudsakligen idag?",
    options: [
      { value: "d365fo", label: "Dynamics 365 Finance & Operations" },
      { value: "d365bc", label: "Dynamics 365 Business Central" },
      { value: "dynax", label: "Dynamics AX (2009/2012/R3)" },
      { value: "dynnav", label: "Dynamics NAV (Navision)" },
      { value: "sap", label: "SAP" },
      { value: "infor", label: "Infor / M3" },
      { value: "ifs", label: "IFS" },
      { value: "oracle", label: "Oracle / NetSuite" },
      { value: "visma", label: "Visma, Fortnox, Monitor, Pyramid och Unit/4" },
      { value: "egen", label: "Egenutvecklat / föråldrat" },
      { value: "flera", label: "Flera parallellt" },
    ],
  },
  {
    id: "b5", section: "Bakgrund", type: "single_select",
    text: "Var i utvärderingsprocessen befinner ni er?",
    options: [
      { value: "borjat", label: "Vi har precis börjat diskutera ett byte" },
      { value: "analys", label: "Vi har gjort en första intern analys" },
      { value: "lev", label: "Vi har börjat titta på leverantörer" },
      { value: "rfp", label: "Vi har en aktiv RFP-process" },
      { value: "valt", label: "Vi har valt partner men inte signerat" },
      { value: "inget", label: "Inget aktivt skede ännu" },
    ],
  },

  // ───── SEKTION II: BEHOVSBILD ─────
  { id: "q1", section: "Behovsbild", type: "likert_5", dimension: "behovsbild",
    text: "Hur tydligt formulerade är de affärsproblem ni vill lösa med en ny ERP-lösning?",
    anchor_low: "Ingen dokumentation finns",
    anchor_high: "Dokumenterade, kvantifierade och prioriterade" },
  { id: "q2", section: "Behovsbild", type: "likert_5", dimension: "behovsbild",
    text: "Hur tydligt skiljer ni mellan absoluta krav och önskemål i kravbilden?",
    anchor_low: "Allt känns lika viktigt",
    anchor_high: "Tydlig prioritering med uttalade avvägningar" },
  { id: "q3", section: "Behovsbild", type: "likert_5", dimension: "behovsbild",
    text: "I vilken utsträckning utgår kraven från verksamhetens riktning, snarare än från det nuvarande systemets begränsningar?",
    anchor_low: "Vi listar saker vi saknar idag",
    anchor_high: "Kraven utgår från var verksamheten ska om 3–5 år" },
  { id: "q4", section: "Behovsbild", type: "likert_5", dimension: "behovsbild",
    text: "Hur realistisk är beslutsgruppens bild av vad ett ERP faktiskt kan — och inte kan — lösa?",
    anchor_low: "Stora förväntansgap finns",
    anchor_high: "Realistisk förståelse hos alla nyckelroller" },
  { id: "q4b", section: "Behovsbild", type: "likert_5", dimension: "behovsbild",
    text: "Hur tydligt har ni definierat hur ni ska mäta om investeringen blev lyckad?",
    anchor_low: "Inga framgångsmått definierade",
    anchor_high: "Mätbara framgångsmått fastställda i förväg" },

  // ───── SEKTION III: INTERN SAMSYN ─────
  { id: "q5", section: "Intern samsyn", type: "likert_5", dimension: "samsyn",
    text: "Hur samstämmiga är ekonomi, IT och verksamheten om projektets syfte?",
    anchor_low: "Olika bilder finns", anchor_high: "Dokumenterad, gemensam syn" },
  { id: "q6", section: "Intern samsyn", type: "likert_5", dimension: "samsyn",
    text: "Hur tydligt är ägarskapet för beslutet definierat?",
    anchor_low: "Otydligt vem som äger frågan", anchor_high: "Sponsor utsedd med tydligt mandat" },
  { id: "q7", section: "Intern samsyn", type: "likert_5", dimension: "samsyn",
    text: "Hur regelbundet möts beslutsgruppen specifikt för att diskutera den här frågan?",
    anchor_low: "Inga regelbundna forum", anchor_high: "Etablerat forum med dagordning" },
  { id: "q8", section: "Intern samsyn", type: "likert_5", dimension: "samsyn",
    text: "I vilken grad finns en gemensam förståelse av vad som händer om ni inte gör något?",
    anchor_low: "Ej diskuterat", anchor_high: "Tydligt formulerat och prioriterat" },

  // ───── SEKTION IV: RISKINSIKT ─────
  { id: "q9", section: "Riskinsikt", type: "likert_5", dimension: "riskinsikt",
    text: "Hur tydligt har ni identifierat de största riskerna med ett ERP-byte?",
    anchor_low: "Ej diskuterat", anchor_high: "Dokumenterad riskmatris" },
  { id: "q10", section: "Riskinsikt", type: "likert_5", dimension: "riskinsikt",
    text: "Hur stor del av dessa risker har en utpekad ägare med åtgärdsmandat?",
    anchor_low: "Ingen", anchor_high: "Alla risker har ägare" },
  { id: "q11", section: "Riskinsikt", type: "likert_5", dimension: "riskinsikt",
    text: "Hur balanserat behandlas organisatoriska risker — förändringsmotstånd, kompetensbrist, adoption — i förhållande till de tekniska?",
    anchor_low: "Endast tekniska risker diskuteras", anchor_high: "Båda balanseras i bedömningen" },
  { id: "q12", section: "Riskinsikt", type: "likert_5", dimension: "riskinsikt",
    text: "Hur planerar ni för det vanligaste — att scope växer och budget överskrids?",
    anchor_low: "Antas inte hända", anchor_high: "Buffrar och tröskelvärden definierade på förhand" },

  // ───── SEKTION V: PARTNERMARKNAD ─────
  { id: "q13", section: "Partnermarknad", type: "likert_5", dimension: "partnermarknad",
    text: "Hur god är er överblick över de partners som är aktiva inom Dynamics 365 i Sverige?",
    anchor_low: "Vi känner någon enstaka", anchor_high: "Strukturerad bild av marknaden" },
  { id: "q14", section: "Partnermarknad", type: "likert_5", dimension: "partnermarknad",
    text: "Hur väl förstår ni skillnaderna mellan olika typer av partners — storlek, branschfokus, leveransmodell, ägarstruktur?",
    anchor_low: "Vi ser inte skillnaderna", anchor_high: "Tydlig segmenteringsbild" },
  { id: "q15", section: "Partnermarknad", type: "likert_5", dimension: "partnermarknad",
    text: "Hur djupgående har er hittillsvarande utvärdering av partners varit?",
    anchor_low: "Säljmaterial och presentationer", anchor_high: "Referenser, metodikgenomgång, teamintervjuer" },
  { id: "q16", section: "Partnermarknad", type: "likert_5", dimension: "partnermarknad",
    text: "Hur väl känner ni till de vanligaste fallgroparna i större partnerleveranser av affärssystem?",
    anchor_low: "Vi vet inte vad vi inte vet", anchor_high: "Vi har en konkret lista att utvärdera mot" },

  // ───── SEKTION VI: BESLUTSSTRUKTUR ─────
  { id: "q17", section: "Beslutsstruktur", type: "likert_5", dimension: "beslutsstruktur",
    text: "Hur strukturerat är ert sätt att jämföra partners?",
    anchor_low: "Magkänsla och möten", anchor_high: "Formell metodik med viktade kriterier" },
  { id: "q18", section: "Beslutsstruktur", type: "likert_5", dimension: "beslutsstruktur",
    text: "Hur försvarbart skulle beslutsunderlaget vara om en extern part — styrelse, ägare, revisor — granskade det?",
    anchor_low: "Inte dokumenterat", anchor_high: "Fullständigt försvarbart vid granskning" },
  { id: "q19", section: "Beslutsstruktur", type: "likert_5", dimension: "beslutsstruktur",
    text: "Hur tydligt täcker er utvärdering tiden efter avtal — implementation och förvaltning — och inte bara själva valet?",
    anchor_low: "Vi fokuserar på signaturen", anchor_high: "Hela livscykeln vägs in" },
  { id: "q20", section: "Beslutsstruktur", type: "likert_5", dimension: "beslutsstruktur",
    text: "Hur tydligt är en beslutspunkt definierad — vem säger ja, när, baserat på vad?",
    anchor_low: "Obestämt", anchor_high: "Tydlig beslutsmilstolpe i planen" },
];

export const SECTION_ORDER = [
  "Bakgrund",
  "Behovsbild",
  "Intern samsyn",
  "Riskinsikt",
  "Partnermarknad",
  "Beslutsstruktur",
] as const;

export const SECTION_ROMAN: Record<string, string> = {
  Bakgrund: "I",
  Behovsbild: "II",
  "Intern samsyn": "III",
  Riskinsikt: "IV",
  Partnermarknad: "V",
  Beslutsstruktur: "VI",
};
