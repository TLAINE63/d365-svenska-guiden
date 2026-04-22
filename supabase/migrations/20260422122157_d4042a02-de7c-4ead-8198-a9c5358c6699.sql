ALTER TABLE public.partners
ADD COLUMN IF NOT EXISTS agreement_signed boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS agreement_notes text;