import { supabase } from "@/integrations/supabase/client";

interface UTMParams {
  application?: string;
  industry?: string;
}

export const buildPartnerUrl = (
  partnerWebsite: string,
  partnerName: string,
  utmParams?: UTMParams
): string => {
  try {
    const url = new URL(partnerWebsite);
    
    // Add UTM parameters
    url.searchParams.set('utm_source', 'd365');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'match');
    url.searchParams.set('utm_content', partnerName.toLowerCase().replace(/\s+/g, '-'));
    
    // Build utm_term from application and industry
    const termParts: string[] = [];
    if (utmParams?.application) {
      termParts.push(utmParams.application.toLowerCase().replace(/\s+/g, '-'));
    }
    if (utmParams?.industry) {
      termParts.push(utmParams.industry.toLowerCase().replace(/\s+/g, '-'));
    }
    if (termParts.length > 0) {
      url.searchParams.set('utm_term', termParts.join('+'));
    }
    
    return url.toString();
  } catch {
    // If URL parsing fails, return original URL
    return partnerWebsite;
  }
};

export const trackPartnerClick = async (
  partnerName: string,
  partnerWebsite: string,
  pageSource: string
) => {
  try {
    const response = await supabase.functions.invoke("track-partner-click", {
      body: {
        partnerName,
        partnerWebsite,
        pageSource,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      },
    });

    if (response.error) {
      console.error("Error tracking partner click:", response.error);
    } else {
      console.log("Partner click tracked successfully");
    }
  } catch (error) {
    console.error("Error tracking partner click:", error);
  }
};
