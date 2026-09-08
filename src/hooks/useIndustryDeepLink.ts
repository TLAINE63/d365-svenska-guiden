import { useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { scrollToAnchorWhenReady } from "@/lib/anchorScroll";

/**
 * Tar emot val gjorda tidigare i flödet (t.ex. hero-väljaren på startsidan):
 * ?industry=<branschnamn> förvaljer branschfiltret och #partners scrollar
 * till partnersektionen när sidans innehåll ovanför den har laddats.
 */
export function useIndustryDeepLink(setIndustry: (value: string | null) => void) {
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const industry = params.get("industry");
  const wantsPartners = hash === "#partners" || Boolean(industry);

  useEffect(() => {
    if (industry) setIndustry(industry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry]);

  useEffect(() => {
    if (!wantsPartners) return;
    return scrollToAnchorWhenReady("partners");
  }, [wantsPartners]);

  return { deepLinkIndustry: industry, skipTopScroll: wantsPartners };
}

export default useIndustryDeepLink;
