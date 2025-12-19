import { useState } from 'react';
import { Link, useLocation } from 'wouter';
// import { events, upcomingEvents } from '../lib/data'; // Removed static import
import { Event } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock as ResultClockIcon,
  MapPin as ResultMapIcon,
  Users,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProximityMatrix from '../components/backgrounds/ProximityMatrix';
import { CleanCard } from '../components/ui/v6-card';

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

const Events = () => {
  const { toast } = useToast();
  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    message: ''
  });

  // Sort events to find upcoming ones
  const upcomingEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).filter(e => new Date(e.date) > new Date()).slice(0, 1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center text-[var(--text-secondary)]">
        Error loading events. Please try again later.
      </div>
    );
  }

  const handleRegisterInterest = (event: Event) => {
    setSelectedEvent(event);
    // Scroll to form on mobile
    if (window.innerWidth < 1024) {
      const form = document.getElementById('registration-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent) {
      toast({
        title: "Selection Required",
        description: "Please select an event from the list first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/db/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          message: formData.message
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Successfully Registered!",
          description: `You have registered for "${selectedEvent.title}". Check your email for confirmation.`,
        });
        // Reset form
        setFormData({
          message: ''
        });
        setSelectedEvent(null);
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Something went wrong.",
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
        <ProximityMatrix />
        <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-[var(--text-primary)] text-[var(--bg-body)] px-1 text-xs font-bold">03</span>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">COMMUNITY_HUB</h2>
            </div>
            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-[0.9] text-[var(--text-primary)]">
              EVENTS &<br />WORKSHOPS
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mb-12 font-mono leading-relaxed">
              Join our community of innovators. Participate in hackathons, workshops,
              and tech talks to level up your skills and network with like-minded peers.
            </p>

            {/* Upcoming Highlight */}
            {upcomingEvents.length > 0 && (
              <div className="inline-flex items-center gap-4 p-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg max-w-2xl">
                <div className="w-12 h-12 bg-[hsl(var(--accent))]/10 flex items-center justify-center rounded-md border border-[hsl(var(--accent))]/20 shrink-0">
                  <Calendar className="w-6 h-6 text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <div className="text-[10px] text-[hsl(var(--accent))] font-bold uppercase tracking-wider mb-1">Next Big Event</div>
                  <div className="text-[var(--text-primary)] font-bold">{upcomingEvents[0].title}</div>
                  <div className="text-xs text-gray-400">{upcomingEvents[0].date} • {upcomingEvents[0].location}</div>
                </div>
                <Button className="ml-auto btn-primary" size="sm" onClick={() => handleRegisterInterest(upcomingEvents[0])}>
                  Register Now
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-[hsl(var(--accent))]" />
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filterType === type
                    ? 'bg-[hsl(var(--accent))] text-[var(--bg-body)]'
                    : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]'
                    }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[var(--card-bg)] border-[var(--border-color)] focus:border-[hsl(var(--accent))]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Events Timeline */}
            <div className="lg:col-span-2 relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--border-color)]"></div>

              <div className="space-y-12">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative pl-20"
                    >
                      {/* Timeline Dot */}
                      <div className={cn(
                        "absolute left-[30px] top-6 w-3 h-3 rounded-full shadow-[0_0_10px_hsl(var(--accent))] z-10 transition-colors duration-300",
                        selectedEvent?.id === event.id ? "bg-[hsl(var(--accent))]" : "bg-[var(--border-color)]"
                      )}></div>
                      {selectedEvent?.id === event.id && (
                        <div className="absolute left-[31px] top-6 w-3 h-3 rounded-full bg-[hsl(var(--accent))] animate-ping opacity-50"></div>
                      )}

                      <CleanCard
                        className={cn(
                          "flex flex-col md:flex-row overflow-hidden group transition-all duration-300",
                          selectedEvent?.id === event.id ? "border-[hsl(var(--accent))] shadow-[0_0_20px_hsl(var(--accent))/10]" : ""
                        )}
                        onClick={() => handleRegisterInterest(event)}
                      >
                        {/* Event Image */}
                        <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-body)]/80 to-transparent z-10 md:hidden"></div>
                          <img
                            src={event.image || '/assets/event_symposium.png'}
                            alt={event.title}
                            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 md:hidden z-20">
                            <Badge variant="outline" className="bg-[var(--bg-body)]/80 backdrop-blur-sm border-[hsl(var(--accent))]/30 text-[hsl(var(--accent))]">
                              {event.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 p-6 flex flex-col justify-between relative">
                          {user?.role === 'ADMIN' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-4 right-4 z-20"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent CleanCard's onClick from firing
                                setLocation(`/dashboard?view=events&editId=${event.id}&type=event`);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="hidden md:flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-[hsl(var(--accent))]/5 border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10">
                                  {event.type}
                                </Badge>
                                <span className="text-xs text-[var(--text-secondary)] font-mono">{event.year}</span>
                              </div>
                              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">
                                {event.title}
                              </h3>
                            </div>
                            <div className="text-center bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-2 min-w-[60px]">
                              <div className="text-xs text-[var(--text-secondary)] uppercase">{event.month}</div>
                              <div className="text-xl font-bold text-[var(--text-primary)]">{event.day}</div>
                            </div>
                          </div>

                          <div className="space-y-2 mb-6">
                            <div className="flex items-center text-sm text-[var(--text-secondary)]">
                              <ResultClockIcon className="w-4 h-4 mr-2 text-[hsl(var(--accent))]" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-sm text-[var(--text-secondary)]">
                              <ResultMapIcon className="w-4 h-4 mr-2 text-[hsl(var(--accent))]" />
                              {event.location}
                            </div>
                          </div>

                          <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              className={cn(
                                "text-xs font-bold uppercase tracking-wider transition-all",
                                selectedEvent?.id === event.id
                                  ? "bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90"
                                  : "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[hsl(var(--accent))]"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegisterInterest(event);
                              }}
                            >
                              {selectedEvent?.id === event.id ? "Selected" : "Select Event"}
                            </Button>
                          </div>
                        </div>
                      </CleanCard>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-[var(--card-bg)]/50 rounded-xl border border-[var(--border-color)] border-dashed ml-8">
                    <Calendar className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No events found</h3>
                    <p className="text-[var(--text-secondary)]">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Form Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                id="registration-form"
                className="sticky top-24"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-0 shadow-xl bg-[var(--card-bg)] border-[var(--border-color)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
                      <Users className="w-5 h-5 text-[hsl(var(--accent))]" />
                      Register Interest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="event-name" className="text-[var(--text-secondary)]">Selected Event</Label>
                        <Input
                          id="event-name"
                          readOnly
                          value={selectedEvent ? selectedEvent.title : 'Select an event from the list'}
                          className="bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-[var(--text-secondary)]">Why are you interested? (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your interest in this event..."
                          value={formData.message}
                          onChange={handleInputChange}
                          className="min-h-[80px] bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                        />
                      </div>

                      {user ? (
                        <Button
                          type="submit"
                          className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)]"
                          disabled={!selectedEvent}
                        >
                          {selectedEvent ? 'Submit Registration' : 'Select an Event First'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-[var(--text-secondary)] text-center">
                            Please log in to register for events
                          </p>
                          <Button asChild className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)]">
                            <Link href="/login">
                              Login to Register
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>

                {/* Event Benefits */}
                <Card className="mt-6 border-0 shadow-lg bg-[var(--card-bg)] border-[var(--border-color)]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[var(--text-primary)]">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Event Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { icon: Zap, text: "Hands-on Learning" },
                        { icon: Users, text: "Networking Opportunities" },
                        { icon: Trophy, text: "Certificates & Prizes" },
                        { icon: Sparkles, text: "Industry Exposure" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[hsl(var(--accent))]/10 rounded-lg flex items-center justify-center">
                            <benefit.icon className="w-4 h-4 text-[hsl(var(--accent))]" />
                          </div>
                          <span className="text-sm text-[var(--text-secondary)]">{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
