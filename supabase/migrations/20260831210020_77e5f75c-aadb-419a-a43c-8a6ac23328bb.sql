SELECT cron.unschedule('send-partner-monthly-report');
INSERT INTO public.site_settings (key, value, updated_at)
VALUES ('monthly_report_auto_send_enabled', 'false', now())
ON CONFLICT (key) DO UPDATE SET value = 'false', updated_at = now();