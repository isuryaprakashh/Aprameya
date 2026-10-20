
import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { EventRegistration, Project, BlogPost, ResearchItem, Event, User, TeamMember } from '@/lib/types';
import { projects as fallbackProjects, events as fallbackEvents } from '@/lib/data';
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
    const getInitialView = () => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path === '/profile' || path.startsWith('/profile/')) return 'settings';
            if (path.startsWith('/dashboard/users')) return 'users';
            if (path.startsWith('/dashboard/projects')) return 'projects';
            if (path.startsWith('/dashboard/events')) return 'events';
            if (path.startsWith('/dashboard/teams')) return 'teams';
            if (path.startsWith('/dashboard/blogs')) return 'blogs';
            if (path.startsWith('/dashboard/recruitment')) return 'recruitment';
            if (path.startsWith('/dashboard/scan')) return 'scan';
            if (path.startsWith('/dashboard/settings')) return 'settings';
            if (path.startsWith('/dashboard')) return 'overview';
        }
        return 'overview';
    };

    const [activeView, setActiveView] = useState(getInitialView);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Profile Edit State
    const [profileData, setProfileData] = useState({
        username: currentUser?.username || '',
        display_name: currentUser?.display_name || '',
        profile_image: currentUser?.profile_image || '',
        bio: currentUser?.bio || '',
        department: currentUser?.department || '',
        year: currentUser?.year || '',
        email: currentUser?.email || '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (currentUser) {
            setProfileData(prev => ({
                ...prev,
                username: currentUser.username || '',
                display_name: currentUser.display_name || '',
                profile_image: currentUser.profile_image || '',
                bio: currentUser.bio || '',
                department: currentUser.department || '',
                year: currentUser.year || '',
                email: currentUser.email || '',
            }));
        }
    }, [currentUser]);

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

    const { data: events = [] } = useQuery<Event[]>({ queryKey: ['/api/events'], initialData: fallbackEvents as Event[], staleTime: 60000 });
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

    const { data: projects = [] } = useQuery<Project[]>({ queryKey: ['/api/projects'], initialData: fallbackProjects, staleTime: 60000 });
    const { data: blogs = [] } = useQuery<BlogPost[]>({ queryKey: ['/api/blogs'], staleTime: 5000 });
    const { data: research = [] } = useQuery<ResearchItem[]>({ queryKey: ['/api/research'], staleTime: 5000 });
    const { data: teamMembers = [] } = useQuery<TeamMember[]>({ queryKey: ['/api/teams'], staleTime: 30000 });

    // -- MUTATIONS --
    const updateUserRole = useMutation({
        mutationFn: ({ userId, role }: { userId: string, role: string }) => apiRequest(`/api/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/users'] }); toast({ title: 'Success', description: 'User role updated' }); },
        onError: (error: any) => { toast({ title: 'Error', description: error.message || 'Failed to update role', variant: 'destructive' }); }
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

    const handleAuthError = (err: any, fallbackMsg: string) => {
        const msg = err.message || '';
        if (msg.toLowerCase().includes('not authenticated') || msg.includes('401')) {
            toast({
                title: 'Session Expired',
                description: 'Your login session is not active or has expired. Redirecting to login...',
                variant: 'destructive',
            });
            setTimeout(() => {
                window.location.href = '/login?redirect=/dashboard';
            }, 1200);
        } else if (msg.toLowerCase().includes('not authorized') || msg.includes('403')) {
            toast({
                title: 'Access Denied',
                description: 'You do not have the required permissions for this action.',
                variant: 'destructive',
            });
        } else {
            toast({ title: 'Error', description: msg || fallbackMsg, variant: 'destructive' });
        }
    };

    const createProject = useMutation({
        mutationFn: (d: any) => apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Project created' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to create project')
    });
    const updateProject = useMutation({
        mutationFn: (d: any) => apiRequest(`/api/projects/${d.id || d._id}`, { method: 'PUT', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Project updated' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to update project')
    });
    const deleteProject = useMutation({
        mutationFn: (id: string) => apiRequest(`/api/projects/${id}`, { method: 'DELETE' }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); toast({ title: 'Success', description: 'Project deleted' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to delete project')
    });

    const createBlog = useMutation({
        mutationFn: (d: any) => apiRequest('/api/blogs', { method: 'POST', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/blogs'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Blog created' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to create blog')
    });
    const updateBlog = useMutation({
        mutationFn: (d: any) => apiRequest(`/api/blogs/${d.id || d._id}`, { method: 'PUT', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/blogs'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Blog updated' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to update blog')
    });
    const deleteBlog = useMutation({
        mutationFn: (id: string) => apiRequest(`/api/blogs/${id}`, { method: 'DELETE' }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/blogs'] }); toast({ title: 'Success', description: 'Blog deleted' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to delete blog')
    });

    const createResearch = useMutation({
        mutationFn: (d: any) => apiRequest('/api/research', { method: 'POST', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/research'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Research created' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to create research')
    });
    const updateResearch = useMutation({
        mutationFn: (d: any) => apiRequest(`/api/research/${d.id || d._id}`, { method: 'PUT', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/research'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Research updated' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to update research')
    });
    const deleteResearch = useMutation({
        mutationFn: (id: string) => apiRequest(`/api/research/${id}`, { method: 'DELETE' }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/research'] }); toast({ title: 'Success', description: 'Research deleted' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to delete research')
    });

    const createEvent = useMutation({
        mutationFn: (d: any) => apiRequest('/api/events', { method: 'POST', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/events'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Event created successfully' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to create event')
    });
    const updateEvent = useMutation({
        mutationFn: (d: any) => apiRequest(`/api/events/${d.id || d._id}`, { method: 'PUT', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/events'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Event updated successfully' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to update event')
    });
    const deleteEvent = useMutation({
        mutationFn: (id: string) => apiRequest(`/api/events/${id}`, { method: 'DELETE' }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/events'] }); toast({ title: 'Success', description: 'Event deleted' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to delete event')
    });

    const createTeamMember = useMutation({
        mutationFn: (d: any) => apiRequest('/api/teams', { method: 'POST', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/teams'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Team member added successfully' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to add team member')
    });
    const updateTeamMember = useMutation({
        mutationFn: (d: any) => apiRequest(`/api/teams/${d.id || d._id}`, { method: 'PUT', body: JSON.stringify(d) }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/teams'] }); setIsDialogOpen(false); toast({ title: 'Success', description: 'Team member updated successfully' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to update team member')
    });
    const deleteTeamMember = useMutation({
        mutationFn: (id: string) => apiRequest(`/api/teams/${id}`, { method: 'DELETE' }),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/teams'] }); toast({ title: 'Success', description: 'Team member deleted' }); },
        onError: (error: any) => handleAuthError(error, 'Failed to delete team member')
    });

    const updateProfile = useMutation({
        mutationFn: (userData: any) => apiRequest('/api/users/profile', { method: 'PATCH', body: JSON.stringify(userData) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/me'] });
            toast({ title: 'Success', description: 'Profile updated successfully' });
            setProfileData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update profile', variant: 'destructive' });
        },
    });

    const updateUser = useMutation({
        mutationFn: ({ userId, ...data }: { userId: string } & any) =>
            apiRequest(`/api/users/${userId}`, { method: 'PATCH', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            toast({ title: 'Success', description: 'User details updated successfully' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to update user', variant: 'destructive' });
        }
    });

    const registerForEvent = useMutation({
        mutationFn: (eventId: string) => apiRequest('/api/event-registrations', { method: 'POST', body: JSON.stringify({ event_id: eventId }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({ title: 'Success', description: 'You have been registered for the event successfully' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to register for event', variant: 'destructive' });
        }
    });

    const cancelEventRegistration = useMutation({
        mutationFn: (registrationId: string) => apiRequest(`/api/event-registrations/${registrationId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({ title: 'Success', description: 'Event registration cancelled successfully' });
        },
        onError: (error: any) => {
            toast({ title: 'Error', description: error.message || 'Failed to cancel registration', variant: 'destructive' });
        }
    });

    const isSaving = createProject.isPending || updateProject.isPending ||
        createBlog.isPending || updateBlog.isPending ||
        createResearch.isPending || updateResearch.isPending ||
        createEvent.isPending || updateEvent.isPending ||
        createTeamMember.isPending || updateTeamMember.isPending;

    // -- HANDLERS --
    const handleSave = () => {
        if (!selectedItem) return;
        const { contentType, ...item } = selectedItem;

        if (contentType === 'project') {
            if (!item.title?.trim()) { toast({ title: 'Validation Error', description: 'Project title is required', variant: 'destructive' }); return; }
            if (!item.category?.trim()) { toast({ title: 'Validation Error', description: 'Project category is required', variant: 'destructive' }); return; }
            if (!item.description?.trim()) { toast({ title: 'Validation Error', description: 'Project description is required', variant: 'destructive' }); return; }
            if (!item.image?.trim()) { toast({ title: 'Validation Error', description: 'Project image is required', variant: 'destructive' }); return; }

            if (typeof item.technologies === 'string') item.technologies = item.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
            if (typeof item.team === 'string') item.team = item.team.split(',').map((t: string) => t.trim()).filter(Boolean);
            item.id ? updateProject.mutate(item) : createProject.mutate(item);
        } else if (contentType === 'blog') {
            if (!item.title?.trim()) { toast({ title: 'Validation Error', description: 'Blog title is required', variant: 'destructive' }); return; }
            if (!item.excerpt?.trim()) { toast({ title: 'Validation Error', description: 'Blog excerpt is required', variant: 'destructive' }); return; }
            if (!item.content?.trim()) { toast({ title: 'Validation Error', description: 'Blog content is required', variant: 'destructive' }); return; }
            if (!item.category?.trim()) { toast({ title: 'Validation Error', description: 'Blog category is required', variant: 'destructive' }); return; }
            if (!item.image?.trim()) { toast({ title: 'Validation Error', description: 'Blog image is required', variant: 'destructive' }); return; }

            item.id ? updateBlog.mutate(item) : createBlog.mutate(item);
        } else if (contentType === 'research') {
            if (!item.title?.trim()) { toast({ title: 'Validation Error', description: 'Research title is required', variant: 'destructive' }); return; }
            if (!item.category?.trim()) { toast({ title: 'Validation Error', description: 'Research category is required', variant: 'destructive' }); return; }
            if (!item.description?.trim()) { toast({ title: 'Validation Error', description: 'Research description is required', variant: 'destructive' }); return; }
            if (!item.image?.trim()) { toast({ title: 'Validation Error', description: 'Research image is required', variant: 'destructive' }); return; }

            if (typeof item.authors === 'string') item.authors = item.authors.split(',').map((t: string) => t.trim()).filter(Boolean);
            item.id ? updateResearch.mutate(item) : createResearch.mutate(item);
        } else if (contentType === 'event') {
            if (!item.title?.trim()) { toast({ title: 'Validation Error', description: 'Event title is required', variant: 'destructive' }); return; }
            if (!item.type?.trim()) { toast({ title: 'Validation Error', description: 'Event type is required', variant: 'destructive' }); return; }
            if (!item.description?.trim()) { toast({ title: 'Validation Error', description: 'Event description is required', variant: 'destructive' }); return; }
            if (!item.date?.trim()) { toast({ title: 'Validation Error', description: 'Event date is required', variant: 'destructive' }); return; }
            if (!item.time?.trim()) { toast({ title: 'Validation Error', description: 'Event time is required', variant: 'destructive' }); return; }
            if (!item.location?.trim()) { toast({ title: 'Validation Error', description: 'Event location is required', variant: 'destructive' }); return; }
            if (!item.image?.trim()) { toast({ title: 'Validation Error', description: 'Event image URL is required', variant: 'destructive' }); return; }

            // Convert capacity to number if it exists
            if (item.capacity !== undefined && item.capacity !== null && item.capacity !== '') {
                const parsed = parseInt(String(item.capacity), 10);
                item.capacity = isNaN(parsed) ? null : parsed;
            } else {
                item.capacity = null;
            }

            item.ticketEnabled = !!item.ticketEnabled;

            item.id ? updateEvent.mutate(item) : createEvent.mutate(item);
        } else if (contentType === 'team') {
            if (!item.name?.trim()) { toast({ title: 'Validation Error', description: 'Team member name is required', variant: 'destructive' }); return; }
            if (!item.role?.trim()) { toast({ title: 'Validation Error', description: 'Team member role is required', variant: 'destructive' }); return; }

            if (item.order !== undefined && item.order !== null && item.order !== '') {
                const parsed = parseInt(String(item.order), 10);
                item.order = isNaN(parsed) ? 0 : parsed;
            } else {
                item.order = 0;
            }

            item.id ? updateTeamMember.mutate(item) : createTeamMember.mutate(item);
        }
    };

    const handleDelete = (id: string, type: string) => {
        if (!window.confirm('Delete this item?')) return;
        if (type === 'project') deleteProject.mutate(id);
        else if (type === 'blog') deleteBlog.mutate(id);
        else if (type === 'research') deleteResearch.mutate(id);
        else if (type === 'event') deleteEvent.mutate(id);
        else if (type === 'team') deleteTeamMember.mutate(id);
    };

    const userGrowthData = useMemo(() => {
        const monthlyMap = new Map<string, { name: string; count: number; sortKey: number }>();

        users.forEach(user => {
            const date = new Date(user.created_at || new Date());
            const year = isNaN(date.getFullYear()) ? 2026 : date.getFullYear();
            const month = isNaN(date.getMonth()) ? 0 : date.getMonth();
            const sortKey = year * 100 + month;
            const name = date.toLocaleString('default', { month: 'short' }) + " '" + String(year).slice(-2);

            const existing = monthlyMap.get(name);
            if (existing) {
                existing.count += 1;
            } else {
                monthlyMap.set(name, { name, count: 1, sortKey });
            }
        });

        const sorted = Array.from(monthlyMap.values()).sort((a, b) => a.sortKey - b.sortKey);

        if (sorted.length === 0) {
            const now = new Date();
            const fallback = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                fallback.push({
                    name: d.toLocaleString('default', { month: 'short' }) + " '" + String(d.getFullYear()).slice(-2),
                    count: 0
                });
            }
            return fallback;
        }

        return sorted.map(({ name, count }) => ({ name, count }));
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
        users, eventRegistrations, events, userEventRegistrations, tickets, projects, blogs, research, teamMembers,
        userGrowthData, contentDistributionData,
        isSaving,
        updateUserRole, deleteUser, updateUser,
        createProject, updateProject, deleteProject,
        createBlog, updateBlog, deleteBlog,
        createResearch, updateResearch, deleteResearch,
        createEvent, updateEvent, deleteEvent,
        createTeamMember, updateTeamMember, deleteTeamMember,
        updateProfile, registerForEvent, cancelEventRegistration,
        handleSave, handleDelete
    };
};
