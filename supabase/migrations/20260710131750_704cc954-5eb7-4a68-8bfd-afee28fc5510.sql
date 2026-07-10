UPDATE public.partners
SET description = replace(
  description,
  'kontinuerlig utveckling över hela systemets livscykel.',
  'kontinuerlig utveckling under systemets hela livscykel.'
)
WHERE slug = 'vivicta';