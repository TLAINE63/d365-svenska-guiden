# F&SCM-pilot: laddning och läsbarhet

Kontrollerad 2026-10-19 i lokal förhandsvisning. Ingen publicering och inga ändringar i sidinnehåll, expertuppgifter eller partnerdata.

## Resultat

- Mobil 390 × 844 och dator 1280 × 1800: inga runtimefel eller horisontell sidöverbredd.
- Kort svar, snabbfakta och källor granskade med skärmbilder. Text och pris ryms på mobilen.
- Efter skrollning genom hela mobilsidan: inga trasiga laddade bilder och fortsatt 390 px sidbredd.
- De tre huvudknapparna klickades. Efter avslutat sidbyte visades respektive destination: ”Matchar F&SCM dina behov?”, ”Beräkna ROI och TCO för F&SCM” och ”Finance & Supply Chain Management (F&O)-partners i Sverige”.
- Automatisk byggkontroll: build OK 2026-10-19T14:11:19Z.

## Laddning: indikativ lokal mätning

PerformanceObserver gav LCP 1,648 sekunder på mobil och 1,464 sekunder på dator. CLS var 0,000267 respektive 0,000161 under den initiala mätperioden. Detta är enstaka mätningar i Vite-förhandsvisningen utan simulerad långsam mobiluppkoppling, inte verifierade Core Web Vitals för den publicerade piloten. INP och verkliga besökares prestanda har inte verifierats.

En separat källgranskning fann reserverade bildytor för logotyp och produktikon, samt lazy loading för innehåll längre ned. Inget konkret laddnings- eller läsbarhetsfel identifierades som motiverar ändringar i piloten.

## Kvar utanför denna kontroll

- Produktionsmätning av den uppdaterade sidan kräver att den först publiceras.
- Expertkort lämnas dolda tills verkliga bidrag, roller och datum bekräftas.