## Mål

Bygga en internationell version av d365.se på en ny .com-domän i ett **separat projekt** (remix). Den svenska sajten på d365.se lämnas orörd.

Språk/routning:
- `d365guide.com/` → engelska (global default)
- `d365guide.com/no` → norska
- `d365guide.com/dk` → danska (förberedd, kan aktiveras senare)
- Fler länder (`/nl`, `/de` …) läggs till med samma mönster

Fas 1 innehåller **endast Norge + engelsk global**. Danmark, Nederländerna m.fl. läggs till efter att mönstret är verifierat.

## Förutsättning innan bygget startar

Detta måste ske i ett **nytt projekt** (Remix av det här). Skäl: routes, databas, admin och SEO-struktur ändras djupt — att göra det här skulle påverka live-sajten d365.se.

Steg du gör manuellt:
1. Högerklicka projektet i sidopanelen → **Remix** → namn t.ex. `d365guide-international`.
2. Öppna det nya projektet och skriv: "Kör Fas 1 enligt planen från d365.se".
3. Koppla `d365guide.com` under Project Settings → Domains i det nya projektet när Fas 1 är klar.

Resten av planen beskriver vad som byggs i det nya projektet.

## Fas 1 – Grundstruktur (nytt projekt)

### 1. Routing och språkdetektering
- Ny route-struktur i `App.tsx`: alla routes wrappas i `/:locale?` där `locale ∈ {'', 'no', 'dk'}`. Tomt = engelska.
- Ny komponent `LocaleProvider` som läser `:locale` från URL och exponerar `locale`, `country`, `t()` via context.
- Redirect-logik på `/` (client-side i `LocaleRedirect.tsx`):
  1. Läs cookie `preferred_locale` — om satt, respektera.
  2. Annars läs `navigator.language`: `nb`/`no` → redirect till `/no`, `da` → `/dk`, annars stanna på `/` (engelska).
  3. Cookie sätts när användaren aktivt byter språk (aldrig av autodetektering, för att undvika låsning).
- Språkväljare i header (flagga + kod) som byter locale-prefix på nuvarande path och sätter cookien.

### 2. i18n-lager
- Installera `i18next` + `react-i18next`.
- Nycklar per språk i `src/i18n/{en,no,dk}.json`. Start: alla UI-strängar från nav, hero, CTA, formulär, footer, admin skippas i Fas 1.
- Wrapper `useT()` runt `useTranslation` med typade nycklar.

### 3. Databas – landsdimension
Migration i det nya projektets Lovable Cloud:
- Ny kolumn `country_code text not null default 'no'` på `partners`, `partner_news`, `knowledge_articles`, `industry_pages`, `leads`, `partner_feeds`.
- Ny kolumn `content_locale text not null default 'en'` på samma tabeller (för översatt innehåll).
- Index på `(country_code, content_locale)` för snabb filtrering.
- Alla queries i frontend filtreras på nuvarande `country_code` (härlett från locale: `no`→`no`, `dk`→`dk`, `''`→visa alla eller "global"-flaggade).
- RLS-policies uppdateras så publika vyer respekterar country_code.

### 4. SEO per språk
- `<html lang>` sätts dynamiskt av `LocaleProvider`.
- `hreflang`-taggar i `index.html` + per-route (`en`, `nb-NO`, `da-DK`, `x-default`).
- `sitemap.xml` byggs med alla routes × alla aktiva locales.
- `robots.txt` tillåter allt.
- Metadata (title/description/OG) översätts per locale.

### 5. Ta bort Sverige-specifikt
- Priser i SEK → visas som "Contact for pricing" i engelska; NOK i /no.
- Referenser till "Sverige", svenska myndigheter, Bolagsverket etc. tas bort eller flyttas till svenska sajten.
- E-postmallar och PDF-mallar översätts.

### 6. Admin
- Admin-dashboarden får en `country_code`-väljare (Norge / Global) längst upp; all data filtreras på den.

## Fas 2 – Innehållsmigrering (efter Fas 1 är live)

- Norska partners läggs in manuellt eller importeras från lista du levererar.
- Nyheter/artiklar översätts via AI (Lovable AI Gateway, batch) med manuell granskning av strategiska sidor.
- Kunskapscenter översätts först till engelska, sedan till norska.

## Fas 3 – Fler länder

När Norge fungerar: lägg till `/dk`, `/nl`, `/de` genom att:
1. Lägga till locale-nyckeln i `LocaleProvider`.
2. Lägga till översättningsfil `src/i18n/xx.json`.
3. Importera landets partners med rätt `country_code`.

Ingen kodstruktur behöver ändras.

## Vad du gör nu

1. Remixa detta projekt → nytt projekt `d365guide-international`.
2. Öppna det och be mig starta Fas 1.
3. Svara här när det är gjort, eller om du vill ändra något i planen först.

## Vad som INTE händer

- Ingenting ändras i detta projekt (`d365.se`).
- Ingen databas rörs här.
- Inga edge functions ändras här.
