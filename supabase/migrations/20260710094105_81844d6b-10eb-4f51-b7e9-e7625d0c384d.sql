GRANT SELECT ON public.partner_events TO anon;
GRANT SELECT ON public.partner_events TO authenticated;
CREATE POLICY "Public can view approved events"
ON public.partner_events
FOR SELECT
TO anon, authenticated
USING (status = 'approved');