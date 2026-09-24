import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Step { key: string; label: string; count: number }

export default function AdminCompetenceFunnel({ token, onSessionExpired }: { token: string | null; onSessionExpired?: () => void }) {
  const [days, setDays] = useState("30");
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    supabase.functions
      .invoke("funnel-stats", { body: { token, action: "competence", days: Number(days) } })
      .then(({ data, error }) => {
        if (error || data?.error) {
          if (String(data?.error || "").includes("ut")) onSessionExpired?.();
          return;
        }
        setSteps(data.steps);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, days]);

  const top = steps?.[0]?.count || 0;
  let worst = -1, worstRate = 2;
  steps?.forEach((s, i) => {
    if (i === 0) return;
    const prev = steps[i - 1].count;
    if (prev > 0 && s.count / prev < worstRate) { worstRate = s.count / prev; worst = i; }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kompetensresan</CardTitle>
        <p className="text-sm text-muted-foreground">
          Unika besök per steg på Hitta rätt Dynamics&nbsp;365-kompetens. Mäts från 2026-09-24. Största tappet markeras i rött.
        </p>
        <div className="flex gap-2 pt-2">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dagar</SelectItem>
              <SelectItem value="30">30 dagar</SelectItem>
              <SelectItem value="90">90 dagar</SelectItem>
            </SelectContent>
          </Select>
          {loading && <Loader2 className="h-5 w-5 animate-spin self-center text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps?.map((s, i) => {
          const prev = i > 0 ? steps[i - 1].count : 0;
          const rate = i > 0 && prev > 0 ? Math.round((s.count / prev) * 100) : null;
          const width = top ? Math.max(2, (s.count / top) * 100) : 2;
          const bad = i === worst;
          return (
            <div key={s.key}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.label}</span>
                <span className="tabular-nums">
                  <span className="font-bold">{s.count}</span>
                  {rate !== null && <span className={bad ? "ml-2 text-destructive font-semibold" : "ml-2 text-muted-foreground"}>{rate}% av föregående</span>}
                </span>
              </div>
              <div className="mt-1 h-3 rounded bg-muted">
                <div className={`h-3 rounded ${bad ? "bg-destructive" : "bg-primary"}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
