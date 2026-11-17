-- Marknadspuls: endast aggregerade 90-dagarssiffror, inga företagsnamn eller id:n.
CREATE OR REPLACE FUNCTION public.public_market_pulse()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH s AS (
    SELECT organisation_uuid, company_industry, company_size
    FROM snitcher_visits WHERE session_started_at >= now() - interval '90 days'
  )
  SELECT jsonb_build_object(
    'period_start', to_char((now() - interval '90 days') AT TIME ZONE 'Europe/Stockholm', 'YYYY-MM-DD'),
    'period_end', to_char(now() AT TIME ZONE 'Europe/Stockholm', 'YYYY-MM-DD'),
    'companies', (SELECT count(DISTINCT organisation_uuid) FROM s),
    'page_views', (SELECT count(*) FROM visitor_analytics WHERE visited_at >= now() - interval '90 days'),
    'unique_visitors', (SELECT count(DISTINCT ip_anonymized) FROM visitor_analytics WHERE visited_at >= now() - interval '90 days'),
    'profile_views', (SELECT count(*) FROM partner_profile_views WHERE viewed_at >= now() - interval '90 days'),
    'search_impressions', (SELECT coalesce(sum(impressions),0) FROM search_perf_daily WHERE day >= (current_date - 90)),
    'size_small', (SELECT count(DISTINCT organisation_uuid) FROM s WHERE company_size IN ('1-10 employees','11-50 employees')),
    'size_mid', (SELECT count(DISTINCT organisation_uuid) FROM s WHERE company_size IN ('51-200 employees','201-500 employees')),
    'size_large', (SELECT count(DISTINCT organisation_uuid) FROM s WHERE company_size IN ('501-1000 employees','1001-5000 employees','5001-10,000 employees','10,001+ employees')),
    'industries', (SELECT coalesce(jsonb_agg(company_industry ORDER BY n DESC), '[]'::jsonb) FROM (
       SELECT company_industry, count(DISTINCT organisation_uuid) n FROM s
       WHERE coalesce(company_industry,'') <> '' GROUP BY 1 HAVING count(DISTINCT organisation_uuid) >= 5
       ORDER BY n DESC LIMIT 8) t)
  );
$$;
REVOKE ALL ON FUNCTION public.public_market_pulse() FROM public;
GRANT EXECUTE ON FUNCTION public.public_market_pulse() TO anon, authenticated;
