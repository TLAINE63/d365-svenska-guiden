ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS source_document_text text,
  ADD COLUMN IF NOT EXISTS source_document_url text,
  ADD COLUMN IF NOT EXISTS source_document_filename text,
  ADD COLUMN IF NOT EXISTS source_document_mime text,
  ADD COLUMN IF NOT EXISTS source_document_updated_at timestamp with time zone;

COMMENT ON COLUMN public.partners.source_document_text IS 'Rå textextraktion från partnerns uppladdade underlagsdokument (PDF/DOCX). Används som AI-kontext – primärkälla från partnern själv. Aldrig publik.';
COMMENT ON COLUMN public.partners.source_document_url IS 'Publik URL till senast uppladdade underlagsdokument i partner-documents-bucketen.';