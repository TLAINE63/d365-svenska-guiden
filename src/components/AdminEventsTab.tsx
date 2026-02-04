import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  Calendar, Check, X, Clock, Link as LinkIcon, Copy, ExternalLink,
  Building2, Video, MapPin, Eye, RefreshCw
} from "lucide-react";

interface Partner {
  id: string;
  name: string;
  is_featured: boolean;
  slug: string;
}

interface PartnerEvent {
  id: string;
  partner_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  end_time: string | null;
  is_online: boolean;
  location: string | null;
  event_link: string | null;
  registration_link: string | null;
  recording_url: string | null;
  recording_available: boolean;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  partners?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
}

interface EventToken {
  id: string;
  partner_id: string;
  token: string;
  created_at: string;
  last_accessed_at: string | null;
  partners?: {
    id: string;
    name: string;
    is_featured: boolean;
  };
}

interface AdminEventsTabProps {
  token: string;
  partners: Partner[];
  onSessionExpired: () => void;
}

export default function AdminEventsTab({ token, partners, onSessionExpired }: AdminEventsTabProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  const [tokens, setTokens] = useState<EventToken[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PartnerEvent | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedPartnerForToken, setSelectedPartnerForToken] = useState<string>("");
  const [isCreatingToken, setIsCreatingToken] = useState(false);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
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
      setIsLoadingEvents(false);
    }
  };

  const fetchTokens = async () => {
    setIsLoadingTokens(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=list-tokens`,
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
        throw new Error(data.error || "Kunde inte hämta tokens");
      }

      setTokens(data.tokens || []);
    } catch (error: any) {
      console.error("Error fetching tokens:", error);
      toast({
        title: "Fel",
        description: error.message || "Kunde inte hämta tokens",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchTokens();
  }, [token]);

  const handleReviewEvent = async (status: "approved" | "rejected") => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: selectedEvent.id,
            status,
            admin_notes: adminNotes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte uppdatera event");
      }

      toast({
        title: status === "approved" ? "Event godkänt" : "Event avvisat",
        description: `${selectedEvent.title} har ${status === "approved" ? "godkänts" : "avvisats"}.`,
      });

      setIsReviewDialogOpen(false);
      setSelectedEvent(null);
      setAdminNotes("");
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte uppdatera event",
        variant: "destructive",
      });
    }
  };

  const handleCreateToken = async () => {
    if (!selectedPartnerForToken) {
      toast({
        title: "Välj partner",
        description: "Du måste välja en partner för att skapa en token.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingToken(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=create-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partner_id: selectedPartnerForToken }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("gått ut") || data.error?.includes("session")) {
          onSessionExpired();
        }
        throw new Error(data.error || "Kunde inte skapa token");
      }

      toast({
        title: "Token skapad",
        description: "Event-länken har skapats för partnern.",
      });

      // Copy URL to clipboard
      await navigator.clipboard.writeText(data.url);
      toast({
        title: "Länk kopierad",
        description: "Event-länken har kopierats till urklipp.",
      });

      setSelectedPartnerForToken("");
      fetchTokens();
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Kunde inte skapa token",
        variant: "destructive",
      });
    } finally {
      setIsCreatingToken(false);
    }
  };

  const copyTokenUrl = async (tokenValue: string) => {
    const url = `https://d365-svenska-guiden.lovable.app/partner-events/${tokenValue}`;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Länk kopierad",
      description: "Event-länken har kopierats till urklipp.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Väntar</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Godkänt</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Avvisat</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const featuredPartners = partners.filter(p => p.is_featured);
  const pendingEvents = events.filter(e => e.status === "pending");

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
              {pendingEvents.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800">
                  {pendingEvents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Event-länkar
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Hantera events från partners. Godkänd events visas på den publika event-sidan.
              </p>
              <Button variant="outline" size="sm" onClick={fetchEvents} disabled={isLoadingEvents}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingEvents ? "animate-spin" : ""}`} />
                Uppdatera
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skapad</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Inga events ännu
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id} className={event.status === "pending" ? "bg-yellow-50/50" : ""}>
                      <TableCell className="font-medium">
                        {event.partners?.name || "Okänd"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(event.event_date), "d MMM yyyy", { locale: sv })}
                        {event.event_time && (
                          <span className="text-muted-foreground text-xs block">
                            {event.event_time.slice(0, 5)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {event.is_online ? (
                            <><Video className="h-3 w-3 mr-1" />Online</>
                          ) : (
                            <><MapPin className="h-3 w-3 mr-1" />På plats</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), "d MMM", { locale: sv })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setAdminNotes(event.admin_notes || "");
                            setIsReviewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Granska
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="space-y-4">
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Skapa event-länk för partner</CardTitle>
                <CardDescription>
                  Endast utvalda partners kan få event-länkar. Välj en partner och skapa en unik länk.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Select
                    value={selectedPartnerForToken}
                    onValueChange={setSelectedPartnerForToken}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Välj utvald partner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {featuredPartners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleCreateToken}
                    disabled={isCreatingToken || !selectedPartnerForToken}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Skapa länk
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Skapad</TableHead>
                  <TableHead>Senast använd</TableHead>
                  <TableHead>Länk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Inga event-länkar skapade ännu
                    </TableCell>
                  </TableRow>
                ) : (
                  tokens.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {t.partners?.name || "Okänd"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(t.created_at), "d MMM yyyy", { locale: sv })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.last_accessed_at
                          ? format(new Date(t.last_accessed_at), "d MMM yyyy HH:mm", { locale: sv })
                          : "Aldrig"
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                            ...{t.token.slice(-12)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyTokenUrl(t.token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a
                              href={`https://d365-svenska-guiden.lovable.app/partner-events/${t.token}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Granska event</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Partner</p>
                    <p className="font-medium">{selectedEvent.partners?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {getStatusBadge(selectedEvent.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Titel</p>
                  <p className="font-semibold text-lg">{selectedEvent.title}</p>
                </div>

                {selectedEvent.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Beskrivning</p>
                    <p className="text-sm">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Datum</p>
                    <p>{format(new Date(selectedEvent.event_date), "d MMMM yyyy", { locale: sv })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tid</p>
                    <p>
                      {selectedEvent.event_time?.slice(0, 5) || "Ej angivet"}
                      {selectedEvent.end_time && ` - ${selectedEvent.end_time.slice(0, 5)}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Typ</p>
                    <Badge variant="outline">
                      {selectedEvent.is_online ? "Online" : "På plats"}
                    </Badge>
                  </div>
                  {!selectedEvent.is_online && selectedEvent.location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plats</p>
                      <p className="text-sm">{selectedEvent.location}</p>
                    </div>
                  )}
                </div>

                {selectedEvent.event_link && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Event-länk</p>
                    <a
                      href={selectedEvent.event_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedEvent.event_link}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {selectedEvent.registration_link && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Anmälningslänk</p>
                    <a
                      href={selectedEvent.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedEvent.registration_link}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {selectedEvent.recording_available && selectedEvent.recording_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Inspelning</p>
                    <a
                      href={selectedEvent.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedEvent.recording_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Admin-anteckningar</p>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Lägg till anteckningar (valfritt)..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
              >
                Avbryt
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReviewEvent("rejected")}
              >
                <X className="h-4 w-4 mr-2" />
                Avvisa
              </Button>
              <Button
                onClick={() => handleReviewEvent("approved")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Godkänn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
