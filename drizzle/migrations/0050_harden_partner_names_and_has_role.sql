CREATE OR REPLACE FUNCTION public.get_all_partner_names()
RETURNS TABLE (id uuid, name text, slug text, is_featured boolean, agreement_signed boolean, product_filters jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.name, p.slug, COALESCE(p.is_featured, false), NULL::boolean,
    COALESCE((SELECT jsonb_object_agg(k, true) FROM jsonb_each(COALESCE(p.product_filters, '{}'::jsonb)) AS e(k, v)
              WHERE v IS NOT NULL AND v <> 'false'::jsonb AND v <> 'null'::jsonb AND v <> '{}'::jsonb AND v <> '[]'::jsonb), '{}'::jsonb)
  FROM public.partners p
  ORDER BY p.name;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT (_user_id = auth.uid() OR auth.role() = 'service_role' OR current_user IN ('postgres','supabase_admin'))
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;