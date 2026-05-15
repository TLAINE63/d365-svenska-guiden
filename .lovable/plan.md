# Funnel-vy i Admin

Ny flik **"Funnel"** under gruppen *Statistik* som visar var besökare faller av i konverteringskedjan, så vi kan rikta optimeringsinsatser exakt där läckaget är störst.

## Funnel-stegen

```text
1. Besök sida              (visitor_analytics)
2. Visat CTA/banner        (NY tracking)
3. Klickat CTA             (NY tracking)
4. Startat behovsanalys    (NY tracking)
5. Slutfört behovsanalys   (NY tracking)
6. Laddat ner PDF          (NY tracking)
7. Skickat lead            (leads)
8. Klickat partnerprofil   (partner_profile_views)
9. Klickat partnerwebb     (partner_clicks)
```

För varje steg: antal, % av föregående steg, % av topp. Färgkodning grön/gul/röd när drop-off > tröskel.

## Vyer

- **Översikt (default)**: Sammanslagen funnel för valt datumintervall (7d / 30d / 90d / custom).
- **Per sida-typ**: Filter för hemsida, produktsidor (BC, CRM, F&SCM…), artiklar, partner-listor. Visar att t.ex. CRM-sidan har 4% klick → analys medan BC har 12%.
- **Per analys-verktyg**: Behovsanalys, AI-readiness, kravspec (sales/marketing/customer service) – completion rate per verktyg och per steg i wizarden.
- **Tidsserie**: Linjediagram med konverteringsgrad steg-för-steg över tid.

## Datainsamling – ny tracking som behövs

Idag finns sidvisningar, partner-klick, profil-views och leads. **Det som saknas** är CTA-interaktion och analys-progression. Ny tabell `funnel_events`:

```sql
funnel_events (
  id uuid pk,
  session_id text,
  event_type text,    -- 'cta_view' | 'cta_click' | 'analysis_start'
                      -- | 'analysis_step' | 'analysis_complete'
                      -- | 'pdf_download'
  event_name text,    -- t.ex. 'lead_magnet_banner', 'needs_analysis', 'kravspec_sales'
  page_path text,
  step_number int,    -- för analysis_step
  metadata jsonb,
  ip_anonymized text,
  occurred_at timestamptz
)
```

Edge function `track-funnel-event` (service-role insert, samma mönster som `track-visitor`). Anropas via `navigator.sendBeacon` från:

- `LeadMagnetBanner`, `LeadCTA`, `ScrollCTA`, `EbookBanner` – view (IntersectionObserver) + click
- `NeedsAnalysis`, `AIReadiness`, `RequirementsSpec*` – start, varje steg, complete
- `generatePartnerGuide`, `generateRequirementsSpec` – pdf_download

## UI

Ny komponent `src/components/AdminFunnelTab.tsx`:

- Datumväljare + sida-typ-filter överst
- **Funnel-stapeldiagram** (horisontell, krympande staplar) med antal + drop-off% mellan steg
- **KPI-rad**: total konvertering, största läckage-steg, bästa sida, sämsta sida
- **Tabell per sida**: lista alla sidor sorterade efter konverteringsgrad, klickbara för drill-down
- Använder Recharts (finns redan) och semantiska tokens

Edge function `funnel-stats` (service-role) som aggregerar från `visitor_analytics`, `funnel_events`, `partner_clicks`, `partner_profile_views`, `leads` baserat på `session_id` och datumintervall.

## Integration

- Registrera `funnel` som ny `TabsTrigger` + `TabsContent` i `AdminDashboard.tsx` under gruppen *Statistik*
- Inga ändringar i publika sidor utöver tunna tracking-anrop (fire-and-forget, blockar aldrig UI)

## Tekniska detaljer

- **Migration**: skapa `funnel_events` med RLS (service role only), index på `(occurred_at, event_type)` och `(session_id)`
- **Edge functions**: `track-funnel-event` (verify_jwt=false, beacon-vänlig), `funnel-stats` (admin auth via `PARTNER_ADMIN_PASSWORD`-mönster som övriga admin-funktioner)
- **Session-koppling**: använd existerande `session_id` från `useVisitorTracking` (sessionStorage) så funnel-events kan joinas mot `visitor_analytics`
- **Ingen ändring** i bef. tracking (`track-visitor`, `track-partner-click`, `track-partner-view`) – återanvänds via session_id-join

## Filer som skapas/ändras

**Nya:**
- `supabase/migrations/<ts>_funnel_events.sql`
- `supabase/functions/track-funnel-event/index.ts`
- `supabase/functions/funnel-stats/index.ts`
- `src/components/AdminFunnelTab.tsx`
- `src/utils/trackFunnelEvent.ts`

**Ändras:**
- `src/pages/AdminDashboard.tsx` (ny flik)
- `src/components/LeadMagnetBanner.tsx`, `LeadCTA.tsx`, `ScrollCTA.tsx`, `EbookBanner.tsx` (view + click tracking)
- `src/pages/NeedsAnalysis.tsx`, `AIReadiness.tsx`, `SalesMarketingNeedsAnalysis.tsx`, `CustomerServiceNeedsAnalysis.tsx`, `RequirementsSpec*.tsx` (start/step/complete)
- `src/utils/generatePartnerGuide.ts`, `generateRequirementsSpec.ts` (pdf_download)
