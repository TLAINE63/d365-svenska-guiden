CREATE OR REPLACE FUNCTION public.partner_report_monthly_dispatch(target_month date DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/manage-partner-reports',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
      )
    ),
    body := jsonb_build_object('action', 'monthly_snapshot')
            || CASE WHEN target_month IS NULL THEN '{}'::jsonb
                    ELSE jsonb_build_object('month', to_char(target_month, 'YYYY-MM-DD')) END,
    timeout_milliseconds := 120000
  );
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.partner_report_monthly_dispatch(date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.partner_report_monthly_dispatch(date) TO service_role;

SELECT cron.schedule(
  'partner-report-monthly-snapshot',
  '15 3 1 * *',
  $cron$ SELECT public.partner_report_monthly_dispatch(); $cron$
);