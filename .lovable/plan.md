
# Månatlig "vem har besökt din profil"-rapport till partners

En automatisk månadsrapport som mejlas till varje publicerad partner med en lista över identifierade företag (via Snitcher) som besökt deras profil – inklusive vilka andra sidor besökarna kollade i samma session. Du som admin måste godkänna varje utskick innan det går ut.

## Vad som byggs

### 1. Snitcher-integration
- Ny edge function `sync-snitcher-visits` hämtar identifierade företagsbesök från Snitchers API (kräver API-nyckel som du anger via secret).
- Ny tabell `snitcher_visits` lagrar: företagsnamn, domän, bransch, storlek, land, sessions-ID, besökta sidor (array), tidpunkt, koppling till partner-slug om profilen besöktes.
- Funktionen körs schemalagt (pg_cron, dagligen) så datat byggs upp under månaden.

### 2. Rapport-generering
- Ny edge function `generate-partner-monthly-reports` körs första vardagen i månaden.
- För varje publicerad partner aggregeras föregående månads Snitcher-besök på deras `/partner/<slug>`.
- Per identifierat företag visas: företagsnamn, bransch/storlek, antal besök, datum, vilka andra sidor de besökte i samma session (t.ex. produktsidor, andra delar av guiden – inte konkurrentprofiler).
- Skapar en draft-rad per partner i ny tabell `partner_report_drafts` med status `pending_review`. Innehåller pre-renderad HTML, ämne, och rådata som JSON.

### 3. Admin-vy: Godkänn rapporter
- Ny flik "Månadsrapporter" i `/admin`.
- Listar alla drafts för aktuell månad: partnernamn, mottagaremejl, antal identifierade företag, status.
- Klick öppnar förhandsvisning (samma vy som mottagaren ser) med möjlighet att:
  - Redigera ämne/intro-text
  - Exkludera enskilda företag från listan
  - Markera som godkänd (eller hoppa över)
- Knapp "Skicka alla godkända" som triggar utskick. Drafts utan tillräckligt med data (0 identifierade företag) kan filtreras bort.

### 4. Utskick
- Använder Lovable Emails (befintlig infrastruktur, transaktionell – ett mejl per partner, triggad av din godkännandeknapp).
- Mejlet skickas till partnerns `admin_contact_email` (fallback: `email`).
- Mall i React Email matchar sajtens visuella stil (mörka gradienter, --cta-orange CTA till profilen).
- BCC till advisor-mejl för transparens (samma mönster som befintliga utskick).
- Status uppdateras till `sent` med tidsstämpel; loggas i `email_send_log`.

### 5. Manuell trigger
- Knapp i admin "Generera draft nu" om du vill köra rapporten utanför schema (t.ex. extra utskick varannan vecka).

## Tekniska detaljer

- **Databas**: 2 nya tabeller (`snitcher_visits`, `partner_report_drafts`), RLS service-role only.
- **Snitcher API**: REST (`https://api.snitcher.com/...`). Behöver `SNITCHER_API_KEY` som secret. Vi använder polling, inte webhook (enkare att komma igång).
- **Sessionskoppling**: Snitcher levererar sessions-ID; vi joinar mot vår `visitor_analytics.session_id` för att få "andra sidor i samma session".
- **Email-infra**: Använder befintlig Lovable Cloud-stack (Resend via SES).
- **Schemaläggning**: pg_cron för både daglig sync och månatlig draft-generering.

## Beslut som krävs av dig innan jag startar

1. **Snitcher API-nyckel**: Behöver läggas till som secret. Du hittar den i Snitcher-dashboarden under Settings → API.
2. **Avsändaradress**: Ska mejlet skickas från `noreply@d365.se` eller `rapporter@d365.se` (eller annan)?
3. **BCC-mottagare**: Ska du och/eller Thomas/Michael BCC:as på alla utskick?
4. **Tom-rapport-policy**: Om en partner har 0 identifierade företag den månaden – skippa helt eller skicka ändå med "0 identifierade besök denna period"?

När planen är godkänd ber jag dig om Snitcher-nyckeln och bygger steg för steg: tabeller → Snitcher-sync → draft-generering → admin-UI → utskick.
