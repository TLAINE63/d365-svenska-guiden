import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import UpdateRoundSection from "@/components/UpdateRoundSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { 
  Plus, Copy, Trash2, RefreshCw, CheckCircle2, Clock, Send, 
  ExternalLink, Mail, FileEdit, Save
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Invitation {
  id: string;
  partner_id: string | null;
  partner_name: string;
  email: string;
  token: string;
  status: "pending" | "submitted" | "approved" | "expired";
  expires_at: string;
  created_at: string;
  submitted_at: string | null;
}

interface PartnerInvitationsTabProps {
  token: string;
  partners: Array<{ id: string; name: string; slug: string; email: string; admin_contact_email: string; is_featured: boolean }>;
  onSessionExpired?: () => void;
}

const PartnerInvitationsTab = ({ token, partners, onSessionExpired }: PartnerInvitationsTabProps) => {

  const handleResponse = (response: Response) => {
    if (response.status === 401 && onSessionExpired) {
      toast.error("Sessionen har gått ut. Logga in igen.");
      onSessionExpired();
      throw new Error("Session expired");
    }
    return response;
  };
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [selectedForReminder, setSelectedForReminder] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sortOrder, setSortOrder] = useState<"created_desc" | "name_asc">("created_desc");
  
  // Email template state
  const [emailTemplate, setEmailTemplate] = useState("");
  const [emailTemplateOriginal, setEmailTemplateOriginal] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  
  // Create form state
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    partner_name: "",
    partner_id: "",
    send_email: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      handleResponse(response);
      if (!response.ok) {
        throw new Error("Kunde inte hämta data");
      }

      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Kunde inte hämta inbjudningar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchEmailTemplate = async () => {
    setLoadingTemplate(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      handleResponse(response);
      if (!response.ok) throw new Error("Kunde inte hämta mall");
      const data = await response.json();
      setEmailTemplate(data.template || "");
      setEmailTemplateOriginal(data.template || "");
    } catch (err) {
      console.error("Fetch template error:", err);
      toast.error("Kunde inte hämta e-postmall");
    } finally {
      setLoadingTemplate(false);
    }
  };

  const saveEmailTemplate = async () => {
    setSavingTemplate(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ template: emailTemplate }),
        }
      );
      handleResponse(response);
      if (!response.ok) throw new Error("Kunde inte spara mall");
      setEmailTemplateOriginal(emailTemplate);
      toast.success("E-postmall sparad!");
    } catch (err) {
      console.error("Save template error:", err);
      toast.error("Kunde inte spara e-postmall");
    } finally {
      setSavingTemplate(false);
    }
  };

  const createInvitation = async () => {
    if (!newInvitation.email || !newInvitation.partner_name) {
      toast.error("E-post och partnernamn krävs");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(newInvitation),
        }
      );

      handleResponse(response);
      if (!response.ok) {
        throw new Error("Kunde inte skapa inbjudan");
      }

      const result = await response.json();
      
      if (result.emailSent) {
        toast.success("Inbjudan skapad och e-post skickad!");
      } else if (result.emailError) {
        toast.success("Inbjudan skapad, men e-post kunde inte skickas: " + result.emailError);
      } else {
        toast.success("Inbjudan skapad!");
      }
      
      setShowCreateDialog(false);
      setNewInvitation({ email: "", partner_name: "", partner_id: "", send_email: true });
      fetchData();
    } catch (err) {
      console.error("Create error:", err);
      toast.error("Kunde inte skapa inbjudan");
    } finally {
      setCreating(false);
    }
  };

  const deleteInvitation = async (id: string) => {
    if (!confirm("Är du säker på att du vill radera denna inbjudan?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=delete&id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      handleResponse(response);
      if (!response.ok) {
        throw new Error("Kunde inte radera inbjudan");
      }

      toast.success("Inbjudan raderad");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Kunde inte radera inbjudan");
    }
  };

  const copyInvitationLink = (invToken: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/partner-update/${invToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Länk kopierad till urklipp!");
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date() && status === "pending";
    
    if (isExpired) {
      return <Badge variant="destructive">Utgången</Badge>;
    }
    
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-600"><Clock className="w-3 h-3 mr-1" />Väntar</Badge>;
      case "submitted":
        return <Badge variant="outline" className="border-blue-500 text-blue-600"><Send className="w-3 h-3 mr-1" />Inskickad</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Publicerad</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Count pending (not expired) invitations for reminder button
  const pendingInvitations = invitations.filter(
    inv => inv.status === "pending" && new Date(inv.expires_at) >= new Date()
  );

  const toggleReminderSelection = (id: string) => {
    setSelectedForReminder(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllReminders = () => {
    if (selectedForReminder.size === pendingInvitations.length) {
      setSelectedForReminder(new Set());
    } else {
      setSelectedForReminder(new Set(pendingInvitations.map(i => i.id)));
    }
  };

  const sendReminders = async () => {
    const ids = Array.from(selectedForReminder);
    if (ids.length === 0) {
      toast.error("Välj minst en partner att skicka påminnelse till");
      return;
    }
    if (!confirm(`Skicka påminnelse till ${ids.length} partner(s)?`)) return;
    
    setSendingReminders(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=send-reminders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ invitation_ids: ids }),
        }
      );

      const data = await response.json();

      handleResponse(response);
      if (!response.ok) {
        throw new Error(data.error || "Kunde inte skicka påminnelser");
      }

      toast.success(data.message || `Påminnelse skickad till ${data.sent} partners`);
      if (data.errors?.length) {
        console.warn("Reminder errors:", data.errors);
      }
      setSelectedForReminder(new Set());
    } catch (err: any) {
      console.error("Send reminders error:", err);
      toast.error(err.message || "Kunde inte skicka påminnelser");
    } finally {
      setSendingReminders(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Partnerinbjudningar</h2>
          <p className="text-sm text-muted-foreground">
            Skicka inbjudningar till partners för att uppdatera sina profiluppgifter. 
            Ändringar publiceras direkt – du får ett e-postmeddelande vid varje uppdatering.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (!showTemplateEditor) fetchEmailTemplate();
              setShowTemplateEditor(!showTemplateEditor);
            }}
          >
            <FileEdit className="w-4 h-4 mr-2" />
            {showTemplateEditor ? "Dölj mailmall" : "Redigera mailmall"}
          </Button>
          {pendingInvitations.length > 0 && (
            <Button 
              variant="outline" 
              onClick={sendReminders} 
              disabled={sendingReminders || selectedForReminder.size === 0}
              className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <Mail className={`w-4 h-4 mr-2 ${sendingReminders ? "animate-pulse" : ""}`} />
              {sendingReminders ? "Skickar..." : `Påminn valda (${selectedForReminder.size})`}
            </Button>
          )}
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Uppdatera
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ny inbjudan
          </Button>
        </div>
      </div>

      {/* Update round section */}
      <UpdateRoundSection
        token={token}
        partners={partners}
        invitations={invitations}
        onSessionExpired={onSessionExpired}
        onRefresh={fetchData}
      />

      {/* Email template editor */}
      {showTemplateEditor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileEdit className="w-5 h-5" />
              Inbjudningsmailets brödtext
            </CardTitle>
            <CardDescription>
              Redigera texten som skickas till partners vid inbjudan. Använd <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"{{INVITATION_LINK}}"}</code> där knappen för att uppdatera profil ska placeras. 
              Tomma rader skapar nya stycken. Webbadresser och e-postadresser görs automatiskt klickbara.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingTemplate ? (
              <div className="text-center py-8 text-muted-foreground">Laddar mall...</div>
            ) : (
              <>
                <Textarea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Skriv din mailtext här..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Ämnesrad är fast: "Vem är kundens mest lämpade Dynamics 365-partner?"
                  </p>
                  <div className="flex gap-2">
                    {emailTemplate !== emailTemplateOriginal && (
                      <Button 
                        variant="outline" 
                        onClick={() => setEmailTemplate(emailTemplateOriginal)}
                      >
                        Ångra ändringar
                      </Button>
                    )}
                    <Button 
                      onClick={saveEmailTemplate} 
                      disabled={savingTemplate || emailTemplate === emailTemplateOriginal}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {savingTemplate ? "Sparar..." : "Spara mall"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* All invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alla inbjudningar</CardTitle>
          <CardDescription>
            {invitations.length} inbjudningar totalt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Laddar...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Inga inbjudningar ännu. Skapa en ny för att komma igång.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    {pendingInvitations.length > 0 && (
                      <Checkbox
                        checked={selectedForReminder.size === pendingInvitations.length && pendingInvitations.length > 0}
                        onCheckedChange={toggleAllReminders}
                        title="Markera alla väntande"
                      />
                    )}
                  </TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skapad</TableHead>
                  <TableHead>Senast inskickad</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const isPending = invitation.status === "pending" && new Date(invitation.expires_at) >= new Date();
                  return (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      {isPending ? (
                        <Checkbox
                          checked={selectedForReminder.has(invitation.id)}
                          onCheckedChange={() => toggleReminderSelection(invitation.id)}
                        />
                      ) : null}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {invitation.partner_name}
                        {invitation.partner_id && (() => {
                          const partner = partners.find(p => p.id === invitation.partner_id);
                          if (partner && !partner.is_featured) {
                            return <Badge variant="outline" className="border-orange-400 text-orange-600 text-xs">Ej publicerad</Badge>;
                          }
                          return null;
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status, invitation.expires_at)}</TableCell>
                    <TableCell>
                      {format(new Date(invitation.created_at), "d MMM yyyy", { locale: sv })}
                    </TableCell>
                    <TableCell>
                      {invitation.submitted_at 
                        ? format(new Date(invitation.submitted_at), "d MMM yyyy HH:mm", { locale: sv })
                        : "-"
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyInvitationLink(invitation.token)}
                          title="Kopiera länk"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`/partner-update/${invitation.token}`, "_blank")}
                          title="Öppna formulär"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteInvitation(invitation.id)}
                          className="text-destructive hover:text-destructive"
                          title="Radera"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create invitation dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa ny inbjudan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="partner_name">Partnernamn *</Label>
              <Input
                id="partner_name"
                value={newInvitation.partner_name}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, partner_name: e.target.value }))}
                placeholder="Företagsnamn AB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post *</Label>
              <Input
                id="email"
                type="email"
                value={newInvitation.email}
                onChange={(e) => setNewInvitation(prev => ({ ...prev, email: e.target.value }))}
                placeholder="kontakt@foretag.se"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner_id">Koppla till befintlig partner (valfritt)</Label>
              <select
                id="partner_id"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newInvitation.partner_id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selected = partners.find(p => p.id === selectedId);
                  const autoEmail = selected ? (selected.admin_contact_email || selected.email || "") : "";
                  setNewInvitation(prev => ({ 
                    ...prev, 
                    partner_id: selectedId,
                    partner_name: selected ? selected.name : prev.partner_name,
                    email: autoEmail || prev.email,
                  }));
                }}
              >
                <option value="">-- Ny partner --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Om du väljer en befintlig partner kommer deras nuvarande uppgifter att förifyllas i formuläret.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="send_email"
                checked={newInvitation.send_email}
                onCheckedChange={(checked) => 
                  setNewInvitation(prev => ({ ...prev, send_email: checked === true }))
                }
              />
              <Label htmlFor="send_email" className="flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Skicka inbjudan via e-post
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Avbryt
            </Button>
            <Button onClick={createInvitation} disabled={creating}>
              {creating ? "Skapar..." : "Skapa inbjudan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerInvitationsTab;
