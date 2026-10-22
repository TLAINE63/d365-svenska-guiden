import SimpleGuidePage from "@/components/guides/SimpleGuidePage";

const PATH = "/dynamicskonsult/";
const Dynamicskonsult = () => (
  <SimpleGuidePage
    path={PATH}
    tool="dynamicskonsult_guide"
    seoTitle="Dynamicskonsult – hitta rätt Dynamics 365-konsult | d365.se"
    seoDescription="Behöver ni en Dynamicskonsult? Se vilken Dynamics 365-kompetens ni behöver, när en konsult räcker och när en partner passar bättre, och jämför relevanta partners."
    crumbs={[{ name: "Start", url: "/" }, { name: "Guider", url: "/guider/" }, { name: "Dynamicskonsult", url: PATH }]}
    h1="Hitta rätt Dynamicskonsult"
    shortAnswer="Behöver ni hjälp med Dynamics 365? Rätt konsult beror på vilken Dynamics-lösning ni använder, vad ni behöver få gjort och hur mycket ansvar konsulten eller partnern ska ta. Här hjälper d365.se er att förstå vilken kompetens ni bör leta efter."
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
        title: "Vilken typ av Dynamicskonsult behöver ni?",
        cards: [
          { t: "Funktionell konsult", d: "Behövs när processer ska sättas upp eller förbättras: hur ekonomi, sälj eller lager ska fungera i systemet, och utbildning av användare." },
          { t: "Teknisk konsult", d: "Behövs för installation, behörigheter, datamigrering, prestanda och miljöer, ofta i uppstart eller vid problem." },
          { t: "Lösningsarkitekt", d: "Behövs när flera system eller Dynamics 365-appar ska hänga ihop och helheten måste hålla över tid." },
          { t: "Utvecklare", d: "Behövs när standardfunktioner inte räcker: anpassningar, tillägg och integrationer." },
          { t: "Projektledare", d: "Behövs i större införanden eller förändringar med många beslut, tidplan och flera inblandade." },
        ],
      },
      {
        title: "Konsult eller Dynamics 365-partner?",
        cards: [
          { t: "En specialiserad konsult kan räcka när", d: "behovet är tydligt avgränsat, ni redan har ett fungerande team, en specifik kompetens saknas eller förstärkningen är tillfällig." },
          { t: "En Dynamics 365-partner passar bättre när", d: "flera kompetenser behövs, det gäller ett större införande eller förändringsprojekt, ni behöver bredare leveransansvar, support och förvaltning ska ingå, eller ni överväger att byta partner." },
        ],
      },
    ]}
    next={{
      title: "Hitta rätt Dynamics 365-kompetens",
      text: "Utgå från vad ni behöver hjälp med och jämför relevanta Dynamics 365-partners.",
      links: [
        { label: "Jämför Dynamics 365-partners", href: "/valjdynamics365partner/" },
        { label: "Funderar ni på att byta partner?", href: "/guider/byta-dynamics-partner/" },
        { label: "Be om en second opinion", href: "/second-opinion/" },
      ],
    }}
    faq={[
      { q: "Vad är skillnaden mellan en Dynamicskonsult och en Dynamics 365-partner?", a: "En konsult bidrar ofta med en avgränsad kompetens. En partner är ett företag som kan ta ett bredare ansvar för införande, support och förvaltning." },
      { q: "Behöver vi en konsult för varje Dynamics 365-app?", a: "Inte alltid. Många partners täcker flera appar, men kompetensen skiljer sig mellan till exempel Business Central och Finance & Supply Chain." },
    ]}
  />
);
export default Dynamicskonsult;
