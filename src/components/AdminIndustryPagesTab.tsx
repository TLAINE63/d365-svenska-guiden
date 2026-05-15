import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ExternalLink, Eye, EyeOff, Loader2 } from "lucide-react";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";

interface Page {
  id: string;
  slug: string;
  name: string;
  is_published: boolean;
  ai_generated_at: string | null;
  updated_at: string;
}

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

export default function AdminIndustryPagesTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const apikey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const headers = () => ({
    Authorization: `Bearer ${token}`,
    apikey,
    "Content-Type": "application/json",
  });

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/functions/v1/manage-industry-pages?action=list`, {
        headers: headers(),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      setPages(data.pages || []);
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const generate = async (slug: string, name: string) => {
    setBusySlug(slug);
    try {
      const res = await fetch(`${baseUrl}/functions/v1/generate-industry-page`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ industry_slug: slug, industry_name: name }),
      });
      if (res.status === 401) return onSessionExpired();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Genereringen misslyckades");
      toast({ title: "Klart", description: `${name} har genererats. Granska och publicera.` });
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    } finally {
      setBusySlug(null);
    }
  };

  const togglePublish = async (id: string, is_published: boolean) => {
    try {
      const res = await fetch(`${baseUrl}/functions/v1/manage-industry-pages?action=toggle-publish`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ id, is_published: !is_published }),
      });
      if (res.status === 401) return onSessionExpired();
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kunde inte uppdatera");
      }
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e.message, variant: "destructive" });
    }
  };

  const byMSlug = new Map(pages.map((p) => [p.slug, p]));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Branschsidor</h2>
          <p className="text-sm text-muted-foreground">
            Generera AI-utkast per bransch, granska och publicera. Sidorna visas på <code>/branscher/&lt;slug&gt;</code>.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Laddar…</div>
        ) : (
          <div className="space-y-2">
            {STANDARD_INDUSTRIES.map((ind) => {
              const page = byMSlug.get(ind.slug);
              const isBusy = busySlug === ind.slug;
              return (
                <div
                  key={ind.slug}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">{ind.name}</span>
                      {page?.is_published ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Publicerad</Badge>
                      ) : page ? (
                        <Badge variant="outline">Utkast</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Saknas</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      /branscher/{ind.slug}
                      {page?.ai_generated_at && ` · genererad ${new Date(page.ai_generated_at).toLocaleString("sv-SE")}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generate(ind.slug, ind.name)}
                      disabled={isBusy}
                    >
                      {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span className="ml-1">{page ? "Generera om" : "Generera med AI"}</span>
                    </Button>
                    {page && (
                      <>
                        <Button
                          size="sm"
                          variant={page.is_published ? "outline" : "default"}
                          onClick={() => togglePublish(page.id, page.is_published)}
                        >
                          {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="ml-1">{page.is_published ? "Avpublicera" : "Publicera"}</span>
                        </Button>
                        <a
                          href={`/branscher/${ind.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Öppna <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6">
          Tips: redigering av enskilda fält görs i nästa version. Just nu kan du generera om för att uppdatera innehåll.
        </p>
      </CardContent>
    </Card>
  );
}
