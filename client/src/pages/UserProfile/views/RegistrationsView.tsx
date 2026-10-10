import { motion } from 'framer-motion';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaCalendarAlt, FaClipboardList, FaFileCsv } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { EventRegistration } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';


interface EventRegistrationsData {
    registrations: EventRegistration[];
    totalRegistrations: number;
}

export default function RegistrationsView({ tickets = [] }: { tickets?: any[] }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();


    const { data: userEventRegistrations = [] } = useQuery<EventRegistration[]>({
        queryKey: ['/api/event-registrations/my'],
        staleTime: 5000,
        enabled: !!currentUser && currentUser.role !== 'ADMIN',
    });

    const { data: eventRegistrations = { registrations: [], totalRegistrations: 0 } } = useQuery<EventRegistrationsData>({
        queryKey: ['/api/admin/event-registrations'],
        enabled: currentUser?.role === 'ADMIN',
        staleTime: 5000
    });

    const cancelEventRegistration = useMutation({
        mutationFn: (registrationId: string) =>
            apiRequest(`/api/db/event-registrations/${registrationId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/my'] });
            toast({
                title: 'Success',
                description: 'Event registration cancelled successfully',
            });
        },
    });

    const handleCancelRegistration = (registrationId: string | null) => {
        if (registrationId && window.confirm('Are you sure you want to cancel this event registration?')) {
            cancelEventRegistration.mutate(registrationId);
        }
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

    // Admin View
    if (currentUser?.role === 'ADMIN') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Event Registrations</h2>
                    <div className="flex gap-2">

                        <Button onClick={() => downloadCSV(eventRegistrations.registrations, 'registrations.csv')} variant="outline" className="text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10">
                            <FaFileCsv className="mr-2" /> Export CSV
                        </Button>
                    </div>
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

    // User View
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

                {userEventRegistrations.length === 0 && (!tickets || tickets.length === 0) ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]/20">
                        <FaCalendarAlt className="mx-auto text-4xl text-[var(--text-secondary)] mb-4" />
                        <p className="text-[var(--text-secondary)] text-lg">You haven't registered for any events yet.</p>
                        <Button
                            variant="link"
                            className="text-[hsl(var(--accent))] mt-2"
                            onClick={() => window.location.href = '#events'}
                        >
                            Browse Events
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Event Registrations */}
                        {userEventRegistrations.map((registration, index) => (
                            <motion.div
                                key={`reg-${registration.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="clean-card group"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{registration.event?.title || 'Event'}</CardTitle>
                                        <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs border border-blue-500/20">Quick Reg</div>
                                    </div>
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

                        {/* Ticket Registrations */}
                        {tickets?.map((ticket, index) => (
                            <motion.div
                                key={`ticket-${ticket.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (userEventRegistrations.length + index) * 0.05 }}
                                className="clean-card group"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">{ticket.event?.title || 'Event'}</CardTitle>
                                        <div className="px-2 py-1 rounded bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] text-xs border border-[hsl(var(--accent))]/20">Ticket</div>
                                    </div>
                                    <CardDescription className="text-[var(--text-secondary)] font-mono text-xs">
                                        {ticket.event?.date || 'Date TBA'} | {ticket.event?.location || 'Location TBA'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[var(--text-secondary)] text-sm mb-2">Roll No: {ticket.rollNumber}</p>
                                    <p className="text-[var(--text-secondary)] text-xs font-mono">ID: {ticket.entryCode}</p>
                                </CardContent>
                                <CardFooter className="border-t border-[var(--border-color)] bg-[var(--card-bg)]/20 p-4 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[var(--border-color)] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
                                        onClick={() => window.location.href = '/my-tickets'}
                                    >
                                        View Ticket
                                    </Button>
                                </CardFooter>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
