DROP POLICY IF EXISTS "Public can read partner documents" ON storage.objects;

CREATE POLICY "Public can read partner agreement documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'partner-documents'
  AND name NOT LIKE '\_internal/%'
  AND name NOT LIKE 'partnerunderlag%'
  AND (name ILIKE '%partner_agreement%' OR name ILIKE '%partneravtal%' OR name ILIKE '%partner-agreement%')
);