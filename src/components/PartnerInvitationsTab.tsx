import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  AlertCircle, ExternalLink, Eye, Mail
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmissionCompareDialog } from "./SubmissionCompareDialog";

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

interface ProductFilter {
  industries: string[];
  geography: string[];
  swedenRegions: string[];
  swedenCities: string[];
  ranking: number;
  customerExamples: string[];
  customerCaseLinks: string[];
  productDescription: string;
}

interface ProductFilters {
  bc?: ProductFilter;
  fsc?: ProductFilter;
  sales?: ProductFilter;
  service?: ProductFilter;
}

interface Submission {
  id: string;
  invitation_id: string;
  partner_id: string | null;
  name: string;
  description: string;
  website: string;
  logo_url: string | null;
  contact_person: string | null;
  email: string;
  phone: string;
  address: string | null;
  applications: string[] | null;
  industries: string[] | null;
  secondary_industries: string[] | null;
  geography: string[] | null;
  product_filters: ProductFilters | null;
  notes: string | null;
  submitted_at: string;
  partner_invitations: {
    partner_name: string;
    email: string;
  };
}

interface PartnerInvitationsTabProps {
  token: string;
  partners: Array<{ id: string; name: string; slug: string }>;
}

const PartnerInvitationsTab = ({ token, partners }: PartnerInvitationsTabProps) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
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

      if (!response.ok) {
        throw new Error("Kunde inte hämta data");
      }

      const data = await response.json();
      setInvitations(data.invitations || []);
      setSubmissions(data.submissions || []);
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

  const approveSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ submission_id: submissionId }),
        }
      );

      if (!response.ok) {
        throw new Error("Kunde inte godkänna");
      }

      toast.success("Partneruppgifter godkända och uppdaterade!");
      setShowCompareDialog(false);
      setSelectedSubmission(null);
      setSelectedPartnerId(null);
      fetchData();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Kunde inte godkänna uppgifter");
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
        return <Badge variant="outline" className="border-blue-500 text-blue-600"><Send className="w-3 h-3 mr-1" />Inskickad (öppen)</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Godkänd (öppen)</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingSubmissions = submissions.filter(s => {
    const inv = invitations.find(i => i.id === s.invitation_id);
    return inv?.status === "submitted";
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Partnerinbjudningar</h2>
          <p className="text-sm text-muted-foreground">
            Skicka inbjudningar till partners för att uppdatera sina profiluppgifter. 
            Inbjudningar är öppna – partners kan använda samma länk för att uppdatera sin profil flera gånger.
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Pending submissions alert */}
      {pendingSubmissions.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  {pendingSubmissions.length} inskickade uppgifter väntar på granskning
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  Granska och godkänn partneruppgifter nedan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions awaiting approval */}
      {pendingSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Väntar på godkännande</CardTitle>
            <CardDescription>Granska och godkänn inskickade uppgifter</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>Inskickat</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>
                      {format(new Date(submission.submitted_at), "d MMM yyyy HH:mm", { locale: sv })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const inv = invitations.find(i => i.id === submission.invitation_id);
                            setSelectedSubmission(submission);
                            setSelectedPartnerId(inv?.partner_id || null);
                            setShowCompareDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Granska
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => approveSubmission(submission.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Godkänn
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <TableHead>Partner</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skapad</TableHead>
                  <TableHead>Går ut</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.partner_name}</TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status, invitation.expires_at)}</TableCell>
                    <TableCell>
                      {format(new Date(invitation.created_at), "d MMM yyyy", { locale: sv })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invitation.expires_at), "d MMM yyyy", { locale: sv })}
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
                ))}
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
                onChange={(e) => setNewInvitation(prev => ({ ...prev, partner_id: e.target.value }))}
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

      {/* Compare submission dialog */}
      <SubmissionCompareDialog
        open={showCompareDialog}
        onOpenChange={setShowCompareDialog}
        submission={selectedSubmission}
        partnerId={selectedPartnerId}
        token={token}
        onApprove={approveSubmission}
      />
    </div>
  );
};

export default PartnerInvitationsTab;
