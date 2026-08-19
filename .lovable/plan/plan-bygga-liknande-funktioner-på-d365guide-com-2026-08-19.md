# Plan: Bygga liknande funktioner på d365guide.com

## Bakgrund: Två olika projekt

d365.se (detta projekt) och d365guide.com (projekt "FPAA") är två helt fristående Lovable-projekt med olika kodbas, databas och syfte:

| | d365.se | d365guide.com |
|---|---|---|
| Syfte | D365-partnermatchning | FP&A (Aimplan, Power BI, budget/prognos) |
| Routing | React Router + Vite SSG | TanStack Router (filbaserad) |
| Edge Functions | ~70+ st | 7 st |
| Databastabeller | ~40+ | ~18 |
| AI-funktioner | Autofill, analyser, matchning | ai-chat, ai-search |

Kod kan inte kopieras direkt — komponenter måste anpassas till TanStack Router och FP&A-kontext.

## Process: Hur du jobbar across projekt

Lovable-projekt är fristående. Det finns ingen automatisk synk. För att bygga liknande funktioner på d365guide.com:

1. **Öppna d365guide.com i Lovable** (växla projekt i projektmenyn)
2. **Starta en ny chat** i det projektet
3. **Referera till detta projekt** — säg t.ex. "Bygg samma AI-autofill-funktion som på d365.se" eller klistra in specifik kod från hit
4. **Databasmigrationer** körs separat i d365guide.com:s Supabase (via migration-verktyget i den chatten)
5. **Edge functions** skapas i d365guide.com:s `supabase/functions/`-mapp

Jag kan från denna chat:
- Läsa och dela referenskod från d365.se
- Skapa en detaljerad feature-specifikation
- Förbereda SQL och edge function-kod som referens

## Prioriterade funktioner att bygga på d365guide.com

### Fas 1 — Grundläggande AI & Admin (högst värde)

**1. AI-genererat innehåll för partner-/lösningsprofiler**
- d365.se har: `autofill-partner-profile`, `generate-partner-insights`, `generate-partner-summary`
- d365guide.com behöver: Edge function som använder Lovable AI Gateway (`openai/gpt-5.6-sol`) för att fylla tomma fält i partner/guide-profiler
- Referens: `supabase/functions/autofill-partner-profile/index.ts` (anpassa tabeller till `partners`/`guides`)

**2. Förbättrad admin-dashboard**
- d365.se har: batch-knappar för AI-generering, CRUD för partners, nyheter, events
- d365guide.com har: grundläggande admin (`admin.index.tsx`, `admin.login.tsx`)
- Behöver: batch-AI-knappar, redigering av guider/artiklar, hantering av partners/events

**3. Lead-formulär med PDF-grind**
- d365.se har: `QuickLeadForm.tsx`, exit-intent popup, PDF-export
- d365guide.com har: `VideoWithLeadCapture`, `contact_submissions`-tabell, `AssessmentPdfReport`
- Behöver: kort lead-form (namn, företag, email) som låser upp PDF/assessment-resultat

### Fas 2 — Analytics & SEO

**4. Besökartracking & funnel-events**
- d365.se har: `track-visitor`, `track-funnel-event`, `visitor_analytics`, `funnel_events`
- d365guide.com har: `page_views`, `CtaTracker`, `usePageTracking`
- Behöver: anonym besökartracking, funnel-events för konverteringsspårning

**5. SEO-rankning & nyckelordsspårning**
- d365.se har: `seo_tracked_keywords`, `seo_keyword_rankings`, `semrush_monthly_stats`
- d365guide.com har: `Seo.tsx`-komponent
- Behöver: keyword tracking, automatiserad sitemap, structured data (JSON-LD)

### Fas 3 — Innehåll & Partner-system

**6. Kunskapscenter med kategorier**
- d365.se har: `knowledge_articles`, `D365TillaggKatalog`, ISV-katalog
- d365guide.com har: `guides`, `categories`, `tags`, `glossary_terms`
- Behöver: AI-stödd artikelgenerering, kategorihantering i admin

**7. Partner-/lösningsjämförelse**
- d365.se har: `ComparePartners.tsx`, `match-partners`, `compare-partners-insights`
- d365guide.com har: `Jamfor.tsx` (verktygsval), `Verktygsval.tsx`
- Behöver: AI-stödd jämförelse av FP&A-lösningar (Aimplan vs Power BI native vs Fabric)

**8. Månadsrapport till partners**
- d365.se har: `send-partner-monthly-report`, `manage-partner-reports`, anonymiserad statistik
- d365guide.com behöver: anonym besöksstatistik per partner-lösning, automatisk rapport

## Tekniska anpassningar

| d365.se (React Router) | d365guide.com (TanStack Router) |
|---|---|
| `src/pages/X.tsx` + route i router.tsx | `src/routes/x.tsx` (filbaserad routing) |
| `import { Link } from "react-router-dom"` | `import { Link } from "@/lib/router-compat"` |
| `useParams()` från react-router | `useParams()` från `@tanstack/react-router` |
| Edge function-import: `npm:ai` | Samma — båda använder Deno |
| Supabase client: `@/integrations/supabase/client` | Samma sökväg finns |

## Nästa steg

1. Du öppnar d365guide.com i Lovable
2. Starta en chat där och säg "Bygg fas 1 från planen" (eller specifik feature)
3. Klistra in referenskod från d365.se vid behov — jag kan hämta exakt kod här
4. Databasmigrationer och edge functions skapas i d365guide.com:s kontext
