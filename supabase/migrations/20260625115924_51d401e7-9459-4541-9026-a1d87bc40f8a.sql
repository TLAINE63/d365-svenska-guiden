UPDATE public.partners
SET industry_pitches = (
  SELECT jsonb_agg(
    CASE WHEN e->>'industry' = 'Logistik & Transport'
         THEN jsonb_set(e, '{industry}', '"Transport & Logistik"'::jsonb)
         ELSE e END
  )
  FROM jsonb_array_elements(industry_pitches) e
)
WHERE EXISTS (
  SELECT 1 FROM jsonb_array_elements(industry_pitches) e
  WHERE e->>'industry' = 'Logistik & Transport'
);