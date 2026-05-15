## Branschsidor – proffsiga sidor per bransch

En sida per standardbransch på `/branscher/<slug>` med komplett innehåll (processer, utmaningar, roller, funktioner, applikationer, partners, FAQ). Innehållet AI-genereras och kan redigeras i admin.

### URL & navigering

- `/branscher/` – översiktssida som listar alla 20 branscher
- `/branscher/tillverkning`, `/branscher/handel`, ... – en sida per bransch
- Befintlig `/branschlosningar/` står kvar (bredare ingång) – branschsidorna länkas från den
- Navbar: ingen ändring nu; vi länkar in från Footer + `/branschlosningar` + `/valj-partner`

### Sidsektioner (per branschsida)

1. **Hero** – branschnamn, lead-text, hero-bild, breadcrumb
2. **Intro** – kort om branschen i Sverige (storlek, drivkrafter, marknadsläge)
3. **Affärsprocesser** – 5–7 typiska processer (t.ex. produktion, lager, order, projekt) med kort beskrivning
4. **Utmaningar** – 4–6 typiska smärtpunkter, formulerade neutralt
5. **Roller & funktioner** – nyckelroller (CFO, produktionschef, säljchef, …) och vad de behöver
6. **D365-applikationer som passar** – visar BC, F&SCM, Sales, CS, FS, CC, CI med relevans-text per app
7. **Branschspecifika industry apps** – från befintlig `partners.industry_apps` JSONB (MS Marketplace-certifierade), aggregerade
8. **Partners** – lista över partners med branschen i `industries` eller `secondary_industries`. Filterknappar för produktområde (BC, F&SCM, Sales, CS, FS, CC, CI). Standard sortering: seeded shuffle (per minne)
9. **FAQ** – 5–7 vanliga frågor med JSON-LD `FAQPage`
10. **CTA-sektion** – behovsanalys + partnerguide + kontakt
11. **RelatedPages** – närliggande branscher + översikter

### Datamodell

Ny tabell `industry_pages`:

- `slug` (text, unik) – t.ex. `tillverkning`
- `name` (text) – visningsnamn, t.ex. "Tillverkning"
- `meta_title`, `meta_description` (text)
- `hero_image_url` (text, valfri)
- `intro` (text – markdown-paragraf)
- `processes` (jsonb – `[{title, description}]`)
- `challenges` (jsonb – `[{title, description}]`)
- `roles` (jsonb – `[{role, needs}]`)
- `applications` (jsonb – `[{app: "Business Central", relevance: "..."}]`)
- `faq` (jsonb – `[{q, a}]`)
- `related_industries` (text[])
- `is_published` (boolean, default false)
- `ai_generated_at` (timestamptz)
- standard `created_at`, `updated_at`

RLS:
- `SELECT` för anon endast där `is_published = true`
- `ALL` för service_role (admin via edge function)

Validation-trigger: kräver `slug` + `name`.

### Innehållsgenerering (AI)

Ny edge function `generate-industry-page` (admin-skyddad via `PARTNER_ADMIN_PASSWORD`):
- Input: `industry_slug`, `industry_name`
- Anropar Lovable AI Gateway (`google/gemini-3-flash-preview`) med structured output (`Output.object`) → JSON med alla sektioner
- Sparar/uppdaterar raden i `industry_pages` med `is_published = false` så du granskar innan publicering

System-prompt: TAYA-tonalitet, neutral, ingen försäljningsretorik, fokus på svensk marknad, D365-applikationer (ingen Power Platform).

### Admin

Ny flik **Branschsidor** i `AdminDashboard.tsx`:
- Lista alla 20 standardbranscher (från `INDUSTRIES`-konstanten)
- Per rad: status (publicerad/utkast/saknas), knappar **Generera med AI**, **Redigera**, **Publicera/avpublicera**
- Redigeringsdialog (PremiumCollapsibleSection) med fält per sektion (textarea + JSON-arrays via repeatable rows)
- Sparas via ny edge function `manage-industry-pages` (CRUD, admin-skyddad)

### Publik sida

Ny route `src/pages/IndustryPage.tsx`:
- `useParams` → slug → fetch `industry_pages` via supabase client (anon, RLS filtrerar)
- 404 om saknas/opublicerad
- Hämtar matchande partners via befintlig `usePartners()`-hook + filtrera på industries inkl secondary
- Produktfilter-knappar (BC/F&SCM/Sales/CS/FS/CC/CI) – multi-select
- Använder `PartnerCard` för konsistens
- SEO: `SEOHead` med per-bransch title/desc/canonical, `BreadcrumbSchema`, `FAQSchema`

Ny route `src/pages/Branscher.tsx` – översikt med 20 kort.

App.tsx: `/branscher` + `/branscher/:slug` (lazy).

### SSG / sitemap

- Lägg `/branscher` och `/branscher/<slug>` (för publicerade) i `partnerRoutes.json`-genereringen → uppdatera `vite-prerender-plugin.ts` eller motsvarande JSON-källa
- Inkludera i sitemap via `refresh-sitemaps` edge function

### Filer

**Skapa:**
- `supabase/migrations/<ts>_industry_pages.sql`
- `supabase/functions/generate-industry-page/index.ts`
- `supabase/functions/manage-industry-pages/index.ts`
- `supabase/functions/_shared/ai-gateway.ts` (om saknas; provider-helper)
- `src/pages/IndustryPage.tsx`
- `src/pages/Branscher.tsx`
- `src/components/AdminIndustryPagesTab.tsx`
- `src/hooks/useIndustryPage.ts`
- `src/data/standardIndustries.ts` (lista över 20 branscher + slug + ikon/färg)

**Ändra:**
- `src/App.tsx` – lazy + routes
- `src/pages/AdminDashboard.tsx` – ny flik
- `src/components/Footer.tsx` – sub-rubrik "Branscher" (top 8) + länk till `/branscher`
- `src/pages/Branschlosningar.tsx` – länka till nya branschsidorna
- `vite-prerender-plugin.ts` (eller routes-källa) – lägg in branschrutter
- `supabase/functions/refresh-sitemaps/index.ts` – inkludera nya rutter

### Leverans i etapper

1. Migration + edge functions + admin-flik (du kan generera & redigera)
2. Publik IndustryPage + Branscher-översikt + routes
3. Footer-länkar + Branschlösningar-länkar
4. SSG-rutter + sitemap

Klart att starta? Migrationen är första steget och kräver ditt godkännande.