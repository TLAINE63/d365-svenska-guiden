UPDATE public.partner_news SET news_type = 'artikel' WHERE news_type = 'partnernyhet';
UPDATE public.partner_feeds SET default_news_type = 'artikel' WHERE default_news_type = 'partnernyhet';