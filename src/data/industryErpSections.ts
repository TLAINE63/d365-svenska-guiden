/**
 * Redaktionella affärssystemsavsnitt per bransch (manuellt underhållna, aldrig genererade).
 * Visas på /branscher/:slug/ när sluggen finns här.
 */
/** Fördjupande H2-avsnitt som visas efter huvudavsnittet på branschsidan. */
export interface IndustryErpSubSection {
  id: string;
  h2: string;
  paragraphs: string[];
  links?: { text: string; to: string }[];
}

export interface IndustryErpSection {
  heading: string;
  intro: string;
  points: { title: string; text: string }[];
  packagesNote: string;
  packagesLink: { text: string; to: string };
  /** Extra internlänkar under paketnoten. */
  extraLinks?: { text: string; to: string }[];
  cta: { text: string; to: string };
  /** Egna H2-avsnitt under huvudavsnittet. */
  subSections?: IndustryErpSubSection[];
}

export const INDUSTRY_ERP_SECTIONS: Record<string, IndustryErpSection> = {
  "bygg-entreprenad": {
    heading: "Affärssystem för byggföretag, entreprenad och anläggning",
    intro:
      "Ett verksamhetssystem för entreprenad behöver samla kalkyl, projekt, inköp, personal och ekonomi. För små och medelstora bygg-, entreprenad- och installationsföretag är Business Central med ett branschpaket ofta det naturliga spåret. Det gäller även system för anläggningsföretag och för serviceföretag inom bygg och installation med serviceavtal och arbetsorder, där projektrapportering för entreprenörer behöver fungera ute på arbetsplatsen. Större entreprenadkoncerner med många bolag jämför även med Finance & Supply Chain Management, ibland tillsammans med Project Operations.",
    marketStandard:
      "För svenska bygg-, entreprenad- och installationsföretag har kombinationen Microsoft Dynamics 365 Business Central och branschpaketet 4PS Construct blivit ett av de mest använda spåren, och beskrivs ofta som standardvalet i branschen. Business Central ger redovisning, lager, ekonomi och projekt, och 4PS Construct lägger på de byggspecifika delarna: kalkyl, mängdberäkning, ÄTA-arbeten, resurs- och maskinplanering, service och KMA. Kombinationen är alltså inte två parallella system utan ett affärssystem med ett branschpaket ovanpå, vilket brukar innebära färre gränssnitt och samma huvudbok för projekt och ekonomi.",
    points: [
      {
        title: "Projektredovisning och successiv vinstavräkning",
        text: "Budget, prognos, kostnader och intäkter samlas per projekt. Successiv vinstavräkning, där resultatet redovisas i takt med färdigställandegraden, hanteras i projektmodulen eller i branschpaketet.",
      },
      {
        title: "Service och underhåll",
        text: "Serviceföretag inom bygg och installation behöver serviceavtal, arbetsorder, felanmälan och mobil rapportering för tekniker, kopplat till samma ekonomi som projekten.",
      },
      {
        title: "ÄTA-arbeten",
        text: "Ändrings- och tilläggsarbeten registreras, prissätts och faktureras mot ursprungsavtalet så att avvikelser syns i projektets resultat.",
      },
      {
        title: "KMA",
        text: "Dokumentation för kvalitet, miljö och arbetsmiljö hanteras oftast i branschpaketet eller i ett kopplat KMA-system, inte i standardversionen av Business Central.",
      },
      {
        title: "Resursplanering",
        text: "Personal, maskiner och underentreprenörer planeras mot projekt och arbetsorder, med tidrapportering som går direkt till projektets kostnader.",
      },
    ],
    packagesNote:
      "Vanliga branschpaket för Business Central är bland annat 4PS Construct, som täcker projekt, service, maskiner, inköp och planering för bygg och installation. Ett branschpaket kortar ofta införandet men styr också en del av lösningens riktning.",
    packagesLink: { text: "Se branschpaket för Business Central", to: "/business-central/tillagg/branschlosningar/" },
    extraLinks: [
      { text: "4PS Construct från 4PS Sweden", to: "/partner/4ps-sweden/" },
      { text: "Projektredovisning och successiv vinstavräkning i Project Operations", to: "/d365projectoperations/" },
    ],
    cta: {
      text: "Jämför partners med specialistkompetens inom bygg och entreprenad",
      to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners",
    },
  },
};
