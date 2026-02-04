import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ExternalLink, 
  Play,
  Users,
  Building2,
  ArrowLeft,
  Loader2,
  Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Partner {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  logo_dark_bg: boolean;
  description?: string | null;
}

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
  partners: Partner | null; // Can be null for d365.se events
}

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<PartnerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=get-event&eventId=${eventId}`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        console.error("Error fetching event:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

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
    return timeStr.slice(0, 5);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description || undefined,
          url,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Länk kopierad",
        description: "Eventlänken har kopierats till urklipp.",
      });
    }
  };

  const isPastEvent = event ? new Date(event.event_date) < new Date() : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-16">
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Event hittades inte</h1>
              <p className="text-muted-foreground mb-6">
                Eventet du söker finns inte eller har tagits bort.
              </p>
              <Button asChild>
                <Link to="/events">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tillbaka till events
                </Link>
              </Button>
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
        <title>{event.title} | {event.partners?.name || "d365.se"} | d365.se</title>
        <meta
          name="description"
          content={event.description || `${event.title} - ett event från ${event.partners?.name || "d365.se"}`}
        />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden mt-16 py-12 md:py-16 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4">
          <Link 
            to="/events" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Alla events
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              {event.is_online ? (
                <><Video className="w-3 h-3 mr-1" /> Online</>
              ) : (
                <><MapPin className="w-3 h-3 mr-1" /> På plats</>
              )}
            </Badge>
            {isPastEvent && (
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                Avslutat
              </Badge>
            )}
            {event.recording_available && event.recording_url && (
              <Badge className="bg-red-500/80 text-white border-red-400/50">
                <Play className="w-3 h-3 mr-1" /> Inspelning tillgänglig
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <span className="flex items-center gap-2 font-medium">
              <Calendar className="w-5 h-5" />
              {formatDate(event.event_date)}
            </span>
            {event.event_time && (
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {formatTime(event.event_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {event.image_url && (
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full rounded-xl shadow-lg object-cover max-h-96"
                />
              )}

              {event.description && (
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-xl font-semibold mb-4">Om eventet</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                </div>
              )}

              {!event.is_online && event.location && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Plats</h2>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-violet-600 mt-0.5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Partner/d365.se Info */}
                  <div className="flex items-center gap-4">
                    {event.partners ? (
                      <Link to={`/partner/${event.partners.slug}`}>
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center border ${
                          event.partners.logo_dark_bg ? 'bg-slate-700' : 'bg-white'
                        }`}>
                          {event.partners.logo_url ? (
                            <img 
                              src={event.partners.logo_url} 
                              alt={event.partners.name}
                              className="max-w-12 max-h-12 object-contain"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center border bg-primary/10">
                        <span className="text-lg font-bold text-primary">d365</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Arrangör</p>
                      {event.partners ? (
                        <Link 
                          to={`/partner/${event.partners.slug}`}
                          className="font-semibold hover:text-violet-600 transition-colors"
                        >
                          {event.partners.name}
                        </Link>
                      ) : (
                        <span className="font-semibold">d365.se</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {event.recording_available && event.recording_url ? (
                      <Button asChild className="w-full gap-2 bg-red-600 hover:bg-red-700">
                        <a href={event.recording_url} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4" />
                          Se inspelning
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    ) : !isPastEvent && event.registration_link ? (
                      <Button asChild className="w-full gap-2 bg-violet-600 hover:bg-violet-700">
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                          <Users className="w-4 h-4" />
                          Anmäl dig
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    ) : null}

                    {!isPastEvent && event.is_online && event.event_link && (
                      <Button asChild variant="outline" className="w-full gap-2">
                        <a href={event.event_link} target="_blank" rel="noopener noreferrer">
                          <Video className="w-4 h-4" />
                          Möteslänk
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    )}

                    <Button variant="outline" className="w-full gap-2" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                      Dela event
                    </Button>
                  </div>

                  {/* Deadline Info */}
                  {!isPastEvent && event.registration_deadline && (
                    <p className="text-sm text-muted-foreground text-center">
                      Sista anmälningsdag: {formatDate(event.registration_deadline)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
