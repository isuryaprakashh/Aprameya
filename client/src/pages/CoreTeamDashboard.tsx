import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project, BlogPost, ResearchItem, Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaProjectDiagram,
  FaNewspaper,
  FaFlask,
  FaCalendarAlt,
  FaComments,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaPaperPlane,
  FaImage,
  FaUsers,
  FaTag,
  FaAlignLeft,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

const CoreTeamDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch projects, blogs, research items, and events
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

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    staleTime: 5000,
  });

  // Message thread for core team
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/db/messages'],
    staleTime: 5000,
  });

  const [newMessage, setNewMessage] = useState('');

  // Mutations
  const createProject = useMutation({
    mutationFn: (project: Omit<Project, 'id'>) =>
      apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(project) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const updateProject = useMutation({
    mutationFn: (project: Project) =>
      apiRequest(`/api/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(project) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const createBlog = useMutation({
    mutationFn: (blog: Omit<BlogPost, 'id'>) =>
      apiRequest('/api/blogs', { method: 'POST', body: JSON.stringify(blog) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const updateBlog = useMutation({
    mutationFn: (blog: BlogPost) =>
      apiRequest(`/api/blogs/${blog.id}`, { method: 'PATCH', body: JSON.stringify(blog) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const createResearch = useMutation({
    mutationFn: (research: Omit<ResearchItem, 'id'>) =>
      apiRequest('/api/research', { method: 'POST', body: JSON.stringify(research) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research'] });
      toast({
        title: 'Success',
        description: 'Research item created successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const updateResearch = useMutation({
    mutationFn: (research: ResearchItem) =>
      apiRequest(`/api/research/${research.id}`, { method: 'PATCH', body: JSON.stringify(research) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research'] });
      toast({
        title: 'Success',
        description: 'Research item updated successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const createEvent = useMutation({
    mutationFn: (event: Omit<Event, 'id'>) =>
      apiRequest('/api/events', { method: 'POST', body: JSON.stringify(event) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const updateEvent = useMutation({
    mutationFn: (event: Event) =>
      apiRequest(`/api/events/${event.id}`, { method: 'PATCH', body: JSON.stringify(event) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
      setSelectedItem(null);
      setIsEditing(false);
    },
  });

  const sendMessage = useMutation({
    mutationFn: (content: string) =>
      apiRequest('/api/db/messages', { method: 'POST', body: JSON.stringify({ content }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/db/messages'] });
      setNewMessage('');
    },
  });

  // Generic form handlers
  const handleEdit = (item: any, type: string) => {
    setSelectedItem({ ...item, type });
    setIsEditing(true);
  };

  const handleCreate = (type: string) => {
    const newItem: any = {};

    if (type === 'project') {
      newItem.title = '';
      newItem.description = '';
      newItem.category = '';
      newItem.technologies = '';
      newItem.team = '';
      newItem.image = '';
    } else if (type === 'blog') {
      newItem.title = '';
      newItem.excerpt = '';
      newItem.content = '';
      newItem.category = '';
      newItem.image = '';
    } else if (type === 'research') {
      newItem.title = '';
      newItem.description = '';
      newItem.category = '';
      newItem.authors = '';
      newItem.citations = 0;
      newItem.image = '';
    } else if (type === 'event') {
      newItem.title = '';
      newItem.description = '';
      newItem.type = '';
      newItem.date = '';
      newItem.time = '';
      newItem.location = '';
      newItem.image = '';
    }

    setSelectedItem({ ...newItem, type });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedItem(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedItem) return;

    const { type, ...item } = selectedItem;

    if (type === 'project') {
      if (item.id) {
        updateProject.mutate(item as Project);
      } else {
        createProject.mutate(item as Omit<Project, 'id'>);
      }
    } else if (type === 'blog') {
      if (item.id) {
        updateBlog.mutate(item as BlogPost);
      } else {
        createBlog.mutate(item as Omit<BlogPost, 'id'>);
      }
    } else if (type === 'research') {
      if (item.id) {
        updateResearch.mutate(item as ResearchItem);
      } else {
        createResearch.mutate(item as Omit<ResearchItem, 'id'>);
      }
    } else if (type === 'event') {
      if (item.id) {
        updateEvent.mutate(item as Event);
      } else {
        createEvent.mutate(item as Omit<Event, 'id'>);
      }
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };

  const renderForm = () => {
    if (!selectedItem) return null;

    const { type } = selectedItem;

    const FormField = ({ label, id, type = "text", value, onChange, isTextArea = false, rows = 3 }: any) => (
      <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-[hsl(var(--accent))]/80 ml-1">{label}</label>
        {isTextArea ? (
          <Textarea
            id={id}
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            className="bg-[var(--card-bg)]/40 border-[var(--border-color)] focus:border-[hsl(var(--accent))]/50 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 resize-none"
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? (parseInt(e.target.value, 10) || 0) : e.target.value)}
            className="bg-[var(--card-bg)]/40 border-[var(--border-color)] focus:border-[hsl(var(--accent))]/50 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 h-10"
          />
        )}
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full mb-8"
      >
        <div className="glass-panel p-6 border-[hsl(var(--accent))]/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--accent))]/0 via-[hsl(var(--accent))]/50 to-[hsl(var(--accent))]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              {type === 'project' && <FaProjectDiagram className="text-[hsl(var(--accent))]" />}
              {type === 'blog' && <FaNewspaper className="text-[hsl(var(--accent))]" />}
              {type === 'research' && <FaFlask className="text-[hsl(var(--accent))]" />}
              {type === 'event' && <FaCalendarAlt className="text-[hsl(var(--accent))]" />}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[hsl(var(--accent))]/50">
                {selectedItem.id ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </span>
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancelEdit}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10 rounded-full"
            >
              <FaTimes />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {type === 'project' && (
              <>
                <div className="md:col-span-2">
                  <FormField label="Project Title" id="title" value={selectedItem.title} onChange={(v: any) => handleInputChange('title', v)} />
                </div>
                <FormField label="Category" id="category" value={selectedItem.category} onChange={(v: any) => handleInputChange('category', v)} />
                <FormField label="Technologies (comma separated)" id="technologies" value={selectedItem.technologies} onChange={(v: any) => handleInputChange('technologies', v)} />
                <div className="md:col-span-2">
                  <FormField label="Description" id="description" value={selectedItem.description} onChange={(v: any) => handleInputChange('description', v)} isTextArea rows={4} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Team Members (comma separated)" id="team" value={selectedItem.team} onChange={(v: any) => handleInputChange('team', v)} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(v: any) => handleInputChange('image', v)} />
                </div>
              </>
            )}

            {type === 'blog' && (
              <>
                <div className="md:col-span-2">
                  <FormField label="Post Title" id="title" value={selectedItem.title} onChange={(v: any) => handleInputChange('title', v)} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Excerpt" id="excerpt" value={selectedItem.excerpt} onChange={(v: any) => handleInputChange('excerpt', v)} isTextArea rows={2} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Content" id="content" value={selectedItem.content} onChange={(v: any) => handleInputChange('content', v)} isTextArea rows={8} />
                </div>
                <FormField label="Category" id="category" value={selectedItem.category} onChange={(v: any) => handleInputChange('category', v)} />
                <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(v: any) => handleInputChange('image', v)} />
              </>
            )}

            {type === 'research' && (
              <>
                <div className="md:col-span-2">
                  <FormField label="Research Title" id="title" value={selectedItem.title} onChange={(v: any) => handleInputChange('title', v)} />
                </div>
                <FormField label="Category" id="category" value={selectedItem.category} onChange={(v: any) => handleInputChange('category', v)} />
                <FormField label="Citations" id="citations" type="number" value={selectedItem.citations} onChange={(v: any) => handleInputChange('citations', v)} />
                <div className="md:col-span-2">
                  <FormField label="Description" id="description" value={selectedItem.description} onChange={(v: any) => handleInputChange('description', v)} isTextArea rows={4} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Authors (comma separated)" id="authors" value={selectedItem.authors} onChange={(v: any) => handleInputChange('authors', v)} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(v: any) => handleInputChange('image', v)} />
                </div>
              </>
            )}

            {type === 'event' && (
              <>
                <div className="md:col-span-2">
                  <FormField label="Event Title" id="title" value={selectedItem.title} onChange={(v: any) => handleInputChange('title', v)} />
                </div>
                <FormField label="Event Type" id="type" value={selectedItem.type} onChange={(v: any) => handleInputChange('type', v)} />
                <FormField label="Date" id="date" type="date" value={selectedItem.date} onChange={(v: any) => handleInputChange('date', v)} />
                <FormField label="Time" id="time" value={selectedItem.time} onChange={(v: any) => handleInputChange('time', v)} />
                <FormField label="Location" id="location" value={selectedItem.location} onChange={(v: any) => handleInputChange('location', v)} />
                <div className="md:col-span-2">
                  <FormField label="Description" id="description" value={selectedItem.description} onChange={(v: any) => handleInputChange('description', v)} isTextArea rows={4} />
                </div>
                <div className="md:col-span-2">
                  <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(v: any) => handleInputChange('image', v)} />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[var(--border-color)]">
            <Button
              variant="ghost"
              onClick={handleCancelEdit}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0"
            >
              <FaSave className="mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans selection:bg-[hsl(var(--accent))]/30">
      <div className="container mx-auto py-8 px-4">
        <div className="glass-panel p-8 mb-8 border-b border-[var(--border-color)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--accent))]/0 via-[hsl(var(--accent))]/50 to-[hsl(var(--accent))]/0" />
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] via-[hsl(var(--accent))]/80 to-[hsl(var(--accent))]">
            Core Team Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl">
            Manage projects, publications, events, and team communications.
          </p>
        </div>

        {isEditing ? (
          renderForm()
        ) : (
          <Tabs defaultValue="projects" className="space-y-8">
            <TabsList className="glass-panel p-1 bg-[var(--card-bg)]/40 border-[hsl(var(--accent))]/20 w-full justify-start overflow-x-auto">
              <TabsTrigger value="projects" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Projects</TabsTrigger>
              <TabsTrigger value="blogs" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Blogs</TabsTrigger>
              <TabsTrigger value="research" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Research</TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Events</TabsTrigger>
              <TabsTrigger value="team-chat" className="data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:text-[var(--bg-body)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 px-6 py-2 rounded-lg">Team Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                      <FaProjectDiagram className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Manage ongoing and completed projects</p>
                    </div>
                  </div>
                  <Button onClick={() => handleCreate('project')} className="btn-primary bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0 shadow-lg shadow-[hsl(var(--accent))]/20">
                    <FaPlus className="mr-2" /> Add Project
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project: Project, index: number) => (
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
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
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
                        <p className="text-[var(--text-secondary)] line-clamp-3 text-sm leading-relaxed">{project.description}</p>
                      </CardContent>
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end relative z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project, 'project')}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10 transition-colors"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blogs" className="space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                      <FaNewspaper className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Blog Posts</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Manage blog articles and updates</p>
                    </div>
                  </div>
                  <Button onClick={() => handleCreate('blog')} className="btn-primary bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0 shadow-lg shadow-[hsl(var(--accent))]/20">
                    <FaPlus className="mr-2" /> Add Post
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog: BlogPost, index: number) => (
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
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
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
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end relative z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(blog, 'blog')}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10 transition-colors"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="research" className="space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                      <FaFlask className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Research</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Manage research publications and findings</p>
                    </div>
                  </div>
                  <Button onClick={() => handleCreate('research')} className="btn-primary bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0 shadow-lg shadow-[hsl(var(--accent))]/20">
                    <FaPlus className="mr-2" /> Add Research
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {research.map((item: ResearchItem, index: number) => (
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
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
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
                      </CardContent>
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end relative z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item, 'research')}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10 transition-colors"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                      <FaCalendarAlt className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Events</h2>
                      <p className="text-[var(--text-secondary)] text-sm">Manage upcoming and past events</p>
                    </div>
                  </div>
                  <Button onClick={() => handleCreate('event')} className="btn-primary bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0 shadow-lg shadow-[hsl(var(--accent))]/20">
                    <FaPlus className="mr-2" /> Add Event
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event: Event, index: number) => (
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
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
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
                        <div className="flex items-center text-[var(--text-secondary)]/80 text-xs">
                          <FaMapMarkerAlt className="mr-1 text-[hsl(var(--accent))]" /> {event.location}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end relative z-10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event, 'event')}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-body)]/10 transition-colors"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team-chat" className="space-y-6">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)] h-[600px] flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
                  <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                    <FaComments className="text-2xl text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Core Team Chat</h2>
                    <p className="text-[var(--text-secondary)] text-sm">Private secure channel for core team discussions</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar bg-[var(--card-bg)]/20 rounded-lg p-4 border border-[var(--border-color)]">
                  {(messages as any[]).map((message: any) => (
                    <div key={message.id} className="flex flex-col bg-[var(--bg-body)]/5 border border-[var(--border-color)] rounded-lg p-3 hover:border-[hsl(var(--accent))]/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[hsl(var(--accent))] text-sm">{message.user?.username || `User ${message.user_id}`}</span>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">{new Date(message.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-[var(--text-primary)]/90 text-sm leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newMessage.trim()) {
                        sendMessage.mutate(newMessage);
                      }
                    }}
                    className="bg-[var(--card-bg)]/40 border-[var(--border-color)] focus:border-[hsl(var(--accent))]/50 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50"
                  />
                  <Button
                    onClick={() => {
                      if (newMessage.trim()) {
                        sendMessage.mutate(newMessage);
                      }
                    }}
                    className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] border-0 shadow-lg shadow-[hsl(var(--accent))]/20"
                  >
                    <FaPaperPlane className="mr-2" /> Send
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CoreTeamDashboard;