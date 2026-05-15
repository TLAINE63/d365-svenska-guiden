
-- partners
DROP POLICY IF EXISTS "Allow insert for service role" ON public.partners;
DROP POLICY IF EXISTS "Allow update for service role" ON public.partners;
DROP POLICY IF EXISTS "Allow delete for service role" ON public.partners;
CREATE POLICY "Service role can insert partners" ON public.partners FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update partners" ON public.partners FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can delete partners" ON public.partners FOR DELETE TO service_role USING (true);

-- partner_events
DROP POLICY IF EXISTS "Service role can manage events" ON public.partner_events;
CREATE POLICY "Service role can manage events" ON public.partner_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- partner_event_tokens
DROP POLICY IF EXISTS "Service role can manage event tokens" ON public.partner_event_tokens;
CREATE POLICY "Service role can manage event tokens" ON public.partner_event_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);

-- partner_submissions
DROP POLICY IF EXISTS "Service role can manage submissions" ON public.partner_submissions;
CREATE POLICY "Service role can manage submissions" ON public.partner_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- partner_invitations
DROP POLICY IF EXISTS "Service role can manage invitations" ON public.partner_invitations;
DROP POLICY IF EXISTS "Block anon access to invitations" ON public.partner_invitations;
CREATE POLICY "Service role can manage invitations" ON public.partner_invitations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- leads
DROP POLICY IF EXISTS "Service role can update leads" ON public.leads;
DROP POLICY IF EXISTS "Service role can delete leads" ON public.leads;
CREATE POLICY "Service role can update leads" ON public.leads FOR UPDATE TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can delete leads" ON public.leads FOR DELETE TO service_role USING (true);

-- site_settings
DROP POLICY IF EXISTS "Service role can manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Block anon access to settings" ON public.site_settings;
CREATE POLICY "Service role can manage settings" ON public.site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- visitor_analytics
DROP POLICY IF EXISTS "Service role can read visitor analytics" ON public.visitor_analytics;
CREATE POLICY "Service role can read visitor analytics" ON public.visitor_analytics FOR SELECT TO service_role USING (true);

-- storage: partner-logos write policies
DROP POLICY IF EXISTS "Service role can upload partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update partner logos" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete partner logos" ON storage.objects;
CREATE POLICY "Service role can upload partner logos" ON storage.objects FOR INSERT TO service_role WITH CHECK (bucket_id = 'partner-logos');
CREATE POLICY "Service role can update partner logos" ON storage.objects FOR UPDATE TO service_role USING (bucket_id = 'partner-logos') WITH CHECK (bucket_id = 'partner-logos');
CREATE POLICY "Service role can delete partner logos" ON storage.objects FOR DELETE TO service_role USING (bucket_id = 'partner-logos');
