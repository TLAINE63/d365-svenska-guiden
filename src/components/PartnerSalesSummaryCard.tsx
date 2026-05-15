import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Mail, FileText, Loader2, Download } from "lucide-react";
import { invokeAdminEdgeWithRetry } from "@/lib/adminEdge";
import { useToast } from "@/hooks/use-toast";

interface Props {
  token: string | null;
  partnerSlug: string | null;
  partnerName: string | null;
}

export default function PartnerSalesSummaryCard({ token, partnerSlug, partnerName }: Props) {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const { toast } = useToast();

  if (!partnerSlug) return null;

  const fetchSummary = async () => {
    if (!token) return;
    setLoading(true);
    const { data, error } = await invokeAdminEdgeWithRetry<any>("partner-sales-summary", {
      token,
      partnerSlug,
      mode: "summary",
    });
    setLoading(false);
    if (error || data?.error) {
      toast({ title: "Kunde inte hämta underlag", description: error?.message || data?.error, variant: "destructive" });
      return;
    }
    setSummary(data?.summary);
  };

  const copyText = async () => {
    if (!summary?.text) return;
    await navigator.clipboard.writeText(summary.text);
    toast({ title: "Kopierat!", description: "Försäljningsunderlaget ligger nu i urklipp." });
  };

  const sendEmail = async () => {
    if (!token) return;
    setSending(true);
    const { data, error } = await invokeAdminEdgeWithRetry<any>("partner-sales-summary", {
      token,
      partnerSlug,
      mode: "send",
    });
    setSending(false);
    if (error || data?.error) {
      toast({ title: "Kunde inte skicka mejl", description: error?.message || data?.error, variant: "destructive" });
      return;
    }
    toast({ title: "Mejlat!", description: `Skickat till ${data?.sentTo}` });
  };

  const downloadCsv = () => {
    if (!summary) return;
    const esc = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return /[",;\n]/.test(s) ? `"${s}"` : s;
    };
    const rows: string[][] = [];
    rows.push(["Försäljningsunderlag", partnerName || ""]);
    rows.push(["Genererat", new Date().toISOString()]);
    rows.push([]);
    rows.push(["Partnerstatistik", "30 dagar", "90 dagar"]);
    const p30 = summary.partner30 || {};
    const p90 = summary.partner90 || {};
    const partnerKeys: [string, string][] = [
      ["Filtervisningar", "filterExposures"],
      ["Kortklick", "cardClicks"],
      ["Profilbesök", "profileVisits"],
      ["Hemsidesklick", "websiteClicks"],
    ];
    partnerKeys.forEach(([label, k]) => rows.push([label, p30[k] ?? "", p90[k] ?? ""]));
    rows.push([]);
    if (summary.site30 || summary.site90) {
      rows.push(["Sajttotaler", "30 dagar", "90 dagar"]);
      const s30 = summary.site30 || {};
      const s90 = summary.site90 || {};
      const siteKeys: [string, string][] = [
        ["Behovsanalyser startade", "analysesStarted"],
        ["Behovsanalyser slutförda (lead)", "analysesCompleted"],
        ["Profilvisningar (globalt)", "profileViews"],
        ["Klick till partnersajter (globalt)", "partnerClicks"],
      ];
      siteKeys.forEach(([label, k]) => rows.push([label, s30[k] ?? "", s90[k] ?? ""]));
      rows.push([]);
    }
    rows.push(["Identifierade företag (90d)"]);
    rows.push(["Namn", "Bransch", "Storlek", "Land", "Sessioner", "Matchning", "Besökta sidor"]);
    (summary.identifiedCompanies || []).forEach((c: any) => {
      rows.push([
        c.name,
        c.industry,
        c.size,
        c.country,
        c.sessions,
        c.matchedProfile ? "Profil" : "Relaterad",
        (c.visitedPaths || []).join(" | "),
      ]);
    });
    const csv = "\uFEFF" + rows.map((r) => r.map(esc).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `forsaljningsunderlag-${partnerSlug}-${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "CSV nedladdad", description: "Öppna filen i Excel." });
  };

  return (
    <Card className="border-cta-orange/30 bg-gradient-to-br from-cta-orange/5 via-background to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-5 h-5 text-cta-orange" />
          Försäljningsunderlag – {partnerName}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Skapar en sammanställning (sajttotaler, exponering, identifierade företag) som du kan klistra in i ett införsäljningsmejl.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={fetchSummary} disabled={loading || !token} variant="outline">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {summary ? "Uppdatera" : "Generera underlag"}
          </Button>
          {summary && (
            <>
              <Button onClick={copyText} variant="outline">
                <Copy className="w-4 h-4 mr-2" /> Kopiera som text
              </Button>
              <Button onClick={downloadCsv} variant="outline">
                <Download className="w-4 h-4 mr-2" /> Ladda ner CSV
              </Button>
              <Button onClick={sendEmail} disabled={sending} className="bg-cta-orange hover:bg-cta-orange-hover text-white">
                {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                Maila till mig
              </Button>
            </>
          )}
        </div>

        {summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <Stat label="Filtervisningar (30/90d)" v={`${summary.partner30.filterExposures} / ${summary.partner90.filterExposures}`} />
              <Stat label="Kortklick (30/90d)" v={`${summary.partner30.cardClicks} / ${summary.partner90.cardClicks}`} />
              <Stat label="Profilbesök (30/90d)" v={`${summary.partner30.profileVisits} / ${summary.partner90.profileVisits}`} />
              <Stat label="Hemsidesklick (30/90d)" v={`${summary.partner30.websiteClicks} / ${summary.partner90.websiteClicks}`} />
            </div>

            <details className="rounded-lg border bg-card p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Identifierade besökande företag (90d) – {summary.identifiedCompanies?.length || 0} st
              </summary>
              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {(summary.identifiedCompanies || []).map((c: any, i: number) => (
                  <div key={i} className="text-xs border-b last:border-0 pb-2">
                    <div className="font-semibold">
                      {c.name}{" "}
                      <Badge variant={c.matchedProfile ? "default" : "outline"} className="ml-1 text-[10px]">
                        {c.matchedProfile ? "Profil" : "Relaterad"}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {[c.industry, c.size, c.country].filter(Boolean).join(" · ")} · {c.sessions} sessioner
                    </div>
                    {c.visitedPaths?.length > 0 && (
                      <div className="text-muted-foreground font-mono text-[10px] mt-1">
                        {c.visitedPaths.slice(0, 5).join(", ")}
                      </div>
                    )}
                  </div>
                ))}
                {(!summary.identifiedCompanies || summary.identifiedCompanies.length === 0) && (
                  <p className="text-xs text-muted-foreground">Inga identifierade företag senaste 90 dagarna.</p>
                )}
              </div>
            </details>

            <details className="rounded-lg border bg-muted/30 p-3">
              <summary className="cursor-pointer text-sm font-medium">Förhandsvisning (text som mejlas/kopieras)</summary>
              <pre className="mt-3 text-xs whitespace-pre-wrap font-mono">{summary.text}</pre>
            </details>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md border bg-card p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-bold">{v}</div>
    </div>
  );
}
