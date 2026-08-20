REVOKE ALL ON public.partners FROM anon, authenticated;
GRANT ALL ON public.partners TO service_role;