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
  /** Redogör för branschens faktiska standardval, visas under ingressen. */
  marketStandard?: string;
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
    subSections: [
      {
        id: "vinstavrakning",
        h2: "Stöd för successiv vinstavräkning och projektredovisning i byggbranschen",
        paragraphs: [
          "Successiv vinstavräkning innebär att intäkt och resultat redovisas i takt med att projektet blir klart, i stället för först vid slutfakturan. Underlaget är upparbetade kostnader, färdigställandegrad och aktuell prognos per projekt. Kravet brukar komma från att projekt behöver följas löpande och att bokslutet ska visa verklig marginal, inte bara fakturerade belopp.",
          "I Microsoft Dynamics 365 Business Central samlas budget, prognos, kostnader och intäkter per projekt. Branschpaketet ovanpå, till exempel 4PS Construct, lägger till det byggbranschen saknar i standardversionen: arbetsorder, tidrapportering ute från arbetsplatsen, underentreprenörsfakturor, ÄTA-arbeten och avräkning mot ursprungsavtalet. Då blir projektredovisningen en löpande uppföljning i stället för en månadsvis sammanställning i Excel.",
          "Vill ni ha avräkningen i en egen projektplattform finns den beskriven i guiden om Dynamics 365 Project Operations, där work in progress och intäktsavräkning beräknas på nedlagd tid eller upparbetad kostnad. För många byggföretag är dock Business Central med branschpaket det kortaste spåret, eftersom ekonomin och projekten redan finns i samma system.",
        ],
        links: [
          { text: "Läs om 4PS Construct från 4PS Sweden", to: "/partner/4ps-sweden/" },
          { text: "Jämför partners för bygg och entreprenad", to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners" },
        ],
      },
      {
        id: "kalkyl-och-mangdberakning",
        h2: "Integrerat kalkylprogram och mängdberäkning",
        paragraphs: [
          "Kalkyl och mängdberäkning är ofta den första flaskhalsen i ett byggföretag. Räknas mängderna i ett separat kalkylprogram och förs över till projektet manuellt uppstår fel, dubbelarbete och avvikelser som är svåra att spåra tillbaka. Ett integrerat flöde gör kalkylens poster till grund för projektets budget, så att en ändrad mängd syns i prognosen i stället för i en separat fil.",
          "Kalkyl är en del av 4PS Construct, som bygger priser, artiklar, arbetsmoment och resurser i samma system som projekt och ekonomi. Hur själva mängdberäkningen läggs upp beror på vilka moduler ni väljer och om ni räknar i externt verktyg eller från underlag i BIM och CAD, och det är en fråga att ta med i utvärderingen av partnern.",
          "Punkter som brukar avgöra om lösningen fungerar i praktiken: vilka kalkylprogram ni använder i dag, om mängderna ska kunna hämtas från BIM eller CAD, och hur en ändrad mängd eller ett ÄTA-arbete ska påverka projektets budget, prognos och slutliga fakturering.",
        ],
        links: [
          { text: "4PS Construct från 4PS Sweden", to: "/partner/4ps-sweden/" },
          { text: "Boka 20 minuters rådgivning om kalkyl och mängdberäkning", to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners" },
        ],
      },
    ],
  },
};
