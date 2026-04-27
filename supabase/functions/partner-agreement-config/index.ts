// Public read-only fetch of the partner agreement page config.
// Hidden URL /partner-avtal calls this. site_settings is blocked for anon,
// so we expose only this single key via service role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

const DEFAULT_CONFIG = {
  heading: "Partneravtal – d365.se",
  intro:
    "Sammanfattning av villkor för partnersamarbete med d365.se. Fullständigt avtal kan laddas ner som PDF nedan.",
  pdfUrl: "",
  pdfLabel: "Gällande partneravtal (PDF)",
  sections: [],
};

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let config: any = DEFAULT_CONFIG;
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "partner_agreement_page_config")
      .maybeSingle();

    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        config = { ...DEFAULT_CONFIG, ...parsed };
      } catch {
        // fall back to default
      }
    }

    return new Response(JSON.stringify({ config }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("partner-agreement-config error", e);
    return new Response(JSON.stringify({ config: DEFAULT_CONFIG }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
