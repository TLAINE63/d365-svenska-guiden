---
name: Redaktörsingång /redaktion
description: Separat inloggning med e-post och lösenord för Event, Partnernytt och Artiklar, utan adminlösenord
type: feature
---
- Sidan `/redaktion` (noIndex) ger en förenklad vy med tre flikar: Event, Partnernytt, Artiklar. Återanvänder AdminEventsTab, AdminPartnerNewsTab, AdminKnowledgeArticlesTab.
- Inloggning sker med e-post och lösenord (Lovable Cloud auth). Självregistrering är avstängd.
- Behörighet styrs av tabellen `user_roles` (`app_role`: admin | editor) och funktionen `has_role`. Roller lagras aldrig på profil-/användartabellen.
- Edge-funktionen `editor-session` verifierar sessionen, kontrollerar rollen och returnerar samma HMAC-servertoken (role "admin", 8 h) som adminpanelen använder, så befintliga serverfunktioner fungerar oförändrat.
- Edge-funktionen `editor-bootstrap` skapar konto plus editor-roll, skyddad av adminlösenordet, avsedd för engångsuppsättning.
- `/reset-password` hanterar nytt lösenord efter återställningslänk.
- Adminpanelen `/admin` med lösenord är oförändrad.
