-- Fix: Restrict SELECT access on leads table to service_role only
-- Drop the overly permissive policy that allows public read access
DROP POLICY IF EXISTS "Service role can read leads" ON public.leads;

-- Create a new policy that explicitly restricts SELECT to service_role only
CREATE POLICY "Service role only can read leads"
ON public.leads
FOR SELECT
TO service_role
USING (true);