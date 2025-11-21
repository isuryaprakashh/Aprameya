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
    <div className="min-h-screen dither-bg text-foreground font-sans selection:bg-accent/30">
      <div className="container mx-auto py-8 px-4">
        <div className="glass-panel p-8 mb-8 border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0" />
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-emerald-200 to-emerald-400">
            Aspirant Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Track your journey, manage registrations, and explore opportunities.
          </p>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-8 border border-border rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                Welcome, <span className="text-accent">{currentUser?.username || 'Aspirant'}</span>!
              </h2>
              <p className="text-muted-foreground text-sm">
                Explore events, track your registrations, and engage with our community
              </p>
            </div>
            <Badge className="mt-2 md:mt-0 bg-accent/20 text-accent border-accent/30 px-3 py-1">
              <FaUserShield className="mr-2" /> {currentUser?.role || 'ASPIRANT'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-card/40 border border-border p-4 rounded-lg flex items-center gap-4 group hover:border-accent/30 transition-colors">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <FaClipboardList className="text-xl" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Registered Events</p>
                <p className="text-2xl font-bold text-foreground">{userEventRegistrations.length}</p>
              </div>
            </div>

            <div className="bg-card/40 border border-border p-4 rounded-lg flex items-center gap-4 group hover:border-accent/30 transition-colors">
              <div className="p-3 rounded-full bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                <FaCommentDots className="text-xl" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Comments Posted</p>
                <p className="text-2xl font-bold text-foreground">{userComments.length}</p>
              </div>
            </div>

            <div className="bg-card/40 border border-border p-4 rounded-lg flex items-center gap-4 group hover:border-accent/30 transition-colors">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Account Status</p>
                <p className="text-lg font-bold text-foreground capitalize">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-panel p-1 bg-card/40 border-accent/20 w-full justify-start overflow-x-auto">
            <TabsTrigger value="events" className="data-[state=active]:bg-accent data-[state=active]:text-white text-muted-foreground hover:text-foreground transition-all duration-300 px-6 py-2 rounded-lg">Upcoming Events</TabsTrigger>
            <TabsTrigger value="registrations" className="data-[state=active]:bg-accent data-[state=active]:text-white text-muted-foreground hover:text-foreground transition-all duration-300 px-6 py-2 rounded-lg">My Registrations</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-accent data-[state=active]:text-white text-muted-foreground hover:text-foreground transition-all duration-300 px-6 py-2 rounded-lg">Projects</TabsTrigger>
            <TabsTrigger value="blogs" className="data-[state=active]:bg-accent data-[state=active]:text-white text-muted-foreground hover:text-foreground transition-all duration-300 px-6 py-2 rounded-lg">Blogs</TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-accent data-[state=active]:text-white text-muted-foreground hover:text-foreground transition-all duration-300 px-6 py-2 rounded-lg">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <FaCalendarAlt className="text-2xl text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                  <p className="text-muted-foreground text-sm">Discover and register for upcoming workshops and seminars</p>
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                          <div className="absolute top-4 right-4 z-20">
                            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-accent border border-accent/30">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader className="relative z-10">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{event.title}</CardTitle>
                        </div>
                        <CardDescription className="text-accent font-mono text-xs mt-1 flex items-center">
                          <FaClock className="mr-1" /> {event.date} • {event.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow relative z-10">
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-3">{event.description}</p>
                        <div className="flex items-center text-muted-foreground text-xs">
                          <FaMapMarkerAlt className="mr-1 text-accent" /> {event.location}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-border bg-card/20 p-4 flex justify-end relative z-10">
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
                            className="bg-accent hover:bg-accent/90 text-white border-0 shadow-lg shadow-accent/20"
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
            <div className="glass-panel p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <FaClipboardList className="text-2xl text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">My Event Registrations</h2>
                  <p className="text-muted-foreground text-sm">Manage your event participation</p>
                </div>
              </div>

              {userEventRegistrations.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/20">
                  <FaCalendarAlt className="mx-auto text-4xl text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">You haven't registered for any events yet.</p>
                  <Button
                    variant="link"
                    className="text-accent mt-2"
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
                        <CardTitle className="text-foreground group-hover:text-accent transition-colors">{registration.event?.title || 'Event'}</CardTitle>
                        <CardDescription className="text-muted-foreground font-mono text-xs">
                          {registration.event?.date || 'Date TBA'} | {registration.event?.location || 'Location TBA'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2 text-sm">{registration.event?.description || 'No description available'}</p>
                      </CardContent>
                      <CardFooter className="border-t border-border bg-card/20 p-4 flex justify-end">
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
            <div className="glass-panel p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <FaProjectDiagram className="text-2xl text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Explore Our Projects</h2>
                  <p className="text-muted-foreground text-sm">Discover innovative projects by our community</p>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-accent border border-accent/30">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-mono">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-border bg-card/20 p-4 relative z-10">
                      <Button variant="ghost" className="w-full text-accent hover:text-accent/80 hover:bg-accent/10 group-hover:translate-x-1 transition-all">
                        View Details <FaArrowRight className="ml-2" />
                      </Button>
                    </CardFooter>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <FaNewspaper className="text-2xl text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Latest Blogs</h2>
                  <p className="text-muted-foreground text-sm">Read articles and updates from our team</p>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-accent border border-accent/30">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{blog.excerpt}</p>
                    </CardContent>
                    <CardFooter className="border-t border-border bg-card/20 p-4 relative z-10">
                      <Button variant="ghost" className="w-full text-accent hover:text-accent/80 hover:bg-accent/10 group-hover:translate-x-1 transition-all">
                        Read More <FaArrowRight className="ml-2" />
                      </Button>
                    </CardFooter>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="research" className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <FaFlask className="text-2xl text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Research Publications</h2>
                  <p className="text-muted-foreground text-sm">Explore our latest research findings</p>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" />
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-accent border border-accent/30">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative z-10">
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">{item.description}</p>
                      <div className="flex items-center text-accent/80 text-sm font-mono bg-accent/5 p-2 rounded border border-accent/10 w-fit">
                        <FaTag className="mr-2" /> Citations: {item.citations}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">Authors: {Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</p>
                    </CardContent>
                    <CardFooter className="border-t border-border bg-card/20 p-4 relative z-10">
                      <Button variant="ghost" className="w-full text-accent hover:text-accent/80 hover:bg-accent/10 group-hover:translate-x-1 transition-all">
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