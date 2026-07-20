
## Mål

Efter genomförd behovsanalys eller kravspecifikation ska besökaren i ett steg kunna skicka sitt underlag till 2–3 automatiskt matchade partners (med möjlighet att lägga till 1–2 extra från publicerad partnerlista). Varje utskick taggas i CRM/leads och rådgivarna (Thomas & Michael) får kopia för uppföljning.

## Berörda sidor

Behovsanalyser (resultatvy):
- `src/pages/BcMatchningstest.tsx` — ERP / Business Central
- `src/pages/FscmMatchningstest.tsx` — ERP / Finance & SCM
- `src/pages/CrmMatchningstestResultat.tsx` — täcker Sales, Service och Marketing via `productKey`

Kravspecifikationer (efter PDF-generering):
- `src/pages/RequirementsSpec.tsx` — ERP
- `src/pages/RequirementsSpecSales.tsx` — Sälj
- `src/pages/RequirementsSpecCustomerService.tsx` — Kundservice
- `src/pages/RequirementsSpecMarketing.tsx` — Marknad (tas med för konsekvens)

## Ny UI-komponent

`src/components/SendUnderlagToPartners.tsx`

Props:
- `sourcePage`, `assessmentType` (t.ex. `bc_matching`, `crm_matching_sales`, `req_spec_erp`)
- `products: ProductKey[]`, `industry?`, `companySize?`
- `underlagSummary: string` (klartext, används i mailkroppen)
- `pdfBlob?: Blob` (om PDF finns) + `pdfFileName?`
- `resultUrl?: string` (fallback-länk om PDF saknas)

Beteende:
1. Använder `usePartners()` + `pickSuggestedPartners()` för att förslå 2–3 partners (förbockade, kan avmarkeras).
2. "Lägg till fler partners" — Command/Combobox som listar alla publicerade partners (från `usePartners`) filtrerat på vald produkt; max 5 mottagare totalt.
3. Kontaktformulär (företag, namn, e-post, telefon, valfritt meddelande) — återanvänder `validateBusinessEmail`.
4. Vid submit: POST till ny edge function `send-underlag-to-partners` med `{ contact, products, industry, assessment_type, source_page, partner_slugs, underlag_summary, result_url, pdf_base64? }`.
5. Success-vy: bekräftar antal mottagare + nästa steg.

## Ny edge function

`supabase/functions/send-underlag-to-partners/index.ts`

- CORS + zod-validering av input.
- Slår upp partnerinfo via `partners` (contact email, contact person, namn).
- Skapar en `leads`-rad per submit med:
  - `source_type = 'analysis_forward'`
  - `source_page = <sida>`
  - `assigned_partners = partner_slugs`
  - `notes` innehåller `assessment_type` + `underlag_summary` + PDF-status
- Skickar mail via Resend (redan konfigurerad):
  - **Till varje partners kontaktemail** — ämne "Nytt underlag från d365.se: <företag>". Mailkropp innehåller kontaktinfo, sammanfattning av underlaget, PDF-bilaga om den finns, annars länk till resultatsidan.
  - **BCC:** `THOMAS_EMAIL` och `MICHAEL_EMAIL` (från befintlig hårdkodad advisors-lista) på varje utskick för uppföljning.
  - **Bekräftelse till besökaren** — ett tack-mail som listar vilka partners som fått underlaget.
- Loggar i `email_send_log` med `template_name = 'analysis_forward'` och unik `message_id`.
- Retur: `{ ok: true, delivered: partner_slugs.length }`.

Config: lägg till `[functions.send-underlag-to-partners] verify_jwt = false`.

## Wiring per sida

Behovsanalyser:
- Ersätt/utöka nuvarande "Få matchande partners"-formulär med `<SendUnderlagToPartners />`-panel som visas som ett tydligt sista steg under resultatet. Behåll knapp för "Ladda ner PDF".

Kravspecifikationer:
- Efter PDF-generering visas panelen automatiskt (state `generated=true`). PDF-blobben som genereras används som `pdfBlob` så partners får den bifogad.

## Ranking-logik

`pickSuggestedPartners` (befintlig) används rakt av. För CRM byggs `productKeys` från `productKey`-mappningen (sales/service/marketing). För kravspecen skickas motsvarande produktkoder in.

## Tracking

- `trackFunnelEvent('underlag_forward_submit', { assessment_type, num_partners, has_pdf })` vid lyckad skickning.
- `underlag_forward_partner_added` när användaren adderar en extra partner.

## Testning

Efter implementation: Playwright-skript som fyller i BC-testet, klickar "Skicka underlag", verifierar success-vy, och att ny `leads`-rad + `email_send_log`-rader finns via SQL.
