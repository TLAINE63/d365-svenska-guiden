/**
 * Innehåll för guideserien "Välja Dynamics 365-partner".
 * Texten är hämtad ordagrant ur redaktionens guidedokument (2026-09-09).
 * Undantag: ordet "oberoende" har ersatts enligt sajtens copyregler.
 */

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export interface GuideContent {
  h1: string;
  blocks: GuideBlock[];
  about: string;
}

export const GUIDE_CONTENT: Record<string, GuideContent> = {
  "valja-dynamics-365-partner": {
    "h1": "Hur hittar du rätt partner för Dynamics 365 i Sverige?",
    "blocks": [
      {
        "type": "p",
        "text": "Kort svar: avgör först vilken sorts upphandling du faktiskt gör. Business Central, Finance & Supply Chain Management och Customer Engagement är tre olika marknader med olika leverantörer och helt olika storleksordning på projekten. Bygg sedan en longlist på fem till åtta kandidater, gallra på branscherfarenhet och storleksmatchning, och lägg tyngdpunkten i utvärderingen på de personer som faktiskt ska leverera. Alla partners svarar bra på en bra fråga, så det avgörande är inte vilka frågor ni ställer utan hur ni bedömer svaren."
      },
      {
        "type": "p",
        "text": "Den här guiden är skriven av d365.se. Vi implementerar inte Dynamics 365 och vi säljer inga licenser. Vi finns för att köparen ska kunna jämföra partners på samma grunder."
      },
      {
        "type": "h2",
        "text": "Varför partnervalet väger tyngre än systemvalet"
      },
      {
        "type": "p",
        "text": "De flesta organisationer lägger merparten av sin tid på att jämföra system. Det är begripligt: systemet är det som demonstreras, prissätts och beslutas om formellt. Men Dynamics 365 är Microsofts produkt oavsett var licensen köps. Vissa licenser kan köpas direkt från Microsoft eller via Microsoft 365, andra köps med stöd av en partner. För de flesta implementationer är det däremot implementationspartnern som analyserar, konfigurerar, integrerar, utbildar och hjälper till med förvaltningen."
      },
      {
        "type": "p",
        "text": "Det betyder att den variabel som verkligen avgör utfallet ofta är den som granskas minst. Ett ERP- eller CRM-projekt engagerar normalt flera funktioner och många personer internt, sträcker sig från förstudie till stabil drift och märks i stora delar av verksamheten om det går fel. Konsekvenserna är sällan bara ekonomiska; de påverkar också dem som har drivit beslutet och ska få lösningen att fungera."
      },
      {
        "type": "p",
        "text": "Poängen är inte att beslutet är farligt. Poängen är att det går att strukturera, och att strukturen är det som gör beslutet försvarbart i efterhand."
      },
      {
        "type": "h2",
        "text": "Steg 1: Avgör vilken marknad du befinner dig på"
      },
      {
        "type": "p",
        "text": "Att tala om \"en Dynamics 365-partner\" är för trubbigt för att vara användbart. De tre huvudmarknaderna Business Central, Finance & Supply Chain Management och Customer Engagement har olika leverantörsbild, projektlogik och riskprofil. Inom Customer Engagement skiljer sig dessutom Sales tydligt från Customer Service och Field Service."
      },
      {
        "type": "p",
        "text": "Tabellen nedan är d365.se:s bedömning av den svenska marknaden, baserad på vår löpande kontakt med partners och köpare. Siffrorna ska läsas som storleksordningar, inte som prislistor eller officiell Microsoft-statistik. Bedömningen är uppdaterad i september 2026."
      },
      {
        "type": "table",
        "head": [
          "Applikationsområde",
          "Typisk projektstorlek",
          "Nya affärer per år i Sverige"
        ],
        "rows": [
          [
            "Business Central",
            "100 000–800 000 kr (mindre projekt 100 000–250 000 kr)",
            "Cirka 500"
          ],
          [
            "Sales",
            "100 000–1 200 000 kr",
            "Cirka 500"
          ],
          [
            "Customer Insights (marknad)",
            "100 000–1 200 000 kr, varierar med datamognad",
            "Cirka 300"
          ],
          [
            "Customer Service, Field Service, Contact Center",
            "Customer Service 150 000–1 200 000 kr, Field Service 200 000–1 800 000 kr, Contact Center 250 000–2 000 000 kr",
            "Cirka 200 vardera"
          ],
          [
            "Finance & Supply Chain Management",
            "Enterprise. 1,5–10 miljoner kr",
            "Cirka 50"
          ]
        ]
      },
      {
        "type": "p",
        "text": "Skillnaderna får praktiska konsekvenser. På Business Central finns dussintals svenska partners, varav många är små och starkt branschinriktade. På Finance & Supply Chain Management är fältet betydligt smalare: vi bedömer att det rör sig om ungefär hundra kundkoncerner i Sverige totalt, och att rena nyförsäljningsprojekt är ovanliga. På Customer Engagement möter du två olika typer av leverantörer: helhetsaktörerna som också gör ERP, och de renodlade CRM- och Power Platform-specialisterna."
      },
      {
        "type": "p",
        "text": "Om du inte klargör vilken av dessa marknader du är på riskerar du att jämföra kandidater som inte är jämförbara."
      },
      {
        "type": "p",
        "text": "Vi har skrivit en fördjupad urvalsguide för varje område: Business Central, Finance & Supply Chain Management, Dynamics 365 Sales samt Customer Service och Field Service. Den här sidan täcker det som gäller oavsett applikation."
      },
      {
        "type": "h2",
        "text": "Steg 2: Bygg en longlist utan att förlita dig på en enda källa"
      },
      {
        "type": "p",
        "text": "Det finns fyra rimliga vägar till kandidater, och de har olika svagheter."
      },
      {
        "type": "h3",
        "text": "Microsofts partnerkatalog"
      },
      {
        "type": "p",
        "text": "Ger dig registrerade partners med formell status. Katalogen svarar på frågan vem som är registrerad hos Microsoft, inte på frågan vem som passar just er. Den skiljer inte heller på ett bolag med tre konsulter och ett med trehundra."
      },
      {
        "type": "h3",
        "text": "Branschspecifika tilläggslösningar"
      },
      {
        "type": "p",
        "text": "Många partners har byggt egna appar för en specifik vertikal. Hittar du en lösning som ligger nära er verksamhet leder den ofta till rätt leverantör. Kontrollera bara om appen är partnerns egen eller inlicensierad från en ISV, eftersom det påverkar vem som äger vidareutvecklingen."
      },
      {
        "type": "h3",
        "text": "Ert eget nätverk"
      },
      {
        "type": "p",
        "text": "Rekommendationer från kollegor i samma bransch är värdefulla, men urvalet blir smalt och präglas av vem ni råkar känna. En rekommendation säger dessutom mer om ett avslutat projekt än om partnerns nuvarande kapacitet, som kan ha förändrats genom tillväxt, uppköp eller personalomsättning."
      },
      {
        "type": "h3",
        "text": "Jämförelse på lika grunder"
      },
      {
        "type": "p",
        "text": "d365.se listar svenska Dynamics 365-partners med samma uppgifter beskrivna på samma sätt: applikationsområden, branscherfarenhet, storlek och leveransbevis. Syftet är att ni ska kunna sortera bort och sortera in på jämförbara grunder innan ni börjar boka möten."
      },
      {
        "type": "p",
        "text": "Fem till åtta kandidater är ett rimligt utgångsläge. Fler än så orkar ingen beslutsgrupp utvärdera på djupet, och djupet är hela poängen."
      },
      {
        "type": "h2",
        "text": "Steg 3: Fyra frågor att ställa er själva först"
      },
      {
        "type": "p",
        "text": "Innan ni träffar en enda leverantör bör beslutsgruppen vara överens om följande. Är ni inte det kommer partnern att välja åt er, och då blir valet deras snarare än ert."
      },
      {
        "type": "ul",
        "items": [
          "Vilka tre kriterier väger tyngst för oss, och är vi överens om dem? Fler än tre går inte att hålla fast vid när presentationerna börjar.",
          "Hur mycket av arbetet ska vi göra själva? Datatvätt, testning och utbildning kan ligga hos er eller hos partnern. Skillnaden är stor i både kostnad och kalendertid.",
          "Vem hos oss äger systemet efter go-live? Om svaret är oklart kommer förvaltningen att bli partnerns beslut i praktiken.",
          "Vad ska vara löst om arton månader, och hur märks det? Utan ett svar på detta finns ingen måttstock för om projektet lyckades."
        ]
      },
      {
        "type": "h2",
        "text": "Steg 4: Ställ de frågor som faktiskt skiljer partners åt"
      },
      {
        "type": "p",
        "text": "De flesta frågelistor på det här området genererar samma svar från samtliga leverantörer, eftersom frågorna är formulerade så att det goda svaret är uppenbart. Frågan är sällan om partnern arbetar med förändringsledning. Frågan är vad de svarar när ni ber om ett exempel."
      },
      {
        "type": "p",
        "text": "Nedan följer sex frågor tillsammans med vad ett användbart svar brukar innehålla och vad som bör göra er uppmärksamma. Bedömningen av svaren är minst lika viktig som frågan."
      },
      {
        "type": "h3",
        "text": "1. Vem levererar, och vad heter de?"
      },
      {
        "type": "p",
        "text": "Begär namn och CV på lösningsarkitekt och projektledare, inte bolagets samlade meritlista. Fråga sedan om ni får skriva in dem i avtalet med en rimlig utbytesklausul."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Namngivna personer, deras tidigare projekt och hur stor del av sin tid de har hos er.",
          "En vilja att reglera bemanningen i avtalet."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Svaret handlar om hur många konsulter bolaget har totalt.",
          "Namnen kommer först vid projektstart.",
          "Efter tre möten har ni bara träffat säljorganisationen."
        ]
      },
      {
        "type": "h3",
        "text": "2. Får vi välja referenser själva?"
      },
      {
        "type": "p",
        "text": "Kundcase som partnern presenterar är alltid utvalda. Be i stället om en lista över samtliga kunder i er bransch och storleksklass de senaste tre åren, och välj själva två att ringa."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En full lista, inklusive minst ett projekt som var besvärligt.",
          "Kontaktuppgifter till någon som fortfarande är kund, och gärna någon som inte längre är det."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Endast publicerade kundcase erbjuds i stället för samtal.",
          "Referenserna finns i en annan bransch eller en annan storleksklass än er."
        ]
      },
      {
        "type": "h3",
        "text": "3. Berätta om ett projekt som gick fel"
      },
      {
        "type": "p",
        "text": "Vad hände, vad kostade det, och vad förändrade ni efteråt? Partners som levererat länge har alla haft projekt som spårat ur."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett konkret fall med tidsangivelse och storleksordning på avvikelsen.",
          "Vad de ändrade i sitt eget arbetssätt som följd."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Det har aldrig hänt.",
          "Hela orsaken läggs på kunden."
        ]
      },
      {
        "type": "h3",
        "text": "4. Hur ser ni på anpassningar?"
      },
      {
        "type": "p",
        "text": "Business Central och Finance & Supply Chain Management uppdateras löpande av Microsoft. Varje avsteg från standard är något ni ska förvalta i många år framåt."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En vilja att utmana era krav och föreslå standardflödet först.",
          "En uppskattning av hur många anpassningar en jämförbar kund har, och vad de kostar att förvalta per år."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Allt ni önskar går att bygga.",
          "Antalet egna anpassningar presenteras som en styrka."
        ]
      },
      {
        "type": "h3",
        "text": "5. Vad händer efter go-live?"
      },
      {
        "type": "p",
        "text": "Be om att få se förvaltningsmodellen skriftligt redan under utvärderingen. Detta är den fas ni kommer att leva i längst, och den granskas nästan aldrig innan avtal."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Namngiven kundansvarig, svarstider och prismodell.",
          "En beskrivning av hur vidareutveckling beställs, prioriteras och prissätts."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Supporten beskrivs enbart som en e-postadress eller ett ärendesystem.",
          "Förvaltningsavtalet presenteras först efter att projektavtalet är skrivet."
        ]
      },
      {
        "type": "h3",
        "text": "6. Hur ser estimatet ut per fas, med antaganden?"
      },
      {
        "type": "p",
        "text": "Ett totalpris utan antaganden går inte att granska. Be om nedbrytning per fas tillsammans med de antaganden estimatet vilar på: antal legala enheter, antal integrationer, datamängd och hur mycket ni själva gör."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Uttryckliga antaganden och vad som händer när ett av dem inte håller.",
          "En tydlig gräns mellan fast och löpande, och en beskriven ändringshantering."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "En klumpsumma utan nedbrytning.",
          "Estimatet sjunker påtagligt när ni nämner att ni jämför med en annan leverantör."
        ]
      },
      {
        "type": "h2",
        "text": "Meriter mäter något annat än du tror"
      },
      {
        "type": "p",
        "text": "Certifieringar, utmärkelser och partnerstatus är inte värdelösa, men de mäter sällan det köparen tror att de mäter."
      },
      {
        "type": "ul",
        "items": [
          "Certifieringar är individuella och knutna till personer, inte till bolaget. Frågan är inte hur många certifieringar partnern har totalt, utan om de certifierade personerna är de som blir era.",
          "Microsofts partnerbeteckningar bygger sedan 2022 på Solutions Partner-designationer. Begreppet guldkompetens finns inte längre, och förekommer det fortfarande i en offert är det ett tecken på att materialet inte hållits uppdaterat.",
          "Partner of the Year och liknande utmärkelser delas ut av Microsoft och speglar partnerns prestation i förhållande till Microsoft. De är inte kundnöjdhetsmätningar.",
          "Metodik: Sure Step är avvecklad. Microsofts aktuella implementationsvägledning är strukturerad kring Success by Design. FastTrack för Dynamics 365 är Microsofts kundframgångs- och rådgivningsprogram för kvalificerade projekt och ska inte beskrivas som partnerns egen metodik eller certifiering. En partner som fortfarande beskriver Sure Step som sin aktuella metodik säger något om hur ofta materialet ses över."
        ]
      },
      {
        "type": "h2",
        "text": "Vad som skiljer per applikationsområde"
      },
      {
        "type": "h3",
        "text": "Business Central"
      },
      {
        "type": "p",
        "text": "Här är branschpassningen den tyngsta faktorn, tillsammans med storleksmatchningen. Ett bolag med tjugo användare som anlitar en av de största systemintegratörerna riskerar att bli en liten kund med juniora konsulter. Omvänt saknar en partner med fem anställda ofta uthållighet vid en internationell utrullning. Fråga också om partnern har egna tilläggsappar och vad som händer med dem om ni byter partner."
      },
      {
        "type": "h3",
        "text": "Finance & Supply Chain Management"
      },
      {
        "type": "p",
        "text": "Projekten är stora och löper över lång tid, vilket gör lösningsarkitekten till projektets viktigaste person. Kompetensen är dessutom delad: ekonomiflöden och logistik- eller produktionsflöden hanteras sällan väl av samma konsult, så granska teamet som helhet. Fråga hur leveransmodellen ser ut mellan konsulter i Sverige och eventuella resurser i andra länder, och var i den mixen analysen och designen görs. Det är där missförstånd blir dyra."
      },
      {
        "type": "p",
        "text": "Segmentet skiljer sig tillräckligt mycket för att förtjäna en egen genomgång: se hur du väljer partner för Finance & Supply Chain Management."
      },
      {
        "type": "h3",
        "text": "Customer Engagement"
      },
      {
        "type": "p",
        "text": "Den avgörande risken är inte teknisk utan handlar om användning. Ett CRM som säljarna eller handläggarna kringgår ger sämre datakvalitet än det system ni lämnade. Fråga därför hur partnern arbetar med förändringsledning och hur de mäter faktisk användning efter lansering. Fråga också hur de ser på gränsen mellan standardapp och egenbyggd app i Power Platform, eftersom den gränsen numera avgör både kostnad och förvaltningsbarhet."
      },
      {
        "type": "p",
        "text": "Säljstöd och kundservice är i praktiken två olika upphandlingar med olika partnerfält. Vi behandlar dem var för sig i guiderna om Dynamics 365 Sales respektive Customer Service och Field Service."
      },
      {
        "type": "h2",
        "text": "Om AI och Copilot"
      },
      {
        "type": "p",
        "text": "Nästan alla partners beskriver idag att de arbetar med Copilot och agenter. Betydligt färre kan beskriva vad de faktiskt har satt i produktion hos en kund."
      },
      {
        "type": "p",
        "text": "Frågan att ställa är därför inte om partnern arbetar med AI, utan vilken funktion de har driftsatt, hos hur många kunder, och vad kunden fick ut av det. Ett konkret exempel är mer upplysande än en hel presentation. Saknas exempel är det inget diskvalificerande skäl i sig, men då ska det inte heller vägas in som en styrka."
      },
      {
        "type": "h2",
        "text": "Vanliga misstag i urvalsprocessen"
      },
      {
        "type": "ul",
        "items": [
          "Att jämföra timpriser. Skillnaden i timpris mellan svenska partners är liten jämfört med skillnaden i antal timmar ett projekt tar.",
          "Att låta säljmötet vara utvärderingen. Personen som presenterar är sällan personen som levererar.",
          "Att bygga kravlistan för detaljerat för tidigt. En kravlista på flera hundra rader tvingar fram anpassningar som ni sedan får förvalta.",
          "Att hoppa över förvaltningsfasen i utvärderingen. Den utgör den största delen av totalkostnaden över tid.",
          "Att inte ha intern samsyn innan ni går ut. Om ekonomi, IT och verksamhet vill olika saker kommer partnern att välja åt er."
        ]
      },
      {
        "type": "h2",
        "text": "En anmärkning om källor"
      },
      {
        "type": "p",
        "text": "Merparten av det som publiceras på svenska om hur man väljer Dynamics 365-partner är skrivet av partners. Materialet är ofta kompetent, men det är samtidigt skrivet av en part som har ett intresse i utfallet, och kriterierna hamnar därför gärna nära den egna profilen."
      },
      {
        "type": "p",
        "text": "Det är inget att moralisera över. Det är en anledning att läsa flera källor, och att fråga sig vem som har nytta av att just de kriterierna väger tyngst."
      },
      {
        "type": "h2",
        "text": "Nästa steg"
      },
      {
        "type": "p",
        "text": "Om ni står inför en upphandling och vill komma vidare utan att först boka in fem säljmöten kan ni jämföra svenska Dynamics 365-partners per applikationsområde, bransch och storlek, och ta med en kortare lista in i era egna samtal."
      },
      {
        "type": "p",
        "text": "Vill ni ha struktur på själva utvärderingen är utgångspunkten enkel. Bestäm vilka tre kriterier som väger tyngst för er innan ni träffar någon leverantör, och håll fast vid dem. Det är den enskilt största skillnaden mellan en upphandling som går att försvara och en som avgörs av vem som gjorde bäst intryck i rummet."
      }
    ],
    "about": "d365.se är en köparsidig svensk guide för organisationer som utvärderar Microsoft Dynamics 365. Vi säljer varken system eller implementation. Vi beskriver marknadens partners på jämförbara grunder så att köparen kan fatta ett beslut som håller."
  },
  "valja-business-central-partner": {
    "h1": "Hur väljer du rätt partner för Dynamics 365 Business Central?",
    "blocks": [
      {
        "type": "p",
        "text": "Kort svar: partnerfältet är bredast här av alla Dynamics-områden, vilket gör storleksmatchningen till den viktigaste gallringen. Ni ska vara en kund som syns hos leverantören, inte den minsta hos en stor eller den största hos en liten. Utgå sedan från vilket system ni lämnar, ta reda på vilka appar som ingår och vem som äger dem, och kontrollera hur partnern hanterar Business Centrals två stora uppdateringscykler per år och de mindre löpande uppdateringarna."
      },
      {
        "type": "p",
        "text": "Den här guiden är skriven av d365.se. Vi implementerar inte Dynamics 365 och vi säljer inga licenser. Vi finns för att köparen ska kunna jämföra partners på samma grunder."
      },
      {
        "type": "p",
        "text": "Den gäller specifikt Business Central. För urvalsprocessen i stort, oavsett applikation, se vår guide om hur du hittar rätt partner för Dynamics 365 i Sverige."
      },
      {
        "type": "h2",
        "text": "Vad som utmärker den här upphandlingen"
      },
      {
        "type": "p",
        "text": "Business Central är Microsofts affärssystem för små och medelstora bolag, med rötter i Navision. d365.se bedömer att det tillkommer i storleksordningen femhundra nya affärer per år i Sverige och att projekten ofta börjar kring trehundratusen kronor. Det gör det till det vanligaste Dynamics-införandet i landet. Siffrorna är d365.se:s marknadsbedömning, uppdaterad i september 2026, inte officiell Microsoft-statistik."
      },
      {
        "type": "p",
        "text": "Partnerfältet är samtidigt det bredaste. Det finns dussintals svenska partners, från bolag med några få konsulter till nordiska koncerner med hundratals. Det är goda nyheter för er förhandlingsposition och dåliga nyheter för urvalet, eftersom skillnaden mellan kandidaterna sällan syns i offerten."
      },
      {
        "type": "p",
        "text": "Den låga ingångskostnaden är upphandlingens största fälla. Ett Business Central-införande går ofta att komma igång med relativt snabbt, och just därför granskas partnern ibland lättvindigt. Kostnaden för ett svagt val syns inte alltid i projektbudgeten. Den syns senare i förvaltningsavgifter, tillägg och anpassningar som ska underhållas över tid."
      },
      {
        "type": "h2",
        "text": "Steg 1: Utgå från vad ni ska ersätta"
      },
      {
        "type": "p",
        "text": "Kravlistan blir ungefär densamma oavsett utgångsläge, men arbetet som ska utföras skiljer sig, och därmed vilken partner som passar."
      },
      {
        "type": "table",
        "head": [
          "Utgångsläge",
          "Det partnern framför allt måste kunna bevisa"
        ],
        "rows": [
          [
            "Dynamics NAV eller Navision",
            "Att de flyttat NAV-kunder till Business Central i molnet flera gånger. Hantering av gamla anpassningar, dimensioner och historik, samt ett resonemang om vad som inte ska följa med."
          ],
          [
            "Mindre ekonomisystem som ni vuxit ur",
            "Förmåga att bygga processer som inte finns idag: lager, order, projekt eller produktion. Här är det verksamhetens arbetssätt som ska formas, inte bara data som ska flyttas."
          ],
          [
            "Annat medelstort affärssystem",
            "Erfarenhet av just den migreringen, och en ärlig genomgång av vad ni kommer att sakna. Det finns alltid något som det gamla systemet gjorde bättre."
          ],
          [
            "Egenutvecklat eller branschsystem",
            "Hur de avgör vad som ska lösas i standard, vad som kräver en app och vad som inte hör hemma i affärssystemet alls. Detta är det svåraste utgångsläget att estimera."
          ],
          [
            "Flera bolag med olika system",
            "En mall som kan återanvändas mellan bolagen, och erfarenhet av koncernstruktur och samredovisning i Business Central."
          ]
        ]
      },
      {
        "type": "p",
        "text": "Utgångsläget påverkar också hur ni bör läsa ett estimat. Ett byte från NAV kan se billigt ut eftersom mycket känns igen, men den gamla lösningens anpassningar är ofta det som drar tid. Ett byte från ett litet ekonomisystem ser dyrt ut, men mycket av kostnaden är verksamhetens eget arbete med processer som inte funnits förut."
      },
      {
        "type": "h2",
        "text": "Steg 2: Matcha storleken"
      },
      {
        "type": "p",
        "text": "Detta är den enskilt viktigaste gallringen i Business Central-segmentet, och den som är lättast att göra fel."
      },
      {
        "type": "p",
        "text": "Väljer ni en betydligt större partner än ni själva är riskerar ni att bli en liten kund: juniora konsulter, låg prioritet i förvaltningen och en kundansvarig som byts ut. Väljer ni en mycket liten partner får ni ofta seniora personer och stort engagemang, men sårbarhet om en nyckelperson slutar, och begränsad uthållighet om ni växer eller ska ut i fler länder."
      },
      {
        "type": "p",
        "text": "Ställ två frågor som ger besked snabbt:"
      },
      {
        "type": "ul",
        "items": [
          "Var i er kundstock skulle vi hamna storleksmässigt? En partner som svarar ärligt på det säger också något om hur mycket uppmärksamhet ni kommer att få.",
          "Hur många kunder har den konsult som blir vår i sin förvaltningsportfölj? I det här segmentet bär en konsult ofta många kunder samtidigt, och det avgör svarstiderna i praktiken."
        ]
      },
      {
        "type": "p",
        "text": "Geografin väger mindre än den brukade, men inte noll. Under design och driftsättning är det värt en del att kunna träffas."
      },
      {
        "type": "h2",
        "text": "Steg 3: Standard, appar och anpassningar"
      },
      {
        "type": "p",
        "text": "Business Central byggs ut med tillägg, inte genom ändringar i systemets kärna. Det låter som en teknisk detalj men styr både kostnad och rörlighet."
      },
      {
        "type": "p",
        "text": "Tre olika saker brukar blandas ihop i en offert, och de har helt olika konsekvenser:"
      },
      {
        "type": "ul",
        "items": [
          "Konfiguration i standard. Följer normalt med genom Microsofts uppdateringar och kan vanligtvis förvaltas vidare av en annan kvalificerad Business Central-partner. Detta bör vara huvuddelen av lösningen.",
          "Färdiga appar från Microsofts kommersiella marknadsplats eller från en ISV. Licensmodellen kan vara per användare, per tenant eller bygga på andra mått. En generell ISV-app kan normalt användas vidare även om ni byter implementationspartner, men kontrollera licensavtal, supportansvar och om appen eller avtalet är knutet till den nuvarande partnern.",
          "Anpassningar byggda enbart för er. Kan vara helt rätt, men de ska underhållas av någon vid varje uppdatering, och den någon är i praktiken oftast den som byggde dem."
        ]
      },
      {
        "type": "p",
        "text": "Be om en uppdelning i skrift av vad som är vad, per funktionsområde. Många partners har egna branschappar, och det är ofta det de faktiskt säljer. Det behöver inte vara ett problem: en genomarbetad branschapp kan spara mycket. Men ni bör veta att den är där, vad den kostar löpande och vad som händer med den om samarbetet tar slut."
      },
      {
        "type": "h2",
        "text": "Steg 4: Uppdateringarna två gånger om året"
      },
      {
        "type": "p",
        "text": "Microsoft har två stora uppdateringscykler för Business Central per år, med större versioner i april och oktober. Därutöver kommer mindre uppdateringar löpande, normalt månadsvis. I molnversionen kan ni schemalägga en större uppdatering inom det tillgängliga uppdateringsfönstret, men ni kan inte välja bort att tjänsten hålls uppdaterad. Det är en tydlig skillnad mot äldre affärssystem och en fråga där skillnaden mellan partners märks tidigt efter driftsättning."
      },
      {
        "type": "p",
        "text": "Fråga varje kandidat hur de arbetar med detta: om de har en testmiljö där er lösning kontrolleras innan uppdateringen slår igenom, vilka flöden som testas, om det ingår i förvaltningsavtalet eller debiteras separat, och hur de informerar er om ny funktionalitet som ni faktiskt kan ha nytta av."
      },
      {
        "type": "p",
        "text": "En partner som inte har en rutin här kommer att hantera varje uppdatering som en incident, och ni betalar för den."
      },
      {
        "type": "h2",
        "text": "Steg 5: Frågor att ställa, och hur svaren ska läsas"
      },
      {
        "type": "p",
        "text": "Följande frågor är formulerade för att inte ha ett självklart bra svar. Bedömningen av svaret är minst lika viktig som frågan."
      },
      {
        "type": "h3",
        "text": "1. Hur många Business Central-kunder har ni satt i drift de senaste två åren, och hur många liknar oss?"
      },
      {
        "type": "p",
        "text": "Andra delen av frågan är den viktiga. Antalet kunder totalt säger lite när fältet är så brett."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett tal, med kunder i er storleksklass och bransch som går att kontakta.",
          "En åtskillnad mellan nya införanden och övertagna förvaltningar."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Svaret glider över i bolagets historik i Navision.",
          "Alla referenser är betydligt större eller mindre än ni."
        ]
      },
      {
        "type": "h3",
        "text": "2. Vilka appar ingår, vem äger dem och vad kostar de löpande?"
      },
      {
        "type": "p",
        "text": "Detta avgör både månadskostnaden och hur låsta ni blir."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En lista med leverantör, avgift per användare och månad, och vem ni tecknar avtal med.",
          "Ett rakt besked om vad som händer med varje app om ni byter partner."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Partnerns egna appar presenteras som en del av lösningen utan separat prislapp.",
          "Kostnaderna framgår först i avtalsbilagorna."
        ]
      },
      {
        "type": "h3",
        "text": "3. Hur mycket blir konfiguration och hur mycket blir egen kod?"
      },
      {
        "type": "p",
        "text": "Se steg 3. Frågan avgör vad förvaltningen kostar över tid."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En uppdelning per funktionsområde, i skrift.",
          "Förslag på var ni bör anpassa er efter standard i stället för tvärtom, med motivering."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Allt ni önskar går att bygga, utan invändningar.",
          "Mängden egen kod presenteras enbart som en styrka."
        ]
      },
      {
        "type": "h3",
        "text": "4. Vem blir vår konsult, och hur många kunder har den personen?"
      },
      {
        "type": "p",
        "text": "I det här segmentet är det sällan ett stort team. Ofta är det en eller två personer, och de personerna är i praktiken hela leveransen."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Namn, erfarenhet och ett möte innan avtal.",
          "Ett ärligt besked om portföljstorlek och vad som händer vid semester och sjukdom."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Konsulten tillsätts efter avtalstecknande.",
          "Ni har bara träffat en säljare efter flera möten."
        ]
      },
      {
        "type": "h3",
        "text": "5. Hur hanterar ni Microsofts uppdateringar?"
      },
      {
        "type": "p",
        "text": "Se steg 4. Svaret ska innehålla en rutin, inte en princip."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En beskriven testrutin med miljö och vilka flöden som kontrolleras.",
          "Besked om det ingår i avtalet eller debiteras."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Uppdateringar beskrivs som något Microsoft sköter åt er.",
          "Frågan har inte kommit upp hos andra kunder."
        ]
      },
      {
        "type": "h3",
        "text": "6. Hur ser migreringen från vårt nuvarande system ut?"
      },
      {
        "type": "p",
        "text": "Datamigrering är den vanligaste orsaken till att en driftsättning skjuts fram, även i mindre projekt."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Besked om vad som flyttas och vad som stannar: saldon, öppna poster, historik och stamdata behandlas olika.",
          "Antal testmigreringar och när den första sker."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "All historik utlovas utan diskussion om vad det kostar.",
          "Datakvalitet nämns inte som ert ansvar över huvud taget."
        ]
      },
      {
        "type": "h3",
        "text": "7. Vad kan vi göra själva utan att ringa er?"
      },
      {
        "type": "p",
        "text": "I ett mindre bolag är svaret på den frågan avgörande för hur systemet upplevs i vardagen."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En avgränsning av vad en superanvändare hos er kan ändra själv, och utbildning för det.",
          "Dokumentation som ni äger och kan ge till någon annan."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Varje rapport och fältändring kräver en beställning.",
          "Ingen intern superanvändare planeras in i projektet."
        ]
      },
      {
        "type": "h2",
        "text": "Meriter som mäter något annat än du tror"
      },
      {
        "type": "ul",
        "items": [
          "Erfarenhet av Navision eller NAV är inte samma sak som erfarenhet av Business Central i molnet. Utbyggnadsmodellen och uppdateringstakten är andra.",
          "Certifieringar är knutna till personer, inte till bolag. Frågan är om de certifierade personerna är de som blir era.",
          "Microsofts partnerbeteckningar bygger sedan 2022 på Solutions Partner-designationer. Begreppet guldkompetens finns inte längre.",
          "Utmärkelser från Microsoft speglar partnerns förhållande till Microsoft. De är inte kundnöjdhetsmätningar.",
          "Antalet konsulter i bolaget säger ingenting om hur många som är tillgängliga när ert projekt startar."
        ]
      },
      {
        "type": "h2",
        "text": "Vad som brukar gå fel i själva urvalet"
      },
      {
        "type": "ul",
        "items": [
          "Offerter jämförs på pris utan att appar och löpande avgifter räknas med, vilket gör den billigaste offerten dyrast över tre år.",
          "Kravlistan beskriver dagens arbetssätt i detalj, vilket bygger in gamla problem i det nya systemet.",
          "Förvaltningen lämnas utanför upphandlingen och prissätts när ni inte längre har något förhandlingsläge.",
          "Ingen intern superanvändare utses, vilket gör er beroende av partnern för småsaker.",
          "Storleksmatchningen bedöms aldrig, trots att den är den faktor som skiljer kandidaterna mest.",
          "Beslutet fattas utan att någon som ska arbeta i systemet dagligen har provat det."
        ]
      },
      {
        "type": "h2",
        "text": "En anmärkning om källor"
      },
      {
        "type": "p",
        "text": "Merparten av det som publiceras på svenska om hur man väljer partner för Dynamics 365 är skrivet av partners. Materialet är ofta kompetent, men det är skrivet av en part med ett intresse i utfallet, och kriterierna hamnar därför gärna nära den egna profilen."
      },
      {
        "type": "p",
        "text": "Läs flera källor, och fråga er vem som har nytta av att just de kriterierna väger tyngst."
      },
      {
        "type": "h2",
        "text": "Nästa steg"
      },
      {
        "type": "p",
        "text": "Skriv ner vilket system ni lämnar, hur många användare ni har och vad som ska vara löst om ett år. Med de tre svaren blir leverantörssamtalen kortare, och skillnaderna mellan kandidaterna syns tidigare."
      },
      {
        "type": "p",
        "text": "Är verksamheten på väg mot koncernstruktur i flera länder kan det vara värt att samtidigt förstå nivån ovanför: se guiden om partnerval för Finance & Supply Chain Management. Ska ni även se över CRM finns separata guider om Dynamics 365 Sales och Customer Service och Field Service."
      },
      {
        "type": "p",
        "text": "På d365.se kan ni jämföra svenska Dynamics 365-partners per applikationsområde, bransch och storlek, och avgränsa fältet innan ni börjar boka möten."
      }
    ],
    "about": "d365.se är en köparsidig svensk guide för organisationer som utvärderar Microsoft Dynamics 365. Vi säljer varken system eller implementation. Vi beskriver marknadens partners på jämförbara grunder så att köparen kan fatta ett beslut som håller."
  },
  "valja-finance-supply-chain-partner": {
    "h1": "Hur väljer du rätt partner för Dynamics 365 Finance & Supply Chain Management?",
    "blocks": [
      {
        "type": "p",
        "text": "Kort svar: börja inte med partnerns meritlista, utan med vad ni ska lämna. En koncern som byter från AX 2012 ställer helt andra krav på leverantören än en som lämnar SAP eller konsoliderar fem olika system. Fältet av partners med verklig kapacitet är litet, så tyngdpunkten i utvärderingen ligger på personerna i teamet, på hur leveransen är organiserad mellan länder, och på vem som förvaltar lösningen när projektet är slut."
      },
      {
        "type": "p",
        "text": "Den här guiden är skriven av d365.se. Vi implementerar inte Dynamics 365 och vi säljer inga licenser. Vi finns för att köparen ska kunna jämföra partners på samma grunder."
      },
      {
        "type": "p",
        "text": "Den gäller specifikt Finance & Supply Chain Management. För urvalsprocessen i stort, oavsett applikation, se vår guide om hur du hittar rätt partner för Dynamics 365 i Sverige."
      },
      {
        "type": "h2",
        "text": "Vad som utmärker den här upphandlingen"
      },
      {
        "type": "p",
        "text": "Finance & Supply Chain Management är Microsofts enterprisegren, med rötter i Axapta och senare AX. Systemet är byggt för koncerner med flera legala enheter, komplexa varuflöden och verksamhet i flera länder. Det märks i allt: projektens storlek, tidsåtgången, antalet inblandade och hur få leverantörer som faktiskt kan leverera."
      },
      {
        "type": "p",
        "text": "Ett par storleksordningar som ram, och som är d365.se:s bedömning av den svenska marknaden. Projekten börjar normalt kring fem miljoner kronor och löper över flera år räknat från förstudie till stabil drift. Vi bedömer att det finns i storleksordningen hundra kundkoncerner i Sverige som kör systemet eller dess föregångare, och att det tillkommer i storleksordningen femtio nya affärer per år. d365.se har identifierat fler aktörer med F&SCM-kompetens, men för större svenska flerbolags- eller internationella end-to-end-program bedömer vi att gruppen med tillräcklig kapacitet är ungefär ett tiotal. Siffrorna är vår marknadsbedömning, uppdaterad i september 2026, inte officiell Microsoft-statistik."
      },
      {
        "type": "p",
        "text": "Det får en konsekvens som sällan uttalas: rena nyförsäljningsaffärer är ovanliga. Många partners söker sig i stället in i befintliga kunder genom konsultuthyrning, genom ett bättre förvaltningsavtal eller genom att ta över vidareutvecklingen, och breddar sedan uppdraget land för land."
      },
      {
        "type": "p",
        "text": "För er som köpare betyder det två saker. Konkurrensen om ert projekt är mindre än ni tror, vilket sänker er förhandlingsposition. Och den partner ni väljer kommer sannolikt att vara kvar hos er i många år, eftersom byte av leverantör mitt i en installation av den här storleken är dyrt och riskabelt. Utvärderingen behöver därför vara skarpare, inte mildare, än vid en mindre upphandling."
      },
      {
        "type": "h3",
        "text": "En terminologisk sak som påverkar scopet"
      },
      {
        "type": "p",
        "text": "Finance och Supply Chain Management är två separata applikationer som licensieras var för sig, även om marknaden och de flesta partners talar om dem som ett system. Klargör tidigt vilka av modulerna ni faktiskt ska ha, eftersom det påverkar både licenskostnad och vilken kompetens som behövs i teamet. Detsamma gäller angränsande applikationer som Project Operations och Human Resources, som ofta smyger in i scopet under förstudien."
      },
      {
        "type": "h2",
        "text": "Steg 1: Utgå från vad ni ska ersätta"
      },
      {
        "type": "p",
        "text": "Det här är den viktigaste avgränsningen, och den som oftast hoppas över. Kravlistan blir ungefär densamma oavsett utgångsläge, men arbetet som ska utföras skiljer sig fundamentalt, och därmed också vilken partner som passar."
      },
      {
        "type": "table",
        "head": [
          "Utgångsläge",
          "Det partnern framför allt måste kunna bevisa"
        ],
        "rows": [
          [
            "AX 2012 R2/R3 eller AX 2009",
            "För AX 2012 R2/R3: erfarenhet av Microsofts stödda uppgraderingsväg, kodanalys, extensions och datakonvertering. För AX 2009: erfarenhet av migrationsprojekt till Finance and Operations. I båda fallen ska partnern kunna visa hur gamla anpassningar och ISV-beroenden värderas innan de tas med."
          ],
          [
            "SAP, IFS eller annat större ERP",
            "Processdesign från grunden och migrering utan gemensam datamodell. Ingen legacykod att ta hänsyn till, men betydligt tyngre arbete med verksamhetens processer och begreppsapparat."
          ],
          [
            "Flera system i koncernen",
            "Förmåga att bygga en kärnmall och rulla ut den. Lokaliseringar, legala enheter, koncerngemensamma processer och en styrmodell som håller mellan bolagen."
          ],
          [
            "Business Central som vuxit ur sin roll",
            "Att de vågar ifrågasätta bytet. Skälet är ofta ett fåtal processer, inte hela systemet, och en partner som gärna säljer uppåt är inte den som utreder det åt er."
          ]
        ]
      },
      {
        "type": "h3",
        "text": "Om ni lämnar AX 2012 eller AX 2009"
      },
      {
        "type": "p",
        "text": "Det här är det vanligaste utgångsläget i Sverige. AX 2012 ligger sedan flera år utanför Microsofts ordinarie support, och de flesta som fortfarande kör det har skjutit beslutet framför sig av goda skäl: systemet fungerar, det är tungt anpassat och det är djupt integrerat i verksamheten."
      },
      {
        "type": "p",
        "text": "För AX 2012 R2 och R3 finns en Microsoft-stödd uppgraderingsväg till Finance and Operations som kan ta med både data och kod. Det betyder däremot inte att allt bör flyttas oförändrat. En central del av förstudien är att avgöra vad som ska uppgraderas, vad som ska byggas om och vilka gamla anpassningar och processer som bör lämnas kvar. AX 2009 följer inte samma stödda upgrade path och ska därför bedömas som ett migrationsscenario med andra förutsättningar."
      },
      {
        "type": "p",
        "text": "Det ni ska leta efter är en partner som har gjort just den här resan flera gånger, och som kan visa hur de går tillväga för att avgöra vilka gamla anpassningar som ska med. Ett vanligt och kostsamt misstag är att bygga tillbaka allt som fanns, av rädsla för att någon ska sakna något."
      },
      {
        "type": "p",
        "text": "Notera också att lång erfarenhet av AX inte automatiskt är samma sak som djup erfarenhet av dagens Finance och Supply Chain Management. Plattform, extensionsmodell, drift och uppdateringsmodell har förändrats. Värdera därför hur många moderna implementationer, uppgraderingar och go-live personen faktiskt har genomfört, inte bara antalet år i AX."
      },
      {
        "type": "h3",
        "text": "Om ni lämnar SAP, IFS eller ett annat större ERP"
      },
      {
        "type": "p",
        "text": "Här finns ingen legacykod att förhålla sig till, vilket låter enklare än det är. Arbetet flyttar i stället till processdesign och till att översätta verksamhetens begrepp till en ny struktur. Kontoplan, produktdata, kundstruktur och lagerlogik ser sällan ut som ni är vana vid, och organisationen kommer att uppleva det."
      },
      {
        "type": "p",
        "text": "Partnern behöver här ha erfarenhet av att leda den typen av översättning, inte bara av att konfigurera systemet. Fråga särskilt hur de arbetar med verksamhetens nyckelanvändare under designfasen, och hur mycket av den tiden som ligger hos er."
      },
      {
        "type": "h3",
        "text": "Om ni konsoliderar flera system i en koncern"
      },
      {
        "type": "p",
        "text": "Då är det inte ett projekt, det är ett program. Frågan blir vad som ska vara gemensam kärnmall och vad varje bolag får bestämma själv, och det är en styrningsfråga lika mycket som en teknisk fråga."
      },
      {
        "type": "p",
        "text": "En partner som ska leverera detta behöver kunna beskriva sin mall- och utrullningsmodell konkret: hur mallen förvaltas, hur avvikelser hanteras, hur lokala krav i olika länder byggs in, och vad ett andra och tredje land faktiskt kostar jämfört med det första. Be om siffror från en tidigare kund, inte om en principbeskrivning."
      },
      {
        "type": "h3",
        "text": "Om ni tycker att Business Central blivit för litet"
      },
      {
        "type": "p",
        "text": "Detta är utgångsläget där vi oftast ser fel slutsats. Bristen sitter inte sällan i ett fåtal processer, i integrationer som aldrig blev färdiga, eller i att systemet konfigurerades för en verksamhet som ni sedan växte ifrån."
      },
      {
        "type": "p",
        "text": "Ett byte uppåt löser det, men till en helt annan kostnad och komplexitet än att åtgärda det som faktiskt skaver. Den partner ni frågar har normalt ett intresse i svaret. Se därför till att analysen görs av någon som tjänar lika mycket på båda utfallen, eller gör den internt."
      },
      {
        "type": "p",
        "text": "Om slutsatsen blir att ni stannar kvar är det i stället partnervalet på den nivån som ska ses över. Vi går igenom det i guiden om hur du hittar rätt partner för Dynamics 365 i Sverige."
      },
      {
        "type": "h2",
        "text": "Steg 2: Bestäm om det är ett projekt eller ett program"
      },
      {
        "type": "p",
        "text": "Ett F&SCM-införande i ett bolag och en utrullning över åtta bolag i fem länder är inte samma sak. Ändå upphandlas de ofta likadant, och avvikelserna visar sig först när land nummer två ska igång."
      },
      {
        "type": "p",
        "text": "Klargör innan ni går ut:"
      },
      {
        "type": "ul",
        "items": [
          "Hur många legala enheter och länder omfattas, och i vilken ordning?",
          "Vad ska vara gemensamt och vad får skilja sig åt mellan bolagen?",
          "Vem hos er äger mallen efter första go-live?",
          "Ska partnern leverera alla länder, eller ska ni kunna använda lokala resurser i vissa?"
        ]
      },
      {
        "type": "p",
        "text": "Svaren styr vilken typ av leverantör som är rimlig. En partner utan egen närvaro utanför Norden kan fortfarande leverera en utrullning, men då ska det framgå hur, och vilka de samarbetar med."
      },
      {
        "type": "h2",
        "text": "Steg 3: Bygg en longlist utan att göra fältet onödigt smalt"
      },
      {
        "type": "p",
        "text": "Det sägs ofta att F&SCM kräver en av de globala systemintegratörerna. Det stämmer inte för svenska förhållanden. De största aktörerna har djupa resurser och global räckvidd, men det finns också mellanstora nordiska partners med lång F&SCM-historik och betydligt högre andel seniora konsulter i sina team."
      },
      {
        "type": "p",
        "text": "Det som verkligen sållar är inte bolagets storlek utan tre saker:"
      },
      {
        "type": "ul",
        "items": [
          "Antalet go-live på Finance and Operations de senaste tjugofyra månaderna. Inte antalet kunder totalt, och inte AX-historiken.",
          "Om de har levererat något som liknar ert utgångsläge, alltså samma sorts byte från samma sorts system.",
          "Om de kan bemanna er med seniora personer utan att tömma ett annat pågående projekt."
        ]
      },
      {
        "type": "p",
        "text": "Fyra till sex kandidater är ett rimligt utgångsläge. Fler blir svårt att utvärdera på det djup som krävs, och färre ger er ingen jämförelse alls."
      },
      {
        "type": "h2",
        "text": "Steg 4: Utvärdera teamet, inte bolaget"
      },
      {
        "type": "p",
        "text": "I ett projekt av den här storleken är det inte leverantören ni köper, det är ett arkitektteam. Skillnaden mellan två partners i samma prisklass sitter nästan alltid i personerna."
      },
      {
        "type": "h3",
        "text": "Lösningsarkitekten"
      },
      {
        "type": "p",
        "text": "Projektets viktigaste roll. Arkitekten binder ihop koncernens ekonomiska struktur, alltså koncernredovisning, internprissättning och gemensamma funktioner, med de operativa flödena. Begär CV, fråga vilka av personens senaste projekt som gick i produktion, och tala med arkitekten själv innan ni skriver avtal."
      },
      {
        "type": "h3",
        "text": "Uppdelningen ekonomi och supply chain"
      },
      {
        "type": "p",
        "text": "Det är ovanligt att samma konsult är stark i både den avancerade ekonomimodellen och i tung logistik eller produktion. Utvärdera därför teamet som helhet, och begär CV på dem som ska sätta upp de moduler ni faktiskt är beroende av. Har ni avancerad lagerstyrning, produktion eller global inköpslogistik ska det finnas namn kopplade till varje sådant område."
      },
      {
        "type": "h3",
        "text": "Projektledare och förändringsledare"
      },
      {
        "type": "p",
        "text": "Projektledaren bör ha drivit minst ett införande av jämförbar storlek hela vägen till stabil drift, inte bara till go-live. Förändringsledningen är inte en mjuk fråga i det här systemet: F&SCM upplevs som komplext av dem som ska arbeta i det dagligen, och adoptionen avgör om investeringen ger något."
      },
      {
        "type": "h2",
        "text": "Steg 5: Granska leveransmodellen"
      },
      {
        "type": "p",
        "text": "Nästan alla större partners kombinerar konsulter i Sverige med resurser i andra länder. Det är inte ett problem i sig, och en leverans helt bemannad med svenska seniorkonsulter blir mycket dyr utan att nödvändigtvis bli bättre."
      },
      {
        "type": "p",
        "text": "Det som avgör är var i projektet gränsen går. Analys, design och de beslut som formar lösningen bör ligga nära verksamheten och på ett språk där nyanser inte försvinner. Konfiguration, utveckling, datatvätt och testning fungerar väl att lägga hos ett etablerat center i ett annat land."
      },
      {
        "type": "p",
        "text": "Fråga rakt ut hur teamet är sammansatt, i vilka tidszoner det arbetar, och vem som skriver kravspecifikationen som utvecklarna sedan bygger efter. Det är i den överlämningen de dyra missförstånden uppstår."
      },
      {
        "type": "h2",
        "text": "Steg 6: Frågor att ställa, och hur svaren ska läsas"
      },
      {
        "type": "p",
        "text": "Följande frågor är formulerade för att inte ha ett självklart bra svar. Bedömningen av svaret är minst lika viktig som frågan."
      },
      {
        "type": "h3",
        "text": "1. Hur många go-live har ni haft på Finance and Operations de senaste två åren?"
      },
      {
        "type": "p",
        "text": "Detta är den enskilt mest informativa frågan i hela utvärderingen, och den som oftast besvaras svävande."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett tal, med kunder som går att namnge och gärna kontakta.",
          "En åtskillnad mellan nya införanden, utrullningar till ytterligare länder och övertagna förvaltningar."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Svaret glider över i antalet kunder totalt eller i bolagets historik i AX.",
          "Referenserna ligger flera år tillbaka."
        ]
      },
      {
        "type": "h3",
        "text": "2. Vem blir vår lösningsarkitekt, och får vi träffa hen nu?"
      },
      {
        "type": "p",
        "text": "Arkitekten är den person vars beslut ni lever med i tio år. Att träffa personen först vid uppstart är för sent."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett namn, ett CV och ett möte utan säljare i rummet.",
          "Besked om hur stor del av sin tid personen har på er, och vad hen gör i övrigt."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Arkitekten tillsätts efter avtalstecknande.",
          "Personen presenteras som arkitekt men har i huvudsak arbetat i AX."
        ]
      },
      {
        "type": "h3",
        "text": "3. Hur planerar ni datamigreringen, och vem äger den?"
      },
      {
        "type": "p",
        "text": "Datamigrering är ett eget projekt inuti projektet, och den vanligaste orsaken till att go-live skjuts fram."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En beskrivning av hur många testmigreringar som planeras och när den första sker.",
          "En tydlig ansvarsfördelning för datakvalitet, där en stor del rimligen ligger hos er."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Migreringen beskrivs som en teknisk aktivitet sent i projektet.",
          "Ingen skillnad görs mellan saldon, historik och stamdata."
        ]
      },
      {
        "type": "h3",
        "text": "4. Vad blir kärnmall och vad blir lokalt?"
      },
      {
        "type": "p",
        "text": "Frågan gäller alla koncerner, även de som börjar i ett land, eftersom mallen sätts vid första införandet oavsett om ni kallar den så."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En konkret modell för vad som styrs centralt och vad som får avvika.",
          "Erfarenhetssiffror på vad ett andra land kostat jämfört med det första hos en tidigare kund."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Frågan besvaras principiellt utan exempel.",
          "Allt ska vara gemensamt, utan diskussion om vad som händer när ett bolag inte kan följa mallen."
        ]
      },
      {
        "type": "h3",
        "text": "5. Hur ser teamets sammansättning ut mellan länder?"
      },
      {
        "type": "p",
        "text": "Se avsnittet om leveransmodellen ovan. Frågan ska ställas rakt och besvaras med siffror."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En fördelning per roll och fas, inte bara en total procentsats.",
          "Besked om vem som skriver kraven som utvecklarna bygger efter."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Andelen lokala konsulter presenteras hög i säljfasen och sjunker i offerten.",
          "Analysfasen bemannas övervägande med resurser som inte träffar verksamheten."
        ]
      },
      {
        "type": "h3",
        "text": "6. Vilka tilläggsapplikationer föreslår ni, och vem äger relationen?"
      },
      {
        "type": "p",
        "text": "De flesta F&SCM-lösningar innehåller appar från tredje part för exempelvis lagerstyrning, EDI, skatterapportering eller dokumenthantering."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En lista med vem som är leverantör, vad det kostar löpande och vem ni har avtal med.",
          "Ett resonemang om vad som händer med appen om ni byter implementationspartner."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Partnerns egna appar presenteras utan prisbild.",
          "Beroendena framgår först i avtalsbilagorna."
        ]
      },
      {
        "type": "h3",
        "text": "7. Hur ser förvaltningen ut, och vem gör vidareutvecklingen?"
      },
      {
        "type": "p",
        "text": "Systemet uppdateras löpande av Microsoft, och er lösning behöver följa med. Förvaltningen är den fas ni lever i längst och den där totalkostnaden avgörs."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En skriftlig förvaltningsmodell med namngiven kundansvarig, svarstider och prismodell.",
          "En plan för hur regressionstestning hanteras vid Microsofts uppdateringar.",
          "Besked om huruvida förvaltningsteamet är samma personer som projektteamet, och hur överlämningen görs."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Förvaltningsavtalet diskuteras först efter att projektavtalet är påskrivet.",
          "Vidareutveckling prissätts enbart löpande, utan någon form av prioriteringsprocess."
        ]
      },
      {
        "type": "h2",
        "text": "Meriter och begrepp som mäter något annat än du tror"
      },
      {
        "type": "ul",
        "items": [
          "FastTrack för Dynamics 365 är Microsofts kundframgångs- och rådgivningsprogram för kvalificerade projekt, levererat tillsammans med implementationspartnern och baserat på Success by Design. Det är inte en partnercertifiering eller partnermerit i sig. Erfarenhet av FastTrack, Implementation Portal och go-live readiness reviews kan däremot vara relevant när ni bedömer partnerns vana vid Microsofts implementationskrav.",
          "Microsofts partnerbeteckningar bygger sedan 2022 på Solutions Partner-designationer. Begreppet guldkompetens finns inte längre och bör inte förekomma i ett aktuellt underlag.",
          "Sure Step är avvecklad. Microsofts aktuella implementationsvägledning är strukturerad kring Success by Design. En partner som fortfarande beskriver Sure Step som sin aktuella metodik säger något oavsiktligt om hur ofta materialet ses över.",
          "Certifieringar är knutna till personer, inte till bolag. Frågan är om de certifierade personerna är de som blir era.",
          "Antalet konsulter i bolaget säger ingenting om hur många av dem som är tillgängliga när ert projekt startar."
        ]
      },
      {
        "type": "h2",
        "text": "Vad som brukar gå fel i själva urvalet"
      },
      {
        "type": "ul",
        "items": [
          "Kravspecifikationen görs för detaljerad för tidigt, vilket låser fast lösningen i den gamla världens processer och driver fram anpassningar ni sedan ska förvalta.",
          "Utvärderingen viktas mot demo och presentation. Alla kandidater i det här segmentet demonstrerar bra.",
          "Förvaltningsfasen lämnas utanför upphandlingen trots att den utgör större delen av totalkostnaden över tio år.",
          "Ingen intern ägare utses för mallen, vilket gör att partnern i praktiken bestämmer hur koncernen ska arbeta.",
          "Tidplanen sätts efter ett datum i verksamheten i stället för efter hur många testmigreringar som faktiskt behövs.",
          "Beslutsgruppen är inte överens om varför bytet görs, vilket visar sig först under designfasen när prioriteringarna krockar."
        ]
      },
      {
        "type": "h2",
        "text": "En anmärkning om källor"
      },
      {
        "type": "p",
        "text": "Merparten av det som publiceras på svenska om hur man väljer partner för Dynamics 365 är skrivet av partners. Materialet är ofta kompetent, men det är skrivet av en part med ett intresse i utfallet, och kriterierna hamnar därför gärna nära den egna profilen."
      },
      {
        "type": "p",
        "text": "I det här segmentet väger det tyngre än i något annat, eftersom antalet leverantörer är litet och varje enskild upphandling är stor. Läs flera källor, och fråga er vem som har nytta av att just de kriterierna väger tyngst."
      },
      {
        "type": "h2",
        "text": "Nästa steg"
      },
      {
        "type": "p",
        "text": "Börja med att skriva ner tre saker innan ni kontaktar någon leverantör: vad ni lämnar, vilka länder och bolag som omfattas i vilken ordning, och vad som ska vara löst om två år. Med de tre svaren på plats blir leverantörssamtalen kortare och betydligt mer upplysande."
      },
      {
        "type": "p",
        "text": "På d365.se kan ni jämföra svenska Dynamics 365-partners per applikationsområde, bransch och storlek, och avgränsa fältet innan ni börjar boka möten."
      },
      {
        "type": "p",
        "text": "Ska ni samtidigt se över CRM-sidan finns separata guider om Dynamics 365 Sales och Customer Service och Field Service."
      }
    ],
    "about": "d365.se är en köparsidig svensk guide för organisationer som utvärderar Microsoft Dynamics 365. Vi säljer varken system eller implementation. Vi beskriver marknadens partners på jämförbara grunder så att köparen kan fatta ett beslut som håller."
  },
  "valja-dynamics-365-sales-partner": {
    "h1": "Hur väljer du rätt partner för Dynamics 365 Sales?",
    "blocks": [
      {
        "type": "p",
        "text": "Kort svar: den avgörande risken i ett CRM-projekt är inte teknisk. Den är att säljarna inte använder systemet. Välj därför partner efter hur de arbetar med det som avgör användningen: säljprocessen, vardagsfriktionen, integrationen mot affärssystemet och vad som händer efter lansering. Be varje kandidat visa hur de följer upp faktisk användning hos tidigare kunder. Om de inte kan beskriva det säger det något om hur systematiskt de arbetar med adoption."
      },
      {
        "type": "p",
        "text": "Den här guiden är skriven av d365.se. Vi implementerar inte Dynamics 365 och vi säljer inga licenser. Vi finns för att köparen ska kunna jämföra partners på samma grunder."
      },
      {
        "type": "p",
        "text": "Den gäller specifikt Dynamics 365 Sales. För urvalsprocessen i stort, oavsett applikation, se vår guide om hur du hittar rätt partner för Dynamics 365 i Sverige."
      },
      {
        "type": "h2",
        "text": "Vad som utmärker den här upphandlingen"
      },
      {
        "type": "p",
        "text": "Dynamics 365 Sales är ett av de vanligaste införandena i den svenska Dynamics-marknaden. d365.se bedömer att det tillkommer i storleksordningen femhundra nya affärer per år och att projekten ofta landar i samma storleksordning som ett mindre affärssystemsprojekt eller lägre. Partnerfältet är brett, vilket ger er förhandlingsutrymme men också ett större urval att sortera i. Siffrorna är d365.se:s marknadsbedömning, uppdaterad i september 2026, inte officiell Microsoft-statistik."
      },
      {
        "type": "p",
        "text": "Den låga ingångskostnaden är samtidigt upphandlingens största fälla. Ett CRM går att sätta upp snabbt och billigt, och just därför utvärderas partnern ofta lättvindigt. Kostnaden för ett misslyckat CRM syns sällan i projektbudgeten. Den syns i att prognoserna inte går att lita på två år senare."
      },
      {
        "type": "p",
        "text": "Ett affärssystem används därför att det måste användas: fakturan går inte iväg annars. Ett CRM används bara om säljarna tycker att det ger dem något. Det är hela skillnaden, och den bör styra utvärderingen."
      },
      {
        "type": "p",
        "text": "Notera att kundservice och fältservice är egna upphandlingar med ett smalare partnerfält, även om apparna delar plattform med Sales. Ingår de i ert scope, se guiden om Customer Service och Field Service."
      },
      {
        "type": "h2",
        "text": "Steg 1: Bestäm vad systemet ska lösa"
      },
      {
        "type": "p",
        "text": "Det vanligaste skälet till att CRM-projekt tappar riktning är att beslutsgruppen vill olika saker utan att ha sagt det högt. Ledningen vill ha prognos. Säljchefen vill ha överblick. Säljarna vill slippa dubbelregistrering. Marknad vill ha data. Alla dessa går att uppfylla, men de ger olika lösningar."
      },
      {
        "type": "p",
        "text": "Klargör innan ni går ut:"
      },
      {
        "type": "ul",
        "items": [
          "Är huvudsyftet prognos och styrning, eller stöd i säljarens vardag? Om svaret är det första kommer systemet att kräva disciplin som någon måste upprätthålla.",
          "Vilken säljprocess ska systemet spegla, och finns den beskriven någonstans idag?",
          "Vad ska säljaren sluta göra när systemet är på plats? Ett CRM som bara lägger till arbete kommer att kringgås.",
          "Vem hos er äger systemet efter lansering, och har den personen tid avsatt?"
        ]
      },
      {
        "type": "p",
        "text": "Den sista frågan är den viktigaste och den som oftast saknar svar. Ett CRM som ingen äger internt slutar spegla verksamheten inom ett år, eftersom säljprocesser förändras snabbare än ekonomiprocesser."
      },
      {
        "type": "h2",
        "text": "Steg 2: Förstå vilken typ av leverantör ni talar med"
      },
      {
        "type": "p",
        "text": "På den svenska marknaden möter ni tre olika sorters leverantörer. Ingen av dem är fel, men de har olika styrkor och olika saker som behöver kontrolleras."
      },
      {
        "type": "table",
        "head": [
          "Typ av leverantör",
          "Styrka",
          "Vad du bör kontrollera"
        ],
        "rows": [
          [
            "Helhetsaktör som även gör ERP",
            "En leverantör för både affärssystem och CRM, gemensam integration och ett avtal.",
            "Om CRM-sidan är en egen enhet med egna seniora konsulter, eller några personer som lånas ut från ERP-leveransen."
          ],
          [
            "CRM- och Power Platform-specialist",
            "Spetskompetens i säljprocesser, gränssnitt och plattformen. Ofta snabbare i mindre iterationer.",
            "Uthållighet över tid och hur de hanterar integrationen mot ert affärssystem när det ägs av någon annan."
          ],
          [
            "Digital- eller marknadsbyrå med CRM-erbjudande",
            "Stark på kundresa, gränssnitt och kampanjlogik.",
            "Om de har erfarenhet av Dataverse, behörighetsmodell och förvaltning, eller främst av projekt som avslutas vid lansering."
          ]
        ]
      },
      {
        "type": "p",
        "text": "Valet mellan dem styrs framför allt av hur tätt CRM ska sitta ihop med ert affärssystem. Ska Sales hämta kunder, artiklar, priser och orderhistorik från ett ERP i realtid är integrationen projektets tyngsta del, och då väger det tungt vem som kan båda sidor. Ska systemet i huvudsak stödja en säljprocess med begränsat utbyte mot ekonomin väger spetskompetensen i CRM tyngre."
      },
      {
        "type": "h2",
        "text": "Steg 3: Frågan om standardapp eller egen app"
      },
      {
        "type": "p",
        "text": "Detta är det som skiljer en CRM-upphandling från allt annat i Dynamics-familjen, och det som köparen har svårast att bedöma."
      },
      {
        "type": "p",
        "text": "Dynamics 365 Sales är byggt på Microsofts dataplattform Dataverse. Gränsen mellan standardapplikationen och en egenbyggd app i Power Apps är flytande. Två partners kan lösa exakt samma behov på helt olika sätt: den ena genom att konfigurera standardappen, den andra genom att bygga en egen modelldriven app ovanpå samma data."
      },
      {
        "type": "p",
        "text": "Båda kan se snarlika ut i en demo. Skillnaden märks ofta först i förvaltningen. En lösning som ligger nära standard är normalt enklare att uppdatera, dokumentera och lämna över till en annan partner. En egen modelldriven app kan samtidigt vara helt rätt när verksamheten kräver ett mer träffsäkert arbetssätt, men då behöver ni förstå vad som är specialbyggt, hur det testas och vem som kan förvalta det över tid."
      },
      {
        "type": "p",
        "text": "Ställ därför frågan rakt: vad av detta är standard och vad har ni byggt? Be om svaret i skrift, per funktionsområde. En partner som inte kan svara utan att titta i lösningen har antingen byggt mer än ni tror eller inte tänkt på frågan, och båda är värda att veta."
      },
      {
        "type": "h2",
        "text": "Steg 4: Integration mot affärssystemet"
      },
      {
        "type": "p",
        "text": "CRM lever sällan ensamt. Kundregistret, artiklar, priser, orderhistorik och kreditinformation finns någon annanstans, och kvaliteten på den kopplingen avgör hur trovärdigt systemet upplevs."
      },
      {
        "type": "p",
        "text": "Tre saker att reda ut med varje kandidat:"
      },
      {
        "type": "ul",
        "items": [
          "Vilken väg går integrationen? Färdiga kopplingar och plattformsbaserade integrationer överlever Microsofts uppdateringar bättre än specialskriven punkt-till-punkt-kod.",
          "Åt vilket håll går sanningen? Vilket system äger kunduppgiften, och vad händer när samma kund uppdateras på båda ställena? Ett svar som saknas här blir en datakvalitetsfråga inom ett halvår.",
          "Vem äger integrationen i förvaltningen, om CRM och ERP levereras av olika partners? Detta ska vara utrett innan avtal, inte efter första felet."
        ]
      },
      {
        "type": "p",
        "text": "Är affärssystemet i andra änden Finance & Supply Chain Management gäller delvis andra förutsättningar för leverantörsvalet, som vi går igenom i guiden om partnerval för Finance & Supply Chain Management."
      },
      {
        "type": "h2",
        "text": "Steg 5: Frågor att ställa, och hur svaren ska läsas"
      },
      {
        "type": "p",
        "text": "Följande frågor är formulerade för att inte ha ett självklart bra svar. Bedömningen av svaret är minst lika viktig som frågan."
      },
      {
        "type": "h3",
        "text": "1. Kan ni visa faktisk användningsgrad hos en tidigare kund?"
      },
      {
        "type": "p",
        "text": "Den mest avslöjande frågan i hela utvärderingen. Alla partners talar om användaradoption. Få mäter den."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Konkreta mått: andel säljare som är inne dagligen, andel affärer som registreras i systemet, hur det såg ut tre respektive tolv månader efter lansering.",
          "Ett exempel där siffran var låg och vad de gjorde åt det."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Adoption beskrivs som en attitydfråga hos kunden.",
          "Svaret handlar om utbildningstillfällen snarare än om användning."
        ]
      },
      {
        "type": "h3",
        "text": "2. Hur mycket vardagsfriktion bygger lösningen in?"
      },
      {
        "type": "p",
        "text": "Be en säljare göra tre verkliga arbetsuppgifter i demon: registrera ett kundmöte, uppdatera en affär och hitta historiken för en kund. Räkna steg och bedöm hur mycket som behöver registreras manuellt. Små friktioner som upprepas varje dag avgör om systemet används av fler än de plikttrogna."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En demonstration av flödet, i mobilen, med en realistisk affär.",
          "Ett resonemang om vad de brukar ta bort ur standardvyerna för att minska bruset."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Alla fält presenteras som nödvändiga.",
          "Demon körs enbart i webbläsare trots att säljarna arbetar mobilt."
        ]
      },
      {
        "type": "h3",
        "text": "3. Vad av lösningen är standard och vad har ni byggt?"
      },
      {
        "type": "p",
        "text": "Se avsnittet ovan. Frågan avgör vad förvaltningen kostar och hur låsta ni blir."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En uppdelning per funktionsområde, i skrift.",
          "Ett resonemang om varför just de delarna byggdes i stället för att konfigureras."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Egenbyggda delar presenteras enbart som en styrka.",
          "Ingen kan svara utan att först titta i lösningen."
        ]
      },
      {
        "type": "h3",
        "text": "4. Vem hos er förstår hur försäljning fungerar?"
      },
      {
        "type": "p",
        "text": "En konsult som aldrig arbetat nära en säljorganisation designar system som ser logiska ut i ett processdiagram och används av ingen."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Namn på någon i teamet med bakgrund i försäljning eller säljledning.",
          "Frågor tillbaka om er säljprocess som ni inte hade tänkt på."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Samtalet handlar hela tiden om funktioner och aldrig om hur ni säljer.",
          "Er befintliga process accepteras utan invändningar."
        ]
      },
      {
        "type": "h3",
        "text": "5. Hur ser integrationen mot vårt affärssystem ut, konkret?"
      },
      {
        "type": "p",
        "text": "Se steg 4. Svaret ska innehålla teknik, riktning och ägarskap."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Vilken metod som föreslås och varför, samt vad den kostar löpande.",
          "Ett tydligt besked om vilket system som äger vilken uppgift."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Integrationen beskrivs som enkel utan att systemet i andra änden har diskuterats.",
          "Ingen skillnad görs mellan att visa data och att synkronisera den."
        ]
      },
      {
        "type": "h3",
        "text": "6. Vad har ni satt i produktion med Copilot och agenter?"
      },
      {
        "type": "p",
        "text": "Nästan alla partners beskriver att de arbetar med AI i CRM. Betydligt färre kan beskriva vad de faktiskt driftsatt hos en kund."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En namngiven funktion hos en namngiven kund, och vad den gav.",
          "En ärlig avgränsning av vad som ännu inte fungerar bra."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Svaret består av Microsofts produktbeskrivning.",
          "AI presenteras som skäl att välja dem, utan exempel."
        ]
      },
      {
        "type": "h3",
        "text": "7. Vad händer efter lansering?"
      },
      {
        "type": "p",
        "text": "Ett CRM som inte utvecklas följer inte med när säljorganisationen ändrar sig, och den ändrar sig oftare än ekonomiavdelningen."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En förvaltningsmodell med namngiven kontakt, svarstider och prismodell.",
          "En rytm för löpande justeringar, exempelvis återkommande avstämningar de första månaderna.",
          "Ett resonemang om vad ni själva bör kunna göra utan att ringa dem."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Projektet avslutas vid lansering och förvaltning erbjuds som något separat senare.",
          "Varje fältändring kräver en beställning."
        ]
      },
      {
        "type": "h2",
        "text": "Meriter som mäter något annat än du tror"
      },
      {
        "type": "ul",
        "items": [
          "Certifieringar är knutna till personer, inte till bolag. Frågan är om de certifierade personerna är de som blir era.",
          "Microsofts partnerbeteckningar bygger sedan 2022 på Solutions Partner-designationer. Begreppet guldkompetens finns inte längre.",
          "Utmärkelser från Microsoft speglar partnerns förhållande till Microsoft. De är inte kundnöjdhetsmätningar.",
          "Antalet CRM-kunder totalt säger mindre än antalet lanseringar de senaste två åren, och betydligt mindre än hur många av dem som fortfarande används aktivt."
        ]
      },
      {
        "type": "h2",
        "text": "Vad som brukar gå fel i själva urvalet"
      },
      {
        "type": "ul",
        "items": [
          "Beslutet fattas av ledningen och IT utan att någon säljare har provat systemet. Den grupp som ska använda det dagligen har då ingen del i valet.",
          "Kravlistan speglar den befintliga processen i detalj, vilket bygger in dagens problem i det nya systemet.",
          "Förvaltningen lämnas utanför upphandlingen, trots att CRM ändras oftare än något annat system ni har.",
          "Marknadsdelen dras in sent, vilket gör att datamodellen för kontakter och samtycken behöver göras om.",
          "Priset jämförs på projektet, inte på tre års total kostnad inklusive licenser, integration och löpande justeringar."
        ]
      },
      {
        "type": "h2",
        "text": "En anmärkning om källor"
      },
      {
        "type": "p",
        "text": "Merparten av det som publiceras på svenska om hur man väljer partner för Dynamics 365 är skrivet av partners. Materialet är ofta kompetent, men det är skrivet av en part med ett intresse i utfallet, och kriterierna hamnar därför gärna nära den egna profilen."
      },
      {
        "type": "p",
        "text": "Läs flera källor, och fråga er vem som har nytta av att just de kriterierna väger tyngst."
      },
      {
        "type": "h2",
        "text": "Nästa steg"
      },
      {
        "type": "p",
        "text": "Ta med en säljare in i utvärderingen, och låt den personen få ett verkligt inflytande över valet. Det är den enskilt största skillnaden mellan CRM-projekt som används och CRM-projekt som avvecklas i tysthet."
      },
      {
        "type": "p",
        "text": "På d365.se kan ni jämföra svenska Dynamics 365-partners per applikationsområde, bransch och storlek, och avgränsa fältet innan ni börjar boka möten."
      }
    ],
    "about": "d365.se är en köparsidig svensk guide för organisationer som utvärderar Microsoft Dynamics 365. Vi säljer varken system eller implementation. Vi beskriver marknadens partners på jämförbara grunder så att köparen kan fatta ett beslut som håller."
  },
  "valja-customer-service-field-service-partner": {
    "h1": "Hur väljer du rätt partner för Dynamics 365 Customer Service och Field Service?",
    "blocks": [
      {
        "type": "p",
        "text": "Kort svar: Customer Service och Field Service hör till de Dynamics-områden där ett driftproblem snabbast blir synligt för slutkunden. Går något fel kan kunden märka det innan ni själva hinner reagera. Välj därför partner efter driftförmåga lika mycket som efter designförmåga: hur de hanterar avbrott, hur de testar inför uppdateringar, hur schemaläggning och SLA faktiskt är uppsatta och vem som svarar när fälttekniker inte kommer in i appen."
      },
      {
        "type": "p",
        "text": "Den här guiden är skriven av d365.se. Vi implementerar inte Dynamics 365 och vi säljer inga licenser. Vi finns för att köparen ska kunna jämföra partners på samma grunder."
      },
      {
        "type": "p",
        "text": "Den gäller specifikt Customer Service och Field Service. För urvalsprocessen i stort, oavsett applikation, se vår guide om hur du hittar rätt partner för Dynamics 365 i Sverige."
      },
      {
        "type": "h2",
        "text": "Vad som utmärker den här upphandlingen"
      },
      {
        "type": "p",
        "text": "Customer Service och Field Service behandlas ibland som mindre tillägg till ett Sales- eller CRM-projekt. Det är ofta ett misstag: de har egna processer, integrationer och driftskrav. En avgränsad första implementation utan tunga integrationer kan börja under en halv miljon kronor, medan kompletta produktionslösningar med SLA-modell, migrering, integrationer och/eller Field Service och Contact Center ofta hamnar över den nivån. d365.se uppskattar antalet nya affärer i Sverige till ett par hundra per applikationsområde och år. Det är vår marknadsbedömning, uppdaterad i september 2026, inte officiell Microsoft-statistik."
      },
      {
        "type": "p",
        "text": "Partnerfältet är samtidigt smalare än på säljsidan. Många partners som är starka på Dynamics 365 Sales har begränsad erfarenhet av schemaläggning, SLA-uppsättning eller telefoniintegration, eftersom det är en annan sorts kompetens. Fråga tidigt och specifikt, annars får ni ett Sales-team med servicemodulen påläst."
      },
      {
        "type": "p",
        "text": "Den avgörande skillnaden mot många interna affärsprocesser handlar om hur snabbt ett fel blir synligt utåt. Ett fel i ekonomin eller ett internt säljsystem kan ofta upptäckas och hanteras internt först. Ett fel i ett servicesystem kan däremot märkas direkt hos kunden som väntar på svar eller på en tekniker som inte kommer. Det ska styra hur ni viktar utvärderingen."
      },
      {
        "type": "h2",
        "text": "Steg 1: Avgränsa vad ni faktiskt ska införa"
      },
      {
        "type": "p",
        "text": "Området är brett och scopet glider lätt. Klargör utgångsläget innan ni går ut, eftersom det avgör vilken kompetens som behövs i teamet."
      },
      {
        "type": "table",
        "head": [
          "Utgångsläge",
          "Det partnern framför allt måste kunna bevisa"
        ],
        "rows": [
          [
            "Enbart Customer Service",
            "Ärendeflöden, SLA-hantering, kanalhantering och kunskapsbank. Erfarenhet av att flytta över från ett befintligt ärendesystem utan att tappa historik och pågående ärenden."
          ],
          [
            "Enbart Field Service",
            "Schemaläggning och ruttoptimering, arbetsorderflöde, reservdelar och lagersaldo i bil, samt en mobil app som fungerar utan täckning."
          ],
          [
            "Båda tillsammans",
            "Hur ärendet lämnar kundtjänst och blir en arbetsorder, och hur återkopplingen tillbaka fungerar. Det är i den överlämningen de flesta projekt tappar bort sig."
          ],
          [
            "Med Contact Center eller telefoni",
            "Faktiska integrationer mot telefoniplattformar, samt röst- och köhantering. Kräver en annan kompetens än ärendehantering och finns inte hos alla."
          ],
          [
            "Service kopplad till installerad utrustning",
            "Anläggningsregister, serviceavtal, garantier och koppling till affärssystemet för fakturering av utfört arbete och förbrukat material."
          ]
        ]
      },
      {
        "type": "p",
        "text": "Raden om överlämningen mellan kundtjänst och fält förtjänar särskild uppmärksamhet. Många projekt levererar två fungerande delar och en trasig skarv: ärendet blir en arbetsorder men handläggaren ser inte när teknikern varit där, eller teknikerns rapport hamnar aldrig tillbaka i ärendet. Be om att få se just den överlämningen demonstrerad, inte bara beskriven."
      },
      {
        "type": "h2",
        "text": "Steg 2: Utgå från era servicelöften, inte från funktionslistan"
      },
      {
        "type": "p",
        "text": "Ett servicesystem är i grunden en maskin som ska hålla löften ni redan gett era kunder. Om löftena inte är formulerade blir systemet en gissning."
      },
      {
        "type": "p",
        "text": "Ha svaren klara innan första leverantörsmötet:"
      },
      {
        "type": "ul",
        "items": [
          "Vilka svars- och åtgärdstider har ni utlovat, till vilka kunder, och hur skiljer de sig åt mellan avtal?",
          "Vad räknas som starttid för ett ärende, och när stannar klockan? Detta är den fråga som orsakar mest efterarbete när den besvaras för sent.",
          "Hur ser era öppettider och jourer ut, och ska systemet räkna SLA i kalendertid eller arbetstid?",
          "Vilka kanaler ska in: telefon, e-post, formulär, chatt, kundportal? Och ska kunden kunna följa sitt ärende själv?",
          "För fält: vad styr vem som får ett jobb? Kompetens, geografi, reservdelar i bilen, avtalsnivå eller en kombination?"
        ]
      },
      {
        "type": "p",
        "text": "Den sista frågan är den som skiljer ett fungerande schemaläggningsupplägg från ett som teknikerna kringgår. Om planeraren i praktiken flyttar allt manuellt varje morgon har optimeringen inte gett något."
      },
      {
        "type": "h2",
        "text": "Steg 3: Titta noga på fältappen"
      },
      {
        "type": "p",
        "text": "I Field Service är den mobila appen den enda del av systemet som huvuddelen av användarna någonsin ser. Den avgör om lösningen fungerar."
      },
      {
        "type": "p",
        "text": "Tre saker att kontrollera i demo, med er egen verklighet som utgångspunkt:"
      },
      {
        "type": "ul",
        "items": [
          "Vad händer utan täckning? Tekniker arbetar i källare, hisschakt och på landsbygd. Fråga hur offlineläget fungerar, hur länge det håller, och vad som händer när två personer ändrat samma sak innan synkroniseringen.",
          "Hur många steg tar en avslutad arbetsorder? Med signatur, förbrukat material, tid och bilder. Räkna stegen själva under demon i stället för att fråga.",
          "Fungerar den på den utrustning teknikerna faktiskt har? Med handskar, i solljus, på en äldre telefon."
        ]
      },
      {
        "type": "h2",
        "text": "Steg 4: Integration och drift"
      },
      {
        "type": "p",
        "text": "Servicesystemet står mitt emellan kunden och er ekonomi. Det behöver hämta anläggningar, avtal, artiklar och priser, och lämna ifrån sig underlag för fakturering av tid och material."
      },
      {
        "type": "p",
        "text": "Reda ut med varje kandidat vilket system som äger anläggningsregistret, hur reservdelssaldon hanteras när materialet ligger i en servicebil, och hur utfört arbete blir en faktura. Om svaret på det sista är en manuell rutin bör det framgå redan i offerten, eftersom det är där mycket av den utlovade nyttan brukar försvinna."
      },
      {
        "type": "p",
        "text": "Ligger affärssystemet i andra änden på enterprisenivå påverkar det både integrationen och valet av leverantör. Vi behandlar den delen i guiden om partnerval för Finance & Supply Chain Management."
      },
      {
        "type": "p",
        "text": "Driftfrågan är minst lika viktig. Microsoft uppdaterar plattformen löpande, och ni kan inte skjuta upp det obegränsat. Fråga hur partnern testar er lösning inför uppdateringar, särskilt de delar som rör schemaläggning och integrationer, och vad som händer om något går sönder en måndagsmorgon."
      },
      {
        "type": "h2",
        "text": "Steg 5: Frågor att ställa, och hur svaren ska läsas"
      },
      {
        "type": "p",
        "text": "Följande frågor är formulerade för att inte ha ett självklart bra svar. Bedömningen av svaret är minst lika viktig som frågan."
      },
      {
        "type": "h3",
        "text": "1. Hur många kundtjänst- och fältserviceinstallationer har ni satt i drift de senaste två åren?"
      },
      {
        "type": "p",
        "text": "Frågan sållar effektivt, eftersom många partners har lång Dynamics-historik men få servicedriftsättningar."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett tal, med kunder som går att kontakta, och en åtskillnad mellan Customer Service och Field Service.",
          "Uppgift om antalet handläggare respektive tekniker i de installationerna."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Svaret glider över i antalet CRM-kunder totalt.",
          "Referenserna avser pilotinstallationer som aldrig breddades."
        ]
      },
      {
        "type": "h3",
        "text": "2. Hur har ni satt upp SLA hos en tidigare kund?"
      },
      {
        "type": "p",
        "text": "SLA-uppsättning är den vanligaste källan till efterarbete, eftersom den kräver att både avtal och undantag är genomtänkta."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett konkret exempel med olika avtalsnivåer, arbetstidskalender och regler för när klockan pausas.",
          "Ett resonemang om vad de brukar avråda från att bygga in."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "SLA beskrivs som en inställning snarare än som en modell.",
          "Ingen fråga ställs tillbaka om era avtal."
        ]
      },
      {
        "type": "h3",
        "text": "3. Visa hur ett ärende blir en arbetsorder och hur svaret kommer tillbaka"
      },
      {
        "type": "p",
        "text": "Skarven mellan kundtjänst och fält är den vanligaste bristen i levererade lösningar."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En demonstration i ett sammanhängande flöde, inte två separata visningar.",
          "Besked om vad handläggaren ser om teknikern blir försenad."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Flödet beskrivs på whiteboard i stället för att visas.",
          "Återkopplingen till kunden kräver att någon manuellt uppdaterar ärendet."
        ]
      },
      {
        "type": "h3",
        "text": "4. Hur fungerar schemaläggningen i praktiken, ett halvår in?"
      },
      {
        "type": "p",
        "text": "Automatisk optimering säljer bra i demo. Frågan är om planeraren fortfarande använder den."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Ett exempel på hur mycket som schemaläggs automatiskt respektive manuellt hos en befintlig kund.",
          "Ett resonemang om vilka regler som brukar behöva justeras efter några månader."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Optimeringen presenteras som något som löser sig av sig självt.",
          "Ingen kan beskriva hur en akut order tränger sig in i ett fullt schema."
        ]
      },
      {
        "type": "h3",
        "text": "5. Vad händer när något går sönder på en måndagsmorgon?"
      },
      {
        "type": "p",
        "text": "Detta är områdets viktigaste supportfråga, och den som skiljer en driftmogen leverantör från en projektorienterad."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "Svarstider, jourupplägg och vem som faktiskt svarar, med namn eller funktion.",
          "Ett konkret exempel på ett avbrott de hanterat och hur lång tid det tog."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Supporten beskrivs enbart som ett ärendesystem.",
          "Samma konsulter bemannar både pågående projekt och akut support, utan kapacitetsplan."
        ]
      },
      {
        "type": "h3",
        "text": "6. Hur testar ni vår lösning inför Microsofts uppdateringar?"
      },
      {
        "type": "p",
        "text": "Plattformen uppdateras oavsett vad ni tycker. Frågan är vem som kontrollerar att er lösning fortfarande fungerar."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En beskriven rutin med testmiljö och vilka flöden som testas varje gång.",
          "Besked om detta ingår i förvaltningsavtalet eller debiteras separat."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Testning beskrivs som något ni gör själva, utan stöd.",
          "Frågan har inte kommit upp tidigare hos andra kunder."
        ]
      },
      {
        "type": "h3",
        "text": "7. Vad har ni satt i produktion med AI i kundtjänst?"
      },
      {
        "type": "p",
        "text": "Automatiska svarsförslag, sammanfattningar och kundchattbottar är områdets mest omtalade funktioner och de med störst avstånd mellan löfte och verklighet."
      },
      {
        "type": "p",
        "text": "Bra svar innehåller:"
      },
      {
        "type": "ul",
        "items": [
          "En namngiven funktion hos en namngiven kund, och vad den mätbart gav.",
          "En ärlig beskrivning av vad som krävdes i kunskapsunderlag för att det skulle fungera."
        ]
      },
      {
        "type": "p",
        "text": "Varningstecken:"
      },
      {
        "type": "ul",
        "items": [
          "Svaret består av Microsofts produktbeskrivning.",
          "Kunskapsbankens kvalitet nämns inte alls."
        ]
      },
      {
        "type": "h2",
        "text": "Meriter som mäter något annat än du tror"
      },
      {
        "type": "ul",
        "items": [
          "Erfarenhet av Dynamics 365 Sales är inte erfarenhet av Customer Service eller Field Service. Det är samma plattform men olika discipliner, och skillnaden märks i schemaläggning, SLA och drift.",
          "Certifieringar är knutna till personer, inte till bolag. Frågan är om de certifierade personerna är de som blir era.",
          "Microsofts partnerbeteckningar bygger sedan 2022 på Solutions Partner-designationer. Begreppet guldkompetens finns inte längre.",
          "Utmärkelser från Microsoft speglar partnerns förhållande till Microsoft. De är inte kundnöjdhetsmätningar."
        ]
      },
      {
        "type": "h2",
        "text": "Vad som brukar gå fel i själva urvalet"
      },
      {
        "type": "ul",
        "items": [
          "Ingen handläggare eller tekniker deltar i utvärderingen, trots att de är de enda som kommer att använda systemet varje dag.",
          "SLA-modellen utreds först under implementationen, vilket flyttar arbete och kostnad in i projektet.",
          "Fältappen bedöms i en demo på en stor skärm i ett konferensrum i stället för i verklig miljö.",
          "Faktureringen av utfört arbete lämnas utanför scopet och löses manuellt, vilket äter upp nyttan.",
          "Förvaltning och jour prissätts efter avtal, när ni inte längre har något förhandlingsläge.",
          "Kunskapsbanken planeras som en aktivitet efter lansering, vilket gör att varken handläggarna eller AI-funktionerna har något att arbeta med."
        ]
      },
      {
        "type": "h2",
        "text": "En anmärkning om källor"
      },
      {
        "type": "p",
        "text": "Merparten av det som publiceras på svenska om hur man väljer partner för Dynamics 365 är skrivet av partners. Materialet är ofta kompetent, men det är skrivet av en part med ett intresse i utfallet, och kriterierna hamnar därför gärna nära den egna profilen."
      },
      {
        "type": "p",
        "text": "Läs flera källor, och fråga er vem som har nytta av att just de kriterierna väger tyngst."
      },
      {
        "type": "h2",
        "text": "Nästa steg"
      },
      {
        "type": "p",
        "text": "Skriv ner era servicelöften och era regler för vem som får ett jobb innan ni kontaktar någon leverantör. Med de två underlagen på plats blir leverantörssamtalen kortare, och skillnaderna mellan kandidaterna syns snabbt."
      },
      {
        "type": "p",
        "text": "På d365.se kan ni jämföra svenska Dynamics 365-partners per applikationsområde, bransch och storlek, och avgränsa fältet innan ni börjar boka möten."
      }
    ],
    "about": "d365.se är en köparsidig svensk guide för organisationer som utvärderar Microsoft Dynamics 365. Vi säljer varken system eller implementation. Vi beskriver marknadens partners på jämförbara grunder så att köparen kan fatta ett beslut som håller."
  }
} as const;
