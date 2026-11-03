CREATE OR REPLACE FUNCTION public.public_verified_isv_contacts()
RETURNS TABLE(kind text, key text, contact_name text, contact_email text, contact_phone text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  -- Contacts are public only when the ISV is both verified AND has active ISV Presence (premium flag).
  SELECT 'vendor'::text, v.slug, i.contact_name, i.contact_email, i.contact_phone
  FROM public.isv_vendors v
  JOIN public.isv_vendor_internal i ON i.vendor_slug = v.slug
  WHERE v.information_status = 'verified'
    AND v.premium_vendor = true
    AND v.publication_status = 'published'
    AND (i.contact_email IS NOT NULL OR i.contact_name IS NOT NULL OR i.contact_phone IS NOT NULL)
  UNION ALL
  SELECT 'product'::text, s.solution_id,
         COALESCE(NULLIF(o.sales_contact_name, ''), i.contact_name),
         COALESCE(NULLIF(o.sales_contact_email, ''), i.contact_email),
         COALESCE(NULLIF(o.sales_contact_phone, ''), i.contact_phone)
  FROM public.isv_solutions s
  LEFT JOIN public.isv_solution_overrides o ON o.solution_id = s.solution_id
  LEFT JOIN public.isv_vendor_internal i ON i.vendor_slug = s.vendor_slug
  WHERE s.information_status = 'verified'
    AND s.premium_product = true
    AND s.is_published = true
    AND COALESCE(NULLIF(o.sales_contact_email, ''), NULLIF(o.sales_contact_phone, ''), i.contact_email, i.contact_phone) IS NOT NULL;
$$;
REVOKE ALL ON FUNCTION public.public_verified_isv_contacts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_verified_isv_contacts() TO anon, authenticated, service_role;