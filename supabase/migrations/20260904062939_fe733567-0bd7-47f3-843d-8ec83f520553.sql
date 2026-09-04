CREATE OR REPLACE VIEW public.partner_card_metrics_monthly AS
SELECT
  partner_id,
  partner_slug,
  period_month,
  card_type,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'partner_profile_view'), 0)::bigint AS profile_views,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'formular_paborjat'), 0)::bigint AS forms_started,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'formular_skickat'), 0)::bigint AS forms_submitted,
  CASE
    WHEN COALESCE(sum(event_count) FILTER (WHERE event_name = 'formular_paborjat'), 0)::numeric = 0 THEN NULL::numeric
    ELSE round(
      100.0 * COALESCE(sum(event_count) FILTER (WHERE event_name = 'formular_skickat'), 0)::numeric
      / sum(event_count) FILTER (WHERE event_name = 'formular_paborjat'),
      1
    )
  END AS form_conversion_pct,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'spara_shortlist'), 0)::bigint AS shortlist_saves,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'klick_utgaende_partnersajt'), 0)::bigint AS outbound_clicks,
  COALESCE(sum(event_count) FILTER (WHERE event_name IN ('partner_added_to_comparison', 'partner_comparison_impression')), 0)::bigint AS comparison_events,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'partner_case_click'), 0)::bigint AS case_clicks,
  COALESCE(sum(event_count) FILTER (WHERE event_name = 'partner_competency_click'), 0)::bigint AS competency_clicks,
  COALESCE(sum(event_count) FILTER (WHERE event_name NOT IN (
    'partner_profile_view', 'formular_paborjat', 'formular_skickat',
    'spara_shortlist', 'klick_utgaende_partnersajt',
    'partner_added_to_comparison', 'partner_comparison_impression',
    'partner_case_click', 'partner_competency_click'
  )), 0)::bigint AS other_events
FROM public.partner_card_event_monthly
GROUP BY partner_id, partner_slug, period_month, card_type;