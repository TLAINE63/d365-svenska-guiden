import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Download, Plus, Trash2, Save, Check } from "lucide-react";
import {
  BC_GROUP_TITLES, VERIFICATION_STATUSES, SOLUTION_TYPES,
} from "@/data/structuredPartnerProfile";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";

interface Props { token: string | null; onSessionExpired?: () => void }

const VERIFIED_BY = [
  { value: "", label: "Ingen källa" },
  { value: "partner", label: "Partner" },
  { value: "redaktion", label: "d365.se Redaktion" },
  { value: "publik_kalla", label: "Publik källa" },
  { value: "import", label: "Import" },
];
const DIMENSION_TITLES: Record<string, string> = {
  ...Object.fromEntries(Object.entries(BC_GROUP_TITLES).map(([k, v]) => [k, v.title])),
  competency: "Specialiseringar",
  special_delivery: "Särskilda projekt och leveransformer",
  industry_solution_type: "Typ av branschlösning",
};
const dimTitle = (d: string) => DIMENSION_TITLES[d] || d.replace(/_/g, " ");

interface Verif { verification_status: string; verified_by: string; verified_at: string; source_url: string }
interface Attr extends Verif { product_attribute_option_id: string; is_published: boolean }
interface Cap extends Verif { capability_product_id: string; is_published: boolean }
interface Solution {
  id?: string; name: string; description: string; industries: string[]; solution_type: string;
  source_url: string; partner_verified: boolean; editorial_verified: boolean; verified_at: string; is_published: boolean;
}

const sel = "h-9 rounded-md border border-input bg-background px-2 text-sm";
const emptyVerif: Verif = { verification_status: "unverified", verified_by: "", verified_at: "", source_url: "" };
const STATUS_LABELS: Record<string, string> = Object.fromEntries(VERIFICATION_STATUSES.map((s) => [s.value, s.label]));
const adminVerif = () => ({ verification_status: "editorial_verified", verified_by: "redaktion", verified_at: new Date().toISOString().slice(0, 10), source_url: "", is_published: true });
const isVerified = (v: Verif) => ["partner_verified", "editorial_verified", "public_source"].includes(v.verification_status);

