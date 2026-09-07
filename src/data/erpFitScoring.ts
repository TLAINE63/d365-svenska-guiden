// Poängmodell för ERP-rekommendation (Business Central vs Finance & Supply Chain Management).
// Ersätter den tidigare rena storleks-/geografilogiken med fler beslutsdrivare och
// en branschspecifik komplexitetsfråga per bransch.
//
// Positiva poäng talar för Finance & SCM, negativa för Business Central.

export interface FitOption {
  v: string;
  l: string;
  /** Poäng: positivt = talar för F&SCM, negativt = talar för Business Central. */
  p: number;
  /** Kort motivering som visas i drivarlistan när alternativet är valt. */
  why: string;
}

export interface FitQuestion {
  key: string;
  label: string;
  help?: string;
  options: FitOption[];
}

/** Frågor som ställs oavsett bransch. */
export const COMMON_QUESTIONS: FitQuestion[] = [
  {
    key: "vol",
    label: "Transaktionsvolym per månad",
    help: "Order-, faktura- och lagerrader tillsammans – det som faktiskt belastar systemet",
    options: [
      { v: "low", l: "Under 2 000", p: -2, why: "Låg transaktionsvolym utnyttjar inte F&SCM:s kapacitet och gör Business Central mer kostnadseffektivt." },
      { v: "mid", l: "2 000–20 000", p: 1, why: "Medelhög volym fungerar i båda systemen, men ställer krav på genomtänkt datamodell och uppföljning." },
      { v: "high", l: "Över 20 000", p: 4, why: "Hög transaktionsvolym är en av de tydligaste tekniska drivarna mot Finance & SCM." },
    ],
  },
  {
    key: "reg",
    label: "Regelverk och spårbarhetskrav",
    options: [
      { v: "basic", l: "Vanlig bokförings- och momsredovisning", p: -1, why: "Utan särskilda regelkrav räcker standardfunktionerna i Business Central." },
      { v: "sector", l: "Branschkrav och certifieringar", p: 2, why: "Branschcertifieringar och spårbarhetskrav ökar behovet av inbyggd kvalitets- och avvikelsehantering." },
      { v: "strict", l: "Strikt reglerad verksamhet (t.ex. läkemedel, kemi, exportkontroll)", p: 4, why: "Strikt reglerad verksamhet med validering och exportkontroll är Finance & SCM:s hemmaplan." },
    ],
  },
  {
    key: "int",
    label: "Integrationer mot andra system",
    help: "Antal system som måste utbyta data löpande, t.ex. e-handel, lager, lön, bank, kundsystem",
    options: [
      { v: "few", l: "0–3 system", p: -1, why: "Få integrationer gör förvaltningen enkel och håller nere totalkostnaden." },
      { v: "some", l: "4–10 system", p: 1, why: "Ett medelstort integrationslandskap kräver en tydlig integrationsstrategi oavsett systemval." },
      { v: "many", l: "Fler än 10 verksamhetskritiska", p: 3, why: "Många kritiska integrationer talar för Finance & SCM:s bredare plattformsstöd och driftsmodell." },
    ],
  },
  {
    key: "team",
    label: "Egna resurser för system och förvaltning",
    options: [
      { v: "none", l: "Ingen dedikerad resurs", p: -3, why: "Utan egen systemförvaltning blir Business Central betydligt lättare att äga över tid." },
      { v: "some", l: "Någon eller några nyckelpersoner", p: 0, why: "Ett par nyckelpersoner räcker för Business Central och kan bära Finance & SCM med stark partner." },
      { v: "team", l: "Egen system-/ERP-organisation", p: 3, why: "En egen ERP-organisation gör det realistiskt att förvalta Finance & SCM:s bredd." },
    ],
  },
  {
    key: "time",
    label: "Tidplan och projektambition",
    options: [
      { v: "fast", l: "Igång inom 6 månader", p: -3, why: "En kort tidplan är svår att förena med ett Finance & SCM-program." },
      { v: "normal", l: "6–12 månader", p: 0, why: "En normal tidplan rymmer Business Central och en avgränsad Finance & SCM-införing." },
      { v: "program", l: "Transformationsprogram, 12+ månader", p: 2, why: "Ett längre transformationsprogram ger utrymme för Finance & SCM:s införandemodell." },
    ],
  },
];

