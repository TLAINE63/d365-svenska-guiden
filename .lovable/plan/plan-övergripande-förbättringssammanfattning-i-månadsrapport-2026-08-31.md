# Plan: Övergripande förbättringssammanfattning i månadsrapporterna

## Mål
Sammanfatta augusti-förbättringarna på ett övergripande, icke-tekniskt sätt (skrivet för partners, inte för Thomas) och lägg in texten i månadsrapportens befintliga "Nytt på sajten"-sektion så att den går ut med nästa rapportutskick.

## Genomförande

1. **Skriv en partneranpassad förbättringstext** (kort, värdeorienterad, utan interna termer) i `site_settings`-nyckeln `monthly_report_changelog`. Rapportmallen renderar redan denna som sektionen "Nytt på sajten" i e-posten. Utkast:

   - Bättre matchning – kravspecifikationen föreslår nu upp till fem passande partners utifrån produkt, bransch och storlek.
   - Tydligare partnerprofiler – verifierade partners markeras tydligt och profiler visas med mer information i sökningar och jämförelser.
   - Starkare kunskapsbank – 172 guider, artiklar och branschinsikter som drar in köpare som aktivt utvärderar Dynamics 365.
   - Fler vägar in till er profil – partnernyheter och events synas nu direkt på produktsidor och start­sidan.
   - Förbättrad synlighet i sökmotorer och AI-tjänster – FAQ-innehåll, interna länkar och teknisk SEO gör era profiler lättare att hitta.
   - Säkrare och snabbare plattform – anonymiserad besöksstatistik, snabbare laddning och förbättrad stabilitet.

2. **Kontrollera att texten syns i rapporten** – sektionen renderas bara när changelog har innehåll, så verifiera via förhandsgranskningen i admin (AdminPartnerReportsTab → förhandsgranska månadsrapport).

3. **Inget autoskick aktiveras** – `monthly_report_auto_send_enabled` förblir `false`; texten kommer med nästa gång du godkänner och skickar rapporterna manuellt.

## Tekniska detaljer
- Endast en `UPDATE`/`INSERT` mot `site_settings` (nyckel `monthly_report_changelog`) via SQL.
- Ingen kodändring behövs – `send-partner-monthly-report` och admin-UI stödjer redan changelog, förhandsgranskning och manuellt godkännande.
