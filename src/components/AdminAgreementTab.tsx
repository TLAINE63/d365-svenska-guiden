import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, Calendar, CheckCircle2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  email: string | null;
  admin_contact_email: string | null;
  activation_date: string | null;
  applications: string[] | null;
}

interface AdminAgreementTabProps {
  partners: Partner[];
  token: string | null;
  onRefresh: () => void;
  logout: () => void;
}

const AdminAgreementTab = ({ partners, token, onRefresh, logout }: AdminAgreementTabProps) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [deadline, setDeadline] = useState("2026-04-30");
  const [startDate, setStartDate] = useState("2026-05-01");

  const formatDateSv = (iso: string) => iso.replace(/-/g, "/");

  const partnersWithEmail = partners.filter(
    (p) => p.admin_contact_email || p.email
  );

  const togglePartner = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === partnersWithEmail.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(partnersWithEmail.map((p) => p.id)));
    }
  };

  const sendAgreementEmails = async () => {
    const selectedPartners = partners.filter((p) => selected.has(p.id));
    if (selectedPartners.length === 0) return;
    if (
      !confirm(
        `Skicka partneravtal till ${selectedPartners.length} partner(s)? Startdatum: ${formatDateSv(startDate)}, deadline: ${formatDateSv(deadline)}`
      )
    )
      return;

    setSending(true);
    try {
      const partnerList = selectedPartners.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.admin_contact_email || p.email || "",
      }));

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
            deadline,
            start_date: startDate,
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
      console.error("Send agreement error:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka partneravtal",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const pdfUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/partner-documents/D365_Partner_Agreement.pdf`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Skicka partneravtal
          </CardTitle>
          <CardDescription>
            Skicka avtalsvillkor till valda partners med bifogad PDF.
            Aktiveringsddatum sätts automatiskt på partnern.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start-date" className="flex items-center gap-1 mb-1">
                <Calendar className="h-3.5 w-3.5" />
                Startdatum (debitering)
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deadline" className="flex items-center gap-1 mb-1">
                <Calendar className="h-3.5 w-3.5" />
                Deadline för bekräftelse
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                Visa bifogad PDF
              </a>
            </div>
          </div>

          {/* Partner selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">
                Välj partners ({selected.size} av {partnersWithEmail.length} valda)
              </Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={toggleAll}>
                  {selected.size === partnersWithEmail.length
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
              {partnersWithEmail.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  Inga partners med e-postadress hittades.
                </p>
              ) : (
                partnersWithEmail.map((partner) => {
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAgreementTab;
