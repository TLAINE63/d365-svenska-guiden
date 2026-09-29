DROP POLICY IF EXISTS "Backlink snapshots are publicly readable" ON public.site_backlink_snapshots;
DROP POLICY IF EXISTS "Partner logos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can read partner documents in public folder" ON storage.objects;