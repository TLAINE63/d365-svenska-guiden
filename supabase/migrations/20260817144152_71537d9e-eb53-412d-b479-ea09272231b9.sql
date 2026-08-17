ALTER TABLE public.isv_solution_overrides
  ADD COLUMN IF NOT EXISTS vendor_name text,
  ADD COLUMN IF NOT EXISTS admin_contact_name text,
  ADD COLUMN IF NOT EXISTS admin_contact_email text,
  ADD COLUMN IF NOT EXISTS admin_contact_phone text,
  ADD COLUMN IF NOT EXISTS sales_contact_name text,
  ADD COLUMN IF NOT EXISTS sales_contact_email text,
  ADD COLUMN IF NOT EXISTS sales_contact_phone text;