import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, CheckCircle2, Mail, Eye, EyeOff } from "lucide-react";

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

const DEFAULT_CC = "thomas.laine@dynamicfactory.se, michael.uhman@dynamicfactory.se";

const AdminAgreementTab = ({ partners, token, onRefresh, logout }: AdminAgreementTabProps) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [cc, setCc] = useState(DEFAULT_CC);
  const [showPreview, setShowPreview] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  const publishedPartners = partners.filter(
    (p) => p.is_featured && (p.admin_contact_email || p.email)
  );

  // Load saved template on mount
  useEffect(() => {
    if (!token || templateLoaded) return;
    const loadTemplate = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=agreement_email_subject`,
          { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data.template) setSubject(data.template);
        }

        const res2 = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=agreement_email_body`,
          { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.template) setBody(data2.template);
        }

        const res3 = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=agreement_email_cc`,
          { headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        if (res3.ok) {
          const data3 = await res3.json();
          if (data3.template) setCc(data3.template);
        }
      } catch (e) {
        console.error("Failed to load agreement template:", e);
      }
      setTemplateLoaded(true);
    };
    loadTemplate();
  }, [token, templateLoaded]);

  const togglePartner = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === publishedPartners.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(publishedPartners.map((p) => p.id)));
    }
  };

  const saveTemplate = async () => {
    try {
      const saves = [
        { key: "agreement_email_subject", value: subject },
        { key: "agreement_email_body", value: body },
        { key: "agreement_email_cc", value: cc },
      ];
      for (const s of saves) {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ template: s.value, template_key: s.key }),
          }
        );
      }
      toast({ title: "Mall sparad!" });
    } catch (e) {
      toast({ title: "Kunde inte spara mall", variant: "destructive" });
    }
  };

  const sendAgreementEmails = async () => {
    const selectedPartners = partners.filter((p) => selected.has(p.id));
    if (selectedPartners.length === 0) return;
    if (!confirm(`Skicka partneravtal till ${selectedPartners.length} partner(s)?`)) return;

    setSending(true);
    try {
      const partnerList = selectedPartners.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.admin_contact_email || p.email || "",
      }));

      const ccList = cc.split(",").map((e) => e.trim()).filter(Boolean);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-agreement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            partners: partnerList,
            subject,
            email_body: body,
            cc: ccList,
          }),
        }
      );

      if (response.status === 401) {
        toast({ title: "Sessionen har gått ut", variant: "destructive" });
        logout();
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kunde inte skicka avtal");

      toast({ title: data.message || "Partneravtal skickade!" });
      setSelected(new Set());
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka partneravtal",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const pdfUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/partner-documents/D365_Partner_Agreement_2026.pdf`;

  // Simple preview: convert plain text to paragraphs
  const previewHtml = body
    .replace(/\{\{PDF_LINK\}\}/g, '<span style="color:#2563eb;font-weight:bold;">[📄 Ladda ner partneravtal (PDF)]</span>')
    .replace(/\{\{DEADLINE\}\}/g, "30 april 2026")
    .replace(/\{\{START_DATE\}\}/g, "1 maj 2026")
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return (
    <div className="space-y-6">
      {/* Email editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Partneravtal – E-postmall
          </CardTitle>
          <CardDescription>
            Redigera ämnesrad och brödtext innan utskick. Använd {"{{PDF_LINK}}"} för PDF-knappen, {"{{DEADLINE}}"} och {"{{START_DATE}}"} som platshållare.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="agreement-subject">Ämnesrad</Label>
            <Input
              id="agreement-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="agreement-cc">CC (kommaseparerat)</Label>
            <Input
              id="agreement-cc"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              className="mt-1"
              placeholder="email1@example.com, email2@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="agreement-body">Brödtext</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? "Redigera" : "Förhandsgranska"}
              </Button>
            </div>
            {showPreview ? (
              <div
                className="border rounded-lg p-4 bg-white text-sm text-gray-800 max-h-[500px] overflow-y-auto prose prose-sm"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <Textarea
                id="agreement-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={saveTemplate}>
              Spara mall
            </Button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <FileText className="h-4 w-4" />
              Visa bifogad PDF (2026)
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Partner selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Skicka partneravtal
          </CardTitle>
          <CardDescription>
            Välj publicerade partners som ska få avtalsmail. Mailet skickas med CC till angivna adresser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">
              Publicerade partners ({selected.size} av {publishedPartners.length} valda)
            </Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selected.size === publishedPartners.length
                  ? "Avmarkera alla"
                  : "Markera alla"}
              </Button>
              <Button
                size="sm"
                onClick={sendAgreementEmails}
                disabled={selected.size === 0 || sending}
              >
                <Send className="h-4 w-4 mr-1" />
                {sending
                  ? "Skickar..."
                  : `Skicka avtal (${selected.size})`}
              </Button>
            </div>
          </div>

          <div className="border rounded-lg divide-y max-h-[500px] overflow-y-auto">
            {publishedPartners.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Inga publicerade partners med e-postadress hittades.
              </p>
            ) : (
              publishedPartners.map((partner) => {
                const email = partner.admin_contact_email || partner.email || "";
                return (
                  <label
                    key={partner.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selected.has(partner.id)}
                      onCheckedChange={() => togglePartner(partner.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {partner.name}
                        </span>
                        {partner.activation_date && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Start: {partner.activation_date}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block">
                        {email}
                      </span>
                    </div>
                    {partner.applications && partner.applications.length > 0 && (
                      <div className="hidden md:flex gap-1 shrink-0">
                        {partner.applications.slice(0, 3).map((app) => (
                          <Badge key={app} variant="secondary" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                        {partner.applications.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{partner.applications.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </label>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAgreementTab;
