import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ExternalLink, 
  Play,
  Users,
  CalendarDays,
  ArrowRight
} from "lucide-react";

interface PartnerEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  end_time: string | null;
  is_online: boolean;
  location: string | null;
  event_link: string | null;
  registration_link: string | null;
  registration_deadline: string | null;
  image_url: string | null;
  recording_url: string | null;
  recording_available: boolean;
}

interface PartnerEventsSectionProps {
  partnerId: string;
  partnerName: string;
}

const PartnerEventsSection = ({ partnerId, partnerName }: PartnerEventsSectionProps) => {
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Query partner_events table for this partner's approved events
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=public-events`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          console.error("Failed to fetch events");
          return;
        }
        
        const result = await response.json();
        // Filter events for this specific partner
        const partnerEvents = (result.events || []).filter(
          (e: PartnerEvent & { partner_id: string }) => e.partner_id === partnerId
        );
        setEvents(partnerEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [partnerId]);

  if (loading) {
    return null;
  }

  if (events.length === 0) {
    return null;
  }

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= now);
  const pastEvents = events.filter(e => new Date(e.event_date) < now);
  const pastEventsWithRecordings = pastEvents.filter(e => e.recording_available && e.recording_url);

  if (upcomingEvents.length === 0 && pastEventsWithRecordings.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sv-SE", { 
      weekday: "long",
      day: "numeric", 
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null;
    return timeStr.slice(0, 5); // HH:MM
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-500/90 to-purple-500 shadow-lg shadow-violet-500/25">
          <CalendarDays className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Events & Webinars
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Kommande och tidigare events från {partnerName}
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Kommande events
          </h3>
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <Link 
                key={event.id}
                to={`/events/${event.id}`}
                className="block group"
              >
                <article 
                  className="relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  
                  <div className="relative p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Event image if available */}
                      {event.image_url && (
                        <div className="sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <img 
                            src={event.image_url} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h4>
                          <Badge className="bg-primary text-primary-foreground">
                            {event.is_online ? (
                              <><Video className="w-3 h-3 mr-1" /> Online</>
                            ) : (
                              <><MapPin className="w-3 h-3 mr-1" /> På plats</>
                            )}
                          </Badge>
                        </div>

                        {event.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <span className="flex items-center gap-1.5 text-foreground font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            {formatDate(event.event_date)}
                          </span>
                          {event.event_time && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {formatTime(event.event_time)}
                              {event.end_time && ` - ${formatTime(event.end_time)}`}
                            </span>
                          )}
                          {!event.is_online && event.location && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <Button size="sm" className="gap-2">
                            Läs mer & anmäl dig
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                          {event.registration_deadline && (
                            <p className="text-xs text-muted-foreground">
                              Sista anmälningsdag: {formatDate(event.registration_deadline)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Events with Recordings */}
      {pastEventsWithRecordings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Video className="w-5 h-5 text-muted-foreground" />
            Inspelningar
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {pastEventsWithRecordings.map((event) => (
              <a
                key={event.id}
                href={event.recording_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.event_date)}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerEventsSection;
