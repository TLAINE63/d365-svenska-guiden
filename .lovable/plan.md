## Mål

Komplettera marknadsbilden: avtalspartners visas som idag (fullt profilkort), medan övriga relevanta D365-partners listas mer återhållsamt – utan logotyp och utan länk till deras webbplats. All kontakt går via /kontakt enligt mediated-contact-regeln.

## Databas

Ny enkel tabell `public.unprofiled_partners` (admin-styrd, ej kopplad till `partners`):

- `name` (text, unik)
- `note` (text, valfri intern kommentar)
- `website` (text, valfri – syns inte publikt, bara för admin-referens)
- `display_order` (int, default 100)
- `is_visible` (bool, default true)
- standard `id`, `created_at`, `updated_at`

RLS:
- `SELECT` öppen för anon/authenticated (publik läsning av synliga rader sker via edge function eller direkt query med `is_visible=true`).
- `ALL` för `service_role` (admin gör CRUD via ny edge function `manage-unprofiled-partners` med admin-token, samma mönster som `manage-partners`).

## Admin (sida `/admin`)

Ny flik **"Listad men ej profilerad"**:
- Tabell med Namn, Intern not, Synlig (toggle), Ordning, åtgärder (Lägg till / Redigera / Ta bort).
- Enkelt formulär – bara namn krävs.
- Återanvänder befintlig admin-auth (`useAdminAuth`) och token-mönster.

## Publika vyer

1. **Sektion längst ner på `/valjdynamics365partner`**
   - Rubrik: "Övriga D365-partners på marknaden"
   - Kort intro-text (TAYA-ton): vi listar fler aktörer för transparens, men har inte profilerat dem här.
   - Renderar namnen som enkla pills/rader (inget kort, ingen logotyp, ingen extern länk).
   - Knapp "Kontakta oss för matchning" → `/kontakt/`.
   - Länk "Se hela listan" → ny sida.

2. **Ny sida `/alla-d365-partners/`**
   - Visar alla avtalspartners överst som länkbara namn (länk till deras profilsida på d365.se), grupperade eller alfabetiskt.
   - Visar "Listad men ej profilerad" under – endast namn, inga länkar, ingen logotyp.
   - Tydlig förklaring av skillnaden (köparsidig transparens, ingen "oberoende"-formulering).
   - Gemensam CTA längst ner: "Kontakta oss för matchning" → `/kontakt/`.
   - Läggs in i sitemap + footer.

## Datakälla / hook

- Ny hook `useUnprofiledPartners()` (publik, läser bara `is_visible=true`, sorterad på `display_order, name`).
- Ny hook/edge-anrop för admin via `manage-unprofiled-partners`.

## Regler som följs

- Ingen logotyp, ingen länk till partners webbplatser (mediated contact).
- Ingen ranking-påverkan – dessa partners deltar inte i guide/matchning eller filter.
- Inga klickspårningar mot externa sidor (de existerar inte här).
- Texter använder köparsidig ton; ordet "oberoende" undviks.

## Tekniska detaljer

- Tabell + RLS + GRANTs läggs i en migration.
- Edge function `manage-unprofiled-partners` med actions `list|create|update|delete` (admin-token).
- Komponent `UnprofiledPartnersList` återanvänds av både `/valjdynamics365partner` och `/alla-d365-partners`.
- Sidan `/alla-d365-partners/` läggs till i `App.tsx`, sitemap-generatorn och footer-länklistan.
- Minne uppdateras: ny entry under "Features & Logic" som beskriver "Listad men ej profilerad"-konceptet.
