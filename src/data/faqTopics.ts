/**
 * Vanliga frågor om affärssystem, ERP/CRM och partnerval.
 * Används av /kunskapscenter/fragor-och-svar/ (FAQ-sida + FAQPage-schema).
 *
 * Svaren ska vara sakliga och följa d365.se:s prisstandarder:
 * BC 100 000–800 000 kr, F&SCM 1,5–10 Mkr, Sales/Customer Insights
 * 100 000–1 200 000 kr, Customer Service 150 000–1 200 000 kr,
 * Field Service 200 000–1 800 000 kr, Contact Center 250 000–2 000 000 kr.
 */

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqTopic {
  id: string;
  title: string;
  intro: string;
  items: FaqEntry[];
}

export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: "affarssystem",
    title: "Affärssystem och ERP",
    intro:
      "Grundläggande frågor om vad ett affärssystem är, när det är dags att byta och hur ERP skiljer sig från CRM.",
    items: [
      {
        question: "Vad är ett affärssystem (ERP)?",
        answer:
          "Ett affärssystem, ofta kallat ERP, är den plattform där verksamhetens kärnprocesser hanteras: ekonomi, inköp, lager, order, produktion, projekt och rapportering. Syftet är att samla data och arbetsflöden på ett ställe så att uppföljning, kontroll och automatisering fungerar över hela företaget i stället för i separata system och kalkylblad.",
      },
      {
        question: "Vad är skillnaden mellan ERP och CRM?",
        answer:
          "ERP hanterar interna affärsprocesser som ekonomi, inköp, lager, produktion och leveranskedja. CRM hanterar kundrelaterade processer som försäljning, marknadsföring, kundservice och uppföljning av kunddialogen. Många företag använder båda och integrerar dem, så att kundorder, fakturering och service hänger ihop.",
      },
      {
        question: "När är det dags att byta affärssystem?",
        answer:
          "Vanliga signaler är att systemet inte längre stöds eller uppdateras, att verksamheten vuxit ur lösningen, att mycket arbete sker manuellt i Excel, att rapportering kräver handpåläggning, att integrationer är svåra att underhålla eller att nya krav som e-handel, spårbarhet eller internationell expansion inte går att lösa. Ett byte bör motiveras av konkreta verksamhetsproblem, inte enbart av teknisk ålder.",
      },
      {
        question: "Vilket Dynamics 365-system passar vår storlek?",
        answer:
          "Business Central passar oftast små och medelstora bolag samt dotterbolag med behov av ett komplett men hanterbart ERP. Finance & Supply Chain Management passar större bolag och koncerner med komplex ekonomi, produktion, logistik eller flera legala enheter. Storlek är dock inte hela svaret: processkomplexitet, antal länder och integrationsbehov väger ofta tyngre än antal anställda.",
      },
      {
        question: "Kan vi behålla våra särlösningar i ett nytt system?",
        answer:
          "Ofta går det, men frågan bör vändas: vilka särlösningar skapar verkligt affärsvärde och vilka finns bara för att det gamla systemet krävde dem? En vanlig rekommendation är att utgå från standard, täcka avvikelser med etablerade tillägg där det går och begränsa egen utveckling till det som är affärskritiskt och unikt.",
      },
    ],
  },
  {
    id: "partnerval",
    title: "Partnerval och upphandling",
    intro:
      "Frågor om hur du hittar, jämför och väljer implementeringspartner – och hur systemval och partnerval hänger ihop.",
    items: [
      {
        question: "Ska vi välja affärssystem eller partner först?",
        answer:
          "Rekommendationen är att inte behandla dem som två separata beslut. Ett system som ser starkt ut på papperet kan bli fel om partnern saknar relevant erfarenhet, medan ett annat alternativ kan bli rätt när partnern har djup branschkunskap och en tydlig leveransmodell. Utvärdera därför kombinationer av system och partner utifrån verksamhetens behov.",
      },
      {
        question: "Hur många partners bör vi jämföra?",
        answer:
          "För de flesta projekt räcker en kortlista på två till tre partners för djupare dialog. Fler än så gör processen tung för både er och leverantörerna, och färre än två gör det svårt att bedöma pris, arbetssätt och kompetens i relation till marknaden.",
      },
      {
        question: "Vilka frågor bör vi ställa till en partner?",
        answer:
          "Fråga efter liknande projekt i er bransch, vilka konsulter som faktiskt kommer att ingå i teamet, hur projektmetodiken ser ut, hur de hanterar standard kontra anpassningar, hur datamigrering och integrationer säkras, hur testning läggs upp samt hur support och vidareutveckling fungerar efter driftstart.",
      },
      {
        question: "Spelar partnerns storlek roll?",
        answer:
          "Storlek säger något om uthållighet och bredd, men sällan något om leveranskvaliteten i just ert projekt. Det som avgör är branscherfarenhet, relevant produktkompetens, tillgänglig kapacitet under er tidsplan och hur väl arbetssättet matchar er organisation. En mindre specialist kan vara ett bättre val än en stor generalist, och tvärtom.",
      },
      {
        question: "Vad betyder partnerverifierad profil på d365.se?",
        answer:
          "En partnerverifierad profil innebär att partnern själv har lämnat och bekräftat uppgifterna i profilen, till exempel produktområden, branscher, teamstorlek och referenser. Övriga profiler är grundprofiler som d365.se sammanställt från publikt tillgänglig information och som därför är mindre detaljerade.",
      },
      {
        question: "Kostar det något att använda d365.se?",
        answer:
          "Nej, verktygen för behovsanalys, kravspecifikation, jämförelser och partnerkontakt är kostnadsfria för dig som köpare. d365.se finansieras av partners som betalar för sin närvaro på plattformen. Rådgivningen är köparsidig och partnerkontakter förmedlas alltid via plattformen.",
      },
    ],
  },
  {
    id: "kostnad",
    title: "Kostnad, licenser och tidplan",
    intro:
      "Ungefärliga nivåer och de faktorer som styr både projektkostnad och kalendertid.",
    items: [
      {
        question: "Vad kostar ett Business Central-projekt?",
        answer:
          "Ett Business Central-projekt landar oftast på 100 000–800 000 kr i implementationskostnad. Mindre projekt med standardprocesser hamnar typiskt på 100 000–250 000 kr, medan normalstora projekt med integrationer, datamigrering och flera avdelningar ofta ligger på 250 000–800 000 kr. Licenser tillkommer per användare och månad.",
      },
      {
        question: "Vad kostar ett Finance & Supply Chain Management-projekt?",
        answer:
          "Finance & Supply Chain Management används i större och mer komplexa verksamheter, och implementationer ligger normalt på 1,5–10 Mkr. Kostnaden styrs av antal legala enheter, länder, produktions- och logistikflöden, integrationer samt hur mycket som kan köras på standard.",
      },
      {
        question: "Vad kostar ett CRM-projekt i Dynamics 365?",
        answer:
          "Dynamics 365 Sales och Customer Insights ligger normalt på 100 000–1 200 000 kr, Customer Service på 150 000–1 200 000 kr, Field Service på 200 000–1 800 000 kr och Contact Center på 250 000–2 000 000 kr. Spannen speglar skillnaden mellan ett avgränsat införande för ett team och en bred lösning med integrationer och automatisering.",
      },
      {
        question: "Vad styr priset mest i ett implementationsprojekt?",
        answer:
          "De största kostnadsdrivarna är antal processer och roller som berörs, mängden integrationer, kvaliteten på den data som ska migreras, graden av egen utveckling, antal legala enheter och länder samt hur mycket tid den egna organisationen kan lägga på projektet.",
      },
      {
        question: "Hur lång tid tar en implementation?",
        answer:
          "Ett avgränsat Business Central- eller CRM-projekt genomförs ofta på tre till sex månader. Bredare ERP-projekt tar vanligen sex till tolv månader, och stora Finance & Supply Chain Management-program kan löpa över ett till två år med flera driftsättningar. Tidplanen påverkas minst lika mycket av er egen tillgänglighet som av partnerns.",
      },
      {
        question: "Vad kostar licenserna?",
        answer:
          "Licenser prissätts per användare och månad och skiljer sig mellan appar och användartyper. De utgör en löpande kostnad som ska budgeteras vid sidan av implementation, förvaltning och vidareutveckling. Aktuella nivåer finns samlade i pris- och kostnadsguiden på d365.se.",
      },
    ],
  },
  {
    id: "projekt",
    title: "Projekt, införande och förvaltning",
    intro:
      "Frågor om vad som händer före, under och efter driftstart – och vad som brukar avgöra om projektet lyckas.",
    items: [
      {
        question: "Behöver vi en kravspecifikation?",
        answer:
          "Ett strukturerat underlag hjälper både er och partnerna att jämföra äpplen med äpplen. Det behöver dock inte vara en lång kravlista. Beskriv hellre era viktigaste processer, volymer, integrationer och önskade effekter, och be partnern visa hur de skulle lösa dem i praktiken.",
      },
      {
        question: "Hur mycket egen tid krävs av oss?",
        answer:
          "Räkna med att nyckelpersoner behöver avsätta betydande tid för workshops, beslut, testning och utbildning. En vanlig orsak till försening är inte partnerns kapacitet, utan att den egna organisationen inte hunnit fatta beslut eller testa i tid. Bemanna projektet internt innan det startar.",
      },
      {
        question: "Vad händer efter driftstart?",
        answer:
          "Efter driftstart följer en period av stabilisering, därefter löpande förvaltning och vidareutveckling. Kom överens redan i avtalet om supportnivåer, svarstider, hur ärenden eskaleras, vem som äger vidareutvecklingen och hur nya releaser hanteras.",
      },
      {
        question: "Kan vi byta partner utan att byta system?",
        answer:
          "Ja. Det är fullt möjligt att behålla Dynamics 365 och byta implementations- eller förvaltningspartner. Planera för överlämning av dokumentation, källkod för eventuella anpassningar, miljöer och behörigheter, och gör en genomgång av lösningens nuläge innan bytet.",
      },
      {
        question: "Hur undviker vi att projektet spårar ur?",
        answer:
          "Håll scopet begränsat i första etappen, prioritera standard före anpassningar, säkra en engagerad styrgrupp med mandat, arbeta med data tidigt i projektet och testa med verkliga scenarier i stället för teoretiska fall. Beslutsförmåga i den egna organisationen är ofta den enskilt viktigaste framgångsfaktorn.",
      },
    ],
  },
];

export const ALL_FAQ_ITEMS: FaqEntry[] = FAQ_TOPICS.flatMap((t) => t.items);
