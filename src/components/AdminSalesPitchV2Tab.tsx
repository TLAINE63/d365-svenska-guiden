import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, RefreshCw, Filter, AlertCircle, CheckCircle2 } from "lucide-react";

type SegmentKey = "published" | "in_progress" | "profile_only" | "manual";

interface PartnerRow {
  id: string;
  name: string;
  email: string | null;
  admin_contact_email: string | null;
  admin_contact_name: string | null;
  contact_person: string | null;
  is_featured: boolean;
}

interface Template {
  key: SegmentKey;
  label: string;
  description: string;
  subject: string;
  body: string;
}

const PRICING_BLOCK = ` 1 produktområde: 995 kr/mån

 2 produktområden: 1 595 kr/mån

 3 produktområden: 1 995 kr/mån

 Priset ligger fast under 2026

 3 månaders uppsägningstid`;

const DEFAULT_TEMPLATES: Record<SegmentKey, Template> = {
  published: {
    key: "published",
    label: "1. Redan publicerade",
    description: "Partners som är live på d365.se (is_featured = true).",
    subject: "d365.se – nästa steg",
    body: `Hej [NAMN],

Tack för att ni redan är live på d365.se.

Det gör stor skillnad i den här fasen.

Vi går nu vidare och öppnar upp plattformen bredare, med fokus på att få in tillräckligt många relevanta partners så att kunder faktiskt kan jämföra alternativ på riktigt.

I samband med detta introducerar vi ett enklare upplägg:

Detta gäller:

${PRICING_BLOCK}

Detta ersätter tidigare modell i denna fas.

Ni ligger redan bra till – och är en del av den grupp som sätter strukturen framåt.

Vill ni fortsätta vara med enligt detta upplägg, svara bara "ok" så löser vi resten.

Allt gott,
Thomas & Michael`,
  },
  in_progress: {
    key: "in_progress",
    label: "2. Påbörjad profil",
    description: "Partners som har en partner_submission men inte är publicerade ännu.",
    subject: "d365.se – ni är nästan klara",
    body: `Hej [NAMN],

Ni har redan, sedan tidigare, påbörjat er profil på d365.se – vilket är helt rätt i detta läge.

Vi har nu justerat upplägget för att snabbare få upp bredden i plattformen.

Det innebär:

Detta gäller:

${PRICING_BLOCK}

Ni är i praktiken bara ett steg från att vara live.

Säg till om ni vill att vi hjälper er färdigställa profilen, eller svara "ok" så aktiverar vi er.

Allt gott,
Thomas & Michael`,
  },
  profile_only: {
    key: "profile_only",
    label: "3. Endast profileringsmail (27 april)",
    description: "Partners som fått profileringsmailet 27 april men inte har submission eller är publicerade.",
    subject: "Nästa steg för d365.se",
    body: `Hej [NAMN],

Sedan vi skickade ut informationen i slutet av april har vi haft dialog med ett antal partners kring d365.se.

En tydlig slutsats är att vi nu behöver bygga upp en bredare partnerbas, så att kunder faktiskt kan jämföra alternativ på riktigt.

Därför justerar vi upplägget i denna fas.

Detta gäller:

${PRICING_BLOCK}

Fokus nu är att få med rätt partners i denna fas, innan vi skalar upp innehåll och synlighet ytterligare.

Vill ni vara med, svara bara "ok" så aktiverar vi er.

Allt gott,
Thomas & Michael`,
  },
  manual: {
    key: "manual",
    label: "4. Alla partners (manuellt val)",
    description: "Visa alla partners i databasen — välj fritt vilka som ska få mailet och redigera ämne/text.",
    subject: "d365.se",
    body: `Hej [NAMN],

[Skriv ditt eget meddelande här.]

Allt gott,
Thomas & Michael`,
  },
};

const STORAGE_KEY = "admin_sales_pitch_v2_templates";

interface Props {
  token: string;
  onSessionExpired: () => void;
}

