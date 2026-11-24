REVOKE EXECUTE ON FUNCTION public.demand_is_partner_self(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.demand_is_partner_self(text, text, text) TO service_role;