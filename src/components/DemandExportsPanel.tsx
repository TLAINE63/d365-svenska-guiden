import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultFromDate, previousMonth } from "@/lib/adminExports";
import { supabase } from "@/integrations/supabase/client";

interface SnitcherCompany {
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_country: string | null;
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
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
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
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Nuläget i ISV-katalogen, inget datum behövs.</p>
        <Button disabled={!!busy} onClick={() => download("isv", "export-isv-products", "d365se-isv-produkter")}>
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          {busy === "isv" ? "Hämtar…" : "ISV-produkter"}
        </Button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
