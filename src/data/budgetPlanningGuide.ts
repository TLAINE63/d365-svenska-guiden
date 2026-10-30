/**
 * Guiden "Budget, prognos och säljplanering i Dynamics 365".
 * Uppdrag från Thomas Laine 2026-10-30. Copy följer sajtens regler:
 * inga obestyrkta påståenden ("certifierad", "ledande", prisbelopp utan källa),
 * och varje omnämnande av Aimplan eller fpaa.se redovisar ägarintresset.
 */
import type { GuideSource } from "@/lib/guideSources";

export const BUDGET_GUIDE_PATH = "/guider/budget-prognos-planering-dynamics-365/";

export const BUDGET_GUIDE_SEO = {
  title: "Budget, prognos och säljplanering i Dynamics 365 | d365.se",
  description:
    "Komplett guide för modern budgetering, rullande prognoser och säljplanering i Business Central, F&SCM och Dynamics 365 Sales med Power BI och Fabric.",
};

export const BUDGET_GUIDE_H1 =
  "Budget, prognos och planering i Microsoft Dynamics 365: Från Excel till Power BI & Fabric";

export const BUDGET_GUIDE_INTRO =
  "Budget i ett separat kalkylark, prognoser som uppdateras en gång i kvartalet och säljsiffror som bara finns i CRM räcker sällan längre. Organisationer som styr löpande behöver rullande 12-månadersprognoser, möjlighet att simulera scenarier och en obruten kedja mellan säljaktiviteter i CRM, utfall i affärssystemet och koncernens strategiska planering.";

export const BUDGET_GUIDE_SHORT_ANSWER =
  "Budgetfunktionerna i Business Central, Finance & Supply Chain Management och Dynamics 365 Sales täcker grunderna, men de lever ofta i varsin silo. Många samlar därför utfall och pipeline i Power BI och Microsoft Fabric och lägger till en write-back-lösning, så att budget, prognos och scenarier kan matas in och följas upp i samma rapporter. Vilken lösning och partner som passar styrs av hur många bolag, versioner och planeringsdrivare ni behöver hantera.";

export interface BudgetSystemBlock {
  key: "bc" | "fscm" | "sales";
  label: string;
  title: string;
  challengeTitle: string;
  challenges: string[];
  approachTitle: string;
  approach: string[];
  link: { label: string; to: string };
}

export const BUDGET_SYSTEMS: BudgetSystemBlock[] = [
  {
    key: "bc",
    label: "Affärssystem (ERP)",
    title: "Business Central: från budgetmatriser till modern FP&A",
    challengeTitle: "Begränsningarna i standardbudgeten",
    challenges: [
      "Budgeten läggs per konto och dimension i en matris. Versioner, godkännanden och jämförelser mellan scenarier kräver manuellt arbete.",
      "Drivarbaserade modeller, till exempel intäkt som pris gånger volym eller kostnad per anställd, går inte att bygga i standardbudgeten.",
      "Personalbudget med löner, sociala avgifter och anställningsdatum hanteras oftast i Excel vid sidan av.",
      "En rullande prognos innebär att budgeten kopieras och justeras för hand varje period.",
    ],
    approachTitle: "Så gör växande bolag",
    approach: [
      "Utfallet hämtas från Business Central till Power BI, där Microsoft också erbjuder färdiga Power BI-appar för ekonomi.",
      "Budget och rullande prognos byggs som planeringsmodeller ovanpå samma data, i stället för som specialanpassningar i affärssystemet.",
      "Business Central hålls nära standard och blir enklare att uppdatera, eftersom planeringslogiken inte ligger i egen kod.",
    ],
    link: { label: "Läs mer om Business Central", to: "/businesscentral/" },
  },
  {
    key: "fscm",
    label: "Affärssystem (ERP)",
    title: "Finance & Supply Chain Management: koncernplanering utan separat EPM-plattform",
    challengeTitle: "Utmaningen i större koncerner",
    challenges: [
      "Många juridiska enheter, valutor och elimineringar, och ett behov av att planera CAPEX och OPEX var för sig.",
      "Internprissättning och koncerninterna flöden påverkar både resultat- och kassaflödesprognosen.",
      "Produktions-, lager- och inköpsplaneringen behöver hänga ihop med den finansiella planen.",
      "Modulen för budgetplanering i Finance bygger på arbetsflöden och Excel-mallar. Det fungerar för årsbudgeten men blir tungt för rullande prognoser och scenarier.",
    ],
    approachTitle: "Alternativet till en separat EPM-plattform",
    approach: [
      "Många koncerner utvärderar separata EPM-plattformar som OneStream, CCH Tagetik eller Anaplan. De kräver ofta ett eget licens-, integrations- och implementeringsprojekt vid sidan av affärssystemet.",
      "Alternativet är att bygga planeringsmodellerna direkt ovanpå Microsoft Fabric och Power BI, där data från Finance & Supply Chain Management redan samlas, med integrerad write-back för inmatning.",
      "Då återanvänds den dataplattform, de behörigheter och de rapporter som koncernen redan har.",
    ],
    link: { label: "Läs mer om Finance & Supply Chain Management", to: "/finance-supply-chain/" },
  },
  {
    key: "sales",
    label: "CRM",
    title: "Dynamics 365 Sales: säljprognoser som hänger ihop med ekonomin",
    challengeTitle: "Säljteamets dilemma",
    challenges: [
      "Säljprognoser och kvoter stannar ofta i CRM eller i säljchefens egna kalkylblad.",
      "Ekonomiavdelningen gör en egen intäktsprognos, och de två siffrorna stäms av manuellt, om de stäms av alls.",
      "Skillnaden mellan viktad pipeline och bokförd intäkt syns först när kvartalet är slut.",
    ],
    approachTitle: "Fördelen med integrerad säljplanering",
    approach: [
      "Dynamics 365 Sales har inbyggda prognoser med hierarkier, kvoter och justeringar per säljare och team.",
      "När pipelinestatus och viktade prognoser läses in i samma Power BI-modell som utfallet från affärssystemet uppdateras intäkts- och kassaflödesprognosen direkt från säljteamets senaste bedömning.",
      "Ekonomi och sälj arbetar då i samma rapport i stället för att jämföra två kalkylblad.",
    ],
    link: { label: "Läs mer om Dynamics 365 Sales", to: "/d365sales/" },
  },
];

