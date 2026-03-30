
-- Create partner-documents storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('partner-documents', 'partner-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can read partner documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'partner-documents');

-- Allow service role to manage documents
CREATE POLICY "Service role can manage partner documents"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'partner-documents')
WITH CHECK (bucket_id = 'partner-documents');