export default function AdminSalesPitchV2Tab({ token, onSessionExpired }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [submissionPartnerIds, setSubmissionPartnerIds] = useState<Set<string>>(new Set());
  const [profileRefreshEmails, setProfileRefreshEmails] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<SegmentKey>("published");
  const [search, setSearch] = useState("");
  const [emailOverrides, setEmailOverrides] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<SegmentKey, Set<string>>>({
    published: new Set(),
    in_progress: new Set(),
    profile_only: new Set(),
  });

  const [templates, setTemplates] = useState<Record<SegmentKey, Template>>(() => {
    if (typeof window === "undefined") return DEFAULT_TEMPLATES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_TEMPLATES;
      const stored = JSON.parse(raw);
      return {
        published: { ...DEFAULT_TEMPLATES.published, ...stored.published },
        in_progress: { ...DEFAULT_TEMPLATES.in_progress, ...stored.in_progress },
        profile_only: { ...DEFAULT_TEMPLATES.profile_only, ...stored.profile_only },
      };
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const persistTemplates = (next: Record<SegmentKey, Template>) => {
    setTemplates(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-partners", {
        body: { action: "get-sales-pitch-segments", token },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPartners((data.partners || []) as PartnerRow[]);
      setSubmissionPartnerIds(new Set<string>((data.submission_partner_ids || []) as string[]));
      const emails = new Set<string>();
      ((data.april27_emails || []) as string[]).forEach((e) => {
        if (e) emails.add(String(e).toLowerCase().trim());
      });
      setProfileRefreshEmails(emails);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Kunde inte ladda partners", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const segmentPartners = useMemo(() => {
    const published: PartnerRow[] = [];
    const inProgress: PartnerRow[] = [];
    const profileOnly: PartnerRow[] = [];

    for (const p of partners) {
      const recipientEmail = (p.admin_contact_email || p.email || "").toLowerCase().trim();
      const gotApril27 = recipientEmail && profileRefreshEmails.has(recipientEmail);
      const hasSubmission = submissionPartnerIds.has(p.id);

      if (p.is_featured) {
        published.push(p);
      } else if (hasSubmission) {
        inProgress.push(p);
      } else if (gotApril27) {
        profileOnly.push(p);
      }
    }

    return { published, in_progress: inProgress, profile_only: profileOnly };
  }, [partners, submissionPartnerIds, profileRefreshEmails]);

  const currentList = segmentPartners[activeTab];

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return currentList;
    return currentList.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.admin_contact_email || "").toLowerCase().includes(q)
    );
  }, [currentList, search]);

  const currentSelected = selected[activeTab];

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev[activeTab]);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, [activeTab]: next };
    });
  };

  const toggleAllVisible = () => {
    const allSelected = filteredList.every(p => currentSelected.has(p.id));
    setSelected(prev => {
      const next = new Set(prev[activeTab]);
      if (allSelected) {
        filteredList.forEach(p => next.delete(p.id));
      } else {
        filteredList.forEach(p => {
          if (resolveEmail(p)) next.add(p.id);
        });
      }
      return { ...prev, [activeTab]: next };
    });
  };

  const resolveEmail = (p: PartnerRow): string => {
    return (emailOverrides[p.id]?.trim() || p.admin_contact_email?.trim() || p.email?.trim() || "").trim();
  };

  const resolveContactName = (p: PartnerRow): string => {
    return p.admin_contact_name || p.contact_person || p.name;
  };

  const updateTemplateField = (field: "subject" | "body", value: string) => {
    persistTemplates({
      ...templates,
      [activeTab]: { ...templates[activeTab], [field]: value },
    });
  };

  const resetTemplate = () => {
    if (!confirm("Återställ mallen för detta segment till standardtexten?")) return;
    persistTemplates({ ...templates, [activeTab]: DEFAULT_TEMPLATES[activeTab] });
  };

  const previewBody = useMemo(() => {
    const sample = filteredList.find(p => currentSelected.has(p.id)) || filteredList[0];
    const name = sample ? resolveContactName(sample) : "[NAMN]";
    return templates[activeTab].body.replace(/\[NAMN\]/g, name);
  }, [templates, activeTab, currentSelected, filteredList]);

  const sendBulk = async () => {
    const ids = Array.from(currentSelected);
    if (ids.length === 0) {
      toast({ title: "Inga partners valda", variant: "destructive" });
      return;
    }
    const partnerList = ids
      .map(id => partners.find(p => p.id === id))
      .filter(Boolean)
      .map(p => ({
        id: p!.id,
        name: p!.name,
        email: resolveEmail(p!),
        contact_name: resolveContactName(p!),
      }))
      .filter(p => p.email && /\S+@\S+\.\S+/.test(p.email));

    if (partnerList.length === 0) {
      toast({ title: "Inga giltiga e-postadresser", variant: "destructive" });
      return;
    }

    const tpl = templates[activeTab];
    if (!confirm(
      `Skicka "${tpl.subject}" till ${partnerList.length} partner(s) i segmentet "${tpl.label}"?\n\nDet går inte att ångra.`
    )) return;

    setSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-sales-pitch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            partners: partnerList,
            subject: tpl.subject,
            body: tpl.body,
          }),
        }
      );
      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut", variant: "destructive" });
        onSessionExpired();
        return;
      }
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Kunde inte skicka mail");
      }
      const data = await response.json();
      toast({
        title: data.message || `Skickat till ${partnerList.length} partners`,
        description: `Segment: ${tpl.label}`,
      });
      setSelected(prev => ({ ...prev, [activeTab]: new Set() }));
    } catch (err: any) {
      console.error("send error", err);
      toast({ title: "Fel vid utskick", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-pink-300" />
                <h2 className="text-xl font-bold">Införsäljning v2 — segmenterade utskick</h2>
              </div>
              <p className="text-slate-300 text-sm max-w-2xl">
                Tre olika mallar för tre partnersegment. Redigera ämne &amp; brödtext, välj exakt vilka som ska få mailet, och skicka i bulk. Mallar sparas lokalt i din webbläsare. Mottagaradress: <code className="text-xs">admin_contact_email</code> i första hand, annars publik e-post.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" /> Uppdatera data
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">Publicerade: {segmentPartners.published.length}</Badge>
            <Badge variant="secondary">Påbörjad profil: {segmentPartners.in_progress.length}</Badge>
            <Badge variant="secondary">Endast 27/4-mail: {segmentPartners.profile_only.length}</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SegmentKey)}>
        <TabsList className="grid grid-cols-3 w-full">
          {(Object.keys(DEFAULT_TEMPLATES) as SegmentKey[]).map(k => (
            <TabsTrigger key={k} value={k} className="flex items-center gap-2">
              {DEFAULT_TEMPLATES[k].label}
              <Badge variant="outline" className="ml-1">{segmentPartners[k].length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(DEFAULT_TEMPLATES) as SegmentKey[]).map(k => (
          <TabsContent key={k} value={k} className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Mall — {DEFAULT_TEMPLATES[k].label}
                </CardTitle>
                <CardDescription>{DEFAULT_TEMPLATES[k].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`subj-${k}`}>Ämne</Label>
                  <Input
                    id={`subj-${k}`}
                    value={templates[k].subject}
                    onChange={(e) => updateTemplateField("subject", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`body-${k}`}>
                    Brödtext (använd <code className="text-xs">[NAMN]</code> för mottagarens kontaktnamn)
                  </Label>
                  <Textarea
                    id={`body-${k}`}
                    value={templates[k].body}
                    onChange={(e) => updateTemplateField("body", e.target.value)}
                    rows={18}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <Label>Förhandsvisning</Label>
                  <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap font-sans max-h-72 overflow-auto">
                    <div className="font-semibold mb-2">Ämne: {templates[k].subject}</div>
                    {previewBody}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetTemplate}>Återställ till standard</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" /> Mottagare ({filteredList.length} av {currentList.length})
              </CardTitle>
              <CardDescription>
                Välj exakt vilka partners i segmentet "{DEFAULT_TEMPLATES[activeTab].label}" som ska få mailet.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Sök partner eller e-post…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="sm" onClick={toggleAllVisible}>
                {filteredList.every(p => currentSelected.has(p.id)) && filteredList.length > 0
                  ? "Avmarkera alla"
                  : "Markera alla"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentList.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Inga partners matchar detta segment.
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-[40px_1fr_1.5fr_1fr] gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted/40">
                <div></div>
                <div>Partner</div>
                <div>Mottagaradress (kan ändras)</div>
                <div>Kontaktnamn</div>
              </div>
              <div className="max-h-[480px] overflow-auto divide-y">
                {filteredList.map(p => {
                  const checked = currentSelected.has(p.id);
                  const fallbackEmail = p.admin_contact_email || p.email || "";
                  const overrideEmail = emailOverrides[p.id];
                  const effectiveEmail = (overrideEmail?.trim() || fallbackEmail).trim();
                  const valid = /\S+@\S+\.\S+/.test(effectiveEmail);
                  return (
                    <div
                      key={p.id}
                      className={`grid grid-cols-[40px_1fr_1.5fr_1fr] gap-2 px-3 py-2 items-center text-sm ${
                        checked ? "bg-pink-50/60" : ""
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={!valid}
                        onCheckedChange={() => toggleOne(p.id)}
                      />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.is_featured ? "Publicerad" : submissionPartnerIds.has(p.id) ? "Påbörjad profil" : "Ej publicerad"}
                        </div>
                      </div>
                      <div>
                        <Input
                          value={overrideEmail ?? fallbackEmail}
                          onChange={(e) => setEmailOverrides(prev => ({ ...prev, [p.id]: e.target.value }))}
                          className={`h-8 text-xs ${!valid ? "border-destructive" : ""}`}
                          placeholder="ingen e-post"
                        />
                        {!valid && (
                          <div className="text-[10px] text-destructive mt-0.5">Ogiltig adress – kan inte skickas</div>
                        )}
                      </div>
                      <div className="text-xs truncate">{resolveContactName(p)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-pink-200 bg-pink-50/40">
        <CardContent className="pt-5 pb-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-pink-600" />
            <div>
              <div className="font-semibold">
                {currentSelected.size} partner(s) valda i segmentet "{DEFAULT_TEMPLATES[activeTab].label}"
              </div>
              <div className="text-xs text-muted-foreground">
                Ämne: {templates[activeTab].subject}
              </div>
            </div>
          </div>
          <Button
            onClick={sendBulk}
            disabled={sending || currentSelected.size === 0}
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Skickar…" : `Skicka till ${currentSelected.size} partner(s)`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
