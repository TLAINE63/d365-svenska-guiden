UPDATE public.isv_solution_overrides
SET short_description = 'Svensk molnbaserad planeringslösning i Power BI för budget, prognos och scenarier, till exempel ekonomisk prognos, säljprognos och bemanningsplanering, med data från Dynamics 365.',
    what = 'Svensk planeringslösning i Power BI och Fabric med write-back för budget, prognos, scenarier och rapportering. Kan hämta data från Business Central, Finance & Supply Chain Management, Sales, Customer Service och andra källsystem.',
    use_cases = ARRAY['Budget- och prognosprocess','Rullande prognos och scenario','Säljprognos och pipeline-scenarier','Bemanningsprognos för kundtjänst','Konsoliderad finansiell rapportering'],
    combos = ARRAY['BC + Aimplan + Power BI','F&SCM + Aimplan + Power BI','Sales + Aimplan + Power BI','Customer Service + Aimplan + Power BI'],
    updated_at = now()
WHERE solution_id = 'aimplan';