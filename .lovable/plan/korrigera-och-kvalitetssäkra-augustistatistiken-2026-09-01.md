# Korrigera och kvalitetssäkra augustistatistiken

## Bekräftat nuläge
- Augusti hade **1 464 registrerade sidvisningar och 609 sessioner** i den råa besöksloggen.
- Partner Performance innehåller 470 event, men exponeringsspårningen där börjar först **26 augusti**. Den kan därför inte beskriva hela augusti.
- Den äldre exponeringskällan innehåller 425 rader under månaden, men saknar registrerade branschexponeringar. Startsidan hade 258 sidvisningar, men historiska kortexponeringar där kan inte räknas fram exakt i efterhand.
- Rapport- och adminflödena använder delvis olika statistiklogik, periodgränser, besökardefinitioner och interna trafikfilter.
- Ingen augustirapport är ännu godkänd eller skickad från rapporttabellerna.

## Plan

### 1. Skapa en gemensam och spårbar statistikmodell
- Samla beräkningarna för adminförhandsvisning, rapportutkast och faktiskt månadsutskick så samma underlag alltid ger samma siffror.
- Standardisera perioder till svensk kalendermånad med exklusiv slutgräns: `[månadens första dag, nästa månads första dag)`.
- Använd stabila partner-ID/sluggar i stället för namn där databasen medger det.
- Paginera stora datamängder och visa datakvalitetsfel i stället för att tyst kapa eller ignorera rader.

### 2. Räkna augusti från bästa verifierbara underlag
- Använd de äldre, månadstäckande tabellerna för profilvisningar, kortklick, webbplatsklick och filterexponeringar.
- Använd Partner Performance-event endast från den dag respektive mätpunkt faktiskt började samlas in.
- Slå inte ihop de två exponeringskällorna om samma händelse kan finnas i båda; definiera tydliga prioritets- och dedupliceringsregler.
- Återskapa inte saknade startsides- eller branschexponeringar med uppskattningar.

### 3. Gör täckningen tydlig i rapporten
- Märk augustis exponerings-, jämförelse- och trendmått som **delvis uppmätta** med startdatum och förklaring.
- Dölj procentuell “andel av alla exponeringar” när nämnaren inte täcker hela perioden.
- Separera verifierade helperiodsmått från nya Partner Performance-signaler.
- Ändra missvisande etiketter, inklusive “Er siffra (alla partners)”, och var tydlig med att identifierade företag bara omfattar samtyckt och synkroniserad företagsdata.

### 4. Säkerställ framtida total- och partnerstatistik
- Inventera och komplettera spårning på alla publika ytor där partnerkort faktiskt renderas: startsida, produkt-, bransch-, katalog-, guide-, jämförelse-, analys-, kravspecifikations- och kunskapscenterytor.
- Logga jämförelseval direkt och deduplicera konsekvent per session, partner och yta.
- Samordna produktionskontroll och botfiltrering mellan besöks-, profil-, klick- och exponeringsendpoints utan att släppa in previewtrafik.
- Automatisera synkronisering av företagsdata och visa senaste lyckade synkronisering i admin.
- Exkludera alltid Thomas egna besök/IP-prefix samt identifierad partner- och admintrafik i både totalsiffror och partnernivåer.

### 5. Lägg till en granskningsvy före godkännande
- Visa per mätpunkt: datakälla, täckningsperiod, antal rader, unika sessioner och eventuell kvalitetsvarning.
- Lägg till totalsumma och partnerfördelning så partners med noll eller ovanligt låga värden kan upptäckas innan utskick.
- Förhindra godkännande av en rapport med ofullständig täckning tills admin aktivt bekräftat varningen.
- Låt föregående avslutade månad vara standard; markera innevarande månad som preliminär.

## Verifiering
- Kör avstämning för augusti mellan rådata, adminförhandsvisning och genererad rapport för varje verifierad partner.
- Kontrollera att summan per partner motsvarar respektive verifierad total och att inga partnernamnsbyten tappar klick.
- Testa spårningen på samtliga publika ytor från produktion och verifiera deduplicering, botfilter och interntrafikfilter.
- Skicka inget automatiskt; rapporterna förblir utkast tills de har granskats och godkänts manuellt.

## Viktig begränsning
Saknade historiska exponeringar från tiden innan spårningen infördes kan inte rekonstrueras exakt. Augustirapporten ska därför vara transparent med vilka mått som är kompletta och vilka som bara avser en del av månaden.
