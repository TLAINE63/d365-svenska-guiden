CREATE TABLE public.isv_solution_analysis (
  solution_id text PRIMARY KEY REFERENCES public.isv_solutions(solution_id) ON UPDATE CASCADE ON DELETE CASCADE,
  technical_model text,
  technical_model_certainty text,
  implementation_class text,
  local_competence text,
  target_size text,
  analysis_industry text,
  other_erp text,
  price_info text,
  price_model text,
  price_certainty text,
  price_source_url text,
  swedish_delivery_partners text,
  analysis_source_url text,
  match_type text,
  match_confidence text,
  analysis_reviewed_at date,
  import_batch text,
  imported_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.isv_solution_analysis IS 'Nordic analysis supplement per ISV product (technical model, price, target size). Internal, not shown publicly; never overrides editorial fields in isv_solutions.';

CREATE TABLE public.isv_solution_markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solution_id text NOT NULL REFERENCES public.isv_solutions(solution_id) ON UPDATE CASCADE ON DELETE CASCADE,
  country_code text NOT NULL,
  country text,
  availability text NOT NULL,
  local_delivery text,
  named_partners text,
  language text,
  evidence_type text,
  source_1 text,
  source_2 text,
  source_ref text,
  reservation text,
  local_competence text,
  evidence_quality text,
  checked_at date,
  method_note text,
  import_batch text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (solution_id, country_code)
);
COMMENT ON TABLE public.isv_solution_markets IS 'Country status per ISV product (SE, DK, NO, FI, IS). Internal; a weaker assessment can never replace a stronger one (trigger).';

CREATE TABLE public.isv_import_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_batch text NOT NULL,
  solution_id text NOT NULL,
  field text NOT NULL,
  old_value text,
  new_value text,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.isv_import_changes IS 'Audit log of catalog fields changed by data imports, so every change can be traced and reverted.';

GRANT SELECT ON public.isv_solution_analysis TO authenticated;
GRANT ALL ON public.isv_solution_analysis TO service_role;
GRANT SELECT ON public.isv_solution_markets TO authenticated;
GRANT ALL ON public.isv_solution_markets TO service_role;
GRANT SELECT ON public.isv_import_changes TO authenticated;
GRANT ALL ON public.isv_import_changes TO service_role;

ALTER TABLE public.isv_solution_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isv_solution_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isv_import_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read ISV analysis" ON public.isv_solution_analysis FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read ISV markets" ON public.isv_solution_markets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read ISV import changes" ON public.isv_import_changes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.isv_markets_protect_evidence()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE
  old_a int; new_a int; old_d int; new_d int;
BEGIN
  old_a := CASE OLD.availability WHEN 'Verifierad' THEN 3 WHEN 'Starkt indikerad' THEN 2 ELSE 1 END;
  new_a := CASE NEW.availability WHEN 'Verifierad' THEN 3 WHEN 'Starkt indikerad' THEN 2 ELSE 1 END;
  old_d := CASE OLD.local_delivery WHEN 'Belagd' THEN 3 WHEN 'Indikerad' THEN 2 ELSE 1 END;
  new_d := CASE NEW.local_delivery WHEN 'Belagd' THEN 3 WHEN 'Indikerad' THEN 2 ELSE 1 END;
  IF new_a < old_a OR new_d < old_d THEN
    -- A weaker assessment never replaces stronger evidence: keep the existing evidence row.
    NEW.availability := OLD.availability;
    NEW.local_delivery := OLD.local_delivery;
    NEW.named_partners := OLD.named_partners;
    NEW.evidence_type := OLD.evidence_type;
    NEW.source_1 := OLD.source_1;
    NEW.source_2 := OLD.source_2;
    NEW.source_ref := OLD.source_ref;
    NEW.evidence_quality := OLD.evidence_quality;
    NEW.checked_at := OLD.checked_at;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER isv_solution_markets_protect BEFORE UPDATE ON public.isv_solution_markets
FOR EACH ROW EXECUTE FUNCTION public.isv_markets_protect_evidence();

CREATE OR REPLACE FUNCTION public.isv_analysis_protect_evidence()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF OLD.technical_model_certainty = 'Källstöd finns' AND COALESCE(NEW.technical_model_certainty, '') <> 'Källstöd finns' THEN
    NEW.technical_model := OLD.technical_model;
    NEW.technical_model_certainty := OLD.technical_model_certainty;
  END IF;
  IF COALESCE(OLD.price_certainty, 'Ej priskontrollerad') <> 'Ej priskontrollerad'
     AND COALESCE(NEW.price_certainty, 'Ej priskontrollerad') = 'Ej priskontrollerad' THEN
    NEW.price_info := OLD.price_info;
    NEW.price_model := OLD.price_model;
    NEW.price_certainty := OLD.price_certainty;
    NEW.price_source_url := OLD.price_source_url;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

CREATE TRIGGER isv_solution_analysis_protect BEFORE UPDATE ON public.isv_solution_analysis
FOR EACH ROW EXECUTE FUNCTION public.isv_analysis_protect_evidence();