ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS tool_context jsonb;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS tool_context jsonb;
ALTER TABLE public.underlag_submissions ADD COLUMN IF NOT EXISTS tool_context jsonb;
ALTER TABLE public.underlag_forward_requests ADD COLUMN IF NOT EXISTS tool_context jsonb;
ALTER TABLE public.webinar_registrations ADD COLUMN IF NOT EXISTS tool_context jsonb;
COMMENT ON COLUMN public.inquiries.tool_context IS 'Kalkylator-/verktygsdata från besöket (bransch, användare, resultat), skickas med formuläret. Inga personuppgifter.';