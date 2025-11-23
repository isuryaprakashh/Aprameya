import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project, BlogPost, ResearchItem, Event, User, EventRegistration, Comment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaClipboardList,
  FaProjectDiagram,
  FaNewspaper,
  FaFlask,
  FaUser,
  FaCheckCircle,
  FaCommentDots,
  FaUserShield,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaArrowRight
} from 'react-icons/fa';

const AspirantDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch current user, event registrations, and comments
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users/me'],
    staleTime: 5000,
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    staleTime: 5000,
  });

  const { data: userEventRegistrations = [] } = useQuery<EventRegistration[]>({
    queryKey: ['/api/users/me/event-registrations'],
    staleTime: 5000,
  });

  const { data: userComments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/users/me/comments'],
    staleTime: 5000,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    staleTime: 5000,
  });

  const { data: blogs = [] } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
    staleTime: 5000,
  });

  const { data: research = [] } = useQuery<ResearchItem[]>({
    queryKey: ['/api/research'],
    staleTime: 5000,
  });

  // Register for event mutation
  const registerForEvent = useMutation({
    mutationFn: (eventId: number) =>
      apiRequest('/api/event-registrations', {
        method: 'POST',
        body: JSON.stringify({ event_id: eventId })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/event-registrations'] });
      toast({
        title: 'Success',
        description: 'You have been registered for the event successfully',
      });
    },
  });

  // Cancel event registration mutation
  const cancelEventRegistration = useMutation({
    mutationFn: (registrationId: number) =>
      apiRequest(`/api/event-registrations/${registrationId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/event-registrations'] });
      toast({
        title: 'Success',
        description: 'Event registration cancelled successfully',
      });
    },
  });

  // Add comment mutation
  const addComment = useMutation({
    mutationFn: (comment: { content: string, project_id?: number, blog_id?: number, research_id?: number }) =>
      apiRequest('/api/comments', { method: 'POST', body: JSON.stringify(comment) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/comments'] });
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    },
  });

  const handleRegisterForEvent = (eventId: string | number) => {
    registerForEvent.mutate(Number(eventId));
  };

  const handleCancelRegistration = (registrationId: number | null) => {
    if (registrationId && window.confirm('Are you sure you want to cancel this event registration?')) {
      cancelEventRegistration.mutate(registrationId);
    }
  };

  const isRegisteredForEvent = (eventId: string | number) => {
    return userEventRegistrations.some((reg) => reg.event_id === Number(eventId));
  };

  const getRegistrationId = (eventId: string | number) => {
    const registration = userEventRegistrations.find((reg) => reg.event_id === Number(eventId));
    return registration ? registration.id : null;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans selection:bg-[hsl(var(--accent))]/30">
      <div className="container mx-auto py-8 px-4">
        <div className="glass-panel p-8 mb-8 border-b border-[var(--border-color)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--accent))]/0 via-[hsl(var(--accent))]/50 to-[hsl(var(--accent))]/0" />
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] via-[hsl(var(--accent))]/80 to-[hsl(var(--accent))]">
            Aspirant Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl">
            Track your journey, manage registrations, and explore opportunities.
          </p>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-8 border border-[var(--border-color)] rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--accent))]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                Welcome, <span className="text-[hsl(var(--accent))]">{currentUser?.username || 'Aspirant'}</span>!
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Explore events, track your registrations, and engage with our community
              </p>
            </div>
            <Badge className="mt-2 md:mt-0 bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/30 px-3 py-1">
              <FaUserShield className="mr-2" /> {currentUser?.role || 'ASPIRANT'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-[var(--card-bg)]/40 border border-[var(--border-color)] p-4 rounded-lg flex items-center gap-4 group hover:border-[hsl(var(--accent))]/30 transition-colors">
              <div className="p-3 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] group-hover:bg-[hsl(var(--accent))]/20 transition-colors">
                <FaClipboardList className="text-xl" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Registered Events</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{userEventRegistrations.length}</p>
              </div>
            </div>

            <div className="bg-[var(--card-bg)]/40 border border-[var(--border-color)] p-4 rounded-lg flex items-center gap-4 group hover:border-[hsl(var(--accent))]/30 transition-colors">
              <div className="p-3 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] group-hover:bg-[hsl(var(--accent))]/20 transition-colors">
                <FaCommentDots className="text-xl" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Comments Posted</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{userComments.length}</p>
              </div>
            </div>

            <div className="bg-[var(--card-bg)]/40 border border-[var(--border-color)] p-4 rounded-lg flex items-center gap-4 group hover:border-[hsl(var(--accent))]/30 transition-colors">
              <div className="p-3 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] group-hover:bg-[hsl(var(--accent))]/20 transition-colors">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Account Status</p>
                <p className="text-lg font-bold text-[var(--text-primary)] capitalize">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-panel p-1 bg-[var(--card-bg)]/40 border-[hsl(var(--accent))]/20 w-full justify-start overflow-x-auto">
            <TabsTrigger value="events" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Upcoming Events</TabsTrigger>
            <TabsTrigger value="registrations" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">My Registrations</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Projects</TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Blogs</TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                  <FaCalendarAlt className="text-2xl text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Upcoming Events</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Discover and register for upcoming workshops and seminars</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => {
                  const isRegistered = isRegisteredForEvent(event.id);
                  const registrationId = getRegistrationId(event.id);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="clean-card group h-full flex flex-col"
                    >
                      {event.image && (
                        <div className="h-48 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)]/80 to-transparent z-10" />
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                          <div className="absolute top-4 right-4 z-20">
                            <span className="px-3 py-1 rounded-full bg-[var(--bg-body)]/70 backdrop-blur-md text-xs font-mono text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader className="relative z-10">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{event.title}</CardTitle>
                        </div>
                        <CardDescription className="text-[hsl(var(--accent))] font-mono text-xs mt-1 flex items-center">
                          <FaClock className="mr-1" /> {event.date} • {event.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow relative z-10">
                        <p className="text-[var(--text-secondary)] line-clamp-3 text-sm leading-relaxed mb-3">{event.description}</p>
                        <div className="flex items-center text-[var(--text-secondary)] text-xs">
                          <FaMapMarkerAlt className="mr-1 text-[hsl(var(--accent))]" /> {event.location}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end relative z-10">
                        {isRegistered ? (
                          <Button
                            variant="destructive"
                            onClick={() => handleCancelRegistration(registrationId)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                          >
                            Cancel Registration
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRegisterForEvent(event.id)}
                            className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0 shadow-lg shadow-[hsl(var(--accent))]/20"
                          >
                            Register Now
                          </Button>
                        )}
                      </CardFooter>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                  <FaClipboardList className="text-2xl text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Event Registrations</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Manage your event participation</p>
                </div>
              </div>

              {userEventRegistrations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]/20">
                  <FaCalendarAlt className="mx-auto text-4xl text-[var(--text-secondary)] mb-4" />
                  <p className="text-[var(--text-secondary)] text-lg">You haven't registered for any events yet.</p>
                  <Button
                    variant="link"
                    className="text-[hsl(var(--accent))] mt-2"
                    onClick={() => setActiveTab('events')}
                  >
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEventRegistrations.map((registration, index) => (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="clean-card group"
                    >
                      <CardHeader>
                        <CardTitle className="text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{registration.event?.title || 'Event'}</CardTitle>
                        <CardDescription className="text-[var(--text-secondary)] font-mono text-xs">
                          {registration.event?.date || 'Date TBA'} | {registration.event?.location || 'Location TBA'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[var(--text-secondary)] line-clamp-2 text-sm">{registration.event?.description || 'No description available'}</p>
                      </CardContent>
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelRegistration(registration.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          Cancel Registration
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                  <FaProjectDiagram className="text-2xl text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Explore Our Projects</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Discover innovative projects by our community</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="clean-card group h-full flex flex-col"
                  >
                    {project.image && (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)]/80 to-transparent z-10" />
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-[var(--bg-body)]/70 backdrop-blur-md text-xs font-mono text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <p className="text-[var(--text-secondary)] line-clamp-3 text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 rounded bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 relative z-10">
                      <Button variant="ghost" className="w-full text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:bg-[hsl(var(--accent))]/10 group-hover:translate-x-1 transition-all">
                        View Details <FaArrowRight className="ml-2" />
                      </Button>
                    </CardFooter>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                  <FaNewspaper className="text-2xl text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Latest Blogs</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Read articles and updates from our team</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="clean-card group h-full flex flex-col"
                  >
                    {blog.image && (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)]/80 to-transparent z-10" />
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-[var(--bg-body)]/70 backdrop-blur-md text-xs font-mono text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <p className="text-[var(--text-secondary)] line-clamp-3 text-sm leading-relaxed">{blog.excerpt}</p>
                    </CardContent>
                    <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 relative z-10">
                      <Button variant="ghost" className="w-full text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:bg-[hsl(var(--accent))]/10 group-hover:translate-x-1 transition-all">
                        Read More <FaArrowRight className="ml-2" />
                      </Button>
                    </CardFooter>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                  <FaFlask className="text-2xl text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Research Publications</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Explore our latest research findings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {research.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="clean-card group h-full flex flex-col"
                  >
                    {item.image && (
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)]/80 to-transparent z-10" />
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-[var(--bg-body)]/70 backdrop-blur-md text-xs font-mono text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/30">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <p className="text-[var(--text-secondary)] line-clamp-3 text-sm leading-relaxed mb-4">{item.description}</p>
                      <div className="flex items-center text-[hsl(var(--accent))]/80 text-sm font-mono bg-[hsl(var(--accent))]/5 p-2 rounded border border-[hsl(var(--accent))]/10 w-fit">
                        <FaTag className="mr-2" /> Citations: {item.citations}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-3">Authors: {Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</p>
                    </CardContent>
                    <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 relative z-10">
                      <Button variant="ghost" className="w-full text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:bg-[hsl(var(--accent))]/10 group-hover:translate-x-1 transition-all">
                        View Publication <FaArrowRight className="ml-2" />
                      </Button>
                    </CardFooter>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AspirantDashboard;