export const BUDGET_ARCHITECTURE_STEPS = [
  {
    title: "Källsystem",
    text: "Business Central, Finance & Supply Chain Management och Dynamics 365 Sales levererar utfall, register och pipeline.",
  },
  {
    title: "Microsoft Fabric",
    text: "Data från flera system och bolag samlas och modelleras i en gemensam dataplattform.",
  },
  {
    title: "Power BI med write-back",
    text: "Rapporterna blir planeringsytor där budget, prognos, kommentarer och scenarier matas in och följs upp.",
  },
];

export const BUDGET_ARCHITECTURE_TEXT = [
  "Power BI har historiskt varit ett verktyg för att läsa och analysera data. Siffror kunde visas, filtreras och jämföras, men inte matas in. Därför har budget och prognos ofta legat kvar i Excel, även när rapporteringen flyttat till Power BI.",
  "Write-back betyder att användaren skriver in värden direkt i rapporten, till exempel en prognos per konto, kostnadsställe eller kund, och att värdena sparas och blir en del av datamodellen. Microsoft har börjat bygga in enklare skrivmöjligheter i Power BI genom så kallade translytical task flows. För fullständiga planeringsmodeller med versioner, fördelningar, kommentarer och revisionsspår används ett planeringstillägg.",
];

export const AIMPLAN_TEXT =
  "Aimplan är ett svenskt tillägg som ger Power BI och Microsoft Fabric skrivbarhet: inmatning av budget och prognos, rullande prognosmodeller, scenarier, kommentarer och revisionsspårning direkt i rapporterna. Planeringen sker i samma miljö som uppföljningen, så användarna behöver inte växla mellan system. Implementeringen görs normalt av en Microsoft-partner som kan både affärssystemet och Power BI.";

/** Måste visas där Aimplan eller fpaa.se nämns (intressekonflikt, MFL). */
export const AIMPLAN_DISCLOSURE =
  "Moveahead AB, som driver d365.se, har ägarintresse i Aimplan. fpaa.se ges ut av Cloud Ahead AB tillsammans med Powerbridge, som distribuerar Aimplan i Norden.";

export const OWNERSHIP_PATH = "/agande-och-intressen/";

export const BUDGET_FUTURE_PROOF = [
  "Data, semantiska modeller och rapporter kan ligga kvar i organisationens befintliga Microsoft-tenant.",
  "Behörigheter styrs med samma struktur som i Power BI och Fabric, i stället för i ett separat system.",
  "Affärssystemet hålls nära standard, vilket förenklar Microsofts uppdateringar.",
  "Kontrollera ändå för varje lösning var inmatade värden lagras och hur revisionsspåret fungerar.",
];

export const BUDGET_REQUIREMENTS = [
  "Hur många bolag, valutor och versioner ska planeras samtidigt?",
  "Vilka drivare styr planen: volym, pris, personal, projekt eller kapacitet?",
  "Ska säljprognosen i CRM uppdatera ekonomins intäkts- och kassaflödesprognos?",
  "Var lagras inmatade värden, och vem får ändra vad?",
  "Krävs revisionsspår och godkännanden per version?",
  "Vem förvaltar modellerna efter driftstart: ni själva, partnern eller leverantören?",
];

export const BUDGET_CTA_BUYERS = {
  eyebrow: "För företag och beslutsfattare (CFO, CIO, säljchef)",
  heading: "Behöver ni rådgivning eller implementeringsstöd?",
  text: "Att sätta upp en automatiserad prognosmodell i Power BI och Dynamics 365 kräver både affärsförståelse och teknisk spetskompetens. Hitta Microsoft-partners som är specialiserade på just ert affärssystem och er BI-arkitektur.",
  button: { label: "Hitta rätt Dynamics 365-partner", to: "/valjdynamics365partner/" },
  secondary: { label: "Läs mer om metodik för FP&A på fpaa.se", href: "https://fpaa.se" },
};

