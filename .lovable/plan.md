## Mål

Ett enda månadsbrev per partner, byggt på utkastsflödet med godkännande. Statistiksiffrorna från "Månadsrapport per partner" flyttas in i besöksrapporten, och det separata direktutskicket tas bort ur admin.

## Så ser det sammanslagna mejlet ut

```text
D365.SE · MÅNADSRAPPORT
Sherpas Group AB
Period: juli 2026 (2026-07-01 – 2026-07-31)

[intro-text, redigerbar per utkast]

NYCKELTAL (med +/- mot föregående lika lång period)
  Profilvisningar  ·  Jämförelseklick  ·  Webbplatsklick  ·  Branschlistningar

VILKA TITTADE
  X identifierade företag – anonymiserade kort:
  ● Computer Software · 51-200 employees · Sverige      1 besök
       ✓ Matchade profil-URL:er
       Andra sidor de tittade på

VAR NI SYNTES
  Vanligaste vägen in, branschsidor ni listades på, era partnernyheter

NÄSTA PERIOD          (redaktionellt, från inställningarna)
NYTT PÅ SAJTEN        (changelog, från inställningarna)
Kontakt
```

## Ändringar

**1. Slå ihop mallen**
- `manage-partner-reports/index.ts` blir enda rapportmotorn. Dess `buildEmailHtml` byggs ut med statistikblocket, "Var ni syntes" och jämförelsesiffror – logiken flyttas över från `send-partner-monthly-report/index.ts` (`fetchPeriod`, `fetchTopEntryPath`, `fetchIndustryPagesListed`, `fetchPartnerNews`, `delta`, `buildStats`).
- Företagskorten behåller den anonymisering vi nyss införde (bransch + storlek + land, aldrig namn/domän).
- Redaktionella sektionerna ("Nästa period", "Nytt på sajten", kontakt) läses redan från `site_settings` – oförändrat.

**2. Utkastgenereringen**
- Vid `generate` beräknas även periodens statistik och föregående periods siffror, och sparas på utkastet så att förhandsgranskning och utskick visar samma siffror.
- Nytt fält `stats jsonb` på `partner_report_drafts` (migration). Utkast utan fältet renderas utan statistikblocket.
- Partners **utan** identifierade besök men **med** trafiksiffror får nu också utkast (idag hoppas de över) – annars tappar vi hela statistikdelen för dem.

**3. Admin-UI**
- Kortet "Månadsrapport per partner (statistik)" tas bort, inklusive knapparna Förhandsgranska / Skicka till partner / Skicka till Thomas / Skicka till partner + Thomas.
- Rutan "Redaktionellt innehåll i rapporten" (Nästa period, Nytt på sajten, Kontaktperson) **flyttas upp** i kortet "Månadsrapporter till partners" – den behövs fortfarande.
- Periodväljaren (Från/Till) flyttas till utkastgenereringen, så du kan generera för valfri period, inte bara "förra månaden".
- Rubriken byter namn till "Månadsrapporter till partners" med underrubrik som förklarar flödet: generera utkast → granska/redigera → testmejl → skicka.

**4. Städning**
- Edge-funktionen `send-partner-monthly-report` slutar användas från admin. Jag låter filen ligga kvar (ingen risk, den kan inte triggas från UI) om du inte vill att jag raderar den.

## Teknisk detalj

- Migration: `ALTER TABLE public.partner_report_drafts ADD COLUMN stats jsonb NOT NULL DEFAULT '{}'::jsonb;`
- Berörda filer: `supabase/functions/manage-partner-reports/index.ts`, `src/components/AdminPartnerReportsTab.tsx`.
- `manage-partner-reports` deployas om; jag verifierar med förhandsgranskning + testmejl på ett juli-utkast.
- Befintliga juli-utkast saknar `stats`. Jag regenererar juli efter ändringen så att alla utkast får full data.