function VerifFields({ v, onChange }: { v: Verif; onChange: (p: Partial<Verif>) => void }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select className={sel} value={v.verification_status} onChange={(e) => onChange({ verification_status: e.target.value })}>
        {VERIFICATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <select className={sel} value={v.verified_by} onChange={(e) => onChange({ verified_by: e.target.value })}>
        {VERIFIED_BY.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <Input type="date" className="h-9 w-40" value={v.verified_at} onChange={(e) => onChange({ verified_at: e.target.value })} />
      <Input className="h-9 w-56" placeholder="Källänk https://" value={v.source_url} onChange={(e) => onChange({ source_url: e.target.value })} />
    </div>
  );
}

function VerifiedBadge({ v, onEdit }: { v: Verif; onEdit: () => void }) {
  return (
    <button type="button" onClick={onEdit} title="Klicka för att ändra verifiering"
      className="flex items-center gap-1 text-xs text-emerald-600 hover:underline">
      <Check className="w-3.5 h-3.5" /> {STATUS_LABELS[v.verification_status]}
    </button>
  );
}

export default function AdminPartnerMasterTab({ token, onSessionExpired }: Props) {
  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-partner-master`;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const call = async (action: string, body?: unknown) => {
    const res = await fetch(`${base}?action=${action}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Authorization: `Bearer ${token}`, apikey, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 401) { onSessionExpired?.(); throw new Error("Sessionen har gått ut"); }
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Något gick fel");
    return data;
  };

  const [partners, setPartners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [caps, setCaps] = useState<Cap[]>([]);
  const [filter, setFilter] = useState<"verified" | "all">("verified");
  const [partnerId, setPartnerId] = useState("");
  const [detail, setDetail] = useState<any>(null);
  const [profileId, setProfileId] = useState("");
  const [profileForm, setProfileForm] = useState<any>(null);
  const [attrs, setAttrs] = useState<Attr[]>([]);
  const [bulk, setBulk] = useState<Verif & { is_published: boolean }>({ ...emptyVerif, is_published: false });
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [newProduct, setNewProduct] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<any[] | null>(null);
  const [exportData, setExportData] = useState<any>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const revealKey = (k: string) => setRevealed((prev) => ({ ...prev, [k]: true }));

  useEffect(() => {
    if (!token) return;
    call("bootstrap").then((d) => { setPartners(d.partners || []); setProducts(d.products || []); setOptions(d.options || []); })
      .catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadPartner = async (id: string, keepProfile?: string) => {
    if (!id) return;
    setBusy(true);
    try {
      const d = await call("partner", { partner_id: id });
      setDetail(d);
      const bc = d.profiles.find((p: any) => p.product?.product_key === "business-central");
      selectProfile(d, keepProfile || bc?.id || d.profiles[0]?.id || "");
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  const selectProfile = (d: any, id: string) => {
    setProfileId(id);
    const p = d.profiles.find((x: any) => x.id === id);
    setProfileForm(p ? {
      status: p.status, is_primary: p.is_primary, is_published: p.is_published,
      verification_status: p.verification_status, verified_by: p.verified_by || "",
      verified_at: p.verified_at || "", source_url: p.source_url || "",
    } : null);
    const meta = (a: any) => ({ verification_status: a.verification_status, verified_by: a.verified_by || "",
      verified_at: a.verified_at || "", source_url: a.source_url || "", is_published: a.is_published });
    setAttrs((d.attributes || []).filter((a: any) => a.partner_product_profile_id === id)
      .map((a: any) => ({ product_attribute_option_id: a.product_attribute_option_id, ...meta(a) })));
    setCaps((d.capabilities || []).filter((c: any) => c.partner_product_profile_id === id)
      .map((c: any) => ({ capability_product_id: c.capability_product_id, ...meta(c) })));
    setSolutions((d.solutions || []).filter((s: any) => s.profile_id === id).map((s: any) => ({
      id: s.id, name: s.name, description: s.description || "", industries: s.industries || [],
      solution_type: s.solution_type, source_url: s.source_url || "", partner_verified: s.partner_verified,
      editorial_verified: s.editorial_verified, verified_at: s.verified_at || "", is_published: s.is_published,
    })));
  };

  const profile = detail?.profiles.find((p: any) => p.id === profileId);
  const profileOptions = useMemo(() => options.filter((o) => o.product_id === profile?.product_id), [options, profile]);
  const dimensions = useMemo(() => {
    const isFsc = ["finance", "supply-chain"].includes(profile?.product?.product_key);
    return [...new Set(profileOptions.map((o) => o.dimension_key))].filter((d) => d !== "special_delivery");
  }, [profileOptions, profile]);
  const capabilityProducts = useMemo(() => products.filter((p) => p.is_active && ["capability", "platform"].includes(p.catalog_type) && p.id !== profile?.product_id), [products, profile]);
  const shownPartners = partners.filter((p) => filter === "all" || p.agreement_signed);
  const availableProducts = useMemo(() => products.filter((p) => p.is_active && !detail?.profiles.some((x: any) => x.product_id === p.id)), [products, detail]);

  const toggleAttr = (id: string) => {
    setAttrs((prev) => prev.some((a) => a.product_attribute_option_id === id)
      ? prev.filter((a) => a.product_attribute_option_id !== id)
      : [...prev, { product_attribute_option_id: id, ...adminVerif() }]);
  };
  const patchAttr = (id: string, p: Partial<Attr>) =>
    setAttrs((prev) => prev.map((a) => (a.product_attribute_option_id === id ? { ...a, ...p } : a)));
  const toggleCap = (id: string) => setCaps((prev) => prev.some((c) => c.capability_product_id === id)
    ? prev.filter((c) => c.capability_product_id !== id)
    : [...prev, { capability_product_id: id, ...adminVerif() }]);
  const patchCap = (id: string, p: Partial<Cap>) =>
    setCaps((prev) => prev.map((c) => (c.capability_product_id === id ? { ...c, ...p } : c)));

  const run = async (fn: () => Promise<void>, ok: string) => {
    setBusy(true);
    try { await fn(); toast.success(ok); } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  };

  const saveProfile = () => run(async () => {
    await call("save-profile", { profile_id: profileId, ...profileForm });
    await loadPartner(partnerId, profileId);
  }, "Produktprofilen sparad");

  const saveAttrs = () => run(async () => {
    await call("save-attributes", { profile_id: profileId, attributes: attrs.map((a) => (isVerified(a) ? { ...a, is_published: true } : { ...a, ...adminVerif() })) });
    await loadPartner(partnerId, profileId);
  }, "Produktvalen sparade");

  const saveCaps = () => run(async () => {
    await call("save-capabilities", { profile_id: profileId, capabilities: caps.map((c) => (isVerified(c) ? { ...c, is_published: true } : { ...c, ...adminVerif() })) });
    await loadPartner(partnerId, profileId);
  }, "Förmågorna sparade");

  const saveSolution = (s: Solution) => run(async () => {
    await call("save-solution", { profile_id: profileId, ...s });
    await loadPartner(partnerId, profileId);
  }, "Branschlösningen sparad");

  const deleteSolution = (s: Solution) => run(async () => {
    if (s.id) await call("delete-solution", { id: s.id });
    await loadPartner(partnerId, profileId);
  }, "Branschlösningen borttagen");

  const createProfile = () => run(async () => {
    await call("create-profile", { partner_id: partnerId, product_key: newProduct });
    setNewProduct("");
    await loadPartner(partnerId);
  }, "Produktprofil skapad");

  const loadReport = () => run(async () => { const d = await call("migration-report"); setReport(d.rows); }, "Rapporten hämtad");
  const loadExport = () => run(async () => { setExportData(await call("export-bc")); }, "Exporten hämtad");

  const downloadCsv = () => {
    if (!report) return;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
    const head = ["Partner", "Har BC", "BC-profil status", "Senast verifierad", "Migrering", "Kompetens", "Projekt", "Leverans", "Kräver partnerbekräftelse", "Saknas", "BC-positionering (fritext)", "Metodik (fritext)", "Kundexempel", "Branschappar"];
    const lines = report.map((r) => [
      r.name, r.has_bc ? "Ja" : "Nej", r.bc_profile?.verification_status || "Saknar profil", r.last_verified_at || "",
      r.counts.migration, r.counts.competency, r.counts.project_type, r.counts.delivery_model, r.needs_partner_confirmation,
      r.missing.join("; "), r.free_text.bc_positioning, r.free_text.bc_methodology, r.free_text.customer_examples.join("; "), r.free_text.industry_apps.join("; "),
    ].map(esc).join(","));
    const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `migreringsrapport-bc-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <Tabs defaultValue="edit" className="space-y-4">
      <TabsList>
        <TabsTrigger value="edit">Redigera partnerdata</TabsTrigger>
        <TabsTrigger value="report">Migreringsrapport</TabsTrigger>
        <TabsTrigger value="export">BC-export v1.0</TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Partnerdata (master)</CardTitle>
            <CardDescription>
              Generell information lagras en gång på partnern. Produktspecifika uppgifter lagras per produktprofil.
              Ingenting här påverkar publika sidor, ranking eller matchning.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-center">
            <select className={sel} value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="verified">Verifierade partners (avtal)</option>
              <option value="all">Alla partners</option>
            </select>
            <select className={`${sel} min-w-64`} value={partnerId} onChange={(e) => { setPartnerId(e.target.value); loadPartner(e.target.value); }}>
              <option value="">Välj partner</option>
              {shownPartners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardContent>
        </Card>

        {detail && (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base">Generell information (läses från partnerposten)</CardTitle></CardHeader>
              <CardContent className="text-sm grid sm:grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Slug:</span> {detail.partner.slug}</div>
                <div><span className="text-muted-foreground">Verifieringsstatus:</span> {detail.partner.agreement_signed ? "Partnerverifierad (avtal)" : "Grundprofil"}</div>
                <div><span className="text-muted-foreground">Geografi:</span> {(detail.partner.geography || []).join(", ") || "Saknas"}</div>
                <div><span className="text-muted-foreground">Kontor:</span> {(detail.partner.office_cities || []).join(", ") || "Saknas"}</div>
                <div><span className="text-muted-foreground">Team i Sverige:</span> {detail.partner.team_size_sweden || "Saknas"}</div>
                <div><span className="text-muted-foreground">Senast uppdaterad:</span> {detail.partner.updated_at?.slice(0, 10)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Produktprofiler</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {detail.profiles.map((p: any) => (
                    <Button key={p.id} size="sm" variant={p.id === profileId ? "default" : "outline"} onClick={() => selectProfile(detail, p.id)}>
                      {p.product?.name} {p.is_published && <Badge variant="secondary" className="ml-2">Publicerad</Badge>}
                    </Button>
                  ))}
                  {!detail.profiles.length && <span className="text-sm text-muted-foreground">Inga produktprofiler.</span>}
                </div>
                <div className="flex gap-2 items-center">
                  <select className={sel} value={newProduct} onChange={(e) => setNewProduct(e.target.value)}>
                    <option value="">Lägg till produktprofil…</option>
                    {availableProducts.map((p) => <option key={p.id} value={p.product_key}>{p.name}</option>)}
                  </select>
                  <Button size="sm" variant="outline" disabled={!newProduct || busy} onClick={createProfile}><Plus className="w-4 h-4 mr-1" /> Skapa</Button>
                </div>

                {profileForm && (
                  <div className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex flex-wrap gap-3 items-center text-sm">
                      <select className={sel} value={profileForm.status} onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}>
                        <option value="draft">Utkast</option><option value="active">Aktiv</option><option value="archived">Arkiverad</option>
                      </select>
                      <label className="flex items-center gap-2"><Checkbox checked={profileForm.is_primary} onCheckedChange={(c) => setProfileForm({ ...profileForm, is_primary: !!c })} /> Primärt produktområde</label>
                      <label className="flex items-center gap-2"><Checkbox checked={profileForm.is_published} onCheckedChange={(c) => setProfileForm({ ...profileForm, is_published: !!c })} /> Publicerad (ingår i export)</label>
                    </div>
                    <Button size="sm" onClick={saveProfile} disabled={busy}><Save className="w-4 h-4 mr-1" /> Spara produktprofil</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {profile && !profileOptions.length && (
              <Card><CardContent className="py-4 text-sm text-muted-foreground">
                Inga produktval finns ännu i katalogen för {profile.product?.name}. Profilen kan redan publiceras och verifieras.
              </CardContent></Card>
            )}

            {profile && profileOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Produktval: {profile.product?.name}</CardTitle>
                  <CardDescription>Valen läses från produktkatalogen. Klicka i de områden som gäller. Valen publiceras direkt när du sparar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                  {dimensions.map((g) => (
                    <div key={g} className="space-y-2">
                      <h4 className="font-semibold text-sm">{dimTitle(g)}</h4>
                      <div className="space-y-1">
                        {profileOptions.filter((o) => o.dimension_key === g).map((o) => {
                          const a = attrs.find((x) => x.product_attribute_option_id === o.id);
                          return (
                            <div key={o.id} className="flex flex-wrap items-center gap-2 py-1 border-b border-border/50">
                              <label className="flex items-center gap-2 text-sm w-72 cursor-pointer">
                                <Checkbox checked={!!a} onCheckedChange={() => toggleAttr(o.id)} /> {o.label}
                              </label>
                              
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <Button onClick={saveAttrs} disabled={busy}><Save className="w-4 h-4 mr-1" /> Spara produktval</Button>
                </CardContent>
              </Card>
            )}

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tvärgående förmågor (gäller alla partnerns produktområden)</CardTitle>
                  <CardDescription>Till exempel Power BI, Copilot Studio eller Power Platform kopplat till just denna produktprofil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {capabilityProducts.map((p) => {
                    const c = caps.find((x) => x.capability_product_id === p.id);
                    return (
                      <div key={p.id} className="flex flex-wrap items-center gap-2 py-1 border-b border-border/50">
                        <label className="flex items-center gap-2 text-sm w-72 cursor-pointer">
                          <Checkbox checked={!!c} onCheckedChange={() => toggleCap(p.id)} /> {p.name}
                        </label>
                        
                      </div>
                    );
                  })}
                  <Button className="mt-3" onClick={saveCaps} disabled={busy}><Save className="w-4 h-4 mr-1" /> Spara förmågor</Button>
                </CardContent>
              </Card>
            )}

            {profile && (
              <Card>
                <CardHeader><CardTitle className="text-base">Branschlösningar ({profile.product?.name})</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {solutions.map((s, i) => {
                    const set = (p: Partial<Solution>) => setSolutions((prev) => prev.map((x, j) => (j === i ? { ...x, ...p } : x)));
                    return (
                      <div key={s.id || i} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="grid sm:grid-cols-2 gap-2">
                          <Input placeholder="Lösningsnamn" value={s.name} onChange={(e) => set({ name: e.target.value })} />
                          <select className={sel} value={s.solution_type} onChange={(e) => set({ solution_type: e.target.value })}>
                            {SOLUTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                        </div>
                        <Textarea rows={2} placeholder="Kort beskrivning" value={s.description} onChange={(e) => set({ description: e.target.value })} />
                        <select multiple className={`${sel} h-24 w-full`} value={s.industries}
                          onChange={(e) => set({ industries: Array.from(e.target.selectedOptions).map((o) => o.value) })}>
                          {INDUSTRY_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <div className="flex flex-wrap gap-3 items-center text-sm">
                          <Input className="h-9 w-56" placeholder="Källänk https://" value={s.source_url} onChange={(e) => set({ source_url: e.target.value })} />
                          <Input type="date" className="h-9 w-40" value={s.verified_at} onChange={(e) => set({ verified_at: e.target.value })} />
                          <label className="flex items-center gap-1"><Checkbox checked={s.partner_verified} onCheckedChange={(c) => set({ partner_verified: !!c })} /> Partnerverifierad</label>
                          <label className="flex items-center gap-1"><Checkbox checked={s.editorial_verified} onCheckedChange={(c) => set({ editorial_verified: !!c })} /> Redaktionellt verifierad</label>
                          <label className="flex items-center gap-1"><Checkbox checked={s.is_published} onCheckedChange={(c) => set({ is_published: !!c })} /> Publicerad</label>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveSolution(s)} disabled={busy}><Save className="w-4 h-4 mr-1" /> Spara</Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteSolution(s)} disabled={busy}><Trash2 className="w-4 h-4 mr-1" /> Ta bort</Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button size="sm" variant="outline" onClick={() => setSolutions((p) => [...p, {
                    name: "", description: "", industries: [], solution_type: "own", source_url: "",
                    partner_verified: false, editorial_verified: false, verified_at: "", is_published: false,
                  }])}><Plus className="w-4 h-4 mr-1" /> Ny branschlösning</Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="report" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Migreringsrapport – verifierade partners</CardTitle>
            <CardDescription>Befintlig fritext visas som underlag. Ingenting förifylls automatiskt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={loadReport} disabled={busy}>Hämta rapport</Button>
              <Button variant="outline" onClick={downloadCsv} disabled={!report}><Download className="w-4 h-4 mr-1" /> CSV</Button>
            </div>
            {report?.map((r) => (
              <div key={r.partner_id} className="rounded-lg border border-border p-3 text-sm space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{r.name}</strong>
                  {!r.has_bc && <Badge variant="outline">Ingen Business Central</Badge>}
                  <Badge variant="secondary">BC-profil: {r.bc_profile?.verification_status || "saknas"}</Badge>
                  <span className="text-muted-foreground">Senast verifierad: {r.last_verified_at || "Saknas"}</span>
                </div>
                <div className="text-muted-foreground">
                  Migrering {r.counts.migration} · Kompetens {r.counts.competency} · Projekt {r.counts.project_type} · Leverans {r.counts.delivery_model}
                  {r.needs_partner_confirmation > 0 && ` · ${r.needs_partner_confirmation} val kräver partnerbekräftelse`}
                </div>
                {r.missing.length > 0 && <div>Saknas: {r.missing.join(", ")}</div>}
                {r.free_text.bc_positioning && <div className="text-xs"><em>BC-positionering:</em> {r.free_text.bc_positioning}</div>}
                {r.free_text.bc_methodology && <div className="text-xs"><em>Metodik:</em> {r.free_text.bc_methodology}</div>}
                {r.free_text.industry_apps.length > 0 && <div className="text-xs"><em>Branschappar:</em> {r.free_text.industry_apps.join(", ")}</div>}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle>BC-exportkontrakt v1.0</CardTitle>
            <CardDescription>Endast publicerade uppgifter, inga kontaktuppgifter. Ingen synkronisering är aktiv.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={loadExport} disabled={busy}>Förhandsgranska export</Button>
            {exportData && (
              <pre className="text-xs bg-muted/40 rounded-lg p-3 overflow-auto max-h-[480px]">{JSON.stringify(exportData, null, 2)}</pre>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
