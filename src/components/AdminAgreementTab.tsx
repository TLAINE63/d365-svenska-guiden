import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, CheckCircle2, Mail, Eye, EyeOff, Search } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string | null;
  admin_contact_email: string | null;
  activation_date: string | null;
  applications: string[] | null;
  is_featured: boolean | null;
}

interface AdminAgreementTabProps {
  partners: Partner[];
  token: string | null;
  onRefresh: () => void;
  logout: () => void;
}

const DEFAULT_SUBJECT = "Fortsätt vara synliga på d365.se från 1 maj";
const DEFAULT_CC = "thomas.laine@dynamicfactory.se, michael.uhman@dynamicfactory.se";

const DEFAULT_BODY = `Hej,

Stort tack för att ni har varit med under pilotperioden för d365.se och hjälpt till att forma plattformen tillsammans med oss.

Under pilotperioden har vi sett ett tydligt intresse för plattformen. d365.se har hittills haft cirka 3 000 unika besökare och 7 000 sidvisningar, med 56 genomförda analyser/kravspecar, nästan 200 partnerprofilbesök och 25 klick vidare till en partner. De mest besökta delarna har varit Välj partner och Branschlösningar.

Nu går vi vidare in i nästa fas, och när vi fortsätter att bygga trafik, innehåll och efterfrågan vill vi gärna att ni fortsatt finns med som en synlig partner på d365.se.

Från och med **1 maj 2026** gäller ordinarie prismodell för partnerprofilering på d365.se:

**1 produktområde: 1.990 kr/månad**

**2 produktområden: 3.490 kr/månad**

**3 produktområden: 4.490 kr/månad**

Det finns även möjlighet till årsvis betalning – 12 månader till priset av 10.

Om ni vill fortsätta med er nuvarande profilering på d365.se, svara bara på detta mail med:

**Ja, vi fortsätter.**

Så ser vi till att er profil ligger kvar utan avbrott från **1 maj**.

Vill ni samtidigt justera produktområden, branschinriktning eller faktureringsuppgifter, så hjälper vi gärna till med det i nästa steg.

Fullständiga villkor för partnerprofilering finns i bifogad fil.

{{PDF_LINK}}

För att säkerställa fortsatt synlighet från 1 maj ber vi er återkoppla senast **30 april 2026**.

Stort tack igen för att ni varit med från start. Vi ser fram emot att fortsätta utveckla d365.se tillsammans med er.

Vänliga hälsningar
Thomas Laine & Michael Uhman
Moveahead AB / Dynamic Factory
d365.se`;

const PROSPECT_DEFAULT_SUBJECT = "Bli synlig på d365.se – Sveriges oberoende guide till Dynamics 365";

const PROSPECT_DEFAULT_BODY = `Hej,

Vi har tidigare varit i kontakt kring möjligheten att profilera er på d365.se, och vi ville nu återkomma när plattformen går in i nästa fas.

Under pilotperioden har d365.se vuxit till en levande plattform för organisationer som utvärderar Microsoft Dynamics 365 och söker rätt partner. Idag är 28 partners profilerade på sajten.

Vi har också sett ett tydligt intresse från marknaden. d365.se har hittills haft cirka 3 000 unika besökare och 7 000 sidvisningar, med 56 genomförda analyser/kravspecifikationer, nästan 200 partnerprofilbesök och 25 klick vidare till partner. De mest besökta delarna har varit Välj partner och Branschlösningar.

Från och med **1 maj 2026** gäller ordinarie prismodell för partnerprofilering på d365.se:

**1 produktområde: 1.990 kr/månad**

**2 produktområden: 3.490 kr/månad**

**3 produktområden: 4.490 kr/månad**

Det finns även möjlighet till årsvis betalning – 12 månader till priset av 10.

Fullständiga villkor finns i bifogat partneravtal.

{{PDF_LINK}}

Om ni vill vara med, svara bara på detta mail med:

**Ja, vi vill vara med.**

Om ni hellre vill gå direkt vidare kan ni använda er profileringslänk här:

{{INVITATION_LINK}}

Så hjälper vi er vidare direkt med nästa steg.

Vänliga hälsningar,
Thomas Laine & Michael Uhman
Moveahead AB / Dynamic Factory
https://d365.se`;

const COLD_PITCH_DEFAULT_SUBJECT = "d365.se växer – vill ni också finnas med?";

