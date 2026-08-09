select cron.schedule(
  'send-lead-followup-daily',
  '0 8 * * *',
  $cron$
  select net.http_post(
    url := 'https://vnvphfrrmoaskiwlspeo.supabase.co/functions/v1/send-lead-followup',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'email_queue_service_role_key')
    ),
    body := '{}'::jsonb
  );
  $cron$
);