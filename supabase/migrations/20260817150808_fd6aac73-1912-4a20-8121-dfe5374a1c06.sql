DROP VIEW IF EXISTS public.isv_solution_overrides_public;
CREATE VIEW public.isv_solution_overrides_public AS
SELECT solution_id, short_description, what, when_fits, use_cases, combos,
       products, industries, partner_slugs, vendor_name, vendor_website, vendor_updated_at
FROM public.isv_solution_overrides;

ALTER VIEW public.isv_solution_overrides_public SET (security_invoker = off);
GRANT SELECT ON public.isv_solution_overrides_public TO anon, authenticated;