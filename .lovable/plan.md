# Partnerns egen beskrivning ska styra lämplighetsbedömningen

## Mål
Göra bedömningen **Passar bäst för** och **Mindre lämplig för** konsekvent för alla partnerprofiler. Partnerns egen beskrivning av typiska kunder och projekt ska väga tyngst. Strukturerade val om produkt, storlek, bransch och geografi används som kontroll, inte som en förenklad ersättning för partnerns text.

## Ändringar
1. **Gemensam källprioritet**
   - Prioritera partnerns egna texter för `Typiska kunder`, `Typiska projekt`, produktbeskrivning och positionering.
   - Använd valda storleksintervall, branscher, produkter och geografi som stöd och rimlighetskontroll.
   - Använd externa publika källor endast som komplettering.
   - AI får inte motsäga partnerns egen beskrivning utan tydligt verifierat underlag.

2. **Passar bäst för**
   - Låt den AI-assisterade sammanfattningen formulera kundsegmentet från partnerns egna ord, exempelvis **Medelstora och större företag** för Implema.
   - Visa denna bedömning före den tekniskt beräknade storleksetiketten i snabböversikten.
   - Behåll exakt storleksintervall som separat faktarad, exempelvis **50–999 anställda**.

3. **Mindre lämplig för**
   - Generera avgränsningar som en försiktig konsekvens av partnerns uttalade målgrupp, produktfokus, branscher och leveransmodell.
   - Förbjud slutsatser som saknar stöd, och undvik att tolka ett uteblivet påstående som ett negativt faktum.
   - Märk fortsatt detta som d365.se:s bedömning, inte som partnerns eget påstående.

4. **Alla AI-sammanfattningar**
   - Uppdatera instruktionerna för kort sammanfattning, fördjupad analys, `Passar bäst för` och `Mindre lämplig för` så samma källprioritet gäller överallt.
   - Säkerställ att produktområdets egen `Typiska kunder` används, inte bara den korta företagsbeskrivningen.

5. **Befintliga profiler**
   - Generera om d365.se:s lämplighetsfält för publicerade partnerprofiler med den nya källprioriteten.
   - Skriv inte över partnerägda profiltexter eller partnerns egna val.
   - Kontrollera Implema särskilt: snabböversikten ska uttrycka **Medelstora och större företag**, visa **50–999 anställda**, och låta avgränsningen följa deras beskrivna kundprofil.

## Kontroll
- Testa Implema och ett urval av Business Central-, F&SCM- och CRM-partners.
- Kontrollera att snabböversikt, fördjupad rekommendation och AI-sammanfattning inte motsäger varandra.
- Kontrollera att inga partnerägda texter ändrats och att sidan fungerar på mobil och dator.

## Tekniskt
- Samla partnerns produktvisa profiltexter till ett tydligt källunderlag i AI-funktionerna.
- Inför uttryckliga regler för källprioritet och konservativ negativ inferens.
- Justera snabböversikten så den använder den redaktionella kundsegmentsbedömningen med strukturerat intervall som separat fakta.
- Publicera berörda funktioner och verifiera typkontroll samt den synliga profilsidan.
