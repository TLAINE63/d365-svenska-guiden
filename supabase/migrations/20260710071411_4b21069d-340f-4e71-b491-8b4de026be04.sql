
UPDATE public.partners
SET industry_pitches = (
  SELECT jsonb_agg(pitch ORDER BY (pitch->>'updated_at') DESC NULLS LAST)
  FROM (
    SELECT DISTINCT ON (COALESCE(pitch->>'industry',''), COALESCE(pitch->>'product',''))
      pitch
    FROM jsonb_array_elements(industry_pitches) AS pitch
    ORDER BY COALESCE(pitch->>'industry',''), COALESCE(pitch->>'product',''),
             (pitch->>'updated_at') DESC NULLS LAST
  ) t
),
updated_at = now()
WHERE slug = '4ps-sweden';

UPDATE public.partners
SET customer_examples = ARRAY(
  SELECT CASE
    WHEN url LIKE 'https://eur04.safelinks.protection.outlook.com/%be-terna.com%2Fsv%2Finsikter%2Fnordisk-effektivare-arbete-med-microsoft-dynamics-365%'
      THEN 'https://www.be-terna.com/sv/insikter/nordisk-effektivare-arbete-med-microsoft-dynamics-365'
    ELSE url
  END
  FROM unnest(customer_examples) AS url
),
updated_at = now()
WHERE slug = 'be-terna';
