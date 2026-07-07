
-- 1. Add profile_level + observed fields to partners
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS profile_level text NOT NULL DEFAULT 'profilerad',
  ADD COLUMN IF NOT EXISTS observed_products jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS observed_industries jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS observed_locations text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS observed_updated_at timestamptz;

ALTER TABLE public.partners
  DROP CONSTRAINT IF EXISTS partners_profile_level_check;
ALTER TABLE public.partners
  ADD CONSTRAINT partners_profile_level_check
  CHECK (profile_level IN ('basic', 'profilerad'));

CREATE INDEX IF NOT EXISTS partners_profile_level_idx ON public.partners(profile_level);

-- 2. Public view for Basic partners — WHITELIST only observed fields.
-- Ekonomi, kontakter, ai_profile, source_document m.m. kan aldrig läcka ut här.
DROP VIEW IF EXISTS public.partners_basic_public CASCADE;
CREATE VIEW public.partners_basic_public
WITH (security_invoker = on) AS
SELECT
  id,
  slug,
  name,
  website,                 -- endast till standalone-kortets utlänk
  observed_products,
  observed_industries,
  observed_locations,
  observed_updated_at,
  profile_level,
  created_at,
  updated_at
FROM public.partners
WHERE profile_level = 'basic';

GRANT SELECT ON public.partners_basic_public TO anon, authenticated;

-- 3. Anonymous signal counter for blocked contact attempts.
-- INGEN köpardata: bara partner_id, tidstämpel och kontext.
CREATE TABLE IF NOT EXISTS public.contact_attempt_blocked (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  source_context text NOT NULL DEFAULT 'basic_card',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_attempt_blocked_partner_idx
  ON public.contact_attempt_blocked(partner_id);
CREATE INDEX IF NOT EXISTS contact_attempt_blocked_created_idx
  ON public.contact_attempt_blocked(created_at DESC);

-- Grants: service_role hanterar. Anon får INTE skriva direkt – all skrivning
-- går via edge function 'track-contact-blocked' som stripar all metadata.
GRANT ALL ON public.contact_attempt_blocked TO service_role;

ALTER TABLE public.contact_attempt_blocked ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages contact_attempt_blocked"
  ON public.contact_attempt_blocked;
CREATE POLICY "Service role manages contact_attempt_blocked"
  ON public.contact_attempt_blocked
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
