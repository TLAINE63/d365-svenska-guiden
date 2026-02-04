import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import eventsHeroImage from "@/assets/events-hero.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ExternalLink, 
  Play,
  Users,
  Building2,
  CalendarDays,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Partner {
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

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<PartnerEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<PartnerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-events?action=all-public-events`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const allEvents = data.events || [];
          
          // Split events into upcoming and past based on date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const upcoming: PartnerEvent[] = [];
          const past: PartnerEvent[] = [];
          
          allEvents.forEach((event: PartnerEvent) => {
            const eventDate = new Date(event.event_date);
            if (eventDate >= today) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          });
          
          // Sort upcoming by date ascending (nearest first)
          upcoming.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
          
          // Sort past by date descending (most recent first)
          past.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
          
          setUpcomingEvents(upcoming);
          setPastEvents(past);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Events & Webinars | Dynamics 365 Partner-events | d365.se</title>
        <meta
          name="description"
          content="Upptäck kommande webinars, seminarier och events från Microsoft Dynamics 365-partners i Sverige. Anmäl dig till kostnadsfria events och se inspelningar."
        />
      </Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden mt-16 py-16 md:py-24">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${eventsHeroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/80 to-violet-900/70" />
        
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            <CalendarDays className="w-3 h-3 mr-1" />
            Partner-events
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Events & Webinars
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Upptäck kommande events från Microsoft Dynamics 365-partners. 
            Delta i webinars, seminarier och workshops.
          </p>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="upcoming" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="w-4 h-4" />
                Kommande events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                <Play className="w-4 h-4" />
                Genomförda events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Inga kommande events</h3>
                    <p className="text-muted-foreground">
                      Just nu finns inga planerade events. Kom tillbaka snart!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                upcomingEvents.map((event) => (
                  <Link key={event.id} to={`/events/${event.id}`} className="block">
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Partner/d365.se Logo */}
                          <div className="shrink-0">
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center border ${
                              event.partners?.logo_dark_bg ? 'bg-slate-700' : 'bg-white'
                            }`}>
                              {event.partners?.logo_url ? (
                                <img 
                                  src={event.partners.logo_url} 
                                  alt={event.partners.name}
                                  className="max-w-16 max-h-16 object-contain"
                                />
                              ) : event.partners ? (
                                <Building2 className="w-8 h-8 text-muted-foreground" />
                              ) : (
                                <span className="text-xl font-bold text-primary">d365</span>
                              )}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Arrangör: {event.partners?.name || "d365.se"}
                                </p>
                              </div>
                              <Badge className="bg-violet-100 text-violet-800 border-violet-200">
                                {event.is_online ? (
                                  <><Video className="w-3 h-3 mr-1" /> Online</>
                                ) : (
                                  <><MapPin className="w-3 h-3 mr-1" /> På plats</>
                                )}
                              </Badge>
                            </div>

                            {event.description && (
                              <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                            )}

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              <span className="flex items-center gap-1.5 font-medium">
                                <Calendar className="w-4 h-4 text-violet-600" />
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
                              <Button className="gap-2 bg-violet-600 hover:bg-violet-700" size="sm">
                                Läs mer & anmäl dig
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                              {event.registration_deadline && (
                                <p className="text-xs text-muted-foreground">
                                  Sista anmälningsdag: {formatDate(event.registration_deadline)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Event Image */}
                          {event.image_url && (
                            <div className="shrink-0 hidden lg:block">
                              <img 
                                src={event.image_url} 
                                alt={event.title}
                                className="w-48 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastEvents.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Inga genomförda events ännu</h3>
                    <p className="text-muted-foreground">
                      Genomförda events kommer att visas här.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`} className="block">
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Partner/d365.se Logo */}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border shrink-0 ${
                              event.partners?.logo_dark_bg ? 'bg-slate-700' : 'bg-white'
                            }`}>
                              {event.partners?.logo_url ? (
                                <img 
                                  src={event.partners.logo_url} 
                                  alt={event.partners.name}
                                  className="max-w-10 max-h-10 object-contain"
                                />
                              ) : event.partners ? (
                                <Building2 className="w-6 h-6 text-muted-foreground" />
                              ) : (
                                <span className="text-sm font-bold text-primary">d365</span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {event.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.partners?.name || "d365.se"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(event.event_date)}
                              </p>
                            </div>
                            
                            <Badge variant="secondary" className="shrink-0">
                              Genomfört
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
