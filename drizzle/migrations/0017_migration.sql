ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS partner_updated_at timestamptz;
COMMENT ON COLUMN public.partners.partner_updated_at IS 'Senaste gången partnern själv uppdaterade uppgifter via profileringslänken.';

CREATE OR REPLACE FUNCTION public.partner_mark_self_update(_partner_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path TO 'public' AS $$
  UPDATE public.partners SET
    partner_updated_at = now(),
    information_status = CASE WHEN information_status = 'verified' THEN 'verified' ELSE 'partner_confirmed' END
  WHERE id = _partner_id;
$$;
REVOKE ALL ON FUNCTION public.partner_mark_self_update(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.partner_mark_self_update(uuid) TO service_role;