import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  Calendar, ExternalLink, Plus, Trash2, Pencil, Check, ChevronsUpDown, Search, Building2, X, Link2, Copy, Loader2, Mail, FileEdit, Save, RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
  is_featured: boolean;
  slug: string;
  email: string;
  admin_contact_email: string;
}

interface PartnerEvent {
  id: string;
  partner_id: string | null;
  title: string;
  event_date: string;
  event_link: string | null;
  status: string;
  partners?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface AdminEventsTabProps {
  token: string;
  partners: Partner[];
  onSessionExpired: () => void;
}

export default function AdminEventsTab({ token, partners, onSessionExpired }: AdminEventsTabProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Partner search
  const [partnerSearchOpen, setPartnerSearchOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerFilter, setPartnerFilter] = useState("");
  
  // Event form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PartnerEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    event_link: "",
    event_date: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Email template state
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [eventTemplate, setEventTemplate] = useState("");
  const [eventTemplateOriginal, setEventTemplateOriginal] = useState("");
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=list-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte hämta events");
      }

      setEvents(data.events || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEventTemplate = async () => {
    setLoadingTemplate(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-email-template&template_key=event_invitation_email_body`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const data = await res.json();
      setEventTemplate(data.template || getDefaultEventTemplate());
      setEventTemplateOriginal(data.template || getDefaultEventTemplate());
    } catch (err) {
      console.error("Fetch template error:", err);
      toast({ title: "Fel", description: "Kunde inte hämta e-postmall", variant: "destructive" });
    } finally {
      setLoadingTemplate(false);
    }
  };

  const saveEventTemplate = async () => {
    setSavingTemplate(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=update-email-template`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ template: eventTemplate, template_key: "event_invitation_email_body" }),
        }
      );
      if (!res.ok) throw new Error("Kunde inte spara mall");
      setEventTemplateOriginal(eventTemplate);
      toast({ title: "Sparat!", description: "Event-inbjudningsmallen har sparats." });
    } catch (err) {
      toast({ title: "Fel", description: "Kunde inte spara e-postmall", variant: "destructive" });
    } finally {
      setSavingTemplate(false);
    }
  };

  const getDefaultEventTemplate = () => `Hej {{contact_name}},

Nu har ni möjlighet att publicera era events och webbinarier direkt på D365.se! Via er dedikerade event-portal kan ni enkelt lägga till, redigera och hantera era kommande events.

{{custom_message}}

📅 RIKTLINJER FÖR EVENTS
Events ska fokusera på Microsoft Dynamics 365 eller närliggande områden som AI, Copilot, Agents, BI och Power Platform.

{{PORTAL_LINK}}

Spara gärna länken – den är unik för {{partner_name}} och kan användas när ni vill lägga till eller uppdatera events. Inskickade events granskas och godkänns innan de publiceras.

Med vänliga hälsningar,
Thomas Laine
Senior Rådgivare inom Microsoft CRM- och Affärssystem
D365.se`;

  const handleSaveEvent = async () => {
    if (!selectedPartner || !formData.title || !formData.event_date || !formData.event_link) {
      toast({
        title: "Fyll i alla fält",
        description: "Titel, eventlänk och datum krävs.",
        variant: "destructive",
      });
      return;
    }

    // Use the selected partner's ID
    const partnerId = selectedPartner.id;

    setIsSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=admin-save-event`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partner_id: partnerId,
            event: {
              id: editingEvent?.id,
              title: formData.title,
              event_link: formData.event_link,
              event_date: formData.event_date,
              status: "approved",
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte spara event");
      }

      toast({
        title: editingEvent ? "Event uppdaterat" : "Event skapat",
        description: `${formData.title} har sparats.`,
      });

      closeForm();
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte spara event",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Är du säker på att du vill ta bort "${eventTitle}"?`)) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=admin-delete-event&eventId=${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte ta bort event");
      }

      toast({
        title: "Event borttaget",
        description: `${eventTitle} har tagits bort.`,
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte ta bort event",
        variant: "destructive",
      });
    }
  };

  const openNewForm = (partner: Partner) => {
    setSelectedPartner(partner);
    setEditingEvent(null);
    setFormData({ title: "", event_link: "", event_date: "" });
    setIsFormOpen(true);
  };

  const openEditForm = (event: PartnerEvent) => {
    const partner = partners.find(p => p.id === event.partner_id);
    if (partner) {
      setSelectedPartner(partner);
    }
    setEditingEvent(event);
    setFormData({
      title: event.title,
      event_link: event.event_link || "",
      event_date: event.event_date,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
    setSelectedPartner(null);
    setFormData({ title: "", event_link: "", event_date: "" });
  };

  // Filter partners based on search - show ALL partners, not just featured
  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(partnerFilter.toLowerCase())
  );

  // Sort all events: upcoming first (nearest first), then past (newest first)
  const allEventsSorted = [...events].sort((a, b) => {
    const now = new Date();
    const aUpcoming = new Date(a.event_date) >= now;
    const bUpcoming = new Date(b.event_date) >= now;
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;
    if (aUpcoming && bUpcoming) return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
  });

  const upcomingCount = events.filter(e => new Date(e.event_date) >= new Date()).length;

  const displayedEvents = selectedPartner 
    ? allEventsSorted.filter(e => e.partner_id === selectedPartner.id)
    : allEventsSorted;

  // Check if event is upcoming
  const isUpcoming = (dateStr: string) => new Date(dateStr) >= new Date();

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMM yyyy", { locale: sv });
    } catch {
      return dateStr;
    }
  };

  const [generatingLink, setGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailConfirmPartner, setEmailConfirmPartner] = useState<Partner | null>(null);

  const handleConfirmSendEmail = (partner: Partner) => {
    setEmailConfirmPartner(partner);
  };

  const handleGenerateEventLink = async (partner: Partner) => {
    setGeneratingLink(true);
    setGeneratedLink(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=create-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partner_id: partner.id }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte skapa länk");
      }
      const url = data.url || `${window.location.origin}/partner-events/${data.token}`;
      setGeneratedLink(url);
      toast({ title: "Länk genererad", description: `Event-portallänk skapad för ${partner.name}` });
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Kopierad!", description: "Länken har kopierats till urklipp." });
  };

  const handleSendEmailLink = async (partner: Partner) => {
    setSendingEmail(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=send-event-link-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partner_id: partner.id }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte skicka e-post");
      }
      toast({ title: "E-post skickad!", description: `Event-portallänken har skickats till ${data.email}` });
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setSendingEmail(false);
    }
  };

  // Bulk email state
  const [bulkEmailOpen, setBulkEmailOpen] = useState(false);
  const [bulkCustomMessage, setBulkCustomMessage] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<Set<string>>(new Set());

  const featuredPartners = partners.filter(p => p.is_featured);
  const featuredWithEmail = featuredPartners.filter(p => p.admin_contact_email || p.email);

  const handleOpenBulkEmail = () => {
    // Pre-select all featured partners with email
    setSelectedPartnerIds(new Set(featuredWithEmail.map(p => p.id)));
    setBulkEmailOpen(true);
  };

  const togglePartnerSelection = (id: string) => {
    setSelectedPartnerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPartners = () => {
    if (selectedPartnerIds.size === featuredWithEmail.length) {
      setSelectedPartnerIds(new Set());
    } else {
      setSelectedPartnerIds(new Set(featuredWithEmail.map(p => p.id)));
    }
  };

  const handleBulkSendEventEmail = async () => {
    setBulkSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=bulk-send-event-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ custom_message: bulkCustomMessage || undefined }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte skicka e-post");
      }
      toast({
        title: "Utskick klart!",
        description: `${data.sent} av ${data.total} e-postmeddelanden skickade.${data.failed ? ` ${data.failed} misslyckades.` : ''}`,
      });
      setBulkEmailOpen(false);
      setBulkCustomMessage("");
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skicka e-post",
        variant: "destructive",
      });
    } finally {
      setBulkSending(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Bulk send + filter header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            {featuredWithEmail.length} publicerade partners med e-post
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => {
                if (!showTemplateEditor) fetchEventTemplate();
                setShowTemplateEditor(!showTemplateEditor);
              }}
            >
              <FileEdit className="h-4 w-4" />
              {showTemplateEditor ? "Dölj mailmall" : "Redigera mailmall"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setBulkEmailOpen(true)}
            >
              <Mail className="h-4 w-4" />
              Skicka event-inbjudan till alla partners
            </Button>
          </div>
        </div>

        {/* Email template editor */}
        {showTemplateEditor && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileEdit className="h-4 w-4" />
                E-postmall för event-inbjudan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingTemplate ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <Textarea
                    value={eventTemplate}
                    onChange={(e) => setEventTemplate(e.target.value)}
                    rows={14}
                    className="font-mono text-sm"
                  />
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    <span className="font-medium">Platshållare:</span>
                    <Badge variant="outline" className="text-xs font-mono">{"{{contact_name}}"}</Badge>
                    <Badge variant="outline" className="text-xs font-mono">{"{{partner_name}}"}</Badge>
                    <Badge variant="outline" className="text-xs font-mono">{"{{PORTAL_LINK}}"}</Badge>
                    <Badge variant="outline" className="text-xs font-mono">{"{{custom_message}}"}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={saveEventTemplate} 
                      disabled={savingTemplate || eventTemplate === eventTemplateOriginal}
                      className="gap-2"
                    >
                      {savingTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Spara mall
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEventTemplate(getDefaultEventTemplate())}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Återställ standard
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <Label className="text-base font-semibold mb-2 block">Filtrera på partner</Label>
            <div className="flex items-center gap-2">
              <Popover open={partnerSearchOpen} onOpenChange={setPartnerSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={partnerSearchOpen}
                    className="w-full md:w-96 justify-between"
                  >
                    {selectedPartner ? (
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {selectedPartner.name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Alla kommande events
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full md:w-96 p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Sök partner..." 
                      value={partnerFilter}
                      onValueChange={setPartnerFilter}
                    />
                    <CommandList>
                      <CommandEmpty>Ingen partner hittades.</CommandEmpty>
                      <CommandGroup>
                        {filteredPartners.map((partner) => (
                          <CommandItem
                            key={partner.id}
                            value={partner.name}
                            onSelect={() => {
                              setSelectedPartner(partner);
                              setPartnerSearchOpen(false);
                              setPartnerFilter("");
                              setGeneratedLink(null);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPartner?.id === partner.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {partner.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedPartner && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => { setSelectedPartner(null); setGeneratedLink(null); }}
                  title="Visa alla kommande events"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {selectedPartner && (
            <div className="flex gap-2 self-end">
              {selectedPartner.is_featured && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleConfirmSendEmail(selectedPartner)}
                    disabled={sendingEmail}
                  >
                    {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    Skicka via e-post
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleGenerateEventLink(selectedPartner)}
                    disabled={generatingLink}
                  >
                    {generatingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    Kopiera event-länk
                  </Button>
                </>
              )}
              <Button onClick={() => openNewForm(selectedPartner)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Lägg till event
              </Button>
            </div>
          )}
        </div>

        {/* Generated link display */}
        {generatedLink && selectedPartner && (
          <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Event-portallänk för {selectedPartner.name}
            </p>
            <div className="flex items-center gap-2">
              <Input value={generatedLink} readOnly className="text-sm font-mono" />
              <Button size="icon" variant="outline" onClick={() => handleCopyLink(generatedLink)} title="Kopiera länk">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Skicka denna länk till partnern så kan de själva publicera och hantera sina events.
            </p>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {selectedPartner ? `Events för ${selectedPartner.name}` : `Alla events (${events.length} totalt, ${upcomingCount} kommande)`}
            </h3>
          </div>

          {displayedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{selectedPartner ? "Inga events för denna partner." : "Inga kommande events."}</p>
              {selectedPartner && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => openNewForm(selectedPartner)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Lägg till första event
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {!selectedPartner && <TableHead>Arrangör</TableHead>}
                    <TableHead>Titel</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Eventlänk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedEvents.map((event) => (
                    <TableRow key={event.id} className={!isUpcoming(event.event_date) ? "opacity-50" : ""}>
                      {!selectedPartner && (
                        <TableCell>
                          <span className="font-medium text-sm">
                            {event.partners?.name || "—"}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(event.event_date)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {event.event_link ? (
                          <a
                            href={event.event_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 max-w-xs truncate"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">{event.event_link}</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {event.status === "approved" ? (
                            <Badge variant="default" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 w-fit">Godkänd</Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-700 border-amber-300 w-fit">Väntar</Badge>
                          )}
                          {!isUpcoming(event.event_date) && (
                            <Badge variant="secondary" className="w-fit">Passerat</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditForm(event)}
                            title="Redigera"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                            className="text-destructive hover:text-destructive"
                            title="Ta bort"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Event Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Redigera event" : "Lägg till event"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  placeholder="T.ex. Webinar: Dynamics 365 Sales"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event_link">Eventlänk *</Label>
                <Input
                  id="event_link"
                  type="url"
                  placeholder="https://partner.se/events/..."
                  value={formData.event_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_link: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Länk till partnerns eventsida
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event_date">Datum *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeForm}>
                Avbryt
              </Button>
              <Button onClick={handleSaveEvent} disabled={isSaving}>
                {isSaving ? "Sparar..." : (editingEvent ? "Spara ändringar" : "Lägg till")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Confirmation Dialog */}
        <Dialog open={!!emailConfirmPartner} onOpenChange={(open) => !open && setEmailConfirmPartner(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bekräfta e-postutskick</DialogTitle>
            </DialogHeader>
            {emailConfirmPartner && (
              <div className="space-y-4 py-4">
                <p className="text-sm">
                  Event-portallänken kommer att skickas till:
                </p>
                <div className="p-3 rounded-lg border bg-muted/30 space-y-1">
                  <p className="font-medium">{emailConfirmPartner.name}</p>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {emailConfirmPartner.admin_contact_email || emailConfirmPartner.email || <span className="text-destructive">Ingen e-post registrerad</span>}
                  </p>
                  {emailConfirmPartner.admin_contact_email && emailConfirmPartner.email && emailConfirmPartner.admin_contact_email !== emailConfirmPartner.email && (
                    <p className="text-xs text-muted-foreground">
                      Profilkontakt: {emailConfirmPartner.email}
                    </p>
                  )}
                </div>
                {!emailConfirmPartner.admin_contact_email && !emailConfirmPartner.email && (
                  <p className="text-sm text-destructive">
                    Partnern saknar e-postadress. Lägg till en e-post i partnerinställningarna först.
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailConfirmPartner(null)}>
                Avbryt
              </Button>
              <Button 
                onClick={() => {
                  if (emailConfirmPartner) {
                    handleSendEmailLink(emailConfirmPartner);
                    setEmailConfirmPartner(null);
                  }
                }}
                disabled={!(emailConfirmPartner?.admin_contact_email || emailConfirmPartner?.email) || sendingEmail}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Skicka
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Email Dialog */}
        <Dialog open={bulkEmailOpen} onOpenChange={(open) => !open && setBulkEmailOpen(false)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Skicka event-inbjudan till alla partners</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                E-postmeddelandet skickas till <strong>{featuredWithEmail.length}</strong> publicerade partners med registrerad e-postadress. 
                Varje partner får sin unika event-portallänk.
              </p>
              
              <div className="space-y-2">
                <Label>Valfritt meddelande (visas i mailet)</Label>
                <Textarea
                  value={bulkCustomMessage}
                  onChange={(e) => setBulkCustomMessage(e.target.value)}
                  placeholder="T.ex. 'Vi uppmanar alla partners att lägga till sina kommande events inför hösten...'"
                  rows={3}
                />
              </div>

              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  <strong>Mailet innehåller:</strong> En inbjudan att publicera events på D365.se, riktlinjer för events, och en unik länk till partnerns event-portal.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkEmailOpen(false)} disabled={bulkSending}>
                Avbryt
              </Button>
              <Button 
                onClick={handleBulkSendEventEmail} 
                disabled={bulkSending || featuredWithEmail.length === 0}
                className="gap-2"
              >
                {bulkSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {bulkSending ? "Skickar..." : `Skicka till ${featuredWithEmail.length} partners`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
