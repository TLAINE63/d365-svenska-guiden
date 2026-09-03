ALTER TABLE public.partner_engagement_events
  ADD COLUMN IF NOT EXISTS card_type text,
  ADD COLUMN IF NOT EXISTS product_area text;

CREATE INDEX IF NOT EXISTS idx_pee_card_type_time
  ON public.partner_engagement_events (card_type, occurred_at DESC);

CREATE OR REPLACE VIEW public.partner_card_event_monthly
WITH (security_invoker = true) AS
WITH deduped AS (
  SELECT DISTINCT
    partner_id,
    partner_slug,
    card_type,
    product_area,
    event_name,
    date_trunc('month', occurred_at)::date AS period_month,
    CASE
      WHEN event_name = 'formular_paborjat'
        THEN coalesce(session_id, id::text) || ':' || coalesce(metadata->>'form_id', 'default')
      ELSE id::text
    END AS dedupe_key
  FROM public.partner_engagement_events
)
SELECT
  partner_id,
  partner_slug,
  period_month,
  card_type,
  product_area,
  event_name,
  count(*)::bigint AS event_count
FROM deduped
GROUP BY partner_id, partner_slug, period_month, card_type, product_area, event_name;

GRANT SELECT ON public.partner_card_event_monthly TO service_role;

CREATE OR REPLACE VIEW public.partner_card_form_conversion_monthly
WITH (security_invoker = true) AS
SELECT
  partner_id,
  partner_slug,
  period_month,
  card_type,
  sum(event_count) FILTER (WHERE event_name = 'formular_paborjat')::bigint AS forms_started,
  sum(event_count) FILTER (WHERE event_name = 'formular_skickat')::bigint AS forms_submitted,
  CASE
    WHEN coalesce(sum(event_count) FILTER (WHERE event_name = 'formular_paborjat'), 0) = 0 THEN NULL
    ELSE round(
      100.0 * coalesce(sum(event_count) FILTER (WHERE event_name = 'formular_skickat'), 0)
      / sum(event_count) FILTER (WHERE event_name = 'formular_paborjat'), 1)
  END AS conversion_pct
FROM public.partner_card_event_monthly
GROUP BY partner_id, partner_slug, period_month, card_type;

GRANT SELECT ON public.partner_card_form_conversion_monthly TO service_role;