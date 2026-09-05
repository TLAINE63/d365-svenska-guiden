create or replace function public.teaser_market_stats_v2(
  prev30_start timestamptz,
  start30 timestamptz,
  start90 timestamptz,
  end_ts timestamptz
)
returns table(
  visitors30 bigint,
  visitors_prev30 bigint,
  visitors90 bigint,
  pages30 bigint,
  pages90 bigint,
  sessions30 bigint,
  avg_time_sec numeric
)
language sql
stable
security definer
set search_path to 'public'
as $$
  select
    count(distinct ip_anonymized) filter (where visited_at >= start30) as visitors30,
    count(distinct ip_anonymized) filter (where visited_at >= prev30_start and visited_at < start30) as visitors_prev30,
    count(distinct ip_anonymized) filter (where visited_at >= start90) as visitors90,
    count(*) filter (where visited_at >= start30) as pages30,
    count(*) filter (where visited_at >= start90) as pages90,
    count(distinct session_id) filter (where visited_at >= start30) as sessions30,
    avg(time_on_page_seconds) filter (where time_on_page_seconds > 0 and visited_at >= start90) as avg_time_sec
  from public.visitor_analytics
  where visited_at >= least(prev30_start, start90) and visited_at <= end_ts;
$$;

grant execute on function public.teaser_market_stats_v2(timestamptz, timestamptz, timestamptz, timestamptz) to service_role;