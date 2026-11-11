import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { bmiScore, bmiValidate, type BmiInput } from "../_shared/bmi.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Endast POST stöds." }, 405);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Ogiltig JSON." }, 400); }
  const err = bmiValidate(body);
  if (err) return json({ error: err }, 400);

  const input = body as BmiInput;
  const result = bmiScore(input);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await supabase.from("bmi_submissions").insert({
    version: 2,
    b0: input.b0,
    b5: input.b5,
    phase: result.phase,
    b1: input.b1 ?? null,
    b2: input.b2 ?? null,
    b3: input.b3 ?? null,
    b4: input.b4 ?? [],
    answers: input.answers,
    section_scores: Object.fromEntries(result.sections.map((s) => [s.id, s.score])),
    total: result.total,
    level: result.level,
  }).select("id").single();
  if (error) {
    console.error("bmi-score insert failed", error);
    return json({ error: "Resultatet kunde inte sparas. Försök igen." }, 500);
  }
  return json({ submission_id: data.id, ...result });
});
