# Förtydliga köpresan på startsidan

## Mål
Göra startsidans väg från behov till partnerkontakt tydlig och resultatinriktad:

```text
Behov → Partnerurval → Jämförelse → Kontakt
```

## Ändringar

### 1. Hero med tydligare resultat
- Behåll rubriken **”Hitta rätt Dynamics 365-partner på några minuter”**.
- Byt ingressen till: **”Jämför svenska Dynamics 365-partners utifrån bransch, lösning, erfarenhet och specialistkompetens innan du tar kontakt.”**
- Behåll de frivilliga bransch- och lösningsvalen samt primärknappen **”Hitta rätt partner”**.
- Lägg tre korta förtroendepunkter direkt under knappen: aktuellt antal kartlagda partners, aktuellt antal branscher och **40+ års erfarenhet av ERP- och Dynamics-val**.
- Antalen hämtas dynamiskt från befintlig partner- och branschdata, inte från fasta texter.

### 2. Processen direkt under hero
- Flytta den befintliga statistikdelen ur hero så att processblocket ligger direkt under hero och före statistiken.
- Bygg om det befintliga **”Så fungerar det”**-blocket, utan att skapa ett till, med den nya rubriken, ingressen och de fyra angivna stegen.
- Ge stegen tydliga ikoner för behov, sökning, jämförelse och kontakt.
- Behåll förtroendetexten om att inga partners får uppgifterna innan besökaren själv väljer kontakt.
- Visa därefter den befintliga översiktsstatistiken i ett eget lugnt band.

### 3. Partnerurvalet blir en tydlig kortlista
- Byt introduktionen ovanför partnerlistan till **”Bygg din kortlista”** och den angivna förklaringen om att markera upp till tre partners.
- Behåll filter, partnerkort och nuvarande maxgräns på tre.
- Förtydliga kortens valknapp så att det framgår att partnern läggs till i jämförelsen.

### 4. Sticky jämförelsepanel
- Förfina den befintliga globala jämförelsepanelen i stället för att skapa en ny.
- Visa **”1 partner vald”**, **”2 partner valda”** eller **”3 partner valda”** och knappen **”Jämför valda partner”**.
- Panelen visas så snart en partner valts och följer med vid scrollning.
- Vid ett val är knappen synlig men inaktiv med en kort upplysning om att minst två partners krävs; vid två eller tre val öppnas jämförelsen med rätt partner och aktiva filter.
- Behåll möjlighet att ta bort val och rensa kortlistan.

### 5. Avslut direkt efter partnerlistan
- Ersätt det nuvarande separata jämförelseblocket med ett avslut i direkt anslutning till partnerlistan:
  - **”Redo att gå vidare?”**
  - Texten om att jämföra valda partners och skapa en kortlista före kontakt.
  - Primär CTA **”Jämför valda partner”**, kopplad till de faktiska valen och inaktiv tills två är valda.
  - Sekundär CTA **”Starta behovsanalys”**, som öppnar befintligt val mellan analyser.

### 6. Resultatinriktad mikrocopy på startsidan
- Gå igenom startsidans vägval, verktyg och jämförelseytor och ändra relevanta texter från funktionsnamn till tydliga resultat och nästa steg.
- Använd bland annat **”Få en rekommendation på några minuter”** där behovsanalysen presenteras och **”Jämför partner innan du tar kontakt”** där jämförelsen introduceras.
- Behåll den centrala huvud-CTA:n **”Hitta rätt partner”** och undvik att flera fyllda primärknappar konkurrerar inom samma block.
- Ändra inte copy på andra sidor i detta uppdrag.

## Tekniska detaljer
- Huvudsakliga ändringar görs i startsidan, det befintliga partnergridet och den befintliga sticky jämförelsepanelen.
- Befintlig jämförelsekontext, sessionslagring, filterparametrar och jämförelsesida återanvänds.
- Alla färger och kontrollstilar använder befintliga designtokens och knappkomponenter.
- Ingen partnerdata, ranking, kontaktlogik eller backend ändras.

## Kontroll
- Kontrollera desktop och mobil: ordning mellan hero, process och statistik; textpassning; filter; val av 1, 2 och 3 partners; sticky panel; borttagning/rensning; jämförelselänk; behovsanalysval.
- Kontrollera att endast en tydlig primär handling visas per block och att inga gamla dubblerade jämförelseblock eller motstridiga texter finns kvar.
- Kör relevanta tester och en webbläsarkontroll av hela startsidans köpresa.
