CREATE OR REPLACE FUNCTION public.teaser_market_stats(start30 timestamptz, start90 timestamptz, end_ts timestamptz)
RETURNS TABLE(visitors30 bigint, visitors90 bigint, pages30 bigint, pages90 bigint, avg_time_sec numeric)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    count(DISTINCT session_id) FILTER (WHERE visited_at >= start30) AS visitors30,
    count(DISTINCT session_id) AS visitors90,
    count(*) FILTER (WHERE visited_at >= start30) AS pages30,
    count(*) AS pages90,
    avg(time_on_page_seconds) FILTER (WHERE time_on_page_seconds > 0) AS avg_time_sec
  FROM public.visitor_analytics
  WHERE visited_at >= start90 AND visited_at <= end_ts;
$$;
REVOKE ALL ON FUNCTION public.teaser_market_stats(timestamptz, timestamptz, timestamptz) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.teaser_market_stats(timestamptz, timestamptz, timestamptz) TO service_role;

CREATE OR REPLACE FUNCTION public.teaser_exposure_counts(start_ts timestamptz, end_ts timestamptz)
RETURNS TABLE(partners_in_comparisons bigint, partners_on_industry_pages bigint, partners_in_filters bigint)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    count(DISTINCT partner_slug) FILTER (WHERE lower(page_path) LIKE '%jamfor%' OR lower(page_path) LIKE '%compare%') AS partners_in_comparisons,
    count(DISTINCT partner_slug) FILTER (WHERE lower(page_path) LIKE '/branscher%' AND lower(page_path) NOT LIKE '%jamfor%' AND lower(page_path) NOT LIKE '%compare%') AS partners_on_industry_pages,
    count(DISTINCT partner_slug) FILTER (WHERE lower(page_path) NOT LIKE '%jamfor%' AND lower(page_path) NOT LIKE '%compare%' AND lower(page_path) NOT LIKE '/branscher%') AS partners_in_filters
  FROM public.partner_filter_exposures
  WHERE viewed_at >= start_ts AND viewed_at <= end_ts AND partner_slug <> '';
$$;
REVOKE ALL ON FUNCTION public.teaser_exposure_counts(timestamptz, timestamptz) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.teaser_exposure_counts(timestamptz, timestamptz) TO service_role;