const COLD_PITCH_DEFAULT_BODY = `Hej,

Jag ville bara höra av mig kring d365.se.

d365.se har fått ett väldigt positivt bemötande och utvecklats till en växande kundguide för organisationer som utvärderar Microsoft Dynamics 365 och söker rätt partner. Idag är 28 partners redan profilerade på sajten.

Vi ser också ett tydligt intresse från marknaden. Hittills har d365.se haft cirka 3 000 unika besökare och 7 000 sidvisningar, med många genomförda analyser och kravspecifikationer samt redan hundratals partnerprofilbesök. De mest besökta delarna har varit Välj partner och Branschlösningar.

Det bekräftar att besökarna inte bara söker information om Dynamics 365, utan också aktivt jämför partneralternativ och försöker hitta rätt väg framåt.

Vi fortsätter nu att bygga innehåll, synlighet och efterfrågan kring plattformen, med ambitionen att d365.se ska bli den naturliga startpunkten för svenska organisationer som utvärderar Dynamics 365.

För partner innebär det en möjlighet att vara synlig tidigt i kundens utvärderingsresa.

Från och med **1 maj 2026** gäller ordinarie prismodell för partnerprofilering på d365.se:

**1 produktområde: 1.990 kr/månad**

**2 produktområden: 3.490 kr/månad**

**3 produktområden: 4.490 kr/månad**

Det finns även möjlighet till årsvis betalning – 12 månader till priset av 10.

Som profilerad partner kan ni synas inom:

Dynamics 365 Finance & Supply Chain Management

Dynamics 365 Business Central

Dynamics 365 CRM / Customer Engagement

För varje produktområde väljer ni upp till tre branschinriktningar.

Fullständiga villkor finns i bifogat partneravtal. Bekräftelse via e-post räcker som accept.

{{PDF_LINK}}

Om ni vill vara med, svara bara på detta mail med:

**Ja, vi vill vara med.**

Så tar vi nästa steg direkt kring profilering, produktområde(n) och fakturauppgifter.

Hör gärna av er om ni vill att vi skickar profileringslänk direkt.

Vänliga hälsningar,
Thomas Laine & Michael Uhman
Moveahead AB / Dynamic Factory
d365.se`;

type TemplateKind = "published" | "prospect" | "cold-pitch";

