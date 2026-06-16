
# Plan: Omarbetning av ERP Behovsanalys

Det här är ett stort jobb. NeedsAnalysis.tsx är 3 387 rader, send-analysis-email 409 rader, och PDF-genereringen behöver byggas om. Jag föreslår att vi delar upp leveransen i fyra etapper så att varje del kan testas separat innan nästa börjar – annars riskerar vi en svårdebuggad bigbang-leverans.

## Etapp 1 – Formulärstruktur (Steg 1–8)

Skriver om frågeflödet i `src/pages/NeedsAnalysis.tsx`:

- **Steg 1 Verksamhetsmodell** (ersätter "Affärsmodell"): 10 huvudalternativ + följdfråga om kompletterande modell (multi-select, exkluderar huvudvalet) + dynamiska följdfrågor per modell (tillverkning, grossist, retail, projekt, konsult, service, uthyrning, abonnemang, fritext för "Annan").
- **Steg 2 Storlek**: nya intervall för anställda + uppdelat omsättningsspann (1–9, 10–49, 50–99, 100–249, 250–499, 500–999, 1 000–4 999, >5 000 MSEK) + ny fråga "Antal ERP-användare".
- **Steg 3 Bransch**: oförändrad lista, men frikopplas från systemindikation.
- **Steg 4 Komplexitet**: nya fält (valutor/språk/lokal moms, batch/serie, QA, EDI, kundunika priser, returflöden, projektredovisning, produktkonfigurator) + organisationsmognad (processägare, ERP-ägare, tidigare förändringsprojekt, ledningens samsyn, budget/tidplan, resurser). Dynamisk relevans utifrån vald verksamhetsmodell.
- **Steg 5 Geografi**: nya följdfrågor (sälj/lager/bolag i flera länder, valutor, språk, lokal moms).
- **Steg 6 Nuvarande situation**: utökad systemtabell (version, cloud/on-prem, driftstart, partner, anpassningsnivå, nöjdhet system 1–5, nöjdhet partner 1–5, största problem). "Övriga system" får hjälpchips.
- **Steg 7 Utmaningar**: ny rubrik "Varför ser ni över ert affärssystem?", 3-stegsskala (Betydande/Viss/Inget problem), nya områden (Datakvalitet & masterdata, Missnöje med ERP-partner, Integrationer skapar problem, För hög kostnad/förvaltning).
- **Steg 8 AI & framtid**: behålls men nedviktad i systemvalet.

## Etapp 2 – Analyslogik & Steg 9 (förhandsvisning)

Ny scoring i samma fil (eller utbruten till `src/utils/erpSystemIndication.ts`):

- 4 utfall: Business Central / Finance & SCM / "båda bör utvärderas" / "för tidigt att avgöra".
- Säkerhetsnivå Låg/Medel/Hög baserat på hur många centrala fält som är besvarade.
- Bedömd ERP-komplexitet i 4 nivåer + risknivå.
- Steg 9 visar: sammanfattning av svar, komplexitet, drivkrafter, riskområden, preliminär systemindikation, säkerhet, partnerprofil, nästa steg, kontaktformulär.
- Rubrikbyten: "Affärsmodell"→"Verksamhetsmodell", "Rekommenderad ERP-plattform"→"Preliminär systemindikation", "ERP Complexity Level"→"Bedömd ERP-komplexitet", "Bakom kulisserna lutar det mot"→"Indikationen bygger främst på:".
- Knapp "Ladda ned & skicka analys"→"Skicka PDF till min e-post", ny separat samtyckes-checkbox.

## Etapp 3 – Ny PDF-rapport

Bygger om PDF-genereringen (sannolikt jsPDF i en utils-fil) med struktur:

1. Förstasida (logo, titel, undertitel, företag, kontakt, datum, intro-text, footer "Köparsidig vägledning för Microsoft Dynamics 365")
2. Sammanfattning
3. AI-genererad tolkning (200–350 ord, ny edge function – se etapp 4)
4. Bedömd ERP-komplexitet (nivå + risk + drivande faktorer)
5. Preliminär systemindikation + säkerhet i analysen
6. Varför analysen lutar åt detta håll (punktlista)
7. Risker och frågor att utreda vidare
8. Rekommenderad partnerprofil
9. Rekommenderade nästa steg (3–7 punkter)
10. Bilaga – alla frågor och svar, grupperade per steg, "Ej angivet" för tomma
11. Disclaimer

Säkerställer svenska tecken (UTF-8 font i jsPDF, t.ex. inbäddad Roboto/NotoSans).

## Etapp 4 – AI-tolkning + e-postleverans

- Ny edge function `generate-erp-analysis` (eller utöka befintlig) som via Lovable AI Gateway (`google/gemini-3-flash-preview`) genererar:
  - AI-tolkning (200–350 ord)
  - Partnerprofiltext
  - Nästa steg-punkter
  - Riskpunkter
  Allt baserat på strukturerade svar. Returnerar JSON.
- Uppdatera `send-analysis-email` (eller skapa ny `send-erp-analysis-email`) så den:
  - Tar emot PDF (base64) + kontaktuppgifter
  - Skickar mejl med ämne "Din ERP Behovsanalys från d365.se", text enligt spec, PDF som bilaga
  - Loggar i `email_send_log`
  - Skickar BCC till intern inbox enligt befintlig praxis

## Teknisk översikt

- **Filer som ändras**: `src/pages/NeedsAnalysis.tsx` (stor), nya utils `src/utils/erpSystemIndication.ts` + `src/utils/generateErpAnalysisPdf.ts`, ny edge function `supabase/functions/generate-erp-analysis/index.ts`, uppdaterad `supabase/functions/send-analysis-email/index.ts`.
- **Inga DB-ändringar** krävs (befintlig lead-logg räcker).
- **Inga nya secrets** – LOVABLE_API_KEY och RESEND_API_KEY finns.

## Förslag på arbetsordning

1. Börja med **Etapp 1 + 2** (formulär + ny logik + steg 9-förhandsvisning) – det är största kund-synliga delen och kan testas direkt i preview.
2. Sedan **Etapp 3 + 4** (PDF + AI-tolkning + e-post) tillsammans – PDF:en behöver AI-texten.

Vill du att jag kör hela uppdraget i en sittning i den ordningen, eller ska vi stanna efter Etapp 1+2 och granska innan PDF/AI byggs?
