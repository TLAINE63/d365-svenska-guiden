# Edge functions att anpassa i det internationella projektet

När du remixar följer alla 60+ edge functions med. De flesta fungerar teknik-agnostiskt, men följande grupper behöver anpassas för flerspråkighet, ny domän och landskontext.

## 1. Måste översättas (svensk text i output till användare/kunder)

Dessa genererar e-post, PDF eller AI-svar med hårdkodad svensk copy — behöver språkvariant per land (en/no/da/nl):

- `send-analysis-email` — behovsanalys-mailet
- `send-partner-monthly-report` — månadsrapport till partners
- `send-contact-email` — kontaktformulär
- `send-underlag-to-partners` — skickar underlag till matchande partners
- `submit-lead` — bekräftelsemail
- `submit-assessment-notify` — AI-assessment notifiering
- `process-email-queue` — mall-rendering
- `partner-invitations` — inbjudningsmail
- `generate-erp-analysis` — AI-prompt på svenska
- `generate-customer-service-analysis` — AI-prompt på svenska
- `generate-requirements` — kravspec-generering
- `generate-industry-page` — branschsidor
- `generate-partner-*` (7 st: summary, positioning, why-keypoints, industry-pitch, ai-experience-summary, ai-notafit) — AI-prompter
- `compare-partners-insights`, `competitor-insights` — AI-analyser
- `pillar-seo-followup` — SEO-copy
- `ai-chat` — chatbot systemprompt

## 2. Behöver landsfilter (multi-country logik)

Dessa frågar partners/nyheter — måste filtrera på aktuellt land (`country` eller `countries` kolumn):

- `match-partners`
- `manage-partners`, `manage-unprofiled-partners`
- `manage-partner-news`, `manage-events`, `manage-knowledge-articles`
- `manage-industry-pages`, `manage-product-prices`
- `partner-public-stats`, `partner-dashboard`, `partner-sales-summary`
- `smart-search`
- `ingest-partner-feeds` — utkast per land
- `refresh-sitemaps` — en sitemap per språk/land

## 3. Domän-/URL-beroende (hårdkodade d365.se-referenser)

Behöver bytas till `d365guide.com` + språkprefix (`/no`, `/dk`):

- Alla `send-*`-funktioner (länkar i mail)
- `refresh-sitemaps`
- `partner-invitations` (invite-länk)
- `track-partner-click`, `track-partner-view`, `track-contact-blocked`, `track-visitor`, `track-funnel-event`, `track-filter-exposure` — CORS-origin

## 4. Priser/valuta

- `manage-product-prices` — SEK idag; behöver stödja EUR/NOK/DKK
- `send-partner-monthly-report` — fakturabelopp

## 5. Externa integrationer (fungerar as-is, men verifiera)

- `gsc-stats`, `manage-semrush-stats`, `manage-seo-rankings`, `semrush-daily-rankings`, `track-keywords-weekly` — koppla till nya domänens property
- `sync-snitcher-visits` — nytt Snitcher-konto för .com
- `site-traffic-stats`, `funnel-stats` — GA4 property per land

## 6. Kan följa med oförändrat

Rena admin-/interna funktioner utan användartext:

- `admin-login`, `manage-leads`, `manage-partner-reports`, `manage-partner-feeds`, `partner-agreement-config`, `upload-partner-logo`, `upload-partner-document`, `import-partners`, `apply-source-docs`, `partner-news-performance`, `debug-extended-relevance`, `mcp`, `track-partner-click` (logiken), `funnel-stats`

## Rekommendation

Ta med **listan i grupp 1 + 2** som första prioritet i Fas 3 (Översättning) och Fas 2 (Multi-country DB) i det nya projektet. Grupp 3 (domän) hanteras när `.com` kopplas in.

Vill du att jag också förbereder en export-JSON av alla svenska partners + nyheter som seed-data till det nya projektet innan du remixar?
