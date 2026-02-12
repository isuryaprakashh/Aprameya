import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Event, EventRegistration } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

interface EventsViewProps {
    handleEdit?: (item: Event, type: string) => void;
    handleCreate?: (type: string) => void;
    handleDelete?: (id: string, type: string) => void;
}

export default function EventsView({ handleEdit, handleCreate, handleDelete }: EventsViewProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    // ... existing hooks

    const { data: events = [] } = useQuery<Event[]>({
        queryKey: ['/api/events'],
        staleTime: 5000,
    });

    const { data: userEventRegistrations = [] } = useQuery<EventRegistration[]>({
        queryKey: ['/api/event-registrations/my'],
        staleTime: 5000,
        enabled: !!currentUser,
    });

    const registerForEvent = useMutation({
        mutationFn: (eventId: string) =>
            apiRequest('/api/event-registrations', {
                method: 'POST',
                body: JSON.stringify({ event_id: eventId })
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({
                title: 'Success',
                description: 'You have been registered for the event successfully',
            });
        },
    });

    const cancelEventRegistration = useMutation({
        mutationFn: (registrationId: string) =>
            apiRequest(`/api/event-registrations/${registrationId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({
                title: 'Success',
                description: 'Event registration cancelled successfully',
            });
        },
    });

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

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                            <FaCalendarAlt className="text-2xl text-[hsl(var(--accent))]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Upcoming Events</h2>
                            <p className="text-[var(--text-secondary)] text-sm">Discover and register for upcoming workshops and seminars</p>
                        </div>
                    </div>
                    {currentUser?.role === 'ADMIN' && (
                        <Button
                            onClick={() => handleCreate && handleCreate('event')}
                            className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] w-full md:w-auto"
                        >
                            <FaPlus className="mr-2" /> New Event
                        </Button>
                    )}
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
                                    {currentUser?.role === 'ADMIN' ? (
                                        <div className="flex gap-2 w-full justify-end">
                                            <Button
                                                onClick={() => handleEdit && handleEdit(event, 'event')}
                                                variant="outline"
                                                size="sm"
                                                className="border-[var(--border-color)] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
                                            >
                                                <FaEdit className="mr-2" /> Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete && handleDelete(event.id, 'event')}
                                                variant="destructive"
                                                size="sm"
                                                className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                                            >
                                                <FaTrash className="mr-2" /> Delete
                                            </Button>
                                        </div>
                                    ) : (
                                        isRegistered ? (
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
                                        )
                                    )}
                                </CardFooter>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
