## Mål

I admin → Införsäljningsmail, kunna välja **en** partner och skicka ett **preview-mail till dig själv** (default `thomas.laine@dynamicfactory.se`) som ser ut precis som det riktiga införsäljningsmailet (publicerad eller ej publicerad-mall) **plus** ett tillagt statistik-block:

- Totalt antal besökare på d365.se (30/90 dagar)
- Antal som tittat på just denna partners profilsida
- Antal som klickat vidare till partnerns sajt
- Lista på identifierade företag (från Snitcher) som besökt partnerns profil eller relaterade sidor

Syftet är att du ska kunna finjustera mailet innan du skickar det vidare till partnerkontakten.

## Hur det fungerar

1. I `AdminSalesPitchV2Tab` läggs en ny rad in i partner-listan: knapp **"Pitch-preview till mig"** bredvid varje partner.
2. Klick öppnar en liten dialog med:
   - Mottagare (förifyllt `thomas.laine@dynamicfactory.se`, går att ändra)
   - Val av mall (publicerad / ej publicerad – default styrs av partnerns `is_featured`)
   - Knapp **Skicka preview**
3. Vid skick hämtas statistiken via befintlig edge function `partner-sales-summary` (den returnerar redan `profileViews`, `websiteClicks`, `identifiedCompanies` per partner). Totalbesökarsiffran för hela sajten hämtas från `site-traffic-stats`.
4. Statistikblocket byggs som ren text och **prependas** till mallens brödtext, t.ex.:

   ```
   ── INTERNT PREVIEW (skickas inte till partner) ──
   Period: senaste 30 / 90 dagar
   Sajtbesökare totalt (30d): 4 812
   Visningar av {{partner}}s profil (30d / 90d): 142 / 318
   Klick vidare till {{partner.se}} (30d / 90d): 27 / 61

   Identifierade företag som besökt profilen (90d, från Snitcher):
   • Acme AB – Tillverkning – Sverige – 4 sessioner
   • Beta Konsult – IT – Norge – 2 sessioner
   ...
   ──────────────────────────────────────────────
   ```

   Därefter följer mallens vanliga text (inkl. `{{INVITATION_LINK}}` för publicerade).
5. Mailet skickas via befintliga `partner-invitations?action=send-sales-pitch` (samma som testmail idag), så loggning i `email_send_log` fungerar redan.
6. Ämnesraden får prefix `[PREVIEW – {partner.name}]` så det är tydligt i inkorgen.

## Teknisk del

**Frontend** – `src/components/AdminSalesPitchV2Tab.tsx`
- Lägg till state `previewPartner`, `previewEmail`, `previewSegment`, `sendingPreview`.
- Ny `Button` per rad i mottagar-tabellen: "Preview till mig".
- Ny `Dialog` med fält + skicka-knapp.
- Funktion `sendPreview(partner)`:
  1. `supabase.functions.invoke('partner-sales-summary', { body: { partnerId } })` (eller motsv. nuvarande signatur – verifieras vid implementation).
  2. `supabase.functions.invoke('site-traffic-stats')` för totalbesökare.
  3. Bygg statistik-prefix-text + ersätt `[NAMN]` med kontaktnamnet.
  4. POST till `partner-invitations?action=send-sales-pitch` med `partners: [{ id, name, email: previewEmail, contact_name }]`, subject `"[PREVIEW – ${partner.name}] ${tpl.subject}"`, body = statistik + tpl.body.
- Profileringslänken: om partnern är `is_featured` används publicerad-mallen (med `{{INVITATION_LINK}}` – funktionen genererar/återanvänder befintlig invitation precis som idag för testmail). Detta måste verifieras mot edge function – om den inte hanterar `{{INVITATION_LINK}}` när `id` är ett riktigt partner-id, så lägger vi en mock-länk för previewen.

**Backend** – ingen ny edge function behövs. `partner-sales-summary` och `site-traffic-stats` finns redan, liksom `partner-invitations`.

## Avgränsningar / öppna frågor

- Det är fortfarande **du** som manuellt vidarebefordrar (eller copy-pastar) det justerade mailet till partnerkontakten – preview-flödet skickar **inte automatiskt** något till partnern.
- Snitcher-listan i previewen kan vara lång; jag föreslår topp 25 företag (sorterat profilbesökare först, sedan sessioner). Säg till om du vill ha alla eller ett annat tak.
- "Totalt antal besökare" – ska det vara unika sessioner senaste 30 dagar eller en annan period? Default: 30d och 90d sida vid sida.

Säg till om något ska ändras innan jag bygger.