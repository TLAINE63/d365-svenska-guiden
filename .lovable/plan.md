# Pausa automatisk månadsrapport tills du granskat den

## Bakgrund / nuvarande läge

Det finns en aktiv pg_cron-jobb (`send-partner-monthly-report`, `0 7 1 * *`) som varje månadskväll kl. 07:00 UTC ringer edge-funktionen `send-partner-monthly-report` och skickar rapporten till alla `is_featured = true`-partners. Eftersom imorgon är den 1 september skulle jobbet köra imorgon bitti.

## Mål

Stoppa automatiken nu, ge dig kontroll att först förhandsgranska/godkänna innehållet och skicka manuellt när du är nöjd.

## Steg

1. **Pausa cron-jobbet omedelbart**
   - Sätt `cron.job` med `jobname = 'send-partner-monthly-report'` till `active = false`.
   - Bekräfta att inget annat cron-jobb triggar utskick.

2. **Fail-safe-gate i edge-funktionen**
   - I `supabase/functions/send-partner-monthly-report/index.ts`: om anropet kommer från cron (dvs. `isCron` är true) kräv att raden `site_settings.key = 'monthly_report_auto_send_enabled'` finns och har värdet `'true'`.
   - Annars returnera `403` med texten "Automatisk utskick är avstängt".
   - Administratörsanrop (`isAdmin`) ska kunna skicka ändå.

3. **Admin-knapp för manuellt utskick med förhandsgranskning**
   - I `AdminPartnerPerformanceTab.tsx` lägg till:
     - En knapp "Förhandsgranska månadsrapport" som anropar `send-partner-monthly-report` med `dryRun: true` för vald partner och visar HTML-export i en dialog/ruta.
     - En knapp "Skicka månadsrapport nu" som anropar samma funktion utan `dryRun` och skickar till partnerns `admin_contact_email || email`.
     - Ett tydligt statusmeddelande: "Automatisk månadsrapport är för närvarande avstängd." om gaten är av.

4. **Säkerställ att endast godkända rapporter skickas**
   - Innan e-post skickas, kontrollera att det finns en `partner_performance_reports`-rad för partner+period med `status = 'approved'`.
   - Om rapporten är `draft` eller saknas, avbryt och logga "skipped: not_approved".
   - Uppdatera `sent_at` vid lyckat utskick.

5. **Test och verifiering**
   - Kör dry-run för en partner via adminpanelen och kontrollera att HTML och mottagare ser rimliga ut.
   - Verifiera att cron-jobbet är inaktivt (`SELECT * FROM cron.job WHERE jobname = 'send-partner-monthly-report';`).
   - Kör typecheck och produktionsbygge.

## Vad som INTE ändras

- Innehållet i själva rapportmallen (HTML/statistik) ändras inte i detta steg.
- Mottagarlogiken (`admin_contact_email || email`) behålls.
- `partner-performance-report`-edge-funktionen för rapportdata påverkas inte.
