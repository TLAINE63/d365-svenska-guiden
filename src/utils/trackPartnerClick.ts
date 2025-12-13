import { supabase } from "@/integrations/supabase/client";

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
