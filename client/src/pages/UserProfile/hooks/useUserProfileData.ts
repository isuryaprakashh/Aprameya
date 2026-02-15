
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { EventRegistration, Project, BlogPost, ResearchItem, Event, User } from '@/lib/types';
import { useAuth } from "@/context/AuthContext";

interface EventRegistrationsData {
    registrations: EventRegistration[];
    totalRegistrations: number;
}

export const useUserProfileData = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    // -- STATE --
    const [activeView, setActiveView] = useState('overview');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Profile Edit State
    const [profileData, setProfileData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
    });

    // -- QUERIES --
    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['/api/users'],
        enabled: currentUser?.role === 'ADMIN',
        staleTime: 5000
    });

    const { data: eventRegistrations = { registrations: [], totalRegistrations: 0 } } = useQuery<EventRegistrationsData>({
        queryKey: ['/api/admin/event-registrations'],
        enabled: currentUser?.role === 'ADMIN',
        staleTime: 5000
    });

    const { data: events = [] } = useQuery<Event[]>({ queryKey: ['/api/events'], staleTime: 5000 });
    const { data: userEventRegistrations = [] } = useQuery<EventRegistration[]>({
        queryKey: ['/api/event-registrations/my'],
        staleTime: 5000,
        enabled: !!currentUser,
    });

    const { data: tickets = [] } = useQuery<any[]>({
        queryKey: ['/api/tickets/my'],
        staleTime: 5000,
        enabled: !!currentUser,
    });

    const { data: projects = [] } = useQuery<Project[]>({ queryKey: ['/api/projects'], staleTime: 5000 });
    const { data: blogs = [] } = useQuery<BlogPost[]>({ queryKey: ['/api/blogs'], staleTime: 5000 });
    const { data: research = [] } = useQuery<ResearchItem[]>({ queryKey: ['/api/research'], staleTime: 5000 });

    // -- MUTATIONS --
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

    const updateProfile = useMutation({
        mutationFn: (userData: any) => apiRequest('/api/user/profile', { method: 'PATCH', body: JSON.stringify(userData) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/me'] });
            toast({ title: 'Success', description: 'Profile updated successfully' });
            setProfileData({ email: '', newPassword: '', confirmPassword: '' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update profile', variant: 'destructive' });
        },
    });

    const registerForEvent = useMutation({
        mutationFn: (eventId: string) => apiRequest('/api/event-registrations', { method: 'POST', body: JSON.stringify({ event_id: eventId }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({ title: 'Success', description: 'You have been registered for the event successfully' });
        },
    });

    const cancelEventRegistration = useMutation({
        mutationFn: (registrationId: string) => apiRequest(`/api/event-registrations/${registrationId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({ title: 'Success', description: 'Event registration cancelled successfully' });
        },
    });

    // -- HANDLERS --
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
        else if (contentType === 'event') {
            // Convert capacity to number if it exists
            if (item.capacity) {
                item.capacity = parseInt(String(item.capacity), 10);
                if (isNaN(item.capacity)) item.capacity = null;
            } else {
                item.capacity = null;
            }
            item.id ? updateEvent.mutate(item) : createEvent.mutate(item);
        }
    };

    const handleDelete = (id: string, type: string) => {
        if (!window.confirm('Delete this item?')) return;
        if (type === 'project') deleteProject.mutate(id);
        else if (type === 'blog') deleteBlog.mutate(id);
        else if (type === 'research') deleteResearch.mutate(id);
        else if (type === 'event') deleteEvent.mutate(id);
    };

    // -- COMPUTED --
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

    return {
        activeView, setActiveView,
        isMobileOpen, setIsMobileOpen,
        selectedItem, setSelectedItem,
        isDialogOpen, setIsDialogOpen,
        userToDelete, setUserToDelete,
        profileData, setProfileData,
        users, eventRegistrations, events, userEventRegistrations, tickets, projects, blogs, research,
        userGrowthData, contentDistributionData,
        updateUserRole, deleteUser,
        createProject, updateProject, deleteProject,
        createBlog, updateBlog, deleteBlog,
        createResearch, updateResearch, deleteResearch,
        createEvent, updateEvent, deleteEvent,
        updateProfile, registerForEvent, cancelEventRegistration,
        handleSave, handleDelete
    };
};