/** Branschspecifik komplexitetsfråga – den viktigaste enskilda drivaren per bransch. */
export const SECTOR_QUESTIONS: Record<string, FitQuestion> = {
  dis: {
    key: "sec_dis",
    label: "Produktionens komplexitet",
    options: [
      { v: "a", l: "Montering och enkla strukturer", p: -3, why: "Enkla produktstrukturer täcks väl av produktionsordrar och MRP i Business Central." },
      { v: "b", l: "Flera BOM-nivåer, varianter och legotillverkning", p: 1, why: "Flernivåstrukturer och legoflöden fungerar i Business Central med tillägg, men börjar tänja på standarden." },
      { v: "c", l: "Konfigurerbara produkter, finkapacitetsplanering eller flera fabriker", p: 5, why: "Produktkonfigurator, finkapacitetsplanering och multi-site produktion är inbyggt i Finance & SCM." },
    ],
  },
  pro: {
    key: "sec_pro",
    label: "Recept- och batchkomplexitet",
    options: [
      { v: "a", l: "Enkla, standardiserade satser", p: -2, why: "Standardiserade satser med partispårning hanteras av Business Central och etablerade tillägg." },
      { v: "b", l: "Recepthantering med utbyte och kvalitetskontroll", p: 2, why: "Recept, utbyte och kvalitetskontroll kräver antingen ett starkt tillägg eller Finance & SCM." },
      { v: "c", l: "Samprodukter, biprodukter och validerade processer", p: 5, why: "Sam-/biprodukter och validerade processer med full kvalitetsledning är standard i Finance & SCM." },
    ],
  },
  ret: {
    key: "sec_ret",
    label: "Kanaler och lagerupplägg",
    options: [
      { v: "a", l: "Butiker och/eller e-handel med ett lager", p: -3, why: "Ett lager och tydliga kanaler passar Business Central med kassa- och e-handelsappar." },
      { v: "b", l: "Flera kanaler och lager med retur- och prisstyrning", p: 1, why: "Flera kanaler och lager kräver mer struktur men ryms i Business Central med rätt tillägg." },
      { v: "c", l: "Centrallager med automation och avancerad prognos", p: 5, why: "Automatiserade distributionscenter och prognosstyrning är där Finance & SCM:s lagermotor lönar sig." },
    ],
  },
  gro: {
    key: "sec_gro",
    label: "Lager- och distributionsflöden",
    options: [
      { v: "a", l: "Ett lager, enkel plockning", p: -3, why: "Ett lager med enkel plockning behöver inte Finance & SCM:s lagermotor." },
      { v: "b", l: "Flera lager, EDI och kundunika priser", p: 1, why: "Flera lager, EDI och kundunika villkor hanteras av Business Central med etablerade tillägg." },
      { v: "c", l: "Distributionscenter med vågplock och automation", p: 5, why: "Vågplock och lagerautomation i distributionscenter är inbyggt i Finance & SCM." },
    ],
  },
  ftj: {
    key: "sec_ftj",
    label: "Projekt- och resursmodell",
    options: [
      { v: "a", l: "Löpande räkning och enklare fastprisuppdrag", p: -3, why: "Tid, projekt och fakturering av den här typen täcks av Business Central." },
      { v: "b", l: "Blandade avtalsformer med beläggningsstyrning", p: 1, why: "Blandade avtalsformer och beläggningsstyrning kräver en genomtänkt projektmodell." },
      { v: "c", l: "Global resurspool, intäktsavräkning och internprissättning", p: 4, why: "Global resursallokering och intäktsavräkning är där Project Operations och Finance & SCM tar över." },
    ],
  },
  it: {
    key: "sec_it",
    label: "Intäktsmodell",
    options: [
      { v: "a", l: "Projekt och löpande konsultintäkter", p: -3, why: "Projektintäkter och tid hanteras väl i Business Central." },
      { v: "b", l: "Abonnemang och återkommande intäkter", p: 1, why: "Abonnemangsintäkter kräver periodisering och avtalsstruktur men ryms i båda systemen." },
      { v: "c", l: "Komplex intäktsavräkning över flera bolag och länder", p: 4, why: "Intäktsavräkning över bolagsgränser är en tydlig Finance & SCM-styrka." },
    ],
  },
  fin: {
    key: "sec_fin",
    label: "Ekonomi- och koncernkrav",
    options: [
      { v: "a", l: "Standardredovisning i ett fåtal bolag", p: -3, why: "Standardredovisning i ett fåtal bolag är Business Centrals kärna." },
      { v: "b", l: "Flera bolag med intern rapportering och budget", p: 2, why: "Flerbolagsrapportering och budgetprocess kräver bra rapportverktyg oavsett systemval." },
      { v: "c", l: "Koncernkonsolidering, elimineringar och regelrapportering", p: 5, why: "Konsolidering, elimineringar och regelrapportering är inbyggt i Finance & SCM." },
    ],
  },
  hot: {
    key: "sec_hot",
    label: "Enheter och driftsupplägg",
    options: [
      { v: "a", l: "Enstaka enheter med kassa och inköp", p: -4, why: "Enstaka enheter med kassa och inköp är tydligt Business Central-terräng." },
      { v: "b", l: "Kedja med central inköps- och menystyrning", p: 0, why: "Central inköps- och menystyrning i en kedja hanteras med branschappar på Business Central." },
      { v: "c", l: "Stor kedja med central produktion och distribution", p: 3, why: "Central produktion och distribution i stor skala börjar motivera Finance & SCM." },
    ],
  },
  byg: {
    key: "sec_byg",
    label: "Projekt- och entreprenadupplägg",
    options: [
      { v: "a", l: "Egna projekt med kalkyl och ÄTA", p: -4, why: "Kalkyl, ÄTA och projektredovisning löses med byggappar på Business Central." },
      { v: "b", l: "Många projektbolag och samverkansentreprenader", p: -1, why: "Många projektbolag ökar redovisningskraven, men entreprenadfunktionerna kommer från branschappar oavsett system." },
      { v: "c", l: "Stor koncern med maskinparker, industriell produktion och konsolidering", p: 3, why: "Egen industriell produktion och tung konsolidering är det som kan motivera Finance & SCM i byggsektorn." },
    ],
  },
  tra: {
    key: "sec_tra",
    label: "Transport- och terminalupplägg",
    options: [
      { v: "a", l: "Åkeri eller spedition med fakturering och inköp", p: -3, why: "Ekonomi och fakturering i åkeri/spedition hanteras av Business Central plus ett transportsystem." },
      { v: "b", l: "Flera terminaler och tredjepartslogistik", p: 1, why: "Terminaler och 3PL-uppdrag kräver lager- och transportstöd som finns i båda spåren." },
      { v: "c", l: "Global logistik med tull, exportkontroll och lagerautomation", p: 5, why: "Tull, exportkontroll och lagerautomation i global skala är Finance & SCM:s domän." },
    ],
  },
};

