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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, RefreshCw, Filter, AlertCircle, CheckCircle2, Eye } from "lucide-react";

type SegmentKey = "published" | "not_published";

interface PartnerRow {
  id: string;
  slug: string;
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

const DEFAULT_TEMPLATES: Record<SegmentKey, Template> = {
  published: {
    key: "published",
    label: "1. Publicerade partners",
    description: "Partners som är live på d365.se (is_featured = true). Profileringslänk inkluderas automatiskt.",
    subject: "Uppdaterad partnermodell på d365.se",
    body: `Hej,

Tack för att ni redan är live på d365.se. Det gör stor skillnad i den här fasen.

Vi går nu vidare och öppnar upp plattformen bredare. Målet är att få in tillräcklig bredd av relevanta partners så att kunder kan göra meningsfulla jämförelser.

I samband med detta inför vi ett enklare upplägg.

Detta gäller:

• 1 produktområde: 995 kr/mån

• 2 produktområden: 1 595 kr/mån

• 3 produktområden: 1 995 kr/mån

Priset ligger fast under 2026

3 månaders uppsägningstid

Detta ersätter den modell vi kommunicerade 27 april. Ingångspriset är nu 995 kr/mån (tidigare 1 990 kr).

Ni ligger redan bra till – och är en del av den grupp som sätter strukturen framåt.

Vill ni fortsätta vara med enligt detta upplägg, svara bara **OK** så löser vi resten.

Pris, villkor och nedladdningsbart avtal: https://d365.se/avtalssida

Aktuell sajtstatistik för partners: https://d365.se/partnerstatistik

Glöm inte att uppdatera er partnerprofil här:

{{INVITATION_LINK}}

Allt gott,
Thomas & Michael`,
  },
  not_published: {
    key: "not_published",
    label: "2. Ej publicerade partners",
    description: "Alla partners som inte är publicerade ännu (inkl. inbjudna, påbörjade profiler och tidigare 27/4-mottagare).",
    subject: "Uppföljning – uppdaterad partnermodell på d365.se",
    body: `Hej,

En kort uppföljning på vårt utskick 27 april.

Sedan dess har vi haft dialog med flera partners om hur d365.se bäst etableras i marknaden. En återkommande reflektion har blivit tydlig: för att plattformen ska bli värdefull – både för kunder och partners – behöver vi tillräcklig bredd av relevanta partners så att kunder kan göra meningsfulla jämförelser.

Vi har därför kalibrerat om upplägget för att göra det enklare att haka på i den här fasen.

Detta gäller:

• 1 produktområde: 995 kr/mån

• 2 produktområden: 1 595 kr/mån

• 3 produktområden: 1 995 kr/mån

Priset ligger fast under 2026

3 månaders uppsägningstid

Detta ersätter den modell vi kommunicerade 27 april. Ingångspriset är nu 995 kr/mån (tidigare 1 990 kr).

Vill ni vara med enligt detta upplägg, svara bara **OK** så lägger vi in er och skickar profileringslänken.

Pris, villkor och nedladdningsbart avtal:

https://d365.se/avtalssida

Aktuell sajtstatistik för partners:

https://d365.se/partnerstatistik

Allt gott,

Thomas & Michael`,
  },
};

const STORAGE_KEY = "admin_sales_pitch_v2_templates_v5";

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
  const [invitedPartnerIds, setInvitedPartnerIds] = useState<Set<string>>(new Set());
  const [profileRefreshEmails, setProfileRefreshEmails] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<SegmentKey>("published");
  const [search, setSearch] = useState("");
  const [emailOverrides, setEmailOverrides] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<SegmentKey, Set<string>>>({
    published: new Set(),
    not_published: new Set(),
  });

  const [testEmail, setTestEmail] = useState("thomas.laine@dynamicfactory.se");
  const [sendingTest, setSendingTest] = useState(false);

  // Preview-mail (per partner med statistik) → till mig själv för finjustering
  const [previewPartner, setPreviewPartner] = useState<PartnerRow | null>(null);
  const [previewEmail, setPreviewEmail] = useState("thomas.laine@dynamicfactory.se");
  const [previewSegment, setPreviewSegment] = useState<SegmentKey>("published");
  const [sendingPreview, setSendingPreview] = useState(false);

