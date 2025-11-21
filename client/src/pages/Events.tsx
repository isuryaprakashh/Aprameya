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
              <span className="bg-white text-black px-1 text-xs font-bold">02</span>
              <h2 className="text-lg font-bold text-white">COMMUNITY_EVENTS</h2>
            </div>
            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-[0.9] text-white">
              EVENTS &<br />WORKSHOPS
            </h1>
            <p className="text-sm text-gray-400 max-w-xl mb-12 font-mono leading-relaxed">
              Join our vibrant community through workshops, hackathons, and demonstrations
              focused on cutting-edge autonomous vehicle technology.
            </p>

            {/* Event Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-color)] border border-[var(--border-color)]">
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">{events.length}+</div>
                <div className="text-[10px] text-gray-500 uppercase">Events Hosted</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-[10px] text-gray-500 uppercase">Participants</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">12+</div>
                <div className="text-[10px] text-gray-500 uppercase">Workshops</div>
              </div>
              <div className="bg-[var(--card-bg)] p-6">
                <div className="text-3xl font-bold text-white mb-1">5+</div>
                <div className="text-[10px] text-gray-500 uppercase">Hackathons</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-[var(--bg-body)] border-b border-[var(--border-color)]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Events' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-16 px-4 bg-[var(--bg-body)]">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Events List */}
            <div className="lg:col-span-2 space-y-8">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <EventCard
                      event={event}
                      onRegisterInterest={handleRegisterInterest}
                    />
                  </motion.div>
                ))
              )}

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingEvents.map((event, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex flex-col items-center justify-center text-white">
                            <span className="text-sm font-bold">{event.day}</span>
                            <span className="text-xs">{event.month}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Soon
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-1">
              <motion.div
                id="registration-form"
                className="sticky top-24"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Register Interest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="event-name">Selected Event</Label>
                        <Input
                          id="event-name"
                          readOnly
                          value={selectedEvent ? selectedEvent.title : 'Select an event from the list'}
                          className="bg-slate-50 dark:bg-slate-700"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Why are you interested? (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your interest in this event..."
                          value={formData.message}
                          onChange={handleInputChange}
                          className="min-h-[80px]"
                        />
                      </div>

                      {user ? (
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          disabled={!selectedEvent}
                        >
                          {selectedEvent ? 'Submit Registration' : 'Select an Event First'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground text-center">
                            Please log in to register for events
                          </p>
                          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
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
                <Card className="mt-6 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
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
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <benefit.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm">{benefit.text}</span>
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
