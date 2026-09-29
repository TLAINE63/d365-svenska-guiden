DO $$
DECLARE f text;
BEGIN
  FOREACH f IN ARRAY ARRAY[
    'enqueue_email(text,jsonb)','read_email_batch(text,integer,integer)','delete_email(text,bigint)',
    'move_to_dlq(text,text,bigint,jsonb)','email_queue_dispatch()','email_queue_wake()',
    'd365_videos_dispatch()','teaser_market_stats(timestamptz,timestamptz,timestamptz)',
    'teaser_market_stats_v2(timestamptz,timestamptz,timestamptz,timestamptz)',
    'teaser_exposure_counts(timestamptz,timestamptz)','teaser_engagement_stats(timestamptz,timestamptz)',
    'report_cron_secret()','partner_report_monthly_dispatch(date)','partner_report_autogen_dispatch()'
  ] LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', f);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%s TO service_role', f);
  END LOOP;
END $$;