CREATE OR REPLACE FUNCTION public.webinar_newsletter_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.newsletter_subscribers
  WHERE confirmed_at IS NULL AND created_at < now() - interval '7 days';

  DELETE FROM public.webinar_registrations
  WHERE created_at < now() - interval '24 months';

  PERFORM net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/webinar-mailer',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'X-Report-Cron-Secret', public.report_cron_secret()
    ),
    body := jsonb_build_object('action', 'scheduled'),
    timeout_milliseconds := 120000
  );
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.webinar_newsletter_maintenance() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.webinar_newsletter_maintenance() TO service_role;
