import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { JOURNEY_LABEL, type JourneyType } from "@/lib/journeyFunnels";

interface Funnel {
  key: JourneyType; entries: number; progressed: number; progression_rate: number | null;
  hand_raise_journeys: number; hand_raise_submits: number; hand_raise_rate: number | null;
  registered_cases: number; qualified_needs: number; qualified_need_rate: number | null;
  introductions: number; introduction_rate: number | null;
  meetings_requested: number; meetings_held: number; meeting_held_rate: number | null;
  selfservice_journeys: number; selfservice_clicks: number; selfservice_rate: number | null;
  direct_partner_requests: number;
  verification: Record<string, Record<string, number>>;
}
interface Data { days: number; since: string; funnels: Funnel[] }

const pct = (v: number | null) => (v == null ? "–" : `${v.toLocaleString("sv-SE")} %`);
const STATUS_LABEL: Record<string, string> = {
  verified: "Verifierad", partner_confirmed: "Bekräftad av partnern", vendor_confirmed: "Bekräftad av leverantören", compiled: "Sammanställd", "okänd": "Okänd",
};
const LEVEL_LABEL: Record<string, string> = { progression: "Progression", contact_d365: "Kontakt till d365.se", selfservice: "Självservice till leverantör" };

/**
 * Sprint 2.2: funnel per köpväg i tre nivåer (progression, Hand Raise till d365.se, leverantörskontakt).
 * Självservice, kontakt till d365.se och förmedlad kontakt redovisas i separata kolumner och blandas aldrig.
 * Jämförelsen per informationsstatus är bara analys och ändrar aldrig ranking.
 */
export default function JourneyFunnelsCard({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [days, setDays] = useState("30");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true); setFailed(false);
    supabase.functions.invoke("funnel-stats", { body: { token, action: "journey_funnels", days: Number(days) } })
      .then(({ data: d, error }) => {
        if (error || d?.error) { if (/Logga in|session/i.test(String(d?.error || ""))) onSessionExpired?.(); setFailed(true); return; }
        setData(d as Data);
      })
      .finally(() => setLoading(false));
  }, [token, days, onSessionExpired]);

  const th = "py-1 px-2 text-right font-normal";
  const td = "py-1.5 px-2 text-right tabular-nums";

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle as="h2" className="text-lg">Funnel per köpväg</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Unika resor (anonymt resenummer). Hand Raise, kvalificerat behov, introduktion och möte räknas mot registrerade ärenden.
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
      <CardContent className="space-y-6">
        {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Hämtar…</p>}
        {failed && !loading && <p className="text-sm text-destructive">Rapporten kunde inte hämtas just nu.</p>}
        {data && !loading && (
          <>
            <div className="overflow-x-auto">
              <p className="mb-1 text-sm font-semibold">Progression och kontakt till d365.se</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="py-1 pr-2 font-normal">Köpväg</th>
                    <th className={th}>Entries</th>
                    <th className={th}>Progression</th>
                    <th className={th}>Hand Raise</th>
                    <th className={th}>Ärenden</th>
                    <th className={th}>Kvalificerat behov</th>
                    <th className={th}>Introduktion</th>
                    <th className={th}>Möte genomfört</th>
                  </tr>
                </thead>
                <tbody>
                  {data.funnels.map((f) => (
                    <tr key={f.key} className="border-t border-border">
                      <td className="py-1.5 pr-2">{JOURNEY_LABEL[f.key]}</td>
                      <td className={td}>{f.entries}</td>
                      <td className={td}>{pct(f.progression_rate)}</td>
                      <td className={td}>{pct(f.hand_raise_rate)} <span className="text-muted-foreground">({f.hand_raise_journeys})</span></td>
                      <td className={td}>{f.registered_cases}</td>
                      <td className={td}>{pct(f.qualified_need_rate)}</td>
                      <td className={td}>{pct(f.introduction_rate)} <span className="text-muted-foreground">({f.introductions})</span></td>
                      <td className={td}>{pct(f.meeting_held_rate)} <span className="text-muted-foreground">({f.meetings_held})</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <p className="mb-1 text-sm font-semibold">Tre kontaktvägar, redovisade var för sig</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="py-1 pr-2 font-normal">Köpväg</th>
                    <th className={th}>Självservice till leverantör</th>
                    <th className={th}>Kontakt till d365.se</th>
                    <th className={th}>Förmedlad kontakt</th>
                    <th className={th}>Möte begärt</th>
                  </tr>
                </thead>
                <tbody>
                  {data.funnels.map((f) => (
                    <tr key={f.key} className="border-t border-border">
                      <td className="py-1.5 pr-2">{JOURNEY_LABEL[f.key]}</td>
                      <td className={td}>{f.selfservice_clicks} <span className="text-muted-foreground">({pct(f.selfservice_rate)})</span></td>
                      <td className={td}>{f.hand_raise_submits}</td>
                      <td className={td}>
                        {f.introductions}
                        {f.key === "partner" && <span className="block text-[11px] text-muted-foreground">+ {f.direct_partner_requests} direktförfrågningar</span>}
                      </td>
                      <td className={td}>{f.meetings_requested}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-1 text-xs text-muted-foreground">
                Förmedlad kontakt = introduktion efter köparens godkännande. Direktförfrågningar är köparens egna förfrågningar till valda partners med samtycke per partner.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold">Beteende per informationsstatus</p>
              <p className="mb-2 text-xs text-muted-foreground">
                Endast analys. Ändrar aldrig ranking eller ordning. Partnerhändelser utan sparad status visar partnerns nuvarande status.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {data.funnels.filter((f) => f.key === "partner" || f.key === "isv").map((f) => (
                  <div key={f.key} className="rounded-md border border-border p-3 text-xs">
                    <p className="mb-1 font-semibold">{JOURNEY_LABEL[f.key]}</p>
                    {Object.keys(f.verification).length === 0 ? <p className="text-muted-foreground">Inga händelser ännu.</p> : (
                      <ul className="space-y-1">
                        {Object.entries(f.verification).map(([level, by]) => (
                          <li key={level}>
                            <span className="text-muted-foreground">{LEVEL_LABEL[level] ?? level}:</span>{" "}
                            {Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${STATUS_LABEL[k] ?? k} ${n}`).join(" · ")}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
