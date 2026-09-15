# Egen redaktörsingång: /redaktion

En separat, enkel sida där du loggar in med e-post och lösenord och bara ser Event, Partnernytt och Artiklar. Inget adminlösenord, inga leads, avtal eller statistik.

## Så fungerar det för dig

1. Du går till `d365.se/redaktion` (dold sida, ej sökbar).
2. Loggar in med din e-post och ett lösenord du själv väljer första gången.
3. Ser tre flikar: **Event**, **Partnernytt**, **Artiklar**. Exakt samma funktioner som i admin, inget mer.
4. Du förblir inloggad på enheten, så det fungerar bra från mobil eller surfplatta.

Bara ditt konto får åtkomst. Ingen annan kan registrera sig, och den som inte fått behörighet ser bara ett meddelande om att kontot saknar redaktörsrättigheter.

## Vad som byggs

**Inloggning**
- E-post/lösenord aktiveras i backend, självregistrering stängs av.
- Ditt konto skapas åt dig och får rollen `editor`.

**Behörighet**
- Ny tabell `user_roles` (roll separat från kontot, aldrig i profildata) med rollerna `admin` och `editor`, RLS och GRANT enligt standard.
- Säkerhetsfunktion `has_role(user_id, role)` används för kontroll.

**Redaktörssidan**
- Ny sida `src/pages/Redaktion.tsx` med inloggningsvy och tre flikar.
- Återanvänder befintliga `AdminEventsTab`, `AdminPartnerNewsTab` och `AdminKnowledgeArticlesTab` oförändrade.
- Rutten `/redaktion` läggs till i `src/App.tsx`, markeras `noIndex` och utesluts ur sitemap.

**Koppling till befintliga funktioner**
- Ny edge-funktion `editor-session`: tar emot inloggningen, kontrollerar via `has_role` att kontot är `editor` eller `admin`, och returnerar samma typ av kortlivade servertoken som adminpanelen redan använder (8 timmar).
- Det gör att alla nuvarande serverfunktioner för event, partnernytt och artiklar fungerar som de är, utan ändringar.
- Om token gått ut skickas du tillbaka till inloggningen.

**Oförändrat**
- Adminpanelen och dess lösenord fungerar precis som idag.
- Inga ändringar i publika sidor eller i partnernas profileringslänk.

## Tekniska detaljer

- `enable_email_auth` + `configure_auth` med `disable_signup: true`.
- Migration: enum `app_role`, tabell `public.user_roles`, GRANT `select` till `authenticated`, `all` till `service_role`, RLS med policy "egna roller läsbara", security-definer-funktionen `has_role`.
- `editor-session` verifierar Supabase-JWT mot `SUPABASE_JWKS`, slår upp rollen, och signerar en HMAC-token med samma payload-format som `admin-login` (`role: "admin"`, 8 h) så att `manage-events`, `manage-partner-news` och artikelfunktionen accepterar den oförändrade.
- Ny hook `useEditorAuth` speglar `useAdminAuth` (sessionStorage, auto-utloggning vid 401) och hämtar servertoken efter Supabase-inloggning.
- Lösenordsåterställning via `/reset-password` ingår.
