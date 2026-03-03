-- Remove unnecessary public INSERT policies
-- All inserts go through edge functions using service_role which bypasses RLS
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert visitor analytics" ON public.visitor_analytics;
DROP POLICY IF EXISTS "Anyone can submit partner data" ON public.partner_submissions;