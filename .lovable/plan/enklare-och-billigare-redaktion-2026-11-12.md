# Enklare och billigare Redaktion

## Resultat
- Mobilvänlig Redaktion med tydlig navigation, rymliga formulär och en hemskärmsapp som öppnar /redaktion/. Ingen offline-cache införs.
- Valbar ”Kom ihåg mig” i upp till 30 dagar, med fortsatt kontroll av redaktörsbehörighet och säker utloggning.
- Quick Post: käll-URL, ”Hämta info”, redigerbar rubrik och ingress, produkt/ämne och förhandsvisning. Hämtningen använder metadata utan AI när det räcker. Ett publiceringsklick behåller kraven på primärkälla, faktakontroll och klar verifiering.
- Daglig import av ett begränsat antal officiella Microsoft-nyheter till Aktuellts befintliga granskningskö. Dubbletter hoppas över och inget publiceras automatiskt.
- ”Drift & Snabbåtgärder” med administratörens Snitcher-synk, senaste lyckade synk och direkta nedladdningar av befintlig månadsrapport och funnel-data.
- Förbättrad Word-import med tydlig importstatus, förhandsvisning och möjlighet att läsa in en uppdaterad fil i samma utkast utan att skriva över redaktionella val oavsiktligt.
- De efterfrågade AI-anropen i manage-aktuellt, seo-potential och autofill-partner-profile använder Gemini 3.8 Flash enligt Thomas val. Övriga modeller behålls. Faktisk besparing mäts; 80–90 procent utlovas inte.

## Tekniskt upplägg
- Återanvänd useEditorAuth, editor-session, RedaktionAktuelltTab, Word-konverteringen och befintliga exportflöden. Inga parallella artikel- eller publiceringsmodeller.
- Behåll kortlivade behörighetstoken och förnya dem via den verifierade inloggningen i stället för att skapa ett administratörstoken giltigt i 30 dagar. Återkallad behörighet och utloggning ska avsluta åtkomsten.
- Manifest och befintliga varumärkesikoner för hemskärmsappen; inget service worker-lager.
- Källhämtning skyddas mot interna adresser, osäkra omdirigeringar och för stora svar. Källinnehåll behandlas som data, inte instruktioner.
- Nyhetsimporten körs dagligen med begränsad batch, lås och dubblettskydd. Metadata sparas först; AI-bedömning görs på uttryckligt redaktörsval för att begränsa löpande kostnader. Managed schemaläggning konfigureras enligt plattformens regler.
- Modellbytet använder AI Gateway via dokumenterad Gemini-klient med befintliga resultatformat, gränser och felhantering bevarade.
- Alla nya texter håller Microsoft Dynamics 365 och Dynamics 365 samman på samma rad.

## Kontroll
- Tester för 30-dagarsgräns, utloggning, återkallad behörighet, publiceringskrav, dubblettskydd och importgränser.
- Verkliga inloggade flöden: Quick Post, Word-utkast, Snitcher-synk och nedladdningar. Testutkast städas bort.
- Mobil och dator granskas, liksom hemskärmsmanifest och verkliga svar från de tre uppdaterade AI-anropen.

## Separat pågående inskick
Beslutsmognadsindex finns i projektets webbplatskarta. Bing har accepterat sidans URL och Google bekräftar att sidan redan är indexerad. Publicering har begärts, men nya webbplatskartan var ännu inte synlig vid efterkontrollen. Skicka den till båda tjänsterna när den publicerade versionen är bekräftad; inga nya indexeringslöften.
