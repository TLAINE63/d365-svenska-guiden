UPDATE storage.objects
SET name = 'public/' || name
WHERE bucket_id = 'partner-documents'
  AND name NOT LIKE 'public/%'
  AND name NOT LIKE '\_internal/%';

DROP POLICY IF EXISTS "Public can read partner agreement documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can read partner documents" ON storage.objects;

CREATE POLICY "Public can read partner documents in public folder"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'partner-documents'
  AND name LIKE 'public/%'
);