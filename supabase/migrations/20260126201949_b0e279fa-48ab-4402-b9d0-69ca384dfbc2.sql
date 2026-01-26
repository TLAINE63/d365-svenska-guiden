-- Fix: Partner invitation tokens are fully enumerable (PUBLIC_DATA_EXPOSURE)
-- The current "Anyone can read invitation by token" policy allows unrestricted SELECT
-- This exposes all invitation records including tokens, emails, and partner names

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can read invitation by token" ON partner_invitations;

-- Create a restrictive policy that blocks all anonymous access
-- Edge Functions using service_role will handle all token validation server-side
CREATE POLICY "Block anon access to invitations"
ON partner_invitations FOR SELECT TO anon
USING (false);

-- Note: The existing "Service role can manage invitations" policy already allows
-- Edge Functions to access and manage invitations properly