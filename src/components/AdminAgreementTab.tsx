import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, CheckCircle2, Mail, Eye, EyeOff, UserPlus } from "lucide-react";

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

Från och med 1 maj 2026 gäller ordinarie prismodell för partnerprofilering på d365.se:

1 produktområde: 1.990 kr/månad

2 produktområden: 3.490 kr/månad

3 produktområden: 4.490 kr/månad

Det finns även möjlighet till årsvis betalning – 12 månader till priset av 10.

Om ni vill fortsätta med er nuvarande profilering på d365.se, svara bara på detta mail med:

Ja, vi fortsätter.

Så ser vi till att er profil ligger kvar utan avbrott från 1 maj.

Vill ni samtidigt justera produktområden, branschinriktning eller faktureringsuppgifter, så hjälper vi gärna till med det i nästa steg.

Fullständiga villkor för partnerprofilering finns i bifogad fil.

{{PDF_LINK}}

För att säkerställa fortsatt synlighet från 1 maj ber vi er återkoppla senast 30 april 2026.

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

Från och med 1 maj 2026 gäller ordinarie prismodell för partnerprofilering på d365.se:

1 produktområde: 1.990 kr/månad

2 produktområden: 3.490 kr/månad

3 produktområden: 4.490 kr/månad

Det finns även möjlighet till årsvis betalning – 12 månader till priset av 10.

Fullständiga villkor finns i bifogat partneravtal.

{{PDF_LINK}}

Om ni vill vara med, svara bara på detta mail med:

Ja, vi vill vara med.

Om ni hellre vill gå direkt vidare kan ni använda er profileringslänk här:

{{INVITATION_LINK}}

Så hjälper vi er vidare direkt med nästa steg.

Vänliga hälsningar,
Thomas Laine & Michael Uhman
Moveahead AB / Dynamic Factory
https://d365.se`;

// Reusable email editor component
function EmailEditor({
  subjectKey,
  bodyKey,
  ccKey,
  defaultSubject,
  defaultBody,
  defaultCc,
  token,
  placeholderHelp,
}: {
  subjectKey: string;
  bodyKey: string;
  ccKey: string;
  defaultSubject: string;
  defaultBody: string;
  defaultCc: string;
  token: string | null;
  placeholderHelp: string;
}) {
  const { toast } = useToast();
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [cc, setCc] = useState(defaultCc);
  const [showPreview, setShowPreview] = useState(false);
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
  }, [token, loaded]);

  const save = async () => {
    try {
      const saves = [
        { key: subjectKey, value: subject },
        { key: bodyKey, value: body },
        { key: ccKey, value: cc },
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

  const previewHtml = body
    .replace(/\{\{PDF_LINK\}\}/g, '<span style="color:#1e40af;font-weight:bold;">[📄 Ladda ner partneravtal (PDF)]</span>')
    .replace(/\{\{INVITATION_LINK\}\}/g, '<span style="color:#2563eb;font-weight:bold;">[🔗 Skapa/uppdatera partnerprofil]</span>')
    .replace(/\{\{DEADLINE\}\}/g, "30 april 2026")
    .replace(/\{\{START_DATE\}\}/g, "1 maj 2026")
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return {
    subject, body, cc, showPreview, setShowPreview,
    save, previewHtml,
    subjectInput: (
      <div>
        <Label>Ämnesrad</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
      </div>
    ),
    ccInput: (
      <div>
        <Label>CC (kommaseparerat)</Label>
        <Input value={cc} onChange={(e) => setCc(e.target.value)} className="mt-1" />
      </div>
    ),
    bodyEditor: (
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
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={20} className="font-mono text-sm" />
        )}
        <p className="text-xs text-muted-foreground mt-1">{placeholderHelp}</p>
      </div>
    ),
  };
}

