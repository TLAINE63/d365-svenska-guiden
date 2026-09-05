REVOKE ALL ON FUNCTION public.partner_report_autogen_dispatch() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.partner_report_autogen_dispatch() TO postgres, service_role;