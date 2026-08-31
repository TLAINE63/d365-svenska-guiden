import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";
import { Loader2, Save, CheckCircle2, Plus, Trash2, RefreshCw, Mail, Copy, Eye, Send } from "lucide-react";
import PartnerPerformanceReportView, {
  formatMonthLabel,
  type PerformanceReportData,
} from "@/components/partner-performance/PartnerPerformanceReportView";

interface PartnerOption {
  id: string;
  slug: string;
  name: string;
}

function monthOptions(count = 18): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

export default function AdminPartnerPerformanceTab({ token }: { token: string | null }) {
  const { toast } = useToast();
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [slug, setSlug] = useState<string>("");
  const [month, setMonth] = useState<string>(monthOptions(1)[0]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PerformanceReportData | null>(null);
  const [comment, setComment] = useState("");
  const [recs, setRecs] = useState<{ title: string; body: string }[]>([]);
  const [sendingLink, setSendingLink] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [autoSendEnabled, setAutoSendEnabled] = useState<boolean | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);

  const months = useMemo(() => monthOptions(), []);

  useEffect(() => {
    if (!token) return;
    invokeAdminEdgeWithRetry<{ partners: PartnerOption[] }>("partner-performance-report", {
      action: "list_partners",
      token,
    }).then(({ data: res }) => {
      const list = res?.partners || [];
      setPartners(list);
      if (list.length && !slug) setSlug(list[0].slug);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-market-report?action=get_setting&key=monthly_report_auto_send_enabled`, {
      headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "" },
    })
      .then((r) => r.json().catch(() => ({})))
      .then((data) => setAutoSendEnabled(data.value === "true"))
      .catch(() => setAutoSendEnabled(false));
  }, [token]);

  const monthBounds = (m: string) => {
    const [year, mon] = m.split("-").map(Number);
    const lastDay = new Date(year, mon, 0).getDate();
    return { start: `${m}-01`, end: `${m}-${String(lastDay).padStart(2, "0")}` };
  };

  const load = useCallback(async () => {
    if (!token || !slug || !month) return;
    setLoading(true);
    const { data: res, error } = await invokeAdminEdgeWithRetry<PerformanceReportData & { error?: string }>(
      "partner-performance-report",
      { action: "get", token, partner_slug: slug, month },
    );
    setLoading(false);
    if (error || !res || (res as any).error) {
      toast({
        title: "Kunde inte ladda rapporten",
        description: (res as any)?.error || error?.message,
        variant: "destructive",
      });
      return;
    }
    setData(res);
    setComment(res.admin_comment || "");
    setRecs(res.recommendations || []);
  }, [token, slug, month, toast]);

  useEffect(() => {
    if (slug && month) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, month]);

  const save = async (status: "draft" | "approved") => {
    if (!token || !data) return;
    setSaving(true);
    const { data: res, error } = await invokeAdminEdgeWithRetry<{ success?: boolean; error?: string }>(
      "partner-performance-report",
      {
        action: "save",
        token,
        partner_slug: data.partner.slug,
        month: data.month,
        admin_comment: comment,
        recommendations: recs,
        metrics: data.current.metrics,
        status,
      },
    );
    setSaving(false);
    if (error || res?.error) {
      toast({ title: "Kunde inte spara", description: res?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({
      title: status === "approved" ? "Rapporten är godkänd" : "Utkast sparat",
      description: `${data.partner.name} – ${formatMonthLabel(data.month)}`,
    });
    load();
  };

  const previewData: PerformanceReportData | null = data
    ? { ...data, admin_comment: comment, recommendations: recs }
    : null;

  const selectedPartner = partners.find((p) => p.slug === slug) || null;

  const handleSendReportLink = async () => {
    if (!token || !selectedPartner) return;
    setSendingLink(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=send-performance-link-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partner_id: selectedPartner.id }),
        }
      );
      const res = await response.json();
      if (!response.ok) {
        if (res.error?.includes("gått ut") || res.error?.includes("session")) {
          toast({ title: "Sessionen har gått ut", description: "Logga in igen.", variant: "destructive" });
          setTimeout(() => window.location.reload(), 800);
          return;
        }
        throw new Error(res.error || "Kunde inte skicka e-post");
      }
      toast({ title: "Rapportlänk skickad!", description: `Prestanda-rapporten har skickats till ${res.email}` });
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setSendingLink(false);
    }
  };

  const handleCopyReportLink = async () => {
    if (!token || !selectedPartner) return;
    setGeneratingLink(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=create-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partner_id: selectedPartner.id }),
        }
      );
      const res = await response.json();
      if (!response.ok) {
        if (res.error?.includes("gått ut") || res.error?.includes("session")) {
          toast({ title: "Sessionen har gått ut", description: "Logga in igen.", variant: "destructive" });
          setTimeout(() => window.location.reload(), 800);
          return;
        }
        throw new Error(res.error || "Kunde inte generera länk");
      }
      const link = `https://d365.se/partner-performance/${res.token}`;
      await navigator.clipboard.writeText(link);
      toast({ title: "Länk kopierad!", description: `Prestanda-rapportlänk kopierad för ${selectedPartner.name}` });
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setGeneratingLink(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Partner Performance – välj rapport</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Partner</Label>
            <Select value={slug} onValueChange={setSlug}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Välj partner" /></SelectTrigger>
              <SelectContent className="bg-popover">
                {partners.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Månad</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover max-h-72">
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{formatMonthLabel(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Uppdatera
          </Button>
          {selectedPartner && (
            <>
              <Button
                variant="default"
                onClick={handleSendReportLink}
                disabled={sendingLink || generatingLink}
              >
                {sendingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Skicka rapportlänk
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyReportLink}
                disabled={sendingLink || generatingLink}
              >
                {generatingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                Kopiera länk
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Månadens kommentar och rekommendationer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Månadens kommentar (visas högst upp i rapporten)</Label>
              <Textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Intresset för er profil ökade tydligt under månaden…"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs">Rekommendationer</Label>
              {recs.map((r, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={r.title}
                      placeholder="Rubrik"
                      onChange={(e) =>
                        setRecs((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRecs((prev) => prev.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    rows={3}
                    value={r.body}
                    placeholder="Beskrivning kopplad till data"
                    onChange={(e) =>
                      setRecs((prev) => prev.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))
                    }
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecs((prev) => [...prev, { title: "", body: "" }])}
              >
                <Plus className="h-4 w-4" /> Lägg till rekommendation
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Spara utkast
              </Button>
              <Button onClick={() => save("approved")} disabled={saving}>
                <CheckCircle2 className="h-4 w-4" /> Markera som godkänd
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Förhandsvisning – så ser partnern rapporten</CardTitle>
          </CardHeader>
          <CardContent>
            <PartnerPerformanceReportView data={previewData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
