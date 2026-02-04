import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ExternalLink,
  CalendarDays,
} from "lucide-react";

interface PartnerEvent {
  id: string;
  title: string;
  event_date: string;
  event_link: string | null;
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
        // Filter events for this specific partner and only upcoming events
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const partnerEvents = (result.events || []).filter(
          (e: PartnerEvent & { partner_id: string }) => 
            e.partner_id === partnerId && new Date(e.event_date) >= now
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

  if (loading || events.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sv-SE", { 
      day: "numeric", 
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Kommande events
        </h2>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <a
            key={event.id}
            href={event.event_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <article className="relative rounded-xl overflow-hidden bg-card border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.event_date)}
                  </p>
                </div>
                
                <Button size="sm" variant="outline" className="gap-2 shrink-0">
                  Läs mer
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </article>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PartnerEventsSection;
