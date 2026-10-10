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
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-red-500/15">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-red-400 mb-3">
              Schedule & Logistics
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-white font-display font-bold">
              <span className="text-[#94A3B8] font-normal">Workshops &</span>{" "}
              <span>Events</span>
            </h1>
            <p className="text-base text-[#94A3B8] max-w-xl leading-relaxed">
              Hands-on robotics sessions, ROS 2 bootcamps, and technical symposiums hosted by Aprameya at KL University.
            </p>

            {/* Upcoming Highlight */}
            {upcomingEvents.length > 0 && (
              <div className="mt-8 max-w-2xl morphic-metallic-card p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-red-950/60 flex items-center justify-center rounded-lg border border-red-400/30 shrink-0 text-red-300 shadow-[inset_0_1px_1px_rgba(254,202,202,0.2)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-0.5">Upcoming Session</div>
                  <div className="text-white font-display font-bold text-base">{upcomingEvents[0].title}</div>
                  <div className="text-xs text-[#94A3B8]">{upcomingEvents[0].date} • {upcomingEvents[0].location}</div>
                </div>
                {/* Highlight Action */}
                {user && registeredEventIds.has(upcomingEvents[0].id) ? (
                  <Button className="w-full sm:w-auto ml-0 sm:ml-auto bg-red-950/60 text-red-300 border border-red-500/30 cursor-default" size="sm">
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
      <section className="py-12 px-6 md:px-12 bg-black">
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
                        "px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                        filterType === type
                          ? "btn-metallic-red text-white shadow-[0_2px_10px_rgba(220,38,38,0.4)]"
                          : "btn-metallic-ghost text-[#94A3B8] hover:text-white"
                      )}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400/60 w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#1A050A]/70 border border-red-500/20 rounded-lg text-sm text-white focus:outline-none focus:border-red-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => {
                    const parsedDate = event.date ? new Date(event.date) : null;
                    const isValidDate = parsedDate && !isNaN(parsedDate.getTime());
                    const displayMonth = event.month || (isValidDate ? parsedDate.toLocaleString('en-US', { month: 'short' }) : 'EVENT');
                    const displayDay = event.day || (isValidDate ? String(parsedDate.getDate()) : '•');

                    return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <div className="h-full flex flex-col morphic-metallic-card rounded-xl overflow-hidden transition-colors duration-300">
                        <div className="relative h-44 overflow-hidden border-b border-red-500/15 bg-black">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 z-20">
                            <span className="bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded border border-red-500/25 text-[10px] uppercase font-sans font-bold">
                              {event.type}
                            </span>
                          </div>
                          {event.ticketEnabled && (
                            <div className="absolute top-3 left-3 z-20">
                              <span className="bg-red-600/90 text-white px-2 py-0.5 rounded flex items-center gap-1 text-[10px] uppercase font-sans font-semibold shadow">
                                <Ticket className="w-3 h-3" /> Pass Required
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-base font-bold font-display text-white mb-1">
                                {event.title}
                              </h3>
                            </div>
                            <div className="text-center bg-red-950/50 border border-red-400/30 rounded-lg px-2.5 py-1 min-w-[48px] shrink-0">
                              <div className="text-[9px] text-red-400 uppercase font-bold">{displayMonth}</div>
                              <div className="text-base font-bold text-white font-display">{displayDay}</div>
                            </div>
                          </div>

                          <div className="space-y-1.5 mb-4 text-xs text-[#94A3B8]">
                            <div className="flex items-center">
                              <ResultClockIcon className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <ResultMapIcon className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                              {event.location}
                            </div>
                          </div>

                          <p className="text-xs text-[#94A3B8] mb-5 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-red-500/15 flex items-center justify-between">
                            {user && registeredEventIds.has(event.id) ? (
                              <Badge variant="outline" className="bg-red-950/60 text-red-300 border-red-500/30 w-full justify-center py-2 text-xs">
                                Registered
                              </Badge>
                            ) : (
                              event.capacity && (event.registeredCount || 0) >= event.capacity ? (
                                <Button disabled className="w-full bg-red-950/40 text-red-400 border border-red-500/20 cursor-not-allowed text-xs">
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
                    );
                  })
                ) : (
                  <div className="text-center py-16 col-span-full border border-red-500/15 rounded-xl morphic-metallic-card">
                    <p className="text-sm text-[#94A3B8]">No events matching "{searchTerm}"</p>
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