export const BUDGET_CTA_PARTNERS = {
  eyebrow: "För Microsoft-partners och konsultbolag",
  heading: "Är du Microsoft-partner och vill erbjuda rullande prognoser till era kunder?",
  text: "Addera färdiga planerings- och budgetmodeller i Power BI till era kundprojekt utan att bygga om kundens affärssystem. Utforska hur Aimplan integreras i er leverans.",
  button: { label: "Se lösningen för partners och boka demo", href: "https://fpaa.se/ekosystem/bli-partner/" },
};

export const BUDGET_RELATED = [
  { label: "Rapportering, budget och FP&A för Business Central", to: "/business-central/tillagg/rapportering-fpa/" },
  { label: "Jet Reports, Solver och Aimplan jämförda", to: "/compare/jet-vs-solver-vs-aimplan/" },
  { label: "Försäljningsprognoser och kvothantering i Dynamics 365 Sales", to: "/kunskapscenter/d365sales/forsaljningsprognoser-och-kvothantering/" },
  { label: "Välja Business Central-partner", to: "/guider/valja-business-central-partner/" },
  { label: "Välja Finance & Supply Chain-partner", to: "/guider/valja-finance-supply-chain-partner/" },
  { label: "Välja Dynamics 365 Sales-partner", to: "/guider/valja-dynamics-365-sales-partner/" },
];

export const BUDGET_FAQ = [
  {
    q: "Räcker standardbudgeten i Business Central?",
    a: "För en årsbudget per konto och dimension räcker den ofta. Behöver ni rullande prognoser, flera versioner, personalbudget eller drivarbaserade modeller brukar planeringen flyttas till Power BI med ett planeringstillägg.",
  },
  {
    q: "Vad betyder write-back i Power BI?",
    a: "Att användare kan mata in värden, till exempel budget eller prognos, direkt i en Power BI-rapport, och att värdena sparas och kan följas upp mot utfallet i samma modell.",
  },
  {
    q: "Behöver vi Microsoft Fabric för att planera i Power BI?",
    a: "Det beror på lösningen och på hur mycket data ni ska samla. Fabric blir mer relevant när data från flera system, bolag eller länder ska samlas i en gemensam modell. Fråga leverantören vilka krav lösningen ställer på er dataplattform.",
  },
  {
    q: "Kan säljprognosen i Dynamics 365 Sales uppdatera ekonomins prognos?",
    a: "Ja, om pipeline och viktade prognoser läses in i samma datamodell som utfallet från affärssystemet. Det kräver gemensamma definitioner, till exempel när en affär räknas som intäkt och hur sannolikheten viktas.",
  },
  {
    q: "Vem implementerar en planeringslösning?",
    a: "Oftast en partner med kompetens inom både affärssystemet och Power BI, ibland tillsammans med leverantören av planeringstillägget. Fråga vem som bygger modellerna och vem som förvaltar dem efter driftstart.",
  },
];

/** Bara källor som har kontrollerats 2026-10-30; inga källdatum anges eftersom inga bekräftats. */
export const BUDGET_SOURCES: GuideSource[] = [
  { name: "Microsoft Learn: Create G/L budgets (Business Central)", href: "https://learn.microsoft.com/en-us/dynamics365/business-central/finance-how-create-budgets", supports: "Hur redovisningsbudgetar per konto och dimension fungerar i Business Central." },
  { name: "Microsoft Learn: Finance Power BI app (Business Central)", href: "https://learn.microsoft.com/en-us/dynamics365/business-central/finance-powerbi-app", supports: "Microsofts färdiga Power BI-app för ekonomisk uppföljning i Business Central." },
  { name: "Microsoft Learn: Budget planning overview (Finance)", href: "https://learn.microsoft.com/en-us/dynamics365/finance/budgeting/budget-planning-overview-configuration", supports: "Budgetplanering i Finance med arbetsflöden och Excel-mallar." },
  { name: "Microsoft Learn: Configure forecasts (Dynamics 365 Sales)", href: "https://learn.microsoft.com/en-us/dynamics365/sales/configure-forecast", supports: "Inbyggda säljprognoser med hierarkier, kvoter och justeringar." },
  { name: "Microsoft Learn: Translytical task flows (Power BI)", href: "https://learn.microsoft.com/en-us/power-bi/create-reports/translytical-task-flow-overview", supports: "Microsofts inbyggda möjlighet att skriva tillbaka data från Power BI-rapporter." },
  { name: "Aimplan: produktbeskrivning", href: "https://www.aimplan.com/", supports: "Leverantörens egen beskrivning av planering, prognos och rapportering i Power BI och Fabric. Moveahead AB, som driver d365.se, har ägarintresse i Aimplan." },
];
