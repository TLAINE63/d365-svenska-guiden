import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Loader2, 
  Calendar, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Edit
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
}

interface PartnerEvent {
  id?: string;
  title: string;
  event_date: string;
  event_link: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
}

const emptyEvent: Omit<PartnerEvent, "status"> = {
  title: "",
  event_date: "",
  event_link: "",
};

const PartnerEvents = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<PartnerEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Ogiltig länk");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=get-partner-events&token=${token}`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Kunde inte hämta data");
          setLoading(false);
          return;
        }

        setPartner(result.partner);
        setEvents(result.events || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Ett fel uppstod");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSaveEvent = async (event: PartnerEvent) => {
    if (!event.title || !event.event_date) {
      toast.error("Titel och datum krävs");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=save-event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ token, event }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kunde inte spara event");
      }

      toast.success(event.id ? "Event uppdaterat" : "Event skapat - väntar på godkännande");
      
      // Refresh events
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=get-partner-events&token=${token}`,
        {
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );
      const refreshResult = await refreshResponse.json();
      setEvents(refreshResult.events || []);
      
      setShowForm(false);
      setEditingEvent(null);
    } catch (err: any) {
      toast.error(err.message || "Ett fel uppstod");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Är du säker på att du vill ta bort detta event?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=delete-event&token=${token}&eventId=${eventId}`,
        {
          method: "DELETE",
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kunde inte ta bort event");
      }

      toast.success("Event borttaget");
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err: any) {
      toast.error(err.message || "Ett fel uppstod");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Godkänt</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Avvisat</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Väntar på godkännande</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h1 className="text-xl font-semibold mb-2">Ett problem uppstod</h1>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hantera events | {partner?.name} | d365.se</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {partner?.logo_url ? (
              <img src={partner.logo_url} alt={partner.name} className="w-16 h-16 object-contain rounded-lg border" />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{partner?.name}</h1>
              <p className="text-muted-foreground">Event-portal</p>
            </div>
          </div>

          {/* Content guidance */}
          <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Vilka events kan publiceras?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Events ska handla om <strong>Microsoft Dynamics 365</strong> eller närliggande områden som{" "}
              <strong>AI, Copilot, Agents, Business Intelligence, Power Platform</strong> och liknande.
              Eventet granskas av admin innan det publiceras på d365.se.
            </p>
          </div>

          {/* Add Event Button */}
          {!showForm && (
            <Button onClick={() => { setEditingEvent(null); setShowForm(true); }} className="mb-6">
              <Plus className="w-4 h-4 mr-2" />
              Skapa nytt event
            </Button>
          )}

          {/* Event Form */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingEvent?.id ? "Redigera event" : "Nytt event"}</CardTitle>
                <CardDescription>
                  Fyll i informationen nedan. Eventet granskas av admin innan det publiceras.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventForm
                  event={editingEvent || { ...emptyEvent, status: "pending" }}
                  onSave={handleSaveEvent}
                  onCancel={() => { setShowForm(false); setEditingEvent(null); }}
                  saving={saving}
                />
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Era events</h2>
            
            {events.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inga events ännu</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Klicka på "Skapa nytt event" för att lägga till ert första event.
                  </p>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="relative overflow-hidden">
                  {event.status === "approved" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                  )}
                  {event.status === "pending" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                  )}
                  {event.status === "rejected" && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
                  )}
                  
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          {getStatusBadge(event.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.event_date).toLocaleDateString("sv-SE")}
                          </span>
                          {event.event_link && (
                            <a href={event.event_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="w-4 h-4" />
                              Eventlänk
                            </a>
                          )}
                        </div>

                        {event.status === "rejected" && event.admin_notes && (
                          <div className="mt-2 p-2 bg-destructive/10 rounded text-sm text-destructive">
                            <strong>Anledning:</strong> {event.admin_notes}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditingEvent(event); setShowForm(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => event.id && handleDeleteEvent(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Info box */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>Hur det fungerar:</strong> När du skapar eller uppdaterar ett event skickas det för granskning. 
                Efter godkännande visas eventet på den publika event-sidan och på er partnerprofil.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Event Form Component
interface EventFormProps {
  event: PartnerEvent;
  onSave: (event: PartnerEvent) => void;
  onCancel: () => void;
  saving: boolean;
}

const EventForm = ({ event, onSave, onCancel, saving }: EventFormProps) => {
  const [formData, setFormData] = useState<PartnerEvent>(event);

  const handleChange = (field: keyof PartnerEvent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label>Eventtitel *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="T.ex. 'Webinar: Nyheter i Business Central'"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Beskrivning</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Beskriv vad eventet handlar om..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Datum *</Label>
          <Input
            type="date"
            value={formData.event_date}
            onChange={(e) => handleChange("event_date", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Starttid</Label>
            <Input
              type="time"
              value={formData.event_time}
              onChange={(e) => handleChange("event_time", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sluttid</Label>
            <Input
              type="time"
              value={formData.end_time}
              onChange={(e) => handleChange("end_time", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={formData.is_online}
          onCheckedChange={(checked) => handleChange("is_online", checked)}
        />
        <Label>Online-event</Label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{formData.is_online ? "Möteslänk" : "Plats"}</Label>
          <Input
            value={formData.is_online ? formData.event_link : formData.location}
            onChange={(e) => handleChange(formData.is_online ? "event_link" : "location", e.target.value)}
            placeholder={formData.is_online ? "https://teams.microsoft.com/..." : "Adress"}
          />
        </div>

        <div className="space-y-2">
          <Label>Anmälningslänk</Label>
          <Input
            value={formData.registration_link}
            onChange={(e) => handleChange("registration_link", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sista anmälningsdag</Label>
          <Input
            type="date"
            value={formData.registration_deadline}
            onChange={(e) => handleChange("registration_deadline", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Eventbild (URL)</Label>
          <Input
            value={formData.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Recording section */}
      <div className="p-4 bg-muted/50 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Inspelning tillgänglig
          </Label>
          <Switch
            checked={formData.recording_available}
            onCheckedChange={(checked) => handleChange("recording_available", checked)}
          />
        </div>
        
        {formData.recording_available && (
          <div className="space-y-2">
            <Label>Länk till inspelning</Label>
            <Input
              value={formData.recording_url}
              onChange={(e) => handleChange("recording_url", e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={() => onSave(formData)} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {event.id ? "Spara ändringar" : "Skapa event"}
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Avbryt
        </Button>
      </div>
    </div>
  );
};

export default PartnerEvents;
