import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Event, EventRegistration } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock as ResultClockIcon,
  MapPin as ResultMapIcon,
  Search,
  Ticket
} from 'lucide-react';
import { motion } from 'framer-motion';
import VoidAurora from '../components/backgrounds/VoidAurora';
import { CleanCard } from '../components/ui/v6-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UnderConstruction from '../components/UnderConstruction';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

const Events = () => {
  const { toast } = useToast();
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  const { user } = useAuth();
  const { data: userRegistrations = [] } = useQuery<EventRegistration[]>({
    queryKey: ['/api/event-registrations/my'],
    enabled: !!user,
  });
  const registeredEventIds = new Set(userRegistrations.map(r => r.event_id));

  const [, setLocation] = useLocation();

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort events to find upcoming ones
  const upcomingEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).filter(e => new Date(e.date) > new Date()).slice(0, 1);

  const handleQuickRegister = async (event: Event) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/event-registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          event_id: event.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Successfully Registered",
          description: `Registered for "${event.title}".`,
        });
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Unable to complete registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Network Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const eventTypes = ['all', ...Array.from(new Set(events.map(e => e.type)))];

  return (
    <div className="fadeIn">
      {/* Header Section */}
      <section className="relative py-24 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)] overflow-hidden">
        <VoidAurora />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono mb-6 uppercase tracking-wider">
              Workshops, Hackathons & Seminars
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-[0.9] text-[var(--text-primary)] tracking-tight">
              EVENTS &<br />WORKSHOPS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mb-12 font-mono leading-relaxed">
              Hands-on robotics sessions, ROS 2 bootcamps, and technical symposiums hosted by Aprameya at KL University.
            </p>

            {/* Upcoming Highlight */}
            {upcomingEvents.length > 0 && (
              <div className="hud-card machined-panel flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl max-w-2xl w-full sm:w-auto">
                <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 flex items-center justify-center rounded-lg border border-[hsl(var(--accent))]/20 shrink-0">
                  <Calendar className="w-6 h-6 text-[hsl(var(--accent))]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-[hsl(var(--accent))] font-bold uppercase tracking-wider mb-1 font-mono">Upcoming Session</div>
                  <div className="text-[var(--text-primary)] font-display font-bold">{upcomingEvents[0].title}</div>
                  <div className="text-xs text-[var(--text-secondary)] font-mono">{upcomingEvents[0].date} • {upcomingEvents[0].location}</div>
                </div>
                {/* Highlight Action */}
                {user && (registeredEventIds.has(upcomingEvents[0].id)) ? (
                  <Button className="w-full sm:w-auto ml-0 sm:ml-auto bg-green-600/20 text-green-400 border border-green-500/30 cursor-default hover:bg-green-600/20" size="sm">
                    Registered
                  </Button>
                ) : (
                  upcomingEvents[0].ticketEnabled ? (
                    <Button
                      asChild
                      className="w-full sm:w-auto ml-0 sm:ml-auto btn-primary text-xs"
                      size="sm"
                    >
                      <Link href={`/events/${upcomingEvents[0].id}/register`}>
                        <Ticket className="w-3.5 h-3.5 mr-1.5" />
                        Get Pass
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full sm:w-auto ml-0 sm:ml-auto btn-primary text-xs"
                      size="sm"
                      onClick={() => handleQuickRegister(upcomingEvents[0])}
                    >
                      Register Now
                    </Button>
                  )
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto">
          {events.length > 0 ? (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                {/* Filter Tabs */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar w-full md:w-auto">
                  {eventTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap border transition-all",
                        filterType === type
                          ? "bg-[hsl(var(--accent))] text-[var(--bg-body)] border-[hsl(var(--accent))]"
                          : "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]"
                      )}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CleanCard className="h-full flex flex-col group hover:border-[hsl(var(--accent))]/50 transition-colors duration-300 rounded-xl overflow-hidden">
                        <div className="relative h-48 overflow-hidden border-b border-[var(--border-color)] bg-black/40">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 right-4 z-20">
                            <Badge className="bg-[var(--bg-body)]/80 backdrop-blur-sm text-[var(--text-primary)] border-[var(--border-color)] text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          {event.ticketEnabled && (
                            <div className="absolute top-4 left-4 z-20">
                              <Badge className="bg-[hsl(var(--accent))] text-[var(--bg-body)] border-none flex items-center gap-1 text-xs">
                                <Ticket className="w-3 h-3" /> Pass Required
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">
                                {event.title}
                              </h3>
                            </div>
                            <div className="text-center bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-2 min-w-[54px]">
                              <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono">{event.month}</div>
                              <div className="text-lg font-bold text-[var(--text-primary)] font-mono">{event.day}</div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4 font-mono text-xs">
                            <div className="flex items-center text-[var(--text-secondary)]">
                              <ResultClockIcon className="w-3.5 h-3.5 mr-2 text-[hsl(var(--accent))]" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-[var(--text-secondary)]">
                              <ResultMapIcon className="w-3.5 h-3.5 mr-2 text-[hsl(var(--accent))]" />
                              {event.location}
                            </div>
                          </div>

                          <p className="text-xs text-[var(--text-secondary)] mb-6 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                            {user && registeredEventIds.has(event.id) ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 w-full justify-center py-2 text-xs">
                                Registered
                              </Badge>
                            ) : (
                              event.capacity && (event.registeredCount || 0) >= event.capacity ? (
                                <Button disabled className="w-full bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed">
                                  Capacity Reached
                                </Button>
                              ) : event.ticketEnabled ? (
                                <Button
                                  asChild
                                  className="w-full bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 text-xs"
                                >
                                  <Link href={`/events/${event.id}/register`}>
                                    <Ticket className="w-3.5 h-3.5 mr-1.5" />
                                    Get Entry Pass
                                  </Link>
                                </Button>
                              ) : (
                                <Button
                                  className="w-full bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[hsl(var(--accent))] text-xs"
                                  onClick={() => handleQuickRegister(event)}
                                >
                                  Register Now
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </CleanCard>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 col-span-full border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
                    <p className="text-sm font-mono text-[var(--text-secondary)]">No events matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <UnderConstruction
              category="WORKSHOPS & SESSIONS"
              title="Schedule In Preparation"
              subtitle="Session Logistics & Lab Availability In Planning"
              description="The lab coordinators are organizing upcoming hands-on hardware workshops and guest lectures. Registration will open on this page once dates and venue bookings are finalized."
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
