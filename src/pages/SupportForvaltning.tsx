import SimpleGuidePage from "@/components/guides/SimpleGuidePage";
import AdvisoryOffer from "@/components/advisory/AdvisoryOffer";
import GuideCTA from "@/components/guides/GuideCTA";
import { PARTNER_SELECTOR_CTA as CTA } from "@/data/partnerSelectorCta";

const PATH = "/guider/dynamics-365-support-forvaltning/";
const SupportForvaltning = () => (
  <SimpleGuidePage
    path={PATH}
    tool="support_guide"
    seoTitle="Dynamics 365 Support & Förvaltning i Sverige | Jämför Partners | d365.se"
    seoTitleMaxLength={75}
    seoDescription="Behöver du support, förvaltning eller felavhjälpning för Microsoft Dynamics 365? Jämför partners, supportavtal och SLA-nivåer på d365.se."
    crumbs={[{ name: "Start", url: "/" }, { name: "Redan Dynamics 365-kund", url: "/befintlig-kund/" }, { name: "Support och förvaltning", url: PATH }]}
    h1="Support och förvaltning för Microsoft Dynamics 365"
    intro="Snabb experthjälp vid driftstörningar, användarfrågor och löpande förvaltning. Här går vi igenom vad ett supportavtal innebär, hur SLA fungerar och hur du hittar rätt svensk partner."
    shortAnswer="Support hanterar fel som uppstår, förvaltning håller lösningen frisk över tid och vidareutveckling förbättrar den. Ett bra avtal skiljer på de tre, anger ansvar och servicenivåer och säkrar att ni äger dokumentation, åtkomst och kod."
    afterIntro={
      <GuideCTA variant="highlight" heading={CTA.heading} text={CTA.text} buttonLabel={CTA.label} to={CTA.to} source={`${PATH}#cta-intro`} className="!my-0" />
    }
    sections={[
      {
        title: "Support, förvaltning och vidareutveckling",
        cards: [
          { t: "Support", d: "Ärendehantering när något inte fungerar: felanmälan, prioritering, svarstider och lösning." },
          { t: "Förvaltning", d: "Löpande arbete: Microsofts uppdateringar och release waves, miljöer, behörigheter, tester och dokumentation." },
          { t: "Vidareutveckling", d: "Nya funktioner, förbättrade processer, fler användare eller applikationer. Planeras och prissätts separat." },
        ],
      },
      {
        title: "Vad ingår i applikationsdrift och support?",
        cards: [
          { t: "Incidenthantering och felavhjälpning", d: "Snabb hjälp vid driftstopp, integrationsfel och kritiska buggar, med prioritering efter hur mycket verksamheten påverkas." },
          { t: "Användarsupport och rådgivning", d: "Vägledning för administratörer och slutanvändare: hur något görs, varför ett resultat blev fel och hur arbetssättet kan förbättras." },
          { t: "Hantering av Microsofts uppdateringar", d: "Test och förberedelse inför Microsofts automatiska uppdateringar: One Version för Finance och Supply Chain Management och de halvårsvisa release waves för Business Central." },
        ],
      },
      {
        title: "Microsofts standardsupport eller en lokal partner",
        intro: "Microsofts standardsupport täcker själva plattformen: drift av molntjänsten, tillgänglighet och fel i standardprodukten. Den känner inte till era anpassningar, tillägg, integrationer eller hur ni arbetar. Därför har de flesta svenska företag en lokal partner som kan verksamheten och lösningen och tar ärenden på svenska.",
        cards: [
          { t: "Microsoft", d: "Driftar molntjänsten, levererar uppdateringar och hanterar fel i själva plattformen. Ärenden till Microsoft går normalt via er partner eller ert eget supportavtal." },
          { t: "Lokal supportpartner", d: "Hanterar frågor och fel i er lösning: konfiguration, anpassningar, tillägg, integrationer och användarnas vardagsproblem. Eskalerar till Microsoft när felet ligger i plattformen." },
          { t: "Ni själva", d: "Äger processer, data och prioriteringar. Många har en intern systemförvaltare som tar första linjens frågor." },
        ],
      },
      {
        title: "Olika typer av supportavtal och SLA-nivåer",
        intro: "SLA (Service Level Agreement) anger hur snabbt partnern ska reagera och lösa ärenden per prioritet. För kritiska ärenden, där verksamheten står still, anger många avtal en svars- eller inställelsetid på 1–4 timmar. Jour och beredskap utanför kontorstid ingår sällan som standard och prissätts oftast separat.",
        list: [
          "Löpande timdebitering: flexibelt, men svårare att budgetera",
          "Timbank: ett antal timmar per månad eller år till fast pris, som förbrukas vid behov",
          "Fast månadsabonnemang: definierat åtagande med servicenivåer till fast månadsavgift",
          "Jour och beredskap: tillägg för kritiska ärenden utanför kontorstid",
          "Garanterade inställelsetider per prioritet, till exempel 1–4 timmar för kritiska ärenden",
          "Kombination: fast grundförvaltning plus vidareutveckling som separata uppdrag",
        ],
      },
      {
        title: "Checklista för förvaltningsavtal",
        list: [
          "Tydlig gräns mellan support, förvaltning och vidareutveckling",
          "Servicenivåer per prioritet, med mätbara svars- och lösningstider",
          "Vem som testar och godkänner Microsofts uppdateringar",
          "Ansvar för miljöer, säkerhetskopior och behörigheter",
          "Att ni äger dokumentation, kod och administratörsåtkomst",
          "Rapportering av ärenden och förbrukade timmar",
          "Uppsägningstid och överlämning vid avtalsslut",
          "Hur licenser hanteras och vem som är licenspartner",
        ],
      },
      {
        title: "Byta supportpartner utan att störa driften",
        intro: "Systemet och era data finns kvar vid ett byte, det som flyttas är ansvaret. Planera överlämningen innan uppsägning.",
        list: [
          "Säkra administratörsåtkomst och dokumentation först",
          "Kartlägg anpassningar, tillägg och integrationer",
          "Låt ny partner göra en genomgång före övertagande",
          "Planera en period med överlappande ansvar",
        ],
      },
      {
        title: "Hitta rätt supportpartner",
        intro: "Börja i partnerkatalogen och filtrera på er applikation och bransch. Fråga varje partner hur de arbetar med support och förvaltning, vilka servicenivåer de erbjuder och vilka kunder i er storlek de redan förvaltar.",
        cards: [
          { t: "Hitta rätt partner", d: "Filtrera på applikation, bransch och geografi och se vilka partners som passar er lösning.", h: "/valjdynamics365partner/" },
          { t: "Alla Dynamics 365-partners", d: "Hela partnerkatalogen med verifierade profiler och grundprofiler.", h: "/alla-d365-partners/" },
          { t: "Jämför partners", d: "Ställ upp till tre partners bredvid varandra innan ni begär offert.", h: "/jamfor-partners/" },
          { t: "Byta partner", d: "Analys och checklista för er som funderar på att byta förvaltningspartner.", h: "/guider/byta-dynamics-partner/" },
        ],
      },
    ]}
    next={{
      title: "Nästa steg",
      text: "Vill ni byta eller komplettera förvaltningspartner finns en egen guide med analys och checklista. Osäkra på om bytet behövs? Börja med en second opinion.",
      links: [
        { label: "Partnerbytesguiden", href: "/guider/byta-dynamics-partner/" },
        { label: "Be om en second opinion", href: "/second-opinion/" },
        { label: "Hitta partner", href: "/valjdynamics365partner/" },
      ],
    }}
    afterNext={
      <>
      <GuideCTA variant="final" heading={CTA.heading} text={CTA.text} buttonLabel={CTA.label} to={CTA.to} source={`${PATH}#cta-final`} className="!mt-0" />
      <AdvisoryOffer
        variant="inline"
        placement="partner_switch"
        pageType="support_guide"
        heading="Behöver du hjälp att utvärdera eller byta supportpartner?"
        text="Boka ett kostnadsfritt rådgivningsmöte med Thomas. Vi går igenom ert nuvarande avtal, era servicenivåer och vilka alternativ ni har."
        cta="Boka en kostnadsfri rådgivning"
        metadata={{ source: "support_guide", intent: "consultation" }}
      />
      </>
    }
    faq={[
      { q: "Ingår uppdateringar från Microsoft i licensen?", a: "Microsoft levererar uppdateringarna i molnet, men test, anpassningar och godkännande i er lösning är normalt förvaltningsarbete hos er eller er partner." },
      { q: "Räcker Microsofts standardsupport?", a: "Den täcker fel i plattformen, men inte era anpassningar, integrationer eller användarfrågor. De flesta kombinerar den med en lokal supportpartner." },
      { q: "Vilken SLA är rimlig för kritiska ärenden?", a: "Många avtal anger 1–4 timmar för kritiska ärenden. Det viktiga är att prioriteringsnivåerna är definierade och att tiderna går att följa upp." },
      { q: "Kan vi ha en partner för support och en annan för utveckling?", a: "Ja, men då behöver ansvar, dokumentation och miljöer vara tydligt fördelade så att ingen del faller mellan stolarna." },
      { q: "Vad är ett rimligt förvaltningsupplägg?", a: "Det beror på lösningens storlek och hur mycket ni gör själva. Kostnadsguiden visar typiska löpande kostnader." },
    ]}
  />
);
export default SupportForvaltning;
