# Partnernytt – redaktionellt kuraterat partnerflöde

Ett manuellt, redaktionellt bevakat flöde av utvalda nyheter, kundcase, event, webinar och erbjudanden från publicerade D365-partners. **Ingen** LinkedIn-integration eller scraping – admin lägger in allt manuellt och länkar till originalkällan.

## 1. Databas (migration)

Ny tabell `public.partner_news`:

- `id uuid pk`
- `partner_id uuid` → `public.partners(id)` (obligatorisk)
- `editorial_title text` (redaktionell rubrik)
- `summary text` (kort sammanfattning, max ~400 tecken)
- `source_url text` (länk till originalkälla)
- `source_type text` – enum-liknande: `linkedin | partner_web | blog | press | webinar | event | other`
- `product_area text` – `business-central | finance-scm | crm | power-platform | microsoft-ai | ovrigt`
- `news_type text` – `kundcase | event | webinar | erbjudande | artikel | rapport | branschlosning | produktnyhet | partnernyhet | analys`
- `industry text` (nullable, från `standardIndustries`)
- `image_url text` (nullable)
- `news_date date`
- `is_featured boolean default false`
- `show_on_home boolean default false`
- `show_on_partner_profile boolean default true`
- `show_on_product_page boolean default false`
- `status text default 'draft'` – `draft | review | approved | published | unpublished | archived`
- `published_at timestamptz`
- `created_at`, `updated_at`

**Grants + RLS:**
- `GRANT SELECT ON public.partner_news TO anon, authenticated` (endast rader med `status='published'` via policy)
- `GRANT ALL ON public.partner_news TO service_role`
- Policy: `SELECT` public bara för `status='published'`
- Skriv sker via edge function med admin-verifiering (service role)

Ny storage-bucket: `partner-news-images` (public), för uppladdade bilder.

Index på `(status, published_at desc)`, `(partner_id, status, published_at desc)`, `(product_area, status)`.

## 2. Edge function

`supabase/functions/manage-partner-news/index.ts` – CRUD med admin-auth (samma mönster som `manage-partners`):
- `list` (admin: alla; publik: bara published)
- `create`, `update`, `delete`
- `set_status` (draft/review/approved/published/unpublished/archived)
- Zod-validering, CORS.

Publik läsning kan gå direkt via supabase-klient tack vare RLS – ingen edge function behövs för publik listning.

## 3. Publika sidor

**`/partnernytt`** (`src/pages/Partnernytt.tsx`)
- H1: "Utvalt från Dynamics 365-partners"
- Underrubrik: "Nyheter, kundcase, event och erbjudanden från publicerade partners på d365.se – redaktionellt utvalda och länkade till originalkällan."
- Filter: Partner, Produktområde, Nyhetstyp, Bransch, Källa
- Sortering: Senast publicerad först / Utvalda först
- Kortlayout (redaktionell, ej annons): bild, rubrik, sammanfattning, partnernamn + logga, datum, badges (produktområde, typ, ev bransch), källa, "Läs på originalkällan ↗" + "Se partnerprofil →"
- SEO: title, meta, canonical
- Lägg till i `sitemap-pages.xml` och `generate-sitemap.mjs`

**Ny komponent `PartnerNewsCard.tsx`** – återanvänds på alla ytor.

**Startsidan (`src/pages/Index.tsx`)** – ny sektion
- Rubrik: "Aktuellt från Dynamics 365-partners"
- Text: "Redaktionellt utvalda nyheter, kundcase och event från publicerade partners på d365.se."
- 3 senaste där `show_on_home=true`
- CTA-knapp: "Visa allt partnernytt" → `/partnernytt`

**Partnerprofil (`PartnerProfile.tsx`)** – ny sektion
- Rubrik: "Senaste nytt från {partnerName}"
- 3 senaste där `partner_id=... AND show_on_partner_profile=true`
- Länk: "Se allt partnernytt →"

**Produktområdessidor** (BC, F&SCM, CRM, Copilot, etc.) – valfri liten sektion som visar nyheter där `product_area` matchar och `show_on_product_page=true`. Håll enkel: 3 kort + länk till `/partnernytt?produkt=...`.

## 4. Navigation

Lägg till "Partnernytt" i `Navbar` (rimlig plats: efter "Kunskapscenter" eller under "Marknad & Insikt") och i `Footer` under "AI & Partner".

## 5. Admin

Ny flik i `AdminDashboard` – "Partnernytt":
- Lista med filter (status, partner, produktområde, typ) + sök
- "Ny partnernytt"-knapp öppnar formulär
- Formulär: partner (dropdown från publicerade partners via `useAllPartnerNames`), source_url, editorial_title, summary, source_type, product_area, news_type, industry (från `standardIndustries`), image (upload till storage eller URL), news_date, is_featured, show_on_home, show_on_partner_profile, show_on_product_page
- Statusknappar: Spara utkast · Skicka för granskning · Godkänn · Publicera · Avpublicera · Arkivera
- Förhandsgranskning (renderar `PartnerNewsCard` med formulärets data)
- Editera/radera befintliga

## 6. Redaktionell princip (synlig i admin)

Info-ruta i adminformuläret:

> Partnernytt är ett urval för köpare av Dynamics 365. Publicera bara innehåll som hjälper en köpare att förstå partnerns erbjudande, erfarenhet, branschfokus, marknadsaktivitet eller relevans inom Dynamics 365, affärssystem, CRM, Power Platform eller Microsoft AI. Kopiera aldrig hela LinkedIn-inlägg eller externa artiklar – skriv en kort redaktionell sammanfattning och länka till originalkällan.

## 7. Tekniska detaljer

- Följer TAYA-tonalitet, `--cta-orange` för primär CTA, teal för sekundära accenter
- Datum: `YYYY/MM/DD`
- Använder befintliga tokens/komponenter (Card, Badge, Button)
- Länkar till originalkällan öppnas i ny flik med `rel="noopener nofollow"` (rekommenderat för externa partnerkällor)
- Ingen `dangerouslySetInnerHTML` – all text renderas som ren text
- Bilduppladdning via befintligt storage-mönster (samma som `partner-logos`)
- Inga automatiska LinkedIn-anrop, inga scrapers, inga cron-jobb för fetching

## 8. Uteslutet (bekräftat)

- Ingen LinkedIn-API-integration
- Ingen RSS-aggregering
- Ingen automatisk import
- Inget socialt flöde – bara kuraterat redaktionellt urval

---

**Omfattning:** Migration + storage-bucket + 1 edge function + 1 publik sida + 1 kortkomponent + 3 sektionsintegrationer (startsida, partnerprofil, produktsidor) + adminflik + navigation/footer + sitemap-uppdatering.

Vill du att jag bygger hela paketet på en gång, eller ska vi starta med **databas + admin + publik `/partnernytt`-sida** och lägga till startsida/partnerprofil/produktsidor i steg 2?
