ALTER TABLE public.webinar_registrations ADD COLUMN cancel_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex') UNIQUE;
ALTER TABLE public.newsletter_subscribers ADD COLUMN unsubscribe_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex') UNIQUE;
