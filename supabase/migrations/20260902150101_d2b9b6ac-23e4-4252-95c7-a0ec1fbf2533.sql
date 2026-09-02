create or replace function public.teaser_engagement_stats(start_ts timestamp with time zone, end_ts timestamp with time zone)
returns table(profile_views bigint, engaged_share_pct numeric)
language sql
stable security definer
set search_path = public
as $$
  select
    (select count(*) from public.partner_profile_views where viewed_at >= start_ts and viewed_at <= end_ts) as profile_views,
    coalesce(round(100.0 * count(*) filter (where is_bounce = false) / nullif(count(*), 0), 1), 0) as engaged_share_pct
  from public.visitor_analytics
  where visited_at >= start_ts and visited_at <= end_ts;
$$;

revoke all on function public.teaser_engagement_stats(timestamp with time zone, timestamp with time zone) from public, anon, authenticated;
grant execute on function public.teaser_engagement_stats(timestamp with time zone, timestamp with time zone) to service_role;