  const [templates, setTemplates] = useState<Record<SegmentKey, Template>>(() => {
    if (typeof window === "undefined") return DEFAULT_TEMPLATES;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_TEMPLATES;
      const stored = JSON.parse(raw);
      return {
        published: { ...DEFAULT_TEMPLATES.published, ...(stored.published || {}) },
        not_published: { ...DEFAULT_TEMPLATES.not_published, ...(stored.not_published || {}) },
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
      setInvitedPartnerIds(new Set<string>((data.invited_partner_ids || []) as string[]));
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
    const notPublished: PartnerRow[] = [];

    for (const p of partners) {
      if (p.is_featured) {
        published.push(p);
      } else {
        notPublished.push(p);
      }
    }

    return { published, not_published: notPublished };
  }, [partners]);

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

  const resolveEmail = (p: PartnerRow): string => {
    return (emailOverrides[p.id]?.trim() || p.admin_contact_email?.trim() || p.email?.trim() || "").trim();
  };

  const resolveContactName = (p: PartnerRow): string => {
    return p.admin_contact_name || p.contact_person || p.name;
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

  const sendTest = async (segs: SegmentKey[], confirmMsg: string) => {
    const addr = testEmail.trim();
    if (!/\S+@\S+\.\S+/.test(addr)) {
      toast({ title: "Ange en giltig e-postadress", variant: "destructive" });
      return;
    }
    if (!confirm(confirmMsg)) return;

    setSendingTest(true);
    try {
      let okCount = 0;
      for (const seg of segs) {
        const tpl = templates[seg];
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
              partners: [{ id: null, name: `TEST – ${tpl.label}`, email: addr, contact_name: "Thomas" }],
              subject: `[TEST ${tpl.label}] ${tpl.subject}`,
              body: tpl.body,
            }),
          }
        );
        if (response.status === 401) {
          toast({ title: "Sessionen har gått ut", variant: "destructive" });
          onSessionExpired();
          return;
        }
        if (response.ok) okCount++;
        else console.error("Test send failed for", seg, await response.text());
      }
      toast({ title: `Testmail skickade: ${okCount}/${segs.length}`, description: `Mottagare: ${addr}` });
    } catch (err: any) {
      toast({ title: "Fel vid testutskick", description: err.message, variant: "destructive" });
    } finally {
      setSendingTest(false);
    }
  };

  const sendTestBoth = () =>
    sendTest(["published", "not_published"], `Skicka testmail av båda mallarna till ${testEmail.trim()}?`);

  const openPreview = (p: PartnerRow) => {
    setPreviewPartner(p);
    setPreviewSegment(p.is_featured ? "published" : "not_published");
    setPreviewEmail("thomas.laine@dynamicfactory.se");
  };

  const fmt = (n: number | null | undefined) => (n ?? 0).toLocaleString("sv-SE");

  const LEGACY_SUMMARY_KEYS = ["sajt30", "sajt90", "partner30", "partner90"] as const;
  const warnedLegacyKeys = new Set<string>();
  const guardSummary = (summary: any, partnerName: string): any => {
    if (!summary || typeof summary !== "object") return summary;
    const present = LEGACY_SUMMARY_KEYS.filter((k) => k in summary);
    if (present.length > 0) {
      console.warn(
        `[AdminSalesPitchV2] Summary för ${partnerName} innehåller föråldrade nycklar: ${present.join(", ")}. Använd sajtAll / partnerAll istället.`,
      );
    }
    return new Proxy(summary, {
      get(target, prop: string) {
        if (LEGACY_SUMMARY_KEYS.includes(prop as any) && !(prop in target)) {
          const key = `${partnerName}:${prop}`;
          if (!warnedLegacyKeys.has(key)) {
            warnedLegacyKeys.add(key);
            console.warn(
              `[AdminSalesPitchV2] Frontend försökte läsa borttagen summary-nyckel "${prop}" för ${partnerName}. Använd sajtAll / partnerAll istället.`,
            );
          }
          return undefined;
        }
        return (target as any)[prop];
      },
    });
  };

  const buildStatsHtml = (partner: PartnerRow, summary: any): string => {
    const s = guardSummary(summary, partner.name) || {};
    const sajtAll = s.sajtAll || {};
    const pAll = s.partnerAll || {};
    const companies: any[] = Array.isArray(s.identifiedCompanies) ? s.identifiedCompanies : [];

    const avgSec = Number(sajtAll.avgTimeOnPageSec || 0);
    const avgMin = Math.floor(avgSec / 60);
    const avgRest = avgSec % 60;
    const avgStr = avgMin > 0 ? `${avgMin}m ${avgRest}s` : `${avgRest}s`;

    const boxes: { label: string; value: string; hint?: string; color?: string }[] = [
      { label: "Unika besökare", value: fmt(sajtAll.uniqueVisitors), hint: "d365.se" },
      { label: "Sidvisningar", value: fmt(sajtAll.pageViews), hint: "d365.se" },
      { label: "Välj partner", value: fmt(sajtAll.valjPartnerVisits), hint: "besök /valj-partner" },
      { label: "Behovsanalyser", value: fmt(sajtAll.analysesCompleted), hint: "slutförda (leads)" },
      { label: "Kom igång-guiden", value: fmt(sajtAll.komIgangVisits), hint: "besök /kom-igang" },
      { label: "Partnerprofiler", value: fmt(sajtAll.partnerProfileVisitsGlobal), hint: "globalt" },
      { label: "Partnerklick", value: fmt(sajtAll.partnerClicksGlobal), hint: "globalt" },
      { label: "Snitt-tid på sida", value: avgStr, hint: "engagemang" },
      { label: `Visad i filterresultat`, value: fmt(pAll.filterExposures ?? 0), hint: partner.name, color: "#ea580c" },
      { label: "Klick på partnerkort", value: fmt(pAll.cardClicks ?? 0), hint: partner.name, color: "#ea580c" },
      { label: "Besök på profilsida", value: fmt(pAll.profileVisits ?? 0), hint: partner.name, color: "#ea580c" },
      { label: "Klick till hemsida", value: fmt(pAll.websiteClicks ?? 0), hint: partner.name, color: "#ea580c" },
    ];

    // Build rows of 4 boxes
    const rows: string[] = [];
    for (let i = 0; i < boxes.length; i += 4) {
      const slice = boxes.slice(i, i + 4);
      rows.push(
        `<tr>${slice
          .map(
            (b) => `
        <td width="25%" valign="top" style="padding:6px">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:14px 12px;text-align:left">
            <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.4px;font-weight:600">${b.label}</div>
            <div style="font-size:22px;font-weight:800;color:${b.color || "#1e3a5f"};line-height:1.1;margin-top:6px">${b.value}</div>
            ${b.hint ? `<div style="font-size:11px;color:#94a3b8;margin-top:4px">${b.hint}</div>` : ""}
          </div>
        </td>`,
          )
          .join("")}</tr>`,
      );
    }

    const companiesHtml = companies.length
      ? `<h3 style="margin:28px 0 10px;font-size:15px;color:#0f172a">Identifierade besökande företag (${companies.length})</h3>
         <ul style="margin:0;padding-left:20px;color:#334155;font-size:13px;line-height:1.6">
           ${companies.map((c: any) => `<li>${esc(c.name)}</li>`).join("")}
         </ul>`
      : `<p style="margin:24px 0 0;color:#64748b;font-size:13px">Identifierade besökande företag: inga matchningar från Snitcher.</p>`;

    return `
<div style="margin:32px 0 0;padding:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:700">Internt preview – skickas INTE till partnern</div>
  <h2 style="margin:6px 0 4px;font-size:20px;color:#0f172a">Säljunderlag för ${esc(partner.name)}</h2>
  <p style="margin:0 0 14px;color:#64748b;font-size:13px">Nyckeltal från d365.se (sajttotaler) och ${esc(partner.name)}s exponering.</p>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0">
    ${rows.join("")}
  </table>
  ${companiesHtml}
</div>`;
  };

  function esc(v: any) {
    return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }


  const sendPreview = async () => {
    if (!previewPartner) return;
    const addr = previewEmail.trim();
    if (!/\S+@\S+\.\S+/.test(addr)) {
      toast({ title: "Ange en giltig e-postadress", variant: "destructive" });
      return;
    }

    setSendingPreview(true);
    try {
      // 1) Hämta statistik via befintlig edge function
      const { data: summaryRes, error: summaryErr } = await supabase.functions.invoke(
        "partner-sales-summary",
        { body: { token, partnerSlug: previewPartner.slug, mode: "summary" } },
      );
      if (summaryErr) throw summaryErr;
      if (summaryRes?.error) throw new Error(summaryRes.error);

      const statsHtml = buildStatsHtml(previewPartner, summaryRes?.summary);
      const tpl = templates[previewSegment];
      const contactName = previewPartner.admin_contact_name || previewPartner.contact_person || previewPartner.name;
      const composedSubject = `[PREVIEW – ${previewPartner.name}] ${tpl.subject}`;

      // 2) Skicka via befintlig send-sales-pitch (id=null så vi inte rör partnerns riktiga pending invitation)
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
            partners: [{ id: null, name: previewPartner.name, email: addr, contact_name: contactName }],
            subject: composedSubject,
            body: tpl.body,
            previewSuffixHtml: statsHtml,
          }),
        },
      );
      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut", variant: "destructive" });
        onSessionExpired();
        return;
      }
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Kunde inte skicka preview");
      }
      toast({
        title: "Preview skickat",
        description: `${previewPartner.name} → ${addr}`,
      });
      setPreviewPartner(null);
    } catch (err: any) {
      console.error("preview send error", err);
      toast({ title: "Fel vid preview-utskick", description: err.message, variant: "destructive" });
    } finally {
      setSendingPreview(false);
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
                <h2 className="text-xl font-bold">Införsäljningsmail</h2>
              </div>
              <p className="text-slate-300 text-sm max-w-2xl">
                Två mallar: en till publicerade partners (med profileringslänk) och en till alla ej publicerade. Redigera ämne &amp; brödtext, välj exakt vilka som ska få mailet, och skicka i bulk. Mallar sparas lokalt i din webbläsare. Mottagaradress: <code className="text-xs">admin_contact_email</code> i första hand, annars publik e-post.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" /> Uppdatera data
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">Publicerade: {segmentPartners.published.length}</Badge>
            <Badge variant="secondary">Ej publicerade: {segmentPartners.not_published.length}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center border-t border-slate-700 pt-4">
            <span className="text-xs text-slate-300 font-medium">Testutskick (båda mallar):</span>
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="testmottagare@exempel.se"
              className="h-8 w-72 text-xs bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
            <Button
              size="sm"
              variant="secondary"
              disabled={sendingTest}
              onClick={sendTestBoth}
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {sendingTest ? "Skickar test…" : "Skicka testmail (2 st)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SegmentKey)}>
        <TabsList className="grid grid-cols-2 w-full">
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
                    Brödtext (använd <code className="text-xs">[NAMN]</code> för mottagarens kontaktnamn{k === "published" ? <>, <code className="text-xs">{"{{INVITATION_LINK}}"}</code> för profileringslänk</> : null})
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
              <div className="grid grid-cols-[40px_1fr_1.5fr_1fr_auto] gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted/40">
                <div></div>
                <div>Partner</div>
                <div>Mottagaradress (kan ändras)</div>
                <div>Kontaktnamn</div>
                <div className="text-right">Preview</div>
              </div>
              <div className="max-h-[480px] overflow-auto divide-y">
                {filteredList.map(p => {
                  const checked = currentSelected.has(p.id);
                  const fallbackEmail = p.admin_contact_email || p.email || "";
                  const overrideEmail = emailOverrides[p.id];
                  const effectiveEmail = (overrideEmail?.trim() || fallbackEmail).trim();
                  const valid = /\S+@\S+\.\S+/.test(effectiveEmail);
                  const gotApril27 = profileRefreshEmails.has((p.admin_contact_email || p.email || "").toLowerCase().trim());
                  const statusLabel = p.is_featured
                    ? "Publicerad"
                    : submissionPartnerIds.has(p.id)
                      ? "Påbörjad profil"
                      : invitedPartnerIds.has(p.id)
                        ? "Inbjuden"
                        : gotApril27
                          ? "Fick 27/4-mail"
                          : "Ej publicerad";
                  return (
                    <div
                      key={p.id}
                      className={`grid grid-cols-[40px_1fr_1.5fr_1fr_auto] gap-2 px-3 py-2 items-center text-sm ${
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
                        <div className="text-xs text-muted-foreground">{statusLabel}</div>
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
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => openPreview(p)}
                          title="Skicka pitch-preview med statistik till mig själv"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview till mig
                        </Button>
                      </div>
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

      <Dialog open={!!previewPartner} onOpenChange={(open) => !open && setPreviewPartner(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pitch-preview till mig själv</DialogTitle>
            <DialogDescription>
              Skickar valt mailutkast {previewPartner ? `för ${previewPartner.name}` : ""} – kompletterat med ett internt statistik-block (sajtbesökare, profilvisningar, klick till partnerns sajt och identifierade företag från Snitcher de senaste 90 dagarna). Inget skickas till partnern.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="preview-email">Mottagare (du)</Label>
              <Input
                id="preview-email"
                value={previewEmail}
                onChange={(e) => setPreviewEmail(e.target.value)}
                placeholder="thomas.laine@dynamicfactory.se"
              />
            </div>
            <div>
              <Label htmlFor="preview-segment">Mall</Label>
              <Select value={previewSegment} onValueChange={(v) => setPreviewSegment(v as SegmentKey)}>
                <SelectTrigger id="preview-segment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">{DEFAULT_TEMPLATES.published.label}</SelectItem>
                  <SelectItem value="not_published">{DEFAULT_TEMPLATES.not_published.label}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground mt-1">
                Default följer partnerns status; ändra om du vill testa andra mallen.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewPartner(null)} disabled={sendingPreview}>
              Avbryt
            </Button>
            <Button onClick={sendPreview} disabled={sendingPreview} className="bg-pink-600 hover:bg-pink-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              {sendingPreview ? "Skickar…" : "Skicka preview"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
