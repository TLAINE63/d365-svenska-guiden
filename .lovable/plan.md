
# Internationell sajt på d365guide.com – plan

Mål: En separat .com-sajt (remix av dagens kodbas) som täcker flera länder via URL-prefix `/no`, `/nl`, `/dk` osv. Sverige stannar på nuvarande `d365.se`. Användaren kan välja land och språk oberoende av varandra. Partners, nyheter och artiklar kan taggas för flera länder.

## Arkitektur

- **Ny sajt via Remix** av nuvarande kodbas → egen backend (Lovable Cloud), egen databas, egen dom­än `d365guide.com`.
- **Ingen koppling** till svenska databasen. Sverige-innehåll migreras inte hit – `d365.se` fortsätter som idag.
- **URL-struktur**: `/{country}/{path}` t.ex. `/no/partners`, `/nl/erp`. Root `/` visar landväljare (eller autodetektering via `Accept-Language` + IP).
- **Språkval separat från land**: t.ex. `/no?lang=en` eller cookie `preferred_lang`. UI-komponent i header med två dropdowns (Land / Språk).

## Land + språk-modell

- **Land** styr vilka partners, nyheter, priser och lokala sidor som visas.
- **Språk** styr översatt UI + översatt content (om översättning finns; annars fallback till engelska).
- Startspråk per land: `no → nb`, `nl → nl`, `dk → da`. Engelska (`en`) alltid tillgänglig som fallback.
- **Fas 1 lansering**: Norge (`/no`) + Nederländerna (`/nl`) med engelska + lokalt språk.

## Datamodell (ny backend)

Alla content-tabeller får en `countries text[]`-kolumn (taggar) i stället för `country text`:

- `partners.countries` (t.ex. `{no, nl}`)
- `partner_news.countries`
- `knowledge_articles.countries`
- `industry_pages.countries`
- Filter i alla queries: `WHERE '{country}' = ANY(countries)`
- Admin får multi-select på land per post.

Nya/kompletterande tabeller: `countries` (kod, namn, valuta, defaultspråk), `translations` (nyckel, språk, text) för UI-strängar.

## i18n

- **`react-i18next`** för UI-strängar. Alla hårdkodade svenska texter extraheras till `src/i18n/locales/{lang}.json`.
- **Basspråk för nya sajten = engelska**. Övriga språk (nb, nl, da) genereras via AI-översättning + manuell granskning av strategiska sidor.
- **Route-wrapper**: `<Route path="/:country/*">` läser land från URL, språk från query/cookie, sätter context.
- **SEO**: `hreflang`-taggar per land+språk-kombination, canonical per URL, separat `sitemap.xml` per land.

## Faser

**Fas 1 – Grund (denna leverans)**
1. Remix till `d365guide.com`, ny backend.
2. Route-struktur `/:country/*`, header med land+språk-väljare, landing på `/`.
3. `react-i18next` uppsatt, UI-strängar extraherade, engelska + norska + nederländska.
4. Datamodell konverterad till `countries text[]`, admin uppdaterad.
5. Landa Norge (`/no`) och Nederländerna (`/nl`) tomma – redo för partners.

**Fas 2 – Innehåll (separat prompt)**
- AI-översätta artiklar, produktsidor, e-post- och PDF-mallar.
- Lokala priser (NOK, EUR), lokala partners onboardade.
- SEO per land: hreflang, sitemap, robots.

**Fas 3 – Fler länder**
- Lägg till `/dk`, `/fi` osv. genom att lägga till rad i `countries`-tabellen + översättning.

## Tekniska detaljer

- **Ny dom­än**: `d365guide.com` kopplas efter Fas 1 publicerats.
- **Sverige oförändrad**: Länk från `d365guide.com` → `d365.se` för svenska besökare, och omvänt.
- **Delad admin?** Nej i Fas 1 – separata admin per sajt. Kan konsolideras senare vid behov.
- **E-post/PDF**: Mallar per språk, avsändare kvar på Thomas Laine tills lokal kontakt finns per land.

## Att bekräfta innan bygget startar

1. **Domännamn**: `d365guide.com` – ska jag anta det, eller vill du välja slutgiltigt först?
2. **Landing på `/`**: autodetektera land via browser/IP och redirect, eller alltid visa väljar-sida?
3. **Ska Fas 1 börja nu** (remix + grundstruktur + tom Norge/Nederländerna) eller vill du ha en kostnadsuppskattning först?
