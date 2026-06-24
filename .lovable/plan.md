## Ersätt "oberoende" – kvarvarande träffar

En sökning på `oberoende` (exkl. JSON/dist) ger 13 träffar. De flesta tidigare förekomster är redan borta. Återstående uppdelas så här:

### 1. Kommersiell positionering / brödtext (ersätts med köparsidig vokabulär)
Inga rena "d365.se är oberoende"-formuleringar kvarstår — men sammansatta ord och tredjepartsreferenser bör städas för konsekvens.

| Fil | Nuvarande | Ny formulering |
|---|---|---|
| `src/pages/RequirementsSpec.tsx:203` | "Fånga dina verksamhetsbehov oberoende av system." | "Fånga dina verksamhetsbehov systemneutralt." |
| `src/pages/PartnerProfile.tsx:856` | "Branschoberoende" (badge) | "Branschneutral" |
| `src/pages/CRM.tsx:296` | "anpassningsbart och branschoberoende" | "anpassningsbart och branschneutralt" |
| `supabase/functions/generate-requirements/index.ts:376` | "Microsoft Dynamics 365 ERP (systemoberoende …)" | "Microsoft Dynamics 365 ERP (systemneutralt …)" |

### 2. Referenser till tredjepartskällor (byt "oberoende" → "fristående/neutralt")
Faktatext om externa analytiker/reviewsajter — neutralt, men användaren ville rensa alla förekomster.

| Fil | Ändring |
|---|---|
| `src/data/blogArticles.tsx:1216` | "oberoende analytiker" → "fristående analytiker" |
| `src/data/blogArticles.tsx:1843` | "Fanns oberoende underlag" → "Fanns neutralt underlag" |
| `src/data/productQA.ts:73` | "oberoende reviewsajter" → "fristående reviewsajter" |
| `src/pages/QA.tsx:130` | "oberoende reviewsajter" → "fristående reviewsajter" |
| `supabase/functions/_shared/market-context.ts` (rad 2, 6, 10) | "oberoende marknadsanalys" → "fristående marknadsanalys" |

### 3. Behålls oförändrade (skyddsregler i AI-prompter)
Dessa instruerar AI:n att INTE använda ordet — de ska stå kvar:
- `supabase/functions/generate-erp-analysis/index.ts:126`
- `supabase/functions/generate-customer-service-analysis/index.ts:122`
- `supabase/functions/smart-search/index.ts:87`

### 4. Behålls oförändrad (immutabel historik)
- `supabase/migrations/20260311205428_*.sql:4` — gammal migrationskommentar; migrationer ändras aldrig retroaktivt.

### Verifiering
- Sökning `rg -in oberoende` ska efter ändringen bara returnera punkt 3 och 4.
- Inga ändringar krävs i `index.html`, `SEOHead`, Navbar, Footer, `llms.txt` eller övriga metadata — sökningen visar att dessa redan är rensade.

Inga edge functions behöver redeployas (endast kommentar/promptkontext-ändring i `market-context.ts` och `generate-requirements`).
