DROP POLICY IF EXISTS "Public can view approved events" ON public.partner_events;
REVOKE SELECT ON public.partner_events FROM anon, authenticated;
GRANT SELECT ON public.partner_events_public TO anon, authenticated;