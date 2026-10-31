import { useEffect, useMemo, useState } from "react";
import { cleanSelection } from "@/lib/helpRequests";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useShortlist } from "@/contexts/ShortlistContext";
import { useBuyerContext, sizeLabel } from "@/lib/buyerContext";
import { recordPlanContact, usePlanMeta, planProductLabel } from "@/lib/d365Plan";
import { validateBusinessEmail } from "@/lib/validateBusinessEmail";
import { getTrackSession, getTrackSource } from "@/lib/track";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { trackAdsContactConversion } from "@/utils/googleAdsConversion";
import { ADVISOR_BOOKING_URL } from "@/data/organization";

export type PlanContactMode = "advisory" | "partners";

const FOCUS = ["Nästa steg i utvärderingen", "Vilken lösning som passar", "Partneralternativ", "Kostnader och budget", "AI och Copilot", "Något annat"];

const schema = z.object({
  name: z.string().trim().min(1, "Fyll i namn.").max(120),
  company: z.string().trim().min(1, "Fyll i företag.").max(200),
  email: z.string().trim().email("Ange en giltig e-postadress.").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(3000).optional(),
});

interface Section { key: string; label: string; lines: string[] }

/** Sammanställer de delar av planen som kan delas. Inga tekniska fält eller mätdata. */
function usePlanSections(): Section[] {
  const meta = usePlanMeta();
  const buyer = useBuyerContext();
  return useMemo(() => {
    const sol = meta.solution;
    const out: Section[] = [];
    const org = [buyer.industry && `Bransch: ${buyer.industry}`, buyer.size && `Storlek: ${sizeLabel(buyer.size)}`].filter(Boolean) as string[];
    if (sol) out.push({ key: "situation", label: "Situation", lines: [sol.existingCustomer ? "Befintlig Dynamics 365-kund som vill utveckla lösningen" : `Utforskar ${sol.areaLabel}`] });
    const product = planProductLabel(buyer, meta);
    const solLines = [product && `Produkt: ${product}`, ...(sol?.complements || []).map((c) => `Komplettering: ${c.label}`)].filter(Boolean) as string[];
    if (solLines.length) out.push({ key: "losning", label: "Lösningsområde och produkt", lines: solLines });
    if (meta.needs.length) out.push({ key: "behov", label: "Identifierade behov", lines: meta.needs.slice(0, 12) });
    if (org.length) out.push({ key: "organisation", label: "Organisation", lines: org });
    if (sol?.aiSummary) out.push({ key: "ai", label: "AI och automation", lines: [sol.aiSummary] });
    if (sol?.implementationNote) out.push({ key: "inforande", label: "Införande", lines: [sol.implementationNote] });
    const done = [...(meta.completedSteps || []).map((c) => (c === "behovsguide" ? "Behovsguiden" : c)), ...(meta.calculations || []).map((c) => `Kalkyl: ${c.product}`)];
    if (done.length) out.push({ key: "genomfort", label: "Genomförda analyser", lines: done });
    return out;
  }, [meta, buyer]);
}

export type AdvisoryPlacement = "compare" | "partner_switch" | "needs_guide" | "tool_result" | "second_opinion" | "home" | "partner_search" | "expert_requirement" | "existing_dynamics" | "partner_relationship_review" | "solution_assessment" | "solution_advice" | "cost_help" | "next_step_help" | "isv_product_help" | "question";
/** Var rådgivningen bokas. Följer med till bokningen (Advisory Booking) och mätningen, inga personuppgifter. */
export interface AdvisoryOrigin { placement: AdvisoryPlacement; cta: string; pageType: string }
export interface ContactTopic { title: string; description: string; helpWith: string; startEvent: string; submitEvent: string; extra?: Section; extras?: Section[]; metadata?: Record<string, unknown>; advisory?: AdvisoryOrigin; messageLabel?: string; doneTitle?: string; doneNotes?: string[]; showDoneSummary?: boolean; hideFocus?: boolean }
export type { Section as ContactSection };

