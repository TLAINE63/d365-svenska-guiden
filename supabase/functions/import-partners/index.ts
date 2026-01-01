import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get allowed origins for CORS
const ALLOWED_ORIGINS = [
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

    // Verify signature
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

    // Decode and validate payload
    const payload = JSON.parse(atob(base64UrlToBase64(encodedPayload)));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" };
    }

    // Check role
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

// Static partner data to import
const staticPartners = [
  {
    slug: "4ps-sweden",
    name: "4PS Sweden",
    logo_url: "",
    website: "https://www.4ps.se/",
    description: "4PS är en ledande leverantör av branschspecifik ERP-programvara för bygg-, installations- och serviceföretag. Deras lösning 4PS Construct är byggd på Microsoft Dynamics 365 Business Central och erbjuder end-to-end-funktionalitet med 100% realtidsvisibilitet på projekt.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad"],
  },
  {
    slug: "bisqo",
    name: "Bisqo",
    logo_url: "https://bisqo.se/wp-content/uploads/2022/01/bisqo-logo.svg",
    website: "https://www.bisqo.se/businesscentral/",
    description: "Bisqo är experter inom Dynamics 365 Business Central och CRM på Power Platform. Deras strategi bygger på en kraftfull kombination av ERP och CRM.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)", "Konsulttjänster"],
  },
  {
    slug: "inbiz",
    name: "InBiz",
    logo_url: "https://www.inbiz.se/wp-content/uploads/2021/08/inbiz-logo.png",
    website: "https://www.inbiz.se/microsoft-partner/",
    description: "InBiz är din trygga partner för Microsoft Dynamics 365 Business Central sedan 2005.",
    applications: ["Business Central"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Konsulttjänster"],
  },
  {
    slug: "jma-maskindata",
    name: "JMA Maskindata",
    logo_url: "https://jma.se/wp-content/uploads/2022/01/jma-logo.svg",
    website: "https://jma.se/affarssystem/",
    description: "JMA Maskindata är specialister på affärssystem för tillverkande företag med lång erfarenhet av Microsoft Dynamics.",
    applications: ["Business Central"],
    industries: ["Bygg & Entreprenad", "Grossist/Distribution", "Transport & Logistik"],
  },
  {
    slug: "knowit",
    name: "Knowit",
    logo_url: "https://www.knowit.se/globalassets/knowit-logo.svg",
    website: "https://www.knowit.se/vart-erbjudande/solutions/",
    description: "Knowit är en nordisk digitaliseringskonsult med bred Microsoft-kompetens och fokus på hållbar digitalisering.",
    applications: ["Business Central", "Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Bank & Försäkring", "Hälso- & sjukvård", "Konsulttjänster"],
  },
  {
    slug: "nab-solutions",
    name: "NAB Solutions",
    logo_url: "https://www.nabsolutions.se/wp-content/uploads/2021/03/nab-logo.png",
    website: "https://www.nabsolutions.se/dynamics-365-business-central/",
    description: "NAB Solutions är specialister på Dynamics 365 Business Central och CRM med lång erfarenhet av implementationer för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Medlemsorganisationer", "Nonprofit", "Tillverkningsindustrin", "Utbildning"],
  },
  {
    slug: "navcite",
    name: "Navcite",
    logo_url: "https://navcite.se/wp-content/uploads/2022/01/navcite-logo.svg",
    website: "https://www.navcite.com/microsoft-business-central/",
    description: "Navcite kombinerar 'Small company feeling – Big company experience' och erbjuder affärssystem med Infor M3 och Microsoft Business Central.",
    applications: ["Business Central"],
    industries: ["Konsulttjänster", "Tillverkningsindustrin", "Grossist/Distribution"],
  },
  {
    slug: "norteam",
    name: "Norteam",
    logo_url: "",
    website: "https://norteam.se/",
    description: "Norteam är en Microsoft Dynamics 365-partner med fokus på Business Central och CRM för svenska företag.",
    applications: ["Business Central", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
  },
  {
    slug: "be-terna",
    name: "BE-terna",
    logo_url: "https://www.be-terna.com/hubfs/BE-terna%20Logo.svg",
    website: "https://www.be-terna.com/sv/losningar/microsoft",
    description: "BE-terna är en internationell partner som vägleder företag till en säker digital framtid.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Handel (Retail & eCommerce)", "Transport & Logistik", "Grossist/Distribution"],
  },
  {
    slug: "implema",
    name: "Implema",
    logo_url: "https://www.implema.se/wp-content/uploads/2021/03/implema-logo.svg",
    website: "https://implema.se/microsoft-dynamics/",
    description: "Implema hjälper företag att accelerera sin affär med mottot 'Snabbt, säkert och redo för framtiden'.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Grossist/Distribution", "Handel (Retail & eCommerce)"],
  },
  {
    slug: "innofactor",
    name: "Innofactor",
    logo_url: "https://www.innofactor.com/hubfs/Innofactor_Logo.svg",
    website: "https://www.innofactor.com/se/vad-vi-gor/losningar/dynamics-365/",
    description: "Innofactor är en Microsoft Cloud Solutions Partner med Microsofts högsta partnerbeteckning.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Hälso- & sjukvård", "Energi & Utilities", "Utbildning"],
  },
  {
    slug: "nexer",
    name: "Nexer",
    logo_url: "https://nexergroup.com/wp-content/uploads/2022/01/nexer-logo.svg",
    website: "https://nexergroup.com/sv/tjanster/dynamics-365/",
    description: "Nexer är en svensk IT-konsult med global räckvidd och stark kompetens inom Dynamics 365.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Offentlig sektor", "Handel (Retail & eCommerce)"],
  },
  {
    slug: "crm-konsulterna",
    name: "CRM Konsulterna",
    logo_url: "https://crmkonsulterna.se/wp-content/uploads/2023/01/crmk-logo.svg",
    website: "https://www.crmkonsulterna.se/dynamics-365/",
    description: "CRM Konsulterna utsågs till Dynamics 365 Customer Engagement Partner of the Year 2023 av Microsoft Sverige.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Konsulttjänster", "Handel (Retail & eCommerce)", "Offentlig sektor"],
  },
  {
    slug: "nemely",
    name: "Nemely",
    logo_url: "https://nemely.se/wp-content/uploads/2022/01/nemely-logo.svg",
    website: "https://nemely.se/dynamics-365/",
    description: "Nemely är en Microsoft Dynamics 365 Partner specialiserad på CRM och kundengagemang.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Grossist/Distribution", "Konsulttjänster"],
  },
  {
    slug: "releye",
    name: "Releye",
    logo_url: "https://releye.se/wp-content/uploads/2022/01/releye-logo.svg",
    website: "https://releye.se/dynamics-365/",
    description: "Releye är en Microsoft-partner med fokus på Dynamics 365 och Power Platform.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Handel (Retail & eCommerce)", "Konsulttjänster", "Grossist/Distribution"],
  },
  {
    slug: "sirocco-group",
    name: "Sirocco Group",
    logo_url: "https://siroccogroup.com/wp-content/uploads/2022/01/sirocco-logo.svg",
    website: "https://www.siroccogroup.com/microsoft-dynamics-365/",
    description: "Sirocco Group är en internationell boutique-konsult och utvecklingsbyrå specialiserad på CRM och digital transformation.",
    applications: ["Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Tillverkningsindustrin", "Energi & Utilities", "Offentlig sektor"],
  },
  {
    slug: "sopra-steria",
    name: "Sopra Steria",
    logo_url: "https://www.soprasteria.com/~/media/soprasteria/soprasteria-logo.svg",
    website: "https://www.soprasteria.se/losningar/microsoft",
    description: "Sopra Steria är en europeisk teknologikonsult med stark närvaro i Norden och omfattande Dynamics 365-kompetens.",
    applications: ["Finance & SCM", "Sales", "Customer Insights (Marketing)", "Customer Service", "Contact Center", "Field Service", "Project Operations"],
    industries: ["Offentlig sektor", "Bank & Försäkring", "Energi & Utilities"],
  },
];

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    // Validate JWT token
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      console.error("JWT secret not available");
      return new Response(
        JSON.stringify({ error: "Serverfel: Autentisering ej konfigurerad" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const verification = await verifyJWT(token || "", JWT_SECRET);
    if (!verification.valid) {
      console.log(`Invalid token: ${verification.error}`);
      return new Response(
        JSON.stringify({ error: verification.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check existing partners to avoid duplicates
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
