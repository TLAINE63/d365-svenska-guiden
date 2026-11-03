import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { defaultFromDate } from "@/lib/adminExports";

/** Admin-only CSV-export. Exportnyckeln finns bara på servern; sidan skickar adminens inloggningstoken. */
const EXPORTS = [
  { id: "leads", label: "Förfrågningar", fn: "export-demand-leads", extra: "", file: "d365se-forfragningar" },
  { id: "events", label: "Händelser med företag", fn: "export-demand-events", extra: "&company=1", file: "d365se-handelser-foretag" },
] as const;

export default function AdminExporter() {
  const { isAuthenticated, token, logout } = useAdminAuth();
  const [from, setFrom] = useState(defaultFromDate());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const download = async (e: (typeof EXPORTS)[number]) => {
    if (!token) return;
    setBusy(e.id);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${e.fn}?from=${encodeURIComponent(from)}${e.extra}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        logout();
        setError("Inloggningen har gått ut. Logga in igen.");
        return;
      }
      if (!res.ok) {
        setError(res.status === 400 ? "Ogiltigt datum." : "Exporten misslyckades.");
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${e.file}-${from}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("Exporten misslyckades.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Exporter | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-xl mx-auto px-4 py-16">
        {!isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle as="h1">Åtkomst nekad</CardTitle>
              <CardDescription>Sidan är bara tillgänglig för inloggad admin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild><Link to="/admin">Logga in i Admin</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle as="h1">Exporter</CardTitle>
              <CardDescription>CSV-filer för Demand Engine. Datum i formatet ÅÅÅÅ-MM-DD, till och med i dag.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="export-from">Från-datum</Label>
                <Input id="export-from" type="date" value={from} onChange={(ev) => setFrom(ev.target.value)} />
              </div>
              <div className="flex flex-wrap gap-3">
                {EXPORTS.map((e) => (
                  <Button key={e.id} onClick={() => download(e)} disabled={!!busy || !from}>
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    {busy === e.id ? "Hämtar…" : e.label}
                  </Button>
                ))}
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Link to="/admin" className="text-sm underline text-muted-foreground">Tillbaka till Admin</Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
