Plan: Länk till fpaa.se + byggfel

1. Byggfel
- `supabase/functions/mcp/index.ts` är en autogenererad fil som Vite-pluginet vägrar skriva över eftersom den betraktas som användarägd. Byggfel: "refusing to overwrite user-authored file".
- Åtgärd: Ta bort `supabase/functions/mcp/index.ts`. Pluginet regenererar filen vid nästa bygge.
- Verifiera att `vite build --mode development` går igenom utan fel.

2. Länk till fpaa.se – placering och redovisning

2.1 /agande-och-intressen (primär plats)
Sidan förklarar redan hur partnersamarbetet fungerar och att d365.se står på köparens sida. Där är det naturligt att lägga till en sektion "Relaterade initiativ" eller "Andra projekt vi driver" som:
- Kort beskriver fpaa.se som en satsning på utbildning och vägledning inom finansiell planering och analys (FP&A).
- Redovisar öppet att fpaa.se ägs av samma personer som d365.se.
- Förklarar att syftet är att vägleda besökare, men att länken kan leda till intresse för Aimplan (en produkt där Cloud Ahead/d365.se-ägarna har intresse).
- Länkar textuellt till fpaa.se med `target="_blank"` och `rel="noopener noreferrer"`.
- Använder `related_party`-mönstret i enlighet med projektminnet om intressekonflikter.

2.2 Footer
- Lägg till en länk till fpaa.se i footerns nedre länkrad, bredvid "Så fungerar partnersamarbetet", "Friskrivning" och "Dataskyddspolicy".
- Länktext: "FPAA – finansiell planering & analys" eller motsvarande kort beskrivning.
- Samma säkerhetsattribut (`noopener noreferrer`) och extern-länk-hantering.

3. Material som uppdateras
- `src/pages/OwnershipAndInterests.tsx` – ny sektion med text och länk.
- `src/components/Footer.tsx` – ny länk i den nedre länkraden.
- `supabase/functions/mcp/index.ts` – raderas för att lösa byggfelet.

4. Validering
- Kör byggkommandot för att bekräfta att MCP-filen regenereras och bygget lyckas.
- Kontrollera att länken syns både på /agande-och-intressen och i footern, samt att den öppnas korrekt.
- Säkerställ att texten inte använder ordet "oberoende" (projektminne) och att intressekonflikten redovisas tydligt.