function useEmailTemplate(
  subjectKey: string,
  bodyKey: string,
  ccKey: string,
  defaultSubject: string,
  defaultBody: string,
  defaultCc: string,
  token: string | null,
) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [cc, setCc] = useState(defaultCc);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!token || loaded) return;
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY };
        const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=`;
        const [r1, r2, r3] = await Promise.all([
          fetch(base + subjectKey, { headers }),
          fetch(base + bodyKey, { headers }),
          fetch(base + ccKey, { headers }),
        ]);
        if (r1.ok) { const d = await r1.json(); if (d.template) setSubject(d.template); }
        if (r2.ok) { const d = await r2.json(); if (d.template) setBody(d.template); }
        if (r3.ok) { const d = await r3.json(); if (d.template) setCc(d.template); }
      } catch (e) { console.error("Failed to load template:", e); }
      setLoaded(true);
    };
    load();
  }, [token, loaded, subjectKey, bodyKey, ccKey]);

  return { subject, setSubject, body, setBody, cc, setCc, subjectKey, bodyKey, ccKey };
}

const AdminAgreementTab = ({ partners, token, onRefresh, logout }: AdminAgreementTabProps) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [templateKind, setTemplateKind] = useState<TemplateKind>("published");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">("all");
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [coldEmail, setColdEmail] = useState("");
  const [coldCompany, setColdCompany] = useState("");

  const published = useEmailTemplate(
    "agreement_email_subject", "agreement_email_body", "agreement_email_cc",
    DEFAULT_SUBJECT, DEFAULT_BODY, DEFAULT_CC, token,
  );
  const prospect = useEmailTemplate(
    "prospect_agreement_email_subject", "prospect_agreement_email_body", "prospect_agreement_email_cc",
    PROSPECT_DEFAULT_SUBJECT, PROSPECT_DEFAULT_BODY, DEFAULT_CC, token,
  );
  const coldPitch = useEmailTemplate(
    "cold_pitch_email_subject", "cold_pitch_email_body", "cold_pitch_email_cc",
    COLD_PITCH_DEFAULT_SUBJECT, COLD_PITCH_DEFAULT_BODY, DEFAULT_CC, token,
  );

  const active = templateKind === "published" ? published : templateKind === "prospect" ? prospect : coldPitch;
  const action = templateKind === "published" ? "send-agreement" : templateKind === "prospect" ? "send-prospect-agreement" : "send-cold-pitch";
  const placeholderHelp = templateKind === "published"
    ? "Platshållare: {{PDF_LINK}}, {{DEADLINE}}, {{START_DATE}}"
    : templateKind === "prospect"
      ? "Platshållare: {{INVITATION_LINK}}, {{PDF_LINK}}"
      : "Platshållare: {{PDF_LINK}}";

  const pdfUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf`;

  // All partners with an email, filtered
  const allWithEmail = partners.filter((p) => p.admin_contact_email || p.email);
  const filtered = allWithEmail.filter((p) => {
    if (statusFilter === "published" && !p.is_featured) return false;
    if (statusFilter === "unpublished" && p.is_featured) return false;
    if (search) {
      const q = search.toLowerCase();
      const email = (p.admin_contact_email || p.email || "").toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !email.includes(q)) return false;
    }
    return true;
  });

  const togglePartner = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleAll = () => {
    if (filtered.every((p) => selected.has(p.id))) {
      setSelected((prev) => { const n = new Set(prev); filtered.forEach((p) => n.delete(p.id)); return n; });
    } else {
      setSelected((prev) => { const n = new Set(prev); filtered.forEach((p) => n.add(p.id)); return n; });
    }
  };

  const saveTemplate = async () => {
    try {
      const saves = [
        { key: active.subjectKey, value: active.subject },
        { key: active.bodyKey, value: active.body },
        { key: active.ccKey, value: active.cc },
      ];
      await Promise.all(saves.map((s) =>
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ template: s.value, template_key: s.key }),
        })
      ));
      toast({ title: "Mall sparad!" });
    } catch { toast({ title: "Kunde inte spara mall", variant: "destructive" }); }
  };

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const previewHtml = escapeHtml(active.body)
    .replace(/\{\{PDF_LINK\}\}/g, '<span style="color:#1e40af;font-weight:bold;">[📄 Ladda ner partneravtal (PDF)]</span>')
    .replace(/\{\{INVITATION_LINK\}\}/g, '<span style="color:#2563eb;font-weight:bold;">[🔗 Skapa/uppdatera partnerprofil]</span>')
    .replace(/\{\{DEADLINE\}\}/g, "30 april 2026")
    .replace(/\{\{START_DATE\}\}/g, "1 maj 2026")
    // Markdown-style bold: **text** -> <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Normalize: collapse 3+ newlines to 2, then split on any newline so varje rad = eget stycke
    .replace(/\n{2,}/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => `<p style="margin:0 0 12px 0;">${line}</p>`)
    .join("");

  const sendEmails = async () => {
    const ccList = active.cc.split(",").map((e) => e.trim()).filter(Boolean);

    // === Cold pitch: free-form single recipient ===
    if (templateKind === "cold-pitch") {
      const emailTrimmed = coldEmail.trim();
      if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
        toast({ title: "Ange en giltig e-postadress", variant: "destructive" });
        return;
      }
      if (!confirm(`Skicka införsäljningsmail till ${emailTrimmed}${coldCompany ? ` (${coldCompany})` : ""}?`)) return;

      setSending(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=${action}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              email: emailTrimmed,
              company_name: coldCompany.trim() || null,
              subject: active.subject,
              email_body: active.body,
              cc: ccList,
            }),
          }
        );
        if (response.status === 401) { toast({ title: "Sessionen har gått ut", variant: "destructive" }); logout(); return; }
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Kunde inte skicka");
        toast({ title: data.message || "Skickat!" });
        setColdEmail("");
        setColdCompany("");
        onRefresh();
      } catch (error: any) {
        toast({ title: "Fel", description: error.message, variant: "destructive" });
      } finally {
        setSending(false);
      }
      return;
    }

    // === Existing flow: published / prospect ===
    const selectedPartners = partners.filter((p) => selected.has(p.id));
    if (selectedPartners.length === 0) return;

    const label = templateKind === "published" ? "avtalsmail (publicerad mall)" : "prospektmail (ej publicerad mall)";
    const names = selectedPartners.slice(0, 5).map((p) => p.name).join(", ") + (selectedPartners.length > 5 ? `, +${selectedPartners.length - 5} till` : "");
    if (!confirm(`Skicka ${label} till ${selectedPartners.length} partner(s)?\n\n${names}`)) return;

    setSending(true);
    try {
      const partnerList = selectedPartners.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.admin_contact_email || p.email || "",
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            partners: partnerList,
            subject: active.subject,
            email_body: active.body,
            cc: ccList,
          }),
        }
      );

      if (response.status === 401) { toast({ title: "Sessionen har gått ut", variant: "destructive" }); logout(); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kunde inte skicka");
      toast({ title: data.message || "Skickat!" });
      setSelected(new Set());
      onRefresh();
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Partneravtal & Prospektutskick
        </h2>
        <p className="text-sm text-muted-foreground">
          Markera valfria partners (publicerade eller ej) och välj vilken mall som ska skickas.
        </p>
      </div>

      {/* ===== STEP 1: Select recipient(s) ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Välj mottagare</CardTitle>
          <CardDescription>
            {templateKind === "cold-pitch"
              ? "Ange en e-postadress fritt – inget partnerkonto krävs. Skickas till en mottagare i taget."
              : "Sök, filtrera och markera partners. Du kan blanda publicerade och ej publicerade."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templateKind === "cold-pitch" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cold-email">E-postadress *</Label>
                <Input
                  id="cold-email"
                  type="email"
                  placeholder="kontakt@partnerbolag.se"
                  value={coldEmail}
                  onChange={(e) => setColdEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cold-company">Företagsnamn (valfritt)</Label>
                <Input
                  id="cold-company"
                  placeholder="Partnerbolag AB"
                  value={coldCompany}
                  onChange={(e) => setColdCompany(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Sök på namn eller e-post..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla partners</SelectItem>
                    <SelectItem value="published">Endast publicerade</SelectItem>
                    <SelectItem value="unpublished">Endast ej publicerade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  {selected.size} valda · visar {filtered.length} av {allWithEmail.length}
                </Label>
                <Button variant="outline" size="sm" onClick={toggleAll}>
                  {filtered.every((p) => selected.has(p.id)) && filtered.length > 0 ? "Avmarkera synliga" : "Markera alla synliga"}
                </Button>
              </div>

              <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">Inga partners matchar filtret.</p>
                ) : (
                  filtered.map((partner) => {
                    const email = partner.admin_contact_email || partner.email || "";
                    return (
                      <label key={partner.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                        <Checkbox checked={selected.has(partner.id)} onCheckedChange={() => togglePartner(partner.id)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm truncate">{partner.name}</span>
                            {partner.is_featured ? (
                              <Badge variant="outline" className="text-xs shrink-0 bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />Publicerad
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs shrink-0 bg-amber-50 text-amber-700 border-amber-200">
                                Ej publicerad
                              </Badge>
                            )}
                            {partner.activation_date && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                Start: {partner.activation_date}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground truncate block">{email}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ===== STEP 2: Choose template ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Välj e-postmall</CardTitle>
          <CardDescription>
            Välj vilken mall som skall skickas till de markerade partnerna. Du kan testa båda mallarna mot vilken partner som helst.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={templateKind} onValueChange={(v: TemplateKind) => { setTemplateKind(v); setShowPreview(false); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Avtalsmail – för publicerade partners (fortsätt synlighet)</SelectItem>
              <SelectItem value="prospect">Prospektmail – för ej publicerade (med profileringslänk)</SelectItem>
              <SelectItem value="cold-pitch">Införsäljningsmail – fri e-postadress, en åt gången</SelectItem>
            </SelectContent>
          </Select>

          <div>
            <Label>Ämnesrad</Label>
            <Input value={active.subject} onChange={(e) => active.setSubject(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>CC (kommaseparerat)</Label>
            <Input value={active.cc} onChange={(e) => active.setCc(e.target.value)} className="mt-1" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Brödtext</Label>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? "Redigera" : "Förhandsgranska"}
              </Button>
            </div>
            {showPreview ? (
              <div className="border rounded-lg p-4 bg-white text-sm text-gray-800 max-h-[500px] overflow-y-auto prose prose-sm" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <Textarea value={active.body} onChange={(e) => active.setBody(e.target.value)} rows={20} className="font-mono text-sm" />
            )}
            <p className="text-xs text-muted-foreground mt-1">{placeholderHelp}</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" onClick={saveTemplate}>Spara mall</Button>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <FileText className="h-4 w-4" />Visa bifogad PDF
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ===== STEP 3: Send ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4" />3. Skicka</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm">
              {templateKind === "cold-pitch" ? (
                <>
                  <span className="font-medium">{coldEmail.trim() || "—"}</span> ·{" "}
                  <span className="font-medium">Införsäljningsmail</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{selected.size}</span> mottagare ·{" "}
                  <span className="font-medium">{templateKind === "published" ? "Avtalsmail" : "Prospektmail"}</span>
                </>
              )}
            </div>
            <Button
              size="lg"
              disabled={sending || (templateKind === "cold-pitch" ? !coldEmail.trim() : selected.size === 0)}
              onClick={sendEmails}
            >
              <Send className="h-4 w-4 mr-2" />
              {sending
                ? "Skickar..."
                : templateKind === "cold-pitch"
                  ? "Skicka införsäljningsmail"
                  : `Skicka till ${selected.size} mottagare`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAgreementTab;
