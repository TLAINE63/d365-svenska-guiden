import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

function isAllowedOrigin(origin: string | null): boolean {
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

function corsFor(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/[<>]/g, "").trim().slice(0, max);
}

/**
 * Progressive profiling: adds name / company / phone to a lead that was
 * created moments earlier with only an email address.
 * Only leads younger than 2 hours that still carry the placeholder company
 * name can be enriched, so an id alone cannot be used to rewrite older leads.
 */
Deno.serve(async (req) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const leadId = typeof body?.lead_id === "string" ? body.lead_id.trim() : "";
    if (!UUID_RE.test(leadId)) {
      return new Response(JSON.stringify({ error: "Ogiltigt id" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    if (body?._hp) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const contactName = clean(body?.contact_name, 100);
    const companyName = clean(body?.company_name, 100);
    const phone = clean(body?.phone, 40);
    if (!contactName && !companyName && !phone) {
      return new Response(JSON.stringify({ error: "Inget att spara" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000).toISOString();
    const patch: Record<string, string> = {};
    if (contactName) patch.contact_name = contactName;
    if (companyName) patch.company_name = companyName;
    if (phone) patch.phone = phone;

    const { data, error } = await supabase
      .from("leads")
      .update(patch)
      .eq("id", leadId)
      .gte("created_at", twoHoursAgo)
      .eq("company_name", "Okänt företag")
      .select("id");

    if (error) {
      console.error("enrich-lead update error", error);
      return new Response(JSON.stringify({ error: "Kunde inte spara" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, updated: (data || []).length }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("enrich-lead error", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
