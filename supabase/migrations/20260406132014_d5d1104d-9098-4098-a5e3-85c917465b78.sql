ALTER TABLE public.partners ADD COLUMN platform_capabilities text[] DEFAULT '{}'::text[];

-- Also add to partner_submissions so partners can submit this via invitation form
ALTER TABLE public.partner_submissions ADD COLUMN platform_capabilities text[] DEFAULT '{}'::text[];