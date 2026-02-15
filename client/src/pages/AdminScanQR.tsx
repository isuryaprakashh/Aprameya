import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    QrCode,
    Camera,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Download,
    Users,
    Loader2,
    RotateCcw,
    Shield,
    Search,
    CameraOff,
    ArrowLeft,
    ScanLine,
    ChevronDown,
} from 'lucide-react';

interface ScanResult {
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    ticket?: {
        fullName: string;
        rollNumber: string;
        year: number;
        scannedAt: string;
        eventTitle: string;
    };
}

interface TicketEntry {
    id: string;
    fullName: string;
    rollNumber: string;
    year: number;
    scanned: boolean;
    scannedAt: string | null;
    createdAt: string;
}

const AdminScanQR = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const [selectedEventId, setSelectedEventId] = useState('');
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [manualToken, setManualToken] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const scannerRef = useRef<any>(null);
    const html5QrCodeRef = useRef<any>(null);
    const lastScanned = useRef<{ code: string; time: number } | null>(null);

    // Fetch events
    const { data: events = [] } = useQuery<Event[]>({
        queryKey: ['/api/events'],
    });

    // Fetch registrations for selected event
    const {
        data: eventData,
        refetch: refetchEventData,
        isLoading: loadingEventData,
    } = useQuery<{
        event: any;
        tickets: TicketEntry[];
        totalTickets: number;
        scannedCount: number;
    }>({
        queryKey: [`/api/tickets/event/${selectedEventId}`],
        enabled: !!selectedEventId,
    });

    // Initialize camera scanner
    const startCameraScanner = async () => {
        if (scannerRef.current) return;

        if (!document.getElementById('qr-reader')) {
            console.log("QR Reader element not found, skipping start");
            return;
        }

        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            const scanner = new Html5Qrcode('qr-reader');
            html5QrCodeRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText: string) => {
                    handleScanToken(decodedText);
                },
                () => { }
            );

            scannerRef.current = scanner;
            setIsScanning(true);
        } catch (err) {
            console.error('Camera scanner error:', err);
            toast({
                title: 'Camera Error',
                description: 'Could not access camera. Try manual mode.',
                variant: 'destructive',
            });
        }
    };

    const stopCameraScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
            } catch (err) {
                // Ignore stop errors
            }
            scannerRef.current = null;
            html5QrCodeRef.current = null;
            setIsScanning(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCameraScanner();
        };
    }, []);

    const handleScanToken = async (token: string) => {
        // Prevent duplicate scans within 2.5 seconds
        const now = Date.now();
        if (lastScanned.current && lastScanned.current.code === token && (now - lastScanned.current.time < 2500)) {
            return;
        }

        if (!token.trim()) return;

        lastScanned.current = { code: token, time: now };
        setIsProcessing(true);

        // Don't clear result immediately to allow reading previous one while processing
        // setScanResult(null); 

        try {
            const res = await apiRequest('/api/tickets/scan', {
                method: 'POST',
                body: JSON.stringify({
                    token: token.trim(),
                    expectedEventId: selectedEventId || undefined,
                }),
            });

            const data = await res.json();

            setScanResult({
                type: 'success',
                title: 'Verified!',
                message: `${data.ticket.fullName} — ${data.ticket.rollNumber}`,
                ticket: data.ticket,
            });

            if (selectedEventId) refetchEventData();
        } catch (err: any) {
            let errMsg = 'Scan failed';
            let resultType: ScanResult['type'] = 'error';
            let resultTitle = 'Invalid Ticket';

            try {
                const errText = err.message || '';
                if (errText.includes('{')) {
                    const json = JSON.parse(errText.substring(errText.indexOf('{')));
                    errMsg = json.error || errMsg;

                    if (json.code === 'ALREADY_SCANNED') {
                        resultType = 'warning';
                        resultTitle = 'Already Scanned';
                        toast({
                            title: 'Already Scanned',
                            description: json.scannedAt
                                ? `Scanned at ${new Date(json.scannedAt).toLocaleTimeString()}`
                                : 'This ticket has already been scanned.',
                            variant: 'destructive',
                        });
                    } else if (json.code === 'WRONG_EVENT') {
                        resultTitle = 'Wrong Event';
                        toast({
                            title: 'Wrong Event',
                            description: 'This ticket is for a different event.',
                            variant: 'destructive',
                        });
                    } else if (json.code === 'EXPIRED') {
                        resultTitle = 'Ticket Expired';
                        toast({
                            title: 'Ticket Expired',
                            description: 'This ticket is no longer valid.',
                            variant: 'destructive',
                        });
                    }
                }
            } catch { }

            setScanResult({
                type: resultType,
                title: resultTitle,
                message: errMsg,
            });

        } finally {
            setIsProcessing(false);
            setManualToken('');
            setManualInput('');
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send either entry code or token - server auto-detects
        handleScanToken(manualInput || manualToken);
    };

    const handleExportCSV = async () => {
        if (!selectedEventId) return;
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/tickets/event/${selectedEventId}/export`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `registrations_${selectedEventId}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);

            toast({ title: 'CSV Exported', description: 'File downloaded successfully.' });
        } catch (err) {
            toast({ title: 'Export Failed', description: 'Could not export CSV.', variant: 'destructive' });
        }
    };

    // Access denied state
    if (!user || (user.role !== 'ADMIN' && user.role !== 'CORE')) {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-sm w-full text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                        <Shield className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h2>
                    <p className="text-[var(--text-secondary)] text-sm mb-6">Only admins and core team members can access the scanner.</p>
                    <Button variant="outline" onClick={() => setLocation('/')} className="text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    const scannedPercent = eventData ? Math.round((eventData.scannedCount / Math.max(eventData.totalTickets, 1)) * 100) : 0;

    return (
        <div className="min-h-screen bg-[var(--bg-body)] relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[hsl(var(--accent))]/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
            </div>

            {/* Top bar */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-body)]/80 border-b border-[var(--border-color)]/50">
                <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
                    <button
                        onClick={() => setLocation('/dashboard')}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors -ml-1 py-1 px-2 rounded-lg hover:bg-[var(--card-bg)]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))]/10 flex items-center justify-center">
                            <ScanLine className="w-4 h-4 text-[hsl(var(--accent))]" />
                        </div>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">Scan Tickets</span>
                    </div>

                    <div className="w-[68px]" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-5">

                {/* Event Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <div className="rounded-2xl bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border-color)]/60 p-4">
                        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2.5 block">
                            Select Event
                        </label>
                        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                            <SelectTrigger className="bg-[var(--bg-body)]/60 border-[var(--border-color)]/60 text-[var(--text-primary)] h-11 rounded-xl">
                                <SelectValue placeholder="Choose an event..." />
                            </SelectTrigger>
                            <SelectContent>
                                {events.map((ev) => (
                                    <SelectItem key={ev.id} value={ev.id}>
                                        {ev.title} — {ev.date}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Stats */}
                        {eventData && (
                            <div className="mt-4 flex gap-3">
                                <div className="flex-1 rounded-xl bg-[var(--bg-body)]/60 p-3 text-center">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">{eventData.totalTickets}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">Registered</div>
                                </div>
                                <div className="flex-1 rounded-xl bg-green-500/5 border border-green-500/10 p-3 text-center">
                                    <div className="text-2xl font-bold text-green-500">{eventData.scannedCount}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-green-500/70 mt-0.5">Scanned</div>
                                </div>
                                <div className="flex-1 rounded-xl bg-[var(--bg-body)]/60 p-3 text-center">
                                    <div className="text-2xl font-bold text-[hsl(var(--accent))]">{scannedPercent}%</div>
                                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">Progress</div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Scanner Section */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="rounded-2xl bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border-color)]/60 overflow-hidden">
                        {/* Mode toggle */}
                        <div className="flex border-b border-[var(--border-color)]/40">
                            <button
                                onClick={async () => {
                                    if (scanMode === 'camera') return;
                                    setScanMode('camera');
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${scanMode === 'camera'
                                    ? 'text-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 border-b-2 border-[hsl(var(--accent))]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Camera className="w-4 h-4" />
                                Camera
                            </button>
                            <button
                                onClick={async () => {
                                    if (scanMode === 'manual') return;
                                    await stopCameraScanner();
                                    setScanMode('manual');
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${scanMode === 'manual'
                                    ? 'text-[hsl(var(--accent))] bg-[hsl(var(--accent))]/5 border-b-2 border-[hsl(var(--accent))]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Search className="w-4 h-4" />
                                Manual
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Camera Mode */}
                            <div className={scanMode === 'camera' ? 'block' : 'hidden'}>
                                <div className="space-y-4">
                                    <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-square max-w-[350px] mx-auto w-full [&_video]:!object-cover [&_video]:!w-full [&_video]:!h-full">
                                        <div id="qr-reader" className="w-full h-full" />
                                        {isProcessing && (
                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                                                <p className="text-white text-xs font-medium">Verifying...</p>
                                            </div>
                                        )}
                                        {!isScanning && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-body)]/50 backdrop-blur-sm z-10">
                                                <div className="w-20 h-20 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]/60 flex items-center justify-center mb-4 shadow-lg">
                                                    <CameraOff className="w-8 h-8 text-[var(--text-secondary)]/50" />
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)] mb-1">Camera is off</p>
                                                <p className="text-xs text-[var(--text-secondary)]/60">Tap below to start scanning</p>
                                            </div>
                                        )}
                                    </div>
                                    {!isScanning ? (
                                        <Button
                                            onClick={startCameraScanner}
                                            className="w-full h-12 rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-medium text-sm"
                                        >
                                            <Camera className="w-4 h-4 mr-2" />
                                            Start Camera
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={stopCameraScanner}
                                            variant="outline"
                                            className="w-full h-12 rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/5 font-medium text-sm"
                                        >
                                            <CameraOff className="w-4 h-4 mr-2" />
                                            Stop Camera
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Manual Mode */}
                            <div className={scanMode === 'manual' ? 'block' : 'hidden'}>
                                <div className="text-center py-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--accent))]/5 border border-[hsl(var(--accent))]/10 flex items-center justify-center mx-auto mb-3">
                                        <QrCode className="w-7 h-7 text-[hsl(var(--accent))]/70" />
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">Enter the 3-character entry code shown on the ticket</p>
                                </div>
                                <form onSubmit={handleManualSubmit} className="space-y-3">
                                    {/* Entry Code Input */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 block">Entry Code</label>
                                        <Input
                                            value={manualInput}
                                            onChange={(e) => setManualInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3))}
                                            placeholder="e.g. A3X"
                                            className="h-14 rounded-xl bg-[var(--bg-body)]/60 border-[var(--border-color)]/60 text-[var(--text-primary)] font-mono text-2xl text-center tracking-[0.3em] font-bold px-4"
                                            maxLength={3}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 py-1">
                                        <div className="flex-1 h-px bg-[var(--border-color)]/40" />
                                        <span className="text-[10px] text-[var(--text-secondary)]/60 uppercase">or paste full QR token</span>
                                        <div className="flex-1 h-px bg-[var(--border-color)]/40" />
                                    </div>

                                    {/* Full Token Input (fallback) */}
                                    <Input
                                        value={manualToken}
                                        onChange={(e) => setManualToken(e.target.value)}
                                        placeholder="Paste full QR token..."
                                        className="h-10 rounded-xl bg-[var(--bg-body)]/60 border-[var(--border-color)]/40 text-[var(--text-primary)] font-mono text-[10px] px-4 opacity-60 focus:opacity-100 transition-opacity"
                                    />

                                    <Button
                                        type="submit"
                                        disabled={(!manualInput.trim() && !manualToken.trim()) || isProcessing}
                                        className="w-full h-12 rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white font-medium text-sm disabled:opacity-40"
                                    >
                                        {isProcessing ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                        )}
                                        Verify
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Scan Result */}
                        <AnimatePresence mode="wait">
                            {scanResult && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className={`p-5 border-t ${scanResult.type === 'success'
                                        ? 'bg-green-500/5 border-green-500/20'
                                        : scanResult.type === 'warning'
                                            ? 'bg-yellow-500/5 border-yellow-500/20'
                                            : 'bg-red-500/5 border-red-500/20'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            {scanResult.type === 'success' ? (
                                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                </div>
                                            ) : scanResult.type === 'warning' ? (
                                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-[var(--text-primary)] text-base">{scanResult.title}</h4>
                                                <p className="text-sm text-[var(--text-secondary)] truncate">{scanResult.message}</p>
                                            </div>
                                        </div>
                                        {scanResult.ticket && (
                                            <div className="ml-[52px] flex gap-3 text-xs text-[var(--text-secondary)] mb-3">
                                                <span className="px-2 py-1 rounded-md bg-[var(--bg-body)]/60">Year {scanResult.ticket.year}</span>
                                                <span className="px-2 py-1 rounded-md bg-[var(--bg-body)]/60">{scanResult.ticket.eventTitle}</span>
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setScanResult(null)}
                                            className="ml-[52px] text-xs rounded-lg h-8"
                                        >
                                            <RotateCcw className="w-3 h-3 mr-1.5" />
                                            Scan Next
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Registrations panel */}
                {selectedEventId && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <div className="rounded-2xl bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--border-color)]/60 overflow-hidden">
                            {/* Collapsible header */}
                            <button
                                onClick={() => setShowRegistrations(!showRegistrations)}
                                className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-body)]/30 transition-colors"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Users className="w-4 h-4 text-[hsl(var(--accent))]" />
                                    <span className="font-semibold text-sm text-[var(--text-primary)]">
                                        Registrations
                                    </span>
                                    {eventData && (
                                        <Badge variant="outline" className="text-[10px] bg-[var(--bg-body)]/60 border-[var(--border-color)]/40">
                                            {eventData.totalTickets}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {showRegistrations && selectedEventId && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => { e.stopPropagation(); handleExportCSV(); }}
                                            className="text-[10px] h-7 px-2 text-[var(--text-secondary)]"
                                        >
                                            <Download className="w-3 h-3 mr-1" />
                                            CSV
                                        </Button>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${showRegistrations ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Collapsible content */}
                            <AnimatePresence>
                                {showRegistrations && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-[var(--border-color)]/40">
                                            {loadingEventData ? (
                                                <div className="flex justify-center py-10">
                                                    <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--accent))]" />
                                                </div>
                                            ) : eventData?.tickets.length === 0 ? (
                                                <div className="text-center py-10 text-[var(--text-secondary)]">
                                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                    <p className="text-xs">No registrations yet</p>
                                                </div>
                                            ) : (
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {eventData?.tickets.map((ticket, idx) => (
                                                        <div
                                                            key={ticket.id}
                                                            className={`flex items-center justify-between px-4 py-3 ${idx !== 0 ? 'border-t border-[var(--border-color)]/20' : ''
                                                                } hover:bg-[var(--bg-body)]/30 transition-colors`}
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                                                    {ticket.fullName}
                                                                </div>
                                                                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                                                                    {ticket.rollNumber} · Year {ticket.year}
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] shrink-0 ml-3 ${ticket.scanned
                                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                    : 'bg-[var(--bg-body)]/60 text-[var(--text-secondary)] border-[var(--border-color)]/40'
                                                                    }`}
                                                            >
                                                                {ticket.scanned ? '✓ Scanned' : 'Pending'}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* Bottom spacer for safe area */}
                <div className="h-6" />
            </div>
        </div>
    );
};

export default AdminScanQR;
