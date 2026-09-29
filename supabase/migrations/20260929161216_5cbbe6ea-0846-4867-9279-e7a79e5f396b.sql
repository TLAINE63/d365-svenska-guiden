CREATE TABLE public.partner_review_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.partner_product_profiles(id) ON DELETE CASCADE,
  dimension_key text NOT NULL,
  value_key text NOT NULL,
  value_label text NOT NULL,
  change_type text NOT NULL CHECK (change_type IN ('confirm','add','remove')),
  previous_value text,
  new_value text,
  source text NOT NULL DEFAULT 'partner',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','clarification')),
  editor_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_review_changes TO service_role;
ALTER TABLE public.partner_review_changes ENABLE ROW LEVEL SECURITY;
CREATE INDEX partner_review_changes_status_idx ON public.partner_review_changes(status, created_at DESC);
CREATE INDEX partner_review_changes_partner_idx ON public.partner_review_changes(partner_id);
CREATE TRIGGER partner_review_changes_set_updated_at BEFORE UPDATE ON public.partner_review_changes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();