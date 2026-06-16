## Mål
Bygga om `CustomerServiceNeedsAnalysis.tsx` enligt samma modulära mönster som `SalesMarketingNeedsAnalysis.tsx`, så att första frågan (område) styr hela flödet: följdfrågor, rubriker, PDF-titel, mognadsbedömning, lösningsinriktning, partnerprofil, nästa steg och e-postämne. Lägger till explicita sektioner för data/integrationer, datamognad och AI/agenter, samt logik för rekommenderad AI Assessment.

## Områdesval (steg 1)
Nytt första steg `focusArea` med alternativ:
- `customer_service` – Kundservice / Ärendehantering
- `field_service` – Fältservice
- `contact_center` – Contact Center
- `multi` – Flera av områdena
- `unsure` – Osäkert (diagnostisk multi-select om största problemen)

Val styr en `focusKey` ∈ `customer_service | field_service | contact_center | multi`. `unsure`-svaren mappas heuristiskt till en av dessa.

## Stegstruktur (dynamisk)
1. Område (alltid)
2. Företag/bransch/storlek (alltid)
3. Spårspecifika utmaningar + KPI:er
   - CS: ärenden, SLA, kunskapsdb, self-service, eskaleringar, KPI:er (FRT, FCR, CSAT…)
   - FS: serviceorder, planering, installerad bas, reservdelar, mobilt, KPI:er (first-time fix…)
   - CC: kanaler, routing, agentdesktop, realtidsrapport, KPI:er (AHT, abandon…)
   - multi: kombinerade utmaningsfrågor + samspel
4. Data, kundhistorik och integrationer (alltid) – systemlista + dataproblem
5. Datamognad för AI och agenter (alltid) – ägarskap, behörigheter, underlag, tillförlitlighet
6. AI, automation och agenter (alltid) – dynamiska use cases per spår, autonominivå, kontrollpunkter
7. Organisation och förändringsmognad (alltid)
8. Resultat + e-postformulär

Frågor som inte tillhör valt spår döljs (samma mönster som Sälj/Marknad – ingen lång lista över "fel" område).

## Resultat- och PDF-logik
- `focusConfig(focusKey)` returnerar: PDF-titel, mognadsrubrik, lösningsinriktningstext, partnerprofil, nästa steg, e-postämne.
- Mognadsbedömning: Nivå 1–4 + risknivå (Låg/Medel/Hög) beräknat per spår.
- Datamognad: Låg/Medel/Hög/Avancerad utifrån steg 5.
- AI-/agentpotential: AI-intresse / AI-assistans / Styrd automation / Autonoma agenter (beräknat från steg 6 + datamognad). Om datamognad låg men AI-intresse högt → tydlig varning i PDF.
- AI Assessment rekommenderas i PDF när: högt AI-intresse, agent/autonomi-intresse, låg/oklar datamognad, otydligt ägarskap/behörigheter, stora integrationsbehov, eller GDPR/loggning oklart.
- Preliminär lösningsinriktning ges som hypotes (D365 CS / FS / CC / kombinationer / Power Platform + Copilot Studio / "för tidigt"), aldrig som hårt val.

## PDF-struktur
Förstasida (titel per spår) → Sammanfattning → AI-tolkning (200–350 ord, via befintlig AI-edge-funktion eller fallback) → Mognad (rubrik per spår) → Viktigaste utmaningar → Data & integrationer → Datamognad → AI/agentpotential → ev. "Rekommenderad fördjupning: AI Assessment" → Preliminär lösningsinriktning → Varför analysen lutar åt detta håll → Risker → Partnerprofil → Nästa steg → Bilaga (alla frågor & svar) → Disclaimer.

## E-post (`send-analysis-email`)
Lägga till stöd för `focusKey` i kundservice-grenen så att ämnet blir:
- "Din behovsanalys för Kundservice från d365.se"
- "Din behovsanalys för Fältservice från d365.se"
- "Din behovsanalys för Contact Center från d365.se"
- "Din behovsanalys för Kundservice, Contact Center och Fältservice från d365.se"

## Filer som ändras
- `src/pages/CustomerServiceNeedsAnalysis.tsx` – stor refactor enligt ovan.
- `supabase/functions/send-analysis-email/index.ts` – dynamiskt ämne per `focusKey`.

## Det jag INTE rör
- Routing, navigation, SEO-komponenter och hero-bild behålls.
- Befintliga partner-/lead-flöden påverkas inte.
- Inga schemaändringar i databasen.

## Risk/omfattning
Stor refactor (~1800 rader). Jag behåller submit-/PDF-genereringsmönstret från Sälj/Marknad för konsekvens. Type-check körs efter ändringen.
