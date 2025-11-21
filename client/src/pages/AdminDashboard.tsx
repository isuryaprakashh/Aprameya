import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project, BlogPost, ResearchItem, Event } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@shared/schema';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaSearch, FaFilter, FaUsers, FaProjectDiagram, FaNewspaper, FaFlask, FaCalendarAlt, FaComments, FaClipboardList } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface EventRegistration {
  id: number;
  registeredAt: string;
  event?: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
  };
  user?: {
    username: string;
    display_name?: string;
    email: string;
    role: string;
  };
}

interface EventRegistrationsData {
  registrations: EventRegistration[];
  totalRegistrations: number;
}

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch users, projects, blogs, research items, and events
  const { data: users = [] as User[] } = useQuery<User[]>({
    queryKey: ['/api/users'],
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

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    staleTime: 5000,
  });

  // Message thread for core team
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/db/messages'],
    staleTime: 5000,
  });

  // Event registrations for admin management
  const { data: eventRegistrations = { registrations: [], totalRegistrations: 0 } } = useQuery<EventRegistrationsData>({
    queryKey: ['/api/admin/event-registrations'],
    staleTime: 5000,
  });

  const [newMessage, setNewMessage] = useState('');

  // Mutations
  const updateUserRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number, role: string }) =>
      apiRequest(`/api/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
    },
  });

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

  const deleteProject = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
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

  const deleteBlog = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/blogs/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blogs'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
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

  const deleteResearch = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/research/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research'] });
      toast({
        title: 'Success',
        description: 'Research item deleted successfully',
      });
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

  const deleteEvent = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/events/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
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

  const handleDelete = (id: number, type: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      if (type === 'project') {
        deleteProject.mutate(id);
      } else if (type === 'blog') {
        deleteBlog.mutate(id);
      } else if (type === 'research') {
        deleteResearch.mutate(id);
      } else if (type === 'event') {
        deleteEvent.mutate(id);
      }
    }
  };

  const handleChangeUserRole = (userId: number, role: string) => {
    updateUserRole.mutate({ userId, role });
  };

  const renderForm = () => {
    if (!selectedItem) return null;

    const { type } = selectedItem;

    const FormField = ({ label, id, type = "text", value, onChange, isTextArea = false, rows = 4 }: any) => (
      <div className="mb-4">
        <label htmlFor={id} className="text-xs font-mono text-gray-400 mb-2 block uppercase">{label}</label>
        {isTextArea ? (
          <Textarea
            id={id}
            value={value}
            rows={rows}
            onChange={onChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)] text-white focus:border-emerald-500/50"
          />
        ) : (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            className="bg-[var(--card-bg)] border-[var(--border-color)] text-white focus:border-emerald-500/50"
          />
        )}
      </div>
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-xl border border-[var(--border-color)] mb-8"
      >
        <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FaEdit className="text-emerald-400" />
            {selectedItem.id ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </h3>
          <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-400 hover:text-white">
            <FaTimes />
          </Button>
        </div>

        <div className="space-y-4">
          {type === 'project' && (
            <>
              <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => handleInputChange('title', e.target.value)} />
              <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => handleInputChange('category', e.target.value)} />
              <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => handleInputChange('description', e.target.value)} isTextArea />
              <FormField label="Technologies (comma separated)" id="technologies" value={selectedItem.technologies} onChange={(e: any) => handleInputChange('technologies', e.target.value)} />
              <FormField label="Team Members (comma separated)" id="team" value={selectedItem.team} onChange={(e: any) => handleInputChange('team', e.target.value)} />
              <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => handleInputChange('image', e.target.value)} />
            </>
          )}

          {type === 'blog' && (
            <>
              <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => handleInputChange('title', e.target.value)} />
              <FormField label="Excerpt" id="excerpt" value={selectedItem.excerpt} onChange={(e: any) => handleInputChange('excerpt', e.target.value)} />
              <FormField label="Content" id="content" value={selectedItem.content} onChange={(e: any) => handleInputChange('content', e.target.value)} isTextArea rows={8} />
              <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => handleInputChange('category', e.target.value)} />
              <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => handleInputChange('image', e.target.value)} />
            </>
          )}

          {type === 'research' && (
            <>
              <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => handleInputChange('title', e.target.value)} />
              <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => handleInputChange('category', e.target.value)} />
              <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => handleInputChange('description', e.target.value)} isTextArea />
              <FormField label="Authors (comma separated)" id="authors" value={selectedItem.authors} onChange={(e: any) => handleInputChange('authors', e.target.value)} />
              <FormField label="Citations" id="citations" type="number" value={selectedItem.citations} onChange={(e: any) => handleInputChange('citations', parseInt(e.target.value, 10) || 0)} />
              <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => handleInputChange('image', e.target.value)} />
            </>
          )}

          {type === 'event' && (
            <>
              <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => handleInputChange('title', e.target.value)} />
              <FormField label="Event Type" id="type" value={selectedItem.type} onChange={(e: any) => handleInputChange('type', e.target.value)} />
              <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => handleInputChange('description', e.target.value)} isTextArea />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date" id="date" type="date" value={selectedItem.date} onChange={(e: any) => handleInputChange('date', e.target.value)} />
                <FormField label="Time" id="time" value={selectedItem.time} onChange={(e: any) => handleInputChange('time', e.target.value)} />
              </div>
              <FormField label="Location" id="location" value={selectedItem.location} onChange={(e: any) => handleInputChange('location', e.target.value)} />
              <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => handleInputChange('image', e.target.value)} />
            </>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
            <Button variant="ghost" onClick={handleCancelEdit} className="text-gray-400 hover:text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-primary">
              <FaSave className="mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-2 border border-[var(--border-color)] px-3 py-1 bg-black/50 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">System Admin</span>
            </div>
            <h1 className="text-4xl font-bold text-white font-mono">COMMAND_CENTER</h1>
          </div>
        </motion.div>

        {isEditing ? (
          renderForm()
        ) : (
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-1 rounded-lg mb-8 overflow-x-auto flex-nowrap justify-start">
              <TabsTrigger value="users" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Users</TabsTrigger>
              <TabsTrigger value="projects" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Projects</TabsTrigger>
              <TabsTrigger value="blogs" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Blogs</TabsTrigger>
              <TabsTrigger value="research" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Research</TabsTrigger>
              <TabsTrigger value="events" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Events</TabsTrigger>
              <TabsTrigger value="registrations" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Registrations</TabsTrigger>
              <TabsTrigger value="team-chat" className="flex-1 min-w-[100px] data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Team Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FaUsers className="text-emerald-400" /> User Management
                    </h2>
                    <p className="text-gray-400 text-sm">Manage user roles and permissions</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg">
                    <span className="text-emerald-400 font-mono font-bold">{users.length} Active Users</span>
                  </div>
                </div>

                <div className="relative overflow-x-auto rounded-lg border border-[var(--border-color)]">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-black/50 border-b border-[var(--border-color)]">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-mono">ID</th>
                        <th scope="col" className="px-6 py-3 font-mono">Username</th>
                        <th scope="col" className="px-6 py-3 font-mono">Email</th>
                        <th scope="col" className="px-6 py-3 font-mono">Role</th>
                        <th scope="col" className="px-6 py-3 font-mono">Created</th>
                        <th scope="col" className="px-6 py-3 font-mono">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="bg-[var(--card-bg)] border-b border-[var(--border-color)] hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">{user.id}</td>
                          <td className="px-6 py-4 font-bold text-white">{user.username}</td>
                          <td className="px-6 py-4 text-gray-400">{user.email}</td>
                          <td className="px-6 py-4">
                            <Select
                              defaultValue={user.role}
                              onValueChange={(value) => handleChangeUserRole(user.id, value)}
                            >
                              <SelectTrigger className="w-[140px] bg-black/30 border-[var(--border-color)] text-white h-8 text-xs">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent className="bg-[var(--card-bg)] border-[var(--border-color)] text-white">
                                <SelectItem value="ASPIRANT">Aspirant</SelectItem>
                                <SelectItem value="CORE">Core Team</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 text-xs"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FaProjectDiagram className="text-emerald-400" /> Projects
                    </h2>
                    <p className="text-gray-400 text-sm">Manage portfolio projects</p>
                  </div>
                  <Button onClick={() => handleCreate('project')} className="btn-primary">
                    <FaPlus className="mr-2" /> Add Project
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project: Project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="clean-card group overflow-hidden flex flex-col h-full"
                    >
                      {project.image && (
                        <div className="h-48 overflow-hidden relative border-b border-[var(--border-color)]">
                          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
                          <div className="absolute top-2 right-2 z-20">
                            <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-mono px-2 py-1 rounded border border-emerald-500/30">
                              {project.category}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[10px] bg-[var(--bg-body)] border border-[var(--border-color)] text-gray-500 px-1.5 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t border-[var(--border-color)] bg-black/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project, 'project')}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <FaEdit className="mr-2 h-3 w-3" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(Number(project.id), 'project')}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <FaTrash className="mr-2 h-3 w-3" /> Delete
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blogs" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FaNewspaper className="text-emerald-400" /> Blog Posts
                    </h2>
                    <p className="text-gray-400 text-sm">Manage articles and updates</p>
                  </div>
                  <Button onClick={() => handleCreate('blog')} className="btn-primary">
                    <FaPlus className="mr-2" /> Add Post
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blogs.map((blog: BlogPost) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="clean-card group overflow-hidden flex flex-col h-full"
                    >
                      {blog.image && (
                        <div className="h-48 overflow-hidden relative border-b border-[var(--border-color)]">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                            <span className="text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                              {blog.category}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white group-hover:text-emerald-400 transition-colors line-clamp-2">{blog.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-400 text-sm line-clamp-3">{blog.excerpt}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t border-[var(--border-color)] bg-black/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(blog, 'blog')}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <FaEdit className="mr-2 h-3 w-3" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(Number(blog.id), 'blog')}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <FaTrash className="mr-2 h-3 w-3" /> Delete
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FaFlask className="text-emerald-400" /> Research
                    </h2>
                    <p className="text-gray-400 text-sm">Manage publications and findings</p>
                  </div>
                  <Button onClick={() => handleCreate('research')} className="btn-primary">
                    <FaPlus className="mr-2" /> Add Research
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {research.map((item: ResearchItem) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="clean-card group overflow-hidden flex flex-col h-full"
                    >
                      {item.image && (
                        <div className="h-48 overflow-hidden relative border-b border-[var(--border-color)]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
                          <div className="absolute top-2 right-2 z-20">
                            <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-mono px-2 py-1 rounded border border-emerald-500/30">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between text-xs font-mono border-t border-[var(--border-color)] pt-3">
                          <span className="text-emerald-400">Citations: {item.citations}</span>
                          <span className="text-gray-500 truncate max-w-[150px]">{item.authors}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t border-[var(--border-color)] bg-black/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item, 'research')}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <FaEdit className="mr-2 h-3 w-3" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(Number(item.id), 'research')}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <FaTrash className="mr-2 h-3 w-3" /> Delete
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <FaCalendarAlt className="text-emerald-400" /> Events
                    </h2>
                    <p className="text-gray-400 text-sm">Manage upcoming events and workshops</p>
                  </div>
                  <Button onClick={() => handleCreate('event')} className="btn-primary">
                    <FaPlus className="mr-2" /> Add Event
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event: Event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="clean-card group overflow-hidden flex flex-col h-full"
                    >
                      {event.image && (
                        <div className="h-48 overflow-hidden relative border-b border-[var(--border-color)]">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                          />
                          <div className="absolute top-2 right-2 z-20">
                            <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-mono px-2 py-1 rounded border border-emerald-500/30">
                              {event.type}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">{event.title}</CardTitle>
                        <CardDescription className="text-emerald-500 font-mono text-xs">{event.date} • {event.time}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-400 text-sm line-clamp-3 mb-2">{event.description}</p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <span className="w-2 h-2 bg-gray-600 rounded-full"></span> {event.location}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t border-[var(--border-color)] bg-black/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event, 'event')}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <FaEdit className="mr-2 h-3 w-3" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(Number(event.id), 'event')}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <FaTrash className="mr-2 h-3 w-3" /> Delete
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="registrations" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaClipboardList className="text-emerald-400" /> Event Registrations
                  </h2>
                  <p className="text-gray-400 text-sm">Manage event registrations and view attendee lists</p>
                </div>

                <div className="grid gap-4">
                  {eventRegistrations.registrations && eventRegistrations.registrations.length > 0 ? (
                    <Card className="clean-card">
                      <CardHeader>
                        <CardTitle className="text-white">All Event Registrations ({eventRegistrations.totalRegistrations})</CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete list of all event registrations across all events
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {eventRegistrations.registrations.map((registration: any) => (
                            <div key={registration.id} className="border border-[var(--border-color)] bg-[var(--bg-body)] rounded-lg p-4 hover:border-emerald-500/30 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold text-lg text-white">
                                    {registration.event?.title || 'Unknown Event'}
                                  </h4>
                                  <p className="text-sm text-emerald-400 font-mono">
                                    📅 {registration.event?.date} at {registration.event?.time}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    📍 {registration.event?.location}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-white">
                                    {registration.user?.display_name || registration.user?.username}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {registration.user?.email}
                                  </p>
                                  <Badge variant="outline" className="mt-1 border-emerald-500/30 text-emerald-400 text-[10px]">
                                    {registration.user?.role}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)] mt-2">
                                <p className="text-xs text-gray-500 font-mono">
                                  Registered: {new Date(registration.registeredAt).toLocaleDateString()}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-8 text-xs"
                                  onClick={() => {
                                    // TODO: Add email functionality
                                    alert(`Contact: ${registration.user?.email}`);
                                  }}
                                >
                                  Contact User
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="clean-card">
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-500 mb-4">No event registrations yet</p>
                        <p className="text-sm text-gray-600">
                          Registrations will appear here when users register for events
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Individual Event Registration Counts */}
                  <Card className="clean-card">
                    <CardHeader>
                      <CardTitle className="text-white">Registration Summary by Event</CardTitle>
                      <CardDescription className="text-gray-400">
                        Quick overview of registrations per event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {events.map((event: any) => {
                          const eventRegs = eventRegistrations.registrations?.filter(
                            (reg: any) => reg.event?.id === event.id
                          ) || [];

                          return (
                            <div key={event.id} className="flex justify-between items-center p-3 border border-[var(--border-color)] rounded bg-[var(--bg-body)] hover:bg-white/5 transition-colors">
                              <div>
                                <h4 className="font-medium text-white">{event.title}</h4>
                                <p className="text-sm text-gray-500">{event.date}</p>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                <p className="font-bold text-emerald-400">{eventRegs.length} registrations</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-[var(--border-color)] text-gray-400 hover:text-white hover:bg-white/10 h-8 text-xs"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/events/${event.id}/registrations`);
                                      const data = await response.json();

                                      if (response.ok) {
                                        const userList = data.registrations
                                          .map((reg: any) => `${reg.user?.username} (${reg.user?.email})`)
                                          .join('\n');

                                        alert(`Registrations for "${event.title}":\n\n${userList || 'No registrations yet'}`);
                                      } else {
                                        alert('Failed to fetch event registrations');
                                      }
                                    } catch (error) {
                                      alert('Error fetching registrations');
                                    }
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team-chat" className="space-y-4">
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaComments className="text-emerald-400" /> Core Team Chat
                  </h2>
                  <p className="text-gray-400 text-sm">Private chat for core team members to discuss club matters</p>
                </div>

                <Card className="clean-card border-0 bg-transparent shadow-none">
                  <CardContent className="p-0 h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-[var(--bg-body)]/50 rounded-lg border border-[var(--border-color)] custom-scrollbar">
                      {(messages as any[]).map((message: any) => (
                        <div key={message.id} className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg hover:border-emerald-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-emerald-400 text-sm">{message.user?.username || `User ${message.user_id}`}</span>
                            <span className="text-[10px] font-mono text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{message.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-[var(--bg-body)] border-[var(--border-color)] text-white focus:border-emerald-500/50"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newMessage.trim()) {
                            sendMessage.mutate(newMessage);
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (newMessage.trim()) {
                            sendMessage.mutate(newMessage);
                          }
                        }}
                        className="btn-primary"
                      >
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;