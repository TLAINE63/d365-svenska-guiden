import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  Calendar, ExternalLink, Plus, Trash2, Pencil, Check, ChevronsUpDown, Search, Building2, X, Link2, Copy, Loader2, Mail
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

  // Get events - show all upcoming if no partner selected, otherwise filter by partner
  const upcomingEvents = events
    .filter(e => new Date(e.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

  const displayedEvents = selectedPartner 
    ? events.filter(e => e.partner_id === selectedPartner.id)
    : upcomingEvents;

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

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Partner Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
              {selectedPartner ? `Events för ${selectedPartner.name}` : `Kommande events (${upcomingEvents.length})`}
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
                        {isUpcoming(event.event_date) ? (
                          <Badge variant="default" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Kommande</Badge>
                        ) : (
                          <Badge variant="secondary">Passerat</Badge>
                        )}
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
                    {emailConfirmPartner.email || <span className="text-destructive">Ingen e-post registrerad</span>}
                  </p>
                  {emailConfirmPartner.admin_contact_email && emailConfirmPartner.admin_contact_email !== emailConfirmPartner.email && (
                    <p className="text-xs text-muted-foreground">
                      Admin-kontakt: {emailConfirmPartner.admin_contact_email}
                    </p>
                  )}
                </div>
                {!emailConfirmPartner.email && (
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
                disabled={!emailConfirmPartner?.email || sendingEmail}
                className="gap-2"
              >
                <Mail className="h-4 w-4" />
                Skicka
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
