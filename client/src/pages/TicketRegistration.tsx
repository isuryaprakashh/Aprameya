import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Event, TicketRegistration as TicketType } from '@/lib/types';
import { events as fallbackEvents } from '@/lib/data';
import WanderingEyesLoader from '@/components/WanderingEyesLoader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import ChamferedButton from '@/components/ui/ChamferedButton';

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
        entryCode: string;
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
        queryFn: async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            try {
                const res = await fetch(`/api/events/${eventId}`, { signal: controller.signal });
                clearTimeout(timeoutId);
                if (!res.ok) {
                    const fallback = fallbackEvents.find(e => e.id === eventId);
                    if (fallback) return fallback;
                    throw new Error('Event not found');
                }
                return res.json();
            } catch (err) {
                clearTimeout(timeoutId);
                const fallback = fallbackEvents.find(e => e.id === eventId);
                if (fallback) return fallback;
                throw err;
            }
        },
        initialData: () => fallbackEvents.find(e => e.id === eventId),
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
                title: 'Registration Confirmed',
                description: 'Your event pass QR code has been generated.',
            });
        } catch (err: any) {
            const msg = err.message || 'Registration failed';
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
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-8 text-center rounded-2xl">
                    <AlertTriangle className="w-10 h-10 text-[var(--red)] mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-[var(--text)] mb-2 font-display">Login Required</h2>
                    <p className="text-sm text-[var(--text-2)] mb-6">Please log in to register your attendance pass.</p>
                    <Link href="/login">
                        <ChamferedButton variant="primary" size="md">
                            Go to Login
                        </ChamferedButton>
                    </Link>
                </div>
            </div>
        );
    }

    const isSoldOut = event?.capacity && (event?.registeredCount || 0) >= event.capacity;

    if (isSoldOut) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-8 text-center rounded-2xl">
                    <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-[var(--text)] mb-2 font-display">Capacity Reached</h2>
                    <p className="text-sm text-[var(--text-2)] mb-6">This event has reached its maximum student cohort capacity.</p>
                    <Link href="/events">
                        <ChamferedButton variant="secondary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back to Events
                        </ChamferedButton>
                    </Link>
                </div>
            </div>
        );
    }

    if (eventLoading && !event) {
        return (
            <WanderingEyesLoader
                fullPage
                size="md"
                text="PREPARING PASS DISPATCH TERMINAL"
                subtext="VERIFYING EVENT CLEARANCE & TICKET AVAILABILITY"
            />
        );
    }

    if (eventError || !event) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-8 text-center rounded-2xl">
                    <AlertTriangle className="w-10 h-10 text-[var(--red)] mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-[var(--text)] mb-2 font-display">Event Not Found</h2>
                    <p className="text-sm text-[var(--text-2)] mb-6">This event listing is currently unavailable.</p>
                    <Link href="/events">
                        <ChamferedButton variant="secondary" size="md">
                            Back to Events
                        </ChamferedButton>
                    </Link>
                </div>
            </div>
        );
    }

    const showTicket = ticketData || existingTicket;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-28 pb-20 px-6 md:px-12">
            <div className="container mx-auto max-w-4xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link href="/events">
                        <span className="text-xs font-mono text-[var(--text-2)] hover:text-[var(--text)] transition-colors flex items-center gap-2 cursor-pointer">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Event Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
                            {event.image && (
                                <div className="h-48 overflow-hidden bg-[var(--surface-2)]">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <span className="inline-block text-[11px] font-mono uppercase tracking-wider text-[var(--red)] bg-[var(--red-soft)] border border-[var(--red-line)] px-2.5 py-0.5 rounded-full mb-3">
                                    {event.type}
                                </span>
                                <h1 className="text-2xl font-display font-medium tracking-tight text-[var(--text)] mb-4">
                                    {event.title}
                                </h1>

                                <div className="space-y-2.5 mb-4 text-xs font-mono text-[var(--text-2)]">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-3 text-[var(--red)]" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-3 text-[var(--red)]" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-3 text-[var(--red)]" />
                                        {event.location}
                                    </div>
                                </div>

                                <p className="text-sm text-[var(--text-2)] leading-relaxed mb-4">{event.description}</p>

                                {event.capacity && (
                                    <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs">
                                        <p className="text-[var(--text-2)]">
                                            <span className="text-[var(--text)] font-medium">Cohort Capacity:</span> {event.capacity} seats
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                            <Shield className="w-5 h-5 text-[var(--red)] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-[var(--text)] mb-0.5">Encrypted Event Pass</p>
                                <p className="text-xs text-[var(--text-2)]">
                                    Your QR ticket is cryptographically verified for instant entry at the lab registration desk.
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
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                >
                                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
                                        {/* Ticket Header */}
                                        <div className="bg-[var(--surface-2)] p-6 text-center border-b border-[var(--border)]">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                            <h2 className="text-lg font-medium text-[var(--text)] font-display">Pass Confirmed</h2>
                                            <p className="text-xs text-[var(--text-2)] mt-0.5">Present this QR code at the registration desk</p>
                                        </div>

                                        <div className="p-6">
                                            {/* QR Code */}
                                            <div className="flex justify-center mb-6">
                                                <div className="bg-white p-4 rounded-xl border border-[var(--border)]">
                                                    {showTicket.qrToken ? (
                                                        <QRCodeSVG
                                                            value={showTicket.qrToken}
                                                            size={200}
                                                            level="M"
                                                            includeMargin={false}
                                                        />
                                                    ) : showTicket.qrDataUrl ? (
                                                        <img src={showTicket.qrDataUrl} alt="QR Code" className="w-[200px] h-[200px]" />
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Entry Code */}
                                            {showTicket.entryCode && (
                                                <div className="text-center mb-5">
                                                    <p className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-3)] mb-1.5">Pass Entry Code</p>
                                                    <div className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                                                        <span className="text-2xl font-mono tracking-[0.3em] font-medium text-[var(--red)]">{showTicket.entryCode}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ticket Details */}
                                            <div className="space-y-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-3)]">Name</span>
                                                    <span className="font-medium text-[var(--text)]">{showTicket.fullName}</span>
                                                </div>
                                                <div className="h-px bg-[var(--border)]" />
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-3)]">Roll Number</span>
                                                    <span className="font-mono font-medium text-[var(--text)]">{showTicket.rollNumber}</span>
                                                </div>
                                                <div className="h-px bg-[var(--border)]" />
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-3)]">Year</span>
                                                    <span className="font-medium text-[var(--text)]">Year {showTicket.year}</span>
                                                </div>
                                                <div className="h-px bg-[var(--border)]" />
                                                <div className="flex justify-between">
                                                    <span className="text-[var(--text-3)]">Event</span>
                                                    <span className="font-medium text-[var(--text)] truncate max-w-[200px]">
                                                        {('eventTitle' in showTicket ? (showTicket as any).eventTitle : null) || ('event' in showTicket ? (showTicket as any).event?.title : null) || event.title}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 mt-6">
                                                {showTicket.qrDataUrl && (
                                                    <ChamferedButton
                                                        variant="secondary"
                                                        size="md"
                                                        onClick={downloadQR}
                                                        className="flex-1"
                                                        leftIcon={<Download className="w-4 h-4 text-[var(--text-2)]" />}
                                                    >
                                                        Download QR
                                                    </ChamferedButton>
                                                )}
                                                <Link href="/my-tickets" className="flex-1 block">
                                                    <ChamferedButton
                                                        variant="primary"
                                                        size="md"
                                                        className="w-full"
                                                        leftIcon={<Ticket className="w-4 h-4" />}
                                                    >
                                                        My Passes
                                                    </ChamferedButton>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                >
                                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
                                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border)]">
                                            <Ticket className="w-5 h-5 text-[var(--red)]" />
                                            <h2 className="text-lg font-medium text-[var(--text)] font-display">Generate Event Pass</h2>
                                        </div>

                                        {event.registrationOpen === false ? (
                                            <div className="text-center py-8">
                                                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                                                <h3 className="font-medium text-[var(--text)] mb-1">Registration Closed</h3>
                                                <p className="text-xs text-[var(--text-2)]">
                                                    Registration for this session is no longer accepting new submissions.
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="fullName" className="text-xs font-mono text-[var(--text-2)] uppercase">Full Name *</Label>
                                                    <Input
                                                        id="fullName"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        placeholder="Enter your full name"
                                                        className="mt-1.5"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <Label htmlFor="rollNumber" className="text-xs font-mono text-[var(--text-2)] uppercase">College ID (10 digits) *</Label>
                                                    <Input
                                                        id="rollNumber"
                                                        value={rollNumber}
                                                        onChange={(e) => setRollNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                        placeholder="e.g. 2200030123"
                                                        className="mt-1.5 font-mono"
                                                        maxLength={10}
                                                        required
                                                    />
                                                    {rollNumber && rollNumber.length !== 10 && (
                                                        <p className="text-xs text-[var(--red)] mt-1 font-mono">{rollNumber.length}/10 digits</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="year" className="text-xs font-mono text-[var(--text-2)] uppercase">Year of Study *</Label>
                                                    <Select value={year} onValueChange={setYear}>
                                                        <SelectTrigger className="mt-1.5">
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

                                                <div className="pt-2">
                                                    <ChamferedButton
                                                        type="submit"
                                                        variant="primary"
                                                        size="lg"
                                                        disabled={isSubmitting || !fullName || rollNumber.length !== 10 || !year}
                                                        className="w-full"
                                                        isLoading={isSubmitting}
                                                        leftIcon={<Ticket className="w-4 h-4" />}
                                                    >
                                                        Confirm & Issue Pass
                                                    </ChamferedButton>
                                                </div>
                                            </form>
                                        )}
                                    </div>
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
