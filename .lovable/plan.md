
# Plan: Hantera intressekonflikt vs. "oberoende"-positionering

## Bakgrund

Cloud Ahead (ägare till d365.se) har ekonomiska intressen i flera aktörer i Microsoft-ekosystemet: Nectar/MVI, Aimplan, samt rådgivningsuppdrag åt Knowit. Att marknadsföra sajten som "oberoende" samtidigt som matchningen kan leda affärer till närstående bolag riskerar att klassas som vilseledande marknadsföring (MFL 8–10 §§) och underminerar trovärdigheten om det avslöjas.

Vald strategi: **Hybrid** – ta bort/omformulera "oberoende" i kommersiell copy, ersätt med ärligare positionering ("köparsidig vägledning", "specialiserad guide"), och bygg en synlig, lättillgänglig intressedeklaration. Närstående partners markeras tydligt om de visas. Detta är den balanserade vägen: behåller varumärkets kärna utan att exponera dig juridiskt.

## Vad som ska göras

### 1. Ny sida: `/agande-och-intressen`

Skapa `src/pages/OwnershipAndInterests.tsx` med:

- **Vem som driver d365.se** – Cloud Ahead AB som ägare, Dynamic Factory som operativ avsändare, rådgivarna Thomas Laine & Michael Uhman.
- **Ekonomiska intressen** – tydlig tabell över bolag i Microsoft-ekosystemet där Cloud Ahead har ägande eller pågående uppdrag: Nectar/MVI, Aimplan, Knowit (rådgivningsuppdrag).
- **Hur vi hanterar intressekonflikten** – tre principer: (1) närstående partners markeras synligt i alla listor, (2) AI-matchningens ranking-algoritm beskrivs öppet och påverkas inte av ägarintressen, (3) partners betalar samma villkor oavsett relation (1 990 kr/mån per produktområde).
- **Så finansieras sajten** – partneravgifter, ingen kickback per lead, transparent prissättning.
- **Kontakt för frågor** – mail till info@d365.se.

Lägg till i `App.tsx`, sitemap, `partnerRoutes.json` om relevant, och i footern under "Om d365.se".

### 2. Omformulera "oberoende" på alla ~15 platser

Sök/ersätt-tabell (semantisk, inte mekanisk):

| Var | Idag | Nytt |
|---|---|---|
| SEO-titel, meta-description (Index, m.fl.) | "Oberoende guide till Microsoft Dynamics 365" | "Köparsidig guide till Microsoft Dynamics 365" |
| Footer ("Om d365.se") | "Oberoende guide..." | "Köparsidig vägledning för företag som väljer Dynamics 365 och partner." |
| Navbar alt-text, logotyp-tagline | "Oberoende guide..." | "Köparsidig D365-guide" |
| JSON-LD (Organization `description`) | "...oberoende..." | "...specialiserad köparsidig vägledning..." |
| PDF-rapporter, e-postmallar, admin sales pitch | "oberoende" | "köparsidig" / "specialiserad" |
| `llms.txt` | "Sveriges oberoende guide..." | "Sveriges specialiserade köparsidiga guide..." + nytt stycke om intresseredovisning som hänvisar till `/agande-och-intressen` |
| Microsoft-disclaimer i footer (redan tillagd) | "oberoende vägledningsplattform" | behåll som juridisk disclaimer (gäller relation till Microsoft – inte oberoende från D365-marknaden) – men förtydliga: "fristående från Microsoft Corporation" |
| Analysrapporter / `AnalysisDisclaimer` | – | ingen ändring (handlar om vägledning, inte oberoende) |

Tester som verifierar förekomsten av ordet "oberoende" (`seo-oberoende-vagledning.test.ts`) skrivs om till att verifiera "köparsidig" + att intressedeklarations-länken finns.

### 3. Märk närstående partners

Lägg till ett fält `related_party: boolean` (eller använd ett tag-fält som redan finns) i partner-datan. När detta är true:

- Visa en liten neutral badge "Närstående bolag – se [intresseredovisning](#)" på `PartnerCard`, `PartnerProfile`, samt i guidens resultat.
- AI-rankingen påverkas inte – men badgen måste alltid synas där partnern listas.
- I admin: enkelt toggle-fält i partnerredigeringen.

Initiala värden för Nectar/MVI, Aimplan, Knowit (om de finns i partner-tabellen) sätts via migration.

### 4. Uppdatera footer & navbar

- Footern: lägg till länk till `/agande-och-intressen` i "Om d365.se"-sektionen, ovanför Microsoft-disclaimern.
- Cookie-bannerns "Anpassa"-läge: oförändrad, men i privacy policy lägg till en mening med länk till intressedeklarationen.

### 5. Uppdatera memory

- Uppdatera `mem://content-strategy/taya-filosofi`: TAYA-principen kvarstår, men "oberoende" ersätts av "köparsidig + radikalt transparent om intressen".
- Skapa `mem://legal/intressekonflikt-och-kopar-sidig-positionering-sv`: dokumenterar vald strategi, listar närstående bolag, beskriver badge-logiken så framtida AI-loopar inte återinför "oberoende".
- Uppdatera Core-regeln i `mem://index.md`: "TAYA: köparsidig, radikalt transparent. Använd aldrig 'oberoende' i kommersiell copy – se intressekonfliktmemory."

## Tekniska detaljer

- Filer som ändras: `index.html`, `src/components/Footer.tsx`, `src/components/Navbar.tsx`, `src/pages/Index.tsx` (+ alla SEO-titlar via `SEOHead`-anrop), `src/pages/PrivacyPolicy.tsx`, `public/llms.txt`, `src/utils/generatePartnerGuide.ts`, `src/utils/generateRequirementsSpec.ts`, e-postmallar i `supabase/functions/send-*`, `src/components/AdminSalesPitchTab.tsx` + V2.
- Nya filer: `src/pages/OwnershipAndInterests.tsx`, ev. `src/components/RelatedPartyBadge.tsx`.
- Route: `/agande-och-intressen/` (trailing slash enligt projektets konvention) prerendras via SSG.
- Tester: uppdatera `seo-oberoende-vagledning.test.ts` → `seo-kopar-sidig-vagledning.test.ts`.
- Migration: lägg till `related_party boolean default false` på partner-tabellen + GRANTs enligt projektets policy.

## Vad jag INTE rör i denna iteration

- Ranking-algoritmen (oförändrad – beskrivs bara öppet på den nya sidan).
- Utesluter inte närstående partners från matchningen (du valde transparens framför separation – om du vill det senare är det en separat ändring).
- Ingen juridisk granskning beställs – jag rekommenderar att du låter en MFL-kunnig jurist läsa `/agande-och-intressen` och den nya footer-copyn innan publicering. Tekniskt går allt att deploya direkt; texten är det som behöver verifieras.

## Resultat

Efter implementation kan d365.se ärligt säga "köparsidig, specialiserad guide med transparent intresseredovisning" istället för "oberoende". Det är försvarbart juridiskt, mer trovärdigt om någon gräver, och behåller TAYA-positioneringen i sin starkare form: radikal transparens.
