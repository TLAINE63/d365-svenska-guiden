UPDATE public.partners
SET is_featured = true,
    geography = ARRAY['Sverige']::text[],
    industries = ARRAY['Konsulttjänster','Finans & Försäkring','Grossist & Distribution','Fastighet & Förvaltning','Tillverkningsindustri']::text[]
WHERE slug = 'dynamic-factory';