import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Video, MapPin, ExternalLink, Building2, ArrowRight } from "lucide-react";

interface EventPartner {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  logo_dark_bg: boolean;
}

interface PartnerEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  is_online: boolean;
  location: string | null;
  event_link: string | null;
  registration_link: string | null;
  recording_url: string | null;
  recording_available: boolean;
  partners: EventPartner | null;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

function EventCard({ event, past }: { event: PartnerEvent; past?: boolean }) {
  const href = past
    ? event.recording_url || event.event_link || event.registration_link
    : event.registration_link || event.event_link;

  const content = (
    <article className="h-full rounded border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 w-14 h-14 rounded flex items-center justify-center border ${
            event.partners?.logo_dark_bg ? "bg-slate-700" : "bg-white"
          }`}
        >
          {event.partners?.logo_url ? (
            <img
              src={event.partners.logo_url}
              alt={event.partners.name}
              loading="lazy"
              className="max-w-11 max-h-11 object-contain"
            />
          ) : event.partners ? (
            <Building2 className="w-6 h-6 text-muted-foreground" />
          ) : (
            <span className="text-sm font-bold text-primary">d365</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Badge variant="secondary" className="text-[11px]">
              {event.is_online ? (
                <><Video className="w-3 h-3 mr-1" /> Online</>
              ) : (
                <><MapPin className="w-3 h-3 mr-1" /> På plats</>
              )}
            </Badge>
            {past && event.recording_available && (
              <Badge variant="outline" className="text-[11px]">Inspelning</Badge>
            )}
          </div>
          <h3 className="font-semibold text-foreground leading-snug line-clamp-2">{event.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.event_date)}
            <span className="mx-1">·</span>
            {event.partners?.name || "d365.se"}
          </p>
          {href && (
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
              {past ? "Se inspelning" : "Läs mer & anmäl dig"} <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (!href) return <div>{content}</div>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  );
}

export default function PartnernyttEventsSection() {
  const [upcoming, setUpcoming] = useState<PartnerEvent[]>([]);
  const [past, setPast] = useState<PartnerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=all-public-events`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        if (!res.ok) return;
        const data = await res.json();
        const all: PartnerEvent[] = data.events || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const up = all.filter((e) => new Date(e.event_date) >= today);
        const old = all.filter((e) => new Date(e.event_date) < today);
        up.sort((a, b) => +new Date(a.event_date) - +new Date(b.event_date));
        old.sort((a, b) => +new Date(b.event_date) - +new Date(a.event_date));
        setUpcoming(up);
        setPast(old);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading || (upcoming.length === 0 && past.length === 0)) return null;

  return (
    <>
      {upcoming.length > 0 && (
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Kommande live-events</h2>
                <p className="mt-2 text-muted-foreground">
                  Webinars och seminarier från Dynamics 365-partners – anmälan sker hos arrangören.
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0 hidden sm:inline-flex">
                <Link to="/events/" className="inline-flex items-center gap-1">
                  Alla events <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="py-12 border-t border-border bg-card/40">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Live-events som genomförts</h2>
            <p className="mt-2 mb-6 text-muted-foreground">
              Tidigare webinars och seminarier. Där inspelning finns kan du ta del av den hos arrangören.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <EventCard key={e.id} event={e} past />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
