import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LABELS: Record<string, string> = {
  test_started: "Test påbörjat",
  test_completed: "Test genomfört",
  underlag_viewed: "Underlag visat",
  compare_prefilled: "Förifylld jämförelse",
  partner_saved: "Partner sparad",
  partners_compared: "Partners jämförda",
  partner_profile_opened: "Partnerprofil öppnad",
  decision_package_exported: "Underlag exporterat",
  underlag_sent: "Underlag skickat",
};

interface Row { key: string; count: number }
interface Sub { id: string; created_at: string; name: string; company: string; email: string; phone: string | null; buying_signal: string | null; email_status: string | null; underlag_text: string }

export default function AdminUnderlagFunnel({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [data, setData] = useState<{ funnels: Record<string, Row[]>; submissions: Sub[] } | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    supabase.functions.invoke("funnel-stats", { body: { token, action: "underlag" } }).then(({ data, error }) => {
      if (error || data?.error) {
        if (String(data?.error || "").includes("Logga in")) onSessionExpired?.();
        return;
      }
      setData(data);
    });
  }, [token, onSessionExpired]);

  if (!data) return null;

  const Funnel = ({ title, rows }: { title: string; rows: Row[] }) => {
    const first = rows[0]?.count || 0;
    const max = Math.max(1, ...rows.map((r) => r.count));
    return (
      <div className="min-w-0">
        <h4 className="font-semibold text-sm mb-2">{title}</h4>
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.key} className="text-xs">
              <div className="flex justify-between gap-2">
                <span>{LABELS[r.key]}</span>
                <span className="tabular-nums">{r.count}{first ? ` · ${Math.round((r.count / first) * 100)} %` : ""}</span>
              </div>
              <div className="h-2 rounded bg-muted mt-0.5"><div className="h-2 rounded bg-primary" style={{ width: `${(r.count / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-8">
      <Card>
        <CardHeader><CardTitle>Köpresan steg för steg, 30 dagar</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">Unika sessioner per steg. Andel räknas mot första steget. Alla besökare räknas.</p>
          <div className="grid gap-6 md:grid-cols-3">
            <Funnel title="Finance & Supply Chain Management" rows={data.funnels.fscm || []} />
            <Funnel title="CRM" rows={data.funnels.crm || []} />
            <Funnel title="Totalt" rows={data.funnels.all || []} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Skickade underlag</CardTitle></CardHeader>
        <CardContent>
          {data.submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga skickade underlag ännu.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {data.submissions.map((s) => (
                <li key={s.id} className="py-2">
                  <button type="button" className="w-full text-left flex flex-wrap justify-between gap-2" onClick={() => setOpen(open === s.id ? null : s.id)}>
                    <span><span className="font-medium">{s.company}</span> · {s.name} · {s.email}{s.phone ? ` · ${s.phone}` : ""}</span>
                    <span className="text-xs text-muted-foreground">{s.created_at.slice(0, 10)} · köpsignal {s.buying_signal ?? "–"} · e-post {s.email_status ?? "–"}</span>
                  </button>
                  {open === s.id && <pre className="mt-2 whitespace-pre-wrap break-words text-xs bg-muted/40 rounded p-3">{s.underlag_text}</pre>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
