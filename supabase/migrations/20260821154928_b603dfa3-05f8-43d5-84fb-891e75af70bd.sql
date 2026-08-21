CREATE OR REPLACE FUNCTION public.d365_videos_dispatch()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/ingest-d365-videos',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
      )
    ),
    body := '{}'::jsonb
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.d365_videos_dispatch() FROM PUBLIC, anon, authenticated;

SELECT cron.schedule('ingest-d365-videos-daily', '20 4 * * *', $cron$ SELECT public.d365_videos_dispatch(); $cron$);