CREATE OR REPLACE FUNCTION public.public_verified_isv_contacts()
RETURNS TABLE(kind text, key text, contact_name text, contact_email text, contact_phone text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'vendor'::text, v.slug, i.contact_name, i.contact_email, NULL::text
  FROM public.isv_vendors v
  JOIN public.isv_vendor_internal i ON i.vendor_slug = v.slug
  WHERE v.information_status = 'verified'
    AND v.publication_status = 'published'
    AND (i.contact_email IS NOT NULL OR i.contact_name IS NOT NULL)
  UNION ALL
  SELECT 'product'::text, s.solution_id,
         COALESCE(o.sales_contact_name, o.vendor_contact_name),
         COALESCE(o.sales_contact_email, o.vendor_contact_email),
         o.sales_contact_phone
  FROM public.isv_solutions s
  JOIN public.isv_solution_overrides o ON o.solution_id = s.solution_id
  WHERE s.information_status = 'verified'
    AND s.is_published = true
    AND (o.sales_contact_email IS NOT NULL OR o.vendor_contact_email IS NOT NULL OR o.sales_contact_phone IS NOT NULL);
$$;

COMMENT ON FUNCTION public.public_verified_isv_contacts() IS 'Public contact details only for verified ISV vendors and verified published ISV products; unverified rows never leave the service-only tables.';

REVOKE ALL ON FUNCTION public.public_verified_isv_contacts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_verified_isv_contacts() TO anon, authenticated, service_role;