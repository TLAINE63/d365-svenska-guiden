CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  PERFORM cron.unschedule('refresh-sitemaps-daily');
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

SELECT cron.schedule(
  'refresh-sitemaps-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/refresh-sitemaps',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6InZudnBoZnJybW9hc2tpd2xzcGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTAwNTYsImV4cCI6MjA4MDg4NjA1Nn0.lCYQXgk1ktKvWOuZSPV1sZMt30JQiS-Jb_0UzmLHy8o'
    ),
    body := jsonb_build_object('source', 'pg_cron', 'scheduled_at', now())
  );
  $$
);