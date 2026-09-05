CREATE TABLE public.report_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_kind text NOT NULL CHECK (report_kind IN ('verified','basic')),
  partner_id uuid REFERENCES public.partners(id) ON DELETE CASCADE,
  partner_slug text NOT NULL,
  email text NOT NULL,
  contact_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.report_recipients TO service_role;

ALTER TABLE public.report_recipients ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX report_recipients_unique_idx
  ON public.report_recipients (report_kind, partner_slug, lower(email));

CREATE INDEX report_recipients_kind_idx ON public.report_recipients (report_kind, partner_slug);

CREATE TRIGGER report_recipients_set_updated_at
BEFORE UPDATE ON public.report_recipients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Automatisk generering av utkast (betald rapport + basicutskick) den 1:a varje månad.
CREATE OR REPLACE FUNCTION public.partner_report_autogen_dispatch()
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
      'X-Report-Cron-Secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'partner_report_cron_secret')
    ),
    body := jsonb_build_object('action', 'auto_generate'),
    timeout_milliseconds := 120000
  );
END;
$function$;

SELECT cron.schedule('partner-report-autogen', '30 4 1 * *', $cron$ SELECT public.partner_report_autogen_dispatch(); $cron$);