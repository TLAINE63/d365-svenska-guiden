UPDATE public.isv_solutions
SET products = ARRAY['Business Central','Finance & Supply Chain Management','Sales','Customer Service'],
    sales_relevance = 'partial',
    customer_service_relevance = 'partial',
    tags = ARRAY['FP&A','Budget','Forecast','Power BI','Scenarier','Write-back','Swedish'],
    short_description = 'Svensk molnbaserad planeringslösning i Power BI för budget, prognos och scenarier, till exempel ekonomisk prognos, säljprognos och bemanningsplanering, med data från Dynamics 365.'
WHERE solution_id = 'aimplan';