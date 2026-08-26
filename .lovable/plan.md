# Svara på riktiga frågor – benchmark av d365.se

## Så klarar sajten de fyra punkterna idag

**1. Matcha inte exakta prompts (query fan-out) – delvis**
25 sidor har FAQ-block med `FAQPage`-schema, och `/kostnad/`, `/priser/`, `/erp/`, `/businesscentral/`, `/crm/`, `/copilot/`, `/d365sales/` och `/d365fieldservice/` fick nyligen frågeformulerade poster. Men frågorna är i huvudsak "första frågan" – följdfrågorna som en AI ställer vidare (jämförelser, "passar det oss?", "vad krävs av oss?", "hur lång tid tar det?") saknas i de flesta block.

**2. Relaterade frågor från Google – svag**
Inget arbete utgår idag från Googles relaterade frågor/People Also Ask. FAQ-innehållet är skrivet utifrån vår egen bild av köparens frågor.

**3. Lyssna på kundernas faktiska frågor – svagast**
Sajten har `/fraga-ai` och AI-sök, men edge-funktionen `ai-chat` sparar ingenting. Varje verklig besökarfråga försvinner. Samma sak gäller frågor som kommer in via leadformulär (fritextfältet) – de läses men återanvänds inte i innehållet.

**4. Google Search Console + REGEX – god grund**
GSC är kopplat och `gsc-stats` hämtar frågor och sidor. Senaste 28 dagarna: 78 klick, 25 659 visningar, CTR 0,3 %, snittposition 31,8. En regex-genomgång av frågeformade queries gjordes manuellt en gång, men den är inte återkommande och finns inte i admin.

Sammanfattning: teknik och FAQ-grund finns, men sajten saknar en **loop** som fångar riktiga frågor och omvandlar dem till innehåll.

## Vad som byggs

### A. Fånga riktiga frågor (punkt 3)
- Ny tabell `visitor_questions`: frågetext, källa (`ai-chat`, `lead-form`, `sökfält`), sida, tidsstämpel, om AI kunde svara, samt admin-fält för status (`ny`, `besvarad`, `ignorerad`) och koppling till målsida.
- Ingen personinformation sparas – bara frågetexten. RLS stänger anon/authenticated; endast service role skriver, admin läser via edge-funktion.
- `ai-chat` loggar frågan (inte svaret) efter varje anrop.

### B. Frågeinsikter i admin (punkt 2 + 4)
- Ny adminflik **Frågor** som samlar:
  - Besökarfrågor från `visitor_questions`, grupperade och sorterade efter frekvens.
  - Frågeformade GSC-queries via regex (`vad|hur|varför|vilken|kostar|skillnad|bäst|kan man|när`), med visningar, klick och position – utökar `gsc-stats` med ett query-uttag på 1 000 rader.
  - Markering av vilka frågor som redan besvaras av ett FAQ-block på sajten (matchning mot befintliga FAQ-poster) så att luckorna syns direkt.
- Varje rad får åtgärderna "besvarad" och "ignorerad" så listan blir en arbetslista, inte en rapport.

### C. Fan-out-frågor i innehållet (punkt 1)
- Utöka FAQ-blocken på de sex mest visade sidorna (`/businesscentral/`, `/erp/`, `/kostnad/`, `/crm/`, `/d365sales/`, `/copilot/`) med följdfrågor i tre kategorier: jämförelse, förutsättningar hos kunden, och tid/insats.
- Svaren skrivs i klarspråk, med källa eller villkor där en siffra nämns (SourceNote-regeln).

### D. Relaterade frågor från Google (punkt 2)
- Adminfliken får ett fält där du klistrar in relaterade frågor från en Google-sökning per produktområde. De hamnar i samma arbetslista som GSC- och besökarfrågorna, så allt hanteras på ett ställe.

## Teknisk sammanfattning
- Migration: `visitor_questions` med GRANT till `service_role`, RLS på, ingen anon/authenticated-åtkomst.
- `supabase/functions/ai-chat/index.ts`: fire-and-forget-insert av frågetext.
- `supabase/functions/gsc-stats/index.ts`: nytt query-uttag med `rowLimit: 1000` för regexfiltrering.
- Ny edge-funktion `manage-visitor-questions` (adminautentiserad, list/uppdatera status/lägg till manuell fråga).
- Ny komponent `src/components/AdminQuestionsTab.tsx`, kopplad i `src/pages/AdminDashboard.tsx`.
- FAQ-tillägg i respektive produktsida; befintlig `FAQSchema` återanvänds så schemat följer med automatiskt.

## Utanför omfattningen
Ingen ändring av besöksstatistiken eller dess sekretessregler; inga nya spårningsskript.
