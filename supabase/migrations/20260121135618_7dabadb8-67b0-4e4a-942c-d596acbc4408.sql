-- Remove the unused partner_change_requests table and its RLS policies
-- This feature was removed from the codebase but the table still exists

-- Drop all RLS policies first
DROP POLICY IF EXISTS "Anyone can submit change requests" ON public.partner_change_requests;
DROP POLICY IF EXISTS "Service role can delete change requests" ON public.partner_change_requests;
DROP POLICY IF EXISTS "Service role can read change requests" ON public.partner_change_requests;
DROP POLICY IF EXISTS "Service role can update change requests" ON public.partner_change_requests;

-- Drop the table
DROP TABLE IF EXISTS public.partner_change_requests;