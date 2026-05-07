ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS ai_summary_generated_at timestamp with time zone;