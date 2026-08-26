# Plan: Lyfta Business Central-sidan från position ~21 mot första sidan

## Bakgrund
GSC-fynd: /businesscentral/ har 2 000+ visningar men CTR 0,2 % och snittposition 21,6 (sida 3). Titel/meta är redan uppdaterade ("Business Central ERP – pris & partners 2026"). Kvarstår: rankning och bättre matchning mot faktiska sökfrågor.

## Steg

### 1. Hämta faktiska sökfrågor (read-only)
- Slå upp i Search Console vilka queries som driver visningarna till /businesscentral/ senaste 90 dagarna (t.ex. "business central pris", "dynamics 365 business central", "business central partner").
- Resultatet styr exakt vilka formuleringar som förstärks i steg 2–3.

### 2. Förstärk innehållet mot sökintentionen
- Justera H1/ingress och sektionsrubriker så de speglar de vanligaste faktiska frågorna (behåll du-tilltal och TAYA-ton).
- Lägg till en kompakt jämförelsetabell Essentials vs Premium (pris, målgrupp, funktioner) – tabelldata rankar bra och svarar direkt på "pris"-intentionen.
- Utöka FAQ med 1–2 av de faktiska GSC-frågorna om de saknas (FAQ-schema finns redan och uppdateras automatiskt från samma datakälla).

### 3. Stärk internlänkning
- Lägg till/förstärk länkar till /businesscentral/ med beskrivande ankartexter ("Business Central-priser", "jämför Business Central-partners") från:
  - Pelarsidorna /erp och /affarssystem
  - Relevanta kunskapscenter-artiklar
  - Branschsidor där BC är vanlig produkt
- Följer befintliga regler för pillar-länkning (TOFU→MOFU→BOFU).

### 4. Verifiering
- Typecheck + bygge (SSG-prerender måste passa).
- Efter publicering: bevaka position/CTR i Search Console under kommande veckor (effekt syns normalt inom 2–6 veckor).

## Tekniska detaljer
- Berörda filer: `src/pages/BusinessCentral.tsx`, ev. `src/pages/ERPOverview.tsx`, `src/pages/Affarssystem.tsx`, relevanta artiklar i `src/data/blogArticles.tsx`.
- FAQ ligger i `bcFaqs` i BusinessCentral.tsx och matar både synlig accordion och FAQSchema – ändring där uppdaterar båda.
- Priser hämtas alltid via `resolvePriceTokens` / `usePriceMap()` – inga hårdkodade belopp.
- Ingen ändring av visitor analytics eller spårning.
