import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Plus, Trash2, Youtube } from "lucide-react";
import {
  VIDEO_PRODUCT_GROUPS,
  videoProductLabel,
  videoQuestionLabel,
} from "@/lib/d365VideoTaxonomy";

type Source = {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_url: string | null;
  is_active: boolean;
  last_fetched_at: string | null;
  last_error: string | null;
  items_imported: number;
};

type Video = {
  id: string;
  youtube_id: string;
  title: string;
  channel_name: string | null;
  published_at: string | null;
  summary_sv: string | null;
  product_groups: string[];
  question_types: string[];
  relevance_score: number;
  status: "new" | "published" | "hidden";
};

type State = {
  last_run_at: string | null;
  last_result: string | null;
  paused_reason: string | null;
} | null;

interface Props {
  token: string;
  onSessionExpired: () => void;
}

export default function AdminVideosTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [sources, setSources] = useState<Source[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [state, setState] = useState<State>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"alla" | "new" | "published" | "hidden">("alla");
  const [productFilter, setProductFilter] = useState<string>("alla");
  const [newSource, setNewSource] = useState({ channel_id: "", channel_name: "" });

  async function call(action: string, extra: Record<string, unknown> = {}) {
    const { data, error } = await supabase.functions.invoke("manage-d365-videos", {
      body: { action, token, ...extra },
    });
    if (error) throw error;
    if (data?.error) {
      if (String(data.error).toLowerCase().includes("session")) onSessionExpired();
      throw new Error(data.error);
    }
    return data;
  }

  async function load() {
    setLoading(true);
    try {
      const r = await call("list");
      setSources(r.sources ?? []);
      setVideos(r.videos ?? []);
      setState(r.state ?? null);
    } catch (e) {
      toast({ title: "Kunde inte hämta videor", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runNow(sourceId?: string) {
    setRunning(true);
    try {
      const r = await call("run-now", sourceId ? { source_id: sourceId, force: true } : { force: true });
      toast({ title: "Inläsning klar", description: JSON.stringify(r.result?.summary ?? r.result ?? {}).slice(0, 200) });
      await load();
    } catch (e) {
      toast({ title: "Inläsningen misslyckades", description: (e as Error).message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  }

  async function addSource() {
    if (!newSource.channel_id.trim() || !newSource.channel_name.trim()) return;
    try {
      await call("create-source", { source: { ...newSource, is_active: true } });
      setNewSource({ channel_id: "", channel_name: "" });
      toast({ title: "Kanal tillagd" });
      await load();
    } catch (e) {
      toast({ title: "Kunde inte lägga till kanal", description: (e as Error).message, variant: "destructive" });
    }
  }

  async function toggleSource(s: Source, active: boolean) {
    try {
      await call("update-source", {
        source: { id: s.id, channel_id: s.channel_id, channel_name: s.channel_name, channel_url: s.channel_url, is_active: active },
      });
      await load();
    } catch (e) {
      toast({ title: "Kunde inte uppdatera kanalen", description: (e as Error).message, variant: "destructive" });
    }
  }

  async function deleteSource(id: string) {
    if (!confirm("Ta bort kanalen?")) return;
    try {
      await call("delete-source", { id });
      await load();
    } catch (e) {
      toast({ title: "Kunde inte ta bort", description: (e as Error).message, variant: "destructive" });
    }
  }

  async function setVideoStatus(v: Video, status: Video["status"]) {
    try {
      await call("update-video", { video: { id: v.id, status } });
      setVideos((prev) => prev.map((x) => (x.id === v.id ? { ...x, status } : x)));
    } catch (e) {
      toast({ title: "Kunde inte uppdatera videon", description: (e as Error).message, variant: "destructive" });
    }
  }

  const filtered = useMemo(
    () =>
      videos.filter((v) => {
        if (statusFilter !== "alla" && v.status !== statusFilter) return false;
        if (productFilter !== "alla" && !v.product_groups?.includes(productFilter)) return false;
        return true;
      }),
    [videos, statusFilter, productFilter],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Youtube className="h-4 w-4" /> YouTube-kanaler
          </CardTitle>
          <Button size="sm" onClick={() => runNow()} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span className="ml-2">Kör inläsning nu</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {state && (
            <p className="text-xs text-muted-foreground">
              Senaste körning: {state.last_run_at ? new Date(state.last_run_at).toLocaleString("sv-SE") : "–"}
              {state.paused_reason ? ` · Pausad: ${state.paused_reason}` : ""}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
            <div>
              <Label className="text-xs">Kanal-ID, @handle eller URL</Label>
              <Input
                value={newSource.channel_id}
                onChange={(e) => setNewSource((s) => ({ ...s, channel_id: e.target.value }))}
                placeholder="@MSFTMechanics"
              />
            </div>
            <div>
              <Label className="text-xs">Namn</Label>
              <Input
                value={newSource.channel_name}
                onChange={(e) => setNewSource((s) => ({ ...s, channel_name: e.target.value }))}
                placeholder="Microsoft Mechanics"
              />
            </div>
            <Button onClick={addSource} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Lägg till
            </Button>
          </div>

          <div className="divide-y divide-border rounded-lg border border-border">
            {sources.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium">{s.channel_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.channel_id} · {s.items_imported} importerade
                    {s.last_error ? ` · Fel: ${s.last_error}` : ""}
                  </p>
                </div>
                <Switch checked={s.is_active} onCheckedChange={(c) => toggleSource(s, c)} />
                <Button size="sm" variant="ghost" onClick={() => runNow(s.id)} disabled={running}>
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteSource(s.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {sources.length === 0 && <p className="p-3 text-sm text-muted-foreground">Inga kanaler ännu.</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Videor ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["alla", "published", "new", "hidden"] as const).map((s) => (
              <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)}>
                {s === "alla" ? "Alla" : s === "published" ? "Publicerade" : s === "new" ? "Nya" : "Dolda"}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={productFilter === "alla" ? "secondary" : "ghost"} onClick={() => setProductFilter("alla")}>
              Alla produkter
            </Button>
            {VIDEO_PRODUCT_GROUPS.map((p) => (
              <Button key={p} size="sm" variant={productFilter === p ? "secondary" : "ghost"} onClick={() => setProductFilter(p)}>
                {videoProductLabel(p)}
              </Button>
            ))}
          </div>

          {loading && <Loader2 className="h-4 w-4 animate-spin" />}

          <div className="divide-y divide-border rounded-lg border border-border">
            {filtered.map((v) => (
              <div key={v.id} className="flex flex-wrap items-start gap-3 p-3">
                <img
                  src={`https://i.ytimg.com/vi/${v.youtube_id}/default.jpg`}
                  alt=""
                  className="h-14 w-24 rounded object-cover"
                  loading="lazy"
                />
                <div className="flex-1 min-w-[240px] space-y-1">
                  <a
                    href={`https://www.youtube.com/watch?v=${v.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    {v.title}
                  </a>
                  {v.summary_sv && <p className="text-xs text-muted-foreground line-clamp-2">{v.summary_sv}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {v.product_groups?.map((p) => (
                      <Badge key={p} variant="secondary" className="text-[10px]">
                        {videoProductLabel(p)}
                      </Badge>
                    ))}
                    {v.question_types?.map((q) => (
                      <Badge key={q} variant="outline" className="text-[10px]">
                        {videoQuestionLabel(q)}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-[10px]">
                      Relevans {v.relevance_score}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={v.status === "published" ? "default" : "outline"}
                    onClick={() => setVideoStatus(v, "published")}
                  >
                    Publicera
                  </Button>
                  <Button
                    size="sm"
                    variant={v.status === "hidden" ? "default" : "outline"}
                    onClick={() => setVideoStatus(v, "hidden")}
                  >
                    Dölj
                  </Button>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">Inga videor matchar filtret.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
