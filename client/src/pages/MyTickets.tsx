import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import { TicketRegistration } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardContent className="p-8 text-center">
                        <Ticket className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Login Required</h2>
                        <p className="text-[var(--text-secondary)] mb-6">Please log in to view your tickets.</p>
                        <Button asChild className="bg-[hsl(var(--accent))] text-[var(--bg-body)]">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--accent))]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center text-[var(--text-primary)]">
                            <Ticket className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                            <span className="font-serif italic font-normal text-[1.08em] text-[var(--text-secondary)]">My</span>{" "}
                            <span className="font-display">Passes</span>
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm ml-[52px]">
                        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} registered
                    </p>
                </motion.div>

                {/* Tickets List */}
                {tickets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-[var(--card-bg)]/50 rounded-xl border border-[var(--border-color)] border-dashed"
                    >
                        <QrCode className="w-16 h-16 text-[var(--text-secondary)]/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Tickets Yet</h3>
                        <p className="text-[var(--text-secondary)] mb-6">Register for an event to get your ticket.</p>
                        <Button asChild className="bg-[hsl(var(--accent))] text-[var(--bg-body)]">
                            <Link href="/events">Browse Events</Link>
                        </Button>
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
                                    <Card className="bg-[var(--card-bg)] border-[var(--border-color)] overflow-hidden hover:border-[hsl(var(--accent))]/30 transition-colors">
                                        {/* Ticket Header */}
                                        <button
                                            onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                                            className="w-full text-left"
                                        >
                                            <div className="p-5 flex items-center gap-4">
                                                {/* Status Icon */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ticket.scanned
                                                    ? 'bg-green-500/10'
                                                    : 'bg-[hsl(var(--accent))]/10'
                                                    }`}>
                                                    {ticket.scanned ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <QrCode className="w-5 h-5 text-[hsl(var(--accent))]" />
                                                    )}
                                                </div>

                                                {/* Event Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-[var(--text-primary)] truncate">
                                                        {ticket.event?.title || 'Event'}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                                                        {ticket.event?.date && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {ticket.event.date}
                                                            </span>
                                                        )}
                                                        {ticket.event?.time && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {ticket.event.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <Badge
                                                    variant="outline"
                                                    className={ticket.scanned
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-[hsl(var(--accent))]/5 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/20'
                                                    }
                                                >
                                                    {ticket.scanned ? 'Scanned' : 'Active'}
                                                </Badge>

                                                {/* Expand Icon */}
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-[var(--border-color)]"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        {/* QR Code */}
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="bg-white p-3 rounded-xl shadow-md">
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
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => downloadQR(ticket)}
                                                                    className="text-xs"
                                                                >
                                                                    <Download className="w-3 h-3 mr-1" />
                                                                    Download
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {ticket.entryCode && (
                                                            <div className="mt-4 text-center">
                                                                <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Manual Code</p>
                                                                <div className="bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] font-mono text-2xl font-bold py-2 px-4 rounded-lg tracking-widest">
                                                                    {ticket.entryCode}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Details */}
                                                        <div className="flex-1 space-y-3">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <p className="text-xs text-[var(--text-secondary)]">Name</p>
                                                                    <p className="text-sm font-medium text-[var(--text-primary)]">{ticket.fullName}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-[var(--text-secondary)]">Roll Number</p>
                                                                    <p className="text-sm font-mono font-medium text-[var(--text-primary)]">{ticket.rollNumber}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-[var(--text-secondary)]">Year</p>
                                                                    <p className="text-sm font-medium text-[var(--text-primary)]">Year {ticket.year}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-[var(--text-secondary)]">Status</p>
                                                                    <p className={`text-sm font-medium ${ticket.scanned ? 'text-green-500' : 'text-[hsl(var(--accent))]'}`}>
                                                                        {ticket.scanned ? 'Verified' : 'Not Scanned'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {ticket.event?.location && (
                                                                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {ticket.event.location}
                                                                </div>
                                                            )}

                                                            {ticket.scannedAt && (
                                                                <div className="text-xs text-green-500/80">
                                                                    Scanned at: {new Date(ticket.scannedAt).toLocaleString()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </motion.div>
                                        )
                                        }
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )
                }
            </div >
        </div >
    );
};

export default MyTickets;
