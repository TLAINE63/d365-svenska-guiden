import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RotateCw, Send, AlertTriangle, CheckCircle2 } from "lucide-react";

interface UpdateRound {
  date: string;
  label: string;
}

interface Invitation {
  id: string;
  partner_id: string | null;
  partner_name: string;
  email: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  admin_contact_email: string;
  is_featured: boolean;
}

interface UpdateRoundSectionProps {
  token: string;
  partners: Partner[];
  invitations: Invitation[];
  onSessionExpired?: () => void;
  onRefresh: () => void;
}

const UpdateRoundSection = ({ token, partners, invitations, onSessionExpired, onRefresh }: UpdateRoundSectionProps) => {
  const [round, setRound] = useState<UpdateRound | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [roundLabel, setRoundLabel] = useState("");
  const [selectedPartners, setSelectedPartners] = useState<Set<string>>(new Set());

  const handleResponse = (response: Response) => {
    if (response.status === 401 && onSessionExpired) {
      toast.error("Sessionen har gått ut. Logga in igen.");
      onSessionExpired();
      throw new Error("Session expired");
    }
    return response;
  };

  const fetchRound = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-update-round`,
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
      if (!response.ok) throw new Error("Kunde inte hämta runda");
      const data = await response.json();
      setRound(data.round || null);
    } catch (err: any) {
      if (err.message !== "Session expired") {
        console.error("Fetch round error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRound();
  }, [token]);

  const startNewRound = async () => {
    setStarting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=start-update-round`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ label: roundLabel }),
        }
      );
      handleResponse(response);
      if (!response.ok) throw new Error("Kunde inte starta runda");
      const data = await response.json();
      setRound({ date: data.date, label: data.label });
      setShowStartDialog(false);
      setRoundLabel("");
      setSelectedPartners(new Set());
      toast.success("Ny uppdateringsrunda startad!");
    } catch (err: any) {
      if (err.message !== "Session expired") {
        toast.error("Kunde inte starta uppdateringsrunda");
      }
    } finally {
      setStarting(false);
    }
  };

  // Determine which featured partners need to update
  const partnersNeedingUpdate = useMemo(() => {
    if (!round) return [];
    const roundDate = new Date(round.date);
    
    return partners.filter(p => {
      if (!p.is_featured) return false;
      
      // Find the latest approved invitation for this partner submitted AFTER the round date
      const partnerInvitations = invitations.filter(
        inv => inv.partner_id === p.id && inv.status === "approved" && inv.submitted_at
      );
      
      const hasUpdatedSinceRound = partnerInvitations.some(
        inv => inv.submitted_at && new Date(inv.submitted_at) > roundDate
      );
      
      // Also check if a pending invitation was created AFTER the round date (invitation sent but not yet responded)
      const hasPendingInvitationSinceRound = invitations.some(
        inv => inv.partner_id === p.id && inv.status === "pending" && new Date(inv.created_at) > roundDate
      );
      
      return !hasUpdatedSinceRound;
    });
  }, [round, partners, invitations]);

  // Partners that have a pending invitation already (since round)
  const partnersWithPendingInvitation = useMemo(() => {
    if (!round) return new Set<string>();
    const roundDate = new Date(round.date);
    const ids = new Set<string>();
    invitations.forEach(inv => {
      if (inv.partner_id && inv.status === "pending" && new Date(inv.created_at) > roundDate) {
        ids.add(inv.partner_id);
      }
    });
    return ids;
  }, [round, invitations]);

  // Partners that can receive a new invitation (need update + no pending invitation since round)
  const sendablePartners = useMemo(() => {
    return partnersNeedingUpdate.filter(p => !partnersWithPendingInvitation.has(p.id));
  }, [partnersNeedingUpdate, partnersWithPendingInvitation]);

  const togglePartner = (id: string) => {
    setSelectedPartners(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAllSendable = () => {
    if (selectedPartners.size === sendablePartners.length) {
      setSelectedPartners(new Set());
    } else {
      setSelectedPartners(new Set(sendablePartners.map(p => p.id)));
    }
  };

  const sendBulkInvitations = async () => {
    const selected = sendablePartners.filter(p => selectedPartners.has(p.id));
    if (selected.length === 0) {
      toast.error("Välj minst en partner");
      return;
    }
    if (!confirm(`Skicka inbjudningar till ${selected.length} partners?`)) return;

    setSending(true);
    try {
      const partnerList = selected.map(p => ({
        id: p.id,
        name: p.name,
        email: p.admin_contact_email || p.email,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=bulk-create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ partners: partnerList, send_email: true }),
        }
      );
      handleResponse(response);
      if (!response.ok) throw new Error("Kunde inte skapa inbjudningar");
      const data = await response.json();
      toast.success(data.message || "Inbjudningar skickade!");
      setSelectedPartners(new Set());
      onRefresh();
    } catch (err: any) {
      if (err.message !== "Session expired") {
        toast.error("Kunde inte skicka inbjudningar");
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) return null;

  const updatedCount = round ? partners.filter(p => p.is_featured).length - partnersNeedingUpdate.length : 0;
  const totalFeatured = partners.filter(p => p.is_featured).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <RotateCw className="w-5 h-5" />
              Uppdateringsrunda
            </CardTitle>
            <CardDescription>
              Starta en runda när ni gjort ändringar i profilformuläret (t.ex. lagt till AI-fält). 
              Systemet visar vilka partners som behöver uppdatera.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setShowStartDialog(true)}>
            <RotateCw className="w-4 h-4 mr-2" />
            Starta ny runda
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!round ? (
          <p className="text-sm text-muted-foreground">Ingen uppdateringsrunda har startats ännu.</p>
        ) : (
          <div className="space-y-4">
            {/* Round info */}
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline">
                Startad: {format(new Date(round.date), "d MMM yyyy HH:mm", { locale: sv })}
              </Badge>
              {round.label && <Badge variant="secondary">{round.label}</Badge>}
              <span className="text-muted-foreground">
                {updatedCount} av {totalFeatured} publicerade partners har uppdaterat
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all" 
                style={{ width: `${totalFeatured > 0 ? (updatedCount / totalFeatured) * 100 : 0}%` }}
              />
            </div>

            {/* Partners needing update */}
            {partnersNeedingUpdate.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Alla publicerade partners har uppdaterat sin profil!
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    {partnersNeedingUpdate.length} partners behöver uppdatera
                  </p>
                  {sendablePartners.length > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={toggleAllSendable}
                      >
                        {selectedPartners.size === sendablePartners.length ? "Avmarkera alla" : "Markera alla"}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={sendBulkInvitations} 
                        disabled={sending || selectedPartners.size === 0}
                      >
                        <Send className={`w-4 h-4 mr-2 ${sending ? "animate-pulse" : ""}`} />
                        {sending ? "Skickar..." : `Skicka inbjudan (${selectedPartners.size})`}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {partnersNeedingUpdate.map(p => {
                    const hasPending = partnersWithPendingInvitation.has(p.id);
                    const targetEmail = p.admin_contact_email || p.email;
                    return (
                      <div 
                        key={p.id} 
                        className="flex items-center gap-3 py-2 px-3 rounded-md border bg-card text-sm"
                      >
                        {!hasPending && (
                          <Checkbox
                            checked={selectedPartners.has(p.id)}
                            onCheckedChange={() => togglePartner(p.id)}
                          />
                        )}
                        <span className="font-medium flex-1">{p.name}</span>
                        <span className="text-muted-foreground text-xs">{targetEmail}</span>
                        {hasPending ? (
                          <Badge variant="outline" className="text-xs border-amber-400 text-amber-600">
                            Inbjudan skickad
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs border-red-400 text-red-600">
                            Ej uppdaterad
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Start new round dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Starta ny uppdateringsrunda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Detta markerar att alla partners behöver uppdatera sin profil. 
              En ny runda ersätter den gamla.
            </p>
            <div className="space-y-2">
              <Label htmlFor="round_label">Anledning (valfritt)</Label>
              <Input
                id="round_label"
                value={roundLabel}
                onChange={(e) => setRoundLabel(e.target.value)}
                placeholder="t.ex. AI-kapabilitet tillagd"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDialog(false)}>
              Avbryt
            </Button>
            <Button onClick={startNewRound} disabled={starting}>
              {starting ? "Startar..." : "Starta runda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UpdateRoundSection;
