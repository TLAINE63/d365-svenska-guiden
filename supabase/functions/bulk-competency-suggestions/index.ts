import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RUN_KEY = "d365-competency-bulk-2026-08-21";

const AREAS: { key: string; label: string; description: string }[] = [
  {
    key: "power_platform",
    label: "Power Platform",
    description:
      "Appar, automation, Dataverse, rapportering och processutveckling som del av Dynamics 365-lösningen.",
  },
  {
    key: "copilot_ai",
    label: "Copilot & AI",
    description:
      "Microsofts inbyggda Copilot- och AI-funktioner i Dynamics 365 och hur de kopplas till verksamhetsprocesser.",
  },
  {
    key: "copilot_studio_agents",
    label: "Copilot Studio & agenter",
    description:
      "Egna agenter, lösningar i Copilot Studio och processautomation med AI-agenter kopplade till Dynamics 365.",
  },
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
      "id, name, description, extended_content, source_document_text, extended_competency_input, applications",
    )
    .eq("is_featured", true);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const results: Record<string, string> = {};

  for (const p of partners || []) {
    const input = (p.extended_competency_input || {}) as Record<string, string>;
    const missing = AREAS.filter((a) => !(input[a.key] || "").trim());
    if (missing.length === 0) {
      results[p.name] = "skipped (has own text)";
      continue;
    }
    const context = [
      p.description || "",
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

Skriv ett förslag på kompetensunderlag för följande områden:
${missing.map((a) => `- ${a.label}: ${a.description}`).join("\n")}

Regler:
- Skriv på svenska, sakligt och neutralt, i tredje person.
- 400–700 tecken per område.
- Beskriv endast sådant som har stöd i underlaget: erbjudanden, kundprojekt, certifieringar, teamstorlek, konkreta leveranser.
- Om underlaget är svagt för ett område: skriv kort vad som framgår och undvik att påstå leveranser som inte nämns.
- Inga superlativ, inga marknadsföringsfraser, ingen punktlista.

Svara med JSON: {${missing.map((a) => `"${a.key}": "text"`).join(", ")}}`;

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
    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(json.choices?.[0]?.message?.content || "{}");
    } catch {
      results[p.name] = "parse error";
      continue;
    }

    const next = { ...input };
    let count = 0;
    for (const a of missing) {
      const text = (parsed[a.key] || "").trim();
      if (text.length > 50) {
        next[`suggestion_${a.key}`] = text;
        count++;
      }
    }
    if (count === 0) {
      results[p.name] = "no usable suggestions";
      continue;
    }
    const { error: upErr } = await supabase
      .from("partners")
      .update({ extended_competency_input: next })
      .eq("id", p.id);
    results[p.name] = upErr ? `db error: ${upErr.message}` : `${count} suggestions saved`;
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});
