INSERT INTO public.site_settings (key, value, updated_at) VALUES
  ('partneroversikt_publiceringsdatum', '2026-09-05', now()),
  ('partneroversikt_anmalningsdatum', '2026-11-14', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

CREATE POLICY "Anyone can read partneroversikt dates"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (key IN ('partneroversikt_publiceringsdatum', 'partneroversikt_anmalningsdatum'));