// Skickar besökarens Dynamics 365-underlag: sparar, mejlar besökaren och en kopia till ägaren.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const OWNER_EMAIL = "thomas.laine@dynamicfactory.se";

const Body = z.object({
  buyer_id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).regex(/^[0-9+()\-\s]*$/).optional().or(z.literal("")),
  consent: z.literal(true),
  underlag_text: z.string().min(1).max(20000),
  profile: z.record(z.unknown()).optional(),
  _hp: z.string().max(0).optional().or(z.literal("")),
});

const esc = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const oneLine = (v: string, n = 120) => v.replace(/[\r\n]/g, " ").slice(0, n);

// Intern köpsignal: visas aldrig för besökaren.
function buyingSignal(p: Record<string, any> | undefined): "låg" | "medel" | "hög" {
  if (!p) return "låg";
  let s = 0;
  const proj = p.project || {};
  if (proj.timeline === "0-6") s += 2; else if (proj.timeline === "6-12") s += 1;
  if (p.current_erp?.contract_ends === "lt12") s += 1;
  if ((p.scope?.apps || []).length >= 2) s += 1;
  if (p.assessment?.fscm_level === "relevant") s += 1;
  if (proj.budget) s += 1;
  return s >= 4 ? "hög" : s >= 2 ? "medel" : "låg";
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json({ error: "Ogiltig förfrågan" }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) return json({ error: "Kontrollera uppgifterna i formuläret" }, 400);
  const d = parsed.data;
  if (d._hp) return json({ ok: true });

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const email = d.email.toLowerCase();

  // Skräpskydd: högst 3 skick per e-postadress på 10 minuter.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await sb.from("underlag_submissions").select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", since);
  if ((count ?? 0) >= 3) return json({ error: "Du har skickat flera underlag nyss. Försök igen om en stund." }, 429);

  const signal = buyingSignal(d.profile as Record<string, any> | undefined);
  const { data: row, error } = await sb.from("underlag_submissions").insert({
    buyer_id: d.buyer_id ?? null, name: d.name, company: d.company, email, phone: d.phone || null,
    consent: true, profile: d.profile ?? {}, underlag_text: d.underlag_text, buying_signal: signal,
  }).select("id").single();
  if (error) { console.error(error); return json({ error: "Kunde inte spara underlaget" }, 500); }

  let status = "skipped";
  const key = Deno.env.get("RESEND_API_KEY");
  if (key) {
    const resend = new Resend(key);
    const body = `<pre style="font-family:inherit;white-space:pre-wrap;word-break:break-word">${esc(d.underlag_text)}</pre>`;
    try {
      await resend.emails.send({
        from: "d365.se <info@d365.se>", to: [email],
        subject: "Ert Dynamics 365-underlag från d365.se",
        html: `<p>Hej ${esc(d.name)},</p><p>Här är ert Dynamics 365-underlag. Vi hör av oss om ni vill ha hjälp att ta det vidare.</p>${body}<p>Med vänliga hälsningar,<br>d365.se</p>`,
      });
      await resend.emails.send({
        from: "d365.se <info@d365.se>", to: [OWNER_EMAIL], reply_to: email,
        subject: `Nytt underlag: ${oneLine(d.company)} (${oneLine(d.name, 80)})`,
        html: `<p><strong>Namn:</strong> ${esc(d.name)}<br><strong>Företag:</strong> ${esc(d.company)}<br><strong>E-post:</strong> ${esc(email)}<br><strong>Telefon:</strong> ${esc(d.phone || "–")}<br><strong>Intern köpsignal:</strong> ${esc(signal)}</p>${body}`,
      });
      status = "sent";
    } catch (e) { console.error("email failed", e); status = "failed"; }
  }
  await sb.from("underlag_submissions").update({ email_status: status }).eq("id", row.id);
  return json({ ok: true });
});
