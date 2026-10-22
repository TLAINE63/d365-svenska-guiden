import SimpleGuidePage from "@/components/guides/SimpleGuidePage";

const PATH = "/dynamicskonsult/";
const SEO_TITLE = "Dynamics 365 Konsult – Hitta Rätt Konsult & Partner 2026 | d365.se";
const Dynamicskonsult = () => (
  <SimpleGuidePage
    path={PATH}
    tool="dynamicskonsult_guide"
    seoTitle={SEO_TITLE}
    seoTitleMaxLength={SEO_TITLE.length}
    seoDescription="Behöver ni anlita en Microsoft Dynamics 365-konsult? Se roller, timarvoden (1 100–1 700 kr/h) och hitta rätt konsultbolag för ert projekt."
    crumbs={[{ name: "Start", url: "/" }, { name: "Guider", url: "/guider/" }, { name: "Dynamicskonsult", url: PATH }]}
    h1="Anlita en Microsoft Dynamics 365-konsult – Guide till rätt kompetens och partner"
    shortAnswer="Att implementera, anpassa eller vidareutveckla Microsoft Dynamics 365 kräver rätt specialistkompetens. Oavsett om ni behöver förstärkning till ett pågående affärssystemsprojekt, hjälp med integrationer eller löpande applikationssupport hjälper vi er att navigera bland Dynamics 365-konsulter (ofta kallade Dynamicskonsulter) och partners i Sverige."
    sections={[
      {
        title: "Vad behöver ni hjälp med?",
        cards: [
          { t: "Business Central", d: "Ekonomi, lager, inköp och försäljning för små och medelstora företag.", h: "/businesscentral/" },
          { t: "Dynamics 365 Finance", d: "Ekonomistyrning för större eller internationella organisationer.", h: "/finance-supply-chain/" },
          { t: "Dynamics 365 Supply Chain Management", d: "Produktion, lager, logistik och planering i större verksamheter.", h: "/finance-supply-chain/" },
          { t: "Dynamics 365 Sales / CRM", d: "Säljprocess, kunddata och prognoser.", h: "/d365sales/" },
          { t: "Dynamics 365 Customer Service", d: "Ärendehantering, kundtjänst och självservice.", h: "/d365customerservice/" },
          { t: "Power Platform", d: "Appar, automatiseringar och rapporter runt er Dynamics 365-lösning.", h: "/valjdynamics365partner/" },
          { t: "Integration och utveckling", d: "Kopplingar mot andra system, anpassningar och tillägg.", h: "/guider/optimera-dynamics-365/" },
          { t: "Support och förvaltning", d: "Löpande hjälp, uppdateringar och vidareutveckling efter driftstart.", h: "/guider/dynamics-365-support-forvaltning/" },
        ],
      },
      {
        title: "Vilka typer av Dynamics 365-konsulter finns det?",
        cards: [
          { t: "Verksamhets- och applikationskonsult", d: "Expert på affärsprocesser inom ekonomi, logistik, order, tillverkning eller CRM. Konfigurerar systemet och utbildar era medarbetare." },
          { t: "Teknisk utvecklare (.NET / AL-utvecklare)", d: "Bygger skräddarsydda tillägg, API-kopplingar, automatiserade arbetsflöden och anpassade funktioner." },
          { t: "Lösningsarkitekt (Solution Architect)", d: "Säkerställer systemets övergripande design, skalbarhet, datasäkerhet och samspel med övriga IT-landskapet och Microsoft Azure." },
          { t: "Projektledare / Förändringsledare", d: "Leder implementationen, driver tid- och budgetuppföljning samt hanterar förankringen i organisationen." },
          { t: "Teknisk konsult", d: "Behövs för installation, behörigheter, datamigrering, prestanda och miljöer, ofta i uppstart eller vid problem." },
        ],
      },
      {
        title: "Vad kostar det att anlita en Dynamics 365-konsult?",
        intro: "Timpriset för en svensk Dynamics 365-konsult ligger ofta på 1 100–1 700 kr per timme (exkl. moms) beroende på roll och senioritet. Det är d365.se:s redaktionella bedömning utifrån svenska partnerofferter, inte ett pris från någon enskild partner. Många konsultbolag erbjuder även fastpris på avgränsade förstudier eller paketlösningar med rabatterat timpris vid löpande supportavtal.",
        cards: [
          { t: "Se vår fullständiga prisguide för licenser och konsultarvoden", d: "Licenspriser från Microsoft och vad som påverkar det totala konsultpriset.", h: "/priser/#konsultpris" },
          { t: "Räkna på konsulttimmar", d: "Kalkylatorn visar timmar och kostnad för införandet utifrån era uppgifter.", h: "/implementationskalkylator/" },
        ],
      },
      {
        title: "Frilansande konsult vs. etablerat konsultbolag (partner)",
        cards: [
          { t: "Enskild konsult/underkonsult", d: "Passar utmärkt vid akuta resursbehov eller spetsuppdrag under en avgränsad period." },
          { t: "Etablerad partner", d: "Passar bäst vid större systembyten, upphandlingar och när ni behöver avtalad supportkapacitet (SLA) och ett helt team med bred kompetens." },
          { t: "En specialiserad konsult kan räcka när", d: "behovet är tydligt avgränsat, ni redan har ett fungerande team, en specifik kompetens saknas eller förstärkningen är tillfällig." },
          { t: "En Dynamics 365-partner passar bättre när", d: "flera kompetenser behövs, det gäller ett större införande eller förändringsprojekt, ni behöver bredare leveransansvar, support och förvaltning ska ingå, eller ni överväger att byta partner." },
        ],
      },
    ]}
    next={{
      title: "Hitta rätt konsultbolag för ert projekt",
      text: "Bläddra bland Microsoft-partners i Sverige och filtrera på geografi, system (Business Central, F&SCM, Sales) och branscherfarenhet.",
      links: [
        { label: "Hitta och jämför Dynamics 365-konsulter och partners", href: "/valjdynamics365partner/" },
        { label: "Funderar ni på att byta partner?", href: "/guider/byta-dynamics-partner/" },
        { label: "Be om en second opinion", href: "/second-opinion/" },
      ],
    }}
    faq={[
      { q: "Vad kostar en Dynamics 365-konsult per timme?", a: "Ofta 1 100–1 700 kr per timme exkl. moms i Sverige, beroende på roll och senioritet. Be alltid om timpris och estimerat antal timmar per roll i offerten." },
      { q: "Vad är skillnaden mellan en Dynamicskonsult och en Dynamics 365-partner?", a: "En konsult bidrar ofta med en avgränsad kompetens. En partner är ett företag som kan ta ett bredare ansvar för införande, support och förvaltning." },
      { q: "Behöver vi en konsult för varje Dynamics 365-app?", a: "Inte alltid. Många partners täcker flera appar, men kompetensen skiljer sig mellan till exempel Business Central och Finance & Supply Chain." },
    ]}
  />
);
export default Dynamicskonsult;
