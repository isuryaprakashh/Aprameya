import { useState } from 'react';
import { Link } from 'wouter';
import { events, upcomingEvents } from '../lib/data';
import EventCard from '../components/EventCard';
import { Event } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  MapPin,
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

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    message: ''
  });

  // Get current user for authentication check
  const { data: user } = useQuery<User>({
    queryKey: ['/api/me'],
    staleTime: 5000,
  });

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
      alert('Please select an event first');
      return;
    }

    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: parseInt(selectedEvent.id),
          message: formData.message
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Successfully registered for "${selectedEvent.title}"!\n\nYou will receive a confirmation email shortly.`);
        // Reset form
        setFormData({
          message: ''
        });
        setSelectedEvent(null);
      } else {
        alert(`❌ Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('❌ Network error. Please try again.');
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
                <Button className="ml-auto btn-primary" size="sm">
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
            {/* Events List */}
            <div className="lg:col-span-2 space-y-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard event={event} onRegister={() => handleRegisterInterest(event)} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-[var(--card-bg)]/50 rounded-xl border border-[var(--border-color)] border-dashed">
                  <Calendar className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No events found</h3>
                  <p className="text-[var(--text-secondary)]">Try adjusting your search or filters</p>
                </div>
              )}
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
