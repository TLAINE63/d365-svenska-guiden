/**
 * Redaktionella affärssystemsavsnitt per bransch (manuellt underhållna, aldrig genererade).
 * Visas på /branscher/:slug/ när sluggen finns här.
 */
export interface IndustryErpSection {
  heading: string;
  intro: string;
  points: { title: string; text: string }[];
  packagesNote: string;
  packagesLink: { text: string; to: string };
  cta: { text: string; to: string };
}

export const INDUSTRY_ERP_SECTIONS: Record<string, IndustryErpSection> = {
  "bygg-entreprenad": {
    heading: "Affärssystem för bygg och entreprenad baserat på Microsoft Dynamics",
    intro:
      "För små och medelstora bygg-, entreprenad- och installationsföretag är Business Central med ett branschpaket ofta det naturliga spåret. Större entreprenadkoncerner med många bolag jämför även med Finance & Supply Chain Management.",
    points: [
      {
        title: "Projektredovisning",
        text: "Budget, prognos, kostnader och intäkter samlas per projekt. Successiv vinstavräkning hanteras i projektmodulen eller i branschpaketet.",
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
    cta: {
      text: "Jämför partners med specialistkompetens inom bygg och entreprenad",
      to: "/valjdynamics365partner/?industry=bygg-entreprenad#hitta-partners",
    },
  },
};
