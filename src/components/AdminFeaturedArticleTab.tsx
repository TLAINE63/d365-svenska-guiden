import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Save, Smartphone, Tablet, Monitor } from "lucide-react";
import { BLOG_ARTICLES } from "@/data/blogArticles";
import FeaturedArticleBanner from "@/components/FeaturedArticleBanner";

const SETTING_KEY = "featured_article_slug";

interface Props {
  token: string | null;
  onSessionExpired: () => void;
}

const formatDate = (iso: string) => iso.replace(/-/g, "/");

export default function AdminFeaturedArticleTab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [originalSlug, setOriginalSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=${SETTING_KEY}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        });
        if (res.status === 401) {
          onSessionExpired();
          return;
        }
        const data = await res.json();
        const current = (data?.template ?? "").trim();
        setSelectedSlug(current);
        setOriginalSlug(current);
      } catch (err) {
        console.error("load featured article slug failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, onSessionExpired]);

  const save = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ template: selectedSlug, template_key: SETTING_KEY }),
      });
      if (res.status === 401) {
        onSessionExpired();
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      setOriginalSlug(selectedSlug);
      toast({ title: "Sparat", description: "Featured artikel uppdaterad." });
    } catch (err: any) {
      toast({ title: "Kunde inte spara", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const sortedArticles = [...BLOG_ARTICLES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[hsl(var(--cta-orange))]" />
          Nytt i Kunskapscentret – bannern på startsidan
        </CardTitle>
        <CardDescription>
          Välj vilken artikel som ska lyftas i bannern överst i "Så här arbetar vi"-sektionen.
          Välj "Senaste publicerade" för att alltid visa den nyaste artikeln automatiskt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Läser in…</p>
        ) : (
          <>
            <RadioGroup value={selectedSlug} onValueChange={setSelectedSlug} className="space-y-2">
              <Label
                htmlFor="auto"
                className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value="" id="auto" className="mt-0.5" />
                <div>
                  <div className="font-medium">Senaste publicerade (auto)</div>
                  <div className="text-xs text-muted-foreground">
                    Visar automatiskt artikeln med senast publishedAt-datum.
                  </div>
                </div>
              </Label>

              {sortedArticles.map((a) => (
                <Label
                  key={a.slug}
                  htmlFor={a.slug}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value={a.slug} id={a.slug} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium leading-snug">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(a.publishedAt)} · {a.category} · {a.readingTimeMinutes} min
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            <div className="flex items-center gap-3 pt-2 border-t">
              <Button
                onClick={save}
                disabled={saving || selectedSlug === originalSlug}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Sparar…" : "Spara"}
              </Button>
              {selectedSlug !== originalSlug && (
                <span className="text-xs text-muted-foreground">Osparade ändringar</span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
