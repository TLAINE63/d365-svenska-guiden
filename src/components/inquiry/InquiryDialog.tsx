import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getBuyerProfile, hasAnyAnswer } from "@/lib/buyerProfile";
import { useShortlist } from "@/contexts/ShortlistContext";
import { getTrackSession, getTrackSource, track } from "@/lib/track";
import type { InquiryPartner, InquiryType } from "@/contexts/InquiryContext";

const ROLES = ["VD", "CFO eller ekonomichef", "IT-ansvarig", "Försäljnings- eller servicechef", "Verksamhetschef", "Annan"];
const PRODUCTS = ["Business Central", "Finance & Supply Chain Management (F&O)", "Sales", "Customer Service", "Field Service", "Contact Center", "Customer Insights", "Project Operations", "Human Resources", "Commerce", "Vet inte än"];
const HELP = ["Nytt system", "Byte från befintligt system", "Vidareutveckling eller ny partner för befintlig lösning", "Support och förvaltning", "Vet inte än"];
const TIMES = ["Vi utvärderar nu", "Inom 6 månader", "Inom 12 månader", "Senare", "Vi undersöker bara"];

const sel = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

function guessProduct(p?: string | null): string {
  const v = (p || "").toLowerCase();
  if (!v) return "";
  if (v.includes("business central")) return "Business Central";
  if (/finance|supply/.test(v)) return "Finance & Supply Chain Management (F&O)";
  return PRODUCTS.find((x) => v.includes(x.toLowerCase())) || "";
}

function summarize(): { items: string[]; data: Record<string, unknown> } {
  const p = getBuyerProfile();
  if (!hasAnyAnswer(p)) return { items: [], data: {} };
  const data: Record<string, unknown> = {};
  const items: string[] = [];
  for (const [section, answers] of Object.entries(p)) {
    for (const [k, v] of Object.entries(answers)) {
      if (v === "" || v === null || (Array.isArray(v) && !v.length)) continue;
      data[`${section}.${k}`] = v;
      if (items.length < 6 && typeof v !== "boolean") items.push(Array.isArray(v) ? v.join(", ") : String(v));
    }
  }
  return { items, data };
}

interface Props { partners: InquiryPartner[]; type: InquiryType; productArea?: string | null; onClose: () => void }

export default function InquiryDialog({ partners, type, productArea, onClose }: Props) {
  const navigate = useNavigate();
  const shortlist = useShortlist();
  const project = useMemo(summarize, []);
  const [consent, setConsent] = useState<Record<string, boolean>>({});
  const [f, setF] = useState({ company: "", name: "", email: "", phone: "", role: "", product: guessProduct(productArea), help: "", time: "", message: "" });
  const [includeProject, setIncludeProject] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const title = partners.length === 1 ? `Be om kontakt med ${partners[0].name}` : "Kontakta valda partners";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const approved = partners.filter((p) => consent[p.slug]);
    if (!approved.length) return setError("Välj minst en partner som ska få er förfrågan.");
    if (!f.company.trim() || !f.name.trim() || !f.email.trim()) return setError("Fyll i företag, namn och e-post.");
    if (!privacy) return setError("Bekräfta att ni läst informationen om hur uppgifterna hanteras.");
    setSending(true);
    try {
      const src = getTrackSource();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({
          inquiry_type: type, contact_name: f.name, email: f.email, company: f.company,
          role: f.role || null, phone: f.phone || null, product_area: f.product || null, timeframe: f.time || null,
          help_with: f.help || null, message: f.message || null,
          project: { ...project.data, kortlista: shortlist.items.map((i) => i.slug) },
          include_project: includeProject, privacy_ack: true,
          partners: partners.map((p) => ({ slug: p.slug, consent: !!consent[p.slug] })),
          ...src, session_id: getTrackSession(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) { setError(data.error || "Något gick fel. Försök igen."); setSending(false); return; }
      track("inquiry_submit", { partner_count: approved.length, product_area: f.product || null });
      onClose();
      navigate(`/forfragan/tack/?${new URLSearchParams({ p: (data.partners || approved.map((p) => p.name)).join(", "), e: f.email })}`);
    } catch {
      setError("Något gick fel. Försök igen.");
      setSending(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Ni väljer vilka partners som får era uppgifter. En partner får dem bara om ni godkänner det nedan, och kontaktar er sedan direkt. d365.se får en kopia för att kunna följa upp att ni fått svar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5" noValidate>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold mb-1">Ni kan välja upp till tre partners.</legend>
            {partners.map((p) => (
              <label key={p.slug} className="flex items-start gap-3 rounded-md border border-border p-3 text-sm cursor-pointer">
                <Checkbox checked={!!consent[p.slug]} onCheckedChange={(v) => setConsent((s) => ({ ...s, [p.slug]: v === true }))} className="mt-0.5" />
                <span>Jag godkänner att mina kontaktuppgifter och mitt projektunderlag skickas till {p.name}.</span>
              </label>
            ))}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="iq-company">Företag *</Label><Input id="iq-company" value={f.company} onChange={set("company")} maxLength={200} required /></div>
            <div><Label htmlFor="iq-name">Namn *</Label><Input id="iq-name" value={f.name} onChange={set("name")} maxLength={120} required /></div>
            <div><Label htmlFor="iq-email">E-post *</Label><Input id="iq-email" type="email" value={f.email} onChange={set("email")} maxLength={255} required /></div>
            <div><Label htmlFor="iq-phone">Telefon</Label><Input id="iq-phone" value={f.phone} onChange={set("phone")} maxLength={40} /></div>
            <div><Label htmlFor="iq-role">Roll</Label><select id="iq-role" className={sel} value={f.role} onChange={set("role")}><option value="">Välj</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div><Label htmlFor="iq-product">Produktområde</Label><select id="iq-product" className={sel} value={f.product} onChange={set("product")}><option value="">Välj</option>{PRODUCTS.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div><Label htmlFor="iq-help">Vad gäller det?</Label><select id="iq-help" className={sel} value={f.help} onChange={set("help")}><option value="">Välj</option>{HELP.map((r) => <option key={r}>{r}</option>)}</select></div>
            <div><Label htmlFor="iq-time">Tidshorisont</Label><select id="iq-time" className={sel} value={f.time} onChange={set("time")}><option value="">Välj</option>{TIMES.map((r) => <option key={r}>{r}</option>)}</select></div>
          </div>
          <div><Label htmlFor="iq-msg">Meddelande</Label><Textarea id="iq-msg" value={f.message} onChange={set("message")} maxLength={3000} rows={4} /></div>

          {project.items.length > 0 && (
            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm space-y-2">
              <p className="font-semibold">Projektunderlag</p>
              <p className="text-muted-foreground">{project.items.join(" · ")}</p>
              <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={includeProject} onCheckedChange={(v) => setIncludeProject(v === true)} />Bifoga mitt projektunderlag</label>
            </div>
          )}

          <p className="text-xs text-muted-foreground">Dynamic Factory, som ger ut d365.se, är personuppgiftsansvarig. Vi använder uppgifterna för att förmedla er förfrågan och för att höra av oss och fråga om ni fått svar. Läs mer i <Link to="/dataskydd/" className="underline" target="_blank">dataskyddspolicyn</Link>.</p>
          <label className="flex items-start gap-2 text-sm cursor-pointer"><Checkbox checked={privacy} onCheckedChange={(v) => setPrivacy(v === true)} className="mt-0.5" />Jag har läst informationen om hur mina uppgifter hanteras.</label>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={sending} className="w-full min-h-12 font-semibold">{sending ? "Skickar…" : "Skicka förfrågan"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
