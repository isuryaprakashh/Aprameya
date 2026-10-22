import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Event, EventRegistration } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
  Ticket,
  Download,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventRow from '@/components/EventRow';
import EventCard from '@/components/EventCard';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

export const Events: React.FC = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: events = [], isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/events`, { credentials: 'include', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch {
        clearTimeout(timeoutId);
        return [];
      }
    },
    staleTime: 5000,
  });

  const { data: userRegistrations = [] } = useQuery<EventRegistration[]>({
    queryKey: ['/api/event-registrations/my'],
    enabled: !!user,
  });
  const registeredEventIds = new Set(userRegistrations.map((r) => r.event_id));

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
      (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const nextSpotlight = upcomingList.length > 0 ? upcomingList[0] : null;

  const downloadICS = (event: Event) => {
    const title = event.title || 'Aprameya Event';
    const description = event.description || '';
    const location = event.location || 'KL University';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aprameya Autonomous Systems Club//Events//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${new Date(event.date || Date.now()).toISOString().replace(/-|:|\.\d\d\d/g, '')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleQuickRegister = async (event: Event) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in with your college account to register.",
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
          title: "Registered",
          description: `You are registered for "${event.title}".`,
        });
        setTimeout(() => window.location.reload(), 600);
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Unable to complete registration.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the server. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full bg-ink text-paper min-h-screen">
      {/* ─── PAGE HERO (§7.8.2) ─── */}
      <section className="pt-12 sm:pt-16 pb-8 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <h1 className="font-sans font-medium text-[clamp(34px,4.8vw,60px)] tracking-[-0.03em] leading-tight text-paper mb-3">
          Events
        </h1>
        <p className="font-sans text-[clamp(17px,1.4vw,20px)] text-text-2 max-w-2xl leading-relaxed mb-10">
          Workshops, autonomy symposiums, and engineering sprint hackathons hosted by the Aprameya laboratory.
        </p>

        {/* ─── EVENT SPOTLIGHT (§7.3.6) ─── */}
        {activeTab === 'upcoming' && nextSpotlight && (
          <div className="w-full rounded-[var(--r-4)] border border-hairline bg-surface-1 p-6 sm:p-8 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-start gap-6">
                {/* Date block: data-lg 56px */}
                <div className="w-20 sm:w-24 text-left shrink-0">
                  <div className="font-sans text-[12px] uppercase text-mute font-medium">
                    {nextSpotlight.month || 'Upcoming'}
                  </div>
                  <div className="font-mono text-[clamp(36px,5vw,56px)] font-light text-paper leading-none tabular-nums mt-1">
                    {nextSpotlight.day || '—'}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status="Live" isLive={true} />
                    <span className="font-mono text-[12px] text-mute">
                      Next in queue
                    </span>
                  </div>

                  <h2 className="font-sans font-medium text-[24px] sm:text-[28px] text-paper tracking-[-0.02em] leading-snug mb-3">
                    {nextSpotlight.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[13px] font-mono text-mute">
                    {nextSpotlight.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {nextSpotlight.time}
                      </span>
                    )}
                    {nextSpotlight.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {nextSpotlight.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => downloadICS(nextSpotlight)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Add to calendar
                </Button>

                {user && registeredEventIds.has(nextSpotlight.id) ? (
                  <Button variant="secondary" size="lg" success successText="Registered" disabled>
                    Registered
                  </Button>
                ) : nextSpotlight.ticketEnabled ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setLocation(`/events/${nextSpotlight.id}/register`)}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleQuickRegister(nextSpotlight)}
                  >
                    Register
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TABS & SEARCH BAR (§6.9 & §7.2.6) ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4 mb-8">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`relative pb-3 text-[14px] font-sans font-medium transition-colors cursor-pointer select-none ${
                activeTab === 'upcoming' ? 'text-paper' : 'text-text-2 hover:text-paper'
              }`}
            >
              Upcoming ({upcomingList.length})
              {activeTab === 'upcoming' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-signal" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`relative pb-3 text-[14px] font-sans font-medium transition-colors cursor-pointer select-none ${
                activeTab === 'past' ? 'text-paper' : 'text-text-2 hover:text-paper'
              }`}
            >
              Past ({pastList.length})
              {activeTab === 'past' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-signal" />
              )}
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
            <Input
              type="text"
              placeholder="Filter events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-[13px]"
            />
          </div>
        </div>
      </section>

      {/* ─── EVENT LISTINGS ─── */}
      <section className="pb-24 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        {isLoadingEvents ? (
          <div className="flex flex-col divide-y divide-hairline">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-14 h-14 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="w-48 sm:w-64 h-5" />
                    <Skeleton className="w-32 h-4" />
                  </div>
                </div>
                <Skeleton className="w-24 h-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          activeTab === 'upcoming' ? (
            <div className="flex flex-col divide-y divide-hairline">
              {filteredEvents.map((event) => (
                <EventRow
                  key={event.id || event._id || event.title}
                  event={event}
                  isRegistered={Boolean(user && registeredEventIds.has(event.id))}
                  onRegister={() => {
                    if (event.ticketEnabled) {
                      setLocation(`/events/${event.id}/register`);
                    } else {
                      handleQuickRegister(event);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id || event._id || event.title}
                  event={event}
                  isRegistered={Boolean(user && registeredEventIds.has(event.id))}
                />
              ))}
            </div>
          )
        ) : (
          <EmptyState
            icon={CalendarIcon}
            title={activeTab === 'upcoming' ? 'No upcoming events' : 'No past events found'}
            description={
              activeTab === 'upcoming'
                ? 'Check back soon for new bootcamps and workshops.'
                : 'No archived events match your search query.'
            }
          />
        )}
      </section>
    </div>
  );
};

export default Events;