export default function PlanContactDialog({ mode, onClose, topic }: { mode: PlanContactMode; onClose: () => void; topic?: ContactTopic }) {
  const { items } = useShortlist();
  const planSections = usePlanSections();
  const own = [...(topic?.extra ? [topic.extra] : []), ...(topic?.extras || [])];
  const ownKeys = new Set(own.map((s) => s.key));
  const sections = [...own, ...planSections.filter((s) => !ownKeys.has(s.key))];
  const evType = topic?.advisory ? "advisory" as const : "engagement" as const;
  const advMeta = topic?.advisory ? { placement: topic.advisory.placement, cta: topic.advisory.cta, page_type: topic.advisory.pageType } : {};
  const [excluded, setExcluded] = useState<Record<string, boolean>>({});
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [focus, setFocus] = useState("");
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", message: "" });
  const [approve, setApprove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ partners: string[]; intros: string[] } | null>(null);
  const advisory = mode === "advisory";

  useEffect(() => {
    trackFunnelEvent({ event_type: evType, event_name: topic ? topic.startEvent : advisory ? "advisory_started" : "partner_contact_started", metadata: { shortlist: items.length, ...topic?.metadata, ...advMeta } });
    if (sections.length) trackFunnelEvent({ event_type: "engagement", event_name: "share_preview_viewed", metadata: { mode, sections: sections.length } });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = items.filter((i) => picked[i.slug]);
  const chosenVerified = chosen.filter((i) => i.verified);
  const chosenBasic = chosen.filter((i) => !i.verified);
  const shared = sections.filter((s) => !excluded[s.key]);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const recipients = advisory ? "d365.se" : [
    chosenVerified.length ? chosenVerified.map((p) => p.name).join(", ") : "",
    chosenBasic.length ? `d365.se (introduktion till ${chosenBasic.map((p) => p.name).join(", ")})` : "",
  ].filter(Boolean).join(" och ");

  const togglePartner = (slug: string, v: boolean) => {
    setPicked((s) => ({ ...s, [slug]: v }));
    if (v) trackFunnelEvent({ event_type: "engagement", event_name: "partner_selected_for_contact", metadata: { partner: slug } });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!advisory && !chosen.length) return setError("Välj minst en partner som ska få ert underlag.");
    const parsed = schema.safeParse(f);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    const emailErr = validateBusinessEmail(parsed.data.email);
    if (emailErr) return setError(emailErr);
    if (!approve) return setError("Bekräfta att ni godkänner delningen innan ni skickar.");
    setSending(true);
    try {
      const project: Record<string, unknown> = Object.fromEntries(shared.map((s) => [s.label, s.lines]));
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({
          inquiry_type: advisory ? "fraga" : "kortlista", advisory,
          contact_name: parsed.data.name, email: parsed.data.email, company: parsed.data.company,
          phone: parsed.data.phone || null, message: parsed.data.message || null,
          help_with: topic ? [topic.helpWith, focus].filter(Boolean).join(": ") : advisory ? focus || null : "Partnerdialog från Min D365-plan",
          project, include_project: shared.length > 0, privacy_ack: true,
          partners: advisory ? [] : chosen.map((p) => ({ slug: p.slug, name: p.name, consent: true })),
          advisory_context: advisory && topic?.advisory ? { placement: topic.advisory.placement, cta: topic.advisory.cta, page_type: topic.advisory.pageType, page_path: typeof window !== "undefined" ? window.location.pathname : null, selection: cleanSelection(topic.metadata) } : null,
          ...getTrackSource(), session_id: getTrackSession(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) { setError(data.error || "Något gick fel. Försök igen."); setSending(false); return; }
      trackAdsContactConversion(advisory ? "advisory" : "plan_partner_contact");
      if (advisory) {
        recordPlanContact("advisory");
        trackFunnelEvent({ event_type: evType, event_name: topic ? topic.submitEvent : "advisory_submitted", metadata: { sections: shared.length, ...topic?.metadata, ...advMeta } });
      }
      // Grundprofiler finns inte alltid med namn i backend; visa kortlistans namn i stället för slug.
      const nameOf = (s: string) => chosen.find((p) => p.slug === s || p.name === s)?.name || s;
      const sent: string[] = (data.partners || []).map(nameOf);
      const intros: string[] = (data.intros || []).map(nameOf);
      if (!advisory) {
        if (sent.length) recordPlanContact("partner", sent);
        if (intros.length) recordPlanContact("intro", intros);
        if (sent.length) trackFunnelEvent({ event_type: "engagement", event_name: "partner_request_submitted", metadata: { count: sent.length, sections: shared.length } });
        if (intros.length) trackFunnelEvent({ event_type: "engagement", event_name: "basic_profile_intro_requested", metadata: { count: intros.length } });
      }
      setDone({ partners: sent, intros });
    } catch {
      setError("Något gick fel. Försök igen.");
    }
    setSending(false);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        {done ? (
          <div className="space-y-4 py-2">
            <DialogHeader>
              <DialogTitle>{topic?.doneTitle || (advisory ? "Ert underlag är skickat till d365.se" : "Er förfrågan är skickad")}</DialogTitle>
              <DialogDescription>Ni får en bekräftelse på e-post.</DialogDescription>
            </DialogHeader>
            {topic?.showDoneSummary && shared.length > 0 && <section className="rounded-md border border-border bg-muted/40 p-3 text-sm">
              <p className="font-semibold">Registrerat behov</p>
              <ul className="mt-2 space-y-1">{shared.map((s) => <li key={s.key}><span className="font-medium">{s.label}:</span> <span className="text-muted-foreground">{s.lines.join(" · ")}</span></li>)}</ul>
            </section>}
            {topic?.doneNotes?.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{topic.doneNotes.map((n) => <li key={n}>{n}</li>)}</ul> : advisory ? <p className="text-sm">d365.se går igenom ert underlag och hör av sig. Inget har skickats till någon partner.</p> : <ul className="space-y-1 text-sm">
              {done.partners.length > 0 && <li>Förfrågan skickad till: <strong>{done.partners.join(", ")}</strong>. Partnern kontaktar er direkt.</li>}
              {done.intros.length > 0 && <li>Introduktion begärd via d365.se för: <strong>{done.intros.join(", ")}</strong>. Era uppgifter har inte skickats till dem.</li>}
            </ul>}
            {advisory && topic?.advisory?.placement !== "question" && <p className="rounded-md border border-border bg-muted/40 p-3 text-sm">Vill ni hellre ses direkt? <a href={ADVISOR_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4" onClick={() => trackFunnelEvent({ event_type: evType, event_name: "advisory_meeting_link_clicked", metadata: { ...advMeta } })}>Välj en tid i Thomas kalender</a>. Annars hör vi av oss utifrån det ni skickat.</p>}
            <p className="text-sm text-muted-foreground">Det här är en skickad förfrågan, ingen bekräftad dialog. Status syns i Min D365-plan. Inget skickas till andra partners utan ert godkännande.</p>
            <Button onClick={onClose}>{topic ? "Stäng" : "Tillbaka till planen"}</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{topic ? topic.title : advisory ? "Prata med d365.se om ert behov" : "Kontakta mina valda partners"}</DialogTitle>
              <DialogDescription>
                {topic ? topic.description : advisory
                  ? "Resonera med oss om lösning, partner eller kompetens utifrån er situation. Ingen partner kontaktas."
                  : "Välj vilka av era sparade partners som ska få ert underlag. Ni bestämmer själva, och inget skickas till andra partners."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-5" noValidate>
              {!advisory && <fieldset className="space-y-2">
                <legend className="text-sm font-semibold mb-1">Mottagare (inga är förvalda)</legend>
                {items.map((p) => (
                  <label key={p.slug} className="flex items-start gap-3 rounded-md border border-border p-3 text-sm cursor-pointer">
                    <Checkbox checked={!!picked[p.slug]} onCheckedChange={(v) => togglePartner(p.slug, v === true)} className="mt-0.5" />
                    <span><span className="font-medium">{p.name}</span> <span className="text-xs text-muted-foreground">{p.verified ? "Verifierad partner: får förfrågan direkt via d365.se" : "Grundprofil: d365.se tar emot en introduktionsförfrågan först, inga uppgifter skickas till partnern"}</span></span>
                  </label>
                ))}
                {chosenVerified.length > 0 && chosenBasic.length > 0 && <p className="text-xs text-muted-foreground">Kontaktvägarna skiljer sig: verifierade partners får er förfrågan direkt, för grundprofiler begär ni en introduktion via d365.se.</p>}
              </fieldset>}

              {advisory && !topic?.hideFocus && <div>
                <Label htmlFor="pc-focus">Vad vill ni främst ha hjälp med?</Label>
                <select id="pc-focus" className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={focus} onChange={(e) => setFocus(e.target.value)}>
                  <option value="">Välj (valfritt)</option>{FOCUS.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>}

              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="pc-name">Namn *</Label><Input id="pc-name" value={f.name} onChange={set("name")} maxLength={120} /></div>
                <div><Label htmlFor="pc-company">Företag *</Label><Input id="pc-company" value={f.company} onChange={set("company")} maxLength={200} /></div>
                <div><Label htmlFor="pc-email">E-post (företag) *</Label><Input id="pc-email" type="email" value={f.email} onChange={set("email")} maxLength={255} /></div>
                <div><Label htmlFor="pc-phone">Telefon (valfritt)</Label><Input id="pc-phone" value={f.phone} onChange={set("phone")} maxLength={40} /></div>
              </div>
              <div><Label htmlFor="pc-msg">{topic?.messageLabel || "Egen kommentar (valfritt)"}</Label><Textarea id="pc-msg" value={f.message} onChange={set("message")} maxLength={3000} rows={3} /></div>

              <section className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                <p className="font-semibold">Det här underlaget kommer att delas</p>
                {sections.length === 0 ? <p className="mt-1 text-muted-foreground">Planen innehåller inget underlag ännu. Ni kan ändå skicka, med era kontaktuppgifter och kommentar.</p> : <>
                  <p className="mt-1 text-xs text-muted-foreground">Avmarkera delar ni inte vill dela.</p>
                  <ul className="mt-2 space-y-2">
                    {sections.map((s) => <li key={s.key}>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <Checkbox checked={!excluded[s.key]} onCheckedChange={(v) => setExcluded((x) => ({ ...x, [s.key]: v !== true }))} className="mt-0.5" />
                        <span><span className="font-medium">{s.label}:</span> <span className="text-muted-foreground">{s.lines.join(" · ")}</span></span>
                      </label>
                    </li>)}
                  </ul>
                </>}
              </section>

              {advisory && <p className="rounded-md border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">Rådgivningen är kostnadsfri för er och ingen partner behöver delta. d365.se kan ha kommersiella relationer med partners, men eventuell ersättning styr inte vilken lösning eller partner vi bedömer som relevant. Läs mer om <Link to="/agande-och-intressen/" className="underline" target="_blank">ägande och intressen</Link>. Inget delas med någon partner utan ert uttryckliga godkännande.</p>}
              <p className="text-xs text-muted-foreground">Dynamic Factory, som ger ut d365.se, är personuppgiftsansvarig. Läs mer i <Link to="/dataskydd/" className="underline" target="_blank">dataskyddspolicyn</Link>.</p>
              <label className="flex items-start gap-2 text-sm cursor-pointer rounded-md border border-border p-3">
                <Checkbox checked={approve} onCheckedChange={(v) => setApprove(v === true)} className="mt-0.5" />
                <span>Jag godkänner att mina kontaktuppgifter{shared.length ? " och det markerade underlaget" : ""} skickas till {recipients || "de partners jag väljer ovan"}.</span>
              </label>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={sending}>{sending ? "Skickar…" : advisory ? "Skicka till d365.se" : "Skicka förfrågan"}</Button>
                <Button type="button" variant="ghost" onClick={onClose}>Avbryt</Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
