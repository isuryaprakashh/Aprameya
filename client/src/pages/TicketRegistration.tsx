import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Event, TicketRegistration as TicketType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Calendar,
    Clock,
    MapPin,
    Ticket,
    ArrowLeft,
    CheckCircle2,
    Download,
    Loader2,
    AlertTriangle,
    Shield,
} from 'lucide-react';

const TicketRegistration = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [, params] = useRoute('/events/:eventId/register');
    const eventId = params?.eventId;

    const [fullName, setFullName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [year, setYear] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketData, setTicketData] = useState<{
        qrToken: string;
        qrDataUrl: string;
        fullName: string;
        rollNumber: string;
        year: number;
        eventTitle: string;
        eventDate: string;
        id: string;
    } | null>(null);

    // Pre-fill from user profile if available
    useEffect(() => {
        if (user) {
            setFullName(user.username || '');
            setRollNumber(user.rollNumber || '');
        }
    }, [user]);

    const { data: event, isLoading: eventLoading, error: eventError } = useQuery<Event>({
        queryKey: [`/api/events/${eventId}`],
        enabled: !!eventId,
    });

    // Check if user already has a ticket
    const { data: existingTicket } = useQuery<TicketType>({
        queryKey: [`/api/tickets/my/${eventId}`],
        enabled: !!eventId && !!user,
        retry: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast({ title: 'Full Name is required', variant: 'destructive' });
            return;
        }
        if (!/^\d{10}$/.test(rollNumber)) {
            toast({ title: 'Roll Number must be exactly 10 digits', variant: 'destructive' });
            return;
        }
        if (!year) {
            toast({ title: 'Year is required', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiRequest('/api/tickets/register', {
                method: 'POST',
                body: JSON.stringify({
                    eventId,
                    fullName: fullName.trim(),
                    rollNumber,
                    year: parseInt(year, 10),
                }),
            });
            const data = await res.json();

            setTicketData(data.ticket);
            toast({
                title: '🎉 Registration Successful!',
                description: 'Your ticket QR code has been generated.',
            });
        } catch (err: any) {
            const msg = err.message || 'Registration failed';
            // Parse the error message from API (format: "409: {...}")
            let displayMsg = msg;
            try {
                if (msg.includes('{')) {
                    const json = JSON.parse(msg.substring(msg.indexOf('{')));
                    displayMsg = json.error || msg;
                }
            } catch { }
            toast({ title: 'Registration Failed', description: displayMsg, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadQR = () => {
        if (!ticketData?.qrDataUrl) return;
        const link = document.createElement('a');
        link.href = ticketData.qrDataUrl;
        link.download = `ticket_${ticketData.rollNumber}_${eventId}.png`;
        link.click();
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardContent className="p-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Login Required</h2>
                        <p className="text-[var(--text-secondary)] mb-6">Please log in to register for this event.</p>
                        <Button asChild className="bg-[hsl(var(--accent))] text-[var(--bg-body)]">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (eventLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
            </div>
        );
    }

    if (eventError || !event) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardContent className="p-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Event Not Found</h2>
                        <p className="text-[var(--text-secondary)] mb-6">This event doesn't exist or has been removed.</p>
                        <Button asChild variant="outline">
                            <Link href="/events">Back to Events</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show existing ticket if already registered
    const showTicket = ticketData || existingTicket;

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Button asChild variant="ghost" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <Link href="/events">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Link>
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="overflow-hidden bg-[var(--card-bg)] border-[var(--border-color)]">
                            {event.image && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <CardContent className="p-6">
                                <Badge variant="outline" className="mb-3 bg-[hsl(var(--accent))]/5 border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]">
                                    {event.type}
                                </Badge>
                                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{event.title}</h1>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center text-sm text-[var(--text-secondary)]">
                                        <Calendar className="w-4 h-4 mr-3 text-[hsl(var(--accent))]" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center text-sm text-[var(--text-secondary)]">
                                        <Clock className="w-4 h-4 mr-3 text-[hsl(var(--accent))]" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center text-sm text-[var(--text-secondary)]">
                                        <MapPin className="w-4 h-4 mr-3 text-[hsl(var(--accent))]" />
                                        {event.location}
                                    </div>
                                </div>

                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{event.description}</p>

                                {event.capacity && (
                                    <div className="mt-4 p-3 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)]">
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            <span className="font-semibold">Capacity:</span> {event.capacity} seats
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Security Note */}
                        <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--accent))]/5 border border-[hsl(var(--accent))]/10">
                            <Shield className="w-5 h-5 text-[hsl(var(--accent))] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-[hsl(var(--accent))] mb-1">Secure QR Ticket</p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    Your QR code is cryptographically signed and tamper-proof. Show it at the event for
                                    instant verification.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Registration Form or Ticket */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatePresence mode="wait">
                            {showTicket ? (
                                <motion.div
                                    key="ticket"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="bg-[var(--card-bg)] border-[var(--border-color)] overflow-hidden">
                                        {/* Ticket Header */}
                                        <div className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 p-6 text-center">
                                            <CheckCircle2 className="w-10 h-10 text-white mx-auto mb-2" />
                                            <h2 className="text-xl font-bold text-white">Ticket Confirmed!</h2>
                                            <p className="text-white/80 text-sm mt-1">Show this QR code at the event</p>
                                        </div>

                                        <CardContent className="p-6">
                                            {/* QR Code */}
                                            <div className="flex justify-center mb-6">
                                                <div className="bg-white p-4 rounded-xl shadow-lg">
                                                    {showTicket.qrToken ? (
                                                        <QRCodeSVG
                                                            value={showTicket.qrToken}
                                                            size={220}
                                                            level="M"
                                                            includeMargin={false}
                                                        />
                                                    ) : showTicket.qrDataUrl ? (
                                                        <img src={showTicket.qrDataUrl} alt="QR Code" className="w-[220px] h-[220px]" />
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Ticket Details */}
                                            <div className="space-y-3 p-4 rounded-lg bg-[var(--bg-body)] border border-[var(--border-color)]">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-[var(--text-secondary)]">Name</span>
                                                    <span className="text-sm font-medium text-[var(--text-primary)]">{showTicket.fullName}</span>
                                                </div>
                                                <div className="h-px bg-[var(--border-color)]" />
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-[var(--text-secondary)]">Roll Number</span>
                                                    <span className="text-sm font-mono font-medium text-[var(--text-primary)]">{showTicket.rollNumber}</span>
                                                </div>
                                                <div className="h-px bg-[var(--border-color)]" />
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-[var(--text-secondary)]">Year</span>
                                                    <span className="text-sm font-medium text-[var(--text-primary)]">Year {showTicket.year}</span>
                                                </div>
                                                <div className="h-px bg-[var(--border-color)]" />
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-[var(--text-secondary)]">Event</span>
                                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                                        {('eventTitle' in showTicket ? (showTicket as any).eventTitle : null) || ('event' in showTicket ? (showTicket as any).event?.title : null) || event.title}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 mt-6">
                                                {showTicket.qrDataUrl && (
                                                    <Button
                                                        onClick={downloadQR}
                                                        variant="outline"
                                                        className="flex-1 border-[var(--border-color)]"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download QR
                                                    </Button>
                                                )}
                                                <Button asChild className="flex-1 bg-[hsl(var(--accent))] text-[var(--bg-body)]">
                                                    <Link href="/my-tickets">
                                                        <Ticket className="w-4 h-4 mr-2" />
                                                        My Tickets
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
                                                <Ticket className="w-5 h-5 text-[hsl(var(--accent))]" />
                                                Get Your Ticket
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {event.registrationOpen === false ? (
                                                <div className="text-center py-8">
                                                    <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Registration Closed</h3>
                                                    <p className="text-sm text-[var(--text-secondary)]">
                                                        Registration for this event is no longer open.
                                                    </p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="space-y-5">
                                                    <div>
                                                        <Label htmlFor="fullName" className="text-[var(--text-secondary)]">Full Name *</Label>
                                                        <Input
                                                            id="fullName"
                                                            value={fullName}
                                                            onChange={(e) => setFullName(e.target.value)}
                                                            placeholder="Enter your full name"
                                                            className="mt-1.5 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="rollNumber" className="text-[var(--text-secondary)]">Roll Number * (10 digits)</Label>
                                                        <Input
                                                            id="rollNumber"
                                                            value={rollNumber}
                                                            onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                            placeholder="e.g., 2200030123"
                                                            className="mt-1.5 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)] font-mono"
                                                            maxLength={10}
                                                            required
                                                        />
                                                        {rollNumber && rollNumber.length !== 10 && (
                                                            <p className="text-xs text-red-400 mt-1">{rollNumber.length}/10 digits</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="year" className="text-[var(--text-secondary)]">Year of Study *</Label>
                                                        <Select value={year} onValueChange={setYear}>
                                                            <SelectTrigger className="mt-1.5 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]">
                                                                <SelectValue placeholder="Select year" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">1st Year</SelectItem>
                                                                <SelectItem value="2">2nd Year</SelectItem>
                                                                <SelectItem value="3">3rd Year</SelectItem>
                                                                <SelectItem value="4">4th Year</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting || !fullName || rollNumber.length !== 10 || !year}
                                                        className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[var(--bg-body)] font-semibold py-5"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Registering...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Ticket className="w-4 h-4 mr-2" />
                                                                Generate My Ticket
                                                            </>
                                                        )}
                                                    </Button>
                                                </form>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TicketRegistration;
