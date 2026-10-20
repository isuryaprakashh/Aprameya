import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Event, TicketRegistration as TicketType } from '@/lib/types';
import { events as fallbackEvents } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  AlertTriangle,
  Ticket as TicketIcon,
} from 'lucide-react';
import TicketPass from '@/components/TicketPass';

export default function TicketRegistration() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, params] = useRoute('/events/:eventId/register');
  const eventId = params?.eventId;

  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [year, setYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState<TicketType | null>(null);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setFullName(user.username || '');
      setRollNumber(user.rollNumber || '');
    }
  }, [user]);

  const { data: event, isLoading: eventLoading, error: eventError } = useQuery<Event>({
    queryKey: [`/api/events/${eventId}`],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      try {
        const res = await fetch(`${baseUrl}/api/events/${eventId}`);
        if (!res.ok) {
          const fallback = fallbackEvents.find((e) => e.id === eventId);
          if (fallback) return fallback;
          throw new Error('Event not found');
        }
        return res.json();
      } catch (err) {
        const fallback = fallbackEvents.find((e) => e.id === eventId);
        if (fallback) return fallback;
        throw err;
      }
    },
    initialData: () => fallbackEvents.find((e) => e.id === eventId),
    enabled: !!eventId,
  });

  // Check if user already has a ticket
  const { data: existingTicket } = useQuery<TicketType>({
    queryKey: [`/api/tickets/my/${eventId}`],
    enabled: !!eventId && !!user,
    retry: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({ title: 'Full Name is required', variant: 'destructive' });
      return;
    }
    if (!/^\d{10}$/.test(rollNumber)) {
      toast({ title: 'College ID must be exactly 10 digits', variant: 'destructive' });
      return;
    }
    if (!year) {
      toast({ title: 'Year of study is required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest('/api/tickets/register', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          fullName: fullName.trim(),
          rollNumber,
          year: parseInt(year, 10),
        }),
      });
      const data = await res.json();

      setTicketData(data.ticket);
      toast({
        title: 'Pass Issued',
        description: 'Your registration pass QR code is ready.',
      });
    } catch (err: any) {
      const msg = err.message || 'Registration failed';
      let displayMsg = msg;
      try {
        if (msg.includes('{')) {
          const json = JSON.parse(msg.substring(msg.indexOf('{')));
          displayMsg = json.error || msg;
        }
      } catch { }
      toast({ title: 'Registration Failed', description: displayMsg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-ink text-paper flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-hairline p-8 text-center bg-surface-1">
          <AlertTriangle className="size-10 text-signal mx-auto mb-4" />
          <h1 className="text-xl font-medium text-paper mb-2">Sign in required</h1>
          <p className="text-sm text-text-2 mb-6">
            Please log in with your college account to reserve an event pass.
          </p>
          <Link href="/login">
            <Button variant="primary" size="md" className="w-full">
              Go to sign in
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (eventLoading && !event) {
    return (
      <main className="min-h-screen bg-ink text-paper pt-28 pb-20 px-6 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  if (eventError || !event) {
    return (
      <main className="min-h-screen bg-ink text-paper flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-hairline p-8 text-center bg-surface-1">
          <AlertTriangle className="size-10 text-signal mx-auto mb-4" />
          <h1 className="text-xl font-medium text-paper mb-2">Event not found</h1>
          <p className="text-sm text-text-2 mb-6">This event listing is currently unavailable.</p>
          <Link href="/events">
            <Button variant="secondary" size="md">
              Back to events
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const isSoldOut = event.capacity && (event.registeredCount || 0) >= event.capacity;
  const activeTicket = ticketData || existingTicket;

  return (
    <main className="min-h-screen bg-ink text-paper pt-28 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href={`/events/${eventId || ''}`}
          className="inline-flex items-center gap-2 text-xs text-mute hover:text-paper transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to event</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Event Summary Column (5 cols) */}
        <div className="lg:col-span-5 border border-hairline p-6 bg-surface-1 space-y-4">
          <div className="flex items-center gap-2 text-xs text-mute font-mono">
            <div className="size-2 rounded-full bg-signal" />
            <span>{event.type || 'Workshop'}</span>
          </div>

          <h2 className="text-xl font-medium text-paper leading-snug">
            {event.title}
          </h2>

          <div className="space-y-2.5 text-xs text-text-2 pt-2 border-t border-hairline">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-mute" />
              <span className="font-mono">{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-mute" />
                <span className="font-mono">{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-mute" />
              <span>{event.location || 'KL University'}</span>
            </div>
          </div>

          {event.description && (
            <p className="text-xs text-mute leading-relaxed pt-2 border-t border-hairline line-clamp-4">
              {event.description}
            </p>
          )}
        </div>

        {/* Right: Pass Confirmation or Registration Form (7 cols) */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="space-y-4">
              <div className="p-4 border border-hairline bg-surface-1 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-paper">Pass confirmed</h3>
                  <p className="text-xs text-mute">Tap the card to view the check-in QR code.</p>
                </div>
                <Link href="/my-tickets">
                  <Button variant="secondary" size="sm">
                    All my passes
                  </Button>
                </Link>
              </div>

              <TicketPass
                ticket={activeTicket}
                eventTitle={event.title}
                eventDate={event.date}
                eventTime={event.time}
                eventLocation={event.location}
              />
            </div>
          ) : isSoldOut ? (
            <div className="border border-hairline p-8 text-center bg-surface-1">
              <AlertTriangle className="size-8 text-warn mx-auto mb-3" />
              <h3 className="text-base font-medium text-paper mb-1">Capacity reached</h3>
              <p className="text-xs text-mute">
                Registration for this session has reached its cohort limit.
              </p>
            </div>
          ) : (
            <div className="border border-hairline p-6 md:p-8 bg-surface-1">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-hairline">
                <TicketIcon className="size-4 text-signal" />
                <h3 className="text-base font-medium text-paper">Generate attendance pass</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="fullName" className="text-xs text-mute">
                    Full name *
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your legal student name"
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rollNumber" className="text-xs text-mute">
                    College ID (10 digits) *
                  </Label>
                  <Input
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g. 2200030123"
                    className="mt-1.5 font-mono"
                    maxLength={10}
                    required
                  />
                  {rollNumber && rollNumber.length !== 10 && (
                    <p className="text-xs text-signal-text mt-1 font-mono">
                      {rollNumber.length}/10 digits
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year" className="text-xs text-mute">
                    Year of study *
                  </Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger id="year" className="mt-1.5">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || !fullName || rollNumber.length !== 10 || !year}
                    className="w-full"
                    loading={isSubmitting}
                  >
                    Confirm and issue pass
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
