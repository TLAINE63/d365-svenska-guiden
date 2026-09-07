ALTER TABLE public.isv_solutions
  ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS lifecycle_note text,
  ADD COLUMN IF NOT EXISTS successor_solution_id text;

CREATE INDEX IF NOT EXISTS isv_solutions_lifecycle_idx ON public.isv_solutions (lifecycle_status);