import { useState } from 'react';
import { useLocation } from 'wouter';
import { Event, EventRegistration } from '../lib/types';
import { events as fallbackEvents } from '../lib/data';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Ticket,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ChamferedButton from '@/components/ui/ChamferedButton';
import EmptyState from '../components/EmptyState';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

const Events = () => {
  const { toast } = useToast();
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/events`, { credentials: 'include', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return fallbackEvents;
        const data = await res.json();
        return Array.isArray(data) && data.length > 0 ? data : fallbackEvents;
      } catch {
        clearTimeout(timeoutId);
        return fallbackEvents;
      }
    },
    initialData: fallbackEvents,
    staleTime: 60000,
  });

  const { user } = useAuth();
  const { data: userRegistrations = [] } = useQuery<EventRegistration[]>({
    queryKey: ['/api/event-registrations/my'],
    enabled: !!user,
  });
  const registeredEventIds = new Set(userRegistrations.map((r) => r.event_id));
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const now = new Date();
  const upcomingList = events.filter((e) => {
    const d = new Date(e.date);
    return isNaN(d.getTime()) || d >= now;
  });
  const pastList = events.filter((e) => {
    const d = new Date(e.date);
    return !isNaN(d.getTime()) && d < now;
  });

  const currentList = activeTab === 'upcoming' ? upcomingList : pastList;
  const filteredEvents = currentList.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const nextSpotlight = upcomingList.length > 0 ? upcomingList[0] : null;

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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ event_id: event.id }),
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
    } catch {
      toast({
        title: "Network Error",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── PAGE HEADER (Section 5.3 & 5) ─── */}
      <section className="pt-24 pb-8 px-6 md:px-8 max-w-[1200px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
          02 — CALENDAR
        </p>
        <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-text mb-3">
          Workshops & events.
        </h1>
        <p className="text-base text-text-2 max-w-xl leading-relaxed mb-10">
          Hands-on robotics bootcamps, perception symposiums, and engineering workshops hosted by Aprameya.
        </p>

        {/* ─── NEXT EVENT SPOTLIGHT (Only on Upcoming) ─── */}
        {activeTab === 'upcoming' && nextSpotlight && (
          <div className="rounded-lg border border-border p-6 bg-surface mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Large mono day + month block */}
                <div className="w-16 h-16 rounded-md border border-border bg-surface-2 flex flex-col items-center justify-center shrink-0 font-mono">
                  <span className="text-[11px] text-text-3 uppercase tracking-wider font-semibold">
                    {nextSpotlight.month || 'UPCOMING'}
                  </span>
                  <span className="font-display font-medium text-2xl text-text leading-none mt-1">
                    {nextSpotlight.day || '—'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status="Upcoming" isLive={true} />
                    <span className="font-mono text-xs text-text-3 uppercase tracking-[0.06em]">
                      Spotlight
                    </span>
                  </div>
                  <h2 className="font-display font-medium text-xl sm:text-2xl text-text tracking-tight mb-2">
                    {nextSpotlight.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-2">
                    {nextSpotlight.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-text-3" />
                        {nextSpotlight.time}
                      </span>
                    )}
                    {nextSpotlight.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-text-3" />
                        {nextSpotlight.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {user && registeredEventIds.has(nextSpotlight.id) ? (
                  <span className="h-10 px-4 rounded-md border border-border text-xs font-mono text-text-3 flex items-center">
                    Registered
                  </span>
                ) : nextSpotlight.ticketEnabled ? (
                  <ChamferedButton
                    variant="primary"
                    size="md"
                    onClick={() => setLocation(`/events/${nextSpotlight.id}/register`)}
                    rightIcon={<Ticket className="w-4 h-4" />}
                  >
                    Register
                  </ChamferedButton>
                ) : (
                  <ChamferedButton
                    variant="primary"
                    size="md"
                    onClick={() => handleQuickRegister(nextSpotlight)}
                  >
                    Register
                  </ChamferedButton>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TABS & SEARCH BAR (Section 4.7 & 5.3) ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`relative pb-4 font-body text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'upcoming' ? 'text-text' : 'text-text-2 hover:text-text'
              }`}
            >
              Upcoming ({upcomingList.length})
              {activeTab === 'upcoming' && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-red" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`relative pb-4 font-body text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'past' ? 'text-text' : 'text-text-2 hover:text-text'
              }`}
            >
              Past ({pastList.length})
              {activeTab === 'past' && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-red" />
              )}
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
            <input
              type="text"
              placeholder="Search schedule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border-strong bg-transparent text-xs text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
            />
          </div>
        </div>
      </section>

      {/* ─── EVENT LIST ROWS (Section 5.3) ─── */}
      <section className="pb-24 px-6 md:px-8 max-w-[1200px] mx-auto">
        {filteredEvents.length > 0 ? (
          <div className="divide-y divide-border border-b border-border">
            {filteredEvents.map((event) => {
              const isRegistered = user && registeredEventIds.has(event.id);
              return (
                <div
                  key={event.id}
                  className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface/40 px-4 -mx-4 rounded-md transition-colors duration-fast"
                >
                  {/* Left: Date block + Title + Details */}
                  <div className="flex items-start gap-5 min-w-0">
                    <div className="w-14 h-14 rounded-md border border-border bg-surface-2 flex flex-col items-center justify-center shrink-0 font-mono">
                      <span className="text-[10px] text-text-3 uppercase tracking-wider font-semibold">
                        {event.month || 'DATE'}
                      </span>
                      <span className="font-display font-medium text-lg text-text leading-none mt-0.5">
                        {event.day || '—'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={event.status || (activeTab === 'upcoming' ? 'Open' : 'Past')} />
                        <span className="font-mono text-xs uppercase tracking-[0.06em] text-text-3">
                          {event.type}
                        </span>
                      </div>
                      <h3 className="font-display font-medium text-base sm:text-lg text-text tracking-tight mb-1 truncate">
                        {event.title}
                      </h3>
                      <p className="text-xs text-text-2 line-clamp-1 max-w-xl mb-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-mono text-text-3">
                        {event.time && <span>{event.time}</span>}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="shrink-0 flex items-center gap-3 md:self-center">
                    {activeTab === 'past' ? (
                      <span className="font-mono text-xs text-text-3">Completed</span>
                    ) : isRegistered ? (
                      <span className="h-9 px-3 rounded-md border border-border text-xs font-mono text-text-3 flex items-center">
                        Registered
                      </span>
                    ) : event.ticketEnabled ? (
                      <ChamferedButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setLocation(`/events/${event.id}/register`)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Register
                      </ChamferedButton>
                    ) : (
                      <ChamferedButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickRegister(event)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Register
                      </ChamferedButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={activeTab === 'upcoming' ? 'No upcoming events' : 'No past events found'}
            description={
              activeTab === 'upcoming'
                ? 'Check back soon for new bootcamps and workshops.'
                : 'No archived events match your search keywords.'
            }
          />
        )}
      </section>
    </main>
  );
};

export default Events;
