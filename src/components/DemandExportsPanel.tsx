import { useState } from "react";
import BookingClicksTable from "@/components/admin/BookingClicksTable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultFromDate, previousMonth } from "@/lib/adminExports";
import { supabase } from "@/integrations/supabase/client";
import { zipSync, strToU8 } from "fflate";

const ALL_KEY = "crm_paket_senast";
const stockholmToday = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date());
function allFromDefault(): string {
  try { const v = localStorage.getItem(ALL_KEY); if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v; } catch { /* ignore */ }
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date(Date.now() - 35 * 864e5));
}

interface SnitcherCompany {
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_country: string | null;
  company_city?: string | null;
  company_revenue?: string | null;
  urls?: string[];
  session_count: number;
  url_count: number;
  partner_slugs: string[];
  first_seen: string | null;
  last_seen: string | null;
}

function last30Days(): { from: string; to: string } {
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return { from, to };
}

function snitcherCsv(companies: SnitcherCompany[]): string {
      const header = ["Företag", "Domän", "Bransch", "Storlek", "Omsättning", "Ort", "Land", "Först sedd", "Senast sedd", "Besök", "Sidvisningar", "Besökta sidor", "Partner-besök"];
      const toPath = (u: string) => { try { const x = new URL(u); return x.pathname + x.search; } catch { return u; } };
      return [header.join(";")].concat(companies.map((r) => [
        r.company_name ?? "",
        r.company_domain ?? "",
        r.company_industry ?? "",
        r.company_size ?? "",
        r.company_revenue ?? "",
        r.company_city ?? "",
        r.company_country ?? "",
        (r.first_seen ?? "").slice(0, 10),
        (r.last_seen ?? "").slice(0, 10),
        r.session_count,
        r.url_count,
        [...new Set((r.urls ?? []).map(toPath))].slice(0, 150).join(" | "),
        r.partner_slugs.join("|"),
      ].map((v) => { const t = String(v); return `"${(/^[=+\-@]/.test(t) ? "'" + t : t).replace(/"/g, '""')}"`; }).join(";"))).join("\n");
}

/** CSV-exporter (admin). Nyckeln finns bara på servern; panelen skickar inloggningstoken. */
const DATE_EXPORTS = [
  { id: "leads", label: "Förfrågningar", fn: "export-demand-leads", extra: "", file: "d365se-forfragningar" },
  { id: "events", label: "Händelser med företag", fn: "export-demand-events", extra: "&company=1", file: "d365se-handelser-foretag" },
] as const;

interface Props {
  token: string;
  onUnauthorized: () => void;
}

