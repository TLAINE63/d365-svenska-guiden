import SimpleGuidePage from "@/components/guides/SimpleGuidePage";

const PATH = "/guider/dynamics-365-support-forvaltning/";
const SupportForvaltning = () => (
  <SimpleGuidePage
    path={PATH}
    tool="support_guide"
    seoTitle="Support och förvaltning av Dynamics 365: vad ska avtalet innehålla?"
    seoDescription="Skillnaden mellan support, förvaltning och vidareutveckling i Dynamics 365, vad ett förvaltningsavtal bör innehålla och hur ni byter supportpartner utan att störa driften."
    crumbs={[{ name: "Start", url: "/" }, { name: "Redan Dynamics 365-kund", url: "/befintlig-kund/" }, { name: "Support och förvaltning", url: PATH }]}
    h1="Vad ska support och förvaltning av Dynamics 365 omfatta?"
    shortAnswer="Support hanterar fel som uppstår, förvaltning håller lösningen frisk över tid och vidareutveckling förbättrar den. Ett bra avtal skiljer på de tre, anger ansvar och servicenivåer och säkrar att ni äger dokumentation, åtkomst och kod."
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
    faq={[
      { q: "Ingår uppdateringar från Microsoft i licensen?", a: "Microsoft levererar uppdateringarna i molnet, men test, anpassningar och godkännande i er lösning är normalt förvaltningsarbete hos er eller er partner." },
      { q: "Kan vi ha en partner för support och en annan för utveckling?", a: "Ja, men då behöver ansvar, dokumentation och miljöer vara tydligt fördelade så att ingen del faller mellan stolarna." },
      { q: "Vad är ett rimligt förvaltningsupplägg?", a: "Det beror på lösningens storlek och hur mycket ni gör själva. Kostnadsguiden visar typiska löpande kostnader." },
    ]}
  />
);
export default SupportForvaltning;
