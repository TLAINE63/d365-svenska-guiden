import { findTool, toolSummary } from "@/lib/toolUnderlag";
import { readInquiryPartners } from "@/lib/inquirySelection";
import { useEffect, useState } from "react";
import { trackLeadStep } from "@/lib/leadSteps";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { formContextBody } from "@/lib/sessionPages";
import { CheckCircle2 } from "lucide-react";

export const FORFRAGAN_PRODUKTER = ["Business Central", "Finance & Supply Chain", "Sales", "Customer Service", "Field Service", "Customer Insights (Marketing)", "Contact Center", "Project Operations", "Commerce", "Human Resources", "Annat", "Vet inte ännu"];
const STORLEK = ["1-24", "25-99", "100-249", "250-999", "1000+"];
const TID = ["Inom 3 mån", "3-6 mån", "6-12 mån", "Senare", "Oklart"];
const PRODUKT_SLUG: Record<string, string> = {
  "business-central": "Business Central", "finance-supply-chain": "Finance & Supply Chain", "finance": "Finance & Supply Chain",
  "supply-chain": "Finance & Supply Chain", "sales": "Sales", "customer-service": "Customer Service", "field-service": "Field Service",
  "customer-insights": "Customer Insights (Marketing)", "marketing": "Customer Insights (Marketing)", "contact-center": "Contact Center", "project-operations": "Project Operations", "commerce": "Commerce", "human-resources": "Human Resources",
};

/** Tolkar ?produkt=, ?bransch=, ?partner= och ?kalla=; okända värden ignoreras. */
export function parseForfraganParams(sp: URLSearchParams) {
  const p = (sp.get("produkt") || "").trim();
  const produkt = PRODUKT_SLUG[p.toLowerCase()] || FORFRAGAN_PRODUKTER.find((x) => x.toLowerCase() === p.toLowerCase()) || "";
  const b = (sp.get("bransch") || "").trim().toLowerCase();
  const ind = STANDARD_INDUSTRIES.find((i) => i.slug === b || i.name.toLowerCase() === b);
  const partners = sp.getAll("partner").flatMap((v) => v.split(",")).map((s) => s.trim().toLowerCase())
    .filter((s) => /^[a-z0-9-]{1,80}$/.test(s)).filter((s, i, a) => a.indexOf(s) === i).slice(0, 3);
  const kalla = (sp.get("kalla") || "").trim();
  return { produkt, bransch: ind?.name || "", partners, kalla: /^\/[^\s]{0,299}$/.test(kalla) ? kalla : "" };
}

