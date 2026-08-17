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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UnderConstruction from '../components/UnderConstruction';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';
import ChamferedButton from '@/components/ui/ChamferedButton';

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
    <div className="fadeIn min-h-screen bg-[var(--bg-body)]">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] mb-3">
              Schedule & Logistics
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-[var(--text-primary)]">
              <span className="font-serif italic font-normal text-[1.08em] text-[var(--text-secondary)]">Workshops &</span>{" "}
              <span className="font-display font-bold">Events</span>
            </h1>
            <p className="text-base text-[var(--text-secondary)] max-w-xl leading-relaxed">
              Hands-on robotics sessions, ROS 2 bootcamps, and technical symposiums hosted by Aprameya at KL University.
            </p>

            {/* Upcoming Highlight */}
            {upcomingEvents.length > 0 && (
              <div className="mt-8 max-w-2xl border border-white/[0.06] bg-[var(--card-bg)] p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-white/[0.03] flex items-center justify-center rounded-lg border border-white/[0.06] shrink-0 text-[var(--text-primary)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider mb-0.5">Upcoming Session</div>
                  <div className="text-[var(--text-primary)] font-display font-bold text-base">{upcomingEvents[0].title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{upcomingEvents[0].date} • {upcomingEvents[0].location}</div>
                </div>
                {/* Highlight Action */}
                {user && registeredEventIds.has(upcomingEvents[0].id) ? (
                  <Button className="w-full sm:w-auto ml-0 sm:ml-auto bg-green-600/20 text-green-400 border border-green-500/30 cursor-default hover:bg-green-600/20" size="sm">
                    Registered
                  </Button>
                ) : (
                  upcomingEvents[0].ticketEnabled ? (
                    <ChamferedButton
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto ml-0 sm:ml-auto"
                      onClick={() => setLocation(`/events/${upcomingEvents[0].id}/register`)}
                    >
                      <Ticket className="w-3.5 h-3.5 mr-1.5" />
                      Get Pass
                    </ChamferedButton>
                  ) : (
                    <ChamferedButton
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto ml-0 sm:ml-auto"
                      onClick={() => handleQuickRegister(upcomingEvents[0])}
                    >
                      Register Now
                    </ChamferedButton>
                  )
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 md:px-12 bg-[var(--bg-body)]">
        <div className="max-w-7xl mx-auto">
          {events.length > 0 ? (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
                {/* Filter Tabs */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-1.5 no-scrollbar w-full md:w-auto">
                  {eventTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer",
                        filterType === type
                          ? "bg-[var(--text-primary)] text-[var(--bg-body)]"
                          : "bg-[var(--card-bg)] border border-white/[0.06] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[var(--card-bg)] border border-white/[0.06] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-white/[0.2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <div className="h-full flex flex-col border border-white/[0.06] bg-[var(--card-bg)] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors duration-300">
                        <div className="relative h-44 overflow-hidden border-b border-white/[0.04]">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 z-20">
                            <Badge className="bg-black/70 backdrop-blur-sm text-[var(--text-primary)] border-white/[0.06] text-[10px] uppercase font-sans">
                              {event.type}
                            </Badge>
                          </div>
                          {event.ticketEnabled && (
                            <div className="absolute top-3 left-3 z-20">
                              <Badge className="bg-red-600 text-white border-none flex items-center gap-1 text-[10px] uppercase font-sans font-semibold">
                                <Ticket className="w-3 h-3" /> Pass Required
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-base font-bold font-display text-[var(--text-primary)] mb-1">
                                {event.title}
                              </h3>
                            </div>
                            <div className="text-center bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1 min-w-[48px] shrink-0">
                              <div className="text-[9px] text-[var(--text-muted)] uppercase font-medium">{event.month}</div>
                              <div className="text-base font-bold text-[var(--text-primary)] font-display">{event.day}</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 mb-4 text-xs text-[var(--text-muted)]">
                            <div className="flex items-center">
                              <ResultClockIcon className="w-3.5 h-3.5 mr-1.5" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <ResultMapIcon className="w-3.5 h-3.5 mr-1.5" />
                              {event.location}
                            </div>
                          </div>

                          <p className="text-xs text-[var(--text-secondary)] mb-5 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
                            {user && registeredEventIds.has(event.id) ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 w-full justify-center py-2 text-xs">
                                Registered
                              </Badge>
                            ) : (
                              event.capacity && (event.registeredCount || 0) >= event.capacity ? (
                                <Button disabled className="w-full bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed text-xs">
                                  Capacity Reached
                                </Button>
                              ) : event.ticketEnabled ? (
                                <ChamferedButton
                                  variant="primary"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={() => setLocation(`/events/${event.id}/register`)}
                                >
                                  <Ticket className="w-3.5 h-3.5 mr-1.5" />
                                  Get Entry Pass
                                </ChamferedButton>
                              ) : (
                                <ChamferedButton
                                  variant="secondary"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={() => handleQuickRegister(event)}
                                >
                                  Register Now
                                </ChamferedButton>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 col-span-full border border-white/[0.06] rounded-xl bg-[var(--card-bg)]">
                    <p className="text-sm text-[var(--text-secondary)]">No events matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <UnderConstruction
              category="WORKSHOPS & SESSIONS"
              title="Schedule in Preparation"
              subtitle="Session Logistics & Lab Availability"
              description="Lab coordinators are organizing upcoming hands-on hardware workshops and guest lectures. Registration will open on this page once dates and venue bookings are finalized."
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
