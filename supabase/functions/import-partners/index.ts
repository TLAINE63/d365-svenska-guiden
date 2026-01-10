import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "https://vnvphfrrmoaskiwlspeo.lovableproject.com",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// JWT verification using HMAC-SHA256
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; payload?: Record<string, unknown>; error?: string }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const signatureBytes = base64UrlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes as unknown as BufferSource, encoder.encode(dataToVerify));

    if (!isValid) {
      return { valid: false, error: "Invalid signature" };
    }

    const payload = JSON.parse(atob(base64UrlToBase64(encodedPayload)));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    if (payload.role !== "admin") {
      return { valid: false, error: "Insufficient permissions" };
    }

    return { valid: true, payload };
  } catch (error) {
    console.error("JWT verification error:", error);
    return { valid: false, error: "Token verification failed" };
  }
}

function base64UrlToBase64(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = base64UrlToBase64(str);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Static partner data matching partners.ts with new fields
const staticPartners = [
  {
    slug: "4ps-sweden",
    name: "4PS Sweden",
    logo_url: "",
    website: "https://www.4ps.se/",
    description: "4PS är en ledande leverantör av branschspecifik ERP-programvara för bygg-, installations- och serviceföretag. Deras lösning 4PS Construct är byggd på Microsoft Dynamics 365 Business Central och erbjuder end-to-end-funktionalitet med 100% realtidsvisibilitet på projekt.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad"],
    secondary_industries: [],
    geography: "Norden",
    product_filters: {
      bc: {
        industries: ["Bygg & Entreprenad"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    }
  },
  {
    slug: "bisqo",
    name: "Bisqo",
    logo_url: "https://bisqo.se/wp-content/uploads/2022/01/bisqo-logo.svg",
    website: "https://www.bisqo.se/businesscentral/",
    description: "Bisqo är experter inom Dynamics 365 Business Central och CRM på Power Platform. Deras strategi bygger på en kraftfull kombination av ERP och CRM.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Retail & E-handel", "Konsulttjänster", "Tillverkningsindustri"],
    secondary_industries: ["Tillverkningsindustri", "Konsulttjänster"],
    geography: "Sverige",
    product_filters: {
      bc: {
        industries: ["Grossist & Distribution", "Retail & E-handel"],
        secondaryIndustries: ["Tillverkningsindustri", "Konsulttjänster"],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 3
      },
      crm: {
        industries: ["Grossist & Distribution", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 1
      }
    }
  },
  {
    slug: "inbiz",
    name: "InBiz",
    logo_url: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se/microsoft-partner/",
    description: "InBiz är din trygga partner för Microsoft Dynamics 365 Business Central sedan 2005.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustri", "Grossist & Distribution", "Livsmedel & Processindustri", "Konsulttjänster"],
    secondary_industries: ["Livsmedel & Processindustri", "Konsulttjänster"],
    geography: "Sverige",
    product_filters: {
      bc: {
        industries: ["Tillverkningsindustri", "Grossist & Distribution"],
        secondaryIndustries: ["Livsmedel & Processindustri", "Konsulttjänster"],
        companySize: ["1-49", "50-99", "250-999"],
        geography: "Sverige",
        ranking: 2
      }
    }
  },
  {
    slug: "jma-maskindata",
    name: "JMA Maskindata",
    logo_url: "https://jma.se/wp-content/uploads/2022/01/jma-logo.svg",
    website: "https://jma.se/affarssystem/",
    description: "JMA Maskindata är specialister på affärssystem för tillverkande företag med lång erfarenhet av Microsoft Dynamics.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad", "Grossist & Distribution"],
    secondary_industries: [],
    geography: "Sverige",
    product_filters: {
      bc: {
        industries: ["Bygg & Entreprenad", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 2
      }
    }
  },
  {
    slug: "knowit",
    name: "Knowit",
    logo_url: "https://www.knowit.se/globalassets/knowit-logo.svg",
    website: "https://www.knowit.se/vart-erbjudande/solutions/",
    description: "Knowit är en nordisk digitaliseringskonsult med bred Microsoft-kompetens och fokus på hållbar digitalisering.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Bygg & Entreprenad", "Finans & Försäkring", "Grossist & Distribution"],
    secondary_industries: [],
    geography: "Norden",
    product_filters: {
      bc: {
        industries: ["Tillverkningsindustri", "Bygg & Entreprenad"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 6
      },
      fsc: {
        industries: ["Tillverkningsindustri", "Finans & Försäkring"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      },
      crm: {
        industries: ["Bygg & Entreprenad", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    }
  },
  {
    slug: "nab-solutions",
    name: "NAB Solutions",
    logo_url: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se/dynamics-365-business-central/",
    description: "NAB Solutions är specialister på Dynamics 365 Business Central och CRM med lång erfarenhet av implementationer för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Tillverkningsindustri", "Life Science / Medtech", "Konsulttjänster"],
    secondary_industries: ["Life Science / Medtech", "Konsulttjänster"],
    geography: "Sverige",
    product_filters: {
      bc: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: ["Life Science / Medtech", "Konsulttjänster"],
        companySize: ["1-49", "50-99", "250-999"],
        geography: "Sverige",
        ranking: 1
      },
      crm: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 1
      }
    }
  },
  {
    slug: "navcite",
    name: "Navcite",
    logo_url: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://www.navcite.com/microsoft-business-central/",
    description: "Navcite kombinerar 'Small company feeling – Big company experience' och erbjuder affärssystem med Infor M3 och Microsoft Business Central.",
    applications: ["Business Central"],
    industries: ["Grossist & Distribution", "Tillverkningsindustri"],
    secondary_industries: [],
    geography: "Sverige",
    product_filters: {
      bc: {
        industries: ["Grossist & Distribution", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 4
      }
    }
  },
  {
    slug: "norteam",
    name: "Norteam",
    logo_url: "",
    website: "https://norteam.se/",
    description: "Norteam är en Microsoft Dynamics 365-partner med fokus på Business Central och CRM för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Fastighet & Förvaltning"],
    secondary_industries: [],
    geography: "Sverige",
    product_filters: {
      bc: {
        industries: ["Konsulttjänster", "Fastighet & Förvaltning"],
        secondaryIndustries: [],
        companySize: ["1-49", "50-99", "100-249"],
        geography: "Sverige",
        ranking: 3
      },
      crm: {
        industries: ["Konsulttjänster", "Fastighet & Förvaltning"],
        secondaryIndustries: [],
        companySize: ["1-49", "50-99", "100-249"],
        geography: "Sverige",
        ranking: 5
      }
    }
  },
  {
    slug: "be-terna",
    name: "BE-terna",
    logo_url: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv/losningar/microsoft",
    description: "BE-terna är en internationell partner som vägleder företag till en säker digital framtid.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Finans & Försäkring", "Tillverkningsindustri", "Livsmedel & Processindustri"],
    secondary_industries: ["Livsmedel & Processindustri", "Tillverkningsindustri"],
    geography: "Europa",
    product_filters: {
      fsc: {
        industries: ["Grossist & Distribution", "Finans & Försäkring"],
        secondaryIndustries: ["Livsmedel & Processindustri", "Tillverkningsindustri"],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Europa",
        ranking: 1
      }
    }
  },
  {
    slug: "implema",
    name: "Implema",
    logo_url: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://implema.se/microsoft-dynamics/",
    description: "Implema hjälper företag att accelerera sin affär med mottot 'Snabbt, säkert och redo för framtiden'.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Grossist & Distribution", "Retail & E-handel", "Tillverkningsindustri"],
    secondary_industries: [],
    geography: "Norden",
    product_filters: {
      fsc: {
        industries: ["Grossist & Distribution", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 2
      },
      crm: {
        industries: ["Tillverkningsindustri", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 6
      }
    }
  },
  {
    slug: "innofactor",
    name: "Innofactor",
    logo_url: "https://www.innofactor.com/hubfs/Innofactor_Logo.svg",
    website: "https://www.innofactor.com/se/vad-vi-gor/losningar/dynamics-365/",
    description: "Innofactor är en Microsoft Cloud Solutions Partner med Microsofts högsta partnerbeteckning.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Finans & Försäkring", "Grossist & Distribution", "Offentlig sektor"],
    secondary_industries: [],
    geography: "Norden",
    product_filters: {
      fsc: {
        industries: ["Finans & Försäkring", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 1
      }
    }
  },
  {
    slug: "itm8",
    name: "Itm8",
    logo_url: "",
    website: "https://itm8.com/",
    description: "Itm8 är en nordisk IT-partner med fokus på Microsoft Dynamics 365 och digital transformation.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Retail & E-handel", "Grossist & Distribution", "Tillverkningsindustri"],
    secondary_industries: [],
    geography: "Norden",
    product_filters: {
      fsc: {
        industries: ["Retail & E-handel", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 3
      },
      crm: {
        industries: ["Retail & E-handel", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Norden",
        ranking: 4
      }
    }
  },
  {
    slug: "columbus",
    name: "Columbus",
    logo_url: "https://www.columbusglobal.com/hubfs/Columbus%20Logo.svg",
    website: "https://www.columbusglobal.com/sv/",
    description: "Columbus är en global IT-partner som hjälper företag att digitalisera och optimera sin verksamhet med Microsoft Dynamics 365.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Livsmedel & Processindustri", "Retail & E-handel"],
    secondary_industries: [],
    geography: "Internationellt",
    product_filters: {
      fsc: {
        industries: ["Tillverkningsindustri", "Livsmedel & Processindustri"],
        secondaryIndustries: [],
        companySize: ["250-999", "1.000-4.999", ">5.000"],
        geography: "Internationellt",
        ranking: 2
      },
      crm: {
        industries: ["Tillverkningsindustri", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["250-999", "1.000-4.999", ">5.000"],
        geography: "Internationellt",
        ranking: 3
      }
    }
  },
  {
    slug: "fellowmind",
    name: "Fellowmind",
    logo_url: "https://www.fellowmind.com/hubfs/Fellowmind%20Logo.svg",
    website: "https://www.fellowmind.com/sv-se/",
    description: "Fellowmind är en europeisk Microsoft-partner som hjälper organisationer att accelerera sin digitala transformation.",
    applications: ["Finance & SCM", "Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Offentlig sektor", "Non-profit / Organisationer"],
    secondary_industries: [],
    geography: "Europa",
    product_filters: {
      fsc: {
        industries: ["Tillverkningsindustri", "Offentlig sektor"],
        secondaryIndustries: [],
        companySize: ["100-249", "250-999", "1.000-4.999"],
        geography: "Europa",
        ranking: 4
      },
      bc: {
        industries: ["Non-profit / Organisationer", "Offentlig sektor"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Europa",
        ranking: 5
      }
    }
  },
  {
    slug: "avanade",
    name: "Avanade",
    logo_url: "https://www.avanade.com/-/media/logo/avanade-logo.svg",
    website: "https://www.avanade.com/sv-se",
    description: "Avanade är en global ledare inom digital innovation och molnlösningar baserat på Microsoft-plattformen.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Finans & Försäkring", "Energi & Utilities", "Life Science / Medtech"],
    secondary_industries: [],
    geography: "Internationellt",
    product_filters: {
      fsc: {
        industries: ["Finans & Försäkring", "Energi & Utilities"],
        secondaryIndustries: [],
        companySize: ["1.000-4.999", ">5.000"],
        geography: "Internationellt",
        ranking: 3
      },
      crm: {
        industries: ["Life Science / Medtech", "Finans & Försäkring"],
        secondaryIndustries: [],
        companySize: ["1.000-4.999", ">5.000"],
        geography: "Internationellt",
        ranking: 2
      }
    }
  },
  {
    slug: "yellow-solution",
    name: "Yellow Solution",
    logo_url: "",
    website: "https://yellowsolution.se",
    description: "Yellow Solution är en svensk Microsoft-partner specialiserad på Dynamics 365 CRM-lösningar.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service"],
    industries: ["Konsulttjänster", "Tillverkningsindustri"],
    secondary_industries: [],
    geography: "Sverige",
    product_filters: {
      crm: {
        industries: ["Konsulttjänster", "Tillverkningsindustri"],
        secondaryIndustries: [],
        companySize: ["50-99", "100-249", "250-999"],
        geography: "Sverige",
        ranking: 2
      }
    }
  },
  {
    slug: "hitachi-solutions",
    name: "Hitachi Solutions",
    logo_url: "https://www.hitachisolutions.com/wp-content/uploads/2021/04/hitachi-solutions-logo.svg",
    website: "https://www.hitachisolutions.com/",
    description: "Hitachi Solutions är en global systemintegratör med djup Microsoft Dynamics 365-expertis.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustri", "Retail & E-handel", "Finans & Försäkring"],
    secondary_industries: [],
    geography: "Internationellt",
    product_filters: {
      fsc: {
        industries: ["Tillverkningsindustri", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["250-999", "1.000-4.999", ">5.000"],
        geography: "Internationellt",
        ranking: 5
      },
      crm: {
        industries: ["Finans & Försäkring", "Retail & E-handel"],
        secondaryIndustries: [],
        companySize: ["250-999", "1.000-4.999", ">5.000"],
        geography: "Internationellt",
        ranking: 5
      }
    }
  }
];

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { token } = body;

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const verification = await verifyJWT(token || "", JWT_SECRET);
    if (!verification.valid) {
      return new Response(
        JSON.stringify({ error: verification.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: existingPartners } = await supabase
      .from("partners")
      .select("slug");

    const existingSlugs = new Set(existingPartners?.map(p => p.slug) || []);
    
    const partnersToInsert = staticPartners.filter(p => !existingSlugs.has(p.slug));
    
    if (partnersToInsert.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Alla partners finns redan i databasen",
          imported: 0,
          skipped: staticPartners.length
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { data, error } = await supabase
      .from("partners")
      .insert(partnersToInsert)
      .select();

    if (error) {
      console.error("Import error:", error);
      throw error;
    }

    console.log(`Imported ${data.length} partners`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${data.length} partners importerade`,
        imported: data.length,
        skipped: staticPartners.length - partnersToInsert.length,
        partners: data.map(p => p.name)
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in import-partners:", error);
    const corsHeaders = getCorsHeaders(req);
    const message = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