const selectCls = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const Forfragan = () => {
  const [sp] = useSearchParams();
  const [f, setF] = useState({ produkt: "", bransch: "", antal_anstallda: "", tidplan: "", beskrivning: "", namn: "", roll: "", email: "", samtycke: false, honeypot: "" });
  const [pre, setPre] = useState<ReturnType<typeof parseForfraganParams>>({ produkt: "", bransch: "", partners: [], kalla: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const p = parseForfraganParams(sp);
    setPre({ ...p, partners: p.partners.length ? p.partners : readInquiryPartners() });
    const u = (sp.get("underlag") || "").trim();
    const t = /^[a-z0-9_-]{1,40}$/.test(u) ? findTool(u) : undefined;
    setF((s) => ({ ...s, produkt: s.produkt || p.produkt, bransch: s.bransch || p.bransch, beskrivning: s.beskrivning || (t ? toolSummary(t) : "") }));
  }, [sp]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    { trackLeadStep("forfragan_paborjad", "forfragan", { once: true }); setF((s) => ({ ...s, [k]: e.target.value })); }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!f.produkt || !f.antal_anstallda || !f.tidplan || !f.beskrivning.trim() || !f.namn.trim()) return setErr("Fyll i alla obligatoriska fält.");
    const ve = validateBusinessEmail(f.email);
    if (ve) return setErr(ve);
    if (!f.samtycke) return setErr("Du behöver godkänna hur vi hanterar uppgifterna.");
    setBusy(true);
    const { error } = await supabase.functions.invoke("submit-forfragan", {
      body: { ...formContextBody(), ...f, partner_slugs: pre.partners, prefill: { produkt: pre.produkt, bransch: pre.bransch, kalla: pre.kalla } },
    });
    setBusy(false);
    if (error) return setErr("Förfrågan kunde inte skickas. Försök igen om en stund.");
    setDone(true);
    trackLeadStep("forfragan_skickad", pre.kalla ? "forfragan_" + pre.kalla.replace(/[^a-z0-9_-]/gi, "").slice(0, 20) : "forfragan");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Få svar från upp till tre partners utan att lämna ut företagsnamnet | d365.se"
        description="Beskriv läget i fem frågor. d365.se läser förfrågan, väljer ut Dynamics 365-partners som passar och ingen partner får uppgifterna förrän du har sagt ja."
        canonicalPath="/forfragan"
      />
      <Navbar />
      <main className="container mx-auto max-w-2xl px-4 pt-28 lg:pt-36 pb-16">
        {done ? (
          <section className="rounded-lg border bg-card p-6 sm:p-8">
            <CheckCircle2 className="h-8 w-8 text-accent mb-3" aria-hidden />
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">Tack, förfrågan är mottagen</h1>
            <p className="text-muted-foreground mb-4">Så här går det till härnäst:</p>
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>Vi på d365.se läser förfrågan och återkommer till dig inom två arbetsdagar.</li>
              <li>Vi föreslår upp till tre partners som passar ert läge och berättar varför.</li>
              <li>Ingen partner får dina uppgifter förrän du har sagt ja till just den partnern.</li>
            </ol>
            <Button asChild variant="outline"><Link to="/">Till startsidan</Link></Button>
          </section>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">Få svar från upp till tre partners utan att lämna ut företagsnamnet</h1>
            <p className="text-lg text-muted-foreground mb-8">Beskriv läget i fem frågor. Vi på d365.se läser förfrågan, väljer ut partners som passar och återkommer till dig. Ingen partner får dina uppgifter förrän du har sagt ja.</p>
            {pre.partners.length > 0 && (
              <p className="mb-6 rounded-md border bg-muted/40 p-3 text-sm">Partners i din förfrågan: {pre.partners.join(", ")}</p>
            )}
            <form onSubmit={submit} className="space-y-5 rounded-lg border bg-card p-5 sm:p-7" noValidate>
              <div className="space-y-2"><Label htmlFor="ff-produkt">1. Vad gäller det? *</Label>
                <select id="ff-produkt" className={selectCls} value={f.produkt} onChange={set("produkt")} required>
                  <option value="">Välj</option>{FORFRAGAN_PRODUKTER.map((p) => <option key={p}>{p}</option>)}
                </select></div>
              <div className="space-y-2"><Label htmlFor="ff-bransch">2. Bransch</Label>
                <select id="ff-bransch" className={selectCls} value={f.bransch} onChange={set("bransch")}>
                  <option value="">Välj</option>{STANDARD_INDUSTRIES.map((i) => <option key={i.slug}>{i.name}</option>)}
                </select></div>
              <div className="space-y-2"><Label htmlFor="ff-storlek">3. Antal anställda *</Label>
                <select id="ff-storlek" className={selectCls} value={f.antal_anstallda} onChange={set("antal_anstallda")} required>
                  <option value="">Välj</option>{STORLEK.map((p) => <option key={p}>{p}</option>)}
                </select></div>
              <div className="space-y-2"><Label htmlFor="ff-tid">4. När ska ni vara igång? *</Label>
                <select id="ff-tid" className={selectCls} value={f.tidplan} onChange={set("tidplan")} required>
                  <option value="">Välj</option>{TID.map((p) => <option key={p}>{p}</option>)}
                </select></div>
              <div className="space-y-2"><Label htmlFor="ff-besk">5. Beskriv kort vad ni vill lösa *</Label>
                <Textarea id="ff-besk" rows={5} maxLength={1000} value={f.beskrivning} onChange={set("beskrivning")} required />
                <p className="text-xs text-muted-foreground text-right">{f.beskrivning.length}/1000</p></div>
              <fieldset className="space-y-3"><legend className="text-sm font-medium mb-1">6. Dina kontaktuppgifter</legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label htmlFor="ff-namn">Namn *</Label><Input id="ff-namn" maxLength={100} value={f.namn} onChange={set("namn")} autoComplete="name" /></div>
                  <div className="space-y-1"><Label htmlFor="ff-roll">Roll</Label><Input id="ff-roll" maxLength={100} value={f.roll} onChange={set("roll")} autoComplete="organization-title" /></div>
                </div>
                <div className="space-y-1"><Label htmlFor="ff-email">E-post (jobbadress) *</Label><Input id="ff-email" type="email" maxLength={255} value={f.email} onChange={set("email")} autoComplete="email" /></div>
              </fieldset>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={f.honeypot} onChange={set("honeypot")} aria-hidden />
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 h-4 w-4" checked={f.samtycke} onChange={(e) => setF((s) => ({ ...s, samtycke: e.target.checked }))} />
                <span>7. Jag godkänner att d365.se (Dynamic Factory) sparar uppgifterna för att besvara förfrågan, enligt <Link to="/dataskydd/" className="underline">integritetspolicyn</Link>. Inget delas med partners utan mitt ja. *</span>
              </label>
              {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
              <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">{busy ? "Skickar..." : "Skicka förfrågan"}</Button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Forfragan;
