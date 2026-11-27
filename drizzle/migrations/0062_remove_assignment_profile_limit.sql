DROP TRIGGER IF EXISTS assignment_profiles_enforce_limit ON public.partner_assignment_profiles;
DO $$ DECLARE t record; BEGIN
  FOR t IN SELECT tgname FROM pg_trigger WHERE tgrelid = 'public.partner_assignment_profiles'::regclass AND tgfoid = 'public.assignment_profiles_enforce_limit'::regproc LOOP
    EXECUTE format('DROP TRIGGER %I ON public.partner_assignment_profiles', t.tgname);
  END LOOP;
END $$;
COMMENT ON FUNCTION public.assignment_profiles_enforce_limit() IS 'DEPRECATED: limit of three published assignment profiles removed 2026-11-27';