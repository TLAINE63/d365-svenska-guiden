
CREATE OR REPLACE FUNCTION public.get_all_partner_names()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  is_featured boolean,
  agreement_signed boolean,
  product_filters jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, slug, COALESCE(is_featured, false), COALESCE(agreement_signed, false), COALESCE(product_filters, '{}'::jsonb)
  FROM public.partners
  ORDER BY name;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_partner_names() TO anon, authenticated;
