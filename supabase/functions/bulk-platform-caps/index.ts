import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RUN_KEY = "d365-platformcaps-bulk-2026-08-21";

const ALLOWED = [
  "Azure",
  "Fabric",
  "Power BI",
  "Microsoft 365",
  "Copilot",
  "Agents",
  "Security",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (req.headers.get("x-run-key") !== RUN_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const apiKey = Deno.env.get("LOVABLE_API_KEY")!;

  const { data: partners, error } = await supabase
    .from("partners")
    .select(
      "id, name, description, extended_content, source_document_text, platform_capabilities, extended_competency_input",
    )
    .eq("is_featured", true);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const results: Record<string, unknown> = {};

  for (const p of partners || []) {
    if (Array.isArray(p.platform_capabilities) && p.platform_capabilities.length > 0) {
      results[p.name] = "skipped (already set)";
      continue;
    }
    const input = (p.extended_competency_input || {}) as Record<string, string>;
    const context = [
      p.description || "",
      Object.values(input).join("\n").slice(0, 3000),
      (p.extended_content || "").slice(0, 6000),
      (p.source_document_text || "").slice(0, 14000),
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");
    if (context.trim().length < 200) {
      results[p.name] = "skipped (no source material)";
      continue;
    }

    const prompt = `Partner: ${p.name}

Underlag om partnern:
${context}

Vilka av följande Microsoft-plattformskompetenser har partnern tydligt stöd för i underlaget?
${ALLOWED.join(", ")}

Regler:
- Ta bara med de som har konkret stöd i underlaget (erbjudanden, tjänster, kundprojekt, certifieringar, partnerstatus).
- Gissa inte. Om inget stöd finns, returnera en tom lista.
- Använd exakt de angivna namnen.

Svara med JSON: {"capabilities": ["..."], "motivation": "kort motivering på svenska"}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      results[p.name] = `AI error ${res.status}`;
      if (res.status === 429 || res.status === 402) break;
      continue;
    }
    const json = await res.json();
    let caps: string[] = [];
    let motivation = "";
    try {
      const parsed = JSON.parse(json.choices?.[0]?.message?.content || "{}");
      caps = Array.isArray(parsed.capabilities)
        ? parsed.capabilities.filter((c: unknown) => typeof c === "string" && ALLOWED.includes(c))
        : [];
      motivation = typeof parsed.motivation === "string" ? parsed.motivation : "";
    } catch {
      results[p.name] = "parse error";
      continue;
    }
    if (caps.length === 0) {
      results[p.name] = "no capabilities found";
      continue;
    }
    const { error: upErr } = await supabase
      .from("partners")
      .update({ platform_capabilities: caps })
      .eq("id", p.id);
    results[p.name] = upErr ? `db error: ${upErr.message}` : { caps, motivation };
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
