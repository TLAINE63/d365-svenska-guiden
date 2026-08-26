# Plan: Skicka partnerrapport-länk från admin

## Bakgrund
Partner Performance-rapporten nås av partners via `https://d365.se/partner-performance/:token`, där token kommer från `partner_event_tokens`-tabellen (samma token som event-portalen använder). I admin kan Thomas förhandsgranska och godkänna rapporter under **Partnerportal → Partner Performance**, men det finns ingen knapp för att skicka rapportlänken till partnern. Idag måste partnern ha fått sin token via event-portalen för att komma åt prestandasidan.

## Vad som ska byggas

### 1. Ny edge function-action: `send-performance-link-email`
Lägg till en ny action i `supabase/functions/manage-events/index.ts` (som redan har `send-event-link-email` som mall). Flödet:

- Admin-autentiseras via JWT (samma `verifyJWT` som andra admin-actions).
- Hämta partner (`id, name, email, admin_contact_email, contact_person, is_featured`).
- Validera att partnern är `is_featured` och har en e-postadress (`admin_contact_email || email`).
- Upsert token i `partner_event_tokens` (skapa om saknas, annars returnera befintlig).
- Bygg URL: `https://d365.se/partner-performance/{token}`.
- Skicka e-post via Resend med en svensk mall som förklarar vad rapporten visar (exponeringar, profilvisningar, jämförelser, leads, Google-synlighet, benchmark och rekommendationer).
- Logga i `email_send_log` med `template_name = "partner_performance_link"`.
- Returnera `{ success: true, email: recipientEmail }`.

Mallen hämtar eventuell sparad text från `site_settings` (nyckel `performance_link_email_body`) med fallback till en standardtext, samma mönster som event-portalen.

### 2. Admin-knapp i `AdminPartnerPerformanceTab`
Lägg till en knapp i adminfliken "Partner Performance" — bredvid partner-/månadsväljaren eller i rapportkortets header — som:
- Anropar `manage-events?action=send-performance-link-email` med `{ partner_id }` för den valda partnen.
- Visar en toast med bekräftelse ("Rapportlänk skickad till …").
- Hanterar 401 (session ut → logout) och fel.

Knappen kräver att en partner är vald i selectorn.

### 3. E-postlogg
Lägg till mallnamnet `partner_performance_link: "Partnerrapport-länk"` i `TEMPLATE_LABELS` i `AdminEmailLogTab.tsx` så det syns i e-postloggen.

### 4. Kopiera-länk-knapp (bonus)
Lägg även en "Kopiera länk"-knapp som genererar/returnerar token och kopierar `https://d365.se/partner-performance/{token}` till urklipp, för de fall Thomas vill skicka länken manuellt. Återanvänder `get-event-token`-action som redan finns.

## Filer som ändras
- `supabase/functions/manage-events/index.ts` — ny action `send-performance-link-email`
- `src/components/AdminPartnerPerformanceTab.tsx` — "Skicka rapportlänk"- och "Kopiera länk"-knappar
- `src/components/AdminEmailLogTab.tsx` — ny `TEMPLATE_LABELS`-entry

## Begränsningar
- Endast verifierade (`is_featured`) partners kan få länk (sammar regel som event-portalen).
- E-post skickas till `admin_contact_email` om det finns, annars `email`.
- Thomas egna besök/IP-adresser förblir exkluderade från all analytics (ingen ändring där).
