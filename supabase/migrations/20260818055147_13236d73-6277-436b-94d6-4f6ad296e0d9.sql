DROP POLICY IF EXISTS "Service role can manage isv overrides" ON public.isv_solution_overrides;
CREATE POLICY "Service role can manage isv overrides"
ON public.isv_solution_overrides FOR ALL TO service_role USING (true) WITH CHECK (true);
REVOKE ALL ON public.isv_solution_overrides FROM anon, authenticated;
GRANT ALL ON public.isv_solution_overrides TO service_role;