Ja. Nu när samma logik har fungerat för F&SCM, Sales och Customer Insights är det bättre att skapa **en gemensam masterprompt** än att fortsätta skriva separata instruktioner från grunden. Poängen är att alla produktsidor ska få samma köparlogik, men att Lovable måste identifiera och bevara varje produkts unika vägval.

Nedan är en gemensam mall där du bara ersätter uppgifterna i avsnittet **SIDANS VARIABLER**.

```text
MASTERPROMPT FÖR PRODUKTSIDOR PÅ D365.SE

UPPDRAG

Optimera kundresan på den BEFINTLIGA produktsidan på d365.se:

Produkt: [PRODUKTNAMN]
Befintlig sida: [SIDANS URL]
Produkttyp/kategori: [EXEMPELVIS ERP, CRM, MARKETING AUTOMATION, SERVICE ELLER LOW-CODE]
Produktens viktigaste vägval: [PRODUKTSPECIFIKT VÄGVAL]
Primärt test eller analysverktyg: [BEFINTLIG FUNKTION ELLER "INGET SPECIFIKT VERKTYG"]
Relevanta jämförelser: [BEFINTLIGA JÄMFÖRELSER]
Relevant partnerkategori: [PARTNERTYP]

Exempel på produktspecifika vägval:

• F&SCM:
  Finance, Supply Chain Management eller båda?

• Dynamics 365 Sales:
  Behöver vi ett avancerat CRM, ett enklare säljstöd eller en bredare kundplattform?

• Customer Insights:
  Behöver vi marketing automation, CDP eller båda?

• Customer Service:
  Behöver vi ärendehantering, kontaktcenter, självservice eller en kombination?

• Field Service:
  Behöver vi arbetsorder, resursplanering, fältservice eller mer begränsad servicehantering?

• Business Central:
  Räcker Business Central eller behövs ett mer avancerat enterprise-ERP?

• Power Platform:
  Behöver vi appar, automation, analys, AI-agenter eller en kombination?

==================================================
VIKTIG UTGÅNGSPUNKT
==================================================

Detta är INTE en total redesign.

Skapa INTE en ny produktsida.

Utgå från den befintliga sidans:

• innehåll
• komponenter
• interna länkar
• verktyg
• visuella identitet
• CTA:er
• jämförelser
• partnerfunktioner

Skriv inte om sidan från början.

Arbetsordningen ska vara:

BEHÅLL
→ SLIMMA
→ SORTERA
→ KOPPLA IHOP
→ KOMPLETTERA ENDAST VID TYDLIG LUCKA

Målet är att göra sidan till ett köparsidigt digitalt beslutsstöd för en modern B2B-köpare.

Besökaren kan redan ha gjort omfattande research via Google, ChatGPT, Copilot, Gemini eller andra AI- och söktjänster.

Sidan ska därför inte bara ge mer produktinformation.

Den ska hjälpa besökaren att:

• förstå sitt behov
• bedöma om produkten passar
• jämföra relevanta alternativ
• skapa ett beslutsunderlag
• hitta en relevant partner
• förstå nästa steg

==================================================
ÖVERGRIPANDE KUNDRESA
==================================================

Använd följande interna modell:

ANSWER → COMPARE → ASSESS → BUILD → MATCH

Modellen ska styra sidans struktur, länkar och nästa steg.

Visa inte automatiskt de engelska orden för besökaren.

Besökaren ska inte tvingas genom alla fem steg.

En tidig köpare ska kunna börja med att förstå sitt behov.

En mer mogen köpare ska kunna gå direkt till exempelvis:

• jämförelse
• behovsanalys
• kravspecifikation
• kostnadsanalys
• partnerurval

==================================================
SIDANS UPPGIFT
==================================================

Efter besöket ska köparen kunna svara på:

1. Vilket problem försöker vi lösa?

2. Är [PRODUKTNAMN] relevant för vårt behov?

3. När passar produkten mindre bra?

4. Vilka alternativ bör vi jämföra med?

5. Vilket produktspecifikt vägval behöver vi göra?

6. Hur analyserar och dokumenterar vi vårt behov?

7. Hur bedömer vi investering, införande och risk?

8. Hur hittar vi en relevant partner?

Produktsidan ska fungera som en produktanpassad ingång till d365.se:s gemensamma köpresa.

==================================================
1. ANSWER – FÖRSTÅ BEHOVET OCH PRODUKTEN
==================================================

MÅL

Hjälp besökaren snabbt förstå:

• vilket problem produkten löser
• när produkten är relevant
• när produkten inte är rätt val
• vad som påverkar kostnaden
• vad ett införande kräver
• vilka risker som finns
• vilka interna förutsättningar som krävs
• vad som krävs efter införandet

BÖRJA MED KUNDENS SITUATION

Sidan ska inte huvudsakligen börja med:

• produktarkitektur
• moduler
• funktionslistor
• Copilot och AI
• Microsoft-ekosystemet
• tekniska integrationsmöjligheter

Börja istället med frågor och situationer som köparen känner igen.

Exempel:

• Vilket verksamhetsproblem försöker organisationen lösa?
• Vad fungerar inte tillräckligt bra i dag?
• Vilken komplexitet motiverar denna typ av lösning?
• Vilka organisatoriska förutsättningar krävs?
• När är lösningen sannolikt överdimensionerad?
• När kan ett enklare alternativ vara tillräckligt?

Använd produktens funktioner för att svara på köparens frågor.

Produkten och funktionerna är inte berättelsens utgångspunkt.

TA UPP NÄR PRODUKTEN INTE PASSAR

Sidan ska trovärdigt kunna förklara:

• när produkten är för avancerad
• när organisationen inte är redo
• när datakvalitet eller processer behöver förbättras först
• när ett enklare alternativ bör undersökas
• vilka konsekvenser ett felaktigt val kan få

Alla besökare ska inte automatiskt styras mot den aktuella produkten.

==================================================
PRODUKTENS VIKTIGASTE VÄGVAL
==================================================

Identifiera och tydliggör sidans viktigaste produktspecifika beslut:

[PRODUKTENS VIKTIGASTE VÄGVAL]

Detta vägval ska vara lätt att förstå tidigt på sidan.

Det ska hjälpa besökaren skilja mellan olika behov, moduler, ambitionsnivåer eller produktalternativ.

Presentera vägvalet utifrån köparens behov, inte Microsofts interna produktstruktur.

Exempel:

• Finance, SCM eller båda?
• Marketing automation, CDP eller båda?
• CRM, enklare säljstöd eller bredare kundplattform?
• Customer Service, Contact Center eller kombination?
• Business Central eller Finance & Supply Chain Management?

==================================================
SLIMMA OCH TA BORT DUBBLERING
==================================================

Analysera hela den befintliga sidan innan förändringar görs.

Identifiera sektioner som helt eller delvis svarar på samma frågor.

Vanliga exempel:

• Vad är produkten?
• När passar produkten?
• Vilka behov kan produkten stödja?
• Varför välja produkten?
• Vad avgör valet?
• Produktens fördelar
• D365.SE:s bedömning
• Vanliga användningsområden
• senare, återkommande produktintroduktioner

Ta inte bort innehåll mekaniskt.

Bedöm först:

1. Vilket block ger det tydligaste svaret?

2. Vilket innehåll hjälper köparen framåt?

3. Vilket innehåll är huvudsakligen generisk produktmarknadsföring?

4. Vilka delar kan slås ihop?

5. Vilket innehåll bör flyttas längre ner?

6. Vilket innehåll kan tas bort utan att köparen förlorar viktig information?

Varje viktigt svar ska normalt behöva ges en gång.

Prioritera:

KORT OCH TYDLIGT SVAR
→ RELEVANT FÖRDJUPNING
→ LOGISKT NÄSTA STEG

Undvik flera versioner av samma produktbeskrivning.

==================================================
2. COMPARE – JÄMFÖR ALTERNATIVEN
==================================================

MÅL

Hjälp besökaren förstå vilka relevanta alternativ som bör utvärderas.

Lyft befintliga verifierade jämförelser:

[RELEVANTA BEFINTLIGA JÄMFÖRELSER]

Jämförelserna ska hjälpa köparen förstå skillnader inom exempelvis:

• målgrupp
• verksamhetsbehov
• komplexitet
• funktionellt djup
• integrationer
• ekosystem
• implementation
• intern förvaltning
• kostnadsdrivare
• skalbarhet
• kompromisser

Jämförelsen ska inte vara konstruerad så att [PRODUKTNAMN] alltid vinner.

Om ett enklare, billigare eller annorlunda alternativ kan vara mer lämpligt ska det framgå.

SKAPA INTE PÅHITTADE JÄMFÖRELSER

Om en relevant jämförelsesida eller verifierat jämförelseunderlag saknas:

• skapa inte konkurrentspecifika fakta
• skapa inte automatiskt en ny jämförelsesida
• hitta inte på produktfunktioner, priser eller begränsningar
• lägg istället luckan i en separat rekommendationslista

==================================================
3. ASSESS – BEDÖM ORGANISATIONENS BEHOV
==================================================

MÅL

Flytta köparen från:

"Jag läser om [PRODUKTNAMN]"

till:

"Vad behöver vår organisation egentligen?"

Återanvänd befintliga verktyg där de är relevanta:

• matchningstest
• behovsanalys
• produktvalstest
• mognadsanalys
• annan befintlig diagnostik

Primär befintlig funktion:

[PRIMÄRT TEST ELLER ANALYSVERKTYG]

Analysen ska utgå från kundens situation och verksamhetsbehov.

Den ska inte enbart utgå från produktfunktioner.

Relevanta bedömningsområden kan, när de stöds av befintligt innehåll och funktionalitet, vara:

• verksamhetens processer
• komplexitet
• organisation
• användare
• data
• integrationer
• rapportering
• styrning
• automation
• geografisk eller organisatorisk omfattning
• krav på andra Microsoft-applikationer
• intern kapacitet
• förvaltning efter införandet

Resultatet ska inte alltid behöva bli:

"[PRODUKTNAMN] är rätt för er."

Ett trovärdigt beslutsstöd ska också kunna leda till:

• ett enklare alternativ
• en annan produkt
• behov av vidare analys
• behov av att förbättra data eller processer först
• bedömningen att organisationen inte är redo

Skapa inte ny diagnostik eller nya testresultat om den befintliga funktionaliteten inte stödjer detta.

==================================================
4. BUILD – BYGG BESLUTSUNDERLAGET
==================================================

MÅL

Hjälp en mer mogen köpare gå från research till konkret beslutsunderlag.

Återanvänd relevanta befintliga verktyg på d365.se:

• behovsanalys
• kravspecifikation
• kostnadsanalys
• TCO/ROI
• produktjämförelser
• lösningsunderlag
• partnerunderlag

Samla dem konceptuellt under:

"Bygg ert beslutsunderlag"

Kommunicera nyttan, inte bara namnet på verktyget.

BEHOV

Vad behöver verksamheten faktiskt?

ALTERNATIV

Vilka produkter eller lösningar bör jämföras?

KRAV

Vilka krav ska lösningen och partnern kunna möta?

KOSTNAD

Vilka faktorer påverkar investering och löpande kostnad?

RISK

Vilka risker behöver analyseras innan beslut?

PARTNERUNDERLAG

Vilken information krävs för att få jämförbara förslag?

Undvik flera CTA:er som i praktiken betyder samma sak.

Om flera verktyg är relevanta ska deras inbördes ordning vara begriplig.

Exempel:

Behovsanalys
↓
kostnadsbild
↓
kravspecifikation
↓
partnerurval

Ordningen ska vara rekommenderad, inte obligatorisk.

==================================================
5. MATCH – HITTA OCH JÄMFÖR PARTNERS
==================================================

MÅL

När köparen har förstått sitt behov ska det vara enkelt att hitta relevanta partners.

Relevant partnerkategori:

[PARTNERTYP]

Återanvänd d365.se:s befintliga:

• partnerkatalog
• partnerprofiler
• produktfiltrering
• branschfiltrering
• kompetensfiltrering
• partnermatchning
• partnerjämförelse

Skilj tydligt mellan:

HITTA PARTNERS

Vilka företag arbetar med produkten eller lösningsområdet?


JÄMFÖR PARTNERS

Vilka verifierbara skillnader finns mellan relevanta partneralternativ?


MATCHA MOT BEHOV

Vilka partnerprofiler stämmer bäst överens med köparens angivna behov?

Använd endast information som finns och kan verifieras i befintlig partnerdata.

Skapa inte:

• partnerbetyg
• kvalitetsomdömen
• erfarenhet
• referenser
• certifieringar
• branschkompetens
• geografisk täckning
• leveranskapacitet
• rekommendationer

om informationen inte stöds av data.

Undvik formuleringar som innebär att d365.se garanterar partnerns kvalitet eller lämplighet.

==================================================
TRE PRIMÄRA INGÅNGAR
==================================================

Visa inte fem stora konkurrerande huvud-CTA:er bara för att den interna modellen innehåller fem steg.

Förenkla den synliga kundresan till tre huvudsituationer:

1. VI ÄR OSÄKRA PÅ VAD VI BEHÖVER

Primär CTA:
Analysera vårt behov

Alternativt:
Gör matchningstestet


2. VI UTVÄRDERAR [PRODUKTNAMN]

Primär CTA:
Bygg vårt beslutsunderlag

Alternativt:
Jämför lösningen med andra alternativ


3. VI VET VAD VI BEHÖVER

Primär CTA:
Hitta rätt partner

Alternativt:
Jämför relevanta partners

Anpassa CTA-texterna till produkten, men behåll samma grundlogik mellan d365.se:s produktsidor.

==================================================
CTA-HIERARKI
==================================================

Undvik att varje sektion avslutas med flera lika starka knappar.

Använd följande princip:

• en primär CTA
• högst en relevant sekundär länk
• nästa steg ska motsvara innehållet besökaren just har läst
• samma handling ska benämnas konsekvent genom hela sidan
• knappar som leder till samma funktion ska inte ha flera olika namn

CTA:n ska beskriva köparens önskade resultat.

Prioritera exempelvis:

• Analysera vårt behov
• Jämför alternativen
• Beräkna kostnadsbilden
• Skapa kravspecifikation
• Hitta rätt partner

Undvik vaga CTA:er som:

• Läs mer
• Upptäck möjligheterna
• Kom igång
• Utforska lösningen
• Kontakta oss

om det finns ett mer konkret nästa steg.

==================================================
KOPPLA IHOP KUNDRESAN
==================================================

Den viktigaste förbättringen är INTE mer innehåll.

Det viktigaste är att produktinformation, jämförelser, verktyg och partnerfunktioner upplevs som delar av samma köpresa.

Önskad logik:

Förstå behovet
↓
bedöm om produkten passar
↓
förstå produktens viktigaste vägval
↓
jämför alternativen
↓
analysera organisationens behov
↓
bedöm kostnad och risk
↓
skapa kravunderlag
↓
hitta och jämför partners

Alla användare ska inte behöva följa hela kedjan.

Efter varje viktig sektion ska det däremot finnas ett naturligt nästa steg.

Undvik återvändsgränder.

En tidig köpare ska kunna börja med analys.

En mogen köpare ska kunna gå direkt till kravspecifikation, kostnadsbild eller partnerurval.

==================================================
ÅTERANVÄND INFORMATION MELLAN STEG
==================================================

Om det kan göras inom den befintliga tekniska lösningen utan omfattande ombyggnad bör tidigare val återanvändas i kommande steg.

Exempel:

• vald produkt
• valt behov
• vald bransch
• vald jämförelse
• företagets storlek
• valda moduler
• uppskattat antal användare
• angivna prioriteringar

Besökaren ska inte behöva ange samma information flera gånger.

Implementera inte en omfattande ny datamodell, inloggning, lagring eller integrationsarkitektur inom detta uppdrag om detta inte uttryckligen beställts.

Om återanvändning kräver större teknisk utveckling:

• ändra inte arkitekturen automatiskt
• dokumentera behovet separat
• genomför först den enklare kundreseförbättringen

==================================================
TAYA OCH AI-SÖK
==================================================

Optimera sidan för både människor och AI-baserad research.

Sidan ska ge tydliga, sakliga och fristående svar på verkliga köparfrågor inom:

• pris och kostnad
• problem och begränsningar
• risker
• alternativ
• jämförelser
• när produkten passar
• när produkten inte passar
• implementation
• interna förutsättningar
• förvaltning efter införandet
• partnerurval

Använd gärna frågebaserade rubriker där det förbättrar förståelsen.

Exempel:

• Är [PRODUKTNAMN] rätt för oss?
• När passar [PRODUKTNAMN] mindre bra?
• Vilka alternativ bör vi jämföra med?
• Vad påverkar kostnaden?
• Vad krävs av vår organisation?
• Vilka risker bör vi analysera?
• Hur väljer vi rätt partner?

Använd bara frågor där sidan kan ge ett sakligt och underbyggt svar.

Svaren ska kunna förstås även om de visas fristående i ett sökresultat eller AI-svar.

Undvik:

• generisk Microsoft-marknadsföring
• överdrivna superlativ
• långa introduktioner
• upprepade produktbeskrivningar
• obelagda effektpåståenden
• vaga AI-löften
• text skriven enbart för sökmotorer
• formuleringar som försöker dölja nackdelar
• innehåll som automatiskt rekommenderar Microsoft

==================================================
D365.SE:S REDAKTIONELLA ROLL
==================================================

Sidan ska uppfattas som köparens beslutsstöd, inte som Microsofts produktsida eller en enskild partners säljsida.

Om sidans befintliga innehåll stödjer det ska d365.se tydligt kunna säga:

• produkten kan vara för avancerad
• organisationen kanske inte är redo
• ett enklare alternativ kan räcka
• problemet bör lösas innan en produkt väljs
• data, processer eller ägarskap kan behöva förbättras först
• Microsoft behöver inte vara det bästa alternativet
• partnerns kompetens kan vara lika viktig som produktvalet

D365.SE:s bedömning ska vara:

• tydligt avgränsad
• saklig
• balanserad
• användbar för beslut
• fri från obelagda tvärsäkra slutsatser

Bedömningen ska inte duplicera hela sidan.

==================================================
DESIGN OCH SKANNBARHET
==================================================

Behåll d365.se:s befintliga visuella identitet.

Förbättra i första hand:

• informationshierarki
• rubrikordning
• skannbarhet
• avstånd mellan sektioner
• CTA-hierarki
• mobil läsbarhet
• konsekvens mellan produktsidor

Använd inte stora visuella komponenter bara för att fylla sidan.

Prioritera enkla och funktionella komponenter som redan används på sajten.

Exempel:

• kort introduktion
• tydliga vägval
• jämförelselänkar
• tre användarlägen
• kompakta riskblock
• beslutssteg
• relevant nästa CTA

Sidan ska inte se exakt likadan ut som alla andra produktsidor.

Den ska däremot använda samma logik och komponentprinciper.

==================================================
BEGRÄNSNINGAR
==================================================

Gör INTE:

• en total redesign
• en ny produktsida
• stora ändringar i d365.se:s visuella identitet
• nya verktyg utan uttryckligt uppdrag
• nya integrationer utan uttryckligt uppdrag
• påhittade produktfunktioner
• nya prisuppgifter utan verifierad källa
• fiktiva kundcase
• fiktiva referenser
• fiktiva ROI-resultat
• fiktiva partnerkompetenser
• partnerbetyg som inte stöds av data
• obelagda konkurrentjämförelser
• dubbletter för SEO
• generiska AI-genererade textblock
• borttagning av fungerande innehåll utan analys
• ändring av befintliga fungerande URL:er utan särskilt skäl

Fokus ska vara:

MINSTA MÖJLIGA FÖRÄNDRING
SOM SKAPAR TYDLIGAST MÖJLIGA KUNDRESA

==================================================
SPÅRNING OCH MÄTBARHET
==================================================

Behåll befintlig spårning.

Om befintlig eventstruktur stödjer det ska följande typer av steg kunna mätas konsekvent mellan produktsidor:

• klick till jämförelse
• start av matchningstest
• start av behovsanalys
• start av kostnads-/TCO-analys
• start av kravspecifikation
• klick till partnerkatalog
• start av partnermatchning
• visning av partnerprofil
• kontaktintresse

Skapa inte en ny analysarkitektur inom detta uppdrag.

Om nödvändiga events saknas ska dessa dokumenteras separat som rekommendationer, utan att nuvarande spårning förstörs.

Eventnamn bör vara konsekventa mellan produktsidor och kompletteras med produktidentifiering, så att resor kan analyseras både per produkt och totalt för d365.se.

==================================================
MÅLBILD
==================================================

Efter förändringen ska produktsidan inte främst kännas som:

"Allt om [PRODUKTNAMN]"

Den ska kännas som:

"Ta reda på om [PRODUKTNAMN] passar ert behov och vad ni bör göra härnäst."

Besökaren ska snabbt kunna förstå:

1. vilket problem produkten löser
2. när den passar
3. när den inte passar
4. vilket viktigt vägval som behöver göras
5. vilka alternativ som bör jämföras
6. hur behovet kan analyseras
7. hur ett beslutsunderlag kan skapas
8. hur relevanta partners kan hittas

==================================================
ACCEPTANCE CRITERIA
==================================================

Efter implementation ska följande vara uppfyllt:

• befintligt värdefullt innehåll är bevarat
• befintliga fungerande länkar fungerar fortfarande
• befintliga verktyg fungerar fortfarande
• dubblerat innehåll har reducerats
• kundens problem kommer före långa funktionsbeskrivningar
• produktens viktigaste vägval är tydligt
• tre primära användarlägen är tydliga
• varje viktig sektion har ett logiskt nästa steg
• CTA:er konkurrerar inte i onödan
• jämförelser är enkla att hitta
• produkten framställs inte automatiskt som rätt för alla
• d365.se:s köparsidiga bedömning är tydlig
• inga obelagda fakta har skapats
• inga fiktiva partnerpåståenden har skapats
• sidan fungerar responsivt på mobil och desktop
• sidans metadata och befintliga relevanta URL:er har inte skadats
• sidan passar in i d365.se:s gemensamma köparmodell
• den produktspecifika identiteten är fortfarande tydlig

==================================================
ARBETSSÄTT FÖRE IMPLEMENTATION
==================================================

Analysera först den befintliga sidan.

Skapa en intern nulägesanalys med följande rubriker:

1. BEHÅLL

Vilket befintligt innehåll och vilka komponenter fungerar bra?


2. SLIMMA

Vilka delar överlappar eller upprepar varandra?


3. SORTERA OM

Vilka delar ligger i fel ordning i förhållande till köparens frågor?


4. KOPPLA IHOP

Vilka befintliga länkar och verktyg bör bli tydligare nästa steg?


5. VERKLIGA LUCKOR

Vilken information eller funktion saknas faktiskt?


6. GENOMFÖR NU

Vilka förändringar kan genomföras inom befintlig sida och funktionalitet?


7. SENARE UTVECKLING

Vilka förbättringar kräver nytt innehåll, ny data eller ny funktionalitet?

Genomför därefter förbättringen.

Gör inte en ny sida.

Gör inte en stor teknisk ombyggnad.

Återanvänd befintliga komponenter där det är möjligt.

==================================================
SLUTKONTROLL
==================================================

Kontrollera efter implementationen:

• desktop
• mobil
• interna länkar
• CTA-länkar
• ankarlänkar
• jämförelselänkar
• verktygslänkar
• partnerlänkar
• rubrikhierarki
• eventuell strukturerad data
• sidtitel och metabeskrivning
• att indexerbart innehåll inte av misstag dolts
• att viktigt befintligt innehåll inte försvunnit
• att inga nya fakta har lagts till utan underlag
• att det finns ett tydligt nästa steg för samtliga tre användarlägen

Redovisa därefter kort:

1. vad som behölls
2. vad som slimmades
3. vad som sorterades om
4. hur kundresan förbättrades
5. vilka luckor som återstår
6. vilka förändringar som inte genomfördes och varför
```