export default function DemandExportsPanel({ token, onUnauthorized }: Props) {
  const [from, setFrom] = useState(defaultFromDate());
  const [month, setMonth] = useState(previousMonth());
  const [snitcherRange, setSnitcherRange] = useState(last30Days);
  const [busy, setBusy] = useState<string | null>(null);
  const [allFrom, setAllFrom] = useState(allFromDefault);
  const [allNote, setAllNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadSnitcher = async () => {
    setBusy("snitcher");
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("manage-partner-reports", {
        body: { action: "list_all_visitors", token, period_start: snitcherRange.from, period_end: snitcherRange.to },
      });
      if (fnError || data?.error) {
        if (data?.error === "Unauthorized" || /401/.test(String(fnError?.message))) {
          setError("Exporterna kräver admininloggning.");
          onUnauthorized();
        } else {
          setError("Exporten misslyckades.");
        }
        return;
      }
      const csv = snitcherCsv(data.companies || []);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `d365se-snitcher-besokare-${snitcherRange.from}-${snitcherRange.to}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("Exporten misslyckades.");
    } finally {
      setBusy(null);
    }
  };

  const download = async (id: string, query: string, file: string) => {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${query}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        setError("Exporterna kräver admininloggning.");
        onUnauthorized();
        return;
      }
      if (!res.ok) {
        setError(res.status === 400 ? "Ogiltigt datum eller månad." : "Exporten misslyckades.");
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${file}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("Exporten misslyckades.");
    } finally {
      setBusy(null);
    }
  };

  /** Hämtar en export och returnerar blobben, eller null vid fel (felmeddelande sätts). */
  const fetchExport = async (query: string): Promise<Blob | null> => {
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${query}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) {
      setError("Exporterna kräver admininloggning.");
      onUnauthorized();
      return null;
    }
    if (!res.ok) {
      setError(res.status === 400 ? "Ogiltigt datum eller månad." : "Exporten misslyckades.");
      return null;
    }
    return res.blob();
  };

  const saveBlob = (blob: Blob, file: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${file}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /** Laddar ner leads och händelser som två separata CSV-filer, Från-datum till och med i dag (Stockholmstid). */
  const downloadCrmPackage = async () => {
    setBusy("crm");
    setError(null);
    try {
      const to = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date());
      const leads = await fetchExport(`export-demand-leads?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      if (!leads) return;
      const events = await fetchExport(`export-demand-events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&company=1`);
      if (!events) return;
      saveBlob(leads, `d365-demand-leads-${from}-${to}`);
      saveBlob(events, `d365-demand-events-${from}-${to}`);
    } catch {
      setError("Exporten misslyckades.");
    } finally {
      setBusy(null);
    }
  };

  /** En zip med alla CRM-filer. Filer som misslyckas utelämnas och listas i meddelandet. */
  const downloadAll = async () => {
    setBusy("all");
    setError(null);
    setAllNote(null);
    try {
      const to = stockholmToday();
      const f = encodeURIComponent(allFrom), t = encodeURIComponent(to);
      const files: Record<string, Uint8Array> = {};
      const get = async (name: string, query: string) => {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${query}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) throw new Error("401");
        if (res.ok) files[name] = new Uint8Array(await res.arrayBuffer());
      };
      await get("demand-leads.csv", `export-demand-leads?from=${f}&to=${t}`);
      await get("demand-events.csv", `export-demand-events?from=${f}&to=${t}&company=1`);
      const { data, error: sErr } = await supabase.functions.invoke("manage-partner-reports", {
        body: { action: "list_all_visitors", token, period_start: allFrom, period_end: to },
      });
      if (!sErr && !data?.error) files["snitcher-besokare.csv"] = strToU8("\uFEFF" + snitcherCsv(data.companies || []));
      await get("partnersegment.csv", "admin-partner-segments");
      await get("isv-produkter.csv", "export-isv-products");
      await get("partnerstatistik.csv", `export-partner-stats?month=${encodeURIComponent(previousMonth())}`);
      const names = Object.keys(files);
      if (names.length === 0) { setError("Exporten misslyckades."); return; }
      const zip = zipSync(files);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));
      a.download = `d365se-crm-paket-${to}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      try { localStorage.setItem(ALL_KEY, to); } catch { /* ignore */ }
      setAllNote(`Med i paketet: ${names.join(", ")}.`);
    } catch (e) {
      if (String((e as Error)?.message) === "401") { setError("Exporterna kräver admininloggning."); onUnauthorized(); }
      else setError("Exporten misslyckades.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="all-from">Från-datum (till och med i dag)</Label>
          <Input id="all-from" type="date" value={allFrom} onChange={(e) => setAllFrom(e.target.value)} />
        </div>
        <Button disabled={!!busy || !allFrom} onClick={downloadAll}>
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          {busy === "all" ? "Hämtar…" : "Ladda ner allt för CRM"}
        </Button>
        {allNote && <p className="text-sm text-muted-foreground">{allNote}</p>}
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="export-from">Från-datum</Label>
          <Input id="export-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-3">
          {DATE_EXPORTS.map((e) => (
            <Button key={e.id} disabled={!!busy || !from}
              onClick={() => download(e.id, `${e.fn}?from=${encodeURIComponent(from)}${e.extra}`, `${e.file}-${from}`)}>
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              {busy === e.id ? "Hämtar…" : e.label}
            </Button>
          ))}
          <Button disabled={!!busy || !from} onClick={downloadCrmPackage}>
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            {busy === "crm" ? "Hämtar…" : "Ladda ner CRM-paket"}
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5 max-w-xs">
          <Label htmlFor="export-month">Månad</Label>
          <Input id="export-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <Button disabled={!!busy || !month}
          onClick={() => download("partners", `export-partner-stats?month=${encodeURIComponent(month)}`, `d365se-partnerstatistik-${month}`)}>
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          {busy === "partners" ? "Hämtar…" : "Partnerstatistik"}
        </Button>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">Identifierade besökarföretag från Snitcher, alla företag i perioden.</p>
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="snitcher-from">Från-datum</Label>
            <Input id="snitcher-from" type="date" value={snitcherRange.from}
              onChange={(e) => setSnitcherRange((r) => ({ ...r, from: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="snitcher-to">Till-datum</Label>
            <Input id="snitcher-to" type="date" value={snitcherRange.to}
              onChange={(e) => setSnitcherRange((r) => ({ ...r, to: e.target.value }))} />
          </div>
        </div>
        <Button disabled={!!busy || !snitcherRange.from || !snitcherRange.to} onClick={downloadSnitcher}>
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          {busy === "snitcher" ? "Hämtar…" : "Snitcher-besökare"}
        </Button>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Nuläget i ISV-katalogen, inget datum behövs.</p>
        <Button disabled={!!busy} onClick={() => download("isv", "export-isv-products", "d365se-isv-produkter")}>
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          {busy === "isv" ? "Hämtar…" : "ISV-produkter"}
        </Button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button disabled={!!busy} onClick={() => download("segments", "admin-partner-segments", `d365se-partnersegment-${new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm" }).format(new Date())}`)}>
        <Download className="w-4 h-4 mr-2" aria-hidden="true" />
        {busy === "segments" ? "Hämtar…" : "Partnersegment"}
      </Button>
      <BookingClicksTable token={token} onUnauthorized={onUnauthorized} />
    </div>
  );
}
