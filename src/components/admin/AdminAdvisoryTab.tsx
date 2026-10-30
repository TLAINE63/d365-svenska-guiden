import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, RefreshCw, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HelpRequestsCard from "@/components/admin/HelpRequestsCard";
import { formatDateYYYYMMDD } from "@/lib/utils";
import {
  BOOKING_STATUSES, CASE_STATUSES, CONSENT_SCOPE_OPTIONS, INTRO_STATUSES, PARTNER_RESPONSES, PLACEMENT_LABEL,
  allowedStatuses, qualificationGaps, sendBlockers,
} from "@/lib/advisory";

type Row = Record<string, any>;
interface Data {
  cases: Row[]; bookings: Row[]; intros: Row[]; links: Row[]; partners: { slug: string; name: string; is_featured: boolean }[];
  summary: { direct_partner_requests: number; advisory_with_introduction: number; advisory_without_introduction: number };
  funnel: Record<string, Record<string, number>>;
}
interface Props { token: string | null; onSessionExpired: () => void }

const label = (list: readonly (readonly [string, string])[], v: string | null | undefined) => list.find(([k]) => k === v)?.[1] ?? v ?? "–";
const Sel = ({ value, onChange, options, id }: { value: string; onChange: (v: string) => void; options: readonly (readonly [string, string])[]; id?: string }) => (
  <select id={id} className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
);
const FUNNEL_COLS: [string, string][] = [
  ["advisory_cta_view", "Visningar"], ["advisory_cta_click", "Klick"], ["advisory_booking_completed", "Bokningar"],
  ["advisory_meeting_held", "Möten"], ["advisory_partner_introduction", "Introduktioner"], ["advisory_intro_dialog", "Dialog"],
  ["advisory_intro_kvalificerad", "Kvalificerade"], ["advisory_intro_vunnen", "Vunna"],
];

