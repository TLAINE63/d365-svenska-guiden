ALTER TABLE public.knowledge_articles 
ADD COLUMN target_roles TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN format TEXT NOT NULL DEFAULT 'artikel';