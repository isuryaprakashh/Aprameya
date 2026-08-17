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
    Loader2,
    QrCode,
    CheckCircle2,
} from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

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
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="max-w-md w-full morphic-metallic-card p-8 text-center rounded-xl">
                    <Ticket className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2 font-display">Login Required</h2>
                    <p className="text-xs text-[#94A3B8] mb-6">Please sign in with your College ID to view your registered passes.</p>
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-6 md:px-12">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-950/60 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-400 shadow-[inset_0_1px_1px_rgba(167,243,208,0.2)]">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            <span className="font-serif italic font-normal text-[1.08em] text-[#94A3B8]">My</span>{" "}
                            <span className="font-display">Passes</span>
                        </h1>
                    </div>
                    <p className="text-xs text-[#94A3B8] ml-[52px]">
                        {tickets.length} pass{tickets.length !== 1 ? 'es' : ''} registered under {user.username}
                    </p>
                </motion.div>

                {/* Tickets List */}
                {tickets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 morphic-metallic-card rounded-xl border border-dashed border-emerald-500/20"
                    >
                        <QrCode className="w-16 h-16 text-emerald-500/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2 font-display">No Event Passes Yet</h3>
                        <p className="text-xs text-[#94A3B8] mb-6">Register for upcoming workshops and autonomy hackathons to get your pass.</p>
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
                                    <div className="morphic-metallic-card rounded-xl overflow-hidden transition-all duration-300">
                                        {/* Ticket Header */}
                                        <button
                                            onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                                            className="w-full text-left cursor-pointer"
                                        >
                                            <div className="p-5 flex items-center gap-4">
                                                {/* Status Icon */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ticket.scanned
                                                    ? 'bg-emerald-950/60 border border-emerald-400/30 text-emerald-400'
                                                    : 'badge-plum'
                                                    }`}>
                                                    {ticket.scanned ? (
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    ) : (
                                                        <QrCode className="w-5 h-5 text-emerald-300" />
                                                    )}
                                                </div>

                                                {/* Event Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-display font-bold text-white truncate text-base">
                                                        {ticket.event?.title || 'Event Pass'}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8] font-mono">
                                                        {ticket.event?.date && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3 text-emerald-400" />
                                                                {ticket.event.date}
                                                            </span>
                                                        )}
                                                        {ticket.event?.time && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3 text-emerald-400" />
                                                                {ticket.event.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <span
                                                    className={`text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-1 rounded border ${ticket.scanned
                                                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                                        : 'badge-plum'
                                                        }`}
                                                >
                                                    {ticket.scanned ? 'Verified' : 'Active Pass'}
                                                </span>

                                                {/* Expand Icon */}
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-[#94A3B8] shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-[#94A3B8] shrink-0" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-emerald-500/15 bg-black/40 p-6"
                                            >
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* QR Code */}
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="bg-white p-3 rounded-xl shadow-xl shadow-black/60">
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
                                                            <button
                                                                onClick={() => downloadQR(ticket)}
                                                                className="px-3 py-1.5 rounded-lg text-xs btn-metallic-ghost flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <Download className="w-3 h-3 text-emerald-400" />
                                                                Download QR
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Details & Manual Code */}
                                                    <div className="flex-1 space-y-4">
                                                        {ticket.entryCode && (
                                                            <div>
                                                                <p className="text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-wider mb-1">Pass Entry Code</p>
                                                                <div className="bg-black/80 border border-emerald-400/30 text-metallic-green font-mono text-2xl font-bold py-2 px-4 rounded-lg tracking-widest inline-block shadow-[inset_0_1px_1px_rgba(167,243,208,0.2)]">
                                                                    {ticket.entryCode}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                                                            <div>
                                                                <p className="text-[#64748B] uppercase tracking-wider text-[10px]">Attendee</p>
                                                                <p className="text-sm font-medium text-white mt-0.5">{ticket.fullName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[#64748B] uppercase tracking-wider text-[10px]">Roll Number</p>
                                                                <p className="text-sm font-mono font-medium text-white mt-0.5">{ticket.rollNumber}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[#64748B] uppercase tracking-wider text-[10px]">Year</p>
                                                                <p className="text-sm font-medium text-white mt-0.5">Year {ticket.year}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[#64748B] uppercase tracking-wider text-[10px]">Status</p>
                                                                <p className={`text-sm font-medium mt-0.5 ${ticket.scanned ? 'text-emerald-400' : 'text-metallic-green'}`}>
                                                                    {ticket.scanned ? 'Verified at Desk' : 'Active Pass'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {ticket.event?.location && (
                                                            <div className="flex items-center gap-2 text-xs text-[#94A3B8] pt-3 border-t border-emerald-500/15">
                                                                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                                <span>{ticket.event.location}</span>
                                                            </div>
                                                        )}

                                                        {ticket.scannedAt && (
                                                            <div className="text-xs text-emerald-400/80 font-mono">
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
