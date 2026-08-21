UPDATE public.partners
SET map_url = 'https://www.google.com/maps/search/?api=1&query=' || replace(name || ' ' || office_cities[1], ' ', '+')
WHERE is_featured = true
  AND (map_url IS NULL OR map_url = '')
  AND coalesce(array_length(office_cities,1),0) > 0;

UPDATE public.partners
SET description = 'Point Taken arbetar med Dynamics 365 Customer Engagement med tyngdpunkt på Sales och Customer Service, kompletterat av Customer Insights, Field Service och Contact Center. Fokus ligger på CRM- och kundserviceprojekt snarare än ERP. Enligt uppgifterna på d365.se är konsult- och tjänsteföretag samt medelstora organisationer (cirka 50–249 anställda) den tydligaste målgruppen.',
    description_generated_at = now()
WHERE name = 'Point Taken' AND coalesce(description,'') = '';