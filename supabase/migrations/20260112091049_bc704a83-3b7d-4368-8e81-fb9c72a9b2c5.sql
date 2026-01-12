-- Add policy to allow anonymous users to read partner data via the public view
-- The partners_public view uses SECURITY INVOKER, so it needs a permissive SELECT policy
CREATE POLICY "Anyone can read partner data for public view"
ON partners
FOR SELECT
TO anon
USING (true);