export default function AdminAdvisoryTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("alla");

  const call = async (action: string, payload: Record<string, unknown> = {}) => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-advisory`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    if (res.status === 401) { onSessionExpired(); throw new Error("Sessionen har gått ut"); }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Något gick fel");
    return json;
  };
  const load = async () => {
    if (!token) return;
    setLoading(true);
    try { setData(await call("list")); } catch (e: any) { toast({ title: "Fel", description: e.message, variant: "destructive" }); }
    setLoading(false);
  };
  const run = async (action: string, payload: Record<string, unknown>, ok = "Sparat") => {
    setBusy(true);
    try { const r = await call(action, payload); toast({ title: ok }); await load(); return r; }
    catch (e: any) { toast({ title: "Kunde inte spara", description: e.message, variant: "destructive" }); return null; }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [token]);

  const cases = useMemo(() => (data?.cases || []).filter((c) => statusFilter === "alla" || c.status === statusFilter), [data, statusFilter]);
  if (loading && !data) return <div className="flex items-center gap-2 p-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Laddar rådgivning…</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <HelpRequestsCard token={token} onSessionExpired={onSessionExpired} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Rådgivning och partnerintroduktioner</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Interna uppgifter. Visas aldrig publikt. Introduktioner skapas bara här, genom ert eget beslut.</p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Uppdatera</Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded border border-border p-3"><div className="text-muted-foreground">Direkta partnerförfrågningar</div><div className="text-2xl font-semibold tabular-nums">{data.summary.direct_partner_requests}</div></div>
            <div className="rounded border border-border p-3"><div className="text-muted-foreground">Rådgivning utan introduktion</div><div className="text-2xl font-semibold tabular-nums">{data.summary.advisory_without_introduction}</div></div>
            <div className="rounded border border-border p-3"><div className="text-muted-foreground">Rådgivningsledd introduktion</div><div className="text-2xl font-semibold tabular-nums">{data.summary.advisory_with_introduction}</div></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground"><th className="py-1 pr-3 font-medium">Beslutspunkt (180 dagar)</th>{FUNNEL_COLS.map(([, l]) => <th key={l} className="py-1 px-2 font-medium text-right">{l}</th>)}</tr></thead>
              <tbody>
                {Object.keys(data.funnel).length === 0 && <tr><td colSpan={FUNNEL_COLS.length + 1} className="py-2 text-muted-foreground">Inga rådgivningshändelser ännu.</td></tr>}
                {Object.entries(data.funnel).map(([p, m]) => (
                  <tr key={p} className="border-t border-border"><td className="py-1 pr-3">{PLACEMENT_LABEL[p] ?? p}</td>{FUNNEL_COLS.map(([k]) => <td key={k} className="py-1 px-2 text-right tabular-nums">{m[k] || 0}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-56"><Label htmlFor="adv-filter">Ärendestatus</Label><Sel id="adv-filter" value={statusFilter} onChange={setStatusFilter} options={[["alla", "Alla"], ...CASE_STATUSES]} /></div>
        <Button variant="outline" disabled={busy} onClick={async () => { const r = await run("create_case", { status: "ny" }, "Ärende skapat"); if (r?.id) setOpen(r.id); }}><Plus className="h-4 w-4" /> Nytt ärende</Button>
        <p className="text-xs text-muted-foreground">Varje bokning får ett eget ärende. Ärenden slås aldrig ihop automatiskt, koppla relaterade ärenden manuellt.</p>
      </div>

      {cases.length === 0 && <p className="text-sm text-muted-foreground">Inga ärenden.</p>}
      <div className="space-y-3">
        {cases.map((c) => {
          const bookings = data.bookings.filter((b) => b.advisory_case_id === c.id);
          const intros = data.intros.filter((i) => i.case_id === c.id);
          const isOpen = open === c.id;
          return (
            <Card key={c.id}>
              <button type="button" className="flex w-full items-center gap-3 p-4 text-left" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{c.company || "Okänt företag"} <span className="font-normal text-muted-foreground">· {c.contact_name || "–"}</span></div>
                  <div className="text-xs text-muted-foreground">{formatDateYYYYMMDD(c.created_at)} · {PLACEMENT_LABEL[c.origin_placement] ?? c.origin_placement ?? "–"}{c.origin_cta ? ` · ${c.origin_cta}` : ""}</div>
                </div>
                <Badge variant="outline">{label(CASE_STATUSES, c.status)}</Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{bookings.length} bokn. · {intros.length} intro.</span>
              </button>
              {isOpen && (
                <CardContent className="space-y-6 border-t border-border pt-5">
                  <CaseEditor c={c} busy={busy} onSave={(f) => run("update_case", { id: c.id, ...f })} />
                  <JourneyContext ctx={c.journey_context} />
                  <section>
                    <h4 className="font-semibold mb-2">Bokningar</h4>
                    {bookings.length === 0 && <p className="text-sm text-muted-foreground">Inga bokningar kopplade.</p>}
                    <ul className="space-y-2">
                      {bookings.map((b) => (
                        <li key={b.id} className="rounded border border-border p-3 text-sm space-y-2">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span>{formatDateYYYYMMDD(b.created_at)}</span>
                            <span>{PLACEMENT_LABEL[b.advisory_placement] ?? b.advisory_placement ?? "–"}</span>
                            <span className="text-muted-foreground">{b.advisory_cta || b.help_with || "–"}</span>
                            <span className="text-muted-foreground">{b.landing_page || ""}</span>
                            {b.meeting_held_at && <Badge variant="secondary">Möte genomfört {formatDateYYYYMMDD(b.meeting_held_at)}</Badge>}
                          </div>
                          {b.message && <p className="text-muted-foreground">Kommentar: {b.message}</p>}
                          <div className="grid gap-2 sm:grid-cols-4 items-end">
                            <div><Label>Status</Label><Sel value={b.booking_status || "forfragan"} options={BOOKING_STATUSES} onChange={(v) => run("update_booking", { id: b.id, booking_status: v })} /></div>
                            <div><Label>Mötestid</Label><Input type="date" defaultValue={b.meeting_at ? formatDateYYYYMMDD(b.meeting_at) : ""} onBlur={(e) => run("update_booking", { id: b.id, meeting_at: e.target.value || null })} /></div>
                            <div><Label>Flytta till ärende</Label>
                              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={b.advisory_case_id || ""} onChange={(e) => e.target.value && run("update_booking", { id: b.id, advisory_case_id: e.target.value }, "Bokningen flyttad")}>
                                {data.cases.map((o) => <option key={o.id} value={o.id}>{o.company || "Okänt"} ({formatDateYYYYMMDD(o.created_at)})</option>)}
                              </select>
                            </div>
                            <Button size="sm" variant="outline" disabled={busy || !!b.meeting_held_at} onClick={() => run("update_booking", { id: b.id, meeting_held: true }, "Möte registrerat")}>Registrera genomfört möte</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <RelatedCases c={c} all={data.cases} links={data.links} busy={busy} onLink={(b, note) => run("link_cases", { a: c.id, b, note }, "Ärenden kopplade")} onUnlink={(b) => run("unlink_cases", { a: c.id, b }, "Koppling borttagen")} />
                  <section className="space-y-3">
                    <h4 className="font-semibold">Partnerintroduktioner</h4>
                    {intros.map((i) => <IntroEditor key={i.id} i={i} caseNeed={c.need_summary} busy={busy} onSave={(f) => run("update_intro", { id: i.id, ...f })} />)}
                    <NewIntro partners={data.partners} taken={intros.map((i) => i.partner_slug)} busy={busy} onCreate={(f) => run("create_intro", { case_id: c.id, ...f }, "Introduktion skapad")} />
                  </section>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CaseEditor({ c, busy, onSave }: { c: Row; busy: boolean; onSave: (f: Row) => void }) {
  const [f, setF] = useState<Row>({});
  useEffect(() => setF({ status: c.status, need_summary: c.need_summary || "", notes: c.notes || "", next_step: c.next_step || "", budget: c.budget || "", timeline: c.timeline || "", contact_name: c.contact_name || "", company: c.company || "", email: c.email || "", phone: c.phone || "" }), [c]);
  const s = (k: string) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-4">
        <div><Label>Kontakt</Label><Input value={f.contact_name || ""} onChange={s("contact_name")} /></div>
        <div><Label>Företag</Label><Input value={f.company || ""} onChange={s("company")} /></div>
        <div><Label>E-post</Label><Input value={f.email || ""} onChange={s("email")} /></div>
        <div><Label>Telefon</Label><Input value={f.phone || ""} onChange={s("phone")} /></div>
      </div>
      <div><Label>Konkret behov (behovssammanfattning)</Label><Textarea rows={3} value={f.need_summary || ""} onChange={s("need_summary")} /></div>
      <div><Label>Samtalsanteckningar (internt)</Label><Textarea rows={4} value={f.notes || ""} onChange={s("notes")} /></div>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2"><Label>Nästa steg</Label><Input value={f.next_step || ""} onChange={s("next_step")} /></div>
        <div><Label>Budget (om känd)</Label><Input value={f.budget || ""} onChange={s("budget")} /></div>
        <div><Label>Tidplan (om känd)</Label><Input value={f.timeline || ""} onChange={s("timeline")} /></div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-56"><Label>Ärendestatus</Label><Sel value={f.status || "ny"} options={CASE_STATUSES} onChange={(v) => setF((x) => ({ ...x, status: v }))} /></div>
        <Button disabled={busy} onClick={() => onSave(f)}>Spara ärende</Button>
      </div>
    </section>
  );
}

function JourneyContext({ ctx }: { ctx: Record<string, unknown> | null }) {
  const entries = ctx ? Object.entries(ctx).filter(([, v]) => Array.isArray(v) ? v.length : v) : [];
  if (!entries.length) return <p className="text-sm text-muted-foreground">Inget underlag från köpresan delades.</p>;
  return (
    <section className="rounded-md border border-border bg-muted/40 p-3 text-sm">
      <h4 className="font-semibold mb-1">Underlag som kunden delade</h4>
      <ul className="space-y-1">{entries.map(([k, v]) => <li key={k}><span className="font-medium">{k}:</span> <span className="text-muted-foreground">{Array.isArray(v) ? v.join(" · ") : String(v)}</span></li>)}</ul>
    </section>
  );
}

function RelatedCases({ c, all, links, busy, onLink, onUnlink }: { c: Row; all: Row[]; links: Row[]; busy: boolean; onLink: (b: string, note: string) => void; onUnlink: (b: string) => void }) {
  const [pick, setPick] = useState("");
  const [note, setNote] = useState("");
  const related = links.filter((l) => l.case_a === c.id || l.case_b === c.id).map((l) => ({ id: l.case_a === c.id ? l.case_b : l.case_a, note: l.note }));
  const byId = new Map(all.map((x) => [x.id, x]));
  return (
    <section>
      <h4 className="font-semibold mb-2">Relaterade ärenden</h4>
      {related.length === 0 && <p className="text-sm text-muted-foreground mb-2">Inga kopplade ärenden.</p>}
      <ul className="space-y-1 text-sm mb-2">{related.map((r) => { const o = byId.get(r.id); return (
        <li key={r.id} className="flex items-center gap-3">{o?.company || "Okänt"} ({formatDateYYYYMMDD(o?.created_at)}){r.note ? <span className="text-muted-foreground">· {r.note}</span> : null}<Button size="sm" variant="ghost" disabled={busy} onClick={() => onUnlink(r.id)}>Ta bort koppling</Button></li>
      ); })}</ul>
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-end">
        <div><Label>Koppla till ärende</Label>
          <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">Välj ärende</option>
            {all.filter((o) => o.id !== c.id && !related.some((r) => r.id === o.id)).map((o) => <option key={o.id} value={o.id}>{o.company || "Okänt"} · {o.contact_name || "–"} ({formatDateYYYYMMDD(o.created_at)})</option>)}
          </select>
        </div>
        <div><Label>Anteckning (valfri)</Label><Input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} /></div>
        <Button variant="outline" disabled={busy || !pick} onClick={() => { onLink(pick, note); setPick(""); setNote(""); }}>Koppla</Button>
      </div>
    </section>
  );
}

function ScopeBoxes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {CONSENT_SCOPE_OPTIONS.map(([k, l]) => (
        <label key={k} className="flex items-center gap-2 text-sm"><Checkbox checked={value.includes(k)} onCheckedChange={(v) => onChange(v === true ? [...value, k] : value.filter((x) => x !== k))} />{l}</label>
      ))}
    </div>
  );
}

function NewIntro({ partners, taken, busy, onCreate }: { partners: Data["partners"]; taken: string[]; busy: boolean; onCreate: (f: Row) => void }) {
  const [slug, setSlug] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentAt, setConsentAt] = useState("");
  const [scope, setScope] = useState<string[]>([]);
  const [note, setNote] = useState("");
  return (
    <div className="rounded-md border border-dashed border-border p-3 space-y-3">
      <p className="text-sm font-medium">Ny introduktion till en specifik partner</p>
      <div><Label>Partner</Label>
        <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)}>
          <option value="">Välj partner</option>
          {partners.filter((p) => !taken.includes(p.slug)).map((p) => <option key={p.slug} value={p.slug}>{p.name}{p.is_featured ? "" : " (grundprofil)"}</option>)}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />Kunden har godkänt introduktionen till just denna partner</label>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Datum för godkännande</Label><Input type="date" value={consentAt} onChange={(e) => setConsentAt(e.target.value)} /></div>
        <div><Label>Hur godkännandet gavs (valfritt)</Label><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="t.ex. muntligt i möte, bekräftat via e-post" /></div>
      </div>
      <div><Label>Information kunden godkänt att dela</Label><ScopeBoxes value={scope} onChange={setScope} /></div>
      <Button size="sm" disabled={busy || !slug} onClick={() => { onCreate({ partner_slug: slug, consent_given: consent, consent_at: consentAt || null, consent_scope: scope, consent_note: note }); setSlug(""); setConsent(false); setConsentAt(""); setScope([]); setNote(""); }}>Skapa introduktion</Button>
    </div>
  );
}

function IntroEditor({ i, caseNeed, busy, onSave }: { i: Row; caseNeed: string | null; busy: boolean; onSave: (f: Row) => void }) {
  const [f, setF] = useState<Row>({});
  useEffect(() => setF({
    consent_given: i.consent_given, consent_at: i.consent_at ? formatDateYYYYMMDD(i.consent_at) : "", consent_scope: i.consent_scope || [], consent_note: i.consent_note || "",
    partner_response: i.partner_response, business_status: i.business_status, estimated_project_size: i.estimated_project_size || "",
    business_outcome: i.business_outcome || "", next_step: i.next_step || "", admin_notes: i.admin_notes || "",
  }), [i]);
  const s = (k: string) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const sent = !!i.introduced_at;
  const blockers = sendBlockers({ consent_given: !!f.consent_given, consent_at: f.consent_at || null, consent_scope: f.consent_scope || [] });
  const rule = { consent_given: !!f.consent_given, consent_at: f.consent_at || null, consent_scope: f.consent_scope || [], introduced_at: i.introduced_at, partner_response: f.partner_response, next_step: f.next_step, business_status: f.business_status };
  const allowed = allowedStatuses(caseNeed, rule);
  const gaps = qualificationGaps(caseNeed, rule);
  const statusOptions = INTRO_STATUSES.filter(([v]) => allowed.includes(v) || v === f.business_status);
  return (
    <div className="rounded-md border border-border p-3 space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{i.partner_name || i.partner_slug}</span>
        <Badge variant="outline">{label(INTRO_STATUSES, i.business_status)}</Badge>
        <span className="text-xs text-muted-foreground">ID {String(i.id).slice(0, 8)} · skapad {formatDateYYYYMMDD(i.created_at)}{sent ? ` · skickad ${formatDateYYYYMMDD(i.introduced_at)}` : " · ej skickad"} · ersättningsmodell: {i.commercial_model}</span>
      </div>
      <fieldset className="space-y-2" disabled={sent}>
        <label className="flex items-center gap-2"><Checkbox checked={!!f.consent_given} onCheckedChange={(v) => setF((x) => ({ ...x, consent_given: v === true }))} disabled={sent} />Kunden har godkänt introduktionen till denna partner</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Datum för godkännande</Label><Input type="date" value={f.consent_at || ""} onChange={s("consent_at")} /></div>
          <div><Label>Hur godkännandet gavs</Label><Input value={f.consent_note || ""} onChange={s("consent_note")} /></div>
        </div>
        <div><Label>Information kunden godkänt att dela</Label><ScopeBoxes value={f.consent_scope || []} onChange={(v) => setF((x) => ({ ...x, consent_scope: v }))} /></div>
      </fieldset>
      {!sent && (
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline" disabled={busy || blockers.length > 0} onClick={() => onSave({ ...f, mark_sent: true })}>Markera introduktionen som skickad</Button>
          {blockers.length > 0 && <span className="text-xs text-muted-foreground">{blockers.join(". ")}.</span>}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Partnerns svar</Label><Sel value={f.partner_response || "vantar"} options={PARTNER_RESPONSES} onChange={(v) => setF((x) => ({ ...x, partner_response: v }))} /></div>
        <div><Label>Affärsstatus</Label><Sel value={f.business_status || "forberedd"} options={statusOptions} onChange={(v) => setF((x) => ({ ...x, business_status: v }))} /></div>
        <div><Label>Uppskattad projektstorlek</Label><Input value={f.estimated_project_size || ""} onChange={s("estimated_project_size")} /></div>
      </div>
      {sent && gaps.length > 0 && <p className="text-xs text-muted-foreground">Kvalificerad möjlighet kräver: {gaps.join(". ").toLowerCase()}.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Konkret nästa steg</Label><Input value={f.next_step || ""} onChange={s("next_step")} /></div>
        <div><Label>Känt affärsutfall</Label><Input value={f.business_outcome || ""} onChange={s("business_outcome")} /></div>
      </div>
      <div><Label>Interna anteckningar</Label><Textarea rows={2} value={f.admin_notes || ""} onChange={s("admin_notes")} /></div>
      <Button size="sm" disabled={busy} onClick={() => onSave(sent ? { ...f, consent_given: undefined, consent_at: undefined, consent_scope: undefined, consent_note: undefined } : f)}>Spara introduktion</Button>
    </div>
  );
}
