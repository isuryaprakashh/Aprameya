import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import { TicketRegistration } from '@/lib/types';
import {
    Calendar,
    Clock,
    MapPin,
    Ticket,
    ChevronDown,
    ChevronUp,
    Download,
    QrCode,
    CheckCircle2,
} from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';
import WanderingEyesLoader from '@/components/WanderingEyesLoader';

const MyTickets = () => {
    const { user } = useAuth();
    const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

    const { data: tickets = [], isLoading } = useQuery<TicketRegistration[]>({
        queryKey: ['/api/tickets/my'],
        enabled: !!user,
    });

    const downloadQR = (ticket: TicketRegistration) => {
        if (!ticket.qrDataUrl) return;
        const link = document.createElement('a');
        link.href = ticket.qrDataUrl;
        link.download = `ticket_${ticket.rollNumber}_${ticket.eventId}.png`;
        link.click();
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] p-8 text-center rounded-2xl">
                    <Ticket className="w-10 h-10 text-[var(--red)] mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-[var(--text)] mb-2 font-display">Login Required</h2>
                    <p className="text-sm text-[var(--text-2)] mb-6">Please sign in with your College ID to view your registered passes.</p>
                    <Link href="/login">
                        <ChamferedButton variant="primary" size="md">
                            Sign In to Portal
                        </ChamferedButton>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <WanderingEyesLoader
                fullPage
                size="md"
                text="RETRIEVING EVENT PASSES"
                subtext="FETCHING SECURE TICKET CRYPTO-HASHES"
            />
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-28 pb-20 px-6 md:px-12">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <p className="font-mono text-xs uppercase text-[var(--text-3)] tracking-wider mb-2">
                        Event Passes
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text)] font-display">
                        My Passes
                    </h1>
                    <p className="text-sm text-[var(--text-2)] mt-1 font-mono">
                        {tickets.length} pass{tickets.length !== 1 ? 'es' : ''} registered under {user.username}
                    </p>
                </motion.div>

                {/* Tickets List */}
                {tickets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-[var(--surface)] rounded-2xl border border-dashed border-[var(--border)]"
                    >
                        <QrCode className="w-12 h-12 text-[var(--text-3)] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[var(--text)] mb-2 font-display">No Event Passes Yet</h3>
                        <p className="text-sm text-[var(--text-2)] mb-6">Register for upcoming workshops and autonomy hackathons to get your pass.</p>
                        <Link href="/events">
                            <ChamferedButton variant="primary" size="md">
                                Browse Workshops
                            </ChamferedButton>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket, index) => {
                            const isExpanded = expandedTicket === ticket.id;

                            return (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-200">
                                        {/* Ticket Header */}
                                        <button
                                            onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                                            className="w-full text-left cursor-pointer"
                                        >
                                            <div className="p-5 flex items-center gap-4">
                                                {/* Status Icon */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${ticket.scanned
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)]'
                                                    }`}>
                                                    {ticket.scanned ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    ) : (
                                                        <QrCode className="w-5 h-5 text-[var(--text-2)]" />
                                                    )}
                                                </div>

                                                {/* Event Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-display font-medium text-[var(--text)] truncate text-base">
                                                        {ticket.event?.title || 'Event Pass'}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-2)] font-mono">
                                                        {ticket.event?.date && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5 text-[var(--red)]" />
                                                                {ticket.event.date}
                                                            </span>
                                                        )}
                                                        {ticket.event?.time && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5 text-[var(--red)]" />
                                                                {ticket.event.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <span
                                                    className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${ticket.scanned
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                        : 'bg-[var(--red-soft)] text-[var(--red)] border-[var(--red-line)]'
                                                        }`}
                                                >
                                                    {ticket.scanned ? 'Verified' : 'Active Pass'}
                                                </span>

                                                {/* Expand Icon */}
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-[var(--text-2)] shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-[var(--text-2)] shrink-0" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-[var(--border)] bg-[var(--surface-2)] p-6"
                                            >
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* QR Code */}
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="bg-white p-3 rounded-xl border border-[var(--border)]">
                                                            {ticket.qrToken ? (
                                                                <QRCodeSVG
                                                                    value={ticket.qrToken}
                                                                    size={180}
                                                                    level="M"
                                                                />
                                                            ) : ticket.qrDataUrl ? (
                                                                <img src={ticket.qrDataUrl} alt="QR Code" className="w-[180px] h-[180px]" />
                                                            ) : null}
                                                        </div>
                                                        {ticket.qrDataUrl && (
                                                            <ChamferedButton
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => downloadQR(ticket)}
                                                                leftIcon={<Download className="w-3.5 h-3.5 text-[var(--text-2)]" />}
                                                            >
                                                                Download QR
                                                            </ChamferedButton>
                                                        )}
                                                    </div>

                                                    {/* Details & Manual Code */}
                                                    <div className="flex-1 space-y-4">
                                                        {ticket.entryCode && (
                                                            <div>
                                                                <p className="text-[10px] text-[var(--text-3)] font-mono uppercase tracking-wider mb-1">Pass Entry Code</p>
                                                                <div className="bg-[var(--surface)] border border-[var(--border)] text-[var(--red)] font-mono text-2xl font-medium py-2 px-4 rounded-xl tracking-widest inline-block">
                                                                    {ticket.entryCode}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                                                            <div>
                                                                <p className="text-[var(--text-3)] uppercase font-mono tracking-wider text-[10px]">Attendee</p>
                                                                <p className="text-sm font-medium text-[var(--text)] mt-0.5">{ticket.fullName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[var(--text-3)] uppercase font-mono tracking-wider text-[10px]">Roll Number</p>
                                                                <p className="text-sm font-mono font-medium text-[var(--text)] mt-0.5">{ticket.rollNumber}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[var(--text-3)] uppercase font-mono tracking-wider text-[10px]">Year</p>
                                                                <p className="text-sm font-medium text-[var(--text)] mt-0.5">Year {ticket.year}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[var(--text-3)] uppercase font-mono tracking-wider text-[10px]">Status</p>
                                                                <p className={`text-sm font-medium mt-0.5 ${ticket.scanned ? 'text-emerald-400' : 'text-[var(--red)]'}`}>
                                                                    {ticket.scanned ? 'Verified at Desk' : 'Active Pass'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {ticket.event?.location && (
                                                            <div className="flex items-center gap-2 text-xs text-[var(--text-2)] pt-3 border-t border-[var(--border)]">
                                                                <MapPin className="w-3.5 h-3.5 text-[var(--red)] shrink-0" />
                                                                <span>{ticket.event.location}</span>
                                                            </div>
                                                        )}

                                                        {ticket.scannedAt && (
                                                            <div className="text-xs text-[var(--text-2)] font-mono">
                                                                Scanned at: {new Date(ticket.scannedAt).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTickets;
