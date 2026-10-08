ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS followup_token text UNIQUE DEFAULT replace(gen_random_uuid()::text,'-',''),
  ADD COLUMN IF NOT EXISTS followup_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS buyer_reply text CHECK (buyer_reply IN ('ja','nej')),
  ADD COLUMN IF NOT EXISTS buyer_replied_at timestamptz;
UPDATE public.inquiries SET followup_token = replace(gen_random_uuid()::text,'-','') WHERE followup_token IS NULL;
ALTER TABLE public.inquiry_partners ADD CONSTRAINT inquiry_partners_status_chk CHECK (status IN ('skickad','kontaktad','offert','ej_aktuell'));

create or replace function public.inquiry_followup_dispatch()
returns bigint language plpgsql security definer set search_path to '' as $$
declare rid bigint;
begin
  select net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/inquiry-status',
    headers := jsonb_build_object('Content-Type','application/json','Lovable-Context','cron',
      'X-Report-Cron-Secret', public.report_cron_secret()),
    body := '{"action":"send_followups"}'::jsonb, timeout_milliseconds := 60000) into rid;
  return rid;
end; $$;
revoke all on function public.inquiry_followup_dispatch() from public, anon, authenticated;
select cron.schedule('inquiry-followup-daily', '15 7 * * *', $$select public.inquiry_followup_dispatch()$$);