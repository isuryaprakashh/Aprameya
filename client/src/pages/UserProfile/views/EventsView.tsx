import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Event, EventRegistration } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Ring } from '@/components/ui/ring';

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

    const { data: events = [], isLoading } = useQuery<Event[]>({
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
                        <div className="p-3 rounded-xl bg-signal-soft border border-signal-line">
                            <FaCalendarAlt className="text-xl text-signal-text" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-medium text-paper tracking-tight">Upcoming Events</h2>
                            <p className="text-text-2 text-xs font-mono">Discover and register for upcoming workshops and seminars</p>
                        </div>
                    </div>
                    {currentUser?.role === 'ADMIN' && (
                        <Button
                            onClick={() => handleCreate && handleCreate('event')}
                            className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white text-xs h-9 px-4 rounded-[var(--r-md)] font-medium gap-1.5 w-full md:w-auto shrink-0 shadow-sm"
                        >
                            <FaPlus className="w-3 h-3 mr-1" /> New Event
                        </Button>
                    )}
                </div>

                {isLoading && events.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-2">
                        <Ring size={20} />
                        <span className="text-xs text-mute font-sans">Loading events...</span>
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center text-text-2 font-mono text-sm">
                        NO EVENTS SCHEDULED AT THIS TIME
                    </div>
                ) : (
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
                                className="rounded-xl border border-hairline bg-surface-1 overflow-hidden group h-full flex flex-col hover:border-hairline-2 transition-all"
                            >
                                {event.image && (
                                    <div className="h-48 overflow-hidden relative bg-surface-2 border-b border-hairline">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.03]" />
                                        <div className="absolute top-3 right-3 z-20">
                                            <span className="px-2.5 py-1 rounded-full bg-surface-1/90 backdrop-blur-md text-[11px] font-mono text-paper border border-hairline">
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <CardHeader className="relative z-10 p-5 pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-display font-medium text-paper group-hover:text-signal-text transition-colors line-clamp-1">{event.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-mute font-mono text-xs mt-1 flex items-center">
                                        <FaClock className="mr-1.5 w-3 h-3 text-signal" /> {event.date} • {event.time}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow relative z-10 p-5 pt-2">
                                    <p className="text-text-2 line-clamp-3 text-xs leading-relaxed mb-3">{event.description}</p>
                                    <div className="flex items-center text-mute font-mono text-xs">
                                        <FaMapMarkerAlt className="mr-1.5 w-3 h-3 text-signal" /> {event.location}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-[var(--border)] bg-[var(--surface-2)]/30 p-3 flex justify-end relative z-10">
                                    {currentUser?.role === 'ADMIN' ? (
                                        <div className="flex gap-2 w-full justify-end">
                                            <Button
                                                onClick={() => handleEdit && handleEdit(event, 'event')}
                                                variant="outline"
                                                size="sm"
                                                className="border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] rounded-[var(--r-sm)] h-8 text-xs"
                                            >
                                                <FaEdit className="mr-1.5" /> Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete && handleDelete(event.id || (event as any)._id, 'event')}
                                                variant="destructive"
                                                size="sm"
                                                className="bg-[var(--red-soft)] text-[var(--red-text)] border border-[var(--red-line)] hover:bg-[var(--red)] hover:text-white rounded-[var(--r-sm)] h-8 text-xs"
                                            >
                                                <FaTrash className="mr-1.5" /> Delete
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
                                                className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white border-0"
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
                )}
            </div>
        </div>
    );
}
