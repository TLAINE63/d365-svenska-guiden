
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS positioning_statement text,
  ADD COLUMN IF NOT EXISTS delivery_profile jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS team_size_sweden text,
  ADD COLUMN IF NOT EXISTS implementations_done text,
  ADD COLUMN IF NOT EXISTS not_a_fit text[] DEFAULT '{}'::text[];

ALTER TABLE public.partner_submissions
  ADD COLUMN IF NOT EXISTS positioning_statement text,
  ADD COLUMN IF NOT EXISTS delivery_profile jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS team_size_sweden text,
  ADD COLUMN IF NOT EXISTS implementations_done text,
  ADD COLUMN IF NOT EXISTS not_a_fit text[] DEFAULT '{}'::text[];
