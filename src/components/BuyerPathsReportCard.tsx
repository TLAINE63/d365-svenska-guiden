import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { PLACEMENT_LABEL } from "@/lib/advisory";

interface Ev { name: string; label: string; kind: "click" | "submit"; total: number; sessions: number; breakdown: { value: string; count: number }[] }
interface Path { key: string; label: string; clicks: number; submits: number; events: Ev[]; registered: { key: string; count: number }[] }
interface Data { days: number; since: string; paths: Path[] }

/** Läsbara namn för uppräknade värden. Okända värden visas som de är. */
const VALUE_LABEL: Record<string, string> = {
  hero_new_crm_erp: "Nytt CRM- eller affärssystem (ERP)",
  hero_cost: "Vad det kostar",
  hero_existing_dynamics: "Använder redan Dynamics 365",
  hero_competence: "Dynamics 365-kompetens",
  partner: "Partner",
  expert: "Expert eller konsult",
  unsure: "Osäker",
  verified: "Verifierad av d365.se",
  partner_confirmed: "Bekräftad av partnern",
  compiled: "Sammanställd av d365.se",
  alla: "Alla",
  "övrigt": "Övrigt",
};
const REGISTERED_LABEL: Record<string, string> = { ...PLACEMENT_LABEL, kompetens_behov: "Kompetensbehov (formulär)" };

/**
 * Rapport per köpväg: aggregerade klick och inskick från anonym mätning, plus antal registrerade
 * ärenden per ingång. Visar aldrig namn, e-post, telefon eller fritext. Delas av /redaktion och admin.
 */
export default function BuyerPathsReportCard({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [days, setDays] = useState("30");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true); setFailed(false);
    supabase.functions.invoke("funnel-stats", { body: { token, action: "buyer_paths", days: Number(days) } })
      .then(({ data: d, error }) => {
        if (error || d?.error) { if (/Logga in|session/i.test(String(d?.error || ""))) onSessionExpired?.(); setFailed(true); return; }
        setData(d as Data);
      })
      .finally(() => setLoading(false));
  }, [token, days, onSessionExpired]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle as="h2" className="text-lg">Klick och inskick per köpväg</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Aggregerade antal. Inga namn, e-postadresser, telefonnummer eller fritexter visas.
            {data && <> Från {data.since}.</>}
          </p>
        </div>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-40" aria-label="Period"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Senaste 7 dagarna</SelectItem>
            <SelectItem value="30">Senaste 30 dagarna</SelectItem>
            <SelectItem value="90">Senaste 90 dagarna</SelectItem>
            <SelectItem value="365">Senaste året</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Hämtar…</p>}
        {failed && !loading && <p className="text-sm text-destructive">Rapporten kunde inte hämtas just nu.</p>}
        {data && !loading && (
          <>
            <div className="mb-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="py-1 font-normal">Köpväg</th>
                    <th className="py-1 text-right font-normal">Klick</th>
                    <th className="py-1 text-right font-normal">Inskick (mätning)</th>
                    <th className="py-1 text-right font-normal">Registrerade ärenden</th>
                  </tr>
                </thead>
                <tbody>
                  {data.paths.map((p) => (
                    <tr key={p.key} className="border-t border-border">
                      <td className="py-1.5">{p.label}</td>
                      <td className="py-1.5 text-right tabular-nums">{p.clicks}</td>
                      <td className="py-1.5 text-right tabular-nums">{p.events.some((e) => e.kind === "submit") ? p.submits : "–"}</td>
                      <td className="py-1.5 text-right tabular-nums">{p.registered.length ? p.registered.reduce((a, r) => a + r.count, 0) : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              {data.paths.map((p) => (
                <details key={p.key} className="rounded-md border border-border p-3">
                  <summary className="cursor-pointer text-sm font-semibold">{p.label}</summary>
                  <table className="mt-3 w-full text-xs">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="font-normal">Händelse</th>
                        <th className="text-right font-normal">Antal</th>
                        <th className="text-right font-normal">Unika besök</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.events.map((e) => (
                        <tr key={e.name} className="border-t border-border align-top">
                          <td className="py-1">
                            <span>{e.label}</span>{" "}
                            <span className="text-muted-foreground">({e.kind === "submit" ? "inskick" : "klick"} · <code>{e.name}</code>)</span>
                            {e.breakdown.length > 0 && (
                              <ul className="mt-1 space-y-0.5 pl-3 text-muted-foreground">
                                {e.breakdown.slice(0, 12).map((b) => <li key={b.value}>{VALUE_LABEL[b.value] ?? b.value}: <span className="tabular-nums">{b.count}</span></li>)}
                              </ul>
                            )}
                          </td>
                          <td className="py-1 text-right tabular-nums">{e.total}</td>
                          <td className="py-1 text-right tabular-nums">{e.sessions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {p.registered.length > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Registrerade ärenden: {p.registered.map((r) => `${REGISTERED_LABEL[r.key] ?? r.key} ${r.count}`).join(" · ")}
                    </p>
                  )}
                </details>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Klick och inskick (mätning) kommer från sajtens anonyma mätning och kan saknas om mätningen blockeras i webbläsaren. Registrerade ärenden räknar alla sparade inskick.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
