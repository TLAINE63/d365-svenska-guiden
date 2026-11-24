DROP POLICY IF EXISTS "insert inquiry partners" ON public.inquiry_partners;
REVOKE INSERT ON public.inquiry_partners FROM anon, authenticated;