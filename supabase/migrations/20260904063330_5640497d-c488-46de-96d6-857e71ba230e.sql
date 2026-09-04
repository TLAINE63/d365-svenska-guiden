CREATE OR REPLACE VIEW public.partner_exposure_monthly
WITH (security_invoker = true) AS
WITH filter_exp AS (
  SELECT
    partner_slug,
    (date_trunc('month', viewed_at))::date AS period_month,
    count(*) AS filter_exposures,
    count(*) FILTER (WHERE lower(page_path) LIKE '%jamfor%' OR lower(page_path) LIKE '%compare%') AS comparison_page_exposures,
    count(*) FILTER (WHERE lower(page_path) LIKE '/branscher%' AND lower(page_path) NOT LIKE '%jamfor%' AND lower(page_path) NOT LIKE '%compare%') AS industry_page_exposures,
    count(*) FILTER (WHERE lower(page_path) NOT LIKE '%jamfor%' AND lower(page_path) NOT LIKE '%compare%' AND lower(page_path) NOT LIKE '/branscher%') AS other_page_exposures,
    count(DISTINCT session_id) FILTER (WHERE session_id IS NOT NULL AND session_id <> '') AS unique_sessions
  FROM public.partner_filter_exposures
  WHERE partner_slug <> ''
  GROUP BY partner_slug, (date_trunc('month', viewed_at))::date
),
engagement_imp AS (
  SELECT
    partner_slug,
    (date_trunc('month', occurred_at))::date AS period_month,
    count(*) FILTER (WHERE event_name = 'partner_match_impression') AS match_impressions,
    count(*) FILTER (WHERE event_name = 'partner_list_impression') AS list_impressions,
    count(*) FILTER (WHERE event_name = 'partner_filter_impression') AS filter_impressions,
    count(*) FILTER (WHERE event_name = 'partner_comparison_impression') AS comparison_impressions,
    count(*) FILTER (WHERE event_name = 'partner_added_to_comparison') AS added_to_comparison
  FROM public.partner_engagement_events
  WHERE partner_slug <> ''
    AND event_name IN (
      'partner_match_impression', 'partner_list_impression', 'partner_filter_impression',
      'partner_comparison_impression', 'partner_added_to_comparison'
    )
  GROUP BY partner_slug, (date_trunc('month', occurred_at))::date
),
combined AS (
  SELECT
    COALESCE(f.partner_slug, e.partner_slug) AS partner_slug,
    COALESCE(f.period_month, e.period_month) AS period_month,
    COALESCE(f.filter_exposures, 0)::bigint AS filter_exposures,
    COALESCE(f.comparison_page_exposures, 0)::bigint AS comparison_page_exposures,
    COALESCE(f.industry_page_exposures, 0)::bigint AS industry_page_exposures,
    COALESCE(f.other_page_exposures, 0)::bigint AS other_page_exposures,
    COALESCE(f.unique_sessions, 0)::bigint AS unique_sessions,
    COALESCE(e.match_impressions, 0)::bigint AS match_impressions,
    COALESCE(e.list_impressions, 0)::bigint AS list_impressions,
    COALESCE(e.filter_impressions, 0)::bigint AS filter_impressions,
    COALESCE(e.comparison_impressions, 0)::bigint AS comparison_impressions,
    COALESCE(e.added_to_comparison, 0)::bigint AS added_to_comparison
  FROM filter_exp f
  FULL JOIN engagement_imp e
    ON e.partner_slug = f.partner_slug AND e.period_month = f.period_month
)
SELECT
  c.partner_slug,
  m.partner_id,
  c.period_month,
  c.filter_exposures,
  c.comparison_page_exposures,
  c.industry_page_exposures,
  c.other_page_exposures,
  c.unique_sessions,
  c.match_impressions,
  c.list_impressions,
  c.filter_impressions,
  c.comparison_impressions,
  c.added_to_comparison,
  (c.filter_exposures + c.comparison_impressions) AS total_exposures,
  CASE
    WHEN (c.filter_exposures + c.comparison_impressions) = 0 THEN NULL::numeric
    ELSE round(
      100.0 * COALESCE(m.profile_views, 0)::numeric
      / (c.filter_exposures + c.comparison_impressions),
      1
    )
  END AS click_through_pct
FROM combined c
LEFT JOIN (
  SELECT partner_slug, period_month, (array_agg(partner_id))[1] AS partner_id, sum(profile_views) AS profile_views
  FROM public.partner_card_metrics_monthly
  GROUP BY partner_slug, period_month
) m
  ON m.partner_slug = c.partner_slug AND m.period_month = c.period_month;