## Så fyller du i mallen för respektive sida

### F&SCM

```text
Produkt: Dynamics 365 Finance & Supply Chain Management
Produkttyp: Enterprise ERP
Viktigaste vägval: Finance, Supply Chain Management eller båda?
Primärt verktyg: Matchningstest för F&SCM
Jämförelser: Business Central, SAP S/4HANA och Infor M3
Partnerkategori: F&SCM-partners
```

### Dynamics 365 Sales

```text
Produkt: Dynamics 365 Sales
Produkttyp: CRM och säljstöd
Viktigaste vägval: Behöver vi ett avancerat CRM, ett enklare säljstöd eller en bredare kundplattform?
Primärt verktyg: Behovsanalys
Jämförelser: De CRM-jämförelser som redan finns på d365.se
Partnerkategori: Dynamics 365 Sales- och CRM-partners
```

### Customer Insights

```text
Produkt: Dynamics 365 Customer Insights
Produkttyp: Marketing automation och CDP
Viktigaste vägval: Customer Insights – Journeys, Customer Insights – Data eller båda?
Primärt verktyg: Behovsanalys
Jämförelser: HubSpot Marketing Hub och Salesforce Marketing Cloud
Partnerkategori: Customer Insights-, CRM- och marketing automation-partners
```

## Min rekommendation

Använd mallen **en produktsida i taget**, inte som ett enda uppdrag att automatiskt förändra hela sajten. Modellen ska vara gemensam, men varje sida behöver först analyseras för dubbleringar, verkliga luckor och sitt eget centrala vägval.

Den gemensamma ryggraden blir:

> **Förstå → jämför → bedöm behovet → bygg beslutsunderlaget → hitta rätt partner**

Men det som gör varje sida relevant är dess specifika beslut:

- F&SCM: Finance, SCM eller båda?
- Customer Insights: Journeys, Data eller båda?
- Sales: avancerat CRM, enklare säljstöd eller bredare kundplattform?

På så sätt får d365.se en sammanhängande köparupplevelse utan att produktsidorna blir mallade kopior av varandra.

**Huvudförändringen i mallen:** Jag har separerat den gemensamma kundresan från produktens unika vägval, lagt in en tydlig före/efter-analys och begränsat Lovable från att skapa mer text eller ny funktionalitet när det egentliga behovet är att slimma och koppla ihop det som redan finns.