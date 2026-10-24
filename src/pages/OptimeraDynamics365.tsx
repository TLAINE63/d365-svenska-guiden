import SimpleGuidePage from "@/components/guides/SimpleGuidePage";

const PATH = "/guider/optimera-dynamics-365/";
const OptimeraDynamics365 = () => (
  <SimpleGuidePage
    path={PATH}
    tool="optimize_guide"
    seoTitle="Optimera och felsöka Dynamics 365: prestanda, anpassningar och användning"
    seoDescription="Fungerar Dynamics 365 sämre än väntat? Så hittar ni orsaken: prestanda, anpassningar, integrationer, data eller låg användning, och när ni behöver hjälp."
    crumbs={[{ name: "Start", url: "/" }, { name: "Redan Dynamics 365-kund", url: "/befintlig-kund/" }, { name: "Optimera Dynamics 365", url: PATH }]}
    h1="Varför fungerar inte Dynamics 365 som det var tänkt, och hur optimerar ni lösningen?"
    shortAnswer="De flesta problem i en befintlig Dynamics 365-lösning beror på processer, data, anpassningar eller förvaltning snarare än själva plattformen. Börja med att ringa in symtomen, skilj på system och arbetssätt, och ta in extern bedömning först när orsaken är oklar eller lösningen behöver större förändringar."
    sections={[
      {
        title: "Vanliga orsaker till att lösningen inte levererar",
        cards: [
          { t: "Prestanda", d: "Långsamma sidor, batchjobb eller rapporter. Ofta kopplat till datavolym, anpassad kod, integrationer eller hur jobb schemaläggs." },
          { t: "För många anpassningar", d: "Kundunik kod gör uppgraderingar dyrare och felsökning svårare. Ibland finns standardfunktioner som ersätter dem i dag." },
          { t: "Integrationer", d: "Fel eller fördröjningar mellan system leder ofta till manuellt arbete och dubbel inmatning." },
          { t: "Datakvalitet", d: "Ofullständiga eller dubblerade data ger felaktiga rapporter och låg tillit till systemet." },
          { t: "Låg användning", d: "Användarna arbetar runt systemet i Excel eller mejl. Ofta en fråga om utbildning, roller och processer." },
          { t: "Teknisk skuld", d: "Gamla lösningar, otydlig dokumentation och eftersatta uppdateringar som gör varje förändring tung." },
        ],
      },
      {
        title: "Intern genomgång, second opinion eller specialistpartner?",
        cards: [
          { t: "Intern genomgång räcker", d: "När symtomen är tydliga och avgränsade, till exempel ett enskilt flöde eller en rapport, och er partner har kapacitet att åtgärda." },
          { t: "Second opinion behövs", d: "När orsaken är oklar, när förslag på åtgärder känns stora eller dyra, eller när ni vill att någon granskar förslaget innan ni beslutar." },
          { t: "Specialistpartner", d: "När problemet kräver djup kompetens inom ett område, till exempel prestanda, integration, data eller AI, som er nuvarande partner saknar." },
        ],
      },
      {
        title: "Så ringar ni in problemet",
        list: [
          "Lista konkreta exempel: vad, var, när och hur ofta",
          "Skilj på systemfel, processproblem och utbildningsbehov",
          "Inventera anpassningar, tillägg och integrationer",
          "Kontrollera att lösningen följer Microsofts uppdateringar",
          "Fråga användarna var de arbetar runt systemet",
          "Prioritera efter affärspåverkan, inte efter antal ärenden",
        ],
      },
    ]}
    next={{
      title: "Nästa steg",
      text: "Osäkra på orsaken? Börja med en second opinion. Vet ni vilken kompetens som saknas kan ni söka specialistpartner direkt.",
      links: [
        { label: "Be om en second opinion", href: "/second-opinion/" },
        { label: "Hitta specialistpartner", href: "/valjdynamics365partner/" },
        { label: "Support och förvaltning", href: "/guider/dynamics-365-support-forvaltning/" },
      ],
    }}
    faq={[
      { q: "Måste vi byta partner om lösningen fungerar dåligt?", a: "Nej. Ofta räcker det att tydliggöra krav, förändra förvaltningen eller ta in en specialist för ett avgränsat område." },
      { q: "Kan anpassningar tas bort i efterhand?", a: "Ofta ja, om standardfunktioner i Dynamics 365 i dag täcker behovet. Det kräver en genomgång av varje anpassning och dess beroenden." },
      { q: "Hur vet vi om problemet ligger i systemet eller i arbetssättet?", a: "Samla konkreta exempel och jämför med hur standardprocessen är tänkt att fungera. En extern bedömning kan hjälpa när det är oklart." },
    ]}
  />
);
export default OptimeraDynamics365;