const AdminAgreementTab = ({ partners, token, onRefresh, logout }: AdminAgreementTabProps) => {
  const { toast } = useToast();
  const [selectedPublished, setSelectedPublished] = useState<Set<string>>(new Set());
  const [selectedProspect, setSelectedProspect] = useState<Set<string>>(new Set());
  const [sendingPublished, setSendingPublished] = useState(false);
  const [sendingProspect, setSendingProspect] = useState(false);

  const publishedPartners = partners.filter(
    (p) => p.is_featured && (p.admin_contact_email || p.email)
  );

  const prospectPartners = partners.filter(
    (p) => !p.is_featured && (p.admin_contact_email || p.email)
  );

  const publishedEditor = EmailEditor({
    subjectKey: "agreement_email_subject",
    bodyKey: "agreement_email_body",
    ccKey: "agreement_email_cc",
    defaultSubject: DEFAULT_SUBJECT,
    defaultBody: DEFAULT_BODY,
    defaultCc: DEFAULT_CC,
    token,
    placeholderHelp: "Platshållare: {{PDF_LINK}}, {{DEADLINE}}, {{START_DATE}}",
  });

  const prospectEditor = EmailEditor({
    subjectKey: "prospect_agreement_email_subject",
    bodyKey: "prospect_agreement_email_body",
    ccKey: "prospect_agreement_email_cc",
    defaultSubject: PROSPECT_DEFAULT_SUBJECT,
    defaultBody: PROSPECT_DEFAULT_BODY,
    defaultCc: DEFAULT_CC,
    token,
    placeholderHelp: "Platshållare: {{INVITATION_LINK}}, {{PDF_LINK}}",
  });

  const pdfUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf`;

  const togglePartner = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
    setFn((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const toggleAll = (list: Partner[], set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    if (set.size === list.length) setFn(new Set());
    else setFn(new Set(list.map((p) => p.id)));
  };

  const sendEmails = async (
    action: string,
    selectedSet: Set<string>,
    setSelectedFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    setSendingFn: React.Dispatch<React.SetStateAction<boolean>>,
    editor: ReturnType<typeof EmailEditor>,
  ) => {
    const selectedPartners = partners.filter((p) => selectedSet.has(p.id));
    if (selectedPartners.length === 0) return;
    if (!confirm(`Skicka mail till ${selectedPartners.length} partner(s)?`)) return;

    setSendingFn(true);
    try {
      const partnerList = selectedPartners.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.admin_contact_email || p.email || "",
      }));
      const ccList = editor.cc.split(",").map((e) => e.trim()).filter(Boolean);

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
            subject: editor.subject,
            email_body: editor.body,
            cc: ccList,
          }),
        }
      );

      if (response.status === 401) { toast({ title: "Sessionen har gått ut", variant: "destructive" }); logout(); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kunde inte skicka");
      toast({ title: data.message || "Skickat!" });
      setSelectedFn(new Set());
      onRefresh();
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setSendingFn(false);
    }
  };

  const renderPartnerList = (
    list: Partner[],
    selected: Set<string>,
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => (
    <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
      {list.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">Inga partners hittades.</p>
      ) : (
        list.map((partner) => {
          const email = partner.admin_contact_email || partner.email || "";
          return (
            <label key={partner.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
              <Checkbox checked={selected.has(partner.id)} onCheckedChange={() => togglePartner(selected, setSelected, partner.id)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{partner.name}</span>
                  {partner.activation_date && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />Start: {partner.activation_date}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate block">{email}</span>
              </div>
              {partner.applications && partner.applications.length > 0 && (
                <div className="hidden md:flex gap-1 shrink-0">
                  {partner.applications.slice(0, 3).map((app) => (
                    <Badge key={app} variant="secondary" className="text-xs">{app}</Badge>
                  ))}
                  {partner.applications.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{partner.applications.length - 3}</Badge>
                  )}
                </div>
              )}
            </label>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ===== SECTION 1: Published partners ===== */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Partneravtal – Publicerade partners
        </h2>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">E-postmall</CardTitle>
            <CardDescription>Redigera mailet som skickas till publicerade partners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {publishedEditor.subjectInput}
            {publishedEditor.ccInput}
            {publishedEditor.bodyEditor}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={publishedEditor.save}>Spara mall</Button>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <FileText className="h-4 w-4" />Visa bifogad PDF
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4" />Skicka till publicerade partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm">{selectedPublished.size} av {publishedPartners.length} valda</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleAll(publishedPartners, selectedPublished, setSelectedPublished)}>
                  {selectedPublished.size === publishedPartners.length ? "Avmarkera alla" : "Markera alla"}
                </Button>
                <Button size="sm" disabled={selectedPublished.size === 0 || sendingPublished}
                  onClick={() => sendEmails("send-agreement", selectedPublished, setSelectedPublished, setSendingPublished, publishedEditor)}>
                  <Send className="h-4 w-4 mr-1" />{sendingPublished ? "Skickar..." : `Skicka (${selectedPublished.size})`}
                </Button>
              </div>
            </div>
            {renderPartnerList(publishedPartners, selectedPublished, setSelectedPublished)}
          </CardContent>
        </Card>
      </div>

      {/* ===== SECTION 2: Prospect partners (not published, have invitations) ===== */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Prospektmail – Ej publicerade partners
        </h2>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">E-postmall</CardTitle>
            <CardDescription>
              Redigera mailet som skickas till ej publicerade partners. Inkluderar profileringslänk och avtalsbilaga.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prospectEditor.subjectInput}
            {prospectEditor.ccInput}
            {prospectEditor.bodyEditor}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={prospectEditor.save}>Spara mall</Button>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <FileText className="h-4 w-4" />Visa bifogad PDF
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4" />Skicka till ej publicerade partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm">{selectedProspect.size} av {prospectPartners.length} valda</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleAll(prospectPartners, selectedProspect, setSelectedProspect)}>
                  {selectedProspect.size === prospectPartners.length ? "Avmarkera alla" : "Markera alla"}
                </Button>
                <Button size="sm" disabled={selectedProspect.size === 0 || sendingProspect}
                  onClick={() => sendEmails("send-prospect-agreement", selectedProspect, setSelectedProspect, setSendingProspect, prospectEditor)}>
                  <Send className="h-4 w-4 mr-1" />{sendingProspect ? "Skickar..." : `Skicka (${selectedProspect.size})`}
                </Button>
              </div>
            </div>
            {renderPartnerList(prospectPartners, selectedProspect, setSelectedProspect)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAgreementTab;
