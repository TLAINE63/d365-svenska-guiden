# Fix: sökningen av publika källor kraschar

## Vad som händer

När du klickar "Sök publika källor" på Accigo avbryts körningen med felet
`rows is not iterable`. Felet ligger i hur sökresultaten från webbsökningen läses.

Bekräftat i loggen för funktionen som gör sammanställningen, och i koden:
webbsökningen svarar med resultaten i en underliggande `web`-lista
(`data.web`), men koden behandlar `data` som om den redan vore listan. När
svaret har den formen kraschar hela körningen innan något sparas, därför blir
resultatet "AI kunde inte uppdatera några publika källor".

## Åtgärd

1. Läs sökträffarna robust: acceptera både `data` som lista och
   `data.web` / `web` som lista, och hoppa över svar som inte är listor.
2. Samma robusta läsning för kartläggningen av partnerns webbplats
   (`links` kan ligga på toppnivå eller under `data`).
3. Gör varje enskild källhämtning felsäker: om kartläggningen eller en
   sökfråga misslyckas ska körningen fortsätta med övriga källor i stället
   för att avbrytas helt.
4. Om ingen extern källa hittas alls: fortsätt ändå med partnerns interna
   innehåll och returnera ett tydligt meddelande i stället för ett fel.
5. Kör om sökningen för Accigo och kontrollera att sektionen fylls.

## Tekniska detaljer

- Fil: `supabase/functions/generate-partner-public-profile/index.ts`
  - `discoverPublicContent`: normalisera `mapped` och `res` via en
    `asArray`-hjälpare (`Array.isArray(x) ? x : []`) applicerad på
    `res?.data?.web ?? res?.web ?? res?.data`.
  - Lägg `try/catch` runt map-anropet och runt varje sökfråga, logga och
    fortsätt.
- Deploya funktionen efter ändringen.
- Ingen ändring i datamodell, UI eller partnerägda fält.
