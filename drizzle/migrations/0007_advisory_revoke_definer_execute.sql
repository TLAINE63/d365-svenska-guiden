REVOKE ALL ON FUNCTION public.inquiries_advisory_events() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.partner_introductions_events() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.advisory_log_event(text, jsonb) FROM PUBLIC, anon, authenticated;