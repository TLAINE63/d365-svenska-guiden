create or replace function public.search_perf_dispatch(payload jsonb)
returns bigint language plpgsql security definer set search_path to '' as $$
declare rid bigint;
begin
  select net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/search-performance',
    headers := jsonb_build_object('Content-Type','application/json','Lovable-Context','cron',
      'X-Report-Cron-Secret',(select decrypted_secret from vault.decrypted_secrets where name='partner_report_cron_secret')),
    body := payload, timeout_milliseconds := 150000) into rid;
  return rid;
end; $$;
revoke all on function public.search_perf_dispatch(jsonb) from public, anon, authenticated;

select cron.schedule('search-performance-daily', '40 5 * * *',
  $$select public.search_perf_dispatch('{"action":"sync","source":"all","days":5}'::jsonb)$$);