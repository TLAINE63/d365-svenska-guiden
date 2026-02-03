import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Calendar, Video, MapPin, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";

export interface PartnerEvent {
  id?: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  end_time: string;
  is_online: boolean;
  location: string;
  event_link: string;
  registration_link: string;
  registration_deadline: string;
  image_url: string;
  recording_url: string;
  recording_available: boolean;
  is_published: boolean;
  _deleted?: boolean;
}

interface PartnerEventEditorProps {
  events: PartnerEvent[];
  onChange: (events: PartnerEvent[]) => void;
  token: string;
  partnerId?: string | null;
}

const emptyEvent: PartnerEvent = {
  title: "",
  description: "",
  event_date: "",
  event_time: "",
  end_time: "",
  is_online: true,
  location: "",
  event_link: "",
  registration_link: "",
  registration_deadline: "",
  image_url: "",
  recording_url: "",
  recording_available: false,
  is_published: true,
};

const PartnerEventEditor = ({ events, onChange, token, partnerId }: PartnerEventEditorProps) => {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch existing events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      if (!partnerId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/partner-invitations?action=get-events&token=${token}`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.events && data.events.length > 0) {
            onChange(data.events.map((e: any) => ({
              id: e.id,
              title: e.title || "",
              description: e.description || "",
              event_date: e.event_date || "",
              event_time: e.event_time || "",
              end_time: e.end_time || "",
              is_online: e.is_online ?? true,
              location: e.location || "",
              event_link: e.event_link || "",
              registration_link: e.registration_link || "",
              registration_deadline: e.registration_deadline || "",
              image_url: e.image_url || "",
              recording_url: e.recording_url || "",
              recording_available: e.recording_available ?? false,
              is_published: e.is_published ?? true,
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setFetchError("Kunde inte hämta befintliga events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [partnerId, token]);

  const addEvent = () => {
    onChange([...events, { ...emptyEvent }]);
  };

  const updateEvent = (index: number, updates: Partial<PartnerEvent>) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], ...updates };
    onChange(newEvents);
  };

  const removeEvent = (index: number) => {
    const event = events[index];
    if (event.id) {
      // Mark existing event for deletion
      const newEvents = [...events];
      newEvents[index] = { ...newEvents[index], _deleted: true };
      onChange(newEvents);
    } else {
      // Remove new event immediately
      onChange(events.filter((_, i) => i !== index));
    }
  };

  const restoreEvent = (index: number) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], _deleted: false };
    onChange(newEvents);
  };

  // Filter out events that are marked as deleted for display count
  const visibleEvents = events.filter(e => !e._deleted);
  const deletedEvents = events.filter(e => e._deleted);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Events & Webinars
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Laddar events...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Events & Webinars
        </CardTitle>
        <CardDescription>
          Lägg till kommande eller tidigare events. Inspelningar kan länkas från YouTube/Vimeo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fetchError && (
          <p className="text-sm text-destructive">{fetchError}</p>
        )}

        {events.map((event, index) => {
          if (event._deleted) return null;
          
          const isPastEvent = event.event_date && new Date(event.event_date) < new Date();
          
          return (
            <Card key={event.id || index} className="border-2 relative">
              {/* Past event indicator */}
              {isPastEvent && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 left-4 text-xs"
                >
                  Avslutat event
                </Badge>
              )}
              
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Eventtitel *</Label>
                    <Input
                      placeholder="T.ex. 'Webinar: Nyheter i Business Central'"
                      value={event.title}
                      onChange={(e) => updateEvent(index, { title: e.target.value })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEvent(index)}
                    className="text-destructive hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Beskrivning</Label>
                  <Textarea
                    placeholder="Beskriv vad eventet handlar om..."
                    value={event.description}
                    onChange={(e) => updateEvent(index, { description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Datum *</Label>
                    <Input
                      type="date"
                      value={event.event_date}
                      onChange={(e) => updateEvent(index, { event_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Starttid</Label>
                    <Input
                      type="time"
                      value={event.event_time}
                      onChange={(e) => updateEvent(index, { event_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sluttid</Label>
                    <Input
                      type="time"
                      value={event.end_time}
                      onChange={(e) => updateEvent(index, { end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <Switch
                    checked={event.is_online}
                    onCheckedChange={(checked) => updateEvent(index, { is_online: checked })}
                  />
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Video className="w-4 h-4" />
                    Online-event
                  </Label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {event.is_online ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      {event.is_online ? "Plattform/Möteslänk" : "Plats"}
                    </Label>
                    <Input
                      placeholder={event.is_online ? "https://teams.microsoft.com/..." : "Adress eller lokal"}
                      value={event.is_online ? event.event_link : event.location}
                      onChange={(e) => updateEvent(index, event.is_online ? { event_link: e.target.value } : { location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Anmälningslänk
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://forms.office.com/..."
                      value={event.registration_link}
                      onChange={(e) => updateEvent(index, { registration_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sista anmälningsdag</Label>
                    <Input
                      type="date"
                      value={event.registration_deadline}
                      onChange={(e) => updateEvent(index, { registration_deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Eventbild (URL)</Label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={event.image_url}
                      onChange={(e) => updateEvent(index, { image_url: e.target.value })}
                    />
                  </div>
                </div>

                {/* Recording section - more prominent for past events */}
                <div className={`space-y-3 p-4 rounded-lg ${isPastEvent ? 'bg-accent/50 border-2 border-accent' : 'bg-muted/50'}`}>
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Video className="w-4 h-4" />
                      Inspelning tillgänglig
                    </Label>
                    <Switch
                      checked={event.recording_available}
                      onCheckedChange={(checked) => updateEvent(index, { recording_available: checked })}
                    />
                  </div>
                  
                  {event.recording_available && (
                    <div className="space-y-2">
                      <Label>Länk till inspelning (YouTube, Vimeo, etc.)</Label>
                      <Input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={event.recording_url}
                        onChange={(e) => updateEvent(index, { recording_url: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={event.is_published}
                    onCheckedChange={(checked) => updateEvent(index, { is_published: checked })}
                  />
                  <Label className="cursor-pointer">Publicerat (visas på profilsidan)</Label>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Show deleted events that can be restored */}
        {deletedEvents.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Borttagna events (återställ eller spara för att ta bort permanent):</p>
            {events.map((event, index) => {
              if (!event._deleted) return null;
              return (
                <div key={event.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <span className="text-sm line-through text-muted-foreground">{event.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => restoreEvent(index)}
                  >
                    Återställ
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={addEvent}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Lägg till event
        </Button>

        {visibleEvents.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Inga events tillagda ännu. Klicka på knappen ovan för att lägga till ert första event.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnerEventEditor;
