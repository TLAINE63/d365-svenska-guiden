import { brandEmail } from "../_shared/email-branding.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { formContextFields } from "../_shared/formContext.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";

const PRODUKTER = ["Business Central", "Finance & Supply Chain", "Sales", "Customer Service", "Field Service", "Annat", "Vet inte ännu"];
const STORLEK = ["1-24", "25-99", "100-249", "250-999", "1000+"];
const TID = ["Inom 3 mån", "3-6 mån", "6-12 mån", "Senare", "Oklart"];

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  const ok = o.startsWith("http://localhost:") || o === "https://d365.se" || o === "https://www.d365.se" || o.endsWith(".lovable.app") || o.endsWith(".lovableproject.com");
  return { "Access-Control-Allow-Origin": ok ? o : "https://d365.se", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]!));
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const hits = new Map<string, { n: number; t: number }>();

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: h });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "x";
  const now = Date.now(); const r = hits.get(ip);
  if (r && now < r.t && r.n >= 5) return new Response(JSON.stringify({ error: "För många försök" }), { status: 429, headers: h });
  hits.set(ip, r && now < r.t ? { n: r.n + 1, t: r.t } : { n: 1, t: now + 60000 });
  try {
    const b = await req.json();
    if (b.honeypot) return new Response(JSON.stringify({ success: true }), { headers: h });
    const produkt = str(b.produkt, 60), storlek = str(b.antal_anstallda, 20), tid = str(b.tidplan, 20);
    const beskrivning = str(b.beskrivning, 1000), namn = str(b.namn, 100), roll = str(b.roll, 100);
    const email = str(b.email, 255).toLowerCase(), bransch = str(b.bransch, 100);
    const errs: string[] = [];
    if (!PRODUKTER.includes(produkt)) errs.push("produkt");
    if (!STORLEK.includes(storlek)) errs.push("antal_anstallda");
    if (!TID.includes(tid)) errs.push("tidplan");
    if (beskrivning.length < 1) errs.push("beskrivning");
    if (!namn) errs.push("namn");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push("email");
    else if (isFreeEmailDomain(email)) errs.push(FREE_EMAIL_ERROR_SV);
    if (b.samtycke !== true) errs.push("samtycke");
    if (errs.length) return new Response(JSON.stringify({ error: "Validation failed", details: errs }), { status: 400, headers: h });
    const slugs = (Array.isArray(b.partner_slugs) ? b.partner_slugs : []).filter((s: unknown) => typeof s === "string" && /^[a-z0-9-]{1,80}$/.test(s)).slice(0, 3);
    const p = b.prefill && typeof b.prefill === "object" ? b.prefill : {};
    const prefill = { produkt: str(p.produkt, 60), bransch: str(p.bransch, 100), partner: slugs, kalla: str(p.kalla, 300) };
    const ctx = formContextFields(b);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await sb.from("forfragningar").insert({
      produkt, bransch: bransch || null, antal_anstallda: storlek, tidplan: tid, beskrivning, namn, roll: roll || null, email,
      samtycke: true, prefill, partner_slugs: slugs, kalla: prefill.kalla || null,
      source_page: ctx.source_page, landing_page: ctx.landing_page, session_pages: ctx.session_pages,
    }).select("id").single();
    if (error) { console.error("insert failed", error.message); throw new Error("store"); }
    const rows: [string, string][] = [["Gäller", produkt], ["Bransch", bransch || "-"], ["Anställda", storlek], ["Igång", tid], ["Namn", namn], ["Roll", roll || "-"], ["E-post", email], ["Partners", slugs.join(", ") || "-"], ["Kom från", prefill.kalla || ctx.source_page || "-"]];
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}` },
        body: JSON.stringify(brandEmail({
          from: "D365 Guiden <info@d365.se>", to: ["thomas.laine@dynamicfactory.se"], reply_to: email,
          subject: `[Anonym förfrågan] ${produkt} - ${namn}`,
          html: `<h2>Ny anonym förfrågan</h2><table>${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;font-weight:bold">${k}</td><td>${esc(v)}</td></tr>`).join("")}</table><p style="white-space:pre-wrap;background:#f6f7f9;padding:12px">${esc(beskrivning)}</p><p style="color:#666;font-size:12px">Id ${data.id}. Inga uppgifter delas med partners förrän köparen har sagt ja.</p>`,
        })),
      });
      if (!res.ok) console.error("notify failed", res.status);
    } catch { console.error("notify failed"); }
    return new Response(JSON.stringify({ success: true }), { headers: h });
  } catch {
    return new Response(JSON.stringify({ error: "Något gick fel" }), { status: 500, headers: h });
  }
});