/** Baspoäng från storlek, geografi och antal juridiska bolag. */
export const BASE_POINTS = {
  size: { smb: -2, ent: 4 } as Record<string, number>,
  geo: { loc: -1, int: 2 } as Record<string, number>,
  le: { "1": -1, "2-5": 1, "6-15": 3, "16+": 5 } as Record<string, number>,
};

export const BASE_WHY = {
  size: { smb: "Under 300 anställda är totalkostnaden ofta det som avgör – Business Central väger tyngre.", ent: "Över 300 anställda ökar kraven på processtyrning, roller och skalbarhet." },
  geo: { loc: "Verksamhet på en marknad minskar behovet av bred lokalisering.", int: "Internationell verksamhet ställer krav på lokalisering, valuta och koncernflöden." },
  le: {
    "1": "Ett bolag innebär ingen koncernkomplexitet.",
    "2-5": "Några bolag ger intercompany-flöden som båda systemen klarar.",
    "6-15": "6–15 bolag innebär omfattande intercompany och konsolidering.",
    "16+": "16+ bolag kräver avancerad konsolidering, elimineringar och internprissättning.",
  },
} as Record<string, Record<string, string>>;

export interface FitDriver {
  label: string;
  choice: string;
  points: number;
  why: string;
}

export interface FitResult {
  score: number;
  rec: "bc" | "fscm" | "both";
  drivers: FitDriver[];
  /** 0–100, hur långt åt F&SCM-hållet svaren pekar. */
  tilt: number;
}

const MIN_SCORE = -20;
const MAX_SCORE = 26;

/** Räknar ut rekommendation utifrån samtliga svar. */
export function scoreFit(input: {
  sec: string;
  sz: string;
  geo: string;
  le: string;
  answers: Record<string, string>;
}): FitResult {
  const drivers: FitDriver[] = [];
  const push = (label: string, choice: string, points: number, why: string) =>
    drivers.push({ label, choice, points, why });

  const sizeLabel = input.sz === "ent" ? "Corporate / Enterprise (300+ anst.)" : "Mindre/medelstora (25–300 anst.)";
  push("Företagsstorlek", sizeLabel, BASE_POINTS.size[input.sz] ?? 0, BASE_WHY.size[input.sz] ?? "");
  const geoLabel = input.geo === "int" ? "Internationellt verksamma" : "Lokalt verksamma";
  push("Geografisk räckvidd", geoLabel, BASE_POINTS.geo[input.geo] ?? 0, BASE_WHY.geo[input.geo] ?? "");
  const leLabel = input.le === "1" ? "1 bolag" : input.le === "16+" ? "16+ bolag" : `${input.le.replace("-", "–")} bolag`;
  push("Juridiska bolag", leLabel, BASE_POINTS.le[input.le] ?? 0, BASE_WHY.le[input.le] ?? "");

  const questions = [...COMMON_QUESTIONS];
  const sectorQ = SECTOR_QUESTIONS[input.sec];
  if (sectorQ) questions.unshift(sectorQ);

  for (const q of questions) {
    const val = input.answers[q.key];
    const opt = q.options.find((o) => o.v === val);
    if (opt) push(q.label, opt.l, opt.p, opt.why);
  }

  const score = drivers.reduce((sum, d) => sum + d.points, 0);
  const rec: FitResult["rec"] = score <= 0 ? "bc" : score >= 8 ? "fscm" : "both";
  const tilt = Math.round(((Math.min(MAX_SCORE, Math.max(MIN_SCORE, score)) - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100);

  return { score, rec, drivers, tilt };
}

/** Standardsvar så att verktyget alltid ger ett resultat direkt. */
export function defaultAnswers(sec: string): Record<string, string> {
  const answers: Record<string, string> = {};
  for (const q of COMMON_QUESTIONS) answers[q.key] = q.options[Math.floor(q.options.length / 2)].v;
  const sectorQ = SECTOR_QUESTIONS[sec];
  if (sectorQ) answers[sectorQ.key] = sectorQ.options[0].v;
  return answers;
}
