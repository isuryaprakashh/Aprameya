import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EventRegistration, Project, BlogPost, ResearchItem, Event, User } from '@/lib/types'; // Unified types
import { motion } from 'framer-motion';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectModal from '@/components/ProjectModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  FaUser,
  FaShieldAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaProjectDiagram,
  FaNewspaper,
  FaFlask,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaTag,
  FaArrowRight,
  FaHome,
  FaBars,
  FaTimes,
  FaCog,

  FaTrash,
  FaPlus,
  FaSave,
  FaChartLine,
  FaUsers,
  FaFileCsv,
  FaBlog
} from 'react-icons/fa';


// Interfaces for Admin

interface EventRegistrationsData {
  registrations: EventRegistration[];
  totalRegistrations: number;
}

const FormField = ({ label, id, type = "text", value, onChange, isTextArea = false, rows = 4 }: any) => (
  <div className="mb-4">
    <label htmlFor={id} className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">{label}</label>
    {isTextArea ? (
      <Textarea
        id={id}
        value={value}
        rows={rows}
        onChange={onChange}
        className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50"
      />
    ) : (
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] focus:border-[hsl(var(--accent))]/50"
      />
    )}
  </div>
);

// Sidebar Content Component
const SidebarContent = ({ activeView, setActiveView, isMobile, closeMobile }: any) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = isAdmin ? [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'blogs', label: 'Blogs', icon: FaBlog },
    { id: 'research', label: 'Research', icon: FaFlask },
    { id: 'events', label: 'Events', icon: FaCalendarAlt },
    { id: 'registrations', label: 'Registrations', icon: FaClipboardList },
  ] : [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'events', label: 'Upcoming Events', icon: FaCalendarAlt },
    { id: 'registrations', label: 'My Registrations', icon: FaClipboardList },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'blogs', label: 'Blogs', icon: FaNewspaper },
    { id: 'research', label: 'Research', icon: FaFlask },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleNavigation = (viewId: string) => {
    setActiveView(viewId);
    if (isMobile && closeMobile) {
      closeMobile();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--card-bg)] text-[var(--text-primary)] border-r border-[var(--border-color)]">
      <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center">
            <span className="font-bold text-[var(--bg-body)]">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            {isAdmin ? 'Admin' : 'User'}<span className="text-[hsl(var(--accent))]">Profile</span>
          </h1>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={closeMobile}>
            <FaTimes />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeView === item.id
                ? 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)]'
                }`}
            >
              <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-[hsl(var(--accent))]' : 'text-[var(--text-secondary)]'}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Sidebar Layout Wrapper
const Sidebar = ({ activeView, setActiveView, isMobileOpen, setIsMobileOpen }: any) => {
  return (
    <>
      <div className="hidden md:block w-64 h-full flex-shrink-0">
        <SidebarContent activeView={activeView} setActiveView={setActiveView} />
      </div>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-80 bg-[var(--card-bg)] border-r border-[var(--border-color)]">
          <SidebarContent
            activeView={activeView}
            setActiveView={setActiveView}
            isMobile={true}
            closeMobile={() => setIsMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

const UserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user: currentUser, isLoading: authLoading } = useAuth(); // Use useAuth for current user

  const [activeView, setActiveView] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Profile Editing State
  const [profileData, setProfileData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // --- Admin State & Handlers ---
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Queries (Ensure these are available for admin views)
  const { data: users = [] } = useQuery<User[]>({ queryKey: ['/api/users'], enabled: currentUser?.role === 'ADMIN', staleTime: 5000 });
  const { data: eventRegistrations = { registrations: [], totalRegistrations: 0 } } = useQuery<EventRegistrationsData>({
    queryKey: ['/api/admin/event-registrations'],
    enabled: currentUser?.role === 'ADMIN',
    staleTime: 5000
  });

  // Admin Mutations
  const updateUserRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) => apiRequest(`/api/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/users'] }); toast({ title: 'Success', description: 'User role updated' }); },
  });

  const deleteUser = useMutation({
    mutationFn: (userId: string) => apiRequest(`/api/users/${userId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: 'Success', description: 'User deleted successfully' });
      setUserToDelete(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete user', variant: 'destructive' });
    }
  });

  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const createProject = useMutation({ mutationFn: (d: any) => apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Project created' }); } });
  const updateProject = useMutation({ mutationFn: (d: any) => apiRequest(`/api/projects/${d.id}`, { method: 'PUT', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Project updated' }); } });
  const deleteProject = useMutation({ mutationFn: (id: string) => apiRequest(`/api/projects/${id}`, { method: 'DELETE' }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); toast({ title: 'Success', description: 'Project deleted' }); } });

  const createBlog = useMutation({ mutationFn: (d: any) => apiRequest('/api/blogs', { method: 'POST', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/blogs'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Blog created' }); } });
  const updateBlog = useMutation({ mutationFn: (d: any) => apiRequest(`/api/blogs/${d.id}`, { method: 'PUT', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/blogs'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Blog updated' }); } });
  const deleteBlog = useMutation({ mutationFn: (id: string) => apiRequest(`/api/blogs/${id}`, { method: 'DELETE' }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/blogs'] }); toast({ title: 'Success', description: 'Blog deleted' }); } });

  const createResearch = useMutation({ mutationFn: (d: any) => apiRequest('/api/research', { method: 'POST', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/research'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Research created' }); } });
  const updateResearch = useMutation({ mutationFn: (d: any) => apiRequest(`/api/research/${d.id}`, { method: 'PUT', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/research'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Research updated' }); } });
  const deleteResearch = useMutation({ mutationFn: (id: string) => apiRequest(`/api/research/${id}`, { method: 'DELETE' }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/research'] }); toast({ title: 'Success', description: 'Research deleted' }); } });

  const createEvent = useMutation({ mutationFn: (d: any) => apiRequest('/api/events', { method: 'POST', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/events'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Event created' }); } });
  const updateEvent = useMutation({ mutationFn: (d: any) => apiRequest(`/api/events/${d.id}`, { method: 'PUT', body: JSON.stringify(d) }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/events'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Event updated' }); } });
  const deleteEvent = useMutation({ mutationFn: (id: string) => apiRequest(`/api/events/${id}`, { method: 'DELETE' }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/events'] }); toast({ title: 'Success', description: 'Event deleted' }); } });

  const handleEdit = (item: any, type: string) => {
    const formItem = { ...item, contentType: type };
    if (type === 'project') {
      formItem.technologies = Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies;
      formItem.team = Array.isArray(item.team) ? item.team.join(', ') : item.team;
    } else if (type === 'research') {
      formItem.authors = Array.isArray(item.authors) ? item.authors.join(', ') : item.authors;
    }
    setSelectedItem(formItem);
    setIsDialogOpen(true);
  };

  const handleCreate = (type: string) => {
    const newItem: any = { contentType: type };
    if (type === 'project') Object.assign(newItem, { title: '', description: '', category: '', technologies: '', team: '', image: '' });
    else if (type === 'blog') Object.assign(newItem, { title: '', excerpt: '', content: '', category: '', image: '' });
    else if (type === 'research') Object.assign(newItem, { title: '', description: '', category: '', authors: '', citations: 0, image: '' });
    else if (type === 'event') Object.assign(newItem, { title: '', description: '', type: '', date: '', time: '', location: '', image: '' });
    setSelectedItem(newItem); setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedItem) return;
    const { contentType, ...item } = selectedItem;

    if (contentType === 'project') {
      if (typeof item.technologies === 'string') item.technologies = item.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (typeof item.team === 'string') item.team = item.team.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else if (contentType === 'research') {
      if (typeof item.authors === 'string') item.authors = item.authors.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    if (contentType === 'project') item.id ? updateProject.mutate(item) : createProject.mutate(item);
    else if (contentType === 'blog') item.id ? updateBlog.mutate(item) : createBlog.mutate(item);
    else if (contentType === 'research') item.id ? updateResearch.mutate(item) : createResearch.mutate(item);
    else if (contentType === 'event') item.id ? updateEvent.mutate(item) : createEvent.mutate(item);
  };

  const handleDelete = (id: string, type: string) => {
    if (!window.confirm('Delete this item?')) return;
    if (type === 'project') deleteProject.mutate(id);
    else if (type === 'blog') deleteBlog.mutate(id);
    else if (type === 'research') deleteResearch.mutate(id);
    else if (type === 'event') deleteEvent.mutate(id);
  };

  const renderForm = () => {
    if (!selectedItem) return null;
    const { contentType } = selectedItem;
    const inputChange = (f: string, v: any) => setSelectedItem((p: any) => ({ ...p, [f]: v }));
    return (
      <div className="space-y-4 pt-4">
        {contentType === 'project' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <FormField label="Technologies" id="technologies" value={selectedItem.technologies} onChange={(e: any) => inputChange('technologies', e.target.value)} />
          <FormField label="Team" id="team" value={selectedItem.team} onChange={(e: any) => inputChange('team', e.target.value)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        {contentType === 'blog' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Excerpt" id="excerpt" value={selectedItem.excerpt} onChange={(e: any) => inputChange('excerpt', e.target.value)} />
          <FormField label="Content" id="content" value={selectedItem.content} onChange={(e: any) => inputChange('content', e.target.value)} isTextArea rows={8} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        {contentType === 'research' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <FormField label="Authors" id="authors" value={selectedItem.authors} onChange={(e: any) => inputChange('authors', e.target.value)} />
          <FormField label="Citations" id="citations" type="number" value={selectedItem.citations} onChange={(e: any) => inputChange('citations', parseInt(e.target.value) || 0)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        {contentType === 'event' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Type" id="type" value={selectedItem.type} onChange={(e: any) => inputChange('type', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" id="date" type="date" value={selectedItem.date} onChange={(e: any) => inputChange('date', e.target.value)} />
            <FormField label="Time" id="time" value={selectedItem.time} onChange={(e: any) => inputChange('time', e.target.value)} />
          </div>
          <FormField label="Location" id="location" value={selectedItem.location} onChange={(e: any) => inputChange('location', e.target.value)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
          <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90"><FaSave className="mr-2" /> Save Changes</Button>
        </div>
      </div>
    );
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = ["Event Name", "Event Date", "User Name", "Roll Number", "User Email", "Role", "Registered At"];
    const rows = data.map(reg => [
      reg.event?.title || "Unknown Event",
      reg.event?.date || "N/A",
      reg.user?.display_name || reg.user?.username || "Unknown User",
      reg.user?.rollNumber || "N/A",
      reg.user?.email || "No Email",
      reg.user?.role || "N/A",
      new Date(reg.registeredAt).toLocaleString()
    ]);
    const csvContent = [headers.join(","), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Queries
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    staleTime: 5000,
  });

  const { data: userEventRegistrations = [] } = useQuery<EventRegistration[]>({
    queryKey: ['/api/event-registrations/my'],
    staleTime: 5000,
    enabled: !!currentUser,
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

  // Admin Analytics Data
  const userGrowthData = useMemo(() => {
    const monthCounts: Record<string, number> = {};
    users.forEach(user => {
      const date = new Date(user.created_at || new Date());
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    return Object.entries(monthCounts).map(([name, count]) => ({ name, count })).sort((a, b) => new Date(Date.parse(a.name)).getTime() - new Date(Date.parse(b.name)).getTime());
  }, [users]);



  const contentDistributionData = useMemo(() => [
    { name: 'Projects', value: projects.length, color: '#10b981' },
    { name: 'Blogs', value: blogs.length, color: '#3b82f6' },
    { name: 'Research', value: research.length, color: '#8b5cf6' },
    { name: 'Events', value: events.length, color: '#f59e0b' },
  ], [projects, blogs, research, events]);

  // Mutations
  const updateProfile = useMutation({
    mutationFn: (userData: any) =>
      apiRequest('/api/user/profile', { method: 'PATCH', body: JSON.stringify(userData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setProfileData({
        email: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const registerForEvent = useMutation({
    mutationFn: (eventId: string) =>
      apiRequest('/api/db/event-registrations', {
        method: 'POST',
        body: JSON.stringify({ event_id: eventId })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/db/event-registrations/user'] });
      toast({
        title: 'Success',
        description: 'You have been registered for the event successfully',
      });
    },
  });

  const cancelEventRegistration = useMutation({
    mutationFn: (registrationId: string) =>
      apiRequest(`/api/db/event-registrations/${registrationId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/db/event-registrations/user'] });
      toast({
        title: 'Success',
        description: 'Event registration cancelled successfully',
      });
    },
  });

  // Handlers
  const handleRegisterForEvent = (eventId: string) => {
    registerForEvent.mutate(eventId);
  };

  const handleCancelRegistration = (registrationId: string | null) => {
    if (registrationId && window.confirm('Are you sure you want to cancel this event registration?')) {
      cancelEventRegistration.mutate(registrationId);
    }
  };

  const isRegisteredForEvent = (eventId: string) => {
    return userEventRegistrations.some((reg) => reg.event_id === eventId);
  };

  const getRegistrationId = (eventId: string) => {
    const registration = userEventRegistrations.find((reg) => reg.event_id === eventId);
    return registration ? registration.id : null;
  };

  const handleUpdateProfile = () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const updateData: any = {};

    if (profileData.email && profileData.email !== currentUser?.email) {
      updateData.email = profileData.email;
    }

    if (profileData.newPassword) {
      updateData.password = profileData.newPassword;
    }

    if (Object.keys(updateData).length > 0) {
      updateProfile.mutate(updateData);
    } else {
      toast({
        title: 'Info',
        description: 'No changes to update',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'CORE':
      case 'CORE_TEAM': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50';
    }
  };

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center text-[var(--text-primary)]">Loading profile...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
        <div className="glass-panel p-8 rounded-xl text-center">
          <p className="text-[var(--text-primary)]">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  const renderUserOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="w-20 h-20 border-2 border-[hsl(var(--accent))]">
            <AvatarFallback className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] text-2xl font-bold">
              {getInitials(currentUser.username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{currentUser.username}</h2>
              <Badge variant="outline" className={`${getRoleBadgeColor(currentUser.role)} px-3 py-1 text-xs`}>
                {currentUser.role} ACCESS
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center text-[var(--text-secondary)]">
                <FaUser className="mr-2 opacity-70" /> {currentUser.rollNumber || "No Roll Number"}
              </div>
              <div className="flex items-center text-[var(--text-secondary)]">
                <FaTag className="mr-2 opacity-70" /> {currentUser.email}
              </div>
              <div className="flex items-center text-[var(--text-secondary)]">
                <FaClock className="mr-2 opacity-70" /> Member since {new Date(currentUser.created_at || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-[hsl(var(--accent))]" />
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Access Level</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Content Management Card - Admin/Core Only */}
          {(currentUser.role === 'ADMIN' || currentUser.role === 'CORE') && (
            <div className="group relative overflow-hidden p-0 rounded-xl border border-blue-500/20 bg-[#0f172a]">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-300" />
              <div className="relative p-5">
                <h4 className="text-blue-400 font-bold mb-1">Content Management</h4>
                <p className="text-xs text-blue-300/60">Can create and edit content</p>
              </div>
            </div>
          )}

          {/* Event Registration Card - Everyone */}
          <div className="group relative overflow-hidden p-0 rounded-xl border border-emerald-500/20 bg-[#0f172a]">
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-300" />
            <div className="relative p-5">
              <h4 className="text-emerald-400 font-bold mb-1">Event Registration</h4>
              <p className="text-xs text-emerald-300/60">Can register for events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center">
              <FaClipboardList className="mr-2 text-amber-500" /> My Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--text-primary)]">{userEventRegistrations.length}</div>
            <p className="text-xs text-[var(--text-secondary)]">Active Event Signups</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center">
              <FaCalendarAlt className="mr-2 text-emerald-500" /> Days Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--text-primary)]">
              {Math.floor((Date.now() - new Date(currentUser.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Days since registration</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        if (currentUser.role === 'ADMIN') {
          return (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: users.length, icon: FaUsers, color: "text-blue-500" },
                  { label: "Total Projects", value: projects.length, icon: FaProjectDiagram, color: "text-emerald-500" },
                  { label: "Research Items", value: research.length, icon: FaFlask, color: "text-violet-500" },
                  { label: "Registrations", value: eventRegistrations.totalRegistrations, icon: FaClipboardList, color: "text-amber-500" },
                ].map((stat, i) => (
                  <Card key={i} className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--text-primary)] flex items-center gap-2"><FaChartLine className="text-[hsl(var(--accent))]" /> User Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userGrowthData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} itemStyle={{ color: 'hsl(var(--accent))' }} />
                        <Area type="monotone" dataKey="count" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                  <CardHeader>
                    <CardTitle className="text-[var(--text-primary)]">Content Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={contentDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {contentDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        } else {
          return (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 mb-8 border border-[var(--border-color)] rounded-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--accent))]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                  <Avatar className="h-24 w-24 border-2 border-[hsl(var(--accent))]/30">
                    <AvatarImage src="" alt={currentUser.username} />
                    <AvatarFallback className="bg-[var(--card-bg)] text-2xl font-mono text-[hsl(var(--accent))]">
                      {getInitials(currentUser.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                          {currentUser.username}
                        </h2>
                        <p className="text-[var(--text-secondary)] text-sm">{currentUser.email}</p>
                      </div>
                      <Badge className={`mt-2 md:mt-0 border ${getRoleBadgeColor(currentUser.role)}`}>
                        {currentUser.role}
                      </Badge>
                    </div>

                    {currentUser.rollNumber && (
                      <p className="text-[var(--text-secondary)] text-xs font-mono mb-3 inline-flex items-center gap-1 bg-[hsl(var(--accent))]/5 px-2 py-1 rounded">
                        <span className="text-[hsl(var(--accent))]">Roll No.</span>
                        {currentUser.rollNumber}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-sm">
                        <span className="text-[var(--text-secondary)] block text-xs uppercase mb-1">Joined</span>
                        <span className="text-[var(--text-primary)] font-mono">{new Date(currentUser.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-[var(--text-secondary)] block text-xs uppercase mb-1">Events</span>
                        <span className="text-[var(--text-primary)] font-mono">{userEventRegistrations.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 w-full mb-8">
                <div
                  className="bg-[var(--card-bg)]/40 border border-[var(--border-color)] p-4 rounded-lg flex items-center gap-4 group hover:border-[hsl(var(--accent))]/30 transition-colors cursor-pointer"
                  onClick={() => setActiveView('registrations')}
                >
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
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">Account Status</p>
                    <p className="text-lg font-bold text-[var(--text-primary)] capitalize">Active</p>
                  </div>
                </div>
              </div>
            </>
          );
        }

        return renderUserOverview();

      case 'users':
        if (currentUser.role !== 'ADMIN') return null;
        return (
          <Card className="bg-[var(--card-bg)] border-[var(--border-color)] animate-in fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </div>
              <Badge variant="outline" className="border-[hsl(var(--accent))] text-[hsl(var(--accent))]">{users.length} Users</Badge>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto rounded-md border border-[var(--border-color)]">
                <Table>
                  <TableHeader className="bg-[var(--bg-body)]">
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--text-primary)]/5">
                        <TableCell className="font-bold text-[var(--text-primary)]">{user.username}</TableCell>
                        <TableCell>{user.rollNumber || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select defaultValue={user.role} onValueChange={(r) => updateUserRole.mutate({ userId: user.id, role: r })}>
                            <SelectTrigger className="w-[120px] h-8 text-xs bg-[var(--bg-body)] border-[var(--border-color)]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ASPIRANT">Aspirant</SelectItem>
                              <SelectItem value="CORE">Core</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]">
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                <DialogHeader>
                                  <DialogTitle>User Details: {user.username}</DialogTitle>
                                  <DialogDescription>
                                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Roll No.</label>
                                      <p className="text-[var(--text-primary)] font-bold">{user.rollNumber || "N/A"}</p>
                                    </div>
                                    <div>
                                      <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Role</label>
                                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                                    </div>
                                    <div>
                                      <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Registered</label>
                                      <p className="text-[var(--text-primary)]">{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                      <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Days as Member</label>
                                      <p className="text-[var(--text-primary)]">
                                        {user.created_at ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 3600 * 24)) : 0} Days
                                      </p>
                                    </div>
                                  </div>
                                  <div className="p-3 bg-[var(--bg-body)] rounded-md border border-[var(--border-color)]">
                                    <label className="text-xs font-mono text-[var(--text-secondary)] uppercase block mb-1">Password (Hash)</label>
                                    <code className="text-xs text-[hsl(var(--accent))] break-all">
                                      {user.password || "N/A"}
                                    </code>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => {
                                console.log("Deleting user:", user);
                                setUserToDelete(user);
                              }}
                            >
                              <FaTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--text-primary)]">Delete User?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[var(--text-secondary)]">
                      Are you sure you want to delete <strong>{userToDelete?.username}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => userToDelete && deleteUser.mutate(userToDelete.id)}
                    >
                      Delete User
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                  <FaUser className="text-2xl text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">Profile Settings</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Update your personal information</p>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label htmlFor="email" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">Email Address</label>
                  <Input
                    id="email"
                    value={profileData.email || currentUser.email} // Fallback to current email if empty state
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="newPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">New Password</label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">Confirm Password</label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleUpdateProfile} className="btn-primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                <FaShieldAlt className="mr-2 text-[hsl(var(--accent))]" /> Access Level
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {currentUser.role === 'ADMIN' && (
                  <div className="clean-card p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
                    <div className="font-bold text-purple-400 mb-1">Full Admin Access</div>
                    <div className="text-xs text-gray-400">Can manage all content and users</div>
                  </div>
                )}
                {(currentUser.role === 'ADMIN' || currentUser.role === 'CORE') && (
                  <div className="clean-card p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                    <div className="font-bold text-blue-400 mb-1">Content Management</div>
                    <div className="text-xs text-gray-400">Can create and edit content</div>
                  </div>
                )}
                <div className="clean-card p-4 rounded-lg border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5">
                  <div className="font-bold text-[hsl(var(--accent))] mb-1">Event Registration</div>
                  <div className="text-xs text-[var(--text-secondary)]">Can register for events</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
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
          </div>
        );

      case 'registrations':
        if (currentUser.role === 'ADMIN') {
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Event Registrations</h2>
                <Button onClick={() => downloadCSV(eventRegistrations.registrations, 'registrations.csv')} variant="outline" className="text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10">
                  <FaFileCsv className="mr-2" /> Export CSV
                </Button>
              </div>
              <div className="glass-panel rounded-xl overflow-hidden border border-[var(--border-color)]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-[var(--border-color)] hover:bg-transparent">
                      <TableHead className="text-[hsl(var(--accent))]">Event</TableHead>
                      <TableHead className="text-[hsl(var(--accent))]">User</TableHead>
                      <TableHead className="text-[hsl(var(--accent))]">Roll No.</TableHead>
                      <TableHead className="text-[hsl(var(--accent))]">Email</TableHead>
                      <TableHead className="text-[hsl(var(--accent))]">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventRegistrations.registrations?.map((reg: any) => (
                      <TableRow key={reg.id} className="border-b-[var(--border-color)] hover:bg-[var(--card-bg)]/50">
                        <TableCell className="font-medium text-[var(--text-primary)]">{reg.event?.title}</TableCell>
                        <TableCell className="text-[var(--text-secondary)]">{reg.user?.display_name || reg.user?.username}</TableCell>
                        <TableCell className="text-[var(--text-secondary)]">{reg.user?.rollNumber || "N/A"}</TableCell>
                        <TableCell className="text-[var(--text-secondary)]">{reg.user?.email}</TableCell>
                        <TableCell className="text-[var(--text-secondary)]">{new Date(reg.registeredAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6">
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
                    onClick={() => setActiveView('events')}
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
          </div>
        );

      case 'projects':
        // Admin View
        if (currentUser.role === 'ADMIN') {
          return (
            <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h2>
                <Button onClick={() => handleCreate('project')} className="btn-primary"><FaPlus className="mr-2" /> New Project</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      {project.image ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--bg-body)]">
                          <FaProjectDiagram className="text-5xl text-[var(--text-secondary)]/20" />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-[var(--bg-body)] text-[var(--text-primary)] border shadow-sm">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{project.description}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(project, 'project')} className="flex-1 h-8 text-xs" variant="outline">Edit</Button>
                        <Button onClick={() => handleDelete(project.id, 'project')} className="h-8 w-8 p-0" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        // User View
        return (
          <div className="space-y-6">
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

              {projects.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]/20">
                  <FaProjectDiagram className="mx-auto text-4xl text-[var(--text-secondary)] mb-4" />
                  <p className="text-[var(--text-secondary)] text-lg">No projects found.</p>
                </div>
              ) : (
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
                          {Array.isArray(project.technologies) && project.technologies.map((tech: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 rounded bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] text-xs font-mono">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 relative z-10">
                        <Button
                          variant="ghost"
                          onClick={() => handleViewDetails(project)}
                          className="w-full text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:bg-[hsl(var(--accent))]/10 group-hover:translate-x-1 transition-all"
                        >
                          View Details <FaArrowRight className="ml-2" />
                        </Button>
                      </CardFooter>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <ProjectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              project={selectedProject}
            />
          </div>
        );


      case 'blogs':
        // Admin View
        if (currentUser.role === 'ADMIN') {
          return (
            <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Blogs</h2>
                <Button onClick={() => handleCreate('blog')} className="btn-primary"><FaPlus className="mr-2" /> New Blog</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                  <div key={blog.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      {blog.image ? (
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--bg-body)]">
                          <FaBlog className="text-5xl text-[var(--text-secondary)]/20" />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-[var(--bg-body)] text-[var(--text-primary)] border shadow-sm">
                        {blog.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-1">{blog.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{blog.excerpt}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(blog, 'blog')} className="flex-1 h-8 text-xs" variant="outline">Edit</Button>
                        <Button onClick={() => handleDelete(blog.id, 'blog')} className="h-8 w-8 p-0" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        // User View
        return (
          <div className="space-y-6">
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
          </div>
        );

      case 'research':
        // Admin View
        if (currentUser.role === 'ADMIN') {
          return (
            <div className="animate-in fade-in space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Research</h2>
                <Button onClick={() => handleCreate('research')} className="btn-primary"><FaPlus className="mr-2" /> New Research</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {research.map(item => (
                  <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--bg-body)]">
                          <FaFlask className="text-5xl text-[var(--text-secondary)]/20" />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-[var(--bg-body)] text-[var(--text-primary)] border shadow-sm">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(item, 'research')} className="flex-1 h-8 text-xs" variant="outline">Edit</Button>
                        <Button onClick={() => handleDelete(item.id, 'research')} className="h-8 w-8 p-0" variant="destructive"><FaTrash className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        // User View
        return (
          <div className="space-y-6">
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans selection:bg-[hsl(var(--accent))]/30 overflow-hidden pt-24">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--card-bg)]/50 backdrop-blur-md">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
            <FaBars />
          </Button>
          <span className="font-bold text-lg">User Profile</span>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
            <DialogHeader>
              <DialogTitle>{selectedItem?.id ? 'Edit' : 'Create'} {selectedItem?.contentType?.charAt(0).toUpperCase() + selectedItem?.contentType?.slice(1)}</DialogTitle>
              <DialogDescription>
                Make changes to the item here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {renderForm()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
