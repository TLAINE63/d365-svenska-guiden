-- lovable-cron-fallback-reviewed: femminuterskontroll krävs för 15-minuterspåminnelsen; en gemensam jobbkörning hanterar även inspelningsmejl och daglig städning
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE public.webinars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  body text,
  starts_at timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 45,
  theme text NOT NULL,
  speakers text,
  join_url text,
  recording_url text,
  status text NOT NULL DEFAULT 'utkast',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT webinars_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT webinars_description_length CHECK (char_length(description) <= 400),
  CONSTRAINT webinars_duration_valid CHECK (duration_min BETWEEN 5 AND 480),
  CONSTRAINT webinars_theme_valid CHECK (theme IN ('partnerval', 'pris', 'migrering', 'business-central', 'fscm', 'crm', 'ai')),
  CONSTRAINT webinars_status_valid CHECK (status IN ('utkast', 'publicerad', 'genomford', 'installd')),
  CONSTRAINT webinars_join_url_https CHECK (join_url IS NULL OR join_url ~ '^https://'),
  CONSTRAINT webinars_recording_url_https CHECK (recording_url IS NULL OR recording_url ~ '^https://')
);
GRANT ALL ON public.webinars TO service_role;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages webinars" ON public.webinars FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id uuid NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text NOT NULL,
  title text NOT NULL,
  email text NOT NULL,
  consent_reminder boolean NOT NULL,
  consent_followup boolean NOT NULL DEFAULT false,
  consent_text_version text NOT NULL,
  source_page text,
  landing_page text,
  session_pages jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  cancel_token_hash text NOT NULL UNIQUE,
  CONSTRAINT webinar_registrations_unique_email UNIQUE (webinar_id, email),
  CONSTRAINT webinar_registrations_reminder_required CHECK (consent_reminder = true),
  CONSTRAINT webinar_registrations_consent_version CHECK (consent_text_version = 'webinar-2026-11-v1')
);
GRANT ALL ON public.webinar_registrations TO service_role;
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages webinar registrations" ON public.webinar_registrations FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.webinar_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.webinar_registrations(id) ON DELETE CASCADE,
  webinar_id uuid NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  kind text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT webinar_email_log_unique UNIQUE (registration_id, kind),
  CONSTRAINT webinar_email_log_kind_valid CHECK (kind IN ('confirmation', 'reminder_24h', 'reminder_15m', 'recording'))
);
GRANT ALL ON public.webinar_email_log TO service_role;
ALTER TABLE public.webinar_email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages webinar email log" ON public.webinar_email_log FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  consent_text_version text NOT NULL,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmation_token_hash text NOT NULL UNIQUE,
  unsubscribe_token_hash text NOT NULL UNIQUE,
  CONSTRAINT newsletter_consent_version CHECK (consent_text_version = 'nyhetsbrev-2026-11-v1')
);
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages newsletter subscribers" ON public.newsletter_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX webinar_registrations_webinar_idx ON public.webinar_registrations (webinar_id, created_at DESC);
CREATE INDEX webinar_registrations_reminder_idx ON public.webinar_registrations (webinar_id, cancelled_at) WHERE cancelled_at IS NULL;
CREATE INDEX newsletter_subscribers_confirmed_idx ON public.newsletter_subscribers (confirmed_at) WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL;
CREATE INDEX newsletter_subscribers_cleanup_idx ON public.newsletter_subscribers (created_at) WHERE confirmed_at IS NULL;

CREATE VIEW public.webinars_public
WITH (security_barrier = true) AS
SELECT id, slug, title, description, body, starts_at, duration_min, theme, speakers, recording_url, status, created_at, updated_at
FROM public.webinars
WHERE status IN ('publicerad', 'genomford', 'installd');
REVOKE ALL ON public.webinars_public FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.webinars_public TO anon, authenticated, service_role;

ALTER TABLE public.knowledge_articles ADD COLUMN theme text;
ALTER TABLE public.knowledge_articles ADD CONSTRAINT knowledge_articles_theme_valid CHECK (theme IS NULL OR theme IN ('partnerval', 'pris', 'migrering', 'business-central', 'fscm', 'crm', 'ai'));

DROP TRIGGER IF EXISTS webinars_set_updated_at ON public.webinars;
CREATE TRIGGER webinars_set_updated_at
BEFORE UPDATE ON public.webinars
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.demand_webinar_registration_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  webinar_slug text;
BEGIN
  SELECT slug INTO webinar_slug FROM public.webinars WHERE id = NEW.webinar_id;
  PERFORM public.demand_log(
    'form_submitted',
    'webinar-' || coalesce(webinar_slug, NEW.webinar_id::text),
    '/tack/webinar/' || coalesce(webinar_slug, NEW.webinar_id::text) || '/',
    NEW.email
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER webinar_registration_demand_event
AFTER INSERT ON public.webinar_registrations
FOR EACH ROW EXECUTE FUNCTION public.demand_webinar_registration_event();

CREATE OR REPLACE FUNCTION public.webinar_newsletter_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.newsletter_subscribers
  WHERE confirmed_at IS NULL AND created_at < now() - interval '7 days';

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

DO $cron$
BEGIN
  PERFORM cron.unschedule('webinar-mailer-and-newsletter-cleanup');
EXCEPTION WHEN OTHERS THEN NULL;
END
$cron$;

SELECT cron.schedule(
  'webinar-mailer-and-newsletter-cleanup',
  '*/5 * * * *',
  $job$ SELECT public.webinar_newsletter_maintenance(); $job$
);
